import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['pemupukan', 'panen', 'pengolahan', 'pengendalian-hama', 'budidaya', 'pemasaran', 'lainnya'],
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  level: {
    type: String,
    enum: ['pemula', 'menengah', 'lanjutan'],
    default: 'pemula'
  },
  duration: {
    type: Number, // dalam menit
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Education', educationSchema);

