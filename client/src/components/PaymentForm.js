import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import './PaymentForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function PaymentForm({ onLog }) {
  const [amount, setAmount] = useState('10.00');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('Test Payment');
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = async (data, actions) => {
    try {
      onLog('🔄 Đang tạo PayPal order...', 'info');
      
      const response = await axios.post(`${API_URL}/paypal/create-order`, {
        amount,
        currency,
        description
      });

      if (response.data.success) {
        const orderId = response.data.orderId;
        setOrderId(orderId);
        onLog(`✅ Order created: ${orderId}`, 'success');
        onLog(`📋 Order details: ${JSON.stringify(response.data.order, null, 2)}`, 'info');
        
        return orderId;
      }
    } catch (error) {
      onLog(`❌ Error creating order: ${error.response?.data?.error || error.message}`, 'error');
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      onLog('🔄 User đã approve payment, đang capture order...', 'info');
      
      const response = await axios.post(`${API_URL}/paypal/capture-order`, {
        orderId: data.orderID
      });

      if (response.data.success) {
        const capture = response.data.capture;
        setPaymentStatus('success');
        onLog(`✅ Payment captured successfully!`, 'success');
        onLog(`💰 Payment ID: ${capture.id}`, 'success');
        onLog(`💵 Amount: ${capture.purchase_units[0]?.payments?.captures[0]?.amount?.value} ${capture.purchase_units[0]?.payments?.captures[0]?.amount?.currency_code}`, 'success');
        onLog(`📋 Full capture details: ${JSON.stringify(capture, null, 2)}`, 'info');
        
        return actions.order.capture();
      }
    } catch (error) {
      onLog(`❌ Error capturing payment: ${error.response?.data?.error || error.message}`, 'error');
      setPaymentStatus('error');
    }
  };

  const onError = (err) => {
    onLog(`❌ PayPal Error: ${err.message || JSON.stringify(err)}`, 'error');
    setPaymentStatus('error');
  };

  const onCancel = (data) => {
    onLog(`⚠️ Payment cancelled by user. Order ID: ${data.orderID}`, 'warning');
    setPaymentStatus('cancelled');
  };

  return (
    <div className="payment-form">
      <h2>Payment Configuration</h2>
      
      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="10.00"
          disabled={isPending}
        />
      </div>

      <div className="form-group">
        <label>Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={isPending}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="VND">VND</option>
        </select>
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Test Payment"
          disabled={isPending}
        />
      </div>

      {orderId && (
        <div className="order-info">
          <p><strong>Order ID:</strong> {orderId}</p>
        </div>
      )}

      {paymentStatus && (
        <div className={`payment-status ${paymentStatus}`}>
          {paymentStatus === 'success' && '✅ Payment Successful!'}
          {paymentStatus === 'error' && '❌ Payment Failed'}
          {paymentStatus === 'cancelled' && '⚠️ Payment Cancelled'}
        </div>
      )}

      <div className="paypal-buttons-container">
        {isPending ? (
          <div className="loading">Loading PayPal...</div>
        ) : (
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal"
            }}
          />
        )}
      </div>
    </div>
  );
}

export default PaymentForm;

