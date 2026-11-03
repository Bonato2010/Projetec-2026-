import { memo } from 'react';
import { Environment, Lightformer, Sky } from '@react-three/drei';
import type { Quality } from '../systems/vegetationPlacement';

const SUN: [number, number, number] = [170, 230, 120];
/** Luz natural: céu procedural, sol com sombras, hemisfério e ambiente procedural para reflexos (sem arquivos HDR externos). */
export const ParkLighting = memo(function ParkLighting({ quality }: { quality: Quality }) {
  const size = quality === 'high' ? 4096 : quality === 'medium' ? 2048 : 1024;
  return (
    <>
      <Sky sunPosition={SUN} turbidity={5} rayleigh={1.1} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <hemisphereLight args={['#bcd3ea', '#7a7a60', 0.55]} />
      <directionalLight
        position={SUN} intensity={2.6} color="#fff1dc" castShadow
        shadow-mapSize={[size, size]} shadow-bias={-0.0004} shadow-normalBias={0.4}
        shadow-camera-left={-300} shadow-camera-right={300} shadow-camera-top={300} shadow-camera-bottom={-300}
        shadow-camera-near={10} shadow-camera-far={800}
      />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 12, -12]} scale={[24, 10, 1]} color="#dfeaf5" />
        <Lightformer form="rect" intensity={1.2} position={[-14, 6, 8]} rotation-y={Math.PI / 2} scale={[16, 8, 1]} color="#fff4e0" />
        <Lightformer form="rect" intensity={0.8} position={[14, 6, 8]} rotation-y={-Math.PI / 2} scale={[16, 8, 1]} color="#cfe0ee" />
      </Environment>
      <fog attach="fog" args={['#cdd8e0', 700, 2600]} />
    </>
  );
});
