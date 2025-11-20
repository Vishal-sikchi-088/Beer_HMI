import React, { useEffect, useRef, useState } from 'react';

export default function SeamlessVideo({ src, className, ariaLabel }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(false);
  const [durations, setDurations] = useState([0, 0]);
  const v0 = useRef(null);
  const v1 = useRef(null);
  const CROSSFADE_MS = 400;

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
    const a = active === 0 ? v0.current : v1.current;
    const b = active === 0 ? v1.current : v0.current;
    if (!a || !b) return;
    a.play().catch(() => {});
    const handler = () => {
      const d = a.duration || durations[active];
      if (!d || !a.currentTime) return;
      const remaining = (d - a.currentTime) * 1000;
      if (remaining < CROSSFADE_MS + 50 && !fade) {
        b.currentTime = 0;
        b.play().catch(() => {});
        setFade(true);
        setTimeout(() => {
          setActive(active === 0 ? 1 : 0);
          setFade(false);
        }, CROSSFADE_MS);
      }
    };
    a.addEventListener('timeupdate', handler);
    return () => {
      a.removeEventListener('timeupdate', handler);
    };
  }, [active, fade, durations]);

  const onLoadedMeta = (idx) => (e) => {
    const d = e.currentTarget.duration || 0;
    setDurations((prev) => {
      const next = [...prev];
      next[idx] = d;
      return next;
    });
    e.currentTarget.play().catch(() => {});
  };

  const srcUrl = blobUrl || src;

  return (
    <div className={`seamless-video ${fade ? 'seamless-video--fade' : ''}`} aria-label={ariaLabel}>
      <video
        ref={v0}
        className={`seamless-video__layer ${active === 0 ? 'seamless-video__layer--active' : ''} ${className || ''}`}
        src={srcUrl}
        preload="auto"
        muted
        playsInline
        onLoadedMetadata={onLoadedMeta(0)}
      />
      <video
        ref={v1}
        className={`seamless-video__layer ${active === 1 ? 'seamless-video__layer--active' : ''} ${className || ''}`}
        src={srcUrl}
        preload="auto"
        muted
        playsInline
        onLoadedMetadata={onLoadedMeta(1)}
      />
    </div>
  );
}