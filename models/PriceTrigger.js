const mongoose = require('mongoose');

const PriceTriggerSchema = new mongoose.Schema({
  stockSymbol: String,
  currentPrice: Number,
  targetPrice: Number,
});

module.exports = mongoose.model('PriceTrigger', PriceTriggerSchema);
