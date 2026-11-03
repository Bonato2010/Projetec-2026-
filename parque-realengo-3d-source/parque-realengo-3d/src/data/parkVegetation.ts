import type { V2 } from './types';
import type { TreeSpec } from '../geometry/trees';

/** Vegetação PROVISÓRIA: espécies não identificadas, posições geradas por amostragem com semente fixa. */
export const TREE_ARCHETYPES: (TreeSpec & { id: string; weight: number })[] = [
  { id: 'folhosa-a', kind: 'broadleaf', seed: 101, height: 11, crown: 6.5, detail: 1, tint: [0.2, 0.36, 0.14], weight: 3 },
  { id: 'folhosa-b', kind: 'broadleaf', seed: 202, height: 14, crown: 7.5, detail: 1, tint: [0.24, 0.4, 0.16], weight: 3 },
  { id: 'folhosa-c', kind: 'broadleaf', seed: 303, height: 9, crown: 5.5, detail: 1, tint: [0.17, 0.32, 0.15], weight: 2 },
  { id: 'copa-larga', kind: 'spreading', seed: 404, height: 10, crown: 8.5, detail: 1, tint: [0.26, 0.38, 0.15], weight: 2 },
  { id: 'colunar', kind: 'columnar', seed: 505, height: 13, crown: 4.2, detail: 1, tint: [0.15, 0.3, 0.16], weight: 1 },
];
export const SHRUB_ARCHETYPES: (TreeSpec & { id: string; weight: number })[] = [
  { id: 'arbusto-a', kind: 'shrub', seed: 606, height: 1.8, crown: 1.7, detail: 1, tint: [0.22, 0.38, 0.18], weight: 3 },
  { id: 'arbusto-b', kind: 'lowshrub', seed: 707, height: 1, crown: 1.2, detail: 1, tint: [0.28, 0.4, 0.18], weight: 3 },
  { id: 'arbusto-florido', kind: 'lowshrub', seed: 808, height: 1, crown: 1.1, detail: 1, tint: [0.5, 0.3, 0.34], weight: 1 },
];
export interface GreenZone { id: string; poly: V2[]; treesPer1000: number; shrubsPer1000: number }
export const VEGETATION_CONFIG = {
  seed: 7,
  /** Faixa arborizada junto ao perímetro (offset interno, m). */
  edgeBand: { from: 3, to: 24, treesPer1000: 18, shrubsPer1000: 12 },
  zones: [
    { id: 'bosque-noroeste', poly: [[-190, -80], [-110, -92], [-100, -60], [-185, -40]], treesPer1000: 9, shrubsPer1000: 6 },
    { id: 'bosque-norte', poly: [[-20, -100], [100, -90], [95, -70], [-15, -75]], treesPer1000: 8, shrubsPer1000: 5 },
    { id: 'bosque-sul-oeste', poly: [[-200, 20], [-170, 20], [-165, 38], [-198, 40]], treesPer1000: 8, shrubsPer1000: 5 },
    { id: 'gramado-central-leste', poly: [[95, 30], [122, 30], [122, 70], [95, 62]], treesPer1000: 4, shrubsPer1000: 2 },
    { id: 'gramado-central-oeste', poly: [[-90, 40], [-66, 40], [-66, 62], [-90, 58]], treesPer1000: 4, shrubsPer1000: 2 },
  ] as GreenZone[],
  bedShrubsPer100: 14,
  /** Contagens por qualidade (limite de instâncias). */
  maxTrees: { low: 220, medium: 380, high: 520 },
  maxShrubs: { low: 250, medium: 450, high: 650 },
  minTreeSpacing: 6,
  minShrubSpacing: 1.8,
  pathClear: 1.8,
  walkwayClear: 2.5,
};
