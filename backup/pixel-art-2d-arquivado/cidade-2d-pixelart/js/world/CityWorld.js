/**
 * CENÁRIO URBANO PRINCIPAL — CIDADE DO RIO DE JANEIRO EM PIXEL ART
 * Montagem do Panorama de 3840px com Calçadas de Pedras Portuguesas, Fachadas, Postes e Fiação
 */

import {
  WORLD_WIDTH,
  SIDEWALK_TOP_Y,
  CURB_Y,
  STREET_TOP_Y,
  STREET_LANE_UP_Y,
  STREET_LANE_DOWN_Y,
  FOREGROUND_WALK_Y,
  STREET_BOTTOM_Y
} from '../engine/Constants.js';

import { BuildingSprites } from '../sprites/BuildingSprites.js';
import { PixelPainter as P } from '../sprites/PixelPainter.js';

export class CityWorld {
  constructor() {
    this.buildings = [];
    this.poles = [];
    this.trees = [];
    this.drainGrates = [];
    this.sparkParticles = [];
    this.waterLevel = 0; // Nível da água em pixels no asfalto (0 a 35)

    this.initLayout();
  }

  initLayout() {
    // 1. FACHADAS E EDIFICAÇÕES (Distribuição urbana realista de Realengo / Zona Oeste)
    this.buildings = [
      { type: 'sobrado', x: 20, y: SIDEWALK_TOP_Y - 145, sprite: BuildingSprites.createSobradoLaje() },
      { type: 'casa', x: 160, y: SIDEWALK_TOP_Y - 115, sprite: BuildingSprites.createCasaTerrea() },
      { type: 'boteco', x: 290, y: SIDEWALK_TOP_Y - 135, sprite: BuildingSprites.createBoteco(), isBar: true },
      { type: 'padaria', x: 450, y: SIDEWALK_TOP_Y - 135, sprite: BuildingSprites.createPadaria() },
      { type: 'abrigo', x: 610, y: SIDEWALK_TOP_Y - 65, sprite: BuildingSprites.createAbrigoOnibus() },
      { type: 'clinica', x: 740, y: SIDEWALK_TOP_Y - 135, sprite: BuildingSprites.createClinicaDaFamilia() },
      { type: 'sobrado2', x: 950, y: SIDEWALK_TOP_Y - 145, sprite: BuildingSprites.createSobradoLaje() },
      { type: 'casa2', x: 1090, y: SIDEWALK_TOP_Y - 115, sprite: BuildingSprites.createCasaTerrea() },
      { type: 'boteco2', x: 1220, y: SIDEWALK_TOP_Y - 135, sprite: BuildingSprites.createBoteco(), isBar: true },
      { type: 'padaria2', x: 1380, y: SIDEWALK_TOP_Y - 135, sprite: BuildingSprites.createPadaria() },
      { type: 'abrigo2', x: 1540, y: SIDEWALK_TOP_Y - 65, sprite: BuildingSprites.createAbrigoOnibus() },
      { type: 'clinica2', x: 1660, y: SIDEWALK_TOP_Y - 135, sprite: BuildingSprites.createClinicaDaFamilia() },
      { type: 'sobrado3', x: 1870, y: SIDEWALK_TOP_Y - 145, sprite: BuildingSprites.createSobradoLaje() },
      { type: 'casa3', x: 2010, y: SIDEWALK_TOP_Y - 115, sprite: BuildingSprites.createCasaTerrea() },
      { type: 'boteco3', x: 2150, y: SIDEWALK_TOP_Y - 135, sprite: BuildingSprites.createBoteco(), isBar: true },
      { type: 'sobrado4', x: 2310, y: SIDEWALK_TOP_Y - 145, sprite: BuildingSprites.createSobradoLaje() },
      { type: 'casa4', x: 2450, y: SIDEWALK_TOP_Y - 115, sprite: BuildingSprites.createCasaTerrea() },
      { type: 'abrigo3', x: 2600, y: SIDEWALK_TOP_Y - 65, sprite: BuildingSprites.createAbrigoOnibus() },
      { type: 'clinica3', x: 2720, y: SIDEWALK_TOP_Y - 135, sprite: BuildingSprites.createClinicaDaFamilia() },
      { type: 'sobrado5', x: 2930, y: SIDEWALK_TOP_Y - 145, sprite: BuildingSprites.createSobradoLaje() }
    ];

    // 2. ÁRVORES URBANAS (Amendoeiras, Flamboyants e Palmeiras Imperiais)
    this.trees = [
      { x: 275, y: SIDEWALK_TOP_Y - 140, sprite: BuildingSprites.createAmendoeira() },
      { x: 590, y: SIDEWALK_TOP_Y - 135, sprite: BuildingSprites.createFlamboyant() },
      { x: 935, y: SIDEWALK_TOP_Y - 180, sprite: BuildingSprites.createPalmeiraImperial() },
      { x: 1205, y: SIDEWALK_TOP_Y - 140, sprite: BuildingSprites.createAmendoeira() },
      { x: 1520, y: SIDEWALK_TOP_Y - 135, sprite: BuildingSprites.createFlamboyant() },
      { x: 1855, y: SIDEWALK_TOP_Y - 180, sprite: BuildingSprites.createPalmeiraImperial() },
      { x: 2135, y: SIDEWALK_TOP_Y - 140, sprite: BuildingSprites.createAmendoeira() },
      { x: 2585, y: SIDEWALK_TOP_Y - 135, sprite: BuildingSprites.createFlamboyant() },
      { x: 2915, y: SIDEWALK_TOP_Y - 180, sprite: BuildingSprites.createPalmeiraImperial() }
    ];

    // 3. POSTES DE CONCRETO COM TRANSFORMADOR E LIXEIRAS COMLURB
    const poleSprite = BuildingSprites.createPosteComTransformador();
    for (let px = 80; px < WORLD_WIDTH; px += 240) {
      this.poles.push({ x: px, y: SIDEWALK_TOP_Y - 225, sprite: poleSprite, hasTransformer: (px % 480 === 80) });
    }

    // 4. BUEIROS / GRELHAS DE DRENAGEM PLUVIAL (Rio-Águas)
    for (let gx = 120; gx < WORLD_WIDTH; gx += 200) {
      this.drainGrates.push({ x: gx, y: CURB_Y + 1 });
    }
  }

  // Atualiza física sutil (faíscas, água e vento)
  update(delta, scenario, isStorm) {
    // 1. Controle progressivo do nível da água na inundação
    if (scenario === 'inundacao') {
      if (this.waterLevel < 28) this.waterLevel += delta * 3.5;
    } else {
      if (this.waterLevel > 0) this.waterLevel -= delta * 6;
      if (this.waterLevel < 0) this.waterLevel = 0;
    }

    // 2. Partículas de faísca elétrica no cenário Blecaute
    if (scenario === 'blecaute') {
      if (Math.random() < 0.45) {
        // Escolhe o poste com transformador próximo ao centro
        const pole = this.poles[1] || this.poles[0];
        for (let i = 0; i < 4; i++) {
          this.sparkParticles.push({
            x: pole.x + 20 + (Math.random() * 12 - 6),
            y: pole.y + 60,
            vx: (Math.random() - 0.5) * 80,
            vy: (Math.random() * -60) - 20,
            life: 0.35 + Math.random() * 0.3,
            color: Math.random() > 0.3 ? '#67e8f9' : '#ffffff'
          });
        }
      }
    }

    // Atualiza partículas de faísca
    for (let i = this.sparkParticles.length - 1; i >= 0; i--) {
      const p = this.sparkParticles[i];
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.vy += 180 * delta; // Gravidade
      p.life -= delta;
      if (p.life <= 0) {
        this.sparkParticles.splice(i, 1);
      }
    }
  }

  // Renderiza toda a cidade com o deslocamento da câmera
  render(ctx, cameraX, isBlackout = false, isNight = false, isStorm = false) {
    ctx.save();
    ctx.translate(-Math.floor(cameraX), 0);

    // ========================================================================
    // 1. FACHADAS E EDIFICAÇÕES (PLANO PRINCIPAL)
    // ========================================================================
    this.buildings.forEach(b => {
      if (b.x + 200 > cameraX && b.x < cameraX + 1000) {
        ctx.drawImage(b.sprite, b.x, b.y);
      }
    });

    // ========================================================================
    // 2. ÁRVORES TROPICAIS CARIOCAS
    // ========================================================================
    this.trees.forEach(t => {
      if (t.x + 150 > cameraX && t.x < cameraX + 1000) {
        ctx.drawImage(t.sprite, t.x, t.y);
      }
    });

    // ========================================================================
    // 3. CALÇADA DE PEDRAS PORTUGUESAS
    // ========================================================================
    this.drawPortugueseSidewalk(ctx, cameraX);

    // ========================================================================
    // 4. MEIO-FIO (GUIA) DE CONCRETO COM PINTURA AMARELA
    // ========================================================================
    P.fillRect(ctx, cameraX - 20, CURB_Y, 1020, 3, '#94a3b8');
    for (let cx = Math.floor(cameraX / 40) * 40; cx < cameraX + 1000; cx += 40) {
      if ((cx % 80) === 0) {
        P.fillRect(ctx, cx, CURB_Y, 20, 2, '#eab308'); // Faixa amarela de proibido estacionar
      }
    }

    // ========================================================================
    // 5. AS ASFALTO DA PISTA DE ROLAMENTO E FAIXAS DE TRÂNSITO
    // ========================================================================
    this.drawStreet(ctx, cameraX);

    // ========================================================================
    // 6. BUEIROS / GRELHAS DA RIO-ÁGUAS
    // ========================================================================
    this.drainGrates.forEach(g => {
      if (g.x > cameraX - 30 && g.x < cameraX + 990) {
        // Caixa de ferro fundido
        P.fillRect(ctx, g.x, g.y, 22, 6, '#1e293b');
        P.strokeRect(ctx, g.x, g.y, 22, 6, '#475569');
        // Grelhas vazadas
        for (let gx = g.x + 3; gx < g.x + 20; gx += 3) {
          P.fillRect(ctx, gx, g.y + 1, 1, 4, '#0f172a');
        }

        // Se estiver em inundação, borbulhas saem do bueiro
        if (this.waterLevel > 5) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(g.x + 11 + Math.sin(Date.now() * 0.01) * 4, g.y - 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // ========================================================================
    // 7. POSTES DE CONCRETO E FIAÇÃO ELÉTRICA CATENÁRIA
    // ========================================================================
    this.drawPolesAndWires(ctx, cameraX, isBlackout);

    // ========================================================================
    // 8. FAÍSCAS DO BLECAUTE NO TRANSFORMADOR
    // ========================================================================
    this.sparkParticles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
    });

    // ========================================================================
    // 9. LÂMINA D'ÁGUA DA INUNDAÇÃO (ALAGAMENTO URBANO)
    // ========================================================================
    if (this.waterLevel > 0) {
      this.drawFloodWater(ctx, cameraX);
    }

    ctx.restore();
  }

  // Desenha o mosaico de pedras portuguesas clássico do Rio
  drawPortugueseSidewalk(ctx, cameraX) {
    const startX = Math.floor(cameraX - 20);
    const endX = Math.floor(cameraX + 980);

    // Base de calcário cinza claro
    P.fillRect(ctx, startX, SIDEWALK_TOP_Y, endX - startX, CURB_Y - SIDEWALK_TOP_Y, '#e2e8f0');

    // Ondas ou mosaico geométrico em pedra preta basáltica
    for (let x = Math.floor(startX / 16) * 16; x < endX; x += 16) {
      const waveY = SIDEWALK_TOP_Y + 16 + Math.sin(x * 0.08) * 6;
      P.fillRect(ctx, x, Math.floor(waveY), 8, 3, '#334155');
      P.fillRect(ctx, x + 8, Math.floor(waveY) + 3, 8, 3, '#1e293b');
    }
  }

  // Desenha a avenida asfaltada com faixas zebradas e sinalização viária
  drawStreet(ctx, cameraX) {
    const startX = Math.floor(cameraX - 20);
    const endX = Math.floor(cameraX + 980);

    // Asfalto escuro
    P.fillRect(ctx, startX, STREET_TOP_Y, endX - startX, STREET_BOTTOM_Y - STREET_TOP_Y, '#1e2025');

    // Remendos de asfalto carioca (típico das ruas do subúrbio)
    for (let x = Math.floor(startX / 300) * 300; x < endX; x += 300) {
      P.fillRect(ctx, x + 40, STREET_TOP_Y + 15, 35, 20, '#15171a');
      P.fillRect(ctx, x + 180, STREET_TOP_Y + 50, 45, 25, '#17191d');
    }

    // Faixa central contínua dupla amarela
    const midY = (STREET_TOP_Y + FOREGROUND_WALK_Y) / 2;
    P.fillRect(ctx, startX, midY - 2, endX - startX, 2, '#eab308');
    P.fillRect(ctx, startX, midY + 2, endX - startX, 2, '#eab308');

    // Faixa de pedestres zebrada em frente à Clínica da Família e ao Ponto de Ônibus
    [650, 1580, 2640].forEach(crosswalkX => {
      if (crosswalkX > startX - 80 && crosswalkX < endX + 80) {
        for (let i = 0; i < 9; i++) {
          const sy = STREET_TOP_Y + 4 + i * 10;
          P.fillRect(ctx, crosswalkX, sy, 45, 6, '#ffffff');
        }
      }
    });

    // Calçada do primeiro plano (Foreground)
    P.fillRect(ctx, startX, FOREGROUND_WALK_Y, endX - startX, STREET_BOTTOM_Y - FOREGROUND_WALK_Y, '#cbd5e1');
    P.fillRect(ctx, startX, FOREGROUND_WALK_Y, endX - startX, 2, '#94a3b8'); // Guia
  }

  // Desenha os postes e a teia de fios elétricos ondulantes
  drawPolesAndWires(ctx, cameraX, isBlackout) {
    // 1. Desenha os postes
    this.poles.forEach(p => {
      if (p.x > cameraX - 60 && p.x < cameraX + 1020) {
        ctx.drawImage(p.sprite, p.x, p.y);

        // Cone de luz do poste se não for blecaute
        if (!isBlackout) {
          const lampX = p.x + 47;
          const lampY = p.y + 88;
          const coneGrad = ctx.createRadialGradient(lampX, lampY, 5, lampX, lampY + 180, 160);
          coneGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
          coneGrad.addColorStop(0.6, 'rgba(254, 240, 138, 0.15)');
          coneGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
          ctx.fillStyle = coneGrad;
          ctx.beginPath();
          ctx.moveTo(lampX, lampY);
          ctx.lineTo(lampX - 70, lampY + 180);
          ctx.lineTo(lampX + 70, lampY + 180);
          ctx.closePath();
          ctx.fill();
        }
      }
    });

    // 2. Fiação elétrica catenária conectando os postes
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    for (let i = 0; i < this.poles.length - 1; i++) {
      const p1 = this.poles[i];
      const p2 = this.poles[i + 1];

      // Desenha 3 linhas de alta tensão no topo
      for (let w = 0; w < 3; w++) {
        const yOff = 16 + w * 10;
        ctx.beginPath();
        ctx.moveTo(p1.x + 20, p1.y + yOff);
        const midX = (p1.x + p2.x) / 2 + 20;
        const midY = (p1.y + p2.y) / 2 + yOff + 8; // Curva de caimento da catenária
        ctx.quadraticCurveTo(midX, midY, p2.x + 20, p2.y + yOff);
        ctx.stroke();
      }

      // Emaranhado de fibra ótica / telefone passando abaixo
      ctx.beginPath();
      ctx.moveTo(p1.x + 20, p1.y + 55);
      ctx.quadraticCurveTo((p1.x + p2.x) / 2 + 20, (p1.y + p2.y) / 2 + 70, p2.x + 20, p2.y + 55);
      ctx.stroke();
    }
  }

  // Desenha a lâmina d'água da inundação com reflexos e marolas
  drawFloodWater(ctx, cameraX) {
    const startX = Math.floor(cameraX - 20);
    const endX = Math.floor(cameraX + 980);
    const waterY = FOREGROUND_WALK_Y - this.waterLevel;
    const waterH = FOREGROUND_WALK_Y - waterY + 30;

    // Lâmina de água barrenta/turquesa semi-translúcida com reflexo
    ctx.fillStyle = 'rgba(30, 64, 110, 0.65)';
    ctx.fillRect(startX, waterY, endX - startX, waterH);

    // Reflexo espelhado na superfície da água
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.fillRect(startX, waterY, endX - startX, 2);

    // Ondulações e reflexos de luz em movimento
    const time = Date.now() * 0.003;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
    for (let x = startX; x < endX; x += 18) {
      const rippleY = waterY + 4 + Math.sin(x * 0.05 + time) * 2;
      ctx.fillRect(x, Math.floor(rippleY), 9, 1);
    }
  }
}
