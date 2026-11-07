/**
 * PROJETO V.I.D.A. — CENTRAL MULTITELA DE SUSTENTABILIDADE
 * Sustentabilidade & Biotecnologia Aplicada
 * Motor Gráfico 2.5D / 3D Isométrico com Depth Sorting (Z-Buffer / Painter's Algorithm),
 * Iluminação Direcional, Sombras Projetadas, Partículas Procedurais e Câmera Explorável com Lerp (60 FPS).
 */

class ParqueVivoEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Dimensões do espaço de projeto (1440 × 920)
    this.baseW = 1440;
    this.baseH = 920;

    // Estado da Câmera (Com interpolação suave Lerp, Órbita e Zoom)
    this.camera = {
      x: 720,
      y: 480,
      zoom: 1.0,
      pitch: 0.58,   // Fator de compressão isométrica Y (0.58 = clássico 30°)
      yaw: 0,        // Rotação orbital em radianos
      mode: 'aerial' // 'aerial' (aérea) ou 'pedestrian' (nível pedestre)
    };

    this.targetCamera = { ...this.camera };
    this.cameraLimits = {
      minZoom: 0.65,
      maxZoom: 2.6,
      minX: 400,
      maxX: 1040,
      minY: 300,
      maxY: 640
    };

    // Estado de Tempo e Clima
    this.time = 0;
    this.mistIntensity = 1.0;
    this.isRaining = false;
    this.rainIntensity = 0; // mm/h
    this.waterRunoffLevel = 0.35; // 0 a 1

    // Estado das Missões
    this.activeHighlight = null;
    this.activeMission = null;
    this.missionState = {
      treesPlanted: [],
      recycledCount: 0,
      waterSaturation: 50,
      coolingDelta: -0.0
    };

    // Attract Mode (Passeio Contínuo com tempo de leitura ampliado para 16s)
    this.isAttractMode = true;
    this.attractStep = 0;
    this.attractTimer = null;
    this.attractInterval = 16000;

    // Coordenadas Espaciais e Dados Oficiais dos Equipamentos
    this.equipments = {
      overview: {
        id: 'overview',
        nome: "Vista Geral do Parque Realengo",
        categoria: "Implantação Urbana Sustentável",
        descricao: "76.000 m² de regeneração ambiental no terreno da antiga Fábrica de Cartuchos do Exército. 84,2% de solo permeável.",
        metrica: "Área Total: 76.000 m² • 84,2% permeável",
        coords: { x: 720, y: 480 },
        zoom: 1.0,
        pitch: 0.58
      },
      torres: {
        id: 'torres',
        nome: "Cinco Super-Torres Bioclimáticas",
        categoria: "Conforto Térmico & Microclima",
        descricao: "Torres metálicas treliçadas (alturas de 17m, 26m e torre central de 47m) com 236 bicos aspersores vaporizando névoa d'água.",
        metrica: "Alívio Térmico: até -5,8°C de resfriamento",
        coords: { x: 730, y: 440 },
        zoom: 1.45,
        pitch: 0.50
      },
      agua: {
        id: 'agua',
        nome: "Espelho D'Água & Drenagem Pluvial",
        categoria: "Soluções Baseadas na Natureza (SbN)",
        descricao: "Lâmina d'água de 1.300 m² integrada a bacia de amortecimento de 1.950 m³, 450m de biovaletas e 12 jardins de chuva.",
        metrica: "Capacidade: 1.950.000 L de enxurrada retida",
        coords: { x: 670, y: 610 },
        zoom: 1.5,
        pitch: 0.55
      },
      nave: {
        id: 'nave',
        nome: "Nave do Conhecimento",
        categoria: "Educação & Inovação Digital",
        descricao: "Domo tecnológico contemporâneo com cursos gratuitos de robótica, informática e inclusão digital para a Zona Oeste.",
        metrica: "Inclusão: mais de 1.500 alunos/mês",
        coords: { x: 420, y: 380 },
        zoom: 1.6,
        pitch: 0.52
      },
      vegetacao: {
        id: 'vegetacao',
        nome: "Bosque da Mata Atlântica",
        categoria: "Biodiversidade & Reflorestamento",
        descricao: "3.700 árvores nativas (Ipês Amarelos e Roxos, Pau-Brasil, Jacarandás e Oitis) recuperando o solo industrial.",
        metrica: "Reflorestamento: 3.700 mudas • 42 espécies de aves",
        coords: { x: 880, y: 380 },
        zoom: 1.4,
        pitch: 0.54
      },
      anfiteatro: {
        id: 'anfiteatro',
        nome: "Espaço Cultural & Skatepark",
        categoria: "Cultura, Esporte & Comunidade",
        descricao: "Concha acústica a céu aberto com arquibancada para 600 pessoas em homenagem à jornalista, ao lado do skatepark com bowl oficial.",
        metrica: "Capacidade: 600 lugares • Bowl: 1.200 m²",
        coords: { x: 460, y: 560 },
        zoom: 1.55,
        pitch: 0.52
      }
    };

    // As 5 Super-Torres (Escala Real de Alturas: 17m, 26m e Central de 47m)
    this.towerLocations = [
      { id: 't1', x: 590, y: 370, h: 68,  raioBase: 14, name: "Torre Norte (17m)" },
      { id: 't2', x: 730, y: 430, h: 168, raioBase: 22, name: "Torre Central Principal (47m)", isMain: true },
      { id: 't3', x: 890, y: 400, h: 104, raioBase: 17, name: "Torre Leste (26m)" },
      { id: 't4', x: 630, y: 520, h: 68,  raioBase: 14, name: "Torre Sul (17m)" },
      { id: 't5', x: 810, y: 530, h: 104, raioBase: 17, name: "Torre Oeste (26m)" }
    ];

    // Árvores da Mata Atlântica Catalogadas (3.700 árvores representadas volumetricamente)
    this.forestCanopy = this.generateForestCanopy();

    // Sistema de Partículas (Névoa Bioclimática, Chuva e Jatos D'água)
    this.mistParticles = [];
    this.rainDrops = [];
    this.splashFountains = [];

    this.setupCanvas();
    this.initParticles();
    this.startRenderLoop();
    this.startAttractMode();
  }

  // --- CONFIGURAÇÃO DO CANVAS COM DPI E RESIZE ---
  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    const scale = Math.min(rect.width / this.baseW, rect.height / this.baseH);
    const offsetX = (rect.width - this.baseW * scale) / 2;
    const offsetY = (rect.height - this.baseH * scale) / 2;

    this.renderTransform = { dpr, scale, offsetX, offsetY };

    if (!this.hasResizeListener) {
      this.hasResizeListener = true;
      window.addEventListener('resize', () => this.setupCanvas());
    }
  }

  // --- GERAÇÃO DA COBERTURA VOLUMÉTRICA ARBÓREA ---
  generateForestCanopy() {
    const species = [
      { tipo: 'ipe-amarelo', corCopa: '#eab308', corFlor: '#fef08a', rMin: 18, rMax: 26 },
      { tipo: 'ipe-roxo',    corCopa: '#7c3aed', corFlor: '#c084fc', rMin: 18, rMax: 25 },
      { tipo: 'pau-brasil',  corCopa: '#047857', corFlor: '#f87171', rMin: 22, rMax: 32 },
      { tipo: 'jacaranda',   corCopa: '#4338ca', corFlor: '#818cf8', rMin: 20, rMax: 28 },
      { tipo: 'oiti',        corCopa: '#065f46', corFlor: '#34d399', rMin: 24, rMax: 34 }
    ];

    const trees = [];
    const clusters = [
      // Bosque Norte (Maciço denso)
      { cx: 880, cy: 340, count: 26, radius: 110 },
      // Bosque Central Oeste
      { cx: 500, cy: 430, count: 18, radius: 85 },
      // Bosque da Drenagem Sul
      { cx: 920, cy: 560, count: 22, radius: 95 },
      // Alamedas e bordas perimetrais
      { cx: 340, cy: 490, count: 12, radius: 65 },
      { cx: 700, cy: 310, count: 14, radius: 70 },
      { cx: 1080, cy: 460, count: 12, radius: 60 }
    ];

    let seed = 42;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    clusters.forEach(cl => {
      for (let i = 0; i < cl.count; i++) {
        const ang = rnd() * Math.PI * 2;
        const dist = Math.sqrt(rnd()) * cl.radius;
        const x = cl.cx + Math.cos(ang) * dist;
        const y = cl.cy + Math.sin(ang) * dist;
        const sp = species[Math.floor(rnd() * species.length)];
        const r = sp.rMin + rnd() * (sp.rMax - sp.rMin);

        trees.push({
          id: `tree_${trees.length}`,
          x,
          y,
          r,
          h: r * 1.35,
          sp,
          swayOffset: rnd() * Math.PI * 2
        });
      }
    });

    return trees;
  }

  // --- SISTEMA DE PARTÍCULAS ---
  initParticles() {
    // 1. Névoa das 5 Super-Torres (236 bicos aspersores)
    this.mistParticles = [];
    for (let i = 0; i < 110; i++) {
      const t = this.towerLocations[i % this.towerLocations.length];
      this.mistParticles.push({
        baseX: t.x,
        baseY: t.y - t.h,
        x: t.x + (Math.random() - 0.5) * 30,
        y: t.y - t.h + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.4) * 0.8 + 0.3,
        vy: (Math.random() - 0.5) * 0.35 + 0.1,
        radius: Math.random() * 26 + 14,
        alpha: Math.random() * 0.35 + 0.15,
        life: Math.random() * 100
      });
    }

    // 2. Jatos d'água da área infantil (Splash Pad)
    this.splashFountains = [];
    for (let j = 0; j < 5; j++) {
      this.splashFountains.push({
        x: 480 + j * 16,
        y: 635,
        maxH: 28 + Math.random() * 14,
        phase: j * 0.8
      });
    }
  }

  // --- CONTROLES DE CÂMERA COM LERP E ÓRBITA ---
  setCameraMode(mode) {
    if (mode === 'pedestrian') {
      this.targetCamera.mode = 'pedestrian';
      this.targetCamera.pitch = 0.28; // Ângulo baixo pedestre imersivo
      this.targetCamera.zoom = 1.75;
      this.targetCamera.y = 440;
    } else {
      this.targetCamera.mode = 'aerial';
      this.targetCamera.pitch = 0.58; // Perspectiva aérea axonométrica
      this.targetCamera.zoom = 1.0;
      this.targetCamera.x = 720;
      this.targetCamera.y = 480;
    }
  }

  rotateCamera(direction, amount = 0.25) {
    this.stopAttractMode();
    if (direction === 'left') {
      this.targetCamera.yaw -= amount;
    } else if (direction === 'right') {
      this.targetCamera.yaw += amount;
    } else if (direction === 'up') {
      this.targetCamera.pitch = Math.min(0.75, this.targetCamera.pitch + 0.08);
    } else if (direction === 'down') {
      this.targetCamera.pitch = Math.max(0.22, this.targetCamera.pitch - 0.08);
    }
  }

  zoomCamera(delta) {
    this.stopAttractMode();
    const newZoom = this.targetCamera.zoom + delta;
    this.targetCamera.zoom = Math.max(this.cameraLimits.minZoom, Math.min(this.cameraLimits.maxZoom, newZoom));
  }

  panCamera(dx, dy) {
    this.stopAttractMode();
    const speed = 40 / this.targetCamera.zoom;
    this.targetCamera.x = Math.max(this.cameraLimits.minX, Math.min(this.cameraLimits.maxX, this.targetCamera.x + dx * speed));
    this.targetCamera.y = Math.max(this.cameraLimits.minY, Math.min(this.cameraLimits.maxY, this.targetCamera.y + dy * speed));
  }

  focusCamera(targetKey) {
    this.stopAttractMode();
    this.activeHighlight = targetKey;

    if (!targetKey || !this.equipments[targetKey]) {
      this.updateHighlightCard(null);
      return;
    }

    const eq = this.equipments[targetKey];
    this.targetCamera.x = eq.coords.x;
    this.targetCamera.y = eq.coords.y;
    this.targetCamera.zoom = eq.zoom || 1.35;
    this.targetCamera.pitch = eq.pitch || 0.55;

    this.updateHighlightCard(targetKey);

    if (targetKey === 'torres') {
      this.triggerMistBoost();
    }
  }

  updateHighlightCard(targetKey) {
    const card = document.getElementById('stage-highlight-card');
    if (!card) return;

    if (!targetKey || !this.equipments[targetKey] || targetKey === 'overview') {
      card.classList.remove('visible');
      return;
    }

    const eq = this.equipments[targetKey];
    card.innerHTML = `
      <div class="hl-card-header">
        <span class="hl-category-tag">${eq.categoria}</span>
        <h4>${eq.nome}</h4>
      </div>
      <p class="hl-card-desc">${eq.descricao}</p>
      <div class="hl-card-metric">
        <span>📊 ${eq.metrica}</span>
      </div>
    `;
    card.classList.add('visible');
  }

  // --- ATTRACT MODE (MODO DE ESPERA VIVO A CADA 9S) ---
  startAttractMode() {
    this.isAttractMode = true;
    const sequence = ['overview', 'torres', 'agua', 'nave', 'vegetacao', 'anfiteatro'];

    const nextStep = () => {
      if (!this.isAttractMode) return;
      const key = sequence[this.attractStep % sequence.length];
      const eq = this.equipments[key];

      this.targetCamera.x = eq.coords.x;
      this.targetCamera.y = eq.coords.y;
      this.targetCamera.zoom = eq.zoom;
      this.targetCamera.pitch = eq.pitch;
      this.activeHighlight = key === 'overview' ? null : key;

      this.updateAttractBanner(eq);
      this.attractStep++;
      this.attractTimer = setTimeout(nextStep, this.attractInterval);
    };

    nextStep();
  }

  stopAttractMode() {
    this.isAttractMode = false;
    clearTimeout(this.attractTimer);
    const banner = document.getElementById('attract-mode-banner');
    if (banner) banner.style.display = 'none';
  }

  updateAttractBanner(eq) {
    const title = document.getElementById('attract-title');
    const desc = document.getElementById('attract-desc');
    const banner = document.getElementById('attract-mode-banner');
    if (title) title.innerText = eq.nome;
    if (desc) desc.innerText = eq.descricao;
    if (banner) banner.style.display = 'flex';
  }

  // --- SIMULAÇÕES BIOCLIMÁTICAS E DE DRENAGEM ---
  triggerMistBoost() {
    this.mistIntensity = 3.8;
    setTimeout(() => { this.mistIntensity = 1.0; }, 7000);
  }

  setRainSimulation(intensity) {
    this.rainIntensity = intensity;
    this.isRaining = intensity > 0;
    this.waterRunoffLevel = Math.min(1.0, 0.35 + (intensity / 110) * 0.65);

    this.rainDrops = [];
    const count = Math.floor(intensity * 4);
    for (let i = 0; i < count; i++) {
      this.rainDrops.push({
        x: Math.random() * this.baseW,
        y: Math.random() * this.baseH,
        len: Math.random() * 18 + 12,
        speed: Math.random() * 10 + 14
      });
    }
  }

  plantTree(coords, speciesName = 'Ipê-Amarelo') {
    const newTree = {
      id: `planted_${Date.now()}`,
      x: coords.x || (700 + (Math.random() - 0.5) * 350),
      y: coords.y || (420 + (Math.random() - 0.5) * 220),
      r: 22,
      h: 30,
      sp: {
        tipo: 'planted',
        corCopa: speciesName.includes('Ipê') ? '#eab308' : (speciesName.includes('Pau') ? '#047857' : '#7c3aed'),
        corFlor: '#ffffff'
      },
      scale: 0.1, // Animação de crescimento
      targetScale: 1.0
    };

    this.missionState.treesPlanted.push(newTree);
    this.missionState.coolingDelta = Math.min(5.8, this.missionState.treesPlanted.length * 0.72);
  }

  // --- RENDER LOOP PRINCIPAL (60 FPS) ---
  startRenderLoop() {
    const loop = () => {
      this.time += 0.025;
      this.updatePhysics();
      this.draw();
      requestAnimationFrame(loop);
    };
    loop();
  }

  updatePhysics() {
    // Interpolação suave da câmera (Lerp)
    const factor = 0.07;
    this.camera.x += (this.targetCamera.x - this.camera.x) * factor;
    this.camera.y += (this.targetCamera.y - this.camera.y) * factor;
    this.camera.zoom += (this.targetCamera.zoom - this.camera.zoom) * factor;
    this.camera.pitch += (this.targetCamera.pitch - this.camera.pitch) * factor;
    this.camera.yaw += (this.targetCamera.yaw - this.camera.yaw) * factor;

    // Partículas de névoa
    this.mistParticles.forEach(p => {
      p.x += p.vx * this.mistIntensity;
      p.y += p.vy;
      p.life += 1;
      p.alpha -= 0.0035;

      if (p.life > 100 || p.alpha <= 0) {
        p.life = 0;
        p.alpha = Math.random() * 0.35 + 0.15;
        p.x = p.baseX + (Math.random() - 0.5) * 25;
        p.y = p.baseY + (Math.random() - 0.5) * 15;
      }
    });

    // Chuva
    if (this.isRaining) {
      this.rainDrops.forEach(d => {
        d.y += d.speed;
        d.x += 1.8;
        if (d.y > this.baseH) {
          d.y = -20;
          d.x = Math.random() * this.baseW;
        }
      });
    }

    // Mudas plantadas crescendo
    this.missionState.treesPlanted.forEach(t => {
      if (t.scale < t.targetScale) {
        t.scale += 0.04;
      }
    });
  }

  // --- PIPELINE DE RENDERIZAÇÃO COM DEPTH SORTING ---
  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const { dpr, scale, offsetX, offsetY } = this.renderTransform || { dpr: 1, scale: 1, offsetX: 0, offsetY: 0 };

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Configura matriz de câmera (Escala, Centro, Pitch e Yaw)
    ctx.save();
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, offsetX * dpr, offsetY * dpr);

    // Aplica zoom e enquadramento relativo ao ponto focal da câmera
    ctx.translate(this.baseW / 2, this.baseH / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.rotate(this.camera.yaw);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Fundo do Palco Arquitetônico
    this.drawAtmosphere(ctx);

    // 2. Malha Urbana Perimetral (Rua Prof. Carlos Wenceslau & Quarteirões de Realengo)
    this.drawPerimeterUrbanContext(ctx);

    // 3. Polígono Real do Terreno (76.000 m² da antiga Fábrica de Cartuchos)
    this.drawParkBoundarySite(ctx);

    // 4. Passeios, Calçadões e Passarelas Elevadas (Piso Permeável 84,2%)
    this.drawWalkwaysAndBoardwalks(ctx);

    // 5. Sistema de Drenagem: 450m de Biovaletas & 12 Jardins de Chuva
    this.drawBioswalesAndRainGardens(ctx);

    // 6. Espelho D'água (1.300 m² / 1.950.000 Litros)
    this.drawWaterMirror(ctx);

    // 7. Renderização com Depth Sorting (Painter's Algorithm ordenado por Y/Z)
    this.renderDepthSortedEntities(ctx);

    // 8. Destaque Visual In-Place (Spotlight Arquitetônico & Callout Pin)
    this.drawSpotlightHighlight(ctx);

    // 9. Camada Atmosférica de Névoa & Chuva
    this.drawAtmosphericEffects(ctx);

    ctx.restore();
  }

  // --- 1. ATMOSFERA E GRADIENTE DE ILUMINAÇÃO ---
  drawAtmosphere(ctx) {
    const bgGrad = ctx.createRadialGradient(720, 480, 80, 720, 480, 950);
    bgGrad.addColorStop(0, '#0a1426');
    bgGrad.addColorStop(0.65, '#050a16');
    bgGrad.addColorStop(1, '#02040a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(-200, -200, this.baseW + 400, this.baseH + 400);

    // Grade métrica arquitetônica sutil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    for (let x = -200; x < this.baseW + 200; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, -200);
      ctx.lineTo(x, this.baseH + 200);
      ctx.stroke();
    }
    for (let y = -200; y < this.baseH + 200; y += 60) {
      ctx.beginPath();
      ctx.moveTo(-200, y);
      ctx.lineTo(this.baseW + 200, y);
      ctx.stroke();
    }
  }

  // --- 2. CONTEXTO URBANO PERIMETRAL (REALENGO 3D) ---
  drawPerimeterUrbanContext(ctx) {
    ctx.save();

    // Vias perimetrais asfaltadas
    ctx.strokeStyle = '#111b2b';
    ctx.lineWidth = 42;
    ctx.lineCap = 'round';
    
    // Rua Prof. Carlos Wenceslau (Norte)
    ctx.beginPath();
    ctx.moveTo(100, 230);
    ctx.lineTo(1340, 230);
    ctx.stroke();

    // Av. Santa Cruz (Sul)
    ctx.beginPath();
    ctx.moveTo(100, 740);
    ctx.lineTo(1340, 740);
    ctx.stroke();

    // Faixas viárias
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(120, 230);
    ctx.lineTo(1320, 230);
    ctx.moveTo(120, 740);
    ctx.lineTo(1320, 740);
    ctx.stroke();
    ctx.setLineDash([]);

    // Rótulos de vias oficiais
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText("RUA PROFESSOR CARLOS WENCESLAU • ACESSO NORTE", 280, 222);
    ctx.fillText("AVENIDA SANTA CRUZ • ACESSO SUL", 280, 755);

    // Blocos arquitetônicos urbanos 3D com faces iluminadas e sombras
    const buildings = [
      { x: 140, y: 175, w: 90,  h: 60, h3d: 55 },
      { x: 250, y: 145, w: 110, h: 70, h3d: 70 },
      { x: 380, y: 155, w: 95,  h: 55, h3d: 48 },
      { x: 1060, y: 150, w: 100, h: 65, h3d: 60 },
      { x: 1180, y: 165, w: 110, h: 70, h3d: 75 },
      { x: 140,  y: 690, w: 110, h: 65, h3d: 45 },
      { x: 1140, y: 685, w: 115, h: 70, h3d: 58 }
    ];

    buildings.forEach(b => {
      // Sombra projetada
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(b.x + 8, b.y + 10, b.w, b.h);

      // Face frontal sombreada
      ctx.fillStyle = '#182438';
      ctx.fillRect(b.x, b.y - b.h3d, b.w, b.h + b.h3d);

      // Face superior iluminada (Telhado arquitetônico)
      ctx.fillStyle = '#2d3f58';
      ctx.fillRect(b.x, b.y - b.h3d, b.w, b.h * 0.45);

      // Linhas estruturais
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x, b.y - b.h3d, b.w, b.h + b.h3d);
    });

    ctx.restore();
  }

  // --- 3. POLÍGONO REAL DO PARQUE (76.000 m² FÁBRICA DE CARTUCHOS) ---
  drawParkBoundarySite(ctx) {
    const px = 210, py = 250, pw = 1020, ph = 470;

    // Sombra de profundidade do terreno
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.roundRect(px + 12, py + 16, pw, ph, 28);
    ctx.fill();

    // Solo vivo de solo permeável regenerado
    const soilGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
    soilGrad.addColorStop(0, '#0a2318');
    soilGrad.addColorStop(0.5, '#0e3322');
    soilGrad.addColorStop(1, '#071f14');
    ctx.fillStyle = soilGrad;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 28);
    ctx.fill();

    // Textura procedural de piso drenante (84,2% permeável)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.lineWidth = 1;
    for (let x = px + 20; x < px + pw; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, py + 15);
      ctx.lineTo(x, py + ph - 15);
      ctx.stroke();
    }

    // Contorno arquitetônico com brilho esmeralda
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  // --- 4. CALÇADÕES E PASSARELAS ELEVADAS ---
  drawWalkwaysAndBoardwalks(ctx) {
    const px = 210, py = 250, pw = 1020, ph = 470;

    ctx.save();
    // Calçadão em pedra drenante clara
    ctx.strokeStyle = '#22364f';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';

    // Anel perimetral do parque
    ctx.beginPath();
    ctx.roundRect(px + 45, py + 45, pw - 90, ph - 90, 24);
    ctx.stroke();

    // Promenade curva principal conectando Norte ao Sul
    ctx.beginPath();
    ctx.moveTo(px + 90, py + ph * 0.45);
    ctx.bezierCurveTo(px + 320, py + ph * 0.35, px + 540, py + ph * 0.65, px + pw - 80, py + ph * 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(px + pw * 0.5, py + 50);
    ctx.bezierCurveTo(px + pw * 0.46, py + 220, px + pw * 0.54, py + 340, px + pw * 0.5, py + ph - 50);
    ctx.stroke();

    // Passarela metálica elevada conectando as Super-Torres (3D cyan highlight)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(590, 370);
    ctx.lineTo(730, 430);
    ctx.lineTo(890, 400);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(730, 430);
    ctx.lineTo(630, 520);
    ctx.lineTo(810, 530);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  // --- 5. BIOVALETAS (450M) & 12 JARDINS DE CHUVA ---
  drawBioswalesAndRainGardens(ctx) {
    const px = 210, py = 250;

    ctx.save();
    // Biovaletas de Drenagem com fluxo hídrico animado
    const waterAlpha = 0.5 + Math.sin(this.time * 2) * 0.15;
    ctx.strokeStyle = `rgba(6, 182, 212, ${waterAlpha})`;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    // Traçado orgânico das biovaletas convergindo para o lago
    ctx.beginPath();
    ctx.moveTo(px + 70, py + 60);
    ctx.bezierCurveTo(px + 280, py + 120, px + 390, py + 210, 560, 560);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(px + 880, py + 80);
    ctx.bezierCurveTo(px + 780, py + 180, px + 710, py + 260, 780, 570);
    ctx.stroke();

    // 12 Jardins de Chuva Filtrantes (Pequenas bacias com vegetação hidrófila)
    const rainGardens = [
      { x: 340, y: 390 }, { x: 480, y: 340 }, { x: 620, y: 310 },
      { x: 780, y: 300 }, { x: 940, y: 320 }, { x: 1040, y: 390 },
      { x: 330, y: 550 }, { x: 440, y: 640 }, { x: 880, y: 630 },
      { x: 990, y: 560 }, { x: 690, y: 530 }, { x: 840, y: 470 }
    ];

    rainGardens.forEach((rg, idx) => {
      // Bacia do jardim de chuva
      ctx.fillStyle = 'rgba(6, 78, 59, 0.7)';
      ctx.beginPath();
      ctx.ellipse(rg.x, rg.y, 16, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Macrófitas filtrantes no centro
      ctx.fillStyle = idx % 2 === 0 ? '#34d399' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(rg.x, rg.y - 1, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // --- 6. ESPELHO D'ÁGUA (1.300 m² / 1,95 MILHÃO DE LITROS) ---
  drawWaterMirror(ctx) {
    const lx = 680, ly = 615;
    const rx = 195, ry = 85;

    ctx.save();
    // Deck perimetral de madeira plástica ecológica
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(lx, ly, rx + 16, ry + 16, -0.05, 0, Math.PI * 2);
    ctx.fill();

    // Lâmina d'água permanente com gradiente e ondas procedurais
    const waterGrad = ctx.createLinearGradient(lx - rx, ly, lx + rx, ly + ry);
    waterGrad.addColorStop(0, '#06b6d4');
    waterGrad.addColorStop(0.5, '#0284c7');
    waterGrad.addColorStop(1, '#0369a1');
    ctx.fillStyle = waterGrad;
    ctx.beginPath();
    ctx.ellipse(lx, ly, rx, ry, -0.05, 0, Math.PI * 2);
    ctx.fill();

    // Ondulações dinâmicas (Equação de onda por seno/cosseno)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const offset = (this.time * 22 + i * 28) % (rx * 0.8);
      ctx.beginPath();
      ctx.arc(lx + (i % 2 === 0 ? -40 : 40), ly + (i % 2 === 0 ? 10 : -12), offset, -0.35, 0.35);
      ctx.stroke();
    }

    // Ninféias e macrófitas filtrantes
    ctx.fillStyle = '#10b981';
    [-80, -30, 45, 90, 130].forEach((ox, idx) => {
      ctx.beginPath();
      ctx.arc(lx + ox, ly + (idx % 2 === 0 ? -22 : 24), 7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Rótulo arquitetônico
    ctx.fillStyle = '#f0f9ff';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText("ESPELHO D'ÁGUA • 1.300 m² (BACIA 1.950 m³)", lx, ly + 4);

    ctx.restore();
  }

  // --- 7. DEPTH SORTING: RENDERIZAÇÃO ORDENADA POR PROFUNDIDADE (Y/Z) ---
  renderDepthSortedEntities(ctx) {
    const entities = [];

    // Adiciona as 5 Super-Torres
    this.towerLocations.forEach(t => {
      entities.push({
        type: 'tower',
        depth: t.y,
        data: t
      });
    });

    // Adiciona Árvores da Mata Atlântica
    this.forestCanopy.forEach(tr => {
      entities.push({
        type: 'tree',
        depth: tr.y,
        data: tr
      });
    });

    // Adiciona Mudas Plantadas pelos Visitantes
    this.missionState.treesPlanted.forEach(pt => {
      entities.push({
        type: 'planted_tree',
        depth: pt.y,
        data: pt
      });
    });

    // Adiciona Equipamentos Arquitetônicos Reais
    entities.push(
      { type: 'nave', depth: 360, x: 370, y: 340 },
      { type: 'anfiteatro', depth: 590, x: 390, y: 590 },
      { type: 'skatepark', depth: 350, x: 990, y: 340 },
      { type: 'sports', depth: 490, x: 970, y: 470 },
      { type: 'splash_pad', depth: 640, x: 480, y: 640 }
    );

    // Ordenação do Z-Buffer (Painter's Algorithm: do fundo para a frente)
    entities.sort((a, b) => a.depth - b.depth);

    // Renderiza cada entidade na ordem correta de oclusão
    entities.forEach(ent => {
      if (ent.type === 'tower') {
        this.renderSuperTower3D(ctx, ent.data);
      } else if (ent.type === 'tree') {
        this.renderTreeVolumetric(ctx, ent.data);
      } else if (ent.type === 'planted_tree') {
        this.renderPlantedTreeAnimated(ctx, ent.data);
      } else if (ent.type === 'nave') {
        this.renderNaveDoConhecimento3D(ctx, ent.x, ent.y);
      } else if (ent.type === 'anfiteatro') {
        this.renderAnfiteatro3D(ctx, ent.x, ent.y);
      } else if (ent.type === 'skatepark') {
        this.renderSkateparkBowl3D(ctx, ent.x, ent.y);
      } else if (ent.type === 'sports') {
        this.renderSportsArena3D(ctx, ent.x, ent.y);
      } else if (ent.type === 'splash_pad') {
        this.renderSplashPadAnimated(ctx, ent.x, ent.y);
      }
    });
  }

  // --- MODELAGEM 3D: SUPER-TORRES TRELIÇADAS BIOCLIMÁTICAS ---
  renderSuperTower3D(ctx, t) {
    ctx.save();
    const bx = t.x, by = t.y, h = t.h, r = t.raioBase;
    const topY = by - h;

    // Sombra projetada no solo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(bx + 14, by + 8, r * 1.4, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Base metálica estrutural com chumbadores
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(bx, by, r, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = t.isMain ? '#f59e0b' : '#10b981';
    ctx.lineWidth = t.isMain ? 2.5 : 1.8;
    ctx.stroke();

    // Pilares metálicos tubulares verticais (6 colunas em perspectiva)
    const segments = 4;
    const stepH = h / segments;

    for (let s = 0; s < segments; s++) {
      const y0 = by - s * stepH;
      const y1 = by - (s + 1) * stepH;
      const r0 = r * (1 - (s * 0.12));
      const r1 = r * (1 - ((s + 1) * 0.12));

      // Colunas verticais
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = t.isMain ? 2.2 : 1.6;
      ctx.beginPath();
      ctx.moveTo(bx - r0, y0);
      ctx.lineTo(bx - r1, y1);
      ctx.moveTo(bx + r0, y0);
      ctx.lineTo(bx + r1, y1);
      ctx.stroke();

      // Treliçado em X estrutural
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(bx - r0, y0);
      ctx.lineTo(bx + r1, y1);
      ctx.moveTo(bx + r0, y0);
      ctx.lineTo(bx - r1, y1);
      ctx.stroke();

      // Anéis de reforço horizontal
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(bx, y1, r1, r1 * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Coroa e Bicos Aspersores de Nebulização no topo
    const topR = r * 0.75;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.beginPath();
    ctx.ellipse(bx, topY, topR * 1.5, topR * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Rótulo da Super-Torre
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(t.name, bx, topY - 14);

    ctx.restore();
  }

  // --- MODELAGEM 3D: COPA VOLUMÉTRICA DA MATA ATLÂNTICA ---
  renderTreeVolumetric(ctx, tr) {
    ctx.save();
    const sway = Math.sin(this.time * 2 + tr.swayOffset) * 2.5;
    const tx = tr.x + sway;
    const ty = tr.y;

    // Sombra elíptica projetada no solo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(tr.x + 6, ty + 6, tr.r * 1.1, tr.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tronco 3D
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = tr.r * 0.22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tr.x, ty);
    ctx.lineTo(tx, ty - tr.h * 0.65);
    ctx.stroke();

    // Copa volumétrica em camadas (Sombra, Tom Médio e Destaque Solar)
    const cy = ty - tr.h * 0.75;

    // Camada 1: Sombra inferior
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.arc(tx, cy + 4, tr.r * 0.95, 0, Math.PI * 2);
    ctx.fill();

    // Camada 2: Volume principal
    ctx.fillStyle = tr.sp.corCopa;
    ctx.beginPath();
    ctx.arc(tx, cy, tr.r, 0, Math.PI * 2);
    ctx.fill();

    // Camada 3: Flores e folhagens iluminadas
    ctx.fillStyle = tr.sp.corFlor;
    for (let f = 0; f < 5; f++) {
      const fa = (f / 5) * Math.PI * 2 + tr.swayOffset;
      const fx = tx + Math.cos(fa) * (tr.r * 0.55);
      const fy = cy + Math.sin(fa) * (tr.r * 0.55);
      ctx.beginPath();
      ctx.arc(fx, fy, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --- MODELAGEM 3D: MUDA PLANTADA PELO VISITANTE ---
  renderPlantedTreeAnimated(ctx, pt) {
    ctx.save();
    const s = pt.scale || 1.0;
    ctx.translate(pt.x, pt.y);
    ctx.scale(s, s);

    // Anel dourado pulsante de nova muda
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Tronco e folhagem
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -22);
    ctx.stroke();

    ctx.fillStyle = pt.sp.corCopa || '#10b981';
    ctx.beginPath();
    ctx.arc(0, -26, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- MODELAGEM 3D: NAVE DO CONHECIMENTO ---
  renderNaveDoConhecimento3D(ctx, x, y) {
    ctx.save();
    // Base e sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x + 55, y + 35, 65, 36, 0, 0, Math.PI * 2);
    ctx.fill();

    // Domo tecnológico principal
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x, y, 110, 65, 14);
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cúpula geodésica iluminada
    ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + 55, y + 32, 38, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText("NAVE DO CONHECIMENTO", x + 55, y + 36);

    ctx.restore();
  }

  // --- MODELAGEM: ESPAÇO CULTURAL ---
  renderAnfiteatro3D(ctx, x, y) {
    ctx.save();
    // Degraus concêntricos da arquibancada
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    for (let r = 24; r <= 66; r += 14) {
      ctx.beginPath();
      ctx.arc(x, y, r, -0.65 * Math.PI, 0.65 * Math.PI);
      ctx.stroke();
    }

    // Palco central integrado
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText("ESPAÇO CULTURAL", x, y + 80);

    ctx.restore();
  }

  // --- MODELAGEM 3D: SKATEPARK & BOWL ESCAVADO ---
  renderSkateparkBowl3D(ctx, x, y) {
    ctx.save();
    // Pista em concreto polido
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(x, y, 125, 80, 14);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bowl escavado com profundidade côncava sombreada
    const bowlGrad = ctx.createRadialGradient(x + 62, y + 40, 10, x + 62, y + 40, 42);
    bowlGrad.addColorStop(0, '#0f172a');
    bowlGrad.addColorStop(0.7, '#1e293b');
    bowlGrad.addColorStop(1, '#475569');
    ctx.fillStyle = bowlGrad;
    ctx.beginPath();
    ctx.ellipse(x + 62, y + 40, 46, 26, 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText("SKATEPARK • BOWL", x + 62, y + 44);

    ctx.restore();
  }

  // --- MODELAGEM 3D: ARENA ESPORTIVA & QUADRAS ---
  renderSportsArena3D(ctx, x, y) {
    ctx.save();
    // Campo de futebol em grama sintética com listras
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.roundRect(x, y, 155, 95, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Linhas oficiais
    ctx.beginPath();
    ctx.moveTo(x + 77, y);
    ctx.lineTo(x + 77, y + 95);
    ctx.arc(x + 77, y + 47, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Traves 3D brancas
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 2, y + 36, 6, 23);
    ctx.strokeRect(x + 151, y + 36, 6, 23);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText("CAMPO & QUADRAS", x + 77, y + 108);

    ctx.restore();
  }

  // --- MODELAGEM 3D: ÁREA AQUÁTICA INFANTIL (SPLASH PAD) ---
  renderSplashPadAnimated(ctx, x, y) {
    ctx.save();
    // Piso emborrachado drenante
    ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 10, 85, 55, 10);
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Jatos d'água verticais animados
    this.splashFountains.forEach((f, i) => {
      const h = Math.abs(Math.sin(this.time * 4 + f.phase)) * f.maxH;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(f.x, f.y - h);
      ctx.stroke();

      // Gotas caindo
      ctx.fillStyle = '#7dd3fc';
      ctx.beginPath();
      ctx.arc(f.x + (i % 2 === 0 ? 3 : -3), f.y - h + 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // --- 8. DESTAQUE IN-PLACE (SPOTLIGHT ARQUITETÔNICO) ---
  drawSpotlightHighlight(ctx) {
    if (!this.activeHighlight || !this.equipments[this.activeHighlight] || this.activeHighlight === 'overview') return;

    const eq = this.equipments[this.activeHighlight];
    const coords = eq.coords;
    const pulse = Math.sin(this.time * 5) * 6;

    ctx.save();
    // Halo luminoso no solo
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 48 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Linha vertical guia pontilhada
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineTo(coords.x, coords.y - 55);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pin indicador
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(coords.x, coords.y - 55, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  // --- 9. EFEITOS ATMOSFÉRICOS (NÉVOA REALISTA & CHUVA) ---
  drawAtmosphericEffects(ctx) {
    ctx.save();

    // Nuvens dinâmicas de microgotículas de névoa bioclimática
    this.mistParticles.forEach(p => {
      const r = Math.min(36, p.radius * (0.7 + this.mistIntensity * 0.25));
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      grad.addColorStop(0, `rgba(224, 242, 254, ${p.alpha * 0.3})`);
      grad.addColorStop(0.6, `rgba(56, 189, 248, ${p.alpha * 0.1})`);
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Simulação visual de chuva
    if (this.isRaining) {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.75)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      this.rainDrops.forEach(d => {
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 2, d.y + d.len);
      });
      ctx.stroke();
    }

    ctx.restore();
  }
}

window.ParqueVivoEngine = ParqueVivoEngine;
