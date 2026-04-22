// Format number to Indian Rupee style
export const formatINR = (amount) => {
  const num = Math.round(amount);
  const s = num.toString();
  if (s.length <= 3) return `₹${s}`;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `₹${formatted},${last3}`;
};

// Tenure months to readable label
export const tenureLabel = (months) => {
  if (months < 12) return `${months} महीने`;    
  if (months === 12) return `1 साल`;   
  if (months === 24) return `2 साल`;
  if (months === 36) return `3 साल`;
  return `${months} महीने`;
};

// Language display names
export const LANGUAGES = [
  { code: 'hindi',    label: 'हिंदी',    flag: '🇮🇳' },
  { code: 'english',  label: 'English',  flag: '🇬🇧' },
  { code: 'bhojpuri', label: 'भोजपुरी', flag: '' },
  { code: 'awadhi',   label: 'अवधी',    flag: '' },
];

// Suggested questions per language
export const SUGGESTIONS = {
  hindi: [
    'FD क्या होता है?',
    'सबसे अच्छा ब्याज दर कौन सा बैंक देता है?',
    'मेरा पैसा सुरक्षित रहेगा?',
    '₹50,000 पर कितना मिलेगा?',
  ],
  english: [
    'What is a Fixed Deposit?',
    'Which bank gives the best FD rate?',
    'Is my money safe in Small Finance Banks?',
    'How much will I earn on ₹50,000?',
  ],
  bhojpuri: [
    'FD का मतलब का बा?',
    'पईसा कतना बढ़ी?',
    'कौन बैंक सबसे अच्छा बा?',
    'पईसा सुरक्षित रही?',
  ],
  awadhi: [
    'FD का मतलब का होत है?',
    'पैसा कितना बढ़ी?',
    'कौन बैंक अच्छा है?',
    'पैसा सुरक्षित रही?',
  ],
};