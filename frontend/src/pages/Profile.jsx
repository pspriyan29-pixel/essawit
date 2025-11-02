import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import { User, Mail, Phone, MapPin, Package, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { data, isLoading } = useQuery('profile', async () => {
    const response = await api.get('/users/profile');
    return response.data.data;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const user = data || {};

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
          <p className="text-gray-600">Informasi akun Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Informasi Pribadi</h2>
                <Link
                  to="/settings"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Edit Profil →
                </Link>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <User className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
                    <p className="text-lg font-medium">{user.name || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Mail className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-lg font-medium">{user.email || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Phone className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">No. Telepon</p>
                    <p className="text-lg font-medium">{user.phone || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Alamat</p>
                    <p className="text-lg font-medium">
                      {user.address || '-'}
                      {user.city && `, ${user.city}`}
                      {user.province && `, ${user.province}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-6">
              <h2 className="text-xl font-semibold mb-6">Informasi Kebun</h2>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Luas Lahan</p>
                  <p className="text-lg font-medium">{user.plantationArea || 0} Hektar</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Langganan</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Paket Saat Ini</p>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-lg font-medium text-sm">
                    {user.subscriptionPlan?.toUpperCase() || 'FREE'}
                  </span>
                </div>
                {user.subscriptionStartDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mulai</p>
                    <p className="font-medium">
                      {format(new Date(user.subscriptionStartDate), 'dd MMM yyyy', { locale: id })}
                    </p>
                  </div>
                )}
                {user.subscriptionEndDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Berakhir</p>
                    <p className="font-medium">
                      {format(new Date(user.subscriptionEndDate), 'dd MMM yyyy', { locale: id })}
                    </p>
                  </div>
                )}
                <Link
                  to="/subscription"
                  className="block w-full btn btn-primary text-center"
                >
                  Kelola Langganan
                </Link>
              </div>
            </div>

            <div className="card mt-6">
              <h2 className="text-xl font-semibold mb-6">Informasi Akun</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bergabung</p>
                  <p className="font-medium">
                    {user.createdAt
                      ? format(new Date(user.createdAt), 'dd MMM yyyy', { locale: id })
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-lg font-medium text-sm ${
                      user.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Profile;

