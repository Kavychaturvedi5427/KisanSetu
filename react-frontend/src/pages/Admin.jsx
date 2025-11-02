import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import { ArrowLeft, Users, TrendingUp, ShoppingCart, DollarSign, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user, language } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user_type !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadAdminData();
  }, [user, navigate]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers()
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error('Admin data error:', error);
      // Mock data
      setStats({
        total_users: 156,
        total_farmers: 89,
        total_consumers: 67,
        total_orders: 234,
        total_revenue: 75000,
        active_users_today: 45,
        new_registrations_today: 8
      });
      setUsers([
        {
          id: '1',
          username: 'admin',
          email: 'admin@kisansetu.com',
          full_name: 'Admin User',
          user_type: 'admin',
          phone: '9999999999',
          created_at: '2024-01-01T00:00:00Z',
          is_active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Admin Dashboard',
      overview: 'System Overview',
      totalUsers: 'Total Users',
      totalFarmers: 'Total Farmers',
      totalConsumers: 'Total Consumers',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      activeToday: 'Active Today',
      newRegistrations: 'New Registrations',
      userManagement: 'User Management',
      username: 'Username',
      email: 'Email',
      fullName: 'Full Name',
      userType: 'User Type',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      farmer: 'Farmer',
      consumer: 'Consumer',
      vendor: 'Vendor',
      admin: 'Admin'
    },
    hi: {
      title: 'एडमिन डैशबोर्ड',
      overview: 'सिस्टम अवलोकन',
      totalUsers: 'कुल उपयोगकर्ता',
      totalFarmers: 'कुल किसान',
      totalConsumers: 'कुल उपभोक्ता',
      totalOrders: 'कुल ऑर्डर',
      totalRevenue: 'कुल आय',
      activeToday: 'आज सक्रिय',
      newRegistrations: 'नए पंजीकरण',
      sustainabilityMetrics: 'स्थिरता प्रभाव',
      businessMetrics: 'व्यापारिक प्रदर्शन',
      userManagement: 'उपयोगकर्ता प्रबंधन',
      username: 'उपयोगकर्ता नाम',
      email: 'ईमेल',
      fullName: 'पूरा नाम',
      userType: 'उपयोगकर्ता प्रकार',
      status: 'स्थिति',
      active: 'सक्रिय',
      inactive: 'निष्क्रिय',
      farmer: 'किसान',
      consumer: 'उपभोक्ता',
      vendor: 'विक्रेता',
      admin: 'एडमिन'
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-semibold">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: t.totalUsers,
      value: stats?.total_users || 0,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: t.totalFarmers,
      value: stats?.total_farmers || 0,
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: t.totalConsumers,
      value: stats?.total_consumers || 0,
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: t.totalOrders,
      value: stats?.total_orders || 0,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: t.totalRevenue,
      value: `₹${(stats?.total_revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: t.activeToday,
      value: stats?.active_users_today || 0,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="p-4 space-y-6">
        {/* Business Metrics */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.businessMetrics}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                    {stat.growth && (
                      <p className="text-xs text-green-600 font-semibold">{stat.growth}</p>
                    )}
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sustainability Metrics */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.sustainabilityMetrics}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sustainabilityCards.map((metric, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                    <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${metric.color} rounded-full flex items-center justify-center text-2xl`}>
                    {metric.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.userManagement}</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-sm font-semibold text-gray-700">{t.username}</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">{t.fullName}</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">{t.email}</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">{t.userType}</th>
                  <th className="pb-3 text-sm font-semibold text-gray-700">{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 text-sm text-gray-800">{user.username}</td>
                    <td className="py-3 text-sm text-gray-800">{user.full_name || 'N/A'}</td>
                    <td className="py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.user_type === 'admin' ? 'bg-red-100 text-red-800' :
                        user.user_type === 'farmer' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {t[user.user_type] || user.user_type}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? t.active : t.inactive}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;