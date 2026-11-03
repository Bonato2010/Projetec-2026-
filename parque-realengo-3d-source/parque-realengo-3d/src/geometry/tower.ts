import { V3, clamp, lerp, dist3 } from './vec';
import { mulberry32 } from './rng';
import { catmullRom } from './curves';
import { sweepTube } from './sweep';
import { MeshData, emptyMesh, appendMesh, annulusPrism, cylinderMesh, boxMesh } from './mesh';

export interface TowerParams {
  id: string;
  height: number;        // m (altura divulgada; correspondência torre↔altura ainda a confirmar)
  baseRadius: number;    // raio do círculo de apoio das pernas, m
  legs: number;          // nº de pilares inclinados
  twist: number;         // torção dos pilares (rad ao longo da altura)
  waist: number;         // fator de estreitamento (0.4–0.8)
  seed: number;
  platforms: number[];   // alturas (m) das plataformas de ligação com passarelas
  nozzles: number;       // nº de pulverizadores atribuídos a esta torre
  gates?: number[];      // ângulos (rad) onde o guarda-corpo da plataforma é interrompido
}
export interface Branch { id: string; parent: string | null; level: 0 | 1 | 2 | 3; pts: V3[]; r0: number; r1: number }
export interface Platform { y: number; radius: number }
export interface TowerModel {
  params: TowerParams;
  branches: Branch[];
  braces: { a: V3; b: V3; r: number }[];
  platforms: Platform[];
  nozzles: V3[];
  mesh: MeshData;
  maxY: number;
}

const pol = (rad: number, ang: number, y: number): V3 => [Math.cos(ang) * rad, y, Math.sin(ang) * rad];
const nearestIdxByY = (pts: V3[], y: number): number => {
  let best = 0;
  for (let i = 1; i < pts.length; i++) if (Math.abs(pts[i][1] - y) < Math.abs(pts[best][1] - y)) best = i;
  return best;
};

/**
 * Torre metálica ramificada, em coordenadas locais (centro em x=z=0, base em y=0).
 * Estrutura: pilares inclinados em torção → nó superior → ramos secundários em arco →
 * ramos terciários, mastro central, escoras em X e anéis horizontais.
 * Todo ramo-filho começa EXATAMENTE em um vértice do ramo-pai (sem tubos soltos).
 * A forma é paramétrica e provisória: será refinada com plantas e fotos.
 */
export function buildTower(p: TowerParams): TowerModel {
  const rnd = mulberry32(p.seed);
  const H = p.height, R = p.baseRadius, n = p.legs;
  const lr = clamp(0.0115 * H, 0.17, 0.55);
  const branches: Branch[] = [];
  const braces: TowerModel['braces'] = [];
  const legs: Branch[] = [];

  // 1) pilares inclinados
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (rnd() - 0.5) * 0.22;
    const rf = [1, lerp(1, p.waist, 0.55), p.waist, p.waist * 0.55];
    const yf = [0, 0.18, 0.42, 0.62];
    const af = [0, 0.25, 0.65, 1.0];
    const ctrl = rf.map((r, k) => pol(R * r, a + p.twist * af[k], H * yf[k]));
    const leg: Branch = { id: `${p.id}/leg${i}`, parent: null, level: 0, pts: catmullRom(ctrl, 10), r0: lr, r1: lr * 0.62 };
    legs.push(leg); branches.push(leg);
  }

  // 2) ramos secundários a partir do topo de cada pilar
  const secondaries: Branch[] = [];
  const k2 = H > 30 ? 3 : 2;
  for (const leg of legs) {
    const J = leg.pts[leg.pts.length - 1];
    const az0 = Math.atan2(J[2], J[0]);
    for (let s = 0; s < k2; s++) {
      const az = az0 + (s - (k2 - 1) / 2) * 0.75 + (rnd() - 0.5) * 0.25;
      const th = ((48 + rnd() * 22) * Math.PI) / 180;
      const rise = Math.min(((H * 0.96 - J[1]) / Math.sin(th)) * (0.65 + rnd() * 0.3) * Math.sin(th), H * 0.96 - J[1]);
      const reach = (rise / Math.tan(th)) * 1.15;
      const dx = Math.cos(az), dz = Math.sin(az);
      const ctrl: V3[] = [
        J,
        [J[0] + dx * reach * 0.3, J[1] + rise * 0.55, J[2] + dz * reach * 0.3],
        [J[0] + dx * reach * 0.7, J[1] + rise * 0.9, J[2] + dz * reach * 0.7],
        [J[0] + dx * reach, J[1] + rise, J[2] + dz * reach],
      ];
      const b: Branch = { id: `${leg.id}/s${s}`, parent: leg.id, level: 1, pts: catmullRom(ctrl, 8), r0: lr * 0.62, r1: lr * 0.3 };
      b.pts[0] = [J[0], J[1], J[2]]; // vértice idêntico ao do pai
      secondaries.push(b); branches.push(b);
    }
  }

  // 3) ramos terciários (a partir de um vértice do secundário)
  for (const sec of secondaries) {
    const idx = Math.floor(sec.pts.length * 0.55);
    const S = sec.pts[idx];
    const az0 = Math.atan2(sec.pts[sec.pts.length - 1][2] - sec.pts[0][2], sec.pts[sec.pts.length - 1][0] - sec.pts[0][0]);
    for (let t = 0; t < 2; t++) {
      const az = az0 + (t === 0 ? -0.6 : 0.6);
      const th = ((55 + rnd() * 20) * Math.PI) / 180;
      const L = H * (0.12 + rnd() * 0.08);
      const rise = Math.min(L * Math.sin(th), H * 0.985 - S[1]);
      const reach = L * Math.cos(th);
      const dx = Math.cos(az), dz = Math.sin(az);
      const ctrl: V3[] = [S, [S[0] + dx * reach * 0.35, S[1] + rise * 0.6, S[2] + dz * reach * 0.35], [S[0] + dx * reach, S[1] + rise, S[2] + dz * reach]];
      const b: Branch = { id: `${sec.id}/t${t}`, parent: sec.id, level: 2, pts: catmullRom(ctrl, 6), r0: lr * 0.3, r1: lr * 0.14 };
      b.pts[0] = [S[0], S[1], S[2]];
      branches.push(b);
    }
  }

  // 4) mastro central (ponto mais alto = H) + espigões ligando os pilares ao mastro
  const sway = H * 0.01;
  const mast: Branch = {
    id: `${p.id}/mast`, parent: null, level: 3, r0: lr * 0.8, r1: lr * 0.25,
    pts: catmullRom([[0, 0.5 * H, 0], [sway, 0.75 * H, -sway], [0, H, 0]], 12),
  };
  mast.pts[mast.pts.length - 1] = [0, H, 0];
  branches.push(mast);
  for (const leg of legs) {
    const J = leg.pts[leg.pts.length - 1];
    const k = nearestIdxByY(mast.pts, J[1]);
    branches.push({ id: `${leg.id}/spoke`, parent: leg.id, level: 3, pts: [[J[0], J[1], J[2]], [mast.pts[k][0], mast.pts[k][1], mast.pts[k][2]]], r0: lr * 0.4, r1: lr * 0.4 });
    const m0 = nearestIdxByY(leg.pts, 0.5 * H);
    branches.push({ id: `${leg.id}/support`, parent: leg.id, level: 3, pts: [[leg.pts[m0][0], leg.pts[m0][1], leg.pts[m0][2]], [mast.pts[0][0], mast.pts[0][1], mast.pts[0][2]]], r0: lr * 0.4, r1: lr * 0.4 });
  }

  // 5) escoras em X e anéis horizontais entre pilares vizinhos (pontos sempre sobre os pilares)
  const lv = [4, 9, 14, 19, 24];
  for (let i = 0; i < n; i++) {
    const A = legs[i].pts, B = legs[(i + 1) % n].pts;
    for (let k = 0; k < lv.length; k++) {
      braces.push({ a: A[lv[k]], b: B[lv[k]], r: lr * 0.28 });
      if (k < lv.length - 1) {
        braces.push({ a: A[lv[k]], b: B[lv[k + 1]], r: lr * 0.22 });
        braces.push({ a: B[lv[k]], b: A[lv[k + 1]], r: lr * 0.22 });
      }
    }
  }

  // 6) plataformas (anel de piso + guarda-corpo com aberturas nas ligações das passarelas)
  const platforms: Platform[] = p.platforms.map((y) => {
    let rmax = 0;
    for (const leg of legs) { const q = leg.pts[nearestIdxByY(leg.pts, y)]; rmax = Math.max(rmax, Math.hypot(q[0], q[2])); }
    return { y, radius: rmax + 1.1 };
  });

  // 7) pulverizadores: pontos distribuídos ao longo dos ramos secundários/terciários
  const cand: V3[] = [];
  for (const b of branches) if (b.level === 1 || b.level === 2) for (let i = 2; i < b.pts.length; i++) cand.push([b.pts[i][0], b.pts[i][1] - 0.06, b.pts[i][2]]);
  const nozzles: V3[] = [];
  for (let i = 0; i < Math.min(p.nozzles, cand.length); i++) nozzles.push(cand[Math.floor((i * cand.length) / p.nozzles)]);

  // malha
  const mesh = emptyMesh();
  for (const b of branches) {
    const radial = b.level <= 1 ? 8 : b.level === 3 && b.pts.length > 2 ? 8 : 6;
    appendMesh(mesh, sweepTube(b.pts, (t) => lerp(b.r0, b.r1, t), radial));
  }
  for (const br of braces) appendMesh(mesh, sweepTube([br.a, br.b], () => br.r, 5));
  for (const leg of legs) appendMesh(mesh, cylinderMesh(leg.pts[0][0], leg.pts[0][2], lr * 2.4, 0, 0.5, 10));
  for (const pl of platforms) {
    appendMesh(mesh, annulusPrism(0, 0, 0, pl.radius, pl.y - 0.28, pl.y, 40));
    const gates = p.gates ?? [];
    const step = (Math.PI * 2) / 120;
    let run: V3[] = [];
    const flush = () => { if (run.length > 1) appendMesh(mesh, sweepTube(run, () => 0.04, 5)); run = []; };
    for (let i = 0; i <= 120; i++) {
      const a = i * step;
      const inGate = gates.some((g) => Math.abs(Math.atan2(Math.sin(a - g), Math.cos(a - g))) < Math.min(0.5, 2.2 / pl.radius));
      if (inGate) flush(); else run.push(pol(pl.radius - 0.12, a, pl.y + 1.05));
      if (i % 5 === 0 && !inGate) appendMesh(mesh, boxMesh(Math.cos(a) * (pl.radius - 0.12), pl.y + 0.52, Math.sin(a) * (pl.radius - 0.12), 0.05, 1.05, 0.05));
    }
    flush();
  }
  for (let i = 1; i < mesh.positions.length; i += 3) if (mesh.positions[i] < 0) mesh.positions[i] = 0; // base enterrada no sapata
  let maxY = 0;
  for (const b of branches) for (const q of b.pts) maxY = Math.max(maxY, q[1] + b.r1);
  void dist3;
  return { params: p, branches, braces, platforms, nozzles, mesh, maxY };
}
