import { useState } from 'react';
import { formatINR, tenureLabel } from '../utils/formatters';

const BANKS_QUICK = [
  { name: 'Suryoday SFB', rate: 7.90 },
  { name: 'Jana SFB',     rate: 7.77 },
  { name: 'Unity SFB',    rate: 7.85 },
  { name: 'Ujjivan SFB',  rate: 7.45 },
  { name: 'AU SFB',       rate: 7.25 },
  { name: 'RBL Bank',     rate: 7.20 },
  { name: 'Yes Bank',     rate: 7.00 },
  { name: 'HDFC Bank',    rate: 6.50 },
  { name: 'ICICI Bank',   rate: 6.50 },
  { name: 'SBI',          rate: 6.30 },
];

const TENURE_OPTIONS = [
  { months: 6,  label: '6M'  },
  { months: 12, label: '1Y'  },
  { months: 24, label: '2Y'  },
  { months: 36, label: '3Y'  },
  { months: 60, label: '5Y'  },
];

const calculate = (principal, rate, months) => {
  const r = rate / 100;
  const n = 4;
  const t = months / 12;
  const maturity = principal * Math.pow(1 + r / n, n * t);
  return {
    maturity: Math.round(maturity),
    interest: Math.round(maturity - principal),
  };
};

const FDCalculator = ({ onClose, language = 'hindi' }) => {
  const [principal, setPrincipal] = useState(50000);
  const [tenure, setTenure] = useState(12);
  const [seniorCitizen, setSeniorCitizen] = useState(false);

  const LABELS = {
    hindi:   { title: 'FD कैलकुलेटर', amount: 'निवेश राशि', tenure: 'समय अवधि', senior: 'वरिष्ठ नागरिक (+0.5%)', maturity: 'परिपक्वता राशि', interest: 'ब्याज', invested: 'निवेश', top: 'बेस्ट बैंक तुलना', close: 'बंद करें' },
    english: { title: 'FD Calculator', amount: 'Investment Amount', tenure: 'Tenure', senior: 'Senior Citizen (+0.5%)', maturity: 'Maturity Amount', interest: 'Interest Earned', invested: 'Invested', top: 'Top Bank Comparison', close: 'Close' },
    bhojpuri:{ title: 'FD कैलकुलेटर', amount: 'केतना पईसा लगाईं', tenure: 'केतना समय', senior: 'बुजुर्ग नागरिक (+0.5%)', maturity: 'कुल मिली', interest: 'ब्याज', invested: 'लगाईल', top: 'बेस्ट बैंक', close: 'बंद करीं' },
    awadhi:  { title: 'FD कैलकुलेटर', amount: 'कितना पैसा लगाएं', tenure: 'कितना समय', senior: 'वरिष्ठ नागरिक (+0.5%)', maturity: 'कुल मिलेगा', interest: 'ब्याज', invested: 'लगाया', top: 'बेस्ट बैंक', close: 'बंद करें' },
  };

  const L = LABELS[language] || LABELS.hindi;
  const bonus = seniorCitizen ? 0.5 : 0;
  const bestRate = 7.90 + bonus;
  const best = calculate(principal, bestRate, tenure);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '12px',
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        width: '100%', maxWidth: '480px',
        maxHeight: '92vh', overflowY: 'auto',
        padding: '24px',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a6b3c' }}>
            🧮 {L.title}
          </div>
          <button onClick={onClose} style={{
            background: '#f5f5f5', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px',
          }}>✕</button>
        </div>

        {/* Amount Slider */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#666' }}>{L.amount}</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a6b3c' }}>
              {formatINR(principal)}
            </span>
          </div>
          <input
            type="range"
            min="1000" max="1000000" step="1000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#1a6b3c' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999', marginTop: '4px' }}>
            <span>₹1,000</span>
            <span>₹10,00,000</span>
          </div>
        </div>

        {/* Tenure Pills */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{L.tenure}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {TENURE_OPTIONS.map((opt) => (
              <button
                key={opt.months}
                onClick={() => setTenure(opt.months)}
                style={{
                  flex: 1, padding: '8px 4px',
                  border: tenure === opt.months ? '2px solid #1a6b3c' : '1px solid #e2e8f0',
                  borderRadius: '10px', cursor: 'pointer', fontSize: '13px',
                  fontWeight: tenure === opt.months ? '700' : '400',
                  background: tenure === opt.months ? '#f0fdf4' : 'white',
                  color: tenure === opt.months ? '#1a6b3c' : '#555',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Senior Citizen Toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px', background: '#f8f9fa', borderRadius: '12px',
          marginBottom: '20px',
        }}>
          <span style={{ fontSize: '14px', color: '#444' }}>👴 {L.senior}</span>
          <div
            onClick={() => setSeniorCitizen(!seniorCitizen)}
            style={{
              width: '44px', height: '24px', borderRadius: '12px',
              background: seniorCitizen ? '#1a6b3c' : '#ccc',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
            }}
          >
            <div style={{
              position: 'absolute', top: '2px',
              left: seniorCitizen ? '22px' : '2px',
              width: '20px', height: '20px',
              borderRadius: '50%', background: 'white',
              transition: 'left 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </div>
        </div>

        {/* Best Result Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
          borderRadius: '16px', padding: '20px', color: 'white',
          marginBottom: '20px',
        }}>
          <div style={{ fontSize: '12px', opacity: 0.85, marginBottom: '4px' }}>
            Suryoday SFB • {bestRate}% p.a. • {tenureLabel(tenure)}
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>
            {formatINR(best.maturity)}
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '10px', padding: '10px',
            fontSize: '12px', gap: '8px',
          }}>
            <div>
              <div style={{ opacity: 0.8 }}>{L.invested}</div>
              <div style={{ fontWeight: '600' }}>{formatINR(principal)}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ opacity: 0.8 }}>{L.interest}</div>
              <div style={{ fontWeight: '600', color: '#a8ffc4' }}>+{formatINR(best.interest)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ opacity: 0.8 }}>{L.maturity}</div>
              <div style={{ fontWeight: '600' }}>{formatINR(best.maturity)}</div>
            </div>
          </div>
        </div>

        {/* Bank Comparison Table */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '10px' }}>
            📊 {L.top}
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            {BANKS_QUICK.map((bank, i) => {
              const effectiveRate = bank.rate + bonus;
              const result = calculate(principal, effectiveRate, tenure);
              const isTop = i === 0;
              return (
                <div
                  key={bank.name}
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: isTop ? '#f0fdf4' : i % 2 === 0 ? 'white' : '#fafafa',
                    borderBottom: i < BANKS_QUICK.length - 1 ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isTop && <span style={{ fontSize: '10px', background: '#1a6b3c', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>⭐ Best</span>}
                    <span style={{ fontSize: '13px', fontWeight: isTop ? '600' : '400', color: '#2d3748' }}>
                      {bank.name}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a6b3c' }}>
                      {effectiveRate}%
                    </div>
                    <div style={{ fontSize: '11px', color: '#888' }}>
                      {formatINR(result.maturity)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            marginTop: '16px', width: '100%', padding: '14px',
            background: '#1a6b3c', color: 'white', border: 'none',
            borderRadius: '12px', fontSize: '15px', fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          {L.close}
        </button>
      </div>
    </div>
  );
};

export default FDCalculator;