import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, XCircle } from 'lucide-react';

const TeamMembers = () => {
  const [members, setMembers] = useState([
    { id: 1, name: 'Pizza Palace', email: 'admin@pizzapalace.com', plan: 'Premium', status: true },
    { id: 2, name: 'Burger Barn', email: 'admin@burgerbarn.com', plan: 'Standard', status: true },
    { id: 3, name: 'Sushi Express', email: 'admin@sushiexpress.com', plan: 'Premium', status: false },
  ]);

  const [formData, setFormData] = useState({
    restaurantName: '',
    email: ''
  });

  useEffect(() => {
    const newRestaurants = JSON.parse(localStorage.getItem('newRestaurants')) || [];
    setMembers([...members.slice(0, 3), ...newRestaurants]);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddRestaurant = () => {
    if (!formData.restaurantName.trim() || !formData.email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newRestaurant = {
      id: Date.now(),
      name: formData.restaurantName,
      email: formData.email,
      
      status: true
    };

    const existingRestaurants = JSON.parse(localStorage.getItem('newRestaurants')) || [];
    const updatedRestaurants = [...existingRestaurants, newRestaurant];
    localStorage.setItem('newRestaurants', JSON.stringify(updatedRestaurants));

    setMembers([...members, newRestaurant]);
    setFormData({ restaurantName: '', email: '' });
    alert(`Restaurant "${formData.restaurantName}" has been added successfully!`);
  };

  const toggleSubscription = (id) => {
    setMembers(members.map(member =>
      member.id === id ? { ...member, status: !member.status } : member
    ));
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Team Members</h2>
      
      <div className="space-y-8 animate-in fade-in duration-500">
      {/* Registration Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-700">
          <UserPlus size={20} /> Register New Member
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            autoComplete="off"
            className="p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition" 
            placeholder="Restaurant Name"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleFormChange}
          />
          <input 
            autoComplete="off"
            className="p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition" 
            placeholder="Admin Email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
          />
          <button 
            onClick={handleAddRestaurant}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition active:scale-95">
            Create Account
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Restaurant / Client</th>
              <th className="p-4 font-semibold text-slate-600">Service Status</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Kill Switch</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4">
                  <div className="font-medium text-slate-800">{member.name}</div>
                  <div className="text-sm text-slate-500">{member.email}</div>
                </td>
                <td className="p-4">
                  {member.status ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle2 size={16} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
                      <XCircle size={16} /> Subscription Expired
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={member.status}
                      onChange={() => toggleSubscription(member.id)}
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
    </div>
  );
};

export default TeamMembers;