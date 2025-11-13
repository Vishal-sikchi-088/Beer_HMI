import React, { useState, useEffect } from 'react';
import ChargerCard from './components/ChargerCard';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isPreparingDrink, setIsPreparingDrink] = useState(false);
  const [gunAnimation, setGunAnimation] = useState(false);
  const [gunWiggle, setGunWiggle] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDrinkSelection = (drinkType) => {
    if (isPreparingDrink) return;
    
    setSelectedDrink(drinkType);
    setIsPreparingDrink(true);
    
    // Simulate drink preparation (18 seconds total - 6 steps × 3 seconds each)
    setTimeout(() => {
      setIsPreparingDrink(false);
      setGunAnimation(true);
      
      // Gun animation duration
      setTimeout(() => {
        setGunAnimation(false);
        setSelectedDrink(null);
      }, 3000);
    }, 18000);
  };

  const handleGunClick = () => {
    if (!isPreparingDrink && !gunAnimation) {
      setGunWiggle(true);
      setTimeout(() => setGunWiggle(false), 600);
    }
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
        <div className="charger-cards">
          <ChargerCard
            drinkType="cocacola"
            isActive={selectedDrink === 'cocacola'}
            isPreparing={isPreparingDrink && selectedDrink === 'cocacola'}
            onSelect={() => handleDrinkSelection('cocacola')}
            disabled={isPreparingDrink && selectedDrink !== 'cocacola'}
          />
          <ChargerCard
            drinkType="beer"
            isActive={selectedDrink === 'beer'}
            isPreparing={isPreparingDrink && selectedDrink === 'beer'}
            onSelect={() => handleDrinkSelection('beer')}
            disabled={isPreparingDrink && selectedDrink !== 'beer'}
          />
        </div>
        
        <div className="center-logo-section">
          <img src="/quench_symbol.png" alt="Quench Logo" className="center-logo" />
        </div>
      </main>


    </div>
  );
}

export default App;