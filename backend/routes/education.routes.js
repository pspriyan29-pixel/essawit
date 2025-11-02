import express from 'express';
import {
  getAllEducation,
  getEducationById,
  updateProgress,
  getMyProgress
} from '../controllers/education.controller.js';
import { protect, checkSubscription } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllEducation);
router.get('/:id', protect, getEducationById);
router.get('/progress/my', protect, checkSubscription('free'), getMyProgress);
router.post('/progress', protect, checkSubscription('free'), updateProgress);

export default router;

