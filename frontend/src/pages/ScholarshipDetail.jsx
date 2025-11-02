import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, DollarSign, FileText, CheckCircle, Users } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const ScholarshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['scholarship', id], async () => {
    const response = await api.get(`/scholarship/${id}`);
    return response.data.data;
  });

  const { mutate: applyScholarship, isLoading: applying } = useMutation(
    async () => {
      const response = await api.post(`/scholarship/${id}/apply`);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Pendaftaran beasiswa berhasil!');
        queryClient.invalidateQueries(['scholarship', id]);
        queryClient.invalidateQueries('my-applications');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal mendaftar beasiswa');
      },
    }
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Beasiswa tidak ditemukan</p>
          <button onClick={() => navigate('/scholarship')} className="btn btn-primary">
            Kembali ke Beasiswa
          </button>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const hasDeadlinePassed = new Date() > new Date(data.deadline);
  const alreadyApplied = data.applicants?.some(
    (app) => app.userId === localStorage.getItem('userId')
  );

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate('/scholarship')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.title}</h1>
                  <p className="text-lg text-gray-600">{data.provider}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-lg font-medium ${
                    data.isActive && !hasDeadlinePassed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {hasDeadlinePassed ? 'Ditutup' : data.isActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>

              <div className="space-y-6 mb-6">
                <div className="flex items-center space-x-2">
                  <DollarSign size={20} className="text-primary-600" />
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(data.amount)}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={20} />
                  <span>
                    Deadline: {format(new Date(data.deadline), 'dd MMMM yyyy', { locale: id })}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Users size={20} />
                  <span>{data.applicants?.length || 0} pendaftar</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{data.description}</p>
              </div>

              {data.requirements && data.requirements.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                    <FileText size={24} className="text-primary-600" />
                    <span>Persyaratan</span>
                  </h3>
                  <ul className="space-y-2">
                    {data.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.eligibility && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Kriteria Kelayakan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.eligibility.minAge && (
                      <div>
                        <p className="text-sm text-gray-600">Usia Minimal</p>
                        <p className="font-medium">{data.eligibility.minAge} tahun</p>
                      </div>
                    )}
                    {data.eligibility.maxAge && (
                      <div>
                        <p className="text-sm text-gray-600">Usia Maksimal</p>
                        <p className="font-medium">{data.eligibility.maxAge} tahun</p>
                      </div>
                    )}
                    {data.eligibility.minGPA && (
                      <div>
                        <p className="text-sm text-gray-600">IPK Minimal</p>
                        <p className="font-medium">{data.eligibility.minGPA}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Tindakan</h3>

              {alreadyApplied ? (
                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                  <p className="text-blue-700 font-medium flex items-center space-x-2">
                    <CheckCircle size={20} />
                    <span>Anda sudah mendaftar beasiswa ini</span>
                  </p>
                </div>
              ) : hasDeadlinePassed ? (
                <div className="p-4 bg-red-50 rounded-lg mb-4">
                  <p className="text-red-700 font-medium">Pendaftaran sudah ditutup</p>
                </div>
              ) : !data.isActive ? (
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <p className="text-gray-700 font-medium">Beasiswa tidak aktif</p>
                </div>
              ) : (
                <button
                  onClick={() => applyScholarship()}
                  disabled={applying}
                  className="btn btn-primary w-full flex items-center justify-center space-x-2 mb-4"
                >
                  <FileText size={20} />
                  <span>{applying ? 'Memproses...' : 'Daftar Sekarang'}</span>
                </button>
              )}

              {data.applicationUrl && (
                <a
                  href={data.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary w-full text-center"
                >
                  Kunjungi Website Resmi
                </a>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-2">Informasi Penting</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Pastikan semua persyaratan terpenuhi</li>
                  <li>• Lengkapi dokumen yang diperlukan</li>
                  <li>• Daftar sebelum deadline</li>
                  <li>• Hubungi penyelenggara untuk info lebih lanjut</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ScholarshipDetail;

