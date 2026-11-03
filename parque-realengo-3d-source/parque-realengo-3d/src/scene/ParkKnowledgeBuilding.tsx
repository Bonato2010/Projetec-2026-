import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { NAVE } from '../data/parkStructures';
import { getMaterials } from './materials';
import { Box, Cyl, Instances, matrixAt } from './helpers';

/**
 * Nave do Conhecimento — volumetria externa PROVISÓRIA (a planta real não está documentada):
 * bloco de dois pavimentos com cobertura inclinada em laje, bloco envidraçado baixo, brises, marquise de acesso e coluna dupla.
 * Área em planta 36 × 23 = 828 m² (≈ 830 m² divulgados); o formato é suposição.
 */
export const ParkKnowledgeBuilding = memo(function ParkKnowledgeBuilding() {
  const M = getMaterials();
  const { cx, cz, w, d } = NAVE;
  const g = useMemo(() => {
    const ext = (pts: [number, number][], depth: number) => {
      const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
      const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
      geo.translate(0, 0, -depth / 2);
      return geo;
    };
    return {
      wall: ext([[-18, 0], [6, 0], [6, 9.2], [-18, 7.4]], d),
      roof: ext([[-19.5, 7.2875], [7.5, 9.3125], [7.5, 9.8125], [-19.5, 7.7875]], d + 3),
      fin: new THREE.BoxGeometry(1, 1, 1),
    };
  }, [d]);
  const fins = useMemo(() => Array.from({ length: 15 }, (_, i) => matrixAt(-17 + i * 1.5, 5.8, d / 2 + 0.3, 0, 0.12, 3.2, 0.5)), [d]);
  void w;
  return (
    <group position={[cx, 0, cz]}>
      <mesh geometry={g.wall} material={M.wallC} castShadow receiveShadow />
      <mesh geometry={g.roof} material={M.roof} castShadow receiveShadow />
      <Box p={[12, 2.4, 0]} s={[12, 4.8, d - 1]} material={M.glass} />
      <Box p={[12, 5.0, 0]} s={[13.5, 0.3, d + 1]} material={M.roof} />
      <Box p={[-6, 1.9, d / 2 + 0.05]} s={[20, 3.4, 0.12]} material={M.glass} cast={false} />
      <Box p={[-6, 1.9, -d / 2 - 0.05]} s={[20, 3.4, 0.12]} material={M.glass} cast={false} />
      <Instances geometry={g.fin} material={M.paint} matrices={fins} />
      <Box p={[-6, 4.3, d / 2 + 2.4]} s={[9, 0.3, 4.8]} material={M.paint} />
      <Cyl a={[-10.2, 0, d / 2 + 4.3]} b={[-10.2, 4.3, d / 2 + 4.3]} r={0.14} material={M.metalDark} segments={10} />
      <Cyl a={[-1.8, 0, d / 2 + 4.3]} b={[-1.8, 4.3, d / 2 + 4.3]} r={0.14} material={M.metalDark} segments={10} />
      <Box p={[-10, 9.9, -4]} s={[3, 1.2, 2.4]} material={M.metalDark} />
      <Box p={[-4, 9.6, 3]} s={[2.4, 1, 2]} material={M.metalDark} />
    </group>
  );
});
