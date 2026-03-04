import Order from "../models/orderSchema.js";
import Transaction from "../models/transactionModel.js";

export const createOrder = async (req, res) => {
  const { stockId, quantity, type } = req.body;

  const order = await Order.create({
    user: req.user.id,
    stock: stockId,
    quantity,
    type
  });

  await Transaction.create({
    user: req.user.id,
    stock: stockId,
    amount: quantity,
    type
  });

  res.json(order);
};

export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("stock");
  res.json(orders);
};