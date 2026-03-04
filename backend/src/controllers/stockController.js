import Stock from "../models/stockSchema.js";

export const createStock = async (req, res) => {
  const stock = await Stock.create(req.body);
  res.json(stock);
};

export const getAllStocks = async (req, res) => {
  const stocks = await Stock.find();
  res.json(stocks);
};

export const updateStock = async (req, res) => {
  const stock = await Stock.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(stock);
};

export const deleteStock = async (req, res) => {
  await Stock.findByIdAndDelete(req.params.id);
  res.json({ message: "Stock Deleted" });
};