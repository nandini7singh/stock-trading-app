import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import stockRoutes from "./routes/stockRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import transactionRoutes from "./routes/transactionRoute.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;