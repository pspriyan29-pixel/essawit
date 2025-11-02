import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const PageLoader = ({ message = 'Memuat...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="inline-block mb-4"
        >
          <Loader2 className="w-12 h-12 text-primary-600" />
        </motion.div>
        <p className="text-gray-600">{message}</p>
      </div>
    </motion.div>
  );
};

export default PageLoader;

