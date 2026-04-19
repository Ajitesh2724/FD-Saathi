import { useState, useEffect } from 'react';
import { formatINR } from '../utils/formatters';

const STORAGE_KEY = 'fd_saathi_portfolio';

const BANK_OPTIONS = [
  { id: 'suryoday', name: 'Suryoday Small Finance Bank', nameHindi: 'सूर्योदय SFB',    nameEnglish: 'Suryoday SFB',    rate: 7.90 },
  { id: 'unity',    name: 'Unity Small Finance Bank',    nameHindi: 'यूनिटी SFB',       nameEnglish: 'Unity SFB',       rate: 7.85 },
  { id: 'jana',     name: 'Jana Small Finance Bank',     nameHindi: 'जना SFB',           nameEnglish: 'Jana SFB',        rate: 7.77 },
  { id: 'ujjivan',  name: 'Ujjivan Small Finance Bank',  nameHindi: 'उज्जीवन SFB',      nameEnglish: 'Ujjivan SFB',     rate: 7.45 },
  { id: 'dcb',      name: 'DCB Bank',                    nameHindi: 'DCB बैंक',          nameEnglish: 'DCB Bank',        rate: 7.25 },
  { id: 'au',       name: 'AU Small Finance Bank',       nameHindi: 'AU SFB',            nameEnglish: 'AU SFB',          rate: 7.25 },
  { id: 'utkarsh',  name: 'Utkarsh Small Finance Bank',  nameHindi: 'उत्कर्ष SFB',      nameEnglish: 'Utkarsh SFB',     rate: 7.25 },
  { id: 'bandhan',  name: 'Bandhan Bank',                nameHindi: 'बंधन बैंक',        nameEnglish: 'Bandhan Bank',    rate: 7.25 },
  { id: 'rbl',      name: 'RBL Bank',                    nameHindi: 'RBL बैंक',          nameEnglish: 'RBL Bank',        rate: 7.20 },
  { id: 'yes',      name: 'Yes Bank',                    nameHindi: 'यस बैंक',          nameEnglish: 'Yes Bank',        rate: 7.00 },
  { id: 'equitas',  name: 'Equitas Small Finance Bank',  nameHindi: 'इक्विटास SFB',     nameEnglish: 'Equitas SFB',     rate: 7.00 },
  { id: 'northeast',name: 'North East Small Finance Bank',nameHindi: 'नॉर्थ ईस्ट SFB', nameEnglish: 'NE Small Finance',rate: 7.00 },
  { id: 'csb',      name: 'CSB Bank',                    nameHindi: 'CSB बैंक',          nameEnglish: 'CSB Bank',        rate: 6.75 },
  { id: 'karur',    name: 'Karur Vysya Bank',             nameHindi: 'करूर वैश्य बैंक', nameEnglish: 'Karur Vysya Bank',rate: 6.75 },
  { id: 'indusind', name: 'IndusInd Bank',                nameHindi: 'इंडसइंड बैंक',    nameEnglish: 'IndusInd Bank',   rate: 6.75 },
  { id: 'kotak',    name: 'Kotak Mahindra Bank',          nameHindi: 'कोटक बैंक',        nameEnglish: 'Kotak Bank',      rate: 6.70 },
  { id: 'federal',  name: 'Federal Bank',                 nameHindi: 'फेडरल बैंक',       nameEnglish: 'Federal Bank',    rate: 6.60 },
  { id: 'icici',    name: 'ICICI Bank',                   nameHindi: 'ICICI बैंक',        nameEnglish: 'ICICI Bank',      rate: 6.50 },
  { id: 'hdfc',     name: 'HDFC Bank',                    nameHindi: 'HDFC बैंक',         nameEnglish: 'HDFC Bank',       rate: 6.50 },
  { id: 'idfcfirst',name: 'IDFC First Bank',              nameHindi: 'IDFC फर्स्ट बैंक', nameEnglish: 'IDFC First Bank', rate: 6.50 },
  { id: 'southind', name: 'South Indian Bank',            nameHindi: 'साउथ इंडियन बैंक',nameEnglish: 'South Indian Bank',rate: 6.50 },
  { id: 'axis',     name: 'Axis Bank',                    nameHindi: 'एक्सिस बैंक',      nameEnglish: 'Axis Bank',       rate: 6.45 },
  { id: 'sbi',      name: 'State Bank of India',          nameHindi: 'स्टेट बैंक',       nameEnglish: 'SBI',             rate: 6.30 },
  { id: 'idbi',     name: 'IDBI Bank',                    nameHindi: 'IDBI बैंक',         nameEnglish: 'IDBI Bank',       rate: 6.30 },
  { id: 'pnb',      name: 'Punjab National Bank',         nameHindi: 'पंजाब नेशनल बैंक',nameEnglish: 'PNB',             rate: 6.25 },
  { id: 'bob',      name: 'Bank of Baroda',               nameHindi: 'बैंक ऑफ बड़ौदा',  nameEnglish: 'Bank of Baroda',  rate: 6.25 },
  { id: 'esaf',     name: 'ESAF Small Finance Bank',      nameHindi: 'ESAF SFB',          nameEnglish: 'ESAF SFB',        rate: 6.00 },
];

const calcMaturity = (principal, rate, months) => {
  const maturity = principal * Math.pow(1 + rate / 400, (months / 12) * 4);
  return Math.round(maturity);
};

const getMaturityDate = (startDate, months) => {
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + months);
  return d;
};

const formatDate = (date) => new Date(date).toLocaleDateString('hi-IN', {
  day: '2-digit', month: 'short', year: 'numeric',
});

const daysRemaining = (maturityDate) => {
  const today = new Date();
  const diff = new Date(maturityDate) - today;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const UI_TEXT = {
  hindi: {
    title: 'मेरा FD पोर्टफोलियो', addFD: '+ FD जोड़ें',
    totalInvested: 'कुल निवेश', totalMaturity: 'कुल मिलेगा',
    totalInterest: 'कुल ब्याज', activeFDs: 'सक्रिय FD',
    bank: 'बैंक', amount: 'राशि', tenure: 'अवधि',
    startDate: 'शुरू तिथि', maturityDate: 'परिपक्वता',
    daysLeft: 'दिन बचे', delete: 'हटाएं',
    noFDs: 'कोई FD नहीं जोड़ी गई। ऊपर "+ FD जोड़ें" दबाएं।',
    addTitle: 'नई FD जोड़ें', cancel: 'रद्द करें', save: 'सेव करें',
    months: 'महीने', maturing: 'जल्द परिपक्व',
    interestEarned: 'ब्याज',
  },
  english: {
    title: 'My FD Portfolio', addFD: '+ Add FD',
    totalInvested: 'Total Invested', totalMaturity: 'Total Maturity',
    totalInterest: 'Total Interest', activeFDs: 'Active FDs',
    bank: 'Bank', amount: 'Amount', tenure: 'Tenure',
    startDate: 'Start Date', maturityDate: 'Maturity',
    daysLeft: 'Days Left', delete: 'Delete',
    noFDs: 'No FDs added yet. Press "+ Add FD" above.',
    addTitle: 'Add New FD', cancel: 'Cancel', save: 'Save',
    months: 'Months', maturing: 'Maturing Soon',
    interestEarned: 'Interest',
  },
  bhojpuri: {
    title: 'हमार FD पोर्टफोलियो', addFD: '+ FD जोड़ीं',
    totalInvested: 'कुल लगाईल', totalMaturity: 'कुल मिली',
    totalInterest: 'कुल ब्याज', activeFDs: 'चालू FD',
    bank: 'बैंक', amount: 'रकम', tenure: 'समय',
    startDate: 'शुरू तिथि', maturityDate: 'परिपक्वता',
    daysLeft: 'दिन बचल', delete: 'हटाईं',
    noFDs: 'कवनो FD नइखे। ऊपर "+ FD जोड़ीं" दबाईं।',
    addTitle: 'नई FD जोड़ीं', cancel: 'रद्द करीं', save: 'सेव करीं',
    months: 'महीना', maturing: 'जल्दी परिपक्व',
    interestEarned: 'ब्याज',
  },
  awadhi: {
    title: 'हमार FD पोर्टफोलियो', addFD: '+ FD जोड़ें',
    totalInvested: 'कुल लगाया', totalMaturity: 'कुल मिलत',
    totalInterest: 'कुल ब्याज', activeFDs: 'चालू FD',
    bank: 'बैंक', amount: 'रकम', tenure: 'समय',
    startDate: 'शुरू तिथि', maturityDate: 'परिपक्वता',
    daysLeft: 'दिन बचे', delete: 'हटाएं',
    noFDs: 'कवनो FD नाहीं जोड़ी गई। ऊपर "+ FD जोड़ें" दबाएं।',
    addTitle: 'नई FD जोड़ें', cancel: 'रद्द करें', save: 'सेव करें',
    months: 'महीने', maturing: 'जल्द परिपक्व',
    interestEarned: 'ब्याज',
  },
};

// ── ADD FD MODAL ──────────────────────────────────────────────────────────────
const AddFDModal = ({ onClose, onAdd, language }) => {
  const t = UI_TEXT[language] || UI_TEXT.hindi;
  const [bankId, setBankId] = useState('suryoday');
  const [principal, setPrincipal] = useState('');
  const [tenure, setTenure] = useState(12);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedBank = BANK_OPTIONS.find((b) => b.id === bankId);
  const getBankDisplayName = (bank) => {
    if (language === 'english') return bank.nameEnglish;
    return bank.nameHindi;
};
  const maturity = principal ? calcMaturity(parseFloat(principal), selectedBank.rate, tenure) : 0;

  const handleAdd = () => {
    if (!principal || parseFloat(principal) < 1000) return;
    const maturityDate = getMaturityDate(startDate, tenure);
    onAdd({
        id: Date.now().toString(),
        bankId, bankName: selectedBank.name,
        bankNameHindi: selectedBank.nameHindi,
        bankNameEnglish: selectedBank.nameEnglish,
        rate: selectedBank.rate,
        principal: parseFloat(principal),
        tenure, startDate,
        maturityDate: maturityDate.toISOString(),
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '16px',
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        width: '100%', maxWidth: '420px', padding: '24px',
      }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a6b3c', marginBottom: '20px' }}>
          ➕ {t.addTitle}
        </div>

        {/* Bank select */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>{t.bank}</div>
          <select value={bankId} onChange={(e) => setBankId(e.target.value)} style={{
            width: '100%', padding: '10px 12px', border: '2px solid #e2e8f0',
            borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit',
            background: 'white', cursor: 'pointer',
          }}>
            {BANK_OPTIONS.map((b) => (
                <option key={b.id} value={b.id}>
                    {language === 'english' ? b.nameEnglish : b.nameHindi} — {b.rate}%
                </option>
        ))}
          </select>
        </div>

        {/* Amount */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
            {t.amount} ({language === 'english' ? 'Minimum ₹1,000' : 'न्यूनतम ₹1,000'})
          </div>
          <input
            type="number" value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder={language === 'english' ? 'e.g. 50000' : language === 'bhojpuri' ? 'जइसे: 50000' : 'जैसे: 50000'}
            style={{
              width: '100%', padding: '10px 12px', border: '2px solid #e2e8f0',
              borderRadius: '10px', fontSize: '16px', fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Tenure */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>{t.tenure}</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[6, 12, 18, 24, 36, 60].map((m) => (
              <button key={m} onClick={() => setTenure(m)} style={{
                padding: '7px 12px', fontSize: '13px',
                border: tenure === m ? '2px solid #1a6b3c' : '1px solid #e2e8f0',
                borderRadius: '8px', cursor: 'pointer',
                background: tenure === m ? '#f0fdf4' : 'white',
                color: tenure === m ? '#1a6b3c' : '#555',
                fontWeight: tenure === m ? '700' : '400',
              }}>
                {m < 12 ? `${m}M` : `${m / 12}Y`}
              </button>
            ))}
          </div>
        </div>

        {/* Start date */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>{t.startDate}</div>
          <input type="date" value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px',
              border: '2px solid #e2e8f0', borderRadius: '10px',
              fontSize: '14px', fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Preview */}
        {principal && parseFloat(principal) >= 1000 && (
          <div style={{
            background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
            borderRadius: '12px', padding: '14px', color: 'white', marginBottom: '16px',
          }}>
            <div style={{ fontSize: '10px', opacity: 0.85 }}>
                {getBankDisplayName(selectedBank)} • {selectedBank.rate}% • {tenure}M
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800' }}>{formatINR(maturity)}</div>
            <div style={{ fontSize: '12px', opacity: 0.85 }}>
              +{formatINR(maturity - parseFloat(principal))} {t.interestEarned}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', background: '#f5f5f5',
            border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px',
          }}>{t.cancel}</button>
          <button onClick={handleAdd}
            disabled={!principal || parseFloat(principal) < 1000}
            style={{
              flex: 2, padding: '12px', fontSize: '14px', fontWeight: '700',
              background: principal && parseFloat(principal) >= 1000
                ? 'linear-gradient(135deg, #1a6b3c, #2d9e5f)' : '#ccc',
              color: 'white', border: 'none', borderRadius: '12px',
              cursor: principal && parseFloat(principal) >= 1000 ? 'pointer' : 'default',
            }}
          >{t.save}</button>
        </div>
      </div>
    </div>
  );
};

// ── MINI BAR CHART ────────────────────────────────────────────────────────────
const MiniBarChart = ({ fds }) => {
  if (fds.length === 0) return null;
  const max = Math.max(...fds.map((f) => calcMaturity(f.principal, f.rate, f.tenure)));

  return (
    <div style={{
      background: 'white', borderRadius: '14px', padding: '16px',
      border: '1px solid #e8f5ee', marginBottom: '14px',
    }}>
      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a6b3c', marginBottom: '12px' }}>
        📊 FD तुलना चार्ट
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
        {fds.map((fd, i) => {
          const mat = calcMaturity(fd.principal, fd.rate, fd.tenure);
          const height = Math.round((mat / max) * 70) + 10;
          const colors = ['#1a6b3c', '#2d9e5f', '#4ade80', '#86efac', '#bbf7d0'];
          return (
            <div key={fd.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '9px', color: '#666', fontWeight: '600' }}>{formatINR(mat)}</div>
              <div style={{
                width: '100%', height: `${height}px`,
                background: colors[i % colors.length],
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.5s ease',
              }} />
              <div style={{ fontSize: '9px', color: '#888', textAlign: 'center', lineHeight: 1.2 }}>
                {fd.bankNameHindi.split(' ')[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── MAIN PORTFOLIO TRACKER ────────────────────────────────────────────────────
const PortfolioTracker = ({ onClose, language = 'hindi' }) => {
  const t = UI_TEXT[language] || UI_TEXT.hindi;
  const [fds, setFDs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setFDs(JSON.parse(saved));
    } catch (e) { /* ignore */ }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fds));
    } catch (e) { /* ignore */ }
  }, [fds]);

  const addFD = (fd) => setFDs((prev) => [...prev, fd]);
  const deleteFD = (id) => setFDs((prev) => prev.filter((f) => f.id !== id));

  // Summary stats
  const totalInvested = fds.reduce((s, f) => s + f.principal, 0);
  const totalMaturity = fds.reduce((s, f) => s + calcMaturity(f.principal, f.rate, f.tenure), 0);
  const totalInterest = totalMaturity - totalInvested;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '12px',
    }}>
      <div style={{
        background: '#f8fffe', borderRadius: '20px',
        width: '100%', maxWidth: '560px',
        maxHeight: '92vh', overflowY: 'auto',
        padding: '24px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a6b3c' }}>
              📁 {t.title}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {fds.length} {t.activeFDs}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowAdd(true)} style={{
              padding: '8px 14px', background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
              color: 'white', border: 'none', borderRadius: '10px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
            }}>{t.addFD}</button>
            <button onClick={onClose} style={{
              width: '36px', height: '36px', background: '#f0f0f0',
              border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '16px',
            }}>✕</button>
          </div>
        </div>

        {/* Summary Cards */}
        {fds.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: t.totalInvested, value: formatINR(totalInvested), color: '#1a6b3c', bg: '#f0fdf4' },
              { label: t.totalMaturity, value: formatINR(totalMaturity), color: '#0369a1', bg: '#f0f9ff' },
              { label: t.totalInterest, value: '+' + formatINR(totalInterest), color: '#b45309', bg: '#fffbeb' },
            ].map((card) => (
              <div key={card.label} style={{
                background: card.bg, borderRadius: '12px', padding: '12px',
                border: `1px solid ${card.color}22`,
              }}>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>{card.label}</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Bar chart */}
        {fds.length > 1 && <MiniBarChart fds={fds} />}

        {/* FD List */}
        {fds.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            color: '#888', fontSize: '14px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📂</div>
            {t.noFDs}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fds.map((fd) => {
              const mat = calcMaturity(fd.principal, fd.rate, fd.tenure);
              const interest = mat - fd.principal;
              const days = daysRemaining(fd.maturityDate);
              const isUrgent = days <= 30;
              const progress = Math.min(100, Math.round(
                ((new Date() - new Date(fd.startDate)) /
                (new Date(fd.maturityDate) - new Date(fd.startDate))) * 100
              ));

              return (
                <div key={fd.id} style={{
                  background: 'white', borderRadius: '14px', padding: '16px',
                  border: `1px solid ${isUrgent ? '#f59e0b' : '#e8f5ee'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      {isUrgent && (
                        <span style={{
                          fontSize: '10px', background: '#f59e0b', color: 'white',
                          padding: '2px 8px', borderRadius: '6px', marginBottom: '4px',
                          display: 'inline-block',
                        }}>⏰ {t.maturing}</span>
                      )}
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#2d3748' }}>
                        {language === 'english' ? fd.bankNameEnglish || fd.bankName : fd.bankNameHindi}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {fd.rate}% p.a. • {fd.tenure} {t.months}
                      </div>
                    </div>
                    <button onClick={() => deleteFD(fd.id)} style={{
                      background: '#fee2e2', border: 'none', borderRadius: '8px',
                      padding: '4px 8px', cursor: 'pointer', fontSize: '11px', color: '#dc2626',
                    }}>🗑 {t.delete}</button>
                  </div>

                  {/* Amount row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#888' }}>{t.amount}</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a6b3c' }}>{formatINR(fd.principal)}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#888' }}>{t.interestEarned}</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#b45309' }}>+{formatINR(interest)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', color: '#888' }}>{t.totalMaturity}</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0369a1' }}>{formatINR(mat)}</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888', marginBottom: '4px' }}>
                      <span>{formatDate(fd.startDate)}</span>
                      <span style={{ color: isUrgent ? '#f59e0b' : '#1a6b3c', fontWeight: '600' }}>
                        {days} {t.daysLeft}
                      </span>
                      <span>{formatDate(fd.maturityDate)}</span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: '3px',
                        background: isUrgent
                          ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                          : 'linear-gradient(90deg, #1a6b3c, #2d9e5f)',
                        width: `${progress}%`,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: '10px', color: '#888', textAlign: 'right', marginTop: '2px' }}>
                      {progress}% पूर्ण
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdd && <AddFDModal onClose={() => setShowAdd(false)} onAdd={addFD} language={language} />}
    </div>
  );
};

export default PortfolioTracker;