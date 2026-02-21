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
    } else if (currentPath.includes('/admin/settings')) {
      setActiveMenu('settings');
    } else if (currentPath.includes('/orders')) {
      setActiveMenu('orders');
    } else if (currentPath.includes('/customers')) {
      setActiveMenu('customers');
    } else if (currentPath.includes('/reservations')) {
      setActiveMenu('reservations');
    } else if (currentPath.includes('/analytics')) {
      setActiveMenu('analytics');
    }
  }, [location.pathname]);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { id: 'menu', icon: UtensilsCrossed, label: 'Menu Items', href: '/admin/menu' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders', href: '#orders' },
    { id: 'customers', icon: Users, label: 'Customers', href: '#customers' },
    { id: 'reservations', icon: Clock, label: 'Reservations', href: '#reservations' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics', href: '#analytics' },
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
      } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transition-all duration-300 ease-in-out overflow-y-auto flex flex-col h-screen fixed left-0 top-0 z-10`}
    >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-bold text-lg font-playfair">Annpurna</h1>
                  <p className="text-xs text-slate-400">Restaurant</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-slate-700 hover:shadow-lg rounded-lg transition-all duration-200 text-slate-300 hover:text-white transform hover:scale-110"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        {sidebarOpen && (
          <div className="px-6 py-4 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                AR
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Admin User</p>
                <p className="text-xs text-slate-400 truncate">admin@annpurna.com</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.href, item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group transform ${
                activeMenu === item.id
                  ? 'bg-slate-700 shadow-md scale-105 ' + (sidebarOpen ? 'pl-5' : '')
                  : 'hover:scale-105'
              } ${
                sidebarOpen
                  ? 'hover:bg-slate-700 hover:shadow-md hover:pl-5'
                  : 'hover:bg-slate-700 justify-center hover:shadow-md'
              }`}
            >
              <item.icon
                size={20}
                className={`flex-shrink-0 transition-all duration-200 transform group-hover:scale-110 ${
                  activeMenu === item.id
                    ? 'text-orange-400 scale-110'
                    : 'text-slate-400 group-hover:text-orange-400'
                }`}
              />
              {sidebarOpen && (
                <span
                  className={`text-sm font-medium transition-all duration-200 ${
                    activeMenu === item.id
                      ? 'text-orange-400'
                      : 'group-hover:text-orange-400'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Stats - Only show when sidebar is open */}
        {/* {sidebarOpen && (
          <div className="px-6 py-4 bg-slate-800 border-t border-slate-700 space-y-2">
            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Today's Orders</p>
              <p className="text-xl font-bold text-orange-400">24</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Revenue</p>
              <p className="text-xl font-bold text-green-400">$2,450</p>
            </div>
          </div>
        )} */}

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all duration-200 transform hover:scale-105 shadow-lg ${
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
