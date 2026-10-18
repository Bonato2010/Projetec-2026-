'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSimulationStore } from '@/store/useSimulationStore';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

export function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const zoomLevel = useSimulationStore(state => state.zoomLevel);
  const presentationMode = useSimulationStore(state => state.presentationMode);

  // Target vectors for smooth interpolation
  const targetPos = useRef(new THREE.Vector3());
  const targetTarget = useRef(new THREE.Vector3(0, 0, 0)); // What the camera looks at

  useEffect(() => {
    if (presentationMode) {
      // Presentation mode overrides manual zoom
      targetPos.current.set(0, 100, 150);
      targetTarget.current.set(0, 0, 0);
      return;
    }

    switch (zoomLevel) {
      case 'REGIONAL':
        targetPos.current.set(0, 200, 200);
        break;
      case 'URBANO':
        targetPos.current.set(0, 80, 80);
        break;
      case 'LOCAL':
        targetPos.current.set(0, 30, 30);
        break;
      case 'DETALHADO':
        targetPos.current.set(0, 15, 15);
        break;
    }
  }, [zoomLevel, presentationMode]);

  useFrame((state, delta) => {
    if (presentationMode) {
      // Cinematic slow rotation
      const time = state.clock.getElapsedTime();
      const radius = 150;
      targetPos.current.x = Math.sin(time * 0.1) * radius;
      targetPos.current.z = Math.cos(time * 0.1) * radius;
      targetPos.current.y = 80 + Math.sin(time * 0.05) * 20;

      camera.position.lerp(targetPos.current, 0.02);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetTarget.current, 0.02);
      }
    } else {
       // Normal zoom level interpolation
       camera.position.lerp(targetPos.current, 0.05);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={5}
      maxDistance={300}
      enabled={!presentationMode} // Disable manual control during presentation
    />
  );
}
