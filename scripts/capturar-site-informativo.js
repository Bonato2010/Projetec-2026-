const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT_DIR, 'screenshots', '04-site-informativo');
const PORT = 3110;

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const pw = require('playwright-core');

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

      // Fallback para site-informativo/
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
      console.log(`Servidor de teste ativo em http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startServer();
  let browser;

  try {
    browser = await pw.chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });

    // 1. Desktop 1920x1080
    console.log('--- CAPTURANDO CENÁRIOS DESKTOP (1920x1080) ---');
    const desktopPage = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    await desktopPage.goto(`http://127.0.0.1:${PORT}/biotecnologia`, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1000);

    // 01. Hero & Introdução
    await desktopPage.screenshot({
      path: path.join(OUT_DIR, '01-desktop-hero-introducao.png')
    });
    console.log('✓ Capturado: 01-desktop-hero-introducao.png');

    // 02. Seção Agricultura Sustentável
    const secAgri = await desktopPage.$('#agricultura');
    if (secAgri) {
      await secAgri.scrollIntoViewIfNeeded();
      await desktopPage.waitForTimeout(600);
      await desktopPage.screenshot({
        path: path.join(OUT_DIR, '02-desktop-agricultura-sustentavel.png')
      });
      console.log('✓ Capturado: 02-desktop-agricultura-sustentavel.png');
    }

    // 03. Seção Energias Renováveis
    const secEnergia = await desktopPage.$('#energias');
    if (secEnergia) {
      await secEnergia.scrollIntoViewIfNeeded();
      await desktopPage.waitForTimeout(600);
      await desktopPage.screenshot({
        path: path.join(OUT_DIR, '03-desktop-energias-renovaveis.png')
      });
      console.log('✓ Capturado: 03-desktop-energias-renovaveis.png');
    }

    // 04. Seção Preservação & Biorremediação
    const secPreserv = await desktopPage.$('#preservacao');
    if (secPreserv) {
      await secPreserv.scrollIntoViewIfNeeded();
      await desktopPage.waitForTimeout(600);
      await desktopPage.screenshot({
        path: path.join(OUT_DIR, '04-desktop-preservacao-biorremediacao.png')
      });
      console.log('✓ Capturado: 04-desktop-preservacao-biorremediacao.png');
    }

    // 05. Seção Futuro Sustentável & Rodapé
    const secFuturo = await desktopPage.$('#futuro');
    if (secFuturo) {
      await secFuturo.scrollIntoViewIfNeeded();
      await desktopPage.waitForTimeout(600);
      await desktopPage.screenshot({
        path: path.join(OUT_DIR, '05-desktop-futuro-bioeconomia.png')
      });
      console.log('✓ Capturado: 05-desktop-futuro-bioeconomia.png');
    }

    // 06. Página Completa (Full Page)
    await desktopPage.screenshot({
      path: path.join(OUT_DIR, '06-desktop-pagina-completa.png'),
      fullPage: true
    });
    console.log('✓ Capturado: 06-desktop-pagina-completa.png');

    await desktopPage.close();

    // 2. Mobile 390x844 (iPhone 14 / Tela vertical moderna)
    console.log('--- CAPTURANDO CENÁRIOS MOBILE (390x844) ---');
    const mobilePage = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });

    await mobilePage.goto(`http://127.0.0.1:${PORT}/biotecnologia`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);

    // 07. Mobile Hero
    await mobilePage.screenshot({
      path: path.join(OUT_DIR, '07-mobile-hero-responsivo.png')
    });
    console.log('✓ Capturado: 07-mobile-hero-responsivo.png');

    // 08. Mobile Menu Aberto (Hambúrguer)
    await mobilePage.click('#menuToggle');
    await mobilePage.waitForTimeout(400);
    await mobilePage.screenshot({
      path: path.join(OUT_DIR, '08-mobile-menu-aberto.png')
    });
    console.log('✓ Capturado: 08-mobile-menu-aberto.png');

    // Fechar menu
    await mobilePage.click('#menuToggle');
    await mobilePage.waitForTimeout(300);

    // 09. Mobile Cards de Agricultura e Indicadores
    const mobileAgri = await mobilePage.$('#agricultura');
    if (mobileAgri) {
      await mobileAgri.scrollIntoViewIfNeeded();
      await mobilePage.waitForTimeout(600);
      await mobilePage.screenshot({
        path: path.join(OUT_DIR, '09-mobile-agricultura-cards.png')
      });
      console.log('✓ Capturado: 09-mobile-agricultura-cards.png');
    }

    await mobilePage.close();
    console.log('🎉 TODAS AS SCREENSHOTS FORAM CAPTURADAS COM SUCESSO!');

  } catch (err) {
    console.error('Erro na captura:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

run();
