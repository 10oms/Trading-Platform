const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cron = require('node-cron');
const app = express();

const PriceTrigger = require('./models/PriceTrigger');
const ScheduledOrder = require('./models/ScheduledOrder');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
