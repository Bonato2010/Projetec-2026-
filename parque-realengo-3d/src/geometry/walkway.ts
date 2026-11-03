import { V3, dist3 } from './vec';
import { catmullRom, resampleByStep, polylineLength } from './curves';
import { sweepProfile, sweepTube } from './sweep';
import { MeshData, emptyMesh, appendMesh, boxMesh, cylinderMesh } from './mesh';

export interface WalkwayGeomSpec {
  width: number;
  thickness: number;
  railHeight: number;
  supportSpacing: number;
}
export interface WalkwayMesh { deck: MeshData; rails: MeshData; supports: MeshData; centerline: V3[]; length: number; maxGrade: number }

/**
 * Passarela elevada: tabuleiro com espessura (perfil retangular varrido), guarda-corpos
 * (corrimão, travessa e montantes) e colunas de apoio até o chão.
 * `ctrl` = pontos de controle 3D (y = cota da superfície do piso).
 */
export function buildWalkway(ctrl: V3[], s: WalkwayGeomSpec): WalkwayMesh {
  const dense = catmullRom(ctrl, 16);
  const center = resampleByStep(dense, 1.5);
  const w = s.width / 2, t = s.thickness;
  const deck = sweepProfile(center, [[-w, -t], [w, -t], [w, 0], [-w, 0]]);

  const rails = emptyMesh();
  for (const side of [-1, 1]) {
    const lat = (pt: V3, i: number, off: number, y: number): V3 => {
      const a = center[Math.max(0, i - 1)], b = center[Math.min(center.length - 1, i + 1)];
      const dx = b[0] - a[0], dz = b[2] - a[2], l = Math.hypot(dx, dz) || 1;
      return [pt[0] + (dz / l) * off * side, pt[1] + y, pt[2] - (dx / l) * off * side];
    };
    const off = w - 0.06;
    const top = center.map((p, i) => lat(p, i, off, s.railHeight));
    const mid = center.map((p, i) => lat(p, i, off, s.railHeight * 0.5));
    appendMesh(rails, sweepTube(top, () => 0.035, 6));
    appendMesh(rails, sweepTube(mid, () => 0.02, 5));
    for (let i = 0; i < center.length; i += 2) {
      const q = lat(center[i], i, off, 0);
      const a = center[Math.max(0, i - 1)], b = center[Math.min(center.length - 1, i + 1)];
      appendMesh(rails, boxMesh(q[0], q[1] + s.railHeight / 2, q[2], 0.05, s.railHeight, 0.05, -Math.atan2(b[2] - a[2], b[0] - a[0])));
    }
  }

  const supports = emptyMesh();
  const L = polylineLength(center);
  const nSup = Math.max(1, Math.floor(L / s.supportSpacing));
  for (let k = 1; k <= nSup; k++) {
    const idx = Math.min(center.length - 1, Math.round((k / (nSup + 1)) * (center.length - 1)));
    const p = center[idx];
    const top = p[1] - t;
    if (top > 0.6) appendMesh(supports, cylinderMesh(p[0], p[2], 0.2, 0, top, 10));
  }
  let maxGrade = 0;
  for (let i = 1; i < center.length; i++) {
    const run = Math.hypot(center[i][0] - center[i - 1][0], center[i][2] - center[i - 1][2]);
    if (run > 0.01) maxGrade = Math.max(maxGrade, Math.abs(center[i][1] - center[i - 1][1]) / run);
  }
  void dist3;
  return { deck, rails, supports, centerline: center, length: L, maxGrade };
}
