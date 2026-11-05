const path = require('path');
const fs = require('fs');
const http = require('http');

// Importa Playwright instalado no repositório
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 3456;
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

  const outDirs = {
    desktop: path.join(ROOT_DIR, 'screenshots/site-informativo/01-desktop'),
    mobile: path.join(ROOT_DIR, 'screenshots/site-informativo/02-mobile'),
    tablet: path.join(ROOT_DIR, 'screenshots/site-informativo/03-tablet'),
    interacoes: path.join(ROOT_DIR, 'screenshots/site-informativo/04-interacoes'),
    comparacoes: path.join(ROOT_DIR, 'screenshots/site-informativo/05-comparacoes')
  };

  Object.values(outDirs).forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  console.log('[Playwright] Inicializando Chrome...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // ------------------------------------------------------------------------
    // 2. MOBILE COMPLETO (360x800)
    // ------------------------------------------------------------------------
    console.log('[Mobile 360x800] Capturando...');
    const pageMobile360 = await browser.newPage({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
    await pageMobile360.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await pageMobile360.waitForTimeout(1000);
    await pageMobile360.screenshot({ path: path.join(outDirs.mobile, '07_pagina_completa_360x800.png'), fullPage: true });
    await pageMobile360.close();

    // ------------------------------------------------------------------------
    // 3. TABLET (768x1024)
    // ------------------------------------------------------------------------
    console.log('[Tablet 768x1024] Capturando...');
    const pageTablet = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await pageTablet.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await pageTablet.waitForTimeout(1000);

    // 01. Hero Tablet
    await pageTablet.screenshot({ path: path.join(outDirs.tablet, '01_hero_tablet_768x1024.png') });

    // 02. Seções Tablet
    await pageTablet.locator('#desafio').scrollIntoViewIfNeeded();
    await pageTablet.waitForTimeout(500);
    await pageTablet.screenshot({ path: path.join(outDirs.tablet, '02_secoes_tablet_768x1024.png') });

    // 03. Página Completa Tablet
    await pageTablet.screenshot({ path: path.join(outDirs.tablet, '03_pagina_completa_768x1024.png'), fullPage: true });
    await pageTablet.close();

    // ------------------------------------------------------------------------
    // 4. INTERAÇÕES & ESTADOS
    // ------------------------------------------------------------------------
    console.log('[Interações] Capturando estados dinâmicos...');
    const pageDesk = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await pageDesk.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await pageDesk.waitForTimeout(1200);

    // 01. Slider Antes (2021)
    await pageDesk.locator('[data-slider-preset="antes"]').click();
    await pageDesk.waitForTimeout(400);
    await pageDesk.locator('#comparison-container').scrollIntoViewIfNeeded();
    await pageDesk.screenshot({ path: path.join(outDirs.interacoes, '01_slider_antes_2021.png') });

    // 02. Slider Depois (2026)
    await pageDesk.locator('[data-slider-preset="depois"]').click();
    await pageDesk.waitForTimeout(400);
    await pageDesk.screenshot({ path: path.join(outDirs.interacoes, '02_slider_depois_2026.png') });

    // 03. Slider Meio a Meio (50/50)
    await pageDesk.locator('[data-slider-preset="ambos"]').click();
    await pageDesk.waitForTimeout(400);
    await pageDesk.screenshot({ path: path.join(outDirs.interacoes, '03_slider_meio_meio.png') });

    // 04. Modal de Material (Lata de Alumínio)
    await pageDesk.locator('[data-material-id="lata"]').click();
    await pageDesk.waitForTimeout(500);
    await pageDesk.screenshot({ path: path.join(outDirs.interacoes, '04_modal_material_lata.png') });
    await pageDesk.locator('#material-modal-close').click();
    await pageDesk.waitForTimeout(300);

    // 05. Modal de Estrutura (Super-Torres)
    await pageDesk.locator('[data-structure-id="torres"]').click();
    await pageDesk.waitForTimeout(500);
    await pageDesk.screenshot({ path: path.join(outDirs.interacoes, '05_modal_estrutura_torres.png') });
    await pageDesk.locator('#structure-modal-close').click();
    await pageDesk.waitForTimeout(300);

    // 06. Modo Feira Ativo
    await pageDesk.locator('#btn-toggle-feira').click();
    await pageDesk.waitForTimeout(500);
    await pageDesk.screenshot({ path: path.join(outDirs.interacoes, '06_modo_feira_ativo.png') });
    await pageDesk.locator('#btn-toggle-feira').click(); // Retorna ao modo normal
    await pageDesk.waitForTimeout(300);

    // 07. Filtro de Indicadores (Ar)
    await pageDesk.locator('#tecnologia').scrollIntoViewIfNeeded();
    await pageDesk.locator('[data-filter="ar"]').click();
    await pageDesk.waitForTimeout(400);
    await pageDesk.screenshot({ path: path.join(outDirs.interacoes, '07_filtro_indicadores_ar.png') });

    // 08. Menu Mobile Drawer Aberto
    const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pageMobile.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await pageMobile.waitForTimeout(800);
    await pageMobile.locator('#mobile-menu-toggle').click();
    await pageMobile.waitForTimeout(500);
    await pageMobile.screenshot({ path: path.join(outDirs.interacoes, '08_menu_mobile_drawer_aberto.png') });
    await pageMobile.close();

    // ------------------------------------------------------------------------
    // 5. COMPARAÇÕES ANTES VS DEPOIS DO SITE INFORMATIVO
    // ------------------------------------------------------------------------
    console.log('[Comparações] Organizando antes vs depois...');
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

    console.log('Todas as capturas restantes foram concluídas com êxito!');
    await browser.close();
    server.close();
    process.exit(0);

  } catch (err) {
    console.error('Erro durante a captura:', err);
    await browser.close();
    server.close();
    process.exit(1);
  }
}

capture();
