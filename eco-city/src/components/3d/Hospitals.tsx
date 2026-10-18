'use client';

import React from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { mapGeoTo3D } from '@/utils/geoParser';
import cityDataRaw from '../../../public/data/city_data.json';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function Hospitals() {
  const data = cityDataRaw as any;
  const selectEntity = useSimulationStore(state => state.selectEntity);
  const { health, hospitalOccupancy } = useSimulationStore(state => state.indicators);

  if (!data.hospitals || !data.bounds) return null;

  return (
    <group>
      {data.hospitals.map((h: any) => {
        const pos = mapGeoTo3D(h.lat, h.lon, data.bounds, 500); // Scaled map to match chunks
        const isCritical = hospitalOccupancy > 90;

        return (
          <group key={h.id} position={[pos.x, 0, pos.z]}>
            {/* Base / Foundation */}
            <mesh position={[0, 0.5, 0]} receiveShadow>
                <boxGeometry args={[12, 1, 10]} />
                <meshStandardMaterial color="#1f2937" />
            </mesh>

             {/* Main Hospital Building (Complex Volume) */}
            <group position={[0, 5, -1]}>
              <mesh
              onClick={(e) => {
                e.stopPropagation();
                selectEntity(`hospital_${h.id}`, {
                  title: h.name,
                  type: 'health',
                  stats: [
                    { label: 'Ocupação Simulada', value: `${hospitalOccupancy}%` },
                    { label: 'Nível de Saúde Global', value: `${health}%` },
                    { label: 'Ambulâncias Ativas', value: Math.floor(Math.random() * 5) + 2 },
                    { label: 'Tipo', value: h.type.toUpperCase() },
                  ]
                });
              }}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
              castShadow
              receiveShadow
            >
                <boxGeometry args={[8, 8, 6]} />
                <meshStandardMaterial color={isCritical ? "#991b1b" : "#e2e8f0"} roughness={0.2} metalness={0.8} />

                {/* Tech Glow Edges (Simulated with thin emissive meshes) */}
                <mesh position={[4.05, 0, 0]}>
                    <boxGeometry args={[0.1, 8, 6]} />
                    <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
                </mesh>
              </mesh>

              {/* Annex Building */}
              <mesh position={[-4, -1, 2]}>
                  <boxGeometry args={[6, 6, 4]} />
                  <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
              </mesh>
            </group>

            {/* Entrance / Emergency Bay */}
            <mesh position={[0, 2, 3]} castShadow receiveShadow>
                <boxGeometry args={[6, 4, 4]} />
                <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[0, 2, 5.1]}>
                <planeGeometry args={[4, 2]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={isCritical ? 2 : 0.5} />
            </mesh>

            {/* Helipad */}
            <mesh position={[0, 9.1, -1]}>
                <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 9.25, -1]} rotation={[-Math.PI/2, 0, 0]}>
                <ringGeometry args={[1.5, 2, 32]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} side={THREE.DoubleSide} />
            </mesh>

            {/* Medical Cross Icon / Marker */}
            <Html position={[0, 15, 0]} center distanceFactor={100} zIndexRange={[100, 0]} style={{ pointerEvents: 'none', transition: 'all 0.2s' }}>
                <div className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider ${isCritical ? 'bg-red-900/80 text-white border-red-500 animate-pulse' : 'bg-brand-black/80 text-eco-gold border-eco-gold/30'} border shadow-[0_0_15px_rgba(251,191,36,0.3)] backdrop-blur-md whitespace-nowrap`}>
                    <span className="text-[10px] opacity-70 mr-2">H</span>
                    {h.name}
                </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
