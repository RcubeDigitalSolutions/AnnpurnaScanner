const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    phoneNumber: { type: String, required: true },

    address: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    totalTable: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", RestaurantSchema);