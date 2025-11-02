import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, language, setLanguage } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const translations = {
    en: {
      welcome: 'WELCOME',
      tagline: 'AI-Powered Agricultural Intelligence Platform',
      login: 'KISAN SETU LOGIN',
      username: 'Username',
      password: 'Password',
      remember: 'Remember Me',
      loginBtn: 'Login',
      forgot: 'Forgot Password?',
      create: 'Create New Account',
      footer: '© 2025 Kisan Setu | Empowering Farmers'
    },
    hi: {
      welcome: 'स्वागत है',
      tagline: 'एआई संचालित कृषि बुद्धिमत्ता मंच',
      login: 'किसान सेतु लॉगिन',
      username: 'उपयोगकर्ता नाम',
      password: 'पासवर्ड',
      remember: 'मुझे याद रखें',
      loginBtn: 'लॉगिन करें',
      forgot: 'पासवर्ड भूल गए?',
      create: 'नया खाता बनाएं',
      footer: '© 2025 किसान सेतु | किसानों को सशक्त बनाना'
    }
  };

  const t = translations[language];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Login with backend API
      const response = await authAPI.login(data);
      const { access_token, token_type } = response.data;
      
      // Store token temporarily for profile request
      const tempUserData = { access_token, token_type };
      localStorage.setItem('kisanSetuUser', JSON.stringify(tempUserData));
      
      // Get user profile
      const profileResponse = await authAPI.getProfile();
      const userProfile = profileResponse.data;
      
      const userData = {
        ...userProfile,
        access_token,
        token_type
      };
      
      // Store complete user data
      login(userData);
      trackUserLogin(userData);
      
      // Navigate based on user type
      if (userData.user_type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password. Please try again.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const trackUserLogin = (user) => {
    const loginSession = {
      username: user.username,
      fullname: user.full_name,
      usertype: user.user_type,
      loginTime: new Date().toISOString(),
      sessionId: generateSessionId(),
      ipAddress: 'localhost',
      userAgent: navigator.userAgent
    };

    let loginHistory = JSON.parse(localStorage.getItem('kisanSetuLoginHistory') || '[]');
    loginHistory.push(loginSession);
    
    if (loginHistory.length > 100) {
      loginHistory = loginHistory.slice(-100);
    }
    
    localStorage.setItem('kisanSetuLoginHistory', JSON.stringify(loginHistory));
    updateUserStats(user.username);
  };

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const updateUserStats = (username) => {
    let userStats = JSON.parse(localStorage.getItem('kisanSetuUserStats') || '{}');
    
    if (!userStats[username]) {
      userStats[username] = {
        totalLogins: 0,
        firstLogin: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
    }
    
    userStats[username].totalLogins++;
    userStats[username].lastLogin = new Date().toISOString();
    
    localStorage.setItem('kisanSetuUserStats', JSON.stringify(userStats));
  };

  if (!pageLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-green-600 to-orange-500 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-4 transition-all duration-700 ease-in-out">
      <div className="bg-white w-full max-w-sm p-10 rounded-3xl shadow-2xl relative overflow-visible transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-200/40 via-yellow-200/40 to-green-300/40 blur-xl scale-110 opacity-60 transition-all duration-500 hover:opacity-100 hover:blur-2xl"></div>
        
        {/* Language Selector */}
        <div className="absolute top-4 right-4 z-10">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 rounded border border-gray-300 bg-white text-green-600 font-semibold cursor-pointer text-sm"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="text-center mb-6">
            <img src="/kisansetu.png" alt="Kisan Setu Logo" className="w-28 h-28 mx-auto mb-4 rounded-2xl object-contain" />
            <div className="text-xl font-bold text-green-600 mb-1 tracking-wide">{t.welcome}</div>
            <div className="text-orange-500 text-sm font-semibold mb-4">{t.tagline}</div>
            <h2 className="text-green-600 font-bold text-lg mb-6 tracking-wide">{t.login}</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-left">
              <label className="block text-sm text-gray-600 mb-1">{t.username}</label>
              <input
                {...register('username', { required: 'Username is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div className="text-left relative">
              <label className="block text-sm text-gray-600 mb-1">{t.password}</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-4">
              <input type="checkbox" className="mr-2" />
              <span>{t.remember}</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-xl text-base font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : t.loginBtn}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <a href="#" className="block text-orange-500 text-sm hover:text-yellow-500">{t.forgot}</a>
            <Link to="/register" className="block text-orange-500 text-sm hover:text-yellow-500">{t.create}</Link>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <strong>Demo Accounts:</strong><br/>
            Admin: admin / password<br/>
            Farmer: farmer1 / password<br/>
            <br/>
            <strong>Or create your own account:</strong><br/>
            Click "Create New Account" to register
          </div>

          <footer className="text-center text-xs text-gray-600 mt-6">
            {t.footer}<br/>
            <Link to="/admin" className="text-orange-500 text-xs hover:underline">🔍 View Database</Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;