import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat, loadPersistedLanguage } from '../hooks/useChat';
import LanguageToggle from './LanguageToggle';
import BookingFlow from './BookingFlow';
import DemoMode from './DemoMode';
import PortfolioTracker from './PortfolioTracker';
import BranchFinder from './BranchFinder';
import TDSCalculator from './TDSCalculator';
import { SUGGESTIONS, formatINR } from '../utils/formatters';

// ── BANK DATA ─────────────────────────────────────────────────────────────────
const BANK_CATEGORIES = [
  {
    key: 'sfb',
    label: { hindi: 'स्मॉल फाइनेंस बैंक', english: 'Small Finance Banks', bhojpuri: 'स्मॉल फाइनेंस बैंक', awadhi: 'स्मॉल फाइनेंस बैंक' },
    banks: [
      { nameHindi: 'सूर्योदय SFB', nameEnglish: 'Suryoday SFB', rate: 7.90 },
      { nameHindi: 'यूनिटी SFB',   nameEnglish: 'Unity SFB',    rate: 7.85 },
      { nameHindi: 'जना SFB',       nameEnglish: 'Jana SFB',     rate: 7.77 },
      { nameHindi: 'उज्जीवन SFB',  nameEnglish: 'Ujjivan SFB',  rate: 7.45 },
      { nameHindi: 'AU SFB',        nameEnglish: 'AU SFB',       rate: 7.25 },
      { nameHindi: 'उत्कर्ष SFB',  nameEnglish: 'Utkarsh SFB',  rate: 7.25 },
      { nameHindi: 'इक्विटास SFB', nameEnglish: 'Equitas SFB',  rate: 7.00 },
      { nameHindi: 'ESAF SFB',      nameEnglish: 'ESAF SFB',     rate: 6.00 },
    ],
  },
  {
    key: 'private',
    label: { hindi: 'प्राइवेट बैंक', english: 'Private Banks', bhojpuri: 'प्राइवेट बैंक', awadhi: 'प्राइवेट बैंक' },
    banks: [
      { nameHindi: 'बंधन बैंक',     nameEnglish: 'Bandhan Bank',   rate: 7.25 },
      { nameHindi: 'RBL बैंक',      nameEnglish: 'RBL Bank',       rate: 7.20 },
      { nameHindi: 'यस बैंक',       nameEnglish: 'Yes Bank',       rate: 7.00 },
      { nameHindi: 'इंडसइंड बैंक', nameEnglish: 'IndusInd Bank',  rate: 6.75 },
      { nameHindi: 'कोटक बैंक',    nameEnglish: 'Kotak Bank',     rate: 6.70 },
      { nameHindi: 'फेडरल बैंक',   nameEnglish: 'Federal Bank',   rate: 6.60 },
      { nameHindi: 'IDFC फर्स्ट',  nameEnglish: 'IDFC First',     rate: 6.50 },
      { nameHindi: 'HDFC बैंक',    nameEnglish: 'HDFC Bank',      rate: 6.50 },
      { nameHindi: 'ICICI बैंक',   nameEnglish: 'ICICI Bank',     rate: 6.50 },
      { nameHindi: 'एक्सिस बैंक',  nameEnglish: 'Axis Bank',      rate: 6.45 },
    ],
  },
  {
    key: 'govt',
    label: { hindi: 'सरकारी बैंक', english: 'Public Sector Banks', bhojpuri: 'सरकारी बैंक', awadhi: 'सरकारी बैंक' },
    banks: [
      { nameHindi: 'यूनियन बैंक',     nameEnglish: 'Union Bank',     rate: 6.60 },
      { nameHindi: 'केनरा बैंक',      nameEnglish: 'Canara Bank',    rate: 6.60 },
      { nameHindi: 'स्टेट बैंक',      nameEnglish: 'SBI',            rate: 6.30 },
      { nameHindi: 'IDBI बैंक',       nameEnglish: 'IDBI Bank',      rate: 6.30 },
      { nameHindi: 'पंजाब नेशनल',     nameEnglish: 'PNB',            rate: 6.25 },
      { nameHindi: 'बैंक ऑफ बड़ौदा', nameEnglish: 'Bank of Baroda', rate: 6.25 },
    ],
  },
  {
    key: 'other',
    label: { hindi: 'अन्य बैंक', english: 'Other Banks', bhojpuri: 'अन्य बैंक', awadhi: 'अन्य बैंक' },
    banks: [
      { nameHindi: 'DCB बैंक',     nameEnglish: 'DCB Bank',     rate: 7.25 },
      { nameHindi: 'CSB बैंक',     nameEnglish: 'CSB Bank',     rate: 6.75 },
      { nameHindi: 'करूर वैश्य',   nameEnglish: 'Karur Vysya',  rate: 6.75 },
      { nameHindi: 'साउथ इंडियन',  nameEnglish: 'South Indian', rate: 6.50 },
    ],
  },
];

const TOP3 = [
  { nameHindi: 'सूर्योदय SFB', nameEnglish: 'Suryoday SFB', rate: 7.90, rank: '#1', color: '#fbbf24' },
  { nameHindi: 'यूनिटी SFB',   nameEnglish: 'Unity SFB',    rate: 7.85, rank: '#2', color: '#94a3b8' },
  { nameHindi: 'जना SFB',       nameEnglish: 'Jana SFB',     rate: 7.77, rank: '#3', color: '#cd7c3a' },
];

const TICKER_BANKS = BANK_CATEGORIES.flatMap(c => c.banks);

// ── UI TEXT ───────────────────────────────────────────────────────────────────
const UI_TEXT = {
  hindi: {
    title: 'एफडी साथी', sub: 'आपका FD सलाहकार • भारत',
    newChat: 'नया चैट', bookFD: 'FD बुक करें',
    placeholder: 'अपना सवाल यहाँ लिखें...',
    online: 'ऑनलाइन', demo: 'डेमो', portfolio: 'पोर्टफोलियो',
    branch: 'शाखा खोजें', tds: 'TDS', calcTitle: 'त्वरित कैलकुलेटर',
    top3: 'टॉप 3 बेस्ट बैंक', allRates: 'सभी बैंक दरें',
    amount: 'राशि', tenure: 'अवधि', senior: 'वरिष्ठ नागरिक',
    invested: 'निवेश', interest: 'ब्याज',
    trust1: '100% सुरक्षित', trust1d: 'DICGC ₹5L गारंटी',
    trust2: 'RBI मान्यता',   trust2d: 'सरकार regulated',
    trust3: 'बेस्ट रेट्स',  trust3d: '7.90% तक p.a.',
    trust4: 'तुरंत बुकिंग', trust4d: '3 आसान चरण',
    listening: 'सुन रहा हूँ...',
    tabCalc: '🧮 कैलकुलेटर', tabLadder: '🪜 लैडरिंग',
    ladderTitle: 'FD लैडरिंग प्लानर',
    ladderDesc: 'पैसा कई FD में बाँटें — हर कुछ महीनों में पैसा वापस मिलता रहेगा',
    ladderTotal: 'कुल राशि', ladderSlices: 'FD की संख्या',
    ladderSlice: 'हिस्सा', ladderEach: 'प्रत्येक FD', ladderRate: 'दर',
    ladderMatures: 'परिपक्वता', ladderNextIn: 'महीने में',
    ladderSummary: 'लैडर सारांश', ladderTotalInterest: 'कुल ब्याज',
    ladderAvgRate: 'औसत दर', ladderLiquidity: 'हर कुछ महीनों में नकदी',
    ladderTip: '💡 लैडरिंग से हर कुछ महीनों में पैसा मिलता है और बेहतर दर पर दोबारा निवेश का मौका भी मिलता है।',
  },
  english: {
    title: 'FD Saathi', sub: 'Your FD Advisor • Pan India',
    newChat: 'New Chat', bookFD: 'Book FD',
    placeholder: 'Type your question here...',
    online: 'Online', demo: 'Demo', portfolio: 'Portfolio',
    branch: 'Find Branch', tds: 'TDS', calcTitle: 'Quick Calculator',
    top3: 'Top 3 Best Banks', allRates: 'All Bank Rates',
    amount: 'Amount', tenure: 'Tenure', senior: 'Senior Citizen',
    invested: 'Invested', interest: 'Interest',
    trust1: '100% Safe',     trust1d: 'DICGC ₹5L guarantee',
    trust2: 'RBI Licensed',  trust2d: 'Govt. regulated',
    trust3: 'Best Rates',    trust3d: 'Up to 7.90% p.a.',
    trust4: 'Instant Book',  trust4d: '3 easy steps',
    listening: 'Listening...',
    tabCalc: '🧮 Calculator', tabLadder: '🪜 Laddering',
    ladderTitle: 'FD Laddering Planner',
    ladderDesc: 'Split your money across FDs — get cash back at regular intervals',
    ladderTotal: 'Total Amount', ladderSlices: 'Number of FDs',
    ladderSlice: 'Tranche', ladderEach: 'Per FD', ladderRate: 'Rate',
    ladderMatures: 'Matures', ladderNextIn: 'months',
    ladderSummary: 'Ladder Summary', ladderTotalInterest: 'Total Interest',
    ladderAvgRate: 'Avg Rate', ladderLiquidity: 'Cash every few months',
    ladderTip: '💡 Laddering gives you regular liquidity and lets you reinvest at better rates as they change.',
  },
  bhojpuri: {
    title: 'एफडी साथी', sub: 'रउआ के FD सलाहकार • भारत',
    newChat: 'नया बात', bookFD: 'FD बुक करीं',
    placeholder: 'आपन सवाल इहाँ लिखीं...',
    online: 'ऑनलाइन', demo: 'डेमो', portfolio: 'पोर्टफोलियो',
    branch: 'शाखा खोजीं', tds: 'TDS', calcTitle: 'जल्दी कैलकुलेटर',
    top3: 'टॉप 3 बेस्ट बैंक', allRates: 'सभी बैंक दर',
    amount: 'रकम', tenure: 'समय', senior: 'बुजुर्ग नागरिक',
    invested: 'लगाईल', interest: 'ब्याज',
    trust1: '100% सुरक्षित', trust1d: 'DICGC ₹5L गारंटी',
    trust2: 'RBI मान्यता',   trust2d: 'सरकार regulated',
    trust3: 'बेस्ट रेट्स',  trust3d: '7.90% तक p.a.',
    trust4: 'तुरंत बुकिंग', trust4d: '3 आसान चरण',
    listening: 'सुन रहल बानी...',
    tabCalc: '🧮 कैलकुलेटर', tabLadder: '🪜 लैडरिंग',
    ladderTitle: 'FD लैडरिंग प्लानर',
    ladderDesc: 'पईसा कई FD में बाँटीं — हर कुछ महीना में पईसा वापस मिलत रही',
    ladderTotal: 'कुल रकम', ladderSlices: 'FD के गिनती',
    ladderSlice: 'हिस्सा', ladderEach: 'हर FD', ladderRate: 'दर',
    ladderMatures: 'परिपक्वता', ladderNextIn: 'महीना में',
    ladderSummary: 'लैडर सारांश', ladderTotalInterest: 'कुल ब्याज',
    ladderAvgRate: 'औसत दर', ladderLiquidity: 'हर कुछ महीना में पईसा',
    ladderTip: '💡 लैडरिंग से हर कुछ महीना में पईसा मिलत बा।',
  },
  awadhi: {
    title: 'एफडी साथी', sub: 'आपका FD सलाहकार • भारत',
    newChat: 'नई बात', bookFD: 'FD बुक करें',
    placeholder: 'आपन सवाल इहाँ लिखें...',
    online: 'ऑनलाइन', demo: 'डेमो', portfolio: 'पोर्टफोलियो',
    branch: 'शाखा खोजें', tds: 'TDS', calcTitle: 'जल्दी कैलकुलेटर',
    top3: 'टॉप 3 बेस्ट बैंक', allRates: 'सभी बैंक दर',
    amount: 'रकम', tenure: 'समय', senior: 'वरिष्ठ नागरिक',
    invested: 'लगाया', interest: 'ब्याज',
    trust1: '100% सुरक्षित', trust1d: 'DICGC ₹5L गारंटी',
    trust2: 'RBI मान्यता',   trust2d: 'सरकार regulated',
    trust3: 'बेस्ट रेट्स',  trust3d: '7.90% तक p.a.',
    trust4: 'तुरंत बुकिंग', trust4d: '3 आसान चरण',
    listening: 'सुन रहा हूँ...',
    tabCalc: '🧮 कैलकुलेटर', tabLadder: '🪜 लैडरिंग',
    ladderTitle: 'FD लैडरिंग प्लानर',
    ladderDesc: 'पैसा कई FD में बाँटें — हर कुछ महीने में पैसा वापस मिलत रही',
    ladderTotal: 'कुल राशि', ladderSlices: 'FD की संख्या',
    ladderSlice: 'हिस्सा', ladderEach: 'प्रत्येक FD', ladderRate: 'दर',
    ladderMatures: 'परिपक्वता', ladderNextIn: 'महीने में',
    ladderSummary: 'लैडर सारांश', ladderTotalInterest: 'कुल ब्याज',
    ladderAvgRate: 'औसत दर', ladderLiquidity: 'हर कुछ महीने में नकदी',
    ladderTip: '💡 लैडरिंग से हर कुछ महीने में पैसा मिलत है।',
  },
};

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; height: 100%; overflow: hidden; background: #060c06; }
  body { font-family: 'DM Sans','Noto Sans Devanagari',sans-serif; -webkit-font-smoothing: antialiased; }

  @keyframes bounce   { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
  @keyframes ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes msgIn    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse    { 0%,100%{box-shadow:0 0 0 3px rgba(239,68,68,0.2)} 50%{box-shadow:0 0 0 7px rgba(239,68,68,0.06)} }
  @keyframes soundwave{ from{height:3px;opacity:0.3} to{height:14px;opacity:1} }
  @keyframes glow     { 0%,100%{opacity:0.5} 50%{opacity:1} }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(74,222,128,0.25); border-radius: 2px; }

  textarea:focus { outline: none; }

  input[type=range] { -webkit-appearance:none; width:100%; height:4px; background:rgba(74,222,128,0.15); border-radius:2px; cursor:pointer; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; background:#4ade80; border-radius:50%; cursor:pointer; box-shadow:0 0 8px rgba(74,222,128,0.5); }

  .glass { background:rgba(255,255,255,0.03); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(74,222,128,0.1); border-radius:14px; }
  .glass-glow { background:rgba(255,255,255,0.03); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(74,222,128,0.25); border-radius:14px; box-shadow:0 0 24px rgba(74,222,128,0.06); }

  .tenure-btn { flex:1; padding:6px 2px; font-size:10px; border-radius:7px; cursor:pointer; border:1px solid rgba(74,222,128,0.15); background:transparent; color:rgba(255,255,255,0.35); font-family:inherit; transition:all 0.15s; }
  .tenure-btn.active { border-color:rgba(74,222,128,0.5); background:rgba(74,222,128,0.14); color:#4ade80; font-weight:700; }

  .suggestion-btn { flex-shrink:0; padding:7px 13px; background:rgba(74,222,128,0.06); border:1px solid rgba(74,222,128,0.18); border-radius:20px; cursor:pointer; font-size:12px; color:rgba(74,222,128,0.75); white-space:nowrap; font-family:inherit; transition:all 0.15s; }
  .suggestion-btn:hover { background:rgba(74,222,128,0.13); color:#4ade80; border-color:rgba(74,222,128,0.35); }

  .book-btn { width:100%; padding:13px; background:linear-gradient(135deg,#14532d,#16a34a); color:white; border:1px solid rgba(74,222,128,0.35); border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; letter-spacing:0.3px; font-family:inherit; box-shadow:0 4px 20px rgba(74,222,128,0.12); transition:all 0.2s; }
  .book-btn:hover { box-shadow:0 6px 28px rgba(74,222,128,0.24); transform:translateY(-1px); }

  .dropdown-trigger { width:100%; display:flex; justify-content:space-between; align-items:center; padding:9px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(74,222,128,0.1); border-radius:10px; cursor:pointer; font-size:12px; font-weight:600; color:rgba(255,255,255,0.55); font-family:inherit; transition:all 0.18s; }
  .dropdown-trigger.open { border-color:rgba(74,222,128,0.3); background:rgba(74,222,128,0.07); color:#4ade80; border-radius:10px 10px 0 0; }

  .nav-btn { display:flex; align-items:center; gap:7px; padding:9px 14px; border-radius:10px; cursor:pointer; font-size:12px; font-weight:600; font-family:inherit; letter-spacing:0.3px; white-space:nowrap; transition:all 0.2s; }
`;

// ── RENDER MARKDOWN BOLD ──────────────────────────────────────────────────────
const renderContent = (text) => {
  const parts = text.split('**');
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: '#4ade80', fontWeight: '700' }}>{part}</strong>
      : part
  );
};

// ── PARTICLE CANVAS ───────────────────────────────────────────────────────────
const ParticleCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.3 + 0.08,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,222,128,${p.o})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

// ── RATE TICKER ───────────────────────────────────────────────────────────────
const RateTicker = ({ language }) => (
  <div style={{ overflow: 'hidden', background: 'rgba(74,222,128,0.05)', borderTop: '1px solid rgba(74,222,128,0.08)', padding: '8px 0', flexShrink: 0 }}>
    <div style={{ display: 'flex', gap: '32px', animation: 'ticker 45s linear infinite', whiteSpace: 'nowrap', alignItems: 'center' }}>
      {[...TICKER_BANKS, ...TICKER_BANKS].map((b, i) => (
        <span key={i} style={{ fontSize: '13px', color: 'rgba(74,222,128,0.7)', flexShrink: 0, letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>▸</span>
          <span>{language === 'english' ? b.nameEnglish : b.nameHindi}</span>
          <strong style={{ color: '#4ade80', fontSize: '14px' }}>{b.rate}%</strong>
        </span>
      ))}
    </div>
  </div>
);

// ── TYPING INDICATOR ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#14532d,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', border: '1px solid rgba(74,222,128,0.3)' }}>🏦</div>
    <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', padding: '11px 15px', borderRadius: '16px 16px 16px 4px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '5px', alignItems: 'center' }}>
      {[0,1,2].map(i => <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
    </div>
  </div>
);

// ── MESSAGE BUBBLE ────────────────────────────────────────────────────────────
const MsgBubble = ({ message }) => {
  const isUser = message.role === 'user';

  // Safely format timestamp — works whether it's a Date or an ISO string
  const timeStr = (() => {
    try {
      const d = message.timestamp instanceof Date
        ? message.timestamp
        : new Date(message.timestamp);
      if (isNaN(d)) return '';
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  })();

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '12px', animation: 'msgIn 0.22s ease' }}>
      {!isUser && (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, marginRight: '8px', marginTop: '3px', background: 'linear-gradient(135deg,#14532d,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', border: '1px solid rgba(74,222,128,0.3)' }}>🏦</div>
      )}
      <div style={{ maxWidth: '76%', padding: '11px 15px', borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isUser ? 'linear-gradient(135deg,#14532d,#16a34a)' : 'rgba(255,255,255,0.05)', backdropFilter: isUser ? 'none' : 'blur(10px)', color: isUser ? '#fff' : 'rgba(255,255,255,0.82)', fontSize: '14px', lineHeight: '1.65', border: isUser ? '1px solid rgba(74,222,128,0.35)' : '1px solid rgba(255,255,255,0.07)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxShadow: isUser ? '0 4px 16px rgba(74,222,128,0.1)' : 'none' }}>
        {renderContent(message.content)}
        <div style={{ fontSize: '10px', opacity: 0.4, marginTop: '4px', textAlign: isUser ? 'right' : 'left', letterSpacing: '0.3px' }}>
          {timeStr}
        </div>
      </div>
    </div>
  );
};

// ── BANK DROPDOWN ─────────────────────────────────────────────────────────────
const BankDropdown = ({ category, language, principal, tenure, selectedBank, onSelectBank }) => {
  const [open, setOpen] = useState(false);
  const label = category.label[language] || category.label.hindi;
  const sorted = [...category.banks].sort((a, b) => b.rate - a.rate);
  const getName = b => language === 'english' ? b.nameEnglish : b.nameHindi;
  return (
    <div style={{ marginBottom: '6px' }}>
      <button className={`dropdown-trigger${open ? ' open' : ''}`} onClick={() => setOpen(!open)}>
        <span>{label}</span>
        <span style={{ fontSize: '9px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', color: '#4ade80' }}>▼</span>
      </button>
      {open && (
        <div style={{ border: '1px solid rgba(74,222,128,0.2)', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden', background: 'rgba(6,12,6,0.85)', backdropFilter: 'blur(12px)' }}>
          {sorted.map((bank, i) => {
            const mat = Math.round(principal * Math.pow(1 + bank.rate/400, (tenure/12)*4));
            return (
              <div
                key={i}
                onClick={() => onSelectBank && onSelectBank(bank)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 12px',
                  borderBottom: i < sorted.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: selectedBank?.nameEnglish === bank.nameEnglish
                    ? 'rgba(74,222,128,0.12)'
                    : i===0 ? 'rgba(74,222,128,0.05)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  borderLeft: selectedBank?.nameEnglish === bank.nameEnglish
                    ? '2px solid #4ade80' : '2px solid transparent',
                }}
              >
                <div>
                  {i===0 && <span style={{ fontSize: '9px', background: 'rgba(74,222,128,0.2)', color: '#4ade80', padding: '1px 5px', borderRadius: '4px', marginBottom: '2px', display: 'inline-block' }}>Best</span>}
                  <div style={{ fontSize: '12px', fontWeight: i===0 ? '600' : '400', color: i===0 ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.48)' }}>{getName(bank)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#4ade80' }}>{bank.rate}%</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{formatINR(mat)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


// ── LADDER PLANNER ────────────────────────────────────────────────────────────
// Full sorted bank pool — all available banks by rate desc
const ALL_LADDER_BANKS = [
  { nameHindi: 'सूर्योदय SFB', nameEnglish: 'Suryoday SFB',  rate: 7.90 },
  { nameHindi: 'यूनिटी SFB',   nameEnglish: 'Unity SFB',     rate: 7.85 },
  { nameHindi: 'जना SFB',       nameEnglish: 'Jana SFB',      rate: 7.77 },
  { nameHindi: 'उज्जीवन SFB',  nameEnglish: 'Ujjivan SFB',   rate: 7.45 },
  { nameHindi: 'DCB बैंक',      nameEnglish: 'DCB Bank',      rate: 7.25 },
  { nameHindi: 'AU SFB',        nameEnglish: 'AU SFB',        rate: 7.25 },
  { nameHindi: 'उत्कर्ष SFB',  nameEnglish: 'Utkarsh SFB',   rate: 7.25 },
  { nameHindi: 'बंधन बैंक',     nameEnglish: 'Bandhan Bank',  rate: 7.25 },
  { nameHindi: 'RBL बैंक',      nameEnglish: 'RBL Bank',      rate: 7.20 },
  { nameHindi: 'यस बैंक',       nameEnglish: 'Yes Bank',      rate: 7.00 },
  { nameHindi: 'इक्विटास SFB', nameEnglish: 'Equitas SFB',   rate: 7.00 },
  { nameHindi: 'इंडसइंड बैंक', nameEnglish: 'IndusInd Bank', rate: 6.75 },
  { nameHindi: 'कोटक बैंक',    nameEnglish: 'Kotak Bank',    rate: 6.70 },
  { nameHindi: 'फेडरल बैंक',   nameEnglish: 'Federal Bank',  rate: 6.60 },
  { nameHindi: 'HDFC बैंक',    nameEnglish: 'HDFC Bank',     rate: 6.50 },
  { nameHindi: 'ICICI बैंक',   nameEnglish: 'ICICI Bank',    rate: 6.50 },
  { nameHindi: 'SBI',           nameEnglish: 'SBI',           rate: 6.30 },
];

const LADDER_SCHEMES = [
  { slices: 2, tenures: [6, 12]           },
  { slices: 3, tenures: [6, 12, 18]       },
  { slices: 4, tenures: [6, 12, 18, 24]   },
  { slices: 5, tenures: [6, 12, 18, 24, 36] },
];

const calcMat = (p, r, m) => Math.round(p * Math.pow(1 + r / 400, (m / 12) * 4));

// Laddering explainer text per language
const LADDER_EXPLAINER = {
  hindi: {
    heading: 'FD लैडरिंग क्या है?',
    lines: [
      '🪜 लैडरिंग मतलब — अपना पैसा एक साथ एक ही FD में न लगाएं।',
      '📅 बजाय इसके, उसे 2-5 अलग-अलग FD में बाँटें जो अलग-अलग समय पर परिपक्व हों।',
      '💧 फायदा: हर कुछ महीनों में पैसा वापस मिलता रहता है — इमरजेंसी में काम आता है।',
      '📈 और जब दर बढ़े, तो मिले हुए पैसे को नई ऊँची दर पर दोबारा लगा सकते हैं।',
    ],
  },
  english: {
    heading: 'What is FD Laddering?',
    lines: [
      '🪜 Laddering means — don\'t put all your money in one FD at once.',
      '📅 Instead, split it into 2-5 FDs that mature at different times.',
      '💧 Benefit: You get cash back every few months — handy for emergencies.',
      '📈 And when rates rise, you can reinvest matured money at a higher rate.',
    ],
  },
  bhojpuri: {
    heading: 'FD लैडरिंग का मतलब का बा?',
    lines: [
      '🪜 लैडरिंग माने — सगरो पईसा एकहि FD में एक्के बेर मत लगाईं।',
      '📅 बजाय ओकरे, 2-5 अलग FD में बाँटीं जे अलग-अलग समय पर मिली।',
      '💧 फायदा: हर कुछ महीना में पईसा वापस मिलत रही — इमरजेंसी में काम आई।',
      '📈 आ जब दर बढ़े, त मिलल पईसा नई ऊँची दर पर दोबारा लगाईं।',
    ],
  },
  awadhi: {
    heading: 'FD लैडरिंग का मतलब का होत है?',
    lines: [
      '🪜 लैडरिंग माने — सब पैसा एक्कहि FD में एक्के बार मत लगाएं।',
      '📅 बजाय ओके, 2-5 अलग FD में बाँटें जे अलग-अलग समय पर मिलत होय।',
      '💧 फायदा: हर कुछ महीने में पैसा वापस मिलत रही — इमरजेंसी में काम आत है।',
      '📈 आ जब दर बढ़े, त मिलल पैसे नई ऊँची दर पर दोबारा लगाएं।',
    ],
  },
};

const LadderPlanner = ({ language }) => {
  const t          = UI_TEXT[language] || UI_TEXT.hindi;
  const explainer  = LADDER_EXPLAINER[language] || LADDER_EXPLAINER.hindi;
  const getName    = b => language === 'english' ? b.nameEnglish : b.nameHindi;

  const [total, setTotal]         = useState(100000);
  const [schemeIdx, setSchemeIdx] = useState(1);           // default 3 FDs
  const [showExplainer, setShowExplainer] = useState(true); // collapsible explainer
  // Per-tranche bank overrides — key = tranche index, value = bank object
  const [bankOverrides, setBankOverrides] = useState({});
  // Which tranche's bank picker is open
  const [openPicker, setOpenPicker] = useState(null);

  const scheme = LADDER_SCHEMES[schemeIdx];
  const perFD  = Math.floor(total / scheme.slices / 100) * 100;

  // Auto-suggest top N banks for the chosen scheme count
  const suggestedBanks = ALL_LADDER_BANKS.slice(0, scheme.slices);

  const tranches = scheme.tenures.map((months, i) => {
    const bank     = bankOverrides[i] ?? suggestedBanks[i];
    const maturity = calcMat(perFD, bank.rate, months);
    return { months, bank, principal: perFD, maturity, interest: maturity - perFD };
  });

  // Reset overrides when scheme changes
  const handleSchemeChange = (idx) => {
    setSchemeIdx(idx);
    setBankOverrides({});
    setOpenPicker(null);
  };

  const totalMaturity  = tranches.reduce((s, tr) => s + tr.maturity, 0);
  const totalInterest  = totalMaturity - total;
  const avgRate        = (tranches.reduce((s, tr) => s + tr.bank.rate, 0) / tranches.length).toFixed(2);
  const shortestTenure = Math.min(...scheme.tenures);
  const maxMonths      = Math.max(...scheme.tenures);
  const barColors      = ['#4ade80', '#34d399', '#6ee7b7', '#a7f3d0', '#86efac'];

  const labelStyle = {
    fontSize: '12px', color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase', letterSpacing: '0.7px',
  };

  return (
    <div>

      {/* ── EXPLAINER (collapsible) ── */}
      <div style={{ marginBottom: '16px', background: 'rgba(74,222,128,0.05)', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.15)', overflow: 'hidden' }}>
        <button
          onClick={() => setShowExplainer(v => !v)}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#4ade80' }}>💡 {explainer.heading}</span>
          <span style={{ fontSize: '12px', color: 'rgba(74,222,128,0.6)', transition: 'transform 0.2s', transform: showExplainer ? 'rotate(180deg)' : 'none' }}>▼</span>
        </button>
        {showExplainer && (
          <div style={{ padding: '0 14px 13px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {explainer.lines.map((line, i) => (
              <div key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{line}</div>
            ))}
          </div>
        )}
      </div>

      {/* ── TOTAL AMOUNT ── */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
          <span style={labelStyle}>{t.ladderTotal}</span>
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>{formatINR(total)}</span>
        </div>
        <input type="range" min="10000" max="1000000" step="5000" value={total}
          onChange={e => setTotal(Number(e.target.value))} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '3px' }}>
          <span>₹10K</span><span>₹10L</span>
        </div>
      </div>

      {/* ── SCHEME SELECTOR ── */}
      <div style={{ marginBottom: '18px' }}>
        <span style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>{t.ladderSlices}</span>
        <div style={{ display: 'flex', gap: '5px' }}>
          {LADDER_SCHEMES.map((s, i) => (
            <button key={i} onClick={() => handleSchemeChange(i)}
              className={`tenure-btn${schemeIdx === i ? ' active' : ''}`}
              style={{ flex: 1, fontSize: '12px', padding: '8px 2px' }}>
              {s.slices} FD
            </button>
          ))}
        </div>
      </div>

      {/* ── TRANCHE CARDS with inline bank picker ── */}
      <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tranches.map((tr, i) => {
          const isCustom  = !!bankOverrides[i];
          const isOpen    = openPicker === i;
          const color     = barColors[i];
          const barWidth  = Math.round((tr.months / maxMonths) * 100);

          return (
            <div key={i} style={{ borderRadius: '12px', overflow: 'visible', border: `1px solid ${color}35`, background: 'rgba(0,0,0,0.28)' }}>

              {/* Card top row */}
              <div style={{ padding: '11px 13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Color dot + index */}
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${color}22`, border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: color }}>{i + 1}</span>
                </div>

                {/* Bank name + tenure */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.88)' }}>{getName(tr.bank)}</span>
                    {isCustom && (
                      <span style={{ fontSize: '9px', background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '4px', padding: '1px 5px' }}>
                        {language === 'english' ? 'Custom' : 'बदला'}
                      </span>
                    )}
                    {!isCustom && (
                      <span style={{ fontSize: '9px', background: `${color}18`, color: color, border: `1px solid ${color}40`, borderRadius: '4px', padding: '1px 5px' }}>
                        {language === 'english' ? '⭐ Suggested' : '⭐ सुझाव'}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>
                    {tr.bank.rate}% • {tr.months}{language === 'english' ? 'M tenure' : ' महीने'}
                  </div>
                </div>

                {/* Maturity + change button */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: color, fontVariantNumeric: 'tabular-nums' }}>{formatINR(tr.maturity)}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontVariantNumeric: 'tabular-nums' }}>+{formatINR(tr.interest)}</div>
                </div>

                {/* Toggle picker */}
                <button
                  onClick={() => setOpenPicker(isOpen ? null : i)}
                  style={{ width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0, background: isOpen ? `${color}25` : 'rgba(255,255,255,0.06)', border: `1px solid ${isOpen ? color : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isOpen ? color : 'rgba(255,255,255,0.4)', transition: 'all 0.15s' }}
                  title={language === 'english' ? 'Change bank' : 'बैंक बदलें'}
                >
                  ✏️
                </button>
              </div>

              {/* Tenure progress bar */}
              <div style={{ margin: '0 13px 11px', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${barWidth}%`, background: `linear-gradient(90deg,${color},${color}88)`, borderRadius: '3px', transition: 'width 0.4s ease' }} />
              </div>

              {/* Bank picker dropdown */}
              {isOpen && (
                <div style={{ margin: '0 8px 10px', background: 'rgba(6,12,6,0.95)', border: `1px solid ${color}40`, borderRadius: '10px', overflow: 'hidden', maxHeight: '200px', overflowY: 'auto' }}>
                  <div style={{ padding: '8px 10px', fontSize: '10px', color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                    {language === 'english' ? 'Select bank for this FD' : 'इस FD के लिए बैंक चुनें'}
                  </div>
                  {ALL_LADDER_BANKS.map((bank, bi) => {
                    const isSelected = (bankOverrides[i] ?? suggestedBanks[i])?.nameEnglish === bank.nameEnglish;
                    const isSugg     = bi < scheme.slices;
                    return (
                      <div
                        key={bi}
                        onClick={() => { setBankOverrides(prev => ({ ...prev, [i]: bank })); setOpenPicker(null); }}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', cursor: 'pointer', background: isSelected ? `${color}18` : 'transparent', borderLeft: isSelected ? `2px solid ${color}` : '2px solid transparent', transition: 'background 0.12s' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          {isSugg && !isSelected && (
                            <span style={{ fontSize: '8px', color: color, background: `${color}18`, border: `1px solid ${color}40`, borderRadius: '3px', padding: '1px 4px', flexShrink: 0 }}>⭐</span>
                          )}
                          <span style={{ fontSize: '12px', fontWeight: isSelected ? '700' : '400', color: isSelected ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.55)' }}>{getName(bank)}</span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: color }}>{bank.rate}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── VISUAL TIMELINE ── */}
      <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(74,222,128,0.08)' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {language === 'english' ? '⏳ Maturity Timeline' : '⏳ परिपक्वता टाइमलाइन'}
        </div>
        {tranches.map((tr, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < tranches.length - 1 ? '7px' : 0 }}>
            <span style={{ fontSize: '10px', color: barColors[i], fontWeight: '700', width: '16px', flexShrink: 0 }}>{i + 1}</span>
            <div style={{ flex: 1, height: '22px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: '100%', width: `${Math.round((tr.months / maxMonths) * 100)}%`, background: `linear-gradient(90deg,${barColors[i]},${barColors[i]}88)`, borderRadius: '5px', display: 'flex', alignItems: 'center', paddingLeft: '7px', minWidth: '40px', transition: 'width 0.4s' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#030c03' }}>{tr.months}M</span>
              </div>
              <span style={{ position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums' }}>{formatINR(tr.maturity)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── SUMMARY CARD ── */}
      <div style={{ background: 'linear-gradient(135deg,rgba(20,83,45,0.9),rgba(22,163,74,0.5))', borderRadius: '13px', padding: '14px', border: '1px solid rgba(74,222,128,0.28)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.55)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
          📊 {t.ladderSummary}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            { label: t.ladderTotalInterest, value: '+' + formatINR(totalInterest), color: '#4ade80' },
            { label: t.ladderAvgRate,        value: avgRate + '%',                  color: '#a7f3d0' },
            { label: t.ladderLiquidity,      value: shortestTenure + 'M',           color: '#fbbf24' },
          ].map(item => (
            <div key={item.label} style={{ background: 'rgba(0,0,0,0.28)', borderRadius: '9px', padding: '10px 8px' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', lineHeight: 1.3 }}>{item.label}</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: item.color, fontVariantNumeric: 'tabular-nums' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── SIDEBAR PANEL ─────────────────────────────────────────────────────────────
const SidebarPanel = ({ language, onBook, onTDS }) => {
  const [principal, setPrincipal]       = useState(50000);
  const [tenure, setTenure]             = useState(12);
  const [senior, setSenior]             = useState(false);
  const [selectedBank, setSelectedBank] = useState({ nameHindi: 'सूर्योदय SFB', nameEnglish: 'Suryoday SFB', rate: 7.90 });
  const [sideTab, setSideTab]           = useState('calc'); // 'calc' | 'ladder'

  const t    = UI_TEXT[language] || UI_TEXT.hindi;
  const rate = selectedBank.rate + (senior ? 0.5 : 0);
  const mat  = Math.round(principal * Math.pow(1 + rate/400, (tenure/12)*4));
  const int_ = mat - principal;
  const getName = b => language === 'english' ? b.nameEnglish : b.nameHindi;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '8px' }}>

      {/* 1. CALCULATOR + LADDER TOGGLE */}
      <div className="glass-glow" style={{ padding: '18px' }}>
        {/* Tab toggle */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '3px', marginBottom: '16px', gap: '2px' }}>
          {['calc', 'ladder'].map(tab => (
            <button key={tab} onClick={() => setSideTab(tab)} style={{
              flex: 1, padding: '7px 4px', borderRadius: '7px', border: 'none', cursor: 'pointer',
              background: sideTab === tab ? 'rgba(74,222,128,0.18)' : 'transparent',
              color: sideTab === tab ? '#4ade80' : 'rgba(255,255,255,0.35)',
              fontSize: '11px', fontWeight: sideTab === tab ? '700' : '400',
              fontFamily: 'inherit', transition: 'all 0.18s',
              boxShadow: sideTab === tab ? 'inset 0 0 0 1px rgba(74,222,128,0.3)' : 'none',
            }}>
              {tab === 'calc' ? t.tabCalc : t.tabLadder}
            </button>
          ))}
        </div>

        {sideTab === 'calc' && <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.4px' }}>
            {t.calcTitle}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(74,222,128,0.7)', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '6px', padding: '3px 8px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {getName(selectedBank)}
          </div>
        </div>

        {/* Amount */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: '600' }}>{t.amount}</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>{formatINR(principal)}</span>
          </div>
          <input type="range" min="1000" max="500000" step="1000" value={principal} onChange={e => setPrincipal(Number(e.target.value))} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>
            <span>₹1K</span><span>₹5L</span>
          </div>
        </div>

        {/* Tenure */}
        <div style={{ marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>{t.tenure}</span>
          <div style={{ display: 'flex', gap: '5px' }}>
            {[6,12,24,36,60].map(m => (
              <button key={m} className={`tenure-btn${tenure===m?' active':''}`} onClick={() => setTenure(m)}>
                {m < 12 ? `${m}M` : `${m/12}Y`}
              </button>
            ))}
          </div>
        </div>

        {/* Senior toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>👴 {t.senior} +0.5%</span>
          <div onClick={() => setSenior(!senior)} style={{ width: '36px', height: '20px', borderRadius: '10px', cursor: 'pointer', position: 'relative', background: senior ? 'rgba(74,222,128,0.35)' : 'rgba(255,255,255,0.08)', border: `1px solid rgba(74,222,128,${senior?'0.5':'0.15'})`, transition: 'all 0.2s' }}>
            <div style={{ position: 'absolute', top: '2px', left: senior ? '18px' : '2px', width: '14px', height: '14px', borderRadius: '50%', background: senior ? '#4ade80' : 'rgba(255,255,255,0.35)', transition: 'all 0.2s' }} />
          </div>
        </div>

        {/* Result card */}
        <div style={{ background: 'linear-gradient(135deg,rgba(20,83,45,0.9),rgba(22,163,74,0.55))', borderRadius: '12px', padding: '14px', border: '1px solid rgba(74,222,128,0.2)' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', letterSpacing: '0.3px', fontWeight: '500' }}>
            {getName(selectedBank)} • {rate}% p.a. • {tenure < 12 ? `${tenure}M` : `${tenure/12}Y`}
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff', marginBottom: '10px', letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>
            {formatINR(mat)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '8px 10px', fontSize: '11px' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' ,marginBottom: '2px' }}>{t.invested}</div>
              <div style={{ fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>{formatINR(principal)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'rgba(255,255,255,0.6)',fontSize: '12px', marginBottom: '2px' }}>{t.interest}</div>
              <div style={{ fontWeight: '700', color: '#4ade80' }}>+{formatINR(int_)}</div>
            </div>
          </div>
        </div>
        </>}

        {sideTab === 'ladder' && <LadderPlanner language={language} />}
      </div>

      {/* 2. TOP 3 BANKS */}
      <div className="glass" style={{ padding: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#4ade80', marginBottom: '12px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>🏆 {t.top3}</div>
        {TOP3.map((bank, i) => {
          const m = Math.round(principal * Math.pow(1 + bank.rate/400, (tenure/12)*4));
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', marginBottom: i < 2 ? '6px' : 0, background: i===0 ? 'rgba(74,222,128,0.07)' : 'rgba(255,255,255,0.02)', borderRadius: '10px', border: `1px solid rgba(74,222,128,${i===0?'0.2':'0.06'})` }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', color: bank.color, marginBottom: '2px' }}>{bank.rank}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: i===0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)' }}>{getName(bank)}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)' }}>DICGC ✓</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>{bank.rate}%</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', fontVariantNumeric: 'tabular-nums' }}>{formatINR(m)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. ALL BANK RATES */}
      <div className="glass" style={{ padding: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#4ade80', marginBottom: '12px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>📊 {t.allRates}</div>
        {BANK_CATEGORIES.map(cat => (
          <BankDropdown
            key={cat.key}
            category={cat}
            language={language}
            principal={principal}
            tenure={tenure}
            selectedBank={selectedBank}
            onSelectBank={setSelectedBank}
          />
        ))}
      </div>

      {/* 4. TRUST BADGES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {[
          { icon: '🛡️', title: t.trust1, desc: t.trust1d },
          { icon: '🏛️', title: t.trust2, desc: t.trust2d },
          { icon: '📈', title: t.trust3, desc: t.trust3d },
          { icon: '⚡', title: t.trust4, desc: t.trust4d },
        ].map(b => (
          <div key={b.title} className="glass" style={{ padding: '12px' }}>
            <div style={{ fontSize: '18px', marginBottom: '5px' }}>{b.icon}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#4ade80', letterSpacing: '0.2px' }}>{b.title}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{b.desc}</div>
          </div>
        ))}
      </div>

      {/* CTA BUTTONS */}
      <button className="book-btn" onClick={onBook}>📋 {t.bookFD} →</button>

      {/* TDS Calculator button */}
      <button
        onClick={onTDS}
        style={{
          width: '100%', padding: '13px',
          background: 'rgba(251,191,36,0.08)',
          color: '#fbbf24',
          border: '1px solid rgba(251,191,36,0.3)',
          borderRadius: '12px', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'all 0.2s',
          letterSpacing: '0.3px',
        }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(251,191,36,0.15)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(251,191,36,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.background='rgba(251,191,36,0.08)'; e.currentTarget.style.boxShadow='none'; }}
      >
        🧾 {t.tds} {language === 'english' ? 'Calculator' : 'कैलकुलेटर'}
      </button>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const ChatWindow = () => {
  const [language, setLanguage]           = useState(() => loadPersistedLanguage());
  const [input, setInput]                 = useState('');
  const [showBooking, setShowBooking]     = useState(false);
  const [showDemo, setShowDemo]           = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showBranch, setShowBranch]       = useState(false);
  const [showTDS, setShowTDS]             = useState(false);
  const [isListening, setIsListening]     = useState(false);

  const bottomRef      = useRef(null);
  const inputRef       = useRef(null);
  const recognitionRef = useRef(null);
  // Track interim transcript separately so we can append finalized text cleanly
  const finalTranscriptRef = useRef('');

  const t = UI_TEXT[language] || UI_TEXT.hindi;
  const { messages, loading, sendUserMessage, clearChat, setMessages } = useChat(language);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    sendUserMessage(input, language);
    setInput('');
    inputRef.current?.focus();
  }, [input, language, sendUserMessage]);

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── VOICE INPUT (fixed) ────────────────────────────────────────────────────
  const VOICE_LANG = { hindi: 'hi-IN', english: 'en-IN', bhojpuri: 'hi-IN', awadhi: 'hi-IN' };

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Please use Chrome browser for voice input');
      return;
    }

    // Abort any existing session first
    stopListening();

    finalTranscriptRef.current = '';
    setInput('');

    const r = new SR();
    r.lang            = VOICE_LANG[language] || 'hi-IN';
    r.continuous      = true;
    r.interimResults  = true;

    r.onstart = () => setIsListening(true);

    r.onresult = (e) => {
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interimText += transcript;
        }
      }
      // Show finalized text + current interim in the textarea
      setInput((finalTranscriptRef.current + interimText).trim());
    };

    r.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      // If we captured something, focus the textarea so user can edit/send
      if (finalTranscriptRef.current.trim()) {
        setInput(finalTranscriptRef.current.trim());
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };

    r.onerror = (e) => {
      setIsListening(false);
      recognitionRef.current = null;
      if (e.error === 'not-allowed') {
        alert('Microphone permission required. Please allow microphone access in your browser.');
      } else if (e.error !== 'aborted') {
        // 'aborted' is expected when we call .stop() manually — don't alert for that
        console.warn('Speech recognition error:', e.error);
      }
    };

    recognitionRef.current = r;
    r.start();
  }, [language, stopListening]);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  // Nav button style helper
  const navStyle = (accent = false) => ({
    display: 'flex', alignItems: 'center', gap: '7px',
    padding: '9px 14px', borderRadius: '10px', cursor: 'pointer',
    border: accent ? '1px solid rgba(74,222,128,0.5)' : '1px solid rgba(255,255,255,0.15)',
    background: accent ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.07)',
    color: accent ? '#4ade80' : 'rgba(255,255,255,0.8)',
    fontSize: '12px', fontWeight: '600', fontFamily: 'inherit', letterSpacing: '0.3px',
    boxShadow: accent ? '0 0 16px rgba(74,222,128,0.1)' : 'none',
    transition: 'all 0.2s', whiteSpace: 'nowrap',
  });

  return (
    <>
      {/* Global CSS */}
      <style>{GLOBAL_STYLES}</style>

      {/* Floating particles */}
      <ParticleCanvas />

      {/* Ambient glow orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '45%', height: '55%', background: 'radial-gradient(ellipse,rgba(22,163,74,0.055) 0%,transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '40%', height: '50%', background: 'radial-gradient(ellipse,rgba(22,163,74,0.04) 0%,transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* Grid pattern overlay */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(74,222,128,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.025) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* ── ROOT LAYOUT ── */}
      <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#060c06', color: 'rgba(255,255,255,0.84)', fontFamily: "'DM Sans','Noto Sans Devanagari',sans-serif", zIndex: 1 }}>

        {/* ════ HEADER ════ */}
        <div style={{ flexShrink: 0, width: '100%', background: 'rgba(6,12,6,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(74,222,128,0.1)', zIndex: 20 }}>

          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0, background: 'linear-gradient(135deg,#14532d,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '1px solid rgba(74,222,128,0.3)', boxShadow: '0 0 18px rgba(74,222,128,0.14)' }}>🏦</div>
              <div>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '18px', color: '#fff', lineHeight: 1.2, letterSpacing: '0.2px' }}>{t.title}</div>
                <div style={{ fontSize: '11px', color: 'rgba(74,222,128,0.65)', letterSpacing: '0.7px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80', animation: 'glow 2s ease-in-out infinite' }} />
                  {t.online} • {t.sub}
                </div>
              </div>
            </div>

            {/* Nav buttons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button style={navStyle(true)} onClick={() => setShowDemo(true)}>
                <span style={{ fontSize: '15px' }}>🎬</span> {t.demo}
              </button>

              <button style={navStyle()} onClick={() => setShowPortfolio(true)}>
                <span style={{ fontSize: '15px' }}>📁</span> {t.portfolio}
              </button>

              <button style={navStyle()} onClick={() => setShowBranch(true)}>
                <span style={{ fontSize: '15px' }}>📍</span> {t.branch}
              </button>

              {/* ── TDS button in header ── */}
              <button
                style={{ ...navStyle(), background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}
                onClick={() => setShowTDS(true)}
              >
                <span style={{ fontSize: '15px' }}>🧾</span> {t.tds}
              </button>

              <button style={{ ...navStyle(), background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }} onClick={clearChat}>
                <span style={{ fontSize: '14px' }}>↺</span> {t.newChat}
              </button>
            </div>
          </div>

          {/* Language toggle */}
          <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Lang</span>
            <LanguageToggle selected={language} onChange={setLanguage} />
          </div>

          {/* Ticker */}
          <RateTicker language={language} />
        </div>

        {/* ════ BODY ════ */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

          {/* LEFT: CHAT 60% */}
          <div style={{ flex: '0 0 60%', minWidth: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(74,222,128,0.07)' }}>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 10px' }}>
              {messages.map(msg => <MsgBubble key={msg.id} message={msg} />)}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && !loading && (
              <div style={{ padding: '0 16px 10px', display: 'flex', gap: '7px', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
                {SUGGESTIONS[language]?.map(s => (
                  <button key={s} className="suggestion-btn" onClick={() => sendUserMessage(s, language)}>{s}</button>
                ))}
              </div>
            )}

            {/* Book FD button */}
            <div style={{ padding: '0 16px 10px', flexShrink: 0 }}>
              <button className="book-btn" style={{ width: '100%' }} onClick={() => setShowBooking(true)}>📋 {t.bookFD}</button>
            </div>

            {/* Listening indicator */}
            {isListening && (
              <div style={{ padding: '4px 16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexShrink: 0 }}>
                {[0,1,2,3,4].map(i => <div key={i} style={{ width: '3px', background: '#ef4444', borderRadius: '2px', animation: `soundwave 0.8s ease-in-out ${i*0.1}s infinite alternate`, height: '8px' }} />)}
                <span style={{ fontSize: '11px', color: '#ef4444', letterSpacing: '0.5px' }}>{t.listening}</span>
              </div>
            )}

            {/* Input row */}
            <div style={{ flexShrink: 0, padding: '8px 16px 14px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(74,222,128,0.07)', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <button
                onClick={isListening ? stopListening : startListening}
                title={isListening ? 'Stop recording' : 'Start voice input'}
                style={{ width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0, background: isListening ? 'rgba(239,68,68,0.14)' : 'rgba(74,222,128,0.09)', border: `1px solid ${isListening?'rgba(239,68,68,0.4)':'rgba(74,222,128,0.22)'}`, cursor: 'pointer', fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: isListening?'pulse 1s infinite':'none', transition: 'all 0.2s' }}
              >{isListening ? '⏹' : '🎤'}</button>

              <textarea
                ref={inputRef} value={input}
                onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                placeholder={isListening ? `🎤 ${t.listening}` : t.placeholder}
                rows={1}
                style={{ flex: 1, padding: '11px 15px', background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(74,222,128,${isListening?'0.4':'0.14'})`, borderRadius: '12px', fontSize: '14px', resize: 'none', fontFamily: "'DM Sans','Noto Sans Devanagari',sans-serif", lineHeight: '1.5', maxHeight: '80px', overflowY: 'auto', color: 'rgba(255,255,255,0.85)', outline: 'none', transition: 'border-color 0.2s' }}
              />

              <button
                onClick={handleSend} disabled={!input.trim() || loading}
                style={{ width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0, background: input.trim()?'linear-gradient(135deg,#14532d,#16a34a)':'rgba(255,255,255,0.05)', border: `1px solid ${input.trim()?'rgba(74,222,128,0.4)':'rgba(255,255,255,0.07)'}`, cursor: input.trim()?'pointer':'default', fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: input.trim()?'0 0 16px rgba(74,222,128,0.14)':'none' }}
              >{loading ? '⏳' : '➤'}</button>
            </div>
          </div>

          {/* RIGHT: SIDEBAR 40% */}
          <div style={{ flex: '0 0 40%', overflowY: 'auto', padding: '14px 12px', background: 'rgba(0,0,0,0.18)' }}>
            <SidebarPanel language={language} onBook={() => setShowBooking(true)} onTDS={() => setShowTDS(true)} />
          </div>

        </div>
        {/* ════ END BODY ════ */}

      </div>
      {/* ── END ROOT LAYOUT ── */}

      {/* ── MODALS ── */}
      {showBooking   && <BookingFlow      onClose={() => setShowBooking(false)}   onSendMessage={sendUserMessage} language={language} />}
      {showDemo      && <DemoMode         onClose={() => setShowDemo(false)}       onInjectMessages={setMessages} language={language} />}
      {showPortfolio && <PortfolioTracker onClose={() => setShowPortfolio(false)}  language={language} />}
      {showBranch    && <BranchFinder     onClose={() => setShowBranch(false)}     language={language} />}
      {showTDS       && <TDSCalculator    onClose={() => setShowTDS(false)}        language={language} />}
    </>
  );
};

export default ChatWindow;
