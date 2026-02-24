import React from 'react';
import { CheckCircle2, CircleOff, Play, X, Phone, User, UtensilsCrossed, Hash } from 'lucide-react';

const STATUS_LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  ongoing: 'Ongoing',
  cancelled: 'Cancelled',
  completed: 'Completed'
};

const STATUS_BADGE_CLASS = {
  pending: 'bg-orange-100 text-orange-700 border-orange-200',
  accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ongoing: 'bg-sky-100 text-sky-700 border-sky-200',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
  completed: 'bg-amber-100 text-amber-700 border-amber-200'
};

const getStatusActions = (status) => {
  if (status === 'pending') {
    return [
      { label: 'Accept Order', nextStatus: 'accepted', icon: CheckCircle2, className: 'bg-emerald-500 hover:bg-emerald-600' },
      { label: 'Cancel Order', nextStatus: 'cancelled', icon: CircleOff, className: 'bg-rose-500 hover:bg-rose-600' }
    ];
  }
  if (status === 'accepted') {
    return [{ label: 'Start Cooking', nextStatus: 'ongoing', icon: Play, className: 'bg-sky-500 hover:bg-sky-600' }];
  }
  if (status === 'ongoing') {
    return [{ label: 'Mark Completed', nextStatus: 'completed', icon: CheckCircle2, className: 'bg-amber-500 hover:bg-amber-600' }];
  }
  return [];
};

const OrderDetailsPanel = ({ isOpen, order, onClose, onUpdateStatus }) => {
  if (!isOpen || !order) return null;

  const actions = getStatusActions(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl border border-[#e3dcda] bg-[#fcfaf9] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-[#e8dfdc] bg-linear-to-r from-[#fff5f0] to-[#f8f1ed] px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hash size={16} className="text-orange-600" />
              <h2 className="text-xl font-black text-slate-900">{order.id}</h2>
              <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase ${STATUS_BADGE_CLASS[order.status]}`}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500">Order Details & Management</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 hover:bg-slate-200 p-2 text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
            {/* Order Details Card */}
            <div className="rounded-xl border border-[#e8dfdc] bg-white p-5 space-y-4">
              <p className="text-[12px] font-black uppercase tracking-wide text-slate-600 mb-4">Order Information</p>

              {/* Customer Info */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <User size={16} className="text-orange-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-500">Customer Name</p>
                    <p className="text-[13px] font-black text-slate-900">{order.customerName}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone size={16} className="text-sky-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-500">Phone Number</p>
                    <p className="text-[13px] font-black text-slate-900">{order.phone}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <UtensilsCrossed size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-500">Dish Ordered</p>
                    <p className="text-[13px] font-black text-slate-900">{order.dish}</p>
                  </div>
                </div>

                {/* <div className="flex gap-3">
                  <UtensilsCrossed size={16} className="text-purple-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-500">Category</p>
                    <p className="text-[13px] font-black text-slate-900">{order.category || 'N/A'}</p>
                  </div>
                </div> */}

                <div className="flex gap-3">
                  <UtensilsCrossed size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-500">Variant Size</p>
                    <p className="text-[13px] font-black text-slate-900">{order.size || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-t border-[#eee6e3] pt-3 mt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-[#f8f5f3] px-3 py-2">
                      <p className="text-[10px] font-semibold text-slate-500">Quantity</p>
                      <p className="text-[16px] font-black text-orange-600">{order.qty}</p>
                    </div>
                    <div className="rounded-lg bg-[#f8f5f3] px-3 py-2">
                      <p className="text-[10px] font-semibold text-slate-500">Status</p>
                      <p className="text-[13px] font-black text-slate-800">{STATUS_LABELS[order.status]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-xl border border-[#e8dfdc] bg-[#fffaf8] p-5 flex flex-col">
              <p className="text-[12px] font-black uppercase tracking-wide text-slate-600 mb-4">Quick Actions</p>

              <div className="space-y-2 flex-1">
                {actions.length ? (
                  actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.nextStatus}
                        onClick={() => {
                          onUpdateStatus(order.id, action.nextStatus);
                          onClose();
                        }}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[11px] font-black text-white transition ${action.className}`}
                      >
                        <Icon size={14} />
                        {action.label}
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-lg border border-dashed border-[#ddd2ce] bg-white px-4 py-6 text-center">
                    <p className="text-[11px] font-semibold text-slate-500">
                      ✓ Order completed
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                <p className="text-[10px] font-semibold text-blue-700">ℹ️ Status update will reflect on board immediately</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e8dfdc] bg-[#f8f5f3] px-6 py-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#d8ccc3] bg-white hover:bg-slate-50 px-4 py-2 text-[11px] font-bold text-slate-700 transition"
          >
            Close & Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPanel;
