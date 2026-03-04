import Transaction from "../models/transactionModel.js";

export const getUserTransactions = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id });
  res.json(transactions);
};

export const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
};