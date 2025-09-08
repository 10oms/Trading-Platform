const ScheduledOrder = require('../models/ScheduledOrder');

// Demo scheduler: marks due orders as placed and notifies UI
async function runDemoScheduler(io) {
  const now = new Date();
  // Find orders due within the last minute
  const due = await ScheduledOrder.find({ scheduledTime: { $lte: now } });
  for (const o of due) {
    // In demo: just delete it and emit "placed"
    await ScheduledOrder.deleteOne({ _id: o._id });
    io.emit('scheduledPlaced', { stock: o.stock, time: o.scheduledTime });
  }
}

module.exports = { runDemoScheduler };
