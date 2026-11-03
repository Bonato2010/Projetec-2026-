import type { Footprint, POI, V2, V3 } from './types';
import { rectPoly, circlePoly, halfDiskPoly } from '../geometry/poly';
import type { TowerParams } from '../geometry/tower';

/**
 * ESTRUTURAS — todas as posições/dimensões são PROVISÓRIAS (ver parkReferences.ts).
 * As alturas das torres (17, 17, 26, 26, 47 m) e os 236 pulverizadores vêm do briefing/texto institucional;
 * a correspondência torre ↔ altura NÃO foi verificada.
 */
export interface TowerSpec extends Omit<TowerParams, 'gates'> { name: string; x: number; z: number }
export const TOWERS: TowerSpec[] = [
  { id: 'torre-1', name: 'Torre 1', x: -75, z: 20, height: 17, baseRadius: 3.6, legs: 4, twist: 0.9, waist: 0.62, seed: 11, platforms: [6], nozzles: 30 },
  { id: 'torre-2', name: 'Torre 2', x: -45, z: -20, height: 26, baseRadius: 4.6, legs: 5, twist: -0.8, waist: 0.58, seed: 23, platforms: [8], nozzles: 46 },
  { id: 'torre-3', name: 'Torre 3', x: 0, z: -30, height: 47, baseRadius: 6.2, legs: 6, twist: 0.7, waist: 0.55, seed: 37, platforms: [10], nozzles: 84 },
  { id: 'torre-4', name: 'Torre 4', x: 45, z: -20, height: 26, baseRadius: 4.6, legs: 5, twist: 0.85, waist: 0.6, seed: 41, platforms: [8], nozzles: 46 },
  { id: 'torre-5', name: 'Torre 5', x: 75, z: 20, height: 17, baseRadius: 3.6, legs: 4, twist: -0.95, waist: 0.64, seed: 53, platforms: [6], nozzles: 30 },
];
export const TOTAL_NOZZLES_ANNOUNCED = 236;

export type WaypointSpec = { kind: 'tower'; tower: string; platform: number } | { kind: 'point'; x: number; z: number; y: number };
export interface WalkwaySpec {
  id: string; name: string; width: number; thickness: number; railHeight: number; supportSpacing: number;
  waypoints: WaypointSpec[];
  /** Ligação do pé da rampa (início/fim) a um nó de caminho no solo. */
  groundLinks?: { end: 'start' | 'end'; node: string }[];
}
const T = (tower: string, platform = 0): WaypointSpec => ({ kind: 'tower', tower, platform });
const P = (x: number, z: number, y: number): WaypointSpec => ({ kind: 'point', x, z, y });
const common = { width: 3.2, thickness: 0.3, railHeight: 1.1, supportSpacing: 10 };
export const WALKWAYS: WalkwaySpec[] = [
  { id: 'passarela-1', name: 'Passarela Torre 1 – Torre 2', ...common, waypoints: [T('torre-1'), P(-62, 0, 7), T('torre-2')] },
  { id: 'passarela-2', name: 'Passarela Torre 2 – Torre 3', ...common, waypoints: [T('torre-2'), P(-22, -27, 9), T('torre-3')] },
  { id: 'passarela-3', name: 'Passarela Torre 3 – Torre 4', ...common, waypoints: [T('torre-3'), P(22, -27, 9), T('torre-4')] },
  { id: 'passarela-4', name: 'Passarela Torre 4 – Torre 5', ...common, waypoints: [T('torre-4'), P(60, 0, 7), T('torre-5')] },
  { id: 'rampa-1', name: 'Rampa de acesso oeste', ...common, waypoints: [T('torre-1'), P(-100, 12, 4.3), P(-128, 8, 2.4), P(-146, 22, 0.8), P(-152, 30, 0.3)], groundLinks: [{ end: 'end', node: 'rw' }] },
  { id: 'rampa-2', name: 'Rampa de acesso leste', ...common, waypoints: [T('torre-5'), P(100, 26, 4.6), P(120, 36, 3.2), P(118, 52, 2.0), P(104, 60, 0.9), P(92, 56, 0.3)], groundLinks: [{ end: 'end', node: 'rv' }] },
];

export const WATER_POLY: V2[] = [[-45, 15], [-20, 6], [20, 6], [45, 15], [55, 35], [30, 52], [-30, 52], [-55, 35]];

export interface RectSpec { cx: number; cz: number; w: number; d: number; rot: number }
const R = (cx: number, cz: number, w: number, d: number, rot = 0): RectSpec => ({ cx, cz, w, d, rot });

export const SKATE = { ...R(-120, -35, 56, 34), cell: 0.25, fencePad: 1.5 };
export const FIELD = { ...R(112, -42, 96, 58), pitchW: 90, pitchD: 52 };   // retângulo externo (com cercamento)
export const COURTS: (RectSpec & { id: string; name: string })[] = [
  { id: 'quadra-1', name: 'Quadra 1 (modalidade pendente)', ...R(140, 30, 30, 17) },
  { id: 'quadra-2', name: 'Quadra 2 (modalidade pendente)', ...R(140, 52, 30, 17) },
];
export const NAVE = R(-150, 55, 36, 23);                 // 36 × 23 = 828 m² ≈ 830 m² divulgados (formato assumido)
export const PLAYGROUND = R(-95, 70, 30, 22);
export const GYM = R(-35, 78, 14, 8);
export const SHELTERS: (RectSpec & { id: string })[] = [
  { id: 'churrasqueira-1', ...R(5, 78, 10, 6) }, { id: 'churrasqueira-2', ...R(20, 78, 10, 6) }, { id: 'churrasqueira-3', ...R(35, 78, 10, 6) },
];
export const AMPHI = { cx: 60, cz: 68, r: 12, dirZ: 1 as const };     // palco ao norte, arquibancada subindo para o sul
export const MULTIUSE = R(100, 76, 24, 14);
export const SUPPORT_BUILDINGS: (RectSpec & { id: string; name: string; height: number })[] = [
  { id: 'mercado', name: 'Mercado (lojas)', ...R(35, -88, 30, 12), height: 4.5 },
  { id: 'administracao', name: 'Administração', ...R(-20, -88, 12, 8), height: 4 },
  { id: 'banheiros', name: 'Banheiros', ...R(75, -88, 10, 6), height: 3.5 },
  { id: 'ecoponto', name: 'Ecoponto', ...R(-60, -88, 8, 6), height: 3 },
];

export const PAVED: { id: string; name: string; poly: V2[]; material: 'concrete' | 'stone' }[] = [
  { id: 'praca-torres', name: 'Praça das torres', material: 'concrete', poly: [[-86, -40], [58, -40], [60, -8], [92, 10], [60, 58], [-60, 58], [-92, 10]] },
  { id: 'patio-nave', name: 'Pátio da Nave', material: 'stone', poly: [[-176, 40], [-124, 40], [-124, 80], [-176, 80]] },
  { id: 'praca-convivencia', name: 'Praça de convivência', material: 'concrete', poly: [[-46, 66], [115, 66], [115, 86], [-46, 86]] },
];
export const GARDEN_BEDS: { id: string; poly: V2[] }[] = [
  { id: 'canteiro-1', poly: [[-60, 60], [-40, 60], [-40, 66], [-60, 66]] },
  { id: 'canteiro-2', poly: [[0, 56], [20, 56], [20, 62], [0, 62]] },
  { id: 'canteiro-3', poly: [[-120, 20], [-108, 20], [-108, 30], [-120, 30]] },
  { id: 'canteiro-4', poly: [[70, 60], [84, 60], [84, 66], [70, 66]] },
];

// ---------- pegadas (footprints) ----------
const rf = (id: string, name: string, r: RectSpec, kind: Footprint['kind'], pad = 0, blocksPath = true): Footprint => ({
  id, name, poly: rectPoly(r.cx, r.cz, r.w, r.d, r.rot, pad), kind, blocksPath, blocksTrees: true,
});
export const FOOTPRINTS: Footprint[] = [
  ...TOWERS.map((t): Footprint => ({ id: t.id, name: t.name, poly: circlePoly(t.x, t.z, t.baseRadius + 1.5, 20), kind: 'tower', blocksPath: true, blocksTrees: true })),
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

// ---------- pontos de interesse ----------
const PROV = 'Posição e dimensões provisórias, aguardando plantas.';
export const POIS: POI[] = [
  { id: 'poi-torres', name: 'As cinco torres', kind: 'tower', center: [0, 12, -8], radius: 95, accessNode: 'n3', refId: 'torre-1',
    summary: `Cinco torres metálicas ramificadas. Alturas divulgadas: 17, 17, 26, 26 e 47 m (qual altura corresponde a cada torre ainda não foi verificada). 236 pulverizadores divulgados. ${PROV}` },
  { id: 'poi-passarelas', name: 'Passarelas elevadas', kind: 'walkway', center: [-20, 12, -12], radius: 70, accessNode: 'w1', refId: 'passarelas',
    summary: `Passarelas elevadas ligando as torres, com duas rampas de acesso. Traçado, alturas e acessos são hipóteses. ${PROV}` },
  { id: 'poi-agua', name: 'Área aquática', kind: 'water', center: [0, 0, 28], radius: 48, accessNode: 'n3', refId: 'area-aquatica',
    summary: `Espelho d'água raso com jatos e nebulização. Limites e profundidade são aproximações. ${PROV}` },
  { id: 'poi-skate', name: 'Pista de skate', kind: 'skate', center: [-120, 0, -35], radius: 38, accessNode: 'sk1', refId: 'pista-skate',
    summary: `Pista com bowls, quarter-pipe, banco, funbox, ledge e corrimão, modelada como superfície contínua. O desenho é paramétrico e provisório.` },
  { id: 'poi-campo', name: 'Campo de futebol', kind: 'field', center: [112, 0, -42], radius: 62, accessNode: 'f1', refId: 'campo-futebol',
    summary: `Campo com marcações, traves, cercamento e refletores. Dimensões provisórias.` },
  { id: 'poi-quadras', name: 'Quadras esportivas', kind: 'courts', center: [140, 0, 41], radius: 40, accessNode: 'c1', refId: 'quadra-1',
    summary: `Quantidade e modalidade das quadras ainda não foram verificadas; duas quadras genéricas foram usadas como marcador.` },
  { id: 'poi-nave', name: 'Nave do Conhecimento', kind: 'nave', center: [-150, 4, 55], radius: 42, accessNode: 'nv', refId: 'nave-conhecimento',
    summary: `Área divulgada de cerca de 830 m². Volumetria externa provisória; o formato da planta não está documentado.` },
  { id: 'poi-playground', name: 'Playground e academia', kind: 'playground', center: [-80, 2, 72], radius: 42, accessNode: 'a2', refId: 'playground',
    summary: `Área infantil e academia ao ar livre. Equipamentos genéricos provisórios.` },
  { id: 'poi-convivencia', name: 'Espaços de convivência', kind: 'social', center: [55, 3, 76], radius: 70, accessNode: 'a5', refId: 'churrasqueiras',
    summary: `Churrasqueiras cobertas, anfiteatro e espaço multiuso. Posições provisórias.` },
  { id: 'poi-mercado', name: 'Mercado e apoio', kind: 'building', center: [35, 2, -88], radius: 50, accessNode: 'k1', refId: 'mercado',
    summary: `Mercado, administração, banheiros e ecoponto são edificações de apoio. Posições provisórias.` },
];
export const FOOTPRINT_OF = (id: string): Footprint | undefined => FOOTPRINTS.find((f) => f.id === id);
export type { V3 };
