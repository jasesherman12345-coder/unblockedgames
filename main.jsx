import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App.jsx';
import './src/index.css';

function mount() {
  const rootEl = document.getElementById('root');
  if (rootEl) {
    createRoot(rootEl).render(<App />);
  } else {
    console.error('Target container #root not found');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
