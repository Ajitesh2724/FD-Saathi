import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Send chat message
export const sendMessage = async (message, history = [], bookingContext = null) => {
  const res = await api.post('/api/chat', {
    message,
    history,
    booking_context: bookingContext,
  });
  return res.data;
};

// Get all banks
export const getBanks = async () => {
  const res = await api.get('/api/fd/banks');
  return res.data;
};

// Calculate FD maturity
export const calculateFD = async (principal, annualRate, tenureMonths) => {
  const res = await api.post('/api/fd/calculate', {
    principal,
    annual_rate: annualRate,
    tenure_months: tenureMonths,
  });
  return res.data;
};

// Get bank recommendations
export const getRecommendations = async (principal, tenureMonths) => {
  const res = await api.post('/api/fd/recommend', {
    principal,
    tenure_months: tenureMonths,
  });
  return res.data;
};

// Book FD
export const bookFD = async (bankId, principal, tenureMonths) => {
  const res = await api.post('/api/fd/book', {
    bank_id: bankId,
    principal,
    tenure_months: tenureMonths,
  });
  return res.data;
};