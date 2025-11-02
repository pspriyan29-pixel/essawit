import express from 'express';
import { getPlans, subscribe, getMySubscription, createPayment, verifyPayment } from '../controllers/subscription.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/plans', getPlans);

router.use(protect);
router.post('/create-payment', createPayment);
router.post('/verify-payment', verifyPayment);
router.post('/subscribe', subscribe);
router.get('/my-subscription', getMySubscription);

export default router;

