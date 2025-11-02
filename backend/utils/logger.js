/**
 * Enhanced Logger Utility
 * Professional logging with levels and context
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message, context = {}) => {
  const timestamp = getTimestamp();
  const contextStr = Object.keys(context).length > 0 
    ? ` | Context: ${JSON.stringify(context)}`
    : '';
  return `[${timestamp}] [${level}] ${message}${contextStr}`;
};

const logger = {
  /**
   * Log info message
   */
  info: (message, context = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      const formatted = formatMessage('INFO', message, context);
      console.log(`${colors.cyan}${formatted}${colors.reset}`);
    }
  },

  /**
   * Log error message
   */
  error: (message, error = null, context = {}) => {
    const errorContext = {
      ...context,
      ...(error && {
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
    };
    const formatted = formatMessage('ERROR', message, errorContext);
    console.error(`${colors.red}${formatted}${colors.reset}`);
  },

  /**
   * Log warning message
   */
  warn: (message, context = {}) => {
    const formatted = formatMessage('WARN', message, context);
    console.warn(`${colors.yellow}${formatted}${colors.reset}`);
  },

  /**
   * Log debug message (only in development)
   */
  debug: (message, context = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const formatted = formatMessage('DEBUG', message, context);
      console.log(`${colors.magenta}${formatted}${colors.reset}`);
    }
  },

  /**
   * Log HTTP request
   */
  http: (req, res, responseTime = null) => {
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;
    const ip = req.ip || req.connection.remoteAddress;
    
    const context = {
      method,
      url,
      status,
      ip,
      ...(responseTime && { responseTime: `${responseTime}ms` }),
    };
    
    const level = status >= 500 ? 'ERROR' : status >= 400 ? 'WARN' : 'INFO';
    const formatted = formatMessage(level, `${method} ${url} - ${status}`, context);
    
    const color = status >= 500 ? colors.red : status >= 400 ? colors.yellow : colors.green;
    console.log(`${color}${formatted}${colors.reset}`);
  },

  /**
   * Log database operation
   */
  db: (operation, model, context = {}) => {
    const dbContext = {
      operation,
      model,
      ...context,
    };
    logger.debug(`DB Operation: ${operation} on ${model}`, dbContext);
  },
};

export default logger;

