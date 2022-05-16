import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Rotas from './routes';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Rotas />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);