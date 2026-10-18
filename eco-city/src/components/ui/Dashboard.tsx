'use client';

import React from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import {
  Users, Activity, Droplets, Zap, Trash2, Wind, CarFront, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IndicatorItem = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string | number, colorClass: string }) => (
  <div className="flex items-center gap-3 p-3 bg-brand-black/60 backdrop-blur-md rounded-full border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
    <div className={`p-2 rounded-full bg-brand-black border border-white/10 ${colorClass} shadow-inner`}>
      <Icon size={16} />
    </div>
    <div className="pr-4">
      <div className="text-[10px] text-white/50 font-mono uppercase tracking-widest leading-none mb-1">{label}</div>
      <div className="text-sm font-semibold text-white leading-none">{value}</div>
    </div>
  </div>
);

import { DashboardView } from '@/store/useSimulationStore';

export function Dashboard() {
  const { indicators, selectedEntity, entityData, selectEntity, currentView, setCurrentView } = useSimulationStore();

  const views: { id: DashboardView; label: string }[] = [
    { id: 'GERAL', label: 'VISÃO GERAL' },
    { id: 'SAUDE', label: 'CENTRAL DE SAÚDE' },
    { id: 'AMBIENTAL', label: 'CENTRAL AMBIENTAL' }
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 h-screen w-screen overflow-hidden">
      {/* View Navigation */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto z-50">
        {views.map(view => (
          <button
            key={view.id}
            onClick={() => setCurrentView(view.id)}
            className={`
              relative px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300
              backdrop-blur-md border
              ${currentView === view.id
                ? 'bg-white/10 border-eco-blue-light text-white shadow-[0_0_20px_rgba(14,165,233,0.3)]'
                : 'bg-brand-black/60 border-white/10 text-white/50 hover:bg-white/5 hover:text-white/80'
              }
            `}
          >
            {currentView === view.id && (
               <motion.div
                 layoutId="activeViewIndicator"
                 className="absolute inset-0 border border-eco-blue-light rounded-full"
                 transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
               />
            )}
            <span className="relative z-10">{view.label}</span>
          </button>
        ))}
      </div>
      {/* Top Bar - Indicators with organic/tech mix */}
      <div className="flex gap-4 w-full overflow-x-auto pb-4 scrollbar-hide pointer-events-auto justify-center">
        <IndicatorItem icon={Users} label="População" value={indicators.population.toLocaleString()} colorClass="text-eco-blue-light" />
        <IndicatorItem icon={Activity} label="Saúde" value={`${indicators.health}%`} colorClass="text-eco-green-light" />
        <IndicatorItem icon={Droplets} label="Água" value={`${indicators.water}%`} colorClass="text-eco-blue-base" />
        <IndicatorItem icon={Zap} label="Energia" value={`${indicators.energy}%`} colorClass="text-eco-gold" />
        <IndicatorItem icon={Trash2} label="Resíduos" value={`${indicators.waste}%`} colorClass="text-amber-600" />
        <IndicatorItem icon={Wind} label="Qual. Ar" value={`${indicators.airQuality} AQI`} colorClass="text-teal-400" />
        <IndicatorItem icon={CarFront} label="Mobilidade" value={`${indicators.mobility}%`} colorClass="text-indigo-400" />
      </div>

      {/* Selected Entity Details Panel */}
      <AnimatePresence>
        {selectedEntity && entityData && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className="absolute right-8 top-32 w-80 bg-brand-black/80 backdrop-blur-xl border border-eco-blue-base/30 p-6 rounded-[2rem] rounded-tr-none pointer-events-auto shadow-[0_0_30px_rgba(14,165,233,0.15)] overflow-hidden"
          >
            {/* Tech line accent */}
            <div className="absolute top-0 right-0 w-32 h-[2px] bg-gradient-to-r from-transparent to-eco-blue-light" />
            <div className="absolute top-0 right-0 w-[2px] h-32 bg-gradient-to-b from-eco-blue-light to-transparent" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[10px] text-eco-green-light font-mono tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-eco-green-base animate-pulse" />
                  Inteligência Urbana
                </div>
                <h3 className="text-xl font-light text-white tracking-wide">{entityData.title}</h3>
              </div>
              <button
                onClick={() => selectEntity(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors border border-white/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {entityData.stats.map((stat: any, i: number) => (
                <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2 group">
                  <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors uppercase tracking-wider">{stat.label}</span>
                  <span className="text-sm font-mono text-eco-gold-glow">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Street View Entry Trigger if entity supports it */}
            {entityData.mapillaryId && (
              <div className="mt-6">
                <button
                  onClick={() => useSimulationStore.getState().setStreetView(true, entityData.mapillaryId)}
                  className="w-full relative px-6 py-3 rounded-xl bg-eco-blue-base/10 hover:bg-eco-blue-base/20 border border-eco-blue-base/30 hover:border-eco-blue-light transition-all text-eco-blue-light flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-eco-blue-light/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  <MapPin size={16} />
                  Explorar Rua (Mapillary)
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
