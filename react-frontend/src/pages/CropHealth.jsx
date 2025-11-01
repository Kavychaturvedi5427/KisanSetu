import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, Leaf, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const CropHealth = () => {
  const { language } = useAuth();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const translations = {
    en: {
      title: 'Crop Health Monitor',
      subtitle: 'AI-powered crop disease detection and health analysis',
      backBtn: '← Back to Dashboard',
      uploadImage: 'Upload Crop Image',
      takePhoto: 'Take Photo',
      analyzeBtn: 'Analyze Crop Health',
      analyzing: 'Analyzing...',
      selectImage: 'Please select an image first',
      healthStatus: 'Health Status',
      diseaseDetected: 'Disease Detected',
      recommendations: 'Recommendations',
      confidence: 'Confidence',
      healthy: 'Healthy',
      diseased: 'Disease Detected',
      recentScans: 'Recent Scans',
      noScans: 'No recent scans available',
      scanAgain: 'Scan Another Image'
    },
    hi: {
      title: 'फसल स्वास्थ्य मॉनिटर',
      subtitle: 'एआई-संचालित फसल रोग का पता लगाना और स्वास्थ्य विश्लेषण',
      backBtn: '← डैशबोर्ड पर वापस',
      uploadImage: 'फसल की तस्वीर अपलोड करें',
      takePhoto: 'फोटो लें',
      analyzeBtn: 'फसल स्वास्थ्य का विश्लेषण करें',
      analyzing: 'विश्लेषण कर रहे हैं...',
      selectImage: 'कृपया पहले एक तस्वीर चुनें',
      healthStatus: 'स्वास्थ्य स्थिति',
      diseaseDetected: 'रोग का पता चला',
      recommendations: 'सिफारिशें',
      confidence: 'विश्वास',
      healthy: 'स्वस्थ',
      diseased: 'रोग का पता चला',
      recentScans: 'हाल की स्कैन',
      noScans: 'कोई हाल की स्कैन उपलब्ध नहीं',
      scanAgain: 'दूसरी तस्वीर स्कैन करें'
    }
  };

  const t = translations[language];

  // Mock AI analysis function
  const analyzeCropHealth = async (imageFile) => {
    setAnalyzing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    const mockResults = [
      {
        status: 'healthy',
        confidence: 92,
        disease: null,
        recommendations: [
          language === 'hi' ? 'फसल स्वस्थ है। नियमित पानी देते रहें।' : 'Crop is healthy. Continue regular watering.',
          language === 'hi' ? 'मिट्टी की नमी बनाए रखें।' : 'Maintain soil moisture levels.',
          language === 'hi' ? 'अगले सप्ताह फिर जांच करें।' : 'Check again next week.'
        ]
      },
      {
        status: 'diseased',
        confidence: 87,
        disease: language === 'hi' ? 'पत्ती का धब्बा रोग' : 'Leaf Spot Disease',
        recommendations: [
          language === 'hi' ? 'तुरंत कवकनाशी का छिड़काव करें।' : 'Apply fungicide spray immediately.',
          language === 'hi' ? 'प्रभावित पत्तियों को हटा दें।' : 'Remove affected leaves.',
          language === 'hi' ? 'पानी देने की मात्रा कम करें।' : 'Reduce watering frequency.',
          language === 'hi' ? 'हवा का संचार बढ़ाएं।' : 'Improve air circulation.'
        ]
      },
      {
        status: 'diseased',
        confidence: 78,
        disease: language === 'hi' ? 'कीट का हमला' : 'Pest Infestation',
        recommendations: [
          language === 'hi' ? 'जैविक कीटनाशक का उपयोग करें।' : 'Use organic pesticide.',
          language === 'hi' ? 'नीम का तेल छिड़कें।' : 'Spray neem oil.',
          language === 'hi' ? 'प्राकृतिक शिकारी कीटों को बढ़ावा दें।' : 'Encourage natural predator insects.'
        ]
      }
    ];

    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    
    // Save scan to localStorage
    const scan = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      result: randomResult,
      imageName: imageFile.name
    };
    
    const scans = JSON.parse(localStorage.getItem('cropHealthScans') || '[]');
    scans.unshift(scan);
    localStorage.setItem('cropHealthScans', JSON.stringify(scans.slice(0, 10))); // Keep last 10 scans
    
    setResult(randomResult);
    setAnalyzing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) {
      alert(t.selectImage);
      return;
    }
    analyzeCropHealth(selectedImage);
  };

  const getRecentScans = () => {
    return JSON.parse(localStorage.getItem('cropHealthScans') || '[]');
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
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">🌱 {t.title}</h1>
            <p className="text-green-100">{t.subtitle}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
              <Camera className="w-6 h-6" />
              {t.uploadImage}
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              {selectedImage ? (
                <div>
                  <img 
                    src={URL.createObjectURL(selectedImage)} 
                    alt="Selected crop" 
                    className="max-w-full h-48 mx-auto object-contain rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-600">{selectedImage.name}</p>
                </div>
              ) : (
                <div>
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">{t.uploadImage}</p>
                  <p className="text-sm text-gray-500">JPG, PNG, or JPEG</p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
            
            <div className="flex gap-3">
              <label
                htmlFor="imageUpload"
                className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors cursor-pointer text-center"
              >
                <Upload className="w-5 h-5 inline mr-2" />
                {t.uploadImage}
              </label>
              
              <button
                onClick={handleAnalyze}
                disabled={!selectedImage || analyzing}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                    {t.analyzing}
                  </>
                ) : (
                  <>
                    <Leaf className="w-5 h-5 inline mr-2" />
                    {t.analyzeBtn}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-green-600 mb-4">Analysis Results</h2>
            
            {result ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-l-4 ${
                  result.status === 'healthy' 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-red-50 border-red-500'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {result.status === 'healthy' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    )}
                    <h3 className="font-bold text-lg">
                      {result.status === 'healthy' ? t.healthy : t.diseased}
                    </h3>
                  </div>
                  
                  {result.disease && (
                    <p className="text-red-700 font-semibold mb-2">{result.disease}</p>
                  )}
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {t.confidence}: {result.confidence}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t.recommendations}:</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setResult(null);
                  }}
                  className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  {t.scanAgain}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Leaf className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Upload an image and click analyze to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-green-600 mb-4">{t.recentScans}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getRecentScans().length > 0 ? (
              getRecentScans().map((scan) => (
                <div key={scan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    {scan.result.status === 'healthy' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-semibold text-sm">
                      {scan.result.status === 'healthy' ? t.healthy : t.diseased}
                    </span>
                  </div>
                  
                  {scan.result.disease && (
                    <p className="text-sm text-red-600 mb-1">{scan.result.disease}</p>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    {new Date(scan.timestamp).toLocaleDateString()}
                  </p>
                  
                  <div className="text-xs text-blue-600 mt-1">
                    {t.confidence}: {scan.result.confidence}%
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>{t.noScans}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropHealth;