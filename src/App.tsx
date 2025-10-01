import React, { useEffect } from 'react';
import './App.css';

import { Outlet, useNavigate } from 'react-router-dom';
import Header from './commom/Header';
import Foot from './commom/Foot';
import { useAuth } from './contexts/AuthContext';

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while authentication state is being determined
  if (isLoading) {
    return (
      <div className="App" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <Outlet />
      <Foot />
    </div>
  );
}

export default App;
