const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cron = require('node-cron');
const app = express();

const PriceTrigger = require('./models/PriceTrigger');
const ScheduledOrder = require('./models/ScheduledOrder');

// Simulated live price data
const getLivePrice = (stock) => {
  const prices = {
    RELIANCE: 120,
    INFY: 1450,
    TCS: 3600,
  };
  return prices[stock] || 0;
};


mongoose.connect("mongodb+srv://omsagar10:omsagar8010@trading-platform.ni06cww.mongodb.net/trading-platform?retryWrites=true&w=majority&appName=trading-platform", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cron = require('node-cron');
const PriceTrigger = require('./models/PriceTrigger');

cron.schedule('* * * * *', async () => {
  try {
    const triggers = await PriceTrigger.find();
    for (let t of triggers) {
      const live = getLivePrice(t.stock);
      if (live >= t.targetPrice) {
        console.log(`🎯 Auto-redeem triggered for ${t.stock} at ₹${live}`);
        await PriceTrigger.deleteOne({ _id: t._id });
      }
    }
  } catch (err) {
    console.error('Error in trigger check:', err.message);
  }
});

const ScheduledOrder = require('./models/ScheduledOrder');

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const orders = await ScheduledOrder.find();
    for (let order of orders) {
      const time = new Date(order.scheduledTime);
      if (now >= time) {
        console.log(`🛒 Scheduled buy executed for ${order.stock}`);
        await ScheduledOrder.deleteOne({ _id: order._id });
      }
    }
  } catch (err) {
    console.error('Error in scheduled buy check:', err.message);
  }
});

app.post('/add-trigger', async (req, res) => {
  const { stock, targetPrice } = req.body;
  await PriceTrigger.create({ stock, targetPrice });
  res.send('🎯 Price trigger added successfully');
});

app.post('/add-schedule', async (req, res) => {
  const { stock, scheduledTime } = req.body;
  await ScheduledOrder.create({ stock, scheduledTime });
  res.send('🛒 Schedule order added successfully');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');

// Home page
app.get('/', async (req, res) => {
  const triggers = await PriceTrigger.find();
  const scheduled = await ScheduledOrder.find();
  res.render('index', { triggers, scheduled });
});

// Submit price trigger
app.post('/price-trigger', async (req, res) => {
  const { stockSymbol, currentPrice, targetPrice } = req.body;
  await PriceTrigger.create({ stockSymbol, currentPrice, targetPrice });
  res.redirect('/');
});

// Submit scheduled buy
app.post('/schedule-buy', async (req, res) => {
  const { stockSymbol, scheduleDateTime } = req.body;
  await ScheduledOrder.create({ stockSymbol, scheduleDateTime });
  res.redirect('/');
});

// Auto-redeem logic (check every minute)
cron.schedule('* * * * *', async () => {
  const triggers = await PriceTrigger.find();
  for (let trigger of triggers) {
    if (Number(trigger.currentPrice) >= Number(trigger.targetPrice)) {
      console.log(`✅ Auto-redeem for ${trigger.stockSymbol} at ₹${trigger.currentPrice}`);
      await PriceTrigger.deleteOne({ _id: trigger._id });
    }
  }
});

// Scheduled buy logic
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const dueOrders = await ScheduledOrder.find({ scheduleDateTime: { $lte: now } });
  for (let order of dueOrders) {
    console.log(`✅ Scheduled buy executed for ${order.stockSymbol} at ${now}`);
    await ScheduledOrder.deleteOne({ _id: order._id });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
