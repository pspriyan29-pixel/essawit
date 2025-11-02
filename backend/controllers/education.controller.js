import Education from '../models/Education.model.js';
import UserProgress from '../models/UserProgress.model.js';
import User from '../models/User.model.js';
import { catchAsync, NotFoundError, ValidationError, ForbiddenError } from '../utils/errorHandler.js';
import { sendSuccess, sendPaginated } from '../utils/responseHandler.js';
import logger from '../utils/logger.js';

export const getAllEducation = catchAsync(async (req, res) => {
  const { category, level, isPremium, page = 1, limit = 10 } = req.query;
  const query = {};

  if (category) query.category = category;
  if (level) query.level = level;
  if (isPremium !== undefined) query.isPremium = isPremium === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = Math.min(parseInt(limit) || 10, 100);
  
  const educations = await Education.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Education.countDocuments(query);

  sendPaginated(res, 200, educations, {
    page: parseInt(page) || 1,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum)
  }, 'Materi edukasi berhasil diambil');
});

export const getEducationById = catchAsync(async (req, res) => {
  const education = await Education.findById(req.params.id);
  
  if (!education) {
    throw new NotFoundError('Materi edukasi');
  }

  // Check if user has access (if premium content)
  if (education.isPremium && req.user) {
    const user = await User.findById(req.user._id);
    const hasAccess = ['basic', 'premium', 'enterprise'].includes(user?.subscriptionPlan);
    
    if (!hasAccess) {
      throw new ForbiddenError('Materi ini memerlukan langganan Basic atau lebih tinggi');
    }
  }

  // Increment views
  education.views = (education.views || 0) + 1;
  await education.save();

  // Get user progress if authenticated
  let progress = null;
  if (req.user) {
    progress = await UserProgress.findOne({
      userId: req.user._id,
      educationId: education._id
    });
  }

  sendSuccess(res, 200, 'Materi edukasi berhasil diambil', {
    ...education.toObject(),
    progress
  });
});

export const updateProgress = catchAsync(async (req, res) => {
  const { educationId, progress, completed } = req.body;

  if (!educationId) {
    throw new ValidationError('educationId harus diisi');
  }

  const education = await Education.findById(educationId);
  if (!education) {
    throw new NotFoundError('Materi edukasi');
  }

  const userProgress = await UserProgress.findOneAndUpdate(
    { userId: req.user._id, educationId },
    {
      progress: Math.min(100, Math.max(0, progress || 0)),
      completed: completed || false,
      lastAccessed: new Date()
    },
    { new: true, upsert: true }
  );

  logger.info(`Progress updated: ${educationId}`, { userId: req.user._id, progress });
  sendSuccess(res, 200, 'Progress berhasil diperbarui', userProgress);
});

export const getMyProgress = catchAsync(async (req, res) => {
  const progressList = await UserProgress.find({ userId: req.user._id })
    .populate('educationId')
    .sort({ lastAccessed: -1 });

  sendSuccess(res, 200, 'Progress berhasil diambil', progressList);
});

