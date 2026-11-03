import { memo, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getParkModel } from '../systems/parkModel';
import { mulberry32 } from '../geometry/rng';
import type { V3 } from '../geometry/vec';
import { toGeometry } from './geo';
import { getMaterials } from './materials';
import { Instances, matrixAt } from './helpers';

/** Nebulização: névoa leve e localizada (3 partículas por pulverizador). Não é simulação física. */
function Mist({ nozzles, active }: { nozzles: V3[]; active: boolean }) {
  const M = getMaterials();
  const per = 3;
  const { geo, phase, dir } = useMemo(() => {
    const n = nozzles.length * per, r = mulberry32(nozzles.length * 13 + 7);
    const phase = new Float32Array(n), dir = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, k = 0.4 + r() * 0.8; phase[i] = r(); dir[2 * i] = Math.cos(a) * k; dir[2 * i + 1] = Math.sin(a) * k; }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    return { geo, phase, dir };
  }, [nozzles]);
  useFrame(({ clock }) => {
    if (!active) return;
    const t = clock.elapsedTime, pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const nz = nozzles[Math.floor(i / per)], u = (t * 0.25 + phase[i]) % 1;
      pos.setXYZ(i, nz[0] + dir[2 * i] * u * 1.6, nz[1] - 0.2 + 0.5 * u - 2.4 * u * u, nz[2] + dir[2 * i + 1] * u * 1.6);
    }
    pos.needsUpdate = true;
  });
  return active ? <points geometry={geo} material={M.mist} frustumCulled={false} /> : null;
}

/** As cinco torres, cada uma com geometria própria (ver src/geometry/tower.ts). */
export const ParkTowers = memo(function ParkTowers({ mist }: { mist: boolean }) {
  const M = getMaterials();
  const items = useMemo(() => {
    const nozzleGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.22, 6);
    return getParkModel().towers.map((t) => {
      const mesh = t.model.mesh, colors: number[] = [];
      for (let i = 0; i < mesh.positions.length; i += 3) {
        const h = Math.sin(mesh.positions[i] * 1.7 + mesh.positions[i + 1] * 0.9 + mesh.positions[i + 2] * 1.3) * 43758.5;
        const k = 0.86 + 0.14 * (h - Math.floor(h)) - Math.max(0, 1 - mesh.positions[i + 1] / 4) * 0.12; // variação de tom + base mais escura
        colors.push(k, k, k);
      }
      return { id: t.spec.id, x: t.spec.x, z: t.spec.z, geo: toGeometry({ ...mesh, colors }), nozzles: t.model.nozzles, nozzleMatrices: t.model.nozzles.map((p) => matrixAt(p[0], p[1], p[2])), nozzleGeo };
    });
  }, []);
  return (
    <group>
      {items.map((t) => (
        <group key={t.id} position={[t.x, 0, t.z]}>
          <mesh geometry={t.geo} material={M.metal} castShadow receiveShadow />
          <Instances geometry={t.nozzleGeo} material={M.metalDark} matrices={t.nozzleMatrices} cast={false} />
          <Mist nozzles={t.nozzles} active={mist} />
        </group>
      ))}
    </group>
  );
});
