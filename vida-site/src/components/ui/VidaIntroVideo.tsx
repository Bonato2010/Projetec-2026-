'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function VidaIntroVideo({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    // Prevent default behaviors globally during the video to force users to wait
    const preventDefault = (e: Event) => e.preventDefault();

    document.body.style.overflow = 'hidden';
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
    document.body.addEventListener('keydown', preventDefault, { passive: false });
    document.body.addEventListener('contextmenu', preventDefault, { passive: false });
    document.body.addEventListener('wheel', preventDefault, { passive: false });

    return () => {
      document.body.style.overflow = '';
      document.body.removeEventListener('touchmove', preventDefault);
      document.body.removeEventListener('keydown', preventDefault);
      document.body.removeEventListener('contextmenu', preventDefault);
      document.body.removeEventListener('wheel', preventDefault);
    };
  }, []);

  const attemptPlay = async () => {
    if (!videoRef.current) return;

    try {
      // First try playing with audio
      videoRef.current.muted = false;
      await videoRef.current.play();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        // Fallback to muted autoplay
        console.log("Unmuted autoplay blocked, falling back to muted.");
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(console.error);
        }
      }
    }
  };

  useEffect(() => {
    // Attempt play on mount if already loaded
    if (videoRef.current && videoRef.current.readyState >= 3) {
       attemptPlay();
    }
  }, []);

  const handleEnded = () => {
    setIsEnded(true);
    // Add a slight delay before unmounting to allow the fade out animation to run smoothly
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleError = () => {
    console.error("Failed to load vida-intro.mp4. Proceeding to experience.");
    handleEnded();
  };

  return (
    <AnimatePresence>
      {!isEnded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-black w-full h-full flex items-center justify-center pointer-events-auto"
          style={{
            willChange: 'opacity, transform',
            transform: 'translateZ(0)',
          }}
        >
            <video
                ref={videoRef}
                src="/vida-intro.mp4"
                playsInline
                preload="auto"
                onEnded={handleEnded}
                onError={handleError}
                onCanPlay={attemptPlay}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="w-full h-full object-cover"
                style={{
                    pointerEvents: 'none',
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                }}
            />
            {/* Fallback invisible overlay to absolutely guarantee no interaction */}
            <div className="absolute inset-0 z-10 w-full h-full pointer-events-auto"
                 onContextMenu={(e) => e.preventDefault()}
                 onDragStart={(e) => e.preventDefault()}
                 onTouchStart={(e) => e.preventDefault()}
                 onKeyDown={(e) => e.preventDefault()}
                 onClick={(e) => e.preventDefault()}
                 onWheel={(e) => e.preventDefault()}
            />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
