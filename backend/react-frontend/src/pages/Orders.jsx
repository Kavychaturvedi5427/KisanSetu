import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { marketplaceAPI } from '../services/api';
import MobileNav from '../components/common/MobileNav';
import { ArrowLeft, Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { language } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await marketplaceAPI.getOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      // Mock orders data
      setOrders([
        {
          id: 1001,
          date: '2024-01-15',
          total: 250,
          status: 'delivered',
          items: ['Wheat 10kg', 'Rice 5kg'],
          delivery_address: 'Delhi, India'
        },
        {
          id: 1002,
          date: '2024-01-20',
          total: 180,
          status: 'shipped',
          items: ['Tomatoes 3kg', 'Onions 2kg'],
          delivery_address: 'Delhi, India'
        },
        {
          id: 1003,
          date: '2024-01-22',
          total: 320,
          status: 'processing',
          items: ['Fertilizer 1 pack', 'Seeds 2 packs'],
          delivery_address: 'Delhi, India'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translations = {
    en: {
      title: 'My Orders',
      noOrders: 'No orders found',
      orderPlaced: 'Order placed on',
      status: 'Status',
      total: 'Total',
      items: 'Items',
      deliveryAddress: 'Delivery Address',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      goToMarket: 'Go to Marketplace'
    },
    hi: {
      title: 'मेरे ऑर्डर',
      noOrders: 'कोई ऑर्डर नहीं मिला',
      orderPlaced: 'ऑर्डर दिया गया',
      status: 'स्थिति',
      total: 'कुल',
      items: 'वस्तुएं',
      deliveryAddress: 'डिलीवरी पता',
      processing: 'प्रसंस्करण',
      shipped: 'भेजा गया',
      delivered: 'डिलीवर हो गया',
      goToMarket: 'बाजार में जाएं'
    }
  };

  const t = translations[language];

  const getStatusText = (status) => {
    const statusMap = {
      processing: t.processing,
      shipped: t.shipped,
      delivered: t.delivered
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-600 font-semibold">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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

      <div className="p-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.noOrders}</h2>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors min-h-[44px]"
            >
              {t.goToMarket}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">#{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      {t.orderPlaced} {new Date(order.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US')}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">{t.items}:</h4>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, index) => (
                        <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {order.delivery_address && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">{t.deliveryAddress}:</h4>
                      <p className="text-gray-600">{order.delivery_address}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-semibold text-gray-700">{t.total}:</span>
                    <span className="text-xl font-bold text-green-600">₹{order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default Orders;