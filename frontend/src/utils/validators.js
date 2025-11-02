/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone number validation (Indonesian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Indonesian phone number: starts with 0 or +62, 9-13 digits
  const phoneRegex = /^(0|\+62)[0-9]{9,13}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Password strength validation
 * @param {string} password - Password to validate
 * @returns {object} Validation result with score and message
 */
export const validatePasswordStrength = (password) => {
  if (!password) {
    return {
      isValid: false,
      score: 0,
      message: 'Password harus diisi',
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      score: 1,
      message: 'Password minimal 6 karakter',
    };
  }

  let score = 0;
  let checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  if (checks.length) score++;
  if (checks.uppercase) score++;
  if (checks.lowercase) score++;
  if (checks.number) score++;
  if (checks.special) score++;

  let message = '';
  if (score <= 2) {
    message = 'Password lemah';
  } else if (score <= 3) {
    message = 'Password sedang';
  } else if (score <= 4) {
    message = 'Password kuat';
  } else {
    message = 'Password sangat kuat';
  }

  return {
    isValid: password.length >= 6,
    score,
    message,
    checks,
  };
};

/**
 * URL validation
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Number validation
 * @param {string|number} value - Value to validate
 * @returns {boolean} Is valid number
 */
export const isValidNumber = (value) => {
  if (value === null || value === undefined) return false;
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[^\w\s@.-]/g, ''); // Remove special characters except @, ., -
};

/**
 * Validate harvest form data
 * @param {object} data - Harvest form data
 * @returns {object} Validation result
 */
export const validateHarvestData = (data) => {
  const errors = {};

  if (!data.date) {
    errors.date = 'Tanggal harus diisi';
  }

  if (!data.periodType) {
    errors.periodType = 'Tipe periode harus dipilih';
  }

  if (!data.income || !isValidNumber(data.income) || parseFloat(data.income) < 0) {
    errors.income = 'Pendapatan harus berupa angka positif';
  }

  if (!data.volume || !isValidNumber(data.volume) || parseFloat(data.volume) < 0) {
    errors.volume = 'Volume harus berupa angka positif';
  }

  if (!data.pricePerTon || !isValidNumber(data.pricePerTon) || parseFloat(data.pricePerTon) < 0) {
    errors.pricePerTon = 'Harga per ton harus berupa angka positif';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

