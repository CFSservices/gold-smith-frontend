/**
 * Application constants
 */

// Application metadata
export const APP_CONFIG = {
  name: 'Gold Smith',
  description: 'A web application for gold merchants across India',
  version: '1.0.0',
  author: 'Gold Smith Team',
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Pagination defaults
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  limitOptions: [10, 25, 50, 100],
} as const;

// Date formats
export const DATE_FORMATS = {
  display: 'DD MMM YYYY',
  displayWithTime: 'DD MMM YYYY, hh:mm A',
  input: 'YYYY-MM-DD',
  api: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
} as const;

// Currency configuration (Indian context)
export const CURRENCY = {
  code: 'INR',
  symbol: '₹',
  locale: 'en-IN',
  decimalPlaces: 2,
} as const;

// Weight units for gold
export const WEIGHT_UNITS = {
  gram: { label: 'Gram', symbol: 'g', toGram: 1 },
  kilogram: { label: 'Kilogram', symbol: 'kg', toGram: 1000 },
  tola: { label: 'Tola', symbol: 'tola', toGram: 11.6638 },
  ounce: { label: 'Troy Ounce', symbol: 'oz', toGram: 31.1035 },
} as const;

// Gold purity options (Karat)
export const GOLD_PURITY = {
  '24K': { label: '24 Karat', purity: 99.9, description: 'Pure Gold' },
  '22K': { label: '22 Karat', purity: 91.6, description: 'Jewelry Gold' },
  '18K': { label: '18 Karat', purity: 75.0, description: '18K Gold' },
  '14K': { label: '14 Karat', purity: 58.3, description: '14K Gold' },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  theme: 'gs_theme',
  accessToken: 'gs_access_token',
  refreshToken: 'gs_refresh_token',
  user: 'gs_user',
  sidebarCollapsed: 'gs_sidebar_collapsed',
  language: 'gs_language',
} as const;

// Toast configuration
export const TOAST_CONFIG = {
  position: 'top-right' as const,
  life: 3000,
  closable: true,
} as const;

// Debounce delays
export const DEBOUNCE = {
  search: 300,
  input: 150,
  resize: 100,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Form validation
export const VALIDATION = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
  },
  email: {
    maxLength: 255,
  },
  name: {
    minLength: 2,
    maxLength: 100,
  },
  phone: {
    pattern: /^[6-9]\d{9}$/,
    length: 10,
  },
} as const;

// Authentication error messages
export const AUTH_ERRORS = {
  ACCESS_DENIED: 'Access denied. This application is for administrators only.',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_INACTIVE: 'Your account is not active. Please contact support.',
} as const;
