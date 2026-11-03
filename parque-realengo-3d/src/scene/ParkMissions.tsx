import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PARK_MISSIONS, ParkMission } from '../data/parkMissions';

interface ParkMissionsProps {
  completedMissions: number[];
  activeMissionId: number | null;
  onSelectMission: (mission: ParkMission) => void;
}

function MissionBeacon({
  mission,
  isCompleted,
  isActive,
  onSelect
}: {
  mission: ParkMission;
  isCompleted: boolean;
  isActive: boolean;
  onSelect: () => void;
}) {
  const columnRef = useRef<THREE.Mesh>(null!);
  const badgeRef = useRef<THREE.Group>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Rotação suave do badge flutuante
    if (badgeRef.current) {
      badgeRef.current.rotation.y = t * 1.5;
      badgeRef.current.position.y = 3.6 + Math.sin(t * 2.5) * 0.25;
    }
    // Pulsação do anel no solo
    if (ringRef.current) {
      const s = 1.0 + Math.sin(t * 3.0) * 0.15;
      ringRef.current.scale.set(s, s, 1);
    }
    // Opacidade da coluna de luz
    if (columnRef.current) {
      (columnRef.current.material as THREE.MeshBasicMaterial).opacity =
        isActive ? 0.35 + Math.sin(t * 4.0) * 0.15 : 0.18;
    }
  });

  const beaconColor = isCompleted ? '#22c55e' : isActive ? '#00f0ff' : mission.color;

  return (
    <group position={mission.coords}>
      {/* 1. Anel Pulsante no Chão */}
      <mesh
        ref={ringRef}
        rotation-x={-Math.PI / 2}
        position-y={0.05}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <ringGeometry args={[1.8, 2.4, 32]} />
        <meshBasicMaterial color={beaconColor} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Círculo de Interação Central */}
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={0.04}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <circleGeometry args={[1.7, 32]} />
        <meshBasicMaterial color={beaconColor} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. Coluna de Luz Vertical */}
      <mesh ref={columnRef} position-y={2.2}>
        <cylinderGeometry args={[0.35, 1.4, 4.4, 16, 1, true]} />
        <meshBasicMaterial
          color={beaconColor}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Emblema / Badge Flutuante 3D */}
      <group
        ref={badgeRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {/* Octaedro / Diamante de Cristal */}
        <mesh>
          <octahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial
            color={beaconColor}
            emissive={beaconColor}
            emissiveIntensity={isCompleted ? 0.8 : 0.4}
            roughness={0.2}
            metalness={0.8}
            wireframe={!isCompleted}
          />
        </mesh>
        {/* Núcleo Luminoso */}
        <mesh>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshBasicMaterial color={isCompleted ? '#4ade80' : '#ffffff'} />
        </mesh>
      </group>
    </group>
  );
}

export const ParkMissions = memo(function ParkMissions({
  completedMissions,
  activeMissionId,
  onSelectMission
}: ParkMissionsProps) {
  return (
    <group>
      {PARK_MISSIONS.map((m) => (
        <MissionBeacon
          key={m.id}
          mission={m}
          isCompleted={completedMissions.includes(m.id)}
          isActive={activeMissionId === m.id}
          onSelect={() => onSelectMission(m)}
        />
      ))}
    </group>
  );
});
