import type { V2, V3 } from '../geometry/vec';
import { dist3 } from '../geometry/vec';
import { resampleByStep } from '../geometry/curves';
import { segIntersectsPoly } from '../geometry/poly';
import { PATH_NODES, PATH_EDGES, DEFAULT_PATH_WIDTH } from '../data/parkPaths';
import { FOOTPRINTS } from '../data/parkStructures';
import type { ParkModel } from './parkModel';

export interface NavNode { id: string; pos: V3; elevated: boolean }
export interface NavEdge { a: string; b: string; w: number; elevated: boolean; width: number }
export interface RouteResult { nodeIds: string[]; length: number; points: V3[]; usesWalkway: boolean }

class MinHeap {
  private h: { k: number; id: string }[] = [];
  get size() { return this.h.length; }
  push(k: number, id: string) {
    const h = this.h; h.push({ k, id });
    let i = h.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (h[p].k <= h[i].k) break; [h[p], h[i]] = [h[i], h[p]]; i = p; }
  }
  pop(): { k: number; id: string } | undefined {
    const h = this.h; if (!h.length) return undefined;
    const top = h[0], last = h.pop()!;
    if (h.length) {
      h[0] = last; let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < h.length && h[l].k < h[m].k) m = l;
        if (r < h.length && h[r].k < h[m].k) m = r;
        if (m === i) break; [h[m], h[i]] = [h[i], h[m]]; i = m;
      }
    }
    return top;
  }
}

/** Grafo de navegação. A geometria dos caminhos é independente: calcular rota não reconstrói nada. */
export class NavGraph {
  nodes = new Map<string, NavNode>();
  adj = new Map<string, { to: string; edge: NavEdge }[]>();
  edges: NavEdge[] = [];
  addNode(n: NavNode) { this.nodes.set(n.id, n); if (!this.adj.has(n.id)) this.adj.set(n.id, []); }
  addEdge(a: string, b: string, elevated: boolean, width: number, extraCost = 1) {
    const A = this.nodes.get(a), B = this.nodes.get(b);
    if (!A || !B) throw new Error(`aresta com nó inexistente: ${a} – ${b}`);
    const e: NavEdge = { a, b, w: dist3(A.pos, B.pos) * extraCost, elevated, width };
    this.edges.push(e);
    this.adj.get(a)!.push({ to: b, edge: e });
    this.adj.get(b)!.push({ to: a, edge: e });
  }
  nearest(x: number, z: number, opts: { groundOnly?: boolean } = {}): NavNode | null {
    let best: NavNode | null = null, bd = Infinity;
    for (const n of this.nodes.values()) {
      if (opts.groundOnly && n.elevated) continue;
      const d = Math.hypot(n.pos[0] - x, n.pos[2] - z);
      if (d < bd) { bd = d; best = n; }
    }
    return best;
  }
  route(from: string, to: string): RouteResult | null {
    if (!this.nodes.has(from) || !this.nodes.has(to)) return null;
    const dist = new Map<string, number>([[from, 0]]);
    const prev = new Map<string, string>();
    const heap = new MinHeap(); heap.push(0, from);
    const done = new Set<string>();
    while (heap.size) {
      const { k, id } = heap.pop()!;
      if (done.has(id)) continue; done.add(id);
      if (id === to) break;
      for (const { to: nx, edge } of this.adj.get(id) ?? []) {
        const nd = k + edge.w;
        if (nd < (dist.get(nx) ?? Infinity)) { dist.set(nx, nd); prev.set(nx, id); heap.push(nd, nx); }
      }
    }
    if (!dist.has(to)) return null;
    const ids = [to];
    while (ids[0] !== from) ids.unshift(prev.get(ids[0])!);
    const points = ids.map((i) => this.nodes.get(i)!.pos);
    const usesWalkway = ids.some((i) => this.nodes.get(i)!.elevated);
    return { nodeIds: ids, length: dist.get(to)!, points, usesWalkway };
  }
}

export interface NavBuild { graph: NavGraph; violations: string[] }

/** Constrói o grafo: caminhos no solo + passarelas como caminhos elevados (com nós de plataforma nas torres). */
export function buildNavGraph(model: ParkModel): NavBuild {
  const g = new NavGraph();
  const violations: string[] = [];
  for (const n of PATH_NODES) g.addNode({ id: n.id, pos: [n.pos[0], 0, n.pos[1]], elevated: false });
  const obstacles = FOOTPRINTS.filter((f) => f.blocksPath);
  for (const [a, b, w] of PATH_EDGES) {
    const A = g.nodes.get(a)!.pos, B = g.nodes.get(b)!.pos;
    const width = w ?? DEFAULT_PATH_WIDTH;
    const dx = B[0] - A[0], dz = B[2] - A[2], l = Math.hypot(dx, dz) || 1;
    const nx = (-dz / l) * (width / 2), nz = (dx / l) * (width / 2);
    for (const o of obstacles) {
      const lines: [V2, V2][] = [
        [[A[0], A[2]], [B[0], B[2]]],
        [[A[0] + nx, A[2] + nz], [B[0] + nx, B[2] + nz]],
        [[A[0] - nx, A[2] - nz], [B[0] - nx, B[2] - nz]],
      ];
      if (lines.some(([p, q]) => segIntersectsPoly(p, q, o.poly))) violations.push(`caminho ${a}–${b} atravessa ${o.id}`);
    }
    g.addEdge(a, b, false, width);
  }
  for (const w of model.walkways) {
    const c = w.mesh.centerline;
    const idx: number[] = [];
    const step = Math.max(1, Math.round(10 / 1.5));
    for (let i = 0; i < c.length; i += step) idx.push(i);
    if (idx[idx.length - 1] !== c.length - 1) idx.push(c.length - 1);
    const ids = idx.map((i) => `${w.spec.id}:${i}`);
    idx.forEach((i, k) => g.addNode({ id: ids[k], pos: c[i], elevated: c[i][1] > 1.0 }));
    for (let k = 1; k < ids.length; k++) g.addEdge(ids[k - 1], ids[k], true, w.spec.width, 1.1);
    w.spec.waypoints.forEach((wp, wi) => {
      if (wp.kind !== 'tower') return;
      const t = model.towers.find((x) => x.spec.id === wp.tower)!;
      const pid = `${wp.tower}:plat${wp.platform}`;
      if (!g.nodes.has(pid)) g.addNode({ id: pid, pos: [t.spec.x, t.model.platforms[wp.platform].y, t.spec.z], elevated: true });
      g.addEdge(pid, wi === 0 ? ids[0] : ids[ids.length - 1], true, w.spec.width, 1.1);
    });
    for (const gl of w.spec.groundLinks ?? []) g.addEdge(gl.end === 'start' ? ids[0] : ids[ids.length - 1], gl.node, false, w.spec.width);
  }
  void resampleByStep;
  return { graph: g, violations };
}
