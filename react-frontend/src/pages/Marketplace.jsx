import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ArrowLeft } from 'lucide-react';

const Marketplace = () => {
  const { language, setLanguage } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [cart, setCart] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 800);
    const savedCart = JSON.parse(localStorage.getItem('kisanSetuCart') || '[]');
    setCart(savedCart);
    return () => clearTimeout(timer);
  }, []);

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

  const products = [
    { id: 1, name: 'Organic Fertilizer', nameHi: 'जैविक खाद', price: '₹500', image: 'fertilizer.jpeg.jpg' },
    { id: 2, name: 'Seeds Pack', nameHi: 'बीज पैक', price: '₹200', image: 'seeds.jpeg.jpg' },
    { id: 3, name: 'Drip Irrigation Kit', nameHi: 'ड्रिप सिंचाई किट', price: '₹2500', image: 'dripirrigation.jpeg.jpg' },
    { id: 4, name: 'Soil Tester Kit', nameHi: 'मिट्टी परीक्षण किट', price: '₹800', image: 'soiltesterkit.jpeg.jpg' },
    { id: 5, name: 'Watering Can', nameHi: 'पानी का डिब्बा', price: '₹150', image: 'wateringcan.jpeg.jpg' },
    { id: 6, name: 'Compost Bag', nameHi: 'कंपोस्ट बैग', price: '₹300', image: 'compostbag.jpeg.jpg' },
    { id: 7, name: 'Mini Greenhouse', nameHi: 'मिनी ग्रीनहाउस', price: '₹5000', image: 'minigreenhouse.jpeg.jpg' },
    { id: 8, name: 'Natural Pesticides', nameHi: 'प्राकृतिक कीटनाशक', price: '₹400', image: 'naturalpesticides.jpg' },
    { id: 9, name: 'Tractor Rental', nameHi: 'ट्रैक्टर किराया', price: '₹1500/day', image: 'tractorrental.jpeg.jpg' }
  ];

  // Copy images to public folder on component mount
  useEffect(() => {
    // This will be handled by manually copying the images
    const imagesToCopy = [
      'fertilizer.jpeg.jpg',
      'seeds.jpeg.jpg', 
      'dripirrigation.jpeg.jpg',
      'soiltesterkit.jpeg.jpg',
      'wateringcan.jpeg.jpg',
      'compostbag.jpeg.jpg',
      'minigreenhouse.jpeg.jpg',
      'naturalpesticides.jpg',
      'tractorrental.jpeg.jpg'
    ];
    // Images should be manually copied to public folder
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.nameHi.includes(searchTerm);
    return matchesSearch;
  });

  const addToCart = (productName, price) => {
    let cart = JSON.parse(localStorage.getItem('kisanSetuCart') || '[]');
    cart.push({ name: productName, price: price, addedAt: new Date().toISOString() });
    localStorage.setItem('kisanSetuCart', JSON.stringify(cart));
    
    const message = language === 'hi' ? `${productName} कार्ट में जोड़ा गया!` : `${productName} added to cart!`;
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
        <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-700 ease-in-out">
      {/* Header */}
      <header className="bg-white border-b-3 border-green-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <img src="/kisansetu.png" alt="Kisan Setu Logo" className="w-16 h-16 object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-green-600 uppercase tracking-wide">{t.title}</h1>
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
              
              <select className="px-2 py-2 border-2 border-yellow-400 rounded-lg">
                <option>{t.filterOption}</option>
                <option>{t.priceLow}</option>
                <option>{t.priceHigh}</option>
                <option>{t.newest}</option>
              </select>
              
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-500 transition-colors relative">
                {t.marketplaceBtn}
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
      <main className="flex max-w-7xl mx-auto p-5 gap-5">
        {/* Sidebar */}
        <aside className="w-52 bg-white border border-gray-300 rounded-xl p-4 h-fit">
          <h3 className="text-green-600 font-bold mb-3">{t.filtersTitle}</h3>
          <ul className="space-y-2 text-sm">
            <li><input type="checkbox" className="mr-2" /> <span>{t.category}</span></li>
            <li><input type="checkbox" className="mr-2" /> <span>{t.price}</span></li>
            <li><input type="checkbox" className="mr-2" /> <span>{t.distance}</span></li>
            <li><input type="checkbox" className="mr-2" /> <span>{t.organic}</span></li>
            <li><input type="checkbox" className="mr-2" /> <span>{t.rating}</span></li>
          </ul>
        </aside>

        {/* Product Grid */}
        <section className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl text-center p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img 
                  src={`/${product.image}`} 
                  alt={language === 'hi' ? product.nameHi : product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-green-100 rounded-lg flex items-center justify-center text-4xl" style={{display: 'none'}}>
                  🌱
                </div>
              </div>
              <h4 className="text-green-600 font-semibold text-lg mb-2">
                {language === 'hi' ? product.nameHi : product.name}
              </h4>
              <p className="text-gray-700 mb-4 font-medium text-xl">{product.price}</p>
              <button
                onClick={() => addToCart(product.name, product.price)}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors w-full"
              >
                {t.addToCart}
              </button>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center bg-white p-4 border-t-3 border-green-600 mt-8">
        <p className="text-gray-600">{t.footerText}</p>
      </footer>
    </div>
  );
};

export default Marketplace;