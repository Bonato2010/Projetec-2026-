import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { NAVE, CULTURAL_PAVILION } from '../data/parkStructures';
import { getMaterials } from './materials';
import { Box, Cyl, Instances, matrixAt } from './helpers';

interface PavilionProps {
  cx: number;
  cz: number;
  w: number;
  d: number;
  atrium: number;
  h: number;
  name: string;
  hasSolar?: boolean;
}

/**
 * Pavilhão Arquitetônico Contemporâneo com Pátio Interno Aberto (Atrium)
 * Reprodução fiel da Nave do Conhecimento e do Pavilhão Cultural do Parque Realengo Susana Naspolini.
 * - Planta quadrada com pátio central descoberto ajardinado
 * - 4 alas perimetrais funcionais (laboratórios maker, auditórios, salas de aula digital)
 * - Fachadas externas com faixas horizontais de vidro e brises
 * - Caixilharia envidraçada voltada para o pátio interno
 * - Cobertura plana com beiral em balanço de 1.2m
 * - Usina fotovoltaica solar na cobertura
 * - Marquise de acesso acolhedora com rampa acessível (NBR 9050)
 */
function CourtyardPavilion({ cx, cz, w, d, atrium, h, hasSolar = true }: PavilionProps) {
  const M = getMaterials();
  const aw = atrium;
  const ad = atrium;
  const wingDepthZ = (d - ad) / 2;
  const wingWidthX = (w - aw) / 2;
  const centerZOffset = (d + ad) / 4;
  const centerXOffset = (w + aw) / 4;

  // Painéis solares na cobertura
  const solarPanels = useMemo(() => {
    if (!hasSolar) return [];
    const panels: THREE.Matrix4[] = [];
    const rows = 3;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Asa Norte
        const xN = -w / 2 + 2.5 + (c / (cols - 1)) * (w - 5.0);
        const zN = -d / 2 + 1.8 + (r / (rows - 1)) * (wingDepthZ - 3.2);
        panels.push(matrixAt(xN, h + 0.45, zN, 0, 1.6, 0.04, 1.0));

        // Asa Sul
        const zS = ad / 2 + 1.4 + (r / (rows - 1)) * (wingDepthZ - 3.2);
        panels.push(matrixAt(xN, h + 0.45, zS, 0, 1.6, 0.04, 1.0));
      }
    }
    return panels;
  }, [w, d, ad, wingDepthZ, h, hasSolar]);

  const solarGeo = useMemo(() => new THREE.BoxGeometry(1.6, 0.04, 1.0), []);

  return (
    <group position={[cx, 0, cz]}>
      {/* 1. Paredes Perimetrais das 4 Alas */}
      {/* Asa Norte */}
      <Box p={[0, h / 2, -centerZOffset]} s={[w, h, wingDepthZ]} material={M.wallWhite} />
      {/* Asa Sul */}
      <Box p={[0, h / 2, centerZOffset]} s={[w, h, wingDepthZ]} material={M.wallWhite} />
      {/* Asa Oeste */}
      <Box p={[-centerXOffset, h / 2, 0]} s={[wingWidthX, h, ad]} material={M.wallWhite} />
      {/* Asa Leste */}
      <Box p={[centerXOffset, h / 2, 0]} s={[wingWidthX, h, ad]} material={M.wallWhite} />

      {/* 2. Cobertura Plana com Beiral em Balanço (1.2m) e Abertura Central */}
      <Box p={[0, h + 0.2, -centerZOffset - 0.5]} s={[w + 2.4, 0.4, wingDepthZ + 1.0]} material={M.wallWhite} />
      <Box p={[0, h + 0.2, centerZOffset + 0.5]} s={[w + 2.4, 0.4, wingDepthZ + 1.0]} material={M.wallWhite} />
      <Box p={[-centerXOffset - 0.5, h + 0.2, 0]} s={[wingWidthX + 1.0, 0.4, ad]} material={M.wallWhite} />
      <Box p={[centerXOffset + 0.5, h + 0.2, 0]} s={[wingWidthX + 1.0, 0.4, ad]} material={M.wallWhite} />

      {/* Platibanda / topo da laje em cinza arquitetônico */}
      <Box p={[0, h + 0.41, -centerZOffset - 0.5]} s={[w + 2.0, 0.04, wingDepthZ + 0.6]} material={M.roof} />
      <Box p={[0, h + 0.41, centerZOffset + 0.5]} s={[w + 2.0, 0.04, wingDepthZ + 0.6]} material={M.roof} />
      <Box p={[-centerXOffset - 0.5, h + 0.41, 0]} s={[wingWidthX + 0.6, 0.04, ad]} material={M.roof} />
      <Box p={[centerXOffset + 0.5, h + 0.41, 0]} s={[wingWidthX + 0.6, 0.04, ad]} material={M.roof} />

      {/* 3. Vidraças e Caixilharia do Pátio Interno Central */}
      <Box p={[0, h / 2, -ad / 2 + 0.08]} s={[aw - 0.4, h * 0.82, 0.12]} material={M.glass} cast={false} />
      <Box p={[0, h / 2, ad / 2 - 0.08]} s={[aw - 0.4, h * 0.82, 0.12]} material={M.glass} cast={false} />
      <Box p={[-aw / 2 + 0.08, h / 2, 0]} s={[0.12, h * 0.82, ad - 0.4]} material={M.glass} cast={false} />
      <Box p={[aw / 2 - 0.08, h / 2, 0]} s={[0.12, h * 0.82, ad - 0.4]} material={M.glass} cast={false} />

      {/* 4. Paisagismo do Pátio Central (Jardim Interno / Deck) */}
      <Box p={[0, 0.06, 0]} s={[aw - 0.8, 0.12, ad - 0.8]} material={M.soil} />
      {/* Deck de circulação no pátio */}
      <Box p={[0, 0.14, 0]} s={[aw * 0.55, 0.08, ad * 0.55]} material={M.deck} />
      {/* Vaso ornamental central */}
      <Box p={[0, 0.35, 0]} s={[1.4, 0.5, 1.4]} material={M.wallC} />
      <Box p={[0, 0.9, 0]} s={[1.2, 0.6, 1.2]} material={M.foliage} />

      {/* 5. Fachada Externa: Faixas Contínuas de Janelas e Brises */}
      {/* Fachada Oeste (com vista para o parque) */}
      <Box p={[-w / 2 - 0.04, 2.8, -centerZOffset]} s={[0.1, 1.6, wingDepthZ - 2]} material={M.glass} cast={false} />
      <Box p={[-w / 2 - 0.04, 2.8, centerZOffset]} s={[0.1, 1.6, wingDepthZ - 2]} material={M.glass} cast={false} />
      {/* Fachada Leste */}
      <Box p={[w / 2 + 0.04, 2.8, 0]} s={[0.1, 1.6, d - 4]} material={M.glass} cast={false} />
      {/* Fachada Norte e Sul */}
      <Box p={[0, 2.8, -d / 2 - 0.04]} s={[w - 4, 1.6, 0.1]} material={M.glass} cast={false} />
      <Box p={[0, 2.8, d / 2 + 0.04]} s={[w - 4, 1.6, 0.1]} material={M.glass} cast={false} />

      {/* 6. Marquise de Entrada Principal (Face Oeste) */}
      <Box p={[-w / 2 - 2.8, 3.8, 0]} s={[5.6, 0.24, 7.5]} material={M.wallWhite} />
      <Cyl a={[-w / 2 - 5.2, 0, -3.2]} b={[-w / 2 - 5.2, 3.8, -3.2]} r={0.12} material={M.metalDark} segments={8} />
      <Cyl a={[-w / 2 - 5.2, 0, 3.2]} b={[-w / 2 - 5.2, 3.8, 3.2]} r={0.12} material={M.metalDark} segments={8} />

      {/* Porta de Entrada Social Envidraçada */}
      <Box p={[-w / 2 - 0.02, 1.8, 0]} s={[0.14, 3.2, 4.8]} material={M.glass} cast={false} />

      {/* Rampa Acessível Suave */}
      <Box p={[-w / 2 - 3.2, 0.12, 0]} s={[6.2, 0.24, 6.0]} material={M.concrete} />

      {/* 7. Usina Solar Fotovoltaica na Cobertura */}
      {hasSolar && <Instances geometry={solarGeo} material={M.solar} matrices={solarPanels} />}

      {/* 8. Climatização e Automação Predial na Cobertura */}
      <Box p={[w / 4, h + 0.9, -d / 4]} s={[2.8, 1.0, 2.2]} material={M.metalDark} />
    </group>
  );
}

/**
 * Pavilhões Institucionais e Comunitários do Parque Realengo Susana Naspolini:
 * 1. Nave do Conhecimento (Polo de Tecnologia, Inclusão Digital e Inovação)
 * 2. Pavilhão Cultural e de Apoio Comunitário
 */
export const ParkKnowledgeBuilding = memo(function ParkKnowledgeBuilding() {
  return (
    <group>
      {/* Nave do Conhecimento Oficial */}
      <CourtyardPavilion
        cx={NAVE.cx}
        cz={NAVE.cz}
        w={NAVE.w}
        d={NAVE.d}
        atrium={NAVE.atrium}
        h={5.4}
        name="Nave do Conhecimento"
        hasSolar={true}
      />

      {/* Pavilhão Cultural e Comunitário */}
      <CourtyardPavilion
        cx={CULTURAL_PAVILION.cx}
        cz={CULTURAL_PAVILION.cz}
        w={CULTURAL_PAVILION.w}
        d={CULTURAL_PAVILION.d}
        atrium={CULTURAL_PAVILION.atrium}
        h={4.8}
        name="Pavilhão Cultural"
        hasSolar={true}
      />
    </group>
  );
});
