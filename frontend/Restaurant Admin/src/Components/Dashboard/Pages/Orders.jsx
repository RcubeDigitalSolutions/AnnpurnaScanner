import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Clock, Users, DollarSign, ChevronDown, Eye, Trash2, CheckCircle, AlertCircle, LayoutList } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([
    // Today's Orders (Feb 22, 2026)
    { id: 'ORD-001', tableNumber: '5', customerName: 'John Doe', items: 3, totalAmount: 450, status: 'completed', orderTime: '2026-02-22 12:30', completedTime: '2026-02-22 12:45', specialRequests: 'No onions' },
    { id: 'ORD-002', tableNumber: '8', customerName: 'Sarah Smith', items: 5, totalAmount: 890, status: 'pending', orderTime: '2026-02-22 13:15', completedTime: null, specialRequests: 'Extra spicy' },
    { id: 'ORD-003', tableNumber: '12', customerName: 'Michael Brown', items: 2, totalAmount: 320, status: 'preparing', orderTime: '2026-02-22 13:45', completedTime: null, specialRequests: 'Vegan' },
    { id: 'ORD-004', tableNumber: '3', customerName: 'Emma Wilson', items: 4, totalAmount: 650, status: 'ready', orderTime: '2026-02-22 14:00', completedTime: null, specialRequests: 'Gluten-free' },
    { id: 'ORD-005', tableNumber: '15', customerName: 'Robert Johnson', items: 6, totalAmount: 1200, status: 'pending', orderTime: '2026-02-22 14:30', completedTime: null, specialRequests: 'Birthday celebration' },
    { id: 'ORD-006', tableNumber: '2', customerName: 'Priya Sharma', items: 3, totalAmount: 580, status: 'completed', orderTime: '2026-02-22 15:00', completedTime: '2026-02-22 15:20', specialRequests: 'Less salt' },
    { id: 'ORD-007', tableNumber: '7', customerName: 'Rajesh Kumar', items: 4, totalAmount: 720, status: 'completed', orderTime: '2026-02-22 15:45', completedTime: '2026-02-22 16:10', specialRequests: 'Extra butter' },
    { id: 'ORD-008', tableNumber: '4', customerName: 'Anita Patel', items: 2, totalAmount: 380, status: 'completed', orderTime: '2026-02-22 11:00', completedTime: '2026-02-22 11:25', specialRequests: 'No garlic' },
    { id: 'ORD-009', tableNumber: '9', customerName: 'Vikram Singh', items: 5, totalAmount: 950, status: 'completed', orderTime: '2026-02-22 16:30', completedTime: '2026-02-22 17:05', specialRequests: 'Extra cheese' },
    
    // Last 7 Days Orders (Before Today)
    { id: 'ORD-010', tableNumber: '6', customerName: 'Neha Verma', items: 3, totalAmount: 520, status: 'completed', orderTime: '2026-02-21 13:20', completedTime: '2026-02-21 13:45', specialRequests: 'Mild spice' },
    { id: 'ORD-011', tableNumber: '11', customerName: 'Arjun Das', items: 4, totalAmount: 680, status: 'completed', orderTime: '2026-02-21 14:00', completedTime: '2026-02-21 14:25', specialRequests: 'No chillies' },
    { id: 'ORD-012', tableNumber: '14', customerName: 'Meera Gupta', items: 2, totalAmount: 420, status: 'completed', orderTime: '2026-02-20 11:45', completedTime: '2026-02-20 12:10', specialRequests: 'Fresh mint' },
    { id: 'ORD-013', tableNumber: '1', customerName: 'Suresh Nair', items: 3, totalAmount: 550, status: 'completed', orderTime: '2026-02-20 15:30', completedTime: '2026-02-20 15:55', specialRequests: 'Extra lemon' },
    { id: 'ORD-014', tableNumber: '10', customerName: 'Divya Khanna', items: 5, totalAmount: 1050, status: 'completed', orderTime: '2026-02-19 12:30', completedTime: '2026-02-19 13:00', specialRequests: 'Premium cuts' },
    { id: 'ORD-015', tableNumber: '13', customerName: 'Arun Kumar', items: 2, totalAmount: 350, status: 'completed', orderTime: '2026-02-19 14:45', completedTime: '2026-02-19 15:10', specialRequests: 'Quick service' },
    { id: 'ORD-016', tableNumber: '2', customerName: 'Pooja Mishra', items: 4, totalAmount: 790, status: 'completed', orderTime: '2026-02-18 13:00', completedTime: '2026-02-18 13:35', specialRequests: 'Less oil' },
    { id: 'ORD-017', tableNumber: '5', customerName: 'Naresh Singh', items: 3, totalAmount: 620, status: 'completed', orderTime: '2026-02-18 15:20', completedTime: '2026-02-18 15:45', specialRequests: 'Fresh ingredients' },
    { id: 'ORD-018', tableNumber: '8', customerName: 'Kavya Reddy', items: 2, totalAmount: 380, status: 'completed', orderTime: '2026-02-17 12:00', completedTime: '2026-02-17 12:20', specialRequests: 'No dairy' },
    
    // This Month Orders (Earlier dates in February)
    { id: 'ORD-019', tableNumber: '8', customerName: 'Vivek Sharma', items: 2, totalAmount: 380, status: 'completed', orderTime: '2026-02-10 12:00', completedTime: '2026-02-10 12:20', specialRequests: 'No dairy' },
    { id: 'ORD-020', tableNumber: '3', customerName: 'Ritika Joshi', items: 4, totalAmount: 780, status: 'completed', orderTime: '2026-02-10 14:30', completedTime: '2026-02-10 15:00', specialRequests: 'Party order' },
    { id: 'ORD-020', tableNumber: '12', customerName: 'Amit Sharma', items: 3, totalAmount: 540, status: 'completed', orderTime: '2026-02-05 11:30', completedTime: '2026-02-05 12:00', specialRequests: 'Traditional recipe' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    
    // Date filter logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    result = result.filter(order => {
      const orderDate = new Date(order.orderTime);
      orderDate.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'today') return orderDate.getTime() === today.getTime();
      if (dateFilter === 'last7') return orderDate >= sevenDaysAgo && orderDate <= today;
      if (dateFilter === 'this-month') return orderDate >= firstDayOfMonth && orderDate <= today;
      return true;
    });

    if (statusFilter !== 'all') result = result.filter(order => order.status === statusFilter);
    if (searchTerm) {
      result = result.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tableNumber.includes(searchTerm)
      );
    }
    // Sort by newest first
    return result.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const getStatusStyle = (status) => {
    const config = {
      pending: { border: 'border-l-orange-500', text: 'text-orange-600', bg: 'bg-orange-50', label: 'Pending' },
      preparing: { border: 'border-l-blue-500', text: 'text-blue-600', bg: 'bg-blue-50', label: 'Preparing' },
      ready: { border: 'border-l-purple-500', text: 'text-purple-600', bg: 'bg-purple-50', label: 'Ready' },
      completed: { border: 'border-l-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Completed' }
    };
    return config[status] || config.pending;
  };

  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    preparing: filteredOrders.filter(o => o.status === 'preparing').length,
    completed: filteredOrders.filter(o => o.status === 'completed').length,
    revenue: filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <div className="p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Orders Headline */}
        <div className="mb-8">
          <div className="flex items-end gap-4 mb-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Orders</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-600 uppercase">System Live</span>
            </div>
          </div>
          <div className="mt-4 h-1 w-38 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Completed Orders', value: stats.completed, color: 'text-emerald-600', detail: 'Successfully Completed' },
            { label: 'Active Prep', value: stats.preparing, color: 'text-blue-600', detail: 'In Kitchen' },
            { label: 'Daily Volume', value: stats.total, color: 'text-slate-900', detail: 'Orders Today' },
            { label: 'Revenue', value: `₹${stats.revenue}`, color: 'text-emerald-600', detail: 'Live Balance' },
          ].map((s, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
              <h3 className={`text-3xl font-black ${s.color}`}>{s.value}</h3>
              <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-[32px] border border-slate-200 p-4 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, Guest, or Table Number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium" 
            />
          </div>
          <div className="flex items-center gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
            </select>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
              <option value="today">Today</option>
              <option value="last7">Last 7 Days</option>
              <option value="this-month">This Month</option>
            </select>
            
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order ID</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer Name</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Bill Total</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Status</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const s = getStatusStyle(order.status);
                  return (
                    <tr key={order.id} className={`hover:bg-slate-50/80 transition-all border-l-4 ${s.border} group cursor-pointer`}>
                      <td className="px-8 py-6">
                        <span className="font-black text-slate-900 text-sm tracking-tighter">{order.id}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-slate-600">{order.customerName}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Table {order.tableNumber}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-slate-900">₹{order.totalAmount}</span>
                        <p className="text-[10px] font-bold text-slate-400">{order.items} Items</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`${s.bg} ${s.text} text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-current opacity-80`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-500 italic">
                        {order.orderTime.split(' ')[1]}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="p-2.5 bg-slate-50 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => setDeleteConfirmOrder(order)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <LayoutList size={64} className="mb-4" />
                      <p className="text-xl font-black uppercase tracking-[0.3em]">No Match Records</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Premium Order Detail Modal */}
    {showModal && selectedOrder && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6">
    <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
      
      {/* Premium Header */}
      <div className="bg-slate-900 p-8 flex justify-between items-center border-b-4 border-orange-500">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">Order Reference</span>
          <h2 className="text-3xl font-black tracking-tight text-white mt-1">{selectedOrder.id}</h2>
        </div>
        <button 
          onClick={() => setShowModal(false)} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all text-xl font-light"
        >
          ✕
        </button>
      </div>

      {/* Main Content Body */}
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Guest Profile</p>
            <p className="text-xl font-black text-slate-900">{selectedOrder.customerName}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Location</p>
            <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-black text-sm border border-orange-200">
              Table {selectedOrder.tableNumber}
            </span>
          </div>
        </div>

        {/* Highlighted Kitchen Note */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-5 rounded-r-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-orange-800/60 mb-2">Kitchen Instructions</p>
          <p className="text-sm font-semibold text-orange-950 italic">
            "{selectedOrder.specialRequests || 'Standard preparation'}"
          </p>
        </div>

        {/* Modern Segmented Status Buttons */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Order Status Progression</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['pending', 'preparing', 'ready', 'completed'].map((status) => {
              const isActive = selectedOrder.status === status;
              return (
                <button
                  key={status}
                  onClick={() => {
                    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status } : o));
                    setSelectedOrder({ ...selectedOrder, status });
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900 ring-offset-2' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clean Footer */}
      <div className="bg-white px-8 py-6 flex justify-between items-center border-t border-slate-200">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Amount</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter mt-1">₹{selectedOrder.totalAmount}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(false)} 
            className="px-6 py-3 bg-slate-100 border border-slate-300 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Close
          </button>
          <button 
            onClick={() => alert('Order updated successfully!')} 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <CheckCircle size={16} />
            Update Order
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Delete Confirmation Modal */}
        {deleteConfirmOrder && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-[101] p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full border border-slate-200 animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="bg-rose-50 border-b-2 border-rose-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <Trash2 size={24} className="text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Delete Order?</h3>
                    <p className="text-xs font-bold text-slate-500 mt-1">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Order Details</p>
                  <div className="space-y-2">
                    <p className="text-sm font-black text-slate-900">{deleteConfirmOrder.id}</p>
                    <p className="text-sm font-bold text-slate-600">{deleteConfirmOrder.customerName} • Table {deleteConfirmOrder.tableNumber}</p>
                    <p className="text-sm font-black text-emerald-600">₹{deleteConfirmOrder.totalAmount}</p>
                  </div>
                </div> */}
                <p className="text-xs font-bold text-slate-500 text-center italic">Are you sure you want to permanently delete this order?</p>
              </div>

              {/* Footer Actions */}
              <div className="bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
                <button
                  onClick={() => setDeleteConfirmOrder(null)}
                  className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setOrders(orders.filter(o => o.id !== deleteConfirmOrder.id));
                    setDeleteConfirmOrder(null);
                    if (selectedOrder?.id === deleteConfirmOrder.id) {
                      setShowModal(false);
                      setSelectedOrder(null);
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg hover:shadow-rose-600/30"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;