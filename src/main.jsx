import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import './theme.css'; // Import our theme variables
import './design-system.css'; // Import our design system
import './components/FooterFix.css'; // Import footer positioning fix

// Import image optimization utilities (will auto-setup on import)
import './utils/optimizeImages.js';

// Add performance monitoring in development
if (import.meta.env.DEV) {
  console.log('Karni Exim running in development mode');
  
  // Report initial load performance metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`📊 Page fully loaded in ${Math.round(pageLoadTime)}ms`);
      }
    }, 0);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
