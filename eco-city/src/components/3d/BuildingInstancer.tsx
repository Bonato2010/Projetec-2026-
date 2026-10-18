'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Detailed } from '@react-three/drei';
import cityDataRaw from '../../../public/data/city_data.json';
import { mapGeoTo3D } from '@/utils/geoParser';

// High-performance InstancedMesh for buildings based on geographic density
export function BuildingInstancer() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const data = cityDataRaw as any;

  const instances = useMemo(() => {
    if (!data.roads || !data.bounds) return [];

    const generated: { matrix: THREE.Matrix4; color: THREE.Color }[] = [];
    const dummy = new THREE.Object3D();

    // Instead of a random grid, we cluster buildings along the roads fetched from OSM
    data.roads.forEach((road: any) => {
       const pos = mapGeoTo3D(road.lat, road.lon, data.bounds, 200);

       // Generate 2-4 buildings near this road node
       const count = Math.floor(Math.random() * 3) + 2;

       for(let i=0; i < count; i++) {
           // Offset from road center
           const offsetX = (Math.random() - 0.5) * 8;
           const offsetZ = (Math.random() - 0.5) * 8;

           // Don't place exactly on the road
           if (Math.abs(offsetX) < 2 && Math.abs(offsetZ) < 2) continue;

           // Determine type based on road classification
           const isPrimary = road.type === 'primary' || road.type === 'trunk';
           const height = isPrimary ? 3 + Math.random() * 8 : 1 + Math.random() * 3;

           dummy.position.set(pos.x + offsetX, height / 2, pos.z + offsetZ);
           dummy.scale.set(1.5 + Math.random(), height, 1.5 + Math.random());
           dummy.updateMatrix();

           generated.push({
               matrix: dummy.matrix.clone(),
               color: isPrimary ? new THREE.Color(0x38bdf8) : new THREE.Color(0x4ade80), // Use logo colors (blue for tech/commercial, green for residential)
           });
       }
    });

    return generated;
  }, [data]);

  useEffect(() => {
    if (!meshRef.current || instances.length === 0) return;

    instances.forEach((inst, idx) => {
        meshRef.current!.setMatrixAt(idx, inst.matrix);
        meshRef.current!.setColorAt(idx, inst.color);
    });

    meshRef.current.count = instances.length;
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [instances]);

  if (instances.length === 0) return null;

  return (
    <Detailed distances={[0, 100, 250]}>
        {/* High Detail - visible up close */}
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, instances.length]}
            castShadow
            receiveShadow
        >
          {/* Beveled edge look for higher detail */}
          <boxGeometry args={[1, 1, 1, 2, 2, 2]}>
             <instancedBufferAttribute attach="attributes-color" args={[new Float32Array(instances.length * 3), 3]} />
          </boxGeometry>
          <meshStandardMaterial vertexColors roughness={0.7} metalness={0.3} />
        </instancedMesh>

        {/* Medium Detail */}
        <instancedMesh ref={meshRef} args={[undefined, undefined, instances.length]} castShadow>
          <boxGeometry args={[1, 1, 1]}>
             <instancedBufferAttribute attach="attributes-color" args={[new Float32Array(instances.length * 3), 3]} />
          </boxGeometry>
          <meshStandardMaterial vertexColors roughness={0.9} />
        </instancedMesh>

        {/* Low Detail - Flat shading, no shadows */}
        <instancedMesh ref={meshRef} args={[undefined, undefined, instances.length]}>
          <boxGeometry args={[1, 1, 1]}>
             <instancedBufferAttribute attach="attributes-color" args={[new Float32Array(instances.length * 3), 3]} />
          </boxGeometry>
          <meshBasicMaterial vertexColors />
        </instancedMesh>
    </Detailed>
  );
}
