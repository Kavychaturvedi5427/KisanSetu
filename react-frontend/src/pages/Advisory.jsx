import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, MessageCircle, BookOpen, Users } from 'lucide-react';

const Advisory = () => {
  const { language } = useAuth();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const translations = {
    en: {
      title: 'Crop Advisory Services',
      subtitle: 'Expert farming advice and recommendations',
      backBtn: '← Back to Dashboard',
      comingSoon: 'Coming Soon!',
      description: 'Our AI-powered crop advisory system is under development. Soon you will be able to get personalized farming advice, crop disease detection, and expert recommendations.',
      features: 'Upcoming Features',
      aiAdvice: 'AI-Powered Advice',
      aiAdviceDesc: 'Get intelligent farming recommendations based on your crop data',
      diseaseDetection: 'Disease Detection',
      diseaseDetectionDesc: 'Early detection of crop diseases using image analysis',
      expertConsult: 'Expert Consultation',
      expertConsultDesc: 'Connect with agricultural experts for personalized advice',
      community: 'Farmer Community',
      communityDesc: 'Join discussions with fellow farmers and share experiences'
    },
    hi: {
      title: 'फसल सलाहकार सेवाएं',
      subtitle: 'विशेषज्ञ कृषि सलाह और सिफारिशें',
      backBtn: '← डैशबोर्ड पर वापस',
      comingSoon: 'जल्दी आ रहा है!',
      description: 'हमारा एआई-संचालित फसल सलाहकार सिस्टम विकास में है। जल्द ही आप व्यक्तिगत कृषि सलाह, फसल रोग का पता लगाना, और विशेषज्ञ सिफारिशें प्राप्त कर सकेंगे।',
      features: 'आगामी सुविधाएं',
      aiAdvice: 'एआई-संचालित सलाह',
      aiAdviceDesc: 'अपने फसल डेटा के आधार पर बुद्धिमान कृषि सिफारिशें प्राप्त करें',
      diseaseDetection: 'रोग का पता लगाना',
      diseaseDetectionDesc: 'छवि विश्लेषण का उपयोग करके फसल रोगों का प्रारंभिक पता लगाना',
      expertConsult: 'विशेषज्ञ परामर्श',
      expertConsultDesc: 'व्यक्तिगत सलाह के लिए कृषि विशेषज्ञों से जुड़ें',
      community: 'किसान समुदाय',
      communityDesc: 'साथी किसानों के साथ चर्चा में शामिल हों और अनुभव साझा करें'
    }
  };

  const t = translations[language];

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
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white hover:text-green-100 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.backBtn}
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">💡 {t.title}</h1>
            <p className="text-green-100 text-lg">{t.subtitle}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Coming Soon Section */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-6">🚧</div>
          <h2 className="text-4xl font-bold text-green-600 mb-4">{t.comingSoon}</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">{t.description}</p>
        </div>

        {/* Features Preview */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-green-600 mb-6 text-center">{t.features}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-5 border-green-500">
              <div className="flex items-center gap-4 mb-4">
                <Lightbulb className="w-12 h-12 text-green-500" />
                <h4 className="text-xl font-bold text-green-600">{t.aiAdvice}</h4>
              </div>
              <p className="text-gray-700">{t.aiAdviceDesc}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-5 border-red-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
                  🔬
                </div>
                <h4 className="text-xl font-bold text-green-600">{t.diseaseDetection}</h4>
              </div>
              <p className="text-gray-700">{t.diseaseDetectionDesc}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-5 border-blue-500">
              <div className="flex items-center gap-4 mb-4">
                <MessageCircle className="w-12 h-12 text-blue-500" />
                <h4 className="text-xl font-bold text-green-600">{t.expertConsult}</h4>
              </div>
              <p className="text-gray-700">{t.expertConsultDesc}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-5 border-purple-500">
              <div className="flex items-center gap-4 mb-4">
                <Users className="w-12 h-12 text-purple-500" />
                <h4 className="text-xl font-bold text-green-600">{t.community}</h4>
              </div>
              <p className="text-gray-700">{t.communityDesc}</p>
            </div>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-xl text-center">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-2xl font-bold mb-4">
            {language === 'hi' ? 'जल्द ही उपलब्ध' : 'Available Soon'}
          </h3>
          <p className="text-lg opacity-90">
            {language === 'hi' 
              ? 'हम आपके लिए सबसे अच्छी कृषि सलाह सेवा तैयार कर रहे हैं।'
              : 'We are preparing the best agricultural advisory service for you.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Advisory;