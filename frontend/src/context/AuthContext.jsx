import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );
      
      const response = await Promise.race([
        api.get('/auth/me'),
        timeoutPromise
      ]);
      
      if (response.data && response.data.data && response.data.data.user) {
        setUser(response.data.data.user);
      }
    } catch (error) {
      // Silently fail - user might not be logged in or backend unavailable
      console.log('Auth check failed:', error.message);
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        if (storedToken && error.response?.status === 401) {
          localStorage.removeItem('token');
        }
      }
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (token && typeof window !== 'undefined') {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          await fetchUser();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };
    
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error('Response format tidak valid');
      }
      
      const { token: newToken, user: userData } = response.data.data;
      
      if (!newToken || !userData) {
        throw new Error('Token atau user data tidak ditemukan dalam response');
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setUser(userData);
      
      toast.success('Login berhasil!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login gagal';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error('Response format tidak valid');
      }
      
      const { token: newToken, user: newUser } = response.data.data;
      
      if (!newToken || !newUser) {
        throw new Error('Token atau user data tidak ditemukan dalam response');
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setUser(newUser);
      
      toast.success('Registrasi berhasil!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || error.message || 'Registrasi gagal';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logout berhasil');
    navigate('/');
  };

  const oauthLogin = async (oauthData) => {
    try {
      const response = await api.post('/auth/oauth', oauthData);
      
      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error('Response format tidak valid');
      }
      
      const { token: newToken, user: userData } = response.data.data;
      
      if (!newToken || !userData) {
        throw new Error('Token atau user data tidak ditemukan dalam response');
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setUser(userData);
      
      toast.success('Login berhasil!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('OAuth login error:', error);
      const message = error.response?.data?.message || error.message || 'Login gagal';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        oauthLogin,
        logout,
        updateUser,
        fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

