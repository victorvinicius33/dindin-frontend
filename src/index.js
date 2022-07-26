import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { GlobalProvider } from './context/GlobalContext';
import MainRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <GlobalProvider>
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  </GlobalProvider>,
  document.getElementById('root')
);
