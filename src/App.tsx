import React, { useEffect } from 'react';
import './App.css';

import { Outlet, useNavigate } from 'react-router-dom';
import Header from './commom/Header';
import Foot from './commom/Foot';


function App() {

  const navigate = useNavigate();

  useEffect(() => {
    const isLogged = localStorage.getItem('user');

    if(!isLogged) navigate('rpg-sys/login');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Header />
      <Outlet />
      <Foot />
    </div>
  );
}

export default App;
