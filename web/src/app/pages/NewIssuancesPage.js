import React from 'react';
import './NewIssuancesPage.css';

const NewIssuancesPage = () => (
  <div className="trade-content">
    <h2 className="loan-title">New Issuances</h2>
    <p className="loan-subtitle">Buy new loans directly from the bank at a fixed price and yield.</p>
    <div className="trade-table-card">
      <table className="trade-table">
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
            <td>Mortgage Loan<br /><span className="loan-desc">$250,000 – 20 years</span></td>
            <td>$1,000</td>
            <td>6.5%</td>
            <td><button className="btn btn-green-filled">Buy</button></td>
          </tr>
          <tr>
            <td>Auto Loan<br /><span className="loan-desc">$30,000 – 5 years</span></td>
            <td>$500</td>
            <td>7.2%</td>
            <td><button className="btn btn-green-filled">Buy</button></td>
          </tr>
          <tr>
            <td>Small Business Loan<br /><span className="loan-desc">$100,000 – 10 years</span></td>
            <td>$2,000</td>
            <td>8.0%</td>
            <td><button className="btn btn-green-filled">Buy</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default NewIssuancesPage; 