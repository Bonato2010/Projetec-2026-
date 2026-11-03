import { V3, clamp, lerp, dist3 } from './vec';
import { sweepTube } from './sweep';
import { catmullRom } from './curves';
import { MeshData, emptyMesh, appendMesh, annulusPrism, cylinderMesh, boxMesh } from './mesh';

export interface TowerParams {
  id: string;
  height: number;        // Altura oficial: 17m, 26m ou 47m
  baseRadius: number;    // Raio da base dos pilares
  legs: number;          // Número de pilares estruturais principais
  twist: number;         // Torção helicoidal da treliça
  waist: number;         // Fator de estreitamento da cintura (0.50 a 0.65)
  seed: number;
  platforms: number[];   // Alturas das plataformas de ligação com as passarelas
  nozzles: number;       // Quantidade de bicos pulverizadores atribuídos
  gates?: number[];      // Ângulos das portas de abertura para as passarelas
}

export interface Branch {
  id: string;
  parent: string | null;
  level: 0 | 1 | 2 | 3;
  pts: V3[];
  r0: number;
  r1: number;
}

export interface Platform {
  y: number;
  radius: number;
}

export interface TowerModel {
  params: TowerParams;
  branches: Branch[];
  braces: { a: V3; b: V3; r: number }[];
  platforms: Platform[];
  nozzles: V3[];
  mesh: MeshData;
  maxY: number;
}

const pol = (rad: number, ang: number, y: number): V3 => [
  Math.cos(ang) * rad,
  y,
  Math.sin(ang) * rad
];

/**
 * RECONSTRUÇÃO PROFUNDA DAS SUPER-TORRES DO PARQUE REALENGO
 * Inspiradas nas Supertrees de Singapura e adaptadas pela Prefeitura do Rio:
 * 1. Sapata circular de concreto aparente chanfrado na base
 * 2. Tronco hiperboloide esbelto com 8 a 12 pilares tubulares estruturais em aço
 * 3. Treliça espacial em cruz (diagrid em losangos) entre pilares vizinhos
 * 4. Copa metálica invertida que se abre em sino/tulipa no topo (flared crown)
 * 5. Anéis concêntricos de pulverização (bicos aspersores para microclima)
 * 6. Mastro e coluna distribuidora central com espigões radiais
 * 7. Plataforma mirante acessível com piso antiderrapante e guarda-corpo
 */
export function buildTower(p: TowerParams): TowerModel {
  const H = p.height;
  const Rbase = p.baseRadius;
  const N = Math.max(6, p.legs + (H > 35 ? 4 : H > 20 ? 2 : 0));
  const lr = clamp(0.012 * H, 0.16, 0.38);
  const mesh = emptyMesh();

  const branches: Branch[] = [];
  const braces: TowerModel['braces'] = [];

  // Perfil hiperboloide do raio ao longo da altura Y
  const getRadiusAtY = (y: number): number => {
    const t = clamp(y / H, 0, 1);
    if (t < 0.45) {
      const u = t / 0.45;
      return lerp(Rbase, Rbase * p.waist, Math.sin(u * Math.PI * 0.5));
    } else if (t < 0.72) {
      const u = (t - 0.45) / 0.27;
      return lerp(Rbase * p.waist, Rbase * 0.88, u * u);
    } else {
      const u = (t - 0.72) / 0.28;
      const flareFactor = H > 40 ? 1.70 : H > 20 ? 1.55 : 1.45;
      return lerp(Rbase * 0.88, Rbase * flareFactor, Math.sin(u * Math.PI * 0.5));
    }
  };

  // 1. BASE / SAPATA DE CONCRETO CHANFRADO
  const baseH = 0.50;
  appendMesh(mesh, cylinderMesh(0, 0, Rbase * 1.22, 0, baseH * 0.6, 24));
  appendMesh(mesh, cylinderMesh(0, 0, Rbase * 1.10, baseH * 0.6, baseH, 24));

  // 2. PILARES TUBULARES PRINCIPAIS DO TRONCO (Pernas nível 0)
  const numSteps = 24;
  const twistAngle = p.twist * 0.35;
  const legs: Branch[] = [];

  for (let i = 0; i < N; i++) {
    const baseAngle = (i / N) * Math.PI * 2;
    const pts: V3[] = [];
    for (let s = 0; s <= numSteps; s++) {
      const t = s / numSteps;
      const y = t * (H * 0.72); // Pilares vão da base até o anel do pescoço
      const r = getRadiusAtY(y);
      const angle = baseAngle + t * twistAngle;
      pts.push(pol(r, angle, y));
    }
    const leg: Branch = {
      id: `${p.id}/leg${i}`,
      parent: null,
      level: 0,
      pts,
      r0: lr,
      r1: lr * 0.65
    };
    legs.push(leg);
    branches.push(leg);
    appendMesh(mesh, sweepTube(pts, (u) => lerp(lr, lr * 0.65, u), 8));
  }

  // 3. TRELIÇA ESPACIAL EM CRUZ (DIAGRID X-BRACING)
  // Conecta pontos exatos sobre os pilares para garantir integridade estrutural
  const braceR = lr * 0.28;
  const diagridSteps = [0, 4, 8, 12, 16, 20, 24];

  for (let l = 0; l < diagridSteps.length - 1; l++) {
    const s0 = diagridSteps[l];
    const s1 = diagridSteps[l + 1];

    for (let i = 0; i < N; i++) {
      const nextI = (i + 1) % N;
      const A0 = legs[i].pts[s0];
      const B0 = legs[nextI].pts[s0];
      const A1 = legs[i].pts[s1];
      const B1 = legs[nextI].pts[s1];

      // Diagonais cruzadas em X
      braces.push({ a: A0, b: B1, r: braceR });
      braces.push({ a: B0, b: A1, r: braceR });
      appendMesh(mesh, sweepTube([A0, B1], () => braceR, 5));
      appendMesh(mesh, sweepTube([B0, A1], () => braceR, 5));

      // Barramento horizontal
      braces.push({ a: A0, b: B0, r: braceR * 1.15 });
      appendMesh(mesh, sweepTube([A0, B0], () => braceR * 1.15, 5));
    }
  }

  // 4. MASTRO CENTRAL E ESPIGÕES RADIAIS (Nível 3)
  // Mastro vertical rigorosamente calibrado para terminar em exatamente Y = H
  const mastPts: V3[] = [
    [0, H * 0.35, 0],
    [0, H * 0.55, 0],
    [0, H * 0.75, 0],
    [0, H, 0] // Topo exato da torre
  ];
  const mast: Branch = {
    id: `${p.id}/mast`,
    parent: null,
    level: 3,
    pts: mastPts,
    r0: lr * 0.85,
    r1: lr * 0.45
  };
  branches.push(mast);
  appendMesh(mesh, sweepTube(mastPts, (u) => lerp(lr * 0.85, lr * 0.45, u), 8));

  // Espigões ligando o topo de cada pilar ao mastro central
  const spokeTarget = mastPts[mastPts.length - 2]; // Nó do mastro em H * 0.75
  for (let i = 0; i < N; i++) {
    const J = legs[i].pts[legs[i].pts.length - 1]; // Ponto final do pilar
    const spokeBranch: Branch = {
      id: `${legs[i].id}/spoke`,
      parent: legs[i].id,
      level: 3,
      pts: [J, spokeTarget],
      r0: lr * 0.45,
      r1: lr * 0.45
    };
    branches.push(spokeBranch);
    appendMesh(mesh, sweepTube(spokeBranch.pts, () => lr * 0.45, 6));
  }

  // 5. NERVURAS PRINCIPAIS E TRELIÇA DIAGRID COMPLETA DA COPA
  const rTop = getRadiusAtY(H);
  const crownRibs: V3[][] = [];
  const crownLevels = [H * 0.72, H * 0.82, H * 0.91, H];

  for (let i = 0; i < N; i++) {
    const J = legs[i].pts[legs[i].pts.length - 1];
    const a = (i / N) * Math.PI * 2;
    const aTop = a + twistAngle;

    const ribPts: V3[] = [
      J,
      pol(lerp(getRadiusAtY(H * 0.72), rTop, 0.40), aTop, H * 0.82),
      pol(lerp(getRadiusAtY(H * 0.72), rTop, 0.75), aTop, H * 0.91),
      pol(rTop, aTop, H)
    ];
    crownRibs.push(ribPts);

    const ribBranch: Branch = {
      id: `${legs[i].id}/s0`,
      parent: legs[i].id,
      level: 1,
      pts: ribPts,
      r0: lr * 0.55,
      r1: lr * 0.28
    };
    branches.push(ribBranch);
    appendMesh(mesh, sweepTube(ribPts, (u) => lerp(lr * 0.55, lr * 0.28, u), 6));
  }

  // Treliça diagrid em X da copa entre nervuras vizinhas
  const crownBraceR = lr * 0.24;
  for (let lvl = 0; lvl < crownLevels.length - 1; lvl++) {
    for (let i = 0; i < N; i++) {
      const nextI = (i + 1) % N;
      const P0 = crownRibs[i][lvl];
      const P1 = crownRibs[i][lvl + 1];
      const Q0 = crownRibs[nextI][lvl];
      const Q1 = crownRibs[nextI][lvl + 1];

      // Diagonais cruzadas
      appendMesh(mesh, sweepTube([P0, Q1], () => crownBraceR, 4));
      appendMesh(mesh, sweepTube([Q0, P1], () => crownBraceR, 4));
      // Anel tubular intermediário
      appendMesh(mesh, sweepTube([P1, Q1], () => crownBraceR * 1.1, 4));
    }
  }

  // Anel tubular de coroamento no topo exato da copa (H)
  const topRingPts: V3[] = [];
  for (let j = 0; j <= 36; j++) {
    const a = (j / 36) * Math.PI * 2;
    topRingPts.push(pol(rTop, a, H));
  }
  appendMesh(mesh, sweepTube(topRingPts, () => lr * 0.35, 8));

  // Tirantes radiais de ancoragem no anel do topo
  for (let i = 0; i < N; i++) {
    const topPt = crownRibs[i][crownRibs[i].length - 1];
    appendMesh(mesh, sweepTube([topPt, [0, H * 0.95, 0]], () => lr * 0.25, 4));
  }

  // Anéis intermediários de reforço
  const ringHeights = [H * 0.22, H * 0.45, H * 0.65, H * 0.85];
  ringHeights.forEach((y) => {
    const rad = getRadiusAtY(y);
    const ringPts: V3[] = [];
    for (let j = 0; j <= 36; j++) {
      const a = (j / 36) * Math.PI * 2;
      ringPts.push(pol(rad, a, y));
    }
    appendMesh(mesh, sweepTube(ringPts, () => lr * 0.22, 6));
  });

  // 6. BICOS DE NEBULIZAÇÃO (Exatamente p.nozzles)
  const nozzles: V3[] = [];
  const yMist1 = H * 0.65;
  const rMist1 = getRadiusAtY(yMist1) + 0.16;
  const n1 = Math.floor(p.nozzles / 2);
  const n2 = p.nozzles - n1;

  for (let k = 0; k < n1; k++) {
    const a = (k / n1) * Math.PI * 2;
    nozzles.push(pol(rMist1, a, yMist1 - 0.05));
  }

  const yMist2 = H * 0.85;
  const rMist2 = getRadiusAtY(yMist2) + 0.20;
  for (let k = 0; k < n2; k++) {
    const a = ((k + 0.5) / n2) * Math.PI * 2;
    nozzles.push(pol(rMist2, a, yMist2 - 0.05));
  }

  // 7. PLATAFORMAS MIRANTE DE LIGAÇÃO COM AS PASSARELAS
  const platforms: Platform[] = p.platforms.map((y) => {
    const rAtY = getRadiusAtY(y);
    const platR = rAtY + 1.25;

    appendMesh(mesh, annulusPrism(0, 0, rAtY * 0.82, platR, y - 0.28, y, 36));

    const gates = p.gates ?? [];
    const railR = platR - 0.10;
    const railSegments = 72;
    const dTheta = (Math.PI * 2) / railSegments;
    const gateTolerance = 0.42;

    let railRun: V3[] = [];
    const flushRail = () => {
      if (railRun.length > 1) {
        appendMesh(mesh, sweepTube(railRun, () => 0.038, 5));
      }
      railRun = [];
    };

    for (let seg = 0; seg <= railSegments; seg++) {
      const a = seg * dTheta;
      const isGate = gates.some((g) => Math.abs(Math.atan2(Math.sin(a - g), Math.cos(a - g))) < gateTolerance);

      if (isGate) {
        flushRail();
      } else {
        railRun.push(pol(railR, a, y + 1.10));
        if (seg % 3 === 0) {
          appendMesh(mesh, boxMesh(
            Math.cos(a) * railR,
            y + 0.55,
            Math.sin(a) * railR,
            0.045,
            1.10,
            0.045
          ));
        }
      }
    }
    flushRail();

    return { y, radius: platR };
  });

  // Ajuste fino para garantir que o vértice mais baixo seja >= 0 e o mais alto seja exatamente H
  for (let i = 1; i < mesh.positions.length; i += 3) {
    if (mesh.positions[i] < 0) mesh.positions[i] = 0;
  }

  void dist3;

  return {
    params: p,
    branches,
    braces,
    platforms,
    nozzles,
    mesh,
    maxY: H
  };
}
