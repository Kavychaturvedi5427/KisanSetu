import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocationContext } from '../contexts/LocationContext';
import { cartUtils, marketplaceAPI } from '../services/api';
import { ArrowLeft, MapPin, Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { user, language } = useAuth();
  const { location } = useLocationContext();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    name: user?.full_name || '',
    phone: user?.phone || '',
    address: location ? `${location.city}, ${location.state}` : '',
    notes: ''
  });

  useEffect(() => {
    setCart(cartUtils.getCart());
  }, []);

  const total = cartUtils.getCartTotal();

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    if (!orderData.name || !orderData.phone || !orderData.address) {
      alert(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill all required fields');
      return;
    }

    if (cart.length === 0) {
      alert(language === 'hi' ? 'आपका कार्ट खाली है' : 'Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      await marketplaceAPI.createOrder({
        items: orderItems,
        delivery_address: orderData.address,
        phone: orderData.phone,
        notes: orderData.notes
      });

      cartUtils.clearCart();
      alert(language === 'hi' ? '🎉 ऑर्डर सफलतापूर्वक दिया गया!' : '🎉 Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Order error:', error);
      alert(language === 'hi' ? 'ऑर्डर देने में त्रुटि हुई' : 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Checkout',
      orderSummary: 'Order Summary',
      deliveryInfo: 'Delivery Information',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      address: 'Delivery Address',
      notes: 'Special Notes (Optional)',
      total: 'Total Amount',
      placeOrder: 'Place Order',
      emptyCart: 'Your cart is empty',
      goToMarket: 'Go to Marketplace'
    },
    hi: {
      title: 'चेकआउट',
      orderSummary: 'ऑर्डर सारांश',
      deliveryInfo: 'डिलीवरी जानकारी',
      fullName: 'पूरा नाम',
      phoneNumber: 'फोन नंबर',
      address: 'डिलीवरी पता',
      notes: 'विशेष टिप्पणी (वैकल्पिक)',
      total: 'कुल राशि',
      placeOrder: 'ऑर्डर दें',
      emptyCart: 'आपका कार्ट खाली है',
      goToMarket: 'बाजार में जाएं'
    }
  };

  const t = translations[language];

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.emptyCart}</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            {t.goToMarket}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/marketplace')}
          className="p-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.orderSummary}</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">₹{item.price}/kg × {item.quantity}</p>
                </div>
                <p className="font-bold text-green-600">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">{t.total}:</span>
              <span className="text-2xl font-bold text-green-600">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.deliveryInfo}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                {t.fullName} *
              </label>
              <input
                type="text"
                name="name"
                value={orderData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                {t.phoneNumber} *
              </label>
              <input
                type="tel"
                name="phone"
                value={orderData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                {t.address} *
              </label>
              <textarea
                name="address"
                value={orderData.address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.notes}
              </label>
              <textarea
                name="notes"
                value={orderData.notes}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={language === 'hi' ? 'कोई विशेष निर्देश...' : 'Any special instructions...'}
              />
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-2xl text-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 min-h-[44px] flex items-center justify-center"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{language === 'hi' ? 'ऑर्डर दिया जा रहा है...' : 'Placing Order...'}</span>
            </div>
          ) : (
            `${t.placeOrder} - ₹${total}`
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout;