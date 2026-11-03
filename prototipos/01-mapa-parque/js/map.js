/**
 * PROJETO 01 — MAPA INTERATIVO DO PARQUE REALENGO
 * Motor de Renderização Gráfica Interativa (Canvas 2D)
 */

class ParqueMapRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    this.hoveredPoi = null;
    this.selectedPoi = null;
    this.activeFilter = 'todas';
    this.timePulse = 0;
    this.animationId = null;

    this.setupResolution();
    this.initEvents();
    this.startLoop();
  }

  setupResolution() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.setupResolution();
      this.draw();
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragStartX = e.clientX - this.panX;
      this.dragStartY = e.clientY - this.panY;
      this.canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.panX = e.clientX - this.dragStartX;
        this.panY = e.clientY - this.dragStartY;
        this.draw();
        return;
      }

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Detecta hover em POI
      const found = this.getPoiAtScreenCoords(mouseX, mouseY);
      if (this.hoveredPoi !== found) {
        this.hoveredPoi = found;
        this.canvas.style.cursor = found ? 'pointer' : 'grab';
        this.draw();
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      if (this.canvas) this.canvas.style.cursor = this.hoveredPoi ? 'pointer' : 'grab';
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const found = this.getPoiAtScreenCoords(mouseX, mouseY);
      if (found) {
        this.selectPoi(found);
      }
    });

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.dragStartX = e.touches[0].clientX - this.panX;
        this.dragStartY = e.touches[0].clientY - this.panY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        this.panX = e.touches[0].clientX - this.dragStartX;
        this.panY = e.touches[0].clientY - this.dragStartY;
        this.draw();
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  getPoiAtScreenCoords(screenX, screenY) {
    const list = this.getFilteredPois();
    for (const poi of list) {
      const pos = this.mapToScreen(poi.x, poi.y);
      const dist = Math.hypot(screenX - pos.x, screenY - pos.y);
      if (dist <= 16) {
        return poi;
      }
    }
    return null;
  }

  getFilteredPois() {
    if (this.activeFilter === 'todas') return MAPA_PARQUE_DATA.pontos;
    return MAPA_PARQUE_DATA.pontos.filter(p => p.categoria === this.activeFilter);
  }

  mapToScreen(pctX, pctY) {
    const parkOriginX = this.width * 0.15 * this.zoom + this.panX;
    const parkOriginY = this.height * 0.12 * this.zoom + this.panY;
    const parkW = this.width * 0.70 * this.zoom;
    const parkH = this.height * 0.76 * this.zoom;

    return {
      x: parkOriginX + (pctX / 100) * parkW,
      y: parkOriginY + (pctY / 100) * parkH
    };
  }

  setFilter(filterId) {
    this.activeFilter = filterId;
    this.draw();
  }

  selectPoi(poi) {
    this.selectedPoi = poi;
    if (window.ParqueApp) {
      window.ParqueApp.showPoiDetail(poi);
    }
    this.draw();
  }

  zoomIn() {
    this.zoom = Math.min(2.2, this.zoom + 0.2);
    this.draw();
  }

  zoomOut() {
    this.zoom = Math.max(0.7, this.zoom - 0.2);
    this.draw();
  }

  resetView() {
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.draw();
  }

  startLoop() {
    const loop = () => {
      this.timePulse += 0.035;
      this.draw();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  draw() {
    if (!this.ctx) return;
    const w = this.width;
    const h = this.height;

    this.ctx.clearRect(0, 0, w, h);

    // 1. Fundo do bairro de Realengo
    this.ctx.fillStyle = "#0c1322";
    this.ctx.fillRect(0, 0, w, h);

    // 2. Vias urbanas do entorno
    this.drawStreets(w, h);

    // 3. Poligonal do Parque Realengo (76.000 m²)
    const px = w * 0.15 * this.zoom + this.panX;
    const py = h * 0.12 * this.zoom + this.panY;
    const pw = w * 0.70 * this.zoom;
    const ph = h * 0.76 * this.zoom;

    // Fundo do Parque (Grama e solo vivo)
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.roundRect(px, py, pw, ph, 20 * this.zoom);
    this.ctx.clip();

    // Gradiente verde do parque
    const parkGrad = this.ctx.createLinearGradient(px, py, px + pw, py + ph);
    parkGrad.addColorStop(0, '#093322');
    parkGrad.addColorStop(0.5, '#0e432d');
    parkGrad.addColorStop(1, '#082f1f');
    this.ctx.fillStyle = parkGrad;
    this.ctx.fillRect(px, py, pw, ph);

    // 4. Manchas do Bosque Mata Atlântica (3.700 árvores)
    this.drawForestPockets(px, py, pw, ph);

    // 5. Pista de Caminhada Perimetral e Alamedas
    this.drawWalkways(px, py, pw, ph);

    // 6. Espelho D'água (1.300 m²)
    this.drawWaterMirror(px, py, pw, ph);

    // 7. Equipamentos (Anfiteatro, Quadras, Horta)
    this.drawAmenities(px, py, pw, ph);

    this.ctx.restore();

    // Borda do parque
    this.ctx.save();
    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 2.5;
    this.ctx.setLineDash([8, 6]);
    this.ctx.strokeRect(px, py, pw, ph);
    this.ctx.restore();

    // 8. Rótulos das ruas e limites
    this.drawStreetLabels(px, py, pw, ph);

    // 9. Pulso de Névoa das Torres
    this.drawTowerMistPulses(px, py, pw, ph);

    // 10. Marcadores / Pins de POI
    this.drawPoiPins();
  }

  drawStreets(w, h) {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    this.ctx.lineWidth = 22 * this.zoom;

    this.ctx.beginPath();
    // Rua Norte (R. Prof Carlos Wenceslau)
    this.ctx.moveTo(0, h * 0.08 * this.zoom + this.panY);
    this.ctx.lineTo(w, h * 0.08 * this.zoom + this.panY);

    // Rua Sul
    this.ctx.moveTo(0, h * 0.92 * this.zoom + this.panY);
    this.ctx.lineTo(w, h * 0.92 * this.zoom + this.panY);

    // Rua Oeste
    this.ctx.moveTo(w * 0.10 * this.zoom + this.panX, 0);
    this.ctx.lineTo(w * 0.10 * this.zoom + this.panX, h);

    // Rua Leste
    this.ctx.moveTo(w * 0.90 * this.zoom + this.panX, 0);
    this.ctx.lineTo(w * 0.90 * this.zoom + this.panX, h);

    this.ctx.stroke();
    this.ctx.restore();
  }

  drawStreetLabels(px, py, pw, ph) {
    this.ctx.save();
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = `bold ${Math.max(9, 11 * this.zoom)}px system-ui, sans-serif`;
    this.ctx.fillText('RUA PROFESSOR CARLOS WENCESLAU (ACESSO PRINCIPAL)', px, py - 10);
    this.ctx.fillText('AV. SANTA CRUZ / REALENGO', px, py + ph + 20 * this.zoom);
    this.ctx.restore();
  }

  drawForestPockets(px, py, pw, ph) {
    const pockets = [
      { x: px + pw * 0.78, y: py + ph * 0.28, r: pw * 0.18 },
      { x: px + pw * 0.82, y: py + ph * 0.50, r: pw * 0.14 },
      { x: px + pw * 0.35, y: py + ph * 0.25, r: pw * 0.15 },
      { x: px + pw * 0.22, y: py + ph * 0.70, r: pw * 0.12 }
    ];

    pockets.forEach(p => {
      const grad = this.ctx.createRadialGradient(p.x, p.y, 4, p.x, p.y, p.r);
      grad.addColorStop(0, '#042416');
      grad.addColorStop(1, 'rgba(4, 36, 22, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fill();

      // Pedaços de copa de árvores
      for (let i = 0; i < 6; i++) {
        const treeX = p.x + (Math.sin(i * 1.5) * p.r * 0.5);
        const treeY = p.y + (Math.cos(i * 1.5) * p.r * 0.5);
        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(treeX, treeY, 7 * this.zoom, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
  }

  drawWalkways(px, py, pw, ph) {
    this.ctx.save();
    this.ctx.strokeStyle = '#23384e';
    this.ctx.lineWidth = 6 * this.zoom;

    // Circuito perimetral
    this.ctx.beginPath();
    this.ctx.roundRect(px + 14 * this.zoom, py + 14 * this.zoom, pw - 28 * this.zoom, ph - 28 * this.zoom, 14 * this.zoom);
    this.ctx.stroke();

    // Alameda central diagonal
    this.ctx.beginPath();
    this.ctx.moveTo(px + pw * 0.15, py + ph * 0.45);
    this.ctx.lineTo(px + pw * 0.85, py + ph * 0.45);
    this.ctx.stroke();

    // Alameda para o lago
    this.ctx.beginPath();
    this.ctx.moveTo(px + pw * 0.5, py + ph * 0.2);
    this.ctx.lineTo(px + pw * 0.5, py + ph * 0.8);
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawWaterMirror(px, py, pw, ph) {
    const lx = px + pw * 0.48;
    const ly = py + ph * 0.62;
    const rx = pw * 0.18;
    const ry = ph * 0.12;

    const waterGrad = this.ctx.createRadialGradient(lx, ly, 4, lx, ly, rx);
    waterGrad.addColorStop(0, '#38bdf8');
    waterGrad.addColorStop(0.7, '#0284c7');
    waterGrad.addColorStop(1, '#075985');

    this.ctx.fillStyle = waterGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(lx, ly, rx, ry, 0.1, 0, Math.PI * 2);
    this.ctx.fill();

    // Borda deck
    this.ctx.strokeStyle = '#38bdf8';
    this.ctx.lineWidth = 2 * this.zoom;
    this.ctx.stroke();

    // Rótulo do lago
    this.ctx.fillStyle = '#e0f2fe';
    this.ctx.font = `bold ${Math.max(9, 10 * this.zoom)}px system-ui`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText("ESPELHO D'ÁGUA (1.300 m²)", lx, ly + 4);
  }

  drawAmenities(px, py, pw, ph) {
    // Anfiteatro (semicírculo)
    const ax = px + pw * 0.38;
    const ay = py + ph * 0.52;
    this.ctx.strokeStyle = '#f59e0b';
    this.ctx.lineWidth = 3 * this.zoom;
    this.ctx.beginPath();
    this.ctx.arc(ax, ay, 20 * this.zoom, 0, Math.PI);
    this.ctx.stroke();

    // Quadras (retângulo azul/roxo)
    const qx = px + pw * 0.72;
    const qy = py + ph * 0.60;
    this.ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    this.ctx.strokeStyle = '#3b82f6';
    this.ctx.lineWidth = 1.5;
    this.ctx.fillRect(qx, qy, pw * 0.14, ph * 0.12);
    this.ctx.strokeRect(qx, qy, pw * 0.14, ph * 0.12);
  }

  drawTowerMistPulses(px, py, pw, ph) {
    const torres = MAPA_PARQUE_DATA.pontos.filter(p => p.categoria === 'torres');
    torres.forEach((t, i) => {
      const pos = this.mapToScreen(t.x, t.y);
      const pulse = (this.timePulse + i * 1.2) % 3;
      const r = (12 + pulse * 14) * this.zoom;
      const alpha = Math.max(0, 0.6 - pulse * 0.2);

      this.ctx.save();
      this.ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  drawPoiPins() {
    const list = this.getFilteredPois();
    list.forEach(poi => {
      const pos = this.mapToScreen(poi.x, poi.y);
      const isHovered = this.hoveredPoi && this.hoveredPoi.id === poi.id;
      const isSelected = this.selectedPoi && this.selectedPoi.id === poi.id;

      let color = '#10b981';
      if (poi.categoria === 'torres') color = '#06b6d4';
      if (poi.categoria === 'agua') color = '#38bdf8';
      if (poi.categoria === 'lazer') color = '#f59e0b';
      if (poi.categoria === 'servicos') color = '#8b5cf6';

      this.ctx.save();

      // Halo se selecionado ou hovered
      if (isSelected || isHovered) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 16 * this.zoom, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      // Pin Circular
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, (isHovered ? 9 : 7) * this.zoom, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Tooltip flutuante se hovered
      if (isHovered) {
        this.ctx.fillStyle = '#0f172a';
        this.ctx.roundRect(pos.x - 70, pos.y - 34, 140, 24, 6);
        this.ctx.fill();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 10px system-ui';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(poi.nome.substring(0, 20) + (poi.nome.length > 20 ? '...' : ''), pos.x, pos.y - 18);
      }

      this.ctx.restore();
    });
  }
}

window.ParqueMapRenderer = ParqueMapRenderer;
