import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { HashRouter, Routes, Route } from 'react-router-dom';

import Home from './routes/Home';
import Login from './routes/LogIn&SigIn/Login';
import CreateAccount from './routes/LogIn&SigIn/CreateAccount';
import MyAccount from './routes/MyAccount';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="home" element={<Home />} />
          <Route path="myAccount" element={<MyAccount />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CreateAccount />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();
