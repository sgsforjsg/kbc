import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


import { AuthProvider } from './context/AuthContext'; // Import the provider
import { MediaProvider } from './context/MediaContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <MediaProvider>
      <App />
      </MediaProvider>
    </AuthProvider>
  </React.StrictMode>,
);
