/**
 * Request Validation Middleware
 * Enhanced validation with better error messages
 */

import { validationResult, body, param, query } from 'express-validator';
import { ValidationError } from '../utils/errorHandler.js';

/**
 * Wrapper to handle validation results
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(err => ({
        field: err.param || err.path,
        message: err.msg,
        value: err.value,
      }));
      
      throw new ValidationError('Validasi gagal', formattedErrors);
    }
    
    next();
  };
};

/**
 * Common validation rules
 */
export const validationRules = {
  // ObjectId validation
  objectId: param('id').isMongoId().withMessage('ID tidak valid'),

  // Email validation
  email: body('email')
    .trim()
    .notEmpty().withMessage('Email harus diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email maksimal 255 karakter'),

  // Password validation
  password: body('password')
    .notEmpty().withMessage('Password harus diisi')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
    .isLength({ max: 100 }).withMessage('Password maksimal 100 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password harus mengandung huruf kecil, huruf besar, dan angka'),

  // Optional password (for updates)
  optionalPassword: body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
    .isLength({ max: 100 }).withMessage('Password maksimal 100 karakter'),

  // Name validation
  name: body('name')
    .trim()
    .notEmpty().withMessage('Nama harus diisi')
    .isLength({ min: 2 }).withMessage('Nama minimal 2 karakter')
    .isLength({ max: 100 }).withMessage('Nama maksimal 100 karakter')
    .matches(/^[a-zA-Z\s\u00C0-\u017F]+$/)
    .withMessage('Nama hanya boleh mengandung huruf dan spasi'),

  // Phone validation (Indonesian format)
  phone: body('phone')
    .optional()
    .trim()
    .matches(/^(0|\+62)[0-9]{9,13}$/)
    .withMessage('Format nomor telepon tidak valid (contoh: 081234567890)'),

  // Number validation
  number: (field, min = 0, max = null) => {
    let rule = body(field)
      .notEmpty().withMessage(`${field} harus diisi`)
      .isNumeric().withMessage(`${field} harus berupa angka`);
    
    if (min !== null) {
      rule = rule.isInt({ min }).withMessage(`${field} minimal ${min}`);
    }
    
    if (max !== null) {
      rule = rule.isInt({ max }).withMessage(`${field} maksimal ${max}`);
    }
    
    return rule;
  },

  // Date validation
  date: (field, isRequired = true) => {
    let rule = body(field);
    
    if (isRequired) {
      rule = rule.notEmpty().withMessage(`${field} harus diisi`);
    } else {
      rule = rule.optional();
    }
    
    return rule
      .isISO8601().withMessage(`Format ${field} tidak valid (gunakan format ISO 8601)`)
      .toDate();
  },

  // Pagination validation
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page harus berupa angka positif')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit harus antara 1-100')
      .toInt(),
  ],

  // Subscription plan validation
  subscriptionPlan: body('plan')
    .notEmpty().withMessage('Paket langganan harus diisi')
    .isIn(['free', 'basic', 'premium', 'enterprise'])
    .withMessage('Paket langganan tidak valid'),

  // Harvest period type validation
  periodType: body('periodType')
    .notEmpty().withMessage('Tipe periode harus diisi')
    .isIn(['weekly', 'monthly', 'yearly'])
    .withMessage('Tipe periode harus weekly, monthly, atau yearly'),
};

