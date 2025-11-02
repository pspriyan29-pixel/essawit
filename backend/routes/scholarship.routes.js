import express from 'express';
import {
  getAllScholarships,
  getScholarshipById,
  applyScholarship,
  getMyApplications
} from '../controllers/scholarship.controller.js';
import { protect, checkSubscription } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllScholarships);
router.get('/:id', getScholarshipById);
router.get('/applications/my', protect, checkSubscription('basic'), getMyApplications);
router.post('/:id/apply', protect, checkSubscription('basic'), applyScholarship);

export default router;

