import { memo, useMemo } from 'react';
import { PLAYGROUND, GYM } from '../data/parkStructures';
import { polygonGeometry } from './geo';
import { getMaterials } from './materials';
import { Box, Cyl } from './helpers';

const rectPts = (w: number, d: number): [number, number][] => [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]];

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
      {[[-0.65, -0.65], [0.65, -0.65], [-0.65, 0.65], [0.65, 0.65]].map(([a, b], i) => <Cyl key={i} a={[x + a, 0, z + b]} b={[x + a, 1.6, z + b]} r={0.05} material={M.metalDark} />)}
      <mesh position={[x, 0.85, z + 2.25]} rotation={[th, 0, 0]} castShadow material={M.metal}><boxGeometry args={[0.6, 0.05, 3.5]} /></mesh>
      <mesh position={[x - 0.33, 0.95, z + 2.25]} rotation={[th, 0, 0]} castShadow material={M.metal}><boxGeometry args={[0.05, 0.2, 3.5]} /></mesh>
      <mesh position={[x + 0.33, 0.95, z + 2.25]} rotation={[th, 0, 0]} castShadow material={M.metal}><boxGeometry args={[0.05, 0.2, 3.5]} /></mesh>
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

/** Playground e academia ao ar livre — equipamentos GENÉRICOS provisórios (sem fotografia dos brinquedos reais). */
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
        <Swing x={-8} z={-4} /><Slide x={7} z={-7} /><Dome x={8} z={5} />
        <Box p={[-3, 0.15, 5]} s={[3.2, 0.3, 3.2]} material={M.sand} cast={false} />
        <mesh position={[-9, 0.55, 5]} rotation={[0, 0, 0.12]} castShadow material={M.wood}><boxGeometry args={[4, 0.1, 0.35]} /></mesh>
        <Cyl a={[-9, 0, 5]} b={[-9, 0.5, 5]} r={0.1} material={M.metalDark} />
      </group>
      <group position={[GYM.cx, 0, GYM.cz]}>
        <mesh geometry={g.gym} material={M.rubber} receiveShadow />
        <PullUp x={-4} z={-1.5} /><PullUp x={2} z={-1.5} /><PullUp x={-1} z={2} ry={Math.PI / 2} />
        <Box p={[4.5, 0.6, 1.8]} s={[1.6, 0.1, 0.5]} material={M.metalDark} />
      </group>
    </group>
  );
});
