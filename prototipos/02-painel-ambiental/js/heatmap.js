/**
 * CENTRAL DE MONITORAMENTO AMBIENTAL V.I.D.A.
 * Módulo de Mapa de Calor Ilustrativo & GIS Microclimático
 * Parque Realengo Jornalista Susana Naspolini
 */

class VidaHeatmap {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.activeLayer = 'temperatura'; // 'temperatura' | 'drenagem' | 'vegetacao'
    this.animationFrame = null;
    this.particles = [];
    this.mistPulseTime = 0;
    this.theme = 'dark';
    this.hoveredHotspot = null;
    this.selectedHotspot = null;
  }

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.setupResolution();
    this.initParticles();
    this.attachEventListeners();
    this.startAnimation();
  }

  setTheme(theme) {
    this.theme = theme;
    this.draw();
  }

  setLayer(layerId) {
    this.activeLayer = layerId;
    this.draw();
  }

  setupResolution() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  initParticles() {
    // Partículas para simulação de névoa das 5 torres
    this.particles = [];
    const torres = AMBIENTAL_DATA.hotspotsMapa.filter(h => h.tipo === 'clima');
    
    torres.forEach(torre => {
      for (let i = 0; i < 18; i++) {
        this.particles.push({
          torreId: torre.id,
          originX: torre.x,
          originY: torre.y,
          x: torre.x + (Math.random() - 0.5) * 4,
          y: torre.y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4 - 0.1,
          radius: Math.random() * 8 + 4,
          alpha: Math.random() * 0.5 + 0.2,
          life: Math.random() * 100
        });
      }
    });
  }

  attachEventListeners() {
    window.addEventListener('resize', () => {
      this.setupResolution();
      this.draw();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

      // Detecta hotspot sob o cursor
      let found = null;
      for (const h of AMBIENTAL_DATA.hotspotsMapa) {
        const dx = mouseX - h.x;
        const dy = mouseY - h.y;
        if (Math.sqrt(dx * dx + dy * dy) < 4.5) {
          found = h;
          break;
        }
      }

      this.hoveredHotspot = found;
      this.canvas.style.cursor = found ? 'pointer' : 'crosshair';

      // Atualiza sonda térmica instantânea
      this.updateProbeReadout(mouseX, mouseY);
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.hoveredHotspot) {
        this.selectedHotspot = this.hoveredHotspot;
        this.showHotspotModal(this.hoveredHotspot);
      }
    });
  }

  updateProbeReadout(pctX, pctY) {
    const probeEl = document.getElementById('map-probe-value');
    if (!probeEl) return;

    // Parque fica centralizado entre x: 20 a 80 e y: 20 a 80
    const inPark = pctX >= 22 && pctX <= 78 && pctY >= 22 && pctY <= 78;
    let tempC;
    let statusDesc;

    if (inPark) {
      // Centro do bosque ou perto das torres
      const distFromCenter = Math.sqrt(Math.pow(pctX - 50, 2) + Math.pow(pctY - 50, 2));
      tempC = (32.4 + (distFromCenter / 40) * 3.8).toFixed(1);
      statusDesc = "Oásis Urbano (Microclima Amenizado)";
      probeEl.className = "probe-pill temp-park";
    } else {
      // Asfalto das ruas externas
      tempC = (40.5 + (Math.sin(pctX * 0.1) * 2.3)).toFixed(1);
      statusDesc = "Ilha de Calor (Asfalto / Vias Urbanas)";
      probeEl.className = "probe-pill temp-urban";
    }

    probeEl.innerHTML = `<strong>${tempC}°C</strong> <span>${statusDesc}</span>`;
  }

  startAnimation() {
    const renderLoop = () => {
      this.mistPulseTime += 0.04;
      this.updateParticles();
      this.draw();
      this.animationFrame = requestAnimationFrame(renderLoop);
    };
    renderLoop();
  }

  updateParticles() {
    if (this.activeLayer !== 'clima' && this.activeLayer !== 'drenagem') return;

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life += 1;
      p.alpha -= 0.005;

      if (p.life > 100 || p.alpha <= 0) {
        p.life = 0;
        p.alpha = Math.random() * 0.4 + 0.3;
        p.x = p.originX + (Math.random() - 0.5) * 3;
        p.y = p.originY + (Math.random() - 0.5) * 3;
      }
    });
  }

  draw() {
    if (!this.ctx) return;
    const w = this.width;
    const h = this.height;
    const isDark = this.theme === 'dark';

    this.ctx.clearRect(0, 0, w, h);

    // 1. Fundo do Bairro (Malha Urbana de Realengo)
    this.ctx.fillStyle = isDark ? '#0b111e' : '#e2e8f0';
    this.ctx.fillRect(0, 0, w, h);

    // Ruas do entorno (Rua Prof. Carlos Wenceslau, Av. Santa Cruz, Rua Raposo)
    this.drawStreetGrid(w, h, isDark);

    // 2. Poligonal do Parque Realengo (76.000 m²)
    const parkX = w * 0.20;
    const parkY = h * 0.20;
    const parkW = w * 0.60;
    const parkH = h * 0.60;

    // Fundo base do parque
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.roundRect(parkX, parkY, parkW, parkH, 16);
    this.ctx.clip();

    // 3. Renderiza a Camada Ativa
    if (this.activeLayer === 'temperatura') {
      this.drawHeatmapLayer(parkX, parkY, parkW, parkH, w, h, isDark);
    } else if (this.activeLayer === 'drenagem') {
      this.drawDrainageLayer(parkX, parkY, parkW, parkH, isDark);
    } else if (this.activeLayer === 'vegetacao') {
      this.drawVegetationLayer(parkX, parkY, parkW, parkH, isDark);
    }

    this.ctx.restore();

    // Borda delimitadora do Parque
    this.ctx.save();
    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([6, 4]);
    this.ctx.strokeRect(parkX, parkY, parkW, parkH);
    this.ctx.restore();

    // Rótulos geográficos
    this.drawLabels(parkX, parkY, parkW, parkH, isDark);

    // 4. Desenha Névoa das Torres se camada clima ou drenagem
    if (this.activeLayer === 'clima' || this.activeLayer === 'temperatura') {
      this.drawMistParticles(w, h);
    }

    // 5. Hotspots Interativos
    this.drawHotspots(w, h);
  }

  drawStreetGrid(w, h, isDark) {
    this.ctx.save();
    this.ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
    this.ctx.lineWidth = 14;

    // Ruas circundantes
    this.ctx.beginPath();
    // Rua Norte (Prof. Carlos Wenceslau)
    this.ctx.moveTo(0, h * 0.16);
    this.ctx.lineTo(w, h * 0.16);

    // Rua Sul
    this.ctx.moveTo(0, h * 0.84);
    this.ctx.lineTo(w, h * 0.84);

    // Rua Oeste (General Raposo)
    this.ctx.moveTo(w * 0.16, 0);
    this.ctx.lineTo(w * 0.16, h);

    // Rua Leste
    this.ctx.moveTo(w * 0.84, 0);
    this.ctx.lineTo(w * 0.84, h);

    this.ctx.stroke();

    // Rótulos de vias
    this.ctx.fillStyle = isDark ? '#475569' : '#94a3b8';
    this.ctx.font = '10px system-ui, sans-serif';
    this.ctx.fillText('R. PROF. CARLOS WENCESLAU', w * 0.28, h * 0.13);
    this.ctx.fillText('AV. SANTA CRUZ / REALENGO', w * 0.28, h * 0.90);
    this.ctx.restore();
  }

  drawHeatmapLayer(px, py, pw, ph, w, h, isDark) {
    // 1. Mancha de calor urbana externa (Vermelho / Laranja intenso)
    const extGrad = this.ctx.createRadialGradient(w * 0.5, h * 0.5, pw * 0.35, w * 0.5, h * 0.5, w * 0.6);
    extGrad.addColorStop(0, 'rgba(239, 68, 68, 0.0)');
    extGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.35)');
    extGrad.addColorStop(1, 'rgba(239, 68, 68, 0.5)');
    this.ctx.fillStyle = extGrad;
    this.ctx.fillRect(0, 0, w, h);

    // 2. Ilha de Frescor / Oásis Térmico dentro do Parque
    const parkGrad = this.ctx.createRadialGradient(px + pw * 0.5, py + ph * 0.5, 20, px + pw * 0.5, py + ph * 0.5, pw * 0.55);
    parkGrad.addColorStop(0, 'rgba(16, 185, 129, 0.85)'); // Centro fresco (-5.8°C)
    parkGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.65)'); // Zona de névoa e lago
    parkGrad.addColorStop(0.8, 'rgba(16, 185, 129, 0.40)'); // Transição
    parkGrad.addColorStop(1, 'rgba(245, 158, 11, 0.25)'); // Bordas com vias

    this.ctx.fillStyle = parkGrad;
    this.ctx.fillRect(px, py, pw, ph);
  }

  drawDrainageLayer(px, py, pw, ph, isDark) {
    // Fundo esverdeado suave
    this.ctx.fillStyle = isDark ? '#0f2922' : '#d1fae5';
    this.ctx.fillRect(px, py, pw, ph);

    // 1. Lago Artificial / Espelho D'água (1.300 m²)
    const lakeX = px + pw * 0.35;
    const lakeY = py + ph * 0.48;
    const lakeW = pw * 0.32;
    const lakeH = ph * 0.24;

    const lakeGrad = this.ctx.createLinearGradient(lakeX, lakeY, lakeX + lakeW, lakeY + lakeH);
    lakeGrad.addColorStop(0, '#06b6d4');
    lakeGrad.addColorStop(1, '#0284c7');

    this.ctx.fillStyle = lakeGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(lakeX + lakeW / 2, lakeY + lakeH / 2, lakeW / 2, lakeH / 2, -0.15, 0, 2 * Math.PI);
    this.ctx.fill();

    // Ondulações no espelho d'água
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    // 2. Biovaletas lineares (Linhas azuis/esmeralda curvas)
    this.ctx.strokeStyle = '#38bdf8';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(px + pw * 0.1, py + ph * 0.15);
    this.ctx.bezierCurveTo(px + pw * 0.25, py + ph * 0.3, px + pw * 0.3, py + ph * 0.4, lakeX, lakeY + lakeH * 0.3);
    this.ctx.stroke();

    // 3. Jardins de chuva (Pequenos círculos filtrantes)
    const rainGardens = [
      { x: px + pw * 0.18, y: py + ph * 0.25 },
      { x: px + pw * 0.28, y: py + ph * 0.65 },
      { x: px + pw * 0.72, y: py + ph * 0.35 },
      { x: px + pw * 0.68, y: py + ph * 0.70 }
    ];

    rainGardens.forEach(rg => {
      this.ctx.fillStyle = '#059669';
      this.ctx.beginPath();
      this.ctx.arc(rg.x, rg.y, 9, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = '#34d399';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });
  }

  drawVegetationLayer(px, py, pw, ph, isDark) {
    this.ctx.fillStyle = isDark ? '#062319' : '#dcfce7';
    this.ctx.fillRect(px, py, pw, ph);

    // Manchas do Bosque Nativo da Mata Atlântica (3.700 árvores)
    const canopyPockets = [
      { x: px + pw * 0.72, y: py + ph * 0.32, r: pw * 0.22, color: 'rgba(5, 150, 105, 0.8)' },
      { x: px + pw * 0.30, y: py + ph * 0.30, r: pw * 0.18, color: 'rgba(16, 185, 129, 0.75)' },
      { x: px + pw * 0.40, y: py + ph * 0.75, r: pw * 0.20, color: 'rgba(16, 185, 129, 0.8)' },
      { x: px + pw * 0.78, y: py + ph * 0.72, r: pw * 0.16, color: 'rgba(5, 150, 105, 0.75)' }
    ];

    canopyPockets.forEach(c => {
      const grad = this.ctx.createRadialGradient(c.x, c.y, 4, c.x, c.y, c.r);
      grad.addColorStop(0, c.color);
      grad.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawMistParticles(w, h) {
    this.ctx.save();
    this.particles.forEach(p => {
      const screenX = (p.x / 100) * w;
      const screenY = (p.y / 100) * h;

      const grad = this.ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, p.radius);
      grad.addColorStop(0, `rgba(6, 182, 212, ${p.alpha * 0.8})`);
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(screenX, screenY, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.restore();
  }

  drawHotspots(w, h) {
    const isDark = this.theme === 'dark';

    AMBIENTAL_DATA.hotspotsMapa.forEach(hSpot => {
      const x = (hSpot.x / 100) * w;
      const y = (hSpot.y / 100) * h;
      const isHovered = this.hoveredHotspot && this.hoveredHotspot.id === hSpot.id;

      // Cor do anel conforme o tipo
      let ringColor = '#10b981';
      if (hSpot.tipo === 'clima') ringColor = '#06b6d4';
      if (hSpot.tipo === 'sustentabilidade') ringColor = '#84cc16';

      this.ctx.save();

      // Pulso animado
      const pulseSize = 8 + Math.sin(this.mistPulseTime * 2 + hSpot.x) * 4;
      this.ctx.strokeStyle = ringColor;
      this.ctx.lineWidth = 1.5;
      this.ctx.globalAlpha = 0.6;
      this.ctx.beginPath();
      this.ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
      this.ctx.stroke();

      // Ponto Central
      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = ringColor;
      this.ctx.beginPath();
      this.ctx.arc(x, y, isHovered ? 7 : 5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = isDark ? '#0f172a' : '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Rótulo se hovered
      if (isHovered) {
        this.ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
        this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
        this.ctx.shadowBlur = 8;
        this.ctx.roundRect(x - 65, y - 36, 130, 24, 6);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        this.ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        this.ctx.font = 'bold 10px system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(hSpot.nome.substring(0, 18) + '...', x, y - 20);
      }

      this.ctx.restore();
    });
  }

  drawLabels(px, py, pw, ph, isDark) {
    this.ctx.save();
    this.ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.85)';
    this.ctx.font = 'bold 11.5px system-ui, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('PARQUE REALENGO SUSANA NASPOLINI', px + 12, py + 22);

    this.ctx.font = '9.5px system-ui, sans-serif';
    this.ctx.fillStyle = '#10b981';
    this.ctx.fillText('● 76.000 m² | 3.700 Árvores | 5 Super-Torres', px + 12, py + 36);
    this.ctx.restore();
  }

  showHotspotModal(hotspot) {
    if (window.VidaApp) {
      window.VidaApp.openHotspotDetail(hotspot);
    }
  }
}

window.VidaHeatmap = new VidaHeatmap();
