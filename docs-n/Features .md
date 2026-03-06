# Stock Trading App — Features

> **Document 1 of 3** | Version 1.0 | March 2026
> Tech Stack: Next.js · Node.js · MongoDB · Socket.io

---

## Table of Contents

1. [Authentication & Account Management](#1-authentication--account-management)
2. [User Dashboard](#2-user-dashboard)
3. [Stock Discovery & Market Data](#3-stock-discovery--market-data)
4. [Trading — Buy & Sell](#4-trading--buy--sell)
5. [Wallet & Financial Transactions](#5-wallet--financial-transactions)
6. [Admin Panel Features](#6-admin-panel-features)
7. [Real-Time Features](#7-real-time-features)
8. [Performance & Infrastructure Features](#8-performance--infrastructure-features)
9. [Future / Scalable Features (Roadmap)](#9-future--scalable-features-roadmap)

---

## 1. Authentication & Account Management

- User registration with full name, email address, and password
- Secure login with JWT token issuance (7-day expiry)
- Role-based access control — two roles: **User** and **Admin**
- bcrypt password hashing (salt rounds: 12) for secure storage
- Protected route middleware — all authenticated pages verify JWT on every request
- Session persistence via token stored in frontend state or HttpOnly cookie
- Logout support with token invalidation on the client side

---

## 2. User Dashboard

- Personalized dashboard displayed immediately upon login
- Portfolio summary: total invested value, current value, unrealized P&L
- Holdings table: stock symbol, company name, quantity owned, average buy price, current value
- Performance chart: portfolio growth over daily, weekly, and monthly timeframes
- Quick-action buttons: Buy Stock, View Portfolio, Deposit Funds
- Real-time wallet balance displayed persistently in the navigation bar

---

## 3. Stock Discovery & Market Data

- Browse all listed stocks with live-updated prices on one paginated page
- Search by stock symbol (e.g. `AAPL`) or company name (e.g. `Apple Inc.`)
- Filter stocks by sector, market cap range, or price movement direction
- Detailed stock page per symbol: current price, open, high, low, volume, market cap
- Real-time candlestick and line price charts powered by Recharts / Chart.js
- Historical price data with selectable time ranges: **1D · 1W · 1M · 3M · 1Y**
- Price change indicators with percentage movement and color coding (green / red)

---

## 4. Trading — Buy & Sell

- Buy any listed stock using available wallet balance
- Sell any holding directly from the user's portfolio view
- Quantity input with real-time total cost calculation before confirmation
- Pre-trade confirmation screen showing quantity, unit price, and total cost
- Insufficient balance validation — purchase is blocked if wallet funds are too low
- Instant order execution with backend atomic update (wallet deduction + portfolio record)
- Order status tracking: `completed` or `pending`
- Full order history page with filtering by date, type, and stock symbol

---

## 5. Wallet & Financial Transactions

- Virtual wallet assigned to every user on registration (starting balance: 0)
- Deposit funds: add virtual money to enable trading activity
- Withdraw funds: request a withdrawal — subject to admin approval flow
- Live wallet balance updated across all pages on every transaction
- Complete transaction ledger — all events logged: `deposit`, `withdraw`, `buy`, `sell`
- Transaction history page: filterable by type, status, and date range
- Transaction status indicators: `pending` · `completed` · `rejected`

---

## 6. Admin Panel Features

| Admin Feature | Description | API Endpoint |
|---|---|---|
| Admin Login | Separate auth endpoint enforcing `role: admin` | `POST /api/admin/login` |
| User Management | View, search, suspend, and delete user accounts | `GET /api/admin/users` |
| Withdrawal Approvals | Review pending requests — approve or reject | `PATCH /api/admin/approve-withdrawal` |
| Stock Management | Add, update, or remove stocks from the platform | `PUT /api/stocks/:symbol` |
| Transaction Monitoring | Platform-wide transaction log with full filter support | `GET /api/transactions` |
| User Deletion | Permanently remove a user and all associated data | `DELETE /api/admin/user/:id` |

---

## 7. Real-Time Features

- Live stock price updates via **Socket.io** WebSocket connection
- Server-side cron job polls external market API every **30 seconds**
- Price updates pushed to all connected clients via `io.emit('price_update')`
- Frontend chart re-renders automatically on receiving new price data
- Real-time wallet balance update after each trade, deposit, or withdrawal
- Admin dashboard refreshes pending withdrawal count in real time

---

## 8. Performance & Infrastructure Features

| Feature | Technology | Benefit |
|---|---|---|
| Server-side caching | Redis (Upstash) | Reduces external API calls, lowers latency |
| Pagination | MongoDB cursor + limit/skip | Handles large lists without performance degradation |
| Rate limiting (global) | express-rate-limit (100 req / 15 min) | Prevents abuse and server overload |
| Rate limiting (auth) | express-rate-limit (5 req / 1 min) | Stops brute-force login attacks |
| Input validation | Joi or Zod schemas | Rejects malformed or dangerous input early |
| Password hashing | bcrypt (saltRounds: 12) | Protects credentials even if DB is compromised |
| Security headers | Helmet.js | Prevents XSS, clickjacking, MIME sniffing |
| CORS enforcement | Express CORS middleware | Only allows requests from the known frontend URL |
| HTTPS | Vercel + Render (auto-enforced) | Encrypts all data in transit |

---

## 9. Future / Scalable Features (Roadmap)

- Email notifications for trade confirmations and withdrawal status changes
- Two-factor authentication (2FA) via OTP or authenticator app
- Watchlist — users can bookmark stocks for ongoing monitoring
- Price alerts — notify users when a stock crosses a target threshold
- Market news feed integrated alongside stock detail pages
- Dark mode toggle across the full UI
- Mobile app (React Native) using the same backend REST API
- Microservices architecture for Auth, Trading Engine, and Payment services at scale

---

*End of Features Document — Doc 1 of 3*
