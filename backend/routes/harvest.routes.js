import express from 'express';
import { body } from 'express-validator';
import {
  createHarvest,
  getHarvests,
  getHarvestById,
  updateHarvest,
  deleteHarvest,
  getStatistics
} from '../controllers/harvest.controller.js';
import { protect, checkSubscription } from '../middleware/auth.middleware.js';

const router = express.Router();

const harvestValidation = [
  body('date').notEmpty().withMessage('Tanggal harus diisi'),
  body('periodType').isIn(['weekly', 'monthly', 'yearly']).withMessage('Tipe periode tidak valid'),
  body('income').isFloat({ min: 0 }).withMessage('Pendapatan harus berupa angka positif'),
  body('volume').isFloat({ min: 0 }).withMessage('Volume harus berupa angka positif'),
  body('pricePerTon').isFloat({ min: 0 }).withMessage('Harga per ton harus berupa angka positif')
];

// All routes require authentication
router.use(protect);

router.post('/', checkSubscription('free'), harvestValidation, createHarvest);
router.get('/', checkSubscription('free'), getHarvests);
router.get('/statistics', checkSubscription('free'), getStatistics);
router.get('/:id', checkSubscription('free'), getHarvestById);
router.put('/:id', checkSubscription('free'), harvestValidation, updateHarvest);
router.delete('/:id', checkSubscription('free'), deleteHarvest);

export default router;

