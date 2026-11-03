import * as THREE from 'three';
import { MeshData, computeNormals } from '../geometry/mesh';
import type { V2 } from '../geometry/vec';

/** MeshData → BufferGeometry. `uv`: 'box' (projeção pelo eixo dominante da normal) ou 'planar' (x,z). UVs em METROS: a textura aplica repeat = 1/ladrilho. */
export function toGeometry(m: MeshData, opts: { uv?: 'box' | 'planar'; tile?: number } = {}): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  const normals = computeNormals(m.positions, m.indices);
  g.setAttribute('position', new THREE.Float32BufferAttribute(m.positions, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  if (m.colors) g.setAttribute('color', new THREE.Float32BufferAttribute(m.colors, 3));
  if (opts.uv) {
    const t = opts.tile ?? 1, uv: number[] = [];
    for (let i = 0; i < m.positions.length; i += 3) {
      const x = m.positions[i], y = m.positions[i + 1], z = m.positions[i + 2];
      const nx = Math.abs(normals[i]), ny = Math.abs(normals[i + 1]), nz = Math.abs(normals[i + 2]);
      if (opts.uv === 'planar' || ny >= 0.5) uv.push(x / t, z / t);
      else if (nx > nz) uv.push(z / t, y / t);
      else uv.push(x / t, y / t);
    }
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  }
  g.setIndex(m.indices);
  g.computeBoundingSphere();
  g.computeBoundingBox();
  return g;
}

const shapeOf = (poly: V2[], holes: V2[][] = []) => {
  const s = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(x, -z)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, z]) => new THREE.Vector2(x, -z))));
  return s;
};
/** Polígono horizontal (com furos opcionais) em y. UVs em metros (x, -z): use texture.repeat = 1/ladrilho. */
export function polygonGeometry(poly: V2[], y = 0, holes: V2[][] = []): THREE.BufferGeometry {
  const g = new THREE.ShapeGeometry(shapeOf(poly, holes));
  g.rotateX(-Math.PI / 2);
  g.translate(0, y, 0);
  return g;
}
/** Prisma vertical a partir de um polígono (de y0 a y0+h). */
export function extrudePolygon(poly: V2[], y0: number, h: number, holes: V2[][] = []): THREE.BufferGeometry {
  const g = new THREE.ExtrudeGeometry(shapeOf(poly, holes), { depth: h, bevelEnabled: false });
  g.rotateX(-Math.PI / 2);
  g.translate(0, y0, 0);
  return g;
}
