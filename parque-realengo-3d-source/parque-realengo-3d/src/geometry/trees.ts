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

/** Massa de folhagem: icosfera deslocada por ruído, achatada, com cor por vértice (claro em cima, escuro embaixo). */
function lump(center: V3, r: number, squash: number, detail: number, seed: number, tint: V3): MeshData {
  const m = icosphere(detail);
  m.colors = [];
  const sx = seed * 0.37, sz = seed * 0.71;
  for (let i = 0; i < m.positions.length; i += 3) {
    const nx = m.positions[i], ny = m.positions[i + 1], nz = m.positions[i + 2];
    const n = noise3(nx * 2.1 + sx, ny * 2.1 + 5.3, nz * 2.1 + sz);
    const rr = r * (1 + 0.38 * (n - 0.5));
    m.positions[i] = center[0] + nx * rr;
    m.positions[i + 1] = center[1] + ny * rr * squash;
    m.positions[i + 2] = center[2] + nz * rr;
    const light = 0.62 + 0.38 * (0.5 + 0.5 * ny);
    const vary = 0.88 + 0.24 * noise3(nx * 4 + sx, ny * 4, nz * 4 + sz);
    m.colors.push(clamp(tint[0] * light * vary, 0, 1), clamp(tint[1] * light * vary, 0, 1), clamp(tint[2] * light * vary, 0, 1));
  }
  return m;
}

/** Árvore/arbusto procedural: tronco com base alargada, galhos que partem do topo do tronco e massas de folhagem nas pontas. */
export function buildTree(spec: TreeSpec): TreeMesh {
  const rnd = mulberry32(spec.seed);
  const H = spec.height, C = spec.crown;
  const trunk = emptyMesh(), canopy = emptyMesh();
  const add = (c: V3, r: number, sq: number) => appendMesh(canopy, lump(c, r, sq, spec.detail, rnd() * 100, spec.tint));

  if (spec.kind === 'shrub' || spec.kind === 'lowshrub') {
    const n = spec.kind === 'shrub' ? 6 : 5;
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, rad = rnd() * C * 0.55, r = C * (0.35 + rnd() * 0.2);
      add([Math.cos(a) * rad, r * 0.7, Math.sin(a) * rad], r, 0.8);
    }
    return { trunk, canopy, height: meshBounds(canopy).max[1] };
  }

  const trunkH = H * (spec.kind === 'columnar' ? 0.35 : spec.kind === 'spreading' ? 0.3 : 0.42);
  const lean = (rnd() - 0.5) * 0.06 * H;
  const r0 = H * 0.025;
  const tp = catmullRom([[0, 0, 0], [lean * 0.4, trunkH * 0.5, 0], [lean, trunkH, 0]], 8);
  appendMesh(trunk, sweepTube(tp, (t) => lerp(r0 * 1.25, r0 * 0.7, t), 7));
  const top = tp[tp.length - 1];
  const nl = spec.kind === 'columnar' ? 5 : 4;
  const elev: [number, number] = spec.kind === 'columnar' ? [70, 80] : spec.kind === 'spreading' ? [22, 38] : [40, 60];
  const lenF = spec.kind === 'columnar' ? 0.5 : spec.kind === 'spreading' ? 0.55 : 0.42;
  const sq = spec.kind === 'columnar' ? 1.25 : spec.kind === 'spreading' ? 0.55 : 0.8;
  const lr = spec.kind === 'columnar' ? [0.22, 0.3] : [0.3, 0.42];
  for (let i = 0; i < nl; i++) {
    const az = (i / nl) * Math.PI * 2 + rnd() * 0.6;
    const th = (rrange(rnd, elev[0], elev[1]) * Math.PI) / 180;
    const L = H * lenF * rrange(rnd, 0.7, 1.05);
    const dx = Math.cos(az) * Math.cos(th), dy = Math.sin(th), dz = Math.sin(az) * Math.cos(th);
    const mid: V3 = [top[0] + dx * L * 0.4, top[1] + dy * L * 0.4, top[2] + dz * L * 0.4];
    const tip: V3 = [top[0] + dx * L, top[1] + dy * L, top[2] + dz * L];
    const lp = catmullRom([top, mid, tip], 6);
    appendMesh(trunk, sweepTube(lp, (t) => lerp(r0 * 0.55, r0 * 0.18, t), 5));
    add([tip[0], tip[1] + C * 0.1, tip[2]], C * rrange(rnd, lr[0], lr[1]), sq);
    const q = lp[Math.floor(lp.length * 0.6)];
    const az2 = az + 0.9, tw: V3 = [q[0] + Math.cos(az2) * L * 0.35, q[1] + L * 0.22, q[2] + Math.sin(az2) * L * 0.35];
    appendMesh(trunk, sweepTube([q, tw], () => r0 * 0.14, 4));
    add([tw[0], tw[1] + C * 0.05, tw[2]], C * lr[0] * 0.85, sq);
  }
  add([top[0], top[1] + C * 0.35, top[2]], C * (spec.kind === 'columnar' ? 0.3 : 0.45), sq);
  return { trunk, canopy, height: meshBounds(canopy).max[1] };
}
