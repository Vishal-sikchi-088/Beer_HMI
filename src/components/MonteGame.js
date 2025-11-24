import React, { useEffect, useMemo, useState } from 'react';
import { FaBeer } from 'react-icons/fa';

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MonteGame({ onClose }) {
  const base = useMemo(() => ['WIN', 'MISS', 'MISS'], []);
  const [positions, setPositions] = useState(() => shuffle([0,1,2]));
  const [isShuffling, setIsShuffling] = useState(false);
  const [guess, setGuess] = useState(null);
  const [result, setResult] = useState(null);
  const [phase, setPhase] = useState('reveal'); // reveal -> hide -> shuffle -> ready
  const [canShuffle, setCanShuffle] = useState(false);

  useEffect(() => {
    setPhase('reveal');
    const t1 = setTimeout(() => {
      setPhase('hide');
    }, 3000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    let t;
    if (phase === 'hide') {
      setCanShuffle(false);
      t = setTimeout(() => setCanShuffle(true), 500);
    } else {
      setCanShuffle(false);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [phase]);

  const startShuffle = () => {
    setIsShuffling(true);
    setCanShuffle(false);
    setPhase('shuffle');
    let steps = 3;
    let count = 0;
    const id = setInterval(() => {
      setPositions((pos) => {
        const i = Math.floor(Math.random() * 3);
        let j = Math.floor(Math.random() * 3);
        if (j === i) j = (j + 1) % 3;
        const next = pos.slice();
        // swap the slot assignment for two card indices
        for (let k = 0; k < 3; k++) {
          if (k === i) next[k] = pos[j];
          else if (k === j) next[k] = pos[i];
        }
        return next;
      });
      count++;
      if (count >= steps) {
        clearInterval(id);
        setIsShuffling(false);
        setPhase('ready');
      }
    }, 1000);
  };

  const handleGuess = (i) => {
    if (result || isShuffling || phase !== 'ready') return;
    setGuess(i);
    const winIndex = base.indexOf('WIN');
    setResult(winIndex === i ? 'WIN' : 'LOSE');
  };

  const restart = () => {
    setPositions(shuffle([0,1,2]));
    setGuess(null);
    setResult(null);
    setPhase('reveal');
    setCanShuffle(false);
    const t1 = setTimeout(() => {
      setPhase('hide');
    }, 2000);
    return () => clearTimeout(t1);
  };

  return (
    <div className={`monte-overlay ${result ? 'monte-overlay--done' : ''}`} role="dialog" aria-label="Monte Game">
      <div className="monte-header">
        <div className="monte-head-left">
          <div className="monte-title"><FaBeer className="monte-title-icon" /> Three Card Monte</div>
          <div className="monte-subtitle">
            {phase === 'reveal' && 'Note the winning card'}
            {phase === 'hide' && 'Cards flipping. Press Shuffle to start'}
            {phase === 'shuffle' && 'Watch the shuffle carefully'}
            {phase === 'ready' && 'Place your bet: Left, Center, or Right'}
          </div>
        </div>
      </div>
      <div className="monte-board" role="grid" aria-label="3 cards">
        {base.map((c, i) => {
          const rot = (result && c === 'WIN') || (phase === 'reveal' && c === 'WIN') ? 0 : 180;
          return (
            <button
              key={i}
              className={`monte-card ${guess === i ? 'monte-card--selected' : ''} ${result ? (c === 'WIN' ? 'monte-card--win' : 'monte-card--miss') : ''}`}
              role="gridcell"
              aria-label={`Card ${i+1}`}
              onClick={() => handleGuess(i)}
              disabled={!!result || isShuffling || phase !== 'ready'}
              style={{ transform: `translateX(${positions[i] * 100}%)` }}
            >
              <div className="monte-card__inner" style={{ transform: `rotateY(${rot}deg)` }}>
                <div className="monte-card__face monte-card__face--front">
                  <FaBeer className="monte-icon monte-icon--win" />
                </div>
                <div className="monte-card__face monte-card__face--back">
                  <img src="/quench_symbol.png" alt="Quench" className="monte-logo" />
                </div>
              </div>
            </button>
          );
        })}
        {result && (
          <div className="monte-result-overlay" aria-live="polite">
            <div className={`monte-result-text ${result === 'WIN' ? 'monte-result-text--win' : 'monte-result-text--lose'}`}>
              {result === 'WIN' ? (<><FaBeer className="monte-icon monte-icon--win" /> You win a drink!</>) : 'Better luck next time'}
            </div>
            <div className="monte-actions">
              <button className="monte-btn monte-btn--restart" onClick={restart} aria-label="Restart">Restart</button>
              <button className="monte-btn monte-btn--close" onClick={onClose} aria-label="Close">Close</button>
            </div>
          </div>
        )}
      </div>
      
      <div className="monte-actions">
        <button
          className="monte-btn monte-btn--shuffle"
          onClick={startShuffle}
          aria-label="Shuffle"
          disabled={!canShuffle || !!result || isShuffling}
        >
          Shuffle
        </button>
      </div>
    </div>
  );
}