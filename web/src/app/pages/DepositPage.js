import React from 'react';

const DepositPage = () => (
  <div className="dashboard-deposit-content">
    <h2 className="dashboard-loan-title">Deposit Funds</h2>
    <p className="dashboard-loan-subtitle">Deposit USDC to receive tokens you can stake for a share of bank earnings.</p>
    <form className="dashboard-deposit-form">
      <label className="dashboard-loan-label">Amount
        <input type="number" className="dashboard-loan-input" placeholder="Enter amount in USDC" />
      </label>
      <button type="submit" className="dashboard-loan-submit">Deposit</button>
    </form>
  </div>
);

export default DepositPage; 