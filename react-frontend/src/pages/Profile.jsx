import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, language } = useAuth();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: '',
    email: '',
    phone: '',
    usertype: '',
    state: '',
    district: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 800);
    if (user) {
      setProfileData({
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || '',
        usertype: user.usertype || '',
        state: user.state || '',
        district: user.district || ''
      });
    }
    return () => clearTimeout(timer);
  }, [user]);

  const translations = {
    en: {
      title: 'My Profile',
      subtitle: 'Manage your account information',
      backBtn: '← Back to Dashboard',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      cancelEdit: 'Cancel',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      userType: 'User Type',
      state: 'State',
      district: 'District',
      memberSince: 'Member Since',
      accountStats: 'Account Statistics',
      totalLogins: 'Total Logins',
      lastLogin: 'Last Login',
      accountCreated: 'Account Created',
      farmer: 'Farmer',
      consumer: 'Consumer',
      vendor: 'Vendor',
      admin: 'Admin',
      profileUpdated: 'Profile updated successfully!',
      comingSoon: 'More profile features coming soon!'
    },
    hi: {
      title: 'मेरी प्रोफाइल',
      subtitle: 'अपनी खाता जानकारी प्रबंधित करें',
      backBtn: '← डैशबोर्ड पर वापस',
      editProfile: 'प्रोफाइल संपादित करें',
      saveChanges: 'परिवर्तन सहेजें',
      cancelEdit: 'रद्द करें',
      fullName: 'पूरा नाम',
      email: 'ईमेल पता',
      phone: 'फोन नंबर',
      userType: 'उपयोगकर्ता प्रकार',
      state: 'राज्य',
      district: 'जिला',
      memberSince: 'सदस्य बने',
      accountStats: 'खाता आंकड़े',
      totalLogins: 'कुल लॉगिन',
      lastLogin: 'अंतिम लॉगिन',
      accountCreated: 'खाता बनाया गया',
      farmer: 'किसान',
      consumer: 'उपभोक्ता',
      vendor: 'विक्रेता',
      admin: 'एडमिन',
      profileUpdated: 'प्रोफाइल सफलतापूर्वक अपडेट हो गई!',
      comingSoon: 'अधिक प्रोफाइल सुविधाएं जल्द आ रही हैं!'
    }
  };

  const t = translations[language];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Update user data in localStorage
    const users = JSON.parse(localStorage.getItem('kisanSetuUsers') || '[]');
    const updatedUsers = users.map(u => 
      u.username === user.username ? { ...u, ...profileData } : u
    );
    localStorage.setItem('kisanSetuUsers', JSON.stringify(updatedUsers));
    
    // Update current user
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('kisanSetuUser', JSON.stringify(updatedUser));
    
    setIsEditing(false);
    alert(t.profileUpdated);
  };

  const getUserTypeLabel = (type) => {
    const typeMap = {
      farmer: t.farmer,
      consumer: t.consumer,
      vendor: t.vendor,
      admin: t.admin
    };
    return typeMap[type] || type;
  };

  if (!pageLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-green-600 to-orange-500 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-700 ease-in-out">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white hover:text-green-100 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.backBtn}
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">👤 {t.title}</h1>
              <p className="text-green-100">{t.subtitle}</p>
            </div>
            
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  {t.editProfile}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t.saveChanges}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {t.cancelEdit}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <img src="/kisansetu.png" alt="Kisan Setu Logo" className="w-20 h-20 rounded-full object-contain" />
              <div>
                <h2 className="text-2xl font-bold text-green-600">{profileData.fullname || 'User'}</h2>
                <p className="text-gray-600">{getUserTypeLabel(profileData.usertype)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  {t.fullName}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.fullname}
                    onChange={(e) => handleInputChange('fullname', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">{profileData.fullname || 'Not provided'}</p>
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
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">{profileData.email || 'Not provided'}</p>
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
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">{profileData.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {t.state}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">{profileData.state || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {t.district}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">{profileData.district || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.userType}
                </label>
                <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    profileData.usertype === 'farmer' ? 'bg-green-100 text-green-800' :
                    profileData.usertype === 'vendor' ? 'bg-blue-100 text-blue-800' :
                    profileData.usertype === 'admin' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {getUserTypeLabel(profileData.usertype)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-green-600 mb-4">{t.accountStats}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t.memberSince}</p>
                    <p className="font-semibold">
                      {user?.registrationDate 
                        ? new Date(user.registrationDate).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    📊
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.totalLogins}</p>
                    <p className="font-semibold">
                      {JSON.parse(localStorage.getItem('kisanSetuUserStats') || '{}')[user?.username]?.totalLogins || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl text-center">
              <div className="text-3xl mb-3">🚀</div>
              <p className="font-semibold">{t.comingSoon}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;