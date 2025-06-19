import React from 'react';

const BorrowPage = () => (
  <form className="dashboard-loan-form">
    <h2 className="dashboard-loan-title">Request a Loan</h2>
    <label className="dashboard-loan-label">Loan Amount
      <input type="number" className="dashboard-loan-input" placeholder="" />
    </label>
    <label className="dashboard-loan-label">Term
      <select className="dashboard-loan-input">
        <option value="">Select term</option>
        <option value="6">6 months</option>
        <option value="12">12 months</option>
        <option value="24">24 months</option>
      </select>
    </label>
    <label className="dashboard-loan-label">Purpose
      <input type="text" className="dashboard-loan-input" placeholder="" />
    </label>
    <button type="submit" className="dashboard-loan-submit">Submit</button>
  </form>
);

export default BorrowPage; 