import type { V2 } from '../geometry/vec';
import { edgePoint, edgeOutwardNormal } from '../geometry/poly';

/**
 * LAYOUT GERAL — COORDENADAS LOCAIS EM METROS.
 * Eixos: x = leste, z = sul (como o eixo z do Three.js), y = acima. Origem ≈ centro do parque.
 *
 * ⚠️ PROVISÓRIO: o contorno abaixo NÃO é o perímetro real. É um polígono irregular com ~77 mil m²
 * (ordem de grandeza dos ~76 mil m² divulgados) criado só para a cena ter um terreno editável.
 * Substitua `PARK_PERIMETER` pelo contorno levantado em planta/ortofoto e o resto da cena se ajusta.
 */
export const LAYOUT_META = {
  version: '0.1.0-provisional',
  provisional: true,
  units: 'm',
  referenceAreaM2: 76000,
  /** Preencher com lat/lon do ponto (0,0) para habilitar a importação de GeoJSON (OSM/Data.Rio). */
  geoOrigin: null as null | { lat: number; lon: number },
  note: 'Implantação provisória — posições aproximadas, aguardando plantas e fotografias.',
};

export const PARK_PERIMETER: V2[] = [
  [-205, -85], [-120, -100], [10, -108], [120, -96], [198, -70], [214, -20], [205, 45],
  [170, 92], [60, 104], [-40, 98], [-130, 92], [-190, 60], [-214, -10],
];

export interface Entrance { id: string; name: string; pos: V2; facing: V2; edge: number }
const mk = (id: string, name: string, edge: number, t: number): Entrance => ({
  id, name, edge, pos: edgePoint(PARK_PERIMETER, edge, t), facing: edgeOutwardNormal(PARK_PERIMETER, edge),
});
export const ENTRANCES: Entrance[] = [
  mk('E1', 'Acesso sudoeste (provisório)', 10, 0.5),
  mk('E2', 'Acesso norte (provisório)', 2, 0.05),
  mk('E3', 'Acesso leste (provisório)', 6, 0.0),
];

/** Contexto urbano genérico (provisório). Sem dados reais ainda; ver src/data/geo.ts. */
export const SURROUNDINGS_CONFIG = {
  sidewalk: 3.5,
  street: 9,
  rows: 2,
  maxHeight: 15,
  seed: 4242,
  provisional: true,
};
