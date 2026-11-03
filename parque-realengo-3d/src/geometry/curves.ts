import { V3, dist3, lerp3 } from './vec';

/** Catmull-Rom uniforme. Extremidades duplicadas em curvas abertas. */
export function catmullRom(ctrl: V3[], seg = 12, closed = false): V3[] {
  const n = ctrl.length;
  if (n < 2) return ctrl.slice();
  const get = (i: number): V3 => (closed ? ctrl[((i % n) + n) % n] : ctrl[Math.min(n - 1, Math.max(0, i))]);
  const out: V3[] = [];
  const count = closed ? n : n - 1;
  for (let i = 0; i < count; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    for (let s = 0; s < seg; s++) {
      const t = s / seg, t2 = t * t, t3 = t2 * t;
      const p: V3 = [0, 0, 0];
      for (let k = 0; k < 3; k++) {
        p[k] = 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
      }
      out.push(p);
    }
  }
  if (!closed) out.push([ctrl[n - 1][0], ctrl[n - 1][1], ctrl[n - 1][2]]);
  return out;
}

export function polylineLength(pts: V3[]): number {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += dist3(pts[i - 1], pts[i]);
  return l;
}

/** Reamostra por comprimento de arco com passo ~`step` (extremidades preservadas). */
export function resampleByStep(pts: V3[], step: number): V3[] {
  const total = polylineLength(pts);
  const n = Math.max(2, Math.round(total / step) + 1);
  return resampleCount(pts, n);
}
export function resampleCount(pts: V3[], n: number): V3[] {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + dist3(pts[i - 1], pts[i]));
  const total = cum[cum.length - 1];
  const out: V3[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const d = (i / (n - 1)) * total;
    while (j < pts.length - 2 && cum[j + 1] < d) j++;
    const seg = cum[j + 1] - cum[j];
    out.push(lerp3(pts[j], pts[j + 1], seg < 1e-9 ? 0 : (d - cum[j]) / seg));
  }
  return out;
}
