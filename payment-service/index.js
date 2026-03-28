const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const paymentRoutes = require('./routes/payments');
const { connectDB } = require('./db/connect');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/payments', paymentRoutes);

app.get('/api/payments/health', (req, res) => {
  res.json({ status: 'OK', service: 'payment-service' });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`payment-service running on port ${PORT}`);
      console.log(`PayPal Mode: ${process.env.PAYPAL_MODE || 'sandbox'}`);
    });
  } catch (err) {
    console.error('Failed to start payment-service:', err);
    process.exit(1);
  }
}

start();
