import React from 'react';
import { Link } from 'react-router-dom';
import './PaymentPages.css';

function PaymentSuccess() {
  return (
    <div className="payment-page">
      <div className="payment-page-content success">
        <div className="icon">✅</div>
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully.</p>
        <Link to="/" className="button">Back to Home</Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;

