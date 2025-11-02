import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Star, CheckCircle, Play } from 'lucide-react';
import toast from 'react-hot-toast';

const EducationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(['education', id], async () => {
    const response = await api.get(`/education/${id}`);
    return response.data.data;
  });

  const { mutate: updateProgress } = useMutation(
    async ({ progress, completed }) => {
      const response = await api.post('/education/progress', {
        educationId: id,
        progress,
        completed,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate queries to refresh progress
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
          <p className="text-gray-600 mb-4">Materi edukasi tidak ditemukan</p>
          <button onClick={() => navigate('/education')} className="btn btn-primary">
            Kembali ke Edukasi
          </button>
        </div>
      </Layout>
    );
  }

  const progress = data.progress || { progress: 0, completed: false };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate('/education')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              {data.thumbnail && (
                <img
                  src={data.thumbnail}
                  alt={data.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                    {data.category}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    {data.level}
                  </span>
                  {data.isPremium && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium flex items-center space-x-1">
                      <Star size={14} />
                      <span>Premium</span>
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{data.title}</h1>
                <p className="text-gray-600 mb-6">{data.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>{data.duration || 0} menit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen size={16} />
                    <span>{data.views || 0} views</span>
                  </div>
                </div>

                {data.videoUrl && (
                  <div className="mb-6">
                    <iframe
                      src={data.videoUrl}
                      className="w-full h-96 rounded-lg"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: data.content }} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Progress Belajar</h3>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">{progress.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {progress.completed && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-green-700 font-medium">Selesai Dipelajari</span>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => updateProgress({ progress: 25, completed: false })}
                  className="btn btn-secondary w-full text-left"
                >
                  Mark 25%
                </button>
                <button
                  onClick={() => updateProgress({ progress: 50, completed: false })}
                  className="btn btn-secondary w-full text-left"
                >
                  Mark 50%
                </button>
                <button
                  onClick={() => updateProgress({ progress: 75, completed: false })}
                  className="btn btn-secondary w-full text-left"
                >
                  Mark 75%
                </button>
                <button
                  onClick={() => updateProgress({ progress: 100, completed: true })}
                  className="btn btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={20} />
                  <span>Mark Selesai</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default EducationDetail;

