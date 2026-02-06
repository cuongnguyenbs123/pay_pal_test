const express = require('express');
const router = express.Router();
const paypalService = require('../services/paypalService');

// Create PayPal order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'USD', description = 'Test Payment' } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const order = await paypalService.createOrder(amount, currency, description);
    
    res.json({
      success: true,
      orderId: order.id,
      order: order
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
});

// Capture PayPal order (after user approves)
router.post('/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const capture = await paypalService.captureOrder(orderId);
    
    res.json({
      success: true,
      capture: capture
    });
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ 
      error: 'Failed to capture order',
      details: error.message 
    });
  }
});

// Get order details
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await paypalService.getOrder(orderId);
    
    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ 
      error: 'Failed to get order',
      details: error.message 
    });
  }
});

module.exports = router;

