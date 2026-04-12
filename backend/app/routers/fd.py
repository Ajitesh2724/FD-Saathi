# app/routers/fd.py

import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from app.models import (
    FDCalculateRequest, FDCalculateResponse,
    FDRecommendRequest, BookingRequest, BookingResponse,
)
from app.data.fd_data import FD_BANKS, JARGON_DICT
from app.utils.calculator import calculate_maturity, format_inr, get_best_rate

router = APIRouter(prefix="/api/fd", tags=["fd"])


# ─── Bank Listing ─────────────────────────────────────────────────────────────

@router.get("/banks")
async def list_banks():
    """Return all available FD banks with their rates."""
    return {
        "banks": FD_BANKS,
        "total": len(FD_BANKS),
    }


@router.get("/banks/{bank_id}")
async def get_bank(bank_id: str):
    """Get a specific bank's details."""
    bank = next((b for b in FD_BANKS if b["id"] == bank_id), None)
    if not bank:
        raise HTTPException(status_code=404, detail="Bank not found")
    return bank


# ─── Calculator ───────────────────────────────────────────────────────────────

@router.post("/calculate", response_model=FDCalculateResponse)
async def calculate_fd(request: FDCalculateRequest):
    """Calculate FD maturity amount."""
    result = calculate_maturity(request.principal, request.annual_rate, request.tenure_months)
    return FDCalculateResponse(
        **result,
        principal_formatted=format_inr(result["principal"]),
        maturity_formatted=format_inr(result["maturity_amount"]),
        interest_formatted=format_inr(result["interest_earned"]),
    )


# ─── Recommendations ─────────────────────────────────────────────────────────

@router.post("/recommend")
async def recommend_fd(request: FDRecommendRequest):
    """Get top bank recommendations for given principal and tenure."""
    from app.utils.gemini_service import get_fd_recommendation_data
    data = get_fd_recommendation_data(request.principal, request.tenure_months)
    return data


# ─── Jargon Dictionary ────────────────────────────────────────────────────────

@router.get("/jargon")
async def get_jargon():
    """Return the full FD jargon dictionary."""
    return {"jargon": JARGON_DICT}


@router.get("/jargon/{term}")
async def get_term_explanation(term: str, lang: str = "hindi"):
    """Get explanation for a specific FD term in a given language."""
    term_data = JARGON_DICT.get(term)
    if not term_data:
        # Try case-insensitive match
        for key, val in JARGON_DICT.items():
            if key.lower() == term.lower():
                term_data = val
                term = key
                break

    if not term_data:
        raise HTTPException(status_code=404, detail=f"Term '{term}' not found in dictionary")

    lang = lang.lower()
    if lang not in term_data:
        lang = "hindi"

    return {
        "term": term,
        "language": lang,
        "explanation": term_data[lang],
        "available_languages": list(term_data.keys()),
    }


# ─── Booking (Mock) ───────────────────────────────────────────────────────────

@router.post("/book", response_model=BookingResponse)
async def book_fd(request: BookingRequest):
    """
    Mock FD booking endpoint.
    In production, this would integrate with actual bank APIs.
    For hackathon demo: generates a realistic booking confirmation.
    """
    # Find the bank
    bank = next((b for b in FD_BANKS if b["id"] == request.bank_id), None)
    if not bank:
        raise HTTPException(status_code=404, detail="Bank not found")

    # Find the rate for requested tenure
    rate_entry = next(
        (r for r in bank["rates"] if r["tenure_months"] == request.tenure_months),
        None
    )
    if not rate_entry:
        raise HTTPException(
            status_code=400,
            detail=f"Tenure {request.tenure_months} months not available for this bank"
        )

    # Validate minimum amount
    if request.principal < bank["min_amount"]:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum amount for this bank is ₹{bank['min_amount']}"
        )

    # Calculate maturity
    calc = calculate_maturity(request.principal, rate_entry["rate"], request.tenure_months)

    # Generate booking ID
    booking_id = f"FD{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:6].upper()}"

    # Maturity date
    maturity_date = datetime.now() + timedelta(days=request.tenure_months * 30)
    maturity_date_str = maturity_date.strftime("%d %B %Y")

    # Hindi confirmation message
    message_hindi = (
        f"बधाई हो! 🎉 आपकी FD बुक हो गई। "
        f"{bank['name_hindi']} में {format_inr(request.principal)} की FD {request.tenure_months} महीनों के लिए। "
        f"परिपक्वता तिथि: {maturity_date_str}। "
        f"परिपक्वता राशि: {format_inr(calc['maturity_amount'])}।"
    )

    return BookingResponse(
        booking_id=booking_id,
        bank_name=bank["name"],
        bank_name_hindi=bank["name_hindi"],
        principal=request.principal,
        principal_formatted=format_inr(request.principal),
        maturity_amount=calc["maturity_amount"],
        maturity_formatted=format_inr(calc["maturity_amount"]),
        interest_earned=calc["interest_earned"],
        interest_formatted=format_inr(calc["interest_earned"]),
        annual_rate=rate_entry["rate"],
        tenure_months=request.tenure_months,
        status="confirmed",
        message_hindi=message_hindi,
    )
