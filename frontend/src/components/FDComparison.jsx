import { formatINR, tenureLabel } from '../utils/formatters';

const FDComparison = ({ banks, principal, tenureMonths, onSelect }) => {
  if (!banks || banks.length === 0) return null;

  return (
    <div style={{ margin: '8px 0' }}>
      <div style={{
        fontSize: '13px',
        color: '#666',
        marginBottom: '8px',
        fontWeight: '500',
      }}>
        {formatINR(principal)} • {tenureLabel(tenureMonths)} के लिए बेस्ट रेट्स
      </div>
      {banks.slice(0, 4).map((bank, i) => {
        const r = bank.rate / 100;
        const t = tenureMonths / 12;
        const maturity = principal * Math.pow(1 + r / 4, 4 * t);

        return (
          <div
            key={bank.bank_id}
            onClick={() => onSelect && onSelect(bank)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              marginBottom: '8px',
              background: i === 0 ? '#f0fdf4' : 'white',
              border: i === 0 ? '1.5px solid #1a6b3c' : '1px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div>
              {i === 0 && (
                <span style={{
                  fontSize: '10px',
                  background: '#1a6b3c',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  marginBottom: '4px',
                  display: 'inline-block',
                }}>
                  ⭐ सबसे अच्छा
                </span>
              )}
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#2d3748',
              }}>
                {bank.bank_name_hindi || bank.bank_name}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                DICGC ✅ सुरक्षित
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1a6b3c',
              }}>
                {bank.rate}%
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {formatINR(maturity)} मिलेंगे
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FDComparison;