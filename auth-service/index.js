const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const { connectDB } = require('./db/connect');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.get('/api/auth/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service' });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`auth-service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start auth-service:', err);
    process.exit(1);
  }
}

start();
