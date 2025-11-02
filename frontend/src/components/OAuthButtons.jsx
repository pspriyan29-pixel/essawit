import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Google Icon SVG Component
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// Facebook Icon SVG Component
const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 6.017 4.388 11.007 10.125 11.879v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

const OAuthButtons = () => {
  const { oauthLogin } = useAuth();
  const [loading, setLoading] = useState(null);
  const [fbSDKLoaded, setFbSDKLoaded] = useState(false);

  // Load Facebook SDK
  useEffect(() => {
    const fbAppId = import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';
    
    if (fbAppId && fbAppId !== 'YOUR_FACEBOOK_APP_ID') {
      // Check if SDK is already loaded
      if (window.FB) {
        setFbSDKLoaded(true);
        return;
      }

      // Load Facebook SDK
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: fbAppId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        setFbSDKLoaded(true);
      };

      // Load script if not already loaded
      if (!document.getElementById('facebook-jssdk')) {
        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        document.body.appendChild(script);
      } else {
        // SDK already exists, check if initialized
        if (window.FB && window.FB.init) {
          window.fbAsyncInit();
        }
      }
    } else {
      // No App ID provided, but we still show the button
      setFbSDKLoaded(true);
    }
  }, []);

  // Google OAuth Login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading('google');
      try {
        // Fetch user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`
          }
        });
        
        const userInfo = await userInfoResponse.json();
        
        // Send to backend
        const result = await oauthLogin({
          provider: 'google',
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          providerId: userInfo.sub
        });
        
        if (!result?.success) {
          setLoading(null);
        }
      } catch (error) {
        console.error('Google login error:', error);
        toast.error(error.message || 'Gagal login dengan Google');
        setLoading(null);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      toast.error('Gagal login dengan Google');
      setLoading(null);
    }
  });

  // Facebook OAuth Login
  const handleFacebookLogin = () => {
    const fbAppId = import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';
    
    if (!fbAppId || fbAppId === 'YOUR_FACEBOOK_APP_ID') {
      toast.error('Facebook App ID belum dikonfigurasi. Silakan setup di .env file.');
      return;
    }

    if (!window.FB) {
      toast.error('Facebook SDK belum dimuat. Silakan refresh halaman.');
      return;
    }

    setLoading('facebook');

    window.FB.login(async (response) => {
      if (response.authResponse) {
        try {
          // Get user info from Facebook
          window.FB.api('/me', { fields: 'id,name,email,picture' }, async (userInfo) => {
            try {
              // Get picture URL
              const pictureResponse = await fetch(`https://graph.facebook.com/v18.0/${userInfo.id}/picture?type=large&redirect=false`);
              const pictureData = await pictureResponse.json();
              const pictureUrl = pictureData.data?.url || '';

              // Send to backend
              const result = await oauthLogin({
                provider: 'facebook',
                email: userInfo.email || `${userInfo.id}@facebook.com`,
                name: userInfo.name,
                picture: pictureUrl,
                providerId: userInfo.id
              });
              
              if (!result?.success) {
                setLoading(null);
              }
            } catch (error) {
              console.error('Facebook login error:', error);
              toast.error(error.message || 'Gagal login dengan Facebook');
              setLoading(null);
            }
          });
        } catch (error) {
          console.error('Facebook API error:', error);
          toast.error('Gagal login dengan Facebook');
          setLoading(null);
        }
      } else {
        toast.error('Gagal login dengan Facebook');
        setLoading(null);
      }
    }, { scope: 'email,public_profile' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-semibold">Atau lanjutkan dengan</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Google OAuth Button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          disabled={loading !== null}
          className="btn btn-google w-full flex items-center justify-center space-x-2 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <motion.div
            animate={loading === 'google' ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </motion.div>
          <span className="font-bold">
            {loading === 'google' ? 'Memproses...' : 'Google'}
          </span>
        </motion.button>

        {/* Facebook OAuth Button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleFacebookLogin}
          disabled={loading !== null || !fbSDKLoaded}
          className="btn btn-facebook w-full flex items-center justify-center space-x-2 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <motion.div
            animate={loading === 'facebook' ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FacebookIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </motion.div>
          <span className="font-bold text-white">
            {loading === 'facebook' ? 'Memproses...' : 'Facebook'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OAuthButtons;
