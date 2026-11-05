const path = require('path');
const fs = require('fs');
const http = require('http');

const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 3457;
const TARGET_URL = `http://127.0.0.1:${PORT}/site-informativo/index.html`;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function startServer() {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/site-informativo/index.html';

    const filePath = path.normalize(path.join(ROOT_DIR, reqPath));
    if (!filePath.startsWith(ROOT_DIR)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404);
        return res.end(`Not found: ${reqPath}`);
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[Servidor Local] Ativo em http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

async function capture() {
  const server = await startServer();
  const outDir = path.join(ROOT_DIR, 'screenshots/site-informativo/revisao-visual/antes');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('[Playwright] Inicializando Chrome...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Desktop 1920x1080
    console.log('[Desktop 1920x1080] Capturando ANTES...');
    const pageDesktop = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await pageDesktop.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await pageDesktop.waitForTimeout(1500);

    await pageDesktop.screenshot({ path: path.join(outDir, '01_desktop_hero_antes.png') });
    await pageDesktop.screenshot({ path: path.join(outDir, '02_desktop_fullpage_antes.png'), fullPage: true });

    // Seção de comparação antiga
    const compEl = await pageDesktop.$('#comparacao');
    if (compEl) {
      await compEl.scrollIntoViewIfNeeded();
      await pageDesktop.waitForTimeout(800);
      await compEl.screenshot({ path: path.join(outDir, '03_desktop_secao_comparacao_3d_antes.png') });
    }
    await pageDesktop.close();

    // Mobile 390x844 (iPhone 12/13/14)
    console.log('[Mobile 390x844] Capturando ANTES...');
    const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pageMobile.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await pageMobile.waitForTimeout(1500);

    await pageMobile.screenshot({ path: path.join(outDir, '04_mobile_hero_antes.png') });
    await pageMobile.screenshot({ path: path.join(outDir, '05_mobile_fullpage_antes.png'), fullPage: true });

    const compElMob = await pageMobile.$('#comparacao');
    if (compElMob) {
      await compElMob.scrollIntoViewIfNeeded();
      await pageMobile.waitForTimeout(800);
      await compElMob.screenshot({ path: path.join(outDir, '06_mobile_secao_comparacao_antes.png') });
    }
    await pageMobile.close();

    console.log('Capturas "ANTES" concluidas com sucesso!');
  } catch (err) {
    console.error('Erro na captura:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

capture();
