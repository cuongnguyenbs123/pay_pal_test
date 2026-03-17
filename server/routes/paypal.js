const express = require('express');
const router = express.Router();
const paypalService = require('../services/paypalService');
const {
  insertTransaction,
  updateTransactionByOrderId,
  getTransactions,
} = require('../db/transactions');

// Create PayPal order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'USD', description = 'Test Payment' } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const order = await paypalService.createOrder(amount, currency, description);

    await insertTransaction({
      paypal_order_id: order.id,
      amount,
      currency,
      description,
      status: 'created',
    });

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

    const captureId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;
    const capturedAt = new Date();

    await updateTransactionByOrderId(orderId, {
      status: 'completed',
      capture_id: captureId,
      captured_at: capturedAt,
      raw_capture: capture,
    });

    res.json({
      success: true,
      capture: capture
    });
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    try {
      await updateTransactionByOrderId(req.body.orderId, { status: 'failed' });
    } catch (e) {
      // ignore
    }
    res.status(500).json({ 
      error: 'Failed to capture order',
      details: error.message 
    });
  }
});

// Get transaction history
router.get('/transactions', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const transactions = await getTransactions({ limit, offset });
    res.json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      details: error.message,
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

