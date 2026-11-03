import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WATER_POLY } from '../data/parkStructures';
import { pointInPoly, distPointPolyBoundary, offsetPolygon, bbox } from '../geometry/poly';
import { mulberry32 } from '../geometry/rng';
import { extrudePolygon, polygonGeometry } from './geo';
import { getMaterials } from './materials';
import { matrixAt } from './helpers';

/**
 * ÁREA AQUÁTICA — ESPELHO D'ÁGUA DE 1.300 m² E BACIA DE RETENÇÃO PLUVIAL
 * Parque Realengo Jornalista Susana Naspolini
 * - Margem em pedras naturais de contenção e deck de madeira
 * - Ponte de madeira para pedestres cruzando o espelho d'água
 * - Vitórias-régias e macrófitas aquáticas flutuantes (SbN - Soluções Baseadas na Natureza)
 * - Jatos verticais e bicos atomizadores dinâmicos
 */
export const ParkWater = memo(function ParkWater({ animate }: { animate: boolean }) {
  const M = getMaterials();
  const data = useMemo(() => {
    // 1. Bordas em concreto e pedras de contenção
    const curbOuter = extrudePolygon(offsetPolygon(WATER_POLY, 0.9), 0, 0.36, [WATER_POLY]);
    const curbInner = extrudePolygon(offsetPolygon(WATER_POLY, 0.4), 0, 0.28, [WATER_POLY]);
    const surface = polygonGeometry(WATER_POLY, 0.18);
    const r = mulberry32(101);
    const b = bbox(WATER_POLY);

    // 2. Jatos de água verticais (fonte ornamental e aeração)
    const jets: { x: number; z: number; h: number; ph: number }[] = [];
    for (let x = b.minX + 3; x <= b.maxX - 3; x += 5.5) {
      for (let z = b.minZ + 3; z <= b.maxZ - 3; z += 5.5) {
        const p: [number, number] = [x + (r() - 0.5) * 1.8, z + (r() - 0.5) * 1.8];
        if (pointInPoly(p, WATER_POLY) && distPointPolyBoundary(p, WATER_POLY) > 2.8) {
          jets.push({ x: p[0], z: p[1], h: 1.6 + r() * 2.4, ph: r() * Math.PI * 2 });
        }
      }
    }

    const jetGeo = new THREE.CylinderGeometry(0.06, 0.16, 1, 8);
    jetGeo.translate(0, 0.5, 0);
    const nozzleGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 8);

    // 3. Vitórias-régias e macrófitas aquáticas (Vegetação flutuante)
    const lilies: { x: number; z: number; rad: number; rot: number }[] = [];
    for (let i = 0; i < 28; i++) {
      const rx = b.minX + r() * (b.maxX - b.minX);
      const rz = b.minZ + r() * (b.maxZ - b.minZ);
      const pt: [number, number] = [rx, rz];
      if (pointInPoly(pt, WATER_POLY) && distPointPolyBoundary(pt, WATER_POLY) > 1.8) {
        lilies.push({
          x: rx,
          z: rz,
          rad: 0.45 + r() * 0.45,
          rot: r() * Math.PI * 2
        });
      }
    }

    // 4. Ponte de madeira para pedestres cruzando a bacia
    // Conecta a margem sul à ilha/margem norte do espelho d'água
    const bridgeX = 38;
    const bridgeZ0 = -28;
    const bridgeZ1 = 12;
    const bridgeLen = bridgeZ1 - bridgeZ0;
    const bridgeGeo = new THREE.BoxGeometry(2.6, 0.22, bridgeLen);
    const bridgeRailGeo = new THREE.BoxGeometry(0.08, 0.95, bridgeLen);

    return {
      curbOuter,
      curbInner,
      surface,
      jets,
      jetGeo,
      nozzleGeo,
      lilies,
      bridgeGeo,
      bridgeRailGeo,
      bridgeCenter: [bridgeX, 0.38, (bridgeZ0 + bridgeZ1) / 2] as [number, number, number]
    };
  }, []);

  const jetsRef = useRef<THREE.InstancedMesh>(null!);
  useFrame(({ clock }) => {
    const m = jetsRef.current;
    if (!m) return;
    const t = clock.elapsedTime;
    data.jets.forEach((j, i) => {
      const s = animate ? 0.65 + 0.35 * Math.sin(t * 2.2 + j.ph) : 0.85;
      m.setMatrixAt(i, matrixAt(j.x, 0.18, j.z, 0, 1, j.h * s, 1));
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Bordas duplas em pedra e concreto */}
      <mesh geometry={data.curbOuter} material={M.stone} castShadow receiveShadow />
      <mesh geometry={data.curbInner} material={M.concrete} castShadow receiveShadow />

      {/* Superfície espelho d'água com PBR translúcido */}
      <mesh geometry={data.surface} material={M.water} receiveShadow />

      {/* Ponte de pedestres em madeira tratada */}
      <group position={data.bridgeCenter}>
        <mesh geometry={data.bridgeGeo} material={M.wood} castShadow receiveShadow />
        <mesh geometry={data.bridgeRailGeo} position={[-1.2, 0.55, 0]} material={M.wood} castShadow />
        <mesh geometry={data.bridgeRailGeo} position={[1.2, 0.55, 0]} material={M.wood} castShadow />
      </group>

      {/* Jatos de água com pulverizadores */}
      <instancedMesh ref={jetsRef} args={[data.jetGeo, M.jet, data.jets.length]} frustumCulled={false} />
      {data.jets.map((j, i) => (
        <mesh key={i} geometry={data.nozzleGeo} material={M.metalDark} position={[j.x, 0.19, j.z]} />
      ))}

      {/* Vitórias-régias flutuantes */}
      {data.lilies.map((l, idx) => (
        <group key={`lily-${idx}`} position={[l.x, 0.19, l.z]} rotation-y={l.rot}>
          <mesh rotation-x={-Math.PI / 2}>
            <circleGeometry args={[l.rad, 16]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <coneGeometry args={[l.rad * 0.25, 0.12, 8]} />
            <meshStandardMaterial color="#e9d8a6" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
});
