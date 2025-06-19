import React from 'react';

const StakePage = () => (
  <div className="dashboard-stake-content">
    <h2 className="dashboard-loan-title">Funding</h2>
    <p className="dashboard-loan-subtitle">Fund the bank to receive a share of loan profits.<br />Below is the latest offering that is currently available.</p>
    <div className="dashboard-stake-card">
      <div className="dashboard-stake-card-left">
        <div className="dashboard-stake-offering-title">Latest Offering</div>
        <div className="dashboard-stake-offering-percent">15% <span>of loan profits</span></div>
        <div className="dashboard-stake-progress-bar">
          <div className="dashboard-stake-progress" style={{width: '70%'}}></div>
        </div>
        <div className="dashboard-stake-progress-labels">
          <span>$350,000</span>
          <span>$500,000</span>
        </div>
      </div>
      <div className="dashboard-stake-card-right">
        <button className="dashboard-loan-submit dashboard-stake-connect">Connect Wallet</button>
        <div className="dashboard-stake-purchase-label">Purchase with USDC</div>
      </div>
    </div>
  </div>
);

export default StakePage; 