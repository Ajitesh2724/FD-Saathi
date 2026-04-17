import { useState, useCallback } from 'react';
import { sendMessage } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'नमस्ते! मैं एफडी साथी हूँ। 🙏\nआपका पैसा सुरक्षित तरीके से बढ़ाने में मदद करूँगा।\n\nबताइए, कितना पैसा FD में लगाना है? 💰',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [bookingContext, setBookingContext] = useState(null);

  const getHistory = useCallback((msgs) => {
    return msgs
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-10) // last 10 messages for context
      .map((m) => ({ role: m.role, content: m.content }));
  }, []);

  const sendUserMessage = useCallback(async (text) => {
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
      const data = await sendMessage(text, history, bookingContext);

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
        content: 'माफ करें, कुछ तकनीकी दिक्कत आई। थोड़ी देर बाद कोशिश करें। 🙏',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, bookingContext, getHistory]);

  const clearChat = useCallback(() => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: 'नमस्ते! मैं एफडी साथी हूँ। 🙏\nआपका पैसा सुरक्षित तरीके से बढ़ाने में मदद करूँगा।\n\nबताइए, कितना पैसा FD में लगाना है? 💰',
      timestamp: new Date(),
    }]);
    setSessionId(null);
    setBookingContext(null);
  }, []);

  return {
    messages,
    loading,
    sessionId,
    sendUserMessage,
    clearChat,
    setBookingContext,
  };
};