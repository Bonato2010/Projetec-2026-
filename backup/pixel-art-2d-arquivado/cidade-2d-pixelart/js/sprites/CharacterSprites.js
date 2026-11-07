/**
 * SPRITES DE PERSONAGENS E PEDESTRES CARIOCAS EM PIXEL ART
 * Ciclos de animação de caminhada (walk cycles de 4 frames):
 * - Gari da Comlurb (uniforme laranja clássico)
 * - Morador carioca de bermuda e chinelo
 * - Torcedor com camisa de time
 * - Vira-lata caramelo animado
 * - Estudante com uniforme da rede municipal do Rio
 * - Enfermeira / Médico da Clínica da Família
 * - Pedestres com guarda-chuva para o modo enchente
 */

import { PixelPainter as P } from './PixelPainter.js';

export class CharacterSprites {
  /**
   * 1. GARI DA COMLURB (Ícone dos garis do Rio de Janeiro)
   * Uniforme laranja fluorescente com faixa refletiva branca e vassoura
   */
  static createGariFrames(direction = 1) {
    const frames = [];
    for (let frame = 0; frame < 4; frame++) {
      const w = 24, h = 34;
      const { canvas, ctx } = P.createBuffer(w, h);

      const cx = 10;
      // Boné / Boné com aba
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(cx - 2, 4, 8, 4);
      ctx.fillRect(cx - (direction === 1 ? 1 : 3), 6, direction === 1 ? 10 : 7, 2);

      // Rosto
      ctx.fillStyle = '#b45309';
      ctx.fillRect(cx, 8, 5, 4);

      // Camisa da Comlurb (Laranja brilhante com listra branca refletiva)
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(cx - 2, 12, 8, 8);
      ctx.fillStyle = '#f8fafc'; // Faixa refletiva
      ctx.fillRect(cx - 2, 15, 8, 2);

      // Animação das Pernas / Calça Laranja
      ctx.fillStyle = '#ea580c';
      let leg1Offset = 0, leg2Offset = 0;
      if (frame === 0) { leg1Offset = -2; leg2Offset = 2; }
      else if (frame === 1) { leg1Offset = 0; leg2Offset = 0; }
      else if (frame === 2) { leg1Offset = 2; leg2Offset = -2; }
      else if (frame === 3) { leg1Offset = 0; leg2Offset = 0; }

      // Perna 1
      ctx.fillRect(cx - 1 + leg1Offset, 20, 3, 9);
      ctx.fillStyle = '#f8fafc'; // Refletivo na canela
      ctx.fillRect(cx - 1 + leg1Offset, 24, 3, 1);
      ctx.fillStyle = '#0f172a'; // Botina preta
      ctx.fillRect(cx - 2 + leg1Offset, 29, 4, 3);

      // Perna 2
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(cx + 2 + leg2Offset, 20, 3, 9);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(cx + 2 + leg2Offset, 24, 3, 1);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx + 1 + leg2Offset, 29, 4, 3);

      // Braço segurando vassoura de gari
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(cx + (direction === 1 ? 4 : -2), 14, 3, 6);

      // Vassoura de gari (cabo longo e palha amarela)
      const broomX = direction === 1 ? cx + 6 : cx - 4;
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(broomX, 10);
      ctx.lineTo(broomX + (direction * 4), 31);
      ctx.stroke();
      // Piaçava da vassoura
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(broomX + (direction * 3) - 2, 29, 5, 4);

      frames.push(canvas);
    }
    return frames;
  }

  /**
   * 2. MORADOR CARIOCA (Bermuda florida, camiseta cavada e chinelo de dedo)
   */
  static createMoradorFrames(direction = 1, hasUmbrella = false) {
    const frames = [];
    for (let frame = 0; frame < 4; frame++) {
      const w = 26, h = 36;
      const { canvas, ctx } = P.createBuffer(w, h);
      const cx = 10;

      // Guarda-chuva aberto no topo (se modo chuva)
      if (hasUmbrella) {
        ctx.fillStyle = '#2563eb'; // Tecido azul
        ctx.beginPath();
        ctx.arc(cx + 2, 8, 11, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + 2, 8);
        ctx.lineTo(cx + 2, 16);
        ctx.stroke();
      }

      const headY = hasUmbrella ? 10 : 4;

      // Cabelo e Rosto
      ctx.fillStyle = '#0f172a'; // Cabelo corte na régua / degradê
      ctx.fillRect(cx, headY, 5, 2);
      ctx.fillStyle = '#d97706'; // Tom de pele pardo/moreno
      ctx.fillRect(cx, headY + 2, 5, 5);

      // Regata branca cavada
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 1, headY + 7, 7, 8);

      // Bermuda de praia estampada (azul turquesa)
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(cx - 1, headY + 15, 7, 6);

      // Pernas animadas
      let l1 = 0, l2 = 0;
      if (frame === 0) { l1 = -2; l2 = 2; }
      else if (frame === 1) { l1 = 0; l2 = 0; }
      else if (frame === 2) { l1 = 2; l2 = -2; }

      ctx.fillStyle = '#d97706';
      ctx.fillRect(cx + l1, headY + 21, 2, 6);
      ctx.fillRect(cx + 3 + l2, headY + 21, 2, 6);

      // Chinelo de borracha (Havaianas azul)
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(cx - 1 + l1, headY + 27, 4, 2);
      ctx.fillRect(cx + 2 + l2, headY + 27, 4, 2);

      frames.push(canvas);
    }
    return frames;
  }

  /**
   * 3. VIRA-LATA CARAMELO (O clássico cachorro brasileiro correndo)
   */
  static createCarameloFrames(direction = 1) {
    const frames = [];
    for (let frame = 0; frame < 4; frame++) {
      const w = 24, h = 18;
      const { canvas, ctx } = P.createBuffer(w, h);

      const color = '#d97706'; // Amarelo/caramelo clássico
      const bodyX = direction === 1 ? 5 : 8;

      // Tronco do cachorro
      P.fillRect(ctx, bodyX, 5, 10, 6, color);

      // Cabeça e focinho preto
      const headX = direction === 1 ? bodyX + 8 : bodyX - 4;
      P.fillRect(ctx, headX, 2, 5, 5, color);
      P.fillRect(ctx, direction === 1 ? headX + 4 : headX - 1, 4, 2, '#0f172a'); // Focinho
      P.fillRect(ctx, headX + 1, 1, 2, 2, '#92400e'); // Orelha caída

      // Rabo espetado para cima abanando
      const tailX = direction === 1 ? bodyX - 2 : bodyX + 10;
      const tailY = frame % 2 === 0 ? 3 : 1;
      P.fillRect(ctx, tailX, tailY, 2, 4, color);

      // Patas animadas correndo
      let p1 = 0, p2 = 0;
      if (frame === 0) { p1 = -2; p2 = 2; }
      else if (frame === 1) { p1 = 1; p2 = -1; }
      else if (frame === 2) { p1 = 2; p2 = -2; }
      else if (frame === 3) { p1 = -1; p2 = 1; }

      P.fillRect(ctx, bodyX + 2 + p1, 11, 2, 5, color);
      P.fillRect(ctx, bodyX + 7 + p2, 11, 2, 5, color);

      frames.push(canvas);
    }
    return frames;
  }

  /**
   * 4. ESTUDANTE COM UNIFORME DA PREFEITURA DO RIO DE JANEIRO
   * Camiseta branca com a clássica listra horizontal azul marinho
   */
  static createEstudanteFrames(direction = 1) {
    const frames = [];
    for (let frame = 0; frame < 4; frame++) {
      const w = 22, h = 32;
      const { canvas, ctx } = P.createBuffer(w, h);
      const cx = 9;

      // Cabeça e cabelo
      ctx.fillStyle = '#451a03';
      ctx.fillRect(cx, 3, 5, 3);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(cx, 6, 5, 4);

      // Uniforme Oficial da PCRJ (Branco com listra azul marinho no peito)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 1, 10, 7, 7);
      ctx.fillStyle = '#1e3a8a'; // Faixa azul marinho da Prefeitura
      ctx.fillRect(cx - 1, 12, 7, 2);

      // Mochila escolar nas costas
      const bagX = direction === 1 ? cx - 3 : cx + 5;
      ctx.fillStyle = '#dc2626'; // Mochila vermelha
      ctx.fillRect(bagX, 10, 3, 8);

      // Calça jeans azul
      ctx.fillStyle = '#1d4ed8';
      let l1 = 0, l2 = 0;
      if (frame === 0) { l1 = -2; l2 = 2; }
      else if (frame === 2) { l1 = 2; l2 = -2; }

      ctx.fillRect(cx + l1, 17, 2, 9);
      ctx.fillRect(cx + 3 + l2, 17, 2, 9);

      // Tênis preto
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 1 + l1, 26, 3, 2);
      ctx.fillRect(cx + 2 + l2, 26, 3, 2);

      frames.push(canvas);
    }
    return frames;
  }

  /**
   * 5. ENFERMEIRA / MÉDICA DA CLÍNICA DA FAMÍLIA (Jaleco Branco)
   */
  static createEnfermeiraFrames(direction = 1) {
    const frames = [];
    for (let frame = 0; frame < 4; frame++) {
      const w = 22, h = 34;
      const { canvas, ctx } = P.createBuffer(w, h);
      const cx = 9;

      // Cabelo preso em coque
      ctx.fillStyle = '#172554';
      ctx.fillRect(cx - 1, 2, 7, 4);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cx, 6, 5, 4);

      // Jaleco branco sobreposto
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 2, 10, 9, 11);
      ctx.strokeRect(cx - 2, 10, 9, 11, '#cbd5e1');
      // Estetoscópio azul no pescoço
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx + 2, 13, 3, 0, Math.PI);
      ctx.stroke();

      // Calça branca profissional
      let l1 = 0, l2 = 0;
      if (frame === 0) { l1 = -2; l2 = 2; }
      else if (frame === 2) { l1 = 2; l2 = -2; }

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(cx - 1 + l1, 21, 3, 8);
      ctx.fillRect(cx + 3 + l2, 21, 3, 8);

      // Calçado hospitalar confortável (Crocs branco)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(cx - 1 + l1, 29, 4, 3);
      ctx.fillRect(cx + 2 + l2, 29, 4, 3);

      frames.push(canvas);
    }
    return frames;
  }
}
