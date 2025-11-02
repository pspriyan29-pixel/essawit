/**
 * Custom Error Handler Utility
 */

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} tidak ditemukan`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Tidak memiliki akses, silakan login terlebih dahulu') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Anda tidak memiliki izin untuk mengakses resource ini') {
    super(message, 403);
  }
}

/**
 * Global error handler middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      stack: err.stack,
    });
  } else {
    // Production error response
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        ...(err.errors && { errors: err.errors }),
      });
    } else {
      // Programming or unknown error
      console.error('ERROR:', err);
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      });
    }
  }
};

/**
 * Async error handler wrapper
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

