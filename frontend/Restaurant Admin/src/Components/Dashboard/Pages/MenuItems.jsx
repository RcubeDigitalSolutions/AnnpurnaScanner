import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed, Bell, Search, Plus, Edit2, Trash2, Sun, Moon,
  XCircle, CheckCircle, AlertCircle, ChevronRight, LayoutGrid, List, Filter
} from 'lucide-react';

const MenuManagementPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [categories, setCategories] = useState([
    { id: '1', name: 'Appetizers', itemCount: 3 },
    { id: '2', name: 'Main Course', itemCount: 4 },
    { id: '3', name: 'Desserts', itemCount: 3 },
    { id: '4', name: 'Beverages', itemCount: 3 },
  ]);

  const [items, setItems] = useState([
    { id: '101', categoryId: '1', name: 'Garlic Bread', price: 6.99, description: 'Crispy baguette with garlic butter', available: true },
    { id: '102', categoryId: '1', name: 'Chicken Wings', price: 12.99, description: 'Spicy buffalo or BBQ', available: true },
    { id: '103', categoryId: '1', name: 'Bruschetta', price: 8.99, description: 'Tomato, basil, balsamic', available: false },
    { id: '201', categoryId: '2', name: 'Classic Burger', price: 15.99, description: 'Beef patty, lettuce, tomato, fries', available: true },
    { id: '202', categoryId: '2', name: 'Margherita Pizza', price: 14.99, description: 'Tomato, mozzarella, basil', available: true },
    { id: '203', categoryId: '2', name: 'Grilled Salmon', price: 22.99, description: 'With lemon butter sauce', available: true },
    { id: '204', categoryId: '2', name: 'Pasta Carbonara', price: 16.99, description: 'Creamy bacon & egg', available: true },
    { id: '301', categoryId: '3', name: 'Lemon Tart', price: 7.99, description: 'Zesty lemon curd', available: true },
    { id: '302', categoryId: '3', name: 'Chocolate Lava Cake', price: 8.99, description: 'Warm chocolate center', available: true },
    { id: '303', categoryId: '3', name: 'Tiramisu', price: 7.99, description: 'Classic Italian dessert', available: false },
    { id: '401', categoryId: '4', name: 'Soft Drinks', price: 2.99, description: 'Coke, Sprite, Fanta', available: true },
    { id: '402', categoryId: '4', name: 'Craft Beer', price: 5.99, description: 'Local IPA', available: true },
    { id: '403', categoryId: '4', name: 'House Wine', price: 7.99, description: 'Red or white', available: true },
  ]);

  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [itemForm, setItemForm] = useState({ name: '', price: '', description: '', available: true });

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const filteredItems = items.filter(item => item.categoryId === selectedCategory?.id);

  // Styling Variables to match Dashboard
  const theme = {
    bg: darkMode ? 'bg-slate-950' : 'bg-slate-50',
    header: darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    card: darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    textMain: darkMode ? 'text-white' : 'text-slate-900',
    textMuted: 'text-slate-500',
    accent: 'orange-600',
    accentHover: 'orange-700'
  };

  const saveCategory = () => {
    if (!categoryForm.name.trim()) return;
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: categoryForm.name } : c));
    } else {
      setCategories([...categories, { id: Date.now().toString(), name: categoryForm.name, itemCount: 0 }]);
    }
    setShowCategoryModal(false);
  };

  const saveItem = () => {
    if (!itemForm.name.trim() || !itemForm.price || !selectedCategory) return;
    const newItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      categoryId: selectedCategory.id,
      name: itemForm.name,
      price: parseFloat(itemForm.price),
      description: itemForm.description,
      available: itemForm.available,
    };
    setItems(editingItem ? items.map(i => i.id === editingItem.id ? newItem : i) : [...items, newItem]);
    setShowItemModal(false);
  };

  return (
    <div className={`w-full h-screen ${theme.bg} flex flex-col font-sans transition-colors duration-300`}>
      {/* Dashboard-Style Header */}
      {/* <header className={`h-20 flex items-center px-8 justify-between border-b ${theme.header} sticky top-0 z-50`}>
        <div className="flex items-center gap-4">
          <div className="bg-orange-600 p-2 rounded-lg">
            <LayoutGrid className="text-white" size={24} />
          </div>
          <div>
            <h1 className={`text-xl font-black uppercase tracking-tight ${theme.textMain}`}>Inventory<span className="text-orange-600">Core</span></h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Enterprise Menu Management</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`hidden md:flex items-center ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-full px-4 py-2 border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search menu..." className="bg-transparent ml-3 text-sm outline-none w-64 text-slate-400" />
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header> */}

      {/* Menu Management Headline */}
      <div className="px-8 pt-8 pb-4">
        <h1 className="text-5xl font-black text-slate-900  tracking-tighter mb-3">Menu Management</h1>
        <div className="flex flex-col gap-2">
          <p className="text-slate-500 font-bold text-sm">Organize, manage and control your restaurant menu items</p>
          <div className="h-1 w-80 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"></div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="flex-1 overflow-hidden flex p-8 gap-8">
        
        {/* Sidebar: Categories */}
        <aside className="w-80 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Categories</h2>
            <button 
              onClick={() => { setEditingCategory(null); setCategoryForm({ name: '' }); setShowCategoryModal(true); }}
              className="p-1.5 bg-orange-600/10 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
                  selectedCategory?.id === cat.id
                    ? 'bg-slate-900 border-slate-800 shadow-xl'
                    : `${theme.card} hover:border-orange-500/50`
                }`}
              >
                <div>
                  <p className={`font-bold text-sm ${selectedCategory?.id === cat.id ? 'text-white' : theme.textMain}`}>{cat.name}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${selectedCategory?.id === cat.id ? 'text-orange-500' : 'text-slate-500'}`}>{cat.itemCount} Live Items</p>
                </div>
                {selectedCategory?.id === cat.id ? (
                  <div className="w-2 h-2 bg-orange-600 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.6)]"></div>
                ) : (
                   <button onClick={(e) => { e.stopPropagation(); setEditingCategory(cat); setCategoryForm({ name: cat.name }); setShowCategoryModal(true); }} 
                           className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-orange-600 transition-all">
                     <Edit2 size={14} />
                   </button>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Content: Menu Items */}
        <section className="flex-1 flex flex-col gap-6 overflow-hidden">
          {selectedCategory ? (
            <>
              {/* Category Header & Stats */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className={`text-3xl font-black tracking-tight ${theme.textMain}`}>{selectedCategory.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded">Stock Health: Good</span>
                    <span className="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded">Total Value: ₹4,200</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setEditingItem(null); setItemForm({ name: '', price: '', description: '', available: true }); setShowItemModal(true); }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-orange-600/20 flex items-center gap-2 transition-all"
                >
                  <Plus size={18} /> Add New Item
                </button>
              </div>

              {/* Items Grid */}
              <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10 custom-scrollbar">
                {filteredItems.map((item) => (
                  <div key={item.id} className={`${theme.card} border rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all duration-300 group h-fit`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-xs font-black text-orange-600">
                        ₹{item.price.toFixed(2)}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingItem(item); setItemForm({ name: item.name, price: item.price.toString(), description: item.description, available: item.available }); setShowItemModal(true); }} 
                                className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => { if(window.confirm('Delete item?')) setItems(items.filter(i => i.id !== item.id)) }} 
                                className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className={`text-lg font-black leading-tight mb-2 ${theme.textMain}`}>{item.name}</h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.available ? 'Available' : 'Out of Stock'}</span>
                      </div>
                      <button 
                        onClick={() => setItems(items.map(i => i.id === item.id ? { ...i, available: !i.available } : i))}
                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border transition-all ${
                          item.available ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                        }`}
                      >
                        {item.available ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
              <UtensilsCrossed size={80} className="mb-4" />
              <p className="font-black uppercase tracking-[0.3em]">Select a Category</p>
            </div>
          )}
        </section>
      </main>

      {/* Modal - Unified Professional Style */}
      {(showCategoryModal || showItemModal) && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className={`${theme.card} rounded-[40px] shadow-2xl max-w-md w-full p-10 border transition-all scale-up-center`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className={`text-2xl font-black uppercase tracking-tighter ${theme.textMain}`}>
                {showCategoryModal ? 'Category Manager' : 'Product Editor'}
              </h3>
              <button onClick={() => { setShowCategoryModal(false); setShowItemModal(false); }} className="text-slate-400 hover:text-orange-600">
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {showCategoryModal ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Category Title</label>
                  <input 
                    type="text" value={categoryForm.name} 
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} 
                    className={`w-full px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} 
                    placeholder="e.g. Main Course"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Item Title</label>
                    <input type="text" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} className={`w-full px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} placeholder="Product Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Price (₹)</label>
                    <input type="number" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} className={`w-full px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Description</label>
                    <textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} rows="3" className={`w-full px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 border transition-all resize-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} placeholder="Brief menu description..." />
                  </div>
                  <div className="flex items-center gap-3 ml-1">
                    <input type="checkbox" checked={itemForm.available} onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })} className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500" />
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active on Menu</label>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => { setShowCategoryModal(false); setShowItemModal(false); }} className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>Discard</button>
              <button onClick={showCategoryModal ? saveCategory : saveItem} className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-orange-600/20">Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;