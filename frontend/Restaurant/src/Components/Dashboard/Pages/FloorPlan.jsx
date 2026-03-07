import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Users, Download } from 'lucide-react';
import { getTables, createTable, updateTable, deleteTable, getMe } from '../../../api/restaurantApi';

const FloorPlanPage = () => {
  const [editMode, setEditMode] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const [tables, setTables] = useState([]);
  const [tableLimit, setTableLimit] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const publicMenuBaseUrl = (import.meta.env.VITE_PUBLIC_MENU_BASE_URL || window.location.origin).replace(/\/$/, '');

  // fetch tables and restaurant info (for limit) on mount
  useEffect(() => {
    let mounted = true;

    const loadInfo = async () => {
      try {
        const me = await getMe();
        if (mounted) {
          const rest = me.data.restaurant;
          setTableLimit(rest?.totalTable ?? null);
          setRestaurantId(rest?._id || rest?.id || null);
        }
      } catch (_) {
        // ignore
      }
    };

    const load = async () => {
      try {
        const res = await getTables();
        if (!mounted) return;
        const loaded = (res.data.tables || []).map(t => ({
          id: t._id,
          name: `Table ${t.number}`,
          capacity: 4, // default
          status: t.status,
          qrGenerated: true,
          number: t.number,
          raw: t,
        }));
        setTables(loaded);
      } catch (err) {
        // handled by interceptor
      }
    };
    loadInfo();
    load();

    return () => { mounted = false; };
  }, []);

  const [editingTableId, setEditingTableId] = useState(null);
  const [newTable, setNewTable] = useState({ capacity: '' });
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [generateQrOnCreate, setGenerateQrOnCreate] = useState(true);
  const nextTableNumber = Math.max(...tables.map(t => t.number || t.id), 0) + 1;
  const nextTableLabel = `Table ${nextTableNumber}`;

  const addTable = async (generateQr = true) => {
    // front-end limit check as a safeguard
    if (tableLimit != null && tables.length >= tableLimit) {
      // should not happen because button disabled, but just in case
      return;
    }
    const newNumber = Math.max(...tables.map(t => t.number || t.id), 0) + 1;
    try {
      const res = await createTable({ number: newNumber, status: 'active' });
      const created = res.data.table;
      const newItem = {
        id: created._id,
        name: `Table ${created.number}`,
        capacity: 4,
        status: created.status,
        qrGenerated: true,
        number: created.number,
        raw: created,
      };
      setTables([...tables, newItem]);
      setNewTable({ capacity: '' });
      setGenerateQrOnCreate(true);
      setIsAddingTable(false);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    } catch (err) {
      // handled by interceptor
    }
  };

  const updateTableOnServer = async (id, updatedData) => {
    try {
      await updateTable(id, updatedData);
      setTables(tables.map(t => t.id === id ? { ...t, ...updatedData } : t));
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    } catch (err) {
      // handled by interceptor
    }
  };

  const deleteTableFromServer = async (id) => {
    try {
      await deleteTable(id);
      setTables(tables.filter(t => t.id !== id));
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    } catch (err) {
      // handled by interceptor
    }
  };

  // build a URL that redirects customers to the public menu page
  const getTableMenuLink = (table) => {
    if (!restaurantId) return '';
    return `${publicMenuBaseUrl}/menu/${restaurantId}/${table.number}`;
  };

  const getTableQrUrl = (table) => {
    if (!restaurantId) return '';
    const link = getTableMenuLink(table);
    const encoded = encodeURIComponent(link);
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encoded}`;
  };

  const downloadTableQr = async (table) => {
    if (!restaurantId) return;
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
              disabled={tableLimit != null && tables.length >= tableLimit}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Plus size={16} /> Add Table
            </button>
            {tableLimit != null && (
              <span className="text-xs text-slate-500 mt-1">
                {tables.length} / {tableLimit} tables used
              </span>
            )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-700 block">Table Number</label>
                  <div className="w-full px-4 py-3.5 border border-emerald-100 rounded-xl bg-emerald-50">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Auto Assigned</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white border border-emerald-200 text-sm font-black text-emerald-700">
                        #{nextTableNumber}
                      </span>
                    </div>
                  </div>
                </div>
                {/* <InputField label="Seats *" type="number" value={newTable.capacity} onChange={(e) => setNewTable({...newTable, capacity: e.target.value})} placeholder="4" /> */}
              </div>
              <div className="mb-6 p-4 rounded-xl border border-[#eee6e3] bg-[#faf8f7]">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-600 mb-1">{nextTableLabel} ke liye QR code chahiye?</p>
                <p className="text-[11px] font-medium text-slate-500 mb-3">Generate par click karte hi is table ka QR card me show ho jayega.</p>
               
                 <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => addTable(generateQrOnCreate)} 
                  className="bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_8px_20px_rgba(5,150,105,0.25)] hover:shadow-[0_10px_24px_rgba(5,150,105,0.35)]"
                >
                  {generateQrOnCreate ? 'Yes, Generate QR & Create Table' : 'Create Table'}
                </button>
                <button 
                  onClick={() => { setIsAddingTable(false); setNewTable({ capacity: '' }); setGenerateQrOnCreate(true); }} 
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
              </div>
              </div>
             
            </div>
          )}

          {/* Tables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tables.map((table) => (
              <div key={table.id} className="relative bg-white rounded-2xl border border-[#e6dfdc] p-5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-500 via-orange-400 to-orange-300"></div>
                {editingTableId === table.id ? (
                  <>
                    <div className="space-y-4 mb-4 mt-2">
                      <InputField label="Table Name" value={newTable.name} onChange={(e) => setNewTable({...newTable, name: e.target.value})} />
                      {/* <InputField label="Seats" type="number" value={newTable.capacity} onChange={(e) => setNewTable({...newTable, capacity: e.target.value})} /> */}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { updateTableOnServer(table.id, {status: table.status}); setEditingTableId(null); }}
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
                    <div className="flex justify-between items-start mb-4 mt-2 gap-3">
                      <div className="min-w-0">
                        <h4 className="text-lg font-black text-slate-900 truncate">{table.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${table.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {table.status}
                        </div>
                        <button
                          onClick={() => deleteTableFromServer(table.id)}
                          className="w-8 h-8 inline-flex items-center justify-center border border-rose-100 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          aria-label={`Delete ${table.name}`}
                          title="Delete table"
                        >
                          <Trash2 size={15}/>
                        </button>
                      </div>
                    </div>

                    {table.qrGenerated ? (
                      <div className="mb-1 border border-[#eee6e3] rounded-xl p-3.5 bg-[#faf8f7]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Table QR</span>
                          <button
                            onClick={() => downloadTableQr(table)}
                            disabled={!restaurantId}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-all disabled:opacity-50"
                          >
                            <Download size={12} /> Download QR
                          </button>
                        </div>
                        <div className="flex justify-center">
                          <img
                            src={restaurantId ? getTableQrUrl(table) : ''}
                            alt={`${table.name} QR code`}
                            className="w-28 h-28 rounded-lg border border-[#e6dfdc] bg-white"
                          />
                        </div>
                        <p className="mt-2 break-all text-[10px] text-slate-500 text-center">
                          {getTableMenuLink(table)}
                        </p>
                        {getTableMenuLink(table).includes('localhost') && (
                          <p className="mt-1 text-[10px] text-rose-600 text-center font-semibold">
                            This QR uses localhost and may not open on phone. Use LAN URL in VITE_PUBLIC_MENU_BASE_URL.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mb-1 border border-dashed border-[#e6dfdc] rounded-xl p-3.5 bg-[#faf8f7]">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-semibold text-slate-500">QR not generated yet</span>
                          <button
                            onClick={() => updateTableOnServer(table.id, { status: table.status })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-all"
                          >
                            Generate QR
                          </button>
                        </div>
                      </div>
                    )}
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
