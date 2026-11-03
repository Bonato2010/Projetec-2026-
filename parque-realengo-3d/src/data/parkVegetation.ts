import type { V2 } from './types';
import type { TreeSpec } from '../geometry/trees';

/**
 * VEGETAÇÃO — BIOMA MATA ATLÂNTICA (PARQUE REALENGO JORNALISTA SUSANA NASPOLINI)
 * Espécies nativas do Rio de Janeiro e da Mata Atlântica:
 * - Ipê-Amarelo (Handroanthus chrysotrichus): copa dourada vibrante
 * - Ipê-Roxo (Handroanthus heptaphyllus): floração magenta/violeta
 * - Pau-Brasil (Paubrasilia echinata): copa verde esmeralda luminosa
 * - Jacarandá-Mimoso (Jacaranda mimosifolia): copa lilás suave e folhagem rendada
 * - Oiti (Licania tomentosa): copa densa para conforto térmico e sombreamento
 * - Palmeira Imperial (Roystonea oleracea): fustes altos e elegantes
 *
 * Arbustos tropicais:
 * - Clúsia (Clusia fluminensis): folhagem verde escura brilhante
 * - Helicônia (Heliconia bihai): brácteas florais tropicais avermelhadas
 * - Guaimbê / Costela-de-Adão (Philodendron): folhagem tropical escultural
 */
export const TREE_ARCHETYPES: (TreeSpec & { id: string; weight: number })[] = [
  { id: 'ipe-amarelo', kind: 'spreading', seed: 101, height: 11, crown: 7.5, detail: 1, tint: [0.94, 0.78, 0.14], weight: 3 },
  { id: 'ipe-roxo', kind: 'broadleaf', seed: 202, height: 13, crown: 7.0, detail: 1, tint: [0.68, 0.28, 0.54], weight: 2 },
  { id: 'pau-brasil', kind: 'broadleaf', seed: 303, height: 12, crown: 6.5, detail: 1, tint: [0.18, 0.44, 0.16], weight: 4 },
  { id: 'jacaranda-mimoso', kind: 'spreading', seed: 404, height: 10, crown: 8.0, detail: 1, tint: [0.46, 0.45, 0.72], weight: 2 },
  { id: 'oiti-sombra', kind: 'broadleaf', seed: 505, height: 12, crown: 8.5, detail: 1, tint: [0.16, 0.35, 0.14], weight: 4 },
  { id: 'palmeira-imperial', kind: 'columnar', seed: 506, height: 16, crown: 4.8, detail: 1, tint: [0.22, 0.42, 0.18], weight: 2 },
];

export const SHRUB_ARCHETYPES: (TreeSpec & { id: string; weight: number })[] = [
  { id: 'clusia', kind: 'shrub', seed: 606, height: 2.0, crown: 1.8, detail: 1, tint: [0.18, 0.38, 0.16], weight: 4 },
  { id: 'heliconia-florida', kind: 'lowshrub', seed: 707, height: 1.4, crown: 1.3, detail: 1, tint: [0.85, 0.26, 0.18], weight: 3 },
  { id: 'guaimbe', kind: 'lowshrub', seed: 808, height: 1.2, crown: 1.5, detail: 1, tint: [0.22, 0.44, 0.20], weight: 3 },
];

export interface GreenZone { id: string; poly: V2[]; treesPer1000: number; shrubsPer1000: number }

export const VEGETATION_CONFIG = {
  seed: 42,
  /** Faixa de amortecimento vegetal perimetral (offset interno, m). */
  edgeBand: { from: 2.5, to: 22, treesPer1000: 16, shrubsPer1000: 12 },
  zones: [
    { id: 'bosque-atlantico-oeste', poly: [[-240, -80], [-130, -80], [-130, -30], [-240, -30]], treesPer1000: 15, shrubsPer1000: 10 },
    { id: 'bosque-norte-wenceslau', poly: [[-30, -185], [110, -185], [110, -120], [-30, -120]], treesPer1000: 12, shrubsPer1000: 8 },
    { id: 'jardins-do-lago', poly: [[0, -35], [75, -35], [75, 25], [0, 25]], treesPer1000: 8, shrubsPer1000: 14 },
    { id: 'alameda-social-sul', poly: [[0, 130], [75, 130], [75, 220], [0, 220]], treesPer1000: 10, shrubsPer1000: 8 },
  ] as GreenZone[],
  bedShrubsPer100: 16,
  /** Limites máximos por nível de qualidade visual. */
  maxTrees: { low: 220, medium: 380, high: 550 },
  maxShrubs: { low: 250, medium: 450, high: 680 },
  minTreeSpacing: 6,
  minShrubSpacing: 1.8,
  pathClear: 1.8,
  walkwayClear: 2.5,
};
