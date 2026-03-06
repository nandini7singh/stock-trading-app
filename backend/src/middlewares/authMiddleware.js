import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔴 Fetch full user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();

  } catch (error) {

    res.status(401).json({ message: "Invalid token" });

  }
};


export const adminOnly = (req, res, next) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();

};