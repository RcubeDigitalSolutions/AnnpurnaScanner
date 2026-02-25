import React, { useMemo, useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [incomeView, setIncomeView] = useState('monthly');

  const kpiCards = [
    { label: "Today's Revenue", value: '$987', growth: '+22.1%' },
    { label: 'Total Orders', value: '$853', growth: '+17.1%' },
    { label: 'Active Orders', value: '36', growth: '-19%' },
  ];

  const incomeData = [
    { month: 'Jan', amount: 18000 },
    { month: 'Feb', amount: 22000 },
    { month: 'Mar', amount: 26000 },
    { month: 'Apr', amount: 30000 },
    { month: 'May', amount: 26000 },
    { month: 'Jun', amount: 39000 },
    { month: 'Jul', amount: 22000 },
    { month: 'Aug', amount: 30000 },
  ];

  const topCategories = [
    { name: 'Chicken Wings', share: '94%' },
    { name: 'Margherita Pizza', share: '82%' },
    { name: 'Beef Burger', share: '77%' },
    { name: 'French Fries', share: '33%' },
  ];

  const paymentSplit = [
    { name: 'Card', value: 70, color: '#ea580c' },
    { name: 'Online', value: 30, color: '#fdba74' },
  ];

  const orders = [
    { id: '01', tableNumber: '05', name: 'Beef Burger', time: '2.07 PM', total: '$97.96', status: 'Active' },
    { id: '02', tableNumber: '12', name: 'Caesar Salad', time: '12.44 PM', total: '$76.56', status: 'Completed' },
    { id: '03', tableNumber: '08', name: 'Margherita Pizza', time: '12.24 PM', total: '$98.87', status: 'Active' },
    { id: '04', tableNumber: '14', name: 'Grilled Salmon', time: '11.00 AM', total: '$87.38', status: 'Cancelled' },
    { id: '05', tableNumber: '03', name: 'Chicken Wings', time: '9.00 AM', total: '$97.56', status: 'Completed' },
    { id: '06', tableNumber: '11', name: 'French Fries', time: '8.00 AM', total: '$36.00', status: 'Completed' },
  ];

 

  const totalBill = useMemo(() => paymentSplit.reduce((sum, item) => sum + item.value, 0), [paymentSplit]);

  const statusClass = (status) => {
    if (status === 'Completed') {
      return 'bg-emerald-100 text-emerald-700';
    }
    if (status === 'Cancelled') {
      return 'bg-rose-100 text-rose-600';
    }
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="min-h-screen bg-[#ece8e7] p-5 md:p-6">
      <div className="max-w-375 mx-auto rounded-[28px] border border-[#e3dcda] bg-[#f5f1f0] shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-[#e5deda] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f8f3f2]">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Overview</h1>
            <p className="text-xs text-slate-500 mt-0.5">Restaurant Management Dashboard</p>
          </div>

          <div className="flex items-center gap-3 ">
           
            <div className="flex min-w-35 items-center gap-2 rounded-full border border-[#e6dfdc] bg-[#fdfbfa] px-2 py-1 ">
              <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold flex items-center justify-center">
                DK
              </div>
              <div className="pr-1">
                <p className="text-xs font-semibold text-slate-800 leading-4">Daniel Kahan</p>
                <p className="text-[11px] text-slate-500 leading-4">Admin</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 md:p-5">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpiCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-[#e6dfdc] bg-[#fdfbfa] p-4">
                  <p className="text-xs font-medium text-slate-500">{card.label}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <h2 className="text-3xl font-semibold text-slate-800 tracking-tight">{card.value}</h2>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        card.growth.startsWith('-') ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {card.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
              <div className="rounded-2xl border border-[#e6dfdc] bg-[#fdfbfa] p-4 lg:col-span-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Average Monthly Income</h3>
                    <p className="text-3xl font-semibold text-slate-800 mt-2">$935,577</p>
                    <p className="text-xs text-emerald-600 mt-1">↑ 76.09 as previous Month</p>
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
                    <BarChart data={incomeData}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip cursor={{ fill: '#fff7ed' }} />
                      <Bar dataKey="amount" fill="#fdba74" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

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

            <div className="rounded-2xl border border-[#e6dfdc] bg-[#fdfbfa] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#e6dfdc] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Recent Orders</h3>
                <div className="rounded-full border border-[#e6dfdc] bg-[#f6f1ef] px-2 py-1 text-xs text-slate-600 flex items-center gap-1">
                  Daily <ChevronDown size={12} />
                </div>
              </div>

              <div className="overflow-auto">
                <table className="w-full min-w-175">
                  <thead className="bg-[#f6f1ef] text-slate-500">
                    <tr>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold">ORDER ID</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold">TABLE No.</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold">ORDER NAME</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold">TIME</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold">TOTAL</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee7e4]">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#f8f3f2]">
                        <td className="px-4 py-3 text-sm text-slate-700">{order.id}</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
