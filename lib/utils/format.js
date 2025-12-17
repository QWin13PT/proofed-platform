/**
 * Formatting utilities for numbers, dates, and currencies
 */

/**
 * Format a number with commas for readability
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  if (typeof num !== 'number') return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format a currency value
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  if (typeof amount !== 'number') return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a large number with K, M, B suffixes
 * @param {number} num - The number to format
 * @returns {string} Compact number string (e.g., "1.2K", "3.5M")
 */
export function formatCompactNumber(num) {
  if (typeof num !== 'number') return '0';
  
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Format a date relative to now (e.g., "2 days ago")
 * @param {Date|string} date - The date to format
 * @returns {string} Relative date string
 */
export function formatRelativeDate(date) {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format a percentage value
 * @param {number} value - Value between 0 and 1 (or 0-100 if isPercent is true)
 * @param {boolean} isPercent - Whether the input is already a percentage
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, isPercent = false) {
  const percent = isPercent ? value : value * 100;
  return `${percent.toFixed(1).replace(/\.0$/, '')}%`;
}

