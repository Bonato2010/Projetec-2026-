import { V3, clamp, smoothstep } from './vec';
import { MeshData, emptyMesh, appendMesh, boxMesh } from './mesh';
import { sweepTube } from './sweep';

/**
 * Pista de skate profissional do Parque Realengo Susana Naspolini (Skatepark Bowls & Street).
 * Modelado como campo de alturas contínuo de alta precisão geométrica:
 *  - 2 Bowls interligados com transições em raio circular perfeito (transition radius) e copings metálicos de alta resistência;
 *  - Quarter-pipe principal ao norte com plataforma elevada e transição suave (radius 2.4m);
 *  - Bank inclinado leste com transição em hip;
 *  - Funbox central com mesas, chanfros a 45° e caixas de manual (ledges);
 *  - Corrimãos tubulares (flat rails e down rails) sobre montantes de aço maciço;
 *  - Copings em tubo de aço galvanizado 2" em todo o perímetro das bordas dos bowls;
 *  - Áreas de circulação em concreto polido usinado de alto desempenho.
 */
export interface SkateSpec { w: number; d: number; cell: number }

const sdfRoundRect = (x: number, z: number, cx: number, cz: number, hx: number, hz: number, r: number): number => {
  const qx = Math.abs(x - cx) - (hx - r), qz = Math.abs(z - cz) - (hz - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - r;
};

/** Perfil de transição circular profissional: raio r, ângulo máximo th. */
const arcProfile = (s: number, r: number, th: number): { depth: number; total: number } => {
  const run = r * Math.sin(th), D = r * (1 - Math.cos(th));
  if (s <= 0) return { depth: 0, total: D };
  if (s >= run) return { depth: D, total: D };
  const u = run - s;
  return { depth: D - r * (1 - Math.cos(Math.asin(Math.min(1, Math.max(0, u / r))))), total: D };
};

const TH = (75 * Math.PI) / 180;
const BOWLS = [
  { cx: -11, cz: 1, hx: 11.5, hz: 8.5, cr: 5.5, r: 2.5, th: TH },
  { cx: 12, cz: 5, hx: 7.5, hz: 6.0, cr: 3.8, r: 2.0, th: (72 * Math.PI) / 180 },
];
const FUNBOX = { cx: 7, cz: -7, hx: 5.5, hz: 4.2, h: 0.60 };
const LEDGE_MAIN = { cx: -14, cz: 12, hx: 7.5, hz: 1.4, h: 0.45 };
const LEDGE_STREET = { cx: 12, cz: -11, hx: 6.0, hz: 1.2, h: 0.40 };

export function skateHeight(x: number, z: number): number {
  let h = 0;

  // 1. Bowls (escavações com transição suave em arco)
  for (const b of BOWLS) {
    const s = -sdfRoundRect(x, z, b.cx, b.cz, b.hx, b.hz, b.cr);
    h -= arcProfile(s, b.r, b.th).depth;
  }

  // 2. Quarter-pipe norte com plataforma
  {
    const r = 2.5, run = r * Math.sin(TH), D = r * (1 - Math.cos(TH));
    const u = -8.5 - z;
    const prof = u <= 0 ? 0 : u >= run ? D : r * (1 - Math.cos(Math.asin(Math.min(1, u / r))));
    h += prof * smoothstep(-25, -22, x) * (1 - smoothstep(-2, 0, x)) * smoothstep(-17.5, -15.5, z);
  }

  // 3. Bank leste (rampa inclinada com transição lateral)
  {
    const bankDist = x - 17;
    if (bankDist > 0 && bankDist < 6) {
      const t = bankDist / 6;
      h += 1.2 * (3 * t * t - 2 * t * t * t) * smoothstep(-14, -11, z) * (1 - smoothstep(10, 13, z));
    } else if (bankDist >= 6) {
      h += 1.2 * smoothstep(-14, -11, z) * (1 - smoothstep(10, 13, z));
    }
  }

  // 4. Funbox central com chanfros de 45°
  h += clamp(-sdfRoundRect(x, z, FUNBOX.cx, FUNBOX.cz, FUNBOX.hx, FUNBOX.hz, 0.5), 0, FUNBOX.h);

  // 5. Ledge Principal (Manual Pad)
  h += clamp(-sdfRoundRect(x, z, LEDGE_MAIN.cx, LEDGE_MAIN.cz, LEDGE_MAIN.hx, LEDGE_MAIN.hz, 0.35) * 0.95, 0, LEDGE_MAIN.h);

  // 6. Ledge Street Secundário
  h += clamp(-sdfRoundRect(x, z, LEDGE_STREET.cx, LEDGE_STREET.cz, LEDGE_STREET.hx, LEDGE_STREET.hz, 0.3) * 0.9, 0, LEDGE_STREET.h);

  // 7. Mini spine / pirâmide de ligação
  {
    const spine = -sdfRoundRect(x, z, -2, -6, 3.5, 3.5, 0.4);
    if (spine > 0) {
      h += Math.min(0.55, spine * 0.35);
    }
  }

  return h;
}

export interface SkateMesh {
  surface: MeshData;
  coping: MeshData;
  rails: MeshData;
  minH: number;
  maxH: number;
  maxSlope: number;
}

export function buildSkatepark(spec: SkateSpec): SkateMesh {
  const nx = Math.round(spec.w / spec.cell), nz = Math.round(spec.d / spec.cell);
  const surface = emptyMesh();
  let minH = Infinity, maxH = -Infinity, maxSlope = 0;
  const hs: number[] = [];

  for (let j = 0; j <= nz; j++) {
    for (let i = 0; i <= nx; i++) {
      const x = -spec.w / 2 + (i / nx) * spec.w;
      const z = -spec.d / 2 + (j / nz) * spec.d;
      const h = skateHeight(x, z);
      hs.push(h);
      minH = Math.min(minH, h);
      maxH = Math.max(maxH, h);
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
      const a = j * (nx + 1) + i;
      const b = a + 1;
      const c = a + nx + 1;
      const d = c + 1;
      surface.indices.push(a, c, b, b, c, d);
    }
  }

  // Coping metálico robusto em todos os bowls
  const coping = emptyMesh();
  for (const b of BOWLS) {
    const pts: V3[] = [];
    const arc = (cx: number, cz: number, a0: number) => {
      for (let k = 0; k <= 10; k++) {
        const a = a0 + (k / 10) * (Math.PI / 2);
        pts.push([cx + Math.cos(a) * b.cr, 0.05, cz + Math.sin(a) * b.cr]);
      }
    };
    arc(b.cx + b.hx - b.cr, b.cz + b.hz - b.cr, 0);
    arc(b.cx - b.hx + b.cr, b.cz + b.hz - b.cr, Math.PI / 2);
    arc(b.cx - b.hx + b.cr, b.cz - b.hz + b.cr, Math.PI);
    arc(b.cx + b.hx - b.cr, b.cz - b.hz + b.cr, (3 * Math.PI) / 2);
    pts.push(pts[0]);
    appendMesh(coping, sweepTube(pts, () => 0.06, 8, false));
  }

  // Coping / Borda superior do quarter-pipe norte
  {
    const qpts: V3[] = [
      [-14, 0.05, -8.7],
      [14, 0.05, -8.7]
    ];
    appendMesh(coping, sweepTube(qpts, () => 0.055, 8, false));
  }

  // Corrimãos e obstáculos de street (Flat rails, down rails e ledges metálicos)
  const rails = emptyMesh();

  // 1. Flat rail principal (com montantes de aço)
  const railY = 0.58;
  appendMesh(rails, sweepTube([[-4, railY, 12], [8, railY, 12]], () => 0.038, 8));
  for (let x = -3.5; x <= 7.50; x += 2.5) {
    appendMesh(rails, boxMesh(x, railY / 2, 12, 0.06, railY, 0.06));
  }

  // 2. Rail inclinado no funbox (down rail)
  appendMesh(rails, sweepTube([[3, 0.62, -7], [8.5, 0.12, -4]], () => 0.035, 8));
  appendMesh(rails, boxMesh(5.5, 0.25, -5.5, 0.06, 0.5, 0.06));

  // 3. Ledge metal angle iron nas bordas das caixas
  appendMesh(rails, boxMesh(LEDGE_MAIN.cx, LEDGE_MAIN.h + 0.02, LEDGE_MAIN.cz, LEDGE_MAIN.hx * 2, 0.04, 0.25));
  appendMesh(rails, boxMesh(LEDGE_STREET.cx, LEDGE_STREET.h + 0.02, LEDGE_STREET.cz, LEDGE_STREET.hx * 2, 0.04, 0.25));

  return { surface, coping, rails, minH, maxH, maxSlope };
}
