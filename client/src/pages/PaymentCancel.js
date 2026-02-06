import React from 'react';
import { Link } from 'react-router-dom';
import './PaymentPages.css';

function PaymentCancel() {
  return (
    <div className="payment-page">
      <div className="payment-page-content cancel">
        <div className="icon">⚠️</div>
        <h1>Payment Cancelled</h1>
        <p>You cancelled the payment process.</p>
        <Link to="/" className="button">Back to Home</Link>
      </div>
    </div>
  );
}

export default PaymentCancel;

