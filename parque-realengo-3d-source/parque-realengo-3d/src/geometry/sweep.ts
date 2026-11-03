import { V3, add3, sub3, scale3, dot3, cross3, norm3, len3 } from './vec';
import { MeshData, emptyMesh, orientOutward } from './mesh';

function tangents(pts: V3[]): V3[] {
  const n = pts.length;
  return pts.map((_, i) => {
    const t = norm3(sub3(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)]));
    return len3(t) < 1e-9 ? ([0, 1, 0] as V3) : t;
  });
}

/** Tubo de seção circular com raio variável, por transporte paralelo de quadros. */
export function sweepTube(pts: V3[], radiusAt: (t: number) => number, radial = 8, caps = true): MeshData {
  const m = emptyMesh();
  const n = pts.length;
  if (n < 2) return m;
  const T = tangents(pts);
  const axis: V3 = Math.abs(T[0][1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  let N = norm3(cross3(T[0], axis));
  for (let i = 0; i < n; i++) {
    if (i > 0) {
      const proj = sub3(N, scale3(T[i], dot3(N, T[i])));
      N = len3(proj) < 1e-9 ? N : norm3(proj);
    }
    const B = cross3(T[i], N);
    const r = radiusAt(i / (n - 1));
    for (let j = 0; j < radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const o = add3(scale3(N, Math.cos(a) * r), scale3(B, Math.sin(a) * r));
      m.positions.push(pts[i][0] + o[0], pts[i][1] + o[1], pts[i][2] + o[2]);
    }
  }
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * radial + j, b = i * radial + ((j + 1) % radial);
      const c = (i + 1) * radial + j, d = (i + 1) * radial + ((j + 1) % radial);
      m.indices.push(a, b, c, b, d, c);
    }
  }
  if (caps) {
    for (const end of [0, n - 1]) {
      const c = m.positions.length / 3;
      m.positions.push(pts[end][0], pts[end][1], pts[end][2]);
      for (let j = 0; j < radial; j++) {
        const a = end * radial + j, b = end * radial + ((j + 1) % radial);
        if (end === 0) m.indices.push(c, b, a);
        else m.indices.push(c, a, b);
      }
    }
  }
  return m;
}

/** Varre um perfil plano (lateral, vertical) ao longo de uma trajetória. Perfil em sentido anti-horário. */
export function sweepProfile(pts: V3[], profile: [number, number][]): MeshData {
  const m = emptyMesh();
  const n = pts.length, K = profile.length;
  if (n < 2) return m;
  const T = tangents(pts);
  for (let i = 0; i < n; i++) {
    let L = cross3([0, 1, 0], T[i]);
    L = len3(L) < 1e-6 ? [1, 0, 0] : norm3(L);
    const V = norm3(cross3(T[i], L));
    let miter = 1;
    if (i > 0 && i < n - 1) {
      const prev = norm3(sub3(pts[i], pts[i - 1]));
      miter = 1 / Math.max(0.4, dot3(prev, T[i]));
    }
    for (const [px, py] of profile) {
      const p = add3(add3(pts[i], scale3(L, px * miter)), scale3(V, py));
      m.positions.push(p[0], p[1], p[2]);
    }
  }
  for (let i = 0; i < n - 1; i++) {
    for (let k = 0; k < K; k++) {
      const a = i * K + k, b = i * K + ((k + 1) % K);
      const c = (i + 1) * K + k, d = (i + 1) * K + ((k + 1) % K);
      m.indices.push(a, b, c, b, d, c);
    }
  }
  for (const end of [0, n - 1]) {
    const c = m.positions.length / 3;
    let cx = 0, cy = 0, cz = 0;
    for (let k = 0; k < K; k++) { cx += m.positions[(end * K + k) * 3]; cy += m.positions[(end * K + k) * 3 + 1]; cz += m.positions[(end * K + k) * 3 + 2]; }
    m.positions.push(cx / K, cy / K, cz / K);
    for (let k = 0; k < K; k++) {
      const a = end * K + k, b = end * K + ((k + 1) % K);
      if (end === 0) m.indices.push(c, b, a);
      else m.indices.push(c, a, b);
    }
  }
  return orientOutward(m);
}
