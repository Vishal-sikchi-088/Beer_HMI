import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const [instructionVisible, setInstructionVisible] = useState(false);
  const [instructionText, setInstructionText] = useState('');
  const timersRef = useRef([]);

  const addTimeout = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };
  const addInterval = (fn, ms) => {
    const id = setInterval(fn, ms);
    timersRef.current.push(id);
    return id;
  };
  const clearTimers = () => {
    timersRef.current.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    timersRef.current = [];
  };

  useEffect(() => {
    setPhase('reveal');
    const runInitialSequence = () => {
      setInstructionText("Let's play Three Cards Monte");
      setInstructionVisible(true);
      addTimeout(() => {
        setInstructionVisible(false);
        addTimeout(() => {
          setInstructionText('Track the Beer card');
          setInstructionVisible(true);
          addTimeout(() => {
            setInstructionVisible(false);
            addTimeout(() => {
              addTimeout(() => {
                setInstructionVisible(false);
                addTimeout(() => {
                  setPhase('hide');
                  addTimeout(() => {
                    setInstructionText('Watch carefully. Shuffling will start shortly.');
                    setInstructionVisible(true);
                    addTimeout(() => {
                      setInstructionVisible(false);
                      startShuffle()
                    }, 2000);
                  }, 1000);
                }, 2000);
              }, 2000);
            }, 1000);
          }, 1000);
        }, 1500);
      }, 3000);
    };
    runInitialSequence();
    return () => clearTimers();
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

  const handleGuess = (i) => {
    if (result || isShuffling || phase !== 'ready' || instructionVisible) return;
    setGuess(i);
    const winIndex = base.indexOf('WIN');
    setResult(winIndex === i ? 'WIN' : 'LOSE');
  };

  const restart = () => {
    clearTimers();
    setInstructionVisible(false);
    setInstructionText('');
    setPositions(shuffle([0,1,2]));
    setGuess(null);
    setResult(null);
    setPhase('reveal');
    setCanShuffle(false);
    const runInitialSequence = () => {
      setInstructionText("Let's play Three Cards Monte");
      setInstructionVisible(true);
      addTimeout(() => {
        setInstructionVisible(false);
        addTimeout(() => {
          setInstructionText('Track the Beer card');
          setInstructionVisible(true);
          addTimeout(() => {
            setInstructionVisible(false);
            addTimeout(() => {
              addTimeout(() => {
                setInstructionVisible(false);
                addTimeout(() => {
                  setPhase('hide');
                  addTimeout(() => {
                    setInstructionText('Watch carefully. Shuffling will start shortly.');
                    setInstructionVisible(true);
                    addTimeout(() => {
                      setInstructionVisible(false);
                      startShuffle()
                    }, 2000);
                  }, 1000);
                }, 2000);
              }, 2000);
            }, 1000);
          }, 1000);
        }, 1500);
      }, 3000);
    };
    runInitialSequence();
  };

    const startShuffle = () => {
    setCanShuffle(false);
    addTimeout(() => {
      setInstructionVisible(false);
      addTimeout(() => {
        setIsShuffling(true);
        setPhase('shuffle');
        let steps = 3;
        let count = 0;
        const id = addInterval(() => {
          setPositions((pos) => {
            const i = Math.floor(Math.random() * 3);
            let j = Math.floor(Math.random() * 3);
            if (j === i) j = (j + 1) % 3;
            const next = pos.slice();
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
            addTimeout(() => {
                setInstructionText('Place your bet: Left, Center, or Right');
                setInstructionVisible(true);            
            }, 2000);

            addTimeout(() => {
              setInstructionVisible(false);
            }, 5000);
          }
        }, 1000);
      }, 1000);
    }, 500);
  };

  return (
    <div className={`monte-overlay ${result ? 'monte-overlay--done' : ''} ${instructionVisible ? 'monte-overlay--instructions' : ''}`} role="dialog" aria-label="Monte Game">
      <div className="monte-header">
        <div className="monte-head-left">
          <div className="monte-title"><FaBeer className="monte-title-icon" /> Three Card Monte</div>
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
              disabled={!!result || isShuffling || phase !== 'ready' || instructionVisible}
              style={{ transform: `translateX(calc(${positions[i]} * (100% + var(--card-gap))))` }}
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
      {instructionVisible && (
        <div className="monte-instructions-overlay" role="status" aria-live="polite">
          <div className="monte-instructions-overlay__content">{instructionText}</div>
        </div>
      )}
      
      <div className="monte-actions">
        {/* <button
          className="monte-btn monte-btn--shuffle"
          onClick={startShuffle}
          aria-label="Shuffle"
          disabled={!canShuffle || !!result || isShuffling || instructionVisible}
        >
          Shuffle
        </button> */}
      </div>
    </div>
  );
}