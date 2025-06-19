import React from 'react';

const NewIssuancesPage = () => (
  <div className="dashboard-trade-content">
    <h2 className="dashboard-loan-title">New Issuances</h2>
    <p className="dashboard-loan-subtitle">Buy new loans directly from the bank at a fixed price and yield.</p>
    <div className="dashboard-trade-table-card">
      <table className="dashboard-trade-table">
        <thead>
          <tr>
            <th>Loan</th>
            <th>Price</th>
            <th>Yield</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mortgage Loan<br /><span className="dashboard-loan-desc">$250,000 – 20 years</span></td>
            <td>$1,000</td>
            <td>6.5%</td>
            <td><button className="dashboard-loan-submit">Buy</button></td>
          </tr>
          <tr>
            <td>Auto Loan<br /><span className="dashboard-loan-desc">$30,000 – 5 years</span></td>
            <td>$500</td>
            <td>7.2%</td>
            <td><button className="dashboard-loan-submit">Buy</button></td>
          </tr>
          <tr>
            <td>Small Business Loan<br /><span className="dashboard-loan-desc">$100,000 – 10 years</span></td>
            <td>$2,000</td>
            <td>8.0%</td>
            <td><button className="dashboard-loan-submit">Buy</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default NewIssuancesPage; 