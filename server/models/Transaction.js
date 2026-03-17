const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    paypal_order_id: { type: String, required: true, unique: true },
    amount: { type: String, required: true },
    currency: { type: String, default: 'USD' },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['created', 'completed', 'failed', 'cancelled'],
      default: 'created',
    },
    capture_id: { type: String, default: null },
    captured_at: { type: Date, default: null },
    raw_capture: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

transactionSchema.index({ paypal_order_id: 1 }, { unique: true });
transactionSchema.index({ created_at: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
