'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function VidaIntroVideo({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEnded, setIsEnded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  useEffect(() => {
    // Prevent default touch behaviors (like swipe to go back) globally during the video
    const preventDefault = (e: Event) => e.preventDefault();

    // We add it to document body to catch everything while this component is mounted
    document.body.style.overflow = 'hidden';
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
    document.body.addEventListener('keydown', preventDefault, { passive: false });
    document.body.addEventListener('contextmenu', preventDefault, { passive: false });

    return () => {
      document.body.style.overflow = '';
      document.body.removeEventListener('touchmove', preventDefault);
      document.body.removeEventListener('keydown', preventDefault);
      document.body.removeEventListener('contextmenu', preventDefault);
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
    console.error("Failed to load vida-intro.mp4. Proceeding to experience.");
    handleEnded();
  };

  const handleCanPlayThrough = () => {
    if (videoRef.current) {
      setIsBuffering(false);
      // Attempt to play with audio (unmuted). Browsers may block this without prior interaction.
      videoRef.current.muted = false;
      videoRef.current.play().catch((error) => {
        // If autoplay is blocked, it's typically a NotAllowedError
        if (error.name === 'NotAllowedError') {
           console.log("Autoplay unmuted blocked by browser. Awaiting user interaction.");
           setNeedsInteraction(true);
           setIsBuffering(false); // Stop buffering spinner since we are just waiting for a click
        } else {
           console.error("Video play error:", error);
        }
      });
    }
  };

  // Check if video is already buffered enough when component mounts (handles cache hits)
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 4) {
      handleCanPlayThrough();
    }
  }, []);

  const handleStartInteraction = () => {
    setNeedsInteraction(false);
    if (videoRef.current) {
        videoRef.current.play().catch(console.error);
    }
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
            transform: 'translateZ(0)', // Force GPU hardware acceleration for smooth 120Hz composites
          }}
        >
            {/* Start Button Overlay if browser blocked autoplay */}
            {needsInteraction && (
               <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
                   <button
                      onClick={handleStartInteraction}
                      className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white transition-all duration-500 bg-transparent border border-white/50 hover:bg-white hover:text-black font-mono uppercase tracking-[0.2em] rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                   >
                     INICIAR EXPERIÊNCIA
                   </button>
               </div>
            )}

            {/* Show a subtle loading indicator while the video buffers to prevent playing before sufficient data is loaded */}
            {isBuffering && !needsInteraction && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                  <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-eco-green-light animate-spin" />
              </div>
            )}

            <video
                ref={videoRef}
                src="/vida-intro.mp4"
                playsInline
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

            {/* Fallback invisible overlay to absolutely guarantee no interaction unless we specifically need it for the play button */}
            {!needsInteraction && (
                <div className="absolute inset-0 z-10 w-full h-full pointer-events-auto"
                     onContextMenu={(e) => e.preventDefault()}
                     onDragStart={(e) => e.preventDefault()}
                     onTouchStart={(e) => e.preventDefault()}
                     onKeyDown={(e) => e.preventDefault()}
                     onClick={(e) => e.preventDefault()}
                />
            )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
