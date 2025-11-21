import React, { useEffect, useRef } from 'react';

export default function LoopSegmentVideo({
  src,
  className,
  ariaLabel,
  enableAudio = false,
  poster,
  sources,
  autoReplay = true,
}) {
  const simpleRef = useRef(null);

  useEffect(() => {
    const v = simpleRef.current;
    if (!v) return;
    v.muted = !enableAudio;
    const tryPlay = () => v.play().catch(() => {});
    if (v.readyState >= 2) tryPlay();
    v.addEventListener('canplay', tryPlay, { once: true });
    return () => {
      v.removeEventListener('canplay', tryPlay);
    };
  }, [enableAudio]);

  const srcUrl = src;

  return (
    <div className={`loop-video`} aria-label={ariaLabel}>
      <video
        ref={simpleRef}
        className={`loop-video__layer loop-video__layer--active ${className || ''}`}
        preload="metadata"
        playsInline
        muted={!enableAudio}
        autoPlay
        poster={poster}
        crossOrigin="anonymous"
        onEnded={(e) => {
          if (autoReplay) {
            e.currentTarget.currentTime = 0;
            e.currentTarget.play().catch(() => {});
          }
        }}
        onClick={() => {
          const v = simpleRef.current;
          if (v) v.play().catch(() => {});
        }}
      >
        {sources && sources.length ? (
          sources.map((s, i) => (
            <source key={i} src={s.src} type={s.type} />
          ))
        ) : (
          <source src={srcUrl} type="video/mp4" />
        )}
      </video>
    </div>
  );
}