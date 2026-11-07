/**
 * SPRITES DE VEÍCULOS TÍPICOS DO RIO DE JANEIRO EM PIXEL ART
 * Ônibus Carioca, Táxi Amarelinho, Fiat Uno da Firma com Escada, Fusca, Motoboy e Viaturas
 */

import { PixelPainter as P } from './PixelPainter.js';

export class VehicleSprites {
  /**
   * 1. ÔNIBUS URBANO CARIOCA (Consórcio Santa Cruz / Internorte)
   * Letreiro digital LED laranja, janelas com passageiros, faróis e escapamento
   */
  static createBus(direction = 1) { // 1 = direita, -1 = esquerda
    const w = 155, h = 50;
    const { canvas, ctx } = P.createBuffer(w, h);

    // Carroceria principal (Prata/Branco com faixas azul e amarela do Rio)
    P.fillRect(ctx, 4, 6, w - 8, 34, '#f8fafc');
    // Teto aerodinâmico curvo
    P.fillRect(ctx, 8, 2, w - 16, 5, '#e2e8f0');

    // Faixas decorativas municipais do Rio de Janeiro
    P.fillRect(ctx, 4, 30, w - 8, 4, '#1e40af'); // Azul royal
    P.fillRect(ctx, 4, 34, w - 8, 2, '#eab308'); // Amarelo ouro

    // Letreiro Digital LED Superior (Laranja luminoso)
    const signX = direction === 1 ? w - 46 : 8;
    P.fillRect(ctx, signX, 7, 38, 7, '#0f172a');
    P.strokeRect(ctx, signX, 7, 38, 7, '#f97316');
    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 5px monospace';
    ctx.fillText('REALENGO', signX + 2, 13);

    // Pára-brisa frontal e vidro traseiro
    const frontWindshieldX = direction === 1 ? w - 24 : 6;
    P.fillRect(ctx, frontWindshieldX, 15, 18, 16, '#0284c7');
    P.fillRect(ctx, frontWindshieldX + 2, 16, 14, 3, 'rgba(255, 255, 255, 0.45)'); // Reflexo

    // Janelas laterais dos passageiros (sequência de 5 janelas)
    const startX = direction === 1 ? 12 : 28;
    for (let i = 0; i < 5; i++) {
      const jx = startX + i * 22;
      P.fillRect(ctx, jx, 15, 18, 14, '#0f172a');
      P.fillRect(ctx, jx + 1, 16, 16, 12, '#38bdf8');
      // Silhuetas dos passageiros
      if (i === 1 || i === 3) {
        P.fillRect(ctx, jx + 5, 20, 6, 7, '#1e293b'); // Cabeça e ombros
      }
    }

    // Portas pneumáticas bipartidas
    const doorX = direction === 1 ? w - 50 : 36;
    P.fillRect(ctx, doorX, 15, 14, 25, '#94a3b8');
    P.fillRect(ctx, doorX + 1, 17, 5, 10, '#38bdf8');
    P.fillRect(ctx, doorX + 7, 17, 5, 10, '#38bdf8');

    // Para-choque dianteiro e traseiro
    P.fillRect(ctx, 2, 36, w - 4, 5, '#334155');

    // Faróis dianteiros (LED branco/âmbar) e lanternas traseiras (vermelhas)
    if (direction === 1) {
      P.fillRect(ctx, w - 4, 34, 4, 4, '#fef08a'); // Farol dianteiro
      P.fillRect(ctx, 0, 32, 4, 6, '#dc2626');     // Lanterna traseira
    } else {
      P.fillRect(ctx, 0, 34, 4, 4, '#fef08a');
      P.fillRect(ctx, w - 4, 32, 4, 6, '#dc2626');
    }

    // Caixas de roda e Rodas de borracha com calotas pretas
    const wheel1X = direction === 1 ? 28 : w - 40;
    const wheel2X = direction === 1 ? w - 40 : 28;

    [wheel1X, wheel2X].forEach(wx => {
      // Caixa de roda recortada
      P.fillRect(ctx, wx - 1, 35, 18, 6, '#0f172a');
      // Pneu circular
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(wx + 8, 41, 8, 0, Math.PI * 2);
      ctx.fill();
      // Calota cinza
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(wx + 8, 41, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    return canvas;
  }

  /**
   * 2. TÁXI AMARELINHO DO RIO DE JANEIRO (com a clássica faixa azul horizontal)
   */
  static createTaxi(direction = 1) {
    const w = 75, h = 32;
    const { canvas, ctx } = P.createBuffer(w, h);

    // Carroceria amarela vibrante (#facc15)
    P.fillRect(ctx, 4, 14, w - 8, 12, '#facc15');
    // Cabine do teto
    const roofX = direction === 1 ? 18 : 16;
    P.fillRect(ctx, roofX, 6, 38, 9, '#facc15');

    // A ÍCONICA FAIXA AZUL DO TÁXI CARIOCA
    P.fillRect(ctx, 4, 19, w - 8, 3, '#1d4ed8');

    // Letreiro TAXI no teto
    P.fillRect(ctx, 32, 2, 14, 4, '#ffffff');
    P.strokeRect(ctx, 32, 2, 14, 4, '#dc2626');
    P.fillRect(ctx, 35, 3, 8, 2, '#dc2626');

    // Vidros (para-brisa inclinado, janelas e vidro traseiro)
    if (direction === 1) {
      P.fillRect(ctx, roofX + 24, 7, 12, 7, '#38bdf8'); // Pára-brisa
      P.fillRect(ctx, roofX + 13, 7, 9, 7, '#38bdf8');  // Janela passageiro
      P.fillRect(ctx, roofX + 2, 7, 9, 7, '#38bdf8');   // Janela motorista
    } else {
      P.fillRect(ctx, roofX + 2, 7, 12, 7, '#38bdf8');
      P.fillRect(ctx, roofX + 16, 7, 9, 7, '#38bdf8');
      P.fillRect(ctx, roofX + 27, 7, 9, 7, '#38bdf8');
    }

    // Faróis dianteiros e traseiros
    if (direction === 1) {
      P.fillRect(ctx, w - 3, 17, 3, 4, '#fef08a');
      P.fillRect(ctx, 0, 16, 3, 5, '#dc2626');
    } else {
      P.fillRect(ctx, 0, 17, 3, 4, '#fef08a');
      P.fillRect(ctx, w - 3, 16, 3, 5, '#dc2626');
    }

    // Rodas
    const w1 = direction === 1 ? 14 : w - 24;
    const w2 = direction === 1 ? w - 24 : 14;
    [w1, w2].forEach(wx => {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(wx + 5, 26, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(wx + 5, 26, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    return canvas;
  }

  /**
   * 3. FIAT UNO DA FIRMA COM ESCADA NO TETO
   * Carroceria quadrada branca e escada de alumínio presa no bagageiro
   */
  static createUnoFirma(direction = 1) {
    const w = 70, h = 34;
    const { canvas, ctx } = P.createBuffer(w, h);

    // Carroceria branca hatch quadrada
    P.fillRect(ctx, 4, 16, w - 8, 12, '#ffffff');
    P.strokeRect(ctx, 4, 16, w - 8, 12, '#cbd5e1');

    // Teto reto
    const roofX = direction === 1 ? 16 : 14;
    P.fillRect(ctx, roofX, 9, 36, 8, '#ffffff');

    // BAGAGEIRO E A FAMOSA ESCADA DE ALUMÍNIO NO TETO
    P.fillRect(ctx, roofX - 2, 8, 40, 2, '#475569'); // Trilho do bagageiro
    // Escada prateada com degraus
    P.fillRect(ctx, roofX - 8, 3, 48, 2, '#94a3b8');
    P.fillRect(ctx, roofX - 8, 6, 48, 2, '#94a3b8');
    for (let step = roofX - 6; step < roofX + 38; step += 6) {
      P.fillRect(ctx, step, 3, 2, 5, '#64748b');
    }

    // Vidros quadrados característicos do Uno
    P.fillRect(ctx, roofX + 4, 10, 12, 6, '#38bdf8');
    P.fillRect(ctx, roofX + 18, 10, 14, 6, '#38bdf8');

    // Para-choques plásticos pretos
    P.fillRect(ctx, 2, 22, w - 4, 5, '#1e293b');

    // Rodas com calotas de ferro cinza
    const w1 = direction === 1 ? 14 : w - 24;
    const w2 = direction === 1 ? w - 24 : 14;
    [w1, w2].forEach(wx => {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(wx + 5, 27, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(wx + 5, 27, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    return canvas;
  }

  /**
   * 4. VIATURA POLICIAL (PMERJ) COM GIROFLEX STROBE
   */
  static createViaturaPolicial(direction = 1) {
    const w = 78, h = 33;
    const { canvas, ctx } = P.createBuffer(w, h);

    // Pintura clássica branca com faixas pretas e vermelhas
    P.fillRect(ctx, 4, 15, w - 8, 12, '#ffffff');
    P.fillRect(ctx, 4, 19, w - 8, 4, '#1e293b'); // Faixa preta
    P.fillRect(ctx, 4, 23, w - 8, 1, '#dc2626'); // Faixa vermelha

    // Cabine
    const roofX = direction === 1 ? 20 : 16;
    P.fillRect(ctx, roofX, 7, 36, 9, '#ffffff');

    // GIROFLEX POLICIAL NO TETO (Metade azul, metade vermelho)
    P.fillRect(ctx, roofX + 12, 3, 7, 4, '#ef4444'); // Vermelho estroboscópico
    P.fillRect(ctx, roofX + 19, 3, 7, 4, '#3b82f6'); // Azul estroboscópico

    // Vidros fumê
    P.fillRect(ctx, roofX + 4, 8, 12, 7, '#0f172a');
    P.fillRect(ctx, roofX + 18, 8, 14, 7, '#0f172a');

    // Faróis
    if (direction === 1) {
      P.fillRect(ctx, w - 3, 17, 3, 4, '#fef08a');
      P.fillRect(ctx, 0, 16, 3, 5, '#dc2626');
    } else {
      P.fillRect(ctx, 0, 17, 3, 4, '#fef08a');
      P.fillRect(ctx, w - 3, 16, 3, 5, '#dc2626');
    }

    // Rodas
    const w1 = direction === 1 ? 16 : w - 24;
    const w2 = direction === 1 ? w - 24 : 16;
    [w1, w2].forEach(wx => {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(wx + 5, 27, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    return canvas;
  }

  /**
   * 5. MOTOBOY COM MOCHILA TÉRMICA DE APLICATIVO
   */
  static createMotoboy(direction = 1) {
    const w = 42, h = 32;
    const { canvas, ctx } = P.createBuffer(w, h);

    // Rodas da moto
    const r1X = direction === 1 ? 6 : 30;
    const r2X = direction === 1 ? 30 : 6;
    [r1X, r2X].forEach(rx => {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(rx + 4, 25, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(rx + 4, 25, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Chassi da moto preta/vermelha
    P.line(ctx, r1X + 4, 25, r2X + 4, 25, '#dc2626', 3);
    P.fillRect(ctx, 16, 18, 10, 6, '#dc2626'); // Tanque de gasolina

    // GUIDÃO E FAROL
    const hx = direction === 1 ? 28 : 12;
    P.line(ctx, hx, 15, hx + (direction * 4), 10, '#334155', 2);
    P.fillRect(ctx, hx + (direction * 3), 13, 3, 3, '#fef08a'); // Farol aceso

    // O MOTOQUEIRO
    const riderX = 14;
    P.fillRect(ctx, riderX + 4, 12, 7, 8, '#1e293b'); // Jaqueta preta
    // Capacete com viseira fumê
    ctx.fillStyle = '#ef4444'; // Capacete vermelho
    ctx.beginPath();
    ctx.arc(riderX + 7, 8, 4.5, 0, Math.PI * 2);
    ctx.fill();
    P.fillRect(ctx, riderX + (direction === 1 ? 8 : 4), 6, 3, 2, '#0f172a'); // Viseira

    // A MOCHILA TÉRMICA VERMELHA NAS COSTAS (Bag estilo iFood)
    const bagX = direction === 1 ? riderX - 3 : riderX + 10;
    P.fillRect(ctx, bagX, 7, 8, 12, '#ea1d2c');
    P.strokeRect(ctx, bagX, 7, 8, 12, '#b91c1c');
    // Fita refletiva amarela/branca na mochila
    P.fillRect(ctx, bagX + 1, 14, 6, 2, '#ffffff');

    return canvas;
  }
}
