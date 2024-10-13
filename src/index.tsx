import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import Home from './routes/Home';
import Login from './routes/LogIn&SigIn/Login';
import CreateAccount from './routes/LogIn&SigIn/CreateAccount';
import MyAccount from './routes/MyAccount';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Login />,
    children: [
      {
        path: "home",
        element: <Home />
      },
      {
        path: "myAccount",
        element: <MyAccount />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <CreateAccount />
  },
])
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
