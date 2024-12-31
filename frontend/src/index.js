import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SystemContextProvider from './Context/SystemContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SystemContextProvider>
    <App />
  </SystemContextProvider>
);
