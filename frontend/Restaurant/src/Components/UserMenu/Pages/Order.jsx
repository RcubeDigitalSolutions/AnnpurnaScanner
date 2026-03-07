import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { X, StickyNote, User, Phone } from 'lucide-react'
import restaurantApi from '../../../api/restaurantApi'

const extrasOptions = [
  { id: 'cheese', label: 'Cheese', amount: 40 },
  { id: 'paneer', label: 'Paneer', amount: 60 },
  { id: 'chicken', label: 'Chicken', amount: 90 },
  { id: 'sauce', label: 'Sauce', amount: 20 },
  { id: 'butter', label: 'Butter', amount: 30 },
  { id: 'mayo', label: 'Mayo', amount: 15 },
  { id: 'cream', label: 'Cream', amount: 25 }
]

const Order = ({
  cart,
  tableNumber,
  restaurantId,
  showCartModal,
  setShowCartModal,
  removeFromCart,
  addToCart,
  itemNotes,
  setItemNotes,
  getTotalAmount,
  getExtraCharges,
  setCart,
  selectedExtras,
  setSelectedExtras,
  onOrderPlaced,
  setSizeSelection,
}) => {
  const [openNoteEditors, setOpenNoteEditors] = useState({})
  const [noteDrafts, setNoteDrafts] = useState({})
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '' })
  const [orderNumber, setOrderNumber] = useState('')
  const [formErrors, setFormErrors] = useState({})

  const getCartItemKey = (itemId, selectedSize = 'regular') => `${itemId}__${selectedSize}`

  const normalizeCartItems = useCallback((items) => {
    const byKey = new Map()
    const order = []

    items.forEach((item) => {
      const key = getCartItemKey(item.id, item.selectedSize || 'regular')
      if (!byKey.has(key)) {
        byKey.set(key, { ...item })
        order.push(key)
      } else {
        const prev = byKey.get(key)
        byKey.set(key, {
          ...prev,
          quantity: (prev.quantity || 0) + (item.quantity || 0),
        })
      }
    })

    return order.map((key) => byKey.get(key))
  }, [])

  // Guard against duplicate rows for same item+size.
  useEffect(() => {
    const normalized = normalizeCartItems(cart)
    const changed =
      normalized.length !== cart.length ||
      normalized.some((item, idx) => {
        const current = cart[idx]
        if (!current) return true
        return (
          item.id !== current.id ||
          (item.selectedSize || 'regular') !== (current.selectedSize || 'regular') ||
          (item.quantity || 0) !== (current.quantity || 0)
        )
      })

    if (changed) {
      setCart(normalized)
    }
  }, [cart, setCart, normalizeCartItems])

  const normalizedCart = useMemo(() => normalizeCartItems(cart), [cart, normalizeCartItems])

  const generateOrderNumber = async () => {
    try {
      const res = await restaurantApi.generateOrderNumber()
      const next = String(res?.data?.orderNumber || '')
      setOrderNumber(next)
      setFormErrors((prev) => {
        const nextErrors = { ...prev }
        delete nextErrors.orderNumber
        return nextErrors
      })
    } catch {
      const ev = new CustomEvent('app-toast', {
        detail: { message: 'Unable to generate order number. Please try again.', type: 'error' },
      })
      window.dispatchEvent(ev)
    }
  }

  const getSizeAddOn = (item, selectedSize) => {
    if (!item || !item.sizes) return 0
    const basePrice = Number(item.price) || 0
    const sizeObj = item.sizes.find(s => (s.name || s.quantity || '') === selectedSize)
    if (!sizeObj) return 0
    const sizePrice = Number(sizeObj.price) || 0
    return sizePrice - basePrice
  }

  const getItemExtrasTotal = (item) => {
    const cartKey = getCartItemKey(item.id, item.selectedSize || 'regular')
    const itemExtras = selectedExtras[cartKey] || {}
    return Object.entries(itemExtras)
      .filter((entry) => entry[1])
      .reduce((sum, [extraId]) => {
        // support dynamic size add-ons encoded as `size_<Name>`
        if (extraId.startsWith('size_')) {
          const sizeName = extraId.slice(5)
          const sizeObj = (item.sizes || []).find(s => (s.name || s.quantity || '').toString() === sizeName)
          if (sizeObj) {
            const base = Number(item.price) || 0
            const add = Number(sizeObj.price) || 0
            const diff = add - base
            return sum + (diff > 0 ? diff : add)
          }
          return sum
        }
        const extra = extrasOptions.find(e => e.id === extraId)
        return sum + (extra?.amount || 0)
      }, 0)
  }

  const getItemTotalPrice = (item) => {
    const sizeAddOn = getSizeAddOn(item, item.selectedSize)
    const extrasAddOn = getItemExtrasTotal(item)
    return (item.price + sizeAddOn + extrasAddOn) * item.quantity
  }

  const toggleExtra = (cartKey, extraId) => {
    setSelectedExtras(prev => ({
      ...prev,
      [cartKey]: {
        ...prev[cartKey],
        [extraId]: !prev[cartKey]?.[extraId]
      }
    }))
  }

  const handleSizeChange = (itemId, currentSize, sizeValue) => {
    setCart(prevCart => {
      const next = [...prevCart]
      const index = next.findIndex((item) => item.id === itemId && (item.selectedSize || 'regular') === currentSize)
      if (index === -1) return prevCart

      const item = next[index]
      if ((item.selectedSize || 'regular') === sizeValue) return prevCart

      const selectedSizeObj = item.sizes?.find(s => (s.name || s.quantity || '') === sizeValue)
      const newPrice = selectedSizeObj ? Number(selectedSizeObj.price) || item.price : item.price

      const mergeIndex = next.findIndex(
        (cartItem, idx) => idx !== index && cartItem.id === itemId && (cartItem.selectedSize || 'regular') === sizeValue
      )

      // If row has quantity > 1, move only one unit to selected size.
      if ((item.quantity || 0) > 1) {
        next[index] = { ...item, quantity: item.quantity - 1 }
        if (mergeIndex !== -1) {
          next[mergeIndex] = {
            ...next[mergeIndex],
            quantity: (next[mergeIndex].quantity || 0) + 1,
          }
        } else {
          next.push({ ...item, selectedSize: sizeValue, price: newPrice, quantity: 1 })
        }
      } else {
        // If row has single quantity, move whole row.
        if (mergeIndex !== -1) {
          next[mergeIndex] = {
            ...next[mergeIndex],
            quantity: (next[mergeIndex].quantity || 0) + 1,
          }
          next.splice(index, 1)
        } else {
          next[index] = { ...item, selectedSize: sizeValue, price: newPrice }
        }
      }

      return next
    })
    // also sync the menu-level size selection so menu buttons reflect this choice
    try {
      setSizeSelection(prev => ({ ...prev, [itemId]: sizeValue }))
    } catch {
      // noop if parent didn't pass setSizeSelection
    }
  }

  const toggleNoteEditor = (cartKey) => {
    setOpenNoteEditors(prev => {
      const isOpening = !prev[cartKey]

      if (isOpening) {
        setNoteDrafts(currentDrafts => ({
          ...currentDrafts,
          [cartKey]: ''
        }))
      }

      return { ...prev, [cartKey]: isOpening }
    })
  }

  const parseInstructions = (text = '') => {
    return text
      .split(/\n|,/)
      .map(instruction => instruction.trim())
      .filter(Boolean)
  }

  const handleSaveInstructions = (cartKey) => {
    const draftText = (noteDrafts[cartKey] || '').trim()

    if (!draftText) {
      setItemNotes(prev => {
        const next = { ...prev }
        delete next[cartKey]
        return next
      })
      setOpenNoteEditors(prev => ({ ...prev, [cartKey]: false }))
      return
    }

    const normalized = parseInstructions(draftText).join('\n')

    setItemNotes(prev => ({
      ...prev,
      [cartKey]: normalized
    }))
    setOpenNoteEditors(prev => ({ ...prev, [cartKey]: false }))
  }

  const handleRemoveInstruction = (cartKey, removeIndex) => {
    const instructions = parseInstructions(itemNotes[cartKey])
    const updated = instructions.filter((_, index) => index !== removeIndex)

    setItemNotes(prev => {
      const next = { ...prev }

      if (updated.length === 0) {
        delete next[cartKey]
      } else {
        next[cartKey] = updated.join('\n')
      }

      return next
    })
  }

  const handleOpenCheckout = () => {
    setFormErrors({})
    setShowCheckoutForm(true)
  }

  const validateCustomerDetails = () => {
    const errors = {}
    const name = customerDetails.name.trim()
    const phone = customerDetails.phone.trim()

    if (!name) {
      errors.name = 'Please enter your name'
    } else if (name.length < 2) {
      errors.name = 'Name should be at least 2 characters'
    }

    if (!phone) {
      errors.phone = 'Please enter your phone number'
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = 'Phone number must be 10 digits'
    }

    if (!/^\d{4}$/.test(orderNumber)) {
      errors.orderNumber = 'Generate a valid 4-digit order number'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()

    if (!validateCustomerDetails()) {
      return
    }

    const orderPayload = {
      restaurantId,
      tableNumber,
      customer: {
        name: customerDetails.name.trim(),
        phone: customerDetails.phone.trim()
      },
      items: cart.map(item => {
        // compute numeric add-on value so server can reconstruct price correctly
        const sizeAddOn = getSizeAddOn(item, item.selectedSize);
        const extrasAddOn = getItemExtrasTotal(item);

        return {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          selectedSize: item.selectedSize || 'regular',
          price: item.price || 0,
          addOns: sizeAddOn + extrasAddOn,
          notes: parseInstructions(itemNotes[getCartItemKey(item.id, item.selectedSize || 'regular')])
        }
      }),
      totalAmount: getTotalAmount(),
      orderNumber,
    }

    try {
      const res = await restaurantApi.createOrder(orderPayload);
      const placedOrder = res?.data?.order;
      const ev = new CustomEvent('app-toast', { detail: { message: `Order placed successfully for ${orderPayload.customer.name}!`, type: 'success' } });
      window.dispatchEvent(ev);
      if (placedOrder && typeof onOrderPlaced === 'function') {
        onOrderPlaced(placedOrder);
      }
    } catch (e) {
      console.error(e);
      // error toast handled by interceptor
    }

    setCart([])
    setItemNotes({})
    setSelectedExtras({})
    setCustomerDetails({ name: '', phone: '' })
    setOrderNumber('')
    setShowCheckoutForm(false)
    setShowCartModal(false)
  }

  if (!showCartModal || normalizedCart.length === 0) {
    return null
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center sm:p-4">
      <div className="relative flex h-auto max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl sm:max-h-[88vh] sm:rounded-2xl">
        <button
          onClick={() => {
            setShowCheckoutForm(false)
            setShowCartModal(false)
          }}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-gray-200 px-4 py-4 pr-14 sm:px-5 sm:pr-16">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Your Order Summary</h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            {normalizedCart.length} item{normalizedCart.length > 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="overflow-y-auto px-4 py-4 sm:px-5">
          {normalizedCart.map(item => {
            const cartKey = getCartItemKey(item.id, item.selectedSize || 'regular')
            const extraChargeInfo = getExtraCharges(itemNotes[cartKey])

            return (
            <div key={`${cartKey}-${item.name}`} className="mb-3 rounded-xl border border-gray-100 bg-gray-50/40 p-3 last:mb-0">
              <div className="flex items-start gap-3">
                <div className="shrink-0 pt-1">
                  <div className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                    item.veg ? 'border-green-600' : 'border-red-600'
                  }`}>
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      item.veg ? 'bg-green-600' : 'bg-red-600'
                    }`}></div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-[15px] font-semibold leading-5 text-gray-900 sm:text-base">{item.name}</h3>
                    <div className="inline-flex w-fit items-center rounded-lg border-2 border-orange-600">
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize || 'regular')}
                        className="flex h-8 w-8 items-center justify-center text-lg font-bold text-orange-600"
                      >
                        −
                      </button>
                      <span className="min-w-7 text-center text-sm font-semibold text-orange-600">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item, item.selectedSize || 'regular')}
                        className="flex h-8 w-8 items-center justify-center text-lg font-bold text-orange-600"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Size Options</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {(item.sizes && item.sizes.length > 0) ? (
                        item.sizes.map(size => {
                          const sizeLabel = size.name || size.quantity || 'Size'
                          const isSelected = (item.selectedSize || '') === sizeLabel
                          const sizePrice = Number(size.price) || 0
                          return (
                            <button
                              key={sizeLabel}
                              onClick={() => handleSizeChange(item.id, item.selectedSize || 'regular', sizeLabel)}
                              className={`rounded-lg border px-2 py-1.5 text-left text-[11px] font-semibold transition ${
                                isSelected
                                  ? 'border-orange-600 bg-orange-50 text-orange-700'
                                  : 'border-gray-300 bg-white text-gray-600'
                              }`}
                            >
                              <span className="block">{sizeLabel}</span>
                              <span className="block text-[10px] font-medium opacity-80">
                                ₹{sizePrice}
                              </span>
                            </button>
                          )
                        })
                      ) : (
                        <p className="text-xs text-gray-500">No sizes available</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Add Extras</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {extrasOptions.map(extra => {
                        const isSelected = selectedExtras[cartKey]?.[extra.id]
                        return (
                          <button
                            key={extra.id}
                            onClick={() => toggleExtra(cartKey, extra.id)}
                            className={`rounded-lg border px-2 py-1.5 text-left text-[11px] font-semibold transition ${
                              isSelected
                                ? 'border-orange-600 bg-orange-50 text-orange-700'
                                : 'border-gray-300 bg-white text-gray-600'
                            }`}
                          >
                            <span className="block">{extra.label}</span>
                            <span className="block text-[10px] font-medium opacity-80">
                              +₹{extra.amount}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <button
                      onClick={() => toggleNoteEditor(cartKey)}
                      className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      <StickyNote className="h-4 w-4" />
                      Add Note
                    </button>
                    <div className="flex flex-col items-end">
                      <p className="text-base font-bold text-gray-900">
                        ₹ {getItemTotalPrice(item).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {extraChargeInfo.total > 0 && (
                    <div className="mt-1 rounded-md bg-orange-50 px-2 py-1.5 text-[11px] text-orange-700">
                      <p className="font-semibold">Extra Charges +₹{extraChargeInfo.total} each</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {extraChargeInfo.matchedExtras.map((extra, index) => (
                          <span
                            key={`${item.id}-extra-${index}`}
                            className="rounded-full bg-white px-2 py-0.5 font-medium"
                          >
                            {extra.label} (+₹{extra.amount})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {openNoteEditors[cartKey] && (
                    <div className="mt-2 rounded-lg border border-gray-200 bg-white p-2">
                      <textarea
                        rows={3}
                        placeholder="Separate each item by comma or new line"
                        value={noteDrafts[cartKey] || ''}
                        onChange={(e) => setNoteDrafts(prev => ({ ...prev, [cartKey]: e.target.value }))}
                        className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                      <p className="mt-1 text-[10px] font-semibold text-orange-700">Detected extras: cheese (₹40), paneer (₹60), chicken (₹90), sauce (₹20), mayo (₹15), butter (₹30), cream (₹25)</p>
                      <p className="mt-1 text-[11px] text-gray-500">Example: less spicy, cheese, no onion, paneer</p>
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setOpenNoteEditors(prev => ({ ...prev, [cartKey]: false }))}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveInstructions(cartKey)}
                          className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  )}

                  {itemNotes[cartKey] && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {parseInstructions(itemNotes[cartKey]).map((instruction, index) => (
                        <span
                          key={`${cartKey}-note-${index}`}
                          className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-700"
                        >
                          {instruction}
                          <button
                            onClick={() => handleRemoveInstruction(cartKey, index)}
                            className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 text-orange-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            )
          })}
        </div>

        <div className="bg-orange-600 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-2xl font-bold leading-none text-white">₹ {getTotalAmount().toFixed(2)}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-white/80">SUBTOTAL</p>
            </div>
            <button
              onClick={handleOpenCheckout}
              className="w-full rounded-xl bg-white px-8 py-3 text-base font-bold text-orange-600 shadow-lg transition hover:bg-gray-50 sm:w-auto"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
      </div>

      {showCheckoutForm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-linear-to-r from-orange-600 to-orange-500 px-5 py-4 text-white">
              <h3 className="text-lg font-bold">Complete Your Order</h3>
              <p className="mt-1 text-sm text-white/90">Enter details to confirm your order</p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4 px-5 py-5">
              <div className="rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Order Summary</p>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Table Number</span>
                  <span className="font-semibold text-gray-900">{tableNumber || 'N/A'}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Items</span>
                  <span className="font-semibold text-gray-900">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-orange-700">₹ {getTotalAmount().toFixed(2)}</span>
                </div>

                <div className="mt-2 rounded-lg border border-orange-100 bg-white px-2 py-2">
                  <p className="text-[11px] font-semibold text-gray-700">Order Number</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="rounded-md bg-gray-100 px-2 py-1 text-sm font-bold tracking-widest text-gray-800">
                      {orderNumber || '----'}
                    </span>
                    <button
                      type="button"
                      onClick={generateOrderNumber}
                      className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-700"
                    >
                      Generate Order Number
                    </button>
                  </div>
                  {formErrors.orderNumber && <p className="mt-1 text-xs font-medium text-red-500">{formErrors.orderNumber}</p>}
                </div>

                <div className="mt-2 max-h-36 space-y-1.5 overflow-y-auto rounded-lg border border-orange-100 bg-white/80 p-2">
                  {normalizedCart.map(item => {
                    const cartKey = getCartItemKey(item.id, item.selectedSize || 'regular')
                    const selectedSize = item.selectedSize || 'regular'
                    const selectedExtrasList = Object.entries(selectedExtras[cartKey] || {})
                      .filter((entry) => entry[1])
                      .map(([extraId]) => extrasOptions.find(extra => extra.id === extraId)?.label)
                      .filter(Boolean)

                    const notesList = parseInstructions(itemNotes[cartKey])

                    return (
                      <div key={`checkout-summary-${item.id}`} className="rounded-md border border-orange-100 bg-white px-2 py-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-gray-900">
                            {item.name} x{item.quantity}
                          </p>
                          <p className="text-xs font-bold text-orange-700">₹ {getItemTotalPrice(item).toFixed(2)}</p>
                        </div>

                        <p className="mt-0.5 text-[11px] text-gray-600">Size: {selectedSize}</p>

                        {selectedExtrasList.length > 0 && (
                          <p className="mt-0.5 text-[11px] text-gray-600">
                            Extras: {selectedExtrasList.join(', ')}
                          </p>
                        )}

                        {notesList.length > 0 && (
                          <p className="mt-0.5 text-[11px] text-gray-600">
                            Notes: {notesList.join(', ')}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full Name</label>
                <div className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 ${
                  formErrors.name ? 'border-red-400' : 'border-gray-300 focus-within:border-orange-500'
                }`}>
                  <User className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    className="w-full border-none bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
                {formErrors.name && <p className="mt-1 text-xs font-medium text-red-500">{formErrors.name}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Phone Number</label>
                <div className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 ${
                  formErrors.phone ? 'border-red-400' : 'border-gray-300 focus-within:border-orange-500'
                }`}>
                  <Phone className="h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={customerDetails.phone}
                    onChange={(e) => {
                      const numbersOnly = e.target.value.replace(/\D/g, '')
                      setCustomerDetails(prev => ({ ...prev, phone: numbersOnly }))
                    }}
                    placeholder="10-digit phone number"
                    className="w-full border-none bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
                {formErrors.phone && <p className="mt-1 text-xs font-medium text-red-500">{formErrors.phone}</p>}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700"
                >
                  Confirm & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Order
