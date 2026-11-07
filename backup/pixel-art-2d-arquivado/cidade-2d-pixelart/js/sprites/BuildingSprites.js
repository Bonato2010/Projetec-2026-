/**
 * SPRITES DE ARQUITETURA E MOBILIÁRIO URBANO DO RIO DE JANEIRO
 * Fachadas detalhadas em Pixel Art: Boteco, Padaria, Farmácia, Clínica da Família, Casas Brasileiras
 */

import { PixelPainter as P } from './PixelPainter.js';

export class BuildingSprites {
  /**
   * 1. BOTECO TRADICIONAL CARIOCA ("Botequim do Realengo")
   * Toldo listrado, estufa de salgados, engradados de cerveja, mesas de plástico e porta de enrolar
   */
  static createBoteco(w = 150, h = 135) {
    const { canvas, ctx } = P.createBuffer(w, h);

    // Paredes superiores (amarelo ocre com desgaste)
    P.fillRect(ctx, 0, 0, w, 70, '#e5a93b');
    // Faixa decorativa em relevo
    P.fillRect(ctx, 0, 15, w, 4, '#c68822');
    
    // Janelas residenciais no andar superior (moradia em cima do boteco)
    P.drawWindow(ctx, 16, 25, 20, 24, true, '#1f2937', '#fef08a');
    P.drawWindow(ctx, 52, 25, 20, 24, false, '#1f2937');
    P.drawWindow(ctx, 88, 25, 20, 24, true, '#1f2937', '#fed7aa');
    P.drawAirConditioner(ctx, 116, 32);

    // Letreiro do Boteco em painel de madeira com neon
    P.fillRect(ctx, 12, 52, w - 24, 16, '#18241c');
    P.strokeRect(ctx, 12, 52, w - 24, 16, '#22c55e');
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('BOTECO DO REALENGO', 16, 64);

    // Toldo listrado carioca verde e branco
    const awningY = 70;
    const awningH = 14;
    for (let x = 0; x < w; x += 12) {
      const isGreen = (x / 12) % 2 === 0;
      P.fillRect(ctx, x, awningY, 12, awningH, isGreen ? '#15803d' : '#f3f4f6');
      // Franja curva inferior do toldo
      P.fillRect(ctx, x, awningY + awningH, 12, 3, isGreen ? '#166534' : '#e5e7eb');
    }

    // Parte térrea: Azulejo verde clássico de boteco até meia-parede
    P.fillRect(ctx, 0, 87, w, h - 87, '#f4f1ea');
    P.fillRect(ctx, 0, 110, w, h - 110, '#15803d');
    for (let y = 110; y < h; y += 6) {
      P.fillRect(ctx, 0, y, w, 1, '#166534');
    }

    // Vão da entrada principal (porta de aço aberta)
    const doorX = 20, doorW = 85, doorH = 45;
    P.fillRect(ctx, doorX, 88, doorW, doorH, '#1c1917'); // Interior escuro acolhedor

    // Balcão de fórmica com estufa de salgados iluminada
    P.fillRect(ctx, doorX + 5, 110, 48, 22, '#78350f'); // Balcão
    P.fillRect(ctx, doorX + 8, 98, 22, 12, 'rgba(254, 240, 138, 0.85)'); // Estufa de vidro amarela
    P.strokeRect(ctx, doorX + 8, 98, 22, 12, '#b45309');
    // Salgados dentro (coxinhas e pastéis)
    P.fillRect(ctx, doorX + 11, 104, 4, 4, '#d97706');
    P.fillRect(ctx, doorX + 18, 105, 5, 3, '#f59e0b');
    P.fillRect(ctx, doorX + 24, 104, 4, 4, '#d97706');

    // Chapa / Churrasqueira de espetinho com chaminé
    P.fillRect(ctx, doorX + 58, 104, 22, 28, '#44403c');
    P.fillRect(ctx, doorX + 62, 100, 14, 4, '#dc2626'); // Brasa vermelha

    // Engradados amarelos de cerveja empilhados na calçada
    const crateX = 112, crateY = 108;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        P.fillRect(ctx, crateX + c * 14, crateY - r * 8, 12, 7, '#eab308');
        P.strokeRect(ctx, crateX + c * 14, crateY - r * 8, 12, 7, '#ca8a04');
        // Garrafas marrons visíveis
        P.fillRect(ctx, crateX + c * 14 + 2, crateY - r * 8 + 1, 2, 2, '#78350f');
        P.fillRect(ctx, crateX + c * 14 + 6, crateY - r * 8 + 1, 2, 2, '#78350f');
      }
    }

    return canvas;
  }

  /**
   * 2. PADARIA E CONFEITARIA TRADICIONAL ("Pão Quente & Delícias")
   */
  static createPadaria(w = 140, h = 135) {
    const { canvas, ctx } = P.createBuffer(w, h);

    // Fachada em tom terracota e creme
    P.fillRect(ctx, 0, 0, w, 70, '#b45309');
    P.fillRect(ctx, 0, 0, w, 8, '#78350f'); // Platibanda

    // Janelas do andar superior com jardineiras
    P.drawWindow(ctx, 16, 20, 26, 28, true, '#451a03', '#fef9c3');
    P.drawWindow(ctx, 58, 20, 26, 28, false, '#451a03');
    P.drawWindow(ctx, 100, 20, 24, 28, true, '#451a03', '#fef9c3');
    // Floreiras de gerânios na janela
    P.fillRect(ctx, 14, 48, 30, 4, '#15803d');
    P.fillRect(ctx, 18, 46, 4, 3, '#ef4444');
    P.fillRect(ctx, 28, 46, 4, 3, '#f43f5e');

    // Letreiro da Padaria
    P.fillRect(ctx, 10, 54, w - 20, 15, '#78350f');
    P.strokeRect(ctx, 10, 54, w - 20, 15, '#fde047');
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('PADARIA PÃO QUENTE', 16, 65);

    // Toldo curvo cor vinho e dourado
    const awningY = 70;
    for (let x = 0; x < w; x += 10) {
      const isRed = (x / 10) % 2 === 0;
      P.fillRect(ctx, x, awningY, 10, 13, isRed ? '#991b1b' : '#fef08a');
      P.fillRect(ctx, x, awningY + 13, 10, 3, isRed ? '#7f1d1d' : '#fde047');
    }

    // Térreo: Vitrine de pães e bolos
    P.fillRect(ctx, 0, 86, w, h - 86, '#fffbeb');
    P.fillRect(ctx, 8, 92, 70, 36, '#1e293b'); // Interior
    // Vidro com reflexo
    P.strokeRect(ctx, 8, 92, 70, 36, '#94a3b8');
    // Prateleira de pão francês
    P.fillRect(ctx, 14, 104, 58, 4, '#d97706');
    for (let px = 16; px < 68; px += 7) {
      P.fillRect(ctx, px, 100, 5, 4, '#fbbf24');
    }
    // Entrada com porta de vidro aberta
    P.fillRect(ctx, 86, 92, 44, 43, '#0f172a');
    P.fillRect(ctx, 88, 94, 40, 40, '#fef08a'); // Luz interna acolhedora

    return canvas;
  }

  /**
   * 3. CLÍNICA DA FAMÍLIA (Padrão SMS / Prefeitura do Rio de Janeiro)
   * Fachada oficial azul royal e branca, rampa de acessibilidade e identificação
   */
  static createClinicaDaFamilia(w = 190, h = 135) {
    const { canvas, ctx } = P.createBuffer(w, h);

    // Edificação contemporânea institucional branca
    P.fillRect(ctx, 0, 10, w, h - 10, '#f8fafc');
    P.strokeRect(ctx, 0, 10, w, h - 10, '#cbd5e1');

    // Faixa azul oficial da Saúde Municipal do Rio
    P.fillRect(ctx, 0, 20, w, 22, '#1e40af');
    // Emblema da Cruz Vermelha / Saúde
    P.fillRect(ctx, 12, 24, 14, 14, '#ffffff');
    P.fillRect(ctx, 16, 26, 6, 10, '#dc2626');
    P.fillRect(ctx, 14, 28, 10, 6, '#dc2626');

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('CLÍNICA DA FAMÍLIA', 32, 31);
    ctx.font = '7px sans-serif';
    ctx.fillText('PREFEITURA DO RIO • SMS', 32, 39);

    // Janelas de consultórios médicos com persianas horizontais
    for (let i = 0; i < 4; i++) {
      const wx = 12 + i * 44;
      P.fillRect(ctx, wx, 52, 32, 28, '#0284c7');
      P.strokeRect(ctx, wx, 52, 32, 28, '#0369a1');
      // Persianas internas
      for (let py = 55; py < 78; py += 4) {
        P.fillRect(ctx, wx + 2, py, 28, 1, 'rgba(255, 255, 255, 0.45)');
      }
    }

    // Entrada principal com portas automáticas de vidro duplo
    const entranceX = 55, entranceW = 75;
    P.fillRect(ctx, entranceX, 88, entranceW, 47, '#e2e8f0');
    P.fillRect(ctx, entranceX + 4, 92, entranceW - 8, 43, '#38bdf8');
    P.strokeRect(ctx, entranceX + 4, 92, entranceW - 8, 43, '#0284c7');

    // Rampa de acessibilidade NBR 9050 com corrimão amarelo
    P.fillRect(ctx, 5, 126, 46, 6, '#94a3b8');
    P.line(ctx, 5, 120, 48, 126, '#eab308', 2);
    P.line(ctx, 16, 122, 16, 132, '#eab308', 1);
    P.line(ctx, 34, 124, 34, 132, '#eab308', 1);

    // Totem externo de informações e estacionamento de ambulância
    P.fillRect(ctx, 145, 85, 36, 50, '#f1f5f9');
    P.strokeRect(ctx, 145, 85, 36, 50, '#94a3b8');
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('SAMU 192', 147, 98);
    ctx.fillStyle = '#1e40af';
    ctx.font = '7px sans-serif';
    ctx.fillText('EMERGÊNCIA', 147, 108);

    return canvas;
  }

  /**
   * 4. CASA BRASILEIRA RESIDENCIAL / SOBRADO COM LAJE CARIOCA
   * Tijolo aparente, varal de roupas, caixa d'água azul e portão de garagem
   */
  static createSobradoLaje(w = 130, h = 145) {
    const { canvas, ctx } = P.createBuffer(w, h);

    // Andar Térreo: Parede de reboco azul céu com portão de ferro
    P.fillRect(ctx, 0, 70, w, 75, '#38bdf8');
    P.strokeRect(ctx, 0, 70, w, 75, '#0284c7');

    // Portão de garagem brasileiro de chapa ondulada e grades
    P.fillRect(ctx, 12, 85, 60, 55, '#f8fafc');
    P.strokeRect(ctx, 12, 85, 60, 55, '#475569');
    for (let gx = 16; gx < 70; gx += 5) {
      P.fillRect(ctx, gx, 88, 1, 48, '#94a3b8');
    }

    // Porta social e interfone
    P.fillRect(ctx, 82, 88, 22, 52, '#78350f');
    P.fillRect(ctx, 108, 100, 4, 6, '#e2e8f0'); // Interfone

    // 2º Andar: Tijolo aparente tradicional (Alvenaria sem reboco na laje)
    P.drawBrickWall(ctx, 0, 15, w, 55, '#b45309', '#64748b', 8, 4);

    // Janela com cortina vermelha e grade de proteção
    P.drawWindow(ctx, 22, 28, 24, 26, true, '#1e293b', '#fef08a');
    P.strokeRect(ctx, 20, 26, 28, 30, '#ffffff'); // Grade branca
    P.drawWindow(ctx, 74, 28, 24, 26, false, '#1e293b');

    // A LAJE (Plataforma superior aberta com colunas de concreto)
    P.fillRect(ctx, 0, 10, w, 5, '#94a3b8'); // Laje de piso
    // Pilares de concreto esperando segundo piso ("esperas de ferro")
    P.fillRect(ctx, 4, 0, 8, 15, '#64748b');
    P.line(ctx, 6, -5, 6, 2, '#dc2626', 1); // Vergalhões de ferro aparentes
    P.line(ctx, 10, -5, 10, 2, '#dc2626', 1);

    P.fillRect(ctx, w - 12, 0, 8, 15, '#64748b');
    P.line(ctx, w - 10, -5, w - 10, 2, '#dc2626', 1);

    // Caixa d'água azul no topo da laje
    P.drawWaterTank(ctx, w - 40, 0, 1.2);

    // Muro de platibanda da laje
    P.fillRect(ctx, 0, 5, w - 45, 10, '#b45309');

    // Varal de roupas na laje
    P.line(ctx, 12, 4, w - 48, 4, '#cbd5e1', 1);
    // Roupas penduradas balançando (Camiseta do Flamengo, bermuda jeans, toalha amarela)
    P.fillRect(ctx, 18, 5, 8, 9, '#dc2626'); // Camiseta vermelha
    P.fillRect(ctx, 18, 7, 8, 3, '#000000'); // Listra preta
    P.fillRect(ctx, 32, 5, 7, 7, '#2563eb'); // Bermuda jeans azul
    P.fillRect(ctx, 45, 5, 9, 11, '#eab308'); // Toalha amarela
    P.fillRect(ctx, 60, 5, 8, 8, '#ffffff'); // Camisa branca

    return canvas;
  }

  /**
   * 5. CASA TÉRREA COM JARDIM, AZULEJOS E SAMAMBAIAS
   */
  static createCasaTerrea(w = 120, h = 115) {
    const { canvas, ctx } = P.createBuffer(w, h);

    // Fachada verde menta pastel
    P.fillRect(ctx, 0, 15, w, h - 15, '#a7f3d0');
    // Platibanda decorativa no topo
    P.fillRect(ctx, 0, 8, w, 10, '#047857');
    P.fillRect(ctx, 4, 4, w - 8, 6, '#065f46');

    // Janela com veneziana de madeira clássica verde escuro
    P.fillRect(ctx, 16, 32, 28, 32, '#064e3b');
    P.drawWindow(ctx, 18, 34, 24, 28, true, '#065f46', '#fef08a');
    // Vaso de samambaia na janela
    P.fillRect(ctx, 26, 64, 8, 6, '#b45309');
    P.fillRect(ctx, 22, 60, 16, 5, '#16a34a');

    // Porta principal com azulejos geométricos na moldura
    P.fillRect(ctx, 58, 40, 24, 60, '#78350f');
    P.strokeRect(ctx, 56, 38, 28, 64, '#047857');

    // Muro frontal baixo com grades de ferro brancas
    P.fillRect(ctx, 0, 85, w, 15, '#065f46');
    for (let gx = 4; gx < w; gx += 6) {
      P.fillRect(ctx, gx, 70, 2, 16, '#ffffff');
      // Ponta de lança de segurança
      P.fillRect(ctx, gx - 1, 68, 4, 3, '#ffffff');
    }

    return canvas;
  }

  /**
   * 6. POSTE DE CONCRETO COM TRANSFORMADOR E ILUMINAÇÃO PÚBLICA LED
   * Emaranhado realista de fios e lixeira de calçada Comlurb
   */
  static createPosteComTransformador(w = 50, h = 260) {
    const { canvas, ctx } = P.createBuffer(w, h);

    const poleX = 20;
    // Coluna do poste de concreto cinza
    P.fillRect(ctx, poleX, 10, 8, h - 10, '#64748b');
    P.fillRect(ctx, poleX + 1, 10, 2, h - 10, '#94a3b8'); // Brilho de quina

    // Cruzetas de madeira/aço no topo
    P.fillRect(ctx, 4, 20, 40, 5, '#334155');
    P.fillRect(ctx, 8, 36, 32, 5, '#334155');

    // Isoladores cerâmicos (copinhos verdes/cinzas)
    for (let ix = 6; ix <= 42; ix += 11) {
      P.fillRect(ctx, ix, 15, 3, 5, '#10b981');
    }

    // TRANSFORMADOR DE ENERGIA ELÉTRICA (Caixa metálica cinza chumbo com aletas)
    const txY = 46;
    P.fillRect(ctx, poleX - 7, txY, 22, 28, '#475569');
    P.strokeRect(ctx, poleX - 7, txY, 22, 28, '#1e293b');
    // Aletas de refrigeração
    for (let ay = txY + 4; ay < txY + 24; ay += 4) {
      P.fillRect(ctx, poleX - 5, ay, 18, 1, '#334155');
    }
    // Buchas e conexões de alta tensão
    P.fillRect(ctx, poleX - 3, txY - 4, 4, 4, '#cbd5e1');
    P.fillRect(ctx, poleX + 7, txY - 4, 4, 4, '#cbd5e1');

    // Braço da luminária pública LED curvada
    P.fillRect(ctx, poleX + 6, 82, 20, 3, '#475569');
    P.fillRect(ctx, poleX + 24, 84, 8, 4, '#e2e8f0'); // Cabeça da luminária
    P.fillRect(ctx, poleX + 25, 87, 6, 2, '#fef08a'); // LED emissor

    // Lixeira Comlurb laranja fixada no poste
    const trashY = h - 65;
    P.fillRect(ctx, poleX + 8, trashY, 12, 16, '#ea580c');
    P.strokeRect(ctx, poleX + 8, trashY, 12, 16, '#c2410c');
    P.fillRect(ctx, poleX + 7, trashY + 3, 2, 8, '#334155'); // Braçadeira
    // Inscrição "COMLURB" miniatura
    P.fillRect(ctx, poleX + 10, trashY + 5, 8, 3, '#ffffff');

    return canvas;
  }

  /**
   * 7. ABRIGO DE ÔNIBUS DA PREFEITURA DO RIO DE JANEIRO
   * Cobertura curva de metal e vidro, banco e painel de itinerários
   */
  static createAbrigoOnibus(w = 90, h = 65) {
    const { canvas, ctx } = P.createBuffer(w, h);

    // Pilares metálicos azuis escuros
    P.fillRect(ctx, 12, 12, 4, h - 12, '#1e3a8a');
    P.fillRect(ctx, w - 16, 12, 4, h - 12, '#1e3a8a');

    // Cobertura arqueada azul com calha
    P.fillRect(ctx, 4, 6, w - 8, 6, '#2563eb');
    P.fillRect(ctx, 2, 4, w - 4, 3, '#3b82f6');

    // Painel de vidro traseiro translúcido
    ctx.fillStyle = 'rgba(186, 230, 253, 0.4)';
    ctx.fillRect(16, 12, w - 32, h - 26);
    P.strokeRect(ctx, 16, 12, w - 32, h - 26, '#60a5fa');

    // Placa de Itinerários (Linhas reais de Realengo: 391, 745, 926)
    P.fillRect(ctx, 22, 16, 32, 20, '#1e40af');
    P.strokeRect(ctx, 22, 16, 32, 20, '#ffffff');
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6px monospace';
    ctx.fillText('391 745', 25, 25);
    ctx.fillText('926 BRT', 25, 33);

    // Banco de ripas de concreto/madeira
    P.fillRect(ctx, 14, h - 20, w - 28, 4, '#d97706');
    P.fillRect(ctx, 24, h - 16, 4, 16, '#475569');
    P.fillRect(ctx, w - 28, h - 16, 4, 16, '#475569');

    return canvas;
  }

  /**
   * 8. ÁRVORES CARIOCAS (Amendoeira, Flamboyant e Palmeira Imperial)
   */
  static createAmendoeira(w = 110, h = 140) {
    const { canvas, ctx } = P.createBuffer(w, h);
    const trunkX = Math.floor(w / 2) - 5;
    // Tronco robusto e irregular
    P.fillRect(ctx, trunkX, 55, 10, 85, '#5c3a21');
    P.fillRect(ctx, trunkX - 3, 120, 6, 20, '#422713'); // Raízes superficiais
    P.fillRect(ctx, trunkX + 7, 125, 6, 15, '#422713');

    // Galhos bifurcados
    P.fillRect(ctx, trunkX - 18, 50, 20, 8, '#5c3a21');
    P.fillRect(ctx, trunkX + 8, 45, 22, 8, '#5c3a21');

    // Copa volumétrica em camadas (verde esmeralda, oliva e toques avermelhados de folhas secas)
    const foliageColors = ['#15803d', '#166534', '#14532d', '#b91c1c'];
    for (let i = 0; i < 75; i++) {
      const fx = 10 + (Math.sin(i * 1.7) * 0.45 + 0.45) * (w - 35);
      const fy = 5 + (Math.cos(i * 2.3) * 0.45 + 0.45) * 60;
      const r = 8 + (i % 7);
      const color = (i % 9 === 0) ? foliageColors[3] : foliageColors[i % 3];
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(fx, fy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    return canvas;
  }

  static createFlamboyant(w = 120, h = 135) {
    const { canvas, ctx } = P.createBuffer(w, h);
    const trunkX = Math.floor(w / 2) - 6;
    P.fillRect(ctx, trunkX, 60, 12, 75, '#4a2e18');

    // Copa ampla em formato de guarda-chuva com flores vermelhas exuberantes
    for (let i = 0; i < 90; i++) {
      const fx = 8 + (Math.sin(i * 1.3) * 0.48 + 0.48) * (w - 25);
      const fy = 8 + (Math.cos(i * 1.9) * 0.38 + 0.38) * 55;
      const r = 6 + (i % 6);
      ctx.fillStyle = (i % 3 === 0) ? '#dc2626' : (i % 3 === 1 ? '#ef4444' : '#15803d');
      ctx.beginPath();
      ctx.arc(fx, fy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    return canvas;
  }

  static createPalmeiraImperial(w = 60, h = 180) {
    const { canvas, ctx } = P.createBuffer(w, h);
    const trunkX = Math.floor(w / 2) - 3;
    // Tronco esguio cinza anelado
    P.fillRect(ctx, trunkX, 35, 6, 145, '#78716c');
    for (let y = 40; y < 175; y += 8) {
      P.fillRect(ctx, trunkX, y, 6, 1, '#57534e'); // Anéis
    }
    // Palmito verde no topo
    P.fillRect(ctx, trunkX - 1, 22, 8, 14, '#65a30d');

    // Folhas curvadas em leque
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 3;
    for (let a = 0; a < 6; a++) {
      const angle = (a / 6) * Math.PI - Math.PI;
      ctx.beginPath();
      ctx.moveTo(trunkX + 3, 22);
      ctx.quadraticCurveTo(
        trunkX + 3 + Math.cos(angle) * 35,
        22 + Math.sin(angle) * 15,
        trunkX + 3 + Math.cos(angle) * 28,
        22 + Math.sin(angle) * 32
      );
      ctx.stroke();
    }
    return canvas;
  }
}
