import { validationResult } from 'express-validator';
import User from '../models/User.model.js';
import Harvest from '../models/Harvest.model.js';
import { catchAsync, NotFoundError, ValidationError } from '../utils/errorHandler.js';
import { sendSuccess } from '../utils/responseHandler.js';
import logger from '../utils/logger.js';

export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    throw new NotFoundError('User');
  }

  sendSuccess(res, 200, 'Profil berhasil diambil', user);
});

export const updateProfile = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validasi gagal', errors.array());
  }

  const allowedUpdates = ['name', 'phone', 'address', 'province', 'city', 'plantationArea', 'profilePicture'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new ValidationError('Update tidak valid');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new NotFoundError('User');
  }

  logger.info(`Profile updated: ${user._id}`, { userId: req.user._id });
  sendSuccess(res, 200, 'Profil berhasil diperbarui', user);
});

export const changePassword = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validasi gagal', errors.array());
  }

  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw new NotFoundError('User');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ValidationError('Password saat ini salah');
  }

  user.password = newPassword;
  await user.save();

  logger.info(`Password changed: ${user._id}`, { userId: req.user._id });
  sendSuccess(res, 200, 'Password berhasil diubah');
});

export const getDashboardStats = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  // Get recent harvests
  const recentHarvests = await Harvest.find({ userId: req.user._id })
    .sort({ date: -1 })
    .limit(5);

  // Get statistics
  const totalHarvests = await Harvest.countDocuments({ userId: req.user._id });
  const totalIncome = await Harvest.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: null, total: { $sum: '$income' } } }
  ]);

  // Get current month income
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);
  
  const monthlyIncome = await Harvest.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: { $gte: currentMonth }
      }
    },
    { $group: { _id: null, total: { $sum: '$income' } } }
  ]);

  // Get total volume
  const totalVolume = await Harvest.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: null, total: { $sum: '$volume' } } }
  ]);

  sendSuccess(res, 200, 'Statistik dashboard berhasil diambil', {
    user: {
      name: user.name,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan,
      plantationArea: user.plantationArea || 0
    },
    stats: {
      totalHarvests,
      totalIncome: totalIncome[0]?.total || 0,
      totalVolume: totalVolume[0]?.total || 0,
      monthlyIncome: monthlyIncome[0]?.total || 0
    },
    recentHarvests
  });
});

