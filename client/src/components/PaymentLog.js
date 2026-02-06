import React, { useRef, useEffect } from 'react';
import './PaymentLog.css';

function PaymentLog({ logs }) {
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getLogClass = (type) => {
    switch (type) {
      case 'success':
        return 'log-success';
      case 'error':
        return 'log-error';
      case 'warning':
        return 'log-warning';
      default:
        return 'log-info';
    }
  };

  return (
    <div className="payment-log">
      <h2>Payment Flow Log</h2>
      <div className="log-container">
        {logs.length === 0 ? (
          <div className="log-empty">
            Payment logs will appear here...
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`log-entry ${getLogClass(log.type)}`}>
              <span className="log-time">[{log.timestamp}]</span>
              <span className="log-icon">{getLogIcon(log.type)}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

export default PaymentLog;

