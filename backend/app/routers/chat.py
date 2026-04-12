# app/routers/chat.py

import uuid
from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.utils.gemini_service import chat_with_fd_saathi

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint for FD Saathi.
    Accepts user message + conversation history, returns AI response.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Convert history to the format our service expects
    history = [{"role": msg.role, "content": msg.content} for msg in request.history]

    result = chat_with_fd_saathi(
        user_message=request.message,
        history=history,
        booking_context=request.booking_context,
    )

    if result.get("error") and not result.get("response"):
        raise HTTPException(status_code=500, detail="AI service error")

    session_id = request.session_id or str(uuid.uuid4())

    return ChatResponse(
        response=result["response"],
        session_id=session_id,
    )


@router.get("/health")
async def chat_health():
    return {"status": "ok", "service": "FD Saathi Chat"}
