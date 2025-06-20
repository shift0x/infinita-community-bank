import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import HomePage from './app/pages/HomePage';
import AppLayout from './app/pages/AppLayout';
import OverviewPage from './app/pages/OverviewPage';
import TradePage from './app/pages/TradePage';
import NewIssuancesPage from './app/pages/NewIssuancesPage';
import { ThirdwebProvider } from "@thirdweb-dev/react";

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
          { path: "", element: <OverviewPage /> },
          { path: "trade", element: <TradePage /> },
          { path: "issuances", element: <NewIssuancesPage /> }
        ]
      }
    ]
  },
]);

root.render(
  <React.StrictMode>
    <ThirdwebProvider activeChain="arbitrum-sepolia" clientId="10b979e90e7b1522923fc2edcec0b719">
      <RouterProvider router={router} />
    </ThirdwebProvider>
  </React.StrictMode>
);
