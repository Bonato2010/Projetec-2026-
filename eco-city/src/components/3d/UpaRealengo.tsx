'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSimulationStore } from '@/store/useSimulationStore';

export function UpaRealengo({ position }: { position: [number, number, number] }) {
  const selectEntity = useSimulationStore((state) => state.selectEntity);
  const { hospitalOccupancy, health } = useSimulationStore((state) => state.indicators);
  const isCritical = hospitalOccupancy > 90;

  // Realengo UPA is a large, typical state UPA block layout:
  // - Usually a rectangular main building, blue/grey/white patterns.
  // - Covered entrance for ambulances (Emergência).
  // - Main pedestrian entrance (Recepção).
  // - Fenced perimeter with paving.

  return (
    <group position={position} rotation={[0, -Math.PI / 6, 0]}>

      {/* Terreno / Ground / Calçada Externo */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[45, 0.1, 35]} />
        <meshStandardMaterial color="#475569" roughness={0.9} /> {/* Calçamento cinza escuro */}
      </mesh>

      {/* Meio fio da Calçada */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
         <boxGeometry args={[43, 0.2, 33]} />
         <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>

      {/* Cercamento Externo (Grades baseadas em blocos pra não pesar mt os vértices) */}
      <mesh position={[0, 1.5, 16.5]} receiveShadow castShadow>
          <boxGeometry args={[43, 3, 0.2]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={0.6} wireframe />
      </mesh>
      <mesh position={[0, 1.5, -16.5]} receiveShadow castShadow>
          <boxGeometry args={[43, 3, 0.2]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={0.6} wireframe />
      </mesh>
      <mesh position={[21.5, 1.5, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.2, 3, 33]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={0.6} wireframe />
      </mesh>
      <mesh position={[-21.5, 1.5, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.2, 3, 33]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={0.6} wireframe />
      </mesh>

      {/* Edifício Principal - Arquitetura Típica de UPA (Padrão RJ) */}
      <group position={[0, 3, -3]}>
        <mesh
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            selectEntity(`upa_realengo`, {
              title: "UPA 24h Realengo",
              type: 'health',
              mapillaryId: '1361952044310574', // Real Mapillary Image ID near UPA Realengo (approx)
              stats: [
                { label: 'Ocupação de Leitos', value: `${hospitalOccupancy}%` },
                { label: 'Risco Regional', value: isCritical ? 'ALTO' : 'NORMAL' },
                { label: 'Ambulâncias', value: 4 },
                { label: 'Capacidade', value: 'Porte 3' },
              ]
            });
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <boxGeometry args={[28, 6, 18]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.5} /> {/* Branco/Gelo */}
        </mesh>

        {/* Detalhe Azul Padrão Secretaria Saúde RJ na fachada */}
        <mesh position={[0, 2.5, 9.05]} castShadow>
          <boxGeometry args={[28, 1, 0.1]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} /> {/* Azul vivo */}
        </mesh>

        {/* Painel da UPA Frontal (Luminoso) */}
        <mesh position={[0, 1.5, 9.1]}>
           <boxGeometry args={[10, 2, 0.1]} />
           <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>

        {/* Entrada Emergência / Cobertura Ambulância */}
        <group position={[-8, -1.5, 12]}>
           <mesh castShadow receiveShadow>
              <boxGeometry args={[10, 0.5, 8]} />
              <meshStandardMaterial color="#cbd5e1" />
           </mesh>
           {/* Pilares da Cobertura */}
           <mesh position={[-4.5, -1.5, 3.5]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
              <meshStandardMaterial color="#94a3b8" />
           </mesh>
           <mesh position={[4.5, -1.5, 3.5]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
              <meshStandardMaterial color="#94a3b8" />
           </mesh>
           {/* Sinalização Vermelha de Emergência */}
           <mesh position={[0, 0.3, 4.05]}>
              <boxGeometry args={[8, 0.6, 0.1]} />
              <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={isCritical ? 1.5 : 0.5} />
           </mesh>
        </group>

        {/* Entrada Pedestre (Recepção Principal) */}
        <group position={[6, -1.5, 11]}>
           <mesh castShadow receiveShadow>
              <boxGeometry args={[8, 0.5, 6]} />
              <meshStandardMaterial color="#e2e8f0" />
           </mesh>
           {/* Pilares */}
           <mesh position={[-3.5, -1.5, 2.5]} castShadow>
              <boxGeometry args={[0.4, 3, 0.4]} />
              <meshStandardMaterial color="#94a3b8" />
           </mesh>
           <mesh position={[3.5, -1.5, 2.5]} castShadow>
              <boxGeometry args={[0.4, 3, 0.4]} />
              <meshStandardMaterial color="#94a3b8" />
           </mesh>
        </group>

        {/* Caixas d'água / Ar Condicionado no teto (Detalhes técnicos) */}
        <mesh position={[8, 4, -4]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 2, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        <mesh position={[4, 4, -4]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 2, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
        <mesh position={[-8, 3.5, 2]} castShadow>
          <boxGeometry args={[3, 1, 2]} />
          <meshStandardMaterial color="#64748b" roughness={0.8} />
        </mesh>
      </group>

      {/* Árvores / Paisagismo dentro da propriedade */}
      <group position={[16, 2, 8]}>
        <mesh position={[0, -1, 0]} castShadow>
           <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
           <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 1, 0]} castShadow>
           <sphereGeometry args={[2, 8, 8]} />
           <meshStandardMaterial color="#15803d" />
        </mesh>
      </group>

      <group position={[-16, 2, 8]}>
        <mesh position={[0, -1, 0]} castShadow>
           <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
           <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 1, 0]} castShadow>
           <sphereGeometry args={[2, 8, 8]} />
           <meshStandardMaterial color="#166534" />
        </mesh>
      </group>

      {/* Label de UI (Holográfico EcoCity) */}
      <Html
        position={[0, 12, 0]}
        center
        distanceFactor={100}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'none', transition: 'all 0.2s' }}
      >
        <div
          className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase ${
            isCritical
              ? 'bg-red-900/90 text-white border-red-500 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.6)]'
              : 'bg-brand-black/90 text-eco-green-light border-eco-green-base/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
          } border backdrop-blur-md whitespace-nowrap`}
        >
          <span className="text-[10px] opacity-70 mr-2">H</span>
          UPA Realengo
        </div>
      </Html>
    </group>
  );
}
