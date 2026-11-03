import type { V2 } from '../geometry/vec';
import { mulberry32 } from '../geometry/rng';
import { pointInPoly, offsetPolygon, distPointSeg, bbox, area, distPointPolyBoundary } from '../geometry/poly';
import { PARK_PERIMETER } from '../data/parkLayout';
import { FOOTPRINTS, PAVED_FOOTPRINTS, GARDEN_BEDS } from '../data/parkStructures';
import { PATH_NODES, PATH_EDGES, DEFAULT_PATH_WIDTH } from '../data/parkPaths';
import { VEGETATION_CONFIG as C, TREE_ARCHETYPES, SHRUB_ARCHETYPES } from '../data/parkVegetation';
import type { ParkModel } from './parkModel';

export type Quality = 'low' | 'medium' | 'high';
export interface PlantInstance { arch: number; x: number; z: number; rot: number; scale: number; tint: number }
export interface Vegetation { trees: PlantInstance[]; shrubs: PlantInstance[] }

/** Funções de exclusão compartilhadas com o script de verificação. */
export function makeExclusion(model: ParkModel) {
  const blockers = [...FOOTPRINTS.filter((f) => f.blocksTrees), ...PAVED_FOOTPRINTS].map((f) => ({ id: f.id, poly: f.poly, grown: offsetPolygon(f.poly, 1.2) }));
  const nodeById = new Map(PATH_NODES.map((n) => [n.id, n.pos]));
  const segs = PATH_EDGES.map(([a, b, w]) => ({ a: nodeById.get(a)!, b: nodeById.get(b)!, hw: (w ?? DEFAULT_PATH_WIDTH) / 2 }));
  const walk: { p: V2; hw: number }[] = [];
  for (const w of model.walkways) for (const c of w.mesh.centerline) walk.push({ p: [c[0], c[2]], hw: w.spec.width / 2 });
  const perim = offsetPolygon(PARK_PERIMETER, -2);
  return (p: V2, kind: 'tree' | 'shrub'): string | null => {
    if (!pointInPoly(p, perim)) return 'fora do perímetro';
    for (const b of blockers) if (pointInPoly(p, b.grown)) return b.id;
    for (const s of segs) if (distPointSeg(p, s.a, s.b) < s.hw + C.pathClear) return 'caminho';
    for (const q of walk) if (Math.hypot(p[0] - q.p[0], p[1] - q.p[1]) < q.hw + C.walkwayClear) return 'passarela';
    void kind;
    return null;
  };
}

const pickWeighted = (r: () => number, items: { weight: number }[]): number => {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let t = r() * total;
  for (let i = 0; i < items.length; i++) { t -= items[i].weight; if (t <= 0) return i; }
  return items.length - 1;
};

export function placeVegetation(model: ParkModel, quality: Quality = 'medium'): Vegetation {
  const rnd = mulberry32(C.seed);
  const excl = makeExclusion(model);
  const edgeOuter = offsetPolygon(PARK_PERIMETER, -C.edgeBand.from);
  const edgeInner = offsetPolygon(PARK_PERIMETER, -C.edgeBand.to);
  const regions: { inside: (p: V2) => boolean; box: ReturnType<typeof bbox>; area: number; t: number; s: number }[] = [];
  regions.push({
    inside: (p) => pointInPoly(p, edgeOuter) && !pointInPoly(p, edgeInner), box: bbox(PARK_PERIMETER),
    area: Math.abs(area(edgeOuter) - area(edgeInner)), t: C.edgeBand.treesPer1000, s: C.edgeBand.shrubsPer1000,
  });
  for (const z of C.zones) regions.push({ inside: (p) => pointInPoly(p, z.poly), box: bbox(z.poly), area: area(z.poly), t: z.treesPer1000, s: z.shrubsPer1000 });

  const sample = (kind: 'tree' | 'shrub'): PlantInstance[] => {
    const spacing = kind === 'tree' ? C.minTreeSpacing : C.minShrubSpacing;
    const cell = spacing, grid = new Map<string, V2[]>();
    const near = (p: V2): boolean => {
      const cx = Math.floor(p[0] / cell), cz = Math.floor(p[1] / cell);
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++)
        for (const q of grid.get(`${cx + i},${cz + j}`) ?? []) if (Math.hypot(p[0] - q[0], p[1] - q[1]) < spacing) return true;
      return false;
    };
    const out: PlantInstance[] = [];
    const add = (p: V2) => {
      const k = `${Math.floor(p[0] / cell)},${Math.floor(p[1] / cell)}`;
      (grid.get(k) ?? grid.set(k, []).get(k)!).push(p);
      const arch = pickWeighted(rnd, kind === 'tree' ? TREE_ARCHETYPES : SHRUB_ARCHETYPES);
      out.push({ arch, x: p[0], z: p[1], rot: rnd() * Math.PI * 2, scale: 0.8 + rnd() * 0.45, tint: 0.85 + rnd() * 0.3 });
    };
    for (const r of regions) {
      const target = Math.round((r.area / 1000) * (kind === 'tree' ? r.t : r.s));
      let placed = 0, tries = 0;
      while (placed < target && tries < target * 40) {
        tries++;
        const p: V2 = [r.box.minX + rnd() * (r.box.maxX - r.box.minX), r.box.minZ + rnd() * (r.box.maxZ - r.box.minZ)];
        if (!r.inside(p) || excl(p, kind) || near(p)) continue;
        add(p); placed++;
      }
    }
    if (kind === 'shrub') {
      for (const bed of GARDEN_BEDS) {
        const box = bbox(bed.poly), target = Math.round((area(bed.poly) / 100) * C.bedShrubsPer100);
        let placed = 0, tries = 0;
        while (placed < target && tries < target * 40) {
          tries++;
          const p: V2 = [box.minX + rnd() * (box.maxX - box.minX), box.minZ + rnd() * (box.maxZ - box.minZ)];
          if (!pointInPoly(p, bed.poly) || distPointPolyBoundary(p, bed.poly) < 0.5 || near(p)) continue;
          add(p); placed++;
        }
      }
    }
    return out;
  };
  const cap = (list: PlantInstance[], max: number): PlantInstance[] => {
    if (list.length <= max) return list;
    const keep = max / list.length;
    return list.filter((_, i) => Math.floor((i + 1) * keep) !== Math.floor(i * keep));
  };
  return { trees: cap(sample('tree'), C.maxTrees[quality]), shrubs: cap(sample('shrub'), C.maxShrubs[quality]) };
}
