import React from 'react';
import { Link } from 'react-router-dom';
import './PaymentPages.css';

function ZaloCancel() {
  return (
    <div className="payment-page">
      <div className="payment-page-content cancel">
        <div className="icon">❌</div>
        <h1>Zalo Pay Cancelled</h1>
        <p>Your Zalo Pay payment was cancelled.</p>
        <Link to="/" className="button">Back to Home</Link>
      </div>
    </div>
  );
}

export default ZaloCancel;