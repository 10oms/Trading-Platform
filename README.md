# Trading App (Demo → Live-ready)

This is a **ready-to-run demo** trading dashboard with:
- **Price Triggers** (auto when price crosses target)
- **Scheduled Orders** (execute at a set time)
- **Mock live prices** via Socket.IO (no Zerodha plan needed)

When you're ready, swap the mock feed with Zerodha **Kite Connect** (live mode).

---

## 1) Setup

```bash
cd trading-app
cp .env.example .env
# (Keep MODE=demo for the college demo)
npm install
npm run dev
```

Open: http://localhost:4000

Ensure MongoDB is running locally, or use MongoDB Atlas and set `MONGO_URI` in `.env`.

---

## 2) Features in Demo Mode

- **Live-looking prices** update every 3 seconds.
- **Price Triggers**: when LTP crosses target, the trigger auto-fires and is marked **TRIGGERED**.
- **Scheduled Orders**: run every minute; if the time is due, it marks as **PLACED (demo)**.

All updates reflect instantly on the dashboard.

---

## 3) Switching to Live (Zerodha) later

- Set `MODE=live` in `.env`.
- Implement `services/kite.js` with `kiteconnect` SDK.
- Replace `services/mockData.js` with real WebSocket ticker and use `placeOrder` for real orders.
- Secure sessions & user accounts to store per-user `access_token`.

---

## 4) Deploy (free)

- Push to **Render** or **Railway**.
- Add environment variables from `.env`.
- Use a free MongoDB Atlas cluster.

---

## 5) Notes

This demo is **educational**. For real trading:
- Handle authentication (OAuth/redirect).
- Respect Zerodha rate limits and exchange rules.
- Add logging, retries, idempotency keys, and error handling.
- Consider Zerodha **GTT** orders for server-independent triggers.
