const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BASE_OUT_DIR = path.resolve(ROOT_DIR, 'screenshots', 'bio-nova');
const PORT = 3120;

const SUBDIRS = [
  'mobile-360px',
  'mobile-390px',
  'mobile-430px',
  'tablet-768px',
  'desktop'
];

SUBDIRS.forEach(sub => {
  const d = path.join(BASE_OUT_DIR, sub);
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);

      if (pathname === '/' || pathname === '/biotecnologia' || pathname === '/sustentabilidade' || pathname === '/site-informativo') {
        pathname = '/site-informativo/index.html';
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

      let fallback = path.normalize(path.join(ROOT_DIR, 'site-informativo', pathname));
      if (fs.existsSync(fallback) && fs.statSync(fallback).isFile()) {
        const ext = path.extname(fallback).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(fallback).pipe(res);
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404: ${pathname}`);
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[Bio Nova Server] Ativo em http://127.0.0.1:${PORT}`);
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

    const resolutions = [
      { name: 'mobile-360px', width: 360, height: 800, isMobile: true },
      { name: 'mobile-390px', width: 390, height: 844, isMobile: true },
      { name: 'mobile-430px', width: 430, height: 932, isMobile: true },
      { name: 'tablet-768px', width: 768, height: 1024, isMobile: false },
      { name: 'desktop', width: 1920, height: 1080, isMobile: false }
    ];

    for (const res of resolutions) {
      console.log(`\n=== Capturando para resolução: ${res.name} (${res.width}x${res.height}) ===`);
      const page = await browser.newPage({
        viewport: { width: res.width, height: res.height },
        isMobile: res.isMobile,
        hasTouch: res.isMobile
      });

      await page.goto(`http://127.0.0.1:${PORT}/biotecnologia`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);

      const outSubDir = path.join(BASE_OUT_DIR, res.name);

      // 1. Página inicial / Hero
      await page.screenshot({ path: path.join(outSubDir, '01-pagina-inicial.png') });
      console.log(`  ✓ Salvo: 01-pagina-inicial.png`);

      // 2. Conceitos Fundamentais
      const heroCard = await page.$('.hero-card-wrap');
      if (heroCard) {
        await heroCard.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(outSubDir, '02-conceitos-fundamentais.png') });
        console.log(`  ✓ Salvo: 02-conceitos-fundamentais.png`);
      }

      // 3. Seção Equipe
      const equipeSec = await page.$('#equipe');
      if (equipeSec) {
        await equipeSec.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(outSubDir, '03-secao-equipe.png') });
        console.log(`  ✓ Salvo: 03-secao-equipe.png`);

        // Destaque Professora Amanda
        const profCard = await page.$('.featured-primary');
        if (profCard) {
          await profCard.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(outSubDir, '04-card-professora-amanda.png') });
          console.log(`  ✓ Salvo: 04-card-professora-amanda.png`);
        }

        // Destaque Daniel
        const danielCard = await page.$('.featured-coordinator');
        if (danielCard) {
          await danielCard.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(outSubDir, '05-card-daniel.png') });
          console.log(`  ✓ Salvo: 05-card-daniel.png`);
        }

        // Destaque Yasmin
        const yasminCard = await page.$('.featured-vice');
        if (yasminCard) {
          await yasminCard.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);
          await page.screenshot({ path: path.join(outSubDir, '06-card-yasmin.png') });
          console.log(`  ✓ Salvo: 06-card-yasmin.png`);
        }
      }

      await page.close();
    }

    console.log('\n🎉 TODAS AS CAPTURAS RESPONSIVAS DO BIO NOVA FORAM CONCLUÍDAS COM SUCESSO!');
  } catch (err) {
    console.error('Erro na captura responsiva:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

run();
