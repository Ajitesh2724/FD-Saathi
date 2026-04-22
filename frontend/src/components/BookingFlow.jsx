import { useState } from 'react';
import { bookFD } from '../services/api';
import { formatINR } from '../utils/formatters';

// ── ALL BANKS (mirrors fd_data.py exactly) ────────────────────────────────────
const ALL_BANKS = [
  {
    id: 'suryoday', category: 'sfb',
    name: 'Suryoday Small Finance Bank', nameHindi: 'सूर्योदय SFB',
    minAmount: 1000, highlight: true,
    rates: [
      { months: 6,  label: '6M',  labelHindi: '6 महीने',  labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने',  rate: 6.50 },
      { months: 12, label: '1Y',  labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 7.90 },
      { months: 24, label: '2Y',  labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 8.10 },
      { months: 36, label: '3Y',  labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 7.75 },
      { months: 60, label: '5Y',  labelHindi: '5 साल',   labelBhojpuri: '5 साल',   labelAwadhi: '5 साल',   rate: 7.50 },
    ],
  },
  {
    id: 'unity', category: 'sfb',
    name: 'Unity Small Finance Bank', nameHindi: 'यूनिटी SFB',
    minAmount: 1000, highlight: false,
    rates: [
      { months: 6,  label: '6M',  labelHindi: '6 महीने',  labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने',  rate: 7.00 },
      { months: 12, label: '1Y',  labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 7.85 },
      { months: 24, label: '2Y',  labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 8.00 },
      { months: 36, label: '3Y',  labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 7.65 },
      { months: 60, label: '5Y',  labelHindi: '5 साल',   labelBhojpuri: '5 साल',   labelAwadhi: '5 साल',   rate: 7.25 },
    ],
  },
  {
    id: 'jana', category: 'sfb',
    name: 'Jana Small Finance Bank', nameHindi: 'जना SFB',
    minAmount: 1000, highlight: false,
    rates: [
      { months: 6,  label: '6M',  labelHindi: '6 महीने',  labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने',  rate: 6.50 },
      { months: 12, label: '1Y',  labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 7.77 },
      { months: 24, label: '2Y',  labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 7.77 },
      { months: 36, label: '3Y',  labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 7.50 },
      { months: 60, label: '5Y',  labelHindi: '5 साल',   labelBhojpuri: '5 साल',   labelAwadhi: '5 साल',   rate: 7.25 },
    ],
  },
  {
    id: 'utkarsh', category: 'sfb',
    name: 'Utkarsh Small Finance Bank', nameHindi: 'उत्कर्ष SFB',
    minAmount: 500, highlight: false,
    rates: [
      { months: 6,  label: '6M',  labelHindi: '6 महीने',  labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने',  rate: 6.25 },
      { months: 12, label: '1Y',  labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 7.25 },
      { months: 24, label: '2Y',  labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 7.25 },
      { months: 36, label: '3Y',  labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 7.00 },
      { months: 60, label: '5Y',  labelHindi: '5 साल',   labelBhojpuri: '5 साल',   labelAwadhi: '5 साल',   rate: 6.75 },
    ],
  },
  {
    id: 'ujjivan', category: 'sfb',
    name: 'Ujjivan Small Finance Bank', nameHindi: 'उज्जीवन SFB',
    minAmount: 1000, highlight: false,
    rates: [
      { months: 6,  label: '6M',  labelHindi: '6 महीने',  labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने',  rate: 5.50 },
      { months: 12, label: '1Y',  labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 7.25 },
      { months: 24, label: '2Y',  labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 7.45 },
      { months: 36, label: '3Y',  labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 7.25 },
      { months: 60, label: '5Y',  labelHindi: '5 साल',   labelBhojpuri: '5 साल',   labelAwadhi: '5 साल',   rate: 6.50 },
    ],
  },
  {
    id: 'au', category: 'sfb',
    name: 'AU Small Finance Bank', nameHindi: 'AU SFB',
    minAmount: 1000, highlight: false,
    rates: [
      { months: 6,  label: '6M',  labelHindi: '6 महीने',  labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने',  rate: 6.50 },
      { months: 12, label: '1Y',  labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 7.10 },
      { months: 24, label: '2Y',  labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 7.25 },
      { months: 36, label: '3Y',  labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 7.25 },
      { months: 60, label: '5Y',  labelHindi: '5 साल',   labelBhojpuri: '5 साल',   labelAwadhi: '5 साल',   rate: 7.00 },
    ],
  },
  {
    id: 'equitas', category: 'sfb',
    name: 'Equitas Small Finance Bank', nameHindi: 'इक्विटास SFB',
    minAmount: 5000, highlight: false,
    rates: [
      { months: 6,  label: '6M',  labelHindi: '6 महीने',  labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने',  rate: 6.25 },
      { months: 12, label: '1Y',  labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 7.00 },
      { months: 24, label: '2Y',  labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 7.00 },
      { months: 36, label: '3Y',  labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 7.00 },
      { months: 60, label: '5Y',  labelHindi: '5 साल',   labelBhojpuri: '5 साल',   labelAwadhi: '5 साल',   rate: 6.75 },
    ],
  },
  {
    id: 'esaf', category: 'sfb',
    name: 'ESAF Small Finance Bank', nameHindi: 'ESAF SFB',
    minAmount: 1000, highlight: false,
    rates: [
      { months: 6,  label: '6M',  labelHindi: '6 महीने',  labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने',  rate: 6.00 },
      { months: 12, label: '1Y',  labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 6.00 },
      { months: 24, label: '2Y',  labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 6.00 },
      { months: 36, label: '3Y',  labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 6.00 },
      { months: 60, label: '5Y',  labelHindi: '5 साल',   labelBhojpuri: '5 साल',   labelAwadhi: '5 साल',   rate: 6.00 },
    ],
  },
  // Private Banks
  {
    id: 'bandhan', category: 'private',
    name: 'Bandhan Bank', nameHindi: 'बंधन बैंक',
    minAmount: 1000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 5.50 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 7.15 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 7.25 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 7.25 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 7.00 },
    ],
  },
  {
    id: 'rbl', category: 'private',
    name: 'RBL Bank', nameHindi: 'आरबीएल बैंक',
    minAmount: 5000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 6.50 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 7.00 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 7.10 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 7.20 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 7.20 },
    ],
  },
  {
    id: 'yes', category: 'private',
    name: 'Yes Bank', nameHindi: 'यस बैंक',
    minAmount: 10000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 6.25 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 7.00 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 7.00 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 7.00 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 7.00 },
    ],
  },
  {
    id: 'dcb', category: 'private',
    name: 'DCB Bank', nameHindi: 'डीसीबी बैंक',
    minAmount: 10000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 6.75 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 7.10 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 7.25 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 7.25 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 7.10 },
    ],
  },
  {
    id: 'kotak', category: 'private',
    name: 'Kotak Mahindra Bank', nameHindi: 'कोटक महिंद्रा बैंक',
    minAmount: 5000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 6.00 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 6.40 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 6.70 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 6.70 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 6.70 },
    ],
  },
  {
    id: 'hdfc', category: 'private',
    name: 'HDFC Bank', nameHindi: 'एचडीएफसी बैंक',
    minAmount: 5000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 5.75 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 6.35 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 6.50 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 6.50 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 6.50 },
    ],
  },
  {
    id: 'icici', category: 'private',
    name: 'ICICI Bank', nameHindi: 'आईसीआईसीआई बैंक',
    minAmount: 10000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 5.50 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 6.40 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 6.50 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 6.50 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 6.50 },
    ],
  },
  {
    id: 'axis', category: 'private',
    name: 'Axis Bank', nameHindi: 'एक्सिस बैंक',
    minAmount: 5000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 5.75 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 6.30 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 6.45 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 6.45 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 6.45 },
    ],
  },
  // Govt Banks
  {
    id: 'sbi', category: 'govt',
    name: 'State Bank of India', nameHindi: 'भारतीय स्टेट बैंक',
    minAmount: 1000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 5.50 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 6.30 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 6.40 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 6.40 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 6.45 },
    ],
  },
  {
    id: 'pnb', category: 'govt',
    name: 'Punjab National Bank', nameHindi: 'पंजाब नेशनल बैंक',
    minAmount: 1000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 5.50 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 6.25 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 6.50 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 6.60 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 6.50 },
    ],
  },
  {
    id: 'bob', category: 'govt',
    name: 'Bank of Baroda', nameHindi: 'बैंक ऑफ बड़ौदा',
    minAmount: 1000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 5.50 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 6.25 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 6.40 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 6.60 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 6.50 },
    ],
  },
  {
    id: 'canara', category: 'govt',
    name: 'Canara Bank', nameHindi: 'केनरा बैंक',
    minAmount: 1000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 5.50 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 6.25 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 6.50 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 6.60 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 6.50 },
    ],
  },
  {
    id: 'union', category: 'govt',
    name: 'Union Bank of India', nameHindi: 'यूनियन बैंक ऑफ इंडिया',
    minAmount: 1000, highlight: false,
    rates: [
      { months: 6,  label: '6M', labelHindi: '6 महीने', labelBhojpuri: '6 महीना', labelAwadhi: '6 महीने', rate: 5.50 },
      { months: 12, label: '1Y', labelHindi: '12 महीने', labelBhojpuri: '12 महीना', labelAwadhi: '12 महीने', rate: 6.30 },
      { months: 24, label: '2Y', labelHindi: '24 महीने', labelBhojpuri: '24 महीना', labelAwadhi: '24 महीने', rate: 6.50 },
      { months: 36, label: '3Y', labelHindi: '36 महीने', labelBhojpuri: '36 महीना', labelAwadhi: '36 महीने', rate: 6.60 },
      { months: 60, label: '5Y', labelHindi: '5 साल', labelBhojpuri: '5 साल', labelAwadhi: '5 साल', rate: 6.50 },
    ],
  },
];

const CATEGORY_LABELS = {
  sfb:     { hindi: '⭐ स्मॉल फाइनेंस बैंक', english: '⭐ Small Finance Banks', bhojpuri: '⭐ स्मॉल फाइनेंस बैंक', awadhi: '⭐ स्मॉल फाइनेंस बैंक' },
  private: { hindi: '🏦 प्राइवेट बैंक',        english: '🏦 Private Banks',        bhojpuri: '🏦 प्राइवेट बैंक',        awadhi: '🏦 प्राइवेट बैंक' },
  govt:    { hindi: '🏛️ सरकारी बैंक',          english: '🏛️ Public Sector Banks',  bhojpuri: '🏛️ सरकारी बैंक',          awadhi: '🏛️ सरकारी बैंक' },
};

// ── TDS CALCULATOR ────────────────────────────────────────────────────────────
const calcTDS = (interestEarned, tenureMonths, isSenior) => {
  const years = tenureMonths / 12;
  const annualInterest = interestEarned / years;
  const threshold = isSenior ? 50000 : 40000;
  const tdsRate = 0.10; // 10% TDS (20% without PAN, we assume PAN)
  const tdsApplies = annualInterest > threshold;
  const tdsAmount = tdsApplies ? Math.round((annualInterest - 0) * tdsRate * years) : 0;
  // Form 15G: non-senior, total income below taxable limit
  // Form 15H: senior citizen, income below taxable limit
  return { annualInterest: Math.round(annualInterest), threshold, tdsApplies, tdsAmount, tdsRate: 10 };
};

// ── MATURITY CALC ─────────────────────────────────────────────────────────────
const calcMaturity = (principal, rate, months) => {
  const maturity = principal * Math.pow(1 + rate / 400, (months / 12) * 4);
  return Math.round(maturity);
};

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  hindi: {
    title: 'FD बुकिंग', stepOf: 'चरण',
    step1Title: '💰 कितना पैसा लगाना है?', step1Sub: 'न्यूनतम राशि:',
    step2Title: '📅 कितने समय के लिए?', step2Sub: 'अवधि चुनें',
    step3Title: '🏦 बैंक चुनें', step3Sub: 'अपना पसंदीदा बैंक चुनें',
    step4Title: '✅ FD बुकिंग कन्फर्म',
    next: 'आगे बढ़ें →', back: '← वापस',
    bookBtn: '✅ FD बुक करें', booking: '⏳ बुकिंग हो रही है...',
    minAmtNote: 'न्यूनतम: ', goodStart: '✅ बढ़िया शुरुआत!',
    maturityLabel: 'मिलेंगे', rateLabel: 'ब्याज दर', bestRate: '⭐ सबसे अच्छा रेट',
    dicgc: 'DICGC ✅ सुरक्षित', minAmt: 'न्यूनतम',
    congrats: 'बधाई हो!', booked: 'आपकी FD सफलतापूर्वक बुक हो गई',
    bookingId: 'बुकिंग ID', bank: 'बैंक', amount: 'राशि',
    rate: 'ब्याज दर', tenure: 'समय', maturity: 'मिलेगा',
    whatsapp: '📱 WhatsApp पर Share करें', done: 'Done ✓',
    tdsTitle: '📊 TDS & Tax जानकारी',
    tdsApplies: '⚠️ TDS लागू होगा',
    tdsNoApply: '✅ TDS नहीं कटेगा',
    annualInterest: 'सालाना ब्याज',
    tdsThreshold: 'TDS सीमा',
    tdsAmount: 'TDS राशि (10%)',
    form15g: '📋 Form 15G भरें',
    form15h: '📋 Form 15H भरें',
    form15gDesc: 'अगर आपकी कुल आय टैक्स सीमा से कम है तो Form 15G भरकर TDS बचाएं',
    form15hDesc: 'वरिष्ठ नागरिक Form 15H भरकर TDS बचा सकते हैं',
    seniorToggle: '👴 वरिष्ठ नागरिक (+0.5%)',
    filterAll: 'सभी', filterSfb: 'SFB', filterPrivate: 'प्राइवेट', filterGovt: 'सरकारी',
  },
  english: {
    title: 'Book FD', stepOf: 'Step',
    step1Title: '💰 How much to invest?', step1Sub: 'Minimum amount:',
    step2Title: '📅 For how long?', step2Sub: 'Select tenure',
    step3Title: '🏦 Choose Bank', step3Sub: 'Pick your preferred bank',
    step4Title: '✅ FD Booking Confirmed',
    next: 'Continue →', back: '← Back',
    bookBtn: '✅ Book FD', booking: '⏳ Booking...',
    minAmtNote: 'Minimum: ', goodStart: '✅ Great start!',
    maturityLabel: 'on maturity', rateLabel: 'Rate', bestRate: '⭐ Best Rate',
    dicgc: 'DICGC ✅ Insured', minAmt: 'Min',
    congrats: 'Congratulations!', booked: 'Your FD has been booked successfully',
    bookingId: 'Booking ID', bank: 'Bank', amount: 'Amount',
    rate: 'Interest Rate', tenure: 'Tenure', maturity: 'You will get',
    whatsapp: '📱 Share on WhatsApp', done: 'Done ✓',
    tdsTitle: '📊 TDS & Tax Info',
    tdsApplies: '⚠️ TDS will be deducted',
    tdsNoApply: '✅ No TDS applicable',
    annualInterest: 'Annual Interest',
    tdsThreshold: 'TDS Threshold',
    tdsAmount: 'TDS Amount (10%)',
    form15g: '📋 Submit Form 15G',
    form15h: '📋 Submit Form 15H',
    form15gDesc: 'If your total income is below taxable limit, submit Form 15G to avoid TDS',
    form15hDesc: 'Senior citizens can submit Form 15H to avoid TDS deduction',
    seniorToggle: '👴 Senior Citizen (+0.5%)',
    filterAll: 'All', filterSfb: 'SFB', filterPrivate: 'Private', filterGovt: 'Govt',
  },
  bhojpuri: {
    title: 'FD बुकिंग', stepOf: 'चरण',
    step1Title: '💰 केतना पईसा लगाईं?', step1Sub: 'न्यूनतम रकम:',
    step2Title: '📅 केतना समय खातिर?', step2Sub: 'समय चुनीं',
    step3Title: '🏦 बैंक चुनीं', step3Sub: 'आपन पसंद के बैंक चुनीं',
    step4Title: '✅ FD बुकिंग हो गइल',
    next: 'आगे बढ़ीं →', back: '← वापस',
    bookBtn: '✅ FD बुक करीं', booking: '⏳ बुकिंग होत बा...',
    minAmtNote: 'न्यूनतम: ', goodStart: '✅ बढ़िया शुरुआत!',
    maturityLabel: 'मिली', rateLabel: 'ब्याज दर', bestRate: '⭐ सबसे अच्छा रेट',
    dicgc: 'DICGC ✅ सुरक्षित', minAmt: 'न्यूनतम',
    congrats: 'बधाई हो!', booked: 'रउआ के FD सफलतापूर्वक बुक हो गइल',
    bookingId: 'बुकिंग ID', bank: 'बैंक', amount: 'रकम',
    rate: 'ब्याज दर', tenure: 'समय', maturity: 'मिली',
    whatsapp: '📱 WhatsApp पर शेयर करीं', done: 'Done ✓',
    tdsTitle: '📊 TDS जानकारी',
    tdsApplies: '⚠️ TDS कटी',
    tdsNoApply: '✅ TDS ना कटी',
    annualInterest: 'सालाना ब्याज',
    tdsThreshold: 'TDS सीमा',
    tdsAmount: 'TDS रकम (10%)',
    form15g: '📋 Form 15G भरीं',
    form15h: '📋 Form 15H भरीं',
    form15gDesc: 'अगर आय टैक्स से कम बा त Form 15G भरके TDS बचाईं',
    form15hDesc: 'बुजुर्ग नागरिक Form 15H भरके TDS बचा सकेलन',
    seniorToggle: '👴 बुजुर्ग नागरिक (+0.5%)',
    filterAll: 'सभी', filterSfb: 'SFB', filterPrivate: 'प्राइवेट', filterGovt: 'सरकारी',
  },
  awadhi: {
    title: 'FD बुकिंग', stepOf: 'चरण',
    step1Title: '💰 कितना पैसा लगाना है?', step1Sub: 'न्यूनतम राशि:',
    step2Title: '📅 कितने समय के लिए?', step2Sub: 'अवधि चुनें',
    step3Title: '🏦 बैंक चुनें', step3Sub: 'आपन पसंद के बैंक चुनें',
    step4Title: '✅ FD बुकिंग पक्की',
    next: 'आगे बढ़ें →', back: '← वापस',
    bookBtn: '✅ FD बुक करें', booking: '⏳ बुकिंग होत है...',
    minAmtNote: 'न्यूनतम: ', goodStart: '✅ बढ़िया शुरुआत!',
    maturityLabel: 'मिलत', rateLabel: 'ब्याज दर', bestRate: '⭐ सबसे अच्छा रेट',
    dicgc: 'DICGC ✅ सुरक्षित', minAmt: 'न्यूनतम',
    congrats: 'बधाई हो!', booked: 'आपकी FD सफलतापूर्वक बुक हो गई',
    bookingId: 'बुकिंग ID', bank: 'बैंक', amount: 'राशि',
    rate: 'ब्याज दर', tenure: 'समय', maturity: 'मिलेगा',
    whatsapp: '📱 WhatsApp पर Share करें', done: 'Done ✓',
    tdsTitle: '📊 TDS जानकारी',
    tdsApplies: '⚠️ TDS लागू होई',
    tdsNoApply: '✅ TDS नाय कटी',
    annualInterest: 'सालाना ब्याज',
    tdsThreshold: 'TDS सीमा',
    tdsAmount: 'TDS राशि (10%)',
    form15g: '📋 Form 15G भरें',
    form15h: '📋 Form 15H भरें',
    form15gDesc: 'अगर आय कर योग्य न होय त Form 15G भरके TDS बचाएं',
    form15hDesc: 'वरिष्ठ नागरिक Form 15H भरके TDS बचा सकत हैं',
    seniorToggle: '👴 वरिष्ठ नागरिक (+0.5%)',
    filterAll: 'सभी', filterSfb: 'SFB', filterPrivate: 'प्राइवेट', filterGovt: 'सरकारी',
  },
};

const getBankLabel = (bank, language) =>
  language === 'english' ? bank.name : bank.nameHindi;

const getTenureLabel = (opt, language) => {
  if (language === 'english') return opt.label;
  if (language === 'bhojpuri') return opt.labelBhojpuri;
  if (language === 'awadhi') return opt.labelAwadhi;
  return opt.labelHindi;
};

// ── TDS PANEL ─────────────────────────────────────────────────────────────────
const TDSPanel = ({ principal, rate, months, isSenior, t }) => {
  const maturity = calcMaturity(principal, rate, months);
  const interest = maturity - Math.round(principal);
  const tds = calcTDS(interest, months, isSenior);

  return (
    <div style={{
      background: tds.tdsApplies ? '#fff8e1' : '#f0fdf4',
      border: `1px solid ${tds.tdsApplies ? '#f59e0b' : '#86efac'}`,
      borderRadius: '12px', padding: '14px', marginTop: '12px',
    }}>
      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a6b3c', marginBottom: '10px' }}>
        {t.tdsTitle}
      </div>
      <div style={{
        display: 'inline-block', padding: '4px 10px', borderRadius: '20px',
        fontSize: '12px', fontWeight: '600', marginBottom: '10px',
        background: tds.tdsApplies ? '#fef3c7' : '#dcfce7',
        color: tds.tdsApplies ? '#92400e' : '#15803d',
      }}>
        {tds.tdsApplies ? t.tdsApplies : t.tdsNoApply}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
        {[
          [t.annualInterest, `₹${tds.annualInterest.toLocaleString('en-IN')}`],
          [t.tdsThreshold,   `₹${tds.threshold.toLocaleString('en-IN')}`],
          ...(tds.tdsApplies ? [[t.tdsAmount, `₹${tds.tdsAmount.toLocaleString('en-IN')}`]] : []),
        ].map(([label, value]) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '8px 10px' }}>
            <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a2733' }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{
        background: 'white', borderRadius: '8px', padding: '10px 12px',
        fontSize: '12px', color: '#374151', lineHeight: '1.5',
        border: '1px solid #e5e7eb',
      }}>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
          {isSenior ? t.form15h : t.form15g}
        </div>
        <div style={{ color: '#666' }}>{isSenior ? t.form15hDesc : t.form15gDesc}</div>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const BookingFlow = ({ onClose, onSendMessage, language = 'hindi' }) => {
  const t = T[language] || T.hindi;
  const [step, setStep]               = useState(1);
  const [principal, setPrincipal]     = useState('');
  const [selectedMonths, setMonths]   = useState(12);
  const [selectedBank, setBank]       = useState(null);
  const [isSenior, setSenior]         = useState(false);
  const [filter, setFilter]           = useState('all');
  const [booking, setBooking]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [showTDS, setShowTDS]         = useState(false);

  const amount = parseFloat(principal) || 0;

  // Get rate for selected bank + tenure
  const getRate = (bank, months) => {
    const entry = bank?.rates.find(r => r.months === months);
    const base = entry?.rate || 0;
    return isSenior ? base + 0.5 : base;
  };

  // Banks sorted by rate for current tenure
  const filteredBanks = ALL_BANKS
    .filter(b => filter === 'all' || b.category === filter)
    .map(b => ({ ...b, currentRate: getRate(b, selectedMonths) }))
    .sort((a, b) => b.currentRate - a.currentRate);

  const handleBook = async () => {
    if (!selectedBank) return;
    setLoading(true);
    try {
      const result = await bookFD(selectedBank.id, amount, selectedMonths);
      setBooking(result);
      setStep(4);
    } catch {
      alert(language === 'english' ? 'Booking failed. Please try again.' : 'बुकिंग नहीं हुई। फिर कोशिश करें।');
    } finally {
      setLoading(false);
    }
  };

  const selectedRate = selectedBank ? getRate(selectedBank, selectedMonths) : 0;
  const maturity     = selectedBank && amount ? calcMaturity(amount, selectedRate, selectedMonths) : 0;
  const interest     = maturity - Math.round(amount);

  // Step progress colors
  const progressColor = (s) => step >= s ? '#1a6b3c' : '#e2e8f0';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '12px',
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', width: '100%',
        maxWidth: '460px', maxHeight: '92vh', overflowY: 'auto', padding: '24px',
        fontFamily: "'DM Sans','Noto Sans Devanagari',sans-serif",
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a6b3c' }}>{t.title}</div>
            {step < 4 && (
              <div style={{ fontSize: '12px', color: '#888' }}>
                {t.stepOf} {step} / 3
              </div>
            )}
          </div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', background: '#f5f5f5',
            border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '16px',
          }}>✕</button>
        </div>

        {/* Progress bar */}
        {step < 4 && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: progressColor(s), transition: 'background 0.3s',
              }} />
            ))}
          </div>
        )}

        {/* ── STEP 1: AMOUNT ── */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>{t.step1Title}</div>

            {/* Senior toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', background: '#f8f9fa', borderRadius: '10px', marginBottom: '14px',
            }}>
              <span style={{ fontSize: '13px', color: '#444' }}>{t.seniorToggle}</span>
              <div onClick={() => setSenior(!isSenior)} style={{
                width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer',
                background: isSenior ? '#1a6b3c' : '#ccc', position: 'relative', transition: 'background 0.2s',
              }}>
                <div style={{
                  position: 'absolute', top: '2px', left: isSenior ? '20px' : '2px',
                  width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                  transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </div>
            </div>

            <input
              type="number" placeholder="जैसे: 50000" value={principal}
              onChange={e => setPrincipal(e.target.value)}
              style={{
                width: '100%', padding: '14px', fontSize: '20px',
                border: '2px solid #e2e8f0', borderRadius: '12px',
                outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
            {amount >= 500 && (
              <div style={{ marginTop: '10px', padding: '10px 12px', background: '#f0fdf4', borderRadius: '10px', fontSize: '13px', color: '#1a6b3c' }}>
                {t.goodStart} — ₹{amount.toLocaleString('en-IN')}
              </div>
            )}
            <button
              onClick={() => amount >= 500 && setStep(2)}
              style={{
                marginTop: '16px', width: '100%', padding: '14px',
                background: amount >= 500 ? '#1a6b3c' : '#ccc',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: '600', cursor: amount >= 500 ? 'pointer' : 'default',
              }}
            >{t.next}</button>
          </div>
        )}

        {/* ── STEP 2: TENURE ── */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '14px' }}>{t.step2Title}</div>
            {/* Show tenure options for the best-rate bank (suryoday) to give context */}
            {ALL_BANKS[0].rates.map(opt => {
              const rate = isSenior ? opt.rate + 0.5 : opt.rate;
              const mat = calcMaturity(amount, rate, opt.months);
              const isSelected = selectedMonths === opt.months;
              return (
                <div
                  key={opt.months}
                  onClick={() => setMonths(opt.months)}
                  style={{
                    padding: '13px 16px', marginBottom: '8px', cursor: 'pointer',
                    border: isSelected ? '2px solid #1a6b3c' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    background: isSelected ? '#f0fdf4' : 'white',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: '#1a2733', fontSize: '14px' }}>
                      {getTenureLabel(opt, language)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                      Suryoday SFB • {rate}% p.a.
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a6b3c' }}>
                      ₹{mat.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888' }}>
                      +₹{(mat - Math.round(amount)).toLocaleString('en-IN')} {t.maturityLabel}
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: '13px', background: '#f5f5f5', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}>{t.back}</button>
              <button onClick={() => setStep(3)} style={{ flex: 2, padding: '13px', background: '#1a6b3c', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>{t.next}</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: BANK SELECTION ── */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{t.step3Title}</div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>{t.step3Sub}</div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {[
                ['all', t.filterAll],
                ['sfb', t.filterSfb],
                ['private', t.filterPrivate],
                ['govt', t.filterGovt],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    padding: '5px 12px', fontSize: '12px', borderRadius: '20px',
                    border: filter === key ? '1.5px solid #1a6b3c' : '1px solid #e2e8f0',
                    background: filter === key ? '#f0fdf4' : 'white',
                    color: filter === key ? '#1a6b3c' : '#666',
                    fontWeight: filter === key ? '600' : '400',
                    cursor: 'pointer',
                  }}
                >{label}</button>
              ))}
            </div>

            {/* Bank list */}
            <div style={{ maxHeight: '340px', overflowY: 'auto', paddingRight: '2px' }}>
              {filteredBanks.map((bank, i) => {
                const mat = calcMaturity(amount, bank.currentRate, selectedMonths);
                const isSelected = selectedBank?.id === bank.id;
                return (
                  <div
                    key={bank.id}
                    onClick={() => setBank(bank)}
                    style={{
                      padding: '12px 14px', marginBottom: '7px', cursor: 'pointer',
                      border: isSelected ? '2px solid #1a6b3c' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      background: isSelected ? '#f0fdf4' : 'white',
                      transition: 'all 0.15s',
                    }}
                  >
                    {(i === 0 || bank.highlight) && (
                      <span style={{
                        fontSize: '10px', background: '#1a6b3c', color: 'white',
                        padding: '2px 8px', borderRadius: '5px', marginBottom: '5px', display: 'inline-block',
                      }}>{t.bestRate}</span>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a2733' }}>
                          {getBankLabel(bank, language)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                          {t.dicgc} • {t.minAmt} ₹{bank.minAmount.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '10px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#1a6b3c' }}>
                          {bank.currentRate}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          ₹{mat.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TDS preview for selected bank */}
            {selectedBank && amount > 0 && (
              <div>
                <button
                  onClick={() => setShowTDS(!showTDS)}
                  style={{
                    width: '100%', marginTop: '10px', padding: '9px',
                    background: 'none', border: '1px dashed #1a6b3c',
                    borderRadius: '10px', color: '#1a6b3c', fontSize: '12px',
                    fontWeight: '600', cursor: 'pointer',
                  }}
                >
                  {showTDS ? '▲' : '▼'} {t.tdsTitle}
                </button>
                {showTDS && (
                  <TDSPanel
                    principal={amount} rate={selectedRate}
                    months={selectedMonths} isSenior={isSenior} t={t}
                  />
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: '13px', background: '#f5f5f5', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}>{t.back}</button>
              <button
                onClick={handleBook}
                disabled={!selectedBank || loading}
                style={{
                  flex: 2, padding: '13px',
                  background: selectedBank ? '#1a6b3c' : '#ccc',
                  color: 'white', border: 'none', borderRadius: '12px',
                  cursor: selectedBank ? 'pointer' : 'default',
                  fontSize: '15px', fontWeight: '600',
                }}
              >{loading ? t.booking : t.bookBtn}</button>
            </div>
          </div>
        )}

        {/* ── STEP 4: CONFIRMATION ── */}
        {step === 4 && booking && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '10px' }}>🎉</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a6b3c', marginBottom: '4px' }}>{t.congrats}</div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>{t.booked}</div>

            <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '18px', marginBottom: '14px', textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  [t.bookingId, booking.booking_id],
                  [t.bank, booking.bank_name_hindi || booking.bank_name],
                  [t.amount, booking.principal_formatted],
                  [t.rate, `${booking.annual_rate}% p.a.`],
                  [t.tenure, `${booking.tenure_months} ${language === 'english' ? 'months' : 'महीने'}`],
                  [t.maturity, booking.maturity_formatted],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: '11px', color: '#666' }}>{label}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a2733' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TDS panel in confirmation */}
            <TDSPanel
              principal={booking.principal}
              rate={booking.annual_rate}
              months={booking.tenure_months}
              isSenior={isSenior}
              t={t}
            />

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `🏦 *FD Booking Confirmed!*\n\n` +
                `📋 ID: ${booking.booking_id}\n` +
                `🏦 Bank: ${booking.bank_name}\n` +
                `💰 Amount: ${booking.principal_formatted}\n` +
                `📈 Rate: ${booking.annual_rate}% p.a.\n` +
                `📅 Tenure: ${booking.tenure_months} months\n` +
                `✅ Maturity: ${booking.maturity_formatted}\n\n` +
                `🔒 DICGC Insured\nBooked via FD Saathi 🎯`
              )}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'block', width: '100%', padding: '13px',
                background: '#25D366', color: 'white', borderRadius: '12px',
                textDecoration: 'none', fontSize: '14px', fontWeight: '600',
                textAlign: 'center', marginTop: '14px', marginBottom: '8px',
                boxSizing: 'border-box',
              }}
            >{t.whatsapp}</a>

            <button onClick={onClose} style={{
              width: '100%', padding: '13px', background: '#1a6b3c',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer',
            }}>{t.done}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
