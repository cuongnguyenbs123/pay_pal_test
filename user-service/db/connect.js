const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/user_db';

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected (user_db)');
}

module.exports = { connectDB, mongoose };
