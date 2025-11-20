import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './PreparationPanel.css';

const steps = [
  'Waking Up the Brew Crew',
  'Foam Factory Activated',
  'Beer River Flowing',
  'Hops & Barley Dance Party',
  'Foam Level Check',
  'Beer is Served!'
];

export default function PreparationPanel({ visible, onClose, stepDuration = 3000 }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playingSound, setPlayingSound] = useState(false);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      setCurrent(0);
      setProgress(0);
      return;
    }
    const total = steps.length;
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        const totalMs = total * stepDuration;
        const inc = 100 / (totalMs / 50);
        let np = p + inc;
        if (np >= 100) np = 0;
        const span = 100 / total;
        const idx = Math.min(total - 1, Math.floor(np / span));
        setCurrent(idx);
        return np;
      });
    }, 50);

    return () => {
      clearInterval(progressTimer);
    };
  }, [visible, stepDuration, onClose]);

  useEffect(() => {
    if (!playingSound || !visible) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 220 + current * 90;
    gain.gain.value = 0.02;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => osc.stop(), 120);
    return () => {
      try { osc.stop(); } catch {}
    };
  }, [current, playingSound, visible]);

  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 6 + Math.random() * 10,
      delay: Math.random() * 2,
      dur: 6 + Math.random() * 4
    }));
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="prep-panel"
          role="dialog"
          aria-label="Beer preparation"
          aria-live="polite"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        >
          <div className="prep-glass">

            <div className="prep-content">
              <div
                className="prep-progress-line"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <div className="prep-progress-track">
                  <div
                    className="prep-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="prep-percent">{Math.round(progress)}%</div>
              </div>

              <motion.div
                key={current}
                className="prep-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {steps[current]}
              </motion.div>
            </div>

            <div className="prep-particles">
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="prep-particle"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: p.size,
                    height: p.size,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.dur}s`
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}