import { LANGUAGES } from '../utils/formatters';

const LanguageToggle = ({ selected, onChange }) => (
  <div style={{
    display: 'inline-flex', gap: '3px', padding: '3px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '10px',
    border: '1px solid rgba(74,222,128,0.1)',
  }}>
    {LANGUAGES.map(lang => (
      <button
        key={lang.code}
        onClick={() => onChange(lang.code)}
        style={{
          padding: '5px 13px', borderRadius: '7px', border: 'none', cursor: 'pointer',
          fontSize: '12px', fontWeight: selected === lang.code ? '600' : '400',
          background: selected === lang.code ? 'rgba(74,222,128,0.15)' : 'transparent',
          color: selected === lang.code ? '#4ade80' : 'rgba(255,255,255,0.38)',
          boxShadow: selected === lang.code ? 'inset 0 0 0 1px rgba(74,222,128,0.3)' : 'none',
          transition: 'all 0.15s',
          fontFamily: "'DM Sans','Noto Sans Devanagari',sans-serif",
          whiteSpace: 'nowrap',
          letterSpacing: '0.2px',
        }}
      >
        {lang.flag} {lang.label}
      </button>
    ))}
  </div>
);

export default LanguageToggle;
