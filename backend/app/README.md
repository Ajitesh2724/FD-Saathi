# FD Saathi — Backend

Multilingual Fixed Deposit Advisor API for Gorakhpur & UP.
Built with FastAPI + Google Gemini (free tier).

---

## Quick Start (Local)

### 1. Get your FREE Gemini API Key
Go to → https://aistudio.google.com/app/apikey
Click **"Create API Key"** → Copy it

### 2. Setup environment
```bash
cd fd-advisor-backend
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the server
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. Test it
Open → http://localhost:8000/docs (Swagger UI)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Main chat with FD Saathi |
| GET | `/api/fd/banks` | List all banks with rates |
| POST | `/api/fd/calculate` | Calculate FD maturity |
| POST | `/api/fd/recommend` | Get bank recommendations |
| POST | `/api/fd/book` | Mock FD booking |
| GET | `/api/fd/jargon` | Jargon dictionary |

---

## Chat API Usage

```json
POST /api/chat
{
  "message": "Suryoday Bank mein 8.50% matlab kya hota hai?",
  "history": [],
  "session_id": "optional-uuid"
}
```

Response:
```json
{
  "response": "8.50% p.a. का मतलब है कि आपके हर ₹100 पर साल में ₹8.50 मिलेंगे...",
  "session_id": "uuid"
}
```

---

## Deploy FREE on Render.com

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add env var: `GEMINI_API_KEY` = your key
7. Select **Free plan** → Deploy

Your backend will be live at: `https://fd-saathi-backend.onrender.com`

---

## Project Structure

```
fd-advisor-backend/
├── app/
│   ├── main.py              # FastAPI app + CORS
│   ├── models.py            # Pydantic request/response models
│   ├── routers/
│   │   ├── chat.py          # /api/chat endpoint
│   │   └── fd.py            # /api/fd/* endpoints
│   ├── data/
│   │   └── fd_data.py       # Bank rates + jargon dictionary
│   └── utils/
│       ├── gemini_service.py # Gemini AI integration
│       └── calculator.py     # FD maturity calculator
├── requirements.txt
├── render.yaml              # Render.com deploy config
└── .env.example
```
