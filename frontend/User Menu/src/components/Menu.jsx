import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp, X, Home as HomeIcon, UtensilsCrossed, ClipboardList, Receipt, StickyNote, Users } from 'lucide-react'

const Menu = () => {
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Napoli Fold Sandwich')
  const [showCartModal, setShowCartModal] = useState(false)
  const [expandedItems, setExpandedItems] = useState({})
  const [itemNotes, setItemNotes] = useState({})
  const [orderNote, setOrderNote] = useState('')
  const [activeNav, setActiveNav] = useState('menu')

  // Sample menu data - Replace with API call later
  const menuItems = [
    {
      id: 1,
      name: 'Chicken & Pesto',
      category: 'Napoli Fold Sandwich',
      price: 299,
      description: 'Warm Panuzzo Stuffed With Herb Marinated Grilled Chicken, Pesto, Goat Cheese, Sun Dried Tomatoes, Olives & Rocca Leaves',
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
      veg: false
    },
    {
      id: 2,
      name: 'Pesto & Cream Cheese',
      category: 'Napoli Fold Sandwich',
      price: 269,
      description: 'Soft Crispy Panozoo Stuffed With Chipotle Marinated Grilled Cottage Cheese, Olives, Sweet Corn, Pesto & Cheese',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
      veg: true
    },
    {
      id: 3,
      name: 'Chipotle Cottage Cheese',
      category: 'Napoli Fold Sandwich',
      price: 269,
      description: 'Soft Crispy Panozoo Stuffed With Chipotle Marinated Cottage Cheese & Fresh Vegetables',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      veg: true
    },
    {
      id: 4,
      name: 'Grilled Peri Peri Chicken',
      category: 'Napoli Fold Sandwich',
      price: 299,
      description: 'Tender Grilled Chicken With Our House Made Peri Peri Sauce',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
      veg: false
    },
    {
      id: 5,
      name: 'Avocado Toast',
      category: 'Taste The Trends',
      price: 369,
      description: 'Fresh Avocado Mash On Toasted Sourdough Bread',
      image: 'https://images.unsplash.com/photo-1589301773859-2e3cf8a35295?w=400',
      veg: true
    },
    {
      id: 6,
      name: 'Cold Coffee',
      category: 'Coolers',
      price: 180,
      description: 'Refreshing Cold Coffee With Ice Cream',
      image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
      veg: true
    }
  ]

  const categories = [
    { name: 'Napoli Fold Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=100' },
    { name: 'Taste The Trends', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100' },
    { name: 'Coolers', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=100' },
    { name: 'Byd Summer', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=100' },
    { name: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100' }
  ]

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId)
    if (existingItem.quantity === 1) {
      setCart(cart.filter(cartItem => cartItem.id !== itemId))
    } else {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ))
    }
  }

  const getItemQuantity = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId)
    return item ? item.quantity : 0
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
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

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        {/* Restaurant Info */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                <UtensilsCrossed className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Big Yellow Door</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm">
                <UtensilsCrossed className="h-4 w-4" />
                <span>15</span>
              </div>
              <button className="flex items-center gap-2 rounded-full border-2 border-teal-500 px-3 py-1.5 text-sm font-semibold text-teal-600">
                <Users className="h-4 w-4" />
                Group Order
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
                  {index === 0 ? (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <UtensilsCrossed className="h-8 w-8 text-orange-500" />
                    </div>
                  ) : (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
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

        {/* Category Title */}
        <div className="border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              {selectedCategory} ({filteredItems.length})
            </h2>
            <ChevronUp className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      </header>

      {/* Menu Items */}
      <main className="bg-white px-4">
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
                  <p className="mt-0.5 text-base font-semibold text-gray-900">₹ {item.price}.00</p>
                </div>

                {/* Description */}
                <div className="mb-2">
                  <p className="text-sm text-gray-500">
                    {expandedItems[item.id] ? item.description : truncateText(item.description)}
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

                {/* Add Button or Quantity Controls */}
                {getItemQuantity(item.id) === 0 ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="rounded-lg border-2 border-orange-600 px-6 py-1.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                  >
                    + Add
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
                      {getItemQuantity(item.id)}
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

              {/* Item Image */}
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-lg">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-base text-gray-500">No items found</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
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
      </nav>

      {/* Cart Modal */}
      {showCartModal && cart.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="relative w-full max-w-2xl rounded-t-3xl bg-white sm:rounded-2xl" style={{ maxHeight: '85vh' }}>
            {/* Close Button */}
            <button
              onClick={() => setShowCartModal(false)}
              className="absolute -top-12 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-gray-700 text-white"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-xl font-bold text-gray-900">Your Order Summary</h2>
            </div>

            {/* Cart Items */}
            <div className="max-h-96 overflow-y-auto px-5 py-4">
              {cart.map(item => (
                <div key={item.id} className="mb-4 border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-start gap-3">
                    {/* Veg/Non-veg Indicator */}
                    <div className="flex-shrink-0 pt-1">
                      <div className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                        item.veg ? 'border-green-600' : 'border-red-600'
                      }`}>
                        <div className={`h-2.5 w-2.5 rounded-full ${
                          item.veg ? 'bg-green-600' : 'bg-red-600'
                        }`}></div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                        <div className="ml-4 flex items-center gap-3 rounded-lg border-2 border-orange-600 px-3 py-1">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-lg font-bold text-orange-600"
                          >
                            −
                          </button>
                          <span className="min-w-[20px] text-center text-sm font-semibold text-orange-600">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="text-lg font-bold text-orange-600"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            const note = prompt('Add a note for this item:')
                            if (note) {
                              setItemNotes(prev => ({ ...prev, [item.id]: note }))
                            }
                          }}
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                        >
                          <StickyNote className="h-4 w-4" />
                          {itemNotes[item.id] ? 'Edit Note' : 'Add Note'}
                        </button>
                        <p className="text-base font-semibold text-gray-900">
                          ₹ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {itemNotes[item.id] && (
                        <p className="mt-1 text-xs text-gray-600 italic">Note: {itemNotes[item.id]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Note */}
            <div className="border-t border-gray-200 px-5 py-4">
              <div className="relative">
                <StickyNote className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter a note for the entire order"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* Total and Place Order Button */}
            <div className="bg-orange-600 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">₹ {getTotalAmount().toFixed(2)}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/80">SUBTOTAL</p>
                </div>
                <button 
                  onClick={() => {
                    alert('Order placed successfully!')
                    setCart([])
                    setItemNotes({})
                    setOrderNote('')
                    setShowCartModal(false)
                  }}
                  className="rounded-lg bg-white px-8 py-3 text-base font-bold text-orange-600 shadow-lg transition hover:bg-gray-50"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu
