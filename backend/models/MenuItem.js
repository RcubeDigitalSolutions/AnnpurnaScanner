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

    // Better: allow multiple sizes
    sizes: [
      {
        name: { type: String, required: true }, // Small, Medium
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", MenuItemSchema);