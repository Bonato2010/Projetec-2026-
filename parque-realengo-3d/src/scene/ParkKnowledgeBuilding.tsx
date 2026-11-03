import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { NAVE } from '../data/parkStructures';
import { getMaterials } from './materials';
import { Box, Cyl, Instances, matrixAt } from './helpers';

/**
 * Nave do Conhecimento — pavilhão comunitário de tecnologia e inovação digital em Realengo.
 * Volumetria contemporânea com laje inclinada, bloco envidraçado, brises de proteção solar e marquise de acesso.
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
    const hw = w / 2;
    const wMain = w * 0.65;
    return {
      wall: ext([[-hw, 0], [-hw + wMain, 0], [-hw + wMain, 8.5], [-hw, 7.0]], d),
      roof: ext([[-hw - 0.8, 6.9], [-hw + wMain + 0.8, 8.6], [-hw + wMain + 0.8, 9.0], [-hw - 0.8, 7.3]], d + 2),
      fin: new THREE.BoxGeometry(1, 1, 1),
    };
  }, [w, d]);

  const fins = useMemo(() => {
    const hw = w / 2;
    const wMain = w * 0.65;
    const count = 12;
    return Array.from({ length: count }, (_, i) =>
      matrixAt(-hw + 1.2 + i * (wMain / count), 5.4, d / 2 + 0.25, 0, 0.12, 2.8, 0.45)
    );
  }, [w, d]);

  const hw = w / 2;
  const wMain = w * 0.65;
  const wGlass = w - wMain;
  const xGlass = -hw + wMain + wGlass / 2;

  return (
    <group position={[cx, 0, cz]}>
      <mesh geometry={g.wall} material={M.wallC} castShadow receiveShadow />
      <mesh geometry={g.roof} material={M.roof} castShadow receiveShadow />

      {/* Bloco envidraçado de laboratórios / salas maker */}
      <Box p={[xGlass, 2.2, 0]} s={[wGlass - 0.5, 4.4, d - 1]} material={M.glass} />
      <Box p={[xGlass, 4.5, 0]} s={[wGlass + 0.5, 0.25, d + 0.5]} material={M.roof} />

      {/* Fachada envidraçada frontal */}
      <Box p={[-hw + wMain / 2, 1.8, d / 2 + 0.05]} s={[wMain - 2, 3.2, 0.12]} material={M.glass} cast={false} />
      <Instances geometry={g.fin} material={M.paint} matrices={fins} />

      {/* Marquise de acolhimento e colunas */}
      <Box p={[-hw + wMain / 2, 3.8, d / 2 + 1.8]} s={[7, 0.25, 3.6]} material={M.paint} />
      <Cyl a={[-hw + wMain / 2 - 3, 0, d / 2 + 3.2]} b={[-hw + wMain / 2 - 3, 3.8, d / 2 + 3.2]} r={0.12} material={M.metalDark} segments={8} />
      <Cyl a={[-hw + wMain / 2 + 3, 0, d / 2 + 3.2]} b={[-hw + wMain / 2 + 3, 3.8, d / 2 + 3.2]} r={0.12} material={M.metalDark} segments={8} />

      {/* Equipamentos de climatização na cobertura */}
      <Box p={[-hw + 4, 8.8, -2]} s={[2.4, 0.9, 2.0]} material={M.metalDark} />
    </group>
  );
});
