import type { V2 } from './types';
import { LAYOUT_META } from './parkLayout';

/**
 * Importação de GeoJSON (OpenStreetMap / Data.Rio) para coordenadas locais em metros.
 * Só funciona depois de `LAYOUT_META.geoOrigin` ser preenchido. Cite a fonte e respeite a licença (ODbL no OSM).
 * Projeção equiretangular local: adequada para áreas de poucos km.
 */
export function lonLatToLocal(lon: number, lat: number, origin = LAYOUT_META.geoOrigin): V2 {
  if (!origin) throw new Error('LAYOUT_META.geoOrigin não definido');
  const mPerDegLat = 110574, mPerDegLon = 111320 * Math.cos((origin.lat * Math.PI) / 180);
  return [(lon - origin.lon) * mPerDegLon, -(lat - origin.lat) * mPerDegLat]; // z cresce para o sul
}
export interface ImportedSurroundings { streets: V2[][]; buildings: { poly: V2[]; height: number }[]; attribution: string }
type Feature = { geometry?: { type: string; coordinates: any }; properties?: Record<string, any> };
export function importGeoJSON(fc: { features: Feature[] }, attribution = '© colaboradores do OpenStreetMap (ODbL)'): ImportedSurroundings {
  const out: ImportedSurroundings = { streets: [], buildings: [], attribution };
  for (const f of fc.features ?? []) {
    const g = f.geometry; if (!g) continue;
    const props = f.properties ?? {};
    if (g.type === 'LineString' && props.highway) out.streets.push(g.coordinates.map((c: number[]) => lonLatToLocal(c[0], c[1])));
    if (g.type === 'Polygon' && props.building) {
      const h = Number(props.height) || (Number(props['building:levels']) || 2) * 3.2;
      out.buildings.push({ poly: g.coordinates[0].map((c: number[]) => lonLatToLocal(c[0], c[1])), height: h });
    }
  }
  return out;
}
/** Tenta carregar /data/osm-realengo.geojson (opcional). Retorna null se não houver origem ou arquivo. */
export async function loadOptionalGeoJSON(url = '/data/osm-realengo.geojson'): Promise<ImportedSurroundings | null> {
  if (!LAYOUT_META.geoOrigin) return null;
  try { const r = await fetch(url); if (!r.ok) return null; return importGeoJSON(await r.json()); } catch { return null; }
}
