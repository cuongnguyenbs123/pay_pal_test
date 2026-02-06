import React, { useState } from 'react';
import PaymentForm from '../components/PaymentForm';
import PaymentLog from '../components/PaymentLog';
import './Home.css';

function Home() {
  const [paymentLog, setPaymentLog] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setPaymentLog(prev => [...prev, { timestamp, message, type }]);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>PayPal Payment Test</h1>
        <p className="subtitle">Test PayPal payment flow và xem cách nó hoạt động</p>
        
        <div className="main-section">
          <div className="payment-section">
            <PaymentForm onLog={addLog} />
          </div>
          
          <div className="log-section">
            <PaymentLog logs={paymentLog} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

