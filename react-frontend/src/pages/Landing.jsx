import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
  const { language, setLanguage } = useAuth();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const translations = {
    en: {
      title: 'Kisan Setu',
      subtitle: 'AI-Powered Agricultural Intelligence Platform',
      description: 'Empowering farmers with modern technology, real-time weather updates, marketplace access, and intelligent farming solutions.',
      getStarted: 'Get Started',
      login: 'Login',
      features: 'Features',
      weatherTitle: 'Weather Intelligence',
      weatherDesc: 'Real-time weather updates and farming recommendations',
      marketTitle: 'Digital Marketplace',
      marketDesc: 'Buy and sell agricultural products online',
      aiTitle: 'AI Advisory',
      aiDesc: 'Get intelligent farming advice powered by AI',
      dashboardTitle: 'Smart Dashboard',
      dashboardDesc: 'Monitor your farm with comprehensive analytics',
      footer: '© 2025 Kisan Setu | Empowering Farmers Through Technology'
    },
    hi: {
      title: 'किसान सेतु',
      subtitle: 'एआई संचालित कृषि बुद्धिमत्ता मंच',
      description: 'आधुनिक तकनीक, वास्तविक समय मौसम अपडेट, बाजार पहुंच, और बुद्धिमान कृषि समाधानों के साथ किसानों को सशक्त बनाना।',
      getStarted: 'शुरू करें',
      login: 'लॉगिन',
      features: 'विशेषताएं',
      weatherTitle: 'मौसम बुद्धिमत्ता',
      weatherDesc: 'वास्तविक समय मौसम अपडेट और कृषि सिफारिशें',
      marketTitle: 'डिजिटल बाजार',
      marketDesc: 'कृषि उत्पादों को ऑनलाइन खरीदें और बेचें',
      aiTitle: 'एआई सलाहकार',
      aiDesc: 'एआई द्वारा संचालित बुद्धिमान कृषि सलाह प्राप्त करें',
      dashboardTitle: 'स्मार्ट डैशबोर्ड',
      dashboardDesc: 'व्यापक विश्लेषण के साथ अपने खेत की निगरानी करें',
      footer: '© 2025 किसान सेतु | तकनीक के माध्यम से किसानों को सशक्त बनाना'
    }
  };

  const t = translations[language];

  if (!pageLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-green-600 to-orange-500 flex items-center justify-center z-50">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">🌾 Kisan Setu</h2>
          <p className="text-lg opacity-90">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 transition-all duration-700 ease-in-out">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/kisansetu.png" alt="Kisan Setu Logo" className="w-12 h-12 rounded-full object-contain" />
              <h1 className="text-2xl font-bold text-green-600">{t.title}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-green-600 font-semibold"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
              
              <Link
                to="/login"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {t.login}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <img src="/kisansetu.png" alt="Kisan Setu Logo" className="w-32 h-32 mx-auto mb-6 object-contain" />
          <h1 className="text-5xl font-bold text-green-600 mb-4">{t.title}</h1>
          <p className="text-2xl text-orange-500 font-semibold mb-6">{t.subtitle}</p>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">{t.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {t.getStarted}
            </Link>
            <Link
              to="/login"
              className="bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {t.login}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-green-600 mb-12">{t.features}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-6xl mb-4">🌤️</div>
              <h3 className="text-xl font-bold text-green-600 mb-3">{t.weatherTitle}</h3>
              <p className="text-gray-700">{t.weatherDesc}</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-green-600 mb-3">{t.marketTitle}</h3>
              <p className="text-gray-700">{t.marketDesc}</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-green-600 mb-3">{t.aiTitle}</h3>
              <p className="text-gray-700">{t.aiDesc}</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-green-600 mb-3">{t.dashboardTitle}</h3>
              <p className="text-gray-700">{t.dashboardDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10,000+</div>
              <p className="text-xl opacity-90">{language === 'hi' ? 'खुश किसान' : 'Happy Farmers'}</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <p className="text-xl opacity-90">{language === 'hi' ? 'शहर' : 'Cities'}</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <p className="text-xl opacity-90">{language === 'hi' ? 'सहायता' : 'Support'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-green-600 mb-6">
            {language === 'hi' ? 'आज ही शुरू करें' : 'Get Started Today'}
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            {language === 'hi' 
              ? 'आधुनिक कृषि तकनीक के साथ अपनी खेती को बेहतर बनाएं'
              : 'Transform your farming with modern agricultural technology'
            }
          </p>
          <Link
            to="/register"
            className="bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg inline-block"
          >
            {t.getStarted}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/kisansetu.png" alt="Kisan Setu Logo" className="w-10 h-10 rounded-full object-contain" />
            <h3 className="text-xl font-bold">{t.title}</h3>
          </div>
          <p className="text-gray-400">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;