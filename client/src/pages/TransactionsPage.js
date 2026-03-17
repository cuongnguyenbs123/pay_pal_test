import React from 'react';
import { Link } from 'react-router-dom';
import TransactionHistory from '../components/TransactionHistory';
import '../components/TransactionHistory.css';
import './TransactionsPage.css';

function TransactionsPage() {
  return (
    <div className="transactions-page">
      <div className="transactions-page-content">
        <div className="transactions-page-header">
          <h1>Lịch sử giao dịch</h1>
          <Link to="/" className="transactions-page-back">← Về trang chủ</Link>
        </div>
        <TransactionHistory />
      </div>
    </div>
  );
}

export default TransactionsPage;
