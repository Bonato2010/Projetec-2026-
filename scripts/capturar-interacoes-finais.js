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

async function run() {
  const server = await startServer();

  const outDirs = {
    interacoes: path.join(ROOT_DIR, 'screenshots/site-informativo/04-interacoes'),
    comparacoes: path.join(ROOT_DIR, 'screenshots/site-informativo/05-comparacoes'),
    desktop: path.join(ROOT_DIR, 'screenshots/site-informativo/01-desktop'),
    mobile: path.join(ROOT_DIR, 'screenshots/site-informativo/02-mobile')
  };

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const pageDesk = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await pageDesk.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await pageDesk.waitForTimeout(1000);

    // 05. Modal de Estrutura (Super-Torres)
    console.log('Capturando modal de estrutura...');
    await pageDesk.evaluate(() => {
      const card = document.querySelector('[data-structure-id="torres"]');
      if (card) card.click();
    });
    await pageDesk.waitForTimeout(600);
    await pageDesk.screenshot({ path: path.join(outDirs.interacoes, '05_modal_estrutura_torres.png') });

    // Fecha o modal
    await pageDesk.evaluate(() => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    });
    await pageDesk.waitForTimeout(300);

    // 06. Modo Feira Ativo
    console.log('Capturando modo feira ativo...');
    await pageDesk.evaluate(() => {
      document.getElementById('btn-toggle-feira').click();
    });
    await pageDesk.waitForTimeout(600);
    await pageDesk.screenshot({ path: path.join(outDirs.interacoes, '06_modo_feira_ativo.png') });

    // Volta ao normal
    await pageDesk.evaluate(() => {
      document.getElementById('btn-toggle-feira').click();
    });
    await pageDesk.waitForTimeout(300);

    // 07. Filtro de Indicadores (Ar)
    console.log('Capturando filtro de indicadores...');
    await pageDesk.locator('#tecnologia').scrollIntoViewIfNeeded();
    await pageDesk.locator('[data-filter="ar"]').click();
    await pageDesk.waitForTimeout(500);
    await pageDesk.screenshot({ path: path.join(outDirs.interacoes, '07_filtro_indicadores_ar.png') });

    // 08. Menu Mobile Drawer Aberto
    console.log('Capturando menu mobile drawer aberto...');
    const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pageMobile.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await pageMobile.waitForTimeout(800);
    await pageMobile.locator('#mobile-menu-toggle').click();
    await pageMobile.waitForTimeout(500);
    await pageMobile.screenshot({ path: path.join(outDirs.interacoes, '08_menu_mobile_drawer_aberto.png') });
    await pageMobile.close();

    // Comparações Antes vs Depois
    console.log('Organizando pasta 05-comparacoes...');
    const baseHero = path.join(ROOT_DIR, 'screenshots/site-informativo/00-versao-base/desktop/pagina-inicial.png');
    const newHero = path.join(outDirs.desktop, '01_hero_cosmos_1920x1080.png');
    if (fs.existsSync(baseHero) && fs.existsSync(newHero)) {
      fs.copyFileSync(baseHero, path.join(outDirs.comparacoes, '01_versao_anterior_painel_desktop.png'));
      fs.copyFileSync(newHero, path.join(outDirs.comparacoes, '02_versao_nova_ecocity_desktop.png'));
    }

    const baseFull = path.join(ROOT_DIR, 'screenshots/site-informativo/00-versao-base/desktop/pagina-completa.png');
    const newFull = path.join(outDirs.desktop, '13_pagina_completa_1920x1080.png');
    if (fs.existsSync(baseFull) && fs.existsSync(newFull)) {
      fs.copyFileSync(baseFull, path.join(outDirs.comparacoes, '03_versao_anterior_pagina_completa.png'));
      fs.copyFileSync(newFull, path.join(outDirs.comparacoes, '04_versao_nova_pagina_completa.png'));
    }

    const baseMobile = path.join(ROOT_DIR, 'screenshots/site-informativo/00-versao-base/mobile/pagina-inicial.png');
    const newMobile = path.join(outDirs.mobile, '01_hero_mobile_390x844.png');
    if (fs.existsSync(baseMobile) && fs.existsSync(newMobile)) {
      fs.copyFileSync(baseMobile, path.join(outDirs.comparacoes, '05_versao_anterior_mobile.png'));
      fs.copyFileSync(newMobile, path.join(outDirs.comparacoes, '06_versao_nova_mobile.png'));
    }

    console.log('Todas as interações e comparações foram capturadas e salvas!');
    await browser.close();
    server.close();
    process.exit(0);

  } catch (err) {
    console.error('Erro na captura final:', err);
    await browser.close();
    server.close();
    process.exit(1);
  }
}

run();
