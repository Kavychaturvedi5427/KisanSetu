import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';
import { ArrowLeft, Users as UsersIcon, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const { user, language } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (user?.user_type !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterType]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Users loading error:', error);
      // Mock data
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
        },
        {
          id: '2',
          username: 'farmer1',
          email: 'farmer1@example.com',
          full_name: 'Ram Singh',
          user_type: 'farmer',
          phone: '9876543210',
          created_at: '2024-01-02T00:00:00Z',
          is_active: true
        },
        {
          id: '3',
          username: 'consumer1',
          email: 'consumer1@example.com',
          full_name: 'Priya Sharma',
          user_type: 'consumer',
          phone: '9876543211',
          created_at: '2024-01-03T00:00:00Z',
          is_active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by user type
    if (filterType !== 'all') {
      filtered = filtered.filter(user => user.user_type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const translations = {
    en: {
      title: 'All Users',
      search: 'Search users...',
      filter: 'Filter by type',
      all: 'All Users',
      farmers: 'Farmers',
      consumers: 'Consumers',
      vendors: 'Vendors',
      admins: 'Admins',
      username: 'Username',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      userType: 'Type',
      joinDate: 'Joined',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      noUsers: 'No users found',
      totalUsers: 'Total Users'
    },
    hi: {
      title: 'सभी उपयोगकर्ता',
      search: 'उपयोगकर्ता खोजें...',
      filter: 'प्रकार से फ़िल्टर करें',
      all: 'सभी उपयोगकर्ता',
      farmers: 'किसान',
      consumers: 'उपभोक्ता',
      vendors: 'विक्रेता',
      admins: 'एडमिन',
      username: 'उपयोगकर्ता नाम',
      fullName: 'पूरा नाम',
      email: 'ईमेल',
      phone: 'फोन',
      userType: 'प्रकार',
      joinDate: 'शामिल हुए',
      status: 'स्थिति',
      active: 'सक्रिय',
      inactive: 'निष्क्रिय',
      noUsers: 'कोई उपयोगकर्ता नहीं मिला',
      totalUsers: 'कुल उपयोगकर्ता'
    }
  };

  const t = translations[language];

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'farmer':
        return 'bg-green-100 text-green-800';
      case 'consumer':
        return 'bg-blue-100 text-blue-800';
      case 'vendor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeLabel = (userType) => {
    const labels = {
      admin: t.admins,
      farmer: t.farmers,
      consumer: t.consumers,
      vendor: t.vendors
    };
    return labels[userType] || userType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg p-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {filteredUsers.length} {t.totalUsers}
          </span>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
            >
              <option value="all">{t.all}</option>
              <option value="farmer">{t.farmers}</option>
              <option value="consumer">{t.consumers}</option>
              <option value="vendor">{t.vendors}</option>
              <option value="admin">{t.admins}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t.noUsers}</h2>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t.username}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t.fullName}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t.email}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t.phone}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t.userType}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t.joinDate}</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">{t.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{user.full_name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.phone || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUserTypeColor(user.user_type)}`}>
                          {getUserTypeLabel(user.user_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
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

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.username}</h3>
                      <p className="text-sm text-gray-600">{user.full_name || 'N/A'}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUserTypeColor(user.user_type)}`}>
                        {getUserTypeLabel(user.user_type)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? t.active : t.inactive}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>{t.email}:</strong> {user.email}</p>
                    {user.phone && <p><strong>{t.phone}:</strong> {user.phone}</p>}
                    {user.created_at && (
                      <p><strong>{t.joinDate}:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;