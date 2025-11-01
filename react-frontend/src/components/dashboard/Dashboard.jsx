import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Leaf, Cloud, Store, Lightbulb, User, Settings, LogOut, Menu
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout, language, setLanguage } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 800);
    updateCurrentDate();
    const dateInterval = setInterval(updateCurrentDate, 60000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(dateInterval);
    };
  }, []);

  const updateCurrentDate = () => {
    const today = new Date();
    const locale = language === 'hi' ? 'hi-IN' : 'en-US';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    setCurrentDate(today.toLocaleDateString(locale, options));
  };

  const translations = {
    en: {
      title: 'Kisan Setu',
      sidebarTitle: 'Kisan Setu',
      menuHome: 'Home',
      menuCrop: 'Crop Health',
      menuWeather: 'Weather Info',
      menuMarket: 'Market Prices',
      menuAdvisory: 'Advisory',
      menuProfile: 'My Profile',
      menuSettings: 'Settings',
      menuLogout: 'Logout',
      farmText: 'My Farm',
      dateText: "Today's Date",
      alertText: 'Alerts',
      welcomeTitle: '🙏 Welcome Farmer!',
      welcomeDesc: 'View all your farm information here',
      earningsTitle: "This Month's Earnings",
      earningsUnit: 'Rupees',
      moistureTitle: 'Soil Moisture',
      moistureUnit: 'Good Condition',
      cropHealthTitle: 'Crop Health',
      cropHealthUnit: 'Very Good',
      tempTitle: "Today's Temperature",
      tempUnit: 'Normal',
      cropInfoTitle: 'My Crop Information',
      tasksTitle: "Today's Tasks",
      wheatCrop: 'Wheat Crop',
      wheatDesc: 'Planted in 5 acres, 80% ready',
      cornCrop: 'Corn Crop',
      cornDesc: 'Planted in 3 acres, 60% ready',
      vegCrop: 'Vegetable Crop',
      vegDesc: 'Planted in 2 acres, ready for harvest',
      waterTask: 'Watering',
      waterDesc: 'Water the field at 6 AM',
      sprayTask: 'Pesticide Spray',
      sprayDesc: 'Spray pesticide in the evening',
      sellTask: 'Sell Vegetables',
      sellDesc: 'Take vegetables to market',
      alertMsg: 'Important Notice: Rain expected tomorrow | Wheat price ₹2,100 per quintal',
      footerMsg: 'Kisan Setu - Your Farming, Our Technology | Made for all farmer brothers'
    },
    hi: {
      title: 'किसान सेतु',
      sidebarTitle: 'किसान सेतु',
      menuHome: 'मुख्य पृष्ठ',
      menuCrop: 'फसल स्वास्थ्य',
      menuWeather: 'मौसम जानकारी',
      menuMarket: 'बाजार भाव',
      menuAdvisory: 'सलाह सेवा',
      menuProfile: 'मेरी प्रोफाइल',
      menuSettings: 'सेटिंग्स',
      menuLogout: 'लॉग आउट',
      farmText: 'मेरा खेत',
      dateText: 'आज की तारीख',
      alertText: 'अलर्ट',
      welcomeTitle: '🙏 नमस्कार किसान भाई!',
      welcomeDesc: 'आपके खेत की पूरी जानकारी यहाँ देखें',
      earningsTitle: 'इस महीने की कमाई',
      earningsUnit: 'रुपये',
      moistureTitle: 'मिट्टी में नमी',
      moistureUnit: 'अच्छी स्थिति',
      cropHealthTitle: 'फसल की सेहत',
      cropHealthUnit: 'बहुत अच्छी',
      tempTitle: 'आज का तापमान',
      tempUnit: 'सामान्य',
      cropInfoTitle: 'मेरी फसल की जानकारी',
      tasksTitle: 'आज के काम',
      wheatCrop: 'गेहूं की फसल',
      wheatDesc: '5 एकड़ में लगी है, 80% तैयार है',
      cornCrop: 'मक्का की फसल',
      cornDesc: '3 एकड़ में लगी है, 60% तैयार है',
      vegCrop: 'सब्जी की फसल',
      vegDesc: '2 एकड़ में लगी है, कटाई के लिए तैयार',
      waterTask: 'पानी देना',
      waterDesc: 'सुबह 6 बजे खेत में पानी दें',
      sprayTask: 'दवा छिड़काव',
      sprayDesc: 'शाम को कीटनाशक का छिड़काव करें',
      sellTask: 'सब्जी बेचना',
      sellDesc: 'मंडी में सब्जी ले जाना है',
      alertMsg: 'महत्वपूर्ण सूचना: कल बारिश की संभावना है | गेहूं का भाव ₹2,100 प्रति क्विंटल',
      footerMsg: 'किसान सेतु - आपकी खेती, हमारी तकनीक | सभी किसान भाइयों के लिए बनाया गया'
    }
  };

  const t = translations[language];

  const menuItems = [
    { icon: Home, label: t.menuHome, action: () => {} },
    { icon: Leaf, label: t.menuCrop, action: () => navigate('/crop-health') },
    { icon: Cloud, label: t.menuWeather, action: () => navigate('/weather') },
    { icon: Store, label: t.menuMarket, action: () => navigate('/marketplace') },
    { icon: Lightbulb, label: t.menuAdvisory, action: () => navigate('/advisory') },
    { icon: User, label: t.menuProfile, action: () => navigate('/profile') },
    { icon: Settings, label: t.menuSettings, action: () => alert('⚙️ सेटिंग्स: ऐप की सेटिंग्स बदलें - जल्दी आ रहा है!') },
  ];

  const kpiData = [
    {
      title: t.earningsTitle,
      value: '₹1,25,000',
      unit: t.earningsUnit,
      icon: '💰',
      color: 'text-green-600'
    },
    {
      title: t.moistureTitle,
      value: '78%',
      unit: t.moistureUnit,
      icon: '💧',
      color: 'text-blue-600'
    },
    {
      title: t.cropHealthTitle,
      value: '85%',
      unit: t.cropHealthUnit,
      icon: '🌱',
      color: 'text-green-600'
    },
    {
      title: t.tempTitle,
      value: '28°C',
      unit: t.tempUnit,
      icon: '🌡️',
      color: 'text-orange-600'
    }
  ];

  const cropData = [
    { name: t.wheatCrop, desc: t.wheatDesc, icon: '🌾' },
    { name: t.cornCrop, desc: t.cornDesc, icon: '🌽' },
    { name: t.vegCrop, desc: t.vegDesc, icon: '🥕' }
  ];

  const tasks = [
    { title: t.waterTask, desc: t.waterDesc, icon: '💧' },
    { title: t.sprayTask, desc: t.sprayDesc, icon: '🚿' },
    { title: t.sellTask, desc: t.sellDesc, icon: '🚚' }
  ];

  const handleLogout = () => {
    if (confirm(language === 'hi' ? 'क्या आप वाकई लॉग आउट करना चाहते हैं?' : 'Are you sure you want to logout?')) {
      logout();
      alert(language === 'hi' ? 'सफलतापूर्वक लॉग आउट हो गए!' : 'Successfully logged out!');
      navigate('/login');
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
    <div className="min-h-screen bg-gray-50 flex transition-all duration-700 ease-in-out">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-600 to-green-700 text-white transition-transform duration-300 ease-in-out shadow-2xl`}>
        <div className="p-5">
          <div className="text-center mb-6 p-3 bg-white/10 rounded-xl">
            <img src="/kisansetu.png" alt="Kisan Setu Logo" className="w-12 h-12 mx-auto mb-2 rounded-lg object-contain" />
            <h2 className="text-lg font-bold">{t.sidebarTitle}</h2>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200 text-left hover:translate-x-1 hover:shadow-lg"
              >
                <item.icon className="w-5 h-5 text-yellow-300" />
                <span className="text-base">{item.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition-all duration-200 text-left hover:translate-x-1 hover:shadow-lg"
            >
              <LogOut className="w-5 h-5 text-yellow-300" />
              <span className="text-base">{t.menuLogout}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white p-4 border-b-3 border-orange-500 shadow-lg flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-green-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-6 text-green-600 font-semibold">
              <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm">
                📍 {t.farmText}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm">
                📅 {currentDate}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm">
                🔔 {t.alertText}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white text-green-600 font-semibold"
            >
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
            </select>
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2 rounded-full font-semibold shadow-lg">
              👤 {user?.fullname || 'किसान जी'}{language === 'hi' ? ' जी' : ''}
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-5 text-center">
          <h1 className="text-2xl font-bold mb-2">{t.welcomeTitle}</h1>
          <p className="text-lg opacity-90">{t.welcomeDesc}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-6">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white border-3 border-green-100 p-6 text-center rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-orange-500 relative overflow-visible">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-200/40 via-yellow-200/40 to-green-300/40 blur-lg scale-110 opacity-50 transition-all duration-500 hover:opacity-95 hover:blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="text-3xl mb-3 text-green-600">{kpi.icon}</div>
                <h3 className="text-green-600 font-semibold text-lg mb-3">{kpi.title}</h3>
                <div className="text-3xl font-bold text-orange-500 mb-1">{kpi.value}</div>
                <div className="text-sm text-gray-600 opacity-70">{kpi.unit}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border-l-5 border-yellow-400">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-gray-100">
              <div className="text-2xl text-green-600">📈</div>
              <h3 className="text-green-600 font-bold text-xl">{t.cropInfoTitle}</h3>
            </div>
            <div className="space-y-3">
              {cropData.map((crop, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-l-4 border-green-500">
                  <div className="text-2xl">{crop.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{crop.name}</div>
                    <div className="text-sm text-gray-600">{crop.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-5 border-orange-500">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-gray-100">
              <div className="text-2xl text-green-600">✅</div>
              <h3 className="text-green-600 font-bold text-xl">{t.tasksTitle}</h3>
            </div>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-l-4 border-green-500">
                  <div className="text-2xl">{task.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{task.title}</div>
                    <div className="text-sm text-gray-600">{task.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert */}
        <div className="mx-6 mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-2xl text-center font-semibold shadow-lg">
          <span className="text-2xl mr-3 animate-pulse">⚠️</span>
          <strong>{t.alertMsg}</strong>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 p-4 bg-white mx-6 mb-6 rounded-xl">
          <span className="text-red-500 mr-2">❤️</span>
          {t.footerMsg}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;