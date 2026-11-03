import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WATER_POLY, SPLASH_PAD } from '../data/parkStructures';
import { pointInPoly, distPointPolyBoundary, offsetPolygon, bbox, circlePoly } from '../geometry/poly';
import { mulberry32 } from '../geometry/rng';
import { extrudePolygon, polygonGeometry, toGeometry } from './geo';
import { getMaterials } from './materials';
import { matrixAt } from './helpers';

/**
 * ÁREA AQUÁTICA — ESPELHO D'ÁGUA LOBADO CYAN E SPLASH PAD INFANTIL
 * Parque Realengo Jornalista Susana Naspolini (Calibrado com fotos aéreas reais)
 * - Bacia de retenção em formato lobado orgânico envolvendo as 5 Super-Torres
 * - Fundo impermeabilizado em azul ciano piscina com lâmina d'água PBR translúcida
 * - Splash Pad circular interativo adjacente com jatos verticais e piso emborrachado azul/amarelo
 */
export const ParkWater = memo(function ParkWater({ animate }: { animate: boolean }) {
  const M = getMaterials();
  const data = useMemo(() => {
    // 1. Bordas e fundo do espelho d'água lobado sob as torres
    const curbOuter = extrudePolygon(offsetPolygon(WATER_POLY, 0.8), 0, 0.25, [WATER_POLY]);
    const basinFloor = polygonGeometry(WATER_POLY, 0.04);
    const surface = polygonGeometry(WATER_POLY, 0.18);

    const r = mulberry32(101);
    const b = bbox(WATER_POLY);

    // 2. Jatos de água verticais no espelho d'água
    const jets: { x: number; z: number; h: number; ph: number }[] = [];
    for (let x = b.minX + 2; x <= b.maxX - 2; x += 4.5) {
      for (let z = b.minZ + 2; z <= b.maxZ - 2; z += 4.5) {
        const p: [number, number] = [x + (r() - 0.5) * 1.5, z + (r() - 0.5) * 1.5];
        if (pointInPoly(p, WATER_POLY) && distPointPolyBoundary(p, WATER_POLY) > 2.0) {
          jets.push({ x: p[0], z: p[1], h: 1.8 + r() * 2.2, ph: r() * Math.PI * 2 });
        }
      }
    }

    const jetGeo = new THREE.CylinderGeometry(0.05, 0.14, 1, 8);
    jetGeo.translate(0, 0.5, 0);
    const nozzleGeo = new THREE.CylinderGeometry(0.10, 0.10, 0.06, 8);

    // 3. Splash Pad Circular (diâmetro 18m)
    const splashOuterPoly = circlePoly(SPLASH_PAD.cx, SPLASH_PAD.cz, SPLASH_PAD.r, 36);
    const splashPadFloor = polygonGeometry(splashOuterPoly, 0.05);
    const splashInnerPoly = circlePoly(SPLASH_PAD.cx, SPLASH_PAD.cz, SPLASH_PAD.r * 0.65, 32);
    const splashInnerFloor = polygonGeometry(splashInnerPoly, 0.06);
    const splashCurb = extrudePolygon(offsetPolygon(splashOuterPoly, 0.6), 0, 0.18, [splashOuterPoly]);

    // Jatos do Splash Pad em anéis concêntricos
    const splashJets: { x: number; z: number; h: number; ph: number }[] = [];
    const numSplashRings = 2;
    for (let ring = 0; ring < numSplashRings; ring++) {
      const rad = 2.5 + ring * 3.2;
      const count = 8 + ring * 6;
      for (let k = 0; k < count; k++) {
        const ang = (k / count) * Math.PI * 2;
        const jx = SPLASH_PAD.cx + Math.cos(ang) * rad;
        const jz = SPLASH_PAD.cz + Math.sin(ang) * rad;
        splashJets.push({ x: jx, z: jz, h: 1.2 + r() * 1.6, ph: r() * Math.PI * 2 });
      }
    }

    return {
      curbOuter,
      basinFloor,
      surface,
      jets,
      jetGeo,
      nozzleGeo,
      splashPadFloor,
      splashInnerFloor,
      splashCurb,
      splashJets,
    };
  }, []);

  const jetsRef = useRef<THREE.InstancedMesh>(null!);
  const splashJetsRef = useRef<THREE.InstancedMesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (jetsRef.current) {
      data.jets.forEach((j, i) => {
        const s = animate ? 0.65 + 0.35 * Math.sin(t * 2.4 + j.ph) : 0.85;
        jetsRef.current.setMatrixAt(i, matrixAt(j.x, 0.18, j.z, 0, 1, j.h * s, 1));
      });
      jetsRef.current.instanceMatrix.needsUpdate = true;
    }
    if (splashJetsRef.current) {
      data.splashJets.forEach((j, i) => {
        const s = animate ? 0.50 + 0.50 * Math.sin(t * 3.2 + j.ph) : 0.75;
        splashJetsRef.current.setMatrixAt(i, matrixAt(j.x, 0.08, j.z, 0, 0.8, j.h * s, 0.8));
      });
      splashJetsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Guia de borda em pedra clara */}
      <mesh geometry={data.curbOuter} material={M.stone} castShadow receiveShadow />

      {/* Fundo do espelho d'água pintado em azul piscina vibrante */}
      <mesh geometry={data.basinFloor} material={M.poolFloor} receiveShadow />

      {/* Lâmina d'água cristalina translúcida com refração PBR */}
      <mesh geometry={data.surface} material={M.water} receiveShadow />

      {/* Jatos de água das torres */}
      <instancedMesh ref={jetsRef} args={[data.jetGeo, M.jet, data.jets.length]} frustumCulled={false} />
      {data.jets.map((j, i) => (
        <mesh key={i} geometry={data.nozzleGeo} material={M.metalDark} position={[j.x, 0.19, j.z]} />
      ))}

      {/* Splash Pad Infantil */}
      <mesh geometry={data.splashCurb} material={M.stone} castShadow receiveShadow />
      <mesh geometry={data.splashPadFloor} material={M.splashPadBlue} receiveShadow />
      <mesh geometry={data.splashInnerFloor} material={M.splashPadYellow} receiveShadow />
      <instancedMesh ref={splashJetsRef} args={[data.jetGeo, M.jet, data.splashJets.length]} frustumCulled={false} />
      {data.splashJets.map((j, i) => (
        <mesh key={`nozzle-${i}`} geometry={data.nozzleGeo} material={M.metalDark} position={[j.x, 0.07, j.z]} />
      ))}
    </group>
  );
});
