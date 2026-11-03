import type { V3 } from '../geometry/vec';
import { buildTower, TowerModel } from '../geometry/tower';
import { buildWalkway, WalkwayMesh } from '../geometry/walkway';
import { TOWERS, WALKWAYS, TowerSpec, WalkwaySpec, WaypointSpec } from '../data/parkStructures';

export interface TowerInstance { spec: TowerSpec; model: TowerModel }
export interface WalkwayInstance { spec: WalkwaySpec; ctrl: V3[]; mesh: WalkwayMesh }
export interface ParkModel { towers: TowerInstance[]; walkways: WalkwayInstance[] }

let cache: ParkModel | null = null;

const xzOf = (w: WaypointSpec, towers: Map<string, TowerSpec>): [number, number] => {
  if (w.kind === 'point') return [w.x, w.z];
  const t = towers.get(w.tower)!;
  return [t.x, t.z];
};

/**
 * Monta torres e passarelas de forma acoplada: primeiro calcula de que lado cada plataforma
 * liga a uma passarela (aberturas no guarda-corpo), depois constrói as torres e só então
 * resolve os pontos de encontro (borda da plataforma, na cota da plataforma).
 */
export function getParkModel(): ParkModel {
  if (cache) return cache;
  const specs = new Map(TOWERS.map((t) => [t.id, t]));
  const gates = new Map<string, number[]>();
  for (const w of WALKWAYS) {
    w.waypoints.forEach((wp, i) => {
      if (wp.kind !== 'tower') return;
      const nb = w.waypoints[i === 0 ? 1 : i - 1];
      const [tx, tz] = xzOf(wp, specs), [nx, nz] = xzOf(nb, specs);
      const list = gates.get(wp.tower) ?? [];
      list.push(Math.atan2(nz - tz, nx - tx));
      gates.set(wp.tower, list);
    });
  }
  const towers = TOWERS.map((spec) => ({ spec, model: buildTower({ ...spec, gates: gates.get(spec.id) ?? [] }) }));
  const byId = new Map(towers.map((t) => [t.spec.id, t]));

  const walkways = WALKWAYS.map((spec) => {
    const ctrl: V3[] = spec.waypoints.map((wp, i) => {
      if (wp.kind === 'point') return [wp.x, wp.y, wp.z] as V3;
      const t = byId.get(wp.tower)!;
      const nb = spec.waypoints[i === 0 ? 1 : i - 1];
      const [nx, nz] = xzOf(nb, specs);
      const ang = Math.atan2(nz - t.spec.z, nx - t.spec.x);
      const pl = t.model.platforms[wp.platform];
      const r = pl.radius - 0.4;
      return [t.spec.x + Math.cos(ang) * r, pl.y, t.spec.z + Math.sin(ang) * r] as V3;
    });
    return { spec, ctrl, mesh: buildWalkway(ctrl, spec) };
  });
  cache = { towers, walkways };
  return cache;
}
