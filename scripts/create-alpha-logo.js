const http = require('http');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const browserBin = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const origLogoPath = path.resolve('public', 'assets', 'logo-vida-original.png');
const origBase64 = fs.readFileSync(origLogoPath).toString('base64');
const outPngPath = path.resolve('public', 'assets', 'logo-vida-simbolo-transparente.png');
const outSymPath = path.resolve('public', 'assets', 'logo-vida-simbolo.png');

const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:transparent;margin:0;padding:0;">
  <canvas id="c"></canvas>
  <script>
    const img = new Image();
    img.onload = () => {
      // 1. Canvas temporário para o símbolo
      const tempC = document.createElement('canvas');
      tempC.width = 496;
      tempC.height = 354;
      const tCtx = tempC.getContext('2d');
      tCtx.drawImage(img, 0, 0, 496, 354, 0, 0, 496, 354);

      const imgData = tCtx.getImageData(0, 0, 496, 354);
      const d = imgData.data;

      let minX = 496, minY = 354, maxX = 0, maxY = 0;

      // 2. Transparência pixel a pixel com remoção suave do preto
      for (let y = 0; y < 354; y++) {
        for (let x = 0; x < 496; x++) {
          const idx = (y * 496 + x) * 4;
          const r = d[idx];
          const g = d[idx + 1];
          const b = d[idx + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          if (lum < 22) {
            d[idx + 3] = 0;
          } else if (lum < 55) {
            const factor = (lum - 22) / 33;
            d[idx + 3] = Math.round(255 * factor);
          }

          if (d[idx + 3] > 30) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      tCtx.putImageData(imgData, 0, 0);

      // 3. Adiciona padding sutil de 4px ao redor do símbolo recortado
      const pad = 4;
      const cropX = Math.max(0, minX - pad);
      const cropY = Math.max(0, minY - pad);
      const cropW = Math.min(496 - cropX, (maxX - minX) + pad * 2);
      const cropH = Math.min(354 - cropY, (maxY - minY) + pad * 2);

      const outC = document.getElementById('c');
      outC.width = cropW;
      outC.height = cropH;
      const outCtx = outC.getContext('2d');
      outCtx.drawImage(tempC, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      outC.toBlob((blob) => {
        fetch('/save-logo', {
          method: 'POST',
          body: blob
        });
      }, 'image/png');
    };
    img.src = 'data:image/png;base64,${origBase64}';
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.url === '/save-logo' && req.method === 'POST') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      fs.writeFileSync(outPngPath, buffer);
      fs.writeFileSync(outSymPath, buffer);
      console.log('✓ Imagem recortada e transparente salva:', outPngPath, '(' + buffer.length + ' bytes)');
      res.writeHead(200);
      res.end('saved');
      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 500);
    });
  }
});

server.listen(3003, () => {
  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    'http://localhost:3003/'
  ];
  cp.spawn(browserBin, args);
});
