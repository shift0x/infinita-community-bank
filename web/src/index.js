import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import HomePage from './app/pages/HomePage';
import AppLayout from './app/pages/AppLayout';
import OverviewPage from './app/pages/OverviewPage';
import TradePage from './app/pages/TradePage';
import VotingPage from './app/pages/VotingPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { WagmiProvider } from 'wagmi';
import { config } from './app/lib/chain';


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
          { path: "voting", element: <VotingPage /> }
        ]
      }
    ]
  },
]);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <RouterProvider router={router} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
