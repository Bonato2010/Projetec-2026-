import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { buildTree } from '../geometry/trees';
import { TREE_ARCHETYPES, SHRUB_ARCHETYPES } from '../data/parkVegetation';
import { placeVegetation, Quality, PlantInstance } from '../systems/vegetationPlacement';
import { getParkModel } from '../systems/parkModel';
import { toGeometry } from './geo';
import { getMaterials } from './materials';
import { Instances, matrixAt } from './helpers';

const geomCache = new Map<number, { trees: { trunk: THREE.BufferGeometry; canopy: THREE.BufferGeometry }[]; shrubs: { canopy: THREE.BufferGeometry }[] }>();
/** Geometrias dos arquétipos (cache por nível de detalhe). */
export function getPlantGeoms(detail: number) {
  let c = geomCache.get(detail);
  if (!c) {
    c = {
      trees: TREE_ARCHETYPES.map((s) => { const t = buildTree({ ...s, detail }); return { trunk: toGeometry(t.trunk), canopy: toGeometry(t.canopy) }; }),
      shrubs: SHRUB_ARCHETYPES.map((s) => ({ canopy: toGeometry(buildTree({ ...s, detail }).canopy) })),
    };
    geomCache.set(detail, c);
  }
  return c;
}
export const plantMatrices = (items: PlantInstance[], scale = 1) => items.map((p) => matrixAt(p.x, 0, p.z, p.rot, p.scale * scale));
export const plantColors = (items: PlantInstance[]) => items.map((p) => new THREE.Color(p.tint, p.tint, p.tint));

/** Árvores e arbustos instanciados (InstancedMesh por arquétipo). Posições/espécies provisórias. */
export const ParkVegetation = memo(function ParkVegetation({ quality }: { quality: Quality }) {
  const M = getMaterials();
  const data = useMemo(() => {
    const geoms = getPlantGeoms(quality === 'high' ? 2 : 1);
    const veg = placeVegetation(getParkModel(), quality);
    return {
      trees: geoms.trees.map((g, i) => { const items = veg.trees.filter((t) => t.arch === i); return { g, m: plantMatrices(items), c: plantColors(items) }; }),
      shrubs: geoms.shrubs.map((g, i) => { const items = veg.shrubs.filter((t) => t.arch === i); return { g, m: plantMatrices(items), c: plantColors(items) }; }),
    };
  }, [quality]);
  return (
    <group>
      {data.trees.map((t, i) => (
        <group key={i}>
          <Instances geometry={t.g.trunk} material={M.bark} matrices={t.m} />
          <Instances geometry={t.g.canopy} material={M.foliage} matrices={t.m} colors={t.c} />
        </group>
      ))}
      {data.shrubs.map((s, i) => <Instances key={i} geometry={s.g.canopy} material={M.foliage} matrices={s.m} colors={s.c} />)}
    </group>
  );
});
