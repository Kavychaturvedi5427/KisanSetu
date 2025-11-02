import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { marketplaceAPI, cartUtils } from '../services/api';
import MobileNav from '../components/common/MobileNav';
import { ArrowLeft, Search, ShoppingCart, Plus, Minus, Leaf, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const { language } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    setCart(cartUtils.getCart());
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        marketplaceAPI.getProducts(),
        marketplaceAPI.getCategories()
      ]);
      
      setProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (error) {
      console.error('Error loading marketplace data:', error);
      // Mock data fallback
      setProducts([
        { 
          id: 1, name: 'Organic Wheat', price: 25, category: 'grains', seller: 'Ram Singh', 
          image: '/seeds.jpg', location: 'Punjab', distance_km: 15, sustainability_score: 95, 
          carbon_footprint: 1.2, organic: true, rating: 4.8, quantity_kg: 500
        },
        { 
          id: 2, name: 'Fresh Tomatoes', price: 30, category: 'vegetables', seller: 'Shyam Kumar', 
          image: '/placeholder.jpg', location: 'Haryana', distance_km: 8, sustainability_score: 85, 
          carbon_footprint: 0.8, organic: false, rating: 4.5, quantity_kg: 200
        },
        { 
          id: 3, name: 'Basmati Rice', price: 80, category: 'grains', seller: 'Gita Devi', 
          image: '/seeds.jpg', location: 'UP', distance_km: 25, sustainability_score: 90, 
          carbon_footprint: 2.1, organic: true, rating: 4.9, quantity_kg: 1000
        },
        { 
          id: 4, name: 'Red Onions', price: 25, category: 'vegetables', seller: 'Mohan Lal', 
          image: '/placeholder.jpg', location: 'Rajasthan', distance_km: 45, sustainability_score: 80, 
          carbon_footprint: 1.5, organic: false, rating: 4.3, quantity_kg: 300
        },
        { 
          id: 5, name: 'Organic Fertilizer', price: 500, category: 'supplies', seller: 'EcoFarm Solutions', 
          image: '/fertilizer.jpg', location: 'Local', distance_km: 5, sustainability_score: 100, 
          carbon_footprint: 0.3, organic: true, rating: 4.7, quantity_kg: 50
        },
        { 
          id: 6, name: 'Heirloom Seeds', price: 150, category: 'supplies', seller: 'Heritage Seeds Co', 
          image: '/seeds.jpg', location: 'Karnataka', distance_km: 12, sustainability_score: 98, 
          carbon_footprint: 0.1, organic: true, rating: 4.9, quantity_kg: 2
        }
      ]);
      setCategories([
        { id: 'grains', name: 'Grains', icon: '🌾' },
        { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
        { id: 'fruits', name: 'Fruits', icon: '🍎' },
        { id: 'supplies', name: 'Supplies', icon: '🛠️' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    const updatedCart = cartUtils.addToCart(product);
    setCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartUtils.removeFromCart(productId);
    setCart(updatedCart);
  };

  const getCartItemQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const translations = {
    en: {
      title: 'Marketplace',
      search: 'Search products...',
      allCategories: 'All Categories',
      addToCart: 'Add to Cart',
      seller: 'Seller',
      price: 'Price',
      cart: 'Cart',
      checkout: 'Checkout',
      emptyCart: 'Your cart is empty',
      total: 'Total',
      organic: 'Organic',
      sustainabilityScore: 'Sustainability Score',
      carbonFootprint: 'Carbon Footprint',
      distance: 'Distance',
      rating: 'Rating',
      available: 'Available'
    },
    hi: {
      title: 'बाजार',
      search: 'उत्पाद खोजें...',
      allCategories: 'सभी श्रेणियां',
      addToCart: 'कार्ट में डालें',
      seller: 'विक्रेता',
      price: 'कीमत',
      cart: 'कार्ट',
      checkout: 'चेकआउट',
      emptyCart: 'आपका कार्ट खाली है',
      total: 'कुल',
      organic: 'जैविक',
      sustainabilityScore: 'स्थिरता स्कोर',
      carbonFootprint: 'कार्बन फुटप्रिंट',
      distance: 'दूरी',
      rating: 'रेटिंग',
      available: 'उपलब्ध'
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-600 font-semibold">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
          </div>
          
          <button
            onClick={() => navigate('/checkout')}
            className="relative p-2 rounded-lg bg-green-600 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Categories and Filters */}
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full whitespace-nowrap min-h-[44px] ${
                !selectedCategory ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 min-h-[44px] ${
                  selectedCategory === category.id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
          
          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto">
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm whitespace-nowrap">
              🌿 {t.organic}
            </button>
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm whitespace-nowrap">
              📍 Local (&lt; 20km)
            </button>
            <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm whitespace-nowrap">
              ⭐ High Rated (4.5+)
            </button>
            <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm whitespace-nowrap">
              🌱 Eco-Friendly
            </button>
          </div>
        </div>
      </div>

      {/* Sustainability Summary */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">
            {language === 'hi' ? 'स्थिरता प्रभाव' : 'Sustainability Impact'}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {filteredProducts.filter(p => p.organic).length}
              </div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? 'जैविक उत्पाद' : 'Organic Products'}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {Math.round(filteredProducts.reduce((sum, p) => sum + (2.5 - p.carbon_footprint), 0) * 10) / 10}kg
              </div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? 'CO₂ बचत' : 'CO₂ Saved'}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {Math.round(filteredProducts.reduce((sum, p) => sum + p.distance_km, 0) / filteredProducts.length) || 0}km
              </div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? 'औसत दूरी' : 'Avg Distance'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-800 flex-1">{product.name}</h3>
                  {product.organic && (
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                      <Leaf className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-semibold">{t.organic}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1 mb-3">
                  <p className="text-sm text-gray-600">{t.seller}: {product.seller}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{product.location} ({product.distance_km}km)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-semibold">
                      {t.sustainabilityScore}: {product.sustainability_score}/100
                    </span>
                    <span className="text-blue-600">
                      CO₂: {product.carbon_footprint}kg
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t.available}: {product.quantity_kg}kg
                  </p>
                </div>
                
                <p className="text-xl font-bold text-green-600 mb-4">₹{product.price}/kg</p>
                
                {getCartItemQuantity(product.id) > 0 ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-lg">{getCartItemQuantity(product.id)}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors min-h-[44px]"
                  >
                    {t.addToCart}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default Marketplace;