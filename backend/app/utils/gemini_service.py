# app/utils/gemini_service.py

import os

from dotenv import load_dotenv
from pathlib import Path

# ── Load .env — try both backend/.env AND project-root/.env ──────────────────
# Supports two common layouts:
#   Layout A:  FD-Saathi/backend/.env        ← most common when running from backend/
#   Layout B:  FD-Saathi/.env                ← project root
_this_file   = Path(__file__).resolve()          # backend/app/utils/gemini_service.py
_backend_dir = _this_file.parent.parent.parent   # backend/
_root_dir    = _backend_dir.parent               # FD-Saathi/

_env_loaded = False
for _env_path in [_backend_dir / ".env", _root_dir / ".env"]:
    if _env_path.exists():
        load_dotenv(_env_path, override=False)
        print(f"[gemini_service] Loaded .env from: {_env_path}")
        _env_loaded = True
        break

if not _env_loaded:
    print(f"[gemini_service] WARNING: No .env file found. Checked:\n"
          f"  {_backend_dir / '.env'}\n  {_root_dir / '.env'}")

# ── Validate API key immediately so the error is obvious in terminal ──────────
_GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
if not _GEMINI_API_KEY:
    print(
        "\n[gemini_service] ❌ GEMINI_API_KEY is not set!\n"
        "  Fix: Add  GEMINI_API_KEY=AIza...  to your .env file\n"
        "  Get a key at: https://aistudio.google.com/app/apikey\n"
    )
else:
    print(f"[gemini_service] ✅ GEMINI_API_KEY loaded (ends with ...{_GEMINI_API_KEY[-6:]})")

import re
import json
import time
import logging
import google.generativeai as genai
from app.data.fd_data import FD_BANKS, JARGON_DICT
from app.utils.calculator import calculate_maturity, format_inr, compare_rates_for_tenure

logger = logging.getLogger(__name__)

# ─── Model config ─────────────────────────────────────────────────────────────
# gemini-1.5-flash: 1,500 req/day free  (vs 20/day for gemini-2.5-flash)
# gemini-1.5-flash-8b: 4,000 req/day free (lighter, still very capable)
PRIMARY_MODEL   = "gemini-1.5-flash"
FALLBACK_MODEL  = "gemini-2.5-flash"

# Retry settings
MAX_RETRIES     = 2
BASE_BACKOFF    = 2   # seconds — doubles on each retry

# Configure Gemini — uses key loaded above
genai.configure(api_key=_GEMINI_API_KEY)


# ─── System Prompt ────────────────────────────────────────────────────────────

def _build_system_prompt() -> str:
    """Build the system prompt. Called once at module load — result is cached."""
    bank_summary = []
    for bank in FD_BANKS:
        rates_str = ", ".join([f"{r['tenure_label']}: {r['rate']}%" for r in bank["rates"]])
        bank_summary.append(
            f"- {bank['name']} ({bank['name_hindi']}): {rates_str} | "
            f"Min: ₹{bank['min_amount']} | DICGC: {'✓' if bank['dicgc_insured'] else '✗'}"
        )

    jargon_str = [
        f"  '{term}': {expl['hindi']}"
        for term, expl in JARGON_DICT.items()
    ]

    return f"""You are FD Saathi (एफडी साथी), a warm FD advisor for India. Speak user's language exactly: Hindi→Hindi, English→English, Bhojpuri→Bhojpuri (रउआ/बा/हई), Awadhi→Awadhi. Never use jargon without explaining. Keep replies SHORT (3-4 sentences max). End with one follow-up question.

BANKS (DICGC insured, use only these rates):
{chr(10).join(bank_summary)}

JARGON:
{chr(10).join(jargon_str)}

RULES: Only FD advice. DICGC covers ₹5L per bank. Never dismiss small amounts."""

# ── Cache the prompt once at module load (saves ~900 tokens of rebuild per request) ──
_SYSTEM_PROMPT = _build_system_prompt()
print(f"[gemini_service] System prompt cached ({len(_SYSTEM_PROMPT)} chars, "
      f"~{len(_SYSTEM_PROMPT)//4} tokens)")


# ─── Helpers ──────────────────────────────────────────────────────────────────

import re as _re

# Strip [LANGUAGE: ...] prefix that the frontend may inject into user messages.
# These should never appear in the conversation history sent to Gemini, as they
# add noise that confuses the model and can cause API errors on subsequent turns.
def _strip_language_prefix(text: str) -> str:
    return _re.sub(r'^\[LANGUAGE:[^\]]*\]\n?', '', text, flags=_re.IGNORECASE).strip()


def format_history_for_gemini(history: list[dict]) -> list[dict]:
    """Convert our history format to Gemini's expected format."""
    formatted = []
    for msg in history:
        content = _strip_language_prefix(msg.get("content", ""))
        if not content:
            continue  # skip empty messages to avoid Gemini validation errors
        formatted.append({
            "role": "user" if msg["role"] == "user" else "model",
            "parts": [{"text": content}],
        })
    # Gemini requires history to start with a 'user' turn and alternate strictly.
    # Drop leading non-user turns if any exist.
    while formatted and formatted[0]["role"] != "user":
        formatted.pop(0)
    return formatted


def _extract_retry_delay(error_str: str) -> float:
    """
    Parse the retry_delay seconds from a 429 error message.
    Returns a float (seconds) or BASE_BACKOFF if not found.
    """
    match = re.search(r'retry_delay\s*\{\s*seconds:\s*(\d+)', error_str)
    if match:
        return float(match.group(1)) + 1.0   # +1s safety buffer
    return float(BASE_BACKOFF)


def _is_rate_limit(error: Exception) -> bool:
    return "429" in str(error) or "quota" in str(error).lower() or "rate" in str(error).lower()


def _call_model(model_name: str, system_prompt: str, history: list[dict], message: str) -> str:
    """Single attempt to call the Gemini API."""
    model = genai.GenerativeModel(
        model_name=model_name,
        system_instruction=system_prompt,
    )
    chat = model.start_chat(history=history)
    response = chat.send_message(message)
    return response.text


# ─── Main Chat Function ───────────────────────────────────────────────────────

def chat_with_fd_saathi(
    user_message: str,
    history: list[dict],
    booking_context: dict | None = None,
) -> dict:
    # Use the module-level cached prompt — never rebuild per request
    system_prompt  = _SYSTEM_PROMPT
    gemini_history = format_history_for_gemini(history)

    # Strip the [LANGUAGE: ...] prefix from the live message too — the language
    # instruction is already handled by the system prompt's language detection.
    # Keeping it in the user message causes Gemini to sometimes echo it back.
    # Keep the [LANGUAGE:...] prefix in the message — it tells Gemini which language to respond in
    # Only strip it from history (done in format_history_for_gemini) to keep history clean
    enriched_message = user_message  # send as-is with language instruction intact
    clean_message = _strip_language_prefix(user_message)  # used only for booking context

    # Build enriched message
    if booking_context:
        enriched_message = (
            f"[SYSTEM CONTEXT - not visible to user]\n"
            f"Current booking state: {json.dumps(booking_context, ensure_ascii=False)}\n"
            f"[END SYSTEM CONTEXT]\n\nUser message: {user_message}"
    )

    # Try primary model with retries, then fallback model
    models_to_try = [PRIMARY_MODEL, FALLBACK_MODEL]

    for model_name in models_to_try:
        last_error = None
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                text = _call_model(model_name, system_prompt, gemini_history, enriched_message)
                if attempt > 1 or model_name != PRIMARY_MODEL:
                    logger.info("Succeeded on model=%s attempt=%d", model_name, attempt)
                return {"response": text, "error": None}

            except Exception as e:
                last_error = e
                error_str  = str(e)

                if _is_rate_limit(e):
                    if attempt < MAX_RETRIES:
                        delay = _extract_retry_delay(error_str)
                        logger.warning(
                            "Rate limit on model=%s attempt=%d. Retrying in %.1fs...",
                            model_name, attempt, delay,
                        )
                        time.sleep(delay)
                        continue
                    else:
                        # Exhausted retries for this model — try next
                        logger.warning(
                            "Rate limit exhausted for model=%s after %d attempts. "
                            "Switching model...", model_name, MAX_RETRIES,
                        )
                        break
                else:
                    # Non-rate-limit error — print so it's visible in uvicorn terminal
                    logger.error("Gemini error (model=%s): %s", model_name, error_str)
                    print(f"\n[gemini_service] ❌ ERROR model={model_name}: {type(e).__name__}: {error_str}\n")
                    return {
                        "response": (
                            "माफ करें, अभी कुछ तकनीकी दिक्कत आ गई। "
                            "थोड़ी देर बाद कोशिश करें। 🙏"
                        ),
                        "error": error_str,
                    }

    # All models exhausted
    logger.error("All models exhausted. Last error: %s", str(last_error))
    return {
        "response": (
            "माफ करें, अभी बहुत ज़्यादा लोग सेवा का उपयोग कर रहे हैं। "
            "कृपया 1-2 मिनट बाद दोबारा कोशिश करें। 🙏"
        ),
        "error": str(last_error),
    }


# ─── Structured FD recommendation ────────────────────────────────────────────

def get_fd_recommendation_data(principal: float, tenure_months: int) -> dict:
    """Get structured comparison data for frontend cards."""
    comparisons = compare_rates_for_tenure(FD_BANKS, tenure_months)

    results = []
    for bank_rate in comparisons[:5]:
        calc = calculate_maturity(principal, bank_rate["rate"], tenure_months)
        results.append({
            **bank_rate,
            "maturity_amount":    calc["maturity_amount"],
            "maturity_formatted": format_inr(calc["maturity_amount"]),
            "interest_earned":    calc["interest_earned"],
            "interest_formatted": format_inr(calc["interest_earned"]),
            "principal_formatted":format_inr(principal),
        })

    return {
        "principal":      principal,
        "tenure_months":  tenure_months,
        "banks":          results,
    }
