import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { marketplaceAPI } from '../services/api';
import MobileNav from '../components/common/MobileNav';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

const Checkout = () => {
  const { user, language } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('kisanSetuCart') || '[]');
    setCart(savedCart);
    
    // Check if first time user (no previous orders)
    const orderHistory = JSON.parse(localStorage.getItem('kisanSetuOrderHistory') || '[]');
    setIsFirstTimeUser(orderHistory.length === 0);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const discount = isFirstTimeUser ? subtotal * 0.2 : 0;
  const deliveryFee = subtotal > 1000 ? 0 : 50;
  const total = subtotal - discount + deliveryFee;

  const translations = {
    en: {
      title: 'Checkout',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      discount: 'First Time User Discount (20%)',
      delivery: 'Delivery Fee',
      total: 'Total Amount',
      paymentMethod: 'Payment Method',
      card: 'Credit/Debit Card',
      upi: 'UPI Payment',
      cod: 'Cash on Delivery',
      address: 'Delivery Address',
      placeOrder: 'Place Order',
      backToCart: 'Back to Cart',
      free: 'FREE'
    },
    hi: {
      title: 'चेकआउट',
      orderSummary: 'ऑर्डर सारांश',
      subtotal: 'उप-योग',
      discount: 'पहली बार उपयोगकर्ता छूट (20%)',
      delivery: 'डिलीवरी शुल्क',
      total: 'कुल राशि',
      paymentMethod: 'भुगतान विधि',
      card: 'क्रेडिट/डेबिट कार्ड',
      upi: 'UPI भुगतान',
      cod: 'कैश ऑन डिलीवरी',
      address: 'डिलीवरी पता',
      placeOrder: 'ऑर्डर करें',
      backToCart: 'कार्ट पर वापस',
      free: 'मुफ्त'
    }
  };

  const t = translations[language];

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert('Please enter delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity || 1,
          price: item.price
        })),
        delivery_address: address,
        payment_method: paymentMethod,
        discount_applied: discount,
        total_amount: total
      };

      await marketplaceAPI.createOrder(orderData);
      
      // Save to order history
      const orderHistory = JSON.parse(localStorage.getItem('kisanSetuOrderHistory') || '[]');
      orderHistory.push({
        ...orderData,
        order_date: new Date().toISOString(),
        order_id: 'ORD' + Date.now()
      });
      localStorage.setItem('kisanSetuOrderHistory', JSON.stringify(orderHistory));
      
      // Clear cart
      localStorage.removeItem('kisanSetuCart');
      
      alert('Order placed successfully! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Order error:', error);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center safe-area-top">
        <div className="text-center mobile-px px-4">
          <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 min-h-[44px] text-sm sm:text-base"
          >
            Continue Shopping
          </button>
        </div>
        <div className="lg:hidden fixed bottom-0 left-0 right-0">
          <MobileNav />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-green-600 safe-area-top">
        <div className="max-w-4xl mx-auto mobile-px px-4 mobile-py py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/marketplace')}
              className="text-green-600 hover:text-green-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">{t.backToCart}</span>
            </button>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">{t.title}</h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto mobile-px px-4 py-4 sm:py-8 pb-20 lg:pb-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md mobile-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">{t.orderSummary}</h2>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-start border-b pb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base truncate">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                  </div>
                  <p className="font-medium text-sm sm:text-base ml-2">₹{item.price * (item.quantity || 1)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-3 sm:pt-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span>{t.subtotal}</span>
                <span>₹{subtotal}</span>
              </div>
              
              {isFirstTimeUser && (
                <div className="flex justify-between text-green-600 text-sm sm:text-base">
                  <span>{t.discount}</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm sm:text-base">
                <span>{t.delivery}</span>
                <span>{deliveryFee === 0 ? t.free : `₹${deliveryFee}`}</span>
              </div>
              
              <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
                <span>{t.total}</span>
                <span>₹{total}</span>
              </div>
            </div>

            {isFirstTimeUser && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-xs sm:text-sm font-medium">
                  🎉 Congratulations! You're getting 20% off as a first-time user!
                </p>
              </div>
            )}
          </div>

          {/* Payment & Address */}
          <div className="bg-white rounded-lg shadow-md mobile-card p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.address}
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-base"
                rows="3"
                placeholder="Enter your complete delivery address"
                required
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t.paymentMethod}
              </label>
              
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 min-h-[44px]">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <span className="text-lg sm:text-xl">💳</span>
                    <span className="ml-2 text-sm sm:text-base">{t.card}</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 min-h-[44px]">
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <span className="text-lg sm:text-xl">📱</span>
                    <span className="ml-2 text-sm sm:text-base">{t.upi}</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 min-h-[44px]">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <span className="text-lg sm:text-xl">💵</span>
                    <span className="ml-2 text-sm sm:text-base">{t.cod}</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !address.trim()}
              className="w-full bg-green-600 text-white py-3 sm:py-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-sm sm:text-base"
            >
              {loading ? 'Processing...' : `${t.placeOrder} - ₹${total}`}
            </button>

            <div className="mt-4 text-center text-xs sm:text-sm text-gray-600">
              <p>🔒 Secure payment • 📦 Free delivery on orders above ₹1000</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

export default Checkout;