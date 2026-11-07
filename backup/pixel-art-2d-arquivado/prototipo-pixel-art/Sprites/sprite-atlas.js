/**
 * ECOCITY PIXEL ART — SPRITE ATLAS & PROCEDURAL RENDERER
 * Renderiza edifícios cariocas em pixel art, veículos, pessoas e efeitos ambientais em Canvas 2D.
 */

class SpriteAtlas {
  constructor() {
    this.colors = {
      skyDay: '#2a4365',
      skyStorm: '#1a202c',
      mountain: '#2c5282',
      mountainDark: '#1a365d',
      buildingA: '#e2e8f0',
      buildingB: '#cbd5e0',
      buildingC: '#a0aec0',
      brick: '#c53030',
      pastelYellow: '#f6e05e',
      pastelBlue: '#63b3ed',
      pastelGreen: '#68d391',
      glass: '#3182ce',
      roof: '#718096',
      roofDark: '#4a5568',
      street: '#2d3748',
      sidewalk: '#718096',
      curb: '#a0aec0',
      grass: '#38a169',
      water: '#3182ce',
      waterFlood: '#2b6cb0',
      carRed: '#e53e3e',
      carBlue: '#3182ce',
      carYellow: '#d69e2e',
      busGreen: '#2f855a',
      policeBlue: '#2b6cb0',
      ambulanceWhite: '#f7fafc',
      peopleSkin: '#f6ad55',
      peopleShirt: '#ed64a6',
      peoplePants: '#2b6cb0'
    };
  }

  drawCityBackground(ctx, width, height, timeOfDay = 'day', floodLevel = 0) {
    ctx.fillStyle = timeOfDay === 'storm' ? this.colors.skyStorm : this.colors.skyDay;
    ctx.fillRect(0, 0, width, height);

    if (timeOfDay === 'storm' || floodLevel > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.fillStyle = this.colors.mountainDark;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.45);
    ctx.lineTo(width * 0.15, height * 0.25);
    ctx.lineTo(width * 0.3, height * 0.4);
    ctx.lineTo(width * 0.55, height * 0.2);
    ctx.lineTo(width * 0.75, height * 0.35);
    ctx.lineTo(width, height * 0.45);
    ctx.lineTo(width, height * 0.6);
    ctx.lineTo(0, height * 0.6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#22543d';
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.42);
    ctx.lineTo(width * 0.35, height * 0.32);
    ctx.lineTo(width * 0.5, height * 0.42);
    ctx.closePath();
    ctx.fill();
  }

  drawBuildings(ctx, startX, baseY, width, height) {
    const buildings = [
      { w: 120, h: 220, color: this.colors.buildingA, roof: this.colors.roofDark, type: 'modern' },
      { w: 90, h: 180, color: this.colors.pastelYellow, roof: this.colors.brick, type: 'colonial' },
      { w: 140, h: 260, color: this.colors.glass, roof: this.colors.roof, type: 'skyscraper' },
      { w: 100, h: 160, color: this.colors.pastelBlue, roof: this.colors.roofDark, type: 'residential' },
      { w: 110, h: 200, color: this.colors.buildingB, roof: this.colors.brick, type: 'commercial' },
      { w: 130, h: 240, color: this.colors.pastelGreen, roof: this.colors.roof, type: 'hospital' }
    ];

    let currentX = startX;
    buildings.forEach((b, idx) => {
      const bx = currentX;
      const by = baseY - b.h;

      ctx.fillStyle = b.color;
      ctx.fillRect(bx, by, b.w, b.h);
      ctx.strokeStyle = '#1a202c';
      ctx.lineWidth = 3;
      ctx.strokeRect(bx, by, b.w, b.h);

      ctx.fillStyle = b.roof;
      ctx.fillRect(bx - 6, by - 12, b.w + 12, 14);
      ctx.strokeRect(bx - 6, by - 12, b.w + 12, 14);

      ctx.fillStyle = '#2d3748';
      const cols = 3;
      const rows = Math.floor(b.h / 35);
      const winW = 16;
      const winH = 22;
      const gapX = (b.w - (cols * winW)) / (cols + 1);

      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols; c++) {
          const wx = bx + gapX + c * (winW + gapX);
          const wy = by + 25 + r * 35;
          ctx.fillRect(wx, wy, winW, winH);
          ctx.fillStyle = (idx + r + c) % 3 === 0 ? '#f6e05e' : '#4a5568';
          ctx.fillRect(wx + 2, wy + 2, winW - 4, winH - 4);
          ctx.fillStyle = '#2d3748';
        }
      }

      ctx.fillStyle = '#1a202c';
      ctx.fillRect(bx + b.w / 2 - 18, baseY - 40, 36, 40);
      ctx.fillStyle = '#cbd5e0';
      ctx.fillRect(bx + b.w / 2 - 14, baseY - 36, 28, 36);

      if (b.type === 'hospital') {
        ctx.fillStyle = '#e53e3e';
        ctx.fillRect(bx + b.w / 2 - 12, by + 10, 24, 8);
        ctx.fillRect(bx + b.w / 2 - 4, by + 2, 8, 24);
      }

      currentX += b.w + 15;
    });
  }

  drawStreetAndSidewalk(ctx, width, height, floodLevel = 0) {
    const streetY = height - 180;
    const streetH = 120;
    const sidewalkH = 40;
    const curbH = 10;

    ctx.fillStyle = this.colors.sidewalk;
    ctx.fillRect(0, streetY - sidewalkH, width, sidewalkH);

    ctx.fillStyle = this.colors.curb;
    ctx.fillRect(0, streetY - curbH, width, curbH);

    ctx.fillStyle = this.colors.street;
    ctx.fillRect(0, streetY, width, streetH);

    ctx.strokeStyle = '#ecc94b';
    ctx.lineWidth = 6;
    ctx.setLineDash([30, 20]);
    ctx.beginPath();
    ctx.moveTo(0, streetY + streetH / 2);
    ctx.lineTo(width, streetY + streetH / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = this.colors.sidewalk;
    ctx.fillRect(0, streetY + streetH, width, sidewalkH);
    ctx.fillStyle = this.colors.curb;
    ctx.fillRect(0, streetY + streetH, width, curbH);

    if (floodLevel > 0) {
      ctx.fillStyle = `rgba(49, 130, 206, ${Math.min(0.75, floodLevel * 0.25)})`;
      ctx.fillRect(0, streetY - 10, width, streetH + 20);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i < width; i += 60) {
        ctx.beginPath();
        ctx.arc(i + (Date.now() / 50) % 60, streetY + 40, 15, 0, Math.PI);
        ctx.stroke();
      }
    }
  }

  drawVehicle(ctx, x, y, type = 'carRed') {
    ctx.save();
    ctx.translate(x, y);

    let bodyColor = this.colors.carRed;
    if (type === 'carBlue') bodyColor = this.colors.carBlue;
    if (type === 'carYellow') bodyColor = this.colors.carYellow;
    if (type === 'bus') bodyColor = this.colors.busGreen;
    if (type === 'police') bodyColor = this.colors.policeBlue;
    if (type === 'ambulance') bodyColor = this.colors.ambulanceWhite;

    const w = type === 'bus' ? 90 : 50;
    const h = type === 'bus' ? 35 : 28;

    ctx.fillStyle = '#1a202c';
    ctx.fillRect(10, h - 4, 12, 12);
    ctx.fillRect(w - 22, h - 4, 12, 12);

    ctx.fillStyle = bodyColor;
    ctx.fillRect(0, 8, w, h - 12);
    ctx.strokeStyle = '#1a202c';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 8, w, h - 12);

    ctx.fillRect(12, 0, w - 24, 10);
    ctx.strokeRect(12, 0, w - 24, 10);

    ctx.fillStyle = '#ebf8ff';
    ctx.fillRect(16, 2, w - 32, 8);

    if (type === 'police' || type === 'ambulance') {
      ctx.fillStyle = (Math.floor(Date.now() / 200) % 2 === 0) ? '#e53e3e' : '#3182ce';
      ctx.fillRect(w / 2 - 6, -8, 12, 8);
    }

    ctx.restore();
  }

  drawCitizen(ctx, x, y, animFrame = 0) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = this.colors.peopleSkin;
    ctx.fillRect(4, 0, 10, 10);

    ctx.fillStyle = this.colors.peopleShirt;
    ctx.fillRect(2, 10, 14, 16);

    ctx.fillStyle = this.colors.peoplePants;
    const legOffset = Math.sin(animFrame * 0.3) * 4;
    ctx.fillRect(4, 26, 4, 14 + legOffset);
    ctx.fillRect(10, 26, 4, 14 - legOffset);

    ctx.restore();
  }

  drawRain(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    const time = Date.now() * 0.5;
    for (let i = 0; i < 120; i++) {
      const rx = (i * 73 + time * 0.2) % width;
      const ry = (i * 37 + time * 0.8) % height;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 4, ry + 18);
      ctx.stroke();
    }
  }
}

window.spriteAtlas = new SpriteAtlas();
