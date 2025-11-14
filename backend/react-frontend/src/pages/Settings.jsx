import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MobileNav from '../components/common/MobileNav';
import { ArrowLeft, Globe, Bell, Shield, Info } from 'lucide-react';

const Settings = () => {
  const { language, setLanguage } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);

  const translations = {
    en: {
      title: 'Settings',
      language: 'Language',
      notifications: 'Notifications',
      privacy: 'Privacy & Security',
      about: 'About App',
      version: 'Version 1.0.0',
      developer: 'Developed by Team TechOps'
    },
    hi: {
      title: 'सेटिंग्स',
      language: 'भाषा',
      notifications: 'सूचनाएं',
      privacy: 'गोपनीयता और सुरक्षा',
      about: 'ऐप के बारे में',
      version: 'संस्करण 1.0.0',
      developer: 'टीम टेकऑप्स द्वारा विकसित'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-lg p-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">{t.language}</span>
          </div>
          <div className="p-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border rounded-lg min-h-[44px]"
            >
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex items-center gap-3">
            <Bell className="w-5 h-5 text-green-600" />
            <span className="font-semibold">{t.notifications}</span>
          </div>
          <div className="p-4">
            <label className="flex items-center gap-3 min-h-[44px]">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5"
              />
              <span>{language === 'hi' ? 'पुश सूचनाएं सक्षम करें' : 'Enable push notifications'}</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-600" />
            <span className="font-semibold">{t.privacy}</span>
          </div>
          <div className="p-4 text-gray-600">
            {language === 'hi' ? 'आपका डेटा सुरक्षित है' : 'Your data is secure'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex items-center gap-3">
            <Info className="w-5 h-5 text-orange-600" />
            <span className="font-semibold">{t.about}</span>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-gray-600">{t.version}</p>
            <p className="text-gray-600">{t.developer}</p>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default Settings;