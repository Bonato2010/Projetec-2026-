import type { V3 } from './types';
import { ENTRANCES } from './parkLayout';

/** Vistas de câmera rigorosamente calibradas para o Parque Realengo Susana Naspolini. */
export interface ViewSpec {
  id: string; label: string; category: 'mapeamento' | 'vista-geral' | 'arquitetura' | 'esportes' | 'paisagismo';
  pos: V3; target: V3; layers?: Partial<{ vegetation: boolean; surroundings: boolean; expansion: boolean }>;
  caption: string;
}

const e1 = ENTRANCES[0];
const ePos: V3 = [e1.pos[0] + e1.facing[0] * 24, 9, e1.pos[1] + e1.facing[1] * 24];

export const VIEWS: ViewSpec[] = [
  { id: 'planta-geral', label: 'Planta geral (cenário)', category: 'mapeamento', pos: [15, 480, -10], target: [15, 0, -10], layers: { vegetation: false, surroundings: false }, caption: 'Implantação completa vista de cima, sem vegetação.' },
  { id: 'aerea-completa', label: 'Vista aérea do parque', category: 'vista-geral', pos: [35, 380, 180], target: [20, 0, -30], caption: 'Vista aérea do Parque Realengo Susana Naspolini.' },
  { id: 'obliqua-geral', label: 'Perspectiva oblíqua', category: 'vista-geral', pos: [-140, 140, 160], target: [30, 0, -50], caption: 'Perspectiva panorâmica com as super-torres e os equipamentos.' },
  { id: 'entrada', label: 'Acesso Norte (Carlos Wenceslau)', category: 'vista-geral', pos: ePos, target: [45, 2, -145], caption: 'Portal de entrada norte e alameda de acolhimento.' },
  { id: 'torres', label: 'As 5 Super-Torres (17m a 47m)', category: 'arquitetura', pos: [48, 22, -15], target: [48, 20, -78], caption: 'As 5 super-estruturas com o sistema de microclima e 236 pulverizadores.' },
  { id: 'passarelas', label: 'Passarelas elevadas', category: 'arquitetura', pos: [24, 15, -45], target: [48, 11, -78], caption: 'Circulação elevada entre as plataformas das torres e mirantes.' },
  { id: 'agua', label: 'Lago e espelho d\'água', category: 'arquitetura', pos: [48, 30, -25], target: [48, 0, -78], caption: 'Espelho d\'água lobado ciano integrado às 5 super-torres e bacia de retenção pluvial.' },
  { id: 'nave', label: 'Nave do Conhecimento', category: 'arquitetura', pos: [72, 16, -135], target: [98, 4, -155], caption: 'Pavilhão tecnológico comunitário contemporâneo com pátio interno aberto e usina solar.' },
  { id: 'anfiteatro', label: 'Anfiteatro Susana Naspolini', category: 'arquitetura', pos: [35, 14, -110], target: [35, 1, -145], caption: 'Concha acústica e arquibancadas para cinema ao ar livre e shows.' },
  { id: 'mercado', label: 'Praça do Mercado (11 Lojas)', category: 'arquitetura', pos: [20, 18, 275], target: [20, 2, 235], caption: 'Edificação linear projetada pelo escritório Messina | Rivas.' },
  { id: 'skate', label: 'Pista de skate (Street & Bowls)', category: 'esportes', pos: [-15, 20, 95], target: [-15, 0, 55], caption: 'Skatepark com dois bowls interligados e área de street.' },
  { id: 'esportes', label: 'Campo sintético e quadras', category: 'esportes', pos: [65, 28, 18], target: [89, 0, -26], caption: 'Quadras poliesportivas em azul royal e azul celeste com garrafões laranja.' },
  { id: 'paisagismo', label: 'Bosque da Mata Atlântica', category: 'paisagismo', pos: [-60, 24, 40], target: [-95, 0, -30], caption: 'Maciço arbóreo preservado com espécies da Mata Atlântica e caminhos sombreados.' },
  { id: 'expansao', label: 'Zona de expansão (Fase 2)', category: 'vista-geral', pos: [120, 350, 220], target: [80, 0, 0], layers: { expansion: true }, caption: 'Projeção futura de ampliação do parque até 150 mil m².' },
  { id: 'detalhe-splash-pad', label: 'Splash Pad (Jatos d\'Água)', category: 'arquitetura', pos: [80, 14, -72], target: [80, 0, -100], caption: 'Jatos interativos do Splash Pad com piso emborrachado azul e amarelo.' },
  { id: 'detalhe-volei-areia', label: 'Quadras de Vôlei de Areia', category: 'esportes', pos: [45, 14, 45], target: [45, 1, 10], caption: 'Quadras de areia com postes, redes e iluminação esportiva.' },
  { id: 'detalhe-basquete', label: 'Quadras Poliesportivas', category: 'esportes', pos: [108, 12, -5], target: [89, 2, -26], caption: 'Tabelas de basquete com vidro temperado, aro flexível e demarcações oficiais.' },
  { id: 'detalhe-quiosques', label: 'Quiosques e Churrasqueiras', category: 'arquitetura', pos: [32, 5, 210], target: [32, 2, 198], caption: 'Área de convivência com churrasqueiras e mesas de piquenique.' },
  { id: 'detalhe-torre-aspersores', label: 'Aspersores da Super-Torre', category: 'arquitetura', pos: [48, 16, -58], target: [48, 16, -78], caption: 'Bicos de névoa e anéis de nebulização da Super-Torre Matriz 03.' },
];
