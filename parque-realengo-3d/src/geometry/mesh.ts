import { V3, cross3, sub3, norm3 } from './vec';

/** Malha em arrays simples. Independente do Three.js para poder ser testada em Node. */
export interface MeshData {
  positions: number[];
  indices: number[];
  colors?: number[];
}
export const emptyMesh = (): MeshData => ({ positions: [], indices: [] });

/** Acrescenta `src` em `dst`. Se algum dos dois tem cores, preenche o outro com `fill`. */
export function appendMesh(dst: MeshData, src: MeshData, fill: V3 = [1, 1, 1]): MeshData {
  const off = dst.positions.length / 3;
  const nSrc = src.positions.length / 3;
  if (src.colors && !dst.colors) {
    dst.colors = [];
    for (let i = 0; i < off; i++) dst.colors.push(fill[0], fill[1], fill[2]);
  }
  for (let i = 0; i < src.positions.length; i++) dst.positions.push(src.positions[i]);
  for (let i = 0; i < src.indices.length; i++) dst.indices.push(src.indices[i] + off);
  if (dst.colors) {
    if (src.colors) for (let i = 0; i < src.colors.length; i++) dst.colors.push(src.colors[i]);
    else for (let i = 0; i < nSrc; i++) dst.colors.push(fill[0], fill[1], fill[2]);
  }
  return dst;
}
export const mergeMeshes = (list: MeshData[]): MeshData => {
  const out = emptyMesh();
  for (const m of list) appendMesh(out, m);
  return out;
};

export function computeNormals(positions: number[], indices: number[]): number[] {
  const n = new Array<number>(positions.length).fill(0);
  for (let i = 0; i < indices.length; i += 3) {
    const ia = indices[i] * 3, ib = indices[i + 1] * 3, ic = indices[i + 2] * 3;
    const a: V3 = [positions[ia], positions[ia + 1], positions[ia + 2]];
    const b: V3 = [positions[ib], positions[ib + 1], positions[ib + 2]];
    const c: V3 = [positions[ic], positions[ic + 1], positions[ic + 2]];
    const f = cross3(sub3(b, a), sub3(c, a)); // ponderado pela área
    for (const k of [ia, ib, ic]) { n[k] += f[0]; n[k + 1] += f[1]; n[k + 2] += f[2]; }
  }
  for (let i = 0; i < n.length; i += 3) {
    const v = norm3([n[i], n[i + 1], n[i + 2]]);
    n[i] = v[0]; n[i + 1] = v[1]; n[i + 2] = v[2];
  }
  return n;
}

export function signedVolume(m: MeshData): number {
  let v = 0;
  const p = m.positions;
  for (let i = 0; i < m.indices.length; i += 3) {
    const a = m.indices[i] * 3, b = m.indices[i + 1] * 3, c = m.indices[i + 2] * 3;
    const ax = p[a], ay = p[a + 1], az = p[a + 2];
    const bx = p[b], by = p[b + 1], bz = p[b + 2];
    const cx = p[c], cy = p[c + 1], cz = p[c + 2];
    v += ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx);
  }
  return v / 6;
}
/** Para malhas fechadas: garante normais para fora invertendo a ordem dos triângulos se preciso. */
export function orientOutward(m: MeshData): MeshData {
  if (signedVolume(m) < 0) {
    for (let i = 0; i < m.indices.length; i += 3) {
      const t = m.indices[i + 1];
      m.indices[i + 1] = m.indices[i + 2];
      m.indices[i + 2] = t;
    }
  }
  return m;
}

export function meshBounds(m: MeshData): { min: V3; max: V3 } {
  const min: V3 = [Infinity, Infinity, Infinity];
  const max: V3 = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < m.positions.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const v = m.positions[i + k];
      if (v < min[k]) min[k] = v;
      if (v > max[k]) max[k] = v;
    }
  }
  return { min, max };
}
export const meshHasNaN = (m: MeshData): boolean => m.positions.some((v) => !Number.isFinite(v));

export function transformMesh(m: MeshData, f: (p: V3) => V3): MeshData {
  for (let i = 0; i < m.positions.length; i += 3) {
    const p = f([m.positions[i], m.positions[i + 1], m.positions[i + 2]]);
    m.positions[i] = p[0]; m.positions[i + 1] = p[1]; m.positions[i + 2] = p[2];
  }
  return m;
}

/** Caixa com normais planas (24 vértices). Usada só para peças pequenas (postes, travessas). */
export function boxMesh(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, rotY = 0): MeshData {
  const h: V3 = [sx / 2, sy / 2, sz / 2];
  const axes: [V3, V3, V3][] = [
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
    [[0, 1, 0], [0, 0, 1], [1, 0, 0]], [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
    [[0, 0, 1], [1, 0, 0], [0, 1, 0]], [[0, 0, -1], [0, 1, 0], [1, 0, 0]],
  ];
  const ext = (a: V3) => Math.abs(a[0]) * h[0] + Math.abs(a[1]) * h[1] + Math.abs(a[2]) * h[2];
  const m = emptyMesh();
  const c = Math.cos(rotY), s = Math.sin(rotY);
  for (const [n, u, v] of axes) {
    const base = m.positions.length / 3;
    for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const x = n[0] * ext(n) + u[0] * ext(u) * su + v[0] * ext(v) * sv;
      const y = n[1] * ext(n) + u[1] * ext(u) * su + v[1] * ext(v) * sv;
      const z = n[2] * ext(n) + u[2] * ext(u) * su + v[2] * ext(v) * sv;
      m.positions.push(cx + x * c + z * s, cy + y, cz - x * s + z * c);
    }
    m.indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  return m;
}

/** Prisma anular (ou disco, se rIn = 0) entre y0 e y1. */
export function annulusPrism(cx: number, cz: number, rIn: number, rOut: number, y0: number, y1: number, seg = 32): MeshData {
  const m = emptyMesh();
  const ring = (r: number, y: number) => {
    const b = m.positions.length / 3;
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      m.positions.push(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r);
    }
    return b;
  };
  const oTop = ring(rOut, y1), oBot = ring(rOut, y0);
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg;
    m.indices.push(oBot + i, oTop + i, oBot + j, oTop + i, oTop + j, oBot + j);
  }
  if (rIn > 0.01) {
    const iTop = ring(rIn, y1), iBot = ring(rIn, y0);
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg;
      m.indices.push(iBot + i, iBot + j, iTop + i, iTop + i, iBot + j, iTop + j);
      m.indices.push(oTop + i, iTop + i, oTop + j, iTop + i, iTop + j, oTop + j);
      m.indices.push(oBot + i, oBot + j, iBot + i, iBot + i, oBot + j, iBot + j);
    }
  } else {
    const ct = m.positions.length / 3; m.positions.push(cx, y1, cz);
    const cb = ct + 1; m.positions.push(cx, y0, cz);
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg;
      m.indices.push(ct, oTop + i, oTop + j);
      m.indices.push(cb, oBot + j, oBot + i);
    }
  }
  return orientOutward(m);
}

export const cylinderMesh = (cx: number, cz: number, r: number, y0: number, y1: number, seg = 10): MeshData =>
  annulusPrism(cx, cz, 0, r, y0, y1, seg);

/** Icosfera indexada, `sub` subdivisões (0 → 20 faces, 1 → 80, 2 → 320). */
export function icosphere(sub: number): MeshData {
  const t = (1 + Math.sqrt(5)) / 2;
  const base: V3[] = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  let faces: number[][] = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const verts: V3[] = base.map((v) => norm3(v));
  const cache = new Map<string, number>();
  const mid = (a: number, b: number): number => {
    const k = a < b ? `${a}_${b}` : `${b}_${a}`;
    const hit = cache.get(k);
    if (hit !== undefined) return hit;
    const p = norm3([(verts[a][0] + verts[b][0]) / 2, (verts[a][1] + verts[b][1]) / 2, (verts[a][2] + verts[b][2]) / 2]);
    verts.push(p);
    cache.set(k, verts.length - 1);
    return verts.length - 1;
  };
  for (let s = 0; s < sub; s++) {
    const next: number[][] = [];
    for (const [a, b, c] of faces) {
      const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
  }
  const m = emptyMesh();
  for (const v of verts) m.positions.push(v[0], v[1], v[2]);
  for (const f of faces) m.indices.push(f[0], f[1], f[2]);
  return orientOutward(m);
}
