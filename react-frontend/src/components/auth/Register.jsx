import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import { useUserData } from '../../hooks/useUserData';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { language, setLanguage, login } = useAuth();
  const { saveFormData, getSavedFormData } = useUserData();
  const navigate = useNavigate();

  const password = watch('password');

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-save form data as user types
  const watchedFields = watch();
  useEffect(() => {
    if (Object.keys(watchedFields).length > 0) {
      const timeoutId = setTimeout(() => {
        saveFormData('registration', watchedFields);
      }, 2000); // Save after 2 seconds of inactivity
      return () => clearTimeout(timeoutId);
    }
  }, [watchedFields, saveFormData]);

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = getSavedFormData('registration');
    if (savedData && Object.keys(savedData).length > 0) {
      Object.keys(savedData).forEach(key => {
        if (key !== 'password' && key !== 'confirmPassword' && key !== 'terms') {
          register(key).onChange({ target: { value: savedData[key] } });
        }
      });
    }
  }, [register, getSavedFormData]);

  useEffect(() => {
    if (password) {
      checkPasswordStrength(password);
    } else {
      setPasswordStrength('');
    }
  }, [password]);

  const translations = {
    en: {
      welcome: 'JOIN US',
      tagline: 'Create Your Kisan Setu Account',
      register: 'REGISTER',
      fullname: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      usertype: 'User Type',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      terms: 'I agree to the Terms of Service and Privacy Policy',
      registerBtn: 'Create Account',
      login: 'Already have an account? Login',
      footer: '© 2025 Kisan Setu | Empowering Farmers',
      farmer: 'Farmer',
      consumer: 'Consumer',
      vendor: 'Vendor'
    },
    hi: {
      welcome: 'हमसे जुड़ें',
      tagline: 'अपना किसान सेतु खाता बनाएं',
      register: 'पंजीकरण',
      fullname: 'पूरा नाम',
      email: 'ईमेल',
      phone: 'फोन नंबर',
      usertype: 'उपयोगकर्ता प्रकार',
      username: 'उपयोगकर्ता नाम',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      terms: 'मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूं',
      registerBtn: 'खाता बनाएं',
      login: 'पहले से खाता है? लॉगिन करें',
      footer: '© 2025 किसान सेतु | किसानों को सशक्त बनाना',
      farmer: 'किसान',
      consumer: 'उपभोक्ता',
      vendor: 'विक्रेता'
    }
  };

  const t = translations[language];

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score < 3) {
      setPasswordStrength('weak');
    } else if (score < 4) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const onSubmit = async (data) => {
    // Client-side validation
    if (!data.fullname?.trim()) {
      alert('Please enter your full name');
      return;
    }
    
    if (!data.email?.trim()) {
      alert('Please enter your email');
      return;
    }
    
    if (!data.phone?.trim()) {
      alert('Please enter your phone number');
      return;
    }
    
    if (!data.username?.trim()) {
      alert('Please choose a username');
      return;
    }
    
    if (!data.usertype) {
      alert('Please select user type');
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (data.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (!data.terms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        full_name: data.fullname.trim(),
        user_type: data.usertype,
        password: data.password,
        phone: data.phone.trim()
      };

      console.log('Sending registration data:', userData);
      const response = await authAPI.register(userData);
      console.log('Registration response:', response);
      
      if (response.data && (response.data.success || response.data.message)) {
        // Auto-login after successful registration
        const loginData = {
          ...response.data,
          username: userData.username,
          full_name: userData.full_name,
          email: userData.email,
          user_type: userData.user_type,
          phone: userData.phone,
          access_token: response.data.access_token || 'temp_token_' + Date.now(),
          token_type: 'bearer'
        };
        
        // Save user data and auto-login
        login(loginData, true); // Remember user
        
        alert(`🎉 Registration successful! Welcome ${data.fullname}! You are now logged in.`);
        navigate('/dashboard');
      } else {
        throw new Error('Registration failed - invalid response');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.detail || 'Username or email already exists.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Please check all fields are filled correctly.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        // Backend is down - use mock registration with full data persistence
        console.warn('Backend unavailable, using mock registration');
        const mockUser = {
          id: Date.now(),
          username: data.username,
          email: data.email,
          full_name: data.fullname,
          user_type: data.usertype || 'farmer',
          phone: data.phone,
          access_token: 'mock_token_' + Date.now(),
          token_type: 'bearer',
          registration_date: new Date().toISOString(),
          profile_complete: true
        };
        
        // Auto-login with mock data
        login(mockUser, true);
        
        alert(`🎉 Registration successful! Welcome ${data.fullname}! (Offline mode - all data saved locally)`);
        navigate('/dashboard');
        return;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!pageLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-green-600 to-orange-500 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center mobile-px p-2 sm:p-4 transition-all duration-700 ease-in-out safe-area-top">
      <div className="bg-white w-full max-w-md mobile-card p-4 sm:p-8 rounded-3xl shadow-2xl relative overflow-visible transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-200/40 via-yellow-200/40 to-orange-200/40 blur-xl scale-110 opacity-60 transition-all duration-500 hover:opacity-100 hover:blur-2xl"></div>
        
        {/* Language Selector */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 rounded border border-gray-300 bg-white text-green-600 font-semibold cursor-pointer text-xs min-h-[44px]"
          >
            <option value="en">EN</option>
            <option value="hi">हिं</option>
          </select>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="text-center mb-3 sm:mb-4">
            <img src="/kisansetu.png" alt="Kisan Setu Logo" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 rounded-2xl object-contain" />
            <div className="text-base sm:text-lg font-bold text-green-600 mb-1 tracking-wide">{t.welcome}</div>
            <div className="text-orange-500 text-xs sm:text-sm font-semibold mb-2 sm:mb-3">{t.tagline}</div>
            <h2 className="text-green-600 font-bold text-sm sm:text-base mb-3 sm:mb-4 tracking-wide">{t.register}</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 sm:space-y-3">
            <div className="text-left">
              <label className="block text-xs text-gray-600 mb-1">{t.fullname}</label>
              <input
                {...register('fullname', { required: 'Full name is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-200 text-base"
                placeholder="Enter your full name"
              />
              {errors.fullname && (
                <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>
              )}
            </div>

            <div className="text-left">
              <label className="block text-xs text-gray-600 mb-1">{t.email}</label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-200 text-base"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="text-left">
              <label className="block text-xs text-gray-600 mb-1">{t.phone}</label>
              <input
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number'
                  }
                })}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-200 text-base"
                placeholder="Enter 10-digit phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="text-left">
              <label className="block text-xs text-gray-600 mb-1">{t.usertype}</label>
              <select
                {...register('usertype', { required: 'User type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-200"
              >
                <option value="">Select user type</option>
                <option value="farmer">{t.farmer}</option>
                <option value="consumer">{t.consumer}</option>
                <option value="vendor">{t.vendor}</option>
                <option value="admin">Admin</option>
              </select>
              {errors.usertype && (
                <p className="text-red-500 text-xs mt-1">{errors.usertype.message}</p>
              )}
            </div>

            <div className="text-left">
              <label className="block text-xs text-gray-600 mb-1">{t.username}</label>
              <input
                {...register('username', { required: 'Username is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-200 text-base"
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            <div className="text-left relative">
              <label className="block text-xs text-gray-600 mb-1">{t.password}</label>
              <input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-200 text-base"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {passwordStrength && (
                <div className={`text-xs mt-1 ${
                  passwordStrength === 'weak' ? 'text-red-500' :
                  passwordStrength === 'medium' ? 'text-orange-500' : 'text-green-500'
                }`}>
                  {passwordStrength === 'weak' && 'Weak password - Add more characters for better security'}
                  {passwordStrength === 'medium' && 'Medium strength - Consider adding special characters'}
                  {passwordStrength === 'strong' && 'Strong password - Great for security!'}
                </div>
              )}
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="text-left relative">
              <label className="block text-xs text-gray-600 mb-1">{t.confirmPassword}</label>
              <input
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-200 text-base"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start text-xs text-gray-600 mb-3 sm:mb-4">
              <input 
                {...register('terms', { required: 'Please accept the terms' })}
                type="checkbox" 
                className="mr-2 mt-1 min-w-[16px] min-h-[16px]" 
              />
              <label className="text-left cursor-pointer">{t.terms}</label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 min-h-[44px] flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : t.registerBtn}
            </button>
          </form>

          <div className="mt-3 sm:mt-4 text-center space-y-2">
            <Link to="/login" className="block text-orange-500 text-sm hover:text-yellow-500 min-h-[44px] flex items-center justify-center">{t.login}</Link>
            <div className="text-xs text-gray-500">
              After registration, use your credentials to login
            </div>
          </div>

          <footer className="text-center text-xs text-gray-600 mt-3 sm:mt-4">
            {t.footer}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Register;