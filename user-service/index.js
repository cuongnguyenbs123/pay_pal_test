const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const { connectDB } = require('./db/connect');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

app.get('/api/users/health', (req, res) => {
  res.json({ status: 'OK', service: 'user-service' });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`user-service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start user-service:', err);
    process.exit(1);
  }
}

start();
