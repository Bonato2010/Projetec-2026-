import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { SHELTERS, AMPHI, MULTIUSE, SUPPORT_BUILDINGS, FOOTPRINTS } from '../data/parkStructures';
import { PATH_NODES, PATH_EDGES } from '../data/parkPaths';
import { pointInPoly } from '../geometry/poly';
import type { V2 } from '../geometry/vec';
import { extrudePolygon, toGeometry } from './geo';
import { getMaterials } from './materials';
import { Box, Cyl, Instances, matrixAt } from './helpers';
import { emptyMesh, appendMesh, boxMesh, cylinderMesh } from '../geometry/mesh';

function Shelter({ x, z, w, d }: { x: number; z: number; w: number; d: number }) {
  const M = getMaterials();
  return (
    <group position={[x, 0, z]}>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => (
        <Cyl
          key={i}
          a={[a * (w / 2 - 0.4), 0, b * (d / 2 - 0.4)]}
          b={[a * (w / 2 - 0.4), 3.2, b * (d / 2 - 0.4)]}
          r={0.14}
          material={M.metalDark}
          segments={10}
        />
      ))}
      <mesh position={[0, 3.45, 0]} rotation={[0.06, 0, 0]} castShadow receiveShadow material={M.roof}>
        <boxGeometry args={[w + 0.8, 0.2, d + 0.8]} />
      </mesh>
      {/* Bancada da churrasqueira */}
      <Box p={[w / 2 - 1.2, 0.45, 0]} s={[1.6, 0.9, 0.9]} material={M.wallB} />
      <Box p={[w / 2 - 1.2, 1.2, 0]} s={[0.8, 0.6, 0.6]} material={M.metalDark} />
      {/* Mesa e bancos de madeira */}
      <Box p={[-1, 0.75, 0]} s={[2.2, 0.06, 0.8]} material={M.wood} />
      <Box p={[-1, 0.42, -0.7]} s={[2.2, 0.05, 0.3]} material={M.wood} />
      <Box p={[-1, 0.42, 0.7]} s={[2.2, 0.05, 0.3]} material={M.wood} />
    </group>
  );
}

function Building({ x, z, w, d, h, wall, shops = 0 }: { x: number; z: number; w: number; d: number; h: number; wall: THREE.Material; shops?: number }) {
  const M = getMaterials();
  return (
    <group position={[x, 0, z]}>
      <Box p={[0, h / 2, 0]} s={[w, h, d]} material={wall} />
      <Box p={[0, h + 0.15, 0]} s={[w + 1.2, 0.3, d + 1.2]} material={M.roof} />
      {shops > 0 ? (
        <>
          {Array.from({ length: shops }, (_, i) => {
            const posX = -w / 2 + (w / shops) * (i + 0.5);
            return (
              <group key={i}>
                <Box p={[posX, 1.35, d / 2 + 0.03]} s={[w / shops - 0.4, 2.5, 0.08]} material={M.glass} cast={false} />
                <Box p={[posX, 2.7, d / 2 + 0.3]} s={[w / shops - 0.6, 0.2, 0.4]} material={M.metalDark} />
              </group>
            );
          })}
          {/* Marquise de pedestres ao longo das lojas */}
          <Box p={[0, 3.2, d / 2 + 1.5]} s={[w + 1, 0.2, 2.8]} material={M.paint} />
          {Array.from({ length: Math.ceil(shops / 2) + 1 }, (_, i) => {
            const colX = -w / 2 + (w / Math.ceil(shops / 2)) * i;
            return <Cyl key={i} a={[colX, 0, d / 2 + 2.8]} b={[colX, 3.2, d / 2 + 2.8]} r={0.08} material={M.metalDark} segments={8} />;
          })}
        </>
      ) : (
        <Box p={[0, 1.2, d / 2 + 0.03]} s={[Math.min(2.4, w * 0.4), 2.3, 0.08]} material={M.windowDark} cast={false} />
      )}
    </group>
  );
}

function Amphitheater() {
  const M = getMaterials();
  const geos = useMemo(() => {
    const arc = (r: number, rev = false): V2[] => {
      const pts = Array.from({ length: 25 }, (_, i) => [
        Math.cos((i / 24) * Math.PI) * r,
        Math.sin((i / 24) * Math.PI) * r,
      ] as V2);
      return rev ? pts.reverse() : pts;
    };
    const stage = extrudePolygon([...arc(5.5)], 0, 0.6);
    const steps = Array.from({ length: 6 }, (_, i) => {
      const r0 = 5.8 + i * 1.2, r1 = 5.8 + (i + 1) * 1.2;
      return extrudePolygon([...arc(r1), ...arc(r0, true)], 0, 0.35 * (i + 1) + 0.1);
    });
    return { stage, steps };
  }, []);

  return (
    <group position={[AMPHI.cx, 0, AMPHI.cz]}>
      {/* Concha acústica ao fundo do palco */}
      <mesh position={[0, 2.2, 0]} rotation={[0, 0, 0]} castShadow material={M.wallC}>
        <cylinderGeometry args={[5.6, 5.6, 4.4, 24, 1, true, Math.PI, Math.PI]} />
      </mesh>
      <mesh geometry={geos.stage} material={M.wood} castShadow receiveShadow />
      {geos.steps.map((g, i) => (
        <mesh key={i} geometry={g} material={M.concrete} castShadow receiveShadow />
      ))}
    </group>
  );
}

/** Criação de modelos geométricos realistas de mobiliário urbano */
function createBenchGeometries() {
  const wood = emptyMesh();
  const frame = emptyMesh();
  const slatLen = 1.80;
  const slatW = 0.085;
  const slatH = 0.034;
  const seatZ = [-0.14, -0.04, 0.06, 0.16];
  for (const z of seatZ) {
    appendMesh(wood, boxMesh(0, 0.44, z, slatLen, slatH, slatW));
  }
  appendMesh(wood, boxMesh(0, 0.58, -0.19, slatLen, 0.075, slatH, 0.12));
  appendMesh(wood, boxMesh(0, 0.69, -0.21, slatLen, 0.075, slatH, 0.12));
  appendMesh(wood, boxMesh(0, 0.80, -0.23, slatLen, 0.075, slatH, 0.12));

  for (const x of [-0.72, 0, 0.72]) {
    appendMesh(frame, boxMesh(x, 0.22, 0.14, 0.05, 0.44, 0.05));
    appendMesh(frame, boxMesh(x, 0.22, -0.14, 0.05, 0.44, 0.05));
    appendMesh(frame, boxMesh(x, 0.08, 0, 0.04, 0.04, 0.32));
    appendMesh(frame, boxMesh(x, 0.41, 0.01, 0.05, 0.04, 0.38));
    appendMesh(frame, boxMesh(x, 0.66, -0.19, 0.05, 0.45, 0.05, 0.12));
    if (x !== 0) {
      appendMesh(frame, boxMesh(x, 0.52, 0.04, 0.04, 0.04, 0.32));
      appendMesh(frame, boxMesh(x, 0.48, 0.18, 0.04, 0.10, 0.04));
    }
  }

  return {
    wood: toGeometry(wood, { uv: 'box' }),
    frame: toGeometry(frame, { uv: 'box' }),
  };
}

function createLampGeometries() {
  const pole = emptyMesh();
  const solar = emptyMesh();
  const head = emptyMesh();

  appendMesh(pole, cylinderMesh(0, 0, 0.16, 0, 0.08, 8));
  appendMesh(pole, cylinderMesh(0, 0, 0.11, 0.08, 0.45, 8));
  appendMesh(pole, cylinderMesh(0, 0, 0.08, 0.45, 5.2, 8));
  appendMesh(pole, boxMesh(0, 5.25, 0.40, 0.06, 0.06, 0.85));
  appendMesh(pole, boxMesh(0, 5.40, 0.95, 0.05, 0.05, 0.65, -0.2));

  appendMesh(head, boxMesh(0, 5.35, 1.25, 0.26, 0.12, 0.72));

  appendMesh(pole, boxMesh(0, 5.38, -0.15, 0.04, 0.30, 0.04));
  appendMesh(solar, boxMesh(0, 5.52, -0.22, 0.75, 0.03, 0.52, 0.38));

  return {
    pole: toGeometry(pole, { uv: 'box' }),
    head: toGeometry(head, { uv: 'box' }),
    solar: toGeometry(solar, { uv: 'planar' }),
  };
}

function createBinGeometry() {
  const mesh = emptyMesh();
  appendMesh(mesh, cylinderMesh(0, 0, 0.04, 0, 0.42, 8));
  appendMesh(mesh, boxMesh(0, 0.40, 0, 0.54, 0.04, 0.04));
  for (const x of [-0.18, 0.18]) {
    appendMesh(mesh, cylinderMesh(x, 0, 0.13, 0.25, 0.85, 10));
    appendMesh(mesh, cylinderMesh(x, 0, 0.15, 0.85, 0.90, 10));
    appendMesh(mesh, cylinderMesh(x, 0, 0.08, 0.90, 0.98, 8));
  }
  return toGeometry(mesh, { uv: 'box' });
}

function createBikeRackGeometry() {
  const mesh = emptyMesh();
  const numHoops = 5;
  const spacing = 0.65;
  for (let i = 0; i < numHoops; i++) {
    const z = (i - (numHoops - 1) / 2) * spacing;
    appendMesh(mesh, cylinderMesh(-0.35, z, 0.025, 0, 0.80, 8));
    appendMesh(mesh, cylinderMesh(0.35, z, 0.025, 0, 0.80, 8));
    appendMesh(mesh, boxMesh(0, 0.80, z, 0.72, 0.05, 0.05));
    appendMesh(mesh, boxMesh(0, 0.48, z, 0.72, 0.03, 0.03));
  }
  return toGeometry(mesh, { uv: 'box' });
}

function createFountainGeometries() {
  const concrete = emptyMesh();
  const metal = emptyMesh();
  appendMesh(concrete, boxMesh(0, 0.45, 0, 0.35, 0.90, 0.35));
  appendMesh(concrete, boxMesh(0.32, 0.32, 0, 0.30, 0.65, 0.30));

  appendMesh(metal, cylinderMesh(0, 0, 0.14, 0.90, 0.95, 12));
  appendMesh(metal, cylinderMesh(0.32, 0, 0.12, 0.65, 0.70, 12));
  appendMesh(metal, cylinderMesh(0, 0.08, 0.015, 0.95, 1.04, 6));
  appendMesh(metal, cylinderMesh(0.32, 0.06, 0.015, 0.70, 0.78, 6));

  return {
    concrete: toGeometry(concrete, { uv: 'box' }),
    metal: toGeometry(metal, { uv: 'box' }),
  };
}

function createTotemGeometry() {
  const base = emptyMesh();
  appendMesh(base, boxMesh(0, 0.10, 0, 0.80, 0.20, 0.30));
  appendMesh(base, boxMesh(0, 1.25, 0, 0.68, 2.10, 0.12));
  appendMesh(base, boxMesh(0, 2.20, 0, 0.72, 0.22, 0.14));
  return toGeometry(base, { uv: 'box' });
}

/** Churrasqueiras, anfiteatro, espaço multiuso, edificações de apoio, postes solares de iluminação, bancos e lixeiras. */
export const ParkSocial = memo(function ParkSocial() {
  const M = getMaterials();
  const street = useMemo(() => {
    const nodes = new Map(PATH_NODES.map((n) => [n.id, n.pos]));
    const lamps: THREE.Matrix4[] = [], heads: THREE.Matrix4[] = [], solars: THREE.Matrix4[] = [];
    const benches: THREE.Matrix4[] = [], bins: THREE.Matrix4[] = [];
    const blocked = (p: V2) => FOOTPRINTS.some((f) => f.kind !== 'water' && pointInPoly(p, f.poly));
    let acc = 0;

    for (const [a, b] of PATH_EDGES) {
      const A = nodes.get(a)!, B = nodes.get(b)!;
      if (!A || !B) continue;
      const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
      const ux = (B[0] - A[0]) / len, uz = (B[1] - A[1]) / len;
      for (let t = 6; t < len - 4; t += 24) {
        const p: V2 = [A[0] + ux * t - uz * 2.8, A[1] + uz * t + ux * 2.8];
        if (blocked(p)) continue;
        const rotY = Math.atan2(ux, uz);
        lamps.push(matrixAt(p[0], 0, p[1], rotY));
        heads.push(matrixAt(p[0], 0, p[1], rotY));
        solars.push(matrixAt(p[0], 0, p[1], rotY));

        if (++acc % 2 === 0) {
          const bp: V2 = [A[0] + ux * (t + 8) + uz * 2.5, A[1] + uz * (t + 8) - ux * 2.5];
          if (!blocked(bp)) {
            benches.push(matrixAt(bp[0], 0, bp[1], -Math.atan2(uz, ux)));
          }
          const binP: V2 = [A[0] + ux * (t + 11) + uz * 2.5, A[1] + uz * (t + 11) - ux * 2.5];
          if (!blocked(binP)) {
            bins.push(matrixAt(binP[0], 0, binP[1], -Math.atan2(uz, ux)));
          }
        }
      }
    }

    // Bicicletários estratégicos
    const bikeRacks: THREE.Matrix4[] = [
      matrixAt(12, 0, 222, 0),         // Praça do Mercado
      matrixAt(-14, 0, -26, Math.PI / 2), // Nave do Conhecimento
      matrixAt(72, 0, 24, 0),          // Complexo Esportivo
      matrixAt(-205, 0, -78, Math.PI / 2) // Acesso IFRJ
    ];

    // Bebedouros públicos acessíveis
    const fountains: THREE.Matrix4[] = [
      matrixAt(74, 0, -6, 0),          // Quadras
      matrixAt(44, 0, 98, Math.PI / 2), // Skatepark
      matrixAt(48, 0, 142, 0),         // Playground / Multiuso
      matrixAt(-4, 0, 10, -Math.PI / 2) // Nave do Conhecimento
    ];

    // Totens informativos com mapas de localização
    const totems: THREE.Matrix4[] = [
      matrixAt(40, 0, -180, 0),         // Entrada Norte
      matrixAt(30, 0, 245, Math.PI),    // Entrada Sul
      matrixAt(-210, 0, -78, Math.PI / 2), // Entrada Oeste
      matrixAt(12, 0, -92, 0),          // Praça das Torres
      matrixAt(15, 0, -20, 0.4)         // Espelho d'Água / Passarelas
    ];

    const benchGeos = createBenchGeometries();
    const lampGeos = createLampGeometries();
    const fountainGeos = createFountainGeometries();

    return {
      lamps,
      heads,
      solars,
      benches,
      bins,
      bikeRacks,
      fountains,
      totems,
      benchWood: benchGeos.wood,
      benchFrame: benchGeos.frame,
      lampPole: lampGeos.pole,
      lampHead: lampGeos.head,
      lampSolar: lampGeos.solar,
      bin: createBinGeometry(),
      bikeRack: createBikeRackGeometry(),
      fountainConcrete: fountainGeos.concrete,
      fountainMetal: fountainGeos.metal,
      totem: createTotemGeometry(),
    };
  }, []);

  return (
    <group>
      {SHELTERS.map((s) => (
        <Shelter key={s.id} x={s.cx} z={s.cz} w={s.w} d={s.d} />
      ))}
      <Amphitheater />

      {/* Espaço Multiuso Comunitário */}
      <group position={[MULTIUSE.cx, 0, MULTIUSE.cz]}>
        <Box p={[0, 2.4, 0]} s={[MULTIUSE.w - 1.5, 4.8, MULTIUSE.d - 1.5]} material={M.glass} />
        <Box p={[0, 4.9, 0]} s={[MULTIUSE.w + 1.2, 0.3, MULTIUSE.d + 1.2]} material={M.roof} />
        {[-1, 1].flatMap((a) =>
          [-1, 1].map((b) => (
            <Cyl
              key={`${a}${b}`}
              a={[a * (MULTIUSE.w / 2 - 0.4), 0, b * (MULTIUSE.d / 2 - 0.4)]}
              b={[a * (MULTIUSE.w / 2 - 0.4), 4.8, b * (MULTIUSE.d / 2 - 0.4)]}
              r={0.16}
              material={M.metalDark}
              segments={8}
            />
          ))
        )}
      </group>

      {/* Edificações de Apoio e Mercado */}
      {SUPPORT_BUILDINGS.map((b) => (
        <Building
          key={b.id}
          x={b.cx}
          z={b.cz}
          w={b.w}
          d={b.d}
          h={b.height}
          wall={b.id === 'mercado' ? M.wallA : M.wallB}
          shops={b.id === 'mercado' ? 11 : 0}
        />
      ))}

      {/* Mobiliário urbano detalhado e instanciado */}
      <Instances geometry={street.lampPole} material={M.metalDark} matrices={street.lamps} />
      <Instances geometry={street.lampHead} material={M.lampHead} matrices={street.heads} cast={false} />
      <Instances geometry={street.lampSolar} material={M.solar} matrices={street.solars} />
      <Instances geometry={street.benchWood} material={M.wood} matrices={street.benches} />
      <Instances geometry={street.benchFrame} material={M.metalDark} matrices={street.benches} />
      <Instances geometry={street.bin} material={M.metalDark} matrices={street.bins} />
      <Instances geometry={street.bikeRack} material={M.metal} matrices={street.bikeRacks} />
      <Instances geometry={street.fountainConcrete} material={M.concrete} matrices={street.fountains} />
      <Instances geometry={street.fountainMetal} material={M.metal} matrices={street.fountains} />
      <Instances geometry={street.totem} material={M.wallC} matrices={street.totems} />
    </group>
  );
});
