import { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Filter, Search, Star } from 'lucide-react';

const Education = () => {
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    page: 1,
    limit: 12,
  });

  const { data, isLoading } = useQuery(
    ['educations', filters],
    async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const response = await api.get(`/education?${params.toString()}`);
      return response.data;
    }
  );

  const educations = data?.data || [];
  const pagination = data?.pagination || {};

  const categories = [
    { value: '', label: 'Semua Kategori' },
    { value: 'pemupukan', label: 'Pemupukan' },
    { value: 'panen', label: 'Panen' },
    { value: 'pengolahan', label: 'Pengolahan' },
    { value: 'pengendalian-hama', label: 'Pengendalian Hama' },
    { value: 'budidaya', label: 'Budidaya' },
    { value: 'pemasaran', label: 'Pemasaran' },
  ];

  const levels = [
    { value: '', label: 'Semua Level' },
    { value: 'pemula', label: 'Pemula' },
    { value: 'menengah', label: 'Menengah' },
    { value: 'lanjutan', label: 'Lanjutan' },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edukasi Sawit</h1>
          <p className="text-gray-600">Pelajari teknik terbaik untuk meningkatkan produktivitas sawit</p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold">Filter</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value, page: 1 })
                }
                className="input"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={filters.level}
                onChange={(e) =>
                  setFilters({ ...filters, level: e.target.value, page: 1 })
                }
                className="input"
              >
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ category: '', level: '', page: 1, limit: 12 })}
                className="btn btn-secondary w-full"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Education List */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : educations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educations.map((education, index) => (
              <motion.div
                key={education._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Link to={`/education/${education._id}`}>
                  {education.thumbnail && (
                    <img
                      src={education.thumbnail}
                      alt={education.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                        {education.category}
                      </span>
                      {education.isPremium && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium flex items-center space-x-1">
                          <Star size={12} />
                          <span>Premium</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{education.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {education.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>{education.duration || 0} menit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen size={16} />
                      <span>{education.views || 0} views</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Belum ada materi edukasi</p>
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

export default Education;

