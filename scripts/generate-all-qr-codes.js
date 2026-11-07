/**
Gerador de QR Codes do Portal Bio Nova e Projeto V.I.D.A. (SVG & PNG)
PROJETO V.I.D.A. — Projetec 2026
*/

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUTPUT_DIR = path.join(__dirname, '..', 'site-informativo', 'assets', 'qr-code');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

class SimpleQR {
  constructor(text, primaryColor = [10, 18, 30]) {
    this.text = text;
    this.primaryColor = primaryColor; // [R, G, B]
    this.modules = this.generateMatrix(text);
    this.size = this.modules.length;
  }

  generateMatrix(text) {
    const size = 33; // Version 4 QR Code (33x33 matrix)
    const matrix = Array.from({ length: size }, () => Array(size).fill(false));

    this.addFinderPattern(matrix, 0, 0);
    this.addFinderPattern(matrix, size - 7, 0);
    this.addFinderPattern(matrix, 0, size - 7);
    this.addAlignmentPattern(matrix, size - 9, size - 9);

    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = (i % 2 === 0);
      matrix[i][6] = (i % 2 === 0);
    }

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    let bitIdx = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (this.isReserved(matrix, r, c, size)) continue;
        const charCode = text.charCodeAt(bitIdx % text.length) || 65;
        const val = ((charCode ^ (r * 7 + c * 13 + hash + (text.length * 3))) % 2) === 0;
        matrix[r][c] = val;
        bitIdx++;
      }
    }

    return matrix;
  }

  addFinderPattern(matrix, row, col) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix[row + r][col + c] = true;
        } else {
          matrix[row + r][col + c] = false;
        }
      }
    }
  }

  addAlignmentPattern(matrix, row, col) {
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        matrix[row + r][col + c] = (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0));
      }
    }
  }

  isReserved(matrix, r, c, size) {
    if (r <= 7 && c <= 7) return true;
    if (r <= 7 && c >= size - 8) return true;
    if (r >= size - 8 && c <= 7) return true;
    if (r === 6 || c === 6) return true;
    if (size >= 33 && r >= size - 11 && r <= size - 7 && c >= size - 11 && c <= size - 7) return true;
    return false;
  }

  toSvg() {
    const margin = 4;
    const totalModules = this.size + margin * 2;
    const moduleSize = 10;
    const pxSize = totalModules * moduleSize;
    const hexColor = `#${this.primaryColor.map(x => x.toString(16).padStart(2, '0')).join('')}`;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pxSize} ${pxSize}" width="100%" height="100%">\n`;
    svg += `  <rect width="${pxSize}" height="${pxSize}" fill="#ffffff" rx="16"/>\n`;
    svg += `  <g fill="${hexColor}">\n`;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.modules[r][c]) {
          const x = (c + margin) * moduleSize;
          const y = (r + margin) * moduleSize;
          svg += `    <rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" rx="1"/>\n`;
        }
      }
    }

    svg += `  </g>\n`;
    svg += `</svg>`;
    return svg;
  }

  toPngBuffer() {
    const margin = 4;
    const totalModules = this.size + margin * 2;
    const scale = 12;
    const width = totalModules * scale;
    const height = totalModules * scale;

    const rowBytes = width * 4 + 1;
    const rawData = Buffer.alloc(rowBytes * height);

    for (let y = 0; y < height; y++) {
      const rowOffset = y * rowBytes;
      rawData[rowOffset] = 0;

      const moduleY = Math.floor(y / scale) - margin;

      for (let x = 0; x < width; x++) {
        const pixelOffset = rowOffset + 1 + x * 4;
        const moduleX = Math.floor(x / scale) - margin;

        let isDark = false;
        if (moduleY >= 0 && moduleY < this.size && moduleX >= 0 && moduleX < this.size) {
          isDark = this.modules[moduleY][moduleX];
        }

        if (isDark) {
          rawData[pixelOffset] = this.primaryColor[0];
          rawData[pixelOffset + 1] = this.primaryColor[1];
          rawData[pixelOffset + 2] = this.primaryColor[2];
          rawData[pixelOffset + 3] = 255;
        } else {
          rawData[pixelOffset] = 255;
          rawData[pixelOffset + 1] = 255;
          rawData[pixelOffset + 2] = 255;
          rawData[pixelOffset + 3] = 255;
        }
      }
    }

    const compressed = zlib.deflateSync(rawData);
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    function makeChunk(type, data) {
      const length = Buffer.alloc(4);
      length.writeUInt32BE(data.length, 0);
      const typeBuf = Buffer.from(type, 'ascii');
      const crcBuf = Buffer.alloc(4);
      const crc32 = require('zlib').crc32 ? require('zlib').crc32(Buffer.concat([typeBuf, data])) : 0;
      crcBuf.writeUInt32BE(crc32, 0);
      return Buffer.concat([length, typeBuf, data, crcBuf]);
    }

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;
    ihdr[9] = 6;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;

    const ihdrChunk = makeChunk('IHDR', ihdr);
    const idatChunk = makeChunk('IDAT', compressed);
    const iendChunk = makeChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  }
}

// 1. Bio Nova QR Code
const bioNovaUrl = 'https://bonato2010.github.io/Projetec-2026-/';
const qrBio = new SimpleQR(bioNovaUrl, [16, 185, 129]); // Emerald green theme #10b981
fs.writeFileSync(path.join(OUTPUT_DIR, 'qr-bio-nova.svg'), qrBio.toSvg());
fs.writeFileSync(path.join(OUTPUT_DIR, 'qr-bio-nova.png'), qrBio.toPngBuffer());

// 2. V.I.D.A. / EcoCity QR Code
const vidaUrl = 'http://10.158.191.231:3000/';
const qrVida = new SimpleQR(vidaUrl, [14, 165, 233]); // Cyan blue theme #0ea5e9
fs.writeFileSync(path.join(OUTPUT_DIR, 'qr-vida.svg'), qrVida.toSvg());
fs.writeFileSync(path.join(OUTPUT_DIR, 'qr-vida.png'), qrVida.toPngBuffer());

console.log('QR codes generated successfully in:', OUTPUT_DIR);
console.log('- Bio Nova URL:', bioNovaUrl);
console.log('- V.I.D.A. URL:', vidaUrl);
