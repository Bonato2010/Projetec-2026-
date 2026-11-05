const path = require('path');
const fs = require('fs');
const http = require('http');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 3567;

// Servidor local simples
const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/scripts/pdf-viewer.html';
  const filePath = path.join(ROOT_DIR, reqPath);
  if (fs.existsSync(filePath)) {
    if (filePath.endsWith('.html')) res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    else if (filePath.endsWith('.pdf')) res.writeHead(200, { 'Content-Type': 'application/pdf' });
    else res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// HTML com PDF.js para renderizar páginas 10 e 11 em alta resolução
const viewerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body style="margin:0; background:#000;">
  <canvas id="pdf-canvas"></canvas>
  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    window.renderPage = async function(pageNum, scale) {
      const loadingTask = pdfjsLib.getDocument('/downloads_temp/catalogo-BIA-SP.pdf');
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: scale || 2.0 });
      const canvas = document.getElementById('pdf-canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;
      return { width: canvas.width, height: canvas.height };
    };
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'scripts/pdf-viewer.html'), viewerHtml, 'utf8');

server.listen(PORT, '127.0.0.1', async () => {
  console.log('Servidor PDF.js ativo em http://127.0.0.1:' + PORT);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 2400, height: 1600 } });
  await page.goto(`http://127.0.0.1:${PORT}/scripts/pdf-viewer.html`);
  await page.waitForTimeout(1000);

  const outDir = path.resolve(ROOT_DIR, 'site-informativo/assets/fotos-reais');

  // Renderiza Página 10 (Abertura Parque Realengo)
  console.log('Renderizando página 10 do catálogo...');
  await page.evaluate(() => window.renderPage(10, 2.5));
  await page.waitForTimeout(2000);
  const canvasEl = page.locator('#pdf-canvas');
  await canvasEl.screenshot({ path: path.join(outDir, '00_bia_sp_parque_realengo_p10_render.png') });

  // Renderiza Página 11 (Fotos reais e planta do Parque Realengo)
  console.log('Renderizando página 11 do catálogo...');
  await page.evaluate(() => window.renderPage(11, 2.5));
  await page.waitForTimeout(2000);
  await canvasEl.screenshot({ path: path.join(outDir, '00_bia_sp_parque_realengo_p11_render.png') });

  console.log('Renderização com PDF.js finalizada com sucesso!');
  await browser.close();
  server.close();
  process.exit(0);
});
