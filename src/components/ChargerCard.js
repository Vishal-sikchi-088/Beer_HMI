import React, { useState, useEffect, useRef } from 'react';
import { FaBeer, FaPlay, FaPause } from 'react-icons/fa';
import LoopSegmentVideo from './LoopSegmentVideo';
import PreparationPanel from './PreparationPanel';

import './ChargerCard.css';

const beerColor = '#FFB300';

const ChargerCard = ({ 
  isActive, 
  onSelect, 
  disabled 
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [foamSplashes, setFoamSplashes] = useState([]);
  const videoRef = useRef(null);

  const drinkColor = beerColor;
  const videoSrc = '/beer.mp4';
  const [isPreparingDrink, setIsPreparingDrink] = useState(true);
  

  

  useEffect(() => {
    if (isActive) {
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
  }, [isActive]);
  

  // Video control
  const toggleVideo = () => {
    setIsVideoPlaying((v) => !v);
  };

  const splashFoam = (foamId) => {
    setFoamSplashes(prev => prev.filter(foam => foam.id !== foamId));
  };

  

  return (
    <div 
      className={`drink-card drink-card--beer ${
        isActive ? 'drink-card--active' : ''
      } ${
        disabled ? 'drink-card--disabled' : ''
      }`}
      onClick={!disabled ? onSelect : undefined}
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      style={{
        borderColor: isActive ? `${drinkColor}66` : 'rgba(224, 224, 224, 0.1)',
        boxShadow: isActive 
          ? `0 20px 60px ${drinkColor}33, inset 0 1px 0 ${drinkColor}22`
          : '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}
    >
      <div className="drink-card__header">
        <div className="drink-card__icon-container">
          <FaBeer 
            className="drink-card__icon"
            style={{ color: drinkColor }}
          />
        </div>
        <div className="drink-card__title-container">
          <h2 className="drink-card__title">
            Beer
          </h2>
          <p className="drink-card__subtitle">Ready to Serve</p>
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

      <div className="drink-card__video-container">
        <LoopSegmentVideo
          src={videoSrc}
          className="drink-card__video"
          ariaLabel="Beer background video"
          playing={isVideoPlaying}
          segmentDurationMs={5000}
          crossfadeMs={250}
          enableAudio={false}
        />
        <div className="drink-card__video-overlay"></div>
        <button 
          className="drink-card__video-control" 
          onClick={(e) => {
            e.stopPropagation();
            toggleVideo();
          }}
          aria-label={isVideoPlaying ? 'Stop 5s loop' : 'Start 5s loop'}
        >
          {isVideoPlaying ? <FaPause /> : <FaPlay />}
        </button>
      
      </div>

      

      {foamSplashes.length > 0 && (
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

      <div className="drink-card__action-container">
        <PreparationPanel
                  visible={isPreparingDrink}
                  onClose={() => {
                    setIsPreparingDrink(true);
                    
                  }}
                  stepDuration={3000}
                />
      </div>
    </div>
  );
};

export default ChargerCard;