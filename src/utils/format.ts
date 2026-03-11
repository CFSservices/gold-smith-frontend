/**
 * Formatting utilities
 */

import { CURRENCY, WEIGHT_UNITS } from '@/config/constants';

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(
  amount: number,
  options?: Partial<{
    showSymbol: boolean;
    minimumFractionDigits: number;
    maximumFractionDigits: number;
  }>
): string {
  const {
    showSymbol = true,
    minimumFractionDigits = CURRENCY.decimalPlaces,
    maximumFractionDigits = CURRENCY.decimalPlaces,
  } = options ?? {};

  const formatter = new Intl.NumberFormat(CURRENCY.locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency: CURRENCY.code,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(amount);
}

/**
 * Format weight with unit
 */
export function formatWeight(
  value: number,
  unit: keyof typeof WEIGHT_UNITS = 'gram',
  decimalPlaces: number = 3
): string {
  const unitConfig = WEIGHT_UNITS[unit];
  return `${value.toFixed(decimalPlaces)} ${unitConfig.symbol}`;
}

/**
 * Convert weight between units
 */
export function convertWeight(
  value: number,
  fromUnit: keyof typeof WEIGHT_UNITS,
  toUnit: keyof typeof WEIGHT_UNITS
): number {
  const fromConfig = WEIGHT_UNITS[fromUnit];
  const toConfig = WEIGHT_UNITS[toUnit];
  
  // Convert to grams first, then to target unit
  const inGrams = value * fromConfig.toGram;
  return inGrams / toConfig.toGram;
}

/**
 * Format date for display
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  };

  return dateObj.toLocaleDateString('en-IN', defaultOptions);
}

/**
 * Format date with time
 */
export function formatDateTime(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options,
  };

  return dateObj.toLocaleString('en-IN', defaultOptions);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals: { label: string; seconds: number }[] = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  decimalPlaces: number = 2
): string {
  return `${value.toFixed(decimalPlaces)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Format number with Indian numbering system (lakhs, crores)
 */
export function formatIndianNumber(num: number): string {
  const formatter = new Intl.NumberFormat('en-IN');
  return formatter.format(num);
}

/**
 * Get initials from name
 */
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, maxLength);
}

/**
 * Format user role for display (capitalize first letter)
 */
export function formatUserRole(role?: string): string {
  if (!role) return 'Admin';
  return role.charAt(0).toUpperCase() + role.slice(1);
}
