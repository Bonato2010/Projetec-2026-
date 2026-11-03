import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { V3 } from '../geometry/vec';

/** Cilindro entre dois pontos. */
export function Cyl({ a, b, r, material, segments = 8 }: { a: V3; b: V3; r: number; material: THREE.Material; segments?: number }) {
  const k = `${a}|${b}`;
  const { pos, quat, len } = useMemo(() => {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A);
    const l = d.length();
    return { pos: A.clone().add(B).multiplyScalar(0.5), quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()), len: l };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);
  return (
    <mesh position={pos} quaternion={quat} material={material} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, len, segments]} />
    </mesh>
  );
}

export function Box({ p, s, ry = 0, material, cast = true }: { p: V3; s: V3; ry?: number; material: THREE.Material; cast?: boolean }) {
  return (
    <mesh position={p} rotation={[0, ry, 0]} material={material} castShadow={cast} receiveShadow>
      <boxGeometry args={s} />
    </mesh>
  );
}

/** InstancedMesh simples a partir de matrizes (e cores opcionais). */
export function Instances({ geometry, material, matrices, colors, cast = true }: { geometry: THREE.BufferGeometry; material: THREE.Material; matrices: THREE.Matrix4[]; colors?: THREE.Color[]; cast?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    matrices.forEach((mx, i) => m.setMatrixAt(i, mx));
    if (colors) colors.forEach((c, i) => m.setColorAt(i, c));
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [matrices, colors]);
  if (!matrices.length) return null;
  return <instancedMesh key={matrices.length} ref={ref} args={[geometry, material, matrices.length]} castShadow={cast} receiveShadow frustumCulled={false} />;
}

const _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Euler();
export const matrixAt = (x: number, y: number, z: number, ry = 0, sx = 1, sy = sx, sz = sx): THREE.Matrix4 => {
  _e.set(0, ry, 0); _q.setFromEuler(_e); _p.set(x, y, z); _s.set(sx, sy, sz);
  return new THREE.Matrix4().compose(_p, _q, _s);
};
