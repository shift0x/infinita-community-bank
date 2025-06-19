import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import HomePage from './app/pages/HomePage';
import AppLayout from './app/pages/AppLayout';
import BorrowPage from './app/pages/BorrowPage';
import TradePage from './app/pages/TradePage';
import StakePage from './app/pages/StakePage';
import DepositPage from './app/pages/DepositPage';
import NewIssuancesPage from './app/pages/NewIssuancesPage';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/app",
        element: <AppLayout />,
        children: [
          { path: "borrow", element: <BorrowPage /> },
          { path: "trade", element: <TradePage /> },
          { path: "stake", element: <StakePage /> },
          { path: "deposit", element: <DepositPage /> },
          { path: "issuances", element: <NewIssuancesPage /> }
        ]
      }
    ]
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
