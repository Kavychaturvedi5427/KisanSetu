import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Activity, Database, TrendingUp } from 'lucide-react';

const Admin = () => {
  const { language, user } = useAuth();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 800);
    loadData();
    return () => clearTimeout(timer);
  }, []);

  const loadData = () => {
    const storedUsers = JSON.parse(localStorage.getItem('kisanSetuUsers') || '[]');
    const storedHistory = JSON.parse(localStorage.getItem('kisanSetuLoginHistory') || '[]');
    const storedStats = JSON.parse(localStorage.getItem('kisanSetuUserStats') || '{}');
    
    setUsers(storedUsers);
    setLoginHistory(storedHistory.slice(-10)); // Show last 10 logins
    setUserStats(storedStats);
  };

  const translations = {
    en: {
      title: 'Kisan Setu - Database Viewer',
      subtitle: 'Admin Dashboard & Analytics',
      backBtn: '← Back to Dashboard',
      totalUsers: 'Total Users',
      totalLogins: 'Total Logins',
      activeUsers: 'Active Users',
      avgSessions: 'Avg Sessions',
      userRegistrations: 'User Registrations',
      recentLogins: 'Recent Login Activity',
      userStats: 'User Statistics',
      username: 'Username',
      fullName: 'Full Name',
      userType: 'User Type',
      registrationDate: 'Registration Date',
      loginTime: 'Login Time',
      sessionId: 'Session ID',
      noData: 'No data available',
      refreshData: 'Refresh Data'
    },
    hi: {
      title: 'किसान सेतु - डेटाबेस व्यूअर',
      subtitle: 'एडमिन डैशबोर्ड और एनालिटिक्स',
      backBtn: '← डैशबोर्ड पर वापस',
      totalUsers: 'कुल उपयोगकर्ता',
      totalLogins: 'कुल लॉगिन',
      activeUsers: 'सक्रिय उपयोगकर्ता',
      avgSessions: 'औसत सत्र',
      userRegistrations: 'उपयोगकर्ता पंजीकरण',
      recentLogins: 'हाल की लॉगिन गतिविधि',
      userStats: 'उपयोगकर्ता आंकड़े',
      username: 'उपयोगकर्ता नाम',
      fullName: 'पूरा नाम',
      userType: 'उपयोगकर्ता प्रकार',
      registrationDate: 'पंजीकरण तिथि',
      loginTime: 'लॉगिन समय',
      sessionId: 'सत्र आईडी',
      noData: 'कोई डेटा उपलब्ध नहीं',
      refreshData: 'डेटा रीफ्रेश करें'
    }
  };

  const t = translations[language];

  const stats = {
    totalUsers: users.length,
    totalLogins: loginHistory.length,
    activeUsers: Object.keys(userStats).length,
    avgSessions: Object.keys(userStats).length > 0 
      ? Math.round(Object.values(userStats).reduce((sum, stat) => sum + stat.totalLogins, 0) / Object.keys(userStats).length)
      : 0
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
      <header className="bg-white shadow-lg border-b-3 border-green-600">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                {t.backBtn}
              </button>
              <div className="flex items-center gap-3">
                <img src="/kisansetu.png" alt="Kisan Setu Logo" className="w-10 h-10 rounded-full object-contain" />
                <div>
                  <h1 className="text-xl font-bold text-green-600">{t.title}</h1>
                  <p className="text-sm text-gray-600">{t.subtitle}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={loadData}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              {t.refreshData}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-5 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.totalUsers}</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-5 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.totalLogins}</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalLogins}</p>
              </div>
              <Activity className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-5 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.activeUsers}</p>
                <p className="text-3xl font-bold text-orange-600">{stats.activeUsers}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-5 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.avgSessions}</p>
                <p className="text-3xl font-bold text-purple-600">{stats.avgSessions}</p>
              </div>
              <Database className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Registrations */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-600 text-white p-4">
              <h2 className="text-xl font-bold">{t.userRegistrations}</h2>
            </div>
            <div className="p-4">
              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">{t.fullName}</th>
                        <th className="text-left py-2">{t.username}</th>
                        <th className="text-left py-2">{t.userType}</th>
                        <th className="text-left py-2">{t.registrationDate}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(-10).map((user, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2">{user.fullname}</td>
                          <td className="py-2">{user.username}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.usertype === 'farmer' ? 'bg-green-100 text-green-800' :
                              user.usertype === 'vendor' ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {user.usertype}
                            </span>
                          </td>
                          <td className="py-2">
                            {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">{t.noData}</p>
              )}
            </div>
          </div>

          {/* Recent Login Activity */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-bold">{t.recentLogins}</h2>
            </div>
            <div className="p-4">
              {loginHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">{t.username}</th>
                        <th className="text-left py-2">{t.loginTime}</th>
                        <th className="text-left py-2">{t.sessionId}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginHistory.map((login, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2">{login.username}</td>
                          <td className="py-2">
                            {new Date(login.loginTime).toLocaleString()}
                          </td>
                          <td className="py-2 font-mono text-xs">
                            {login.sessionId?.substring(0, 12)}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">{t.noData}</p>
              )}
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-orange-600 text-white p-4">
            <h2 className="text-xl font-bold">{t.userStats}</h2>
          </div>
          <div className="p-4">
            {Object.keys(userStats).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">{t.username}</th>
                      <th className="text-left py-2">{t.totalLogins}</th>
                      <th className="text-left py-2">First Login</th>
                      <th className="text-left py-2">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(userStats).map(([username, stats], index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-semibold">{username}</td>
                        <td className="py-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {stats.totalLogins}
                          </span>
                        </td>
                        <td className="py-2">
                          {new Date(stats.firstLogin).toLocaleDateString()}
                        </td>
                        <td className="py-2">
                          {new Date(stats.lastLogin).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">{t.noData}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;