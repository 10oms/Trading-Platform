const mongoose = require('mongoose');

const ScheduledOrderSchema = new mongoose.Schema({
  stockSymbol: String,
  scheduleDateTime: Date,
});

module.exports = mongoose.model('ScheduledOrder', ScheduledOrderSchema);
