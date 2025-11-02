import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, GraduationCap, BarChart3, Shield, Sparkles, ArrowRight, Zap } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Manajemen Panen',
      description: 'Kelola pendapatan panen mingguan, bulanan, dan tahunan dengan mudah',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: BookOpen,
      title: 'Edukasi Sawit',
      description: 'Akses materi pembelajaran lengkap tentang budidaya dan pengolahan sawit',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: GraduationCap,
      title: 'Beasiswa Khusus',
      description: 'Dapatkan informasi beasiswa khusus untuk petani sawit dan keluarganya',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Keamanan Data',
      description: 'Data Anda aman dan terlindungi dengan sistem keamanan terbaik',
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-green-50 to-emerald-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-primary-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/30 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-black gradient-text">NusaPalma</span>
                <span className="text-xs text-gray-500 font-medium">SATU NUSAN, SATU SAWITAN</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 font-semibold transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="btn btn-primary relative overflow-hidden group"
              >
                <span className="relative z-10">Daftar Sekarang</span>
                <motion.span
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex justify-center mb-8"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="text-white" size={48} />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-7xl font-black mb-6 leading-tight"
            >
              <span className="gradient-text">Platform Manajemen Sawit</span>
              <br />
              <span className="text-gray-900">Terbaik untuk Petani</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Kelola panen, pelajari teknik terbaik, dan dapatkan kesempatan beasiswa 
              untuk meningkatkan produktivitas kebun sawit Anda
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary text-lg px-8 py-4 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Zap size={24} />
                    <span>Mulai Gratis</span>
                  </span>
                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-secondary text-lg px-8 py-4"
                >
                  Masuk ke Akun
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Fitur <span className="gradient-text">Unggulan</span>
            </h2>
            <p className="text-xl text-gray-600">
              Semua yang Anda butuhkan untuk mengelola kebun sawit
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="card group cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    <Icon className="text-white" size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card bg-gradient-to-br from-primary-600 via-green-500 to-emerald-600 text-white text-center shadow-2xl border-0 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ transform: 'skewX(-20deg)', width: '200%' }}
            />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Siap Meningkatkan Produktivitas Sawit Anda?
              </h2>
              <p className="text-xl text-green-100 mb-10">
                Bergabunglah dengan ribuan petani yang sudah menggunakan platform kami
              </p>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-xl relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Daftar Sekarang - Gratis</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                  </span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 NusaPalma. Dibuat oleh Riyan Perdhana Putra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
