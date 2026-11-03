import type { Footprint, POI, V2, V3 } from './types';
import { rectPoly, circlePoly, halfDiskPoly } from '../geometry/poly';
import type { TowerParams } from '../geometry/tower';

/**
 * ESTRUTURAS DO PARQUE REALENGO JORNALISTA SUSANA NASPOLINI
 * Coordenadas calibradas com o levantamento cadastral real do OpenStreetMap (Way 681694032, 78.129 m²),
 * com os projetos arquitetônicos oficiais (Messina | Rivas, Ecomimesis, Prefeitura do Rio).
 *
 * Eixos: x = leste (+x), z = sul (+z), y = acima (+y).
 */
export interface TowerSpec extends Omit<TowerParams, 'gates'> { name: string; x: number; z: number }

export const TOWERS: TowerSpec[] = [
  { id: 'torre-1', name: 'Super-Torre 01 (17m)', x: 10, z: -85, height: 17, baseRadius: 3.6, legs: 4, twist: 0.9, waist: 0.62, seed: 11, platforms: [6], nozzles: 30 },
  { id: 'torre-2', name: 'Super-Torre 02 (26m)', x: 30, z: -55, height: 26, baseRadius: 4.6, legs: 5, twist: -0.8, waist: 0.58, seed: 23, platforms: [7], nozzles: 46 },
  { id: 'torre-3', name: 'Super-Torre Central 03 (47m)', x: 48, z: -78, height: 47, baseRadius: 6.2, legs: 6, twist: 0.7, waist: 0.55, seed: 37, platforms: [7.8], nozzles: 84 },
  { id: 'torre-4', name: 'Super-Torre 04 (26m)', x: 68, z: -55, height: 26, baseRadius: 4.6, legs: 5, twist: 0.85, waist: 0.6, seed: 41, platforms: [7], nozzles: 46 },
  { id: 'torre-5', name: 'Super-Torre 05 (17m)', x: 78, z: -88, height: 17, baseRadius: 3.6, legs: 4, twist: -0.95, waist: 0.64, seed: 53, platforms: [6], nozzles: 30 },
];
export const TOTAL_NOZZLES_ANNOUNCED = 236;

export type WaypointSpec = { kind: 'tower'; tower: string; platform: number } | { kind: 'point'; x: number; z: number; y: number };
export interface WalkwaySpec {
  id: string; name: string; width: number; thickness: number; railHeight: number; supportSpacing: number;
  waypoints: WaypointSpec[];
  groundLinks?: { end: 'start' | 'end'; node: string }[];
}

const T = (tower: string, platform = 0): WaypointSpec => ({ kind: 'tower', tower, platform });
const P = (x: number, z: number, y: number): WaypointSpec => ({ kind: 'point', x, z, y });
const common = { width: 3.2, thickness: 0.3, railHeight: 1.1, supportSpacing: 10 };

export const WALKWAYS: WalkwaySpec[] = [
  { id: 'passarela-1', name: 'Passarela Torre 1 – Torre 2', ...common, waypoints: [T('torre-1'), P(20, -70, 6.5), T('torre-2')] },
  { id: 'passarela-2', name: 'Passarela Torre 2 – Torre 3', ...common, waypoints: [T('torre-2'), P(38, -65, 7.4), T('torre-3')] },
  { id: 'passarela-3', name: 'Passarela Torre 3 – Torre 4', ...common, waypoints: [T('torre-3'), P(58, -65, 7.4), T('torre-4')] },
  { id: 'passarela-4', name: 'Passarela Torre 4 – Torre 5', ...common, waypoints: [T('torre-4'), P(73, -71, 6.5), T('torre-5')] },
  { id: 'rampa-1', name: 'Rampa de acesso oeste', ...common, waypoints: [T('torre-1'), P(-10, -87.5, 4.8), P(-30, -90.5, 3.3), P(-52, -93, 1.8), P(-75, -95, 0.3)], groundLinks: [{ end: 'end', node: 'rw' }] },
  { id: 'rampa-2', name: 'Rampa de acesso leste', ...common, waypoints: [T('torre-5'), P(93, -80, 5.0), P(106, -68, 3.6), P(120, -53, 2.0), P(135, -32, 0.3)], groundLinks: [{ end: 'end', node: 'rv' }] },
];

export const WATER_POLY: V2[] = [
  [15, -30], [42, -32], [65, -20], [68, 5],
  [50, 18], [25, 16], [10, -5]
];

export interface RectSpec { cx: number; cz: number; w: number; d: number; rot: number }
const R = (cx: number, cz: number, w: number, d: number, rot = 0): RectSpec => ({ cx, cz, w, d, rot });

export const SKATE = { ...R(58, 105, 38, 24), cell: 0.25, fencePad: 1.5 };
export const FIELD = { ...R(66, 55, 46, 30), pitchW: 42, pitchD: 26 };
export const COURTS: (RectSpec & { id: string; name: string })[] = [
  { id: 'quadra-1', name: 'Quadra Poliesportiva 1', ...R(88, -18, 26, 15) },
  { id: 'quadra-2', name: 'Quadra Poliesportiva 2', ...R(88, 6, 26, 15) },
  { id: 'quadra-areia-1', name: 'Quadra de Vôlei de Areia 1', ...R(-205, -60, 22, 14) },
  { id: 'quadra-areia-2', name: 'Quadra de Vôlei de Areia 2', ...R(-178, -60, 22, 14) },
];
export const NAVE = R(-8, -8, 26, 22);
export const AMPHI = { cx: 35, cz: -145, r: 15, dirZ: 1 as const };
export const PLAYGROUND = R(38, 145, 26, 18);
export const GYM = R(36, 172, 20, 12);
export const SHELTERS: (RectSpec & { id: string })[] = [
  { id: 'churrasqueira-1', ...R(18, 198, 9, 6) },
  { id: 'churrasqueira-2', ...R(32, 198, 9, 6) },
  { id: 'churrasqueira-3', ...R(46, 198, 9, 6) },
];
export const MULTIUSE = R(66, 145, 12, 10);
export const SUPPORT_BUILDINGS: (RectSpec & { id: string; name: string; height: number })[] = [
  { id: 'mercado', name: 'Praça do Mercado (11 Lojas)', ...R(20, 235, 28, 14), height: 4.5 },
  { id: 'administracao', name: 'Administração', ...R(62, -165, 14, 9), height: 4 },
  { id: 'banheiros-1', name: 'Sanitários Norte', ...R(82, -140, 10, 6), height: 3.5 },
  { id: 'banheiros-2', name: 'Sanitários Esportes', ...R(58, 172, 10, 6), height: 3.5 },
  { id: 'ecoponto', name: 'Ecoponto', ...R(20, 252, 10, 5), height: 3 },
];

export const PAVED: { id: string; name: string; poly: V2[]; material: 'concrete' | 'stone' }[] = [
  {
    id: 'praca-torres',
    name: 'Praça das Super-Torres e Espelho d\'Água',
    material: 'concrete',
    poly: [[-2, -100], [90, -100], [90, -36], [-2, -36]]
  },
  {
    id: 'patio-nave',
    name: 'Esplanada da Nave do Conhecimento',
    material: 'stone',
    poly: [[-24, -22], [10, -22], [10, 6], [-24, 6]]
  },
  {
    id: 'esplanada-mercado',
    name: 'Esplanada da Praça do Mercado',
    material: 'stone',
    poly: [[0, 220], [42, 220], [42, 260], [0, 260]]
  }
];

export const GARDEN_BEDS: { id: string; poly: V2[] }[] = [
  { id: 'canteiro-1', poly: [[15, -112], [32, -112], [32, -106], [15, -106]] },
  { id: 'canteiro-2', poly: [[65, -112], [82, -112], [82, -106], [65, -106]] },
  { id: 'canteiro-3', poly: [[12, 130], [28, 130], [28, 136], [12, 136]] },
  { id: 'canteiro-4', poly: [[12, 160], [28, 160], [28, 166], [12, 166]] },
];

// ---------- pegadas (footprints) ----------
const rf = (id: string, name: string, r: RectSpec, kind: Footprint['kind'], pad = 0, blocksPath = true): Footprint => ({
  id, name, poly: rectPoly(r.cx, r.cz, r.w, r.d, r.rot, pad), kind, blocksPath, blocksTrees: true,
});

export const FOOTPRINTS: Footprint[] = [
  ...TOWERS.map((t): Footprint => ({ id: t.id, name: t.name, poly: circlePoly(t.x, t.z, t.baseRadius + 1.2, 16), kind: 'tower', blocksPath: true, blocksTrees: true })),
  { id: 'area-aquatica', name: 'Área aquática', poly: WATER_POLY, kind: 'water', blocksPath: true, blocksTrees: true },
  rf('pista-skate', 'Pista de skate', SKATE, 'sport', SKATE.fencePad),
  rf('campo-futebol', 'Campo de futebol', FIELD, 'sport'),
  ...COURTS.map((c) => rf(c.id, c.name, c, 'sport', 1)),
  rf('nave-conhecimento', 'Nave do Conhecimento', NAVE, 'building', 1),
  rf('playground', 'Playground', PLAYGROUND, 'play', 1),
  rf('academia-ar-livre', 'Academia ao ar livre', GYM, 'play', 1),
  ...SHELTERS.map((s) => rf(s.id, 'Churrasqueira coberta', s, 'social', 1)),
  { id: 'anfiteatro', name: 'Anfiteatro', poly: halfDiskPoly(AMPHI.cx, AMPHI.cz, AMPHI.r, AMPHI.dirZ), kind: 'social', blocksPath: true, blocksTrees: true },
  rf('espaco-multiuso', 'Espaço multiuso', MULTIUSE, 'building', 1),
  ...SUPPORT_BUILDINGS.map((b) => rf(b.id, b.name, b, 'building', 1)),
];

export const PAVED_FOOTPRINTS: Footprint[] = PAVED.map((p) => ({ id: p.id, name: p.name, poly: p.poly, kind: 'paved', blocksPath: false, blocksTrees: true }));

// ---------- pontos de interesse (POIs) ----------
export const POIS: POI[] = [
  {
    id: 'poi-torres', name: 'As 5 Super-Torres de Nebulização', kind: 'tower', center: [48, 16, -72], radius: 65, accessNode: 'n_torres_sul', refId: 'torre-3',
    summary: 'Cinco super-estruturas metálicas ramificadas de 17m, 26m e 47m de altura inspiradas nos Supertrees de Singapura, equipadas com 236 bicos aspersores que criam uma microclimatização suave que reduz a sensação térmica em até 5 °C.'
  },
  {
    id: 'poi-passarelas', name: 'Passarelas e Mirantes Elevados', kind: 'walkway', center: [48, 9, -70], radius: 60, accessNode: 'rw', refId: 'passarelas',
    summary: 'Passarelas suspensas que interligam as plataformas das torres até a cota de 10 metros, com rampas de acesso universal a oeste e a leste (inclinações acessíveis ≤ 7,8%), oferecendo mirantes panorâmicos do parque e da Serra do Barata.'
  },
  {
    id: 'poi-agua', name: 'Lago de Retenção e Espelho d\'Água', kind: 'water', center: [40, 0, -8], radius: 45, accessNode: 'n_lago_norte', refId: 'area-aquatica',
    summary: 'Espelho d\'água permanente de cerca de 1.300 m² integrado ao sistema de macrodrenagem e jardins de chuva da Bacia do Rio Piraquara, promovendo resfriamento evaporativo e retenção de águas pluviais.'
  },
  {
    id: 'poi-skate', name: 'Pista de Skate (Street & Bowls)', kind: 'skate', center: [58, 0, 105], radius: 32, accessNode: 'n_skate_noroeste', refId: 'pista-skate',
    summary: 'Skatepark completo com dois bowls interconectados de transição suave, quarter-pipe, spine, ledge, corrimões e área de street, projetado com concreto polido e coping metálico.'
  },
  {
    id: 'poi-campo', name: 'Campo de Futebol Sintético', kind: 'field', center: [66, 0, 55], radius: 38, accessNode: 'n_campo_noroeste', refId: 'campo-futebol',
    summary: 'Campo de futebol de grama sintética padrão society com drenagem por gravidade, iluminação por refletores LED de alta eficiência e alambrado de proteção galvanizado.'
  },
  {
    id: 'poi-quadras', name: 'Complexo Poliesportivo e Vôlei de Areia', kind: 'courts', center: [88, 0, -6], radius: 42, accessNode: 'n_quadras_hub', refId: 'quadra-1',
    summary: 'Duas quadras poliesportivas demarcadas para futsal, basquete e handebol, além de duas quadras de vôlei de areia e futevôlei inseridas no setor oeste junto ao bosque.'
  },
  {
    id: 'poi-nave', name: 'Nave do Conhecimento Realengo', kind: 'nave', center: [-8, 5, -8], radius: 36, accessNode: 'n_nave_norte', refId: 'nave-conhecimento',
    summary: 'Pavilhão tecnológico e educacional com cerca de 830 m², salas multimídia, laboratório de robótica, capacitação digital e espaço maker voltado à comunidade da Zona Oeste.'
  },
  {
    id: 'poi-anfiteatro', name: 'Anfiteatro Susana Naspolini', kind: 'social', center: [35, 1, -145], radius: 25, accessNode: 'n_amphi_front', refId: 'anfiteatro',
    summary: 'Concha acústica e arquibancadas em semicírculo com capacidade para apresentações culturais, cinema ao ar livre, saraus e eventos comunitários.'
  },
  {
    id: 'poi-playground', name: 'Playground Infantil e Splash Pad', kind: 'playground', center: [38, 1, 145], radius: 30, accessNode: 'n_play_hub', refId: 'playground',
    summary: 'Área infantil com piso emborrachado anti-impacto, balanços, escorregadores, domo geodésico e parque aquático infantil (Splash Pad) com jatos d\'água verticais interativos.'
  },
  {
    id: 'poi-convivencia', name: 'Quiosques de Convivência e Piquenique', kind: 'social', center: [32, 2, 198], radius: 35, accessNode: 'n_bbq_hub', refId: 'churrasqueiras',
    summary: 'Conjunto de quiosques cobertos equipados com churrasqueiras ecológicas, pias, mesas e bancos de madeira de reflorestamento, integrados à arborização local.'
  },
  {
    id: 'poi-mercado', name: 'Praça do Mercado (11 Lojas)', kind: 'building', center: [20, 2, 235], radius: 35, accessNode: 'k1', refId: 'mercado',
    summary: 'Edificação linear projetada pelos arquitetos Messina | Rivas, Ayako e Helena Meirelles, abrigando 11 lojas comerciais, café, artesanato e serviços voltados à economia circular local.'
  },
];

export const FOOTPRINT_OF = (id: string): Footprint | undefined => FOOTPRINTS.find((f) => f.id === id);
export type { V3 };
