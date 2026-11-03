import type { V3 } from './types';
import { ENTRANCES } from './parkLayout';

/** Vistas de câmera nomeadas. Servem à interface, ao enquadramento e ao script de capturas. */
export interface ViewSpec {
  id: string; label: string; category: 'mapeamento' | 'vista-geral' | 'arquitetura' | 'esportes' | 'paisagismo';
  pos: V3; target: V3; layers?: Partial<{ vegetation: boolean; surroundings: boolean; expansion: boolean }>;
  caption: string;
}
const e1 = ENTRANCES[0];
const ePos: V3 = [e1.pos[0] + e1.facing[0] * 26, 7, e1.pos[1] + e1.facing[1] * 26];
export const VIEWS: ViewSpec[] = [
  { id: 'planta-geral', label: 'Planta geral (sem vegetação)', category: 'mapeamento', pos: [0, 520, 30], target: [0, 0, 0], layers: { vegetation: false, surroundings: false }, caption: 'Implantação provisória vista de cima, sem vegetação.' },
  { id: 'aerea-completa', label: 'Vista aérea', category: 'vista-geral', pos: [0, 430, 210], target: [0, 0, 5], caption: 'Vista aérea do parque inteiro.' },
  { id: 'obliqua-geral', label: 'Perspectiva oblíqua', category: 'vista-geral', pos: [-300, 170, 280], target: [0, 0, 0], caption: 'Perspectiva oblíqua geral.' },
  { id: 'entrada', label: 'Entrada principal (provisória)', category: 'vista-geral', pos: ePos, target: [-150, 6, 60], caption: 'Acesso sudoeste e a Nave do Conhecimento.' },
  { id: 'entorno', label: 'Entorno urbano', category: 'vista-geral', pos: [0, 110, -290], target: [0, 0, -95], caption: 'Contexto urbano genérico de baixo gabarito (provisório).' },
  { id: 'torres', label: 'As cinco torres', category: 'arquitetura', pos: [0, 30, 100], target: [0, 17, -10], caption: 'As cinco torres com a nebulização.' },
  { id: 'passarelas', label: 'Passarelas', category: 'arquitetura', pos: [-70, 22, 12], target: [-20, 12, -22], caption: 'Passarelas elevadas entre as torres.' },
  { id: 'agua', label: 'Área aquática', category: 'arquitetura', pos: [0, 28, 105], target: [0, 0, 28], caption: 'Espelho d’água e jatos.' },
  { id: 'nave', label: 'Nave do Conhecimento', category: 'arquitetura', pos: [-215, 22, 105], target: [-150, 5, 55], caption: 'Volumetria externa provisória.' },
  { id: 'skate', label: 'Pista de skate', category: 'esportes', pos: [-120, 34, 10], target: [-120, 0, -35], caption: 'Bowls, quarter-pipe, banco, funbox e ledge.' },
  { id: 'esportes', label: 'Campo e quadras', category: 'esportes', pos: [48, 62, 56], target: [125, 0, -5], caption: 'Campo de futebol e quadras.' },
  { id: 'paisagismo', label: 'Paisagismo', category: 'paisagismo', pos: [-30, 14, 62], target: [-90, 3, 72], caption: 'Árvores, arbustos, canteiros e gramados.' },
  { id: 'expansao', label: 'Expansão planejada', category: 'vista-geral', pos: [120, 380, 260], target: [100, 0, 0], layers: { expansion: true }, caption: 'Zona indicativa da expansão (sem planta).' },
];
