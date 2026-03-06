import Stock from "../models/stockSchema.js";

export const createStock = async (req, res) => {
  try {

    const stock = await Stock.create(req.body);

    res.json(stock);

  } catch (error) {

    res.status(500).json({ message: "Error creating stock" });

  }
};

export const getAllStocks = async (req, res) => {

  try {

    const stocks = await Stock.find();

    res.json(stocks);

  } catch (error) {

    res.status(500).json({ message: "Error fetching stocks" });

  }

};

export const updateStock = async (req, res) => {

  try {

    const stock = await Stock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(stock);

  } catch (error) {

    res.status(500).json({ message: "Error updating stock" });

  }

};

export const deleteStock = async (req, res) => {

  try {

    await Stock.findByIdAndDelete(req.params.id);

    res.json({ message: "Stock Deleted" });

  } catch (error) {

    res.status(500).json({ message: "Error deleting stock" });

  }

};