import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './AppLayout.css';

const AppLayout = () => (
  <div className="app-root">
    <header className="app-header">
      <div className="app-header-left">
        <img src="/logo.png" alt="CryptoBank Logo" className="app-logo" />
        <span className="app-title">Infinita Bank</span>
      </div>
      <div className="app-header-profile">
        <img src="/avatar.png" alt="User" className="app-avatar" />
      </div>
    </header>
    <div className="app-body">
      <aside className="app-sidebar">
        <NavLink to="/app" end className={({ isActive }) => "app-sidebar-btn" + (isActive ? " active" : "") } title="Overview">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 12L12 5l9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v9a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h2v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </NavLink>
        <NavLink to="/app/trade" className={({ isActive }) => "app-sidebar-btn" + (isActive ? " active" : "") } title="Trade">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M7 10V6a2 2 0 0 1 2-2h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 14v4a2 2 0 0 1-2 2H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 10l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 14l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </NavLink>
        <NavLink to="/app/issuances" className={({ isActive }) => "app-sidebar-btn" + (isActive ? " active" : "") } title="New Issuances">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </NavLink>
      </aside>
      <main className="app-main-content">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppLayout; 