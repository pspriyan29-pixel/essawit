/**
 * Async Handler Middleware
 * Wraps async route handlers to automatically catch errors
 */

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

