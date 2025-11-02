import Scholarship from '../models/Scholarship.model.js';
import { catchAsync, NotFoundError, ValidationError } from '../utils/errorHandler.js';
import { sendSuccess, sendPaginated } from '../utils/responseHandler.js';
import logger from '../utils/logger.js';

export const getAllScholarships = catchAsync(async (req, res) => {
  const { isActive, page = 1, limit = 10 } = req.query;
  const query = {};

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = Math.min(parseInt(limit) || 10, 100);
  
  const scholarships = await Scholarship.find(query)
    .sort({ deadline: 1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Scholarship.countDocuments(query);

  sendPaginated(res, 200, scholarships, {
    page: parseInt(page) || 1,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum)
  }, 'Beasiswa berhasil diambil');
});

export const getScholarshipById = catchAsync(async (req, res) => {
  const scholarship = await Scholarship.findById(req.params.id);
  
  if (!scholarship) {
    throw new NotFoundError('Beasiswa');
  }

  sendSuccess(res, 200, 'Beasiswa berhasil diambil', scholarship);
});

export const applyScholarship = catchAsync(async (req, res) => {
  const scholarship = await Scholarship.findById(req.params.id);
  
  if (!scholarship) {
    throw new NotFoundError('Beasiswa');
  }

  if (!scholarship.isActive) {
    throw new ValidationError('Beasiswa ini sudah tidak aktif');
  }

  // Check if deadline has passed
  if (new Date() > new Date(scholarship.deadline)) {
    throw new ValidationError('Pendaftaran beasiswa ini sudah ditutup');
  }

  // Check if user already applied
  const alreadyApplied = scholarship.applicants?.some(
    app => app.userId.toString() === req.user._id.toString()
  );

  if (alreadyApplied) {
    throw new ValidationError('Anda sudah mendaftar beasiswa ini');
  }

  // Add applicant
  if (!scholarship.applicants) {
    scholarship.applicants = [];
  }
  
  scholarship.applicants.push({
    userId: req.user._id,
    status: 'pending',
    appliedAt: new Date()
  });

  await scholarship.save();

  logger.info(`Scholarship applied: ${scholarship._id}`, { userId: req.user._id });
  sendSuccess(res, 200, 'Pendaftaran beasiswa berhasil', scholarship);
});

export const getMyApplications = catchAsync(async (req, res) => {
  const scholarships = await Scholarship.find({
    'applicants.userId': req.user._id
  });

  const myApplications = scholarships.map(scholarship => {
    const application = scholarship.applicants?.find(
      app => app.userId.toString() === req.user._id.toString()
    );
    return {
      scholarship: {
        id: scholarship._id,
        title: scholarship.title,
        provider: scholarship.provider,
        amount: scholarship.amount,
        deadline: scholarship.deadline,
        isActive: scholarship.isActive
      },
      application
    };
  });

  sendSuccess(res, 200, 'Aplikasi beasiswa berhasil diambil', myApplications);
});

