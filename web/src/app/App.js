import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import UserStateProvider from './providers/UserStateProvider';

function App() {
  return (
    <UserStateProvider>
      <Outlet />
    </UserStateProvider>
  );
}

export default App;
