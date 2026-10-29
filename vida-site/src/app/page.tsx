'use client';

import React, { useState } from 'react';
import { VidaIntroVideo } from '@/components/ui/VidaIntroVideo';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Leaf, Droplets, Wind, Zap, Building2, Globe2 } from 'lucide-react';
import { createContext, useContext } from 'react';

const VidaScene = dynamic(() => import('@/components/3d/VidaScene').then(mod => mod.VidaScene), {
   ssr: false,
});

const HoverContext = createContext<{ activeCard: string | null, setActiveCard: (id: string | null) => void }>({
    activeCard: null,
    setActiveCard: () => {}
});

function GlassCard({ children, id, className = "" }: { children: React.ReactNode, id: string, className?: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const { activeCard, setActiveCard } = useContext(HoverContext);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    const isActive = activeCard === id;
    const isOtherActive = activeCard !== null && activeCard !== id;

    return (
      <motion.div
        className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 ease-out backdrop-blur-xl
            ${isActive ? 'border-white/40 bg-black/60 shadow-[0_0_40px_rgba(255,255,255,0.1)] z-50' :
              isOtherActive ? 'border-white/5 bg-black/20 blur-[2px] opacity-40 scale-95 z-10' :
              'border-white/10 bg-black/40 z-20 hover:border-white/30'}
            ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setActiveCard(id)}
        onMouseLeave={() => setActiveCard(null)}
        animate={{
            scale: isActive ? 1.05 : isOtherActive ? 0.95 : 1,
            rotateX: isActive ? 2 : 0,
            rotateY: isActive ? -2 : 0
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                800px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.1),
                transparent 80%
              )
            `,
          }}
        />
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
}

const DataChart = dynamic(() => import('@/components/ui/DataChart').then(mod => mod.DataChart), {
  ssr: false,
});

export default function VidaPage() {
  const [introComplete, setIntroComplete] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <HoverContext.Provider value={{ activeCard, setActiveCard }}>
    <div className="relative w-full min-h-screen bg-brand-black text-white font-sans selection:bg-eco-green-light selection:text-brand-black overflow-x-hidden">

      {/* Introduction Video Layer */}
      {!introComplete && <VidaIntroVideo onComplete={() => setIntroComplete(true)} />}

      {/* 3D Global Environment */}
      {introComplete && <VidaScene />}

      {/* Cinematic Content Layer */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            id="vida-content-scroll"
            key="vida-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 z-10 pointer-events-auto overflow-y-auto overflow-x-hidden"
          >
            {/* Global Blur Overlay scoped to scroll container */}
            <AnimatePresence>
                {activeCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* HERO SCENE */}
            <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center text-center px-6">
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                 className="flex flex-col items-center"
               >
                 <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-thin tracking-[0.4em] uppercase mb-6 drop-shadow-2xl leading-none ml-4">
                   <span className="text-white">VI</span><span className="text-eco-green-light font-light">DA</span>
                 </h1>
                 <h2 className="text-xl md:text-2xl lg:text-3xl font-light tracking-[0.2em] max-w-4xl text-white/90 uppercase drop-shadow-lg">
                    O sistema invisível que sustenta tudo.
                 </h2>
                 <p className="mt-8 text-base md:text-lg text-white/60 max-w-2xl font-light tracking-widest drop-shadow-md">
                    Uma jornada pelas conexões entre natureza, ciência, sustentabilidade e saúde humana.
                 </p>
               </motion.div>

               {/* Scroll Indicator */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3, duration: 2 }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
               >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4 drop-shadow-md">Descubra</span>
                  <motion.div
                    animate={{ height: [20, 60, 20], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-[1px] bg-gradient-to-b from-white/60 to-transparent"
                  />
               </motion.div>
            </section>

            {/* EDITORIAL SCENES */}
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-32 space-y-[20vh]">

                {/* SEÇÃO A: FUNDAMENTOS DA SUSTENTABILIDADE */}
                <section className="relative w-full flex flex-col lg:flex-row items-center justify-start gap-16 min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`w-full lg:w-[60%] max-w-3xl transition-all duration-300 ${activeCard === 'card-fundamentos' ? 'z-50 relative' : 'z-0'}`}
                    >
                        <GlassCard id="card-fundamentos" className="p-10 md:p-14 border-l-4 border-l-eco-green-light">
                            <div className="flex items-center gap-4 mb-6">
                                <Globe2 className="w-5 h-5 text-eco-green-light" />
                                <div className="h-[1px] w-8 bg-eco-green-light/50" />
                                <h3 className="text-xs uppercase tracking-[0.3em] text-eco-green-light font-bold">Fundamentos</h3>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-eco-green-light to-white mb-6 leading-tight">O Equilíbrio Essencial</h2>
                            <div className="space-y-4 text-white/80 font-light leading-relaxed tracking-wide text-lg md:text-xl">
                                <p>
                                    O desenvolvimento sustentável une as dimensões ambiental, social e econômica. Nossas ações locais geram impactos planetários.
                                </p>
                                <button className="mt-4 px-6 py-2 rounded-full border border-eco-green-light/30 text-eco-green-light text-sm font-medium hover:bg-eco-green-light/10 transition-colors">
                                    Explorar tema
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                </section>

                {/* SEÇÃO B & C: MUDANÇAS CLIMÁTICAS E BIODIVERSIDADE */}
                <section className="relative w-full flex flex-col gap-12 min-h-[80vh]">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1 }}
                            className={`transition-all duration-300 ${activeCard === 'card-clima' ? 'z-50 relative' : 'z-0'}`}
                        >
                            <GlassCard id="card-clima" className="p-8 md:p-12 h-full flex flex-col">
                                <div className="flex items-center gap-4 mb-6">
                                    <Wind className="w-5 h-5 text-orange-400" />
                                    <h3 className="text-xs uppercase tracking-[0.3em] text-orange-400 font-bold">Mudanças Climáticas</h3>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-4">Aquecimento Global</h2>
                                <p className="text-white/80 font-light leading-relaxed mb-6 flex-grow text-lg">
                                    Emissões de gases estufa aceleram a temperatura global. A urgência climática exige mitigação imediata (IPCC).
                                </p>
                                <div className="h-48 w-full bg-black/20 rounded-xl p-4 border border-white/5">
                                    <p className="text-xs text-white/50 mb-2 font-mono uppercase">Anomalia de Temp. Global (°C) - Fonte: NASA</p>
                                    <DataChart
                                        type="area"
                                        color="#fb923c"
                                        dataKey="temp"
                                        data={[
                                            { year: '1980', temp: 0.27 },
                                            { year: '1990', temp: 0.44 },
                                            { year: '2000', temp: 0.42 },
                                            { year: '2010', temp: 0.72 },
                                            { year: '2020', temp: 1.02 },
                                            { year: '2023', temp: 1.17 }
                                        ]}
                                    />
                                </div>
                            </GlassCard>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`transition-all duration-300 ${activeCard === 'card-biodiversidade' ? 'z-50 relative' : 'z-0'}`}
                        >
                            <GlassCard id="card-biodiversidade" className="p-8 md:p-12 h-full flex flex-col">
                                <div className="flex items-center gap-4 mb-6">
                                    <Leaf className="w-5 h-5 text-eco-green-light" />
                                    <h3 className="text-xs uppercase tracking-[0.3em] text-eco-green-light font-bold">Biodiversidade</h3>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-eco-green-light to-lime-300 mb-4">Ecossistemas em Risco</h2>
                                <p className="text-white/80 font-light leading-relaxed flex-grow text-lg">
                                    A perda de habitats ameaça serviços essenciais. Restaurar a biodiversidade é garantir nossa infraestrutura natural.
                                </p>
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <span className="block text-2xl font-light text-eco-green-light mb-1">1 Milhão</span>
                                        <span className="text-xs text-white/50 uppercase tracking-wider">Espécies em risco de extinção (IPBES)</span>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <span className="block text-2xl font-light text-eco-green-light mb-1">~30%</span>
                                        <span className="text-xs text-white/50 uppercase tracking-wider">Da superfície terrestre é coberta por florestas (ONU)</span>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                </section>

                {/* SEÇÃO D & E: ÁGUA E ECONOMIA CIRCULAR */}
                <section className="relative w-full flex flex-col gap-12 lg:gap-24 min-h-[80vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`w-full transition-all duration-300 ${activeCard === 'card-agua' ? 'z-50 relative' : 'z-0'}`}
                    >
                         <GlassCard id="card-agua" className="p-8 md:p-14">
                            <div className="grid lg:grid-cols-12 gap-12 items-center">
                                <div className="lg:col-span-5">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Droplets className="w-5 h-5 text-blue-400" />
                                        <h3 className="text-xs uppercase tracking-[0.3em] text-blue-400 font-bold">Água & Saneamento</h3>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-6">Crise Hídrica e Saneamento</h2>
                                    <div className="space-y-4 text-white/80 font-light leading-relaxed text-lg">
                                        <p>
                                            Apenas 1% da água global é potável. O saneamento básico é a primeira linha de defesa da saúde pública (ANA).
                                        </p>
                                        <button className="mt-4 px-6 py-2 rounded-full border border-blue-400/30 text-blue-400 text-sm font-medium hover:bg-blue-400/10 transition-colors">
                                            Explorar tema
                                        </button>
                                    </div>
                                </div>
                                <div className="lg:col-span-7 bg-black/30 rounded-2xl p-6 md:p-8 border border-white/5">
                                     <div className="flex items-center gap-4 mb-6">
                                        <Zap className="w-5 h-5 text-lime-400" />
                                        <h3 className="text-xs uppercase tracking-[0.3em] text-lime-400 font-bold">Economia Circular & Resíduos</h3>
                                    </div>
                                    <p className="text-white/80 font-light leading-relaxed mb-6 text-lg">
                                        A economia circular rejeita o modelo de &quot;produzir e descartar&quot;. Redesenhar produtos para evitar o desperdício é o verdadeiro avanço tecnológico.
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-sm font-mono text-white/50">
                                        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">Reduzir</span>
                                        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">Reutilizar</span>
                                        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">Reciclar</span>
                                        <span className="px-3 py-1 rounded-full border border-lime-400/30 text-lime-300 bg-lime-400/10">Repensar</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </section>

                {/* SEÇÃO F & G: CIDADES SUSTENTÁVEIS E ENERGIA */}
                <section className="relative w-full flex flex-col gap-12 lg:gap-24 min-h-[80vh]">
                    <div className="grid lg:grid-cols-12 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1 }}
                            className={`lg:col-span-8 transition-all duration-300 ${activeCard === 'card-cidades' ? 'z-50 relative' : 'z-0'}`}
                        >
                            <GlassCard id="card-cidades" className="p-8 md:p-12 h-full border-l-4 border-l-indigo-400">
                                <div className="flex items-center gap-4 mb-6">
                                    <Building2 className="w-5 h-5 text-indigo-400" />
                                    <h3 className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-bold">Cidades Sustentáveis</h3>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">Cidades do Futuro</h2>
                                <p className="text-white/80 font-light leading-relaxed mb-8 text-lg">
                                    Infraestrutura verde e mobilidade eficiente mitigam ilhas de calor e poluição. Planejamento inteligente salva vidas.
                                </p>
                                <button className="mt-2 px-6 py-2 rounded-full border border-indigo-400/30 text-indigo-400 text-sm font-medium hover:bg-indigo-400/10 transition-colors">
                                    Saiba mais
                                </button>
                            </GlassCard>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`lg:col-span-4 transition-all duration-300 ${activeCard === 'card-energia' ? 'z-50 relative' : 'z-0'}`}
                        >
                            <GlassCard id="card-energia" className="p-8 h-full flex flex-col justify-center text-center">
                                <div className="flex justify-center mb-4">
                                    <Zap className="w-8 h-8 text-yellow-400" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-orange-300 mb-4">Matriz Limpa</h3>
                                <p className="text-base text-white/80 font-light leading-relaxed">
                                    Renováveis minimizam a pegada ecológica. A transição é essencial, buscando máxima eficiência.
                                </p>
                            </GlassCard>
                        </motion.div>
                    </div>
                </section>

                {/* SEÇÃO H, I, J, K: ODS, INDICADORES, CONSUMO E SOLUÇÕES */}
                <section className="relative w-full flex flex-col gap-12 lg:gap-24 min-h-[80vh]">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1 }}
                            className={`transition-all duration-300 ${activeCard === 'card-ods' ? 'z-50 relative' : 'z-0'}`}
                        >
                            <GlassCard id="card-ods" className="p-8 h-full bg-gradient-to-b from-white/[0.05] to-transparent">
                                <h3 className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold mb-6">Agenda 2030 (ONU)</h3>
                                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white mb-4">Ação Global Integrada</h2>
                                <p className="text-white/80 font-light leading-relaxed mb-6 text-lg">
                                    Os 17 ODS exigem ação unificada para proteger o clima, erradicar a pobreza e assegurar prosperidade universal.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1.5 border border-red-500/30 text-red-400 text-xs tracking-wider rounded-md bg-red-500/10">ODS 1: Erradicação da Pobreza</span>
                                    <span className="px-3 py-1.5 border border-blue-400/30 text-blue-300 text-xs tracking-wider rounded-md bg-blue-400/10">ODS 6: Água e Saneamento</span>
                                    <span className="px-3 py-1.5 border border-yellow-500/30 text-yellow-400 text-xs tracking-wider rounded-md bg-yellow-500/10">ODS 7: Energia Limpa</span>
                                    <span className="px-3 py-1.5 border border-orange-500/30 text-orange-400 text-xs tracking-wider rounded-md bg-orange-500/10">ODS 11: Cidades Sustentáveis</span>
                                    <span className="px-3 py-1.5 border border-green-500/30 text-green-400 text-xs tracking-wider rounded-md bg-green-500/10">ODS 13: Ação Contra a Mudança Global</span>
                                </div>
                            </GlassCard>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`transition-all duration-300 ${activeCard === 'card-inovacao' ? 'z-50 relative' : 'z-0'}`}
                        >
                            <GlassCard id="card-inovacao" className="p-8 h-full bg-gradient-to-b from-white/[0.05] to-transparent">
                                <h3 className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold mb-6">Inovação e Ação</h3>
                                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 mb-4">Dados e Políticas</h2>
                                <p className="text-white/80 font-light leading-relaxed mb-6 text-lg">
                                    Sensores IoT mapeiam a crise, mas a mudança estrutural exige aliar ciência rigorosa a políticas públicas.
                                </p>
                            </GlassCard>
                        </motion.div>
                    </div>
                </section>

                {/* SCENE: Equipe Oficial */}
                <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="w-full max-w-5xl mx-auto"
                    >
                        <div className="flex flex-col items-center text-center mb-16">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-[1px] w-12 bg-white/30" />
                                <h3 className="text-xs uppercase tracking-[0.4em] text-white/50 font-bold">Equipe Oficial</h3>
                                <div className="h-[1px] w-12 bg-white/30" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-thin tracking-widest text-white">Projeto V.I.D.A.</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">
                            {/* Aluno Coordenador Destaque */}
                            <div className={`md:col-span-12 flex justify-center mb-8 transition-all duration-300 ${activeCard === 'card-daniel' ? 'z-50 relative' : 'z-0'}`}>
                                <GlassCard id="card-daniel" className="p-8 md:p-12 border border-lime-500/40 relative overflow-hidden group w-full max-w-3xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 to-transparent pointer-events-none" />
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-lime-400/30 transition-all duration-700" />

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="inline-block px-4 py-1 rounded-full border border-lime-400 bg-lime-500/20 mb-6">
                                            <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.8)]">ALUNO COORDENADOR</span>
                                        </div>
                                        <h3 className="text-4xl md:text-6xl font-light tracking-wide text-lime-300 drop-shadow-[0_0_12px_rgba(163,230,53,0.5)]">
                                            Daniel de Mello Bonato
                                        </h3>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Demais Integrantes */}
                            <div className="md:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {[
                                    "Maria Eduarda Leite Domingues",
                                    "João Pedro Roldão",
                                    "Isaac Alisson",
                                    "Ana Clara Nascimento",
                                    "Lucas Cordeiro",
                                    "Jean Vargas Nogueira",
                                    "Hiasmin Vitória"
                                ].map((name, idx) => {
                                    const cardId = `equipe-${idx}`;
                                    return (
                                    <div key={idx} className={`transition-all duration-300 ${activeCard === cardId ? 'z-50 relative' : 'z-0'}`}>
                                        <GlassCard id={cardId} className="p-6 flex items-center justify-center text-center min-h-[120px] bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]">
                                            <h4 className="text-sm md:text-base font-light tracking-wider text-white/80">{name}</h4>
                                        </GlassCard>
                                    </div>
                                )})}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* SCENE: Referências */}
                 <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className={`w-full max-w-3xl mx-auto pt-40 transition-all duration-300 ${activeCard === 'card-referencias' ? 'z-50 relative' : 'z-0'}`}
                >
                    <GlassCard id="card-referencias" className="p-8 border-none bg-white/[0.02]">
                        <h3 className="text-sm uppercase tracking-[0.2em] text-white/40 mb-8 font-light text-center">Referências e Fontes Institucionais</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs text-white/30 font-light tracking-wide">
                            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/20 rounded-full"/> Organização Mundial da Saúde (OMS)</li>
                            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/20 rounded-full"/> Programa das Nações Unidas para o Meio Ambiente (PNUMA/UNEP)</li>
                            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/20 rounded-full"/> Objetivos de Desenvolvimento Sustentável (Agenda 2030)</li>
                            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/20 rounded-full"/> Ministério do Meio Ambiente e Mudança do Clima</li>
                            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/20 rounded-full"/> Relatório Nosso Futuro Comum (Our Common Future, 1987)</li>
                            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/20 rounded-full"/> Estratégia Nacional de Economia Circular</li>
                            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white/20 rounded-full"/> Política Nacional de Resíduos Sólidos</li>
                        </ul>
                    </GlassCard>
                </motion.div>

            </div>

             {/* Footer */}
            <footer className="w-full py-16 border-t border-white/10 text-center relative z-20 mt-20">
                <div className="absolute inset-0 bg-brand-black/80 backdrop-blur-xl -z-10" />
                <p className="text-sm text-white/60 font-mono tracking-widest uppercase mb-4">Projeto SOLARIS &copy; 2026</p>
                <p className="text-xs text-white/40 font-light max-w-lg mx-auto leading-relaxed">
                    Desenvolvido como uma experiência interativa e independente para a Feira Tecnológica 2026. <br/>
                    Bangu, Campo Grande e a Zona Oeste do Rio de Janeiro.
                </p>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </HoverContext.Provider>
  );
}
