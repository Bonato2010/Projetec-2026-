import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { POIS } from '../data/parkStructures';
import { getMaterials } from './materials';

/** Alvos de clique (invisíveis), destaque discreto do elemento selecionado e rótulos opcionais. */
export const ParkPOIs = memo(function ParkPOIs({ selected, labels, onPick }: { selected: string | null; labels: boolean; onPick: (id: string, point: [number, number]) => void }) {
  const M = getMaterials();
  const ring = useRef<THREE.Mesh>(null!);
  const poi = POIS.find((p) => p.id === selected);
  useFrame(({ clock }) => {
    const m = ring.current; if (!m) return;
    (m.material as THREE.MeshBasicMaterial).opacity = 0.55 + 0.3 * Math.sin(clock.elapsedTime * 3);
  });
  return (
    <group>
      {POIS.map((p) => (
        <mesh
          key={p.id} position={[p.center[0], 15, p.center[2]]} material={M.invisible}
          onClick={(e) => { e.stopPropagation(); onPick(p.id, [e.point.x, e.point.z]); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <cylinderGeometry args={[p.radius * 0.38, p.radius * 0.38, 30, 24]} />
        </mesh>
      ))}
      {poi && (
        <mesh ref={ring} rotation-x={-Math.PI / 2} position={[poi.center[0], 0.4, poi.center[2]]}>
          <ringGeometry args={[poi.radius * 0.4, poi.radius * 0.42, 72]} />
          <meshBasicMaterial color="#ffb347" transparent opacity={0.8} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )}
      {labels && POIS.map((p) => (
        <Html key={p.id} position={[p.center[0], Math.max(8, p.center[1] + 8), p.center[2]]} center distanceFactor={140} zIndexRange={[10, 0]}>
          <div className="scene-label">{p.name}</div>
        </Html>
      ))}
    </group>
  );
});
