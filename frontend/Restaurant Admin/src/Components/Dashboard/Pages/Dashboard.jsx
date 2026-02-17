import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  ChevronRight,
} from "lucide-react";

const Dashboard = ({ onLogout, sidebarOpen }) => {
  // Mock data
  const stats = [
    {
      title: "Today's Orders",
      value: "24",
      change: "+12%",
      positive: true,
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Revenue",
      value: "$2,450",
      change: "+8%",
      positive: true,
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Customers",
      value: "156",
      change: "+5%",
      positive: true,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Wait Time",
      value: "12 min",
      change: "-2%",
      positive: true,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      items: "Biryani x2, Naan x1",
      amount: "$45.99",
      status: "Completed",
      time: "2 mins ago",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      items: "Butter Chicken, Rice",
      amount: "$38.50",
      status: "In Progress",
      time: "8 mins ago",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      items: "Dal Makhani x2",
      amount: "$32.00",
      status: "Pending",
      time: "15 mins ago",
    },
    {
      id: "ORD-004",
      customer: "Sarah Wilson",
      items: "Tandoori Chicken, Soup",
      amount: "$52.30",
      status: "Completed",
      time: "25 mins ago",
    },
  ];

  const topDishes = [
    {
      name: "Butter Chicken",
      orders: 45,
      revenue: "$1,350",
      rating: 4.8,
    },
    {
      name: "Biryani Special",
      orders: 42,
      revenue: "$1,260",
      rating: 4.9,
    },
    {
      name: "Tandoori Paneer",
      orders: 38,
      revenue: "$950",
      rating: 4.7,
    },
    {
      name: "Dal Makhani",
      orders: 35,
      revenue: "$840",
      rating: 4.6,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 w-full">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm fixed top-0 right-0 z-20 transition-all duration-300 ease-in-out" style={{
        left: sidebarOpen ? '16rem' : '5rem'
      }}>
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-playfair text-slate-900">
                Dashboard
              </h1>
              <p className="text-slate-500 mt-1">
                Welcome back! Here's your restaurant overview
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-8 py-8 relative z-0 pt-32">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">
                      {stat.title}
                    </p>
                    <div className="mt-3">
                      <h3 className="text-3xl font-bold text-slate-900">
                        {stat.value}
                      </h3>
                      <div className="flex items-center gap-1 mt-2">
                        {stat.positive ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-semibold ${
                            stat.positive
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change} this month
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Recent Orders
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Latest transactions
                  </p>
                </div>
                <button className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                        Items
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-900">
                            {order.id}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-700">
                          {order.customer}
                        </td>
                        <td className="py-4 px-4 text-slate-600 text-sm">
                          {order.items}
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-900">
                          {order.amount}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 text-sm">
                          {order.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Dishes */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Top Dishes
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">This month</p>
                </div>
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>

              <div className="space-y-4">
                {topDishes.map((dish, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {dish.name}
                      </h3>
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold">
                          {dish.rating}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">
                        {dish.orders} orders
                      </span>
                      <span className="font-semibold text-green-600">
                        {dish.revenue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Add New Menu Item</h3>
            <p className="text-indigo-100 mb-4">Expand your restaurant menu</p>
            <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2 rounded-lg font-semibold transition-colors">
              Add Item
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">View Analytics</h3>
            <p className="text-orange-100 mb-4">
              Detailed insights about your business
            </p>
            <button className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-lg font-semibold transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
