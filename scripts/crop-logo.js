const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const browserBin = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const logoPath = path.resolve('public', 'assets', 'logo-vida-original.png').replace(/\\/g, '/');
const outPng = path.resolve('public', 'assets', 'logo-vida-simbolo.png');

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000000; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="c" width="496" height="354"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 496, 354, 0, 0, 496, 354);
      document.body.setAttribute('data-rendered', 'true');
    };
    img.src = 'file:///${logoPath}';
  </script>
</body>
</html>`;

const tmpHtml = path.resolve('temp_crop.html');
fs.writeFileSync(tmpHtml, htmlContent, 'utf8');

const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--window-size=496,354',
  `--screenshot=${outPng}`,
  '--virtual-time-budget=2000',
  '--hide-scrollbars',
  `file:///${tmpHtml.replace(/\\/g, '/')}`
];

console.log('Generating symbol crop...');
const res = cp.spawnSync(browserBin, args);
try { fs.unlinkSync(tmpHtml); } catch (e) {}

if (fs.existsSync(outPng)) {
  const stats = fs.statSync(outPng);
  console.log(`✓ Gerado com sucesso: public/assets/logo-vida-simbolo.png (${Math.round(stats.size / 1024)} KB)`);
} else {
  console.error('Falha ao gerar o corte do símbolo.');
}
