import Scholarship from '../models/Scholarship.model.js';

export const getAllScholarships = async (req, res) => {
  try {
    const { isActive, page = 1, limit = 10 } = req.query;
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const scholarships = await Scholarship.find(query)
      .sort({ deadline: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Scholarship.countDocuments(query);

    res.json({
      success: true,
      data: scholarships,
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

export const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    
    if (!scholarship) {
      return res.status(404).json({ message: 'Beasiswa tidak ditemukan' });
    }

    res.json({
      success: true,
      data: scholarship
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const applyScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    
    if (!scholarship) {
      return res.status(404).json({ message: 'Beasiswa tidak ditemukan' });
    }

    if (!scholarship.isActive) {
      return res.status(400).json({ message: 'Beasiswa ini sudah tidak aktif' });
    }

    // Check if deadline has passed
    if (new Date() > new Date(scholarship.deadline)) {
      return res.status(400).json({ message: 'Pendaftaran beasiswa ini sudah ditutup' });
    }

    // Check if user already applied
    const alreadyApplied = scholarship.applicants.some(
      app => app.userId.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Anda sudah mendaftar beasiswa ini' });
    }

    // Add applicant
    scholarship.applicants.push({
      userId: req.user._id,
      status: 'pending'
    });

    await scholarship.save();

    res.json({
      success: true,
      message: 'Pendaftaran beasiswa berhasil',
      data: scholarship
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({
      'applicants.userId': req.user._id
    });

    const myApplications = scholarships.map(scholarship => {
      const application = scholarship.applicants.find(
        app => app.userId.toString() === req.user._id.toString()
      );
      return {
        scholarship: {
          id: scholarship._id,
          title: scholarship.title,
          provider: scholarship.provider,
          amount: scholarship.amount,
          deadline: scholarship.deadline
        },
        application
      };
    });

    res.json({
      success: true,
      data: myApplications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

