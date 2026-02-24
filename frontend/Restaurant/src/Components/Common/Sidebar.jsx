import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  MessageSquare,
  Users,
  Settings,
  CircleHelp,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar({ onLogout, sidebarOpen, setSidebarOpen }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath.includes('/admin/orders')) {
      setActiveMenu('orders');
    } else if (currentPath.includes('/admin/menu')) {
      setActiveMenu('menu');
    } else if (currentPath.includes('/admin/feedback')) {
      setActiveMenu('feedback');
    } else if (currentPath.includes('/admin/floorplan')) {
      setActiveMenu('floorplan');
    } else if (currentPath.includes('/admin/settings')) {
      setActiveMenu('settings');
    } else {
      setActiveMenu('dashboard');
    }
  }, [location.pathname]);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { id: 'orders', icon: ClipboardList, label: 'Order', href: '/admin/orders' },
    { id: 'menu', icon: UtensilsCrossed, label: 'Menu', href: '/admin/menu' },
    // { id: 'analytics', icon: BarChart3, label: 'Analytics', href: '/admin/dashboard' },
    // { id: 'feedback', icon: MessageSquare, label: 'Feedback', href: '/admin/feedback' },
    { id: 'floorplan', icon: Users, label: 'Floor Plan', href: '/admin/floorplan' },

  ];

  const footerItems = [
    { id: 'settings', icon: Settings, label: 'Settings', href: '/admin/settings' },
    { id: 'support', icon: CircleHelp, label: 'Help & Support', href: '/admin/settings' },
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
        sidebarOpen ? 'w-60' : 'w-20'
      } bg-[#f5f1f0] text-slate-800 shadow-sm transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden flex flex-col h-screen fixed left-0 top-0 z-10 border-r border-[#e5deda]`}
    >
      <div className="p-5 border-b border-[#e5deda] sticky top-0 bg-[#f5f1f0] z-10">
        <div className={`relative flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          <div className={`flex items-center gap-3 min-w-0 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black">
              R
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg tracking-tight text-slate-800">Restroq</h1>
                <p className="text-[11px] text-slate-500">Restaurant Panel</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 hover:bg-[#ece5e2] rounded-lg transition-all duration-200 text-slate-500 hover:text-orange-500 ${
              !sidebarOpen ? 'absolute right-0 top-1/2 -translate-y-1/2' : ''
            }`}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.href, item.id)}
            className={`flex items-center rounded-xl transition-all duration-200 ${
              activeMenu === item.id
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'hover:bg-[#ede7e4] text-slate-600'
            } ${
              sidebarOpen ? 'w-full gap-3 px-3 py-2.5' : 'w-11 h-11 mx-auto justify-center p-0'
            }`}
          >
            <item.icon size={18} className={activeMenu === item.id ? 'text-orange-600' : 'text-slate-500'} />
            {sidebarOpen && (
              <span className={`text-sm font-medium ${activeMenu === item.id ? 'text-orange-700' : 'text-slate-700'}`}>
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 pb-3 space-y-1 border-t border-[#e5deda] pt-3">
        {footerItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.href, item.id)}
            className={`flex items-center rounded-xl transition-all duration-200 ${
              activeMenu === item.id
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'hover:bg-[#ede7e4] text-slate-600'
            } ${
              sidebarOpen ? 'w-full gap-3 px-3 py-2.5' : 'w-11 h-11 mx-auto justify-center p-0'
            }`}
          >
            <item.icon size={18} className={activeMenu === item.id ? 'text-orange-600' : 'text-slate-500'} />
            {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-[#e5deda] bg-[#f7f3f2]">
        <button
          onClick={handleLogout}
          className={`flex items-center justify-center gap-2 rounded-xl border border-slate-300 hover:border-red-200 hover:bg-red-50 text-slate-700 hover:text-red-600 font-semibold transition-all duration-200 ${
            sidebarOpen ? 'w-full px-4 py-3' : 'w-11 h-11 mx-auto p-0'
          }`}
        >
          <LogOut size={18} />
          {sidebarOpen && 'Logout'}
        </button>
      </div>
    </aside>
  );
}
