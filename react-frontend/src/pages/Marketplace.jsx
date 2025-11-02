import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocationContext } from '../contexts/LocationContext';
import { useNavigate } from 'react-router-dom';
import { marketplaceAPI } from '../services/api';
import MobileNav from '../components/common/MobileNav';
import { ShoppingCart, Filter, Search, ArrowLeft, MapPin } from 'lucide-react';

const Marketplace = () => {
  const { language, setLanguage } = useAuth();
  const { location } = useLocationContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 800);
    const savedCart = JSON.parse(localStorage.getItem('kisanSetuCart') || '[]');
    setCart(savedCart);
    loadProducts();
    loadCategories();
    return () => clearTimeout(timer);
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        location: location ? `${location.city}, ${location.state}` : 'Delhi, India'
      };
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const response = await marketplaceAPI.getProducts(params);
      
      // Enhance products with location-based data
      const enhancedProducts = response.data.map(product => ({
        ...product,
        location: product.location || `${location?.city || 'Delhi'}, ${location?.state || 'India'}`,
        delivery_time: calculateDeliveryTime(product.farmer_location, location),
        is_local: isLocalProduct(product.farmer_location, location),
        regional_price: adjustPriceByLocation(product.price, location?.state)
      }));
      
      setProducts(enhancedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback with location-based mock data
      setProducts(generateLocationBasedProducts());
    } finally {
      setLoading(false);
    }
  };
  
  const calculateDeliveryTime = (farmerLocation, userLocation) => {
    if (!farmerLocation || !userLocation) return '2-3 days';
    const distance = Math.random() * 50; // Mock distance calculation
    return distance < 10 ? 'Same day' : distance < 25 ? '1-2 days' : '2-3 days';
  };
  
  const isLocalProduct = (farmerLocation, userLocation) => {
    if (!farmerLocation || !userLocation) return false;
    return Math.random() > 0.5; // Mock local check
  };
  
  const adjustPriceByLocation = (basePrice, state) => {
    const stateMultipliers = {
      'Punjab': 0.95, 'Haryana': 0.97, 'UP': 1.02, 'Bihar': 1.05,
      'Maharashtra': 0.98, 'Karnataka': 1.01, 'Tamil Nadu': 1.03
    };
    return Math.round(basePrice * (stateMultipliers[state] || 1.0));
  };
  
  const generateLocationBasedProducts = () => {
    const stateProducts = {
      'Punjab': [
        { id: 1, name: 'Premium Basmati Rice', price: 120, category: 'grains', farmer_name: 'Gurpreet Singh', is_local: true },
        { id: 2, name: 'Organic Wheat', price: 35, category: 'grains', farmer_name: 'Harjeet Kaur', is_local: true }
      ],
      'Maharashtra': [
        { id: 1, name: 'Red Onions', price: 25, category: 'vegetables', farmer_name: 'Ramesh Patil', is_local: true },
        { id: 2, name: 'Organic Cotton', price: 85, category: 'cash_crops', farmer_name: 'Sunita Deshmukh', is_local: true }
      ]
    };
    
    const defaultProducts = [
      { id: 1, name: 'Fresh Tomatoes', price: 30, category: 'vegetables', farmer_name: 'Local Farmer', is_local: true },
      { id: 2, name: 'Organic Rice', price: 65, category: 'grains', farmer_name: 'Regional Supplier', is_local: false }
    ];
    
    return stateProducts[location?.state] || defaultProducts;
  };

  const loadCategories = async () => {
    try {
      const response = await marketplaceAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadProducts();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory]);

  const translations = {
    en: {
      title: 'Kisan Setu Marketplace',
      backBtn: '← Back to Dashboard',
      searchPlaceholder: 'Search products...',
      filterOption: 'Filters + Sort',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      newest: 'Newest',
      marketplaceBtn: 'Marketplace',
      filtersTitle: 'Filters',
      category: 'Category',
      price: 'Price',
      distance: 'Distance',
      organic: 'Organic',
      rating: 'Rating',
      footerText: '© 2025 Kisan Setu | Empowering Farmers',
      addToCart: 'Add to Cart'
    },
    hi: {
      title: 'किसान सेतु बाजार',
      backBtn: '← डैशबोर्ड पर वापस',
      searchPlaceholder: 'उत्पाद खोजें...',
      filterOption: 'फिल्टर + सॉर्ट',
      priceLow: 'कीमत: कम से ज्यादा',
      priceHigh: 'कीमत: ज्यादा से कम',
      newest: 'नवीनतम',
      marketplaceBtn: 'बाजार',
      filtersTitle: 'फिल्टर',
      category: 'श्रेणी',
      price: 'कीमत',
      distance: 'दूरी',
      organic: 'जैविक',
      rating: 'रेटिंग',
      footerText: '© 2025 किसान सेतु | किसानों को सशक्त बनाना',
      addToCart: 'कार्ट में डालें'
    }
  };

  const t = translations[language];

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('kisanSetuCart') || '[]');
    
    // Check if product already exists in cart
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      cart.push({ 
        id: product.id,
        name: product.name, 
        price: product.price, 
        farmer_name: product.farmer_name,
        location: product.location,
        quantity: 1,
        addedAt: new Date().toISOString() 
      });
    }
    
    localStorage.setItem('kisanSetuCart', JSON.stringify(cart));
    const message = language === 'hi' ? `${product.name} कार्ट में जोड़ा गया!` : `${product.name} added to cart!`;
    alert(message);
    updateCartCount();
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('kisanSetuCart') || '[]');
    setCart(cart);
  };

  if (!pageLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-green-600 to-orange-500 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-700 ease-in-out">
      {/* Header */}
      <header className="bg-white border-b-4 border-green-600 shadow-lg safe-area-top">
        <div className="max-w-7xl mx-auto mobile-px px-4 sm:px-6 mobile-py py-3 sm:py-4">
          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-green-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 text-center">
                <h1 className="text-lg font-bold text-green-600">{t.title}</h1>
                {location && (
                  <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                    <MapPin className="w-3 h-3" />
                    <span>{location.city}, {location.state}</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="bg-green-600 text-white p-2 rounded-lg relative min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
            
            {/* Mobile Search */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 text-base"
                />
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-3 border-2 border-green-600 rounded-lg bg-white text-green-600 font-semibold text-base min-h-[44px]"
              >
                <option value="en">EN</option>
                <option value="hi">हिं</option>
              </select>
            </div>
            
            {/* Mobile Filters */}
            <div className="flex gap-2">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-base min-h-[44px]"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-yellow-400 rounded-lg text-base min-h-[44px]"
              >
                <option value="">{t.filterOption}</option>
                <option value="price_low">{t.priceLow}</option>
                <option value="price_high">{t.priceHigh}</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
                <img src="/kisansetu.png" alt="Kisan Setu Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-green-600 uppercase tracking-wide">{t.title}</h1>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 border-2 border-green-600 rounded-lg bg-white text-green-600 font-semibold"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>

              <button
                onClick={() => navigate('/dashboard')}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors"
              >
                {t.backBtn}
              </button>

              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border-2 border-green-600 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-2 border-2 border-yellow-400 rounded-lg"
              >
                <option value="">{t.filterOption}</option>
                <option value="price_low">{t.priceLow}</option>
                <option value="price_high">{t.priceHigh}</option>
                <option value="rating">Rating</option>
              </select>

              <button 
                onClick={() => navigate('/checkout')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-500 transition-colors relative"
              >
                🛒 Cart
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex max-w-7xl mx-auto mobile-px p-4 sm:p-5 gap-0 lg:gap-5 pb-20 lg:pb-5">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-52 bg-white border border-gray-300 rounded-xl p-4 h-fit">
          <h3 className="text-green-600 font-bold mb-3">{t.filtersTitle}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.category}</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map(product => (
                <div key={product.id} className={`bg-white border-2 rounded-xl text-center mobile-card p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  product.is_local ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}>
                  {product.is_local && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">
                      {language === 'hi' ? 'स्थानीय' : 'LOCAL'}
                    </div>
                  )}
                  <div className="w-full h-40 sm:h-48 bg-gray-100 rounded-lg mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = '/placeholder.jpg')}
                    />
                  </div>
                  <h4 className="text-green-600 font-semibold text-base sm:text-lg mb-2">
                    {product.name}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <p className="text-gray-700 font-medium text-lg sm:text-xl">₹{product.regional_price || product.price}</p>
                    {product.regional_price && product.regional_price !== product.price && (
                      <p className="text-xs text-gray-400 line-through">₹{product.price}</p>
                    )}
                  </div>
                  {product.farmer_name && (
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 truncate">By: {product.farmer_name}</p>
                  )}
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {product.location}
                    </span>
                    <span className="flex items-center gap-1">
                      🚚 {product.delivery_time || '2-3 days'}
                    </span>
                  </div>
                  {product.rating && (
                    <p className="text-xs sm:text-sm text-yellow-600 mb-3">⭐ {product.rating}/5</p>
                  )}
                  <button
                    onClick={() => addToCart(product)}
                    className={`text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors w-full min-h-[44px] text-sm sm:text-base ${
                      product.is_local ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {t.addToCart}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center bg-white mobile-px p-3 sm:p-4 border-t-4 border-green-600 mt-8 safe-area-bottom">
        <p className="text-gray-600 text-sm sm:text-base">{t.footerText}</p>
      </footer>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

export default Marketplace;
