# app/models.py

from pydantic import BaseModel, Field
from typing import Optional


class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: list[Message] = Field(default_factory=list)
    booking_context: Optional[dict] = None
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    session_id: Optional[str] = None


class FDCalculateRequest(BaseModel):
    principal: float = Field(..., gt=0, le=10_000_000)
    annual_rate: float = Field(..., gt=0, le=20)
    tenure_months: int = Field(..., gt=0, le=120)


class FDCalculateResponse(BaseModel):
    principal: float
    maturity_amount: float
    interest_earned: float
    annual_rate: float
    tenure_months: int
    tenure_years: float
    principal_formatted: str
    maturity_formatted: str
    interest_formatted: str


class FDRecommendRequest(BaseModel):
    principal: float = Field(..., gt=0, le=10_000_000)
    tenure_months: int = Field(..., gt=0, le=120)


class BookingRequest(BaseModel):
    bank_id: str
    principal: float
    tenure_months: int
    user_name: Optional[str] = None
    mobile: Optional[str] = None


class BookingResponse(BaseModel):
    booking_id: str
    bank_name: str
    bank_name_hindi: str
    principal: float
    principal_formatted: str
    maturity_amount: float
    maturity_formatted: str
    interest_earned: float
    interest_formatted: str
    annual_rate: float
    tenure_months: int
    status: str
    message_hindi: str
