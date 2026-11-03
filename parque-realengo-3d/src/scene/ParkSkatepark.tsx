import { memo, useMemo } from 'react';
import { buildSkatepark } from '../geometry/skate';
import { rectFence } from '../geometry/fence';
import { SKATE } from '../data/parkStructures';
import { toGeometry } from './geo';
import { getMaterials } from './materials';

/** Pista de skate: superfície contínua (campo de alturas), coping, corrimão e cercamento. Desenho provisório. */
export const ParkSkatepark = memo(function ParkSkatepark() {
  const M = getMaterials();
  const g = useMemo(() => {
    const sk = buildSkatepark({ w: SKATE.w, d: SKATE.d, cell: SKATE.cell });
    const f = rectFence(0, 0, SKATE.w + SKATE.fencePad * 2, SKATE.d + SKATE.fencePad * 2, 0, 2.4);
    return { surface: toGeometry(sk.surface, { uv: 'box' }), coping: toGeometry(sk.coping), rails: toGeometry(sk.rails), frame: toGeometry(f.frame), panel: toGeometry(f.panel) };
  }, []);
  return (
    <group position={[SKATE.cx, 0, SKATE.cz]} rotation={[0, SKATE.rot, 0]}>
      <mesh geometry={g.surface} material={M.skate} castShadow receiveShadow />
      <mesh geometry={g.coping} material={M.metal} castShadow />
      <mesh geometry={g.rails} material={M.metalDark} castShadow />
      <mesh geometry={g.frame} material={M.metalDark} castShadow />
      <mesh geometry={g.panel} material={M.fencePanel} />
    </group>
  );
});
