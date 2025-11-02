import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Calendar, Package, DollarSign, Save } from 'lucide-react';

const Harvest = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    periodType: 'weekly',
    income: '',
    volume: '',
    pricePerTon: '',
    notes: '',
    location: '',
  });

  const { mutate: createHarvest, isLoading } = useMutation(
    async (data) => {
      const response = await api.post('/harvest', data);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Data panen berhasil disimpan!');
        setFormData({
          date: new Date().toISOString().split('T')[0],
          periodType: 'weekly',
          income: '',
          volume: '',
          pricePerTon: '',
          notes: '',
          location: '',
        });
        queryClient.invalidateQueries('dashboard');
        queryClient.invalidateQueries('harvests');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal menyimpan data panen');
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      income: parseFloat(formData.income),
      volume: parseFloat(formData.volume),
      pricePerTon: parseFloat(formData.pricePerTon),
    };

    createHarvest(data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            Input Data <span className="gradient-text">Panen</span>
          </h1>
          <p className="text-lg text-gray-600">Catat pendapatan panen mingguan, bulanan, atau tahunan dengan mudah</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          onSubmit={handleSubmit}
          className="card shadow-2xl border-0 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Panen
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Periode
              </label>
              <select
                name="periodType"
                value={formData.periodType}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
                <option value="yearly">Tahunan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume (Ton)
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="0"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga per Ton (Rp)
              </label>
              <input
                type="number"
                name="pricePerTon"
                value={formData.pricePerTon}
                onChange={handleChange}
                className="input"
                placeholder="0"
                step="1000"
                min="0"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Pendapatan (Rp)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="0"
                  step="1000"
                  min="0"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                * Otomatis: Volume × Harga per Ton = {formData.volume && formData.pricePerTon 
                  ? new Intl.NumberFormat('id-ID').format(parseFloat(formData.volume || 0) * parseFloat(formData.pricePerTon || 0))
                  : '0'} (Isi manual jika berbeda)
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input"
                placeholder="Nama lokasi/blok kebun"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input"
                rows="4"
                placeholder="Catatan tambahan..."
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn btn-primary flex items-center space-x-2 shadow-xl hover:shadow-2xl"
            >
              <Save size={20} />
              <span>{isLoading ? 'Menyimpan...' : 'Simpan Data'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => window.location.reload()}
              className="btn btn-secondary shadow-lg hover:shadow-xl"
            >
              Reset
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </Layout>
  );
};

export default Harvest;

