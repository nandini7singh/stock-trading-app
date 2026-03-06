# Stock Trading App — User Flow

> **Document 2 of 3** | Version 1.0 | March 2026
> Tech Stack: Next.js · Node.js · MongoDB · Socket.io

---

## Table of Contents

1. [Actors on the Platform](#1-actors-on-the-platform)
2. [New User Registration Flow](#2-new-user-registration-flow)
3. [Login Flow](#3-login-flow)
4. [Stock Browsing & Research Flow](#4-stock-browsing--research-flow)
5. [Stock Purchase (Buy) Flow](#5-stock-purchase-buy-flow)
6. [Stock Sale (Sell) Flow](#6-stock-sale-sell-flow)
7. [Deposit Funds Flow](#7-deposit-funds-flow)
8. [Withdrawal Request & Approval Flow](#8-withdrawal-request--approval-flow)
9. [Admin Management Flow](#9-admin-management-flow)
10. [Real-Time Price Update Flow](#10-real-time-price-update-flow)
11. [Error & Edge Case Handling](#11-error--edge-case-handling)

---

## 1. Actors on the Platform

| Actor | Description |
|---|---|
| **Guest** | Unauthenticated visitor browsing public pages only |
| **User** | Registered and logged-in trader with wallet and portfolio |
| **Admin** | Platform administrator with elevated management permissions |

---

## 2. New User Registration Flow

```
Visit Landing Page  (/)
        │
        ▼
Click "Sign Up"  →  Navigate to /register
        │
        ▼
Fill Registration Form
  · Full name
  · Email address
  · Password (min 8 characters)
        │
        ▼
Submit Form
  → Frontend validates fields
  → POST /api/auth/register
        │
        ▼
Backend Validates Input
  · Joi/Zod schema check
  · Rejects if email already exists
        │
        ▼
Password Hashed with bcrypt  (saltRounds: 12)
        │
        ▼
User Document Created in MongoDB
  · role: "user"
  · walletBalance: 0
        │
        ▼
JWT Token Generated & Returned
  · Signed with JWT_SECRET
  · Expiry: 7 days
        │
        ▼
Frontend Stores Token
  · In-memory state or HttpOnly cookie
        │
        ▼
Redirect to /dashboard  ✓  User is authenticated
```

---

## 3. Login Flow

```
Navigate to /login
        │
        ▼
Enter Registered Email + Password
        │
        ▼
POST /api/auth/login
        │
        ▼
Backend Finds User by Email
  → Returns 401 if email not found
        │
        ▼
bcrypt.compare() Password Check
  → Returns 401 if password does not match
        │
        ▼
JWT Generated
  · Payload contains: userId, role
  · Signed with JWT_SECRET
        │
        ▼
Token Returned to Frontend  →  Stored securely
        │
        ▼
Role-Based Redirect
  · role: "user"   →  /dashboard
  · role: "admin"  →  /admin
```

---

## 4. Stock Browsing & Research Flow

```
Navigate to /stocks  (authenticated)
        │
        ▼
GET /api/stocks
  · Paginated list with live prices returned
        │
        ▼
Search or Filter
  · By symbol (e.g. AAPL)
  · By company name (e.g. Apple)
  · By sector or price movement
        │
        ▼
Click a Stock  →  Navigate to /stocks/:symbol
        │
        ▼
GET /api/stocks/:symbol
  · Full stock details: price, market cap, volume
        │
        ▼
GET /api/stocks/:symbol/history
  · Historical OHLCV data for selected time range
        │
        ▼
Recharts Renders Price Chart
        │
        ▼
Socket.io Receives  price_update  event
  → Chart re-renders with latest live price  ✓
```

---

## 5. Stock Purchase (Buy) Flow

```
Click "Buy" on Stock Detail Page
        │
        ▼
Enter Quantity
  · Total cost = quantity × currentPrice  (shown live)
        │
        ▼
Click "Confirm Purchase"
  · Frontend checks: walletBalance >= total cost
  · Blocks with error if insufficient funds
        │
        ▼
POST /api/orders/buy
  · Payload: { stockId, quantity }
        │
        ▼
Backend Validates Order
  · Confirms wallet balance server-side
  · Confirms stock exists and has a valid price
        │
        ▼
Atomic Database Update
  · walletBalance  deducted from User document
  · Order document created  (status: "completed")
        │
        ▼
Transaction Logged
  · type: "buy"
  · status: "completed"
        │
        ▼
Frontend State Refreshed
  · Wallet balance updated
  · Portfolio holdings updated
        │
        ▼
Success Confirmation Screen shown to user  ✓
```

---

## 6. Stock Sale (Sell) Flow

```
Open Portfolio Page  (/dashboard)
        │
        ▼
Click "Sell" on a Holding
  · Sell panel opens for that specific stock
        │
        ▼
Enter Quantity to Sell
  · Must not exceed quantity currently owned
        │
        ▼
Confirm Sale
  · POST /api/orders/sell  →  { stockId, quantity }
        │
        ▼
Backend Validates Holding
  · Checks user owns enough shares
  · Returns 400 if quantity exceeds holding
        │
        ▼
Atomic Database Update
  · walletBalance credited with sale value
  · Order document created  (status: "completed")
        │
        ▼
Transaction Logged
  · type: "sell"
  · status: "completed"
        │
        ▼
Portfolio Refreshed
  · Holding quantity reduced or removed entirely  ✓
```

---

## 7. Deposit Funds Flow

```
Navigate to /wallet
        │
        ▼
Click "Deposit"  →  Enter desired amount
        │
        ▼
POST /api/wallet/deposit
  · Amount validated  (min: 1)
        │
        ▼
walletBalance Updated
  · MongoDB User document updated immediately
        │
        ▼
Transaction Logged
  · type: "deposit"
  · status: "completed"
        │
        ▼
UI Balance Refreshed across all pages  ✓
```

---

## 8. Withdrawal Request & Approval Flow

```
User Requests Withdrawal  (/wallet)
  · POST /api/wallet/withdraw  →  { amount }
        │
        ▼
Backend Creates Pending Transaction
  · status: "pending"
  · Funds NOT yet deducted from wallet
        │
        ▼
User Sees "Pending Approval" in Transaction History
        │
        ▼
Admin Receives Pending Notification
  · Pending count shown in admin dashboard
        │
        ▼
Admin Reviews Request
  · GET /api/admin/users  →  withdrawal queue
        │
        ▼
Admin Decision
        │
   ┌────┴────┐
   ▼         ▼
Approve    Reject
   │         │
   ▼         ▼
Wallet    Status set
deducted  to "rejected"
   │
   ▼
Transaction status → "completed"
        │
        ▼
User Views Final Status in Transaction History  ✓
```

---

## 9. Admin Management Flow

```
Admin Visits /admin/login
        │
        ▼
POST /api/admin/login
  · Backend verifies role === "admin"
  · Returns 403 if role is "user"
        │
        ▼
Admin JWT Issued
  · Same JWT structure, role: "admin" in payload
        │
        ▼
Admin Dashboard Loaded
  · Platform stats: total users, total trades, pending withdrawals
        │
        ▼
  ┌─────────────┬─────────────┬─────────────┐
  ▼             ▼             ▼             ▼
Manage       Manage       Process      Monitor
Users        Stocks      Withdrawals  Transactions
  │             │             │             │
View, suspend, Add/update,  Approve or  Filter all
delete users   set prices   reject queue  platform tx
```

---

## 10. Real-Time Price Update Flow

```
External Market API
(Alpha Vantage / Polygon.io / Yahoo Finance)
        │
        ▼  every 30 seconds  (node-cron)
Backend Scheduler fetches latest prices
        │
        ▼
MongoDB  ←──  Bulk price update via Stock.bulkWrite()
        │
        ▼
Socket.io  ──►  io.emit('price_update', updatedPrices)
        │
        ▼
All connected browser clients receive the event
        │
        ▼
React state updates
        │
        ▼
Price displays and charts re-render instantly  ✓
```

This process runs continuously in the background as long as the backend server is running, regardless of how many clients are connected.

---

## 11. Error & Edge Case Handling

| Scenario | System Response | User Sees |
|---|---|---|
| Invalid login credentials | `401 Unauthorized` | "Invalid email or password" |
| JWT token expired | `401` from verifyToken middleware | Redirect to `/login` |
| Insufficient wallet balance | `400 Bad Request` — order rejected | "Insufficient funds" message |
| Sell more shares than owned | `400 Bad Request` — order rejected | "You don't own enough shares" |
| Invalid input data | `422` — Joi/Zod validation error | Field-level error messages |
| Rate limit exceeded (auth) | `429 Too Many Requests` | "Too many attempts. Try in 1 minute." |
| External market API down | Cron catches error, retries next cycle | Prices show last known value |
| Non-admin accesses admin route | `403 Forbidden` from isAdmin middleware | "Access denied" error page |
| Duplicate email on register | `409 Conflict` | "Email already in use" |

---

*End of User Flow Document — Doc 2 of 3*
