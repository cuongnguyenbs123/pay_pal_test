const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const paypalRoutes = require('./routes/paypal');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/paypal', paypalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`PayPal Mode: ${process.env.PAYPAL_MODE || 'sandbox'}`);
});

