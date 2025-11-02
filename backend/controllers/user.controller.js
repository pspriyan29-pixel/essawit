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

export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedUpdates = ['name', 'phone', 'address', 'province', 'city', 'plantationArea', 'profilePicture'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Update tidak valid' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password saat ini salah' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password berhasil diubah'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
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

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          subscriptionPlan: user.subscriptionPlan,
          plantationArea: user.plantationArea
        },
        stats: {
          totalHarvests,
          totalIncome: totalIncome[0]?.total || 0,
          monthlyIncome: monthlyIncome[0]?.total || 0
        },
        recentHarvests
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

