import { V2 } from './vec';

/** Área com sinal (shoelace) no plano (x, z). */
export function signedArea(p: V2[]): number {
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, z1] = p[i], [x2, z2] = p[(i + 1) % p.length];
    a += x1 * z2 - x2 * z1;
  }
  return a / 2;
}
export const area = (p: V2[]): number => Math.abs(signedArea(p));

export function centroid(p: V2[]): V2 {
  let cx = 0, cz = 0, a = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, z1] = p[i], [x2, z2] = p[(i + 1) % p.length];
    const f = x1 * z2 - x2 * z1;
    a += f; cx += (x1 + x2) * f; cz += (z1 + z2) * f;
  }
  return a === 0 ? p[0] : [cx / (3 * a), cz / (3 * a)];
}
export function bbox(p: V2[]): { minX: number; maxX: number; minZ: number; maxZ: number } {
  const xs = p.map((q) => q[0]), zs = p.map((q) => q[1]);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minZ: Math.min(...zs), maxZ: Math.max(...zs) };
}

export function pointInPoly(pt: V2, poly: V2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i], [xj, zj] = poly[j];
    if (zi > pt[1] !== zj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

/** Retângulo orientado (rot em rad, em torno do centro) → polígono com margem opcional. */
export function rectPoly(cx: number, cz: number, w: number, d: number, rot = 0, pad = 0): V2[] {
  const hw = w / 2 + pad, hd = d / 2 + pad, c = Math.cos(rot), s = Math.sin(rot);
  return ([[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]] as V2[]).map(([x, z]) => [cx + x * c - z * s, cz + x * s + z * c] as V2);
}
export function circlePoly(cx: number, cz: number, r: number, n = 24): V2[] {
  return Array.from({ length: n }, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * r, cz + Math.sin((i / n) * Math.PI * 2) * r] as V2);
}
/** Semidisco com a base em z = cz e abertura para `dirZ` (+1 sul / -1 norte). */
export function halfDiskPoly(cx: number, cz: number, r: number, dirZ: 1 | -1, n = 16): V2[] {
  const pts: V2[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI;
    pts.push([cx + Math.cos(a) * r, cz + dirZ * Math.sin(a) * r]);
  }
  return pts;
}

const orient = (a: V2, b: V2, c: V2): number => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
export function segSeg(a: V2, b: V2, c: V2, d: V2): boolean {
  const o1 = orient(a, b, c), o2 = orient(a, b, d), o3 = orient(c, d, a), o4 = orient(c, d, b);
  return o1 * o2 < 0 && o3 * o4 < 0;
}
export function segIntersectsPoly(a: V2, b: V2, poly: V2[]): boolean {
  if (pointInPoly(a, poly) || pointInPoly(b, poly)) return true;
  for (let i = 0; i < poly.length; i++) if (segSeg(a, b, poly[i], poly[(i + 1) % poly.length])) return true;
  return false;
}
export function polyIntersects(p: V2[], q: V2[]): boolean {
  for (let i = 0; i < p.length; i++) {
    if (segIntersectsPoly(p[i], p[(i + 1) % p.length], q)) return true;
  }
  return pointInPoly(q[0], p);
}
export function distPointSeg(p: V2, a: V2, b: V2): number {
  const dx = b[0] - a[0], dz = b[1] - a[1];
  const l2 = dx * dx + dz * dz;
  const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / l2));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dz));
}
export function distPointPolyBoundary(p: V2, poly: V2[]): number {
  let d = Infinity;
  for (let i = 0; i < poly.length; i++) d = Math.min(d, distPointSeg(p, poly[i], poly[(i + 1) % poly.length]));
  return d;
}
export function selfIntersects(poly: V2[]): boolean {
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      if (segSeg(poly[i], poly[(i + 1) % n], poly[j], poly[(j + 1) % n])) return true;
    }
  }
  return false;
}

/** Deslocamento de polígono com junções em mitra. d > 0 → para fora. */
export function offsetPolygon(poly: V2[], d: number): V2[] {
  const n = poly.length;
  const sgn = signedArea(poly) > 0 ? 1 : -1;
  const normals: V2[] = poly.map((p, i) => {
    const q = poly[(i + 1) % n];
    const dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz) || 1;
    return sgn > 0 ? [dz / l, -dx / l] : [-dz / l, dx / l];
  });
  return poly.map((p, i) => {
    const n1 = normals[(i - 1 + n) % n], n2 = normals[i];
    const k = 1 + n1[0] * n2[0] + n1[1] * n2[1];
    let mx: number, mz: number;
    if (k < 0.25) { const sx = n1[0] + n2[0], sz = n1[1] + n2[1], l = Math.hypot(sx, sz) || 1; mx = sx / l; mz = sz / l; }
    else { mx = (n1[0] + n2[0]) / k; mz = (n1[1] + n2[1]) / k; }
    return [p[0] + mx * d, p[1] + mz * d] as V2;
  });
}

/** Normal externa (unitária) da aresta i. */
export function edgeOutwardNormal(poly: V2[], i: number): V2 {
  const p = poly[i], q = poly[(i + 1) % poly.length];
  const dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz) || 1;
  return signedArea(poly) > 0 ? [dz / l, -dx / l] : [-dz / l, dx / l];
}
export const edgePoint = (poly: V2[], i: number, t: number): V2 => {
  const p = poly[i], q = poly[(i + 1) % poly.length];
  return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
};
