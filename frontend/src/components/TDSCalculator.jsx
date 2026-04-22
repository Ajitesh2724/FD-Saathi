import { useState } from 'react';

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  hindi: {
    title: 'TDS कैलकुलेटर',
    subtitle: 'कितना टैक्स कटेगा?',
    amount: 'FD राशि',
    rate: 'ब्याज दर (%)',
    tenure: 'अवधि',
    senior: 'वरिष्ठ नागरिक हैं (+0.5%)',
    calculate: 'Calculate करें',
    resultsTitle: 'आपके FD की TDS जानकारी',
    invested: 'निवेश',
    maturity: 'परिपक्वता राशि',
    totalInterest: 'कुल ब्याज',
    annualInterest: 'सालाना ब्याज',
    tdsThreshold: 'TDS सीमा',
    tdsStatus: 'TDS स्थिति',
    tdsDeducted: 'TDS राशि (10%)',
    netInterest: 'आपको मिलेगा (TDS के बाद)',
    tdsYes: '⚠️ TDS कटेगा',
    tdsNo: '✅ TDS नहीं कटेगा',
    formTitle: 'TDS बचाने का तरीका',
    form15g: 'Form 15G',
    form15h: 'Form 15H',
    form15gWho: 'किसके लिए: 60 साल से कम उम्र के लोग',
    form15hWho: 'किसके लिए: 60 साल से अधिक उम्र (वरिष्ठ नागरिक)',
    formCondition: 'शर्त: कुल आय ₹2.5 लाख (वरिष्ठ: ₹3 लाख) से कम हो',
    formHow: 'कैसे: बैंक जाकर फॉर्म भरें, हर साल जमा करें',
    note: '💡 बिना PAN के TDS 20% कट सकता है। PAN जरूर दें।',
    tenureOptions: ['6 महीने', '12 महीने', '24 महीने', '36 महीने', '5 साल'],
    close: 'बंद करें',
  },
  english: {
    title: 'TDS Calculator',
    subtitle: 'How much tax will be deducted?',
    amount: 'FD Amount',
    rate: 'Interest Rate (%)',
    tenure: 'Tenure',
    senior: 'Senior Citizen (+0.5%)',
    calculate: 'Calculate',
    resultsTitle: 'TDS Details for Your FD',
    invested: 'Invested',
    maturity: 'Maturity Amount',
    totalInterest: 'Total Interest',
    annualInterest: 'Annual Interest',
    tdsThreshold: 'TDS Threshold',
    tdsStatus: 'TDS Status',
    tdsDeducted: 'TDS Amount (10%)',
    netInterest: 'You receive (after TDS)',
    tdsYes: '⚠️ TDS will be deducted',
    tdsNo: '✅ No TDS applicable',
    formTitle: 'How to avoid TDS',
    form15g: 'Form 15G',
    form15h: 'Form 15H',
    form15gWho: 'For: People below 60 years of age',
    form15hWho: 'For: Senior citizens (60+ years)',
    formCondition: 'Condition: Total income below ₹2.5L (Seniors: ₹3L)',
    formHow: 'How: Submit the form at your branch every financial year',
    note: '💡 Without PAN, TDS is deducted at 20%. Always link your PAN.',
    tenureOptions: ['6 Months', '12 Months', '24 Months', '36 Months', '5 Years'],
    close: 'Close',
  },
  bhojpuri: {
    title: 'TDS कैलकुलेटर',
    subtitle: 'केतना टैक्स कटी?',
    amount: 'FD रकम',
    rate: 'ब्याज दर (%)',
    tenure: 'समय',
    senior: 'बुजुर्ग नागरिक (+0.5%)',
    calculate: 'Calculate करीं',
    resultsTitle: 'रउआ के FD के TDS जानकारी',
    invested: 'लगाईल',
    maturity: 'कुल मिली',
    totalInterest: 'कुल ब्याज',
    annualInterest: 'सालाना ब्याज',
    tdsThreshold: 'TDS सीमा',
    tdsStatus: 'TDS स्थिति',
    tdsDeducted: 'TDS रकम (10%)',
    netInterest: 'मिली (TDS के बाद)',
    tdsYes: '⚠️ TDS कटी',
    tdsNo: '✅ TDS ना कटी',
    formTitle: 'TDS बचावे के तरीका',
    form15g: 'Form 15G',
    form15h: 'Form 15H',
    form15gWho: 'के खातिर: 60 साल से कम उम्र के लोग',
    form15hWho: 'के खातिर: बुजुर्ग नागरिक (60+ साल)',
    formCondition: 'शर्त: कुल आय ₹2.5 लाख से कम होखे',
    formHow: 'कइसे: बैंक जा के फॉर्म भरीं, हर साल',
    note: '💡 बिना PAN के TDS 20% कट सकेला। PAN जरूर दीं।',
    tenureOptions: ['6 महीना', '12 महीना', '24 महीना', '36 महीना', '5 साल'],
    close: 'बंद करीं',
  },
  awadhi: {
    title: 'TDS कैलकुलेटर',
    subtitle: 'कितना टैक्स कटेगा?',
    amount: 'FD राशि',
    rate: 'ब्याज दर (%)',
    tenure: 'अवधि',
    senior: 'वरिष्ठ नागरिक (+0.5%)',
    calculate: 'Calculate करें',
    resultsTitle: 'आपके FD के TDS विवरण',
    invested: 'लगाया',
    maturity: 'कुल मिलेगा',
    totalInterest: 'कुल ब्याज',
    annualInterest: 'सालाना ब्याज',
    tdsThreshold: 'TDS सीमा',
    tdsStatus: 'TDS स्थिति',
    tdsDeducted: 'TDS राशि (10%)',
    netInterest: 'मिलेगा (TDS के बाद)',
    tdsYes: '⚠️ TDS कटेगा',
    tdsNo: '✅ TDS नाय कटेगा',
    formTitle: 'TDS बचाने का तरीका',
    form15g: 'Form 15G',
    form15h: 'Form 15H',
    form15gWho: 'के लिए: 60 साल से कम उम्र के लोग',
    form15hWho: 'के लिए: वरिष्ठ नागरिक (60+ साल)',
    formCondition: 'शर्त: कुल आय ₹2.5 लाख से कम होय',
    formHow: 'कइसे: बैंक जाय के फॉर्म भरें, हर साल',
    note: '💡 बिना PAN के TDS 20% कट सकत है। PAN जरूर दें।',
    tenureOptions: ['6 महीने', '12 महीने', '24 महीने', '36 महीने', '5 साल'],
    close: 'बंद करें',
  },
};

const TENURE_MONTHS = [6, 12, 24, 36, 60];

const fmt = (n) => Math.round(n).toLocaleString('en-IN');

const calcAll = (principal, rate, months, isSenior) => {
  const effectiveRate = rate + (isSenior ? 0.5 : 0);
  const maturity = principal * Math.pow(1 + effectiveRate / 400, (months / 12) * 4);
  const totalInterest = maturity - principal;
  const annualInterest = totalInterest / (months / 12);
  const threshold = isSenior ? 50000 : 40000;
  const tdsApplies = annualInterest > threshold;
  // TDS at 10% on total interest earned (simplified: bank deducts per year)
  const tdsAmount = tdsApplies ? totalInterest * 0.10 : 0;
  const netInterest = totalInterest - tdsAmount;
  return {
    effectiveRate,
    maturity: Math.round(maturity),
    totalInterest: Math.round(totalInterest),
    annualInterest: Math.round(annualInterest),
    threshold,
    tdsApplies,
    tdsAmount: Math.round(tdsAmount),
    netInterest: Math.round(netInterest),
    netMaturity: Math.round(principal + netInterest),
  };
};

const TDSCalculator = ({ onClose, language = 'hindi' }) => {
  const t = T[language] || T.hindi;
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate]           = useState(7.90);
  const [tenureIdx, setTenureIdx] = useState(1); // 12 months default
  const [isSenior, setSenior]     = useState(false);
  const [showResult, setShowResult] = useState(true);

  const months = TENURE_MONTHS[tenureIdx];
  const result = calcAll(principal, rate, months, isSenior);

  const accentColor = '#4ade80';
  const darkBg = '#0a1a0a';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '12px',
    }}>
      <div style={{
        background: darkBg, borderRadius: '20px',
        width: '100%', maxWidth: '460px', maxHeight: '92vh', overflowY: 'auto',
        padding: '24px', border: '1px solid rgba(74,222,128,0.2)',
        boxShadow: '0 0 40px rgba(74,222,128,0.08)',
        fontFamily: "'DM Sans','Noto Sans Devanagari',sans-serif",
        color: 'rgba(255,255,255,0.85)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: accentColor }}>
              🧾 {t.title}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              {t.subtitle}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
            cursor: 'pointer', fontSize: '14px', color: 'rgba(255,255,255,0.6)',
          }}>✕</button>
        </div>

        {/* ── INPUTS ── */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid rgba(74,222,128,0.1)' }}>

          {/* Amount */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {t.amount}
              </span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: accentColor }}>
                ₹{fmt(principal)}
              </span>
            </div>
            <input
              type="range" min="10000" max="2000000" step="5000"
              value={principal} onChange={e => setPrincipal(Number(e.target.value))}
              style={{ width: '100%', accentColor }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
              <span>₹10K</span><span>₹20L</span>
            </div>
          </div>

          {/* Rate */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {t.rate}
              </span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: accentColor }}>
                {result.effectiveRate.toFixed(2)}%
              </span>
            </div>
            <input
              type="range" min="4" max="10" step="0.05"
              value={rate} onChange={e => setRate(Number(e.target.value))}
              style={{ width: '100%', accentColor }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
              <span>4%</span><span>10%</span>
            </div>
          </div>

          {/* Tenure pills */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
              {t.tenure}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {t.tenureOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setTenureIdx(i)}
                  style={{
                    flex: 1, padding: '7px 2px', fontSize: '11px', borderRadius: '8px',
                    cursor: 'pointer', fontFamily: 'inherit',
                    border: tenureIdx === i ? `1.5px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)',
                    background: tenureIdx === i ? 'rgba(74,222,128,0.12)' : 'transparent',
                    color: tenureIdx === i ? accentColor : 'rgba(255,255,255,0.4)',
                    fontWeight: tenureIdx === i ? '700' : '400',
                    transition: 'all 0.15s',
                  }}
                >{opt}</button>
              ))}
            </div>
          </div>

          {/* Senior toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>👴 {t.senior}</span>
            <div
              onClick={() => setSenior(!isSenior)}
              style={{
                width: '38px', height: '21px', borderRadius: '11px', cursor: 'pointer',
                background: isSenior ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${isSenior ? accentColor : 'rgba(255,255,255,0.15)'}`,
                position: 'relative', transition: 'all 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', top: '2px', left: isSenior ? '19px' : '2px',
                width: '15px', height: '15px', borderRadius: '50%',
                background: isSenior ? accentColor : 'rgba(255,255,255,0.4)',
                transition: 'all 0.2s',
              }} />
            </div>
          </div>
        </div>

        {/* ── RESULTS ── */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(74,222,128,0.12)', overflow: 'hidden', marginBottom: '14px' }}>

          {/* Result header */}
          <div style={{ padding: '12px 16px', background: 'rgba(74,222,128,0.06)', borderBottom: '1px solid rgba(74,222,128,0.1)' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: accentColor, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              📊 {t.resultsTitle}
            </div>
          </div>

          <div style={{ padding: '14px 16px' }}>
            {/* Maturity highlight */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(20,83,45,0.9), rgba(22,163,74,0.5))',
              borderRadius: '12px', padding: '14px 16px', marginBottom: '14px',
              border: '1px solid rgba(74,222,128,0.2)',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                {t.maturity} ({result.effectiveRate}% p.a.)
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>
                ₹{fmt(result.netMaturity)}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>
                {t.invested}: ₹{fmt(principal)}
              </div>
            </div>

            {/* Row data */}
            {[
              { label: t.totalInterest,  value: `₹${fmt(result.totalInterest)}`,  color: '#a8ffc4' },
              { label: t.annualInterest, value: `₹${fmt(result.annualInterest)}`, color: 'rgba(255,255,255,0.7)' },
              { label: t.tdsThreshold,   value: `₹${fmt(result.threshold)}`,      color: 'rgba(255,255,255,0.7)' },
              { label: t.tdsStatus,
                value: result.tdsApplies ? t.tdsYes : t.tdsNo,
                color: result.tdsApplies ? '#fbbf24' : '#4ade80',
              },
              ...(result.tdsApplies ? [
                { label: t.tdsDeducted,  value: `- ₹${fmt(result.tdsAmount)}`,   color: '#fca5a5' },
                { label: t.netInterest,  value: `₹${fmt(result.netInterest)}`,   color: '#a8ffc4' },
              ] : []),
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FORM 15G/15H GUIDANCE ── */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', borderRadius: '14px',
          border: '1px solid rgba(74,222,128,0.12)', padding: '14px 16px', marginBottom: '14px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '12px' }}>
            💡 {t.formTitle}
          </div>

          {/* Form cards */}
          {[
            { form: t.form15g, who: t.form15gWho, forSenior: false },
            { form: t.form15h, who: t.form15hWho, forSenior: true },
          ].map(({ form, who, forSenior }) => (
            <div key={form} style={{
              background: isSenior === forSenior ? 'rgba(74,222,128,0.07)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isSenior === forSenior ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: '10px', padding: '10px 12px', marginBottom: '8px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: isSenior === forSenior ? accentColor : 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>
                📋 {form}
                {isSenior === forSenior && (
                  <span style={{ fontSize: '10px', background: accentColor, color: '#000', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px' }}>
                    {language === 'english' ? 'Relevant for you' : 'आपके लिए'}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>{who}</div>
            </div>
          ))}

          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5', marginTop: '4px' }}>
            📌 {t.formCondition}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            🏦 {t.formHow}
          </div>
        </div>

        {/* PAN note */}
        <div style={{
          padding: '10px 12px', background: 'rgba(251,191,36,0.07)',
          border: '1px solid rgba(251,191,36,0.2)', borderRadius: '10px',
          fontSize: '11px', color: '#fbbf24', marginBottom: '14px', lineHeight: '1.5',
        }}>
          {t.note}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '13px',
            background: 'linear-gradient(135deg, #14532d, #16a34a)',
            color: 'white', border: '1px solid rgba(74,222,128,0.35)',
            borderRadius: '12px', fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >{t.close}</button>
      </div>
    </div>
  );
};

export default TDSCalculator;
