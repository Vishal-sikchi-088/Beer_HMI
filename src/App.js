import React, { useState, useEffect } from 'react';
import PreparationPanel from './components/PreparationPanel';
import ChargerCard from './components/ChargerCard';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isPreparingDrink, setIsPreparingDrink] = useState(false);
  

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDrinkSelection = (index) => {
    if (isPreparingDrink) return;
    setSelectedIndex(index);
    setIsPreparingDrink(true);
    setTimeout(() => {
      setIsPreparingDrink(false);
      setSelectedIndex(null);
    }, 18000);
  };

  

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__content">
          <div className="app-header__left">
            <div className="app-header__branding">
              <img src="/quench_symbol.png" alt="Quench Logo" className="app-logo" />
              <div className="app-header__text">
                <h1 className="app-title">Quench Your Thirst</h1>
                <p className="app-subtitle">Premium Beverage Station</p>
              </div>
            </div>
          </div>
          <div className="app-header__right">
            <div className="app-time">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="app-date">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="cards-grid" aria-label="Beer cards">
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
          <img src="/quench_symbol.png" alt="Quench Logo" className="center-logo" />
        </div>

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