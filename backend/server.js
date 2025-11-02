import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import harvestRoutes from './routes/harvest.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import educationRoutes from './routes/education.routes.js';
import scholarshipRoutes from './routes/scholarship.routes.js';
import { globalErrorHandler } from './utils/errorHandler.js';
import logger from './utils/logger.js';
import config from './config/config.js';
import { sanitizeRequest } from './middleware/sanitize.js';

dotenv.config();

const app = express();
const PORT = config.server.port;

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security Middleware - Helmet (set security headers)
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: false,
}));

// Compression middleware
app.use(compression());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// CORS configuration
app.use(cors(config.cors));

// Request sanitization
app.use(sanitizeRequest);

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
  }));
}

// Rate Limiting - General API
const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Terlalu banyak request dari IP ini, silakan coba lagi nanti.'
  },
  standardHeaders: config.rateLimit.standardHeaders,
  legacyHeaders: config.rateLimit.legacyHeaders,
});

// Rate Limiting - Strict for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window for auth endpoints
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login, silakan coba lagi nanti.'
  },
  skipSuccessfulRequests: true,
});

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Database Connection with enhanced error handling
mongoose.connect(config.database.uri, config.database.options)
.then(() => {
  logger.info('MongoDB Connected Successfully', {
    uri: config.database.uri.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
  });
})
.catch(err => {
  logger.error('MongoDB Connection Error', err);
  process.exit(1); // Exit process if DB connection fails
});

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/harvest', harvestRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/scholarship', scholarshipRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.env,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
  };
  
  const statusCode = health.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Readiness Check (for Kubernetes/Docker)
app.get('/api/ready', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: 'ready', message: 'Server is ready to accept requests' });
  } else {
    res.status(503).json({ status: 'not ready', message: 'Server is not ready' });
  }
});

// Liveness Check (for Kubernetes/Docker)
app.get('/api/live', (req, res) => {
  res.status(200).json({ status: 'alive', message: 'Server is alive' });
});

// 404 Handler (must be before error handler)
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`, { ip: req.ip });
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan',
    path: req.url,
  });
});

// Error Handling Middleware (must be last)
app.use(globalErrorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: config.server.env,
    nodeVersion: process.version,
  });
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('HTTP server closed');
    
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });

  // Force close server after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', err);
  process.exit(1);
});

export default app;

