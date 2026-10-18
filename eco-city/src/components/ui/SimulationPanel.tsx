'use client';

import React from 'react';
import { useSimulationStore, EventType } from '@/store/useSimulationStore';
import { AlertTriangle, Plus, Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Activity, Wind, HeartPulse } from 'lucide-react';

export function SimulationPanel() {
  const { activeEvent, triggerEvent, resolveEvent, currentView, indicators } = useSimulationStore();

  const events: { id: EventType; label: string; description: string; options: string[] }[] = [
    {
      id: 'HEATWAVE',
      label: 'ONDA DE CALOR',
      description: 'Uma onda de calor extremo atingiu a cidade. O consumo de energia para refrigeração disparou e a saúde da população está em risco.',
      options: ['Ampliar infraestrutura verde', 'Ativar plano de emergência hospitalar', 'Racionamento energético dinâmico']
    },
    {
      id: 'WATER_CRISIS',
      label: 'CRISE HÍDRICA',
      description: 'Níveis dos reservatórios criticamente baixos devido a período de seca prolongado.',
      options: ['Racionamento emergencial', 'Investir em biotecnologia de reuso', 'Campanha de conscientização']
    }
  ];

  const currentEventDetails = events.find(e => e.id === activeEvent);

  return (
    <div className="absolute bottom-12 left-12 z-20 pointer-events-auto flex gap-12 items-end">
      {/* View-Specific Centrals */}
      <AnimatePresence mode="wait">
        {currentView === 'SAUDE' && (
          <motion.div
            key="saude"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-[320px] bg-brand-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-eco-blue-base/20 text-eco-blue-light">
                <HeartPulse size={20} />
              </div>
              <h3 className="text-white font-mono text-sm tracking-widest uppercase">Central de Saúde</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[10px] text-white/50 font-mono uppercase mb-2">Ocupação Hospitalar</div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-light text-white">{indicators.hospitalOccupancy}%</div>
                  <div className={`text-xs ${indicators.hospitalOccupancy > 80 ? 'text-red-400' : 'text-eco-green-base'}`}>
                    {indicators.hospitalOccupancy > 80 ? 'CRÍTICO' : 'NORMAL'}
                  </div>
                </div>
                <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${indicators.hospitalOccupancy > 80 ? 'bg-red-400' : 'bg-eco-blue-base'} transition-all duration-1000`}
                    style={{ width: `${indicators.hospitalOccupancy}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-white/50 font-mono uppercase mb-1">Ambulâncias</div>
                  <div className="text-xl text-white font-light">12/15</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-white/50 font-mono uppercase mb-1">Tempo Médio</div>
                  <div className="text-xl text-white font-light">{Math.floor(indicators.hospitalOccupancy * 0.15)}m</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'AMBIENTAL' && (
          <motion.div
            key="ambiental"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-[320px] bg-brand-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-eco-green-base/20 text-eco-green-light">
                <Wind size={20} />
              </div>
              <h3 className="text-white font-mono text-sm tracking-widest uppercase">Central Ambiental</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[10px] text-white/50 font-mono uppercase mb-2">Qualidade do Ar (IQA)</div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-light text-white">{indicators.airQuality}</div>
                  <div className={`text-xs ${indicators.airQuality < 50 ? 'text-eco-green-base' : indicators.airQuality < 100 ? 'text-eco-gold' : 'text-red-400'}`}>
                    {indicators.airQuality < 50 ? 'BOM' : indicators.airQuality < 100 ? 'MODERADO' : 'RUIM'}
                  </div>
                </div>
                 <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden flex">
                  <div className="h-full bg-eco-green-base" style={{ width: '33%' }} />
                  <div className="h-full bg-eco-gold" style={{ width: '33%' }} />
                  <div className="h-full bg-red-400" style={{ width: '34%' }} />

                  {/* Indicator Pip */}
                  <div
                    className="absolute h-3 w-1 bg-white -mt-1 rounded-full transition-all duration-1000 shadow-[0_0_10px_white]"
                    style={{ left: `${Math.min(100, (indicators.airQuality / 150) * 100)}%` }}
                  />
                </div>
              </div>

               <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-white/50 font-mono uppercase mb-1">Emissões (CO2)</div>
                  <div className="text-xl text-white font-light">{Math.floor(indicators.energy * 2.4)}t</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] text-white/50 font-mono uppercase mb-1">Áreas Verdes</div>
                  <div className="text-xl text-eco-green-light font-light">34%</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Triggers */}
      <AnimatePresence>
        {activeEvent === 'NONE' && currentView === 'GERAL' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col gap-4"
          >
            <div className="text-[10px] text-white/40 font-mono uppercase tracking-[0.3em] ml-2">Simulação Climática</div>
            <div className="flex gap-3">
              <button
                onClick={() => triggerEvent('HEATWAVE')}
                className="group relative px-6 py-3 rounded-full bg-brand-black/80 backdrop-blur-md border border-eco-gold/20 hover:border-eco-gold/60 text-white/80 hover:text-eco-gold font-mono text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:shadow-[0_0_20px_rgba(251,191,36,0.2)] flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-eco-gold/0 via-eco-gold/10 to-eco-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <AlertTriangle size={14} className="text-eco-gold" /> Onda de Calor
              </button>
              <button
                onClick={() => triggerEvent('WATER_CRISIS')}
                className="group relative px-6 py-3 rounded-full bg-brand-black/80 backdrop-blur-md border border-eco-blue-base/20 hover:border-eco-blue-base/60 text-white/80 hover:text-eco-blue-light font-mono text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(14,165,233,0.1)] hover:shadow-[0_0_20px_rgba(14,165,233,0.2)] flex items-center gap-3 overflow-hidden"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-eco-blue-base/0 via-eco-blue-base/10 to-eco-blue-base/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Droplet size={14} className="text-eco-blue-base" /> Crise Hídrica
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Event Modal */}
      <AnimatePresence>
        {activeEvent !== 'NONE' && currentEventDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-brand-black/90 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] rounded-bl-none w-[450px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Warning Glow */}
            <div className={`absolute top-0 left-0 w-full h-1 ${activeEvent === 'HEATWAVE' ? 'bg-eco-gold' : 'bg-eco-blue-base'} shadow-[0_0_20px_currentColor]`} />

            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-full bg-white/5 border ${activeEvent === 'HEATWAVE' ? 'border-eco-gold/30 text-eco-gold' : 'border-eco-blue-base/30 text-eco-blue-base'}`}>
                <AlertTriangle className="animate-pulse" size={20} />
              </div>
              <div>
                 <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-1">Evento Crítico Detectado</div>
                 <h3 className="text-2xl font-light text-white tracking-wide">{currentEventDetails.label}</h3>
              </div>
            </div>

            <p className="text-white/70 text-sm mb-8 leading-relaxed font-light">
              {currentEventDetails.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-4 mb-4">
                  <div className="h-[1px] flex-1 bg-white/10" />
                  <div className="text-[10px] text-white/30 font-mono uppercase tracking-[0.2em]">Protocolos de Resposta</div>
                  <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {currentEventDetails.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => resolveEvent(opt)}
                  className="group relative w-full flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-eco-green-base/50 rounded-xl text-white/90 text-sm transition-all overflow-hidden"
                >
                  <span className="relative z-10 font-light tracking-wide">{opt}</span>
                  <Plus size={16} className="text-eco-green-light opacity-0 group-hover:opacity-100 transition-opacity -rotate-90 group-hover:rotate-0 duration-300" />

                  {/* Hover organic background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-eco-green-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
