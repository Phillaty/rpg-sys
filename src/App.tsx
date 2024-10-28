import React, { useEffect } from 'react';
import './App.css';

import { Outlet, useNavigate } from 'react-router-dom';
import Header from './commom/Header';
import Foot from './commom/Foot';
import { decrypt } from './crypt';


function App() {

  const navigate = useNavigate();

  useEffect(() => {
    const isLogged = decrypt(localStorage.getItem('user') ?? '');

    if(!isLogged) navigate('/login');

    const hasId = JSON.parse(decrypt(localStorage.getItem('user') ?? '') ?? '');

    if(!hasId.id) {
      localStorage.clear();
      navigate('/login');
    }

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
