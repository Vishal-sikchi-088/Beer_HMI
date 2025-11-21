import React, { memo, useEffect, useState } from 'react';
import { FaBeer } from 'react-icons/fa';
import LoopSegmentVideo from './LoopSegmentVideo';

import './ChargerCard.css';

const beerColor = '#FFB300';
const steps = [
  'Waking Up the Brew Crew',
  'Foam Factory Activated',
  'Beer River Flowing',
  'Hops & Barley Dance Party',
  'Foam Level Check',
  'Beer is Served!'
];

const ChargerCard = ({ 
  isActive, 
  onSelect, 
  disabled 
}) => {
  const drinkColor = beerColor;
  const videoSrc = `${process.env.PUBLIC_URL || ''}/beer.mp4`;
  const [stepIdx, setStepIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setStepIdx((i) => (i + 1) % steps.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);
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
        {/* {isActive && (
          <div 
            className="drink-card__status"
            style={{ 
              background: `linear-gradient(135deg, ${drinkColor}, ${drinkColor}CC)`,
              boxShadow: `0 0 15px ${drinkColor}66`
            }}
          >
            ACTIVE
          </div>
        )} */}
      </div>

      <div className="drink-card__video-container">
        <LoopSegmentVideo
          src={videoSrc}
          className="drink-card__video"
          ariaLabel="Beer animated graphic"
          enableAudio={false}
          poster={`${process.env.PUBLIC_URL || ''}/beer_poster.jpg`}
          sources={[{ src: videoSrc, type: 'video/webm' }]}
        />
      
      </div>

      <div className="drink-card__prep" aria-label="Preparation steps">
        <div className="prep-ticker">
          <div className="prep-track">
            <span className="prep-item">{steps[stepIdx]}</span>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default memo(ChargerCard);