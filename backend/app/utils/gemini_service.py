# app/utils/gemini_service.py

import os
import certifi
os.environ["GRPC_DEFAULT_SSL_ROOTS_FILE_PATH"] = certifi.where()
from dotenv import load_dotenv
from pathlib import Path

# Explicitly load .env from backend folder
load_dotenv(Path(__file__).parent.parent.parent / ".env")
import json
import google.generativeai as genai
from app.data.fd_data import FD_BANKS, JARGON_DICT
from app.utils.calculator import calculate_maturity, format_inr, compare_rates_for_tenure


# Configure Gemini on import
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# ─── System Prompt ────────────────────────────────────────────────────────────

def build_system_prompt() -> str:
    # Serialize bank data for context
    bank_summary = []
    for bank in FD_BANKS:
        rates_str = ", ".join([f"{r['tenure_label']}: {r['rate']}%" for r in bank["rates"]])
        bank_summary.append(f"- {bank['name']} ({bank['name_hindi']}): {rates_str} | Min: ₹{bank['min_amount']} | DICGC Insured: {'Yes' if bank['dicgc_insured'] else 'No'}")

    jargon_str = []
    for term, explanations in JARGON_DICT.items():
        jargon_str.append(f"  '{term}': Hindi → {explanations['hindi']}")

    return f"""You are 'FD Saathi' (एफडी साथी), a friendly and warm Fixed Deposit advisor for people in Gorakhpur and surrounding areas of Uttar Pradesh.

## YOUR PERSONA
- Name: FD Saathi (एफडी साथी)
- Tone: Like a trusted elder brother or a knowledgeable friend from the neighbourhood — never corporate, never condescending
- You speak the user's language. Detect whether they write in Hindi, Bhojpuri, or Awadhi and respond in EXACTLY that language/dialect
- If the user writes in English, respond in simple Hindi mixed with English (Hinglish)
- Always greet warmly on first message

## LANGUAGE RULES
- Hindi users → respond in clear, simple Hindi (Devanagari script)
- English users → respond in simple, friendly English avoiding complex jargon
- Bhojpuri users → respond in Bhojpuri dialect (use eastern UP phrasing: "रउआ", "बाड़ी", "बा", "हई", "कइसन")
- Awadhi users → respond in Awadhi (use: "आप", "हते", "रहे", "मिलत")
- NEVER use complex banking English without immediately explaining it in simple words
- Use local analogies: compare FD interest to "sabzi mandi mein munaafa", compare tenure to "fasal ka samay"

## GEOGRAPHIC SCOPE
- You serve users from ALL OVER INDIA
- You are familiar with banks and FD options available pan-India
- Adapt your examples and analogies to be relevant for any Indian user

## JARGON SIMPLIFICATION — USE THESE EXACT EXPLANATIONS
{chr(10).join(jargon_str)}

## FD BANK DATA (use this for all recommendations)
{chr(10).join(bank_summary)}

## DICGC INSURANCE — ALWAYS MENTION WHEN USER SEEMS WORRIED
All listed banks are DICGC insured up to ₹5 lakh. This means government guarantees the money even if the bank has any trouble.

## BOOKING FLOW — Guide users through these steps conversationally
When a user wants to book an FD, guide them step by step:
1. Ask how much money they want to invest (minimum ₹500–₹1000 depending on bank)
2. Ask for how long (show options: 6 months, 12 months, 24 months, 36 months)
3. Show top 3 bank recommendations with rates for their chosen tenure
4. Show the maturity calculation clearly: "Aapke ₹X pe ₹Y milenge (₹Z byaj ke saath)"
5. Ask them to confirm the bank selection
6. Generate a booking summary with all details

## RESPONSE FORMAT RULES
- Keep responses SHORT and conversational — max 4-5 sentences unless explaining something complex
- Use emojis sparingly to make it feel friendly: 💰 for money, ✅ for confirmation, 🏦 for bank, 📅 for time
- When showing bank comparisons, use a clean list format
- Always end with a helpful follow-up question to keep the conversation going
- If user asks about risks, ALWAYS reassure them about DICGC insurance

## WHAT YOU SHOULD NEVER DO
- Never recommend stocks, mutual funds, or other investments (stay focused on FD)
- Never make up interest rates — use only the data provided above
- Never use complex financial jargon without explaining it immediately
- Never be dismissive of small investment amounts (₹500 is as important as ₹5 lakh)

## SAMPLE OPENING (adapt to detected language)
Hindi: "नमस्ते! मैं एफडी साथी हूँ। आपका पैसा सुरक्षित तरीके से बढ़ाने में मदद करूँगा। बताइए, कितना पैसा FD में लगाना है? 💰"
English: "Hello! I'm FD Saathi, your personal Fixed Deposit advisor. I'll help you grow your money safely. How much would you like to invest in an FD? 💰"
Bhojpuri: "प्रणाम! हम एफडी साथी हईं। रउआ के पईसा सुरक्षित तरीके से बढ़ावे में मदद करब। बताईं, केतना पईसा FD में लगावे के बा? 💰"
Awadhi: "नमस्कार! मैं एफडी साथी हूँ। आपका पैसा बढ़ाने में मदद करूँगा। बताइए, कितना पैसा FD में लगाना है? 💰"
"""


# ─── Chat History Manager ─────────────────────────────────────────────────────

def format_history_for_gemini(history: list[dict]) -> list[dict]:
    """Convert our history format to Gemini's expected format."""
    gemini_history = []
    for msg in history:
        role = "user" if msg["role"] == "user" else "model"
        gemini_history.append({
            "role": role,
            "parts": [{"text": msg["content"]}]
        })
    return gemini_history


# ─── Main Chat Function ───────────────────────────────────────────────────────

def chat_with_fd_saathi(
    user_message: str,
    history: list[dict],
    booking_context: dict | None = None,
) -> dict:
    """
    Send a message to FD Saathi and get a response.

    Args:
        user_message: The user's current message
        history: List of previous messages [{"role": "user/assistant", "content": "..."}]
        booking_context: Optional dict with current booking state

    Returns:
        dict with 'response', 'detected_action', 'booking_state'
    """
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=build_system_prompt(),
        )

        # Build enriched message if booking context exists
        enriched_message = user_message
        if booking_context:
            enriched_message = f"""[SYSTEM CONTEXT - not visible to user]
Current booking state: {json.dumps(booking_context, ensure_ascii=False)}
[END SYSTEM CONTEXT]

User message: {user_message}"""

        # Start chat with history
        gemini_history = format_history_for_gemini(history)
        chat = model.start_chat(history=gemini_history)
        response = chat.send_message(enriched_message)

        return {
            "response": response.text,
            "error": None,
        }

    except Exception as e:
        return {
            "response": "माफ करें, अभी कुछ तकनीकी दिक्कत आ गई। थोड़ी देर बाद कोशिश करें। 🙏",
            "error": str(e),
        }


# ─── Structured FD recommendation ────────────────────────────────────────────

def get_fd_recommendation_data(principal: float, tenure_months: int) -> dict:
    """Get structured comparison data for frontend cards."""
    comparisons = compare_rates_for_tenure(FD_BANKS, tenure_months)

    results = []
    for bank_rate in comparisons[:5]:  # top 5
        calc = calculate_maturity(principal, bank_rate["rate"], tenure_months)
        results.append({
            **bank_rate,
            "maturity_amount": calc["maturity_amount"],
            "maturity_formatted": format_inr(calc["maturity_amount"]),
            "interest_earned": calc["interest_earned"],
            "interest_formatted": format_inr(calc["interest_earned"]),
            "principal_formatted": format_inr(principal),
        })

    return {
        "principal": principal,
        "tenure_months": tenure_months,
        "banks": results,
    }
