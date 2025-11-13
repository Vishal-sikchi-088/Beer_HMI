import React, { useState, useEffect, useRef } from 'react';
import { FaCoffee, FaBeer, FaPlay, FaPause } from 'react-icons/fa';
import './ChargerCard.css';

// Detailed drink preparation steps
const drinkSteps = {
  cocacola: [
    "Summoning the Fizz Gods",
    "Fizz Storm Brewing",
    "Ice Cubes on Duty",
    "Perfect Pour in Progress",
    "Final Fizz Inspection",
    "Your Coca-Cola is Ready!"
  ],
  beer: [
    "Waking Up the Brew Crew",
    "Foam Factory Activated",
    "Beer River Flowing",
    "Hops & Barley Dance Party",
    "Foam Level Check",
    "Beer is Served!"
  ]
};

const ChargerCard = ({ 
  drinkType, 
  isActive, 
  isPreparing, 
  onSelect, 
  disabled 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [bubbles, setBubbles] = useState([]);
  const [foamSplashes, setFoamSplashes] = useState([]);
  const videoRef = useRef(null);

  const DrinkIcon = drinkType === 'beer' ? FaBeer : FaCoffee;
  const drinkColor = drinkType === 'beer' ? '#FFB300' : '#C62828';
  const videoSrc = drinkType === 'beer' ? '/beer.mp4' : '/cocacola.mp4';

  // Progress animation during preparation
  useEffect(() => {
    if (isPreparing) {
      const totalSteps = drinkSteps[drinkType].length;
      const stepDuration = 3000; // 3 seconds per step
      
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          if (nextStep >= totalSteps) {
            clearInterval(stepInterval);
            return totalSteps - 1;
          }
          return nextStep;
        });
      }, stepDuration);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (totalSteps * stepDuration / 50));
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 50);

      return () => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      };
    } else {
      setCurrentStep(0);
      setProgress(0);
    }
  }, [isPreparing, drinkType]);

  // Generate interactive bubbles for Coca-Cola
  useEffect(() => {
    if (drinkType === 'cocacola' && isActive) {
      const generateBubbles = () => {
        const newBubbles = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          size: Math.random() * 15 + 8,
          delay: Math.random() * 2
        }));
        setBubbles(newBubbles);
      };

      generateBubbles();
      const bubbleInterval = setInterval(generateBubbles, 5000);
      return () => clearInterval(bubbleInterval);
    } else {
      setBubbles([]);
    }
  }, [drinkType, isActive]);

  // Generate foam splashes for Beer
  useEffect(() => {
    if (drinkType === 'beer' && isActive) {
      const generateFoam = () => {
        const newFoam = Array.from({ length: 6 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 70 + 15,
          y: Math.random() * 50 + 25,
          size: Math.random() * 20 + 12,
          delay: Math.random() * 1.5
        }));
        setFoamSplashes(newFoam);
      };

      generateFoam();
      const foamInterval = setInterval(generateFoam, 4000);
      return () => clearInterval(foamInterval);
    } else {
      setFoamSplashes([]);
    }
  }, [drinkType, isActive]);

  // Video control
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Bubble pop interaction
  const popBubble = (bubbleId) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== bubbleId));
    // Add pop effect here if needed
  };

  // Foam splash interaction
  const splashFoam = (foamId) => {
    setFoamSplashes(prev => prev.filter(foam => foam.id !== foamId));
    // Add splash effect here if needed
  };

  // Progress circle calculations
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className={`drink-card drink-card--${drinkType} ${
        isActive ? 'drink-card--active' : ''
      } ${
        isPreparing ? 'drink-card--preparing' : ''
      } ${
        disabled ? 'drink-card--disabled' : ''
      }`}
      onClick={!disabled ? onSelect : undefined}
      style={{
        borderColor: isActive ? `${drinkColor}66` : 'rgba(224, 224, 224, 0.1)',
        boxShadow: isActive 
          ? `0 20px 60px ${drinkColor}33, inset 0 1px 0 ${drinkColor}22`
          : '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Card Header */}
      <div className="drink-card__header">
        <div className="drink-card__icon-container">
          <DrinkIcon 
            className="drink-card__icon"
            style={{ color: drinkColor }}
          />
        </div>
        <div className="drink-card__title-container">
          <h2 className="drink-card__title">
            {drinkType === 'cocacola' ? 'Coca-Cola' : 'Beer'}
          </h2>
          <p className="drink-card__subtitle">
            {isPreparing ? 'Preparing...' : 'Ready to Serve'}
          </p>
        </div>
        {isActive && (
          <div 
            className="drink-card__status"
            style={{ 
              background: `linear-gradient(135deg, ${drinkColor}, ${drinkColor}CC)`,
              boxShadow: `0 0 15px ${drinkColor}66`
            }}
          >
            ACTIVE
          </div>
        )}
      </div>

      {/* Video Background */}
      <div className="drink-card__video-container">
        <video
          ref={videoRef}
          className="drink-card__video"
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="drink-card__video-overlay"></div>
        
        <button 
          className="drink-card__video-control" 
          onClick={(e) => {
            e.stopPropagation();
            toggleVideo();
          }}
        >
          {isVideoPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>

      {/* Progress Section */}
      {isPreparing && (
        <div className="drink-card__progress-section">
          <div className="drink-card__progress-circle">
            <svg className="drink-card__progress-svg" viewBox="0 0 120 120">
              <defs>
                <linearGradient id={`gradient-${drinkType}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={drinkColor} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={drinkColor} stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <circle
                className="drink-card__progress-bg"
                cx="60"
                cy="60"
                r="54"
              />
              <circle
                className="drink-card__progress-fill"
                cx="60"
                cy="60"
                r="54"
                stroke={`url(#gradient-${drinkType})`}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="drink-card__progress-content">
              <span className="drink-card__progress-percent">
                {Math.round(progress)}%
              </span>
              <span className="drink-card__progress-label">Complete</span>
            </div>
          </div>
        </div>
      )}

      {/* Step Display */}
      {isPreparing && (
        <div className="drink-card__step-container">
          <div 
            className="drink-card__step-text"
            style={{ color: drinkColor }}
          >
            {drinkSteps[drinkType][currentStep]}
          </div>
          <div className="drink-card__step-indicator">
            {drinkSteps[drinkType].map((_, index) => (
              <div
                key={index}
                className={`drink-card__step-dot ${
                  index <= currentStep ? 'drink-card__step-dot--active' : ''
                }`}
                style={{
                  backgroundColor: index <= currentStep ? drinkColor : '#333',
                  boxShadow: index <= currentStep ? `0 0 8px ${drinkColor}66` : 'none'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Interactive Bubbles (Coca-Cola) */}
      {drinkType === 'cocacola' && bubbles.length > 0 && (
        <div className="drink-card__bubbles">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="drink-card__bubble"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                animationDelay: `${bubble.delay}s`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                popBubble(bubble.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Interactive Foam (Beer) */}
      {drinkType === 'beer' && foamSplashes.length > 0 && (
        <div className="drink-card__foam-splashes">
          {foamSplashes.map((foam) => (
            <div
              key={foam.id}
              className="drink-card__foam-splash"
              style={{
                left: `${foam.x}%`,
                top: `${foam.y}%`,
                width: `${foam.size}px`,
                height: `${foam.size}px`,
                animationDelay: `${foam.delay}s`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                splashFoam(foam.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Action Button */}
      {!isPreparing && (
        <div className="drink-card__action-container">
          <button 
            className="drink-card__action-btn"
            style={{
              background: `linear-gradient(135deg, ${drinkColor}, ${drinkColor}CC)`,
              boxShadow: `0 4px 15px ${drinkColor}44`
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) onSelect();
            }}
            disabled={disabled}
          >
            Prepare {drinkType === 'cocacola' ? 'Coca-Cola' : 'Beer'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChargerCard;