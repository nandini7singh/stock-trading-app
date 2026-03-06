# Stock Trading App — Project Execution Guide

**Technical Documentation — Doc 3 of 3**
`Version 1.0 | March 2026 | MERN Stack · Next.js · Socket.io · MongoDB Atlas`

---

## Execution Summary — 9 Phases

| # | Phase | Focus |
|---|-------|-------|
| 1 | Project Setup & Environment | Repo init, dependencies, env vars |
| 2 | Database Design & Models | MongoDB Atlas, Mongoose schemas |
| 3 | Backend API Development | Express app, JWT, all REST endpoints |
| 4 | Real-Time Architecture | Socket.io + node-cron price updates |
| 5 | Frontend Development | Next.js pages, components, Axios |
| 6 | Security Hardening | Helmet, rate limiting, Joi validation |
| 7 | Testing | Unit, integration, E2E strategy |
| 8 | Deployment to Production | Vercel + Render + MongoDB Atlas |
| 9 | Scaling for Growth | Microservices, queues, global expansion |

---

## Phase 1 — Project Setup & Environment

### Step 1: Initialize the Repository Structure

```bash
# Create monorepo root
mkdir stock-trading-app && cd stock-trading-app
git init

# Frontend — Next.js 14 with TypeScript + Tailwind
npx create-next-app@latest frontend \
  --typescript --tailwind --app --src-dir

# Backend — Node.js + Express
mkdir backend && cd backend
npm init -y
```

### Step 2: Install Backend Dependencies

```bash
# Core packages
npm install express mongoose jsonwebtoken bcryptjs
npm install dotenv cors helmet express-rate-limit

# Real-time & async
npm install socket.io node-cron axios

# Validation
npm install joi

# Dev tools
npm install --save-dev nodemon
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend

npm install axios @tanstack/react-query
npm install recharts socket.io-client
npm install react-hook-form zod @hookform/resolvers
```

### Step 4: Configure Environment Variables

```bash
# backend/.env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/stockapp
JWT_SECRET=replace_with_long_random_string_here
STOCK_API_KEY=your_alpha_vantage_or_polygon_api_key
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## Phase 2 — Database Design & Mongoose Models

### Step 5: Set Up MongoDB Atlas

1. Create a free account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a new cluster (M0 free tier for development)
3. Add your IP to the Atlas IP Allowlist
4. Create a database user with `readWrite` permissions
5. Copy the connection string into `MONGO_URI` in `backend/.env`

### Step 6: Create Mongoose Models

Create the following files in `backend/models/`:

```javascript
// User.js
const userSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  role:          { type: String, enum: ['user', 'admin'], default: 'user' },
  walletBalance: { type: Number, default: 0 },
  createdAt:     { type: Date, default: Date.now }
});
```

```javascript
// Stock.js
const stockSchema = new mongoose.Schema({
  symbol:       { type: String, required: true, unique: true },
  companyName:  { type: String, required: true },
  currentPrice: { type: Number, required: true },
  marketCap:    Number,
  volume:       Number
});
```

```javascript
// Order.js
const orderSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stockId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
  type:      { type: String, enum: ['buy', 'sell'] },
  quantity:  Number,
  price:     Number,
  status:    { type: String, enum: ['completed', 'pending'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
```

```javascript
// Transaction.js
const transactionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type:      { type: String, enum: ['deposit', 'withdraw', 'buy', 'sell'] },
  amount:    { type: Number, required: true },
  status:    { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
```

**Schema Summary**

| Model | Key Fields |
|-------|-----------|
| User | name, email, password (hashed), role, walletBalance |
| Stock | symbol, companyName, currentPrice, marketCap, volume |
| Order | userId (ref), stockId (ref), type, quantity, price, status |
| Transaction | userId (ref), type, amount, status |

---

## Phase 3 — Backend API Development

### Step 7: Build Express App Entry Point

```javascript
// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/users',        require('./routes/users'));
app.use('/api/stocks',       require('./routes/stocks'));
app.use('/api/orders',       require('./routes/orders'));
app.use('/api/wallet',       require('./routes/wallet'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/admin',        require('./routes/admin'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () =>
    console.log('Server running on port', process.env.PORT)));
```

### Step 8: Build JWT Middleware

```javascript
// backend/middleware/verifyToken.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

```javascript
// backend/middleware/isAdmin.js
module.exports = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ error: 'Access denied' });
  next();
};
```

### Step 9: Full API Endpoint Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | — |
| `POST` | `/api/auth/login` | Login — returns JWT | — |
| `GET` | `/api/users/profile` | Get own profile | User |
| `PUT` | `/api/users/update` | Update profile | User |
| `POST` | `/api/wallet/deposit` | Deposit funds | User |
| `POST` | `/api/wallet/withdraw` | Request withdrawal | User |
| `GET` | `/api/wallet/balance` | Get current balance | User |
| `GET` | `/api/stocks` | List all stocks (paginated) | — |
| `GET` | `/api/stocks/:symbol` | Get stock details | — |
| `GET` | `/api/stocks/:symbol/history` | Get price history | — |
| `POST` | `/api/orders/buy` | Buy stock | User |
| `POST` | `/api/orders/sell` | Sell stock | User |
| `GET` | `/api/orders` | Get user orders | User |
| `GET` | `/api/transactions` | Get transaction history | User |
| `POST` | `/api/admin/login` | Admin authentication | — |
| `GET` | `/api/admin/users` | List all users | Admin |
| `PATCH` | `/api/admin/approve-withdrawal` | Approve withdrawal | Admin |
| `DELETE` | `/api/admin/user/:id` | Delete user account | Admin |

---

## Phase 4 — Real-Time Architecture

### Step 10: Integrate Socket.io into Express Server

```javascript
// backend/server.js
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const priceUpdater = require('./services/priceUpdater');

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

priceUpdater(io); // Start cron job with socket reference

server.listen(process.env.PORT, () =>
  console.log('Server + Socket.io running on port', process.env.PORT));
```

### Step 11: Build the Price Updater Service

```javascript
// backend/services/priceUpdater.js
const cron = require('node-cron');
const axios = require('axios');
const Stock = require('../models/Stock');

module.exports = (io) => {
  cron.schedule('*/30 * * * * *', async () => {
    try {
      const stocks = await Stock.find({}, 'symbol');
      const symbols = stocks.map(s => s.symbol).join(',');

      // Call external market API (Alpha Vantage / Polygon.io)
      const { data } = await axios.get(
        `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES` +
        `&symbols=${symbols}&apikey=${process.env.STOCK_API_KEY}`
      );

      const prices = parseApiResponse(data); // map to [{ symbol, price }]

      // Bulk update MongoDB
      await Stock.bulkWrite(prices.map(p => ({
        updateOne: {
          filter: { symbol: p.symbol },
          update: { $set: { currentPrice: p.price } }
        }
      })));

      // Push to all connected clients
      io.emit('price_update', prices);

    } catch (err) {
      console.error('Price update error:', err.message);
    }
  });
};
```

**Real-Time Data Flow**

```
External Market API (Alpha Vantage / Polygon.io)
        |
        v   every 30 seconds via node-cron
Backend Scheduler fetches latest prices
        |
        v
MongoDB  <---  Stock.bulkWrite() updates currentPrice
        |
        v
Socket.io  --->  io.emit('price_update', prices)
        |
        v
All connected browser clients receive the event
        |
        v
React state updates  --->  Charts re-render instantly
```

### Step 12: Connect Socket.io on the Frontend

```typescript
// frontend/src/hooks/useStockPrices.ts
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useStockPrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

    socket.on('price_update', (updatedPrices) => {
      setPrices(prev => ({ ...prev, ...updatedPrices }));
    });

    return () => { socket.disconnect(); };
  }, []);

  return prices;
}
```

---

## Phase 5 — Frontend Development

### Step 13: Project Structure

```
frontend/src/
  app/
    page.tsx                    # Landing page
    login/page.tsx
    register/page.tsx
    dashboard/page.tsx
    stocks/page.tsx
    stocks/[symbol]/page.tsx
    orders/page.tsx
    wallet/page.tsx
    admin/
      users/page.tsx
      withdrawals/page.tsx
  components/
    StockCard.tsx
    PriceChart.tsx
    OrderTable.tsx
    WalletSummary.tsx
    BuySellPanel.tsx
  hooks/
    useStockPrices.ts
    usePortfolio.ts
  lib/
    api.ts                      # Axios instance with JWT interceptor
```

### Step 14: Axios Instance with JWT Interceptor

```typescript
// frontend/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### Step 15: Frontend Pages Reference

| Module | Route | Key Components |
|--------|-------|----------------|
| Landing Page | `/` | Hero, features, CTA buttons |
| Register | `/register` | Form + POST /api/auth/register |
| Login | `/login` | Form, JWT storage, role redirect |
| Dashboard | `/dashboard` | Portfolio summary, P&L chart |
| Stock List | `/stocks` | Paginated table, search, live prices |
| Stock Detail | `/stocks/[symbol]` | Recharts chart, buy/sell panel |
| Orders History | `/orders` | Order table with status filters |
| Wallet | `/wallet` | Balance, deposit form, withdraw form |
| Admin — Users | `/admin/users` | User table, actions |
| Admin — Approvals | `/admin/withdrawals` | Withdrawal queue |

---

## Phase 6 — Security Hardening

### Step 16: Apply Full Security Middleware Stack

```javascript
// backend/app.js — add after helmet() and cors()
const rateLimit = require('express-rate-limit');

// Global: 100 requests per 15 minutes per IP
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again later.' }
}));

// Auth routes: max 5 attempts per minute
app.use('/api/auth/', rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Try again in 1 minute.' }
}));
```

### Step 17: Input Validation with Joi

```javascript
// backend/validation/authSchemas.js
const Joi = require('joi');

exports.registerSchema = Joi.object({
  name:     Joi.string().min(2).max(50).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

exports.loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required()
});

exports.orderSchema = Joi.object({
  stockId:  Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});
```

**Security checklist:**
- [x] `helmet()` — sets secure HTTP headers
- [x] CORS locked to `FRONTEND_URL` only
- [x] Rate limiting on all `/api/` and strict on `/api/auth/`
- [x] Joi/Zod input validation on all mutation routes
- [x] bcrypt with `saltRounds: 12` for all passwords
- [x] JWT verified on every protected route via middleware
- [x] Admin routes double-protected: `verifyToken` + `isAdmin`
- [x] HTTPS enforced via Vercel and Render (automatic)

---

## Phase 7 — Testing

### Step 18: Testing Strategy

| Test Area | Type | Tool | Priority |
|-----------|------|------|----------|
| Auth endpoints | Integration | Jest + Supertest | Critical |
| Order buy/sell logic | Unit + Integration | Jest | Critical |
| JWT middleware | Unit | Jest with mocks | High |
| Frontend components | Component | React Testing Library | High |
| Full user journeys | End-to-end | Playwright | High |
| Socket.io events | Manual + unit | Socket.io test client | Medium |
| Rate limiting | Manual | curl / Postman | Medium |
| Load & performance | Load | Artillery or k6 | Low (pre-launch) |

### Step 19: Sample Integration Test

```javascript
// backend/__tests__/auth.test.js
const request = require('supertest');
const app = require('../app');

describe('POST /api/auth/register', () => {
  it('should register a new user and return a JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Sagar', email: 'sagar@test.com', password: 'password123' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject an invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'not-an-email', password: 'pass1234' });

    expect(res.statusCode).toBe(422);
  });
});

describe('POST /api/orders/buy', () => {
  it('should reject order if wallet balance is insufficient', async () => {
    const res = await request(app)
      .post('/api/orders/buy')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ stockId: 'AAPL_ID', quantity: 99999 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/insufficient/i);
  });
});
```

---

## Phase 8 — Deployment to Production

### Step 20: Deploy Backend to Render

1. Push backend code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repository
4. Set **Build Command:** `npm install`
5. Set **Start Command:** `node server.js`
6. Add all environment variables from `backend/.env` in the Render dashboard
7. Set `NODE_ENV=production`
8. Enable auto-deploy on push to `main` branch

### Step 21: Deploy Frontend to Vercel

1. Push frontend code to GitHub
2. Create a new project on [vercel.com](https://vercel.com)
3. Import the frontend directory from GitHub
4. Set `NEXT_PUBLIC_API_URL` to your Render backend URL
5. Set `NEXT_PUBLIC_SOCKET_URL` to your Render backend URL
6. Deploy — Vercel auto-detects Next.js and configures the build

### Step 22: Pre-Launch Checklist

```
Backend:
  [ ] NODE_ENV=production set in Render dashboard
  [ ] All .env variables added in platform dashboard
  [ ] MongoDB Atlas IP allowlist updated (0.0.0.0/0 for Render)
  [ ] Health check endpoint working: GET /health => { status: 'ok' }
  [ ] CORS origin set to production Vercel URL only

Frontend:
  [ ] NEXT_PUBLIC_API_URL points to production Render URL
  [ ] NEXT_PUBLIC_SOCKET_URL points to production Render URL
  [ ] npm run build completes without errors locally
  [ ] All .env.local vars added in Vercel project settings

Database:
  [ ] MongoDB Atlas cluster is running
  [ ] Database user has correct read/write permissions
  [ ] Indexes created on: email (User), symbol (Stock), userId (Order)
```

### Deployment Targets Summary

| Service | Platform | Cost |
|---------|----------|------|
| Frontend (Next.js) | Vercel | Free tier |
| Backend (Node.js) | Render | Free tier |
| Database | MongoDB Atlas | M0 Free / M10 $57/mo |
| Redis Cache | Upstash | Free (10K req/day) |

---

## Phase 9 — Scaling for Growth

Apply the following upgrades progressively as user volume grows.

| Growth Challenge | Recommended Solution | Trigger Threshold |
|-----------------|---------------------|-------------------|
| High concurrent users | Load balancer + horizontal scaling | > 10K concurrent users |
| Auth bottleneck | Dedicated Auth microservice | > 50K registered users |
| Order volume spikes | Trading Engine + message queue | High burst trade volume |
| Real money flows | Payment Service (Razorpay / Stripe) | Integrating real payments |
| Async event processing | RabbitMQ or Apache Kafka | Complex order workflows |
| DB read performance | Read replicas + sharding | > 1M documents per collection |
| Global users | CDN + multi-region deployment | International expansion |
| Observability | Datadog / New Relic APM | Production incidents |

---

## Final Stack Recommendation

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Recharts, React Query |
| **Backend** | Node.js 20, Express.js, Socket.io, node-cron, Mongoose |
| **Database** | MongoDB Atlas (primary), Upstash Redis (cache) |
| **Auth** | JWT + bcrypt (saltRounds: 12) + role-based middleware |
| **Market Data** | Alpha Vantage / Polygon.io / Yahoo Finance API |
| **Security** | Helmet, CORS, express-rate-limit, Joi validation |
| **Deployment** | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

*— End of Project Execution Document — Doc 3 of 3*
