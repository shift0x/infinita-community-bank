import React from 'react';
import './StakePage.css';

const StakePage = () => (
  <div className="stake-content">
    <h2 className="loan-title">Funding</h2>
    <p className="loan-subtitle">Fund the bank to receive a share of loan profits.<br />Below is the latest offering that is currently available.</p>
    <div className="stake-card">
      <div className="stake-card-left">
        <div className="stake-offering-title">Latest Offering</div>
        <div className="stake-offering-percent">15% <span>of loan profits</span></div>
        <div className="stake-progress-bar">
          <div className="stake-progress" style={{width: '70%'}}></div>
        </div>
        <div className="stake-progress-labels">
          <span>$350,000</span>
          <span>$500,000</span>
        </div>
      </div>
      <div className="stake-card-right">
        <button className="btn btn-blue-filled stake-connect">Connect Wallet</button>
        <div className="stake-purchase-label">Purchase with USDC</div>
      </div>
    </div>
  </div>
);

export default StakePage; 