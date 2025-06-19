import React from 'react';

const TradePage = () => (
  <div className="dashboard-trade-content">
    <h2 className="dashboard-loan-title">Buy & Sell Loans</h2>
    <p className="dashboard-loan-subtitle">Trade fractionalized loans issued by the bank.</p>
    <div className="dashboard-trade-table-card">
      <table className="dashboard-trade-table">
        <thead>
          <tr>
            <th>Loan</th>
            <th>Available</th>
            <th>Yield</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mortgage Loan<br /><span className="dashboard-loan-desc">$150,000 – 30 years</span></td>
            <td>$12,000</td>
            <td>6.2%</td>
            <td>
              <button className="dashboard-loan-submit">Buy</button>
              <button className="dashboard-loan-sell-btn">Sell</button>
            </td>
          </tr>
          <tr>
            <td>Small Business Loan<br /><span className="dashboard-loan-desc">$80,000 – 5 years</span></td>
            <td>$4,500</td>
            <td>8.1%</td>
            <td>
              <button className="dashboard-loan-submit">Buy</button>
              <button className="dashboard-loan-sell-btn">Sell</button>
            </td>
          </tr>
          <tr>
            <td>Mortgage Loan<br /><span className="dashboard-loan-desc">$200,000 – 15 years</span></td>
            <td>$20,000</td>
            <td>5.7%</td>
            <td>
              <button className="dashboard-loan-submit">Buy</button>
              <button className="dashboard-loan-sell-btn">Sell</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default TradePage; 