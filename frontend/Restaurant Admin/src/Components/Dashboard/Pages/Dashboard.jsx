import React, { useState } from 'react';
import { 
  TrendingUp, Users, ShoppingCart, DollarSign, Clock, AlertCircle, 
  Calendar, Bell, Settings, Search, Star, Target, Eye, CheckCircle,
  ChefHat, Utensils, TrendingDown, Zap, LayoutGrid, List, Flame
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('Today');
  const [activeTab, setActiveTab] = useState('overview');
  const [revenueView, setRevenueView] = useState('hourly');

  const [stats] = useState({
    totalOrders: 1250,
    totalRevenue: 45800,
    activeOrders: 8,
    todayRevenue: 2400,
    occupiedTables: 12,
    totalTables: 20,
    avgOrderValue: 185,
    customerSatisfaction: 4.7,
    staffPresent: 18,
    totalStaff: 22,
  });

  const peakHoursData = [
    { hour: '11 AM', orders: 12, revenue: 2400 },
    { hour: '12 PM', orders: 38, revenue: 4200 },
    { hour: '1 PM', orders: 35, revenue: 3800 },
    { hour: '2 PM', orders: 28, revenue: 3100 },
    { hour: '6 PM', orders: 32, revenue: 4100 },
    { hour: '7 PM', orders: 45, revenue: 5200 },
    { hour: '8 PM', orders: 42, revenue: 4800 },
  ];

  const dailyData = [
    { day: 'Mon', orders: 145, revenue: 32500 },
    { day: 'Tue', orders: 158, revenue: 35800 },
    { day: 'Wed', orders: 142, revenue: 31200 },
    { day: 'Thu', orders: 168, revenue: 38900 },
    { day: 'Fri', orders: 182, revenue: 42100 },
    { day: 'Sat', orders: 205, revenue: 48600 },
    { day: 'Sun', orders: 195, revenue: 45800 },
  ];

  const staffData = [
    { name: 'Rajesh Kumar', role: 'Head Chef', status: 'Online', orders: 145, rating: 4.8 },
    { name: 'Priya Sharma', role: 'Server', status: 'Online', orders: 89, rating: 4.6 },
    { name: 'Amit Patel', role: 'Cashier', status: 'Online', orders: 234, rating: 4.5 },
    { name: 'Neha Singh', role: 'Server', status: 'Break', orders: 67, rating: 4.7 },
  ];

  const menuPerformance = [
    { name: 'Butter Chicken', sold: 45, revenue: 6750, rating: 4.9, status: 'Hot' },
    { name: 'Tikka Masala', sold: 38, revenue: 5700, rating: 4.8, status: 'Hot' },
    { name: 'Dal Makhani', sold: 32, revenue: 3200, rating: 4.6, status: 'Popular' },
    { name: 'Naan', sold: 89, revenue: 3560, rating: 4.7, status: 'Best Seller' },
    { name: 'Paneer Tikka', sold: 28, revenue: 5600, rating: 4.5, status: 'Popular' },
  ];

  const recentOrders = [
    { id: '#ORD-2024', table: 'T-05', items: 3, amount: 450, status: 'Completed', customer: 'Raj Gupta' },
    { id: '#ORD-2023', table: 'T-12', items: 2, amount: 320, status: 'In Progress', customer: 'Priya Mehta' },
    { id: '#ORD-2022', table: 'T-08', items: 4, amount: 680, status: 'Waiting', customer: 'Arjun Singh' },
    { id: '#ORD-2021', table: 'T-15', items: 2, amount: 290, status: 'Completed', customer: 'Anjali Verma' },
  ];

  const paymentData = [
    { method: 'Card', value: 1850 },
    { method: 'Cash', value: 1200 },
    { method: 'UPI', value: 450 },
  ];

  // Professional Color Palette: Deep Slate, Burnt Orange, and Amber
  const COLORS = ['#ea580c', '#f59e0b', '#1e293b']; 
  const PIE_COLORS = ['#ea580c', '#0f172a', '#6366f1'];

  const KPICard = ({ icon: Icon, label, value, change, unit = '' }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{unit}{value}</h3>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-xs font-bold ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              <span className="mr-1">{change >= 0 ? '▲' : '▼'}</span>
              {Math.abs(change)}% <span className="text-slate-400 font-normal ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className="bg-slate-50 group-hover:bg-orange-50 p-3 rounded-xl transition-colors">
          <Icon size={22} className="text-slate-700 group-hover:text-orange-600 transition-colors" />
        </div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const config = {
      'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'In Progress': 'bg-blue-50 text-blue-700 border-blue-100',
      'Waiting': 'bg-amber-50 text-amber-700 border-amber-100',
      'Online': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Break': 'bg-slate-100 text-slate-600 border-slate-200',
      'Hot': 'bg-orange-100 text-orange-700 border-orange-200',
      'Popular': 'bg-indigo-50 text-indigo-700 border-indigo-100',
      'Best Seller': 'bg-amber-100 text-amber-800 border-amber-200',
    }[status] || 'bg-slate-50 text-slate-600 border-slate-100';
    
    return (
      <span className={`${config} text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-md border`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Premium Navigation Bar
      <header className="sticky top-0 z-50 bg-slate-950 text-white shadow-2xl px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-orange-600 p-2 rounded-lg">
            <Utensils className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none uppercase">Bistro<span className="text-orange-500">Master</span></h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Enterprise Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-slate-900 rounded-full px-4 py-1.5 border border-slate-800">
            <Search size={14} className="text-slate-500" />
            <input type="text" placeholder="Quick Search..." className="bg-transparent ml-2 text-xs outline-none w-32 text-slate-300" />
          </div>

          <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
             <button className="relative p-2 text-slate-400 hover:text-orange-500 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-slate-950"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold leading-none">Admin Panel</p>
                <p className="text-[10px] text-emerald-400 font-bold">Kitchen Live</p>
              </div>
              <div className="w-9 h-9 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center font-bold text-orange-500">
                JD
              </div>
            </div>
          </div>
        </div>
      </header> */}

      <div className="p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Dashboard Headline */}
        <div className="mb-8">
          <div className="flex items-end gap-4 mb-2">
            <h1 className="text-5xl font-black text-slate-900  tracking-tighter">Dashboard</h1>
           
          </div>
          <p className="text-slate-500 font-bold text-sm">Real-time restaurant operations & analytics</p>
          <div className="mt-4 h-1 w-32 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"></div>
        </div>

        {/* Real-time Load Indicator */}
        {/* <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                <span className="text-xs font-black uppercase text-slate-500">Live Kitchen Load</span>
              </div>
              <div className="h-2 w-48 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="text-xs font-bold text-slate-700">65% Capacity</span>
           </div>
           <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1"><Flame size={14} className="text-orange-600"/> 12 Active Orders</span>
              <span className="flex items-center gap-1"><Clock size={14} className="text-blue-600"/> 18m Avg Prep</span>
           </div>
        </div> */}

        {/* Main KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
          <KPICard icon={ShoppingCart} label="Daily Orders" value={stats.totalOrders} change={12} />
          <KPICard icon={DollarSign} label="Gross Revenue" value={stats.todayRevenue} unit="₹" change={8} />
          <KPICard icon={Users} label="Total Customers" value="284" change={15} />
          <KPICard icon={Flame} label="Active Orders" value={stats.activeOrders} change={3} />
        </div>

        {/* Professional Tab System */}
        {/* <div className="flex items-center justify-between border-b border-slate-200">
          <div className="flex gap-8">
            {['overview', 'analytics', 'staff', 'menu'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 pb-3">
             <Calendar size={16} className="text-slate-400" />
             <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-xs font-bold bg-transparent outline-none text-slate-600"
             >
               <option>Today: Feb 21</option>
               <option>Last 7 Days</option>
               <option>This Month</option>
             </select>
          </div>
        </div> */}

        {/* CONTENT AREA */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Chart Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Table Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Live Order Stream</h2>
                  <button className="text-[10px] font-black text-orange-600 uppercase border-b-2 border-orange-600">Full Queue</button>
               </div>
               <table className="w-full">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Table</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                        <td className="py-4 px-6 text-xs font-bold text-slate-900">{order.id}</td>
                        <td className="py-4 px-6 text-xs font-bold text-slate-600">{order.customer}</td>
                        <td className="py-4 px-6">
                           <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">{order.table}</span>
                        </td>
                        <td className="py-4 px-6 text-xs font-black text-slate-900">₹{order.amount}</td>
                        <td className="py-4 px-6"><StatusBadge status={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Revenue Dynamics</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Intraday performance analysis</p>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl">
                  <button onClick={() => setRevenueView('hourly')} className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                    revenueView === 'hourly' 
                      ? 'bg-white shadow-sm text-orange-600' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}>Hourly</button>
                  <button onClick={() => setRevenueView('daily')} className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                    revenueView === 'daily' 
                      ? 'bg-white shadow-sm text-orange-600' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}>Daily</button>
                </div>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueView === 'hourly' ? peakHoursData : dailyData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      cursor={{ stroke: '#ea580c', strokeWidth: 2 }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: Insights & Staff */}
          <div className="space-y-8">
            {/* Top Selling Items */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 shadow-lg border border-emerald-200">
               <h2 className="text-sm font-black uppercase tracking-widest mb-8 text-emerald-900">Top Selling Items</h2>
               <div className="space-y-4">
                  {menuPerformance.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all group cursor-pointer">
                       <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                             <h4 className="text-xs font-black text-slate-900 uppercase">{item.name}</h4>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{item.status}</span>
                                <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1">
                                   <Star size={12} className="fill-amber-600 text-amber-600" /> {item.rating}
                                </span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-slate-900">{item.sold} sold</p>
                             <p className="text-[10px] font-bold text-emerald-600">₹{item.revenue}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Occupancy Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Floor Occupancy</h2>
                <div className="flex items-end gap-2 mb-2">
                   <span className="text-4xl font-black text-slate-900">60<span className="text-lg text-slate-400">%</span></span>
                   <span className="text-xs font-bold text-emerald-600 mb-2">Busy</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
                   <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 w-[60%] rounded-full shadow-[0_0_10px_rgba(234,88,12,0.3)]"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] font-black text-emerald-700 uppercase">Available</p>
                      <p className="text-xl font-black text-emerald-900">08</p>
                   </div>
                   <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100">
                      <p className="text-[10px] font-black text-orange-700 uppercase">Occupied</p>
                      <p className="text-xl font-black text-orange-900">12</p>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;