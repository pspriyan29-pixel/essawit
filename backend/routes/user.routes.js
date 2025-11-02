import express from 'express';
import { body } from 'express-validator';
import {
  getProfile,
  updateProfile,
  changePassword,
  getDashboardStats
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.get('/dashboard', getDashboardStats);
router.put('/profile', updateProfile);

router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Password saat ini harus diisi'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter')
], changePassword);

export default router;

