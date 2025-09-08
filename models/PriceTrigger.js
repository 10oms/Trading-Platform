const mongoose = require('mongoose');

const PriceTriggerSchema = new mongoose.Schema({
  stock: String,
  targetPrice: Number
});

module.exports = mongoose.model('PriceTrigger', PriceTriggerSchema);
