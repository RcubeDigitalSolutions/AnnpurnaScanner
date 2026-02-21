import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PaymentHistory = () => {
  const [expandedRestaurant, setExpandedRestaurant] = useState(null);

  const restaurantPayments = [
    {
      id: 1,
      name: 'Pizza Palace',
      lastPayment: '2024-02-22',
      totalAmount: '₹14,997.00',
      transactions: [
        { id: 101, date: '2024-02-22', amount: '₹4,999.00', status: 'Paid' },
        { id: 102, date: '2024-02-15', amount: '₹4,999.00', status: 'Paid' },
        { id: 103, date: '2024-02-08', amount: '₹4,999.00', status: 'Paid' },
      ]
    },
    {
      id: 2,
      name: 'Burger Barn',
      lastPayment: '2024-02-21',
      totalAmount: '₹9,998.00',
      transactions: [
        { id: 201, date: '2024-02-21', amount: '₹4,999.00', status: 'Paid' },
        { id: 202, date: '2024-02-14', amount: '₹4,999.00', status: 'Paid' },
      ]
    },
    {
      id: 3,
      name: 'Sushi Express',
      lastPayment: '2024-02-20',
      totalAmount: '₹4,999.00',
      transactions: [
        { id: 301, date: '2024-02-20', amount: '₹4,999.00', status: 'Paid' },
      ]
    },
  ];

  const toggleExpand = (restaurantId) => {
    setExpandedRestaurant(expandedRestaurant === restaurantId ? null : restaurantId);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Payment History</h2>
      
      <div className="space-y-4">
        {restaurantPayments.map((restaurant) => (
          <div key={restaurant.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Restaurant Header with Dropdown */}
            <button
              onClick={() => toggleExpand(restaurant.id)}
              className="w-full p-6 flex justify-between items-center hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-4 flex-1">
                <div>
                  <h3 className="font-bold text-slate-700 text-lg text-left">{restaurant.name}</h3>
                  <p className="text-sm text-slate-500 text-left">Last Payment: {restaurant.lastPayment}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-slate-800">{restaurant.totalAmount}</p>
                  <p className="text-xs text-slate-500">{restaurant.transactions.length} payments</p>
                </div>
                {expandedRestaurant === restaurant.id ? (
                  <ChevronUp className="w-6 h-6 text-orange-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500" />
                )}
              </div>
            </button>

            {/* Expanded Transaction Details */}
            {expandedRestaurant === restaurant.id && (
              <div className="border-t border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b text-sm">
                    <tr>
                      <th className="p-4 text-slate-600 uppercase tracking-wider font-semibold">Transaction ID</th>
                      <th className="p-4 text-slate-600 uppercase tracking-wider font-semibold">Date</th>
                      <th className="p-4 text-slate-600 uppercase tracking-wider font-semibold">Amount</th>
                      <th className="p-4 text-slate-600 uppercase tracking-wider font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {restaurant.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-mono text-xs text-slate-400">#{transaction.id}</td>
                        <td className="p-4 text-slate-600 text-sm">{transaction.date}</td>
                        <td className="p-4 font-bold text-slate-800">{transaction.amount}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;