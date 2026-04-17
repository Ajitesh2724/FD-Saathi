import { formatINR, tenureLabel } from '../utils/formatters';

const MaturityCard = ({ principal, rate, tenureMonths, bankName }) => {
  const r = rate / 100;
  const n = 4;
  const t = tenureMonths / 12;
  const maturity = principal * Math.pow(1 + r / n, n * t);
  const interest = maturity - principal;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
      borderRadius: '16px',
      padding: '20px',
      color: 'white',
      margin: '8px 0',
      boxShadow: '0 4px 20px rgba(26,107,60,0.3)',
    }}>
      <div style={{ fontSize: '13px', opacity: 0.85, marginBottom: '4px' }}>
        {bankName} • {rate}% p.a. • {tenureLabel(tenureMonths)}
      </div>
      <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
        {formatINR(maturity)}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '13px',
      }}>
        <div>
          <div style={{ opacity: 0.8 }}>आपका पैसा</div>
          <div style={{ fontWeight: '600' }}>{formatINR(principal)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ opacity: 0.8 }}>ब्याज</div>
          <div style={{ fontWeight: '600', color: '#a8ffc4' }}>+{formatINR(interest)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ opacity: 0.8 }}>कुल मिलेगा</div>
          <div style={{ fontWeight: '600' }}>{formatINR(maturity)}</div>
        </div>
      </div>
    </div>
  );
};

export default MaturityCard;