import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Users, Download } from 'lucide-react';

const FloorPlanPage = () => {
  const [editMode, setEditMode] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const [tables, setTables] = useState([
    { id: 1, name: 'Table 1', capacity: 4, status: 'active' },
    { id: 2, name: 'Table 2', capacity: 6, status: 'active' },
    { id: 3, name: 'Table 3', capacity: 2, status: 'active' },
    { id: 4, name: 'Table 4', capacity: 8, status: 'active' },
  ]);

  const [editingTableId, setEditingTableId] = useState(null);
  const [newTable, setNewTable] = useState({ name: '', capacity: '' });
  const [isAddingTable, setIsAddingTable] = useState(false);

  const addTable = () => {
    if (newTable.name && newTable.capacity) {
      const newId = Math.max(...tables.map(t => t.id), 0) + 1;
      setTables([...tables, { id: newId, ...newTable, status: 'active', capacity: parseInt(newTable.capacity) }]);
      setNewTable({ name: '', capacity: '' });
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

  const getTableQrValue = (table) => `TABLE:${table.id}|NAME:${table.name}|CAPACITY:${table.capacity}`;

  const getTableQrUrl = (table) => {
    const encoded = encodeURIComponent(getTableQrValue(table));
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encoded}`;
  };

  const downloadTableQr = async (table) => {
    try {
      const response = await fetch(getTableQrUrl(table));
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${table.name.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('QR download failed:', error);
    }
  };

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-700 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-[#e6dfdc] rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ece8e7] p-5 md:p-6">
      <div className="max-w-7xl mx-auto rounded-[28px] border border-[#e3dcda] bg-[#f5f1f0] shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[#e5deda] bg-[#f8f3f2]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
                <Users size={28} className="text-orange-600" />
                Floor Plan Management
              </h1>
              <p className="text-xs text-slate-500 mt-1">Manage tables and seating arrangements</p>
            </div>

            <button 
              onClick={() => setIsAddingTable(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> Add Table
            </button>
          </div>
        </div>

        {/* Status Alert */}
        {savedNotification && (
          <div className="p-4 md:p-6 bg-emerald-50 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-emerald-600" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Changes Done Successfully</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {isAddingTable && (
            <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-orange-200 mb-6 animate-in zoom-in-95 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <InputField label="Table Name *" value={newTable.name} onChange={(e) => setNewTable({...newTable, name: e.target.value})} placeholder="e.g. Table 5" />
                <InputField label="Max Guests *" type="number" value={newTable.capacity} onChange={(e) => setNewTable({...newTable, capacity: e.target.value})} placeholder="4" />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={addTable} 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                >
                  Create Table
                </button>
                <button 
                  onClick={() => { setIsAddingTable(false); setNewTable({ name: '', capacity: '' }); }} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <div key={table.id} className="bg-white rounded-2xl border border-[#e6dfdc] p-4 hover:shadow-lg transition-all group">
                {editingTableId === table.id ? (
                  <>
                    <div className="space-y-4 mb-4">
                      <InputField label="Table Name" value={newTable.name} onChange={(e) => setNewTable({...newTable, name: e.target.value})} />
                      <InputField label="Max Guests" type="number" value={newTable.capacity} onChange={(e) => setNewTable({...newTable, capacity: e.target.value})} />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { updateTable(table.id, {name: newTable.name, capacity: parseInt(newTable.capacity)}); setEditingTableId(null); }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingTableId(null)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-black text-slate-900">{table.name}</h4>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${table.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {table.status}
                      </div>
                    </div>

                    <div className="mb-4 border border-[#eee6e3] rounded-lg p-3 bg-[#faf8f7]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Table QR</span>
                        <button
                          onClick={() => downloadTableQr(table)}
                          className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700"
                        >
                          <Download size={12} /> Download QR
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <img
                          src={getTableQrUrl(table)}
                          alt={`${table.name} QR code`}
                          className="w-28 h-28 rounded-md border border-[#e6dfdc] bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingTableId(table.id); setNewTable({name: table.name, capacity: table.capacity.toString()}); }}
                        className="flex-1 bg-slate-900 hover:bg-orange-600 text-white py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all inline-flex items-center justify-center gap-1"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button 
                        onClick={() => setTables(tables.filter(t => t.id !== table.id))} 
                        className="px-3 py-2 border border-[#e6dfdc] rounded-lg text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {tables.length === 0 && !isAddingTable && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Users size={48} className="mb-3" />
              <p className="text-sm font-bold">No tables added yet</p>
              <p className="text-xs text-slate-500 mt-1">Click "Add Table" to create your first table</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloorPlanPage;
