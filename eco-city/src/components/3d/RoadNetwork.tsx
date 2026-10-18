'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import cityDataRaw from '../../../public/data/city_data.json';

// Utility to map geo coordinates to 3D space
const mapGeoTo3D = (lat: number, lon: number, bounds: any, scale: number = 200) => {
  const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * scale - (scale / 2);
  const z = -(((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * scale - (scale / 2));
  return { x, z };
};

export function RoadNetwork() {
  const data = cityDataRaw as any;

  const roadGeometry = useMemo(() => {
    if (!data.roads || !data.bounds) return null;

    const lines: THREE.Vector3[] = [];

    // For visual simplicity in the simulation, we'll draw lines connecting nodes
    // In a real complete app, we'd extrude shapes. Here we simulate a network grid
    // based roughly on the fetched points since OSM ways need deeper parsing for exact shapes.
    // For this prototype, we'll scatter points and connect nearest neighbors to simulate the layout
    // based on real data points.

    const points = data.roads.map((r: any) => {
      const pos = mapGeoTo3D(r.lat, r.lon, data.bounds, 200);
      return new THREE.Vector3(pos.x, 0.01, pos.z);
    });

    // Connect some points to form a visible network
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < Math.min(i + 5, points.length); j++) {
            const d = points[i].distanceTo(points[j]);
            if (d < 30) {
                lines.push(points[i], points[j]);
            }
        }
    }

    // Also add a generic grid representing secondary streets for density
    for (let x = -150; x <= 150; x += 15) {
        lines.push(new THREE.Vector3(x, 0, -150), new THREE.Vector3(x, 0, 150));
        lines.push(new THREE.Vector3(-150, 0, x), new THREE.Vector3(150, 0, x));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(lines);
    return geometry;
  }, [data]);

  return (
    <group>
      {/* Base Terrain - darker to let emissive materials pop */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#030712" roughness={1} metalness={0} />
      </mesh>

      {/* Road Network Lines - using the glowing blue from the logo */}
      {roadGeometry && (
        <lineSegments geometry={roadGeometry}>
          <lineBasicMaterial color="#0ea5e9" linewidth={1} transparent opacity={0.3} />
        </lineSegments>
      )}

      {/* Core Grid - Tech aesthetic */}
      <gridHelper args={[300, 20, '#0ea5e9', '#0f172a']} position={[0, -0.05, 0]} />
    </group>
  );
}

export { mapGeoTo3D };
