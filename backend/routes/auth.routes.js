import express from 'express';
import { body } from 'express-validator';
import { register, login, oauthLogin, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Nama harus diisi'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('phone').optional().trim()
];

const loginValidation = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').notEmpty().withMessage('Password harus diisi')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/oauth', oauthLogin);
router.get('/me', protect, getMe);

export default router;

