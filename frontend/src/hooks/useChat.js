import { useState, useCallback, useEffect } from 'react';
import { sendMessage } from '../services/api';

const getWelcomeMessage = (lang) => {
  const messages = {
    hindi: 'नमस्ते! मैं एफडी साथी हूँ। 🙏\nआपका पैसा सुरक्षित तरीके से बढ़ाने में मदद करूँगा।\n\nबताइए, कितना पैसा FD में लगाना है? 💰',
    english: "Hello! I'm FD Saathi, your personal FD advisor. 🙏\nI'll help you grow your money safely across India.\n\nHow much would you like to invest in an FD? 💰",
    bhojpuri: 'प्रणाम! हम एफडी साथी हईं। 🙏\nरउआ के पईसा सुरक्षित तरीके से बढ़ावे में मदद करब।\n\nबताईं, केतना पईसा FD में लगावे के बा? 💰',
    awadhi: 'नमस्कार! मैं एफडी साथी हूँ। 🙏\nआपका पैसा बढ़ाने में मदद करूँगा।\n\nबताइए, कितना पैसा FD में लगाना है? 💰',
  };
  return messages[lang] || messages.hindi;
};

const makeWelcome = (lang) => ({
  id: 1,
  role: 'assistant',
  content: getWelcomeMessage(lang),
  timestamp: new Date(),
});

export const useChat = (language = 'hindi') => {
  const [messages, setMessages] = useState([makeWelcome(language)]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [bookingContext, setBookingContext] = useState(null);

  // Reset welcome message when language changes
  useEffect(() => {
    setMessages([makeWelcome(language)]);
    setSessionId(null);
    setBookingContext(null);
  }, [language]);

  const getHistory = useCallback((msgs) => {
    return msgs
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));
  }, []);

  const sendUserMessage = useCallback(async (text, lang = 'hindi') => {
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = getHistory(messages);
      const langInstruction = {
        hindi: 'Respond in Hindi (Devanagari script).',
        english: 'Respond in English only.',
        bhojpuri: 'Respond in Bhojpuri dialect only.',
        awadhi: 'Respond in Awadhi dialect only.',
      };
      const enrichedMessage = `[LANGUAGE: ${langInstruction[lang] || langInstruction.hindi}]\n${text}`;
      const data = await sendMessage(enrichedMessage, history, bookingContext);

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      if (data.session_id) setSessionId(data.session_id);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: lang === 'english'
          ? 'Sorry, technical issue. Please try again. 🙏'
          : 'माफ करें, कुछ तकनीकी दिक्कत आई। थोड़ी देर बाद कोशिश करें। 🙏',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, bookingContext, getHistory]);

  const clearChat = useCallback(() => {
    setMessages([makeWelcome(language)]);
    setSessionId(null);
    setBookingContext(null);
  }, [language]);

  return {
    messages,
    loading,
    sessionId,
    sendUserMessage,
    clearChat,
    setBookingContext,
    setMessages,
  };
};