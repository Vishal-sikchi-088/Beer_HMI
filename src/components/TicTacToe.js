import React, { useMemo, useState } from 'react';
import { FaBeer } from 'react-icons/fa';
import { GiBeerBottle } from 'react-icons/gi';

export default function TicTacToe({ onClose }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState('P1');
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState(null);

  const lines = useMemo(() => (
    [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
  ), []);

  const checkWinner = (b) => {
    for (const [a,c,d] of lines) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return { w: b[a], line: [a,c,d] };
    }
    return { w: b.every(Boolean) ? 'DRAW' : null, line: null };
  };

  const handleCellClick = (idx) => {
    if (winner || board[idx]) return;
    const next = board.slice();
    next[idx] = player;
    const res = checkWinner(next);
    setBoard(next);
    if (res.w) {
      setWinner(res.w);
      setWinLine(res.line);
    } else {
      setPlayer(player === 'P1' ? 'P2' : 'P1');
    }
  };

  const restart = () => {
    setBoard(Array(9).fill(null));
    setPlayer('P1');
    setWinner(null);
    setWinLine(null);
  };

  const lineClass = () => {
    if (!winLine || winner === 'DRAW') return '';
    const [a,c,d] = winLine;
    const row = Math.floor(a / 3);
    const col = a % 3;
    if (a + 1 === c && c + 1 === d) return `ttt-line-row-${row}`;
    if (a + 3 === c && c + 3 === d) return `ttt-line-col-${col}`;
    if (a === 0 && c === 4 && d === 8) return 'ttt-line-diag-main';
    if (a === 2 && c === 4 && d === 6) return 'ttt-line-diag-anti';
    return '';
  };

  return (
    <>
      <div className={`ttt-overlay ${winner ? 'ttt-overlay--win' : ''}`} role="dialog" aria-label="Tic Tac Toe">
        <div className="ttt-header">
          <div className="ttt-turn">{player === 'P1' ? 'Beer Glass' : 'Beer Bottle'} turn</div>
          <button className="ttt-restart" onClick={restart} aria-label="Restart">Restart</button>
        </div>
        <div className="ttt-board" role="grid" aria-label="3x3 board">
          {winner && winner !== 'DRAW' && (
            <div className={`ttt-victory-line ${lineClass()}`} />
          )}
          {board.map((cell, i) => (
            <button
              key={i}
              className="ttt-cell"
              role="gridcell"
              aria-label={`Cell ${i+1}`}
              onClick={() => handleCellClick(i)}
            >
              {cell === 'P1' && <FaBeer className="ttt-icon ttt-icon--beer" />}
              {cell === 'P2' && <GiBeerBottle className="ttt-icon ttt-icon--bottle" />}
            </button>
          ))}
      </div>
      {winner && (
        <div className="ttt-result ttt-result--center" aria-live="polite">
          <div className="ttt-result-text">
            {winner !== 'DRAW' && (
              winner === 'P1' 
                ? <FaBeer className="ttt-icon ttt-icon--beer ttt-icon--win" />
                : <GiBeerBottle className="ttt-icon ttt-icon--bottle ttt-icon--win" />
            )}
            {winner === 'DRAW' ? 'Draw' : (winner === 'P1' ? 'Beer Glass wins' : 'Beer Bottle wins')}
          </div>
          <div className="ttt-result-actions">
            <button className="ttt-btn ttt-btn--restart" onClick={restart} aria-label="Restart">Restart</button>
            <button className="ttt-btn ttt-btn--close" onClick={onClose} aria-label="Close">Close</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}