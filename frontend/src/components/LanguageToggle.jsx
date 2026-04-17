import { LANGUAGES } from '../utils/formatters';

const LanguageToggle = ({ selected, onChange }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '4px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '12px',
    }}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          style={{
            padding: '6px 14px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: selected === lang.code ? '600' : '400',
            background: selected === lang.code
              ? 'white'
              : 'transparent',
            color: selected === lang.code ? '#1a6b3c' : 'rgba(255,255,255,0.85)',
            transition: 'all 0.2s ease',
            boxShadow: selected === lang.code
              ? '0 2px 8px rgba(0,0,0,0.15)'
              : 'none',
          }}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;