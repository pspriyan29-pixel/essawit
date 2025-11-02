import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { QrCode, CreditCard, Building2, Check, Copy, ArrowLeft, Smartphone } from 'lucide-react';
// QRIS Image - User needs to add the QRIS image to frontend/src/assets/qris-code.png
// For now, we'll show a placeholder

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { plan, planName, price } = location.state || {};
  
  const [selectedMethod, setSelectedMethod] = useState('qris');
  const [paymentData, setPaymentData] = useState(null);
  const [copied, setCopied] = useState({});

  // Redirect if no plan data
  useEffect(() => {
    if (!plan || !price) {
      toast.error('Data paket tidak ditemukan');
      navigate('/subscription');
    }
  }, [plan, price, navigate]);

  const { mutate: createPayment, isLoading: creatingPayment } = useMutation(
    async ({ method, plan }) => {
      const response = await api.post('/subscription/create-payment', {
        method,
        plan
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setPaymentData(data.data);
        toast.success('Data pembayaran berhasil dibuat');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Gagal membuat pembayaran');
      },
    }
  );

  const { mutate: verifyPayment, isLoading: verifying } = useMutation(
    async (paymentId) => {
      const response = await api.post('/subscription/verify-payment', { paymentId });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Pembayaran berhasil diverifikasi!');
        queryClient.invalidateQueries('my-subscription');
        queryClient.invalidateQueries('profile');
        navigate('/subscription');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Verifikasi gagal');
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

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [field]: true });
    toast.success('Berhasil disalin!');
    setTimeout(() => setCopied({ ...copied, [field]: false }), 2000);
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setPaymentData(null);
  };

  const handleCreatePayment = () => {
    createPayment({ method: selectedMethod, plan });
  };

  const paymentMethods = [
    {
      id: 'qris',
      name: 'QRIS',
      icon: QrCode,
      description: 'Pembayaran cepat via QRIS',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'bri',
      name: 'Bank Transfer BRI',
      icon: Building2,
      description: 'Transfer via Bank BRI',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'mandiri',
      name: 'Bank Transfer Mandiri',
      icon: Building2,
      description: 'Transfer via Bank Mandiri',
      color: 'from-green-500 to-green-600'
    }
  ];

  const bankAccounts = {
    bri: {
      bank: 'Bank Rakyat Indonesia (BRI)',
      accountNumber: '109901070159500',
      accountName: 'RIYAN PERDHANA PUTRA, WEBSIT, DIGITAL & KREATIF'
    },
    mandiri: {
      bank: 'Bank Mandiri',
      accountNumber: '1080028325505',
      accountName: 'RIYAN PERDHANA PUTRA, WEBSIT, DIGITAL & KREATIF'
    }
  };

  const qrisInfo = {
    merchant: 'RIYAN PERDHANA PUTRA, WEBSIT, DIGITAL & KREATIF',
    nmid: 'ID1025445733781'
  };

  if (!plan || !price) {
    return null;
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <button
          onClick={() => navigate('/subscription')}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Kembali ke Paket Langganan
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran Langganan</h1>
          <p className="text-gray-600">Pilih metode pembayaran untuk paket {planName}</p>
        </div>

        {/* Payment Summary */}
        <div className="card mb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <h2 className="text-xl font-semibold mb-4">Ringkasan Pembayaran</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 mb-2">Paket</p>
              <p className="text-2xl font-bold">{planName}</p>
            </div>
            <div className="text-right">
              <p className="text-primary-100 mb-2">Total Pembayaran</p>
              <p className="text-3xl font-bold">{formatCurrency(price)}</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-6">Pilih Metode Pembayaran</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              
              return (
                <motion.button
                  key={method.id}
                  onClick={() => handleSelectMethod(method.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  {isSelected && (
                    <div className="mt-3 flex items-center justify-center text-primary-600">
                      <Check size={16} className="mr-1" />
                      <span className="text-sm font-medium">Dipilih</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {!paymentData && (
            <button
              onClick={handleCreatePayment}
              disabled={creatingPayment}
              className="w-full btn btn-primary"
            >
              {creatingPayment ? 'Memproses...' : 'Buat Pembayaran'}
            </button>
          )}
        </div>

        {/* Payment Instructions */}
        {paymentData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* QRIS Payment */}
            {selectedMethod === 'qris' && (
              <div className="card">
                <div className="flex items-center mb-4">
                  <QrCode className="text-primary-600 mr-2" size={24} />
                  <h2 className="text-xl font-semibold">Pembayaran via QRIS</h2>
                </div>
                
                <div className="bg-white rounded-lg p-6 mb-6 border-2 border-gray-200">
                  {/* QR Code Image */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                      {/* User needs to add QRIS image to frontend/src/assets/qris-code.png */}
                      <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <QrCode size={64} className="text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Tambahkan QRIS Code Image</p>
                          <p className="text-xs text-gray-400 mt-1">frontend/src/assets/qris-code.png</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QRIS Info */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Merchant Name</p>
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <p className="font-semibold">{qrisInfo.merchant}</p>
                        <button
                          onClick={() => copyToClipboard(qrisInfo.merchant, 'merchant')}
                          className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Copy size={16} className={copied.merchant ? 'text-green-600' : 'text-gray-400'} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">NMID</p>
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <p className="font-mono font-semibold">{qrisInfo.nmid}</p>
                        <button
                          onClick={() => copyToClipboard(qrisInfo.nmid, 'nmid')}
                          className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Copy size={16} className={copied.nmid ? 'text-green-600' : 'text-gray-400'} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <Smartphone className="mr-2" size={20} />
                      Cara Pembayaran QRIS:
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                      <li>Buka aplikasi mobile banking atau e-wallet yang mendukung QRIS</li>
                      <li>Pilih menu Scan QR Code atau QRIS</li>
                      <li>Scan QR code di atas dengan aplikasi Anda</li>
                      <li>Periksa detail merchant dan nominal pembayaran</li>
                      <li>Konfirmasi pembayaran</li>
                      <li>Setelah pembayaran berhasil, klik tombol "Verifikasi Pembayaran" di bawah</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Perhatian:</strong> Pastikan nominal pembayaran sesuai dengan <strong>{formatCurrency(price)}</strong>. Setelah pembayaran berhasil, klik tombol verifikasi di bawah.
                  </p>
                </div>
              </div>
            )}

            {/* Bank Transfer BRI */}
            {selectedMethod === 'bri' && (
              <div className="card">
                <div className="flex items-center mb-4">
                  <Building2 className="text-orange-600 mr-2" size={24} />
                  <h2 className="text-xl font-semibold">Pembayaran via Bank BRI</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bank</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold">{bankAccounts.bri.bank}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nomor Rekening</p>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <p className="font-mono font-semibold text-lg">{bankAccounts.bri.accountNumber}</p>
                      <button
                        onClick={() => copyToClipboard(bankAccounts.bri.accountNumber, 'bri_account')}
                        className="ml-2 p-2 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Copy size={18} className={copied.bri_account ? 'text-green-600' : 'text-gray-400'} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nama Penerima</p>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold">{bankAccounts.bri.accountName}</p>
                      <button
                        onClick={() => copyToClipboard(bankAccounts.bri.accountName, 'bri_name')}
                        className="ml-2 p-2 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Copy size={18} className={copied.bri_name ? 'text-green-600' : 'text-gray-400'} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nominal Transfer</p>
                    <div className="flex items-center justify-between bg-primary-50 p-3 rounded-lg border-2 border-primary-200">
                      <p className="font-bold text-lg text-primary-700">{formatCurrency(price)}</p>
                      <button
                        onClick={() => copyToClipboard(price.toString(), 'bri_amount')}
                        className="ml-2 p-2 hover:bg-primary-100 rounded transition-colors"
                      >
                        <Copy size={18} className={copied.bri_amount ? 'text-green-600' : 'text-primary-600'} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Cara Pembayaran via Bank BRI:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>Transfer sejumlah <strong>{formatCurrency(price)}</strong> ke rekening di atas</li>
                    <li>Gunakan aplikasi BRI Mobile, ATM BRI, atau teller bank</li>
                    <li>Pastikan nominal transfer sesuai dengan total pembayaran</li>
                    <li>Simpan bukti transfer (screenshot atau foto)</li>
                    <li>Setelah transfer berhasil, klik tombol "Verifikasi Pembayaran" di bawah</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Perhatian:</strong> Pastikan nominal transfer sesuai dengan <strong>{formatCurrency(price)}</strong>. Verifikasi pembayaran akan memproses aktivasi langganan Anda.
                  </p>
                </div>
              </div>
            )}

            {/* Bank Transfer Mandiri */}
            {selectedMethod === 'mandiri' && (
              <div className="card">
                <div className="flex items-center mb-4">
                  <Building2 className="text-green-600 mr-2" size={24} />
                  <h2 className="text-xl font-semibold">Pembayaran via Bank Mandiri</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bank</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold">{bankAccounts.mandiri.bank}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nomor Rekening</p>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <p className="font-mono font-semibold text-lg">{bankAccounts.mandiri.accountNumber}</p>
                      <button
                        onClick={() => copyToClipboard(bankAccounts.mandiri.accountNumber, 'mandiri_account')}
                        className="ml-2 p-2 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Copy size={18} className={copied.mandiri_account ? 'text-green-600' : 'text-gray-400'} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nama Penerima</p>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold">{bankAccounts.mandiri.accountName}</p>
                      <button
                        onClick={() => copyToClipboard(bankAccounts.mandiri.accountName, 'mandiri_name')}
                        className="ml-2 p-2 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Copy size={18} className={copied.mandiri_name ? 'text-green-600' : 'text-gray-400'} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nominal Transfer</p>
                    <div className="flex items-center justify-between bg-primary-50 p-3 rounded-lg border-2 border-primary-200">
                      <p className="font-bold text-lg text-primary-700">{formatCurrency(price)}</p>
                      <button
                        onClick={() => copyToClipboard(price.toString(), 'mandiri_amount')}
                        className="ml-2 p-2 hover:bg-primary-100 rounded transition-colors"
                      >
                        <Copy size={18} className={copied.mandiri_amount ? 'text-green-600' : 'text-primary-600'} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Cara Pembayaran via Bank Mandiri:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>Transfer sejumlah <strong>{formatCurrency(price)}</strong> ke rekening di atas</li>
                    <li>Gunakan aplikasi Mandiri Online, ATM Mandiri, atau teller bank</li>
                    <li>Pastikan nominal transfer sesuai dengan total pembayaran</li>
                    <li>Simpan bukti transfer (screenshot atau foto)</li>
                    <li>Setelah transfer berhasil, klik tombol "Verifikasi Pembayaran" di bawah</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Perhatian:</strong> Pastikan nominal transfer sesuai dengan <strong>{formatCurrency(price)}</strong>. Verifikasi pembayaran akan memproses aktivasi langganan Anda.
                  </p>
                </div>
              </div>
            )}

            {/* Payment Info */}
            {paymentData && (
              <div className="card bg-gray-50 border-2 border-gray-300">
                <h3 className="font-semibold mb-3">Informasi Pembayaran</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Pembayaran:</span>
                    <span className="font-mono font-semibold">{paymentData.paymentId || paymentData._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metode:</span>
                    <span className="font-semibold capitalize">{paymentData.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${
                      paymentData.status === 'pending' ? 'text-yellow-600' : 
                      paymentData.status === 'verified' ? 'text-green-600' : 
                      'text-red-600'
                    }`}>
                      {paymentData.status === 'pending' ? 'Menunggu Pembayaran' :
                       paymentData.status === 'verified' ? 'Terverifikasi' :
                       'Dibatalkan'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waktu:</span>
                    <span className="font-semibold">
                      {new Date(paymentData.createdAt).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Verify Payment Button */}
            {paymentData && paymentData.status === 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <button
                  onClick={() => verifyPayment(paymentData._id || paymentData.paymentId)}
                  disabled={verifying}
                  className="w-full btn btn-primary text-lg py-4"
                >
                  {verifying ? 'Memverifikasi...' : 'Verifikasi Pembayaran'}
                </button>
                <p className="text-center text-sm text-gray-600 mt-3">
                  Klik tombol ini setelah Anda selesai melakukan pembayaran
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Payment;

