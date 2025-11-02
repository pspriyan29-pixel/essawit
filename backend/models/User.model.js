import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama harus diisi'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid']
  },
  password: {
    type: String,
    required: function() {
      // Password is required unless user is using OAuth
      return !this.oauthProvider && !this.password?.startsWith('oauth_');
    },
    minlength: {
      validator: function(v) {
        // Skip minlength validation for OAuth users
        if (this.oauthProvider || v?.startsWith('oauth_')) return true;
        return v && v.length >= 6;
      },
      message: 'Password minimal 6 karakter'
    },
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  province: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  plantationArea: {
    type: Number, // luas lahan dalam hektar
    default: 0
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  subscriptionStartDate: {
    type: Date
  },
  subscriptionEndDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  oauthProvider: {
    type: String,
    enum: ['google', 'facebook'],
    default: null
  },
  oauthId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving (only if password is provided)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // Skip hashing if using OAuth (password starts with oauth_)
  if (!this.password || this.password.startsWith('oauth_')) return next();
  // Hash password for regular users
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);

