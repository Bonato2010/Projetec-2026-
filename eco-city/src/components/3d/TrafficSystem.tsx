'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function TrafficSystem() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 500; // Number of vehicles

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize vehicle data: position, speed, direction
  const vehicles = useMemo(() => {
    const arr = [];
    const rng = () => (Math.random() - 0.5) * 200; // Spread over grid
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rng(),
        z: rng(),
        speed: (Math.random() * 0.2 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
        isVertical: Math.random() > 0.5,
        type: Math.random() > 0.9 ? 'ambulance' : 'car'
      });
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    vehicles.forEach((v, i) => {
      // Update position
      if (v.isVertical) {
        v.z += v.speed;
        if (v.z > 100) v.z = -100;
        if (v.z < -100) v.z = 100;

        // Snap to grid for rudimentary lanes
        v.x = Math.round(v.x / 10) * 10 + 2;

        dummy.position.set(v.x, 0.5, v.z);
        dummy.rotation.y = v.speed > 0 ? 0 : Math.PI;
      } else {
        v.x += v.speed;
        if (v.x > 100) v.x = -100;
        if (v.x < -100) v.x = 100;

        v.z = Math.round(v.z / 10) * 10 - 2;

        dummy.position.set(v.x, 0.5, v.z);
        dummy.rotation.y = v.speed > 0 ? Math.PI / 2 : -Math.PI / 2;
      }

      dummy.scale.set(1.5, 1, 3); // car shape
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      const color = new THREE.Color();
      if (v.type === 'ambulance') {
          color.setHex(Math.floor(Date.now() / 200) % 2 === 0 ? 0xff0000 : 0xffffff); // Flashing lights
      } else {
          color.setHex(0xaaaaaa);
      }
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[1, 1, 1]}>
          <instancedBufferAttribute attach="attributes-color" args={[new Float32Array(count * 3), 3]} />
      </boxGeometry>
      <meshStandardMaterial vertexColors roughness={0.4} metalness={0.6} />
    </instancedMesh>
  );
}
