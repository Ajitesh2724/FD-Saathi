import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import LanguageToggle from './LanguageToggle';
import BookingFlow from './BookingFlow';
import FDCalculator from './FDCalculator';
import DemoMode from './DemoMode';
import BranchFinder from './BranchFinder';
import { SUGGESTIONS, formatINR } from '../utils/formatters';
import PortfolioTracker from './PortfolioTracker';

// ── BANK DATA BY CATEGORY ─────────────────────────────────────────────────────
const BANK_CATEGORIES = [
  {
    key: 'sfb',
    label: { hindi: 'स्मॉल फाइनेंस बैंक', english: 'Small Finance Banks', bhojpuri: 'स्मॉल फाइनेंस बैंक', awadhi: 'स्मॉल फाइनेंस बैंक' },
    banks: [
      { name: 'Suryoday SFB', nameHindi: 'सूर्योदय SFB', nameEnglish: 'Suryoday SFB', rate: 7.90 },
      { name: 'Unity SFB',    nameHindi: 'यूनिटी SFB',   nameEnglish: 'Unity SFB',    rate: 7.85 },
      { name: 'Jana SFB',     nameHindi: 'जना SFB',       nameEnglish: 'Jana SFB',     rate: 7.77 },
      { name: 'Ujjivan SFB',  nameHindi: 'उज्जीवन SFB',  nameEnglish: 'Ujjivan SFB',  rate: 7.45 },
      { name: 'AU SFB',       nameHindi: 'AU SFB',        nameEnglish: 'AU SFB',       rate: 7.25 },
      { name: 'Utkarsh SFB',  nameHindi: 'उत्कर्ष SFB',  nameEnglish: 'Utkarsh SFB',  rate: 7.25 },
      { name: 'Equitas SFB',  nameHindi: 'इक्विटास SFB', nameEnglish: 'Equitas SFB',  rate: 7.00 },
      { name: 'ESAF SFB',     nameHindi: 'ESAF SFB',      nameEnglish: 'ESAF SFB',     rate: 6.00 },
    ],
  },
  {
    key: 'private',
    label: { hindi: 'प्राइवेट बैंक', english: 'Private Banks', bhojpuri: 'प्राइवेट बैंक', awadhi: 'प्राइवेट बैंक' },
    banks: [
      { name: 'Bandhan Bank', nameHindi: 'बंधन बैंक',     nameEnglish: 'Bandhan Bank',  rate: 7.25 },
      { name: 'RBL Bank',     nameHindi: 'RBL बैंक',      nameEnglish: 'RBL Bank',      rate: 7.20 },
      { name: 'Yes Bank',     nameHindi: 'यस बैंक',       nameEnglish: 'Yes Bank',      rate: 7.00 },
      { name: 'IndusInd',     nameHindi: 'इंडसइंड बैंक', nameEnglish: 'IndusInd Bank',  rate: 6.75 },
      { name: 'Kotak Bank',   nameHindi: 'कोटक बैंक',    nameEnglish: 'Kotak Bank',     rate: 6.70 },
      { name: 'Federal Bank', nameHindi: 'फेडरल बैंक',   nameEnglish: 'Federal Bank',   rate: 6.60 },
      { name: 'IDFC First',   nameHindi: 'IDFC फर्स्ट',  nameEnglish: 'IDFC First Bank',rate: 6.50 },
      { name: 'HDFC Bank',    nameHindi: 'HDFC बैंक',    nameEnglish: 'HDFC Bank',      rate: 6.50 },
      { name: 'ICICI Bank',   nameHindi: 'ICICI बैंक',   nameEnglish: 'ICICI Bank',     rate: 6.50 },
      { name: 'Axis Bank',    nameHindi: 'एक्सिस बैंक',  nameEnglish: 'Axis Bank',      rate: 6.45 },
    ],
  },
  {
    key: 'govt',
    label: { hindi: 'सरकारी बैंक', english: 'Public Sector Banks', bhojpuri: 'सरकारी बैंक', awadhi: 'सरकारी बैंक' },
    banks: [
      { name: 'Union Bank',     nameHindi: 'यूनियन बैंक',      nameEnglish: 'Union Bank',     rate: 6.60 },
      { name: 'Canara Bank',    nameHindi: 'केनरा बैंक',       nameEnglish: 'Canara Bank',    rate: 6.60 },
      { name: 'SBI',            nameHindi: 'स्टेट बैंक',       nameEnglish: 'SBI',            rate: 6.30 },
      { name: 'IDBI Bank',      nameHindi: 'IDBI बैंक',        nameEnglish: 'IDBI Bank',      rate: 6.30 },
      { name: 'PNB',            nameHindi: 'पंजाब नेशनल',      nameEnglish: 'PNB',            rate: 6.25 },
      { name: 'Bank of Baroda', nameHindi: 'बैंक ऑफ बड़ौदा',  nameEnglish: 'Bank of Baroda', rate: 6.25 },
    ],
  },
  {
    key: 'other',
    label: { hindi: 'अन्य बैंक', english: 'Other Banks', bhojpuri: 'अन्य बैंक', awadhi: 'अन्य बैंक' },
    banks: [
      { name: 'DCB Bank',     nameHindi: 'DCB बैंक',     nameEnglish: 'DCB Bank',      rate: 7.25 },
      { name: 'CSB Bank',     nameHindi: 'CSB बैंक',     nameEnglish: 'CSB Bank',      rate: 6.75 },
      { name: 'Karur Vysya',  nameHindi: 'करूर वैश्य',   nameEnglish: 'Karur Vysya',   rate: 6.75 },
      { name: 'South Indian', nameHindi: 'साउथ इंडियन',  nameEnglish: 'South Indian',  rate: 6.50 },
    ],
  },
];

const TICKER_BANKS = BANK_CATEGORIES.flatMap((c) => c.banks);

const TOP3_BANKS = [
  { name: 'Suryoday SFB', nameHindi: 'सूर्योदय SFB', nameEnglish: 'Suryoday SFB', rate: 7.90, badge: '🏆 #1', color: '#f59e0b' },
  { name: 'Unity SFB',    nameHindi: 'यूनिटी SFB',   nameEnglish: 'Unity SFB',    rate: 7.85, badge: '🥈 #2', color: '#94a3b8' },
  { name: 'Jana SFB',     nameHindi: 'जना SFB',       nameEnglish: 'Jana SFB',     rate: 7.77, badge: '🥉 #3', color: '#b45309' },
];

// ── UI TEXT ───────────────────────────────────────────────────────────────────
const UI_TEXT = {
  hindi: {
    title: 'एफडी साथी', subtitle: 'आपका FD सलाहकार',
    newChat: 'नया चैट', bookFD: 'FD बुक करें',
    demo: '🎬 डेमो',
    newChat: 'नया चैट',
    portfolio: '📁 पोर्टफोलियो',
    branchFinder: '📍 शाखा खोजें',
    placeholder: 'अपना सवाल यहाँ लिखें...',
    online: '🟢 ऑनलाइन', voiceNote: '',
    calcTitle: 'त्वरित कैलकुलेटर',
    amount: 'राशि', tenure: 'समय', senior: 'वरिष्ठ नागरिक',
    invested: 'निवेश', interest: 'ब्याज',
    top3: 'टॉप 3 बेस्ट बैंक',
    allRates: 'सभी बैंक दरें',
    perYear: 'प्रति वर्ष',
    trust1Title: '100% सुरक्षित', trust1Desc: 'DICGC ₹5 लाख गारंटी',
    trust2Title: 'RBI लाइसेंस', trust2Desc: 'सरकार द्वारा मान्यता',
    trust3Title: 'बेस्ट रेट्स', trust3Desc: '7.90% तक प्रति वर्ष',
    trust4Title: 'तुरंत बुकिंग', trust4Desc: '3 आसान चरणों में',
  },
  english: {
    title: 'FD Saathi', subtitle: 'Your FD Advisor',
    newChat: 'New Chat', bookFD: 'Book FD',
    demo: '🎬 Demo',
    newChat: 'New Chat',
    portfolio: '📁 Portfolio',
    branchFinder: '📍 Find Branch',
    placeholder: 'Type your question here...',
    online: '🟢 Online', voiceNote: '',
    calcTitle: 'Quick Calculator',
    amount: 'Amount', tenure: 'Tenure', senior: 'Senior Citizen',
    invested: 'Invested', interest: 'Interest',
    top3: 'Top 3 Best Banks',
    allRates: 'All Bank Rates',
    perYear: 'per year',
    trust1Title: '100% Safe', trust1Desc: 'DICGC ₹5L guarantee',
    trust2Title: 'RBI Licensed', trust2Desc: 'Govt. regulated',
    trust3Title: 'Best Rates', trust3Desc: 'Up to 7.90% p.a.',
    trust4Title: 'Instant Book', trust4Desc: 'In 3 easy steps',
  },
  bhojpuri: {
    title: 'एफडी साथी', subtitle: 'रउआ के FD सलाहकार',
    newChat: 'नया बात', bookFD: 'FD बुक करीं',
    demo: '🎬 डेमो',
    newChat: 'नया बात',
    portfolio: '📁 पोर्टफोलियो',
    branchFinder: '📍 शाखा खोजीं',
    placeholder: 'आपन सवाल इहाँ लिखीं...',
    online: '🟢 ऑनलाइन', voiceNote: '🎤 हिंदी में बोलीं',
    calcTitle: 'जल्दी कैलकुलेटर',
    amount: 'रकम', tenure: 'समय', senior: 'बुजुर्ग नागरिक',
    invested: 'लगाईल', interest: 'ब्याज',
    top3: 'टॉप 3 बेस्ट बैंक',
    allRates: 'सभी बैंक दर',
    perYear: 'साल में',
    trust1Title: '100% सुरक्षित', trust1Desc: 'DICGC ₹5 लाख गारंटी',
    trust2Title: 'RBI लाइसेंस', trust2Desc: 'सरकार मान्यता प्राप्त',
    trust3Title: 'बेस्ट रेट्स', trust3Desc: '7.90% तक साल में',
    trust4Title: 'तुरंत बुकिंग', trust4Desc: '3 आसान चरण में',
  },
  awadhi: {
    title: 'एफडी साथी', subtitle: 'आपका FD सलाहकार',
    newChat: 'नई बात', bookFD: 'FD बुक करें',
    demo: '🎬 डेमो',
    newChat: 'नई बात',
    portfolio: '📁 पोर्टफोलियो',
    branchFinder: '📍 शाखा खोजें',
    placeholder: 'आपन सवाल इहाँ लिखें...',
    online: '🟢 ऑनलाइन', voiceNote: '🎤 हिंदी में बोलें',
    calcTitle: 'जल्दी कैलकुलेटर',
    amount: 'रकम', tenure: 'समय', senior: 'वरिष्ठ नागरिक',
    invested: 'लगाया', interest: 'ब्याज',
    top3: 'टॉप 3 बेस्ट बैंक',
    allRates: 'सभी बैंक दर',
    perYear: 'साल में',
    trust1Title: '100% सुरक्षित', trust1Desc: 'DICGC ₹5 लाख गारंटी',
    trust2Title: 'RBI लाइसेंस', trust2Desc: 'सरकार मान्यता प्राप्त',
    trust3Title: 'बेस्ट रेट्स', trust3Desc: '7.90% तक साल में',
    trust4Title: 'तुरंत बुकिंग', trust4Desc: '3 आसान चरण में',
  },
};

// ── TYPING INDICATOR ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
    <div style={{
      width: '32px', height: '32px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
    }}>🏦</div>
    <div style={{
      background: 'white', padding: '10px 14px', borderRadius: '16px 16px 16px 4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e8f5ee',
      display: 'flex', gap: '4px', alignItems: 'center',
    }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#1a6b3c', opacity: 0.6,
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  </div>
);

// ── RATE TICKER ───────────────────────────────────────────────────────────────
const RateTicker = () => (
  <div style={{ overflow: 'hidden', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px 0' }}>
    <div style={{ display: 'flex', gap: '24px', animation: 'ticker 35s linear infinite', whiteSpace: 'nowrap' }}>
      {[...TICKER_BANKS, ...TICKER_BANKS].map((b, i) => (
        <span key={i} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', flexShrink: 0 }}>
          🏦 {b.name} <strong>{b.rate}%</strong>
        </span>
      ))}
    </div>
  </div>
);

// ── BANK CATEGORY DROPDOWN ────────────────────────────────────────────────────
const BankDropdown = ({ category, language, principal, tenure }) => {
  const [open, setOpen] = useState(false);
  const label = category.label[language] || category.label.hindi;
  const sorted = [...category.banks].sort((a, b) => b.rate - a.rate);

  return (
    <div style={{ marginBottom: '8px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '10px 12px',
          background: open ? '#f0fdf4' : '#f8f9fa',
          border: `1px solid ${open ? '#1a6b3c' : '#e2e8f0'}`,
          borderRadius: open ? '10px 10px 0 0' : '10px',
          cursor: 'pointer', fontSize: '13px', fontWeight: '600',
          color: open ? '#1a6b3c' : '#444',
          transition: 'all 0.2s',
        }}
      >
        <span>{label}</span>
        <span style={{ fontSize: '10px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>
      {open && (
        <div style={{
          border: '1px solid #1a6b3c', borderTop: 'none',
          borderRadius: '0 0 10px 10px', overflow: 'hidden',
        }}>
          {sorted.map((bank, i) => {
            const mat = Math.round(principal * Math.pow(1 + bank.rate / 400, (tenure / 12) * 4));
            return (
              <div key={bank.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px',
                background: i === 0 ? '#f0fdf4' : i % 2 === 0 ? 'white' : '#fafafa',
                borderBottom: i < sorted.length - 1 ? '1px solid #f0f0f0' : 'none',
              }}>
                <div>
                  {i === 0 && (
                    <span style={{
                      fontSize: '9px', background: '#1a6b3c', color: 'white',
                      padding: '1px 5px', borderRadius: '4px', marginBottom: '2px',
                      display: 'inline-block',
                    }}>Best</span>
                  )}
                  <div style={{ fontSize: '12px', fontWeight: i === 0 ? '600' : '400', color: '#2d3748' }}>
                    {language === 'english' ? bank.nameEnglish : bank.nameHindi}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a6b3c' }}>{bank.rate}%</div>
                  <div style={{ fontSize: '10px', color: '#888' }}>{formatINR(mat)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── SIDEBAR PANEL ─────────────────────────────────────────────────────────────
const SidebarPanel = ({ language, onBook }) => {
  const [principal, setPrincipal] = useState(50000);
  const [tenure, setTenure] = useState(12);
  const [senior, setSenior] = useState(false);
  const t = UI_TEXT[language] || UI_TEXT.hindi;
  const rate = 7.90 + (senior ? 0.5 : 0);
  const maturity = Math.round(principal * Math.pow(1 + rate / 400, (tenure / 12) * 4));
  const interest = maturity - principal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* ── 1. QUICK CALCULATOR ── */}
      <div style={{
        background: 'white', borderRadius: '16px', padding: '18px',
        border: '1px solid #e8f5ee', boxShadow: '0 2px 12px rgba(26,107,60,0.08)',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a6b3c', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🧮 {t.calcTitle}
        </div>

        {/* Amount slider */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>{t.amount}</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a6b3c' }}>{formatINR(principal)}</span>
          </div>
          <input type="range" min="1000" max="500000" step="1000"
            value={principal} onChange={(e) => setPrincipal(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#1a6b3c' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#bbb', marginTop: '2px' }}>
            <span>₹1K</span><span>₹5L</span>
          </div>
        </div>

        {/* Tenure pills */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>{t.tenure}</div>
          <div style={{ display: 'flex', gap: '5px' }}>
            {[6, 12, 24, 36, 60].map((m) => (
              <button key={m} onClick={() => setTenure(m)} style={{
                flex: 1, padding: '6px 2px', fontSize: '10px',
                fontWeight: tenure === m ? '700' : '400',
                border: tenure === m ? '2px solid #1a6b3c' : '1px solid #e2e8f0',
                borderRadius: '7px', cursor: 'pointer',
                background: tenure === m ? '#f0fdf4' : 'white',
                color: tenure === m ? '#1a6b3c' : '#666',
              }}>
                {m < 12 ? `${m}M` : `${m / 12}Y`}
              </button>
            ))}
          </div>
        </div>

        {/* Senior toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>👴 {t.senior} (+0.5%)</span>
          <div onClick={() => setSenior(!senior)} style={{
            width: '36px', height: '20px', borderRadius: '10px',
            background: senior ? '#1a6b3c' : '#ddd',
            cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
          }}>
            <div style={{
              position: 'absolute', top: '2px', left: senior ? '18px' : '2px',
              width: '16px', height: '16px', borderRadius: '50%',
              background: 'white', transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </div>
        </div>

        {/* Result card */}
        <div style={{
          background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
          borderRadius: '12px', padding: '14px', color: 'white',
        }}>
          <div style={{ fontSize: '10px', opacity: 0.85, marginBottom: '2px' }}>
            Suryoday SFB • {rate}% p.a. • {tenure < 12 ? `${tenure}M` : `${tenure / 12}Y`}
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', marginBottom: '10px' }}>
            {formatINR(maturity)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px 10px', fontSize: '11px' }}>
            <div>
              <div style={{ opacity: 0.75 }}>{t.invested}</div>
              <div style={{ fontWeight: '600' }}>{formatINR(principal)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ opacity: 0.75 }}>{t.interest}</div>
              <div style={{ fontWeight: '600', color: '#a8ffc4' }}>+{formatINR(interest)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. TOP 3 BANKS ── */}
      <div style={{
        background: 'white', borderRadius: '16px', padding: '18px',
        border: '1px solid #e8f5ee', boxShadow: '0 2px 12px rgba(26,107,60,0.08)',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a6b3c', marginBottom: '12px' }}>
          🏆 {t.top3}
        </div>
        {TOP3_BANKS.map((bank, i) => {
          const mat = Math.round(principal * Math.pow(1 + bank.rate / 400, (tenure / 12) * 4));
          return (
            <div key={bank.name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 12px', marginBottom: '6px',
              background: i === 0 ? '#f0fdf4' : '#fafafa',
              borderRadius: '10px',
              border: i === 0 ? '1.5px solid #1a6b3c' : '1px solid #f0f0f0',
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: bank.color, marginBottom: '2px' }}>{bank.badge}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748' }}>
                  {language === 'english' ? bank.nameEnglish : bank.nameHindi}
                </div>
                <div style={{ fontSize: '10px', color: '#888' }}>DICGC ✅</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#1a6b3c' }}>{bank.rate}%</div>
                <div style={{ fontSize: '10px', color: '#666' }}>{formatINR(mat)}</div>
                <div style={{ fontSize: '9px', color: '#999' }}>{t.perYear}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. ALL BANK DROPDOWNS ── */}
      <div style={{
        background: 'white', borderRadius: '16px', padding: '18px',
        border: '1px solid #e8f5ee', boxShadow: '0 2px 12px rgba(26,107,60,0.08)',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a6b3c', marginBottom: '12px' }}>
          📊 {t.allRates}
        </div>
        {BANK_CATEGORIES.map((cat) => (
          <BankDropdown
            key={cat.key}
            category={cat}
            language={language}
            principal={principal}
            tenure={tenure}
          />
        ))}
      </div>

      {/* ── 4. TRUST BADGES ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {[
          { icon: '🛡️', title: t.trust1Title, desc: t.trust1Desc },
          { icon: '🏛️', title: t.trust2Title, desc: t.trust2Desc },
          { icon: '📈', title: t.trust3Title, desc: t.trust3Desc },
          { icon: '⚡', title: t.trust4Title, desc: t.trust4Desc },
        ].map((b) => (
          <div key={b.title} style={{
            background: 'white', borderRadius: '12px', padding: '12px',
            border: '1px solid #e8f5ee', boxShadow: '0 1px 6px rgba(26,107,60,0.06)',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{b.icon}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#1a6b3c' }}>{b.title}</div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>{b.desc}</div>
          </div>
        ))}
      </div>

      {/* ── BOOK FD BUTTON ── */}
      <button onClick={onBook} style={{
        width: '100%', padding: '14px',
        background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
        color: 'white', border: 'none', borderRadius: '12px',
        fontSize: '14px', fontWeight: '700', cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(26,107,60,0.35)',
        marginBottom: '8px',
      }}>
        📋 {t.bookFD} →
      </button>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const ChatWindow = () => {
  const [language, setLanguage] = useState('hindi');
  const [input, setInput] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const [showBranchFinder, setShowBranchFinder] = useState(false);

  const t = UI_TEXT[language] || UI_TEXT.hindi;
  const { messages, loading, sendUserMessage, clearChat, setMessages } = useChat(language);
  const [showPortfolio, setShowPortfolio] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendUserMessage(input, language);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const getVoiceLang = (lang) => (
    { hindi: 'hi-IN', english: 'en-IN', bhojpuri: 'hi-IN', awadhi: 'hi-IN' }[lang] || 'hi-IN'
  );

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Chrome browser use karein'); return; }
    const r = new SR();
    r.lang = getVoiceLang(language);
    r.continuous = true;
    r.interimResults = true;
    r.onstart = () => { setIsListening(true); setInput(''); };
    r.onresult = (e) => {
      let final = '', interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setInput(final || interim);
    };
    r.onend = () => setIsListening(false);
    r.onerror = (e) => {
      setIsListening(false);
      if (e.error === 'not-allowed') alert('Microphone permission required');
    };
    recognitionRef.current = r;
    r.start();
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: '"Noto Sans Devanagari", "Segoe UI", sans-serif',
      background: '#f0fdf4',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 4px rgba(220,38,38,0.2)} 50%{box-shadow:0 0 0 8px rgba(220,38,38,0.1)} }
        @keyframes soundwave { from{height:4px;opacity:0.4} to{height:14px;opacity:1} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #c6f6d5; border-radius: 2px; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a6b3c 0%, #2d9e5f 100%)',
        padding: '12px 20px', flexShrink: 0,
        boxShadow: '0 2px 20px rgba(26,107,60,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', border: '2px solid rgba(255,255,255,0.4)',
            }}>🏦</div>
            <div>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '17px' }}>{t.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>{t.online} • {t.subtitle}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
  
        <button onClick={() => setShowDemo(true)} style={{
          background: 'rgba(255,255,255,0.25)',
          border: '1.5px solid rgba(255,255,255,0.6)',
          color: 'white', padding: '7px 12px',
          borderRadius: '10px', cursor: 'pointer',
          fontSize: '12px', fontWeight: '600',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          letterSpacing: '0.2px',
        }}>{t.demo}</button>

        <button onClick={() => setShowPortfolio(true)} style={{
          background: 'rgba(255,255,255,0.25)',
          border: '1.5px solid rgba(255,255,255,0.6)',
          color: 'white', padding: '7px 12px',
          borderRadius: '10px', cursor: 'pointer',
          fontSize: '12px', fontWeight: '600',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          letterSpacing: '0.2px',
        }}>{t.portfolio}</button>

        <button onClick={() => setShowBranchFinder(true)} style={{
          background: 'rgba(255,255,255,0.25)',
          border: '1.5px solid rgba(255,255,255,0.6)',
          color: 'white', padding: '7px 12px',
          borderRadius: '10px', cursor: 'pointer',
          fontSize: '12px', fontWeight: '600',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          letterSpacing: '0.2px',
        }}>{t.branchFinder}</button>

        <button onClick={clearChat} style={{
          background: 'rgba(255,255,255,0.25)',
          border: '1.5px solid rgba(255,255,255,0.6)',
          color: 'white', padding: '7px 12px',
          borderRadius: '10px', cursor: 'pointer',
          fontSize: '12px', fontWeight: '600',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          letterSpacing: '0.2px',
        }}>{t.newChat}</button>
      </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <LanguageToggle selected={language} onChange={setLanguage} />
        </div>
        <RateTicker />
      </div>

      {/* ── BODY: 60/40 SPLIT ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT 60%: CHAT ── */}
        <div style={{
          flex: '0 0 60%', display: 'flex', flexDirection: 'column',
          borderRight: '1px solid #e8f5ee', minWidth: 0,
        }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 8px' }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && !loading && (
            <div style={{
              padding: '0 14px 8px', display: 'flex',
              gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
            }}>
              {SUGGESTIONS[language]?.map((s) => (
                <button key={s} onClick={() => sendUserMessage(s, language)} style={{
                  flexShrink: 0, padding: '7px 12px',
                  background: 'white', border: '1px solid #c6f6d5',
                  borderRadius: '16px', cursor: 'pointer',
                  fontSize: '12px', color: '#1a6b3c', whiteSpace: 'nowrap',
                }}>{s}</button>
              ))}
            </div>
          )}

          {/* Book FD button only */}
          <div style={{ padding: '0 14px 8px', flexShrink: 0 }}>
            <button onClick={() => setShowBooking(true)} style={{
              width: '100%', padding: '11px',
              background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(26,107,60,0.3)',
            }}>📋 {t.bookFD}</button>
          </div>

          {/* Voice note */}
          {!isListening && t.voiceNote && (
            <div style={{ padding: '0 14px 4px', fontSize: '11px', color: '#888', textAlign: 'center', flexShrink: 0 }}>
              {t.voiceNote}
            </div>
          )}

          {/* Listening indicator */}
          {isListening && (
            <div style={{
              padding: '4px 14px', display: 'flex',
              alignItems: 'center', gap: '8px', justifyContent: 'center', flexShrink: 0,
            }}>
              {[0,1,2,3,4].map((i) => (
                <div key={i} style={{
                  width: '3px', background: '#dc2626', borderRadius: '2px',
                  animation: `soundwave 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
                  height: '10px',
                }} />
              ))}
              <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: '500' }}>
                {language === 'english' ? 'Listening...' : 'सुन रहा हूँ...'}
              </span>
            </div>
          )}

          {/* Input row */}
          <div style={{
            padding: '8px 14px 14px', background: 'white',
            borderTop: '1px solid #e8f5ee',
            display: 'flex', gap: '8px', alignItems: 'flex-end', flexShrink: 0,
          }}>
            <button onClick={isListening ? stopListening : startListening} style={{
              width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
              background: isListening
                ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                : 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
              border: 'none', cursor: 'pointer', fontSize: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: isListening ? 'pulse 1s infinite' : 'none',
            }}>{isListening ? '⏹' : '🎤'}</button>

            <textarea
              ref={inputRef} value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={isListening
                ? (language === 'english' ? '🎤 Listening...' : '🎤 सुन रहा हूँ...')
                : t.placeholder}
              rows={1}
              style={{
                flex: 1, padding: '10px 14px',
                border: `2px solid ${isListening ? '#dc2626' : '#e2e8f0'}`,
                borderRadius: '20px', fontSize: '14px', resize: 'none',
                fontFamily: 'inherit', lineHeight: '1.5',
                maxHeight: '80px', overflowY: 'auto',
                transition: 'border-color 0.2s',
              }}
            />
            <button onClick={handleSend} disabled={!input.trim() || loading} style={{
              width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
              background: input.trim()
                ? 'linear-gradient(135deg, #1a6b3c, #2d9e5f)'
                : '#e2e8f0',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{loading ? '⏳' : '➤'}</button>
          </div>
        </div>

        {/* ── RIGHT 40%: SIDEBAR ── */}
        <div style={{
          flex: '0 0 40%', overflowY: 'auto',
          padding: '16px 14px', background: '#f8fffe',
        }}>
          <SidebarPanel language={language} onBook={() => setShowBooking(true)} />
        </div>
      </div>

      {/* ── MODALS ── */}
      {showBooking && <BookingFlow onClose={() => setShowBooking(false)} onSendMessage={sendUserMessage} />}
      {showCalculator && <FDCalculator onClose={() => setShowCalculator(false)} language={language} />}
      {showDemo && <DemoMode onClose={() => setShowDemo(false)} onInjectMessages={setMessages} language={language} />}
      {showPortfolio && (
        <PortfolioTracker
        onClose={() => setShowPortfolio(false)}
        language={language}
        />
      )}
      {showBranchFinder && (
        <BranchFinder
        onClose={() => setShowBranchFinder(false)}
        language={language}
        />
      )}
    </div>
  );
};

export default ChatWindow;