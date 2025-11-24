import React, { useState } from 'react';
import ChargerCard from './components/ChargerCard';
import TicTacToe from './components/TicTacToe';
import MonteGame from './components/MonteGame';
import './App.css';

function App() {
  const [selectedIndex] = useState(null);
  const [isPreparingDrink] = useState(false);
  const [showTTT, setShowTTT] = useState(false);
  const [showMonte, setShowMonte] = useState(false);
  

  

  

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__content">
          <div className="app-header__left">
            <div className="app-header__branding">
              {/* <img src="/quench_symbol.png" alt="Quench Logo" className="app-logo" /> */}
              <div className="app-header__text">
                <h1 className="app-title">Quench Your Thirst</h1>
                <p className="app-subtitle">Premium Beverage Station</p>
              </div>
            </div>
          </div>
          {/* <div className="app-header__right">
            <div className="app-time">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="app-date">
              {currentTime.toLocaleDateString()}
            </div>
          </div> */}
        </div>
      </header>

      <main className="app-main">
        <div className="cards-grid" aria-label="Beer cards" onClick={() => setShowMonte(true)}>
          <ChargerCard
            isActive={true}
            disabled={isPreparingDrink && selectedIndex !== null && selectedIndex !== 0}
          />
          <ChargerCard
            isActive={true}
            disabled={isPreparingDrink && selectedIndex !== null && selectedIndex !== 1}
          />
        </div>
        
        <div className="center-logo-section">
          <img
            src="/quench_symbol.png"
            alt="Quench Logo"
            className="center-logo"
            onClick={() => setShowTTT((v) => !v)}
          />
        </div>

        {showTTT && (
          <>
            <div className="ttt-backdrop" onClick={() => setShowTTT(false)} />
            <TicTacToe onClose={() => setShowTTT(false)} />
          </>
        )}

        {showMonte && (
          <>
            <div className="monte-backdrop" onClick={() => setShowMonte(false)} />
            <MonteGame onClose={() => setShowMonte(false)} />
          </>
        )}

        {/* <PreparationPanel
          visible={isPreparingDrink}
          onClose={() => {
            setIsPreparingDrink(false);
            setSelectedIndex(null);
            
          }}
          stepDuration={3000}
        /> */}
      </main>


    </div>
  );
}

export default App;