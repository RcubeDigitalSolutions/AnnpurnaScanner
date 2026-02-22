import React, { useState } from 'react'
import { X, StickyNote } from 'lucide-react'

const sizeOptions = [
  { value: 'regular', label: 'Regular', addOn: 0 },
  { value: 'medium', label: 'Medium', addOn: 40 },
  { value: 'large', label: 'Large', addOn: 80 }
]

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
  setSelectedExtras
}) => {
  const [openNoteEditors, setOpenNoteEditors] = useState({})
  const [noteDrafts, setNoteDrafts] = useState({})

  const getSizeAddOn = (selectedSize) => {
    const option = sizeOptions.find(size => size.value === selectedSize)
    return option ? option.addOn : 0
  }

  const getItemExtrasTotal = (itemId) => {
    const itemExtras = selectedExtras[itemId] || {}
    return Object.entries(itemExtras)
      .filter(([_, isSelected]) => isSelected)
      .reduce((sum, [extraId]) => {
        const extra = extrasOptions.find(e => e.id === extraId)
        return sum + (extra?.amount || 0)
      }, 0)
  }

  const getItemTotalPrice = (item) => {
    const sizeAddOn = getSizeAddOn(item.selectedSize)
    const extrasAddOn = getItemExtrasTotal(item.id)
    return (item.price + sizeAddOn + extrasAddOn) * item.quantity
  }

  const toggleExtra = (itemId, extraId) => {
    setSelectedExtras(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [extraId]: !prev[itemId]?.[extraId]
      }
    }))
  }

  const handleSizeChange = (itemId, sizeValue) => {
    setCart(prevCart => prevCart.map(item => (
      item.id === itemId ? { ...item, selectedSize: sizeValue } : item
    )))
  }

  const toggleNoteEditor = (itemId) => {
    setOpenNoteEditors(prev => {
      const isOpening = !prev[itemId]

      if (isOpening) {
        setNoteDrafts(currentDrafts => ({
          ...currentDrafts,
          [itemId]: ''
        }))
      }

      return { ...prev, [itemId]: isOpening }
    })
  }

  const parseInstructions = (text = '') => {
    return text
      .split(/\n|,/)
      .map(instruction => instruction.trim())
      .filter(Boolean)
  }

  const handleSaveInstructions = (itemId) => {
    const draftText = (noteDrafts[itemId] || '').trim()

    if (!draftText) {
      setItemNotes(prev => {
        const next = { ...prev }
        delete next[itemId]
        return next
      })
      setOpenNoteEditors(prev => ({ ...prev, [itemId]: false }))
      return
    }

    const normalized = parseInstructions(draftText).join('\n')

    setItemNotes(prev => ({
      ...prev,
      [itemId]: normalized
    }))
    setOpenNoteEditors(prev => ({ ...prev, [itemId]: false }))
  }

  const handleRemoveInstruction = (itemId, removeIndex) => {
    const instructions = parseInstructions(itemNotes[itemId])
    const updated = instructions.filter((_, index) => index !== removeIndex)

    setItemNotes(prev => {
      const next = { ...prev }

      if (updated.length === 0) {
        delete next[itemId]
      } else {
        next[itemId] = updated.join('\n')
      }

      return next
    })
  }

  if (!showCartModal || cart.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center sm:p-4">
      <div className="relative flex h-auto max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl sm:max-h-[88vh] sm:rounded-2xl">
        <button
          onClick={() => setShowCartModal(false)}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-gray-200 px-4 py-4 pr-14 sm:px-5 sm:pr-16">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Your Order Summary</h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            {cart.length} item{cart.length > 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="overflow-y-auto px-4 py-4 sm:px-5">
          {cart.map(item => {
            const extraChargeInfo = getExtraCharges(itemNotes[item.id])

            return (
            <div key={item.id} className="mb-3 rounded-xl border border-gray-100 bg-gray-50/40 p-3 last:mb-0">
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
                        onClick={() => removeFromCart(item.id)}
                        className="flex h-8 w-8 items-center justify-center text-lg font-bold text-orange-600"
                      >
                        −
                      </button>
                      <span className="min-w-7 text-center text-sm font-semibold text-orange-600">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="flex h-8 w-8 items-center justify-center text-lg font-bold text-orange-600"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Size Options</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {sizeOptions.map(size => {
                        const isSelected = (item.selectedSize || 'regular') === size.value
                        return (
                          <button
                            key={size.value}
                            onClick={() => handleSizeChange(item.id, size.value)}
                            className={`rounded-lg border px-2 py-1.5 text-left text-[11px] font-semibold transition ${
                              isSelected
                                ? 'border-orange-600 bg-orange-50 text-orange-700'
                                : 'border-gray-300 bg-white text-gray-600'
                            }`}
                          >
                            <span className="block">{size.label}</span>
                            <span className="block text-[10px] font-medium opacity-80">
                              {size.addOn > 0 ? `+₹${size.addOn}` : 'Base'}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Add Extras</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {extrasOptions.map(extra => {
                        const isSelected = selectedExtras[item.id]?.[extra.id]
                        return (
                          <button
                            key={extra.id}
                            onClick={() => toggleExtra(item.id, extra.id)}
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
                      onClick={() => toggleNoteEditor(item.id)}
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

                  {openNoteEditors[item.id] && (
                    <div className="mt-2 rounded-lg border border-gray-200 bg-white p-2">
                      <textarea
                        rows={3}
                        placeholder="Separate each item by comma or new line"
                        value={noteDrafts[item.id] || ''}
                        onChange={(e) => setNoteDrafts(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                      <p className="mt-1 text-[10px] font-semibold text-orange-700">Detected extras: cheese (₹40), paneer (₹60), chicken (₹90), sauce (₹20), mayo (₹15), butter (₹30), cream (₹25)</p>
                      <p className="mt-1 text-[11px] text-gray-500">Example: less spicy, cheese, no onion, paneer</p>
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setOpenNoteEditors(prev => ({ ...prev, [item.id]: false }))}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveInstructions(item.id)}
                          className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  )}

                  {itemNotes[item.id] && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {parseInstructions(itemNotes[item.id]).map((instruction, index) => (
                        <span
                          key={`${item.id}-note-${index}`}
                          className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-700"
                        >
                          {instruction}
                          <button
                            onClick={() => handleRemoveInstruction(item.id, index)}
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
              onClick={() => {
                alert('Order placed successfully!')
                setCart([])
                setItemNotes({})
                setShowCartModal(false)
              }}
              className="w-full rounded-xl bg-white px-8 py-3 text-base font-bold text-orange-600 shadow-lg transition hover:bg-gray-50 sm:w-auto"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
