import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  LayoutDashboard, 
  User, 
  Settings, 
  DollarSign, 
  BookOpen, 
  GraduationCap,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/harvest', icon: DollarSign, label: 'Panen' },
    { path: '/harvest/history', icon: DollarSign, label: 'Riwayat' },
    { path: '/education', icon: BookOpen, label: 'Edukasi' },
    { path: '/scholarship', icon: GraduationCap, label: 'Beasiswa' },
    { path: '/profile', icon: User, label: 'Profil' },
    { path: '/settings', icon: Settings, label: 'Pengaturan' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2 group">
                <div className="flex flex-col">
                  <span className="text-xl font-black gradient-text">NusaPalma</span>
                  <span className="text-xs text-gray-500 font-medium -mt-1">SATU NUSAN, SATU SAWITAN</span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-100 to-green-100 text-primary-700 shadow-md'
                          : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon size={18} className={isActive ? 'text-primary-600' : ''} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
                <div className="ml-4 flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-sm"
                >
                  <span className="text-gray-600 font-medium">Paket:</span>
                  <span className="ml-2 px-3 py-1.5 bg-gradient-to-r from-primary-500 to-green-500 text-white rounded-lg text-xs font-bold shadow-md">
                    {user?.subscriptionPlan?.toUpperCase() || 'FREE'}
                  </span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium shadow-sm hover:shadow-md"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="px-4 py-2 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

