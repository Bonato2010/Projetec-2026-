import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WATER_POLY } from '../data/parkStructures';
import { pointInPoly, distPointPolyBoundary, offsetPolygon } from '../geometry/poly';
import { mulberry32 } from '../geometry/rng';
import { extrudePolygon, polygonGeometry } from './geo';
import { getMaterials } from './materials';
import { matrixAt } from './helpers';

/** Área aquática: bordas, lâmina d'água rasa com reflexo e jatos. Profundidade e limites são provisórios. */
export const ParkWater = memo(function ParkWater({ animate }: { animate: boolean }) {
  const M = getMaterials();
  const data = useMemo(() => {
    const curb = extrudePolygon(offsetPolygon(WATER_POLY, 0.5), 0, 0.28, [WATER_POLY]);
    const surface = polygonGeometry(WATER_POLY, 0.16);
    const r = mulberry32(99), jets: { x: number; z: number; h: number; ph: number }[] = [];
    for (let x = -50; x <= 50; x += 9) for (let z = 8; z <= 52; z += 9) {
      const p: [number, number] = [x + (r() - 0.5) * 3, z + (r() - 0.5) * 3];
      if (pointInPoly(p, WATER_POLY) && distPointPolyBoundary(p, WATER_POLY) > 3) jets.push({ x: p[0], z: p[1], h: 1.4 + r() * 2.2, ph: r() * 6.28 });
    }
    const jetGeo = new THREE.CylinderGeometry(0.05, 0.14, 1, 6); jetGeo.translate(0, 0.5, 0);
    const nozzleGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 8);
    return { curb, surface, jets, jetGeo, nozzleGeo };
  }, []);
  const jets = useRef<THREE.InstancedMesh>(null!);
  useFrame(({ clock }) => {
    const m = jets.current; if (!m) return;
    data.jets.forEach((j, i) => {
      const s = animate ? 0.55 + 0.45 * Math.sin(clock.elapsedTime * 1.6 + j.ph) : 0.8;
      m.setMatrixAt(i, matrixAt(j.x, 0.16, j.z, 0, 1, j.h * s, 1));
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      <mesh geometry={data.curb} material={M.concrete} castShadow receiveShadow />
      <mesh geometry={data.surface} material={M.water} receiveShadow />
      <instancedMesh ref={jets} args={[data.jetGeo, M.jet, data.jets.length]} frustumCulled={false} />
      {data.jets.map((j, i) => <mesh key={i} geometry={data.nozzleGeo} material={M.metalDark} position={[j.x, 0.17, j.z]} />)}
    </group>
  );
});
