// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { VoterProvider } from './context/VoterContext.jsx';
import GlobalStyle from './globalStyles.js';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyle />
    <Toaster // default style for our pop-up notifications
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: '#1ABC9C', // Teal
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#e74c3c', // Red
                color: 'white',
              },
            },
          }}
        />
    <BrowserRouter>
      <VoterProvider> 
        <App />
      </VoterProvider>
    </BrowserRouter>
  </React.StrictMode>
);