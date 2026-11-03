import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLAYGROUND, GYM } from '../data/parkStructures';
import { polygonGeometry } from './geo';
import { getMaterials } from './materials';
import { Box, Cyl, matrixAt } from './helpers';

const rectPts = (w: number, d: number): [number, number][] => [
  [-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]
];

function Swing({ x, z }: { x: number; z: number }) {
  const M = getMaterials();
  return (
    <group>
      {[-2.5, 2.5].map((s) => (
        <group key={s}>
          <Cyl a={[x + s, 0, z - 1]} b={[x + s, 2.6, z]} r={0.06} material={M.metalDark} />
          <Cyl a={[x + s, 0, z + 1]} b={[x + s, 2.6, z]} r={0.06} material={M.metalDark} />
        </group>
      ))}
      <Cyl a={[x - 2.5, 2.6, z]} b={[x + 2.5, 2.6, z]} r={0.07} material={M.metalDark} />
      {[-0.9, 0.9].map((s) => (
        <group key={s}>
          <Cyl a={[x + s - 0.22, 2.6, z]} b={[x + s - 0.22, 0.5, z]} r={0.012} material={M.metalDark} segments={4} />
          <Cyl a={[x + s + 0.22, 2.6, z]} b={[x + s + 0.22, 0.5, z]} r={0.012} material={M.metalDark} segments={4} />
          <Box p={[x + s, 0.5, z]} s={[0.5, 0.05, 0.2]} material={M.rubber} />
        </group>
      ))}
    </group>
  );
}

function Slide({ x, z }: { x: number; z: number }) {
  const M = getMaterials();
  const th = Math.atan(1.6 / 3.2);
  return (
    <group>
      <Box p={[x, 1.6, z]} s={[1.4, 0.1, 1.4]} material={M.wood} />
      {[[-0.65, -0.65], [0.65, -0.65], [-0.65, 0.65], [0.65, 0.65]].map(([a, b], i) => (
        <Cyl key={i} a={[x + a, 0, z + b]} b={[x + a, 1.6, z + b]} r={0.05} material={M.metalDark} />
      ))}
      <mesh position={[x, 0.85, z + 2.25]} rotation={[th, 0, 0]} castShadow material={M.metal}>
        <boxGeometry args={[0.6, 0.05, 3.5]} />
      </mesh>
      <mesh position={[x - 0.33, 0.95, z + 2.25]} rotation={[th, 0, 0]} castShadow material={M.metal}>
        <boxGeometry args={[0.05, 0.2, 3.5]} />
      </mesh>
      <mesh position={[x + 0.33, 0.95, z + 2.25]} rotation={[th, 0, 0]} castShadow material={M.metal}>
        <boxGeometry args={[0.05, 0.2, 3.5]} />
      </mesh>
    </group>
  );
}

function Dome({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 0, z]} castShadow>
      <sphereGeometry args={[2.2, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#c45a3a" wireframe />
    </mesh>
  );
}

function SplashPad({ x, z }: { x: number; z: number }) {
  const M = getMaterials();
  const jets = useRef<THREE.InstancedMesh>(null!);
  const jetData = useMemo(() => {
    const list: { dx: number; dz: number; ph: number }[] = [];
    const r = 2.4;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      list.push({ dx: Math.cos(a) * r, dz: Math.sin(a) * r, ph: i * 1.0 });
    }
    list.push({ dx: 0, dz: 0, ph: 0 });
    const jetGeo = new THREE.CylinderGeometry(0.04, 0.12, 1, 6);
    jetGeo.translate(0, 0.5, 0);
    return { list, jetGeo };
  }, []);

  useFrame(({ clock }) => {
    const m = jets.current;
    if (!m) return;
    jetData.list.forEach((j, i) => {
      const s = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 3.0 + j.ph);
      m.setMatrixAt(i, matrixAt(x + j.dx, 0.05, z + j.dz, 0, 1, 1.6 * s, 1));
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh position={[x, 0.035, z]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[3.2, 24]} />
        <meshStandardMaterial color="#3ba5c6" roughness={0.6} />
      </mesh>
      <instancedMesh ref={jets} args={[jetData.jetGeo, M.jet, jetData.list.length]} frustumCulled={false} />
    </group>
  );
}

function PullUp({ x, z, ry = 0 }: { x: number; z: number; ry?: number }) {
  const M = getMaterials();
  const c = Math.cos(ry), s = Math.sin(ry);
  return (
    <group>
      <Cyl a={[x - 1.2 * c, 0, z + 1.2 * s]} b={[x - 1.2 * c, 2.4, z + 1.2 * s]} r={0.06} material={M.metalDark} />
      <Cyl a={[x + 1.2 * c, 0, z - 1.2 * s]} b={[x + 1.2 * c, 2.4, z - 1.2 * s]} r={0.06} material={M.metalDark} />
      <Cyl a={[x - 1.2 * c, 2.3, z + 1.2 * s]} b={[x + 1.2 * c, 2.3, z - 1.2 * s]} r={0.04} material={M.metal} />
      <Cyl a={[x - 1.2 * c, 1.7, z + 1.2 * s]} b={[x + 1.2 * c, 1.7, z - 1.2 * s]} r={0.04} material={M.metal} />
    </group>
  );
}

/** Playground infantil com Splash Pad aquático e Academia da Terceira Idade / Calistenia. */
export const ParkPlayground = memo(function ParkPlayground() {
  const M = getMaterials();
  const g = useMemo(() => ({
    play: polygonGeometry(rectPts(PLAYGROUND.w, PLAYGROUND.d), 0.03),
    gym: polygonGeometry(rectPts(GYM.w, GYM.d), 0.03),
  }), []);

  return (
    <group>
      <group position={[PLAYGROUND.cx, 0, PLAYGROUND.cz]}>
        <mesh geometry={g.play} material={M.rubber} receiveShadow />
        <Swing x={-6} z={-4} />
        <Slide x={6} z={-4} />
        <Dome x={7} z={4} />
        <SplashPad x={-5} z={4} />
        <Box p={[1, 0.15, 4]} s={[2.8, 0.3, 2.8]} material={M.sand} cast={false} />
      </group>

      <group position={[GYM.cx, 0, GYM.cz]}>
        <mesh geometry={g.gym} material={M.rubber} receiveShadow />
        <PullUp x={-5} z={0} />
        <PullUp x={1} z={0} />
        <PullUp x={6} z={0} ry={Math.PI / 2} />
        <Box p={[-2, 0.5, 3]} s={[1.8, 0.1, 0.5]} material={M.metalDark} />
      </group>
    </group>
  );
});
