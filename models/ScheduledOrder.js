const mongoose = require('mongoose');

const ScheduledOrderSchema = new mongoose.Schema({
  stock: String,
  scheduledTime: Date
});

module.exports = mongoose.model('ScheduledOrder', ScheduledOrderSchema);
