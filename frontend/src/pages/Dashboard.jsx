import { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Calendar,
  Plus,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Activity,
  TrendingDown,
  Award,
  Target,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month'); // month, year

  const { data: dashboardData, isLoading, error, refetch } = useQuery(
    'dashboard',
    async () => {
      const [stats, harvests, recentHarvests] = await Promise.all([
        api.get('/users/dashboard'),
        api.get('/harvest?limit=12&sort=-date'),
        api.get('/harvest?limit=5'),
      ]);
      return {
        stats: stats.data.data,
        harvests: harvests.data.data || [],
        recentHarvests: recentHarvests.data.data || [],
      };
    },
    {
      retry: 2,
      refetchOnWindowFocus: false,
    }
  );

  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 17) return 'Selamat Siang';
    return 'Selamat Malam';
  };

  // Prepare chart data from actual harvest data
  const prepareChartData = () => {
    if (!dashboardData?.harvests || dashboardData.harvests.length === 0) {
      // Return sample data if no harvests
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
      return months.map((month) => ({
        month,
        income: 0,
        volume: 0,
      }));
    }

    const harvests = dashboardData.harvests;
    const monthlyMap = new Map();

    harvests.forEach((harvest) => {
      const date = new Date(harvest.date);
      const monthKey = format(date, 'MMM', { locale: id });
      
      if (monthlyMap.has(monthKey)) {
        const existing = monthlyMap.get(monthKey);
        monthlyMap.set(monthKey, {
          month: monthKey,
          income: existing.income + (harvest.income || 0),
          volume: existing.volume + (harvest.volume || 0),
        });
      } else {
        monthlyMap.set(monthKey, {
          month: monthKey,
          income: harvest.income || 0,
          volume: harvest.volume || 0,
        });
      }
    });

    return Array.from(monthlyMap.values()).slice(-6);
  };

  const chartData = prepareChartData();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <p className="text-red-600 mb-4">Gagal memuat dashboard</p>
            <button onClick={() => refetch()} className="btn btn-primary">
              Coba Lagi
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const stats = dashboardData?.stats?.stats || {};
  const recentHarvests = dashboardData?.recentHarvests || [];
  const userName = user?.name || dashboardData?.stats?.user?.name || 'Pengguna';

  // Calculate growth percentage (mock for now, should come from backend)
  const monthlyGrowth = stats.monthlyIncome && stats.totalIncome 
    ? ((stats.monthlyIncome / (stats.totalIncome || 1)) * 100).toFixed(1)
    : 0;

  // Quick Actions
  const quickActions = [
    {
      icon: Plus,
      label: 'Input Panen',
      path: '/harvest',
      color: 'from-green-500 to-emerald-600',
      description: 'Tambah data panen baru',
    },
    {
      icon: BookOpen,
      label: 'Edukasi',
      path: '/education',
      color: 'from-blue-500 to-cyan-600',
      description: 'Pelajari teknik terbaik',
    },
    {
      icon: GraduationCap,
      label: 'Beasiswa',
      path: '/scholarship',
      color: 'from-purple-500 to-violet-600',
      description: 'Lihat program beasiswa',
    },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                {getGreeting()}, <span className="gradient-text">{userName.split(' ')[0]}</span>! 👋
              </h1>
              <p className="text-lg text-gray-600">
                {format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/harvest')}
              className="btn btn-primary flex items-center space-x-2 self-start md:self-auto"
            >
              <Plus size={20} />
              <span>Input Panen Baru</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(action.path)}
                className="card bg-gradient-to-br cursor-pointer group border-0 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{action.label}</h3>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
                  <span>Jelajahi</span>
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="card bg-gradient-to-br from-primary-500 via-primary-600 to-green-500 text-white relative overflow-hidden shadow-2xl border-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-green-100 text-sm font-medium">Total Pendapatan</p>
                <DollarSign size={24} className="text-primary-100" />
              </div>
              <p className="text-3xl font-black mb-2">{formatCurrency(stats.totalIncome || 0)}</p>
              <div className="flex items-center space-x-2 text-xs text-green-100">
                <TrendingUp size={14} />
                <span>Seluruh waktu</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="card bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white relative overflow-hidden shadow-2xl border-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-green-100 text-sm font-medium">Pendapatan Bulan Ini</p>
                <TrendingUp size={24} className="text-green-100" />
              </div>
              <p className="text-3xl font-black mb-2">{formatCurrency(stats.monthlyIncome || 0)}</p>
              <div className="flex items-center space-x-2 text-xs text-green-100">
                <Activity size={14} />
                <span>{monthlyGrowth > 0 ? `+${monthlyGrowth}%` : '0%'} dari total</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="card bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white relative overflow-hidden shadow-2xl border-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-blue-100 text-sm font-medium">Total Panen</p>
                <Package size={24} className="text-blue-100" />
              </div>
              <p className="text-3xl font-black mb-2">{stats.totalHarvests || 0}</p>
              <div className="flex items-center space-x-2 text-xs text-blue-100">
                <Target size={14} />
                <span>Catatan panen</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="card bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 text-white relative overflow-hidden shadow-2xl border-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-purple-100 text-sm font-medium">Luas Lahan</p>
                <Award size={24} className="text-purple-100" />
              </div>
              <p className="text-3xl font-black mb-2">{dashboardData?.stats?.user?.plantationArea || 0} Ha</p>
              <div className="flex items-center space-x-2 text-xs text-purple-100">
                <Calendar size={14} />
                <span>Kebun sawit</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Pendapatan Bulanan</h3>
              <Activity className="text-primary-600" size={20} />
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Pendapatan"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Activity className="mx-auto mb-2 text-gray-400" size={48} />
                  <p>Belum ada data panen</p>
                  <Link to="/harvest" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                    Input panen pertama
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Volume Panen</h3>
              <Package className="text-primary-600" size={20} />
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="volume" fill="#22c55e" name="Volume (Ton)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Package className="mx-auto mb-2 text-gray-400" size={48} />
                  <p>Belum ada data panen</p>
                  <Link to="/harvest" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                    Input panen pertama
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Harvests */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 100 }}
          className="card shadow-xl border-0"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black gradient-text flex items-center space-x-2">
              <Calendar size={28} className="text-primary-600" />
              <span>Panen Terbaru</span>
            </h3>
            <Link 
              to="/harvest" 
              className="text-primary-600 hover:text-primary-700 text-sm font-bold flex items-center space-x-1 group transition-all"
            >
              <span>Lihat Semua</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block"
              >
                →
              </motion.span>
            </Link>
          </div>
          {recentHarvests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tanggal</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Periode</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Volume</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {recentHarvests.map((harvest, index) => (
                    <motion.tr
                      key={harvest._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        {format(new Date(harvest.date), 'dd MMM yyyy', { locale: id })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                          {harvest.periodType === 'weekly' && 'Mingguan'}
                          {harvest.periodType === 'monthly' && 'Bulanan'}
                          {harvest.periodType === 'yearly' && 'Tahunan'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{harvest.volume} ton</td>
                      <td className="py-3 px-4 font-bold text-primary-600">{formatCurrency(harvest.income)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Package className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-gray-600 mb-4">Belum ada data panen</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/harvest')}
                className="btn btn-primary inline-flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Input Panen Pertama</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
