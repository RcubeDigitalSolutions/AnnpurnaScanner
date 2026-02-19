import React, { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Home as HomeIcon, UtensilsCrossed, ClipboardList, Receipt, Users } from 'lucide-react'
import Order from './Order'

const Menu = () => {
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Napoli Fold Sandwich')
  const [showCartModal, setShowCartModal] = useState(false)
  const [expandedItems, setExpandedItems] = useState({})
  const [itemNotes, setItemNotes] = useState({})
  const [activeNav, setActiveNav] = useState('menu')
  const [showCategoryTabs, setShowCategoryTabs] = useState(true)
  const [selectedExtras, setSelectedExtras] = useState({})

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
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              selectedSize: item.selectedSize || cartItem.selectedSize || 'regular'
            }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1, selectedSize: item.selectedSize || 'regular' }])
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
    const sizePriceMap = {
      regular: 0,
      medium: 40,
      large: 80
    }

    const extrasOptions = [
      { id: 'cheese', amount: 40 },
      { id: 'paneer', amount: 60 },
      { id: 'chicken', amount: 90 },
      { id: 'sauce', amount: 20 },
      { id: 'butter', amount: 30 },
      { id: 'mayo', amount: 15 },
      { id: 'cream', amount: 25 }
    ]

    const getItemExtrasTotal = (itemId) => {
      const itemExtras = selectedExtras[itemId] || {}
      return Object.entries(itemExtras)
        .filter(([_, isSelected]) => isSelected)
        .reduce((sum, [extraId]) => {
          const extra = extrasOptions.find(e => e.id === extraId)
          return sum + (extra?.amount || 0)
        }, 0)
    }

    return cart.reduce((total, item) => {
      const sizeExtra = sizePriceMap[item.selectedSize] || 0
      const itemExtras = getItemExtrasTotal(item.id)
      return total + ((item.price + sizeExtra + itemExtras) * item.quantity)
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

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
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
                <h1 className="truncate text-sm font-bold text-gray-900 sm:text-lg">Big Yellow Door</h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-700 sm:text-sm">
                <UtensilsCrossed className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>15</span>
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
        {showCategoryTabs && (
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
        )}

        {/* Category Title */}
        <div className="border-b border-gray-200 bg-white px-4 py-3">
          <button
            onClick={() => setShowCategoryTabs((prev) => !prev)}
            className="flex w-full items-center justify-between"
          >
            <h2 className="text-base font-bold text-gray-900">
              {selectedCategory} ({filteredItems.length})
            </h2>
            {showCategoryTabs ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
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

      <Order
        cart={cart}
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
      />
    </div>
  )
}

export default Menu
