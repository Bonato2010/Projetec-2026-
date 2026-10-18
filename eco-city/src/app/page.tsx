'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Dashboard } from '@/components/ui/Dashboard';
import { SimulationPanel } from '@/components/ui/SimulationPanel';
import { IntroVideo } from '@/components/ui/IntroVideo';
import { MapillaryViewer } from '@/components/ui/MapillaryViewer';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic import for the heavy 3D scene to improve initial load and avoid SSR issues
const Scene = dynamic(() => import('@/components/3d/Scene').then(mod => mod.Scene), {
    ssr: false,
});

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [entered, setEntered] = useState(false);

  return (
    <div className="relative w-full h-screen bg-brand-black">
      {/* Intro Video Sequence blocks everything until finished */}
      {!introComplete && (
        <IntroVideo onComplete={() => setIntroComplete(true)} />
      )}

      {/* 3D Background rendering container. We ONLY mount this after intro completes to prevent WebGL shader compilation from stuttering the video. */}
      {introComplete && (
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Scene />
        </div>
      )}

      <AnimatePresence>
        {introComplete && !entered && (
          <motion.div
            key="landing-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "linear" }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-sm"
            style={{
              willChange: 'opacity, transform',
              transform: 'translateZ(0)' // GPU composite for smooth entry transition
            }}
          >
            <div className="text-center max-w-3xl px-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-7xl md:text-8xl font-light tracking-[0.2em] text-white mb-6 uppercase"
              >
                <span className="text-eco-green-light">Eco</span>-<span className="text-eco-blue-light">City</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-3xl font-light text-white/80 mb-12 tracking-wide uppercase"
              >
                Uma cidade.<br />
                <span className="font-semibold text-white">Milhares de decisões.</span><br />
                Um futuro para construir.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                onClick={() => setEntered(true)}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-brand-black transition-all duration-500 bg-eco-gold font-mono uppercase tracking-[0.2em] rounded-full hover:bg-white overflow-hidden shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]"
              >
                <span className="relative z-10">ENTRAR NO PROTÓTIPO</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Only show the main UI once the intro is fully completed, faded out, and user entered */}
      <AnimatePresence>
        {entered && (
          <motion.div
            key="ui-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "linear" }}
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              willChange: 'opacity, transform',
              transform: 'translateZ(0)' // GPU composite for smooth UI fade
            }}
          >
            <Dashboard />
            <SimulationPanel />
            <div className="pointer-events-auto">
                <MapillaryViewer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
