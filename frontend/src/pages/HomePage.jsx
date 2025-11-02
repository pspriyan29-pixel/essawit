import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  CheckCircle, 
  BookOpen, 
  GraduationCap, 
  BarChart3, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Zap,
  Users,
  Award,
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  ChevronRight,
  Play,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  UserPlus,
  Plus
} from 'lucide-react';

const HomePage = () => {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const features = [
    {
      icon: BarChart3,
      title: 'Manajemen Panen',
      description: 'Kelola pendapatan panen mingguan, bulanan, dan tahunan dengan mudah. Track semua data panen Anda dalam satu tempat.',
      color: 'from-blue-500 to-blue-600',
      benefits: ['Input cepat & mudah', 'Laporan otomatis', 'Analisis tren'],
    },
    {
      icon: BookOpen,
      title: 'Edukasi Sawit',
      description: 'Akses materi pembelajaran lengkap tentang budidaya dan pengolahan sawit dari para ahli berpengalaman.',
      color: 'from-green-500 to-emerald-600',
      benefits: ['Video tutorial', 'Artikel berkualitas', 'Update berkala'],
    },
    {
      icon: GraduationCap,
      title: 'Beasiswa Khusus',
      description: 'Dapatkan informasi beasiswa khusus untuk petani sawit dan keluarganya untuk pendidikan yang lebih baik.',
      color: 'from-purple-500 to-purple-600',
      benefits: ['Informasi terbaru', 'Panduan lengkap', 'Konsultasi gratis'],
    },
    {
      icon: Shield,
      title: 'Keamanan Data',
      description: 'Data Anda aman dan terlindungi dengan sistem keamanan terbaik. Privacy dan keamanan adalah prioritas kami.',
      color: 'from-red-500 to-red-600',
      benefits: ['Enkripsi end-to-end', 'Backup otomatis', 'Akses terenkripsi'],
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Petani Terdaftar', color: 'text-blue-600' },
    { icon: Award, value: '50K+', label: 'Data Panen', color: 'text-green-600' },
    { icon: TrendingUp, value: 'Rp 500M+', label: 'Pendapatan Terkelola', color: 'text-purple-600' },
    { icon: Star, value: '4.9/5', label: 'Rating Pengguna', color: 'text-yellow-600' },
  ];

  const testimonials = [
    {
      name: 'Bapak Ahmad',
      role: 'Petani Sawit, Sumatera Utara',
      image: '👨‍🌾',
      text: 'Platform ini sangat membantu saya mengelola panen. Sekarang saya bisa track semua pendapatan dengan mudah dan rapi.',
      rating: 5,
    },
    {
      name: 'Ibu Siti',
      role: 'Petani Sawit, Kalimantan',
      image: '👩‍🌾',
      text: 'Edukasi yang disediakan sangat membantu meningkatkan kualitas panen saya. Semua materi mudah dipahami.',
      rating: 5,
    },
    {
      name: 'Bapak Budi',
      role: 'Petani Sawit, Riau',
      image: '👨‍🌾',
      text: 'Anak saya mendapat beasiswa berkat informasi dari platform ini. Terima kasih NusaPalma!',
      rating: 5,
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Daftar Gratis',
      description: 'Buat akun dalam hitungan detik, tidak perlu kartu kredit',
      icon: UserPlus,
    },
    {
      step: 2,
      title: 'Input Data Panen',
      description: 'Mulai input data panen Anda dengan mudah dan cepat',
      icon: Plus,
    },
    {
      step: 3,
      title: 'Kelola & Analisis',
      description: 'Lihat statistik dan analisis panen Anda dalam dashboard',
      icon: BarChart3,
    },
    {
      step: 4,
      title: 'Tingkatkan Produktivitas',
      description: 'Gunakan edukasi dan beasiswa untuk meningkatkan hasil',
      icon: TrendingUp,
    },
  ];

  const benefits = [
    { icon: Clock, text: 'Menghemat waktu', description: 'Kelola semua data dalam satu tempat' },
    { icon: DollarSign, text: 'Meningkatkan pendapatan', description: 'Analisis tren untuk optimasi panen' },
    { icon: Award, text: 'Akses edukasi premium', description: 'Materi berkualitas dari para ahli' },
    { icon: Shield, text: 'Data aman & terenkripsi', description: 'Keamanan tingkat enterprise' },
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
                className="text-gray-700 hover:text-primary-600 font-semibold transition-colors hidden sm:block"
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
      <section className="py-24 md:py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-8"
            >
              <Sparkles className="text-primary-600" size={16} />
              <span className="text-sm font-semibold text-gray-700">
                Platform #1 untuk Petani Sawit Indonesia
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
            >
              <span className="gradient-text">Platform Manajemen Sawit</span>
              <br />
              <span className="text-gray-900">Terbaik untuk Petani</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Kelola panen, pelajari teknik terbaik, dan dapatkan kesempatan beasiswa 
              untuk meningkatkan produktivitas kebun sawit Anda
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary text-lg px-8 py-4 relative overflow-hidden group shadow-2xl"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Zap size={24} />
                    <span>Mulai Gratis Sekarang</span>
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
                  className="btn btn-secondary text-lg px-8 py-4 shadow-xl"
                >
                  Masuk ke Akun
                </motion.button>
              </Link>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-500" size={18} />
                <span>100% Gratis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-500" size={18} />
                <span>Tanpa Kartu Kredit</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-500" size={18} />
                <span>Data Terenkripsi</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 px-4 bg-white/60 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className="text-center"
                >
                  <motion.div
                    animate={statsInView ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color.replace('text-', 'from-').replace('-600', '-500')} to-${stat.color.replace('text-', '').replace('-600', '-600')} mb-4 shadow-lg`}
                  >
                    <Icon className="text-white" size={32} />
                  </motion.div>
                  <motion.h3
                    animate={statsInView ? { scale: [0, 1] } : {}}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    className="text-3xl md:text-4xl font-black text-gray-900 mb-2"
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
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
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Fitur <span className="gradient-text">Unggulan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola kebun sawit dalam satu platform
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
                  className="card group cursor-pointer hover:shadow-2xl transition-all border-0"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    <Icon className="text-white" size={32} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary-50 to-green-50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Cara <span className="gradient-text">Kerja</span>
            </h2>
            <p className="text-xl text-gray-600">
              Mulai dalam 4 langkah mudah
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="card text-center border-0 shadow-lg hover:shadow-2xl transition-all">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-primary-500 to-green-500 rounded-full flex items-center justify-center text-white font-black shadow-lg">
                      {step.step}
                    </div>
                    <div className="mt-6 mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-green-100 rounded-2xl flex items-center justify-center">
                        <Icon className="text-primary-600" size={32} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ChevronRight className="text-primary-400" size={32} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                Mengapa Pilih <span className="gradient-text">NusaPalma?</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Platform terdepan untuk membantu petani sawit Indonesia meningkatkan produktivitas dan pendapatan
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{benefit.text}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="card bg-gradient-to-br from-primary-500 via-green-500 to-emerald-600 text-white p-8 shadow-2xl border-0">
                <h3 className="text-3xl font-black mb-6">Bergabung Sekarang</h3>
                <ul className="space-y-4 mb-8">
                  {['Daftar gratis tanpa kartu kredit', 'Akses penuh ke semua fitur', 'Dukungan 24/7', 'Update fitur berkala'].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <CheckCircle className="text-green-100" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-white text-primary-600 px-6 py-3 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-xl"
                  >
                    Mulai Sekarang - Gratis
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary-50 to-green-50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Kata <span className="gradient-text">Pengguna</span>
            </h2>
            <p className="text-xl text-gray-600">
              Dengar dari petani yang sudah menggunakan NusaPalma
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="card border-0 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-green-500 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block bg-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-colors shadow-xl border border-white/30"
                  >
                    Masuk ke Akun
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-black gradient-text mb-4">NusaPalma</h3>
              <p className="text-gray-400 text-sm mb-4">
                Platform manajemen sawit terbaik untuk petani Indonesia. Kelola panen, edukasi, dan beasiswa dalam satu tempat.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/register" className="hover:text-primary-500 transition-colors">Daftar</Link></li>
                <li><Link to="/login" className="hover:text-primary-500 transition-colors">Masuk</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary-500 transition-colors">Dashboard</Link></li>
                <li><Link to="/education" className="hover:text-primary-500 transition-colors">Edukasi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Fitur</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/harvest" className="hover:text-primary-500 transition-colors">Manajemen Panen</Link></li>
                <li><Link to="/education" className="hover:text-primary-500 transition-colors">Edukasi Sawit</Link></li>
                <li><Link to="/scholarship" className="hover:text-primary-500 transition-colors">Beasiswa</Link></li>
                <li><Link to="/subscription" className="hover:text-primary-500 transition-colors">Langganan</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>info@nusapalma.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>Indonesia</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 NusaPalma. Dibuat oleh Riyan Perdhana Putra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
