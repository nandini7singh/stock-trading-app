import express from "express";
import {
  createStock,
  getAllStocks,
  updateStock,
  deleteStock
} from "../controllers/stockController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllStocks);
router.post("/", protect, adminOnly, createStock);
router.put("/:id", protect, adminOnly, updateStock);
router.delete("/:id", protect, adminOnly, deleteStock);

export default router;