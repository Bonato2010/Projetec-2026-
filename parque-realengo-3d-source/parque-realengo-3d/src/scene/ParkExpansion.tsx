import { memo, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { PLANNED_EXPANSION } from '../data/parkPhases';
import { ribbonMesh } from '../geometry/ribbon';
import { centroid } from '../geometry/poly';
import { polygonGeometry, toGeometry } from './geo';
import { getMaterials } from './materials';

/** Expansão anunciada: apenas uma ZONA INDICATIVA (sem planta). Nenhuma estrutura futura é posicionada. */
export const ParkExpansion = memo(function ParkExpansion() {
  const M = getMaterials();
  const g = useMemo(() => {
    const z = PLANNED_EXPANSION.indicativeZone;
    const dashes = ribbonMesh(
      z.flatMap((a, i) => { const b = z[(i + 1) % z.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / len, uz = (b[1] - a[1]) / len; const s = []; for (let t = 0; t + 4 < len; t += 8) s.push({ a: [a[0] + ux * t, a[1] + uz * t] as [number, number], b: [a[0] + ux * (t + 4), a[1] + uz * (t + 4)] as [number, number], w: 0.8 }); return s; }),
      0.3, false,
    );
    return { fill: polygonGeometry(z, 0.25), dashes: toGeometry(dashes, { uv: 'planar' }), c: centroid(z) };
  }, []);
  return (
    <group>
      <mesh geometry={g.fill} material={M.expansion} />
      <mesh geometry={g.dashes} material={M.ring} />
      <Html position={[g.c[0], 6, g.c[1]]} center distanceFactor={160} zIndexRange={[10, 0]}>
        <div className="scene-label planned">Expansão planejada · posição indicativa, sem planta</div>
      </Html>
    </group>
  );
});
