import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ['qris', 'bri', 'mandiri'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'cancelled', 'expired'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    unique: true,
    required: true
  },
  verifiedAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Payment expires in 24 hours
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Generate unique payment ID
paymentSchema.pre('save', async function(next) {
  if (!this.paymentId) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.paymentId = `PAY-${timestamp}-${random}`;
  }
  next();
});

// Check if payment is expired
paymentSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

