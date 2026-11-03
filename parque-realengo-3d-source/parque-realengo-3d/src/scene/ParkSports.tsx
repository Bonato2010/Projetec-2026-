import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { FIELD, COURTS } from '../data/parkStructures';
import { rectFence } from '../geometry/fence';
import { ribbonMesh, polylineSegs } from '../geometry/ribbon';
import { rectPoly } from '../geometry/poly';
import { appendMesh, emptyMesh } from '../geometry/mesh';
import type { V2, V3 } from '../geometry/vec';
import { polygonGeometry, toGeometry } from './geo';
import { getMaterials } from './materials';
import { Cyl, Box } from './helpers';

const circle = (cx: number, cz: number, r: number, n = 40, a0 = 0, a1 = Math.PI * 2): V2[] =>
  Array.from({ length: n + 1 }, (_, i) => [cx + Math.cos(a0 + ((a1 - a0) * i) / n) * r, cz + Math.sin(a0 + ((a1 - a0) * i) / n) * r] as V2);
const rectLine = (w: number, d: number, cx = 0, cz = 0): V2[] => [[cx - w / 2, cz - d / 2], [cx + w / 2, cz - d / 2], [cx + w / 2, cz + d / 2], [cx - w / 2, cz + d / 2]];

function Goal({ x, dir, width = 7.32, height = 2.44, depth = 1.6 }: { x: number; dir: 1 | -1; width?: number; height?: number; depth?: number }) {
  const M = getMaterials();
  const hw = width / 2;
  const P = (dx: number, y: number, z: number): V3 => [x + dir * dx, y, z];
  return (
    <group>
      <Cyl a={P(0, 0, -hw)} b={P(0, height, -hw)} r={0.06} material={M.paint} />
      <Cyl a={P(0, 0, hw)} b={P(0, height, hw)} r={0.06} material={M.paint} />
      <Cyl a={P(0, height, -hw)} b={P(0, height, hw)} r={0.06} material={M.paint} />
      <Cyl a={P(depth, 0, -hw)} b={P(depth, height * 0.6, -hw)} r={0.03} material={M.paint} />
      <Cyl a={P(depth, 0, hw)} b={P(depth, height * 0.6, hw)} r={0.03} material={M.paint} />
      <mesh position={[x + dir * depth * 0.5, height / 2, 0]} material={M.fencePanel}><boxGeometry args={[depth, height, width]} /></mesh>
    </group>
  );
}
function Floodlight({ x, z, h = 16 }: { x: number; z: number; h?: number }) {
  const M = getMaterials();
  return (
    <group>
      <Cyl a={[x, 0, z]} b={[x, h, z]} r={0.18} material={M.metalDark} segments={10} />
      <Box p={[x, h + 0.3, z]} s={[2.2, 0.4, 1.0]} material={M.lampHead} cast={false} />
    </group>
  );
}

/** Campo (marcações no padrão 11x11 como HIPÓTESE), quadras com piso/linhas/cercamento, refletores. Tudo provisório. */
export const ParkSports = memo(function ParkSports() {
  const M = getMaterials();
  const field = useMemo(() => {
    const pw = FIELD.pitchW, pd = FIELD.pitchD, hx = pw / 2;
    const lines = emptyMesh();
    const add = (pts: V2[], closed = false) => appendMesh(lines, ribbonMesh(polylineSegs(pts, 0.12, closed), 0.07, false));
    add(rectLine(pw, pd), true);
    add([[0, -pd / 2], [0, pd / 2]]);
    add(circle(0, 0, 9.15));
    for (const s of [-1, 1]) {
      add(rectLine(16.5, 40.32, s * (hx - 8.25)), true);
      add(rectLine(5.5, 18.32, s * (hx - 2.75)), true);
      add(circle(s * (hx - 11), 0, 9.15, 20, s > 0 ? Math.PI - 0.93 : -0.93, s > 0 ? Math.PI + 0.93 : 0.93));
    }
    const fence = rectFence(0, 0, FIELD.w, FIELD.d, 0, 1.3, 4);
    return {
      pitch: polygonGeometry(rectLine(FIELD.w, FIELD.d), 0.03),
      lines: toGeometry(lines, { uv: 'planar' }),
      frame: toGeometry(fence.frame), panel: toGeometry(fence.panel),
    };
  }, []);
  const courts = useMemo(() => COURTS.map((c, i) => {
    const f = rectFence(0, 0, c.w, c.d, 0, 3, 3);
    const lines = emptyMesh();
    const add = (pts: V2[], closed = false) => appendMesh(lines, ribbonMesh(polylineSegs(pts, 0.08, closed), 0.07, false));
    add(rectLine(c.w - 3, c.d - 3), true); add([[0, -(c.d - 3) / 2], [0, (c.d - 3) / 2]]); add(circle(0, 0, 2.6, 28));
    return {
      c, mat: i % 2 === 0 ? M.courtBlue : M.courtGreen,
      apron: polygonGeometry(rectLine(c.w, c.d), 0.03), surface: polygonGeometry(rectLine(c.w - 2, c.d - 2), 0.04),
      lines: toGeometry(lines, { uv: 'planar' }), frame: toGeometry(f.frame), panel: toGeometry(f.panel),
    };
  }), [M]);
  void rectPoly; void THREE;
  return (
    <group>
      <group position={[FIELD.cx, 0, FIELD.cz]}>
        <mesh geometry={field.pitch} material={M.field} receiveShadow />
        <mesh geometry={field.lines} material={M.line} receiveShadow />
        <Goal x={-FIELD.pitchW / 2} dir={-1} /><Goal x={FIELD.pitchW / 2} dir={1} />
        <mesh geometry={field.frame} material={M.metalDark} castShadow />
        <mesh geometry={field.panel} material={M.fencePanel} />
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([a, b], i) => <Floodlight key={i} x={a * (FIELD.w / 2 + 1)} z={b * (FIELD.d / 2 + 1)} />)}
      </group>
      {courts.map(({ c, mat, apron, surface, lines, frame, panel }) => (
        <group key={c.id} position={[c.cx, 0, c.cz]}>
          <mesh geometry={apron} material={M.concrete} receiveShadow />
          <mesh geometry={surface} material={mat} receiveShadow />
          <mesh geometry={lines} material={M.line} receiveShadow />
          <Goal x={-(c.w - 3) / 2} dir={-1} width={3} height={2} depth={1} /><Goal x={(c.w - 3) / 2} dir={1} width={3} height={2} depth={1} />
          <mesh geometry={frame} material={M.metalDark} castShadow />
          <mesh geometry={panel} material={M.fencePanel} />
          <Floodlight x={-c.w / 2 - 1} z={0} h={9} /><Floodlight x={c.w / 2 + 1} z={0} h={9} />
        </group>
      ))}
    </group>
  );
});
