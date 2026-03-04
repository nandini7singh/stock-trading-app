import dotenv from "dotenv";
import app from "./src/app.js";
import config from "./src/config/config.js";
import  connectDB  from "./src/config/db.js";

dotenv.config();

const { PORT } = config;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();