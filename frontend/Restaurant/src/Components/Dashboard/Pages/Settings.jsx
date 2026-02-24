import React, { useState } from 'react';
import { CheckCircle, Edit2, Save } from 'lucide-react';

const Settings = () => {
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

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
    <div className="rounded-3xl border border-orange-200 bg-white/90 p-7 md:p-8 shadow-[0_16px_32px_rgba(0,0,0,0.05)] backdrop-blur">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#f0e7e3] pb-5">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-900">{title}</h3>
          <p className="text-[11px] font-semibold text-slate-500 mt-2">{description}</p>
        </div>
        <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-600">Settings</span>
      </div>
      <div>{children}</div>
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 ml-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={!editMode}
        className="w-full px-5 py-3.5 rounded-2xl bg-white text-slate-900 ring-1 ring-[#eadfda] disabled:bg-[#f6f1ef] disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0 focus:border-orange-500 transition-all font-medium"
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
    <div className="bg-[#efebe9] min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-orange-200 bg-linear-to-br from-white via-[#fff7f3] to-[#f6efe9] px-6 py-6 shadow-[0_18px_36px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white border border-orange-200 shadow-[0_10px_22px_rgba(249,115,22,0.15)] flex items-center justify-center">
                <span className="text-orange-600 text-lg font-black">S</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-600">Control Center</p>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800 mt-2">Settings</h1>
                <p className="text-xs font-semibold text-slate-500 mt-2">Restaurant configuration, access, and operational preferences</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="h-1 w-10 rounded-full bg-orange-600"></span>
                  <span className="h-1 w-24 rounded-full bg-orange-200"></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {editMode ? (
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setEditMode(false)} className="px-5 py-2.5 bg-white text-slate-800 border border-[#e6dfdc] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition">Cancel</button>
                  <button onClick={handleSave} className="px-5 py-2.5 bg-linear-to-r from-orange-600 to-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:from-orange-700 hover:to-orange-600 transition shadow-lg shadow-orange-600/20 flex items-center gap-2">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="group px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center gap-2 border border-slate-200 bg-white text-slate-900 shadow-[0_10px_22px_rgba(0,0,0,0.08)] hover:border-orange-200 hover:text-orange-700"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-orange-600 group-hover:bg-orange-100">
                    <Edit2 size={14} />
                  </span>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
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

      <div className="p-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-[0.18em]">General & Security</h2>
              <p className="text-xs text-slate-500 mt-1">Manage profile, contact, location, and access</p>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#9b7b67]">
              Edit mode required to update fields
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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

            <SettingSection title="Access Credentials" description="Update account passwords securely">
              <div className="space-y-6">
                <InputField
                  label="Current Password"
                  type="password"
                  value={securityForm.currentPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-6">
                  <InputField
                    label="New Password"
                    type="password"
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  />
                  <InputField
                    label="Confirm Password"
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </SettingSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;