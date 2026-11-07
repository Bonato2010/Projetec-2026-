/**
 * UTILITÁRIO DE PINTURA PIXEL ART NATIVA
 * Gera canvas offscreen com pixels nítidos e dithering
 */

export class PixelPainter {
  static createBuffer(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.round(w);
    c.height = Math.round(h);
    const ctx = c.getContext('2d', { willReadFrequently: false });
    ctx.imageSmoothingEnabled = false;
    return { canvas: c, ctx, width: c.width, height: c.height };
  }

  // Preenche retângulo com cor sólida
  static fillRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }

  // Desenha borda/outline pixelado
  static strokeRect(ctx, x, y, w, h, color, lineWidth = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(Math.floor(x) + 0.5, Math.floor(y) + 0.5, Math.floor(w) - 1, Math.floor(h) - 1);
  }

  // Linha pixelada
  static line(ctx, x1, y1, x2, y2, color, width = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(Math.floor(x1) + 0.5, Math.floor(y1) + 0.5);
    ctx.lineTo(Math.floor(x2) + 0.5, Math.floor(y2) + 0.5);
    ctx.stroke();
  }

  // Padrão de Tijolos Aparentes (Alvenaria Brasileira)
  static drawBrickWall(ctx, x, y, w, h, brickColor = '#b55a30', mortarColor = '#6b7280', brickW = 8, brickH = 4) {
    this.fillRect(ctx, x, y, w, h, mortarColor);
    let row = 0;
    for (let py = y; py < y + h; py += brickH) {
      const offset = (row % 2 === 0) ? 0 : Math.floor(brickW / 2);
      for (let px = x - offset; px < x + w; px += brickW) {
        const bx = Math.max(x, px + 1);
        const bw = Math.min(x + w - bx, brickW - 1);
        const bh = Math.min(y + h - py, brickH - 1);
        if (bw > 0 && bh > 0) {
          // Pequena variação tonal de tijolo
          const toneOffset = ((px * 13 + py * 7) % 5) - 2;
          ctx.fillStyle = this.adjustBrightness(brickColor, toneOffset * 5);
          ctx.fillRect(bx, py, bw, bh);
        }
      }
      row++;
    }
  }

  // Telhas de amianto ou cerâmica onduladas
  static drawCorrugatedRoof(ctx, x, y, w, h, colorBase = '#8a94a0', colorShade = '#5d6773') {
    this.fillRect(ctx, x, y, w, h, colorBase);
    for (let px = x; px < x + w; px += 3) {
      this.fillRect(ctx, px, y, 1, h, colorShade);
    }
  }

  // Janela com esquadria, vidro e persiana/cortina
  static drawWindow(ctx, x, y, w, h, isLit = false, frameColor = '#2d3748', litColor = '#fef08a', darkColor = '#1a202c') {
    // Moldura
    this.fillRect(ctx, x, y, w, h, frameColor);
    // Vidro
    const glassColor = isLit ? litColor : darkColor;
    this.fillRect(ctx, x + 1, y + 1, w - 2, h - 2, glassColor);
    // Divisórias de esquadria
    if (w >= 10 && h >= 10) {
      this.fillRect(ctx, x + Math.floor(w / 2), y + 1, 1, h - 2, frameColor);
      this.fillRect(ctx, x + 1, y + Math.floor(h / 2), w - 2, 1, frameColor);
    }
    // Reflexo sutil de vidro quando apagado
    if (!isLit && w > 6 && h > 6) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(x + 2, y + 2, Math.floor(w * 0.4), 2);
    }
  }

  // Aparelho de Ar-Condicionado de Janela (comum no Rio)
  static drawAirConditioner(ctx, x, y) {
    // Caixa de concreto/metal
    this.fillRect(ctx, x, y, 14, 10, '#d1d5db');
    this.strokeRect(ctx, x, y, 14, 10, '#4b5563');
    // Grade de ventilação
    this.fillRect(ctx, x + 2, y + 2, 6, 6, '#374151');
    for (let i = 0; i < 3; i++) {
      this.fillRect(ctx, x + 3, y + 3 + i * 2, 4, 1, '#9ca3af');
    }
    // Painel de controle
    this.fillRect(ctx, x + 9, y + 3, 3, 2, '#ef4444'); // LED ligado
    // Mancha de gotejamento de água na parede abaixo
    ctx.fillStyle = 'rgba(55, 65, 81, 0.4)';
    ctx.fillRect(x + 6, y + 10, 2, 8);
  }

  // Caixa d'Água Azul de Polietileno (Ícone do Rio / Laje carioca)
  static drawWaterTank(ctx, x, y, scale = 1) {
    const w = Math.round(18 * scale);
    const h = Math.round(14 * scale);
    // Base cilíndrica azul royal
    this.fillRect(ctx, x + 2, y + 3, w - 4, h - 3, '#1d4ed8');
    this.fillRect(ctx, x + 1, y + 5, w - 2, h - 6, '#1e40af');
    // Tampa saliente
    this.fillRect(ctx, x, y, w, 4, '#2563eb');
    this.fillRect(ctx, x + 1, y + 1, w - 2, 2, '#3b82f6'); // Brilho na tampa
    // Nervuras circulares do reservatório
    this.fillRect(ctx, x + 1, y + 7, w - 2, 1, '#172554');
    this.fillRect(ctx, x + 1, y + 10, w - 2, 1, '#172554');
  }

  // Utilitário para clarear ou escurecer cores hex
  static adjustBrightness(hex, percent) {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00FF) + percent;
    let b = (num & 0x0000FF) + percent;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}
