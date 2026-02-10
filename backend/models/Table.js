const mongoose = require("mongoose");
const TableSchema = new mongoose.Schema(
  {
    restaurant: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    number: { type: Number, required: true },
    status: { type: String, enum: ["active","inactive"], default: "active" },
    
  },
  { timestamps: true }
);