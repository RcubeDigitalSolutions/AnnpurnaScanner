import React, { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Search, ChevronDown, ChevronUp, Home as HomeIcon, UtensilsCrossed, ClipboardList, Receipt, Users, X } from 'lucide-react'
import Order from './Order'
import restaurantApi from '../../../api/restaurantApi'

const Menu = () => {
  const { restaurantId, tableNumber: tableParam } = useParams()
  if (!restaurantId || !tableParam) {
    return <Navigate to="/" replace />
  }
  const tableNumber = tableParam || ''
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [restaurantInfo, setRestaurantInfo] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCartModal, setShowCartModal] = useState(false)
  const [expandedItems, setExpandedItems] = useState({})
  const [itemNotes, setItemNotes] = useState({})
  const [activeNav, setActiveNav] = useState('menu')
  const [showMenuItems, setShowMenuItems] = useState(true)
  const [selectedExtras, setSelectedExtras] = useState({})
  const [showMiniCart, setShowMiniCart] = useState(true)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [latestOrder, setLatestOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  // menu data fetched from server
  const [menuItems, setMenuItems] = useState([])

  const [categories, setCategories] = useState([])
  // track user-selected size option for items with multiple choices
  const [sizeSelection, setSizeSelection] = useState({})

  const trackingStorageKey = `latestOrder:${restaurantId || 'unknown'}:${tableNumber || 'unknown'}`

  const ORDER_PHASE_LABELS = {
    pending: 'Pending',
    accepted: 'Confirmed',
    preparing: 'In Process',
    ongoing: 'In Process',
    served: 'Ready / Served',
    completed: 'Completed',
    paid: 'Completed',
    cancelled: 'Cancelled',
  }

  const ORDER_PHASE_CLASS = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    preparing: 'bg-sky-100 text-sky-700 border-sky-200',
    ongoing: 'bg-sky-100 text-sky-700 border-sky-200',
    served: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
  }

  // compute price helper (taking selected size into account)
  const getItemPrice = (item) => {
    const selected = sizeSelection[item.id];
    if (selected && item.sizes) {
      const sizeObj = item.sizes.find(s => s.name === selected || s.quantity === selected);
      if (sizeObj && typeof sizeObj.price === 'number') return sizeObj.price;
    }
    if (typeof item.price === 'number' && item.price > 0) return item.price;
    if (item.sizes && item.sizes.length > 0) return item.sizes[0].price;
    return 0;
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category.name === selectedCategory
    const isAvailable = item.available === true
    return matchesSearch && matchesCategory && isAvailable
  })

  const addToCart = (item, sizeKeyOverride) => {
    const sizeKey = sizeKeyOverride || sizeSelection[item.id] || item.selectedSize || 'regular';
    const price = getItemPrice({ ...item, selectedSize: sizeKey });
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.selectedSize === sizeKey)
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id && cartItem.selectedSize === sizeKey
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              price,
            }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1, selectedSize: sizeKey, price }])
    }
  }

  const removeFromCart = (itemId, sizeKeyOverride) => {
    const sizeKey = sizeKeyOverride || sizeSelection[itemId] || 'regular';
    const existingItem = cart.find(cartItem => cartItem.id === itemId && cartItem.selectedSize === sizeKey);
    if (!existingItem) return;
    if (existingItem.quantity === 1) {
      setCart(cart.filter(cartItem => !(cartItem.id === itemId && cartItem.selectedSize === sizeKey)));
    } else {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId && cartItem.selectedSize === sizeKey
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    }
  }

  const getItemQuantity = (itemId, itemName) => {
    const sizeKey = sizeSelection[itemId] || 'regular';
    const item = cart.find(cartItem =>
      cartItem.id === itemId &&
      cartItem.selectedSize === sizeKey &&
      (!itemName || cartItem.name === itemName)
    );
    return item ? item.quantity : 0
  }

  const getExtraCharges = (noteText = '') => {
    const extraChargeRules = [
      { label: 'Extra Cheese', amount: 40, keywords: ['cheese', 'extra cheese'] },
      { label: 'Extra Sauce', amount: 20, keywords: ['sauce', 'extra sauce', 'gravy'] },
      { label: 'Extra Mayo', amount: 15, keywords: ['mayo', 'mayonnaise', 'extra mayo'] },
      { label: 'Extra Dip', amount: 25, keywords: ['dip', 'extra dip'] },
      { label: 'Extra Paneer', amount: 60, keywords: ['paneer', 'extra paneer'] },
      { label: 'Extra Chicken', amount: 90, keywords: ['chicken', 'extra chicken', 'double chicken'] },
      { label: 'Extra Butter', amount: 30, keywords: ['butter', 'extra butter'] },
      { label: 'Extra Cream', amount: 25, keywords: ['cream', 'extra cream'] }
    ]

    const instructions = noteText
      .split(/\n|,/)
      .map(instruction => instruction.trim().toLowerCase())
      .filter(Boolean)

    const matchedExtras = []

    instructions.forEach(instruction => {
      const rule = extraChargeRules.find(extraRule =>
        extraRule.keywords.some(keyword => instruction.includes(keyword))
      )

      if (rule) {
        matchedExtras.push({
          label: rule.label,
          amount: rule.amount,
          instruction
        })
      }
    })

    const total = matchedExtras.reduce((sum, item) => sum + item.amount, 0)
    return { total, matchedExtras }
  }

  const getTotalAmount = () => {
    const extrasOptions = [
      { id: 'cheese', amount: 40 },
      { id: 'paneer', amount: 60 },
      { id: 'chicken', amount: 90 },
      { id: 'sauce', amount: 20 },
      { id: 'butter', amount: 30 },
      { id: 'mayo', amount: 15 },
      { id: 'cream', amount: 25 }
    ]

    const getItemExtrasTotal = (item) => {
      const cartKey = `${item.id}__${item.selectedSize || 'regular'}`
      const itemExtras = selectedExtras[cartKey] || {}
      return Object.entries(itemExtras)
        .filter(([_, isSelected]) => isSelected)
        .reduce((sum, [extraId]) => {
          const extra = extrasOptions.find(e => e.id === extraId)
          return sum + (extra?.amount || 0)
        }, 0)
    }

    return cart.reduce((total, item) => {
      const itemExtras = getItemExtrasTotal(item)
      return total + ((item.price + itemExtras) * item.quantity)
    }, 0)
  }

  const toggleReadMore = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const truncateText = (text, wordLimit = 8) => {
    const words = text.split(' ')
    if (words.length <= wordLimit) return text
    return words.slice(0, wordLimit).join(' ') + '...'
  }

  useEffect(() => {
    if (cart.length > 0) {
      setShowMiniCart(true)
      setShowRemoveConfirm(false)
    }
  }, [cart.length])

  useEffect(() => {
    if (!restaurantId || !tableNumber) return;
    const savedOrderId = localStorage.getItem(trackingStorageKey);
    if (savedOrderId) {
      setLatestOrder((prev) => prev?._id ? prev : { _id: savedOrderId, status: 'pending' });
    }
  }, [restaurantId, tableNumber, trackingStorageKey]);

  // poll latest order status for live customer tracking
  useEffect(() => {
    if (!latestOrder?._id) return;

    let mounted = true;
    const terminalStatuses = ['cancelled', 'completed', 'paid'];

    const refreshOrder = async () => {
      try {
        const res = await restaurantApi.getOrderById(latestOrder._id);
        if (!mounted) return;
        const serverOrder = res?.data?.order;
        if (!serverOrder) return;
        setLatestOrder(serverOrder);
      } catch (err) {
        // keep previous order data on transient network issues
      }
    };

    refreshOrder();
    const timer = setInterval(() => {
      if (!terminalStatuses.includes(String(latestOrder.status || '').toLowerCase())) {
        refreshOrder();
      }
    }, 7000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [latestOrder?._id, latestOrder?.status]);

  const handleOrderPlaced = (order) => {
    setLatestOrder(order);
    setShowOrderDetails(true);
    if (order?._id) {
      localStorage.setItem(trackingStorageKey, order._id);
    }
  };

  // fetch menu from server when restaurantId is available
  useEffect(() => {
    if (!restaurantId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [menuRes, infoRes] = await Promise.all([
          restaurantApi.getPublicMenu(restaurantId),
          restaurantApi.getRestaurantInfo(restaurantId)
        ]);
        if (!infoRes.data.restaurant) {
          setError('Restaurant not found');
          return;
        }
        let items = menuRes.data.menuItems || [];
        // normalize each item: assign unique id, ensure price and flags
        items = items.map((i, idx) => {
          const baseId = i._id || i.id || '';
          const uniqueId = `${restaurantId}-${baseId}-${idx}`;
          const obj = { ...i, id: uniqueId };
          if (typeof obj.price !== 'number' || obj.price === 0) {
            obj.price = (obj.sizes && obj.sizes[0] ? obj.sizes[0].price : 0);
          }
          obj.veg = obj.foodType !== 'nonveg';
          if (typeof obj.available !== 'boolean') obj.available = true;
          return obj;
        });
        setMenuItems(items);
        // compute categories from AVAILABLE items only, preserving images when available
        const availableItems = items.filter(i => i.available === true);
        const catMap = {};
        availableItems.forEach(i => {
          const cname = i.category?.name;
          if (cname) {
            if (!catMap[cname]) {
              catMap[cname] = { name: cname, image: i.category?.picture || '' };
            }
          }
        });
        let cats = Object.values(catMap);
        cats = [{ name: 'All', image: '' }, ...cats];
        setCategories(cats);
        if (!selectedCategory) {
          if (cats.length === 2) {
            setSelectedCategory(cats[1].name);
          } else {
            setSelectedCategory('All');
          }
        }
        setRestaurantInfo(infoRes.data.restaurant);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading menu, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        {/* Restaurant Info */}
        <div className="border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 sm:h-12 sm:w-12">
                <UtensilsCrossed className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-gray-900 sm:text-lg">{restaurantInfo?.name || 'Restaurant'}</h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-700 sm:text-sm">
                <UtensilsCrossed className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{tableNumber}</span>
              </div>
              <button className="flex items-center gap-1 rounded-full border-2 border-teal-500 px-2.5 py-1 text-xs font-semibold text-teal-600 whitespace-nowrap sm:gap-2 sm:px-3 sm:py-1.5 sm:text-sm">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Group Order</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search item"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700">
              Filters
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto px-4 py-3">
          <div className="flex gap-3">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className="relative flex-shrink-0"
              >
                <div className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 ${
                  selectedCategory === category.name
                    ? 'border-orange-500'
                    : 'border-gray-200'
                }`}>
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <UtensilsCrossed className="h-8 w-8 text-orange-500" />
                    </div>
                  )}
                  {selectedCategory === category.name && (
                    <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs font-medium text-orange-600">
                  {category.name.split(' ')[0]}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Title */}
        <div className="border-b border-gray-200 bg-white px-4 py-3">
          <button
            onClick={() => setShowMenuItems((prev) => !prev)}
            className="flex w-full items-center justify-between"
          >
            <h2 className="text-base font-bold text-gray-900">
              {selectedCategory} ({filteredItems.length})
            </h2>
            {showMenuItems ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      {latestOrder && (
        <section className="mx-4 mt-4 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Your Last Order</p>
              <p className="text-sm font-bold text-slate-900">
                Order No: {latestOrder.orderNumber || 'N/A'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Total: ₹{Number(latestOrder.totalPrice || 0).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${ORDER_PHASE_CLASS[latestOrder.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {ORDER_PHASE_LABELS[latestOrder.status] || String(latestOrder.status || 'Pending')}
              </span>
              <button
                type="button"
                onClick={() => setShowOrderDetails((prev) => !prev)}
                className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700"
              >
                {showOrderDetails ? 'Hide Order' : 'Show Order'}
              </button>
            </div>
          </div>

          {showOrderDetails && (
            <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/30 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-2">Order Items</p>
              <div className="space-y-2">
                {(latestOrder.items || []).map((it, idx) => (
                  <div key={`${it.name}-${idx}`} className="flex items-center justify-between rounded-lg border border-orange-100 bg-white px-2 py-2 text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{it.name}</p>
                      <p className="text-slate-500">Size: {it.size || 'Regular'} • Qty: {it.quantity || 0}</p>
                    </div>
                    <p className="font-bold text-orange-700">₹{Number((it.price || 0) * (it.quantity || 0)).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Menu Items */}
      {showMenuItems && (
        <main className={`bg-white px-4 ${cart.length > 0 && showMiniCart ? 'pb-28' : 'pb-6'}`}>
          {filteredItems.map(item => (
            <div key={item.id} className="border-b border-gray-200 py-4">
              <div className="flex gap-3">
                {/* Veg/Non-veg Indicator */}
                <div className="flex-shrink-0">
                  <div className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                    item.veg 
                      ? 'border-green-600' 
                      : 'border-red-600'
                  }`}>
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      item.veg 
                        ? 'bg-green-600' 
                        : 'bg-red-600'
                    }`}></div>
                  </div>
                </div>

                <div className="flex-1">
                  {/* Item Name and Price */}
                  <div className="mb-1">
                    <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                    <p className="mt-0.5 text-base font-semibold text-gray-900">
                      ₹ {getItemPrice(item)}.00 {item.available ? '' : '(Unavailable)'}
                    </p>
                    {item.sizes && item.sizes.length > 1 && (
                      <p className="mt-1 text-sm text-gray-500">
                        Available sizes: {item.sizes.map(s => `${s.name} ₹${s.price}`).join(', ')} — Select in cart
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-2">
                    <p className="text-sm text-gray-500">
                      {expandedItems[item.id] ? item.description : truncateText(item.description || '')}
                      {item.description.split(' ').length > 8 && (
                        <button
                          onClick={() => toggleReadMore(item.id)}
                          className="ml-1 font-medium text-orange-600"
                        >
                          {expandedItems[item.id] ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right-side Add/Quantity Controls */}
                <div className="flex w-24 flex-shrink-0 items-start justify-end">
                  {getItemQuantity(item.id, item.name) === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.available}
                      className={`rounded-xl px-4 py-1.5 text-sm font-semibold text-white shadow-lg transition ${item.available ? 'bg-orange-600 hover:bg-orange-500' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                      {item.available ? '+ Add' : 'Unavailable'}
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-3 rounded-lg border-2 border-orange-600 px-3 py-1">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-lg font-bold text-orange-600"
                      >
                        −
                      </button>
                      <span className="min-w-[20px] text-center text-sm font-semibold text-orange-600">
                        {getItemQuantity(item.id, item.name)}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="text-lg font-bold text-orange-600"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-base text-gray-500">No menu items available. Please check back later or contact the restaurant.</p>
            </div>
          )}
        </main>
      )}

      {/* Bottom Navigation */}
      {/* <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-around px-2 py-2">
          <button 
            onClick={() => setActiveNav('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeNav === 'home' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveNav('menu')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeNav === 'menu' ? 'text-orange-600' : 'text-gray-400'
            }`}
          >
            <UtensilsCrossed className="h-6 w-6" />
            <span className="text-xs font-medium">Menu</span>
          </button>
          
          <button 
            onClick={() => {
              setActiveNav('orders')
              if (cart.length > 0) setShowCartModal(true)
            }}
            className={`relative flex flex-col items-center gap-1 px-4 py-2 ${
              activeNav === 'orders' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <ClipboardList className="h-6 w-6" />
            <span className="text-xs font-medium">Orders</span>
            {cart.length > 0 && (
              <span className="absolute -right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveNav('paybill')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeNav === 'paybill' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <Receipt className="h-6 w-6" />
            <span className="text-xs font-medium">Pay Bill</span>
          </button>
        </div>
      </nav> */}

      {cart.length > 0 && showMiniCart && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="flex items-center justify-between gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-3 shadow-lg">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-orange-700">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} Items · ₹ {getTotalAmount().toFixed(2)}
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={() => setShowCartModal(true)}
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-orange-500"
              >
                View Cart
              </button>
              {showRemoveConfirm ? (
                <button
                  onClick={() => {
                    setCart([])
                    setItemNotes({})
                    setSelectedExtras({})
                    setShowMiniCart(false)
                    setShowRemoveConfirm(false)
                  }}
                  className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-md transition hover:bg-red-50"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => setShowRemoveConfirm(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-600 shadow-md transition hover:bg-orange-100"
                  aria-label="Dismiss cart summary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Order
        cart={cart}
        restaurantId={restaurantId}
        tableNumber={tableNumber}
        showCartModal={showCartModal}
        setShowCartModal={setShowCartModal}
        removeFromCart={removeFromCart}
        addToCart={addToCart}
        itemNotes={itemNotes}
        setItemNotes={setItemNotes}
        getTotalAmount={getTotalAmount}
        getExtraCharges={getExtraCharges}
        setCart={setCart}
        selectedExtras={selectedExtras}
        setSelectedExtras={setSelectedExtras}
        sizeSelection={sizeSelection}
        setSizeSelection={setSizeSelection}
        onOrderPlaced={handleOrderPlaced}
      />
    </div>
  )
}

export default Menu
