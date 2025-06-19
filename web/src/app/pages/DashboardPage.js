import React from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-logo">
            <img src="/logo.png" alt="CryptoBank Logo" className='dashboard-logo-icon' />
        </div>
        <nav className="dashboard-sidebar-nav">
          <button className="dashboard-sidebar-btn active"><span role="img" aria-label="user">👤</span></button>
          <button className="dashboard-sidebar-btn"><span role="img" aria-label="home">🏠</span></button>
          <button className="dashboard-sidebar-btn"><span role="img" aria-label="stats">📊</span></button>
          <button className="dashboard-sidebar-btn"><span role="img" aria-label="refresh">🔄</span></button>
        </nav>
        <div className="dashboard-sidebar-balance">
          <div className="dashboard-balance-circle">0</div>
          <div className="dashboard-balance-label">USDC</div>
        </div>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-topnav">
          <button className="dashboard-topnav-btn">
            <span className="dashboard-topnav-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M16 11h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <span className="dashboard-topnav-label">Deposit</span>
          </button>
          <button className="dashboard-topnav-btn">
            <span className="dashboard-topnav-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span className="dashboard-topnav-label">Stake</span>
          </button>
          <button className="dashboard-topnav-btn active">
            <span className="dashboard-topnav-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 22a5 5 0 0 0 5-5V8a5 5 0 1 0-10 0v9a5 5 0 0 0 5 5z" stroke="currentColor" strokeWidth="2"/><path d="M12 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8 6l-1.5-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M16 6l1.5-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <span className="dashboard-topnav-label">Borrow</span>
          </button>
          <button className="dashboard-topnav-btn">
            <span className="dashboard-topnav-icon">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M7 10V6a2 2 0 0 1 2-2h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 14v4a2 2 0 0 1-2 2H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 10l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 14l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span className="dashboard-topnav-label">Trade</span>
          </button>
        </div>
        <section className="dashboard-loan-section page-content">
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
        </section>
      </main>
    </div>
  );
};

export default DashboardPage; 