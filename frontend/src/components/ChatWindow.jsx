import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import LanguageToggle from './LanguageToggle';
import BookingFlow from './BookingFlow';
import { SUGGESTIONS } from '../utils/formatters';

const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
    }}>🏦</div>
    <div style={{
      background: 'white', padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e8f5ee',
      display: 'flex', gap: '4px', alignItems: 'center',
    }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#1a6b3c', opacity: 0.6,
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  </div>
);

const ChatWindow = () => {
  const { messages, loading, sendUserMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('hindi');
  const [showBooking, setShowBooking] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendUserMessage(input);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text) => {
    sendUserMessage(text);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', background: '#f0fdf4',
      fontFamily: '"Noto Sans Devanagari", "Segoe UI", sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c6f6d5; border-radius: 2px; }
        input:focus { border-color: #1a6b3c !important; outline: none; }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a6b3c 0%, #2d9e5f 100%)',
        padding: '16px 20px',
        boxShadow: '0 2px 20px rgba(26,107,60,0.3)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', border: '2px solid rgba(255,255,255,0.4)',
            }}>🏦</div>
            <div>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>
                एफडी साथी
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                🟢 आपका FD सलाहकार • Gorakhpur
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            style={{
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              color: 'white', padding: '6px 12px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '12px',
            }}
          >
            नया चैट
          </button>
        </div>
        <LanguageToggle selected={language} onChange={setLanguage} />
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
      }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && !loading && (
        <div style={{
          padding: '0 16px 8px',
          display: 'flex', gap: '8px', overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {SUGGESTIONS[language]?.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              style={{
                flexShrink: 0, padding: '8px 14px',
                background: 'white', border: '1px solid #c6f6d5',
                borderRadius: '20px', cursor: 'pointer',
                fontSize: '13px', color: '#1a6b3c', whiteSpace: 'nowrap',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Book FD Button */}
      <div style={{ padding: '0 16px 8px' }}>
        <button
          onClick={() => setShowBooking(true)}
          style={{
            width: '100%', padding: '12px',
            background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '15px', fontWeight: '600', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(26,107,60,0.3)',
          }}
        >
          📋 FD अभी बुक करें
        </button>
      </div>

      {/* Input */}
      <div style={{
        padding: '8px 16px 16px',
        background: 'white',
        borderTop: '1px solid #e8f5ee',
        display: 'flex', gap: '10px', alignItems: 'flex-end',
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="अपना सवाल यहाँ लिखें..."
          rows={1}
          style={{
            flex: 1, padding: '12px 16px',
            border: '2px solid #e2e8f0', borderRadius: '24px',
            fontSize: '15px', resize: 'none', fontFamily: 'inherit',
            lineHeight: '1.5', maxHeight: '100px', overflowY: 'auto',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{
            width: '46px', height: '46px', borderRadius: '50%',
            background: input.trim() ? 'linear-gradient(135deg, #1a6b3c, #2d9e5f)' : '#e2e8f0',
            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            fontSize: '20px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? '⏳' : '➤'}
        </button>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingFlow
          onClose={() => setShowBooking(false)}
          onSendMessage={sendUserMessage}
        />
      )}
    </div>
  );
};

export default ChatWindow;