import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Check, Crown, Star, Building, Zap } from 'lucide-react';

const Subscription = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: plansData } = useQuery('plans', async () => {
    const response = await api.get('/subscription/plans');
    return response.data.data;
  });

  const { data: mySubscription } = useQuery('my-subscription', async () => {
    const response = await api.get('/subscription/my-subscription');
    return response.data.data;
  });

  const handleSubscribe = (planKey) => {
    const plan = plans[planKey];
    if (!plan) return;
    
    // If free plan, subscribe directly
    if (plan.price === 0) {
      subscribe(planKey);
    } else {
      // Redirect to payment page for paid plans
      navigate('/payment', {
        state: {
          plan: planKey,
          planName: plan.name,
          price: plan.price
        }
      });
    }
  };
  
  const { mutate: subscribe, isLoading: subscribing } = useMutation(
    async (plan) => {
      const response = await api.post('/subscription/subscribe', { plan });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Berhasil berlangganan!');
        queryClient.invalidateQueries('my-subscription');
        queryClient.invalidateQueries('profile');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal berlangganan');
      },
    }
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const plans = plansData || {};
  const planOrder = ['free', 'basic', 'premium', 'enterprise'];

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'free':
        return Zap;
      case 'basic':
        return Star;
      case 'premium':
        return Crown;
      case 'enterprise':
        return Building;
      default:
        return Star;
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paket Langganan</h1>
          <p className="text-gray-600">Pilih paket yang sesuai dengan kebutuhan Anda</p>
        </div>

        {/* Current Subscription */}
        {mySubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white"
          >
            <h2 className="text-xl font-semibold mb-4">Paket Saat Ini</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 mb-2">Anda sedang menggunakan</p>
                <p className="text-3xl font-bold">{mySubscription.planDetails?.name || 'Free'}</p>
                {mySubscription.endDate && (
                  <p className="text-primary-100 mt-2 text-sm">
                    Berakhir: {new Date(mySubscription.endDate).toLocaleDateString('id-ID')}
                  </p>
                )}
              </div>
              <div>
                <span
                  className={`px-4 py-2 rounded-lg font-medium ${
                    mySubscription.isActive
                      ? 'bg-white text-primary-600'
                      : 'bg-primary-700 text-white'
                  }`}
                >
                  {mySubscription.isActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planOrder.map((planKey, index) => {
            const plan = plans[planKey];
            if (!plan) return null;

            const Icon = getPlanIcon(planKey);
            const isCurrentPlan = mySubscription?.currentPlan === planKey;
            const isFree = planKey === 'free';

            return (
              <motion.div
                key={planKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card relative ${
                  planKey === 'premium'
                    ? 'border-2 border-primary-500 shadow-lg transform scale-105'
                    : ''
                }`}
              >
                {planKey === 'premium' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      POPULER
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? 'Gratis' : formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/bulan</span>
                    )}
                  </div>
                  {isCurrentPlan && (
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium mb-4">
                      Paket Anda
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(planKey)}
                  disabled={isCurrentPlan || subscribing || isFree}
                  className={`w-full btn ${
                    isCurrentPlan || isFree
                      ? 'btn-secondary cursor-not-allowed'
                      : planKey === 'premium'
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {isCurrentPlan
                    ? 'Paket Aktif'
                    : isFree
                    ? 'Gratis Selamanya'
                    : subscribing
                    ? 'Memproses...'
                    : 'Pilih Paket'}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 card bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Perbandingan Paket</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium">Fitur</th>
                  <th className="text-center py-3 px-4 font-medium">Free</th>
                  <th className="text-center py-3 px-4 font-medium">Basic</th>
                  <th className="text-center py-3 px-4 font-medium">Premium</th>
                  <th className="text-center py-3 px-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Input Panen</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Riwayat Unlimited</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Materi Edukasi</td>
                  <td className="text-center py-3 px-4">Terbatas</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Export Data</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Multi-user Access</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Subscription;

