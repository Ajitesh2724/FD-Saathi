import { useState, useCallback, useEffect, useRef } from 'react';
import { sendMessage } from '../services/api';

// ── Storage keys ──────────────────────────────────────────────────────────────
const STORAGE_KEY      = 'fd_saathi_chat_history';
const STORAGE_LANG_KEY = 'fd_saathi_language';
const MAX_STORED       = 50;

// ── Strip [LANGUAGE: ...] prefix before storing/sending history ───────────────
// This prevents history from being contaminated with language instructions,
// which confuses Gemini and causes API errors on subsequent turns.
const stripLanguagePrefix = (content) =>
  typeof content === 'string'
    ? content.replace(/^\[LANGUAGE:[^\]]*\]\n?/i, '').trim()
    : content;

// ── Error messages per language ───────────────────────────────────────────────
const ERROR_MESSAGES = {
  hindi:   'माफ करें, कुछ तकनीकी दिक्कत आई। थोड़ी देर बाद कोशिश करें। 🙏',
  english: 'Sorry, a technical issue occurred. Please try again in a moment. 🙏',
  bhojpuri:'माफ करीं, कुछ तकनीकी दिक्कत आ गइल। थोड़ी देर बाद कोशिश करीं। 🙏',
  awadhi:  'माफ करें, कुछ तकनीकी दिक्कत आई। थोड़ी देर बाद कोशिश करें। 🙏',
};

// ── Welcome message ───────────────────────────────────────────────────────────
const getWelcomeMessage = (lang) => {
  const messages = {
    hindi:   'नमस्ते! मैं एफडी साथी हूँ। 🙏\nआपका पैसा सुरक्षित तरीके से बढ़ाने में मदद करूँगा।\n\nबताइए, कितना पैसा FD में लगाना है? 💰',
    english: "Hello! I'm FD Saathi, your personal FD advisor. 🙏\nI'll help you grow your money safely across India.\n\nHow much would you like to invest in an FD? 💰",
    bhojpuri:'प्रणाम! हम एफडी साथी हईं। 🙏\nरउआ के पईसा सुरक्षित तरीके से बढ़ावे में मदद करब।\n\nबताईं, केतना पईसा FD में लगावे के बा? 💰',
    awadhi:  'नमस्कार! मैं एफडी साथी हूँ। 🙏\nआपका पैसा बढ़ाने में मदद करूँगा।\n\nबताइए, कितना पैसा FD में लगाना है? 💰',
  };
  return messages[lang] || messages.hindi;
};

const makeWelcome = (lang) => ({
  id: 1,
  role: 'assistant',
  content: getWelcomeMessage(lang),
  timestamp: new Date(),
});

// ── localStorage helpers ──────────────────────────────────────────────────────
const serializeMessages = (messages) =>
  messages.slice(-MAX_STORED).map((m) => ({
    ...m,
    timestamp: m.timestamp instanceof Date
      ? m.timestamp.toISOString()
      : (typeof m.timestamp === 'string' ? m.timestamp : new Date().toISOString()),
  }));

const deserializeMessages = (messages) =>
  messages.map((m) => ({
    ...m,
    timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
  }));

const loadPersistedChat = (language) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.messages || !Array.isArray(parsed.messages) || parsed.messages.length === 0) return null;
    // If only the welcome message exists AND language differs → show fresh welcome
    // This ensures switching language shows the correct greeting
    if (parsed.language && parsed.language !== language && parsed.messages.length <= 1) {
      return null;
    }
    const msgs = deserializeMessages(parsed.messages);
    return msgs.map((m) => ({
      ...m,
      timestamp: m.timestamp instanceof Date && !isNaN(m.timestamp) ? m.timestamp : new Date(),
    }));
  } catch {
    return null;
  }
};

const persistChat = (messages, language) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      messages: serializeMessages(messages),
      language,
      savedAt: new Date().toISOString(),
    }));
  } catch {
    // localStorage full or unavailable — fail silently
  }
};

const persistLanguage = (lang) => {
  try { localStorage.setItem(STORAGE_LANG_KEY, lang); } catch { /* ignore */ }
};

export const loadPersistedLanguage = () => {
  try { return localStorage.getItem(STORAGE_LANG_KEY) || 'hindi'; } catch { return 'hindi'; }
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useChat = (language = 'hindi') => {
  const isFirstRender  = useRef(true);
  // ── Always-current messages ref (fixes stale closure in sendUserMessage) ──
  const messagesRef    = useRef([]);

  // Initialize with persisted chat or fresh welcome
  const [messages, setMessages] = useState(() => {
    const persisted = loadPersistedChat(language);
    return persisted ?? [makeWelcome(language)];
  });

  const [loading, setLoading]              = useState(false);
  const [sessionId, setSessionId]          = useState(null);
  const [bookingContext, setBookingContext] = useState(null);

  // Keep ref in sync + persist whenever messages change (skip first render)
  useEffect(() => {
    messagesRef.current = messages;
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    persistChat(messages, language);
  }, [messages, language]);

  // Persist language preference whenever it changes
  useEffect(() => { persistLanguage(language); }, [language]);
  // Reset greeting when language changes and chat only has welcome message
  useEffect(() => {
    const currentMsgs = messagesRef.current;
    if (currentMsgs.length <= 1) {
      setMessages([makeWelcome(language)]);
    }
  }, [language]);

  // Build clean history for the API — strip language prefixes from stored messages
  // so Gemini never sees the [LANGUAGE: ...] instruction noise in history
  const getHistory = useCallback((msgs) =>
    msgs
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-6)   // 6 msgs = ~300 tokens vs 10 msgs = ~500 tokens
      .map((m) => ({
        role: m.role,
        content: stripLanguagePrefix(m.content),
      })),
  []);

  const sendUserMessage = useCallback(async (text, lang = 'hindi') => {
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      // Store the CLEAN text (no language prefix) so history stays readable
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Use ref for history — always reflects latest messages, never stale
      const history = getHistory(messagesRef.current);

      // Prepend language instruction ONLY in the live API call, never in storage
      const langInstruction = {
        hindi:   'Respond in Hindi (Devanagari script).',
        english: 'Respond in English only.',
        bhojpuri:'Respond in Bhojpuri dialect only.',
        awadhi:  'Respond in Awadhi dialect only.',
      };
      const enrichedMessage = `[LANGUAGE: ${langInstruction[lang] || langInstruction.hindi}]\n${text}`;

      const data = await sendMessage(enrichedMessage, history, bookingContext);

      // Guard: backend may return { response: null, error: "..." } on Gemini failure
      if (!data || !data.response) {
        throw new Error(data?.error || 'Empty response from server');
      }

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      if (data.session_id) setSessionId(data.session_id);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err?.response?.data || err?.message || err);
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: ERROR_MESSAGES[lang] || ERROR_MESSAGES.hindi,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [loading, bookingContext, getHistory]);

  const clearChat = useCallback(() => {
    const fresh = [makeWelcome(language)];
    setMessages(fresh);
    setSessionId(null);
    setBookingContext(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
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
