'use client';

import React, { useState } from 'react';
import { VidaIntroVideo } from '@/components/ui/VidaIntroVideo';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Leaf, Droplets, Wind, Zap, Building2, Globe2 } from 'lucide-react';

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

const DataChart = dynamic(() => import('@/components/ui/DataChart').then(mod => mod.DataChart), {
  ssr: false,
});

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
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-32 space-y-[20vh]">

                {/* SEÇÃO A: FUNDAMENTOS DA SUSTENTABILIDADE */}
                <section className="relative w-full flex flex-col lg:flex-row items-center justify-start gap-16 min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="w-full lg:w-[60%] max-w-3xl"
                    >
                        <GlassCard className="p-10 md:p-14 border-l-4 border-l-eco-green-light">
                            <div className="flex items-center gap-4 mb-6">
                                <Globe2 className="w-5 h-5 text-eco-green-light" />
                                <div className="h-[1px] w-8 bg-eco-green-light/50" />
                                <h3 className="text-xs uppercase tracking-[0.3em] text-eco-green-light font-bold">Fundamentos</h3>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-thin tracking-wide text-white mb-8 leading-tight">O Desenvolvimento Sustentável</h2>
                            <div className="space-y-6 text-white/70 font-light leading-relaxed tracking-wide text-base md:text-lg">
                                <p>
                                    A sustentabilidade baseia-se no princípio de atender às necessidades do presente sem comprometer a capacidade das gerações futuras de suprir suas próprias necessidades (Relatório Brundtland, 1987).
                                </p>
                                <p>
                                    Não se trata apenas de preservação ambiental, mas de um equilíbrio intrincado entre três dimensões: <strong>ambiental, social e econômica</strong>. A vida humana, o desenvolvimento das cidades e a conservação dos recursos naturais e da biodiversidade são partes de um sistema global interdependente, onde as ações locais geram impactos planetários.
                                </p>
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
                        >
                            <GlassCard className="p-8 md:p-12 h-full flex flex-col">
                                <div className="flex items-center gap-4 mb-6">
                                    <Wind className="w-5 h-5 text-orange-400" />
                                    <h3 className="text-xs uppercase tracking-[0.3em] text-orange-400 font-bold">Mudanças Climáticas</h3>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-thin tracking-wide text-white mb-6">O Aquecimento Global</h2>
                                <p className="text-white/70 font-light leading-relaxed mb-8 flex-grow">
                                    A elevação acelerada das temperaturas globais é impulsionada pela emissão de gases de efeito estufa (GEE), majoritariamente provenientes da queima de combustíveis fósseis e do desmatamento. Mitigação (redução de emissões) e adaptação climática são urgentes, segundo o IPCC.
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
                        >
                            <GlassCard className="p-8 md:p-12 h-full flex flex-col">
                                <div className="flex items-center gap-4 mb-6">
                                    <Leaf className="w-5 h-5 text-eco-green-light" />
                                    <h3 className="text-xs uppercase tracking-[0.3em] text-eco-green-light font-bold">Biodiversidade</h3>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-thin tracking-wide text-white mb-6">Ecossistemas em Risco</h2>
                                <p className="text-white/70 font-light leading-relaxed flex-grow">
                                    A perda de habitats, impulsionada pelo desmatamento e ocupação irregular, ameaça serviços ecossistêmicos essenciais. A floresta não é apenas um santuário de espécies, mas uma infraestrutura natural que regula o clima, purifica o ar e mantém o ciclo das chuvas. A restauração ecológica é indispensável para a manutenção da vida.
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
                        className="w-full"
                    >
                         <GlassCard className="p-8 md:p-14">
                            <div className="grid lg:grid-cols-12 gap-12 items-center">
                                <div className="lg:col-span-5">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Droplets className="w-5 h-5 text-blue-400" />
                                        <h3 className="text-xs uppercase tracking-[0.3em] text-blue-400 font-bold">Água & Saneamento</h3>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-thin tracking-wide text-white mb-6">A Crise Hídrica Silenciosa</h2>
                                    <div className="space-y-4 text-white/70 font-light leading-relaxed">
                                        <p>
                                            Embora a Terra seja coberta por água, menos de 1% está disponível para consumo humano. O ciclo hidrológico está sendo alterado pelas mudanças climáticas e pela poluição dos rios e oceanos.
                                        </p>
                                        <p>
                                            O saneamento básico é a primeira linha de defesa da saúde pública. A contaminação por lançamento de esgoto sem tratamento afeta severamente os ecossistemas aquáticos e as populações urbanas periféricas (ANA - Agência Nacional de Águas).
                                        </p>
                                    </div>
                                </div>
                                <div className="lg:col-span-7 bg-black/30 rounded-2xl p-6 md:p-8 border border-white/5">
                                     <div className="flex items-center gap-4 mb-6">
                                        <Zap className="w-5 h-5 text-lime-400" />
                                        <h3 className="text-xs uppercase tracking-[0.3em] text-lime-400 font-bold">Economia Circular & Resíduos</h3>
                                    </div>
                                    <p className="text-white/80 font-light leading-relaxed mb-6">
                                        A economia linear de &quot;extrair, produzir, descartar&quot; é insustentável. A <strong>Economia Circular</strong> propõe manter materiais em uso pelo maior tempo possível. A reciclagem e a compostagem são essenciais, mas o redesenho de produtos para evitar o desperdício é o verdadeiro avanço.
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
                            className="lg:col-span-8"
                        >
                            <GlassCard className="p-8 md:p-12 h-full border-l-4 border-l-indigo-400">
                                <div className="flex items-center gap-4 mb-6">
                                    <Building2 className="w-5 h-5 text-indigo-400" />
                                    <h3 className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-bold">Cidades Sustentáveis</h3>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-thin tracking-wide text-white mb-6">O Desafio Urbano</h2>
                                <p className="text-white/70 font-light leading-relaxed mb-8">
                                    Mais da metade da população global vive em áreas urbanas. O planejamento inadequado resulta em ilhas de calor, problemas de mobilidade e aumento da poluição atmosférica, afetando diretamente a saúde pública. A infraestrutura verde e o transporte público eletrificado são caminhos vitais para mitigar esses impactos, especialmente em regiões periféricas.
                                </p>
                            </GlassCard>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="lg:col-span-4"
                        >
                            <GlassCard className="p-8 h-full flex flex-col justify-center text-center">
                                <div className="flex justify-center mb-4">
                                    <Zap className="w-8 h-8 text-yellow-400" />
                                </div>
                                <h3 className="text-xl font-light tracking-wider text-white mb-4">Transição Energética</h3>
                                <p className="text-sm text-white/60 font-light leading-relaxed">
                                    A substituição de combustíveis fósseis por fontes renováveis (solar, eólica, biomassa) é crucial. No entanto, é importante reconhecer que nenhuma fonte de energia é totalmente isenta de impactos ambientais. O desafio é maximizar a eficiência e minimizar a pegada ecológica.
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
                        >
                            <GlassCard className="p-8 h-full bg-gradient-to-b from-white/[0.05] to-transparent">
                                <h3 className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold mb-6">Agenda 2030 (ONU)</h3>
                                <h2 className="text-2xl md:text-4xl font-thin tracking-wide text-white mb-6">Objetivos de Desenv. Sustentável</h2>
                                <p className="text-white/70 font-light leading-relaxed mb-8">
                                    Os 17 ODS são um apelo global à ação para acabar com a pobreza, proteger o meio ambiente e o clima e garantir que as pessoas, em todos os lugares, possam desfrutar de paz e de prosperidade.
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
                        >
                            <GlassCard className="p-8 h-full bg-gradient-to-b from-white/[0.05] to-transparent">
                                <h3 className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold mb-6">Inovação e Ação</h3>
                                <h2 className="text-2xl md:text-4xl font-thin tracking-wide text-white mb-6">Consumo & Soluções</h2>
                                <p className="text-white/70 font-light leading-relaxed mb-6">
                                    O consumo consciente relaciona escolhas individuais às responsabilidades das infraestruturas corporativas. A inovação desempenha papel vital no monitoramento ambiental por sensores IoT, no mapeamento via satélite (INPE) e em tecnologias de restauração ecológica e infraestrutura verde para prevenção de desastres.
                                </p>
                                <div className="p-4 border-l-2 border-eco-green-light bg-eco-green-light/5 text-sm text-white/80 font-light">
                                    &quot;A tecnologia nos dá os dados e os sensores nos mostram a realidade, mas a mudança estrutural só ocorre quando aliamos ciência a políticas públicas efetivas.&quot;
                                </div>
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
