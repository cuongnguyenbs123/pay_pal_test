import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/payment-success" className="nav-link">PayPal Success</Link>
        <Link to="/payment-cancel" className="nav-link">PayPal Cancel</Link>
        <Link to="/zalo-success" className="nav-link">Zalo Success</Link>
        <Link to="/zalo-cancel" className="nav-link">Zalo Cancel</Link>
      </div>
    </nav>
  );
}

export default Nav;