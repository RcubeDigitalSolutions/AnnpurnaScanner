const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: { type: String, required: true, trim: true },

    description: { type: String, default: '' },
    price: { type: Number, default: 0 }, // fallback for single-size items
    available: { type: Boolean, default: true },

    foodType: { type: String, enum: ['veg', 'nonveg'], default: 'veg' },

    // allow multiple sizes; price is stored per size, first size used as default
    sizes: [
      {
        name: { type: String, required: true }, // Small, Medium
        price: { type: Number, required: true },
      },
    ],

    // optional add-ons shown in customer cart (e.g., extra cheese)
    extras: [
      {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", MenuItemSchema);