import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { ViewReq } from './state';

/**
 * Câmera orbital suave: zoom, rotação, pan (setas do teclado também), enquadramento automático para vistas e POIs.
 * Proteção simples contra atravessar o terreno (altura mínima). Colisão com estruturas NÃO é calculada.
 */
export function ParkCamera({ view }: { view: ViewReq }) {
  const controls = useRef<any>(null);
  const { camera } = useThree();
  const goal = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);

  useEffect(() => {
    const g = { pos: new THREE.Vector3(...view.pos), target: new THREE.Vector3(...view.target) };
    if (view.instant && controls.current) {
      camera.position.copy(g.pos);
      controls.current.target.copy(g.target);
      controls.current.update();
      goal.current = null;
      (window as any).__PARK_SETTLED__ = true;
    } else {
      goal.current = g;
      (window as any).__PARK_SETTLED__ = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.key]);

  useEffect(() => { controls.current?.listenToKeyEvents?.(window); }, []);

  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    const g = goal.current;
    if (g) {
      const k = 1 - Math.exp(-dt * 3.2);
      camera.position.lerp(g.pos, k);
      c.target.lerp(g.target, k);
      if (camera.position.distanceTo(g.pos) < 0.08 && c.target.distanceTo(g.target) < 0.08) { goal.current = null; (window as any).__PARK_SETTLED__ = true; }
    }
    if (camera.position.y < 1.6) camera.position.y = 1.6;
    c.update();
  });

  return (
    <OrbitControls
      ref={controls} makeDefault enableDamping dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2 - 0.03} minDistance={6} maxDistance={900} screenSpacePanning
      onStart={() => { goal.current = null; }}
    />
  );
}
