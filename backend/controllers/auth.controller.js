import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.model.js';
import { catchAsync, ValidationError, UnauthorizedError } from '../utils/errorHandler.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const register = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validasi gagal', errors.array());
  }

  const { name, email, password, phone } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError('Email sudah terdaftar');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone
  });

  const token = generateToken(user._id);

  sendSuccess(res, 201, 'Registrasi berhasil', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan
    }
  });
});

export const login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validasi gagal', errors.array());
  }

  const { email, password } = req.body;

  // Check if user exists and get password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Email atau password salah');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new UnauthorizedError('Akun Anda telah dinonaktifkan');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Email atau password salah');
  }

  const token = generateToken(user._id);

  sendSuccess(res, 200, 'Login berhasil', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan,
      profilePicture: user.profilePicture
    }
  });
});

// OAuth Login with Google or Facebook
export const oauthLogin = catchAsync(async (req, res) => {
  const { provider, email, name, picture, providerId } = req.body;

  if (!provider || !email) {
    throw new ValidationError('Provider dan email harus diisi');
  }

  if (!['google', 'facebook'].includes(provider)) {
    throw new ValidationError('Provider tidak valid');
  }

  // Find or create user
  let user = await User.findOne({ email });

  if (!user) {
    // Create new user with OAuth
    const randomPassword = `oauth_${provider}_${providerId || email}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    user = await User.create({
      name: name || 'User',
      email,
      password: randomPassword, // Dummy password - won't be hashed for OAuth users
      profilePicture: picture || '',
      oauthProvider: provider,
      oauthId: providerId || email
    });
  } else {
    // If user exists, check if they're using same OAuth provider
    if (user.oauthProvider && user.oauthProvider !== provider) {
      throw new ValidationError(`Email ini sudah terdaftar dengan ${user.oauthProvider === 'google' ? 'Google' : 'Facebook'}. Silakan login dengan provider yang sama.`);
    }
    
    // Update OAuth info if not set or update profile picture
    if (!user.oauthProvider) {
      user.oauthProvider = provider;
      user.oauthId = providerId || email;
    }
    if (picture && (!user.profilePicture || user.profilePicture === '')) {
      user.profilePicture = picture;
    }
    await user.save();
  }

  const token = generateToken(user._id);

  sendSuccess(res, 200, 'Login berhasil', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan,
      profilePicture: user.profilePicture
    }
  });
});

export const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  sendSuccess(res, 200, 'Data user berhasil diambil', { user });
});
