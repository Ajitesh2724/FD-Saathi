import { useEffect, useState } from 'react';

const DEMO_SCRIPT = {
  hindi: [
    { role: 'user',      text: 'यह "Suryoday Small Finance Bank — 8.50% p.a. — 12M tenor" का क्या मतलब है?' },
    { role: 'assistant', text: 'नमस्ते! 🙏 बिल्कुल सरल भाषा में समझाता हूँ:\n\n🏦 **Suryoday Small Finance Bank** — यह एक RBI approved bank है, बिल्कुल safe।\n\n💰 **8.50% p.a.** — मतलब आपके हर ₹100 पर साल में ₹8.50 मिलेंगे। जैसे किसी दोस्त को ₹100 उधार दिया और उसने ₹108.50 वापस किए!\n\n📅 **12M tenor** — मतलब 12 महीने (1 साल) के लिए पैसा रखना है।\n\nसीधे शब्दों में: आप पैसा रखो, बैंक उसे बढ़ाकर वापस करेगा! 💪', delay: 1500 },
    { role: 'user',      text: 'मेरा ₹50,000 कितना बन जाएगा 1 साल में?' },
    { role: 'assistant', text: '₹50,000 पर 8.50% की दर से 1 साल में:\n\n💰 आपका पैसा: ₹50,000\n📈 ब्याज मिलेगा: ₹4,387\n✅ कुल मिलेगा: ₹54,387\n\nयानी बिना कुछ किए ₹4,387 का फायदा! और यह पैसा 100% सुरक्षित है — सरकार की DICGC guarantee है ₹5 लाख तक। 🔒\n\nक्या आप FD बुक करना चाहते हैं?', delay: 1500 },
    { role: 'user',      text: 'हाँ! लेकिन पैसा डूब तो नहीं जाएगा?' },
    { role: 'assistant', text: 'बिल्कुल नहीं! ✅ 100% safe है!\n\n🛡️ **DICGC Insurance** — भारत सरकार की guarantee है। अगर बैंक को कुछ भी हो जाए, तो भी आपका ₹5 लाख तक का पैसा सुरक्षित रहेगा।\n\n📋 Suryoday Bank RBI से licensed है और लाखों customers का भरोसा है।\n\nनिश्चिंत रहिए — FD भारत का सबसे safe investment है! अभी बुक करें? 💪', delay: 1500 },
  ],
  english: [
    { role: 'user',      text: 'What does "Suryoday Small Finance Bank — 8.50% p.a. — 12M tenor" mean?' },
    { role: 'assistant', text: 'Hello! 🙏 Let me explain this simply:\n\n🏦 **Suryoday Small Finance Bank** — An RBI approved bank, completely safe.\n\n💰 **8.50% p.a.** — Means you earn ₹8.50 for every ₹100 you deposit per year. Like lending ₹100 to a friend who returns ₹108.50!\n\n📅 **12M tenor** — Means you keep the money for 12 months (1 year).\n\nSimply put: You deposit money, bank grows it and returns it! 💪', delay: 1500 },
    { role: 'user',      text: 'How much will my ₹50,000 become in 1 year?' },
    { role: 'assistant', text: 'On ₹50,000 at 8.50% for 1 year:\n\n💰 Your deposit: ₹50,000\n📈 Interest earned: ₹4,387\n✅ Total you get: ₹54,387\n\nThat\'s ₹4,387 earned without doing anything! And your money is 100% safe — Government\'s DICGC guarantees up to ₹5 lakh. 🔒\n\nWould you like to book this FD?', delay: 1500 },
    { role: 'user',      text: 'Yes! But is my money really safe?' },
    { role: 'assistant', text: 'Absolutely! ✅ 100% safe!\n\n🛡️ **DICGC Insurance** — Government of India guarantee. Even if anything happens to the bank, your money up to ₹5 lakh is protected.\n\n📋 Suryoday Bank is RBI licensed and trusted by millions of customers.\n\nRest assured — FD is India\'s safest investment! Book now? 💪', delay: 1500 },
  ],
  bhojpuri: [
    { role: 'user',      text: '"Suryoday Small Finance Bank — 8.50% p.a. — 12M tenor" — ई का होला?' },
    { role: 'assistant', text: 'प्रणाम! 🙏 हम बताइत हईं एकदम सरल भाषा में:\n\n🏦 **Suryoday Small Finance Bank** — ई RBI के मान्यता प्राप्त बैंक बा, एकदम safe बा।\n\n💰 **8.50% p.a.** — मतलब रउआ के हर ₹100 पर साल में ₹8.50 मिली। जइसे कवनो दोस्त के ₹100 उधार दिहला आ ऊ ₹108.50 वापस कइलस!\n\n📅 **12M tenor** — मतलब 12 महीना के लिए पईसा रखे के बा।\n\nसीधे बात: पईसा रखा, बैंक बढ़ाके वापस करी! 💪', delay: 1500 },
    { role: 'user',      text: 'हमार ₹50,000 केतना बनी 1 साल में?' },
    { role: 'assistant', text: '₹50,000 पर 8.50% के दर से 1 साल में:\n\n💰 रउआ के पईसा: ₹50,000\n📈 ब्याज मिली: ₹4,387\n✅ कुल मिली: ₹54,387\n\nमतलब बिना कुछ कइले ₹4,387 के फायदा! आ ई पईसा 100% सुरक्षित बा — सरकार के DICGC guarantee बा ₹5 लाख तक। 🔒', delay: 1500 },
    { role: 'user',      text: 'ठीक बा! लेकिन पईसा डूब त नाहीं जाई?' },
    { role: 'assistant', text: 'बिल्कुल नाहीं! ✅ 100% safe बा!\n\n🛡️ **DICGC Insurance** — भारत सरकार के guarantee बा। बैंक के कुछ भी हो जाय, रउआ के ₹5 लाख तक के पईसा सुरक्षित रही।\n\n📋 Suryoday Bank RBI से licensed बा आ लाखन customers के भरोसा बा।\n\nनिश्चिंत रहीं — FD भारत के सबसे safe investment हवे! अभी बुक करीं? 💪', delay: 1500 },
  ],
  awadhi: [
    { role: 'user',      text: '"Suryoday Small Finance Bank — 8.50% p.a. — 12M tenor" — ई का होत है?' },
    { role: 'assistant', text: 'नमस्कार! 🙏 हम बताइत हई एकदम सरल भाषा में:\n\n🏦 **Suryoday Small Finance Bank** — ई RBI के मान्यता प्राप्त बैंक है, एकदम safe है।\n\n💰 **8.50% p.a.** — मतलब आपके हर ₹100 पर साल में ₹8.50 मिली। जइसे कवनो दोस्त के ₹100 उधार दिहा आ ऊ ₹108.50 वापस करिस!\n\n📅 **12M tenor** — मतलब 12 महीना खातिर पैसा रखे के है।\n\nसीधी बात: पैसा रखा, बैंक बढ़ाके वापस करी! 💪', delay: 1500 },
    { role: 'user',      text: 'हमार ₹50,000 कितना बनी 1 साल में?' },
    { role: 'assistant', text: '₹50,000 पर 8.50% के दर से 1 साल में:\n\n💰 आपका पैसा: ₹50,000\n📈 ब्याज मिली: ₹4,387\n✅ कुल मिली: ₹54,387\n\nमतलब बिना कुछ करे ₹4,387 के फायदा! आ ई पैसा 100% सुरक्षित है — सरकार के DICGC guarantee है ₹5 लाख तक। 🔒', delay: 1500 },
    { role: 'user',      text: 'ठीक है! लेकिन पैसा डूब त नाहीं जाई?' },
    { role: 'assistant', text: 'बिल्कुल नाहीं! ✅ 100% safe है!\n\n🛡️ **DICGC Insurance** — भारत सरकार के guarantee है। बैंक के कुछ भी हो जाय, आपका ₹5 लाख तक के पैसा सुरक्षित रही।\n\n📋 Suryoday Bank RBI से licensed है आ लाखन customers के भरोसा है।\n\nनिश्चिंत रहीं — FD भारत के सबसे safe investment है! अभी बुक करीं? 💪', delay: 1500 },
  ],
};

const DemoMode = ({ onClose, onInjectMessages, language = 'hindi' }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  const script = DEMO_SCRIPT[language] || DEMO_SCRIPT.hindi;

  const LABELS = {
    hindi:   { title: 'डेमो मोड', subtitle: 'देखें FD Saathi कैसे काम करता है', start: '▶ डेमो शुरू करें', running: '⏳ चल रहा है...', done: '✅ डेमो पूरा हुआ!', close: 'बंद करें', step: 'चरण', of: 'में से' },
    english: { title: 'Demo Mode', subtitle: 'See how FD Saathi works', start: '▶ Start Demo', running: '⏳ Running...', done: '✅ Demo Complete!', close: 'Close', step: 'Step', of: 'of' },
    bhojpuri:{ title: 'डेमो मोड', subtitle: 'देखीं FD Saathi कइसे काम करेला', start: '▶ डेमो शुरू करीं', running: '⏳ चलत बा...', done: '✅ डेमो पूरा भइल!', close: 'बंद करीं', step: 'चरण', of: 'में से' },
    awadhi:  { title: 'डेमो मोड', subtitle: 'देखीं FD Saathi कइसे काम करत है', start: '▶ डेमो शुरू करीं', running: '⏳ चलत है...', done: '✅ डेमो पूरा भा!', close: 'बंद करें', step: 'चरण', of: 'में से' },
  };

  const L = LABELS[language] || LABELS.hindi;

  const runDemo = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setDone(false);
    onInjectMessages([]); // clear chat first

    for (let i = 0; i < script.length; i++) {
      const step = script[i];
      setCurrentStep(i + 1);

      // Typing delay based on message length
      const typingDelay = Math.min(step.text.length * 18, 2500);

      await new Promise((r) => setTimeout(r, 600));
      onInjectMessages((prev) => [
        ...prev,
        {
          id: Date.now() + i,
          role: step.role,
          content: step.text,
          timestamp: new Date(),
          isDemo: true,
        },
      ]);
      await new Promise((r) => setTimeout(r, typingDelay + (step.delay || 1000)));
    }

    setIsRunning(false);
    setDone(true);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '16px',
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        width: '100%', maxWidth: '400px',
        padding: '28px', textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px',
        }}>
          🎬
        </div>

        <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a6b3c', marginBottom: '8px' }}>
          {L.title}
        </div>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
          {L.subtitle}
        </div>

        {/* Progress */}
        {isRunning && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '13px', color: '#666', marginBottom: '8px',
            }}>
              {L.step} {currentStep} {L.of} {script.length}
            </div>
            <div style={{
              height: '6px', background: '#e2e8f0',
              borderRadius: '3px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: '3px',
                background: 'linear-gradient(90deg, #1a6b3c, #2d9e5f)',
                width: `${(currentStep / script.length) * 100}%`,
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* Done message */}
        {done && (
          <div style={{
            padding: '12px', background: '#f0fdf4',
            borderRadius: '10px', marginBottom: '16px',
            fontSize: '14px', color: '#1a6b3c', fontWeight: '600',
          }}>
            {L.done}
          </div>
        )}

        {/* Script preview */}
        {!isRunning && !done && (
          <div style={{
            background: '#f8f9fa', borderRadius: '12px',
            padding: '16px', marginBottom: '20px', textAlign: 'left',
          }}>
            {script.map((step, i) => (
              <div key={i} style={{
                display: 'flex', gap: '8px', marginBottom: '8px',
                alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>
                  {step.role === 'user' ? '👤' : '🏦'}
                </span>
                <span style={{
                  fontSize: '12px', color: '#555',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {step.text.slice(0, 50)}...
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px',
              background: '#f5f5f5', border: 'none',
              borderRadius: '12px', cursor: 'pointer',
              fontSize: '14px', color: '#555',
            }}
          >
            {L.close}
          </button>
          {!done && (
            <button
              onClick={runDemo}
              disabled={isRunning}
              style={{
                flex: 2, padding: '12px',
                background: isRunning
                  ? '#ccc'
                  : 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
                border: 'none', borderRadius: '12px',
                cursor: isRunning ? 'default' : 'pointer',
                fontSize: '14px', fontWeight: '700', color: 'white',
              }}
            >
              {isRunning ? L.running : L.start}
            </button>
          )}
          {done && (
            <button
              onClick={runDemo}
              style={{
                flex: 2, padding: '12px',
                background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
                border: 'none', borderRadius: '12px',
                cursor: 'pointer', fontSize: '14px',
                fontWeight: '700', color: 'white',
              }}
            >
              🔄 फिर चलाएं
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoMode;