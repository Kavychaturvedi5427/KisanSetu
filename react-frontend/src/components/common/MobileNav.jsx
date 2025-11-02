import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Leaf, Cloud, Store, Users, ShoppingCart } from 'lucide-react';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, language } = useAuth();

  const navItems = [
    {
      icon: Home,
      label: language === 'hi' ? 'होम' : 'Home',
      path: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    {
      icon: Leaf,
      label: language === 'hi' ? 'फसल' : 'Crop',
      path: '/crop-health',
      active: location.pathname === '/crop-health'
    },
    {
      icon: Users,
      label: user?.user_type === 'farmer' 
        ? (language === 'hi' ? 'ग्राहक' : 'Buyers') 
        : (language === 'hi' ? 'किसान' : 'Farmers'),
      path: '/nearby',
      active: location.pathname === '/nearby'
    },
    {
      icon: Store,
      label: language === 'hi' ? 'बाजार' : 'Market',
      path: '/marketplace',
      active: location.pathname === '/marketplace'
    },
    {
      icon: ShoppingCart,
      label: language === 'hi' ? 'ऑर्डर' : 'Orders',
      path: '/orders',
      active: location.pathname === '/orders'
    }
  ];

  return (
    <div className="mobile-nav safe-area-bottom">
      <div className="flex justify-around items-center">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`mobile-nav-item ${item.active ? 'active' : ''} flex-1 max-w-[80px]`}
          >
            <item.icon className={`w-5 h-5 mb-1 ${item.active ? 'text-green-600' : 'text-gray-500'}`} />
            <span className={`text-xs ${item.active ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;