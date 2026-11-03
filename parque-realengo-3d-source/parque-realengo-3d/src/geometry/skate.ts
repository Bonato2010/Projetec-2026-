import { V3, clamp, smoothstep } from './vec';
import { MeshData, emptyMesh, appendMesh, boxMesh } from './mesh';
import { sweepTube } from './sweep';

/**
 * Pista de skate como CAMPO DE ALTURAS contínuo (sem caixas empilhadas):
 *  - 2 bowls em retângulo arredondado com transição em arco de círculo (raio e ângulo parametrizados);
 *  - quarter-pipe com plataforma; banco (bank) com bordas suavizadas; funbox com chanfros a 45°;
 *  - ledge (manual pad) e corrimão sobre montantes; coping (tubo) no lábio dos bowls.
 * Coordenadas locais: x ∈ [-w/2, w/2], z ∈ [-d/2, d/2]; y = 0 é o nível do piso externo.
 * Todas as dimensões são PROVISÓRIAS (sem planta).
 */
export interface SkateSpec { w: number; d: number; cell: number }

const sdfRoundRect = (x: number, z: number, cx: number, cz: number, hx: number, hz: number, r: number): number => {
  const qx = Math.abs(x - cx) - (hx - r), qz = Math.abs(z - cz) - (hz - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - r;
};
/** Perfil de transição circular: raio r, ângulo máximo th. s = distância horizontal a partir do lábio. */
const arcProfile = (s: number, r: number, th: number): { depth: number; total: number } => {
  const run = r * Math.sin(th), D = r * (1 - Math.cos(th));
  if (s <= 0) return { depth: 0, total: D };
  if (s >= run) return { depth: D, total: D };
  const u = run - s;
  return { depth: D - r * (1 - Math.cos(Math.asin(u / r))), total: D };
};
const TH = (72 * Math.PI) / 180;
const BOWLS = [
  { cx: -11, cz: 2, hx: 11, hz: 8, cr: 6, r: 2.4, th: TH },
  { cx: 13, cz: 6, hx: 6, hz: 5, cr: 4, r: 1.9, th: (70 * Math.PI) / 180 },
];
const FUNBOX = { cx: 8, cz: -8, hx: 5, hz: 4, h: 0.55 };
const LEDGE = { cx: -15, cz: 13, hx: 7, hz: 1.5, h: 0.45 };

export function skateHeight(x: number, z: number): number {
  let h = 0;
  for (const b of BOWLS) {
    const s = -sdfRoundRect(x, z, b.cx, b.cz, b.hx, b.hz, b.cr);
    h -= arcProfile(s, b.r, b.th).depth;
  }
  // quarter-pipe (norte): tangente em z = -9, plataforma em z <= -11.3
  {
    const r = 2.4, run = r * Math.sin(TH), D = r * (1 - Math.cos(TH));
    const u = -9 - z;
    const prof = u <= 0 ? 0 : u >= run ? D : r * (1 - Math.cos(Math.asin(u / r)));
    h += prof * smoothstep(-26, -24, x) * (1 - smoothstep(-2, 0, x)) * smoothstep(-16.7, -15.2, z);
  }
  // bank (rampa suave com laterais suavizadas)
  h += 0.9 * smoothstep(18, 26, x) * smoothstep(-14, -12, z) * (1 - smoothstep(-4, -2, z)) * (1 - smoothstep(26.2, 28, x));
  // funbox com chanfros 45°
  h += clamp(-sdfRoundRect(x, z, FUNBOX.cx, FUNBOX.cz, FUNBOX.hx, FUNBOX.hz, 0.4), 0, FUNBOX.h);
  // ledge
  h += clamp(-sdfRoundRect(x, z, LEDGE.cx, LEDGE.cz, LEDGE.hx, LEDGE.hz, 0.3) * 0.9, 0, LEDGE.h);
  return h;
}

export interface SkateMesh { surface: MeshData; coping: MeshData; rails: MeshData; minH: number; maxH: number; maxSlope: number }

export function buildSkatepark(spec: SkateSpec): SkateMesh {
  const nx = Math.round(spec.w / spec.cell), nz = Math.round(spec.d / spec.cell);
  const surface = emptyMesh();
  let minH = Infinity, maxH = -Infinity, maxSlope = 0;
  const hs: number[] = [];
  for (let j = 0; j <= nz; j++) {
    for (let i = 0; i <= nx; i++) {
      const x = -spec.w / 2 + (i / nx) * spec.w, z = -spec.d / 2 + (j / nz) * spec.d;
      const h = skateHeight(x, z);
      hs.push(h); minH = Math.min(minH, h); maxH = Math.max(maxH, h);
      surface.positions.push(x, h, z);
    }
  }
  for (let j = 0; j <= nz; j++) {
    for (let i = 0; i <= nx; i++) {
      const h = hs[j * (nx + 1) + i];
      if (i < nx) maxSlope = Math.max(maxSlope, Math.abs(hs[j * (nx + 1) + i + 1] - h) / (spec.w / nx));
      if (j < nz) maxSlope = Math.max(maxSlope, Math.abs(hs[(j + 1) * (nx + 1) + i] - h) / (spec.d / nz));
    }
  }
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
      surface.indices.push(a, c, b, b, c, d); // normais para +y
    }
  }
  // coping nos bowls
  const coping = emptyMesh();
  for (const b of BOWLS) {
    const pts: V3[] = [];
    const arc = (cx: number, cz: number, a0: number) => { for (let k = 0; k <= 8; k++) { const a = a0 + (k / 8) * (Math.PI / 2); pts.push([cx + Math.cos(a) * b.cr, 0.04, cz + Math.sin(a) * b.cr]); } };
    arc(b.cx + b.hx - b.cr, b.cz + b.hz - b.cr, 0);
    arc(b.cx - b.hx + b.cr, b.cz + b.hz - b.cr, Math.PI / 2);
    arc(b.cx - b.hx + b.cr, b.cz - b.hz + b.cr, Math.PI);
    arc(b.cx + b.hx - b.cr, b.cz - b.hz + b.cr, (3 * Math.PI) / 2);
    pts.push(pts[0]);
    appendMesh(coping, sweepTube(pts, () => 0.05, 6, false));
  }
  // corrimão (flat rail) sobre montantes
  const rails = emptyMesh();
  const y = 0.55;
  appendMesh(rails, sweepTube([[-3, y, 13], [9, y, 13]], () => 0.035, 8));
  for (let x = -3; x <= 9.01; x += 2.4) appendMesh(rails, boxMesh(x, y / 2, 13, 0.06, y, 0.06));
  return { surface, coping, rails, minH, maxH, maxSlope };
}
