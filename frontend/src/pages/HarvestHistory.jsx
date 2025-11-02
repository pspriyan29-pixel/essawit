import { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, Filter, Search, Download } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const HarvestHistory = () => {
  const [filters, setFilters] = useState({
    periodType: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
  });

  const { data: statsData } = useQuery('harvest-stats', async () => {
    const response = await api.get('/harvest/statistics');
    return response.data.data;
  });

  const { data: harvestsData, isLoading } = useQuery(
    ['harvests', filters],
    async () => {
      const params = new URLSearchParams();
      if (filters.periodType) params.append('periodType', filters.periodType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const response = await api.get(`/harvest?${params.toString()}`);
      return response.data;
    }
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  const harvests = harvestsData?.data || [];
  const pagination = harvestsData?.pagination || {};

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Panen</h1>
          <p className="text-gray-600">Lihat dan analisis data panen Anda</p>
        </div>

        {/* Statistics */}
        {statsData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Pendapatan</h3>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(statsData.totalIncome || 0)}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Volume</h3>
              <p className="text-2xl font-bold text-green-600">
                {statsData.totalVolume?.toFixed(2) || 0} ton
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-sm font-medium text-gray-600 mb-2">Rata-rata Harga/Ton</h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(statsData.averagePrice || 0)}
              </p>
            </motion.div>
          </div>
        )}

        {/* Charts */}
        {statsData && statsData.monthlyStats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-xl font-semibold mb-4">Pendapatan Bulanan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={Object.entries(statsData.monthlyStats || {}).map(([month, data]) => ({
                    month: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][parseInt(month) - 1],
                    income: data.income,
                  }))}
                >
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
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-xl font-semibold mb-4">Volume Bulanan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(statsData.monthlyStats || {}).map(([month, data]) => ({
                    month: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][parseInt(month) - 1],
                    volume: data.volume,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold">Filter</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Periode
              </label>
              <select
                name="periodType"
                value={filters.periodType}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">Semua</option>
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
                <option value="yearly">Tahunan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dari Tanggal
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sampai Tanggal
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ ...filters, periodType: '', startDate: '', endDate: '', page: 1 })}
                className="btn btn-secondary w-full"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tanggal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Periode</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Volume</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Harga/Ton</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Pendapatan</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Lokasi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : harvests.length > 0 ? (
                  harvests.map((harvest) => (
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
                      <td className="py-3 px-4">{formatCurrency(harvest.pricePerTon)}</td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(harvest.income)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{harvest.location || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      Belum ada data panen
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Halaman {pagination.page} dari {pagination.pages}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  disabled={filters.page === 1}
                  className="btn btn-secondary"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  disabled={filters.page === pagination.pages}
                  className="btn btn-secondary"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default HarvestHistory;

