import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/admin/users", protect, adminOnly, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export default router;