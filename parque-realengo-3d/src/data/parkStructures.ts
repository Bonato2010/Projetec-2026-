import type { Footprint, POI, V2, V3 } from './types';
import { rectPoly, circlePoly, halfDiskPoly } from '../geometry/poly';
import type { TowerParams } from '../geometry/tower';

/**
 * ESTRUTURAS DO PARQUE REALENGO JORNALISTA SUSANA NASPOLINI
 * Coordenadas rigorosamente calibradas com a ortofoto aérea oficial (Projetec 2026 / PCRJ).
 * 
 * Eixos: x = leste (+x), z = sul (+z), y = acima (+y). Origem ≈ centroide do parque.
 */
export interface TowerSpec extends Omit<TowerParams, 'gates'> { name: string; x: number; z: number }

/** As 5 Super-Torres de Aço Cobre/Terracota sobre o Espelho d'Água */
export const TOWERS: TowerSpec[] = [
  { id: 'torre-1', name: 'Super-Torre 01 — Oeste (26m)', x: 22, z: -80, height: 26, baseRadius: 4.6, legs: 5, twist: 0.85, waist: 0.58, seed: 11, platforms: [6.8], nozzles: 46 },
  { id: 'torre-2', name: 'Super-Torre 02 — Noroeste (17m)', x: 36, z: -96, height: 17, baseRadius: 3.6, legs: 4, twist: -0.90, waist: 0.62, seed: 23, platforms: [6.2], nozzles: 30 },
  { id: 'torre-3', name: 'Super-Torre Central 03 — Matriz (47m)', x: 48, z: -78, height: 47, baseRadius: 6.2, legs: 6, twist: 0.70, waist: 0.52, seed: 37, platforms: [7.8], nozzles: 84 },
  { id: 'torre-4', name: 'Super-Torre 04 — Leste (26m)', x: 68, z: -80, height: 26, baseRadius: 4.6, legs: 5, twist: -0.80, waist: 0.58, seed: 41, platforms: [6.8], nozzles: 46 },
  { id: 'torre-5', name: 'Super-Torre 05 — Sul (17m)', x: 48, z: -58, height: 17, baseRadius: 3.6, legs: 4, twist: 0.95, waist: 0.62, seed: 53, platforms: [6.2], nozzles: 30 },
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
const common = { width: 3.0, thickness: 0.28, railHeight: 1.15, supportSpacing: 9 };

/** Passarelas elevadas interligando as 5 torres com rampa sul e rampa leste para o splash pad */
export const WALKWAYS: WalkwaySpec[] = [
  { id: 'passarela-1', name: 'Passarela Torre 1 – Torre 3', ...common, waypoints: [T('torre-1'), P(35, -79, 7.3), T('torre-3')] },
  { id: 'passarela-2', name: 'Passarela Torre 2 – Torre 3', ...common, waypoints: [T('torre-2'), P(42, -87, 7.0), T('torre-3')] },
  { id: 'passarela-3', name: 'Passarela Torre 3 – Torre 4', ...common, waypoints: [T('torre-3'), P(58, -79, 7.3), T('torre-4')] },
  { id: 'passarela-4', name: 'Passarela Torre 3 – Torre 5', ...common, waypoints: [T('torre-3'), P(48, -68, 6.5), T('torre-5')] },
  // Rampa reta de descida sul em direção à esplanada
  { id: 'rampa-sul', name: 'Rampa e Escada de Acesso Sul', ...common, width: 2.8, waypoints: [T('torre-5'), P(48, -48, 3.6), P(48, -36, 0.3)], groundLinks: [{ end: 'end', node: 'rs' }] },
  // Rampa curva leste em direção ao Splash Pad
  { id: 'rampa-leste', name: 'Rampa Panorâmica Leste', ...common, width: 2.8, waypoints: [T('torre-4'), P(74, -75, 5.0), P(82, -84, 3.2), P(84, -94, 1.6), P(80, -104, 0.3)], groundLinks: [{ end: 'end', node: 're' }] },
];

/** Bacia de Retenção e Espelho d'Água Lobado (envolve a base de todas as 5 torres) */
export const WATER_POLY: V2[] = [
  // Lóbulo Noroeste (Torre 2)
  [28, -96], [36, -104], [44, -98],
  // Entre Torre 2 e Torre 4
  [52, -90],
  // Lóbulo Leste (Torre 4)
  [64, -88], [76, -82], [76, -74], [68, -70],
  // Entre Torre 4 e Torre 5 (junto ao Splash Pad)
  [62, -64], [56, -52],
  // Lóbulo Sul (Torre 5)
  [54, -46], [48, -44], [40, -48], [42, -58],
  // Entre Torre 5 e Torre 1
  [34, -66],
  // Lóbulo Oeste (Torre 1)
  [22, -70], [14, -76], [14, -86], [22, -90],
  // Fechamento Norte
  [26, -92]
];

/** Splash Pad Circular Interativo (diâmetro 18m) adjacente ao lago */
export const SPLASH_PAD = { cx: 80, cz: -100, r: 9.5 };

export interface RectSpec { cx: number; cz: number; w: number; d: number; rot: number }
const R = (cx: number, cz: number, w: number, d: number, rot = 0): RectSpec => ({ cx, cz, w, d, rot });

/** Complexo Poliesportivo: Duas quadras azuis/laranjas em diagonal + meia-quadra + quadra de areia */
export const COURTS: (RectSpec & { id: string; name: string })[] = [
  { id: 'quadra-1', name: 'Quadra Poliesportiva Azul 1', ...R(80, -32, 28, 16, -0.62) },
  { id: 'quadra-2', name: 'Quadra Poliesportiva Azul 2', ...R(98, -20, 28, 16, -0.62) },
  { id: 'quadra-meia', name: 'Meia-Quadra de Basquete', ...R(89, -3, 16, 14, -0.62) },
  { id: 'quadra-areia', name: 'Quadra de Areia / Vôlei', ...R(45, 10, 26, 16, 0) },
];

/** Skatepark com Bowls e Street ao longo do alinhamento sul */
export const SKATE = { ...R(-15, 55, 42, 28, 0.2), cell: 0.25, fencePad: 1.5 };
export const FIELD = { ...R(20, 25, 44, 28), pitchW: 40, pitchD: 24 };

/** Pavilhões com Pátios Internos Quadrados (Nave do Conhecimento e Pavilhão Cultural) */
export const NAVE = { ...R(98, -155, 28, 28, 0), atrium: 10 };
export const CULTURAL_PAVILION = { ...R(92, -215, 24, 24, 0), atrium: 8 };

export const AMPHI = { cx: 32, cz: -180, r: 16, dirZ: 1 as const };
export const PLAYGROUND = R(38, 115, 26, 18);
export const GYM = R(36, 142, 20, 12);
export const SHELTERS: (RectSpec & { id: string })[] = [
  { id: 'churrasqueira-1', ...R(12, 175, 9, 6) },
  { id: 'churrasqueira-2', ...R(26, 175, 9, 6) },
  { id: 'churrasqueira-3', ...R(40, 175, 9, 6) },
];
export const MULTIUSE = R(58, 115, 12, 10);
export const SUPPORT_BUILDINGS: (RectSpec & { id: string; name: string; height: number })[] = [
  { id: 'mercado', name: 'Praça do Mercado (Messina | Rivas)', ...R(-85, 180, 32, 14, 0.1), height: 4.5 },
  { id: 'banheiros-1', name: 'Sanitários Norte', ...R(72, -180, 10, 6), height: 3.5 },
  { id: 'banheiros-2', name: 'Sanitários Esportes', ...R(68, -8, 10, 6), height: 3.5 },
];

export const PAVED: { id: string; name: string; poly: V2[]; material: 'concrete' | 'stone' }[] = [
  {
    id: 'praca-torres',
    name: 'Esplanada das Super-Torres e Espelho d\'Água',
    material: 'stone',
    poly: [[8, -112], [88, -112], [88, -40], [8, -40]]
  },
  {
    id: 'esplanada-esportes',
    name: 'Esplanada do Complexo Esportivo',
    material: 'concrete',
    poly: [[65, -45], [115, -45], [115, 8], [65, 8]]
  },
  {
    id: 'esplanada-mercado',
    name: 'Praça de Acolhimento Sul',
    material: 'stone',
    poly: [[-105, 160], [-65, 160], [-65, 205], [-105, 205]]
  }
];

export const GARDEN_BEDS: { id: string; poly: V2[] }[] = [
  { id: 'canteiro-torres-1', poly: [[10, -110], [24, -110], [24, -102], [10, -102]] },
  { id: 'canteiro-torres-2', poly: [[70, -110], [86, -110], [86, -102], [70, -102]] },
  { id: 'canteiro-splash-1', poly: [[88, -112], [96, -112], [96, -88], [88, -88]] },
  { id: 'canteiro-esportes-1', poly: [[68, -36], [74, -36], [74, -18], [68, -18]] },
];

// ---------- pegadas (footprints) ----------
const rf = (id: string, name: string, r: RectSpec, kind: Footprint['kind'], pad = 0, blocksPath = true): Footprint => ({
  id, name, poly: rectPoly(r.cx, r.cz, r.w, r.d, r.rot, pad), kind, blocksPath, blocksTrees: true,
});

export const FOOTPRINTS: Footprint[] = [
  ...TOWERS.map((t) => ({
    id: t.id, name: t.name, poly: circlePoly(t.x, t.z, t.baseRadius * 1.05, 16), kind: 'tower' as const, blocksPath: true, blocksTrees: true,
  })),
  { id: 'water-basin', name: 'Bacia de Amortecimento / Espelho d\'Água', poly: WATER_POLY, kind: 'water', blocksPath: true, blocksTrees: true },
  { id: 'splash-pad', name: 'Splash Pad Infantil', poly: circlePoly(SPLASH_PAD.cx, SPLASH_PAD.cz, SPLASH_PAD.r * 1.15, 24), kind: 'play', blocksPath: true, blocksTrees: true },
  rf('skatepark', 'Pista de Skate', SKATE, 'sport'),
  rf('campo-society', 'Campo Society Sintético', FIELD, 'sport', 0.5),
  ...COURTS.map((c) => rf(c.id, c.name, c, 'sport')),
  rf('nave-conhecimento', 'Nave do Conhecimento', NAVE, 'building', 1),
  rf('cultural-pavilion', 'Pavilhão Cultural e Comunitário', CULTURAL_PAVILION, 'building', 1),
  rf('amphitheater', 'Anfiteatro', { cx: AMPHI.cx, cz: AMPHI.cz, w: AMPHI.r * 2, d: AMPHI.r * 1.5, rot: 0 }, 'building'),
  rf('playground', 'Playground', PLAYGROUND, 'play'),
  rf('gym', 'Academia ao Ar Livre', GYM, 'play'),
  rf('multiuse', 'Espaço Multiuso', MULTIUSE, 'building'),
  ...SHELTERS.map((s) => rf(s.id, 'Quiosque', s, 'building')),
  ...SUPPORT_BUILDINGS.map((b) => rf(b.id, b.name, b, 'building')),
];

export const PAVED_FOOTPRINTS: Footprint[] = PAVED.map((p) => ({
  id: p.id, name: p.name, poly: p.poly, kind: 'building', blocksPath: false, blocksTrees: true,
}));

export const POIS: POI[] = [
  {
    id: 'poi-torres', name: 'As 5 Super-Torres Bioclimáticas', kind: 'tower', center: [48, 22, -78], radius: 46, accessNode: 'n_torres_central', refId: 'torres-bioclimaticas',
    summary: 'Cinco superestruturas metálicas em cobre/terracota inspiradas nas árvores solares de Singapura, integradas a 236 bicos aspersores que reduzem a temperatura local em até 4°C.',
  },
  {
    id: 'poi-agua', name: 'Espelho d\'Água e Bacia de Retenção Pluvial', kind: 'water', center: [48, 0, -78], radius: 44, accessNode: 'n_lago_deck_sul', refId: 'espelho-dagua',
    summary: 'Bacia hidráulica de 1.300 m² e 1.950 m³ de retenção pluvial em formato lobado sobre o qual erguem-se as cinco super-torres, combatendo enchentes em Realengo.',
  },
  {
    id: 'poi-splash-pad', name: 'Splash Pad Infantil', kind: 'playground', center: [SPLASH_PAD.cx, 0, SPLASH_PAD.cz], radius: 18, accessNode: 'n_splash', refId: 'splash-pad',
    summary: 'Parque aquático infantil com jatos d\'água interativos e piso emborrachado anti-impacto para alívio térmico das crianças.',
  },
  {
    id: 'poi-courts', name: 'Complexo Poliesportivo Azul', kind: 'courts', center: [88, 1, -26], radius: 36, accessNode: 'n_quadras_oeste', refId: 'complexo-esportivo',
    summary: 'Duas quadras de basquete/futsal com pintura técnica em azul royal, celeste e laranja, com iluminação em LED e meia-quadra integrada.',
  },
  {
    id: 'poi-skate', name: 'Skatepark com Bowls e Street', kind: 'skate', center: [SKATE.cx, 0, SKATE.cz], radius: 32, accessNode: 'n_skate_leste', refId: 'pista-skate',
    summary: 'Pista pública de skate com dois bowls integrados e área de street em concreto usinado polido de alto desempenho.',
  },
  {
    id: 'poi-nave', name: 'Nave do Conhecimento Realengo', kind: 'nave', center: [NAVE.cx, 5, NAVE.cz], radius: 34, accessNode: 'n_nave_norte', refId: 'nave-conhecimento',
    summary: 'Pavilhão tecnológico comunitário de 830 m² com pátio interno, laboratórios maker e usina solar fotovoltaica.',
  },
  {
    id: 'poi-anfiteatro', name: 'Anfiteatro Susana Naspolini', kind: 'building', center: [AMPHI.cx, 3, AMPHI.cz], radius: 28, accessNode: 'n_anfi', refId: 'anfiteatro',
    summary: 'Concha acústica e arquibancadas em semicírculo com capacidade para cinema ao ar livre, saraus e eventos comunitários.',
  },
  {
    id: 'poi-mercado', name: 'Praça do Mercado (11 Lojas)', kind: 'building', center: [-85, 3, 180], radius: 32, accessNode: 'n_mercado', refId: 'praca-mercado',
    summary: 'Edificação linear projetada pelo escritório Messina | Rivas abrigando 11 lojas comunitárias para economia circular e comércio local.',
  },
];
