import { memo } from 'react';
import { Environment, Lightformer, Sky } from '@react-three/drei';
import type { Quality } from '../systems/vegetationPlacement';

const SUN: [number, number, number] = [160, 220, 110];

/** Luz natural profissional: céu atmosférico de altitude, sol tropical com sombras suaves e preenchimento de hemisfério. */
export const ParkLighting = memo(function ParkLighting({ quality }: { quality: Quality }) {
  const size = quality === 'high' ? 4096 : quality === 'medium' ? 2048 : 1024;
  return (
    <>
      <Sky
        sunPosition={SUN}
        turbidity={4.2}
        rayleigh={1.2}
        mieCoefficient={0.004}
        mieDirectionalG={0.82}
      />
      <hemisphereLight args={['#cde2f5', '#827e66', 0.65]} />
      <directionalLight
        position={SUN}
        intensity={2.8}
        color="#fff4e2"
        castShadow
        shadow-mapSize={[size, size]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.4}
        shadow-camera-left={-320}
        shadow-camera-right={320}
        shadow-camera-top={320}
        shadow-camera-bottom={-320}
        shadow-camera-near={10}
        shadow-camera-far={850}
      />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 16, -12]} scale={[28, 12, 1]} color="#dfeaf5" />
        <Lightformer form="rect" intensity={1.4} position={[-20, 8, 10]} rotation-y={Math.PI / 2} scale={[18, 8, 1]} color="#fff5e6" />
        <Lightformer form="rect" intensity={0.9} position={[20, 8, 10]} rotation-y={-Math.PI / 2} scale={[18, 8, 1]} color="#d0e2f2" />
      </Environment>
      <fog attach="fog" args={['#cad8e2', 800, 3200]} />
    </>
  );
});
