'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances, RoundedBox } from '@react-three/drei';

// Trees instancer to optimize performance
function Trees({ count = 200, bounds = { x: 200, z: 150 } }) {
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      // Keep trees away from the center where buildings/courts are
      // eslint-disable-next-line react-hooks/purity
      let x = (Math.random() - 0.5) * bounds.x;
      // eslint-disable-next-line react-hooks/purity
      let z = (Math.random() - 0.5) * bounds.z;

      // Basic avoidance of the central paved areas and towers
      if (Math.abs(x) < 40 && Math.abs(z) < 40) {
        // eslint-disable-next-line react-hooks/purity
        x += Math.sign(x) * 40 + (Math.random() * 20);
        // eslint-disable-next-line react-hooks/purity
        z += Math.sign(z) * 40 + (Math.random() * 20);
      }

      // eslint-disable-next-line react-hooks/purity
      const scale = 0.8 + Math.random() * 0.8;
      pos.push({ x, z, scale });
    }
    return pos;
  }, [count, bounds]);

  return (
    <group>
      {/* Trunks */}
      <Instances limit={count} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.8, 3, 5]} />
        <meshStandardMaterial color="#5C4033" roughness={0.9} />
        {positions.map((p, i) => (
          <Instance key={`trunk-${i}`} position={[p.x, 1.5 * p.scale, p.z]} scale={[p.scale, p.scale, p.scale]} />
        ))}
      </Instances>
      {/* Leaves */}
      <Instances limit={count * 2} castShadow receiveShadow>
        <sphereGeometry args={[2.5, 7, 7]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.8} />
        {positions.map((p, i) => (
          <group key={`leaf-${i}`}>
            <Instance position={[p.x, 4 * p.scale, p.z]} scale={[p.scale, p.scale, p.scale]} />
            <Instance position={[p.x + p.scale, 3.5 * p.scale, p.z + p.scale]} scale={[p.scale * 0.8, p.scale * 0.8, p.scale * 0.8]} />
            <Instance position={[p.x - p.scale, 3.5 * p.scale, p.z - p.scale]} scale={[p.scale * 0.8, p.scale * 0.8, p.scale * 0.8]} />
          </group>
        ))}
      </Instances>
    </group>
  );
}

export function ParqueRealengo({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const parkGroup = useRef<THREE.Group>(null);

  // Tower positions (5 towers)
  const towerPositions = [
    [-15, 0, -10],
    [5, 0, -15],
    [25, 0, -10],
    [-5, 0, 5],
    [15, 0, 5],
  ];

  return (
    <group position={new THREE.Vector3(...position)} ref={parkGroup}>
      {/* Main Terrain / Park Boundary (Approx 76k sqm represented by 300x250) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[260, 200]} />
        <meshStandardMaterial color="#4ade80" roughness={1} />
      </mesh>

      {/* Main Pathways */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[240, 180]} />
        <meshStandardMaterial color="#A9A9A9" roughness={0.8} transparent opacity={0.3} />
      </mesh>

      {/* Paved Plaza Area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, -10]} receiveShadow>
        <circleGeometry args={[50, 32]} />
        <meshStandardMaterial color="#D3D3D3" roughness={0.7} />
      </mesh>

      {/* The 5 Characteristic Towers (Old factory chimneys) */}
      {towerPositions.map((pos, i) => (
        <group key={`tower-${i}`} position={new THREE.Vector3(pos[0], 0, pos[2])}>
          {/* Base */}
          <mesh position={[0, 5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[2.5, 3.5, 10, 16]} />
            <meshStandardMaterial color="#8B4513" roughness={0.9} />
          </mesh>
          {/* Main Body */}
          <mesh position={[0, 20, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.5, 2.5, 20, 16]} />
            <meshStandardMaterial color="#A0522D" roughness={0.9} />
          </mesh>
          {/* Top trim */}
          <mesh position={[0, 30.5, 0]} castShadow>
            <cylinderGeometry args={[1.7, 1.5, 1, 16]} />
            <meshStandardMaterial color="#5C4033" />
          </mesh>
        </group>
      ))}

      {/* Nave do Conhecimento (Modern, slightly curved/elliptical structure) */}
      <group position={[-50, 0, 40]}>
        <mesh position={[0, 4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[15, 15, 8, 32]} />
          <meshStandardMaterial color="#E0E0E0" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Glass Dome / Roof */}
        <mesh position={[0, 8.5, 0]} castShadow>
          <sphereGeometry args={[14.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Entrance */}
        <mesh position={[14, 2.5, 0]} castShadow>
          <boxGeometry args={[4, 5, 8]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      {/* Sports Courts */}
      <group position={[60, 0.15, 50]}>
        {/* Court 1 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 35]} />
          <meshStandardMaterial color="#1E90FF" roughness={0.8} />
        </mesh>
        {/* Court 2 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[25, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 35]} />
          <meshStandardMaterial color="#32CD32" roughness={0.8} />
        </mesh>
        {/* Fences */}
        <mesh position={[12.5, 2, 0]} castShadow>
          <boxGeometry args={[48, 4, 38]} />
          <meshStandardMaterial color="#AAAAAA" wireframe transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Skate Park */}
      <group position={[-60, 0, -40]}>
        {/* Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
          <planeGeometry args={[40, 30]} />
          <meshStandardMaterial color="#A9A9A9" roughness={0.6} />
        </mesh>
        {/* Ramps (bowls and quarter pipes approx) */}
        <mesh position={[-10, 1, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
          <cylinderGeometry args={[3, 3, 20, 16, 1, false, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#B0B0B0" roughness={0.5} />
        </mesh>
        <mesh position={[10, 1.5, -5]} rotation={[0, -Math.PI/2, 0]} castShadow>
          <cylinderGeometry args={[4, 4, 15, 16, 1, false, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#B0B0B0" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1, 10]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[15, 2, 8]} />
          <meshStandardMaterial color="#999999" roughness={0.6} />
        </mesh>
      </group>

      {/* Elevated Walkways */}
      <group position={[10, 0, 30]}>
        {/* Pillars */}
        <mesh position={[-20, 3, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 6]} /><meshStandardMaterial color="#777" /></mesh>
        <mesh position={[0, 4, 10]} castShadow><cylinderGeometry args={[0.5, 0.5, 8]} /><meshStandardMaterial color="#777" /></mesh>
        <mesh position={[20, 3, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 6]} /><meshStandardMaterial color="#777" /></mesh>

        {/* Walkway Path */}
        <mesh position={[-10, 6, 5]} rotation={[0, -Math.PI/6, Math.PI/16]} castShadow>
          <boxGeometry args={[25, 0.5, 4]} />
          <meshStandardMaterial color="#E6B325" roughness={0.7} />
        </mesh>
        <mesh position={[10, 6, 5]} rotation={[0, Math.PI/6, -Math.PI/16]} castShadow>
          <boxGeometry args={[25, 0.5, 4]} />
          <meshStandardMaterial color="#E6B325" roughness={0.7} />
        </mesh>
      </group>

      {/* Trees Vegetation */}
      <Trees count={250} bounds={{ x: 240, z: 180 }} />
    </group>
  );
}
