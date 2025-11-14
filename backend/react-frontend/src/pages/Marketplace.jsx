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
      // Mock data fallback with expanded products
      setProducts([
        // GRAINS
        { id: 1, name: 'Organic Wheat', price: 25, category: 'grains', seller: 'Ram Singh', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', location: 'Punjab', distance_km: 15, sustainability_score: 95, carbon_footprint: 1.2, organic: true, rating: 4.8, quantity_kg: 500 },
        { id: 2, name: 'Basmati Rice', price: 80, category: 'grains', seller: 'Gita Devi', image: 'https://images.unsplash.com/photo-1643622357625-c013987d90e7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', location: 'UP', distance_km: 25, sustainability_score: 90, carbon_footprint: 2.1, organic: true, rating: 4.9, quantity_kg: 1000 },
        { id: 3, name: 'Millets Mix', price: 45, category: 'grains', seller: 'Sustainable Grains', image: 'https://images.unsplash.com/photo-1758612153921-9525532663d6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlsbGV0cyUyMG1peHxlbnwwfHwwfHx8MA%3D%3D', location: 'Tamil Nadu', distance_km: 35, sustainability_score: 96, carbon_footprint: 0.9, organic: true, rating: 4.8, quantity_kg: 100 },
        { id: 4, name: 'Quinoa', price: 120, category: 'grains', seller: 'Health Grains Co', image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400', location: 'Himachal Pradesh', distance_km: 50, sustainability_score: 92, carbon_footprint: 1.0, organic: true, rating: 4.7, quantity_kg: 75 },
        
        // VEGETABLES
        { id: 6, name: 'Fresh Tomatoes', price: 30, category: 'vegetables', seller: 'Shyam Kumar', image: 'https://plus.unsplash.com/premium_photo-1723377607590-5aac4e48bb06?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlc2glMjB0b21hdG98ZW58MHx8MHx8fDA%3D', location: 'Haryana', distance_km: 8, sustainability_score: 85, carbon_footprint: 0.8, organic: false, rating: 4.5, quantity_kg: 200 },
        { id: 7, name: 'Red Onions', price: 25, category: 'vegetables', seller: 'Mohan Lal', image: 'https://images.unsplash.com/photo-1668295037469-8b0e8d11cd2a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVkJTIwb25pb25zfGVufDB8fDB8fHww', location: 'Rajasthan', distance_km: 45, sustainability_score: 80, carbon_footprint: 1.5, organic: false, rating: 4.3, quantity_kg: 300 },
        { id: 8, name: 'Fresh Spinach', price: 20, category: 'vegetables', seller: 'Green Valley Farm', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', location: 'Local', distance_km: 3, sustainability_score: 92, carbon_footprint: 0.2, organic: true, rating: 4.6, quantity_kg: 50 },
        { id: 9, name: 'Organic Carrots', price: 35, category: 'vegetables', seller: 'Fresh Fields', image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400', location: 'Punjab', distance_km: 12, sustainability_score: 88, carbon_footprint: 0.6, organic: true, rating: 4.4, quantity_kg: 120 },
        
        // FRUITS
        { id: 12, name: 'Fresh Apples', price: 80, category: 'fruits', seller: 'Hill Orchards', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', location: 'Himachal Pradesh', distance_km: 60, sustainability_score: 89, carbon_footprint: 1.3, organic: true, rating: 4.7, quantity_kg: 200 },
        { id: 13, name: 'Organic Bananas', price: 35, category: 'fruits', seller: 'Tropical Farms', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', location: 'Kerala', distance_km: 45, sustainability_score: 91, carbon_footprint: 0.7, organic: true, rating: 4.6, quantity_kg: 150 },
        { id: 15, name: 'Organic Mangoes', price: 120, category: 'fruits', seller: 'Mango King', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', location: 'UP', distance_km: 22, sustainability_score: 93, carbon_footprint: 1.2, organic: true, rating: 4.9, quantity_kg: 100 },
        
        // DAIRY
        { id: 21, name: 'Fresh Cow Milk', price: 45, category: 'dairy', seller: 'Dairy Fresh', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', location: 'Haryana', distance_km: 15, sustainability_score: 85, carbon_footprint: 2.0, organic: true, rating: 4.5, quantity_kg: 20 },
        { id: 22, name: 'Farm Eggs', price: 8, category: 'dairy', seller: 'Happy Hens', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', location: 'Punjab', distance_km: 10, sustainability_score: 90, carbon_footprint: 1.2, organic: true, rating: 4.7, quantity_kg: 1 },
        
        // SPICES
        { id: 24, name: 'Organic Turmeric', price: 180, category: 'spices', seller: 'Spice Garden', image: 'https://plus.unsplash.com/premium_photo-1726862790171-0d6208559224?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dHVybWVyaWN8ZW58MHx8MHx8fDA%3D', location: 'Kerala', distance_km: 50, sustainability_score: 96, carbon_footprint: 0.3, organic: true, rating: 4.8, quantity_kg: 5 },
        { id: 25, name: 'Fresh Ginger', price: 65, category: 'spices', seller: 'Herb Valley', image: 'https://images.unsplash.com/photo-1630623093145-f606591c2546?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2luZ2VyfGVufDB8fDB8fHww', location: 'Himachal Pradesh', distance_km: 45, sustainability_score: 92, carbon_footprint: 0.4, organic: true, rating: 4.6, quantity_kg: 10 },
        { id: 31, name: 'Red Chili Powder', price: 150, category: 'spices', seller: 'Spice Masters', image: 'https://media.istockphoto.com/id/2200408379/photo/chili-powder-is-a-seasoning-blend-of-ground-dried-chills-in-a-glass-bowl-with-dried-red.webp?a=1&b=1&s=612x612&w=0&k=20&c=AvHXhT85hzj-OAAtM8u8ijrb7bCbb7HHRVxLnd_iZ2I=', location: 'Andhra Pradesh', distance_km: 55, sustainability_score: 89, carbon_footprint: 0.5, organic: false, rating: 4.5, quantity_kg: 8 },
        
        // MORE VEGETABLES
        { id: 33, name: 'Cauliflower', price: 28, category: 'vegetables', seller: 'Fresh Harvest', image: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2F1bGlmbG93ZXJ8ZW58MHx8MHx8fDA%3D', location: 'Punjab', distance_km: 18, sustainability_score: 84, carbon_footprint: 0.7, organic: false, rating: 4.3, quantity_kg: 100 },
        { id: 34, name: 'Green Peas', price: 45, category: 'vegetables', seller: 'Garden Fresh', image: 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JlZW4lMjBwZWFzfGVufDB8fDB8fHww', location: 'UP', distance_km: 22, sustainability_score: 87, carbon_footprint: 0.4, organic: true, rating: 4.6, quantity_kg: 60 },
        
        // SUPPLIES
        { id: 16, name: 'Organic Fertilizer', price: 500, category: 'supplies', seller: 'EcoFarm Solutions', image: 'https://plus.unsplash.com/premium_photo-1663089572474-6e2dc35d0ede?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8T3JnYW5pYyUyMEZlcnRpbGl6ZXJ8ZW58MHx8MHx8fDA%3D', location: 'Local', distance_km: 5, sustainability_score: 100, carbon_footprint: 0.3, organic: true, rating: 4.7, quantity_kg: 50 },
        { id: 17, name: 'Vegetable Seeds Pack', price: 150, category: 'supplies', seller: 'Heritage Seeds Co', image: 'https://images.unsplash.com/photo-1694958477432-a08889e68104?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VmVnZXRhYmxlJTIwU2VlZHMlMjBQYWNrfGVufDB8fDB8fHww', location: 'Karnataka', distance_km: 12, sustainability_score: 98, carbon_footprint: 0.1, organic: true, rating: 4.9, quantity_kg: 2 },
        { id: 19, name: 'Drip Irrigation Kit', price: 2500, category: 'supplies', seller: 'Water Wise', image: 'https://plus.unsplash.com/premium_photo-1661825536186-19606cd9a0f1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RHJpcCUyMElycmlnYXRpb24lMjBLaXR8ZW58MHx8MHx8fDA%3D', distance_km: 40, sustainability_score: 92, carbon_footprint: 0.5, organic: false, rating: 4.6, quantity_kg: 15 },
        { id: 27, name: 'Solar Water Pump', price: 15000, category: 'supplies', seller: 'Solar Solutions', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', location: 'Rajasthan', distance_km: 35, sustainability_score: 98, carbon_footprint: 0.1, organic: false, rating: 4.8, quantity_kg: 25 }
      ]);
      setCategories([
        { id: 'grains', name: 'Grains', icon: '🌾' },
        { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
        { id: 'fruits', name: 'Fruits', icon: '🍎' },
        { id: 'dairy', name: 'Dairy', icon: '🥛' },
        { id: 'spices', name: 'Spices', icon: '🌶️' },
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
                  e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400';
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
                    {t.available}: {product.quantity_kg}{product.category === 'dairy' && product.name.includes('Eggs') ? ' piece' : 'kg'}
                  </p>
                </div>
                
                <p className="text-xl font-bold text-green-600 mb-4">
                  ₹{product.price}/{product.category === 'dairy' && product.name.includes('Eggs') ? 'piece' : 'kg'}
                </p>
                
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