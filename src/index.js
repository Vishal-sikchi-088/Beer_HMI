import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

function setupZoomGuards() {
  const isInteractive = (el) => {
    if (!el) return false;
    return !!el.closest('input, textarea, select, [contenteditable="true"], button, a');
  };
  const allowPinch = (el) => {
    if (!el) return false;
    return !!el.closest('[data-allow-pinch="true"]');
  };
  document.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    },
    { passive: false }
  );
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      const k = e.key;
      if (k === '+' || k === '-' || k === '=' || k === 'Add' || k === 'Subtract' || k === '0') {
        e.preventDefault();
      }
    }
  });
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        const t = e.target;
        if (!isInteractive(t)) e.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );
  document.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches && e.touches.length > 1) {
        const t = e.target;
        if (!allowPinch(t)) e.preventDefault();
      }
    },
    { passive: false }
  );
  document.addEventListener(
    'touchmove',
    (e) => {
      const t = e.target;
      if (e.touches && e.touches.length > 1 && !allowPinch(t)) e.preventDefault();
      if (typeof e.scale === 'number' && e.scale !== 1 && !allowPinch(t)) e.preventDefault();
    },
    { passive: false }
  );
  document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });
}

setupZoomGuards();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);