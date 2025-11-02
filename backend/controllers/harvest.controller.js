import Harvest from '../models/Harvest.model.js';
import { catchAsync, NotFoundError, ValidationError } from '../utils/errorHandler.js';
import { sendSuccess } from '../utils/responseHandler.js';
import logger from '../utils/logger.js';
import { validationResult } from 'express-validator';

export const createHarvest = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validasi gagal', errors.array());
  }

  const harvest = await Harvest.create({
    ...req.body,
    userId: req.user._id
  });

  logger.info(`Harvest created: ${harvest._id}`, { userId: req.user._id });
  sendSuccess(res, 201, 'Data panen berhasil ditambahkan', harvest);
});

export const getHarvests = catchAsync(async (req, res) => {
  const { periodType, startDate, endDate, page = 1, limit = 10 } = req.query;
  
  const query = { userId: req.user._id };
  
  if (periodType) {
    query.periodType = periodType;
  }
  
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = Math.min(parseInt(limit) || 10, 100); // Max 100 per page
  
  const harvests = await Harvest.find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Harvest.countDocuments(query);

  sendSuccess(res, 200, 'Data panen berhasil diambil', harvests, {
    pagination: {
      page: parseInt(page) || 1,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

export const getHarvestById = catchAsync(async (req, res) => {
  const harvest = await Harvest.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!harvest) {
    throw new NotFoundError('Data panen');
  }

  sendSuccess(res, 200, 'Data panen berhasil diambil', harvest);
});

export const updateHarvest = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validasi gagal', errors.array());
  }

  const harvest = await Harvest.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!harvest) {
    throw new NotFoundError('Data panen');
  }

  logger.info(`Harvest updated: ${harvest._id}`, { userId: req.user._id });
  sendSuccess(res, 200, 'Data panen berhasil diperbarui', harvest);
});

export const deleteHarvest = catchAsync(async (req, res) => {
  const harvest = await Harvest.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!harvest) {
    throw new NotFoundError('Data panen');
  }

  logger.info(`Harvest deleted: ${harvest._id}`, { userId: req.user._id });
  sendSuccess(res, 200, 'Data panen berhasil dihapus');
});

export const getStatistics = catchAsync(async (req, res) => {
  const { periodType, year } = req.query;
  
  const query = { userId: req.user._id };
  if (periodType) query.periodType = periodType;
  
  // Get all harvests with optimized query
  const harvests = await Harvest.find(query)
    .select('date income volume pricePerTon')
    .sort({ date: 1 })
    .lean(); // Use lean for better performance

  // Calculate statistics
  const totalIncome = harvests.reduce((sum, h) => sum + (h.income || 0), 0);
  const totalVolume = harvests.reduce((sum, h) => sum + (h.volume || 0), 0);
  const averagePrice = harvests.length > 0 
    ? harvests.reduce((sum, h) => sum + (h.pricePerTon || 0), 0) / harvests.length 
    : 0;

  // Monthly statistics for the year
  const monthlyStats = {};
  const currentYear = year ? parseInt(year) : new Date().getFullYear();
  
  for (let i = 1; i <= 12; i++) {
    const monthHarvests = harvests.filter(h => {
      const harvestDate = new Date(h.date);
      return harvestDate.getFullYear() === currentYear && harvestDate.getMonth() + 1 === i;
    });
    
    monthlyStats[i] = {
      income: monthHarvests.reduce((sum, h) => sum + (h.income || 0), 0),
      volume: monthHarvests.reduce((sum, h) => sum + (h.volume || 0), 0),
      count: monthHarvests.length
    };
  }

  // Yearly comparison (last 3 years)
  const yearlyStats = {};
  const currentYear2 = new Date().getFullYear();
  for (let y = currentYear2 - 2; y <= currentYear2; y++) {
    const yearHarvests = harvests.filter(h => {
      const harvestDate = new Date(h.date);
      return harvestDate.getFullYear() === y;
    });
    
    yearlyStats[y] = {
      income: yearHarvests.reduce((sum, h) => sum + (h.income || 0), 0),
      volume: yearHarvests.reduce((sum, h) => sum + (h.volume || 0), 0),
      count: yearHarvests.length
    };
  }

  const statistics = {
    totalIncome,
    totalVolume,
    averagePrice: Math.round(averagePrice),
    totalRecords: harvests.length,
    monthlyStats,
    yearlyStats
  };

  sendSuccess(res, 200, 'Statistik berhasil diambil', statistics);
});

