const fs = require('fs');
const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const ROOT_DIR = path.resolve(__dirname, '..');
const origLogoPath = path.resolve(ROOT_DIR, 'public/assets/logo-vida-original.png');
const outPngPath = path.resolve(ROOT_DIR, 'public/assets/logo-vida-simbolo-transparente.png');
const outSymPath = path.resolve(ROOT_DIR, 'public/assets/logo-vida-simbolo.png');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent('<html><body style="margin:0;background:transparent;"><canvas id="c"></canvas></body></html>');

  const origBase64 = fs.readFileSync(origLogoPath).toString('base64');

  const res = await page.evaluate(async (b64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // 1. Extração inicial do símbolo (y < 350 para isolar do texto inferior)
        const srcW = img.width; // 496
        const srcH = 350;

        const tempC = document.createElement('canvas');
        tempC.width = srcW;
        tempC.height = srcH;
        const tempCtx = tempC.getContext('2d');
        tempCtx.drawImage(img, 0, 0, srcW, srcH, 0, 0, srcW, srcH);

        const imgData = tempCtx.getImageData(0, 0, srcW, srcH);
        const d = imgData.data;

        let minX = srcW, minY = srcH, maxX = 0, maxY = 0;

        // Remoção suave do fundo preto com curva de alpha de alta fidelidade
        for (let y = 0; y < srcH; y++) {
          for (let x = 0; x < srcW; x++) {
            const idx = (y * srcW + x) * 4;
            const r = d[idx];
            const g = d[idx + 1];
            const b = d[idx + 2];
            // Luminância perceptual
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            if (lum < 20) {
              d[idx + 3] = 0; // Transparente total
            } else if (lum < 60) {
              // Transição suave para antialiasing das bordas
              const alphaFactor = (lum - 20) / 40;
              d[idx + 3] = Math.round(255 * alphaFactor);
            }

            if (d[idx + 3] > 25) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        tempCtx.putImageData(imgData, 0, 0);

        const symW = maxX - minX + 1;
        const symH = maxY - minY + 1;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // 2. Renderização em Canvas Perfeitamente Quadrado (1:1) com margem harmônica
        const CANVAS_SIZE = 512;
        const outC = document.getElementById('c');
        outC.width = CANVAS_SIZE;
        outC.height = CANVAS_SIZE;
        const outCtx = outC.getContext('2d');
        outCtx.imageSmoothingEnabled = true;
        outCtx.imageSmoothingQuality = 'high';

        // Escalar o símbolo para ocupar 82% do canvas quadrado (deixando respiro perfeito para bordas circulares)
        const targetSize = CANVAS_SIZE * 0.84;
        const scale = Math.min(targetSize / symW, targetSize / symH);
        const drawW = symW * scale;
        const drawH = symH * scale;

        // Centralizar geometricamente
        const destX = (CANVAS_SIZE - drawW) / 2;
        const destY = (CANVAS_SIZE - drawH) / 2;

        outCtx.drawImage(
          tempC,
          minX, minY, symW, symH,
          destX, destY, drawW, drawH
        );

        resolve({
          symW, symH, drawW, drawH, CANVAS_SIZE,
          base64Png: outC.toDataURL('image/png').split(',')[1]
        });
      };
      img.src = 'data:image/png;base64,' + b64;
    });
  }, origBase64);

  const pngBuf = Buffer.from(res.base64Png, 'base64');
  fs.writeFileSync(outPngPath, pngBuf);
  fs.writeFileSync(outSymPath, pngBuf);

  console.log('✓ Logo quadrada 1:1 gerada com perfeição:');
  console.log(`  - Dimensão: ${res.CANVAS_SIZE}x${res.CANVAS_SIZE} px`);
  console.log(`  - Bounding original: ${res.symW}x${res.symH} px`);
  console.log(`  - Dimensão renderizada: ${Math.round(res.drawW)}x${Math.round(res.drawH)} px (Centralizada)`);
  console.log(`  - Arquivo salvo: ${outSymPath} (${pngBuf.length} bytes)`);

  await browser.close();
})();
