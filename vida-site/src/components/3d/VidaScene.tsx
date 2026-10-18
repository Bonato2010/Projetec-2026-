'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Animate a glowing biological/planetary sphere to represent "VIDA"
function GlowingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
      <MeshDistortMaterial
        color="#10b981" // eco-green
        emissive="#047857"
        emissiveIntensity={0.5}
        distort={0.4}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
        wireframe={true}
      />
    </Sphere>
  );
}

// Particle system to represent interconnected elements (water, cells, data)
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particles around the sphere
  const particlesCount = 2000;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  const color1 = new THREE.Color('#3b82f6'); // eco-blue
  const color2 = new THREE.Color('#fcd34d'); // eco-gold

  for(let i = 0; i < particlesCount; i++) {
    // Spherical distribution
    const r = 2.5 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i*3] = mixedColor.r;
    colors[i*3+1] = mixedColor.g;
    colors[i*3+2] = mixedColor.b;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position" args={[positions, 3]}
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
         <bufferAttribute
          attach="attributes-color" args={[colors, 3]}
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors={true}
        transparent={true}
        opacity={0.6}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function VidaScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-50 transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#10b981" />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <GlowingSphere />
        <Particles />

        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
