import { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import { DollarSign, TrendingUp, Package, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
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

const Dashboard = () => {
  const { data: dashboardData, isLoading } = useQuery('dashboard', async () => {
    const [stats, harvests] = await Promise.all([
      api.get('/users/dashboard'),
      api.get('/harvest?limit=5'),
    ]);
    return {
      stats: stats.data.data,
      recentHarvests: harvests.data.data,
    };
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const stats = dashboardData?.stats?.stats || {};
  const recentHarvests = dashboardData?.recentHarvests || [];

  // Prepare chart data
  const monthlyData = [
    { month: 'Jan', income: 5000000 },
    { month: 'Feb', income: 7500000 },
    { month: 'Mar', income: 6000000 },
    { month: 'Apr', income: 8500000 },
    { month: 'Mei', income: 9200000 },
    { month: 'Jun', income: 11000000 },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            Dashboard <span className="gradient-text">Sawit</span>
          </h1>
          <p className="text-lg text-gray-600">
            Selamat datang, <span className="font-bold text-primary-600">{dashboardData?.stats?.user?.name}</span>! 👋
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="card bg-gradient-to-br from-primary-500 via-primary-600 to-green-500 text-white relative overflow-hidden shadow-2xl border-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-2 font-medium">Total Pendapatan</p>
                <p className="text-3xl font-black">{formatCurrency(stats.totalIncome || 0)}</p>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <DollarSign size={48} className="text-primary-100" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="card bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white relative overflow-hidden shadow-2xl border-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-2 font-medium">Pendapatan Bulan Ini</p>
                <p className="text-3xl font-black">{formatCurrency(stats.monthlyIncome || 0)}</p>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp size={48} className="text-green-100" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="card bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white relative overflow-hidden shadow-2xl border-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-2 font-medium">Total Panen</p>
                <p className="text-3xl font-black">{stats.totalHarvests || 0}</p>
              </div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Package size={48} className="text-blue-100" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="card bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 text-white relative overflow-hidden shadow-2xl border-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-2 font-medium">Luas Lahan</p>
                <p className="text-3xl font-black">{dashboardData?.stats?.user?.plantationArea || 0} Ha</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar size={48} className="text-purple-100" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-4">Pendapatan Bulanan</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Pendapatan"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-4">Volume Panen</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Volume (Ton)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Harvests */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          whileHover={{ y: -5 }}
          className="card shadow-xl hover:shadow-2xl transition-all border-0"
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
                {recentHarvests.length > 0 ? (
                  recentHarvests.map((harvest) => (
                    <tr key={harvest._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {format(new Date(harvest.date), 'dd MMM yyyy', { locale: id })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                          {harvest.periodType === 'weekly' && 'Mingguan'}
                          {harvest.periodType === 'monthly' && 'Bulanan'}
                          {harvest.periodType === 'yearly' && 'Tahunan'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{harvest.volume} ton</td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(harvest.income)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">
                      Belum ada data panen
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;

