import type { V2 } from './types';
import { ENTRANCES } from './parkLayout';

/** Rede de caminhos (nós + arestas). Usada tanto para a geometria quanto para o grafo de rotas. PROVISÓRIA. */
const ent = (id: string): V2 => ENTRANCES.find((e) => e.id === id)!.pos;
export const PATH_NODES: { id: string; pos: V2 }[] = [
  { id: 'E1', pos: ent('E1') }, { id: 'E2', pos: ent('E2') }, { id: 'E3', pos: ent('E3') },
  { id: 'nv', pos: [-150, 72] }, { id: 'a1', pos: [-140, 86] }, { id: 'a2', pos: [-100, 88] }, { id: 'a3', pos: [-62, 90] },
  { id: 'a35', pos: [-35, 90] }, { id: 'a4', pos: [-10, 90] }, { id: 'a5', pos: [40, 92] }, { id: 'a6', pos: [80, 92] },
  { id: 'a7', pos: [130, 88] }, { id: 'a8', pos: [170, 70] },
  { id: 'c1', pos: [163, 45] }, { id: 'c2', pos: [166, 10] }, { id: 'f1', pos: [112, -4] }, { id: 'm1', pos: [65, -3] },
  { id: 'n3', pos: [6, -8] }, { id: 'w1', pos: [-60, -3] }, { id: 'sk1', pos: [-120, -8] }, { id: 'rw', pos: [-152, 30] },
  { id: 'q1', pos: [-124, 34] }, { id: 'q2', pos: [-124, 76] }, { id: 'v1', pos: [-62, 35] },
  { id: 'n2', pos: [16, -58] }, { id: 'k0', pos: [15, -78] }, { id: 'n1', pos: [15, -90] }, { id: 'k1', pos: [35, -78] },
  { id: 'v3', pos: [64, 40] }, { id: 'rv', pos: [92, 56] }, { id: 'adm', pos: [-20, -78] }, { id: 'eco', pos: [-60, -80] },
];
export const PATH_EDGES: [string, string, number?][] = [
  ['E1', 'nv', 3.5], ['E1', 'a1', 3.5], ['nv', 'a1', 3], ['a1', 'a2', 4], ['a2', 'a3', 4], ['a3', 'a35', 4], ['a35', 'a4', 4],
  ['a4', 'a5', 4], ['a5', 'a6', 4], ['a6', 'a7', 4], ['a7', 'a8', 4], ['a8', 'E3', 3.5], ['E3', 'c1', 3.5], ['c1', 'a8', 3],
  ['c1', 'c2', 3], ['c2', 'f1', 3.5], ['f1', 'm1', 4], ['m1', 'n3', 4.5], ['n3', 'w1', 4.5], ['w1', 'sk1', 3.5], ['w1', 'v1', 3.5],
  ['v1', 'a3', 3.5], ['m1', 'v3', 3.5], ['v3', 'rv', 3], ['rw', 'q1', 3], ['q1', 'q2', 3], ['q2', 'a1', 3], ['n3', 'n2', 3.5], ['n2', 'k0', 3.5],
  ['k0', 'n1', 3.5], ['n1', 'E2', 3.5], ['k0', 'k1', 3], ['k0', 'adm', 3], ['adm', 'eco', 3], ['n2', 'adm', 3],
];
export const DEFAULT_PATH_WIDTH = 3.5;
