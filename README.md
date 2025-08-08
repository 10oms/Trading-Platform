# 🧠 Trading Platform (No API Version)

This is a simulated trading platform built with **Node.js**, **Express**, **MongoDB**, and **EJS**, which does **not use any external stock market APIs**. It supports two core features:

---

## ✅ Features

1. **Auto-Redeem When Stock Price Reaches Target**
   - User manually enters stock symbol, current price, and target price
   - System checks every minute and simulates a sell (auto-redeem) when target is reached

2. **Scheduled Stock Buying**
   - User enters stock and future date/time
   - System auto-executes the buy (simulated) at scheduled time

---

## 📁 Folder Structure

```
trading-platform/
│
├── models/
│   ├── PriceTrigger.js
│   └── ScheduledOrder.js
│
├── public/
│   └── style.css
│
├── views/
│   └── index.ejs
│
├── server.js
```

---

## 🚀 How to Run the Project

### 1. Clone the project or unzip the folder

```
cd trading-platform
```

### 2. Install dependencies

```
npm install
```

### 3. Make sure MongoDB is running

If using locally:
```
mongod
```

### 4. Start the server

```
node server.js
```

### 5. Open your browser

```
http://localhost:3000
```

---

## 🧪 Test Flow

- Set an auto-redeem trigger by entering:
  - Stock symbol
  - Current price
  - Target price

- Schedule a buy by entering:
  - Stock symbol
  - Future date and time

The system uses CRON jobs (every minute) to simulate both actions.

---

## 💡 Notes

- This is a **simulation only** — no real money or stock APIs involved
- Fully customizable to integrate with live APIs like Zerodha/Kite in the future
- Built to demonstrate backend scheduling logic and database triggers

---

## 🧑‍💻 Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- EJS
- Node-Cron

---

## 📬 Contact

If you want to add real-time APIs or expand this system, feel free to ask!
