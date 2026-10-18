'use client';

import React, { useState } from 'react';
import { VidaIntroVideo } from '@/components/ui/VidaIntroVideo';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const VidaScene = dynamic(() => import('@/components/3d/VidaScene').then(mod => mod.VidaScene), {
   ssr: false,
});

export default function VidaPage() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-brand-black text-white font-sans selection:bg-eco-green-light selection:text-brand-black">
      {/* Sequência de vídeo de introdução bloqueia tudo até terminar */}
      {!introComplete && (
        <VidaIntroVideo onComplete={() => setIntroComplete(true)} />
      )}

      {/* Fundo 3D VIDA */}
      {introComplete && <VidaScene />}

      {/* Conteúdo principal VIDA */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            key="vida-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 z-10 flex flex-col items-center pointer-events-auto overflow-y-auto"
          >
            {/* Seção Principal (Hero) */}
            <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-6">
               <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.2em] uppercase mb-8 drop-shadow-2xl"
               >
                 <span className="text-white">VI</span><span className="text-eco-green-light">DA</span>
               </motion.h1>
               <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="text-xl md:text-2xl lg:text-3xl font-light tracking-wide max-w-4xl text-white/90 drop-shadow-lg"
               >
                  O sistema invisível que sustenta tudo.
               </motion.h2>
               <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 1 }}
                  className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl font-light drop-shadow-md"
               >
                  Uma jornada pelas conexões entre natureza, ciência, sustentabilidade e saúde humana.
               </motion.p>

               {/* Indicador de rolagem */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4, duration: 1 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
               >
                  <span className="text-xs uppercase tracking-widest text-white/40 mb-2 drop-shadow-md">Explorar</span>
                  <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
               </motion.div>
            </section>

            {/* Capítulos de Conteúdo */}
            <section className="w-full max-w-5xl px-6 py-24 mx-auto space-y-32 relative z-20">
                <div className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm -z-10 rounded-3xl pointer-events-none" />

                <div className="space-y-8 p-8 md:p-12">
                    <h3 className="text-4xl font-light text-eco-blue-light border-l-2 border-eco-blue-light pl-4">A Interdependência</h3>
                    <div className="prose prose-invert prose-lg max-w-none text-white/80 font-light leading-relaxed">
                        <p>
                            A vida não existe isolada. Tudo está conectado. Água, energia, natureza, células, organismos, ambiente, cidades e saúde humana fazem parte de sistemas interdependentes.
                        </p>
                        <p>
                            O uso responsável dos recursos naturais e a preservação da biodiversidade são fundamentais para garantir a sustentabilidade. As decisões que tomamos sobre produção, consumo e infraestrutura urbana ecoam em todo o sistema. A transição para fontes de energia renováveis, como a solar e a eólica, é um passo essencial (Objetivos de Desenvolvimento Sustentável e Agenda 2030).
                        </p>
                    </div>
                </div>

                <div className="space-y-8 p-8 md:p-12">
                    <h3 className="text-4xl font-light text-eco-green-light border-l-2 border-eco-green-light pl-4">Desafios Ambientais Urbanos</h3>
                    <div className="prose prose-invert prose-lg max-w-none text-white/80 font-light leading-relaxed">
                        <p>
                            Nas grandes cidades, a concentração populacional e as atividades industriais geram desafios complexos. Fenômenos como a poluição atmosférica, contaminação da água pelo lançamento de esgoto sem tratamento, e o acúmulo inadequado de resíduos afetam diretamente a qualidade de vida.
                        </p>
                        <p>
                            A ocupação desordenada contribui para enchentes, alagamentos e a formação de ilhas de calor, problemas críticos em regiões como a Zona Oeste do Rio de Janeiro. Além disso, eventos como inversão térmica e chuva ácida demonstram como as alterações locais impactam o clima urbano e a saúde respiratória.
                        </p>
                    </div>
                </div>

                <div className="space-y-8 p-8 md:p-12">
                    <h3 className="text-4xl font-light text-eco-gold border-l-2 border-eco-gold pl-4">Economia Circular</h3>
                    <div className="prose prose-invert prose-lg max-w-none text-white/80 font-light leading-relaxed">
                        <p>
                            Enquanto a reciclagem transforma materiais descartados em matéria-prima para novos produtos, a economia circular vai além: procura manter produtos e materiais em uso por mais tempo.
                        </p>
                        <p>
                            A aplicação da Política Nacional de Resíduos Sólidos e da Estratégia Nacional de Economia Circular incentiva a redução, reutilização, reparo e reaproveitamento. A coleta seletiva é o primeiro passo essencial para facilitar o encaminhamento de plásticos, papel, vidro, metal e resíduos eletrônicos. Práticas como a compostagem completam o ciclo para resíduos orgânicos. Os benefícios incluem a redução da poluição, a preservação de recursos naturais e a geração de novas frentes de trabalho.
                        </p>
                    </div>
                </div>

                <div className="space-y-8 p-8 md:p-12">
                    <h3 className="text-4xl font-light text-white border-l-2 border-white pl-4">Meio Ambiente e Saúde Coletiva</h3>
                    <div className="prose prose-invert prose-lg max-w-none text-white/80 font-light leading-relaxed">
                        <p>
                            A saúde humana está intrinsecamente ligada à qualidade do ar que respiramos e da água que consumimos. A exposição contínua à poluição atmosférica está associada a riscos severos, enquanto a disponibilidade de água potável, saneamento e higiene são pilares da prevenção.
                        </p>
                        <p>
                            Eventos climáticos extremos — ondas de calor intensas, secas prolongadas e enchentes — amplificam as vulnerabilidades sociais. O planejamento urbano estratégico, com a ampliação de áreas verdes, é vital para mitigar esses impactos e promover ambientes mais saudáveis. Sustentabilidade não é apenas preservação, é prevenção em saúde coletiva.
                        </p>
                    </div>
                </div>

                 <div className="space-y-8 p-8 md:p-12 border-t border-white/10">
                    <h3 className="text-2xl font-light text-white/60">Referências e Fontes</h3>
                    <ul className="text-sm text-white/50 space-y-2 font-light">
                        <li>Organização Mundial da Saúde (OMS)</li>
                        <li>Programa das Nações Unidas para o Meio Ambiente (PNUMA/UNEP)</li>
                        <li>Objetivos de Desenvolvimento Sustentável (Agenda 2030)</li>
                        <li>Ministério do Meio Ambiente e Mudança do Clima</li>
                        <li>Relatório Nosso Futuro Comum (Our Common Future, 1987)</li>
                        <li>Estratégia Nacional de Economia Circular</li>
                        <li>Política Nacional de Resíduos Sólidos</li>
                    </ul>
                </div>

            </section>

             {/* Rodapé / Créditos */}
            <footer className="w-full py-12 mt-20 border-t border-white/10 text-center relative z-20">
                <div className="absolute inset-0 bg-brand-black/60 backdrop-blur-md -z-10" />
                <p className="text-sm text-white/40 font-mono tracking-widest uppercase mb-2">Projeto SOLARIS &copy; 2026</p>
                <p className="text-xs text-white/30 font-light max-w-md mx-auto">
                    Desenvolvido como uma experiência interativa e independente para a Feira Tecnológica 2026. Bangu, Campo Grande e a Zona Oeste do Rio de Janeiro.
                </p>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
