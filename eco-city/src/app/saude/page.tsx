export default function Saude() {
  return (
    <div className="min-h-screen bg-brand-black text-white p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-red-500">Central de Saúde Urbana</h1>
        <p className="text-xl leading-relaxed mb-6 text-white/80">
          A saúde urbana não existe em um vácuo. Na ECO-CITY, observamos como a qualidade do ar, a infraestrutura verde e eventos extremos (como ondas de calor) impactam diretamente a demanda hospitalar.
        </p>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-white">Integração em Tempo Real</h2>
          <p className="text-white/70">
            Nossa simulação permite prever a ocupação de leitos e direcionamento de ambulâncias com base em indicadores de poluição e crises hídricas simuladas em toda a extensão da Zona Oeste.
          </p>
        </div>
      </div>
    </div>
  );
}
