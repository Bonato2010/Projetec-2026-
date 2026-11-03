import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { SHELTERS, AMPHI, MULTIUSE, SUPPORT_BUILDINGS, FOOTPRINTS } from '../data/parkStructures';
import { PATH_NODES, PATH_EDGES } from '../data/parkPaths';
import { pointInPoly } from '../geometry/poly';
import type { V2 } from '../geometry/vec';
import { extrudePolygon } from './geo';
import { getMaterials } from './materials';
import { Box, Cyl, Instances, matrixAt } from './helpers';

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

/** Churrasqueiras, anfiteatro, espaço multiuso, edificações de apoio, postes de iluminação, bancos e lixeiras. */
export const ParkSocial = memo(function ParkSocial() {
  const M = getMaterials();
  const street = useMemo(() => {
    const nodes = new Map(PATH_NODES.map((n) => [n.id, n.pos]));
    const lamps: THREE.Matrix4[] = [], heads: THREE.Matrix4[] = [], benches: THREE.Matrix4[] = [], bins: THREE.Matrix4[] = [];
    const blocked = (p: V2) => FOOTPRINTS.some((f) => f.kind !== 'water' && pointInPoly(p, f.poly));
    let acc = 0;

    for (const [a, b] of PATH_EDGES) {
      const A = nodes.get(a)!, B = nodes.get(b)!;
      if (!A || !B) continue;
      const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
      const ux = (B[0] - A[0]) / len, uz = (B[1] - A[1]) / len;
      for (let t = 6; t < len - 4; t += 26) {
        const p: V2 = [A[0] + ux * t - uz * 2.8, A[1] + uz * t + ux * 2.8];
        if (blocked(p)) continue;
        lamps.push(matrixAt(p[0], 2.75, p[1]));
        heads.push(matrixAt(p[0], 5.55, p[1], 0, 1, 1, 1));
        if (++acc % 2 === 0) {
          benches.push(matrixAt(A[0] + ux * (t + 8) + uz * 2.5, 0.45, A[1] + uz * (t + 8) - ux * 2.5, -Math.atan2(uz, ux), 1.8, 0.08, 0.48));
          bins.push(matrixAt(A[0] + ux * (t + 11) + uz * 2.5, 0.38, A[1] + uz * (t + 11) - ux * 2.5, 0, 0.35, 0.75, 0.35));
        }
      }
    }
    return {
      lamps,
      heads,
      benches,
      bins,
      pole: new THREE.CylinderGeometry(0.07, 0.09, 5.5, 8),
      head: new THREE.BoxGeometry(0.9, 0.18, 0.35),
      bench: new THREE.BoxGeometry(1, 1, 1),
      bin: new THREE.CylinderGeometry(0.18, 0.16, 0.75, 8),
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

      {/* Mobiliário urbano instanciado */}
      <Instances geometry={street.pole} material={M.metalDark} matrices={street.lamps} />
      <Instances geometry={street.head} material={M.lampHead} matrices={street.heads} cast={false} />
      <Instances geometry={street.bench} material={M.wood} matrices={street.benches} />
      <Instances geometry={street.bin} material={M.metalDark} matrices={street.bins} />
    </group>
  );
});
