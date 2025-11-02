import mongoose from 'mongoose';

const harvestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  periodType: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: true
  },
  income: {
    type: Number,
    required: true,
    min: 0
  },
  volume: {
    type: Number, // volume panen dalam ton
    required: true,
    min: 0
  },
  pricePerTon: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
harvestSchema.index({ userId: 1, date: -1 });
harvestSchema.index({ userId: 1, periodType: 1 });

export default mongoose.model('Harvest', harvestSchema);

