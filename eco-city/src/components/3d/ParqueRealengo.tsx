'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';

function Trees({ count = 400, bounds = { x: 200, z: 150 } }) {
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      // eslint-disable-next-line react-hooks/purity
      // eslint-disable-next-line react-hooks/purity
      let x = (Math.random() - 0.5) * bounds.x;
      // eslint-disable-next-line react-hooks/purity
      let z = (Math.random() - 0.5) * bounds.z;

      // Avoid the central paved areas, towers, sports courts, and skate park
      const distToCenter = Math.sqrt(x*x + z*z);
      const isNearCourts = x > 30 && z > 10;
      const isNearSkate = x < -30 && z < -10;

      if (distToCenter < 60 || isNearCourts || isNearSkate) {
        // eslint-disable-next-line react-hooks/purity
        x += Math.sign(x) * (40 + Math.random() * 40);
        // eslint-disable-next-line react-hooks/purity
        z += Math.sign(z) * (40 + Math.random() * 40);
      }

      // Ensure we stay mostly within bounds after displacement
      x = Math.max(-bounds.x/2 + 5, Math.min(bounds.x/2 - 5, x));
      z = Math.max(-bounds.z/2 + 5, Math.min(bounds.z/2 - 5, z));

      // eslint-disable-next-line react-hooks/purity
      // eslint-disable-next-line react-hooks/purity
      const scale = 0.5 + Math.random() * 1.2; // Varied tree sizes
      // eslint-disable-next-line react-hooks/purity
      // eslint-disable-next-line react-hooks/purity
      const rotation = Math.random() * Math.PI;

      // eslint-disable-next-line react-hooks/purity
      // eslint-disable-next-line react-hooks/purity
      const isDarkGreen = Math.random() > 0.5; // Variation in color

      pos.push({ x, z, scale, rotation, isDarkGreen });
    }
    return pos;
  }, [count, bounds]);

  return (
    <group>
      {/* Trunks */}
      <Instances limit={count} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.6, 4, 5]} />
        <meshStandardMaterial color="#4A3728" roughness={0.9} />
        {positions.map((p, i) => (
          <Instance key={`trunk-${i}`} position={[p.x, 2 * p.scale, p.z]} scale={[p.scale, p.scale, p.scale]} rotation={[0, p.rotation, 0]} />
        ))}
      </Instances>

      {/* Leaves Group 1 (Light Green) */}
      <Instances limit={count * 3} castShadow receiveShadow>
        <sphereGeometry args={[2.5, 6, 6]} />
        <meshStandardMaterial color="#32CD32" roughness={0.9} />
        {positions.filter(p => !p.isDarkGreen).map((p, i) => (
          <group key={`leaf-light-${i}`}>
            <Instance position={[p.x, 5 * p.scale, p.z]} scale={[p.scale, p.scale * 1.2, p.scale]} rotation={[0, p.rotation, 0]} />
            <Instance position={[p.x + p.scale, 4 * p.scale, p.z + p.scale]} scale={[p.scale * 0.8, p.scale, p.scale * 0.8]} />
            <Instance position={[p.x - p.scale, 4 * p.scale, p.z - p.scale]} scale={[p.scale * 0.8, p.scale, p.scale * 0.8]} />
          </group>
        ))}
      </Instances>

      {/* Leaves Group 2 (Dark Green / Bosque) */}
      <Instances limit={count * 3} castShadow receiveShadow>
        <sphereGeometry args={[2.5, 6, 6]} />
        <meshStandardMaterial color="#228B22" roughness={0.9} />
        {positions.filter(p => p.isDarkGreen).map((p, i) => (
          <group key={`leaf-dark-${i}`}>
            <Instance position={[p.x, 5 * p.scale, p.z]} scale={[p.scale, p.scale * 1.2, p.scale]} rotation={[0, p.rotation, 0]} />
            <Instance position={[p.x + p.scale, 4 * p.scale, p.z + p.scale]} scale={[p.scale * 0.8, p.scale, p.scale * 0.8]} />
            <Instance position={[p.x - p.scale, 4 * p.scale, p.z - p.scale]} scale={[p.scale * 0.8, p.scale, p.scale * 0.8]} />
          </group>
        ))}
      </Instances>
    </group>
  );
}

export function ParqueRealengo({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const parkGroup = useRef<THREE.Group>(null);

  const towerPositions = [
    [-15, 0, -10],
    [5, 0, -15],
    [25, 0, -10],
    [-5, 0, 5],
    [15, 0, 5],
  ];

  return (
    <group position={new THREE.Vector3(...position)} ref={parkGroup}>
      {/* Terrain Base (Grass) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[280, 220]} />
        <meshStandardMaterial color="#4ade80" roughness={1} />
      </mesh>

      {/* Paths and Pavings */}
      {/* Central Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial color="#E8E8E8" roughness={0.7} />
      </mesh>

      {/* Path to Courts */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[40, 0.02, 25]} receiveShadow>
        <planeGeometry args={[60, 15]} />
        <meshStandardMaterial color="#D3D3D3" roughness={0.8} />
      </mesh>

      {/* Path to Skate Park */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-40, 0.02, -20]} receiveShadow>
        <planeGeometry args={[60, 15]} />
        <meshStandardMaterial color="#D3D3D3" roughness={0.8} />
      </mesh>

      {towerPositions.map((pos, i) => (
        <group key={`tower-${i}`} position={new THREE.Vector3(pos[0], 0, pos[2])}>
          <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[4, 5, 4, 16]} />
            <meshStandardMaterial color="#8B4513" roughness={0.9} />
          </mesh>
          {[0, 1, 2, 3].map((pIdx) => (
             <mesh key={`pillar-${pIdx}`} position={[Math.cos(pIdx * Math.PI/2) * 2, 12, Math.sin(pIdx * Math.PI/2) * 2]} rotation={[0.1 * Math.cos(pIdx * Math.PI/2), 0, -0.1 * Math.sin(pIdx * Math.PI/2)]} castShadow>
                <cylinderGeometry args={[0.3, 0.5, 20, 8]} />
                <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
             </mesh>
          ))}
          <mesh position={[0, 25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[2, 2.5, 10, 16]} />
            <meshStandardMaterial color="#A0522D" roughness={0.9} />
          </mesh>
          <mesh position={[0, 30.5, 0]} castShadow>
            <cylinderGeometry args={[3, 2, 1, 16]} />
            <meshStandardMaterial color="#5C4033" />
          </mesh>
          <mesh position={[0, 32, 0]} castShadow>
             <boxGeometry args={[0.5, 4, 0.5]} />
             <meshStandardMaterial color="#333" metalness={0.8} />
          </mesh>
        </group>
      ))}

      <group position={[-50, 0, 40]}>
        <mesh position={[0, 3, 0]} castShadow receiveShadow scale={[1.2, 1, 0.8]}>
          <cylinderGeometry args={[12, 12, 6, 32]} />
          <meshStandardMaterial color="#F5F5F5" roughness={0.4} metalness={0.1} />
        </mesh>
        <mesh position={[0, 6.5, 0]} castShadow receiveShadow scale={[1.3, 1, 0.9]}>
          <cylinderGeometry args={[13, 13, 1, 32]} />
          <meshStandardMaterial color="#D0D0D0" roughness={0.6} />
        </mesh>
        <mesh position={[12, 3, 0]} castShadow>
          <boxGeometry args={[4, 5, 8]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[11.5, 3, 0]} castShadow>
          <boxGeometry args={[0.5, 4, 12]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} metalness={0.6} roughness={0.1} />
        </mesh>
      </group>

      <group position={[60, 0.15, 50]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 35]} />
          <meshStandardMaterial color="#1E90FF" roughness={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[18, 33]} />
          <meshStandardMaterial color="#fff" wireframe opacity={0.5} transparent />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[30, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 50]} />
          <meshStandardMaterial color="#228B22" roughness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[30, 0.02, 0]}>
          <planeGeometry args={[28, 48]} />
          <meshStandardMaterial color="#fff" wireframe opacity={0.5} transparent />
        </mesh>
        <mesh position={[30, 1.5, -24]} castShadow>
          <boxGeometry args={[6, 3, 1]} />
          <meshStandardMaterial color="#fff" wireframe />
        </mesh>
        <mesh position={[30, 1.5, 24]} castShadow>
          <boxGeometry args={[6, 3, 1]} />
          <meshStandardMaterial color="#fff" wireframe />
        </mesh>
        <mesh position={[15, 2, 0]} castShadow>
          <boxGeometry args={[70, 4, 60]} />
          <meshStandardMaterial color="#AAAAAA" wireframe transparent opacity={0.2} />
        </mesh>
      </group>

      <group position={[-60, 0, -40]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
          <planeGeometry args={[45, 35]} />
          <meshStandardMaterial color="#888" roughness={0.6} />
        </mesh>
        <mesh position={[-15, 1.5, 0]} rotation={[0, Math.PI/2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3, 3, 25, 16, 1, false, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#A9A9A9" roughness={0.5} />
        </mesh>
        <mesh position={[15, 1.5, 0]} rotation={[0, -Math.PI/2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3, 3, 25, 16, 1, false, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#A9A9A9" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 2, 10]} />
          <meshStandardMaterial color="#999" roughness={0.6} />
        </mesh>
        <mesh position={[-6, 0.5, 0]} rotation={[0, 0, Math.PI/8]} castShadow>
          <boxGeometry args={[3, 1.5, 10]} />
          <meshStandardMaterial color="#999" roughness={0.6} />
        </mesh>
        <mesh position={[6, 0.5, 0]} rotation={[0, 0, -Math.PI/8]} castShadow>
          <boxGeometry args={[3, 1.5, 10]} />
          <meshStandardMaterial color="#999" roughness={0.6} />
        </mesh>
      </group>

      <group position={[10, 0, 30]}>
        <mesh position={[-20, 3, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 6]} /><meshStandardMaterial color="#777" /></mesh>
        <mesh position={[0, 4, 10]} castShadow><cylinderGeometry args={[0.5, 0.5, 8]} /><meshStandardMaterial color="#777" /></mesh>
        <mesh position={[20, 3, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 6]} /><meshStandardMaterial color="#777" /></mesh>
        <mesh position={[-10, 6, 5]} rotation={[0, -Math.PI/6, Math.PI/16]} castShadow>
          <boxGeometry args={[25, 0.5, 4]} />
          <meshStandardMaterial color="#D3D3D3" roughness={0.7} />
        </mesh>
        <mesh position={[10, 6, 5]} rotation={[0, Math.PI/6, -Math.PI/16]} castShadow>
          <boxGeometry args={[25, 0.5, 4]} />
          <meshStandardMaterial color="#D3D3D3" roughness={0.7} />
        </mesh>
        <mesh position={[-10, 6.75, 6.5]} rotation={[0, -Math.PI/6, Math.PI/16]} castShadow>
          <boxGeometry args={[25, 1, 0.2]} />
          <meshStandardMaterial color="#555" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-10, 6.75, 3.5]} rotation={[0, -Math.PI/6, Math.PI/16]} castShadow>
          <boxGeometry args={[25, 1, 0.2]} />
          <meshStandardMaterial color="#555" transparent opacity={0.6} />
        </mesh>
        <mesh position={[10, 6.75, 6.5]} rotation={[0, Math.PI/6, -Math.PI/16]} castShadow>
          <boxGeometry args={[25, 1, 0.2]} />
          <meshStandardMaterial color="#555" transparent opacity={0.6} />
        </mesh>
        <mesh position={[10, 6.75, 3.5]} rotation={[0, Math.PI/6, -Math.PI/16]} castShadow>
          <boxGeometry args={[25, 1, 0.2]} />
          <meshStandardMaterial color="#555" transparent opacity={0.6} />
        </mesh>
      </group>

      <Trees count={400} bounds={{ x: 260, z: 200 }} />
    </group>
  );
}
