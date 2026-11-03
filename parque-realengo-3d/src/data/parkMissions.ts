import type { V3 } from './types';

export interface MissionStep {
  id: string;
  instruction: string;
  targetDescription: string;
}

export interface ParkMission {
  id: number;
  slug: string;
  title: string;
  theme: string;
  icon: string;
  color: string;
  accent: string;
  coords: V3; // Posição 3D do marcador/beacon
  cameraPos: V3;
  cameraTarget: V3;
  summary: string;
  educationalContext: string;
  objective: string;
  impactMetric: string;
  steps: MissionStep[];
}

export const PARK_MISSIONS: ParkMission[] = [
  {
    id: 1,
    slug: 'agua-inteligente',
    title: 'Água Inteligente',
    theme: 'Captação e Reaproveitamento Pluvial',
    icon: 'drop',
    color: '#0ea5e9',
    accent: '#38bdf8',
    coords: [40, 0.2, 10],
    cameraPos: [40, 18, 55],
    cameraTarget: [40, 1, 0],
    summary: 'O Parque Realengo possui uma bacia de contenção de águas pluviais de 1.950 m³ integrada a um espelho d\'água de 1.300 m², projetados para evitar enchentes no bairro e irrigar a vegetação nativa.',
    educationalContext: 'Durante tempestades tropicais, a bacia amortece o fluxo de enxurradas que desaguam no Rio Realengo, desacelerando a velocidade da água e retendo sedimentos. A água filtrada é reutilizada para rega e manutenção do parque.',
    objective: 'Ative o sistema de comportas inteligentes para regular o nível da lâmina d\'água e direcionar o volume captado para o sistema de irrigação das mudas.',
    impactMetric: '1.950.000 litros de água pluvial retidos e reaproveitados',
    steps: [
      { id: 'step-1', instruction: 'Inspecione os sensores de nível na borda do espelho d\'água', targetDescription: 'Margem norte da bacia' },
      { id: 'step-2', instruction: 'Abra a válvula reguladora de fluxo para as biovaletas permeáveis', targetDescription: 'Comporta de drenagem' },
      { id: 'step-3', instruction: 'Ligue o sistema de bombeamento solar para o reservatório de irrigação', targetDescription: 'Bomba hidráulica sustentável' }
    ]
  },
  {
    id: 2,
    slug: 'floresta-viva',
    title: 'Floresta Viva',
    theme: 'Preservação e Restauração da Mata Atlântica',
    icon: 'tree',
    color: '#22c55e',
    accent: '#4ade80',
    coords: [-130, 0.2, -15],
    cameraPos: [-105, 16, 25],
    cameraTarget: [-145, 2, -25],
    summary: 'Foram plantadas 3.700 árvores nativas no parque, incluindo espécies nobres e ameaçadas de extinção como Pau-Brasil, Ipês e Jacarandás.',
    educationalContext: 'A recomposição florestal da Mata Atlântica em áreas urbanas recupera a umidade relativa do ar, atrai aves polinizadoras e cria corredores ecológicos fundamentais para a biodiversidade da Zona Oeste do Rio.',
    objective: 'Plante três mudas nativas nos berços preparados e registre suas espécies no catálogo de biodiversidade do parque.',
    impactMetric: '+250 kg de CO₂ sequestrados por ano e proteção ao solo',
    steps: [
      { id: 'step-1', instruction: 'Plante a muda de Ipê-Amarelo (Handroanthus albus)', targetDescription: 'Berço 01 - Alameda Central' },
      { id: 'step-2', instruction: 'Plante a muda de Pau-Brasil (Paubrasilia echinata)', targetDescription: 'Berço 02 - Bosque Nativo' },
      { id: 'step-3', instruction: 'Plante a muda de Jacarandá-Mimoso (Jacaranda mimosifolia)', targetDescription: 'Berço 03 - Encosta de Sombra' }
    ]
  },
  {
    id: 3,
    slug: 'destino-certo',
    title: 'Destino Certo',
    theme: 'Coleta Seletiva e Economia Circular',
    icon: 'recycle',
    color: '#f59e0b',
    accent: '#fbbf24',
    coords: [20, 0.2, 235],
    cameraPos: [20, 14, 265],
    cameraTarget: [20, 2, 230],
    summary: 'O Ecoponto e a Praça do Mercado recebem centenas de visitantes diariamente. A gestão eficiente de resíduos sólidos evita a poluição do solo e do lençol freático.',
    educationalContext: 'A separação correta de resíduos na fonte viabiliza o trabalho de cooperativas de reciclagem, reduz em até 80% o volume enviado para aterros sanitários e evita que plásticos cheguem aos rios e oceanos.',
    objective: 'Classifique e destine 4 tipos de resíduos encontrados no chão do parque para suas lixeiras seletivas padronizadas.',
    impactMetric: '100% dos resíduos recicláveis desviados dos aterros sanitários',
    steps: [
      { id: 'step-1', instruction: 'Descarte a garrafa PET na lixeira Vermelha (Plástico)', targetDescription: 'Lixeira Vermelha' },
      { id: 'step-2', instruction: 'Descarte a embalagem de papelão na lixeira Azul (Papel)', targetDescription: 'Lixeira Azul' },
      { id: 'step-3', instruction: 'Descarte a lata de alumínio na lixeira Amarela (Metal)', targetDescription: 'Lixeira Amarela' },
      { id: 'step-4', instruction: 'Descarte restos de frutas na lixeira Marrom (Orgânico/Compostagem)', targetDescription: 'Lixeira Marrom' }
    ]
  },
  {
    id: 4,
    slug: 'combate-ao-calor',
    title: 'Combate ao Calor',
    theme: 'Ilhas de Calor e Climatização Evaporativa',
    icon: 'wind',
    color: '#06b6d4',
    accent: '#22d3ee',
    coords: [48, 0.2, -65],
    cameraPos: [48, 25, -20],
    cameraTarget: [48, 18, -78],
    summary: 'Realengo é um dos bairros com as temperaturas mais elevadas da cidade do Rio de Janeiro, com registros acima de 40°C no verão. As 5 Super-Torres utilizam 236 bicos aspersores para resfriar o ar por nebulização flash.',
    educationalContext: 'A evaporação de microgotículas consome a energia térmica do ambiente sem molhar os frequentadores. Combinado com o sombreamento das copas e o espelho d\'água, a sensação térmica diminui drasticamente.',
    objective: 'Acione a central bioclimática para ativar a rede de 236 aspersores nas 5 Super-Torres e reduza a temperatura do microclima.',
    impactMetric: 'Redução de até 10,8°C na temperatura aparente do microclima',
    steps: [
      { id: 'step-1', instruction: 'Conecte os sensores meteorológicos de temperatura e umidade', targetDescription: 'Mastro da Super-Torre 03 (47m)' },
      { id: 'step-2', instruction: 'Calibre a pressão da rede de água desmineralizada em 70 bar', targetDescription: 'Unidade de Alta Pressão' },
      { id: 'step-3', instruction: 'Dispare a névoa em cascata pelas 5 torres simultaneamente', targetDescription: 'Painel Central Bioclimático' }
    ]
  },
  {
    id: 5,
    slug: 'parque-para-todos',
    title: 'Parque Para Todos',
    theme: 'Sustentabilidade Social e Acessibilidade Universal',
    icon: 'users',
    color: '#8b5cf6',
    accent: '#a78bfa',
    coords: [-8, 0.2, 15],
    cameraPos: [-8, 16, 50],
    cameraTarget: [-8, 3, -5],
    summary: 'A sustentabilidade não se limita à ecologia: inclui inclusão social, qualidade de vida, patrimônio público compartilhado e acessibilidade para pessoas com deficiência ou mobilidade reduzida.',
    educationalContext: 'O Parque Susana Naspolini oferece passarelas elevadas com rampas suaves (declividade ≤ 8%), piso tátil, concha acústica cultural e a Nave do Conhecimento com cursos de robótica e capacitação digital para jovens.',
    objective: 'Percorra o circuito acessível pelas passarelas até o mirante e libere a oficina pública de robótica e biotecnologia na Nave do Conhecimento.',
    impactMetric: '100% de acessibilidade universal em 78.129 m² de parque público',
    steps: [
      { id: 'step-1', instruction: 'Verifique a acessibilidade da rampa oeste (declividade máxima 7,5%)', targetDescription: 'Rampa de acesso adaptada' },
      { id: 'step-2', instruction: 'Acesse a plataforma panorâmica elevada a 7,8 metros do solo', targetDescription: 'Mirante das Super-Torres' },
      { id: 'step-3', instruction: 'Ative a Oficina Comunitária de Tecnologia e Sustentabilidade na Nave', targetDescription: 'Nave do Conhecimento' }
    ]
  }
];
