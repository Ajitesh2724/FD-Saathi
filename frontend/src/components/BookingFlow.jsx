import { useState } from 'react';
import { bookFD } from '../services/api';
import { formatINR, tenureLabel } from '../utils/formatters';

const TENURE_OPTIONS = [
  { months: 6,  label: '6 महीने' },
  { months: 12, label: '12 महीने (1 साल)' },
  { months: 24, label: '24 महीने (2 साल)' },
  { months: 36, label: '36 महीने (3 साल)' },
];

const BookingFlow = ({ onClose, onSendMessage }) => {
  const [step, setStep] = useState(1);
  const [principal, setPrincipal] = useState('');
  const [tenure, setTenure] = useState(12);
  const [selectedBank, setSelectedBank] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (!selectedBank) return;
    setLoading(true);
    try {
      const result = await bookFD(selectedBank.id, parseFloat(principal), tenure);
      setBooking(result);
      setStep(4);
    } catch (e) {
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const banks = [
    { id: 'suryoday', name: 'सूर्योदय SFB', rate: 8.50 },
    { id: 'utkarsh',  name: 'उत्कर्ष SFB',  rate: 8.25 },
    { id: 'jana',     name: 'जना SFB',       rate: 8.00 },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '16px',
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        padding: '24px', width: '100%', maxWidth: '420px',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a6b3c' }}>
              FD बुकिंग
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              चरण {Math.min(step, 3)} / 3
            </div>
          </div>
          <button onClick={onClose} style={{
            background: '#f5f5f5', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px',
          }}>✕</button>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: step >= s ? '#1a6b3c' : '#e2e8f0',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* Step 1 — Amount */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              💰 कितना पैसा लगाना है?
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
              न्यूनतम राशि: ₹1,000
            </div>
            <input
              type="number"
              placeholder="जैसे: 50000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              style={{
                width: '100%', padding: '14px', fontSize: '18px',
                border: '2px solid #e2e8f0', borderRadius: '12px',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            {principal && parseFloat(principal) >= 1000 && (
              <div style={{
                marginTop: '12px', padding: '12px',
                background: '#f0fdf4', borderRadius: '10px',
                fontSize: '14px', color: '#1a6b3c',
              }}>
                ✅ {formatINR(parseFloat(principal))} — अच्छी शुरुआत!
              </div>
            )}
            <button
              onClick={() => parseFloat(principal) >= 1000 && setStep(2)}
              style={{
                marginTop: '16px', width: '100%', padding: '14px',
                background: parseFloat(principal) >= 1000 ? '#1a6b3c' : '#ccc',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: '600', cursor: 'pointer',
              }}
            >
              आगे बढ़ें →
            </button>
          </div>
        )}

        {/* Step 2 — Tenure */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              📅 कितने समय के लिए?
            </div>
            {TENURE_OPTIONS.map((opt) => {
              const r = 8.50 / 100;
              const t = opt.months / 12;
              const maturity = parseFloat(principal) * Math.pow(1 + r / 4, 4 * t);
              return (
                <div
                  key={opt.months}
                  onClick={() => setTenure(opt.months)}
                  style={{
                    padding: '14px', marginBottom: '8px',
                    border: tenure === opt.months ? '2px solid #1a6b3c' : '1px solid #e2e8f0',
                    borderRadius: '12px', cursor: 'pointer',
                    background: tenure === opt.months ? '#f0fdf4' : 'white',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: '600' }}>{opt.label}</span>
                  <span style={{ color: '#1a6b3c', fontWeight: '600' }}>
                    → {formatINR(maturity)}
                  </span>
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => setStep(1)} style={{
                flex: 1, padding: '14px', background: '#f5f5f5',
                border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px',
              }}>← वापस</button>
              <button onClick={() => setStep(3)} style={{
                flex: 2, padding: '14px', background: '#1a6b3c',
                color: 'white', border: 'none', borderRadius: '12px',
                cursor: 'pointer', fontSize: '16px', fontWeight: '600',
              }}>आगे बढ़ें →</button>
            </div>
          </div>
        )}

        {/* Step 3 — Bank Selection */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              🏦 कौन सा बैंक चुनें?
            </div>
            {banks.map((bank, i) => {
              const r = bank.rate / 100;
              const t = tenure / 12;
              const maturity = parseFloat(principal) * Math.pow(1 + r / 4, 4 * t);
              return (
                <div
                  key={bank.id}
                  onClick={() => setSelectedBank(bank)}
                  style={{
                    padding: '14px', marginBottom: '8px',
                    border: selectedBank?.id === bank.id
                      ? '2px solid #1a6b3c' : '1px solid #e2e8f0',
                    borderRadius: '12px', cursor: 'pointer',
                    background: selectedBank?.id === bank.id ? '#f0fdf4' : 'white',
                  }}
                >
                  {i === 0 && (
                    <span style={{
                      fontSize: '10px', background: '#1a6b3c', color: 'white',
                      padding: '2px 8px', borderRadius: '6px', marginBottom: '6px',
                      display: 'inline-block',
                    }}>⭐ सबसे अच्छा रेट</span>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{bank.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>DICGC ✅ सुरक्षित</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a6b3c' }}>
                        {bank.rate}%
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {formatINR(maturity)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => setStep(2)} style={{
                flex: 1, padding: '14px', background: '#f5f5f5',
                border: 'none', borderRadius: '12px', cursor: 'pointer',
              }}>← वापस</button>
              <button
                onClick={handleBook}
                disabled={!selectedBank || loading}
                style={{
                  flex: 2, padding: '14px',
                  background: selectedBank ? '#1a6b3c' : '#ccc',
                  color: 'white', border: 'none', borderRadius: '12px',
                  cursor: selectedBank ? 'pointer' : 'default',
                  fontSize: '16px', fontWeight: '600',
                }}
              >
                {loading ? '⏳ बुकिंग हो रही है...' : '✅ FD बुक करें'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Confirmation */}
        {step === 4 && booking && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a6b3c', marginBottom: '8px' }}>
              बधाई हो!
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              आपकी FD सफलतापूर्वक बुक हो गई
            </div>
            <div style={{
              background: '#f0fdf4', borderRadius: '16px', padding: '20px',
              marginBottom: '20px', textAlign: 'left',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  ['बुकिंग ID', booking.booking_id],
                  ['बैंक', booking.bank_name_hindi],
                  ['राशि', booking.principal_formatted],
                  ['ब्याज दर', `${booking.annual_rate}% p.a.`],
                  ['समय', `${booking.tenure_months} महीने`],
                  ['मिलेगा', booking.maturity_formatted],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: '11px', color: '#666' }}>{label}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748' }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <a href={`https://wa.me/?text=${encodeURIComponent(
    `🏦 *FD Booking Confirmed!*\n\n` +
    `📋 Booking ID: ${booking.booking_id}\n` +
    `🏦 Bank: ${booking.bank_name_hindi}\n` +
    `💰 Amount: ${booking.principal_formatted}\n` +
    `📈 Rate: ${booking.annual_rate}% p.a.\n` +
    `📅 Tenure: ${booking.tenure_months} months\n` +
    `✅ Maturity: ${booking.maturity_formatted}\n\n` +
    `🔒 DICGC Insured - Government Guaranteed\n` +
    `Booked via FD Saathi 🎯`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: 'block', width: '100%', padding: '14px',
    background: '#25D366', color: 'white',
    borderRadius: '12px', textDecoration: 'none',
    fontSize: '15px', fontWeight: '600',
    textAlign: 'center', marginBottom: '8px',
  }}
>
  📱 WhatsApp पर Share करें
</a>

            <button onClick={onClose} style={{
              width: '100%', padding: '14px', background: '#1a6b3c',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: '600', cursor: 'pointer',

            }}>
              Done ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;