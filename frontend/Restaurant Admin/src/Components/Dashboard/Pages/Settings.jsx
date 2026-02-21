import React, { useState } from 'react';
import {
  Building2, Clock, Users, CreditCard, Bell,
  Lock, Phone, Mail, MapPin, Globe, Instagram, Facebook,
  AlertCircle, CheckCircle, Plus, Edit2, Eye, EyeOff, Save, Trash2, ChevronRight
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [editMode, setEditMode] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [settings, setSettings] = useState({
    restaurantName: 'Annpurna Restaurant',
    description: 'Premium Indian Cuisine & Fine Dining',
    email: 'admin@annpurna.com',
    phone: '+91 98765 43210',
    address: '123 MG Road, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    zipCode: '110001',
    type: 'Fine Dining',
    cuisine: 'Indian',
    capacity: 150,
    currency: '₹ INR',
    instagram: 'https://instagram.com/annpurna',
    facebook: 'https://facebook.com/annpurna',
  });

  const [businessHours, setBusinessHours] = useState({
    monday: { open: '11:00', close: '23:00', closed: false },
    tuesday: { open: '11:00', close: '23:00', closed: false },
    wednesday: { open: '11:00', close: '23:00', closed: false },
    thursday: { open: '11:00', close: '23:00', closed: false },
    friday: { open: '11:00', close: '00:00', closed: false },
    saturday: { open: '10:00', close: '00:00', closed: false },
    sunday: { open: '10:00', close: '23:00', closed: false },
  });

  const [tables, setTables] = useState([
    { id: 1, name: 'Table 1', capacity: 4, location: 'Window Seat', status: 'active' },
    { id: 2, name: 'Table 2', capacity: 6, location: 'Center Hall', status: 'active' },
    { id: 3, name: 'Table 3', capacity: 2, location: 'Bar Counter', status: 'active' },
    { id: 4, name: 'Table 4', capacity: 8, location: 'VIP Room', status: 'active' },
  ]);

  const [editingTableId, setEditingTableId] = useState(null);
  const [newTable, setNewTable] = useState({ name: '', capacity: '', location: '' });
  const [isAddingTable, setIsAddingTable] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    newOrder: true,
    orderReady: true,
    paymentReceived: true,
    staffUpdate: true,
    lowInventory: true,
    promotion: false,
    email: true,
    sms: true,
    push: true,
  });

  const handleSave = () => {
    setEditMode(false);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const addTable = () => {
    if (newTable.name && newTable.capacity && newTable.location) {
      const newId = Math.max(...tables.map(t => t.id), 0) + 1;
      setTables([...tables, { id: newId, ...newTable, status: 'active', capacity: parseInt(newTable.capacity) }]);
      setNewTable({ name: '', capacity: '', location: '' });
      setIsAddingTable(false);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    }
  };

  const updateTable = (id, updatedData) => {
    setTables(tables.map(t => t.id === id ? { ...t, ...updatedData } : t));
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const SettingSection = ({ title, description, children }) => (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-8 shadow-sm">
      <div className="mb-6 border-b border-slate-50 pb-6">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{title}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={!editMode}
        className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl bg-white text-slate-900 disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
      />
    </div>
  );

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-orange-200 transition-all">
      <span className="text-xs font-black uppercase tracking-wider text-slate-700">{label}</span>
      <button
        onClick={onChange}
        disabled={!editMode}
        className={`relative w-11 h-6 rounded-full transition-all ${checked ? 'bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.4)]' : 'bg-slate-300'} disabled:opacity-50`}
      >
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
      </button>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans">
      {/* Premium Header */}
      <header className="px-10 pt-8 pb-4 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-5xl font-black  tracking-tighter text-slate-900 leading-tight">Settings</h1>
          <div className="flex items-center gap-3 mt-3">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Restaurant Configuration & Dashboard Control</p>
          </div>
          <div className="h-1.5 w-32 mt-5 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"></div>
        </div>

        <div className="flex items-center gap-4 ml-8">
          {editMode ? (
            <div className="flex gap-3">
              <button onClick={() => setEditMode(false)} className="px-6 py-2.5 bg-slate-100 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition shadow-lg shadow-orange-600/20 flex items-center gap-2">
                <Save size={16} /> Save Changes
              </button>
            </div>
          ) : (
            <button onClick={() => setEditMode(true)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition shadow-lg flex items-center gap-2">
              <Edit2 size={16} /> Edit Profile
            </button>
          )}
        </div>
      </header>

      {/* Status Alert */}
      {savedNotification && (
        <div className="mx-10 mt-6 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <CheckCircle size={20} className="text-emerald-600" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Changes Done  Successfully</span>
          </div>
        </div>
      )}

      <div className="p-10 flex gap-10">
        {/* Navigation Sidebar */}
        <aside className="w-64 flex flex-col gap-2">
          {[
            { id: 'general', label: 'General', icon: Building2 },
            { id: 'hours', label: 'Business Hours', icon: Clock },
            { id: 'tables', label: 'Floor Plan', icon: Users },
            { id: 'security', label: 'Security', icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xl translate-x-2'
                  : 'bg-transparent text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              {tab.label}
              <ChevronRight size={14} className={activeTab === tab.id ? 'text-orange-500' : 'opacity-0'} />
            </button>
          ))}
        </aside>

        {/* Dynamic Content Area */}
        <div className="flex-1 max-w-4xl">
          {activeTab === 'general' && (
            <div className="animate-in fade-in duration-500">
              <SettingSection title="Restaurant Identity" description="Basic profile and branding metadata">
                <div className="grid grid-cols-2 gap-8">
                  <InputField label="Brand Name" value={settings.restaurantName} onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })} />
                  <InputField label="Establishment Type" value={settings.type} onChange={(e) => setSettings({ ...settings, type: e.target.value })} />
                  <div className="col-span-2">
                    <InputField label="Marketing Description" value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} />
                  </div>
                  <InputField label="Primary Cuisine" value={settings.cuisine} onChange={(e) => setSettings({ ...settings, cuisine: e.target.value })} />
                  <InputField label="Max Capacity" type="number" value={settings.capacity} onChange={(e) => setSettings({ ...settings, capacity: e.target.value })} />
                </div>
              </SettingSection>

              <div className="grid grid-cols-2 gap-8">
                <SettingSection title="Contact" description="Public outreach details">
                  <div className="space-y-6">
                    <InputField label="Official Email" type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
                    <InputField label="Hotline Number" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
                  </div>
                </SettingSection>
                <SettingSection title="Location" description="Physical coordinates">
                  <div className="space-y-6">
                    <InputField label="Street Address" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="City" value={settings.city} onChange={(e) => setSettings({ ...settings, city: e.target.value })} />
                      <InputField label="Postal Code" value={settings.zipCode} onChange={(e) => setSettings({ ...settings, zipCode: e.target.value })} />
                    </div>
                  </div>
                </SettingSection>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="animate-in fade-in duration-500">
              <SettingSection title="Operational Timeline" description="Manage opening and closing cycles">
                <div className="space-y-3">
                  {Object.entries(businessHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900 w-28">{day}</span>
                      <div className="flex items-center gap-4">
                        {!hours.closed ? (
                          <>
                            <input 
                              type="time" 
                              value={hours.open} 
                              onChange={(e) => setBusinessHours({...businessHours, [day]: {...hours, open: e.target.value}})}
                              disabled={!editMode} 
                              className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold focus:ring-1 focus:ring-orange-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed" 
                            />
                            <span className="text-slate-400 font-bold text-[10px] uppercase">to</span>
                            <input 
                              type="time" 
                              value={hours.close} 
                              onChange={(e) => setBusinessHours({...businessHours, [day]: {...hours, close: e.target.value}})}
                              disabled={!editMode} 
                              className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold focus:ring-1 focus:ring-orange-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed" 
                            />
                            <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-100/50 px-2 py-1 rounded">Active</span>
                            {editMode && (
                              <button 
                                onClick={() => setBusinessHours({...businessHours, [day]: {...hours, closed: true}})}
                                className="ml-2 text-[10px] font-black uppercase text-rose-600 border border-rose-300 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition"
                              >
                                Close
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] font-black text-rose-600 uppercase bg-rose-100/50 px-2 py-1 rounded">Closed</span>
                            {editMode && (
                              <button 
                                onClick={() => setBusinessHours({...businessHours, [day]: {...hours, closed: false}})}
                                className="ml-2 text-[10px] font-black uppercase text-emerald-600 border border-emerald-300 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition"
                              >
                                Open
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SettingSection>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="animate-in fade-in duration-500 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Floor Layout Management</h2>
                <button 
                  onClick={() => setIsAddingTable(true)}
                  className="bg-orange-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition flex items-center gap-2"
                >
                  <Plus size={14} /> New Table
                </button>
              </div>

              {isAddingTable && (
                <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-orange-200 animate-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <InputField label="Table Name" value={newTable.name} onChange={(e) => setNewTable({...newTable, name: e.target.value})} />
                    <InputField label="Max Guests" type="number" value={newTable.capacity} onChange={(e) => setNewTable({...newTable, capacity: e.target.value})} />
                    <InputField label="Floor Zone" value={newTable.location} onChange={(e) => setNewTable({...newTable, location: e.target.value})} />
                  </div>
                  <div className="flex gap-4">
                    <button onClick={addTable} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Confirm Table</button>
                    <button onClick={() => setIsAddingTable(false)} className="bg-slate-100 text-slate-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-8">
                {tables.map((table) => (
                  <div key={table.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                    {editingTableId === table.id ? (
                      <>
                        <div className="space-y-4 mb-6">
                          <InputField label="Table Name" value={newTable.name} onChange={(e) => setNewTable({...newTable, name: e.target.value})} />
                          <InputField label="Max Guests" type="number" value={newTable.capacity} onChange={(e) => setNewTable({...newTable, capacity: e.target.value})} />
                          <InputField label="Floor Zone" value={newTable.location} onChange={(e) => setNewTable({...newTable, location: e.target.value})} />
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => { updateTable(table.id, {name: newTable.name, capacity: parseInt(newTable.capacity), location: newTable.location}); setEditingTableId(null); }}
                            className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingTableId(null)}
                            className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="text-lg font-black text-slate-900 leading-none">{table.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{table.location}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${table.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                            {table.status}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center mb-6">
                           <span className="text-[10px] font-black uppercase text-slate-500">Seating</span>
                           <span className="font-black text-slate-900">{table.capacity} <span className="text-[10px] text-slate-400">Pax</span></span>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => { setEditingTableId(table.id); setNewTable({name: table.name, capacity: table.capacity.toString(), location: table.location}); }}
                            className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => setTables(tables.filter(t => t.id !== table.id))} 
                            disabled={!editMode}
                            className="px-3 border border-slate-200 rounded-xl text-rose-500 hover:bg-rose-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-in fade-in duration-500">
              <SettingSection title="Access Credentials" description="Encrypted authentication control">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Password</label>
                    <input type="password" placeholder="••••••••" disabled={!editMode} className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-orange-500/20 outline-none font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <InputField label="New Password" type="password" />
                    <InputField label="Confirm Password" type="password" />
                  </div>
                </div>
              </SettingSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;