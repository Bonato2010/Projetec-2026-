import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { FIELD, COURTS } from '../data/parkStructures';
import { rectFence } from '../geometry/fence';
import { ribbonMesh, polylineSegs } from '../geometry/ribbon';
import { appendMesh, emptyMesh } from '../geometry/mesh';
import type { V2, V3 } from '../geometry/vec';
import { polygonGeometry, toGeometry } from './geo';
import { getMaterials } from './materials';
import { Cyl, Box } from './helpers';

const circle = (cx: number, cz: number, r: number, n = 40, a0 = 0, a1 = Math.PI * 2): V2[] =>
  Array.from({ length: n + 1 }, (_, i) => [cx + Math.cos(a0 + ((a1 - a0) * i) / n) * r, cz + Math.sin(a0 + ((a1 - a0) * i) / n) * r] as V2);
const rectLine = (w: number, d: number, cx = 0, cz = 0): V2[] => [
  [cx - w / 2, cz - d / 2], [cx + w / 2, cz - d / 2], [cx + w / 2, cz + d / 2], [cx - w / 2, cz + d / 2]
];

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

function BasketballHoop({ x, dir }: { x: number; dir: 1 | -1 }) {
  const M = getMaterials();
  const P = (dx: number, y: number, z: number): V3 => [x + dir * dx, y, z];
  return (
    <group>
      <Cyl a={P(0.8, 0, 0)} b={P(0.8, 3.2, 0)} r={0.07} material={M.metalDark} />
      <Cyl a={P(0.8, 3.2, 0)} b={P(0.2, 3.3, 0)} r={0.06} material={M.metalDark} />
      <Box p={[x + dir * 0.15, 3.3, 0]} s={[0.04, 1.05, 1.8]} material={M.glass} />
      <mesh position={[x, 3.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.ring}>
        <torusGeometry args={[0.23, 0.02, 8, 16]} />
      </mesh>
    </group>
  );
}

function BeachVolleyballNet({ d }: { d: number }) {
  const M = getMaterials();
  const hw = d / 2 - 1.2;
  return (
    <group>
      <Cyl a={[0, 0, -hw]} b={[0, 2.6, -hw]} r={0.06} material={M.metalDark} />
      <Cyl a={[0, 0, hw]} b={[0, 2.6, hw]} r={0.06} material={M.metalDark} />
      <mesh position={[0, 1.95, 0]} material={M.fencePanel}>
        <boxGeometry args={[0.03, 1.0, hw * 2]} />
      </mesh>
      <mesh position={[0, 2.45, 0]} material={M.paint}>
        <boxGeometry args={[0.06, 0.08, hw * 2]} />
      </mesh>
      <Cyl a={[0, 1.95, -4.0]} b={[0, 3.2, -4.0]} r={0.015} material={M.ring} />
      <Cyl a={[0, 1.95, 4.0]} b={[0, 3.2, 4.0]} r={0.015} material={M.ring} />
    </group>
  );
}

function Floodlight({ x, z, h = 14 }: { x: number; z: number; h?: number }) {
  const M = getMaterials();
  return (
    <group>
      <Cyl a={[x, 0, z]} b={[x, h, z]} r={0.16} material={M.metalDark} segments={10} />
      <Box p={[x, h + 0.3, z]} s={[2.0, 0.35, 0.8]} material={M.lampHead} cast={false} />
    </group>
  );
}

/**
 * Complexo Poliesportivo Oficial do Parque Realengo Susana Naspolini
 * - Duas quadras em ângulo diagonal com pintura em Azul Royal (#1d4ed8) e Azul Celeste (#38bdf8)
 * - Garrafões e círculo central em Laranja (#ea580c)
 * - Demarcações regulamentares de basquete e futsal
 * - Laje estrutural elevada em 12cm sobre o terreno
 */
export const ParkSports = memo(function ParkSports() {
  const M = getMaterials();

  const field = useMemo(() => {
    const pw = FIELD.pitchW, pd = FIELD.pitchD, hx = pw / 2;
    const lines = emptyMesh();
    const add = (pts: V2[], closed = false) => appendMesh(lines, ribbonMesh(polylineSegs(pts, 0.12, closed), 0.07, false));
    add(rectLine(pw, pd), true);
    add([[0, -pd / 2], [0, pd / 2]]);
    add(circle(0, 0, 6.0));
    for (const s of [-1, 1]) {
      add(rectLine(11.0, 20.0, s * (hx - 5.5)), true);
      add(circle(s * (hx - 8.0), 0, 6.0, 20, s > 0 ? Math.PI - 0.93 : -0.93, s > 0 ? Math.PI + 0.93 : 0.93));
    }
    const fence = rectFence(0, 0, FIELD.w, FIELD.d, 0, 1.3, 4);
    return {
      pitch: polygonGeometry(rectLine(FIELD.w, FIELD.d), 0.03),
      lines: toGeometry(lines, { uv: 'planar' }),
      frame: toGeometry(fence.frame),
      panel: toGeometry(fence.panel),
    };
  }, []);

  const courts = useMemo(() => COURTS.map((c) => {
    const isSand = c.id.includes('areia');
    const isHalf = c.id.includes('meia');
    const f = isSand ? null : rectFence(0, 0, c.w, c.d, 0, 3.2, 3);
    const lines = emptyMesh();
    const add = (pts: V2[], closed = false) => appendMesh(lines, ribbonMesh(polylineSegs(pts, 0.08, closed), 0.08, false));

    const playW = c.w - (isSand ? 1.5 : 2.6);
    const playD = c.d - (isSand ? 1.5 : 2.6);

    if (isSand) {
      add(rectLine(16, 8), true);
      add([[0, -4], [0, 4]]);
    } else if (isHalf) {
      add(rectLine(playW, playD), true);
      add(circle(-playW / 2 + 1.8, 0, 5.8, 24, -Math.PI / 2, Math.PI / 2));
    } else {
      add(rectLine(playW, playD), true);
      add([[0, -playD / 2], [0, playD / 2]]);
      add(circle(0, 0, 2.2, 28));
      for (const s of [-1, 1]) {
        add(circle(s * (playW / 2 - 1.6), 0, 6.2, 24, s > 0 ? Math.PI - 1.2 : -1.2, s > 0 ? Math.PI + 1.2 : 1.2));
      }
    }

    return {
      c,
      isSand,
      isHalf,
      playW,
      playD,
      lines: toGeometry(lines, { uv: 'planar' }),
      frame: f ? toGeometry(f.frame) : null,
      panel: f ? toGeometry(f.panel) : null,
    };
  }), []);

  return (
    <group>
      {/* 1. Campo de Futebol Society */}
      <group position={[FIELD.cx, 0, FIELD.cz]}>
        <mesh geometry={field.pitch} material={M.field} receiveShadow />
        <mesh geometry={field.lines} material={M.line} receiveShadow />
        <Goal x={-FIELD.pitchW / 2} dir={-1} width={5} height={2.2} depth={1.4} />
        <Goal x={FIELD.pitchW / 2} dir={1} width={5} height={2.2} depth={1.4} />
        <mesh geometry={field.frame} material={M.metalDark} castShadow />
        <mesh geometry={field.panel} material={M.fencePanel} />
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([a, b], i) => (
          <Floodlight key={i} x={a * (FIELD.w / 2 + 1)} z={b * (FIELD.d / 2 + 1)} />
        ))}
      </group>

      {/* 2. Quadras Poliesportivas com pintura técnica em Azul Celeste, Azul Royal e Laranja */}
      {courts.map(({ c, isSand, isHalf, playW, playD, lines, frame, panel }) => (
        <group key={c.id} position={[c.cx, 0, c.cz]} rotation-y={c.rot}>
          {/* Laje Estrutural Elevada em Concreto/Resina Acrílica (Azul Celeste no basquete, Madeira na areia) */}
          <Box p={[0, 0.06, 0]} s={[c.w, 0.12, c.d]} material={isSand ? M.wood : M.courtSkyBlue} />

          {/* Piso do campo interno de jogo (Azul Royal no basquete, Areia na areia) */}
          <mesh rotation-x={-Math.PI / 2} position-y={0.125} material={isSand ? M.sand : M.courtRoyalBlue} receiveShadow>
            <planeGeometry args={[playW, playD]} />
          </mesh>

          {/* Garrafões e círculo central em Laranja Vivo */}
          {!isSand && (
            <>
              {/* Garrafão 1 */}
              <mesh rotation-x={-Math.PI / 2} position={[-playW / 2 + 2.5, 0.13, 0]} material={M.courtOrange} receiveShadow>
                <planeGeometry args={[5.0, 4.8]} />
              </mesh>
              {/* Garrafão 2 (apenas quadra inteira) */}
              {!isHalf && (
                <>
                  <mesh rotation-x={-Math.PI / 2} position={[playW / 2 - 2.5, 0.13, 0]} material={M.courtOrange} receiveShadow>
                    <planeGeometry args={[5.0, 4.8]} />
                  </mesh>
                  {/* Círculo Central */}
                  <mesh rotation-x={-Math.PI / 2} position={[0, 0.13, 0]} material={M.courtOrange} receiveShadow>
                    <circleGeometry args={[2.0, 32]} />
                  </mesh>
                </>
              )}
            </>
          )}

          {/* Linhas demarcatórias brancas nítidas */}
          <mesh geometry={lines} position-y={0.135} material={isSand ? M.ring : M.line} receiveShadow />

          {isSand ? (
            <BeachVolleyballNet d={c.d} />
          ) : (
            <group position-y={0.12}>
              <BasketballHoop x={-(playW) / 2} dir={-1} />
              {!isHalf && <BasketballHoop x={(playW) / 2} dir={1} />}
              {frame && <mesh geometry={frame} material={M.metalDark} castShadow />}
              {panel && <mesh geometry={panel} material={M.fencePanel} />}
              <Floodlight x={-c.w / 2 - 1} z={0} h={10} />
              <Floodlight x={c.w / 2 + 1} z={0} h={10} />
            </group>
          )}
        </group>
      ))}
    </group>
  );
});
