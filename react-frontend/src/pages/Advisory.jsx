import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { advisoryAPI } from '../services/api';
import MobileNav from '../components/common/MobileNav';
import { ArrowLeft, Lightbulb, Cloud, Leaf, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Advisory = () => {
  const { language } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('winter');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [selectedSeason]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const response = await advisoryAPI.getRecommendations(selectedSeason);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Advisory error:', error);
      // Agricultural advisory data
      setRecommendations({
        crops: language === 'hi' ? ['गेहूं', 'सरसों', 'मटर', 'आलू'] : ['Wheat', 'Mustard', 'Peas', 'Potato'],
        tips: language === 'hi' ? [
          'रबी फसलों के लिए मिट्टी तैयार करें',
          'जैविक खाद का प्रयोग करें', 
          'उचित सिंचाई सुनिश्चित करें',
          'मौसम की स्थिति पर नजर रखें'
        ] : [
          'Prepare soil for rabi crops',
          'Apply organic manure',
          'Ensure proper irrigation',
          'Monitor weather conditions'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Farming Advisory',
      seasonalTips: 'Seasonal Farming Tips',
      recommendedCrops: 'Recommended Crops',
      season: 'Season',
      winter: 'Winter (Rabi)',
      summer: 'Summer (Zaid)',
      monsoon: 'Monsoon (Kharif)',
      generalTips: 'General Farming Tips',
      weatherTips: 'Weather-based Tips'
    },
    hi: {
      title: 'कृषि सलाह',
      seasonalTips: 'मौसमी कृषि सुझाव',
      recommendedCrops: 'सुझाई गई फसलें',
      season: 'मौसम',
      winter: 'सर्दी (रबी)',
      summer: 'गर्मी (जायद)',
      monsoon: 'मानसून (खरीफ)',
      generalTips: 'सामान्य कृषि सुझाव',
      weatherTips: 'मौसम आधारित सुझाव'
    }
  };

  const t = translations[language];

  const generalTips = [
    {
      icon: '💧',
      title: language === 'hi' ? 'जल प्रबंधन' : 'Water Management',
      desc: language === 'hi' ? 'उचित सिंचाई और जल संरक्षण' : 'Proper irrigation and water conservation'
    },
    {
      icon: '🌱',
      title: language === 'hi' ? 'बीज चयन' : 'Seed Selection',
      desc: language === 'hi' ? 'गुणवत्तापूर्ण बीजों का चयन' : 'Choose quality seeds for better yield'
    },
    {
      icon: '🦠',
      title: language === 'hi' ? 'कीट नियंत्रण' : 'Pest Control',
      desc: language === 'hi' ? 'जैविक कीट नियंत्रण विधियां' : 'Organic pest control methods'
    },
    {
      icon: '🌾',
      title: language === 'hi' ? 'फसल चक्र' : 'Crop Rotation',
      desc: language === 'hi' ? 'मिट्टी की उर्वरता बनाए रखें' : 'Maintain soil fertility'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Season Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            {t.seasonalTips}
          </h2>
          
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {['winter', 'summer', 'monsoon'].map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-4 py-2 rounded-full whitespace-nowrap min-h-[44px] ${
                  selectedSeason === season
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {t[season]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">{language === 'hi' ? 'कृषि सुझाव लोड हो रहे हैं...' : 'Loading farming recommendations...'}</p>
            </div>
          ) : recommendations && (
            <div className="space-y-4">
              {/* Recommended Crops */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  {t.recommendedCrops}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {recommendations.crops.map((crop, index) => (
                    <div key={index} className="bg-green-100 p-3 rounded-lg text-center">
                      <div className="text-2xl mb-1">🌾</div>
                      <div className="font-medium text-green-800 text-sm">{crop}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  {t.weatherTips}
                </h3>
                <div className="space-y-2">
                  {recommendations.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* General Tips */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            {t.generalTips}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {generalTips.map((tip, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{tip.icon}</span>
                  <h3 className="font-semibold text-gray-800">{tip.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Advisory */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            {language === 'hi' ? 'मौसम चेतावनी' : 'Weather Alert'}
          </h2>
          <div className="bg-white/20 p-4 rounded-lg">
            <p className="font-semibold mb-2">
              {language === 'hi' ? '⚠️ महत्वपूर्ण सूचना' : '⚠️ Important Notice'}
            </p>
            <p className="text-sm opacity-90">
              {language === 'hi'
                ? 'अगले 3 दिनों में बारिश की संभावना है। फसल की सुरक्षा के लिए उचित व्यवस्था करें।'
                : 'Rain expected in the next 3 days. Take necessary precautions to protect your crops.'}
            </p>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default Advisory;