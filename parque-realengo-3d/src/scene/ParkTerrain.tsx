import { memo, useMemo } from 'react';
import { PARK_PERIMETER, ENTRANCES } from '../data/parkLayout';
import { PAVED, WATER_POLY, GARDEN_BEDS, SKATE } from '../data/parkStructures';
import { PATH_NODES, PATH_EDGES, DEFAULT_PATH_WIDTH } from '../data/parkPaths';
import { rectPoly, circlePoly } from '../geometry/poly';
import { ribbonMesh } from '../geometry/ribbon';
import { polygonGeometry, toGeometry } from './geo';
import { getMaterials } from './materials';

/** Terreno: gramado com furo para a pista de skate, praças, canteiros, base da área aquática e caminhos (faixas com largura). */
export const ParkTerrain = memo(function ParkTerrain() {
  const M = getMaterials();
  const g = useMemo(() => {
    const hole = rectPoly(SKATE.cx, SKATE.cz, SKATE.w, SKATE.d, SKATE.rot);
    const nodes = new Map(PATH_NODES.map((n) => [n.id, n.pos]));
    const segs = PATH_EDGES.map(([a, b, w]) => ({ a: nodes.get(a)!, b: nodes.get(b)!, w: w ?? DEFAULT_PATH_WIDTH }));
    return {
      grass: polygonGeometry(PARK_PERIMETER, 0, [hole]),
      paved: PAVED.map((p) => ({ id: p.id, mat: p.material, geo: polygonGeometry(p.poly, 0.02) })),
      basin: polygonGeometry(WATER_POLY, 0.03),
      beds: GARDEN_BEDS.map((b) => ({ id: b.id, geo: polygonGeometry(b.poly, 0.03) })),
      paths: toGeometry(ribbonMesh(segs, 0.05), { uv: 'planar' }),
      gates: ENTRANCES.map((e) => ({ id: e.id, geo: polygonGeometry(circlePoly(e.pos[0], e.pos[1], 5, 24), 0.04) })),
    };
  }, []);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.06} receiveShadow material={M.groundFar}><planeGeometry args={[6000, 6000]} /></mesh>
      <mesh geometry={g.grass} material={M.grass} receiveShadow />
      {g.paved.map((p) => <mesh key={p.id} geometry={p.geo} material={p.mat === 'stone' ? M.stone : M.concrete} receiveShadow />)}
      <mesh geometry={g.basin} material={M.basin} receiveShadow />
      {g.beds.map((b) => <mesh key={b.id} geometry={b.geo} material={M.soil} receiveShadow />)}
      <mesh geometry={g.paths} material={M.path} receiveShadow />
      {g.gates.map((e) => <mesh key={e.id} geometry={e.geo} material={M.stone} receiveShadow />)}
    </group>
  );
});
