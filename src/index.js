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

function setupGameVideoController() {
  const pausedState = new Map();
  let active = false;
  let monitorId = null;
  const findVideos = () => Array.from(document.querySelectorAll('.cards-grid video, .drink-card__video-container video, .loop-video video'));
  const forcePauseListener = (e) => {
    if (active) {
      const v = e.currentTarget;
      try { v.pause(); } catch (_) {}
    }
  };
  const openHandler = () => {
    active = true;
    const vids = findVideos();
    vids.forEach((v) => {
      const wasPlaying = !v.paused && !v.ended;
      pausedState.set(v, { wasPlaying, time: v.currentTime });
      try { v.pause(); } catch (_) {}
      v.addEventListener('play', forcePauseListener);
    });
    if (!monitorId) {
      let baseline = null;
      monitorId = setInterval(() => {
        const mem = performance && performance.memory ? performance.memory.usedJSHeapSize : null;
        if (baseline == null && mem != null) baseline = mem;
        const vidsNow = findVideos();
        const playingCount = vidsNow.filter((v) => !v.paused && !v.ended).length;
        const info = { playingCount, mem, baseline };
        console.log('GameActiveResourceMonitor', info);
      }, 2000);
    }
  };
  const closeHandler = () => {
    active = false;
    const vids = findVideos();
    vids.forEach((v) => {
      v.removeEventListener('play', forcePauseListener);
      const st = pausedState.get(v);
      if (st) {
        try {
          v.currentTime = st.time || v.currentTime;
          if (st.wasPlaying) v.play().catch(() => {});
        } catch (_) {}
      }
    });
    pausedState.clear();
    if (monitorId) {
      clearInterval(monitorId);
      monitorId = null;
    }
  };
  window.addEventListener('game:open', openHandler);
  window.addEventListener('game:close', closeHandler);
}

setupGameVideoController();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);