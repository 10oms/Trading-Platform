const mongoose = require('mongoose');

// 🔁 Replace this with your actual connection string
const MONGODB_URI = 'mongodb+srv://omsagar10:omsagar8010@trading-platform.ni06cww.mongodb.net/trading-platform?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Failed to connect to MongoDB Atlas:', error);
  process.exit(1);
});
