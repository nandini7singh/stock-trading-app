import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  symbol: String,
  name: String,
  price: Number
});

export default mongoose.model("Stock", stockSchema);