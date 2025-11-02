import { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { GraduationCap, Calendar, DollarSign, Filter, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Scholarship = () => {
  const [filters, setFilters] = useState({
    isActive: 'true',
    page: 1,
    limit: 12,
  });

  const { data, isLoading } = useQuery(
    ['scholarships', filters],
    async () => {
      const params = new URLSearchParams();
      if (filters.isActive) params.append('isActive', filters.isActive);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const response = await api.get(`/scholarship?${params.toString()}`);
      return response.data;
    }
  );

  const scholarships = data?.data || [];
  const pagination = data?.pagination || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Beasiswa Sawit</h1>
          <p className="text-gray-600">Dapatkan informasi beasiswa khusus untuk petani sawit dan keluarganya</p>
        </div>

        {/* Filter */}
        <div className="card mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold">Filter</h3>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filters.isActive}
              onChange={(e) =>
                setFilters({ ...filters, isActive: e.target.value, page: 1 })
              }
              className="input"
            >
              <option value="true">Aktif</option>
              <option value="false">Tidak Aktif</option>
              <option value="">Semua</option>
            </select>
          </div>
        </div>

        {/* Scholarship List */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : scholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((scholarship, index) => (
              <motion.div
                key={scholarship._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <Link to={`/scholarship/${scholarship._id}`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold line-clamp-2">{scholarship.title}</h3>
                      <p className="text-sm text-gray-600">{scholarship.provider}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{scholarship.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign size={16} className="text-gray-400" />
                      <span className="font-medium text-primary-600">
                        {formatCurrency(scholarship.amount)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>
                        Deadline: {format(new Date(scholarship.deadline), 'dd MMM yyyy', { locale: id })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <TrendingUp size={16} />
                      <span>{scholarship.applicants?.length || 0} pendaftar</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        scholarship.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {scholarship.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <GraduationCap size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Belum ada beasiswa tersedia</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-between">
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
      </motion.div>
    </Layout>
  );
};

export default Scholarship;

