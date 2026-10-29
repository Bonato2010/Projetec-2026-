'use client';

import React, { useState } from 'react';
import { VidaIntroVideo } from '@/components/ui/VidaIntroVideo';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import dynamic from 'next/dynamic';

const VidaScene = dynamic(() => import('@/components/3d/VidaScene').then(mod => mod.VidaScene), {
   ssr: false,
});

function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl ${className}`}
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.01, rotateX: 1, rotateY: -1, zIndex: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(16, 185, 129, 0.15),
                transparent 80%
              )
            `,
          }}
        />
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }

export default function VidaPage() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
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
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-32 space-y-[30vh]">

                {/* SCENE: A Interdependência */}
                <section className="relative w-full flex flex-col lg:flex-row items-center lg:items-start justify-end gap-16 min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="w-full lg:w-1/2 max-w-2xl"
                    >
                        <GlassCard className="p-10 md:p-14">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-[1px] w-8 bg-eco-blue-light/50" />
                                <h3 className="text-xs uppercase tracking-[0.3em] text-eco-blue-light font-bold">01 &mdash; Conexão Global</h3>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-thin tracking-wide text-white mb-8 leading-tight">A Interdependência</h2>
                            <div className="space-y-6 text-white/70 font-light leading-relaxed tracking-wide text-base md:text-lg">
                                <p>
                                    A vida não existe isolada. Tudo está conectado. Água, energia, natureza, células, organismos, ambiente, cidades e saúde humana fazem parte de sistemas interdependentes.
                                </p>
                                <p>
                                    O uso responsável dos recursos naturais e a preservação da biodiversidade são fundamentais para garantir a sustentabilidade. As decisões que tomamos sobre produção, consumo e infraestrutura urbana ecoam em todo o sistema. A transição para fontes de energia renováveis, como a solar e a eólica, é um passo essencial (Objetivos de Desenvolvimento Sustentável e Agenda 2030).
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>
                </section>

                {/* SCENE: Desafios Ambientais Urbanos */}
                <section className="relative w-full flex flex-col lg:flex-row items-center justify-start gap-16 min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="w-full lg:w-[65%] max-w-3xl"
                    >
                        <GlassCard className="p-10 md:p-14 border-l-4 border-l-eco-green-light">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-[1px] w-8 bg-eco-green-light/50" />
                                <h3 className="text-xs uppercase tracking-[0.3em] text-eco-green-light font-bold">02 &mdash; Impacto Local</h3>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-thin tracking-wide text-white mb-10 leading-tight">Desafios <br/><span className="text-eco-green-light font-normal">Ambientais</span> Urbanos</h2>

                            <div className="grid md:grid-cols-2 gap-8 text-white/70 font-light leading-relaxed tracking-wide text-sm md:text-base">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-white/90 border-b border-white/10 pb-2">
                                        <div className="w-2 h-2 rounded-full bg-red-400" />
                                        <span className="uppercase tracking-widest text-xs font-bold">Pressão Urbana</span>
                                    </div>
                                    <p>
                                        Nas grandes cidades, a concentração populacional e as atividades industriais geram desafios complexos. Fenômenos como a poluição atmosférica, contaminação da água pelo lançamento de esgoto sem tratamento, e o acúmulo inadequado de resíduos afetam diretamente a qualidade de vida.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-white/90 border-b border-white/10 pb-2">
                                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                                        <span className="uppercase tracking-widest text-xs font-bold">Clima e Ocupação</span>
                                    </div>
                                    <p>
                                        A ocupação desordenada contribui para enchentes, alagamentos e a formação de ilhas de calor, problemas críticos em regiões como a Zona Oeste do Rio de Janeiro. Além disso, eventos como inversão térmica e chuva ácida demonstram como as alterações locais impactam o clima urbano e a saúde respiratória.
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </section>

                {/* SCENE: Economia Circular & Saúde Coletiva */}
                <section className="relative w-full flex flex-col gap-12 lg:gap-24 min-h-[80vh]">

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="w-full max-w-4xl mx-auto"
                    >
                         <GlassCard className="p-10 md:p-14 text-center">
                            <h3 className="text-xs uppercase tracking-[0.3em] text-eco-gold mb-4 font-bold">03 &mdash; O Ciclo da Matéria</h3>
                            <h2 className="text-4xl md:text-5xl font-thin tracking-wide text-white mb-8">Economia Circular</h2>
                            <div className="space-y-6 text-white/70 font-light leading-relaxed tracking-wide text-base md:text-lg max-w-3xl mx-auto text-left md:text-center">
                                <p>
                                    Enquanto a reciclagem transforma materiais descartados em matéria-prima para novos produtos, a economia circular vai além: procura manter produtos e materiais em uso por mais tempo.
                                </p>
                                <p>
                                    A aplicação da Política Nacional de Resíduos Sólidos e da Estratégia Nacional de Economia Circular incentiva a redução, reutilização, reparo e reaproveitamento. A coleta seletiva é o primeiro passo essencial para facilitar o encaminhamento de plásticos, papel, vidro, metal e resíduos eletrônicos. Práticas como a compostagem completam o ciclo para resíduos orgânicos. Os benefícios incluem a redução da poluição, a preservação de recursos naturais e a geração de novas frentes de trabalho.
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                        className="w-full max-w-5xl mx-auto"
                    >
                        <GlassCard className="p-10 md:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-eco-cyan/5 blur-[120px] rounded-full pointer-events-none" />

                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-[1px] w-8 bg-white/50" />
                                <h3 className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold">04 &mdash; O Fator Humano</h3>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-thin tracking-wide text-white mb-10 border-l-2 border-white pl-6">Meio Ambiente e <br/>Saúde Coletiva</h2>

                            <div className="grid lg:grid-cols-2 gap-12 text-white/80 font-light leading-relaxed tracking-wide text-base md:text-lg relative z-10">
                                <p>
                                    A saúde humana está intrinsecamente ligada à qualidade do ar que respiramos e da água que consumimos. A exposição contínua à poluição atmosférica está associada a riscos severos, enquanto a disponibilidade de água potável, saneamento e higiene são pilares da prevenção.
                                </p>
                                <p>
                                    Eventos climáticos extremos — ondas de calor intensas, secas prolongadas e enchentes — amplificam as vulnerabilidades sociais. O planejamento urbano estratégico, com a ampliação de áreas verdes, é vital para mitigar esses impactos e promover ambientes mais saudáveis. Sustentabilidade não é apenas preservação, é prevenção em saúde coletiva.
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>
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
                            <div className="md:col-span-12 flex justify-center mb-8">
                                <GlassCard className="p-8 md:p-12 border border-lime-500/40 relative overflow-hidden group w-full max-w-3xl">
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
                                ].map((name, idx) => (
                                    <GlassCard key={idx} className="p-6 flex items-center justify-center text-center min-h-[120px] bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]">
                                        <h4 className="text-sm md:text-base font-light tracking-wider text-white/80">{name}</h4>
                                    </GlassCard>
                                ))}
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
                    className="w-full max-w-3xl mx-auto pt-40"
                >
                    <GlassCard className="p-8 border-none bg-white/[0.02]">
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
  );
}
