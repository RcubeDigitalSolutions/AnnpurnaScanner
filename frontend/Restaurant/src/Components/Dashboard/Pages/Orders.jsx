import React, { useMemo, useState } from 'react';
import { CheckCircle2, Eye, Play, Search, XCircle } from 'lucide-react';
import OrderDetailsPanel from './OrderDetailsPanel';

const BOARD_COLUMNS = [
  {
    key: 'pending',
    title: 'Pending Order',
    headClass: 'bg-slate-300 text-white',
    bodyClass: 'bg-[#e5e1e1]',
    borderClass: 'border-[#e5dedb]'
  },
  {
    key: 'accepted',
    title: 'Accepted Orders',
    headClass: 'bg-emerald-400 text-white',
    bodyClass: 'bg-[#d9eee3]',
    borderClass: 'border-[#cfe9da]'
  },
  {
    key: 'ongoing',
    title: 'Ongoing Orders',
    headClass: 'bg-sky-500 text-white',
    bodyClass: 'bg-[#dce8f8]',
    borderClass: 'border-[#cfdef2]'
  },
  {
    key: 'cancelled',
    title: 'Cancelled Orders',
    headClass: 'bg-red-500 text-white',
    bodyClass: 'bg-[#f0dbe1]',
    borderClass: 'border-[#ebd1d8]'
  },
  {
    key: 'completed',
    title: 'Completed Orders',
    headClass: 'bg-amber-500 text-white',
    bodyClass: 'bg-[#f1e8d3]',
    borderClass: 'border-[#eadfc6]'
  }
];

const Orders = () => {
  const [orders, setOrders] = useState([
    { id: '#35345', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Chicken and Vegetable Bowl', qty: 2, status: 'pending' },
    { id: '#35346', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Beef and Broccoli Stir Fry', qty: 2, status: 'pending' },
    { id: '#35347', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Roasted Chicken with Cheese', qty: 2, status: 'pending' },
    { id: '#35348', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Stuffed Bell Peppers', qty: 2, status: 'pending' },
    { id: '#35349', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Shrimp Scampi with Linguine', qty: 2, status: 'accepted' },
    { id: '#35350', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Vegetable Lasagna', qty: 2, status: 'accepted' },
    { id: '#35351', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Baked Potato Bar', qty: 2, status: 'ongoing' },
    { id: '#35352', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Chicken Alfredo with Broccoli', qty: 2, status: 'ongoing' },
    { id: '#35353', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Chicken and Vegetable Pasta', qty: 2, status: 'ongoing' },
    { id: '#35354', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Veggie Burgers with Sweet Corn', qty: 2, status: 'cancelled' },
    { id: '#35355', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Baked Ziti with Meat Sauce', qty: 2, status: 'completed' },
    { id: '#35356', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Homemade Macaroni and Cheese', qty: 2, status: 'completed' },
    { id: '#35357', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Slow Cooker Beef and Veggies', qty: 2, status: 'completed' },
    { id: '#35358', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Honey Mustard Glazed Salmon', qty: 2, status: 'completed' },
    { id: '#35359', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Creamy Garlic Mushroom Pasta', qty: 2, status: 'completed' },
    { id: '#35360', customerName: 'Ankit Gojera', phone: '9923444555', dish: 'Creamy Tomato Soup', qty: 2, status: 'completed' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order)));
  };

  const getPrimaryAction = (status) => {
    if (status === 'pending') return { label: 'Accept', nextStatus: 'accepted', icon: CheckCircle2, className: 'text-emerald-600' };
    if (status === 'accepted') return { label: 'Start', nextStatus: 'ongoing', icon: Play, className: 'text-sky-600' };
    if (status === 'ongoing') return { label: 'Complete', nextStatus: 'completed', icon: CheckCircle2, className: 'text-amber-600' };
    return null;
  };

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const query = searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.phone.includes(query) ||
        order.dish.toLowerCase().includes(query)
    );
  }, [orders, searchTerm]);

  const groupedOrders = useMemo(() => {
    const grouped = BOARD_COLUMNS.reduce((acc, column) => {
      acc[column.key] = [];
      return acc;
    }, {});

    filteredOrders.forEach((order) => {
      grouped[order.status]?.push(order);
    });

    return grouped;
  }, [filteredOrders]);

  const cancelOrder = (orderId) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: 'cancelled' } : order)));
    setSelectedOrder((prev) => (prev?.id === orderId ? { ...prev, status: 'cancelled' } : prev));
  };

  const getThumbBg = (status) => {
    if (status === 'pending') return 'bg-orange-100';
    if (status === 'accepted') return 'bg-emerald-100';
    if (status === 'ongoing') return 'bg-blue-100';
    if (status === 'cancelled') return 'bg-rose-100';
    return 'bg-amber-100';
  };

  return (
    <div className="min-h-screen bg-[#ece8e7] px-3 py-6 md:px-6">
      <div className="mx-auto max-w-[1620px] rounded-3xl border border-[#e3dcda] bg-[#f5f1f0] shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-t-3xl border-b border-[#e5deda] bg-[#f8f3f2] px-4 py-3 md:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500">Order Board</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-slate-800 mt-1">
              My <span className="text-orange-500">Orders</span>
            </h1>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Restaurant live operations overview</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl border border-emerald-200 bg-white px-3 py-1.5 sm:block">
              <p className="text-[9px] font-black uppercase tracking-wide text-emerald-600">Service Status</p>
              <p className="text-[11px] font-bold text-slate-700">Running Smoothly</p>
            </div>
            <div className="relative w-full min-w-[180px] sm:w-[200px]">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search Orders"
                className="w-full rounded-xl border border-[#e6dfdc] bg-[#fffaf8] py-2 pl-8 pr-2 text-[11px] font-semibold text-slate-700 outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-5 md:px-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-sm font-black uppercase tracking-wide text-slate-500">Order Pipeline</h1>
            <div className="hidden items-center gap-2 rounded-xl border border-[#e6dfdc] bg-[#fffaf8] px-3 py-2 text-[11px] font-semibold text-slate-600 md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live Queue View
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-none border-x border-dashed border-[#d4c8c4] bg-[#f7f3f1]">
              <div className="grid w-full grid-cols-1 gap-0 xl:grid-cols-5">
              {BOARD_COLUMNS.map((column) => (
                <section
                  key={column.key}
                  className={`min-h-[620px] min-w-0 border-dashed border-[#d4c8c4] xl:border-r xl:last:border-r-0 ${column.bodyClass} px-1 py-3`}
                >
                  <div className={`mb-3 rounded-md px-2 py-2 text-center text-[10px] font-black uppercase tracking-wide shadow-sm ${column.headClass}`}>
                    {column.title}
                  </div>

                  <div className="mb-2 border-b border-[#d8cecb]" />

                  <div className="space-y-2">
                    {(groupedOrders[column.key] || []).map((order) => (
                      <article key={order.id} className="w-full rounded-lg border border-[#e2dad7] bg-[#fffdfc] px-2.5 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[9px] font-black tracking-wide text-slate-500">{order.id}</p>
                          <p className="truncate text-[9px] font-bold text-slate-500">{order.phone}</p>
                        </div>

                        <p className="mt-0.5 truncate text-[10px] font-extrabold text-slate-700">{order.customerName}</p>

                        <div className="mt-1.5 flex gap-2">
                          <div className={`h-10 w-10 shrink-0 rounded-md ${getThumbBg(order.status)} border border-slate-200`} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-black leading-4 text-slate-800">{order.dish}</p>
                            <p className="mt-0.5 text-[10px] font-bold text-slate-600">Qty: {order.qty}</p>
                          </div>
                        </div>

                        <div className={`mt-1.5 flex items-center ${column.key === 'pending' ? 'justify-between' : 'justify-end'}`}>
                          {column.key === 'pending' && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailsOpen(true);
                              }}
                              className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-500 hover:text-emerald-600"
                            >
                              <Eye size={11} />
                              Order Details
                            </button>
                          )}

                          {getPrimaryAction(order.status) ? (
                            <button
                              onClick={() => updateOrderStatus(order.id, getPrimaryAction(order.status).nextStatus)}
                              className={`inline-flex items-center gap-1 text-[10px] font-black ${getPrimaryAction(order.status).className}`}
                            >
                              {React.createElement(getPrimaryAction(order.status).icon, { size: 11 })}
                              {getPrimaryAction(order.status).label}
                            </button>
                          ) : order.status === 'pending' ? (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="inline-flex items-center gap-1 text-[10px] font-black text-rose-500 hover:text-rose-600"
                            >
                              <XCircle size={11} />
                              Cancel Order
                            </button>
                          ) : (
                            <span className="text-[10px] font-black text-slate-400">No Action</span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsPanel
          isOpen={isDetailsOpen}
          order={selectedOrder}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
};

export default Orders;