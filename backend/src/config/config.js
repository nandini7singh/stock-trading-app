import dontenv from 'dotenv';

dontenv.config();

export default {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/stock-trading-app"
}