/**
 * PLANOS DE FUNDO PARALLAX EM PIXEL ART — RIO DE JANEIRO
 * Montanhas da Zona Oeste (Maciço da Pedra Branca), Morro com Casario Orgânico e Céu Dinâmico
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, HORIZON_Y, TIME_PALETTES } from '../engine/Constants.js';
import { PixelPainter as P } from '../sprites/PixelPainter.js';

export class ParallaxBackdrop {
  constructor() {
    this.clouds = [
      { x: 50, y: 45, w: 90, speed: 0.12 },
      { x: 380, y: 70, w: 120, speed: 0.08 },
      { x: 720, y: 35, w: 100, speed: 0.15 },
      { x: 1100, y: 80, w: 140, speed: 0.07 },
      { x: 1550, y: 50, w: 110, speed: 0.11 }
    ];

    this.kites = [
      { x: 420, y: 110, color: '#ef4444', tailLength: 28, phase: 0 },
      { x: 890, y: 95, color: '#eab308', tailLength: 32, phase: 1.5 },
      { x: 1420, y: 130, color: '#3b82f6', tailLength: 26, phase: 3.1 }
    ];

    this.morroCache = null;
    this.mountainsCache = null;
    this.initCaches();
  }

  initCaches() {
    this.mountainsCache = this.renderDistantMountains();
    this.morroCache = this.renderFavelaHill();
  }

  // 1. Montanhas Distantes (Maciço da Pedra Branca / Pão de Açúcar ao longe)
  renderDistantMountains() {
    const w = 2400, h = 220;
    const { canvas, ctx } = P.createBuffer(w, h);

    // Silhueta rochosa da cordilheira carioca com picos íngremes
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 30) {
      // Picos procedurais com formações graníticas típicas do Rio
      const peak1 = Math.sin(x * 0.003) * 60;
      const peak2 = Math.cos(x * 0.008) * 35;
      const peak3 = Math.sin(x * 0.02) * 15;
      const y = h - 70 + peak1 + peak2 + peak3;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Camada frontal mais escura de morros intermediários
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 25) {
      const y = h - 45 + Math.sin(x * 0.005 + 1.2) * 40 + Math.cos(x * 0.015) * 20;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    return canvas;
  }

  // 2. O Morro Carioca com Casario Orgânico (Favela / Comunidade Típica)
  renderFavelaHill() {
    const w = 2600, h = 260;
    const { canvas, ctx } = P.createBuffer(w, h);

    // Base do morro em rocha e mata atlântica verde escura
    ctx.fillStyle = '#1e381b';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 20) {
      const y = h - 90 + Math.sin(x * 0.004) * 65 + Math.cos(x * 0.01) * 30;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Casario orgânico sobreposto (Centenas de pequenas casas de tijolo e cores vivas)
    const houseColors = ['#b45309', '#9a3412', '#78350f', '#0284c7', '#16a34a', '#eab308', '#dc2626', '#f1f5f9'];
    for (let x = 30; x < w - 60; x += 11) {
      const hillY = h - 90 + Math.sin(x * 0.004) * 65 + Math.cos(x * 0.01) * 30;
      const numHouses = 2 + Math.floor(((x * 7) % 5));

      for (let i = 0; i < numHouses; i++) {
        const hx = x + ((i * 5) % 9) - 4;
        const hy = hillY + 15 + i * 16;
        if (hy < h - 10) {
          const hw = 14 + (i % 3) * 3;
          const hh = 12 + (i % 2) * 3;
          const color = houseColors[(x + i * 3) % houseColors.length];

          // Casa de tijolo/pintada
          P.fillRect(ctx, hx, hy, hw, hh, color);
          // Telhado plano com laje ou telha cinza
          P.fillRect(ctx, hx - 1, hy, hw + 2, 2, '#64748b');

          // Caixa d'água azul miniatura (presente em quase todas as casas!)
          if ((x + i) % 3 === 0) {
            P.fillRect(ctx, hx + hw - 6, hy - 4, 5, 4, '#1d4ed8');
          }

          // Janelinha iluminada
          P.fillRect(ctx, hx + 3, hy + 4, 3, 3, '#fef08a');
          // Antena de TV espinha de peixe no topo
          if ((x + i) % 4 === 0) {
            P.line(ctx, hx + 3, hy - 6, hx + 3, hy, '#475569', 1);
            P.line(ctx, hx + 1, hy - 4, hx + 5, hy - 4, '#475569', 1);
          }
        }
      }
    }

    // Vegetação tropical entremeada entre as casas
    for (let x = 20; x < w - 40; x += 18) {
      const hillY = h - 90 + Math.sin(x * 0.004) * 65 + Math.cos(x * 0.01) * 30;
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(x, hillY + 25, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas;
  }

  // Renderiza todo o Backdrop com Parallax proporcional à posição X da Câmera
  render(ctx, cameraX, timePalette, timeRatio = 0, isStorm = false) {
    // 1. CÉU DINÂMICO GRADIENTE
    const skyGrad = ctx.createLinearGradient(0, 0, 0, HORIZON_Y + 50);
    skyGrad.addColorStop(0, isStorm ? '#1e293b' : timePalette.skyTop);
    skyGrad.addColorStop(0.5, isStorm ? '#334155' : timePalette.skyMid);
    skyGrad.addColorStop(1, isStorm ? '#475569' : timePalette.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, HORIZON_Y + 70);

    // 2. SOL OU LUA
    if (!isStorm) {
      const celestialX = 180 + (timeRatio * 580);
      const celestialY = timePalette.sunY;
      ctx.fillStyle = timePalette.sunColor;
      ctx.beginPath();
      ctx.arc(celestialX, celestialY, 22, 0, Math.PI * 2);
      ctx.fill();

      // Halo / Brilho atmosférico
      ctx.fillStyle = 'rgba(254, 240, 138, 0.12)';
      ctx.beginPath();
      ctx.arc(celestialX, celestialY, 44, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. NUVENS EM PIXEL ART
    ctx.fillStyle = isStorm ? 'rgba(71, 85, 105, 0.85)' : 'rgba(255, 255, 255, 0.65)';
    this.clouds.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x > 2600) cloud.x = -150;
      const screenX = cloud.x - cameraX * 0.05;
      if (screenX > -180 && screenX < CANVAS_WIDTH + 80) {
        this.drawPixelCloud(ctx, screenX, cloud.y, cloud.w);
      }
    });

    // 4. PIPAS NO CÉU (Carioca empinando pipa)
    if (!isStorm) {
      this.kites.forEach(kite => {
        kite.phase += 0.04;
        const kx = kite.x - cameraX * 0.15;
        const ky = kite.y + Math.sin(kite.phase) * 6;
        if (kx > -50 && kx < CANVAS_WIDTH + 50) {
          // Corpo do losango da pipa
          ctx.fillStyle = kite.color;
          ctx.beginPath();
          ctx.moveTo(kx, ky - 6);
          ctx.lineTo(kx + 5, ky);
          ctx.lineTo(kx, ky + 6);
          ctx.lineTo(kx - 5, ky);
          ctx.closePath();
          ctx.fill();

          // Rabiola ondulando ao vento
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(kx, ky + 6);
          for (let s = 1; s <= 5; s++) {
            const rx = kx - s * 3 + Math.sin(kite.phase + s * 0.7) * 4;
            const ry = ky + 6 + s * 4;
            ctx.lineTo(rx, ry);
          }
          ctx.stroke();
        }
      });
    }

    // 5. MONTANHAS DISTANTES (Parallax Factor: 0.10)
    const mountX = -(cameraX * 0.10) % 1200;
    ctx.drawImage(this.mountainsCache, mountX, HORIZON_Y - 140);
    ctx.drawImage(this.mountainsCache, mountX + 1200, HORIZON_Y - 140);

    // 6. O MORRO / FAVELA CARIOCA (Parallax Factor: 0.22)
    const morroX = -(cameraX * 0.22) % 1300;
    ctx.drawImage(this.morroCache, morroX, HORIZON_Y - 95);
    ctx.drawImage(this.morroCache, morroX + 1300, HORIZON_Y - 95);
  }

  drawPixelCloud(ctx, x, y, w) {
    const h = 18;
    ctx.fillRect(Math.floor(x), Math.floor(y + 6), w, h - 6);
    ctx.fillRect(Math.floor(x + 10), Math.floor(y + 2), w - 20, 4);
    ctx.fillRect(Math.floor(x + 20), Math.floor(y), w - 40, 2);
  }
}
