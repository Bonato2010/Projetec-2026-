import type { V2 } from '../geometry/vec';
import { mulberry32, rrange } from '../geometry/rng';
import { offsetPolygon, rectPoly, polyIntersects, signedArea, edgeOutwardNormal } from '../geometry/poly';
import { PARK_PERIMETER, SURROUNDINGS_CONFIG as S } from '../data/parkLayout';

export interface Block { cx: number; cz: number; w: number; d: number; h: number; rot: number; tone: number }
export interface Surroundings {
  sidewalkInner: V2[]; sidewalkOuter: V2[]; streetOuter: V2[];
  blocks: Block[]; trees: V2[];
  provisional: boolean;
}

/**
 * Contexto urbano GENÉRICO e de baixo gabarito (não representa edifícios reais).
 * Quando houver dados do OSM/Data.Rio, substitua `blocks` por `importGeoJSON(...).buildings`.
 */
export function buildSurroundings(perimeter: V2[] = PARK_PERIMETER): Surroundings {
  const rnd = mulberry32(S.seed);
  const sidewalkOuter = offsetPolygon(perimeter, S.sidewalk);
  const streetOuter = offsetPolygon(perimeter, S.sidewalk + S.street);
  const blocks: Block[] = [];
  const polys: V2[][] = [];
  let base = offsetPolygon(perimeter, S.sidewalk + S.street + S.sidewalk);
  for (let row = 0; row < S.rows; row++) {
    let rowDepth = 0;
    const n = base.length;
    for (let e = 0; e < n; e++) {
      const a = base[e], b = base[(e + 1) % n];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 8) continue;
      const ux = (b[0] - a[0]) / len, uz = (b[1] - a[1]) / len;
      const [nx, nz] = edgeOutwardNormal(base, e);
      let s = 2;
      while (s < len - 8) {
        const w = rrange(rnd, 9, 22), d = rrange(rnd, 11, 18);
        if (s + w > len - 2) break;
        const gap = rnd() < 0.12; // brechas imitam ruas transversais / lotes vazios
        const cx = a[0] + ux * (s + w / 2) + nx * (d / 2 + 0.5), cz = a[1] + uz * (s + w / 2) + nz * (d / 2 + 0.5);
        const rot = Math.atan2(uz, ux);
        const poly = rectPoly(cx, cz, w, d, rot, 0.4);
        if (!gap && !polys.some((q) => polyIntersects(q, poly)) && !polyIntersects(poly, streetOuter)) {
          const tall = rnd() < 0.12;
          const h = tall ? rrange(rnd, 10, S.maxHeight) : rrange(rnd, 5.5, 9.5);
          blocks.push({ cx, cz, w, d, h, rot, tone: rnd() });
          polys.push(poly); rowDepth = Math.max(rowDepth, d);
        }
        s += w + rrange(rnd, 0.5, 2);
      }
    }
    base = offsetPolygon(base, 20 + (rowDepth > 0 ? 4 : 0));
  }
  // árvores de rua ao longo da calçada externa e junto ao parque
  const trees: V2[] = [];
  const line = (poly: V2[], d: number, step: number) => {
    const p = offsetPolygon(poly, d);
    p.forEach((a, i) => {
      const b = p[(i + 1) % p.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      for (let t = step / 2; t < len; t += step) trees.push([a[0] + ((b[0] - a[0]) / len) * t, a[1] + ((b[1] - a[1]) / len) * t]);
    });
  };
  line(perimeter, S.sidewalk / 2, 16);
  line(perimeter, S.sidewalk + S.street + S.sidewalk / 2, 14);
  void signedArea;
  return { sidewalkInner: perimeter, sidewalkOuter, streetOuter, blocks, trees, provisional: S.provisional };
}
