const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PIXEL_ART_DIR = path.resolve(ROOT_DIR, 'prototipos', 'pixel-art-2d');
const OUT_DIR = path.resolve(ROOT_DIR, 'screenshots', 'pixel-art-2d');
const PORT = 3130;

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);

      if (pathname === '/' || pathname === '/pixel-art-2d' || pathname === '/tela2') {
        pathname = '/prototipos/pixel-art-2d/index.html';
      } else if (pathname.startsWith('/pixel-art-2d/')) {
        pathname = `/prototipos/pixel-art-2d/${pathname.slice(14)}`;
      }

      let safePath = path.normalize(path.join(ROOT_DIR, pathname));
      if (!safePath.startsWith(ROOT_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
        const ext = path.extname(safePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(safePath).pipe(res);
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404: ${pathname}`);
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[Pixel Art Test Server] Ativo em http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startServer();
  let browser;

  try {
    const pw = require('playwright-core');
    browser = await pw.chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });

    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`[Console Error]: ${msg.text()}`);
      }
    });

    page.on('pageerror', err => {
      console.error(`[Page Error]: ${err.message}`);
    });

    console.log('Carregando http://127.0.0.1:3000/pixel-art-2d ou http://127.0.0.1:3130/ ...');
    await page.goto(`http://127.0.0.1:${PORT}/prototipos/pixel-art-2d/index.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    // 1. Tela Principal (Desktop)
    await page.screenshot({ path: path.join(OUT_DIR, '01-tela-principal-cidade.png') });
    console.log('✓ Capturado: 01-tela-principal-cidade.png');

    // 2. Simular clique ou modal de emergência se houver
    await page.evaluate(() => {
      if (window.__ecoPixelGame) {
        window.__ecoPixelGame.scenarioManager.loadScenario('guerra_faccoes');
      }
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '03-alerta-guerra.png') });
    console.log('✓ Capturado: 03-alerta-guerra.png');

    // 3. Simular inundação
    await page.evaluate(() => {
      if (window.__ecoPixelGame) {
        window.__ecoPixelGame.scenarioManager.loadScenario('inundacao');
      }
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '05-alerta-inundacao.png') });
    console.log('✓ Capturado: 05-alerta-inundacao.png');

    // 4. Testar visualização mobile (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT_DIR, '07-controle-mobile.png') });
    console.log('✓ Capturado: 07-controle-mobile.png');

    console.log('🎉 Teste real no navegador concluído com sucesso!');

  } catch (err) {
    console.error('Erro no teste do navegador:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

run();
