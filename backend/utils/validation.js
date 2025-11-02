/**
 * Validation Utilities
 */

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[^\w\s@.-]/g, ''); // Remove special characters
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
};

/**
 * Validate phone number (Indonesian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Indonesian phone: starts with 0 or +62, 9-13 digits
  const phoneRegex = /^(0|\+62)[0-9]{9,13}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} Is valid ObjectId
 */
export const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate date
 * @param {any} date - Date to validate
 * @returns {boolean} Is valid date
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

/**
 * Validate number
 * @param {any} value - Value to validate
 * @returns {boolean} Is valid number
 */
export const isValidNumber = (value) => {
  if (value === null || value === undefined) return false;
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validate required fields
 * @param {object} data - Data to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {object} Validation result with isValid and errors
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `${field} harus diisi`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

