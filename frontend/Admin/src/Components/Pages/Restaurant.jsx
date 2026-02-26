import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import { createRestaurant, getRestaurants, updateRestaurant } from '../../api/adminApi';
import Toast from '../Common/Toast';

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([
    { id: 1, name: 'Pizza Palace', email: 'admin@pizzapalace.com', totalTable: 10, status: true },
    { id: 2, name: 'Burger Barn', email: 'admin@burgerbarn.com', totalTable: 6, status: true },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    email: '',
    password: '',
    totalTable: 1,
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getRestaurants();
        if (!mounted) return;
        const list = (res.data.restaurants || []).map(item => ({
          ...item,
          id: item._id || item.id,
          // backend uses string status ('active'|'inactive'); normalize to boolean for UI
          status: item.status === 'active' || item.status === true,
        }));
        setRestaurants(list);
      } catch (err) {
        // fallback: load any local restaurants
        const stored = JSON.parse(localStorage.getItem('restaurants')) || [];
        if (mounted && stored.length) setRestaurants(stored);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.phoneNumber.trim()) return 'Phone number is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.password) return 'Password is required';
    if (!formData.totalTable || Number(formData.totalTable) <= 0) return 'Total table must be > 0';
    return null;
  };

  const handleCreate = async () => {
    const err = validate();
    if (err) return setToast({ message: err, type: 'error' });

      try {
        const payload = {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          email: formData.email,
          password: formData.password,
          totalTable: Number(formData.totalTable),
        };

        const res = await createRestaurant(payload);
        const created = res.data.restaurant;
        const normalized = { ...created, id: created._id || created.id };
        setRestaurants(prev => [...prev, normalized]);
        setFormData({ name: '', phoneNumber: '', address: '', email: '', password: '', totalTable: 1 });
        setToast({ message: 'Restaurant created successfully', type: 'success' });
      } catch (error) {
        const msg = error?.response?.data?.message || 'Registration failed';
        setToast({ message: msg, type: 'error' });
      }
  };

  const toggleStatus = (id) => {
    const r = restaurants.find(x => x.id === id || x._id === id);
    if (!r) return;
    const origStatus = r.status === 'active' || r.status === true;
    const newStatus = !origStatus;
    // optimistic UI update (match by _id or id)
    setRestaurants(prev => prev.map(item => (item.id === id || item._id === id) ? { ...item, status: newStatus } : item));

    // If this item has a backend _id, call backend; otherwise persist locally
    const backendId = r._id || (typeof r.id === 'string' ? r.id : null);
    if (!backendId) {
      // update localStorage cache using latest state
      setRestaurants(prev => {
        const updated = prev.map(item => (item.id === id ? { ...item, status: newStatus } : item));
        localStorage.setItem('restaurants', JSON.stringify(updated));
        return updated;
      });
      setToast({ message: 'Status updated (local)', type: 'success' });
      return;
    }

    // call backend
    (async () => {
      try {
        // backend expects 'active'|'inactive' string
        await updateRestaurant(backendId, { status: newStatus ? 'active' : 'inactive' });
        setToast({ message: 'Status updated', type: 'success' });
      } catch (err) {
        // revert on error
        setRestaurants(prev => prev.map(item => (item.id === id || item._id === id) ? { ...item, status: origStatus } : item));
        const msg = err?.response?.data?.message || 'Failed to update status';
        setToast({ message: msg, type: 'error' });
      }
    })();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Restaurants</h2>

      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Registration Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-700">
            <UserPlus size={20} /> Register New Restaurant
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              autoComplete="off"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="Restaurant Name"
            />
            <input
              autoComplete="off"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="Phone Number"
            />
            <input
              autoComplete="off"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="Address"
            />
            <input
              autoComplete="off"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="Admin Email"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="Password"
            />
            <input
              type="number"
              min={1}
              name="totalTable"
              value={formData.totalTable}
              onChange={handleChange}
              className="p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="Total Tables"
            />
            <div className="md:col-span-3 text-right">
              <button
                onClick={handleCreate}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition active:scale-95"
              >
                Create Restaurant
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Restaurant / Client</th>
                <th className="p-4 font-semibold text-slate-600">Total Tables</th>
                <th className="p-4 font-semibold text-slate-600">Service Status</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r) => (
                <tr key={r.id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{r.name}</div>
                    <div className="text-sm text-slate-500">{r.email} • {r.phoneNumber}</div>
                  </td>
                  <td className="p-4">{r.totalTable}</td>
                  <td className="p-4">
                    {r.status ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle2 size={16} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
                        <XCircle size={16} /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={r.status}
                        onChange={() => toggleStatus(r.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default Restaurant;
