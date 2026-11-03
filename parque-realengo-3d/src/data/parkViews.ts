import type { V3 } from './types';
import { ENTRANCES } from './parkLayout';

/** Vistas de câmera calibradas para o Parque Realengo Susana Naspolini. */
export interface ViewSpec {
  id: string; label: string; category: 'mapeamento' | 'vista-geral' | 'arquitetura' | 'esportes' | 'paisagismo';
  pos: V3; target: V3; layers?: Partial<{ vegetation: boolean; surroundings: boolean; expansion: boolean }>;
  caption: string;
}

const e1 = ENTRANCES[0];
const ePos: V3 = [e1.pos[0] + e1.facing[0] * 24, 9, e1.pos[1] + e1.facing[1] * 24];

export const VIEWS: ViewSpec[] = [
  { id: 'planta-geral', label: 'Planta geral (cenário)', category: 'mapeamento', pos: [0, 480, 20], target: [0, 0, 0], layers: { vegetation: false, surroundings: false }, caption: 'Implantação completa vista de cima, sem vegetação.' },
  { id: 'aerea-completa', label: 'Vista aérea do parque', category: 'vista-geral', pos: [30, 420, 220], target: [20, 0, 10], caption: 'Vista aérea do Parque Realengo Susana Naspolini.' },
  { id: 'obliqua-geral', label: 'Perspectiva oblíqua', category: 'vista-geral', pos: [-180, 180, 220], target: [20, 0, -20], caption: 'Perspectiva panorâmica com as super-torres e os equipamentos.' },
  { id: 'entrada', label: 'Acesso Norte (Carlos Wenceslau)', category: 'vista-geral', pos: ePos, target: [45, 2, -145], caption: 'Portal de entrada norte e alameda de acolhimento.' },
  { id: 'torres', label: 'As 5 Super-Torres (17m a 47m)', category: 'arquitetura', pos: [48, 28, 5], target: [48, 22, -72], caption: 'As 5 super-estruturas com o sistema de microclima e 236 pulverizadores.' },
  { id: 'passarelas', label: 'Passarelas elevadas', category: 'arquitetura', pos: [12, 18, -45], target: [48, 10, -78], caption: 'Circulação elevada entre as plataformas das torres e mirantes.' },
  { id: 'agua', label: 'Lago e espelho d\'água', category: 'arquitetura', pos: [40, 24, 60], target: [40, 0, -8], caption: 'Espelho d\'água de 1.300 m² integrado à bacia de amortecimento pluvial.' },
  { id: 'nave', label: 'Nave do Conhecimento', category: 'arquitetura', pos: [-8, 20, 45], target: [-8, 4, -8], caption: 'Pavilhão tecnológico comunitário de 830 m².' },
  { id: 'anfiteatro', label: 'Anfiteatro Susana Naspolini', category: 'arquitetura', pos: [35, 14, -110], target: [35, 1, -145], caption: 'Concha acústica e arquibancadas para cinema ao ar livre e shows.' },
  { id: 'mercado', label: 'Praça do Mercado (11 Lojas)', category: 'arquitetura', pos: [20, 18, 275], target: [20, 2, 235], caption: 'Edificação linear projetada pelo escritório Messina | Rivas.' },
  { id: 'skate', label: 'Pista de skate (Street & Bowls)', category: 'esportes', pos: [58, 24, 150], target: [58, 0, 105], caption: 'Skatepark com dois bowls interligados e área de street.' },
  { id: 'esportes', label: 'Campo sintético e quadras', category: 'esportes', pos: [66, 38, 110], target: [75, 0, 20], caption: 'Campo de futebol society com grama sintética e quadras poliesportivas.' },
  { id: 'paisagismo', label: 'Bosque da Mata Atlântica', category: 'paisagismo', pos: [-120, 22, 15], target: [-170, 0, -55], caption: 'Ipês, Pau-Brasil, Oitis, Palmeiras Imperiais e quadras de areia.' },
  { id: 'expansao', label: 'Zona de expansão (Fase 2)', category: 'vista-geral', pos: [120, 350, 220], target: [80, 0, 0], layers: { expansion: true }, caption: 'Projeção futura de ampliação do parque até 150 mil m².' },
  { id: 'detalhe-splash-pad', label: 'Splash Pad (Jatos d\'Água)', category: 'arquitetura', pos: [33, 4.5, 155], target: [33, 0.5, 149], caption: 'Jatos interativos do Splash Pad no playground infantil.' },
  { id: 'detalhe-volei-areia', label: 'Quadras de Vôlei de Areia', category: 'esportes', pos: [-190, 8, -42], target: [-192, 1, -60], caption: 'Quadras de vôlei de praia com areia e redes.' },
  { id: 'detalhe-basquete', label: 'Quadras Poliesportivas', category: 'esportes', pos: [88, 7, -8], target: [88, 3, -18], caption: 'Tabelas de basquete e garrafão das quadras poliesportivas.' },
  { id: 'detalhe-quiosques', label: 'Quiosques e Churrasqueiras', category: 'arquitetura', pos: [32, 5, 210], target: [32, 2, 198], caption: 'Área de convivência com churrasqueiras e mesas de piquenique.' },
  { id: 'detalhe-torre-aspersores', label: 'Aspersores da Super-Torre', category: 'arquitetura', pos: [48, 12, -70], target: [48, 8, -78], caption: 'Bicos de névoa e anéis de nebulização da Super-Torre 03.' },
];
