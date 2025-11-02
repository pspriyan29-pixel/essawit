import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Package, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery('profile', async () => {
    const response = await api.get('/users/profile');
    return response.data.data;
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    province: '',
    city: '',
    plantationArea: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (data) {
      setProfileForm({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        province: data.province || '',
        city: data.city || '',
        plantationArea: data.plantationArea || '',
      });
    }
  }, [data]);

  const { mutate: updateProfile, isLoading: updatingProfile } = useMutation(
    async (formData) => {
      const response = await api.put('/users/profile', formData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Profil berhasil diperbarui!');
        updateUser(data.data);
        queryClient.invalidateQueries('profile');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
      },
    }
  );

  const { mutate: changePassword, isLoading: changingPassword } = useMutation(
    async (formData) => {
      const response = await api.put('/users/change-password', formData);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Password berhasil diubah!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal mengubah password');
      },
    }
  );

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const formData = {
      ...profileForm,
      plantationArea: parseFloat(profileForm.plantationArea) || 0,
    };
    updateProfile(formData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }

    changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
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

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan</h1>
          <p className="text-gray-600">Kelola informasi akun dan preferensi Anda</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center space-x-2 mb-6">
              <User size={24} className="text-primary-600" />
              <h2 className="text-xl font-semibold">Edit Profil</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Telepon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phone: e.target.value })
                      }
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provinsi
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={profileForm.province}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, province: e.target.value })
                      }
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kota/Kabupaten
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, city: e.target.value })
                      }
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap
                  </label>
                  <textarea
                    value={profileForm.address}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, address: e.target.value })
                    }
                    className="input"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Luas Lahan (Hektar)
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      value={profileForm.plantationArea}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, plantationArea: e.target.value })
                      }
                      className="input pl-10"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Save size={20} />
                <span>{updatingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </form>
          </motion.div>

          {/* Password Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Lock size={24} className="text-primary-600" />
              <h2 className="text-xl font-semibold">Ubah Password</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Saat Ini
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Lock size={20} />
                <span>{changingPassword ? 'Mengubah...' : 'Ubah Password'}</span>
              </button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Settings;

