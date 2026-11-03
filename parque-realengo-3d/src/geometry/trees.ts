import { V3, lerp, clamp } from './vec';
import { mulberry32, rrange } from './rng';
import { catmullRom } from './curves';
import { sweepTube } from './sweep';
import { MeshData, emptyMesh, appendMesh, icosphere, meshBounds } from './mesh';

export type TreeKind = 'broadleaf' | 'columnar' | 'spreading' | 'shrub' | 'lowshrub';
export interface TreeSpec { kind: TreeKind; seed: number; height: number; crown: number; detail: number; tint: V3 }
export interface TreeMesh { trunk: MeshData; canopy: MeshData; height: number }

const hash3 = (x: number, y: number, z: number): number => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
const noise3 = (x: number, y: number, z: number): number => {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const c = (a: number, b: number, d: number) => hash3(xi + a, yi + b, zi + d);
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  );
};

/** Massa volumétrica de folhagem/flores: icosfera deformada proceduralmente com tonalidades ricas */
function lump(center: V3, r: number, squash: number, detail: number, seed: number, tint: V3): MeshData {
  const m = icosphere(detail);
  m.colors = [];
  const sx = seed * 0.37, sz = seed * 0.71;
  for (let i = 0; i < m.positions.length; i += 3) {
    const nx = m.positions[i], ny = m.positions[i + 1], nz = m.positions[i + 2];
    const n = noise3(nx * 2.4 + sx, ny * 2.4 + 5.3, nz * 2.4 + sz);
    const rr = r * (1 + 0.36 * (n - 0.5));
    m.positions[i] = center[0] + nx * rr;
    m.positions[i + 1] = center[1] + ny * rr * squash;
    m.positions[i + 2] = center[2] + nz * rr;

    // Variação de iluminação ambiente natural (sombra na base, luz solar no topo da copa)
    const light = 0.65 + 0.35 * (0.5 + 0.5 * ny);
    const vary = 0.88 + 0.24 * noise3(nx * 4.2 + sx, ny * 4.2, nz * 4.2 + sz);
    m.colors.push(
      clamp(tint[0] * light * vary, 0, 1),
      clamp(tint[1] * light * vary, 0, 1),
      clamp(tint[2] * light * vary, 0, 1)
    );
  }
  return m;
}

/**
 * ÁRVORES E ARBUSTOS DA MATA ATLÂNTICA
 * Suporte a:
 * - Ipês e Jacarandás (copas floridas, abertas e orgânicas)
 * - Palmeiras Imperiais (estipe alto, anéis de crescimento e folhas arqueadas)
 * - Árvores de Sombra (Pau-Brasil e Oiti com copas densas e volumétricas)
 * - Arbustos e Macrófitas de Jardins de Chuva
 */
export function buildTree(spec: TreeSpec): TreeMesh {
  const rnd = mulberry32(spec.seed);
  const H = spec.height, C = spec.crown;
  const trunk = emptyMesh(), canopy = emptyMesh();
  const add = (c: V3, r: number, sq: number) => appendMesh(canopy, lump(c, r, sq, spec.detail, rnd() * 100, spec.tint));

  // 1. ARBUSTOS E FORRAÇÃO TROPICAL
  if (spec.kind === 'shrub' || spec.kind === 'lowshrub') {
    const n = spec.kind === 'shrub' ? 7 : 5;
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2;
      const rad = rnd() * C * 0.50;
      const r = C * (0.35 + rnd() * 0.25);
      add([Math.cos(a) * rad, r * 0.7, Math.sin(a) * rad], r, 0.82);
    }
    return { trunk, canopy, height: meshBounds(canopy).max[1] };
  }

  // 2. PALMEIRAS IMPERIAIS (Columnar)
  if (spec.kind === 'columnar') {
    const trunkH = H * 0.82;
    const r0 = H * 0.022;
    const tp = catmullRom([
      [0, 0, 0],
      [0, trunkH * 0.45, 0],
      [0, trunkH, 0]
    ], 10);

    // Tronco esbelto com capitel verde no topo
    appendMesh(trunk, sweepTube(tp, (t) => lerp(r0 * 1.35, r0 * 0.75, t), 8));

    // Folhas de palmeira em arco (8 a 10 frondes)
    const numFronds = 8;
    const top = tp[tp.length - 1];
    for (let f = 0; f < numFronds; f++) {
      const az = (f / numFronds) * Math.PI * 2 + rnd() * 0.3;
      const frondLen = C * 0.95;
      const dx = Math.cos(az), dz = Math.sin(az);

      const fPath: V3[] = [
        top,
        [top[0] + dx * frondLen * 0.45, top[1] + 1.2, top[2] + dz * frondLen * 0.45],
        [top[0] + dx * frondLen * 0.85, top[1] + 0.4, top[2] + dz * frondLen * 0.85],
        [top[0] + dx * frondLen, top[1] - 0.6, top[2] + dz * frondLen]
      ];
      appendMesh(trunk, sweepTube(fPath, (u) => lerp(0.08, 0.02, u), 4));
      add([fPath[2][0], fPath[2][1] + 0.2, fPath[2][2]], C * 0.26, 0.55);
    }
    add([top[0], top[1] + 0.6, top[2]], C * 0.32, 0.7);

    return { trunk, canopy, height: meshBounds(canopy).max[1] };
  }

  // 3. ÁRVORES DE COPA ESPALHADA OU DILATADA (Ipês, Jacarandá, Pau-Brasil)
  const isSpreading = spec.kind === 'spreading';
  const trunkH = H * (isSpreading ? 0.32 : 0.42);
  const lean = (rnd() - 0.5) * 0.05 * H;
  const r0 = H * 0.026;
  const tp = catmullRom([[0, 0, 0], [lean * 0.4, trunkH * 0.5, 0], [lean, trunkH, 0]], 8);
  appendMesh(trunk, sweepTube(tp, (t) => lerp(r0 * 1.3, r0 * 0.7, t), 7));
  const top = tp[tp.length - 1];

  const nl = isSpreading ? 5 : 4;
  const elev: [number, number] = isSpreading ? [24, 45] : [42, 65];
  const lenF = isSpreading ? 0.58 : 0.46;
  const sq = isSpreading ? 0.58 : 0.82;
  const lr = isSpreading ? [0.32, 0.45] : [0.28, 0.38];

  for (let i = 0; i < nl; i++) {
    const az = (i / nl) * Math.PI * 2 + rnd() * 0.5;
    const th = (rrange(rnd, elev[0], elev[1]) * Math.PI) / 180;
    const L = H * lenF * rrange(rnd, 0.75, 1.05);
    const dx = Math.cos(az) * Math.cos(th), dy = Math.sin(th), dz = Math.sin(az) * Math.cos(th);
    const mid: V3 = [top[0] + dx * L * 0.4, top[1] + dy * L * 0.4, top[2] + dz * L * 0.4];
    const tip: V3 = [top[0] + dx * L, top[1] + dy * L, top[2] + dz * L];
    const lp = catmullRom([top, mid, tip], 6);
    appendMesh(trunk, sweepTube(lp, (t) => lerp(r0 * 0.55, r0 * 0.18, t), 5));
    add([tip[0], tip[1] + C * 0.1, tip[2]], C * rrange(rnd, lr[0], lr[1]), sq);

    const q = lp[Math.floor(lp.length * 0.6)];
    const az2 = az + 0.9;
    const tw: V3 = [q[0] + Math.cos(az2) * L * 0.35, q[1] + L * 0.22, q[2] + Math.sin(az2) * L * 0.35];
    appendMesh(trunk, sweepTube([q, tw], () => r0 * 0.14, 4));
    add([tw[0], tw[1] + C * 0.05, tw[2]], C * lr[0] * 0.85, sq);
  }

  // Domo superior da copa
  add([top[0], top[1] + C * 0.35, top[2]], C * 0.42, sq);

  return { trunk, canopy, height: meshBounds(canopy).max[1] };
}
