'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';
import { X, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MapillaryViewer() {
  const { isStreetViewActive, streetViewImageId, setStreetView } = useSimulationStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isStreetViewActive && containerRef.current && streetViewImageId) {
      const accessToken = process.env.NEXT_PUBLIC_MAPILLARY_CLIENT_TOKEN;

      if (!accessToken || accessToken === '') {
        setError('Token do Mapillary não configurado. Adicione NEXT_PUBLIC_MAPILLARY_CLIENT_TOKEN ao seu arquivo .env.local.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        viewerRef.current = new Viewer({
          accessToken,
          container: containerRef.current,
          imageId: streetViewImageId,
          component: {
            cover: false, // Disable default cover to use our own loading state
            marker: true,
            popup: true,
            bearing: true,
            zoom: true,
          }
        });

        viewerRef.current.on('image', () => {
          setIsLoading(false);
        });

      } catch (err: any) {
        console.error('Mapillary Viewer Error:', err);
        setError('Falha ao carregar as imagens da rua. Tente novamente mais tarde.');
        setIsLoading(false);
      }
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
        viewerRef.current = null;
      }
    };
  }, [isStreetViewActive, streetViewImageId]);

  return (
    <AnimatePresence>
      {isStreetViewActive && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-brand-black flex flex-col"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 w-full z-10 bg-gradient-to-b from-brand-black/90 to-transparent p-6 flex justify-between items-start pointer-events-auto">
            <div className="flex items-center gap-4 bg-brand-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-xl">
              <div className="p-2 rounded-full bg-eco-blue-base/20 text-eco-blue-light animate-pulse">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-[10px] text-eco-green-light font-mono uppercase tracking-[0.2em]">Exploração de Campo</div>
                <h2 className="text-white font-light tracking-wide">UPA Realengo 24h</h2>
                <div className="text-xs text-white/50 font-mono mt-1">Rua Marechal Joaquim Inácio, RJ</div>
              </div>
            </div>

            <button
              onClick={() => setStreetView(false)}
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/50 transition-all backdrop-blur-md"
            >
              <span className="text-xs font-mono uppercase tracking-widest">Sair</span>
              <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Viewer Container */}
          <div className="flex-1 relative bg-brand-black">
            {error ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-20">
                <AlertCircle size={48} className="text-red-400 mb-4" />
                <h3 className="text-xl text-white font-light mb-2">Acesso Indisponível</h3>
                <p className="text-white/60 max-w-md mx-auto font-light leading-relaxed">
                  {error}
                </p>
              </div>
            ) : (
               <div ref={containerRef} className="w-full h-full" />
            )}

            {/* Custom Loading State */}
            <AnimatePresence>
              {isLoading && !error && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-brand-black flex flex-col items-center justify-center backdrop-blur-sm"
                >
                  <Loader2 size={48} className="text-eco-blue-light animate-spin mb-6" />
                  <div className="text-eco-green-light font-mono text-sm uppercase tracking-widest animate-pulse">
                    Conectando sistema de visualização...
                  </div>
                  <div className="text-white/40 text-xs font-mono mt-2">
                    Buscando dados de telemetria da região
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Overlay borders to maintain the futuristic look */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-black to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-eco-blue-light to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-eco-green-light to-transparent opacity-50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}