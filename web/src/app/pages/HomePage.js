import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="homepage-logo-nav">
          <div className="homepage-logo">
            <img src="/crypto-bank.png" alt="CryptoBank Logo" className="homepage-logo-img" />
            <span className="homepage-logo-text">Infinita Bank</span>
          </div>
          <nav className="homepage-nav">
            <a href="#" className='homepage-nav-link'>Dashboard</a>
          </nav>
        </div>
      </header>
      <main className="homepage-main">
        <section className="homepage-hero-text">
          <h1 className="homepage-title">Real World Loans for Infinita Citizens</h1>
          <p className="homepage-subtitle">Unlock capital for real world projects in infinita via under collateralized loans</p>
          <button className="button-dark">Get Started</button>
        </section>
        <section className="homepage-hero-image">
          <img src="/crypto-bank.png" alt="Crypto Bank Hero" className="homepage-hero-img" />
        </section>
      </main>
    </div>
  );
};

export default HomePage; 