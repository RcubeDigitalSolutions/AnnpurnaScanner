import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed, Search, Plus, Edit2, Trash2,
  X, CheckCircle2, AlertCircle
} from 'lucide-react';

const getAutoCategoryImage = (name = '') => `https://loremflickr.com/160/160/${encodeURIComponent(name || 'food')},food`;
const escapeSvgText = (value = '') => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const getFallbackCategoryImage = (name = 'Food') => {
  const title = escapeSvgText((name || 'Food').slice(0, 16));
  const initial = escapeSvgText((name || 'F').charAt(0).toUpperCase());
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#fb923c"/></linearGradient></defs><rect width="160" height="160" rx="20" fill="url(#g)"/><circle cx="80" cy="62" r="28" fill="#fff" fill-opacity="0.2"/><text x="80" y="73" text-anchor="middle" font-size="30" font-family="Arial, sans-serif" fill="#ffffff" font-weight="700">${initial}</text><text x="80" y="124" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="#ffffff" font-weight="700">${title}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const MenuManagementPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [categories, setCategories] = useState([
    { id: '1', name: 'Appetizers', itemCount: 3, image: '' },
    { id: '2', name: 'Main Course', itemCount: 4, image: '' },
    { id: '3', name: 'Desserts', itemCount: 3, image: '' },
    { id: '4', name: 'Beverages', itemCount: 3, image: '' },
  ]);

  const [items, setItems] = useState([
    { id: '101', categoryId: '1', name: 'Garlic Bread', price: 6.99, description: 'Crispy baguette with garlic butter', available: true, foodType: 'veg' },
    { id: '102', categoryId: '1', name: 'Chicken Wings', price: 12.99, description: 'Spicy buffalo or BBQ', available: true, foodType: 'nonveg' },
    { id: '103', categoryId: '1', name: 'Bruschetta', price: 8.99, description: 'Tomato, basil, balsamic', available: false, foodType: 'veg' },
    { id: '201', categoryId: '2', name: 'Classic Burger', price: 15.99, description: 'Beef patty, lettuce, tomato, fries', available: true, foodType: 'nonveg' },
    { id: '202', categoryId: '2', name: 'Margherita Pizza', price: 14.99, description: 'Tomato, mozzarella, basil', available: true, foodType: 'veg' },
    { id: '203', categoryId: '2', name: 'Grilled Salmon', price: 22.99, description: 'With lemon butter sauce', available: true, foodType: 'nonveg' },
    { id: '204', categoryId: '2', name: 'Pasta Carbonara', price: 16.99, description: 'Creamy bacon & egg', available: true, foodType: 'nonveg' },
    { id: '301', categoryId: '3', name: 'Lemon Tart', price: 7.99, description: 'Zesty lemon curd', available: true, foodType: 'veg' },
    { id: '302', categoryId: '3', name: 'Chocolate Lava Cake', price: 8.99, description: 'Warm chocolate center', available: true, foodType: 'veg' },
    { id: '303', categoryId: '3', name: 'Tiramisu', price: 7.99, description: 'Classic Italian dessert', available: false, foodType: 'veg' },
    { id: '401', categoryId: '4', name: 'Soft Drinks', price: 2.99, description: 'Coke, Sprite, Fanta', available: true, foodType: 'veg' },
    { id: '402', categoryId: '4', name: 'Craft Beer', price: 5.99, description: 'Local IPA', available: true, foodType: 'veg' },
    { id: '403', categoryId: '4', name: 'House Wine', price: 7.99, description: 'Red or white', available: true, foodType: 'veg' },
  ]);

  const [categoryForm, setCategoryForm] = useState({ name: '', image: '' });
  const [itemForm, setItemForm] = useState({ name: '', price: '', description: '', available: true, foodType: 'veg' });

  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState({ quantity: '', price: '' });
  const presetSizes = ['Small', 'Medium', 'Large', 'Half', 'Full', '250ml', '500ml', '1L'];

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const filteredItems = items.filter(item => 
    item.categoryId === selectedCategory?.id && 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveCategory = () => {
    if (!categoryForm.name.trim()) return;
    const image = categoryForm.image.trim();
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: categoryForm.name, image } : c));
    } else {
      setCategories([...categories, { id: Date.now().toString(), name: categoryForm.name, itemCount: 0, image }]);
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
      foodType: itemForm.foodType,
      sizes: sizes
    };
    setItems(editingItem ? items.map(i => i.id === editingItem.id ? newItem : i) : [...items, newItem]);
    setShowItemModal(false);
    setSizes([]);
    setNewSize({ quantity: '', price: '' });
  };

  const addSize = () => {
    if (newSize.quantity.trim() && newSize.price.trim()) {
      setSizes([...sizes, { id: Date.now().toString(), quantity: newSize.quantity, price: newSize.price }]);
      setNewSize({ quantity: '', price: '' });
    }
  };

  const removeSize = (sizeId) => {
    setSizes(sizes.filter(s => s.id !== sizeId));
  };

  return (
    <div className="min-h-screen bg-[#ece8e7] p-5 md:p-6">
      <div className="max-w-7xl mx-auto rounded-[28px] border border-[#e3dcda] bg-[#f5f1f0] shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[#e5deda] bg-[#f8f3f2]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900">Menu Management</h1>
              <p className="text-xs text-slate-500 mt-1">Manage menu items and categories</p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#e6dfdc] bg-[#fdfbfa] px-4 py-2 w-full md:w-64">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Categories */}
          <aside className="w-64 border-r border-[#e5deda] bg-[#f8f3f2] overflow-y-auto p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600">Categories</h2>
              <button 
                onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', image: '' }); setShowCategoryModal(true); }}
                className="p-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left p-3 rounded-lg transition-all border font-semibold text-sm ${
                    selectedCategory?.id === cat.id
                      ? 'bg-white border-orange-300 text-slate-900 shadow-md ring-1 ring-orange-200'
                      : 'bg-white border-[#e6dfdc] text-slate-700 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={cat.image || getAutoCategoryImage(cat.name)}
                      alt={cat.name}
                      className="w-9 h-9 rounded-lg object-cover border border-[#e6dfdc]"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getFallbackCategoryImage(cat.name);
                      }}
                    />
                    <div className="min-w-0">
                      <p className="truncate">{cat.name}</p>
                      <p className={`text-[10px] font-bold mt-0.5 ${selectedCategory?.id === cat.id ? 'text-orange-600' : 'text-slate-500'}`}>
                        {cat.itemCount} items
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {selectedCategory ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{selectedCategory.name}</h2>
                    <p className="text-xs text-slate-500 mt-1">{filteredItems.length} items in this category</p>
                  </div>
                  <button 
                    onClick={() => { setEditingItem(null); setItemForm({ name: '', price: '', description: '', available: true, foodType: 'veg' }); setSizes([]); setNewSize({ quantity: '', price: '' }); setShowItemModal(true); }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 transition-all"
                  >
                    <Plus size={16} /> Add Item
                  </button>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-[#e6dfdc] bg-white p-4 hover:shadow-lg transition-all group h-fit">
                      <div className="flex items-center justify-between mb-3">
                        <div className="inline-block px-2 py-1 rounded-lg bg-slate-100 text-xs font-black text-orange-600">
                          ₹{item.price.toFixed(2)}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingItem(item); setItemForm({ name: item.name, price: item.price.toString(), description: item.description, available: item.available, foodType: item.foodType || 'veg' }); setSizes(item.sizes || []); setShowItemModal(true); }}
                            className="p-1.5 text-slate-400 hover:text-orange-600 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => { if(window.confirm('Delete item?')) setItems(items.filter(i => i.id !== item.id)) }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${item.foodType === 'nonveg' ? 'border-rose-500' : 'border-emerald-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.foodType === 'nonveg' ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        </span>
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{item.description}</p>

                      {/* Sizes */}
                      {item.sizes && item.sizes.length > 0 && (
                        <div className="mb-3 pb-3 border-t border-[#eee6e3]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Sizes</p>
                          <div className="grid grid-cols-2 gap-2">
                            {item.sizes.map((size) => (
                              <div key={size.id} className="p-2 rounded-lg bg-slate-50 border border-[#eee6e3]">
                                <p className="text-[10px] font-bold text-slate-600">{size.quantity}</p>
                                <p className="text-xs font-black text-orange-600">₹{size.price}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Availability */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#eee6e3]">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                          <span className="text-[10px] font-black uppercase text-slate-500">{item.available ? 'Available' : 'Out'}</span>
                        </div>
                        <button 
                          onClick={() => setItems(items.map(i => i.id === item.id ? { ...i, available: !i.available } : i))}
                          className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${
                            item.available 
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' 
                              : 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                          }`}
                        >
                          {item.available ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <UtensilsCrossed size={48} className="mb-3" />
                    <p className="text-sm font-bold">No items found</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <UtensilsCrossed size={64} className="mb-4" />
                <p className="font-black uppercase tracking-[0.2em]">Select a Category</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modal */}
      {(showCategoryModal || showItemModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-[#e3dcda] bg-[#fcfaf9] shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="border-b border-[#e8dfdc] bg-[#f8f1ed] px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {showCategoryModal ? '➕ Add/Edit Category' : '➕ Add/Edit Menu Item'}
                </h2>
                <p className="text-[10px] font-semibold text-slate-500 mt-1">
                  {showCategoryModal ? 'Create or modify a product category' : 'Create or modify a menu item with variants'}
                </p>
              </div>
              <button onClick={() => { setShowCategoryModal(false); setShowItemModal(false); }} className="p-2 text-slate-600 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-5 scrollbar scrollbar-thumb-orange-200 scrollbar-track-slate-100" style={{scrollbarWidth: 'thin', scrollbarColor: '#fed7aa #f1f5f9'}}>
              {showCategoryModal ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-700 block">Category Name *</label>
                    <input 
                      type="text" 
                      value={categoryForm.name} 
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} 
                      className="w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 border border-[#e6dfdc] bg-white text-slate-900 font-medium" 
                      placeholder="e.g. Main Course, Appetizers" 
                      autoFocus
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-700 block">Image URL (Optional)</label>
                    <input
                      type="text"
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 border border-[#e6dfdc] bg-white text-slate-900 font-medium"
                      placeholder="Paste image URL or leave empty"
                    />
                    <p className="text-[11px] text-slate-500">Agar URL empty rahega to category name ke basis par auto food image show hogi.</p>
                  </div>

                  <div className="rounded-xl border border-[#e6dfdc] bg-white p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Preview</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={categoryForm.image?.trim() || getAutoCategoryImage(categoryForm.name)}
                        alt={categoryForm.name || 'Category preview'}
                        className="w-16 h-16 rounded-lg object-cover border border-[#e6dfdc]"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getFallbackCategoryImage(categoryForm.name || 'Food');
                        }}
                      />
                      <div>
                        <p className="text-sm font-black text-slate-900">{categoryForm.name?.trim() || 'Category Name'}</p>
                        <p className="text-[11px] text-slate-500">Image will be saved with this category</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-700 block">Item Name *</label>
                    <input 
                      type="text" 
                      value={itemForm.name} 
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} 
                      className="w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 border border-[#e6dfdc] bg-white text-slate-900 font-medium" 
                      placeholder="e.g. Margherita Pizza" 
                      autoFocus
                    />
                  </div>

                  {itemForm.name.trim() && (
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-700 block">Food Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setItemForm({ ...itemForm, foodType: 'veg' })}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${itemForm.foodType === 'veg' ? 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-200' : 'border-[#e6dfdc] bg-white hover:bg-slate-50'}`}
                        >
                          <span className="w-4 h-4 rounded-sm border border-emerald-500 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          </span>
                          <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Veg</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemForm({ ...itemForm, foodType: 'nonveg' })}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${itemForm.foodType === 'nonveg' ? 'border-rose-400 bg-rose-50 ring-1 ring-rose-200' : 'border-[#e6dfdc] bg-white hover:bg-slate-50'}`}
                        >
                          <span className="w-4 h-4 rounded-sm border border-rose-500 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          </span>
                          <span className="text-xs font-black uppercase tracking-widest text-rose-700">Non Veg</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-700 block">Price (₹) *</label>
                      <input 
                        type="number" 
                        value={itemForm.price} 
                        onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} 
                        className="w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 border border-[#e6dfdc] bg-white text-slate-900 font-medium" 
                        placeholder="0.00" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-700 block">Status</label>
                      <label className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#e6dfdc] bg-white cursor-pointer hover:bg-slate-50 transition-all">
                        <input 
                          type="checkbox" 
                          checked={itemForm.available} 
                          onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })} 
                          className="w-4 h-4 rounded text-orange-600 accent-orange-600"
                        />
                        <span className="text-xs font-bold text-slate-700">Active on Menu</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* <label className="text-xs font-black uppercase tracking-widest text-slate-700 block">Description</label>
                    <textarea 
                      value={itemForm.description} 
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} 
                      rows="3" 
                      className="w-full px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 border border-[#e6dfdc] bg-white text-slate-900 font-medium resize-none" 
                      placeholder="Brief description of the item..." 
                    /> */}
                  </div>

                  {/* Size Variants Section */}
                  {itemForm.name.trim() && (
                  <div className="border-t border-[#eee6e3] pt-5 space-y-4">
                    <div className="rounded-xl border border-orange-200 bg-linear-to-br from-orange-50 to-white p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Size Variants</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Optional</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {presetSizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setNewSize({ ...newSize, quantity: size })}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${newSize.quantity === size ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-[#e6dfdc] hover:border-orange-300'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-3">
                        <div className="w-full px-3 py-2.5 rounded-lg text-sm border border-[#e6dfdc] bg-white text-slate-700 font-bold">
                          {newSize.quantity || 'Select a size'}
                        </div>
                        <input
                          type="number"
                          value={newSize.price}
                          onChange={(e) => setNewSize({ ...newSize, price: e.target.value })}
                          placeholder="Price"
                          className="w-full px-3 py-2.5 rounded-lg text-sm border border-[#e6dfdc] outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        />
                        <button
                          onClick={addSize}
                          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {sizes.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto bg-slate-50 p-3 rounded-lg border border-[#e6dfdc]" style={{scrollbarWidth: 'thin', scrollbarColor: '#fed7aa #f1f5f9'}}>
                        {sizes.map((size) => (
                          <div key={size.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#eee6e3]">
                            <div>
                              <p className="text-xs font-black text-slate-900">{size.quantity}</p>
                              <p className="text-[11px] font-black text-orange-600">₹{size.price}</p>
                            </div>
                            <button 
                              onClick={() => removeSize(size.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#e8dfdc] bg-[#f8f5f3] px-6 py-4 flex gap-3 flex-shrink-0">
              <button 
                onClick={() => { setShowCategoryModal(false); setShowItemModal(false); }} 
                className="flex-1 px-4 py-3 border border-[#d8ccc3] text-slate-700 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={showCategoryModal ? saveCategory : saveItem} 
                className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;