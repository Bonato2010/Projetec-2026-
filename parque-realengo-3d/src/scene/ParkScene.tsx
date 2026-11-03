import { memo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Layers, Quality, ViewReq } from './state';
import type { NavGraph, RouteResult } from '../systems/navigationGraph';
import type { ParkMission } from '../data/parkMissions';
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
import { ParkPlayer } from './ParkPlayer';
import { ParkMissions } from './ParkMissions';

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
  cameraMode?: 'follow' | 'free';
  completedMissions?: number[];
  activeMissionId?: number | null;
  onNearMission?: (mission: ParkMission | null) => void;
  onSelectMission?: (mission: ParkMission) => void;
  targetCoords?: [number, number, number] | null;
  onReachTarget?: () => void;
  joystickInput?: { dx: number; dz: number; active: boolean };
  isSprinting?: boolean;
  onPlayerStateChange?: (state: { pos: [number, number, number]; rotY: number; isMoving: boolean }) => void;
  remotePlayerState?: { pos: [number, number, number]; rotY: number; isMoving: boolean } | null;
}

/** Cena completa com Gêmeo Digital 3D, Personagem Principal e as 5 Missões Interativas. */
export const ParkScene = memo(function ParkScene(p: ParkSceneProps) {
  const camMode = p.cameraMode ?? (p.capture ? 'free' : 'follow');
  const completed = p.completedMissions ?? [];

  return (
    <Canvas
      shadows dpr={p.capture ? 1 : [1, 2]}
      camera={{ position: [42, 18, -100], fov: 45, near: 1, far: 4000 }}
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

      {/* 1. Personagem do Visitante e Companheiros (Máximo de 3 na cena) */}
      <ParkPlayer
        cameraMode={camMode}
        activeMissionId={p.activeMissionId ?? null}
        onNearMission={p.onNearMission}
        targetCoords={p.targetCoords}
        onReachTarget={p.onReachTarget}
        joystickInput={p.joystickInput}
        isSprinting={p.isSprinting}
        onPlayerStateChange={p.onPlayerStateChange}
        remotePlayerState={p.remotePlayerState}
      />

      {/* 2. As Cinco Missões Interativas no Parque (Beacons e Marcadores) */}
      {p.onSelectMission && (
        <ParkMissions
          completedMissions={completed}
          activeMissionId={p.activeMissionId ?? null}
          onSelectMission={p.onSelectMission}
        />
      )}

      {/* 3. Câmera de Vistas Guiadas (ativa quando o modo é 'free' ou em capturas) */}
      {camMode === 'free' && <ParkCamera view={p.view} />}

      <ReadyFlag />
    </Canvas>
  );
});
