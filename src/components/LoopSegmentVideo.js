import React, { useEffect, useRef, useState } from 'react';

export default function LoopSegmentVideo({
  src,
  className,
  ariaLabel,
  playing = true,
  segmentDurationMs = 5000,
  crossfadeMs = 250,
  enableAudio = false,
}) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(false);
  const v0 = useRef(null);
  const v1 = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.blob())
      .then((b) => {
        if (cancelled) return;
        const url = URL.createObjectURL(b);
        setBlobUrl(url);
      })
      .catch(() => setBlobUrl(null));
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const tick = () => {
      const a = active === 0 ? v0.current : v1.current;
      const b = active === 0 ? v1.current : v0.current;
      if (!a || !b) {
        rafId.current = requestAnimationFrame(tick);
        return;
      }
      a.muted = !enableAudio;
      b.muted = !enableAudio;
      if (!playing) {
        a.pause();
        b.pause();
      } else {
        a.play().catch(() => {});
        const nowMs = a.currentTime * 1000;
        const remaining = segmentDurationMs - nowMs;
        if (remaining < crossfadeMs + 20 && !fade) {
          b.currentTime = 0;
          b.play().catch(() => {});
          if (enableAudio) {
            a.muted = true;
            b.muted = false;
          }
          setFade(true);
          setTimeout(() => {
            setActive(active === 0 ? 1 : 0);
            setFade(false);
          }, crossfadeMs);
        }
        if (nowMs >= segmentDurationMs) {
          a.currentTime = 0;
          a.play().catch(() => {});
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [active, fade, playing, segmentDurationMs, crossfadeMs, enableAudio]);

  const srcUrl = blobUrl || src;

  return (
    <div className={`loop-video ${fade ? 'loop-video--fade' : ''}`} aria-label={ariaLabel}>
      <video
        ref={v0}
        className={`loop-video__layer ${active === 0 ? 'loop-video__layer--active' : ''} ${className || ''}`}
        src={srcUrl}
        preload="auto"
        playsInline
        muted={!enableAudio}
        onLoadedMetadata={(e) => {
          e.currentTarget.currentTime = 0;
          if (playing) e.currentTarget.play().catch(() => {});
        }}
        onError={() => setBlobUrl(null)}
      />
      <video
        ref={v1}
        className={`loop-video__layer ${active === 1 ? 'loop-video__layer--active' : ''} ${className || ''}`}
        src={srcUrl}
        preload="auto"
        playsInline
        muted={!enableAudio}
        onLoadedMetadata={(e) => {
          e.currentTarget.currentTime = 0;
          if (playing) e.currentTarget.play().catch(() => {});
        }}
        onError={() => setBlobUrl(null)}
      />
    </div>
  );
}