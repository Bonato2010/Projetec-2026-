import type { V2 } from '../geometry/vec';
import { edgePoint, edgeOutwardNormal } from '../geometry/poly';

/**
 * LAYOUT GERAL — COORDENADAS LOCAIS EM METROS.
 * Eixos: x = leste (+x), z = sul (+z) (como o eixo z do Three.js), y = acima (+y). Origem ≈ centroide do parque.
 *
 * Baseado no levantamento cadastral real do OpenStreetMap (Way 681694032, 78.129 m²),
 * fotos de satélite, dados da Prefeitura do Rio de Janeiro e referências de arquitetura do ArchDaily / Ecomimesis.
 */
export const LAYOUT_META = {
  version: '1.0.0-real-osm',
  provisional: false,
  units: 'm',
  referenceAreaM2: 78129,
  /** Origem (0,0) calibrada para o centroide do polígono real do Parque Realengo Jornalista Susana Naspolini. */
  geoOrigin: { lat: -22.8825085, lon: -43.4330630 },
  note: 'Implantação baseada no levantamento cadastral real do Parque Realengo Susana Naspolini (OSM Way 681694032, 78.129 m²).',
};

/**
 * Perímetro real de 25 vértices levantado via OpenStreetMap e centralizado no seu centroide.
 * Área exata: 78.129 m².
 */
export const PARK_PERIMETER: V2[] = [
  [-43.9, 251.4], [-29.6, 253.6], [-25.0, 254.5], [16.7, 260.5], [23.0, 269.9],
  [61.3, 276.1], [66.0, 267.2], [71.2, 251.0], [77.9, 223.8], [81.4, 204.1],
  [89.5, 153.9], [107.2, 45.7], [140.8, -163.6], [-52.4, -196.8], [-53.0, -193.3],
  [-79.7, -55.1], [-212.7, -80.2], [-197.6, -168.6], [-231.4, -173.9], [-251.1, -37.9],
  [-125.8, -13.8], [-63.3, -1.8], [-1.6, 10.1], [-21.9, 124.5], [-32.6, 184.7]
];

export interface Entrance { id: string; name: string; pos: V2; facing: V2; edge: number }
const mk = (id: string, name: string, edge: number, t: number): Entrance => ({
  id, name, edge, pos: edgePoint(PARK_PERIMETER, edge, t), facing: edgeOutwardNormal(PARK_PERIMETER, edge),
});

export const ENTRANCES: Entrance[] = [
  mk('E1', 'Acesso Norte (Rua Prof. Carlos Wenceslau)', 12, 0.4872),
  mk('E2', 'Acesso Sul (Praça do Mercado / Rua Marechal Modestino)', 4, 0.3326),
  mk('E3', 'Acesso Oeste (IFRJ / Rua General Sezefredo)', 15, 0.98),
];

/** Contexto urbano de baixo gabarito ao redor do parque. */
export const SURROUNDINGS_CONFIG = {
  sidewalk: 3.5,
  street: 9,
  rows: 2,
  maxHeight: 15,
  seed: 4242,
  provisional: false,
};
