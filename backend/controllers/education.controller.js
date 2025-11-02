import Education from '../models/Education.model.js';
import UserProgress from '../models/UserProgress.model.js';
import User from '../models/User.model.js';

export const getAllEducation = async (req, res) => {
  try {
    const { category, level, isPremium, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const educations = await Education.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Education.countDocuments(query);

    res.json({
      success: true,
      data: educations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEducationById = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    
    if (!education) {
      return res.status(404).json({ message: 'Materi edukasi tidak ditemukan' });
    }

    // Check if user has access (if premium content)
    if (education.isPremium && req.user) {
      const user = await User.findById(req.user._id);
      const hasAccess = ['basic', 'premium', 'enterprise'].includes(user.subscriptionPlan);
      
      if (!hasAccess) {
        return res.status(403).json({ 
          message: 'Materi ini memerlukan langganan Basic atau lebih tinggi' 
        });
      }
    }

    // Increment views
    education.views += 1;
    await education.save();

    // Get user progress if authenticated
    let progress = null;
    if (req.user) {
      progress = await UserProgress.findOne({
        userId: req.user._id,
        educationId: education._id
      });
    }

    res.json({
      success: true,
      data: education,
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { educationId, progress, completed } = req.body;

    const userProgress = await UserProgress.findOneAndUpdate(
      { userId: req.user._id, educationId },
      {
        progress: Math.min(100, Math.max(0, progress || 0)),
        completed: completed || false,
        lastAccessed: new Date()
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: userProgress
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyProgress = async (req, res) => {
  try {
    const progressList = await UserProgress.find({ userId: req.user._id })
      .populate('educationId')
      .sort({ lastAccessed: -1 });

    res.json({
      success: true,
      data: progressList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

