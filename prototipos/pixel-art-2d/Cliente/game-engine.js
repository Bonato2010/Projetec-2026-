/**
 * ECOCITY PIXEL ART — MOTOR GRÁFICO E DE SIMULAÇÃO (CANVAS 2D)
 * Reproduz com máxima fidelidade visual a direção artística panorâmica da cidade do Rio de Janeiro.
 */

class GameEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Dimensões nativas de alta resolução com pixel ratio
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Carrega imagens panorâmicas de referência para crossfade suave (3 a 8s)
    this.bgImage1 = new Image();
    this.bgImage2 = new Image();
    this.bgLoaded1 = false;
    this.bgLoaded2 = false;
    this.bgImage1.onload = () => { this.bgLoaded1 = true; };
    this.bgImage2.onload = () => { this.bgLoaded2 = true; };
    this.bgImage1.src = 'Recursos%20visuais/cidade-referencia-base.jpg';
    this.bgImage2.src = 'Recursos%20visuais/alerta-referencia.png';

    window.__ecoPixelGame = this;

  }

  setScenarioScene(cenario, fase) {
    const imgPath = `Recursos%20visuais/scenes/${cenario}/${fase}.jfif`;
    this.bgImage1 = new Image();
    this.bgLoaded1 = false;
    this.bgImage1.onload = () => { this.bgLoaded1 = true; };
    this.bgImage1.onerror = () => {
      // Fallback para imagem base se houver erro
      this.bgImage1.src = 'Recursos%20visuais/cidade-referencia-base.jpg';
    };
    this.bgImage1.src = imgPath;
  }

    // Gerenciador de Cenários
    this.scenarioManager = new ScenarioManager({
      onUpdate: (state) => this.handleStateUpdate(state),
      onAlert: (scenario) => this.handleAlert(scenario)
    });

    // Elementos Dinâmicos: Animação Suave de Aviões no Céu Panorâmico
    this.airplanes = [
      { x: -100, y: 140, speed: 2.2, w: 70, h: 26, bank: 0.08 },
      { x: -600, y: 90, speed: 2.8, w: 55, h: 20, bank: -0.04 }
    ];

    this.policeUnits = [
      { x: 740, y: 0, w: 78, h: 35, siren: true },
      { x: 1220, y: 0, w: 78, h: 35, siren: true }
    ];

    // Nuvens
    this.clouds = [
      { x: 100, y: 80, speed: 0.25, w: 220, h: 50, opacity: 0.4 },
      { x: 580, y: 120, speed: 0.35, w: 320, h: 65, opacity: 0.5 },
      { x: 1100, y: 60, speed: 0.2, w: 260, h: 55, opacity: 0.35 },
      { x: 1600, y: 110, speed: 0.3, w: 290, h: 60, opacity: 0.45 }
    ];

    // Partículas de Fogo e Fumaça para a Barricada
    this.particles = [];

    // Gotas de Chuva para a Inundação
    this.rainDrops = [];
    for (let i = 0; i < 350; i++) {
      this.rainDrops.push({
        x: Math.random() * 2000,
        y: Math.random() * 1200,
        len: 12 + Math.random() * 18,
        speed: 16 + Math.random() * 10,
        alpha: 0.3 + Math.random() * 0.4
      });
    }

    // Helicóptero com Holofote de Busca
    this.heli = {
      x: 1600,
      y: 180,
      targetX: 900,
      speed: 1.6,
      beamAngle: -0.4,
      beamWidth: 260,
      rotorAngle: 0
    };

    this.animTime = 0;
    this.isRunning = false;

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    });
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  loop(currentTime) {
    if (!this.isRunning) return;
    const delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    this.animTime += delta;

    this.update(delta);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(delta) {
    this.scenarioManager.update(delta);

    const scenario = this.scenarioManager.currentScenario;
    const isWar = scenario && scenario.id === 'guerra_faccoes';
    const isFlood = scenario && scenario.id === 'inundacao';
    const floodStage = this.scenarioManager.floodLevel;

    // Nuvens
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > this.width + 100) c.x = -c.w - 50;
    });

    // Helicóptero
    this.heli.x += (this.heli.targetX - this.heli.x) * 0.005;
    if (Math.abs(this.heli.targetX - this.heli.x) < 40) {
      this.heli.targetX = Math.random() > 0.5 ? 400 + Math.random() * 600 : 1200 + Math.random() * 400;
    }
    this.heli.rotorAngle += 0.45;
    this.heli.beamAngle = Math.sin(this.animTime * 1.5) * 0.25;

    // Tráfego de Aviões Suave no Céu
    this.airplanes.forEach(plane => {
      plane.x += plane.speed;
      plane.y += Math.sin(this.animTime * 1.8 + plane.x * 0.008) * 0.25;
      if (plane.x > this.width + 150) {
        plane.x = -200;
        plane.y = 80 + Math.random() * 120;
        plane.speed = 2.0 + Math.random() * 1.2;
      }
    });

    // Partículas de Fumaça e Chamas (Barricada na Guerra de Facções)
    if (isWar) {
      if (Math.random() < 0.4) {
        this.particles.push({
          x: 770 + (Math.random() - 0.5) * 45,
          y: this.height * 0.82,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -1.2 - Math.random() * 1.5,
          size: 4 + Math.random() * 8,
          alpha: 0.8,
          color: Math.random() > 0.4 ? '#f97316' : '#ef4444',
          life: 0,
          maxLife: 40 + Math.random() * 30
        });
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.size += 0.2;
      pt.alpha -= 0.015;
      pt.life++;
      if (pt.life >= pt.maxLife || pt.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Chuva
    if (isFlood && floodStage > 0) {
      const dropCount = floodStage === 1 ? 120 : (floodStage === 2 ? 260 : 350);
      for (let i = 0; i < dropCount; i++) {
        const d = this.rainDrops[i];
        d.y += d.speed;
        d.x -= 3.5; // Vento
        if (d.y > this.height) {
          d.y = -20;
          d.x = Math.random() * (this.width + 200);
        }
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const scenario = this.scenarioManager.currentScenario;
    const isWar = scenario && scenario.id === 'guerra_faccoes';
    const isFlood = scenario && scenario.id === 'inundacao';
    const floodStage = this.scenarioManager.floodLevel;

    ctx.clearRect(0, 0, w, h);

    // 1. PANO DE FUNDO MESTRE COM CROSSFADE SUAVE ENTRE REFERÊNCIAS (3 a 8s)
    ctx.imageSmoothingEnabled = false;
    if (this.bgLoaded1) {
      ctx.drawImage(this.bgImage1, 0, 0, w, h);
    }
    if (this.bgLoaded2) {
      // Crossfade suave baseado no tempo animado (ciclo de ~6 segundos)
      const crossfadeAlpha = (Math.sin(this.animTime * 0.8) + 1) / 2 * 0.35;
      ctx.globalAlpha = crossfadeAlpha;
      ctx.drawImage(this.bgImage2, 0, 0, w, h);
      ctx.globalAlpha = 1.0;
    }
    if (!this.bgLoaded1 && !this.bgLoaded2) {
      // Gradiente de fallback elegante
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0c1322');
      skyGrad.addColorStop(0.6, '#182744');
      skyGrad.addColorStop(1, '#0e1726');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. ILUMINAÇÃO DINÂMICA DO CRISTO REDENTOR NO CORCOVADO
    this.drawCristoGlow(ctx, w, h);

    // 4. HOLOFOTE DO HELICÓPTERO DE SEGURANÇA / DEFESA CIVIL
    this.drawHelicopterSearchlight(ctx, w, h);

    // 5. HOSPITAL — SINALIZAÇÃO E CRUZ LUMINOSA PULSANTE
    this.drawHospitalLighting(ctx, w, h);

    // 6. POSTES E ILUMINAÇÃO PÚBLICA (CONES DE LUZ NA CALÇADA)
    this.drawStreetLighting(ctx, w, h);

    // 7. ANIMAÇÃO SUAVE DE AVIÕES NO CÉU PANORÂMICO
    this.drawAirplanes(ctx, w, h);

    // 9. EFEITOS ESPECÍFICOS DE GUERRA DE FACÇÕES (BARRICADA, SIRENES, GIROFLEX)
    if (isWar) {
      this.drawWarCrisisEffects(ctx, w, h);
    }

    // 10. EFEITOS ESPECÍFICOS DE INUNDAÇÃO (CHUVA TORRENCIAL, ALAGAMENTO, POÇAS, REFLEXOS)
    if (isFlood && floodStage > 0) {
      this.drawFloodEffects(ctx, w, h, floodStage);
    }
  }

  // --- MÉTODOS DE DESENHO DE CAMADAS PROCEDURAIS ---

  drawCristoGlow(ctx, w, h) {
    ctx.save();
    // Posição proporcional do Cristo na imagem de referência (~39.7% X, ~8% Y)
    const cx = w * 0.398;
    const cy = h * 0.098;
    const pulse = 0.5 + Math.sin(this.animTime * 2) * 0.3;

    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 70);
    grad.addColorStop(0, `rgba(255, 255, 220, ${0.45 * pulse})`);
    grad.addColorStop(0.4, `rgba(255, 235, 160, ${0.2 * pulse})`);
    grad.addColorStop(1, 'rgba(255, 235, 160, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawHelicopterSearchlight(ctx, w, h) {
    ctx.save();
    const hx = this.heli.x;
    const hy = this.heli.y;

    // Desenho do corpo do helicóptero em pixel art
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(hx - 22, hy - 8, 44, 16);
    ctx.fillStyle = '#f59e0b'; // Detalhe listra de emergência
    ctx.fillRect(hx - 12, hy - 2, 28, 4);
    // Rotor principal animado
    ctx.fillStyle = '#94a3b8';
    const rLen = 42 * Math.cos(this.heli.rotorAngle);
    ctx.fillRect(hx - rLen, hy - 14, rLen * 2, 3);
    // Cauda e rotor traseiro
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(hx + 20, hy - 4, 24, 6);
    ctx.fillRect(hx + 42, hy - 12, 4, 16);

    // Facho de Luz Cônico (Searchlight)
    const beamTargetX = hx - Math.tan(this.heli.beamAngle) * (h * 0.75 - hy);
    const beamY = h * 0.78;

    const beamGrad = ctx.createLinearGradient(hx, hy, beamTargetX, beamY);
    beamGrad.addColorStop(0, 'rgba(255, 255, 200, 0.65)');
    beamGrad.addColorStop(0.6, 'rgba(255, 245, 180, 0.25)');
    beamGrad.addColorStop(1, 'rgba(255, 245, 180, 0.02)');

    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(hx, hy + 6);
    ctx.lineTo(beamTargetX - this.heli.beamWidth / 2, beamY);
    ctx.lineTo(beamTargetX + this.heli.beamWidth / 2, beamY);
    ctx.closePath();
    ctx.fill();

    // Elipse iluminada no solo / morro
    ctx.fillStyle = 'rgba(255, 255, 210, 0.35)';
    ctx.beginPath();
    ctx.ellipse(beamTargetX, beamY, this.heli.beamWidth / 2, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawHospitalLighting(ctx, w, h) {
    ctx.save();
    // Posição proporcional do Hospital na referência (~12% X, ~54% Y)
    const hx = w * 0.122;
    const hy = h * 0.545;
    const blink = (Math.floor(this.animTime * 3) % 2 === 0);

    // Cruz Vermelha Luminosa
    if (blink) {
      ctx.fillStyle = '#ff1133';
      ctx.shadowColor = '#ff3344';
      ctx.shadowBlur = 12;
      ctx.fillRect(hx - 3, hy - 10, 6, 20);
      ctx.fillRect(hx - 10, hy - 3, 20, 6);
    }
    ctx.restore();
  }

  drawStreetLighting(ctx, w, h) {
    ctx.save();
    // Cones de iluminação dos postes de rua no asfalto
    const streetPostsX = [w * 0.345, w * 0.475, w * 0.575, w * 0.84];
    const lampY = h * 0.72;

    streetPostsX.forEach(px => {
      const coneGrad = ctx.createLinearGradient(px, lampY, px, lampY + 120);
      coneGrad.addColorStop(0, 'rgba(255, 235, 140, 0.35)');
      coneGrad.addColorStop(1, 'rgba(255, 235, 140, 0)');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(px, lampY);
      ctx.lineTo(px - 45, lampY + 110);
      ctx.lineTo(px + 45, lampY + 110);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  }

  drawAirplanes(ctx, w, h) {
    ctx.save();
    this.airplanes.forEach(plane => {
      const px = plane.x;
      const py = plane.y;
      // Fuselagem
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.ellipse(px, py, plane.w / 2, plane.h / 2, plane.bank, 0, Math.PI * 2);
      ctx.fill();
      // Asas
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.ellipse(px, py - 2, plane.w * 0.28, plane.h * 1.3, 0.25, 0, Math.PI * 2);
      ctx.fill();
      // Estabilizador traseiro
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(px - plane.w * 0.38, py - plane.h * 0.9, 5, 10);
      // Luz de navegação / brilho
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.fillRect(px + plane.w * 0.42, py, 3, 3);
      ctx.shadowBlur = 0;
    });
    ctx.restore();
  }

  drawWarCrisisEffects(ctx, w, h) {
    ctx.save();
    // 1. Pneus em chamas e barricada na via central (~41% X, ~82% Y)
    const bx = w * 0.415;
    const by = h * 0.835;

    // Pneus pretos empilhados
    ctx.fillStyle = '#111827';
    ctx.fillRect(bx - 30, by - 6, 60, 14);
    ctx.fillRect(bx - 20, by - 16, 40, 12);

    // Chamas animadas
    const flameH = 18 + Math.sin(this.animTime * 15) * 8;
    const fireGrad = ctx.createLinearGradient(bx, by - flameH, bx, by);
    fireGrad.addColorStop(0, '#fef08a');
    fireGrad.addColorStop(0.3, '#f97316');
    fireGrad.addColorStop(1, '#dc2626');
    ctx.fillStyle = fireGrad;
    ctx.beginPath();
    ctx.moveTo(bx - 22, by - 8);
    ctx.lineTo(bx - 5, by - flameH - 4);
    ctx.lineTo(bx + 8, by - flameH);
    ctx.lineTo(bx + 22, by - 8);
    ctx.closePath();
    ctx.fill();

    // Iluminação do fogo no asfalto
    const fireLight = ctx.createRadialGradient(bx, by, 5, bx, by, 90);
    fireLight.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
    fireLight.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = fireLight;
    ctx.beginPath();
    ctx.arc(bx, by, 90, 0, Math.PI * 2);
    ctx.fill();

    // Partículas de fumaça subindo
    this.particles.forEach(pt => {
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = pt.alpha;
      ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
    });
    ctx.globalAlpha = 1.0;

    // Viaturas Policiais de Bloqueio com Giroflex Estroboscópico Duplo
    this.policeUnits.forEach((u, idx) => {
      const ux = u.x;
      const uy = h * 0.765;
      const strobe = (Math.floor(this.animTime * 14) + idx) % 2 === 0;

      // Reflexo da sirene pulsando no chão
      const sirenGlow = ctx.createRadialGradient(ux + 38, uy, 5, ux + 38, uy, 80);
      sirenGlow.addColorStop(0, strobe ? 'rgba(239, 68, 68, 0.45)' : 'rgba(59, 130, 246, 0.45)');
      sirenGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sirenGlow;
      ctx.beginPath();
      ctx.arc(ux + 38, uy, 80, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  drawFloodEffects(ctx, w, h, floodStage) {
    ctx.save();
    // 1. Escurecimento do Céu e Tempestade
    const stormAlpha = floodStage === 1 ? 0.25 : (floodStage === 2 ? 0.45 : 0.65);
    ctx.fillStyle = `rgba(10, 20, 38, ${stormAlpha})`;
    ctx.fillRect(0, 0, w, h);

    // Relâmpago Ocasional
    if (floodStage >= 2 && Math.random() < 0.015) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Traços de Chuva Torrencial em Pixel Art
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const count = floodStage === 1 ? 120 : (floodStage === 2 ? 260 : 350);
    for (let i = 0; i < count; i++) {
      const d = this.rainDrops[i];
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 4, d.y + d.len);
    }
    ctx.stroke();

    // 3. Camada de Acúmulo de Água e Alagamento na Pista
    const waterDepth = floodStage * 18; // Altura da água subindo
    const waterY = h * 0.785 - waterDepth;

    const waterGrad = ctx.createLinearGradient(0, waterY, 0, h);
    waterGrad.addColorStop(0, 'rgba(30, 80, 140, 0.45)');
    waterGrad.addColorStop(0.3, 'rgba(14, 55, 105, 0.7)');
    waterGrad.addColorStop(1, 'rgba(8, 30, 60, 0.9)');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, waterY, w, h - waterY);

    // Ondulações e Reflexos da Água
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    for (let rx = 20; rx < w; rx += 70) {
      const rippleY = waterY + Math.sin(this.animTime * 4 + rx) * 3;
      ctx.beginPath();
      ctx.moveTo(rx, rippleY);
      ctx.lineTo(rx + 35, rippleY);
      ctx.stroke();
    }

    // Veículos Parados com Pisca-Alerta Piscando (Amarelo)
    const hazardBlink = Math.floor(this.animTime * 3) % 2 === 0;
    if (floodStage >= 2 && hazardBlink) {
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      // Lanternas traseiras e dianteiras piscando
      this.vehicles.forEach(v => {
        ctx.fillRect(v.x + 2, waterY - 8, 4, 4);
        ctx.fillRect(v.x + v.w - 6, waterY - 8, 4, 4);
      });
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }

  handleStateUpdate(state) {
    // Atualiza elementos de UI se necessário
  }

  handleAlert(scenario) {
    this.scenarioManager.startSimulation();
  }
}

window.GameEngine = GameEngine;
