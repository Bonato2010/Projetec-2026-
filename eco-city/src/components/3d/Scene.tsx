'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { City } from './City';
import { CameraController } from './CameraController';

export function Scene() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-brand-black">
      <Canvas
        shadows
        camera={{ position: [0, 200, 200], fov: 45, near: 1, far: 2000 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }} // Optimized GL settings
      >
        <color attach="background" args={['#050505']} />

        {/* Environment - stylized space/night to match logo */}
        <Stars radius={300} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

        {/* Strategic Lighting */}
        <ambientLight intensity={0.1} />
        <directionalLight
          castShadow
          position={[100, 100, 50]}
          intensity={1}
          shadow-mapSize={[1024, 1024]} // Reduced from 2048 for perf
          shadow-camera-far={300}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          color="#fef08a" // Slight gold tint from logo
        />
        <pointLight position={[-50, 20, -50]} intensity={0.5} color="#0ea5e9" /> // Blue tech fill light
        <pointLight position={[50, 20, 50]} intensity={0.3} color="#22c55e" /> // Green nature fill light

        <Suspense fallback={null}>
          <City />

          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.5}
            scale={200}
            blur={2}
            far={20}
            resolution={512} // Optimized resolution
          />
          {/* Subtle reflections */}
          <Environment preset="night" environmentIntensity={0.2} />
        </Suspense>

        <CameraController />

        {/* Post-processing for the glowing tech elements */}
        <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
