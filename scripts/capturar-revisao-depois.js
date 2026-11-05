const path = require('path');
const fs = require('fs');
const http = require('http');

const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 3458;
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

async function runCaptures() {
  const server = await startServer();

  const baseDir = path.join(ROOT_DIR, 'screenshots/site-informativo/revisao-visual');
  const dirs = {
    desktop: path.join(baseDir, 'desktop'),
    mobile360: path.join(baseDir, 'mobile/360px'),
    mobile390: path.join(baseDir, 'mobile/390px'),
    mobile430: path.join(baseDir, 'mobile/430px'),
    comparacao: path.join(baseDir, 'comparacao-fotografica'),
    depois: path.join(baseDir, 'depois')
  };

  Object.values(dirs).forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  console.log('[Playwright] Inicializando Chrome...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // ========================================================================
    // 1. DESKTOP 1920x1080 (FHD)
    // ========================================================================
    console.log('[Desktop 1920x1080] Capturando...');
    const pageFHD = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    pageFHD.setDefaultTimeout(120000);
    await pageFHD.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await pageFHD.waitForTimeout(1500);

    // 01. Hero Completo
    await pageFHD.screenshot({ path: path.join(dirs.desktop, '01_desktop_1920_hero.png'), timeout: 0 });

    // 02. Página Completa
    await pageFHD.screenshot({ path: path.join(dirs.desktop, '02_desktop_1920_pagina_completa.png'), fullPage: true, timeout: 0 });

    // 03. Seções específicas
    const secDesafio = await pageFHD.$('#desafio');
    if (secDesafio) {
      await secDesafio.scrollIntoViewIfNeeded();
      await pageFHD.waitForTimeout(500);
      await secDesafio.screenshot({ path: path.join(dirs.desktop, '03_desktop_secao_desafio_recursos.png'), timeout: 0 });
    }

    const secSaude = await pageFHD.$('#saude');
    if (secSaude) {
      await secSaude.scrollIntoViewIfNeeded();
      await pageFHD.waitForTimeout(500);
      await secSaude.screenshot({ path: path.join(dirs.desktop, '04_desktop_secao_saude_enfermagem.png'), timeout: 0 });
    }

    const secTec = await pageFHD.$('#tecnologia');
    if (secTec) {
      await secTec.scrollIntoViewIfNeeded();
      await pageFHD.waitForTimeout(500);
      await secTec.screenshot({ path: path.join(dirs.desktop, '05_desktop_secao_tecnologia_sensores.png'), timeout: 0 });
    }

    const secParque = await pageFHD.$('#parque');
    if (secParque) {
      await secParque.scrollIntoViewIfNeeded();
      await pageFHD.waitForTimeout(500);
      await secParque.screenshot({ path: path.join(dirs.desktop, '06_desktop_secao_parque_realengo_completa.png'), timeout: 0 });
    }

    const secPesquisas = await pageFHD.$('#pesquisas');
    if (secPesquisas) {
      await secPesquisas.scrollIntoViewIfNeeded();
      await pageFHD.waitForTimeout(500);
      await secPesquisas.screenshot({ path: path.join(dirs.desktop, '07_desktop_secao_pesquisas_ods.png'), timeout: 0 });
    }

    const secPratica = await pageFHD.$('#pratica');
    if (secPratica) {
      await secPratica.scrollIntoViewIfNeeded();
      await pageFHD.waitForTimeout(500);
      await secPratica.screenshot({ path: path.join(dirs.desktop, '08_desktop_secao_pratica_acervo_drive.png'), timeout: 0 });
    }

    const secEquipe = await pageFHD.$('#equipe');
    if (secEquipe) {
      await secEquipe.scrollIntoViewIfNeeded();
      await pageFHD.waitForTimeout(500);
      await secEquipe.screenshot({ path: path.join(dirs.desktop, '09_desktop_secao_equipe_orientacao.png'), timeout: 0 });
    }

    const secFontes = await pageFHD.$('#conclusao');
    if (secFontes) {
      await secFontes.scrollIntoViewIfNeeded();
      await pageFHD.waitForTimeout(500);
      await secFontes.screenshot({ path: path.join(dirs.desktop, '10_desktop_secao_conclusao_fontes.png'), timeout: 0 });
    }

    // Salvar também em 'depois'
    await pageFHD.screenshot({ path: path.join(dirs.depois, 'desktop_1920x1080_fullpage_depois.png'), fullPage: true, timeout: 0 });

    // ========================================================================
    // 2. COMPARAÇÃO FOTOGRÁFICA INTERATIVA (MODOS & PERSPECTIVAS NO DESKTOP)
    // ========================================================================
    console.log('[Comparação Fotográfica] Capturando variações interativas...');
    const compHub = await pageFHD.$('#comparacao-visual-hub');
    if (compHub) {
      await compHub.scrollIntoViewIfNeeded();
      await pageFHD.waitForTimeout(500);

      // 01. Perspectiva Aérea - 50/50
      await compHub.screenshot({ path: path.join(dirs.comparacao, '01_desktop_perspectiva_aerea_50-50.png') });

      // 02. Perspectiva Aérea - Ver Antes (100% histórico)
      const btnAntes = await pageFHD.$('.view-mode-pill[data-mode="antes"]');
      if (btnAntes) {
        await btnAntes.click();
        await pageFHD.waitForTimeout(400);
        await compHub.screenshot({ path: path.join(dirs.comparacao, '02_desktop_perspectiva_aerea_antes_completo.png') });
      }

      // 03. Perspectiva Aérea - Ver Hoje (100% parque concluído)
      const btnHoje = await pageFHD.$('.view-mode-pill[data-mode="depois"]');
      if (btnHoje) {
        await btnHoje.click();
        await pageFHD.waitForTimeout(400);
        await compHub.screenshot({ path: path.join(dirs.comparacao, '03_desktop_perspectiva_aerea_hoje_completo.png') });
      }

      // 04. Perspectiva Aérea - Lado a Lado
      const btnSide = await pageFHD.$('.view-mode-pill[data-mode="side-by-side"]');
      if (btnSide) {
        await btnSide.click();
        await pageFHD.waitForTimeout(400);
        await compHub.screenshot({ path: path.join(dirs.comparacao, '04_desktop_perspectiva_aerea_lado_a_lado.png') });
      }

      // 05. Alternar para Perspectiva Terrestre (Nível dos Olhos)
      const tabTerrestre = await pageFHD.$('#tab-persp-terrestre');
      if (tabTerrestre) {
        await tabTerrestre.click();
        await pageFHD.waitForTimeout(500);

        // Voltar para modo slider
        const btnSlider = await pageFHD.$('.view-mode-pill[data-mode="slider"]');
        if (btnSlider) await btnSlider.click();
        await pageFHD.waitForTimeout(400);
        await compHub.screenshot({ path: path.join(dirs.comparacao, '05_desktop_perspectiva_terrestre_50-50.png') });

        // Lado a Lado Terrestre
        if (btnSide) {
          await btnSide.click();
          await pageFHD.waitForTimeout(400);
          await compHub.screenshot({ path: path.join(dirs.comparacao, '06_desktop_perspectiva_terrestre_lado_a_lado.png') });
        }
      }

      // 07. Lightbox de Foto Real Ampliada
      const btnZoom = await pageFHD.$('#btn-zoom-photo');
      if (btnZoom) {
        await btnZoom.click();
        await pageFHD.waitForTimeout(600);
        await pageFHD.screenshot({ path: path.join(dirs.comparacao, '07_desktop_lightbox_foto_real_ampliada.png') });
        const closeLightbox = await pageFHD.$('#lightbox-close-btn');
        if (closeLightbox) await closeLightbox.click();
        await pageFHD.waitForTimeout(300);
      }

      // 08. Galeria de Estruturas com Fotos Reais
      const eqGallery = await pageFHD.$('.structures-grid');
      if (eqGallery) {
        await eqGallery.scrollIntoViewIfNeeded();
        await pageFHD.waitForTimeout(500);
        await eqGallery.screenshot({ path: path.join(dirs.comparacao, '08_galeria_estruturas_fotos_reais.png') });
      }
    }
    await pageFHD.close();

    // ========================================================================
    // 3. DESKTOP 1440x900 (MacBook / Widescreen Compacto)
    // ========================================================================
    console.log('[Desktop 1440x900] Capturando...');
    const page1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page1440.setDefaultTimeout(120000);
    await page1440.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await page1440.waitForTimeout(1000);
    await page1440.screenshot({ path: path.join(dirs.desktop, '11_desktop_1440_hero.png'), timeout: 0 });
    await page1440.screenshot({ path: path.join(dirs.desktop, '12_desktop_1440_pagina_completa.png'), fullPage: true, timeout: 0 });
    await page1440.close();

    // ========================================================================
    // 4. MOBILE 360x800 (Padrão Android / Samsung Galaxy A Series)
    // ========================================================================
    console.log('[Mobile 360x800] Capturando...');
    const page360 = await browser.newPage({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
    page360.setDefaultTimeout(120000);
    await page360.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await page360.waitForTimeout(1200);

    await page360.screenshot({ path: path.join(dirs.mobile360, '01_mobile_360_hero.png'), timeout: 0 });
    await page360.screenshot({ path: path.join(dirs.mobile360, '02_mobile_360_pagina_completa.png'), fullPage: true, timeout: 0 });

    // Comparação de fotos no mobile 360
    const mCards360 = await page360.$('.mobile-photo-cards-group');
    if (mCards360) {
      await mCards360.scrollIntoViewIfNeeded();
      await page360.waitForTimeout(400);
      await mCards360.screenshot({ path: path.join(dirs.mobile360, '03_mobile_360_cards_fotos_reais.png'), timeout: 0 });
    }

    // Telemetria no mobile 360
    const mTec360 = await page360.$('#tecnologia');
    if (mTec360) {
      await mTec360.scrollIntoViewIfNeeded();
      await page360.waitForTimeout(400);
      await mTec360.screenshot({ path: path.join(dirs.mobile360, '04_mobile_360_sensores_telemetria.png'), timeout: 0 });
    }

    // Drawer aberto no mobile 360
    await page360.evaluate(() => window.openMobileDrawer && window.openMobileDrawer());
    await page360.waitForTimeout(500);
    await page360.screenshot({ path: path.join(dirs.mobile360, '05_mobile_360_drawer_menu.png'), timeout: 0 });
    await page360.evaluate(() => window.closeMobileDrawer && window.closeMobileDrawer());
    await page360.waitForTimeout(300);
    await page360.close();

    // ========================================================================
    // 5. MOBILE 390x844 (iPhone 12 / 13 / 14 - Referência Principal Mobile)
    // ========================================================================
    console.log('[Mobile 390x844] Capturando...');
    const page390 = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    page390.setDefaultTimeout(120000);
    await page390.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await page390.waitForTimeout(1200);

    await page390.screenshot({ path: path.join(dirs.mobile390, '01_mobile_390_hero.png'), timeout: 0 });
    await page390.screenshot({ path: path.join(dirs.mobile390, '02_mobile_390_pagina_completa.png'), fullPage: true, timeout: 0 });

    // Salvar também em 'depois'
    await page390.screenshot({ path: path.join(dirs.depois, 'mobile_390x844_fullpage_depois.png'), fullPage: true, timeout: 0 });

    const mDesafio390 = await page390.$('#desafio');
    if (mDesafio390) {
      await mDesafio390.scrollIntoViewIfNeeded();
      await page390.waitForTimeout(400);
      await mDesafio390.screenshot({ path: path.join(dirs.mobile390, '03_mobile_390_desafio_recursos.png'), timeout: 0 });
    }

    const mSaude390 = await page390.$('#saude');
    if (mSaude390) {
      await mSaude390.scrollIntoViewIfNeeded();
      await page390.waitForTimeout(400);
      await mSaude390.screenshot({ path: path.join(dirs.mobile390, '04_mobile_390_saude_enfermagem.png'), timeout: 0 });
    }

    const mCards390 = await page390.$('.mobile-photo-cards-group');
    if (mCards390) {
      await mCards390.scrollIntoViewIfNeeded();
      await page390.waitForTimeout(400);
      await mCards390.screenshot({ path: path.join(dirs.mobile390, '05_mobile_390_comparacao_fotos_reais.png'), timeout: 0 });
      await mCards390.screenshot({ path: path.join(dirs.comparacao, '09_mobile_cards_fotograficos_empilhados.png'), timeout: 0 });
    }

    // Zoom Lightbox no Mobile 390
    const zoomBtnMobile = await page390.$('.mobile-zoom-btn[data-target="after"]');
    if (zoomBtnMobile) {
      await zoomBtnMobile.click({ force: true });
      await page390.waitForTimeout(600);
      await page390.screenshot({ path: path.join(dirs.mobile390, '06_mobile_390_lightbox_zoom_foto.png'), timeout: 0 });
      await page390.screenshot({ path: path.join(dirs.comparacao, '10_mobile_lightbox_zoom_foto_real.png'), timeout: 0 });
      const closeLightboxMob = await page390.$('#lightbox-close-btn');
      if (closeLightboxMob) await closeLightboxMob.click({ force: true });
      await page390.waitForTimeout(300);
    }

    // Modal de Estrutura no Mobile
    const cardEstrutura = await page390.$('.structure-card[data-structure-id="torres"]');
    if (cardEstrutura) {
      await cardEstrutura.scrollIntoViewIfNeeded();
      await page390.waitForTimeout(300);
      await cardEstrutura.click({ force: true });
      await page390.waitForTimeout(500);
      await page390.screenshot({ path: path.join(dirs.mobile390, '07_mobile_390_modal_estrutura_real.png'), timeout: 0 });
      const closeStruct = await page390.$('#structure-modal-close');
      if (closeStruct) await closeStruct.click({ force: true });
      await page390.waitForTimeout(300);
    }

    // Modal de Material no Mobile
    const cardMaterial = await page390.$('.material-card[data-material-id="aluminio"]');
    if (cardMaterial) {
      await cardMaterial.scrollIntoViewIfNeeded();
      await page390.waitForTimeout(300);
      await cardMaterial.click({ force: true });
      await page390.waitForTimeout(500);
      await page390.screenshot({ path: path.join(dirs.mobile390, '08_mobile_390_modal_material_circular.png'), timeout: 0 });
      const closeMat = await page390.$('#material-modal-close');
      if (closeMat) await closeMat.click({ force: true });
      await page390.waitForTimeout(300);
    }

    // Drawer de Navegação no Mobile 390
    await page390.evaluate(() => window.openMobileDrawer && window.openMobileDrawer());
    await page390.waitForTimeout(500);
    await page390.screenshot({ path: path.join(dirs.mobile390, '09_mobile_390_drawer_navegacao.png'), timeout: 0 });
    await page390.evaluate(() => window.closeMobileDrawer && window.closeMobileDrawer());
    await page390.waitForTimeout(300);
    await page390.close();

    // ========================================================================
    // 6. MOBILE 430x932 (iPhone 14 / 15 / 16 Pro Max - Grande Formato Mobile)
    // ========================================================================
    console.log('[Mobile 430x932] Capturando...');
    const page430 = await browser.newPage({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true });
    page430.setDefaultTimeout(120000);
    await page430.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await page430.waitForTimeout(1200);

    await page430.screenshot({ path: path.join(dirs.mobile430, '01_mobile_430_hero.png'), timeout: 0 });
    await page430.screenshot({ path: path.join(dirs.mobile430, '02_mobile_430_pagina_completa.png'), fullPage: true, timeout: 0 });

    const mCards430 = await page430.$('.mobile-photo-cards-group');
    if (mCards430) {
      await mCards430.scrollIntoViewIfNeeded();
      await page430.waitForTimeout(400);
      await mCards430.screenshot({ path: path.join(dirs.mobile430, '03_mobile_430_comparacao_fotos_reais.png'), timeout: 0 });
    }

    const mEquipe430 = await page430.$('#equipe');
    if (mEquipe430) {
      await mEquipe430.scrollIntoViewIfNeeded();
      await page430.waitForTimeout(400);
      await mEquipe430.screenshot({ path: path.join(dirs.mobile430, '04_mobile_430_equipe_alunos_orientadora.png'), timeout: 0 });
    }
    await page430.close();

    console.log('Todas as capturas da suite foram concluidas com exito!');
  } catch (err) {
    console.error('Erro durante a captura:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

runCaptures();
