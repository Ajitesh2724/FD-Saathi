import { useState, useEffect } from 'react';
import { formatINR } from '../utils/formatters';

const STORAGE_KEY = 'fd_saathi_portfolio';

// ── Design tokens (match ChatWindow) ─────────────────────────────────────────
const C = {
  bg:        '#0a120a',
  surface:   'rgba(255,255,255,0.04)',
  surfaceHi: 'rgba(255,255,255,0.07)',
  border:    'rgba(74,222,128,0.12)',
  borderHi:  'rgba(74,222,128,0.3)',
  green:     '#4ade80',
  greenDim:  'rgba(74,222,128,0.65)',
  greenBg:   'rgba(74,222,128,0.1)',
  text:      'rgba(255,255,255,0.85)',
  textDim:   'rgba(255,255,255,0.45)',
  textMuted: 'rgba(255,255,255,0.25)',
  gradGreen: 'linear-gradient(135deg,#14532d,#16a34a)',
  amber:     '#fbbf24',
  amberBg:   'rgba(251,191,36,0.1)',
  amberBorder:'rgba(251,191,36,0.3)',
  red:       '#f87171',
  redBg:     'rgba(248,113,113,0.1)',
  blue:      '#60a5fa',
  blueBg:    'rgba(96,165,250,0.1)',
};

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
  { id: 'csb',      name: 'CSB Bank',                    nameHindi: 'CSB बैंक',          nameEnglish: 'CSB Bank',        rate: 6.75 },
  { id: 'indusind', name: 'IndusInd Bank',                nameHindi: 'इंडसइंड बैंक',    nameEnglish: 'IndusInd Bank',   rate: 6.75 },
  { id: 'kotak',    name: 'Kotak Mahindra Bank',          nameHindi: 'कोटक बैंक',        nameEnglish: 'Kotak Bank',      rate: 6.70 },
  { id: 'federal',  name: 'Federal Bank',                 nameHindi: 'फेडरल बैंक',       nameEnglish: 'Federal Bank',    rate: 6.60 },
  { id: 'icici',    name: 'ICICI Bank',                   nameHindi: 'ICICI बैंक',        nameEnglish: 'ICICI Bank',      rate: 6.50 },
  { id: 'hdfc',     name: 'HDFC Bank',                    nameHindi: 'HDFC बैंक',         nameEnglish: 'HDFC Bank',       rate: 6.50 },
  { id: 'idfcfirst',name: 'IDFC First Bank',              nameHindi: 'IDFC फर्स्ट बैंक', nameEnglish: 'IDFC First Bank', rate: 6.50 },
  { id: 'axis',     name: 'Axis Bank',                    nameHindi: 'एक्सिस बैंक',      nameEnglish: 'Axis Bank',       rate: 6.45 },
  { id: 'sbi',      name: 'State Bank of India',          nameHindi: 'स्टेट बैंक',       nameEnglish: 'SBI',             rate: 6.30 },
  { id: 'idbi',     name: 'IDBI Bank',                    nameHindi: 'IDBI बैंक',         nameEnglish: 'IDBI Bank',       rate: 6.30 },
  { id: 'pnb',      name: 'Punjab National Bank',         nameHindi: 'पंजाब नेशनल बैंक',nameEnglish: 'PNB',             rate: 6.25 },
  { id: 'bob',      name: 'Bank of Baroda',               nameHindi: 'बैंक ऑफ बड़ौदा',  nameEnglish: 'Bank of Baroda',  rate: 6.25 },
  { id: 'esaf',     name: 'ESAF Small Finance Bank',      nameHindi: 'ESAF SFB',          nameEnglish: 'ESAF SFB',        rate: 6.00 },
];

const calcMaturity = (principal, rate, months) =>
  Math.round(principal * Math.pow(1 + rate / 400, (months / 12) * 4));

const getMaturityDate = (startDate, months) => {
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + months);
  return d;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const daysRemaining = (maturityDate) =>
  Math.max(0, Math.ceil((new Date(maturityDate) - new Date()) / 86400000));

const UI_TEXT = {
  hindi: {
    title: 'मेरा FD पोर्टफोलियो', addFD: '+ FD जोड़ें',
    totalInvested: 'कुल निवेश', totalMaturity: 'कुल मिलेगा',
    totalInterest: 'कुल ब्याज', activeFDs: 'सक्रिय FD',
    bank: 'बैंक', amount: 'राशि', tenure: 'अवधि',
    startDate: 'शुरू तिथि', daysLeft: 'दिन बचे', delete: 'हटाएं',
    noFDs: 'कोई FD नहीं जोड़ी गई। ऊपर "+ FD जोड़ें" दबाएं।',
    addTitle: 'नई FD जोड़ें', cancel: 'रद्द करें', save: 'सेव करें',
    months: 'महीने', maturing: 'जल्द परिपक्व', interestEarned: 'ब्याज',
    chart: 'FD तुलना चार्ट', complete: '% पूर्ण',
  },
  english: {
    title: 'My FD Portfolio', addFD: '+ Add FD',
    totalInvested: 'Total Invested', totalMaturity: 'Total Maturity',
    totalInterest: 'Total Interest', activeFDs: 'Active FDs',
    bank: 'Bank', amount: 'Amount', tenure: 'Tenure',
    startDate: 'Start Date', daysLeft: 'Days Left', delete: 'Delete',
    noFDs: 'No FDs added yet. Press "+ Add FD" above.',
    addTitle: 'Add New FD', cancel: 'Cancel', save: 'Save',
    months: 'Months', maturing: 'Maturing Soon', interestEarned: 'Interest',
    chart: 'FD Comparison Chart', complete: '% complete',
  },
  bhojpuri: {
    title: 'हमार FD पोर्टफोलियो', addFD: '+ FD जोड़ीं',
    totalInvested: 'कुल लगाईल', totalMaturity: 'कुल मिली',
    totalInterest: 'कुल ब्याज', activeFDs: 'चालू FD',
    bank: 'बैंक', amount: 'रकम', tenure: 'समय',
    startDate: 'शुरू तिथि', daysLeft: 'दिन बचल', delete: 'हटाईं',
    noFDs: 'कवनो FD नइखे। ऊपर "+ FD जोड़ीं" दबाईं।',
    addTitle: 'नई FD जोड़ीं', cancel: 'रद्द करीं', save: 'सेव करीं',
    months: 'महीना', maturing: 'जल्दी परिपक्व', interestEarned: 'ब्याज',
    chart: 'FD तुलना चार्ट', complete: '% पूर्ण',
  },
  awadhi: {
    title: 'हमार FD पोर्टफोलियो', addFD: '+ FD जोड़ें',
    totalInvested: 'कुल लगाया', totalMaturity: 'कुल मिलत',
    totalInterest: 'कुल ब्याज', activeFDs: 'चालू FD',
    bank: 'बैंक', amount: 'रकम', tenure: 'समय',
    startDate: 'शुरू तिथि', daysLeft: 'दिन बचे', delete: 'हटाएं',
    noFDs: 'कवनो FD नाहीं जोड़ी गई। ऊपर "+ FD जोड़ें" दबाएं।',
    addTitle: 'नई FD जोड़ें', cancel: 'रद्द करें', save: 'सेव करें',
    months: 'महीने', maturing: 'जल्द परिपक्व', interestEarned: 'ब्याज',
    chart: 'FD तुलना चार्ट', complete: '% पूर्ण',
  },
};

// ── ADD FD MODAL ──────────────────────────────────────────────────────────────
const AddFDModal = ({ onClose, onAdd, language }) => {
  const t = UI_TEXT[language] || UI_TEXT.hindi;
  const [bankId, setBankId]     = useState('suryoday');
  const [principal, setPrincipal] = useState('');
  const [tenure, setTenure]     = useState(12);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedBank = BANK_OPTIONS.find((b) => b.id === bankId);
  const getBankName  = (b) => language === 'english' ? b.nameEnglish : b.nameHindi;
  const maturity     = principal ? calcMaturity(parseFloat(principal), selectedBank.rate, tenure) : 0;

  const handleAdd = () => {
    if (!principal || parseFloat(principal) < 1000) return;
    onAdd({
      id: Date.now().toString(),
      bankId, bankName: selectedBank.name,
      bankNameHindi: selectedBank.nameHindi,
      bankNameEnglish: selectedBank.nameEnglish,
      rate: selectedBank.rate,
      principal: parseFloat(principal),
      tenure, startDate,
      maturityDate: getMaturityDate(startDate, tenure).toISOString(),
    });
    onClose();
  };

  const inputStyle = {
    width: '100%', padding: '10px 13px',
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: '10px', fontSize: '14px',
    fontFamily: "'DM Sans','Noto Sans Devanagari',sans-serif",
    color: C.text, outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:'16px' }}>
      <div style={{ background:'#0d1a0d', borderRadius:'20px', width:'100%', maxWidth:'420px', padding:'24px', border:`1px solid ${C.borderHi}`, boxShadow:'0 0 40px rgba(74,222,128,0.1)', fontFamily:"'DM Sans','Noto Sans Devanagari',sans-serif", maxHeight:'92vh', overflowY:'auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
          <div style={{ fontSize:'17px', fontWeight:'700', color:C.green }}>➕ {t.addTitle}</div>
          <button onClick={onClose} style={{ width:'32px', height:'32px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:'50%', cursor:'pointer', fontSize:'14px', color:C.textDim }}>✕</button>
        </div>

        {/* Bank select */}
        <div style={{ marginBottom:'14px' }}>
          <div style={{ fontSize:'11px', color:C.textDim, marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.8px' }}>{t.bank}</div>
          <select value={bankId} onChange={(e) => setBankId(e.target.value)} style={{ ...inputStyle, cursor:'pointer' }}>
            {BANK_OPTIONS.map((b) => (
              <option key={b.id} value={b.id} style={{ background:'#0d1a0d' }}>
                {getBankName(b)} — {b.rate}%
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div style={{ marginBottom:'14px' }}>
          <div style={{ fontSize:'11px', color:C.textDim, marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.8px' }}>
            {t.amount} (min ₹1,000)
          </div>
          <input
            type="number" value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="e.g. 50000"
            style={inputStyle}
          />
        </div>

        {/* Tenure pills */}
        <div style={{ marginBottom:'14px' }}>
          <div style={{ fontSize:'11px', color:C.textDim, marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.8px' }}>{t.tenure}</div>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            {[6,12,18,24,36,60].map((m) => (
              <button key={m} onClick={() => setTenure(m)} style={{
                padding:'7px 12px', fontSize:'12px', borderRadius:'8px', cursor:'pointer',
                border: tenure===m ? `1.5px solid ${C.green}` : `1px solid ${C.border}`,
                background: tenure===m ? C.greenBg : 'transparent',
                color: tenure===m ? C.green : C.textDim,
                fontWeight: tenure===m ? '700' : '400',
                fontFamily:'inherit', transition:'all 0.15s',
              }}>
                {m < 12 ? `${m}M` : `${m/12}Y`}
              </button>
            ))}
          </div>
        </div>

        {/* Start date */}
        <div style={{ marginBottom:'18px' }}>
          <div style={{ fontSize:'11px', color:C.textDim, marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.8px' }}>{t.startDate}</div>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ ...inputStyle, colorScheme:'dark' }} />
        </div>

        {/* Maturity preview */}
        {principal && parseFloat(principal) >= 1000 && (
          <div style={{ background:C.gradGreen, borderRadius:'12px', padding:'14px 16px', marginBottom:'18px', border:`1px solid rgba(74,222,128,0.3)` }}>
            <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.6)', marginBottom:'3px', letterSpacing:'0.5px' }}>
              {getBankName(selectedBank)} • {selectedBank.rate}% p.a. • {tenure}{t.months[0] === 'M' ? 'M' : tenure < 12 ? ' महीने' : ` साल`}
            </div>
            <div style={{ fontSize:'24px', fontWeight:'800', color:'white', letterSpacing:'-0.5px' }}>{formatINR(maturity)}</div>
            <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)', marginTop:'2px' }}>
              +{formatINR(maturity - parseFloat(principal))} {t.interestEarned}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={onClose} style={{ flex:1, padding:'12px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:'12px', cursor:'pointer', fontSize:'14px', color:C.textDim, fontFamily:'inherit' }}>{t.cancel}</button>
          <button onClick={handleAdd} disabled={!principal || parseFloat(principal) < 1000} style={{
            flex:2, padding:'12px', fontSize:'14px', fontWeight:'700',
            background: principal && parseFloat(principal) >= 1000 ? C.gradGreen : 'rgba(255,255,255,0.06)',
            color: principal && parseFloat(principal) >= 1000 ? 'white' : C.textMuted,
            border: `1px solid ${principal && parseFloat(principal) >= 1000 ? 'rgba(74,222,128,0.4)' : C.border}`,
            borderRadius:'12px', cursor: principal && parseFloat(principal) >= 1000 ? 'pointer' : 'default',
            fontFamily:'inherit', transition:'all 0.2s',
          }}>{t.save}</button>
        </div>
      </div>
    </div>
  );
};

// ── MINI BAR CHART ────────────────────────────────────────────────────────────
const MiniBarChart = ({ fds, t }) => {
  if (fds.length === 0) return null;
  const max = Math.max(...fds.map((f) => calcMaturity(f.principal, f.rate, f.tenure)));
  const barColors = ['#4ade80','#34d399','#6ee7b7','#a7f3d0','#86efac'];

  return (
    <div style={{ background:C.surface, borderRadius:'14px', padding:'16px', border:`1px solid ${C.border}`, marginBottom:'12px' }}>
      <div style={{ fontSize:'11px', fontWeight:'700', color:C.green, marginBottom:'14px', textTransform:'uppercase', letterSpacing:'0.8px' }}>
        📊 {t.chart}
      </div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:'8px', height:'80px' }}>
        {fds.map((fd, i) => {
          const mat    = calcMaturity(fd.principal, fd.rate, fd.tenure);
          const height = Math.round((mat / max) * 68) + 10;
          return (
            <div key={fd.id} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
              <div style={{ fontSize:'9px', color:C.greenDim, fontWeight:'600', fontVariantNumeric:'tabular-nums' }}>{formatINR(mat)}</div>
              <div style={{ width:'100%', height:`${height}px`, background:barColors[i % barColors.length], borderRadius:'4px 4px 0 0', opacity:0.85, transition:'height 0.5s ease' }} />
              <div style={{ fontSize:'9px', color:C.textDim, textAlign:'center', lineHeight:1.2 }}>
                {fd.bankNameHindi?.split(' ')[0] || fd.bankNameEnglish?.split(' ')[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── MAIN ──────────────────────────────────────────────────────────────────────
const PortfolioTracker = ({ onClose, language = 'hindi' }) => {
  const t = UI_TEXT[language] || UI_TEXT.hindi;
  const [fds, setFDs]       = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s) setFDs(JSON.parse(s)); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fds)); } catch { /* ignore */ }
  }, [fds]);

  const addFD    = (fd) => setFDs((p) => [...p, fd]);
  const deleteFD = (id) => setFDs((p) => p.filter((f) => f.id !== id));

  const totalInvested = fds.reduce((s, f) => s + f.principal, 0);
  const totalMaturity = fds.reduce((s, f) => s + calcMaturity(f.principal, f.rate, f.tenure), 0);
  const totalInterest = totalMaturity - totalInvested;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'12px' }}>
      <div style={{
        background:'#0a120a', borderRadius:'20px',
        width:'100%', maxWidth:'560px', maxHeight:'92vh', overflowY:'auto',
        padding:'24px', border:`1px solid ${C.borderHi}`,
        boxShadow:'0 0 60px rgba(74,222,128,0.08)',
        fontFamily:"'DM Sans','Noto Sans Devanagari',sans-serif",
        color: C.text,
      }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
          <div>
            <div style={{ fontSize:'18px', fontWeight:'700', color:C.green }}>📁 {t.title}</div>
            <div style={{ fontSize:'12px', color:C.textDim, marginTop:'2px' }}>
              {fds.length} {t.activeFDs}
            </div>
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => setShowAdd(true)} style={{
              padding:'9px 16px', background:C.gradGreen,
              color:'white', border:'1px solid rgba(74,222,128,0.35)',
              borderRadius:'10px', cursor:'pointer', fontSize:'13px',
              fontWeight:'600', fontFamily:'inherit',
              boxShadow:'0 4px 16px rgba(74,222,128,0.12)',
            }}>{t.addFD}</button>
            <button onClick={onClose} style={{
              width:'36px', height:'36px', background:C.surface,
              border:`1px solid ${C.border}`, borderRadius:'50%',
              cursor:'pointer', fontSize:'15px', color:C.textDim,
            }}>✕</button>
          </div>
        </div>

        {/* Summary stats */}
        {fds.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'12px' }}>
            {[
              { label:t.totalInvested, value:formatINR(totalInvested), color:C.green,  bg:C.greenBg,  border:C.borderHi },
              { label:t.totalMaturity, value:formatINR(totalMaturity), color:C.blue,   bg:C.blueBg,   border:'rgba(96,165,250,0.2)' },
              { label:t.totalInterest, value:'+'+formatINR(totalInterest), color:C.amber, bg:C.amberBg, border:C.amberBorder },
            ].map((card) => (
              <div key={card.label} style={{ background:card.bg, borderRadius:'12px', padding:'12px', border:`1px solid ${card.border}` }}>
                <div style={{ fontSize:'10px', color:C.textDim, marginBottom:'4px', letterSpacing:'0.5px' }}>{card.label}</div>
                <div style={{ fontSize:'14px', fontWeight:'800', color:card.color, fontVariantNumeric:'tabular-nums' }}>{card.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        {fds.length > 1 && <MiniBarChart fds={fds} t={t} />}

        {/* Empty state */}
        {fds.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px 20px', color:C.textDim }}>
            <div style={{ fontSize:'52px', marginBottom:'14px', opacity:0.6 }}>📂</div>
            <div style={{ fontSize:'14px', lineHeight:1.6 }}>{t.noFDs}</div>
          </div>
        )}

        {/* FD cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {fds.map((fd) => {
            const mat      = calcMaturity(fd.principal, fd.rate, fd.tenure);
            const interest = mat - fd.principal;
            const days     = daysRemaining(fd.maturityDate);
            const isUrgent = days <= 30;
            const progress = Math.min(100, Math.round(
              ((Date.now() - new Date(fd.startDate)) /
               (new Date(fd.maturityDate) - new Date(fd.startDate))) * 100
            ));
            const bankLabel = language === 'english'
              ? (fd.bankNameEnglish || fd.bankName)
              : fd.bankNameHindi;

            return (
              <div key={fd.id} style={{
                background: isUrgent ? C.amberBg : C.surface,
                borderRadius:'14px', padding:'16px',
                border:`1px solid ${isUrgent ? C.amberBorder : C.border}`,
              }}>
                {/* Top row */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                  <div>
                    {isUrgent && (
                      <span style={{ fontSize:'10px', background:C.amberBg, color:C.amber, border:`1px solid ${C.amberBorder}`, padding:'2px 8px', borderRadius:'6px', marginBottom:'5px', display:'inline-block' }}>
                        ⏰ {t.maturing}
                      </span>
                    )}
                    <div style={{ fontSize:'14px', fontWeight:'700', color:C.text }}>{bankLabel}</div>
                    <div style={{ fontSize:'12px', color:C.textDim, marginTop:'2px' }}>
                      {fd.rate}% p.a. • {fd.tenure} {t.months}
                    </div>
                  </div>
                  <button onClick={() => deleteFD(fd.id)} style={{
                    background:C.redBg, border:'1px solid rgba(248,113,113,0.2)',
                    borderRadius:'8px', padding:'5px 10px', cursor:'pointer',
                    fontSize:'11px', color:C.red, fontFamily:'inherit',
                  }}>🗑 {t.delete}</button>
                </div>

                {/* Amount row */}
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px', background:'rgba(0,0,0,0.2)', borderRadius:'10px', padding:'10px 12px' }}>
                  <div>
                    <div style={{ fontSize:'10px', color:C.textMuted, marginBottom:'3px' }}>{t.amount}</div>
                    <div style={{ fontSize:'15px', fontWeight:'700', color:C.green, fontVariantNumeric:'tabular-nums' }}>{formatINR(fd.principal)}</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:'10px', color:C.textMuted, marginBottom:'3px' }}>{t.interestEarned}</div>
                    <div style={{ fontSize:'15px', fontWeight:'700', color:C.amber, fontVariantNumeric:'tabular-nums' }}>+{formatINR(interest)}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:'10px', color:C.textMuted, marginBottom:'3px' }}>{t.totalMaturity}</div>
                    <div style={{ fontSize:'15px', fontWeight:'700', color:C.blue, fontVariantNumeric:'tabular-nums' }}>{formatINR(mat)}</div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:C.textDim, marginBottom:'5px' }}>
                    <span>{formatDate(fd.startDate)}</span>
                    <span style={{ color: isUrgent ? C.amber : C.green, fontWeight:'600' }}>
                      {days} {t.daysLeft}
                    </span>
                    <span>{formatDate(fd.maturityDate)}</span>
                  </div>
                  <div style={{ height:'5px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', overflow:'hidden' }}>
                    <div style={{
                      height:'100%', borderRadius:'3px', width:`${progress}%`,
                      background: isUrgent
                        ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                        : 'linear-gradient(90deg,#14532d,#4ade80)',
                      transition:'width 0.5s ease',
                    }} />
                  </div>
                  <div style={{ fontSize:'10px', color:C.textMuted, textAlign:'right', marginTop:'3px' }}>
                    {progress}{t.complete}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAdd && <AddFDModal onClose={() => setShowAdd(false)} onAdd={addFD} language={language} />}
    </div>
  );
};

export default PortfolioTracker;
