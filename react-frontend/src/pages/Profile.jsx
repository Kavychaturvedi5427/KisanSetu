import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocationContext } from '../contexts/LocationContext';
import MobileNav from '../components/common/MobileNav';
import { ArrowLeft, User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser, language, logout } = useAuth();
  const { location } = useLocationContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    user_type: user?.user_type || 'farmer'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        user_type: user.user_type || 'farmer'
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    alert(language === 'hi' ? 'प्रोफाइल अपडेट हो गई!' : 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      user_type: user?.user_type || 'farmer'
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm(language === 'hi' ? 'क्या आप वाकई लॉग आउट करना चाहते हैं?' : 'Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const translations = {
    en: {
      title: 'My Profile',
      edit: 'Edit Profile',
      save: 'Save Changes',
      cancel: 'Cancel',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      userType: 'User Type',
      location: 'Location',
      joinedOn: 'Joined On',
      logout: 'Logout',
      farmer: 'Farmer',
      consumer: 'Consumer',
      vendor: 'Vendor',
      admin: 'Admin'
    },
    hi: {
      title: 'मेरी प्रोफाइल',
      edit: 'प्रोफाइल संपादित करें',
      save: 'परिवर्तन सहेजें',
      cancel: 'रद्द करें',
      fullName: 'पूरा नाम',
      email: 'ईमेल',
      phone: 'फोन नंबर',
      userType: 'उपयोगकर्ता प्रकार',
      location: 'स्थान',
      joinedOn: 'शामिल हुए',
      logout: 'लॉग आउट',
      farmer: 'किसान',
      consumer: 'उपभोक्ता',
      vendor: 'विक्रेता',
      admin: 'एडमिन'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors min-h-[44px] touch-manipulation"
          >
            <Edit className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="hidden sm:inline text-sm sm:text-base">{t.edit}</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors min-h-[44px] touch-manipulation"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="hidden sm:inline text-sm sm:text-base">{t.save}</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors min-h-[44px] touch-manipulation"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="hidden sm:inline text-sm sm:text-base">{t.cancel}</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Picture */}
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user?.full_name || user?.username}</h2>
          <p className="text-gray-600 capitalize">{user?.user_type || 'farmer'}</p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                {t.fullName}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{user?.full_name || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                {t.email}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{user?.email || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                {t.phone}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{user?.phone || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.userType}
              </label>
              {isEditing ? (
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="farmer">{t.farmer}</option>
                  <option value="consumer">{t.consumer}</option>
                  <option value="vendor">{t.vendor}</option>
                  <option value="admin">{t.admin}</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 capitalize">
                  {t[user?.user_type] || user?.user_type || 'farmer'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                {t.location}
              </label>
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                {location ? `${location.city}, ${location.state}, ${location.country}` : 'Location not available'}
              </p>
            </div>

            {user?.created_at && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.joinedOn}
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                  {new Date(user.created_at).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors min-h-[44px]"
          >
            {t.logout}
          </button>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default Profile;