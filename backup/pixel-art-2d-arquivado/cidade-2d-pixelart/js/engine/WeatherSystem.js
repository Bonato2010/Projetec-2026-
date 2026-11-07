/**
 * SISTEMA CLIMÁTICO E DE ILUMINAÇÃO DINÂMICA
 * Chuva de pixels, trovões, relâmpagos, reflexos no chão e distorção de calor
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, STREET_BOTTOM_Y } from './Constants.js';

export class WeatherSystem {
  constructor() {
    this.raindrops = [];
    this.splashes = [];
    this.lightningTimer = 0;
    this.lightningAlpha = 0;

    // Inicializa conjunto de gotas de chuva
    for (let i = 0; i < 280; i++) {
      this.raindrops.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        speed: 480 + Math.random() * 200,
        len: 8 + Math.random() * 8
      });
    }
  }

  update(delta, scenario, isStorm) {
    // 1. Atualiza partículas de chuva se estiver em temporal / inundação
    if (isStorm || scenario === 'inundacao') {
      this.raindrops.forEach(drop => {
        drop.y += drop.speed * delta;
        drop.x -= 70 * delta; // Inclinação pelo vento

        if (drop.y > STREET_BOTTOM_Y - 20) {
          // Cria respingo no chão
          if (Math.random() < 0.25) {
            this.splashes.push({
              x: drop.x,
              y: drop.y,
              radius: 1,
              life: 0.12
            });
          }
          drop.y = -10;
          drop.x = Math.random() * (CANVAS_WIDTH + 150);
        }
      });

      // Atualiza respingos
      for (let i = this.splashes.length - 1; i >= 0; i--) {
        const s = this.splashes[i];
        s.radius += 24 * delta;
        s.life -= delta;
        if (s.life <= 0) this.splashes.splice(i, 1);
      }

      // Relâmpagos procedurais
      this.lightningTimer -= delta;
      if (this.lightningTimer <= 0) {
        if (Math.random() < 0.35) {
          this.lightningAlpha = 0.85; // Clarão forte
        }
        this.lightningTimer = 4 + Math.random() * 6;
      }
      if (this.lightningAlpha > 0) {
        this.lightningAlpha -= delta * 2.5;
        if (this.lightningAlpha < 0) this.lightningAlpha = 0;
      }
    }
  }

  render(ctx, scenario, isStorm, timePalette, isBlackout) {
    // 1. EFEITO DE ONDA DE CALOR (Heat Haze nos 42°C de Realengo)
    if (scenario === 'onda_calor') {
      ctx.fillStyle = 'rgba(254, 215, 170, 0.18)'; // Tom âmbar quente
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Distorção senoidal de ar quente sobre o asfalto
      const time = Date.now() * 0.005;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      for (let y = 380; y < 520; y += 8) {
        const waveX = Math.sin(y * 0.08 + time) * 4;
        ctx.fillRect(waveX, y, CANVAS_WIDTH, 3);
      }
    }

    // 2. CHUVA E RESPINGOS (TEMPORAL CARIOCA)
    if (isStorm || scenario === 'inundacao') {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      this.raindrops.forEach(drop => {
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 3, drop.y + drop.len);
      });
      ctx.stroke();

      // Respingos na calçada
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.7)';
      this.splashes.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Clarão do Relâmpago
      if (this.lightningAlpha > 0) {
        ctx.fillStyle = `rgba(240, 249, 255, ${this.lightningAlpha})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }

    // 3. AMBIENTE NOTURNO OU BLECAUTE (Filtro atmosférico multiplicativo)
    const isNight = timePalette.name === 'Noite Carioca';
    if (isNight || isBlackout) {
      const alpha = isBlackout ? 0.88 : 0.65;
      ctx.fillStyle = `rgba(8, 10, 24, ${alpha})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }
}
