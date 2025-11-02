import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = () => {
    if (!password) return { score: 0, label: '', color: '', checks: {} };
    
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    let label = '';
    let color = '';
    
    if (score <= 1) {
      label = 'Sangat Lemah';
      color = 'bg-red-500';
    } else if (score === 2) {
      label = 'Lemah';
      color = 'bg-orange-500';
    } else if (score === 3) {
      label = 'Sedang';
      color = 'bg-yellow-500';
    } else if (score === 4) {
      label = 'Kuat';
      color = 'bg-green-500';
    } else {
      label = 'Sangat Kuat';
      color = 'bg-emerald-500';
    }
    
    return { score, label, color, checks };
  };

  const { label, color, checks } = getStrength();

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600">Kekuatan Password:</span>
        <span className={`text-xs font-bold ${color.replace('bg-', 'text-')}`}>
          {label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(getStrength().score / 5) * 100}%` }}
          transition={{ duration: 0.3 }}
          className={`h-full ${color} transition-colors`}
        />
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3">
        {[
          { key: 'length', label: 'Minimal 8 karakter' },
          { key: 'uppercase', label: 'Huruf besar (A-Z)' },
          { key: 'lowercase', label: 'Huruf kecil (a-z)' },
          { key: 'number', label: 'Angka (0-9)' },
          { key: 'special', label: 'Karakter khusus (!@#$)' },
        ].map(({ key, label: reqLabel }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center space-x-1.5 text-xs ${
              checks[key] ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {checks[key] ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <X size={14} className="text-gray-400" />
            )}
            <span>{reqLabel}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;

