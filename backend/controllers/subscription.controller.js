import User from '../models/User.model.js';
import Payment from '../models/Payment.model.js';
import { catchAsync } from '../utils/errorHandler.js';
import { sendSuccess } from '../utils/responseHandler.js';
import logger from '../utils/logger.js';

const subscriptionPlans = {
  free: {
    name: 'Gratis',
    price: 0,
    duration: null, // unlimited
    features: [
      'Input panen dasar',
      'Dashboard dasar',
      'Materi edukasi terbatas',
      'Riwayat panen 3 bulan terakhir'
    ]
  },
  basic: {
    name: 'Basic',
    price: 50000,
    duration: 30, // days
    features: [
      'Semua fitur Free',
      'Input panen unlimited',
      'Riwayat panen unlimited',
      'Statistik lengkap',
      'Semua materi edukasi',
      'Prioritas dukungan'
    ]
  },
  premium: {
    name: 'Premium',
    price: 100000,
    duration: 30,
    features: [
      'Semua fitur Basic',
      'Analitik lanjutan',
      'Export data',
      'Akses beasiswa premium',
      'Webinar eksklusif',
      'Konsultasi ahli'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 250000,
    duration: 30,
    features: [
      'Semua fitur Premium',
      'Multi-user access',
      'API access',
      'Custom reporting',
      'Dedicated support',
      'Training khusus'
    ]
  }
};

export const getPlans = catchAsync(async (req, res) => {
  sendSuccess(res, 200, 'Paket langganan berhasil diambil', subscriptionPlans);
});

export const createPayment = catchAsync(async (req, res) => {
  const { plan, method } = req.body;
  
  if (!subscriptionPlans[plan]) {
    return res.status(400).json({ 
      success: false,
      message: 'Paket langganan tidak valid' 
    });
  }

  if (!['qris', 'bri', 'mandiri'].includes(method)) {
    return res.status(400).json({ 
      success: false,
      message: 'Metode pembayaran tidak valid' 
    });
  }

  const selectedPlan = subscriptionPlans[plan];
  
  // Create payment record
  const payment = await Payment.create({
    userId: req.user._id,
    plan,
    amount: selectedPlan.price,
    method,
    status: 'pending'
  });

  logger.info(`Payment created: ${payment.paymentId}`, { 
    userId: req.user._id, 
    plan, 
    method 
  });

  sendSuccess(res, 201, 'Pembayaran berhasil dibuat', payment);
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { paymentId } = req.body;
  
  const payment = await Payment.findOne({
    paymentId,
    userId: req.user._id
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Pembayaran tidak ditemukan'
    });
  }

  if (payment.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: `Pembayaran sudah ${payment.status === 'verified' ? 'diverifikasi' : 'dibatalkan'}`
    });
  }

  if (payment.isExpired()) {
    payment.status = 'expired';
    await payment.save();
    return res.status(400).json({
      success: false,
      message: 'Pembayaran sudah kadaluarsa'
    });
  }

  // Verify payment (in production, this should verify with payment gateway)
  // For now, we'll auto-verify (you can add manual verification later)
  payment.status = 'verified';
  payment.verifiedAt = new Date();
  await payment.save();

  // Update user subscription
  const user = await User.findById(req.user._id);
  const selectedPlan = subscriptionPlans[payment.plan];
  
  const startDate = new Date();
  const endDate = selectedPlan.duration 
    ? new Date(startDate.getTime() + selectedPlan.duration * 24 * 60 * 60 * 1000)
    : null;

  user.subscriptionPlan = payment.plan;
  user.subscriptionStartDate = startDate;
  user.subscriptionEndDate = endDate;
  await user.save();

  logger.info(`Payment verified: ${payment.paymentId}`, { 
    userId: req.user._id, 
    plan: payment.plan 
  });

  sendSuccess(res, 200, 'Pembayaran berhasil diverifikasi dan langganan diaktifkan', {
    payment,
    subscription: {
      plan: user.subscriptionPlan,
      startDate: user.subscriptionStartDate,
      endDate: user.subscriptionEndDate
    }
  });
});

export const subscribe = catchAsync(async (req, res) => {
  const { plan } = req.body;
  
  if (!subscriptionPlans[plan]) {
    return res.status(400).json({ 
      success: false,
      message: 'Paket langganan tidak valid' 
    });
  }

  const user = await User.findById(req.user._id);
  const selectedPlan = subscriptionPlans[plan];

  // Only allow direct subscription for free plan
  if (selectedPlan.price > 0) {
    return res.status(400).json({
      success: false,
      message: 'Paket berbayar harus melalui halaman pembayaran'
    });
  }

  // Calculate end date
  const startDate = new Date();
  const endDate = selectedPlan.duration 
    ? new Date(startDate.getTime() + selectedPlan.duration * 24 * 60 * 60 * 1000)
    : null;

  user.subscriptionPlan = plan;
  user.subscriptionStartDate = startDate;
  user.subscriptionEndDate = endDate;
  
  await user.save();

  logger.info(`Subscription activated: ${plan}`, { userId: req.user._id });

  sendSuccess(res, 200, `Berhasil berlangganan paket ${selectedPlan.name}`, {
    plan: user.subscriptionPlan,
    startDate: user.subscriptionStartDate,
    endDate: user.subscriptionEndDate
  });
});

export const getMySubscription = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const currentPlan = subscriptionPlans[user.subscriptionPlan] || subscriptionPlans.free;
  
  const isActive = !user.subscriptionEndDate || new Date() < new Date(user.subscriptionEndDate);

  sendSuccess(res, 200, 'Langganan berhasil diambil', {
    currentPlan: user.subscriptionPlan,
    planDetails: currentPlan,
    startDate: user.subscriptionStartDate,
    endDate: user.subscriptionEndDate,
    isActive
  });
});

