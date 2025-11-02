/**
 * Input Sanitization Middleware
 * Sanitize user inputs to prevent XSS and injection attacks
 */

import { body, query, param } from 'express-validator';

/**
 * Sanitize string inputs
 */
const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  
  return value
    .trim()
    // Remove potentially dangerous characters
    .replace(/[<>]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ');
};

/**
 * Sanitize email
 */
const sanitizeEmail = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().toLowerCase();
};

/**
 * Sanitize number
 */
const sanitizeNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return isNaN(num) ? value : num;
  }
  return value;
};

/**
 * Sanitize ObjectId
 */
const sanitizeObjectId = (value) => {
  if (typeof value !== 'string') return value;
  // Only allow alphanumeric characters (MongoDB ObjectId format)
  return value.replace(/[^a-f0-9]/gi, '');
};

/**
 * Common sanitization rules
 */
export const sanitize = {
  // String fields
  string: (field) => body(field).customSanitizer(sanitizeString),
  
  // Email field
  email: (field) => body(field).customSanitizer(sanitizeEmail),
  
  // Number fields
  number: (field) => body(field).customSanitizer(sanitizeNumber),
  
  // ObjectId fields
  objectId: (field) => param(field).customSanitizer(sanitizeObjectId),
  
  // Optional string
  optionalString: (field) => body(field).optional().customSanitizer(sanitizeString),
  
  // Optional number
  optionalNumber: (field) => body(field).optional().customSanitizer(sanitizeNumber),
  
  // Query string
  queryString: (field) => query(field).optional().customSanitizer(sanitizeString),
  
  // Query number
  queryNumber: (field) => query(field).optional().customSanitizer(sanitizeNumber),
};

/**
 * Apply sanitization to request
 */
export const sanitizeRequest = (req, res, next) => {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }

  // Sanitize query
  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    });
  }

  next();
};

