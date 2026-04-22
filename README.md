# 🏦 FD Saathi — एफडी साथी
### Your Vernacular Fixed Deposit Advisor for Bharat

Deployed Link: Live deployment link will be added here once deployed.

---

##  What is FD Saathi?

FD Saathi is an **AI-powered Fixed Deposit advisor** built for first-time and semi-urban investors across India — especially those who speak Hindi, Bhojpuri, or Awadhi and feel left out of formal financial tools.

Most FD apps talk in banking jargon. FD Saathi talks like a **knowledgeable friend from the neighbourhood** — in your language, at your level.

Built for a hackathon, designed for real-world use.

---

## ✨ Features

###  Multilingual AI Chat
Powered by Google Gemini 1.5 Flash. The AI detects whether you write in **Hindi, Bhojpuri, Awadhi, or English** and responds naturally in that exact dialect — no switching needed.

###  Voice Input
Speak your question in Hindi or English — the mic button transcribes your voice directly into the chat input using the browser's Speech Recognition API.

###  Smart FD Calculator
Interactive sidebar calculator with a **bank selector** — choose any bank from the full list and see live maturity calculations with senior citizen bonus support.

###  FD Laddering Planner
A first-of-its-kind feature for Indian retail investors. Split your total investment across 2-5 FDs with staggered maturities so you always have liquidity. Auto-suggests the top-N banks by rate, with a full bank picker so you can override any suggestion.

###  TDS Calculator
Know exactly how much tax will be deducted on your FD interest. Includes Form 15G/15H guidance, PAN card advice, and slab-based breakdowns — fully multilingual.

###  FD Portfolio Tracker
Add, track, and delete your real FDs. See a visual progress bar for each FD, days remaining to maturity, interest earned, and a mini bar chart comparing all your FDs.

###  Branch Finder
Find the nearest branch of any bank using live OpenStreetMap data. Includes helpline numbers, email, official branch locator links, and a full required-documents checklist for opening an FD.

###  Demo Mode
One-click demo that walks through a complete FD conversation so you can understand the product instantly without typing.

###  Live Rate Ticker
A scrolling ticker at the top shows real-time FD rates across all banks in the app.


###  DICGC Safety
Every recommendation reminds users that their deposits are insured up to ₹5 lakh under DICGC — a key trust signal for first-time investors.

---

##  Project Structure

```
FD-Saathi/
│
├── frontend/                        # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx       # Main UI — chat + sidebar + ladder planner
│   │   │   ├── BookingFlow.jsx      # FD booking modal
│   │   │   ├── BranchFinder.jsx     # Branch locator modal
│   │   │   ├── DemoMode.jsx         # Demo walkthrough modal
│   │   │   ├── FDCalculator.jsx     # Standalone FD calculator modal
│   │   │   ├── FDComparison.jsx     # Bank comparison card component
│   │   │   ├── LanguageToggle.jsx   # Hindi/English/Bhojpuri/Awadhi switcher
│   │   │   ├── MaturityCard.jsx     # Maturity result display card
│   │   │   ├── MessageBubble.jsx    # Chat message bubble
│   │   │   ├── PortfolioTracker.jsx # FD portfolio tracker modal
│   │   │   └── TDSCalculator.jsx    # TDS calculator modal
│   │   ├── hooks/
│   │   │   └── useChat.js           # Chat state + localStorage persistence
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── utils/
│   │   │   └── formatters.js        # INR formatter, tenure labels, language lists
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                         # FastAPI Python backend
│   ├── app/
│   │   ├── data/
│   │   │   └── fd_data.py           # Bank rates data + FD jargon dictionary
│   │   ├── routers/
│   │   │   ├── chat.py              # POST /api/chat endpoint
│   │   │   └── fd.py                # FD calculate, recommend, book endpoints
│   │   ├── utils/
│   │   │   ├── calculator.py        # Maturity calculation (quarterly compounding)
│   │   │   └── gemini_service.py    # Gemini AI integration + retry logic
│   │   ├── models.py                # Pydantic request/response models
│   │   └── main.py                  # FastAPI app + CORS config
│   ├── requirements.txt
│   └── .env                         # ← you create this (see Setup)
│
└── README.md
```

---

##  Local Setup

### Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Python | 3.11+ | [python.org](https://python.org) |
| Git | Any | [git-scm.com](https://git-scm.com) |

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fd-saathi.git
cd fd-saathi
```

---

### Step 2 — Get your Gemini API key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key — it starts with `AIza...`

> The free tier gives you **1,500 requests/day** on Gemini 1.5 Flash — more than enough for development and demo use.

---

### Step 3 — Set up the backend

```bash
cd backend

# Create a virtual environment
python -m venv .venv

# Activate it
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Now create your `.env` file inside the `backend/` folder:

```bash
# Create .env file
echo GEMINI_API_KEY=AIzaYOUR_KEY_HERE > .env
```

Or create it manually — make a file called `.env` inside `backend/` with this content:

```
GEMINI_API_KEY=AIzaYOUR_KEY_HERE
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
[gemini_service] ✅ GEMINI_API_KEY loaded (ends with ...XXXXXX)
```

Test it by visiting [http://localhost:8000/health](http://localhost:8000/health) in your browser. You should see `{"status":"healthy"}`.

---

### Step 4 — Set up the frontend

Open a **new terminal** (keep the backend running):

```bash
cd frontend

# Install dependencies
npm install
```

Create a `.env` file inside `frontend/`:

```
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

Open [http://localhost:5173](http://localhost:5173) — FD Saathi should be running!

---

##  Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool + dev server |
| Axios | HTTP client for API calls |
| Web Speech API | Voice input (browser built-in) |
| OpenStreetMap / Nominatim | Branch finder geolocation |
| localStorage | Chat history + portfolio persistence |

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI | REST API framework |
| Google Gemini 1.5 Flash | AI chat responses |
| Pydantic | Request/response validation |
| python-dotenv | Environment variable loading |
| Uvicorn | ASGI server |

---

##  Supported Banks

FD Saathi covers **28+ banks** across all categories:

| Category | Banks |
|----------|-------|
| Small Finance Banks | Suryoday SFB (7.90%), Unity SFB (7.85%), Jana SFB (7.77%), Ujjivan SFB (7.45%), AU SFB (7.25%), Utkarsh SFB (7.25%), Equitas SFB (7.00%), ESAF SFB (6.00%) |
| Private Banks | Bandhan (7.25%), RBL (7.20%), Yes Bank (7.00%), IndusInd (6.75%), Kotak (6.70%), Federal (6.60%), IDFC First (6.50%), HDFC (6.50%), ICICI (6.50%), Axis (6.45%) |
| Public Sector Banks | Union Bank (6.60%), Canara (6.60%), SBI (6.30%), IDBI (6.30%), PNB (6.25%), Bank of Baroda (6.25%) |
| Others | DCB (7.25%), CSB (6.75%), Karur Vysya (6.75%), South Indian (6.50%) |

---

##  Languages Supported

| Language | Script | Region |
|----------|--------|--------|
| हिंदी (Hindi) | Devanagari | Pan India |
| English | Latin | Pan India |
| भोजपुरी (Bhojpuri) | Devanagari | Eastern UP, Bihar |
| अवधी (Awadhi) | Devanagari | Central UP |

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message, get AI response |
| `GET` | `/api/fd/banks` | List all banks with rates |
| `POST` | `/api/fd/calculate` | Calculate FD maturity |
| `POST` | `/api/fd/recommend` | Get top bank recommendations |
| `POST` | `/api/fd/book` | Book an FD (mock) |
| `GET` | `/api/fd/jargon` | FD jargon dictionary |
| `GET` | `/health` | Health check |
| `GET` | `/docs` | Auto-generated API docs (Swagger UI) |

---

##  Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Your Google Gemini API key from AI Studio |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ Yes | URL of your backend (local or deployed) |

---

##  Important Notes

**DICGC Insurance:** All banks listed in this app are DICGC-insured up to ₹5 lakh. This is real and verified. Users are always reminded of this.

**FD Rates:** Interest rates are hardcoded in `fd_data.py` and `ChatWindow.jsx`. They were accurate at the time of development. Update them periodically to keep the app current.

**Mock Booking:** The `/api/fd/book` endpoint is a mock — it generates a realistic booking confirmation but does not actually open an FD at any bank. This is a demo feature.

**Data Privacy:** No user data is sent to any server except the chat messages sent to the Gemini API. Portfolio and chat history are stored only in the user's browser via localStorage.

---

