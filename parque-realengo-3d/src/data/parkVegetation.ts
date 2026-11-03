import type { V2 } from './types';
import type { TreeSpec } from '../geometry/trees';

/**
 * VEGETAÇÃO — BIOMA MATA ATLÂNTICA REAL (PARQUE REALENGO JORNALISTA SUSANA NASPOLINI)
 * Calibrada com base nas fotos aéreas reais de alta resolução (Projetec 2026).
 * 
 * Espécies nativas com tonalidades botânicas naturais de folhagem verde tropical:
 * - Ipê-Amarelo (Handroanthus chrysotrichus): copa verde com nuances douradas
 * - Ipê-Roxo (Handroanthus heptaphyllus): copa verde floresta profunda
 * - Pau-Brasil (Paubrasilia echinata): copa verde esmeralda luminosa
 * - Jacarandá-Mimoso (Jacaranda mimosifolia): folhagem rendada verde clara
 * - Quaresmeira (Tibouchina granulosa): copa densa verde oliva
 * - Oiti (Licania tomentosa): copa ampla e densa para conforto térmico e sombreamento
 * - Palmeira Imperial (Roystonea oleracea): estipe esbelto e frondes arqueadas
 *
 * Arbustos tropicais:
 * - Clúsia (Clusia fluminensis): verde escuro brilhante
 * - Helicônia (Heliconia bihai): verde tropical com brácteas
 * - Guaimbê (Philodendron bipinnatifidum): folhagem recortada escultural
 */
export const TREE_ARCHETYPES: (TreeSpec & { id: string; weight: number })[] = [
  { id: 'ipe-amarelo', kind: 'spreading', seed: 101, height: 11, crown: 7.5, detail: 1, tint: [0.26, 0.48, 0.18], weight: 4 },
  { id: 'ipe-roxo', kind: 'broadleaf', seed: 202, height: 13, crown: 7.0, detail: 1, tint: [0.18, 0.42, 0.17], weight: 4 },
  { id: 'pau-brasil', kind: 'broadleaf', seed: 303, height: 12, crown: 6.5, detail: 1, tint: [0.20, 0.46, 0.18], weight: 5 },
  { id: 'jacaranda-mimoso', kind: 'spreading', seed: 404, height: 10, crown: 8.0, detail: 1, tint: [0.24, 0.48, 0.22], weight: 3 },
  { id: 'quaresmeira', kind: 'spreading', seed: 501, height: 9.5, crown: 6.8, detail: 1, tint: [0.21, 0.43, 0.19], weight: 3 },
  { id: 'oiti-sombra', kind: 'broadleaf', seed: 505, height: 12, crown: 8.5, detail: 1, tint: [0.15, 0.36, 0.14], weight: 6 },
  { id: 'palmeira-imperial', kind: 'columnar', seed: 506, height: 18, crown: 5.5, detail: 1, tint: [0.22, 0.44, 0.18], weight: 4 },
];

export const SHRUB_ARCHETYPES: (TreeSpec & { id: string; weight: number })[] = [
  { id: 'clusia', kind: 'shrub', seed: 606, height: 2.0, crown: 1.8, detail: 1, tint: [0.16, 0.38, 0.15], weight: 5 },
  { id: 'heliconia-florida', kind: 'lowshrub', seed: 707, height: 1.4, crown: 1.3, detail: 1, tint: [0.22, 0.44, 0.18], weight: 4 },
  { id: 'guaimbe', kind: 'lowshrub', seed: 808, height: 1.2, crown: 1.5, detail: 1, tint: [0.20, 0.42, 0.18], weight: 4 },
];

export interface GreenZone { id: string; poly: V2[]; treesPer1000: number; shrubsPer1000: number }

export const VEGETATION_CONFIG = {
  seed: 42,
  /** Faixa de amortecimento vegetal perimetral (offset interno, m). */
  edgeBand: { from: 2.5, to: 20, treesPer1000: 16, shrubsPer1000: 14 },
  zones: [
    // 1. Grande Bosque Central da Mata Atlântica (maciço arbóreo visível na ortofoto aérea)
    { id: 'bosque-central-florestal', poly: [[-135, -85], [-18, -85], [-18, 45], [-135, 45]], treesPer1000: 22, shrubsPer1000: 16 },

    // 2. Jardins de acolhimento e palmeiras ao redor do Lago e Super-Torres
    { id: 'jardins-do-lago-torres', poly: [[8, -112], [88, -112], [88, -40], [8, -40]], treesPer1000: 8, shrubsPer1000: 18 },

    // 3. Bosque Norte / Acesso Carlos Wenceslau
    { id: 'bosque-norte-wenceslau', poly: [[-30, -185], [110, -185], [110, -130], [-30, -130]], treesPer1000: 14, shrubsPer1000: 12 },

    // 4. Alameda Social Sul (Playground, Quiosques e Mercado)
    { id: 'alameda-social-sul', poly: [[-90, 100], [50, 100], [50, 210], [-90, 210]], treesPer1000: 12, shrubsPer1000: 12 },

    // 5. Bosque Oeste / IFRJ
    { id: 'bosque-oeste-ifrj', poly: [[-245, -170], [-130, -170], [-130, -75], [-245, -75]], treesPer1000: 16, shrubsPer1000: 12 },
  ] as GreenZone[],
  bedShrubsPer100: 22,
  /** Limites máximos por nível de qualidade visual (otimizados para 60 FPS com InstancedMesh). */
  maxTrees: { low: 280, medium: 480, high: 680 },
  maxShrubs: { low: 340, medium: 600, high: 880 },
  minTreeSpacing: 6.2,
  minShrubSpacing: 1.6,
  pathClear: 1.8,
  walkwayClear: 2.2,
};
