/**
 * Application Entry Point
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import global styles (PrimeReact core + custom styles)
import './index.css';

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create React root and render app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
