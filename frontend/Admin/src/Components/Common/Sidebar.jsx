import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { adminLogout } from '../../api/adminApi';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'members', label: 'Restaurants', icon: Users, path: '/restaurant' },
    { id: 'payments', label: 'Payment History', icon: CreditCard, path: '/payment-history' },
  ];

  const handleNavigate = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await adminLogout();
    } catch (err) {
      // ignore errors; still clear local state
    } finally {
      localStorage.removeItem('token');
      try {
        navigate('/login');
      } catch (e) {
        window.location.href = '/login';
      }
      setLoggingOut(false);
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col h-screen sticky top-0 border-r border-slate-800">
      <h2 className="text-xl font-bold text-orange-500 mb-10 flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded text-white flex items-center justify-center">A</div>
        Annpurna
      </h2>
      <nav className="space-y-4 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
              activeTab === item.id ? 'bg-orange-500 text-white' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <item.icon size={20} /> {item.label}
          </button>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 p-3 rounded-lg transition hover:bg-red-500/20 text-red-400 font-medium"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;