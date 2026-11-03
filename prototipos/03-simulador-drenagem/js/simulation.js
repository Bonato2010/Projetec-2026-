/**
 * PROJETO V.I.D.A. — SIMULADOR HIDRODINÂMICO E AMORTECIMENTO DE CHEIAS
 * Motor Gráfico de Simulação Hidrológica & Animação em Canvas 2D
 * Parque Realengo Jornalista Susana Naspolini — Rio de Janeiro
 * 
 * Modelação Técnica:
 * - Balanço de Massa Hídrica (Precipitação, Infiltração, Escoamento Superficial e Retenção)
 * - Corte Estratigráfico Geotécnico com Aquífero e Camadas Permeáveis
 * - Biovaleta Drenante (SbN) e Bacia de Detenção (1.950 m³)
 */

class HidroSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.rainIntensity = 50; // mm/h (10 a 120)
    this.hasParkSbN = true;  // com parque vs sem parque
    this.isPaused = false;

    this.rainDrops = [];
    this.waterLevel = 0.62;  // 0 a 1.0 (capacidade relativa do lago)
    this.targetWaterLevel = 0.62;
    this.waveOffset = 0;
    this.infilParticles = [];

    this.setupResolution();
    this.initDrops();
    this.initInfiltration();
    this.startLoop();

    window.addEventListener('resize', () => {
      this.setupResolution();
      this.initDrops();
    });
  }

  setupResolution() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = rect.width || 800;
    this.height = rect.height || 480;

    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale
    this.ctx.scale(dpr, dpr);
  }

  initDrops() {
    this.rainDrops = [];
    const count = Math.floor(this.rainIntensity * 3.2);
    for (let i = 0; i < count; i++) {
      this.rainDrops.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        len: Math.random() * 14 + 10,
        speed: Math.random() * 9 + 10 + (this.rainIntensity / 15),
        alpha: Math.random() * 0.4 + 0.35
      });
    }
  }

  initInfiltration() {
    this.infilParticles = [];
    for (let i = 0; i < 28; i++) {
      this.infilParticles.push({
        x: Math.random(),
        progress: Math.random(),
        speed: Math.random() * 0.008 + 0.004,
        size: Math.random() * 1.8 + 1.2
      });
    }
  }

  setIntensity(mmPerHour) {
    this.rainIntensity = mmPerHour;
    this.initDrops();
    this.updateHydrology();
  }

  setScenario(hasPark) {
    this.hasParkSbN = hasPark;
    this.updateHydrology();
  }

  setPaused(paused) {
    this.isPaused = paused;
  }

  updateHydrology() {
    if (this.hasParkSbN) {
      // Bacia de 1.950 m³ enche progressivamente conforme chuva
      const fillPct = Math.min(0.96, 0.28 + (this.rainIntensity / 120) * 0.68);
      this.targetWaterLevel = fillPct;
    } else {
      // Sem o parque: solo compactado, refluxo de água sobre asfalto
      this.targetWaterLevel = 0.98;
    }
  }

  startLoop() {
    const loop = () => {
      if (!this.isPaused) {
        this.waveOffset += 0.045;
        this.waterLevel += (this.targetWaterLevel - this.waterLevel) * 0.04;
        this.updateDrops();
      }
      this.draw();
      requestAnimationFrame(loop);
    };
    loop();
  }

  updateDrops() {
    const h = this.height;
    const w = this.width;
    for (let i = 0; i < this.rainDrops.length; i++) {
      const d = this.rainDrops[i];
      d.y += d.speed;
      d.x += 1.4; // componente de vento constante
      if (d.y > h * 0.48) {
        d.y = -15;
        d.x = Math.random() * (w + 100) - 50;
      }
    }
  }

  draw() {
    if (!this.ctx) return;
    const w = this.width;
    const h = this.height;

    this.ctx.clearRect(0, 0, w, h);

    // 1. Atmosfera e Céu Pluviométrico
    this.drawSky(w, h);

    // 2. Seção Geológica e Estrutural do Solo
    this.drawGeologicalSection(w, h);

    // 3. Chuva em suspensão
    this.drawRainDrops();

    // 4. Fluxo de Infiltração e Aquífero
    this.drawInfiltration(w, h);

    // 5. Cotas e Rótulos Técnicos
    this.drawTechnicalOverlay(w, h);
  }

  drawSky(w, h) {
    const groundY = h * 0.42;
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, groundY);
    
    // Gradiente dinâmico com base na tempestade
    const stormFactor = Math.min(1.0, this.rainIntensity / 110);
    const topColor = this.lerpColor('#0f172a', '#030712', stormFactor);
    const bottomColor = this.lerpColor('#1e293b', '#0f172a', stormFactor);

    skyGrad.addColorStop(0, topColor);
    skyGrad.addColorStop(1, bottomColor);
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, w, groundY);

    // Névoa atmosférica perto do solo
    const mistGrad = this.ctx.createLinearGradient(0, groundY - 60, 0, groundY);
    mistGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    mistGrad.addColorStop(1, `rgba(56, 189, 248, ${0.08 + stormFactor * 0.08})`);
    this.ctx.fillStyle = mistGrad;
    this.ctx.fillRect(0, groundY - 60, w, 60);
  }

  drawGeologicalSection(w, h) {
    const groundY = h * 0.42;
    const groundH = h * 0.58;

    // Camada 1: Subsolo / Leito Rochoso (Fundo)
    this.ctx.fillStyle = '#0f141f';
    this.ctx.fillRect(0, groundY, w, groundH);

    // Camada 2: Substrato Geotécnico / Cascalho Filtrante
    const stratumGrad = this.ctx.createLinearGradient(0, groundY, 0, h * 0.78);
    stratumGrad.addColorStop(0, '#1a2333');
    stratumGrad.addColorStop(1, '#111827');
    this.ctx.fillStyle = stratumGrad;
    this.ctx.fillRect(0, groundY + 12, w, h * 0.36);

    // Camada 3: Aquífero / Lençol Freático (Base)
    const aquiferY = h * 0.82;
    const aquiferH = h * 0.18;
    const aquiferGrad = this.ctx.createLinearGradient(0, aquiferY, 0, h);
    aquiferGrad.addColorStop(0, 'rgba(2, 132, 199, 0.25)');
    aquiferGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
    aquiferGrad.addColorStop(1, 'rgba(2, 132, 199, 0.75)');
    this.ctx.fillStyle = aquiferGrad;
    this.ctx.fillRect(0, aquiferY, w, aquiferH);

    // Linha limite do aquífero
    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([6, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, aquiferY);
    this.ctx.lineTo(w, aquiferY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    if (this.hasParkSbN) {
      // -------------------------------------------------------------
      // CENÁRIO COM O PARQUE (SbN)
      // -------------------------------------------------------------

      // 1. Solo Permeável Vivo (Topsoil com grama)
      this.ctx.fillStyle = '#059669';
      this.ctx.fillRect(0, groundY - 4, w * 0.78, 8);

      // Canteiro permeável e raiz
      this.ctx.fillStyle = '#10b981';
      this.ctx.fillRect(0, groundY - 6, w * 0.78, 2);

      // 2. Biovaleta Drenante (Zona Esquerda: 10% a 28% da largura)
      const bioX = w * 0.08;
      const bioW = w * 0.20;
      const bioDepth = 18;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(bioX, groundY);
      this.ctx.quadraticCurveTo(bioX + bioW * 0.5, groundY + bioDepth * 1.5, bioX + bioW, groundY);
      this.ctx.closePath();
      this.ctx.fillStyle = '#065f46';
      this.ctx.fill();

      // Camada de brita filtrante na biovaleta
      this.ctx.strokeStyle = '#34d399';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.restore();

      // 3. Bacia de Detenção e Lago Principal (32% a 74% da largura)
      const lakeX = w * 0.32;
      const lakeW = w * 0.44;
      const lakeMaxH = groundH * 0.65;
      const lakeCurrentH = Math.max(12, lakeMaxH * this.waterLevel);
      const lakeSurfaceY = groundY + (lakeMaxH - lakeCurrentH);

      // Taludes / Escavação de contenção
      this.ctx.save();
      this.ctx.fillStyle = '#0b111e';
      this.ctx.beginPath();
      this.ctx.moveTo(lakeX - 16, groundY);
      this.ctx.lineTo(lakeX + 10, groundY + lakeMaxH + 4);
      this.ctx.lineTo(lakeX + lakeW - 10, groundY + lakeMaxH + 4);
      this.ctx.lineTo(lakeX + lakeW + 16, groundY);
      this.ctx.closePath();
      this.ctx.fill();

      // Enrocamento / Borda de pedra
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.restore();

      // Água do Lago de Retenção (com animação senoidal suave)
      this.ctx.save();
      const waterGrad = this.ctx.createLinearGradient(0, lakeSurfaceY, 0, groundY + lakeMaxH);
      waterGrad.addColorStop(0, '#38bdf8');
      waterGrad.addColorStop(0.35, '#0284c7');
      waterGrad.addColorStop(1, '#0c4a6e');
      this.ctx.fillStyle = waterGrad;

      this.ctx.beginPath();
      this.ctx.moveTo(lakeX + 10, groundY + lakeMaxH);
      this.ctx.lineTo(lakeX + 10, lakeSurfaceY);

      // Ondulação senoidal
      const steps = 30;
      const dx = (lakeW - 20) / steps;
      for (let i = 0; i <= steps; i++) {
        const px = lakeX + 10 + i * dx;
        const wave = Math.sin((i * 0.6) + this.waveOffset) * 3;
        this.ctx.lineTo(px, lakeSurfaceY + wave);
      }

      this.ctx.lineTo(lakeX + lakeW - 10, groundY + lakeMaxH);
      this.ctx.closePath();
      this.ctx.fill();

      // Brilho da crista da água
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
      this.ctx.restore();

      // Deque de madeira na margem direita
      this.ctx.fillStyle = '#92400e';
      this.ctx.fillRect(lakeX + lakeW - 4, groundY - 6, 22, 6);

      // 4. Pavimento Asfáltico da Rua Prof. Carlos Wenceslau (Extremo Direito: 80% a 100%)
      const streetX = w * 0.80;
      const streetW = w * 0.20;

      // Meio-fio e calçada
      this.ctx.fillStyle = '#64748b';
      this.ctx.fillRect(streetX, groundY - 10, 16, 10);

      // Asfalto seco e nivelado
      this.ctx.fillStyle = '#334155';
      this.ctx.fillRect(streetX + 16, groundY - 6, streetW - 16, 8);

      // Bueiro de drenagem urbana pluvial
      this.ctx.fillStyle = '#1e293b';
      this.ctx.fillRect(streetX + 22, groundY - 6, 18, 4);

    } else {
      // -------------------------------------------------------------
      // CENÁRIO PRÉ-PARQUE (2021) — IMPERMEABILIZAÇÃO & ENCHENTE
      // -------------------------------------------------------------

      // Solo impermeabilizado / Asfalto degradado por toda a extensão
      this.ctx.fillStyle = '#475569';
      this.ctx.fillRect(0, groundY - 6, w, 8);

      // Poças e lâmina contínua de enchente sobre a via
      const floodHeight = Math.min(32, 10 + (this.rainIntensity / 120) * 22);
      const floodY = groundY - 6 - floodHeight;

      const floodGrad = this.ctx.createLinearGradient(0, floodY, 0, groundY);
      floodGrad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      floodGrad.addColorStop(1, 'rgba(185, 28, 28, 0.7)');
      this.ctx.fillStyle = floodGrad;

      this.ctx.beginPath();
      this.ctx.moveTo(0, groundY);
      this.ctx.lineTo(0, floodY);
      for (let px = 0; px <= w; px += 20) {
        const wave = Math.sin((px * 0.08) + this.waveOffset * 1.5) * 2.5;
        this.ctx.lineTo(px, floodY + wave);
      }
      this.ctx.lineTo(w, groundY);
      this.ctx.closePath();
      this.ctx.fill();

      // Borda de alerta de refluxo
      this.ctx.strokeStyle = '#ef4444';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Setas de enxurrada violenta
      this.drawFloodFlowArrows(w, groundY - floodHeight * 0.5);
    }
  }

  drawFloodFlowArrows(w, y) {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(254, 202, 202, 0.85)';
    const spacing = 110;
    const offset = (this.waveOffset * 40) % spacing;

    for (let x = -offset; x < w; x += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 25, y);
      this.ctx.lineTo(x, y - 5);
      this.ctx.lineTo(x + 6, y);
      this.ctx.lineTo(x, y + 5);
      this.ctx.closePath();
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  drawRainDrops() {
    this.ctx.save();
    this.ctx.lineWidth = 1.6;
    for (let i = 0; i < this.rainDrops.length; i++) {
      const d = this.rainDrops[i];
      this.ctx.strokeStyle = `rgba(186, 230, 253, ${d.alpha})`;
      this.ctx.beginPath();
      this.ctx.moveTo(d.x, d.y);
      this.ctx.lineTo(d.x + 2.5, d.y + d.len);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawInfiltration(w, h) {
    if (!this.hasParkSbN) return;
    const groundY = h * 0.42;
    const aquiferY = h * 0.82;
    const zoneH = aquiferY - groundY;

    // Gotas de recarga no subsolo permeável (biovaleta e canteiros)
    this.ctx.save();
    this.ctx.fillStyle = '#38bdf8';

    for (let i = 0; i < this.infilParticles.length; i++) {
      const p = this.infilParticles[i];
      if (!this.isPaused) {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;
      }

      // Distribuição nas áreas de solo vivo (0% a 30% e 75% a 80%)
      let posX = (p.x < 0.8) ? (w * (0.05 + p.x * 0.25)) : (w * (0.75 + (p.x - 0.8) * 0.2));
      let posY = groundY + 12 + (p.progress * zoneH);

      this.ctx.globalAlpha = Math.sin(p.progress * Math.PI) * 0.7;
      this.ctx.beginPath();
      this.ctx.arc(posX, posY, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawTechnicalOverlay(w, h) {
    const groundY = h * 0.42;

    this.ctx.save();

    if (this.hasParkSbN) {
      // 1. Rótulo Bacia de Retenção
      const lakeX = w * 0.54;
      const lakeVol = Math.round(this.waterLevel * 1950);
      const lakePct = Math.round(this.waterLevel * 100);

      this.ctx.font = '600 12px "JetBrains Mono", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.fillText(`BACIA DE DETENÇÃO: ${lakeVol} m³ (${lakePct}%)`, lakeX, groundY + 45);

      this.ctx.font = '500 10px "Inter", sans-serif';
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.fillText("Capacidade de Projeto: 1.950 m³ • Lâmina Amortecida", lakeX, groundY + 60);

      // 2. Rótulo Biovaleta
      this.ctx.font = '700 10px "Inter", sans-serif';
      this.ctx.fillStyle = '#34d399';
      this.ctx.textAlign = 'center';
      this.ctx.fillText("BIOVALETA FILTRANTE", w * 0.18, groundY + 32);

      // 3. Rótulo Via Urbana Protegida
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.textAlign = 'right';
      this.ctx.fillText("RUA PROF. CARLOS WENCESLAU (PROTEGIDA)", w - 16, groundY - 18);

    } else {
      // Cenário Sem Parque: Rótulo de Alerta Técnico
      this.ctx.font = '700 13px "Inter", sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#f87171';
      this.ctx.fillText("CRÍTICO: ESCOAMENTO SUPERFICIAL 88,2% — TRANSBORDAMENTO VIÁRIO", w * 0.5, groundY - 40);

      this.ctx.font = '500 11px "Inter", sans-serif';
      this.ctx.fillStyle = '#fca5a5';
      this.ctx.fillText("Rua Prof. Carlos Wenceslau e bacia local sobrecarregadas (infiltração residual 11,8%)", w * 0.5, groundY - 24);
    }

    // Régua do Aquífero Subterrâneo
    this.ctx.font = '600 10px "JetBrains Mono", monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
    this.ctx.fillText("AQUÍFERO SUBTERRÂNEO • RECARGA NATURAL ATIVA (~52.000 m³/ano)", 16, h - 14);

    this.ctx.restore();
  }

  lerpColor(a, b, amount) {
    const ah = parseInt(a.replace(/#/g, ''), 16),
      ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff,
      bh = parseInt(b.replace(/#/g, ''), 16),
      br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff,
      rr = Math.round(ar + amount * (br - ar)),
      rg = Math.round(ag + amount * (bg - ag)),
      rb = Math.round(ab + amount * (bb - ab));
    return `#${((1 << 24) + (rr << 16) + (rg << 8) + rb).toString(16).slice(1)}`;
  }
}

window.HidroSimulation = HidroSimulation;
