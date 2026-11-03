import { memo, useMemo } from 'react';
import { getParkModel } from '../systems/parkModel';
import { toGeometry } from './geo';
import { getMaterials } from './materials';

/** Passarelas elevadas: tabuleiro com espessura, guarda-corpos e colunas de apoio. */
export const ParkWalkways = memo(function ParkWalkways() {
  const M = getMaterials();
  const items = useMemo(() => getParkModel().walkways.map((w) => ({
    id: w.spec.id,
    deck: toGeometry(w.mesh.deck, { uv: 'box' }),
    rails: toGeometry(w.mesh.rails),
    supports: toGeometry(w.mesh.supports, { uv: 'box' }),
  })), []);
  return (
    <group>
      {items.map((w) => (
        <group key={w.id}>
          <mesh geometry={w.deck} material={M.deck} castShadow receiveShadow />
          <mesh geometry={w.rails} material={M.metalDark} castShadow />
          <mesh geometry={w.supports} material={M.support} castShadow receiveShadow />
        </group>
      ))}
    </group>
  );
});
