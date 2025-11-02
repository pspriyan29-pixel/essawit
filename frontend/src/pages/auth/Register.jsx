import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Loader, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import OAuthButtons from '../../components/OAuthButtons';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import { isValidEmail, isValidPhone, validatePasswordStrength } from '../../utils/validators';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Nama harus diisi';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Nama minimal 2 karakter';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email harus diisi';
        } else if (!isValidEmail(value)) {
          newErrors.email = 'Format email tidak valid';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (value && !isValidPhone(value)) {
          newErrors.phone = 'Format nomor telepon tidak valid (contoh: 081234567890)';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'Password harus diisi';
        } else {
          const validation = validatePasswordStrength(value);
          if (!validation.isValid) {
            newErrors.password = validation.message;
          } else {
            delete newErrors.password;
          }
          // Check password match if confirmPassword exists
          if (formData.confirmPassword && value !== formData.confirmPassword) {
            if (!newErrors.confirmPassword) {
              newErrors.confirmPassword = 'Password tidak cocok';
            }
          }
        }
        break;
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Konfirmasi password harus diisi';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Password tidak cocok';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return !newErrors[name];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: fieldValue,
    });

    // Real-time validation
    if (touched[name]) {
      validateField(name, value || fieldValue);
    }
    
    // Special handling for password confirmation
    if (name === 'password' && formData.confirmPassword && touched.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ 
      name: true, 
      email: true, 
      password: true, 
      confirmPassword: true, 
      phone: true,
      agreeToTerms: true 
    });
    
    // Validate all fields
    const nameValid = validateField('name', formData.name);
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    const confirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);
    const phoneValid = !formData.phone || validateField('phone', formData.phone);
    
    if (!nameValid || !emailValid || !passwordValid || !confirmPasswordValid || !phoneValid) {
      toast.error('Harap perbaiki kesalahan pada form');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Anda harus menyetujui syarat dan ketentuan');
      return;
    }

    setLoading(true);

    try {
      const { name, email, password, phone } = formData;
      const result = await register({ name, email, password, phone: phone || undefined });
      if (result?.success) {
        // Success - navigation is handled in AuthContext
        return;
      } else {
        // Error already shown by AuthContext, just stop loading
      }
    } catch (error) {
      // Error handling is done in AuthContext
      console.error('Register error:', error);
      if (!error.response) {
        toast.error('Terjadi kesalahan. Pastikan backend berjalan.');
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = validatePasswordStrength(formData.password);
  const isFormValid = 
    !errors.name && 
    !errors.email && 
    !errors.password && 
    !errors.confirmPassword && 
    (!formData.phone || !errors.phone) &&
    formData.name && 
    formData.email && 
    formData.password && 
    formData.confirmPassword &&
    passwordStrength.isValid &&
    formData.agreeToTerms;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-green-500 to-primary-600 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 right-10 w-80 h-80 bg-white/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [360, 180, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-10 left-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/4 w-56 h-56 bg-emerald-300/15 rounded-full blur-2xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card backdrop-blur-xl bg-white/95 shadow-2xl border-0 max-h-[90vh] overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-block mb-4">
              <motion.h1 
                className="text-3xl font-black gradient-text mb-1"
                whileHover={{ scale: 1.05 }}
              >
                NusaPalma
              </motion.h1>
              <p className="text-xs text-gray-500 font-medium">SATU NUSAN, SATU SAWITAN</p>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Buat Akun Baru</h2>
            <p className="text-gray-600">Bergabunglah dengan komunitas petani sawit</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative group">
                <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  errors.name ? 'text-red-500' : touched.name && !errors.name ? 'text-green-500' : 'text-gray-400 group-focus-within:text-primary-600'
                }`} size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-12 pr-12 ${
                    errors.name 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : touched.name && !errors.name 
                        ? 'border-green-500 focus:border-green-500' 
                        : 'hover:border-primary-400'
                  } transition-all`}
                  placeholder="Nama lengkap"
                  required
                />
                {touched.name && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {errors.name ? (
                      <AlertCircle className="text-red-500" size={18} />
                    ) : !errors.name && formData.name ? (
                      <CheckCircle className="text-green-500" size={18} />
                    ) : null}
                  </div>
                )}
              </div>
              <AnimatePresence>
                {errors.name && touched.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle size={14} />
                    <span>{errors.name}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  errors.email ? 'text-red-500' : touched.email && !errors.email ? 'text-green-500' : 'text-gray-400 group-focus-within:text-primary-600'
                }`} size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-12 pr-12 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : touched.email && !errors.email 
                        ? 'border-green-500 focus:border-green-500' 
                        : 'hover:border-primary-400'
                  } transition-all`}
                  placeholder="nama@email.com"
                  required
                />
                {touched.email && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {errors.email ? (
                      <AlertCircle className="text-red-500" size={18} />
                    ) : !errors.email && formData.email ? (
                      <CheckCircle className="text-green-500" size={18} />
                    ) : null}
                  </div>
                )}
              </div>
              <AnimatePresence>
                {errors.email && touched.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Phone Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                No. Telepon <span className="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <div className="relative group">
                <Phone className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  errors.phone ? 'text-red-500' : touched.phone && !errors.phone && formData.phone ? 'text-green-500' : 'text-gray-400 group-focus-within:text-primary-600'
                }`} size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-12 pr-12 ${
                    errors.phone 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : touched.phone && !errors.phone && formData.phone
                        ? 'border-green-500 focus:border-green-500' 
                        : 'hover:border-primary-400'
                  } transition-all`}
                  placeholder="08xxxxxxxxxx"
                />
                {touched.phone && formData.phone && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {errors.phone ? (
                      <AlertCircle className="text-red-500" size={18} />
                    ) : (
                      <CheckCircle className="text-green-500" size={18} />
                    )}
                  </div>
                )}
              </div>
              <AnimatePresence>
                {errors.phone && touched.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle size={14} />
                    <span>{errors.phone}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  errors.password ? 'text-red-500' : touched.password && !errors.password ? 'text-green-500' : 'text-gray-400 group-focus-within:text-primary-600'
                }`} size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-12 pr-12 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : touched.password && !errors.password 
                        ? 'border-green-500 focus:border-green-500' 
                        : 'hover:border-primary-400'
                  } transition-all`}
                  placeholder="Minimal 6 karakter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.password && <PasswordStrengthIndicator password={formData.password} />}
              <AnimatePresence>
                {errors.password && touched.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle size={14} />
                    <span>{errors.password}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  errors.confirmPassword ? 'text-red-500' : touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword ? 'text-green-500' : 'text-gray-400 group-focus-within:text-primary-600'
                }`} size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-12 pr-12 ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword
                        ? 'border-green-500 focus:border-green-500' 
                        : 'hover:border-primary-400'
                  } transition-all`}
                  placeholder="Ulangi password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.confirmPassword && touched.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                  >
                    <AlertCircle size={14} />
                    <span>{errors.confirmPassword}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
              className="flex items-start"
            >
              <input
                type="checkbox"
                name="agreeToTerms"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600 cursor-pointer">
                Saya menyetujui{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Syarat & Ketentuan
                </Link>
                {' '}dan{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Kebijakan Privasi
                </Link>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                whileHover={isFormValid ? { scale: 1.02 } : {}}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
                type="submit"
                disabled={loading || !isFormValid}
                className={`btn btn-primary w-full flex items-center justify-center space-x-2 relative overflow-hidden group transition-all ${
                  !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Daftar</span>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Atau daftar dengan</span>
              </div>
            </div>
            <OAuthButtons />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                Masuk sekarang
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
