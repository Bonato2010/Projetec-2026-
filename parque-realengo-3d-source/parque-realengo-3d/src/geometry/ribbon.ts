import type { V2 } from './vec';
import { MeshData, emptyMesh } from './mesh';

/** Faixas planas (caminhos, marcações) em y fixo, com disco de junção nos nós. Normais para +y. */
export function ribbonMesh(segs: { a: V2; b: V2; w: number }[], y: number, joints = true): MeshData {
  const m = emptyMesh();
  for (const { a, b, w } of segs) {
    const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz);
    if (l < 1e-6) continue;
    const nx = (-dz / l) * (w / 2), nz = (dx / l) * (w / 2);
    const i = m.positions.length / 3;
    m.positions.push(a[0] - nx, y, a[1] - nz, a[0] + nx, y, a[1] + nz, b[0] + nx, y, b[1] + nz, b[0] - nx, y, b[1] - nz);
    m.indices.push(i, i + 1, i + 2, i, i + 2, i + 3);
    if (joints) for (const p of [a, b]) {
      const c = m.positions.length / 3, n = 10;
      m.positions.push(p[0], y, p[1]);
      for (let k = 0; k < n; k++) m.positions.push(p[0] + Math.cos((k / n) * Math.PI * 2) * (w / 2), y, p[1] + Math.sin((k / n) * Math.PI * 2) * (w / 2));
      for (let k = 0; k < n; k++) m.indices.push(c, c + 1 + ((k + 1) % n), c + 1 + k);
    }
  }
  return m;
}
export const polylineSegs = (pts: V2[], w: number, closed = false): { a: V2; b: V2; w: number }[] =>
  pts.slice(0, closed ? pts.length : -1).map((a, i) => ({ a, b: pts[(i + 1) % pts.length], w }));
