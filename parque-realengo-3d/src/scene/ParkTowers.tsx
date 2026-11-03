import { memo, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getParkModel } from '../systems/parkModel';
import { mulberry32 } from '../geometry/rng';
import type { V3 } from '../geometry/vec';
import { emptyMesh, appendMesh, icosphere } from '../geometry/mesh';
import { toGeometry } from './geo';
import { getMaterials } from './materials';
import { Instances, matrixAt } from './helpers';

/** Nebulização: névoa densa e atomizada ao redor das super-torres bioclimáticas. */
function Mist({ nozzles, active }: { nozzles: V3[]; active: boolean }) {
  const M = getMaterials();
  const per = 5; // Aumentado para 5 partículas por bico para efeito visual mais denso
  const { geo, phase, dir } = useMemo(() => {
    const n = nozzles.length * per, r = mulberry32(nozzles.length * 13 + 7);
    const phase = new Float32Array(n), dir = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, k = 0.5 + r() * 1.1;
      phase[i] = r();
      dir[2 * i] = Math.cos(a) * k;
      dir[2 * i + 1] = Math.sin(a) * k;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    return { geo, phase, dir };
  }, [nozzles]);

  useFrame(({ clock }) => {
    if (!active) return;
    const t = clock.elapsedTime, pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const nz = nozzles[Math.floor(i / per)], u = (t * 0.28 + phase[i]) % 1;
      pos.setXYZ(i, nz[0] + dir[2 * i] * u * 2.2, nz[1] - 0.1 + 0.6 * u - 2.8 * u * u, nz[2] + dir[2 * i + 1] * u * 2.2);
    }
    pos.needsUpdate = true;
  });

  return active ? <points geometry={geo} material={M.mist} frustumCulled={false} /> : null;
}

/** Jardins verticais e trepadeiras tropicais na base das Super-Torres (Ecomimesis / Singapura) */
function createTowerGarden(baseRadius: number, legs: number, height: number): THREE.BufferGeometry {
  const mesh = emptyMesh();
  const rnd = mulberry32(legs * 77 + Math.floor(height));
  const numClusters = 22 + legs * 6;
  const maxHeight = Math.min(height * 0.38, 8.5);

  for (let i = 0; i < numClusters; i++) {
    const y = 0.5 + rnd() * maxHeight;
    const ang = rnd() * Math.PI * 2;
    const r = baseRadius * (0.88 + (1 - y / height) * 0.24);
    const sz = 0.45 + rnd() * 0.55;
    const cx = Math.cos(ang) * (r + (rnd() - 0.5) * 0.25);
    const cz = Math.sin(ang) * (r + (rnd() - 0.5) * 0.25);

    const lump = icosphere(1);
    for (let k = 0; k < lump.positions.length; k += 3) {
      lump.positions[k] = cx + lump.positions[k] * sz;
      lump.positions[k + 1] = y + lump.positions[k + 1] * sz * 0.85;
      lump.positions[k + 2] = cz + lump.positions[k + 2] * sz;
    }
    lump.colors = [];
    const tintG = 0.26 + rnd() * 0.20;
    for (let k = 0; k < lump.positions.length / 3; k++) {
      lump.colors.push(0.14, tintG, 0.16);
    }
    appendMesh(mesh, lump);
  }

  return toGeometry(mesh);
}

/** As cinco super-torres com treliça metálica, jardins verticais e bicos aspersores. */
export const ParkTowers = memo(function ParkTowers({ mist }: { mist: boolean }) {
  const M = getMaterials();
  const items = useMemo(() => {
    const nozzleGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.22, 6);
    return getParkModel().towers.map((t) => {
      const mesh = t.model.mesh, colors: number[] = [];
      for (let i = 0; i < mesh.positions.length; i += 3) {
        const h = Math.sin(mesh.positions[i] * 1.7 + mesh.positions[i + 1] * 0.9 + mesh.positions[i + 2] * 1.3) * 43758.5;
        const k = 0.86 + 0.14 * (h - Math.floor(h)) - Math.max(0, 1 - mesh.positions[i + 1] / 4) * 0.12;
        colors.push(k, k, k);
      }
      const gardenGeo = createTowerGarden(t.spec.baseRadius, t.spec.legs, t.spec.height);
      return {
        id: t.spec.id,
        x: t.spec.x,
        z: t.spec.z,
        geo: toGeometry({ ...mesh, colors }),
        gardenGeo,
        nozzles: t.model.nozzles,
        nozzleMatrices: t.model.nozzles.map((p) => matrixAt(p[0], p[1], p[2])),
        nozzleGeo,
      };
    });
  }, []);

  return (
    <group>
      {items.map((t) => (
        <group key={t.id} position={[t.x, 0, t.z]}>
          <mesh geometry={t.geo} material={M.towerCopper} castShadow receiveShadow />
          <mesh geometry={t.gardenGeo} material={M.foliage} castShadow receiveShadow />
          <Instances geometry={t.nozzleGeo} material={M.metalDark} matrices={t.nozzleMatrices} cast={false} />
          <Mist nozzles={t.nozzles} active={mist} />
        </group>
      ))}
    </group>
  );
});
