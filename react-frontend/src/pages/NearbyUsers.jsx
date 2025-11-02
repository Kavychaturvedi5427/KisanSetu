import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocationContext } from '../contexts/LocationContext';
import { useNavigate } from 'react-router-dom';
import MobileNav from '../components/common/MobileNav';

const NearbyUsers = () => {
  const { user, language } = useAuth();
  const { location } = useLocationContext();
  const navigate = useNavigate();
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location) {
      findNearbyUsers(location);
    } else {
      // Use default location for demo
      const defaultLocation = { latitude: 28.6139, longitude: 77.2090, city: 'Delhi', state: 'Delhi' };
      findNearbyUsers(defaultLocation);
    }
  }, [location]);



  const findNearbyUsers = async (userLocation) => {
    try {
      const response = await locationAPI.getNearbyUsers(
        userLocation.latitude, 
        userLocation.longitude, 
        50
      );
      
      const transformedUsers = response.data.map(apiUser => ({
        id: apiUser.id,
        name: apiUser.name,
        type: apiUser.user_type,
        distance: apiUser.distance,
        location: `${apiUser.city || userLocation.city}, ${apiUser.state || userLocation.state}`,
        phone: '+91-9876543210',
        requirements: apiUser.requirements || getLocationBasedRequirements(userLocation.state),
        products: apiUser.products || getLocationBasedProducts(userLocation.state),
        rating: apiUser.rating,
        orders: apiUser.order_count || 0,
        sales: apiUser.sales_count || 0,
        avatar: apiUser.user_type === 'farmer' ? '👨🌾' : '👨💼'
      }));
      
      setNearbyUsers(transformedUsers);
      setLoading(false);
      return;
    } catch (error) {
      console.error('Error fetching nearby users:', error);
    }
    
    const getLocationBasedRequirements = (state) => {
      const stateRequirements = {
        'Punjab': ['Wheat', 'Rice', 'Dairy Products'],
        'Haryana': ['Wheat', 'Sugarcane', 'Vegetables'],
        'UP': ['Rice', 'Potato', 'Sugarcane'],
        'Maharashtra': ['Cotton', 'Onion', 'Sugarcane'],
        'Karnataka': ['Coffee', 'Rice', 'Spices'],
        'Tamil Nadu': ['Rice', 'Cotton', 'Coconut']
      };
      return stateRequirements[state] || ['Fresh Vegetables', 'Grains', 'Fruits'];
    };
    
    const getLocationBasedProducts = (state) => {
      const stateProducts = {
        'Punjab': ['Premium Wheat', 'Basmati Rice', 'Fresh Milk'],
        'Haryana': ['Wheat Flour', 'Jaggery', 'Seasonal Vegetables'],
        'UP': ['Aromatic Rice', 'Organic Potato', 'Sugarcane Juice'],
        'Maharashtra': ['Organic Cotton', 'Red Onion', 'Sugar'],
        'Karnataka': ['Arabica Coffee', 'Organic Rice', 'Cardamom'],
        'Tamil Nadu': ['Ponni Rice', 'Organic Cotton', 'Coconut Oil']
      };
      return stateProducts[state] || ['Organic Vegetables', 'Fresh Grains', 'Seasonal Fruits'];
    };
    // Mock nearby users data based on user type
    const mockUsers = user?.user_type === 'farmer' ? [
      {
        id: 1,
        name: 'Rajesh Kumar',
        type: 'consumer',
        distance: 12.5,
        location: 'Gurgaon, Haryana',
        phone: '+91-9876543210',
        requirements: ['Organic Vegetables', 'Fresh Fruits', 'Dairy Products'],
        rating: 4.8,
        orders: 25,
        avatar: '👨‍💼'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        type: 'consumer',
        distance: 8.3,
        location: 'Noida, UP',
        phone: '+91-9876543211',
        requirements: ['Wheat', 'Rice', 'Pulses'],
        rating: 4.9,
        orders: 18,
        avatar: '👩‍💼'
      },
      {
        id: 3,
        name: 'Amit Singh',
        type: 'consumer',
        distance: 25.7,
        location: 'Faridabad, Haryana',
        phone: '+91-9876543212',
        requirements: ['Seasonal Fruits', 'Organic Grains'],
        rating: 4.6,
        orders: 32,
        avatar: '👨‍🍳'
      },
      {
        id: 4,
        name: 'Sunita Devi',
        type: 'consumer',
        distance: 15.2,
        location: 'Ghaziabad, UP',
        phone: '+91-9876543213',
        requirements: ['Fresh Vegetables', 'Milk', 'Eggs'],
        rating: 4.7,
        orders: 12,
        avatar: '👩‍🏫'
      }
    ] : [
      {
        id: 1,
        name: 'Ram Singh',
        type: 'farmer',
        distance: 18.4,
        location: 'Sonipat, Haryana',
        phone: '+91-9876543220',
        products: ['Wheat', 'Rice', 'Sugarcane'],
        rating: 4.9,
        sales: 150,
        avatar: '👨‍🌾'
      },
      {
        id: 2,
        name: 'Suresh Patel',
        type: 'farmer',
        distance: 22.1,
        location: 'Meerut, UP',
        phone: '+91-9876543221',
        products: ['Tomatoes', 'Onions', 'Potatoes'],
        rating: 4.8,
        sales: 89,
        avatar: '👨‍🌾'
      },
      {
        id: 3,
        name: 'Kamala Devi',
        type: 'farmer',
        distance: 35.6,
        location: 'Panipat, Haryana',
        phone: '+91-9876543222',
        products: ['Organic Vegetables', 'Fruits', 'Herbs'],
        rating: 4.7,
        sales: 67,
        avatar: '👩‍🌾'
      },
      {
        id: 4,
        name: 'Vijay Kumar',
        type: 'farmer',
        distance: 42.3,
        location: 'Rohtak, Haryana',
        phone: '+91-9876543223',
        products: ['Dairy Products', 'Fresh Milk', 'Ghee'],
        rating: 4.6,
        sales: 95,
        avatar: '👨‍🌾'
      }
    ];

    const nearby = mockUsers.filter(u => u.distance <= 50);
    setNearbyUsers(nearby);
    setLoading(false);
  };

  const translations = {
    en: {
      title: user?.user_type === 'farmer' ? 'Nearby Consumers' : 'Nearby Farmers',
      subtitle: user?.user_type === 'farmer' ? 'Connect with consumers within 50km' : 'Find fresh produce from local farmers',
      distance: 'Distance',
      rating: 'Rating',
      contact: 'Contact',
      viewProfile: 'View Profile',
      requirements: 'Looking for',
      products: 'Sells',
      orders: 'Orders',
      sales: 'Sales',
      noUsers: user?.user_type === 'farmer' ? 'No consumers found nearby' : 'No farmers found nearby',
      enableLocation: 'Enable location to find nearby users'
    },
    hi: {
      title: user?.user_type === 'farmer' ? 'आस-पास के उपभोक्ता' : 'आस-पास के किसान',
      subtitle: user?.user_type === 'farmer' ? '50 किमी के भीतर उपभोक्ताओं से जुड़ें' : 'स्थानीय किसानों से ताजा उत्पाद खोजें',
      distance: 'दूरी',
      rating: 'रेटिंग',
      contact: 'संपर्क',
      viewProfile: 'प्रोफाइल देखें',
      requirements: 'तलाश में',
      products: 'बेचता है',
      orders: 'ऑर्डर',
      sales: 'बिक्री',
      noUsers: user?.user_type === 'farmer' ? 'आस-पास कोई उपभोक्ता नहीं मिला' : 'आस-पास कोई किसान नहीं मिला',
      enableLocation: 'आस-पास के उपयोगकर्ताओं को खोजने के लिए स्थान सक्षम करें'
    }
  };

  const t = translations[language];

  const handleContact = (userToContact) => {
    const message = user?.user_type === 'farmer' 
      ? `Hello! I'm a farmer from Kisan Setu. I have fresh produce available. Would you like to connect?`
      : `Hello! I found you on Kisan Setu. I'm interested in your products. Can we discuss?`;
    
    const whatsappUrl = `https://wa.me/${userToContact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Finding nearby users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-green-600 safe-area-top">
        <div className="max-w-6xl mx-auto mobile-px px-4 mobile-py py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800">{t.title}</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">{t.subtitle}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-green-600 hover:text-green-700 min-h-[44px] min-w-[44px] flex items-center justify-center text-sm sm:text-base"
            >
              <span className="hidden sm:inline">← Back to Dashboard</span>
              <span className="sm:hidden">←</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mobile-px px-4 py-4 sm:py-8 pb-20 lg:pb-8">

        {location && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg mobile-card p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <span className="text-xl sm:text-2xl mr-2 sm:mr-3">📍</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-blue-800 text-sm sm:text-base">
                    {location.city}, {location.state}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-600">
                    {language === 'hi' ? `पिन कोड: ${location.pincode || '000000'}` : `PIN: ${location.pincode || '000000'}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600 font-medium">
                  {language === 'hi' ? 'सेवा क्षेत्र: 50 किमी' : 'Service Area: 50km'}
                </p>
              </div>
            </div>
          </div>
        )}

        {nearbyUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md mobile-card p-6 sm:p-8 text-center">
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{t.noUsers}</h2>
            <p className="text-gray-600 text-sm sm:text-base">{t.enableLocation}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {nearbyUsers.map((nearbyUser) => (
              <div key={nearbyUser.id} className="bg-white rounded-lg shadow-md mobile-card p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-3xl sm:text-4xl mr-3 sm:mr-4 flex-shrink-0">{nearbyUser.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">{nearbyUser.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 capitalize">{nearbyUser.type}</p>
                    <p className="text-xs sm:text-sm text-blue-600 truncate">{nearbyUser.location}</p>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">{t.distance}:</span>
                    <span className="font-medium text-sm sm:text-base">{nearbyUser.distance} km</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">{t.rating}:</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium ml-1 text-sm sm:text-base">{nearbyUser.rating}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">
                      {user?.user_type === 'farmer' ? t.orders : t.sales}:
                    </span>
                    <span className="font-medium text-sm sm:text-base">
                      {user?.user_type === 'farmer' ? nearbyUser.orders : nearbyUser.sales}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    {user?.user_type === 'farmer' ? t.requirements : t.products}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(user?.user_type === 'farmer' ? nearbyUser.requirements : nearbyUser.products)?.map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleContact(nearbyUser)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm min-h-[44px] flex items-center justify-center"
                  >
                    📱 {t.contact}
                  </button>
                  <button
                    onClick={() => alert(`Profile details for ${nearbyUser.name} - Coming soon!`)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm min-h-[44px] flex items-center justify-center"
                  >
                    👤 {t.viewProfile}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

export default NearbyUsers;