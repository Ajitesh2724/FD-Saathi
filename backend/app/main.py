# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import chat, fd

load_dotenv()

app = FastAPI(
    title="FD Saathi API",
    description="Vernacular Fixed Deposit Advisor — Multilingual chat API",
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
# Allow all origins in dev. For production: restrict to your frontend URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",          # for local development
        "https://fd-saathi.vercel.app",   # your Vercel URL (update after deploy)
        "https://*.vercel.app",           # covers all Vercel preview URLs
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(chat.router)
app.include_router(fd.router)


# ─── Root ─────────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "name": "FD Saathi API",
        "version": "1.0.0",
        "tagline": "Gorakhpur ka apna FD advisor",
        "endpoints": {
            "chat": "/api/chat",
            "banks": "/api/fd/banks",
            "calculate": "/api/fd/calculate",
            "recommend": "/api/fd/recommend",
            "book": "/api/fd/book",
            "jargon": "/api/fd/jargon",
            "docs": "/docs",
        },
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "fd-saathi-backend"}
