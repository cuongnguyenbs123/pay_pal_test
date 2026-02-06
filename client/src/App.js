import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Home from './pages/Home';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import './App.css';

const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || '';

function App() {
  return (
    <PayPalScriptProvider 
      options={{ 
        "client-id": PAYPAL_CLIENT_ID,
        currency: "USD"
      }}
    >
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
          </Routes>
        </div>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;

