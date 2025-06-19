import React from 'react';
import './DepositPage.css';

const DepositPage = () => (
  <div className="deposit-content">
    <h2 className="loan-title">Deposit Funds</h2>
    <p className="loan-subtitle">Deposit USDC to receive tokens you can stake for a share of bank earnings.</p>
    <form className="deposit-form">
      <label className="loan-label">Amount
        <input type="number" className="loan-input" placeholder="Enter amount in USDC" />
      </label>
      <button type="submit" className="btn btn-blue-filled">Deposit</button>
    </form>
  </div>
);

export default DepositPage; 