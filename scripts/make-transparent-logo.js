const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const browserBin = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const logoPath = path.resolve('public', 'assets', 'logo-vida-original.png').replace(/\\/g, '/');
const outPng = path.resolve('public', 'assets', 'logo-vida-simbolo-transparente.png');

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; overflow: hidden; }
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
      // 1. Desenha a porção do símbolo (sem a palavra Solaris)
      ctx.drawImage(img, 0, 0, 496, 354, 0, 0, 496, 354);
      
      // 2. Lê os pixels para remover o fundo preto e criar transparência real
      const imgData = ctx.getImageData(0, 0, 496, 354);
      const data = imgData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const maxVal = Math.max(r, g, b);

        // Se for preto profundo ou muito próximo do preto do fundo
        if (maxVal < 14) {
          data[i + 3] = 0; // 100% transparente
        } else if (maxVal < 45) {
          // Gradiente suave de anti-aliasing na transição para o fundo transparente
          const factor = (maxVal - 14) / 31;
          data[i + 3] = Math.round(data[i + 3] * factor);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      document.body.setAttribute('data-rendered', 'true');
    };
    img.src = 'file:///${logoPath}';
  </script>
</body>
</html>`;

const tmpHtml = path.resolve('temp_transp.html');
fs.writeFileSync(tmpHtml, htmlContent, 'utf8');

const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--default-background-color=00000000',
  '--window-size=496,354',
  `--screenshot=${outPng}`,
  '--virtual-time-budget=2500',
  '--hide-scrollbars',
  `file:///${tmpHtml.replace(/\\/g, '/')}`
];

console.log('Gerando logo com transparência real...');
const res = cp.spawnSync(browserBin, args);
try { fs.unlinkSync(tmpHtml); } catch (e) {}

if (fs.existsSync(outPng)) {
  const stats = fs.statSync(outPng);
  console.log(`✓ Gerado com sucesso: public/assets/logo-vida-simbolo-transparente.png (${Math.round(stats.size / 1024)} KB)`);
} else {
  console.error('Falha ao gerar o corte transparente.');
}
