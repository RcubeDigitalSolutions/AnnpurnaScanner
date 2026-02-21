import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Clock,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';

export default function Sidebar({ onLogout, sidebarOpen, setSidebarOpen }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  // Sync activeMenu with current route
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes('/admin/menu')) {
      setActiveMenu('menu');
    } else if (currentPath.includes('/admin/dashboard')) {
      setActiveMenu('dashboard');
    } else if (currentPath.includes('/admin/orders')) {
      setActiveMenu('orders');
    } else if (currentPath.includes('/admin/feedback')) {
      setActiveMenu('feedback');
    } else if (currentPath.includes('/admin/settings')) {
      setActiveMenu('settings');
    }
  }, [location.pathname]);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { id: 'menu', icon: UtensilsCrossed, label: 'Menu Items', href: '/admin/menu' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
    { id: 'feedback', icon: MessageCircle, label: 'Feedback', href: '/admin/feedback' },
    { id: 'settings', icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleNavigate = (href, id) => {
    setActiveMenu(id);
    if (href.startsWith('/')) {
      navigate(href);
    }
  };

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl transition-all duration-300 ease-in-out overflow-y-auto flex flex-col h-screen fixed left-0 top-0 z-10 border-r border-slate-800`}
    >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 sticky top-0 bg-slate-950 z-10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/30 transform hover:scale-110 transition-transform duration-200">
                <Home className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-black text-lg tracking-tight text-white">Annpurna</h1>
                  <p className="text-xs text-slate-400 font-semibold capitalize">Management</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-all duration-200 text-slate-400 hover:text-orange-500 transform hover:scale-110"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        {sidebarOpen && (
          <div className="px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-800/50 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg">
                AR
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Admin User</p>
                <p className="text-xs text-slate-400 truncate">admin@annpurna.com</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.href, item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group transform ${
                activeMenu === item.id
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 shadow-lg shadow-orange-600/30 scale-105 ' + (sidebarOpen ? 'pl-5' : '')
                  : 'hover:bg-slate-800/50'
              } ${
                sidebarOpen
                  ? 'hover:shadow-md hover:pl-5'
                  : 'hover:bg-slate-800/50 justify-center'
              }`}
            >
              <item.icon
                size={20}
                className={`flex-shrink-0 transition-all duration-200 transform group-hover:scale-110 ${
                  activeMenu === item.id
                    ? 'text-white scale-110'
                    : 'text-slate-400 group-hover:text-orange-500'
                }`}
              />
              {sidebarOpen && (
                <span
                  className={`text-sm font-semibold transition-all duration-200 ${
                    activeMenu === item.id
                      ? 'text-white'
                      : 'text-slate-300 group-hover:text-orange-400'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-600/20 ${
              !sidebarOpen && 'py-2'
            }`}
          >
            <LogOut size={18} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>
    );
}
