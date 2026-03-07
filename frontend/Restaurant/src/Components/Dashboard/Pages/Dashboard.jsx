import React, { useMemo, useState, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboard } from '../../../api/restaurantApi';

const Dashboard = () => {
  const [incomeView, setIncomeView] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kpiCards, setKpiCards] = useState([
    { label: "Today's Revenue", value: '₹0', growth: '+0%' },
    { label: 'Total Orders', value: '0', growth: '+0%' },
    { label: 'Active Orders', value: '0', growth: '+0%' },
  ]);

  const revenueOrders = useMemo(() => {
    return orders.filter((o) => {
      const normalized = String(o.status || '').toLowerCase();
      return normalized === 'completed' || normalized === 'paid';
    });
  }, [orders]);

  // DAY WISE DATA (monthly view)
  const dailyData = useMemo(() => {
    const days = {};

    revenueOrders.forEach((o) => {
      if (!o.createdAt || !o.totalPrice) return;

      const date = new Date(o.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
      ).padStart(2, '0')}`;

      days[key] = (days[key] || 0) + o.totalPrice;
    });

    return Object.entries(days)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([dateKey, amount]) => ({
        month: new Date(dateKey).toLocaleDateString([], { day: '2-digit', month: 'short' }),
        amount,
      }));
  }, [revenueOrders]);

  // MONTH WISE DATA (yearly view)
  const monthlyData = useMemo(() => {
    const months = {};

    revenueOrders.forEach((o) => {
      if (!o.createdAt || !o.totalPrice) return;

      const date = new Date(o.createdAt);
      const key = date.toLocaleString('default', { month: 'short' });

      months[key] = (months[key] || 0) + o.totalPrice;
    });

    const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    return monthOrder
      .filter(m => months[m] !== undefined)
      .map((m) => ({
        month: m,
        amount: months[m]
      }));
  }, [revenueOrders]);

  const chartData = incomeView === 'monthly' ? dailyData : monthlyData;

  const topCategories = useMemo(() => {
    const counts = {};
    let totalItems = 0;

    orders.forEach((o) => {
      o.items?.forEach((i) => {
        const qty = i.quantity || 1;
        counts[i.name] = (counts[i.name] || 0) + qty;
        totalItems += qty;
      });
    });

    return Object.entries(counts)
      .sort((a,b) => b[1] - a[1])
      .slice(0,4)
      .map(([name, cnt]) => ({
        name,
        share: totalItems ? `${((cnt/totalItems)*100).toFixed(0)}%` : '0%',
      }));
  }, [orders]);

  const paymentSplit = [
    { name: 'Card', value: 70, color: '#ea580c' },
    { name: 'Online', value: 30, color: '#fdba74' },
  ];

  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return revenueOrders.reduce((sum, o) => {
      if (!o.createdAt || !o.totalPrice) return sum;
      const date = new Date(o.createdAt);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        return sum + o.totalPrice;
      }
      return sum;
    }, 0);
  }, [revenueOrders]);

  const displayOrders = useMemo(() => {
    const toLocalDateString = (value) => {
      const date = new Date(value);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    return orders
      .filter((o) => o.createdAt && toLocalDateString(o.createdAt) === selectedDate)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((o) => {
      const date = new Date(o.createdAt);
      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const name = o.items?.map(i => i.name).join(', ') || '';
      const total = `₹${(o.totalPrice || 0).toFixed(2)}`;
      const status = o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : '';

      return {
        id: o._id,
        orderNumber: o.orderNumber,
        tableNumber: o.tableNumber?.toString().padStart(2,'0') || '',
        name,
        time,
        total,
        status,
      };
    });
  }, [orders, selectedDate]);

  const totalBill = useMemo(() => paymentSplit.reduce((sum, item) => sum + item.value, 0), [paymentSplit]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await getDashboard();

        const {
          orders: data = [],
          revenueToday,
          totalOrders,
          activeOrders,
        } = res.data || {};

        setOrders(data);

        setKpiCards([
          { label: "Today's Revenue", value: `₹${(revenueToday||0).toFixed(2)}`, growth: '+0%' },
          { label: 'Total Orders', value: `${totalOrders||0}`, growth: '+0%' },
          { label: 'Active Orders', value: `${activeOrders||0}`, growth: '+0%' },
        ]);

      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statusClass = (status) => {
    if (status === 'Completed') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Cancelled') return 'bg-rose-100 text-rose-600';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="min-h-screen bg-[#ece8e7] p-5 md:p-6">
      <div className="max-w-375 mx-auto rounded-[28px] border border-[#e3dcda] bg-[#f5f1f0] shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden">

        {/* HEADER */}
        <div className="p-4 md:p-5 border-b border-[#e5deda] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f8f3f2]">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Overview</h1>
            <p className="text-xs text-slate-500 mt-0.5">Restaurant Management Dashboard</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 md:p-5">

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiCards.map((card) => (
              <div key={card.label} className="rounded-2xl border border-[#e6dfdc] bg-[#fdfbfa] p-4">
                <p className="text-xs font-medium text-slate-500">{card.label}</p>

                <div className="mt-3 flex items-center justify-between">
                  <h2 className="text-3xl font-semibold text-slate-800">{card.value}</h2>

                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    {card.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* GRAPH + CATEGORIES */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">

            {/* GRAPH */}
            <div className="rounded-2xl border border-[#e6dfdc] bg-[#fdfbfa] p-4 lg:col-span-4">

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Monthly Revenue</h3>
                  <p className="text-3xl font-semibold text-slate-800 mt-2">
                    ₹{monthlyRevenue.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-full bg-[#efe9e7] p-1 flex items-center gap-1">
                  <button
                    className={`px-3 py-1 text-xs rounded-full ${
                      incomeView === 'monthly' ? 'bg-orange-500 text-white' : 'text-slate-500'
                    }`}
                    onClick={() => setIncomeView('monthly')}
                  >
                    Monthly
                  </button>

                  <button
                    className={`px-3 py-1 text-xs rounded-full ${
                      incomeView === 'yearly' ? 'bg-orange-500 text-white' : 'text-slate-500'
                    }`}
                    onClick={() => setIncomeView('yearly')}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#fdba74" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* TOP CATEGORIES */}
            <div className="rounded-2xl border border-[#e6dfdc] bg-[#fdfbfa] p-4 lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Top Categories</h3>

              <div className="space-y-3">
                {topCategories.map((item) => (
                  <div key={item.name} className="rounded-xl border border-[#ebe4e1] bg-[#f8f4f2] px-3 py-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">{item.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{item.share}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RECENT ORDERS */}
          <div className="rounded-2xl border border-[#e6dfdc] bg-[#fdfbfa] overflow-hidden">

            <div className="px-4 py-3 border-b border-[#e6dfdc] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Recent Orders</h3>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-slate-500">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-full border border-[#e6dfdc] bg-[#f6f1ef] px-3 py-1 text-xs text-slate-700 outline-none"
                />
              </div>
            </div>

            <div className="overflow-auto">
              <table className="w-full min-w-175">
                <thead className="bg-[#f6f1ef] text-slate-500">
                  <tr>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold">ORDER NO</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold">TABLE No.</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold">ORDER NAME</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold">TIME</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold">TOTAL</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold">STATUS</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee7e4]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : displayOrders.length > 0 ? (
                    displayOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#f8f3f2]">
                        <td className="px-4 py-3 text-sm text-slate-700">{order.orderNumber || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm font-black text-orange-600">{order.tableNumber}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">{order.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{order.time}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{order.total}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                        No orders available
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;