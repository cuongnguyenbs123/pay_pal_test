const Transaction = require('../models/Transaction');

async function insertTransaction({ paypal_order_id, amount, currency, description, status = 'created' }) {
  const doc = await Transaction.create({
    paypal_order_id,
    amount: String(amount),
    currency: currency || 'USD',
    description: description || '',
    status,
  });
  return doc;
}

async function updateTransactionByOrderId(paypal_order_id, { status, capture_id, captured_at, raw_capture }) {
  const update = { updatedAt: new Date() };
  if (status != null) update.status = status;
  if (capture_id != null) update.capture_id = capture_id;
  if (captured_at != null) update.captured_at = captured_at;
  if (raw_capture != null) update.raw_capture = raw_capture;

  const result = await Transaction.updateOne({ paypal_order_id }, { $set: update });
  return result;
}

async function getTransactions({ limit = 50, offset = 0 } = {}) {
  const list = await Transaction.find()
    .sort({ createdAt: -1 })
    .skip(Number(offset))
    .limit(Math.min(Number(limit) || 50, 100))
    .lean();
  return list;
}

module.exports = {
  insertTransaction,
  updateTransactionByOrderId,
  getTransactions,
};
