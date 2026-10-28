'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function VidaIntroVideo({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEnded, setIsEnded] = useState(false);

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
          className="fixed inset-0 z-[9999] bg-black w-full h-full flex items-center justify-center pointer-events-none"
          style={{
            willChange: 'opacity, transform',
            transform: 'translateZ(0)',
          }}
        >
            <video
                ref={videoRef}
                src="/vida-intro.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={handleEnded}
                onError={handleError}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="w-full h-full object-cover"
                style={{
                    pointerEvents: 'none',
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                }}
            />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
