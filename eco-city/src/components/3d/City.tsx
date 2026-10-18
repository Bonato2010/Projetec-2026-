'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { RoadNetwork } from './RoadNetwork';
import { BuildingInstancer } from './BuildingInstancer';
import { Hospitals } from './Hospitals';
import { TrafficSystem } from './TrafficSystem';
import { UpaRealengo } from './UpaRealengo';

export function City() {
  const group = useRef<THREE.Group>(null);

  return (
    <group ref={group}>
      <RoadNetwork />
      <BuildingInstancer />
      <Hospitals />
      <TrafficSystem />

      {/* Explicitly positioned UPA Realengo based on OSM relative coordinates near the center/west zone representation */}
      <UpaRealengo position={[-40, 0, 30]} />

      {/* Central Holographic Core / Sun representation from logo */}
      <mesh position={[0, 40, 0]}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>

      {/* Energy Rings around core */}
      <mesh position={[0, 40, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[15, 15.5, 64]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1} side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 40, 0]} rotation={[Math.PI / 2.5, Math.PI / 6, 0]}>
        <ringGeometry args={[20, 20.2, 64]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
