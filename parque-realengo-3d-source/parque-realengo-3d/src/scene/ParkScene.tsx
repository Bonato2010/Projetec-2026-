import { memo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Layers, Quality, ViewReq } from './state';
import type { NavGraph, RouteResult } from '../systems/navigationGraph';
import { ParkTerrain } from './ParkTerrain';
import { ParkTowers } from './ParkTowers';
import { ParkWalkways } from './ParkWalkways';
import { ParkWater } from './ParkWater';
import { ParkSkatepark } from './ParkSkatepark';
import { ParkSports } from './ParkSports';
import { ParkKnowledgeBuilding } from './ParkKnowledgeBuilding';
import { ParkPlayground } from './ParkPlayground';
import { ParkSocial } from './ParkSocial';
import { ParkVegetation } from './ParkVegetation';
import { ParkSurroundings } from './ParkSurroundings';
import { ParkExpansion } from './ParkExpansion';
import { ParkLighting } from './ParkLighting';
import { ParkCamera } from './ParkCamera';
import { ParkPOIs } from './ParkPOIs';
import { RouteOverlay } from './RouteOverlay';

function ReadyFlag() {
  const n = useRef(0);
  useFrame(() => { if (++n.current === 12) (window as any).__PARK_READY__ = true; });
  return null;
}

export interface ParkSceneProps {
  layers: Layers; quality: Quality; view: ViewReq; selected: string | null;
  graph: NavGraph; route: RouteResult | null; origin: string | null; dest: string | null;
  onPick: (id: string, point: [number, number]) => void;
  onGround: (point: [number, number]) => void;
  capture?: boolean;
}

/** Cena completa. Cada área é um componente independente e memoizado: mudar a rota ou a seleção não reconstrói a geometria. */
export const ParkScene = memo(function ParkScene(p: ParkSceneProps) {
  return (
    <Canvas
      shadows dpr={p.capture ? 1 : [1, 2]}
      camera={{ position: [0, 430, 210], fov: 45, near: 1, far: 4000 }}
      gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <ParkLighting quality={p.quality} />
      <ParkTerrain />
      <ParkTowers mist={p.layers.mist} />
      <ParkWalkways />
      <ParkWater animate={!p.capture} />
      <ParkSkatepark />
      <ParkSports />
      <ParkKnowledgeBuilding />
      <ParkPlayground />
      <ParkSocial />
      {p.layers.vegetation && <ParkVegetation quality={p.quality} />}
      {p.layers.surroundings && <ParkSurroundings quality={p.quality} />}
      {p.layers.expansion && <ParkExpansion />}
      <mesh rotation-x={-Math.PI / 2} position-y={0.2} onClick={(e) => p.onGround([e.point.x, e.point.z])}>
        <planeGeometry args={[3000, 3000]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <ParkPOIs selected={p.selected} labels={p.layers.labels} onPick={p.onPick} />
      <RouteOverlay route={p.route} graph={p.graph} origin={p.origin} dest={p.dest} />
      <ParkCamera view={p.view} />
      <ReadyFlag />
    </Canvas>
  );
});
