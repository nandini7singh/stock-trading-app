import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  stock: String,
  amount: Number,
  type: String
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);