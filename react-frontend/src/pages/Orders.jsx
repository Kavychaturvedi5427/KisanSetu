import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { marketplaceAPI } from '../services/api';

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
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      // Fallback to local storage
      const localOrders = JSON.parse(localStorage.getItem('kisanSetuOrderHistory') || '[]');
      setOrders(localOrders);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'My Orders',
      noOrders: 'No orders yet',
      orderDate: 'Order Date',
      orderId: 'Order ID',
      items: 'Items',
      total: 'Total',
      status: 'Status',
      paymentMethod: 'Payment',
      shopNow: 'Start Shopping'
    },
    hi: {
      title: 'मेरे ऑर्डर',
      noOrders: 'अभी तक कोई ऑर्डर नहीं',
      orderDate: 'ऑर्डर की तारीख',
      orderId: 'ऑर्डर आईडी',
      items: 'आइटम',
      total: 'कुल',
      status: 'स्थिति',
      paymentMethod: 'भुगतान',
      shopNow: 'खरीदारी शुरू करें'
    }
  };

  const t = translations[language];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'delivered': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-green-600 hover:text-green-700"
          >
            ← Back to Dashboard
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.noOrders}</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              {t.shopNow}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">{t.orderId}</p>
                    <p className="font-medium">{order.order_id || `ORD${Date.now()}`}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.orderDate}</p>
                    <p className="font-medium">
                      {new Date(order.order_date || order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.total}</p>
                    <p className="font-medium text-green-600">₹{order.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.status}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status || 'Confirmed'}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">{t.items}:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {order.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between text-sm">
                        <span>{item.name || `Product ${item.product_id}`}</span>
                        <span>₹{item.price} x {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.payment_method && (
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">{t.paymentMethod}:</span> 
                    <span className="ml-2 capitalize">{order.payment_method}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;