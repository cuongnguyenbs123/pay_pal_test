import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionHistory.css';

const API_BASE = process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : 'http://localhost:8000';
const API_URL = `${API_BASE}/api`;

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/paypal/transactions`, {
        params: { limit: 50, offset: 0 },
      });
      if (res.data.success) setTransactions(res.data.transactions || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (d) => {
    if (!d) return '–';
    const date = new Date(d);
    return date.toLocaleString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-created';
    }
  };

  if (loading) {
    return (
      <div className="transaction-history">
        <h2>Lịch sử giao dịch</h2>
        <div className="transaction-loading">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history">
        <h2>Lịch sử giao dịch</h2>
        <div className="transaction-error">{error}</div>
        <button type="button" className="transaction-refresh" onClick={fetchTransactions}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <div className="transaction-history-header">
        <h2>Lịch sử giao dịch</h2>
        <button type="button" className="transaction-refresh" onClick={fetchTransactions}>Làm mới</button>
      </div>
      <div className="transaction-table-wrap">
        {transactions.length === 0 ? (
          <div className="transaction-empty">Chưa có giao dịch nào.</div>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Order ID</th>
                <th>Số tiền</th>
                <th>Loại tiền</th>
                <th>Trạng thái</th>
                <th>Capture ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{formatDate(tx.createdAt)}</td>
                  <td className="tx-order-id">{tx.paypal_order_id}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.currency}</td>
                  <td><span className={`tx-status ${getStatusClass(tx.status)}`}>{tx.status}</span></td>
                  <td className="tx-capture-id">{tx.capture_id || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
