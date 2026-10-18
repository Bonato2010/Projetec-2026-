'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroVideo({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEnded, setIsEnded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    // Prevent default touch behaviors (like swipe to go back) globally during the video
    const preventDefault = (e: TouchEvent) => e.preventDefault();

    // We add it to document body to catch everything while this component is mounted
    document.body.style.overflow = 'hidden';
    document.body.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      document.body.style.overflow = '';
      document.body.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  const handleEnded = () => {
    setIsEnded(true);
    // Add a slight delay before unmounting to allow the fade out animation to run smoothly
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleError = () => {
    console.error("Failed to load fundo.mp4. Proceeding to prototype.");
    handleEnded();
  };

  const handleCanPlayThrough = () => {
    if (videoRef.current) {
      setIsBuffering(false);
      videoRef.current.play().catch(console.error);
    }
  };

  // Check if video is already buffered enough when component mounts (handles cache hits)
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 4) {
      handleCanPlayThrough();
    }
  }, []);

  return (
    <AnimatePresence>
      {!isEnded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-black w-full h-full flex items-center justify-center pointer-events-none"
          // We use pointer-events-none to literally block ALL interaction with the video element
          // and anything beneath it. No clicks, no dragging, no context menus.
          style={{
            willChange: 'opacity, transform',
            transform: 'translateZ(0)', // Force GPU hardware acceleration for smooth 120Hz composites
          }}
        >
            {/* Show a subtle loading indicator while the video buffers to prevent playing before sufficient data is loaded */}
            {isBuffering && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                  <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-eco-green-light animate-spin" />
              </div>
            )}

            <video
                ref={videoRef}
                src="/fundo.mp4"
                playsInline
                muted // Muted initially to ensure autoplay works on modern browsers without user gesture
                preload="auto" // Eagerly load for seamless playback start
                onEnded={handleEnded}
                onError={handleError}
                onCanPlayThrough={handleCanPlayThrough}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="w-full h-full object-cover"
                style={{
                    pointerEvents: 'none',
                    willChange: 'transform',
                    transform: 'translateZ(0)', // Offload video compositing to GPU
                }}
            />

            {/* Fallback invisible overlay to absolutely guarantee no interaction */}
            <div className="absolute inset-0 z-10 w-full h-full pointer-events-auto"
                 onContextMenu={(e) => e.preventDefault()}
                 onDragStart={(e) => e.preventDefault()}
                 onTouchStart={(e) => e.preventDefault()}
                 onKeyDown={(e) => e.preventDefault()}
            />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
