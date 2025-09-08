require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const MODE = process.env.MODE || 'demo';

// --- DB ---
mongoose.connect(process.env.MONGO_URI, { })
  .then(()=>console.log('✅ MongoDB connected'))
  .catch(err=>console.error('Mongo error', err));

// --- Express setup ---
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true}));
app.use(session({ secret: process.env.SESSION_SECRET || 'dev', resave:false, saveUninitialized:true }));

// --- Models ---
const PriceTrigger = require('./models/PriceTrigger');
const ScheduledOrder = require('./models/ScheduledOrder');

// --- Services ---
const mock = require('./services/mockData');
const scheduler = require('./services/scheduler');

// Start mock feed if in demo mode
if (MODE === 'demo') {
  mock.startMockFeed(io, async (updatedStocks) => {
    // Check price triggers on every tick
    try {
      const active = await PriceTrigger.find({});
      for (const t of active) {
        const s = updatedStocks.find(x => x.symbol.toUpperCase() === t.stock.toUpperCase());
        if (!s) continue;
        if (!t.__fired && s.price >= t.targetPrice) {
          // For demo: mark as triggered and notify UI
          t.__fired = true;
          await PriceTrigger.deleteOne({ _id: t._id }); // remove from active
          io.emit('triggerFired', { stock: t.stock, targetPrice: t.targetPrice, ltp: s.price });
        }
      }
    } catch(e) {
      console.error('Trigger check error', e);
    }
  });
}

// Run scheduled order checker every minute (demo -> marks placed)
cron.schedule('*/1 * * * *', async () => {
  await scheduler.runDemoScheduler(io);
});

// --- Routes ---
app.get('/', async (req,res) => {
  const triggers = await PriceTrigger.find();
  const scheduled = await ScheduledOrder.find().sort({ scheduledTime: 1 });
  res.render('index', { stocks: mock.getStocks(), triggers, scheduled });
});

app.get('/stock/:symbol', (req,res) => {
  const stock = mock.getStocks().find(s=>s.symbol === req.params.symbol.toUpperCase());
  if (!stock) return res.status(404).send('Not found');
  res.render('stock', { stock });
});

app.post('/add-trigger', async (req,res) => {
  const { stock, targetPrice } = req.body;
  await PriceTrigger.create({ stock: stock.toUpperCase(), targetPrice: Number(targetPrice) });
  res.redirect('/');
});

app.post('/add-schedule', async (req,res) => {
  const { stock, scheduledTime } = req.body;
  await ScheduledOrder.create({ stock: stock.toUpperCase(), scheduledTime: new Date(scheduledTime) });
  res.redirect('/');
});

// Socket connections
io.on('connection', (socket) => {
  console.log('🔌 Client connected');
  socket.emit('stockUpdate', mock.getStocks());
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT} (MODE=${MODE})`));
