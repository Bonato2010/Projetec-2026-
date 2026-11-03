import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { PARK_PERIMETER, SURROUNDINGS_CONFIG as S } from '../data/parkLayout';
import { buildSurroundings } from '../systems/surroundings';
import { offsetPolygon } from '../geometry/poly';
import { ribbonMesh } from '../geometry/ribbon';
import { emptyMesh, appendMesh } from '../geometry/mesh';
import type { PlantInstance, Quality } from '../systems/vegetationPlacement';
import { polygonGeometry, toGeometry } from './geo';
import { getMaterials } from './materials';
import { Instances, matrixAt } from './helpers';
import { getPlantGeoms, plantColors, plantMatrices } from './ParkVegetation';

const PALETTE = ['#d9ccb8', '#c9b9a6', '#cfd2cf', '#d8c3a5', '#bfc5c9'].map((c) => new THREE.Color(c));

/** Contexto urbano GENÉRICO de baixo gabarito (provisório; não são edifícios reais). Ruas, calçadas, volumes e arborização viária. */
export const ParkSurroundings = memo(function ParkSurroundings({ quality }: { quality: Quality }) {
  const M = getMaterials();
  const d = useMemo(() => {
    const sur = buildSurroundings();
    const outerWalk = offsetPolygon(sur.streetOuter, S.sidewalk);
    const dashes = emptyMesh();
    const mid = offsetPolygon(PARK_PERIMETER, S.sidewalk + S.street / 2);
    mid.forEach((a, i) => {
      const b = mid[(i + 1) % mid.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / len, uz = (b[1] - a[1]) / len;
      for (let t = 1; t + 3 < len; t += 7) appendMesh(dashes, ribbonMesh([{ a: [a[0] + ux * t, a[1] + uz * t], b: [a[0] + ux * (t + 3), a[1] + uz * (t + 3)], w: 0.18 }], 0.06, false));
    });
    const unit = new THREE.BoxGeometry(1, 1, 1); unit.translate(0, 0.5, 0);
    const walls: THREE.Matrix4[] = [], roofs: THREE.Matrix4[] = [], wins: THREE.Matrix4[] = [], colors: THREE.Color[] = [];
    for (const b of sur.blocks) {
      const ry = -b.rot;
      walls.push(matrixAt(b.cx, 0, b.cz, ry, b.w, b.h, b.d));
      roofs.push(matrixAt(b.cx, b.h, b.cz, ry, b.w + 0.4, 0.35, b.d + 0.4));
      colors.push(PALETTE[Math.floor(b.tone * PALETTE.length) % PALETTE.length]);
      const base = new THREE.Matrix4().compose(new THREE.Vector3(b.cx, 0, b.cz), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), new THREE.Vector3(1, 1, 1));
      for (let f = 0; f < Math.max(1, Math.floor(b.h / 3.1)); f++) for (const s of [-1, 1]) {
        const local = new THREE.Matrix4().compose(new THREE.Vector3(0, 1.5 + f * 3.1, s * (b.d / 2 + 0.02)), new THREE.Quaternion(), new THREE.Vector3(b.w * 0.8, 1.2, 0.08));
        wins.push(base.clone().multiply(local));
      }
    }
    const geoms = getPlantGeoms(1);
    const trees: PlantInstance[] = sur.trees.map(([x, z], i) => ({ arch: 3, x, z, rot: i * 1.7, scale: 0.6 + (i % 5) * 0.06, tint: 0.9 + (i % 4) * 0.04 }));
    return {
      sidewalk: polygonGeometry(sur.sidewalkOuter, 0.1, [PARK_PERIMETER]),
      street: polygonGeometry(sur.streetOuter, 0.02, [sur.sidewalkOuter]),
      outerWalk: polygonGeometry(outerWalk, 0.1, [sur.streetOuter]),
      dashes: toGeometry(dashes, { uv: 'planar' }),
      unit, walls, roofs, wins, colors,
      treeGeom: geoms.trees[3], treeM: plantMatrices(trees), treeC: plantColors(trees),
    };
  }, []);
  void quality;
  return (
    <group>
      <mesh geometry={d.sidewalk} material={M.path} receiveShadow />
      <mesh geometry={d.street} material={M.asphalt} receiveShadow />
      <mesh geometry={d.dashes} material={M.line} receiveShadow />
      <mesh geometry={d.outerWalk} material={M.path} receiveShadow />
      <Instances geometry={d.unit} material={M.wallWhite} matrices={d.walls} colors={d.colors} />
      <Instances geometry={d.unit} material={M.roof} matrices={d.roofs} />
      <Instances geometry={d.unit} material={M.windowDark} matrices={d.wins} cast={false} />
      <Instances geometry={d.treeGeom.trunk} material={M.bark} matrices={d.treeM} />
      <Instances geometry={d.treeGeom.canopy} material={M.foliage} matrices={d.treeM} colors={d.treeC} />
    </group>
  );
});
