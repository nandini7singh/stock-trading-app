import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
  quantity: Number,
  type: { type: String, enum: ["buy", "sell"] }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);