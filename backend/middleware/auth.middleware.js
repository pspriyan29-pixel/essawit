import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { UnauthorizedError } from '../utils/errorHandler.js';
import { catchAsync } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('Tidak memiliki akses, silakan login terlebih dahulu');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new UnauthorizedError('User tidak ditemukan');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Akun Anda telah dinonaktifkan');
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.warn(`Invalid token attempt from IP: ${req.ip}`);
      throw new UnauthorizedError('Token tidak valid');
    }
    
    if (error.name === 'TokenExpiredError') {
      logger.warn(`Expired token attempt from IP: ${req.ip}`);
      throw new UnauthorizedError('Token sudah kadaluarsa, silakan login ulang');
    }
    
    throw error;
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('User tidak terautentikasi');
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt: User ${req.user._id} tried to access ${req.path}`);
      return res.status(403).json({ 
        success: false,
        message: 'Anda tidak memiliki izin untuk mengakses resource ini' 
      });
    }
    next();
  };
};

export const checkSubscription = (requiredPlan = 'free') => {
  const planHierarchy = {
    free: 0,
    basic: 1,
    premium: 2,
    enterprise: 3
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    const userPlan = req.user.subscriptionPlan || 'free';
    const userPlanLevel = planHierarchy[userPlan] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

    // Check if subscription is still active
    if (req.user.subscriptionEndDate && new Date() > new Date(req.user.subscriptionEndDate)) {
      logger.info(`Subscription expired for user: ${req.user._id}`);
      return res.status(403).json({
        success: false,
        message: 'Langganan Anda telah berakhir. Silakan perpanjang langganan Anda.'
      });
    }

    if (userPlanLevel < requiredPlanLevel) {
      logger.info(`Insufficient subscription level: User ${req.user._id} (${userPlan}) tried to access ${requiredPlan} feature`);
      return res.status(403).json({
        success: false,
        message: `Fitur ini memerlukan langganan ${requiredPlan} atau lebih tinggi`
      });
    }

    next();
  };
};

