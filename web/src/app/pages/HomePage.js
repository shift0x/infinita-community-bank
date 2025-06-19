import React from 'react';
import './HomePage.css';
import { NavLink } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="homepage-logo-nav">
          <div className="homepage-logo">
            <img src="/logo.png" alt="CryptoBank Logo" className="homepage-logo-img" />
            <span className="homepage-logo-text">Infinita Bank</span>
          </div>
          <nav className="homepage-nav">
            <NavLink to="/app" className='homepage-nav-link'>
              Dashboard
            </NavLink>
            
          </nav>
        </div>
      </header>
      <main className="homepage-main">
        <section className="homepage-hero-text">
          <h1 className="homepage-title">Real World Loans for Infinita Citizens</h1>
          <p className="homepage-subtitle">Unlock capital for real world projects in infinita with lending powered by crypto</p>
          <NavLink to="/app" >
            <button className='button-dark'>Get Started</button>
          </NavLink>
        </section>
        <section className="homepage-hero-image">
          <img src="/crypto-bank.png" alt="Crypto Bank Hero" className="homepage-hero-img" />
        </section>
      </main>
    </div>
  );
};

export default HomePage; 