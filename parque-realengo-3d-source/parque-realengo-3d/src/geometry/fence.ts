import { MeshData, emptyMesh, appendMesh, boxMesh } from './mesh';
import { rectPoly } from './poly';

/** Cercamento retangular: montantes + travessa (frame) e painel fino translúcido (panel). */
export function rectFence(cx: number, cz: number, w: number, d: number, rot: number, h: number, spacing = 3): { frame: MeshData; panel: MeshData } {
  const frame = emptyMesh(), panel = emptyMesh();
  const c = rectPoly(cx, cz, w, d, rot);
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4];
    const dx = b[0] - a[0], dz = b[1] - a[1], len = Math.hypot(dx, dz), ry = -Math.atan2(dz, dx);
    const n = Math.max(1, Math.round(len / spacing));
    for (let k = 0; k <= n; k++) appendMesh(frame, boxMesh(a[0] + (dx * k) / n, h / 2, a[1] + (dz * k) / n, 0.08, h, 0.08, ry));
    appendMesh(frame, boxMesh((a[0] + b[0]) / 2, h, (a[1] + b[1]) / 2, len, 0.06, 0.06, ry));
    appendMesh(frame, boxMesh((a[0] + b[0]) / 2, 0.1, (a[1] + b[1]) / 2, len, 0.06, 0.06, ry));
    appendMesh(panel, boxMesh((a[0] + b[0]) / 2, h / 2, (a[1] + b[1]) / 2, len, h - 0.2, 0.02, ry));
  }
  return { frame, panel };
}
