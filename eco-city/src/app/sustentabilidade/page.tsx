export default function Sustentabilidade() {
  return (
    <div className="min-h-screen bg-brand-black text-white p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-brand-green">Sustentabilidade e Resiliência</h1>
        <p className="text-xl leading-relaxed mb-6 text-white/80">
          Decisões de hoje moldam a cidade de amanhã. A ECO-CITY calcula os trade-offs necessários para equilibrar desenvolvimento e ecologia.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Segurança Hídrica</h3>
            <p className="text-sm text-white/60">Simulação de racionamentos e investimentos em reuso de água.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Transição Energética</h3>
            <p className="text-sm text-white/60">Análise de picos de consumo e adoção de infraestrutura inteligente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
