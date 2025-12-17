/**
 * Input validation helpers
 */

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean} Whether username is valid
 */
export function isValidUsername(username) {
  if (!username || typeof username !== 'string') return false;
  // 3-20 characters, alphanumeric, underscore, hyphen
  const regex = /^[a-zA-Z0-9_-]{3,20}$/;
  return regex.test(username);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize username (remove invalid characters)
 * @param {string} username - Username to sanitize
 * @returns {string} Sanitized username
 */
export function sanitizeUsername(username) {
  if (!username || typeof username !== 'string') return '';
  return username
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 20);
}

/**
 * Validate metric threshold
 * @param {number} threshold - Threshold value
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} Whether threshold is valid
 */
export function isValidThreshold(threshold, min = 0, max = Infinity) {
  return typeof threshold === 'number' && threshold >= min && threshold <= max;
}

