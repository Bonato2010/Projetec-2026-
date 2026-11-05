/**
 * SCRIPT OFICIAL DE AUDITORIA VISUAL — SITE INFORMATIVO
 * Missão 01 — Projetec 2026 • Parque Realengo Susana Naspolini
 * 
 * Captura 100% real executada diretamente no navegador Google Chrome via Playwright.
 * Utiliza o protocolo file:/// para execução autônoma e segura dentro do sandbox.
 */

const fs = require('fs');
const path = require('path');
const pw = require('../parque-realengo-3d/node_modules/playwright');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.resolve(ROOT_DIR, 'screenshots', '01-site-informativo');

// URLs locais no formato file:///
const toFileUrl = (relPath) => 'file:///' + path.resolve(ROOT_DIR, relPath).replace(/\\/g, '/');

const URLS = {
  painel: toFileUrl('prototipos/02-painel-ambiental/index.html'),
  mapa: toFileUrl('prototipos/01-mapa-parque/index.html'),
  simulador: toFileUrl('prototipos/03-simulador-drenagem/index.html'),
  galeria: toFileUrl('prototipos/galeria-screenshots/index.html')
};

async function takeScreenshot(target, filePath, options = {}) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await target.screenshot({ path: filePath, ...options });
  const stat = fs.statSync(filePath);
  const kb = (stat.size / 1024).toFixed(1);
  console.log(`  ✓ Salvo: ${path.relative(OUTPUT_DIR, filePath)} (${kb} KB)`);
  return { path: filePath, size: stat.size };
}

async function run() {
  console.log('========================================================================');
  console.log('  MISSÃO 01 — CAPTURA VISUAL COMPLETA DO SITE INFORMATIVO (PROJETEC 2026)');
  console.log('========================================================================\n');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await pw.chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--allow-file-access-from-files', '--disable-gpu']
  });

  const manifest = {
    desktop: [],
    mobile: [],
    secoes: [],
    interacoes: []
  };

  try {
    // ========================================================================
    // 1. CAPTURAS DESKTOP (1920 × 1080 e 1440 × 900)
    // ========================================================================
    console.log('\n--- 1. CAPTURAS DESKTOP ---');

    // 1.1 Desktop 1920x1080 - Primeira Dobra
    const pDesk1080 = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await pDesk1080.goto(URLS.painel, { waitUntil: 'load' });
    await pDesk1080.waitForTimeout(1200);

    let s = await takeScreenshot(pDesk1080, path.join(OUTPUT_DIR, 'desktop', 'pagina-inicial.png'), { fullPage: false });
    manifest.desktop.push({ file: 'desktop/pagina-inicial.png', res: '1920×1080', desc: 'Primeira dobra da página inicial em Full HD (1920×1080)', bytes: s.size });

    // 1.2 Desktop 1920x1080 - Página Completa (Full Scroll)
    s = await takeScreenshot(pDesk1080, path.join(OUTPUT_DIR, 'desktop', 'pagina-completa.png'), { fullPage: true });
    manifest.desktop.push({ file: 'desktop/pagina-completa.png', res: '1920×1080 (Full)', desc: 'Página inicial informativa completa com rolagem vertical total', bytes: s.size });

    // 1.3 Desktop 1440x900 - Primeira Dobra
    const pDesk900 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pDesk900.goto(URLS.painel, { waitUntil: 'load' });
    await pDesk900.waitForTimeout(1000);

    s = await takeScreenshot(pDesk900, path.join(OUTPUT_DIR, 'desktop', 'pagina-inicial-1440x900.png'), { fullPage: false });
    manifest.desktop.push({ file: 'desktop/pagina-inicial-1440x900.png', res: '1440×900', desc: 'Primeira dobra em resolução widescreen (1440×900)', bytes: s.size });

    // 1.4 Desktop 1440x900 - Página Completa
    s = await takeScreenshot(pDesk900, path.join(OUTPUT_DIR, 'desktop', 'pagina-completa-1440x900.png'), { fullPage: true });
    manifest.desktop.push({ file: 'desktop/pagina-completa-1440x900.png', res: '1440×900 (Full)', desc: 'Página inicial informativa completa em 1440×900', bytes: s.size });
    await pDesk900.close();

    // 1.5 Desktop - Outras Páginas Informativas
    console.log('\n--- 1.5 OUTRAS PÁGINAS INFORMATIVAS (DESKTOP) ---');

    // A. Mapa Interativo 2D GIS
    const pMapaDesk = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await pMapaDesk.goto(URLS.mapa, { waitUntil: 'load' });
    await pMapaDesk.waitForTimeout(1000);
    s = await takeScreenshot(pMapaDesk, path.join(OUTPUT_DIR, 'desktop', 'outras-paginas', 'mapa-interativo-2d.png'), { fullPage: false });
    manifest.desktop.push({ file: 'desktop/outras-paginas/mapa-interativo-2d.png', res: '1920×1080', desc: 'Mapa Interativo 2D & Sistema GIS do Parque Realengo', bytes: s.size });
    await pMapaDesk.close();

    // B. Simulador de Drenagem Urbana
    const pSimDesk = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await pSimDesk.goto(URLS.simulador, { waitUntil: 'load' });
    await pSimDesk.waitForTimeout(1000);
    s = await takeScreenshot(pSimDesk, path.join(OUTPUT_DIR, 'desktop', 'outras-paginas', 'simulador-drenagem.png'), { fullPage: false });
    manifest.desktop.push({ file: 'desktop/outras-paginas/simulador-drenagem.png', res: '1920×1080', desc: 'Simulador Hidrodinâmico e Bacias de Retenção Pluvial', bytes: s.size });
    await pSimDesk.close();

    // C. Galeria Central de Evidências
    const pGalDesk = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await pGalDesk.goto(URLS.galeria, { waitUntil: 'load' });
    await pGalDesk.waitForTimeout(1000);
    s = await takeScreenshot(pGalDesk, path.join(OUTPUT_DIR, 'desktop', 'outras-paginas', 'galeria-hub.png'), { fullPage: false });
    manifest.desktop.push({ file: 'desktop/outras-paginas/galeria-hub.png', res: '1920×1080', desc: 'Central de Galeria Visual e Pré-visualização de Protótipos', bytes: s.size });
    await pGalDesk.close();

    // ========================================================================
    // 2. CAPTURAS MOBILE (390 × 844 e 360 × 800)
    // ========================================================================
    console.log('\n--- 2. CAPTURAS MOBILE ---');

    // 2.1 Mobile 390x844 - Primeira Dobra
    const pMob390 = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pMob390.goto(URLS.painel, { waitUntil: 'load' });
    await pMob390.waitForTimeout(1000);

    s = await takeScreenshot(pMob390, path.join(OUTPUT_DIR, 'mobile', 'pagina-inicial.png'), { fullPage: false });
    manifest.mobile.push({ file: 'mobile/pagina-inicial.png', res: '390×844', desc: 'Primeira dobra mobile (390×844)', bytes: s.size });

    // 2.2 Mobile 390x844 - Página Completa
    s = await takeScreenshot(pMob390, path.join(OUTPUT_DIR, 'mobile', 'pagina-completa.png'), { fullPage: true });
    manifest.mobile.push({ file: 'mobile/pagina-completa.png', res: '390×844 (Full)', desc: 'Página informativa mobile completa com rolagem contínua (390×844)', bytes: s.size });

    // 2.3 Mobile 360x800 - Primeira Dobra
    const pMob360 = await browser.newPage({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
    await pMob360.goto(URLS.painel, { waitUntil: 'load' });
    await pMob360.waitForTimeout(1000);

    s = await takeScreenshot(pMob360, path.join(OUTPUT_DIR, 'mobile', 'pagina-inicial-360x800.png'), { fullPage: false });
    manifest.mobile.push({ file: 'mobile/pagina-inicial-360x800.png', res: '360×800', desc: 'Primeira dobra mobile Android padrão (360×800)', bytes: s.size });

    // 2.4 Mobile 360x800 - Página Completa
    s = await takeScreenshot(pMob360, path.join(OUTPUT_DIR, 'mobile', 'pagina-completa-360x800.png'), { fullPage: true });
    manifest.mobile.push({ file: 'mobile/pagina-completa-360x800.png', res: '360×800 (Full)', desc: 'Página informativa mobile completa em 360×800', bytes: s.size });
    await pMob360.close();

    // 2.5 Mobile - Outras Páginas
    console.log('\n--- 2.5 OUTRAS PÁGINAS INFORMATIVAS (MOBILE) ---');

    // A. Mapa 2D Mobile
    const pMapaMob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pMapaMob.goto(URLS.mapa, { waitUntil: 'load' });
    await pMapaMob.waitForTimeout(1000);
    s = await takeScreenshot(pMapaMob, path.join(OUTPUT_DIR, 'mobile', 'outras-paginas', 'mapa-interativo-2d-mobile.png'), { fullPage: false });
    manifest.mobile.push({ file: 'mobile/outras-paginas/mapa-interativo-2d-mobile.png', res: '390×844', desc: 'Mapa Interativo 2D adaptado para celular touch', bytes: s.size });
    await pMapaMob.close();

    // B. Simulador Drenagem Mobile
    const pSimMob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pSimMob.goto(URLS.simulador, { waitUntil: 'load' });
    await pSimMob.waitForTimeout(1000);
    s = await takeScreenshot(pSimMob, path.join(OUTPUT_DIR, 'mobile', 'outras-paginas', 'simulador-drenagem-mobile.png'), { fullPage: false });
    manifest.mobile.push({ file: 'mobile/outras-paginas/simulador-drenagem-mobile.png', res: '390×844', desc: 'Simulador de drenagem em layout vertical com abas táteis', bytes: s.size });
    await pSimMob.close();

    // C. Galeria Hub Mobile
    const pGalMob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pGalMob.goto(URLS.galeria, { waitUntil: 'load' });
    await pGalMob.waitForTimeout(1000);
    s = await takeScreenshot(pGalMob, path.join(OUTPUT_DIR, 'mobile', 'outras-paginas', 'galeria-hub-mobile.png'), { fullPage: false });
    manifest.mobile.push({ file: 'mobile/outras-paginas/galeria-hub-mobile.png', res: '390×844', desc: 'Galeria visual de protótipos adaptada para smartphones', bytes: s.size });
    await pGalMob.close();

    // ========================================================================
    // 3. CAPTURAS DE SEÇÕES ESPECÍFICAS (DESKTOP 1920)
    // ========================================================================
    console.log('\n--- 3. CAPTURAS DE SEÇÕES ESPECÍFICAS ---');

    // 3.1 Cabeçalho
    const headerEl = await pDesk1080.$('header.app-header');
    if (headerEl) {
      const box = await headerEl.boundingBox();
      s = await takeScreenshot(pDesk1080, path.join(OUTPUT_DIR, 'secoes', 'cabecalho.png'), {
        clip: { x: 0, y: 0, width: 1920, height: Math.max(120, Math.ceil(box.height + 15)) }
      });
      manifest.secoes.push({ file: 'secoes/cabecalho.png', desc: 'Cabeçalho com marca Central V.I.D.A., status de operação, névoa e comandos', bytes: s.size });
    }

    // 3.2 Apresentação (Hero Banner)
    const heroEl = await pDesk1080.$('section.hero-banner');
    if (heroEl) {
      await heroEl.scrollIntoViewIfNeeded();
      s = await takeScreenshot(heroEl, path.join(OUTPUT_DIR, 'secoes', 'apresentacao.png'));
      manifest.secoes.push({ file: 'secoes/apresentacao.png', desc: 'Apresentação histórica e Soluções Baseadas na Natureza (SbN)', bytes: s.size });
    }

    // 3.3 Sustentabilidade (KPIs)
    const kpiEl = await pDesk1080.$('section.top-kpis-grid');
    if (kpiEl) {
      await kpiEl.scrollIntoViewIfNeeded();
      s = await takeScreenshot(kpiEl, path.join(OUTPUT_DIR, 'secoes', 'sustentabilidade.png'));
      manifest.secoes.push({ file: 'secoes/sustentabilidade.png', desc: 'Métricas de sustentabilidade: 3.700 árvores, alívio de -5,8°C, 1.950 m³ de água pluvial e 84,2% permeável', bytes: s.size });
    }

    // 3.4 Microclima & Infraestrutura Verde
    const panels = await pDesk1080.$$('.dashboard-panel');
    if (panels.length >= 1) {
      await panels[0].scrollIntoViewIfNeeded();
      s = await takeScreenshot(panels[0], path.join(OUTPUT_DIR, 'secoes', 'microclima.png'));
      manifest.secoes.push({ file: 'secoes/microclima.png', desc: 'Mapa microclimático interativo de calor urbano e infraestrutura verde', bytes: s.size });
    }

    // 3.5 Curva Térmica Diária
    if (panels.length >= 2) {
      await panels[1].scrollIntoViewIfNeeded();
      s = await takeScreenshot(panels[1], path.join(OUTPUT_DIR, 'secoes', 'curva-termica.png'));
      manifest.secoes.push({ file: 'secoes/curva-termica.png', desc: 'Curva térmica 24h comparando asfalto, parque e área sob aspersão ativa', bytes: s.size });
    }

    // 3.6 Comparador Antes vs Depois (Slider)
    const compEl = await pDesk1080.$('section.comparison-section');
    if (compEl) {
      await compEl.scrollIntoViewIfNeeded();
      s = await takeScreenshot(compEl, path.join(OUTPUT_DIR, 'secoes', 'comparador-antes-depois.png'));
      manifest.secoes.push({ file: 'secoes/comparador-antes-depois.png', desc: 'Comparador temporal interativo: 2021 (área militar desativada) vs 2026 (parque ecológico)', bytes: s.size });
    }

    // 3.7 Balanço Hídrico, Botânica e ODS
    const secRow = await pDesk1080.$('section.secondary-charts-row');
    if (secRow) {
      await secRow.scrollIntoViewIfNeeded();
      s = await takeScreenshot(secRow, path.join(OUTPUT_DIR, 'secoes', 'balanco-hidrico-botanica-ods.png'));
      manifest.secoes.push({ file: 'secoes/balanco-hidrico-botanica-ods.png', desc: 'Gráficos de retenção hídrica, donut de espécies da Mata Atlântica e metas ODS da ONU', bytes: s.size });
    }

    // 3.8 Catálogo Completo de Indicadores Ambientais
    const catEl = await pDesk1080.$('section.catalog-section');
    if (catEl) {
      await catEl.scrollIntoViewIfNeeded();
      s = await takeScreenshot(catEl, path.join(OUTPUT_DIR, 'secoes', 'catalogo-indicadores.png'));
      manifest.secoes.push({ file: 'secoes/catalogo-indicadores.png', desc: 'Catálogo geral de indicadores ambientais com busca, filtros por categoria e selos de proveniência', bytes: s.size });
    }

    // 3.9 Rodapé Institucional
    const footEl = await pDesk1080.$('footer.app-footer');
    if (footEl) {
      await footEl.scrollIntoViewIfNeeded();
      s = await takeScreenshot(footEl, path.join(OUTPUT_DIR, 'secoes', 'rodape.png'));
      manifest.secoes.push({ file: 'secoes/rodape.png', desc: 'Rodapé institucional e transparência de dados abertos (Data.rio, Prefeitura, IBGE, MMA)', bytes: s.size });
    }

    // ========================================================================
    // 4. CAPTURAS DE INTERAÇÕES E ESTADOS
    // ========================================================================
    console.log('\n--- 4. CAPTURAS DE INTERAÇÕES E ESTADOS ---');

    // 4.1 Interação: Tema Claro (Light Mode)
    await pDesk1080.evaluate(() => window.scrollTo(0, 0));
    await pDesk1080.click('#theme-toggle-btn');
    await pDesk1080.waitForTimeout(600);
    s = await takeScreenshot(pDesk1080, path.join(OUTPUT_DIR, 'interacoes', 'tema-claro.png'), { fullPage: false });
    manifest.interacoes.push({ file: 'interacoes/tema-claro.png', desc: 'Interface no Modo Claro (Light Mode) ativado via alternador de tema', bytes: s.size });
    // Retornar ao tema escuro
    await pDesk1080.click('#theme-toggle-btn');
    await pDesk1080.waitForTimeout(400);

    // 4.2 Interação: Mapa com Camada "Lago & Drenagem"
    await pDesk1080.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.map-layer-btn')).find(b => b.textContent.includes('Lago'));
      if (btn) btn.click();
    });
    await pDesk1080.waitForTimeout(600);
    if (panels.length >= 1) {
      await panels[0].scrollIntoViewIfNeeded();
      s = await takeScreenshot(panels[0], path.join(OUTPUT_DIR, 'interacoes', 'mapa-camada-drenagem.png'));
      manifest.interacoes.push({ file: 'interacoes/mapa-camada-drenagem.png', desc: 'Camada de Lago & Drenagem ativada no mapa microclimático', bytes: s.size });
    }

    // 4.3 Interação: Mapa com Camada "Bosque Nativo"
    await pDesk1080.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.map-layer-btn')).find(b => b.textContent.includes('Bosque'));
      if (btn) btn.click();
    });
    await pDesk1080.waitForTimeout(600);
    if (panels.length >= 1) {
      s = await takeScreenshot(panels[0], path.join(OUTPUT_DIR, 'interacoes', 'mapa-camada-bosque.png'));
      manifest.interacoes.push({ file: 'interacoes/mapa-camada-bosque.png', desc: 'Camada de Bosque Nativo & Dossel Florestal ativada no mapa', bytes: s.size });
    }

    // 4.4 Interação: Sonda Térmica Interativa do Mapa
    await pDesk1080.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.map-layer-btn')).find(b => b.textContent.includes('Ilha'));
      if (btn) btn.click();
      const canvas = document.getElementById('heatmap-canvas');
      if (canvas) {
        const r = canvas.getBoundingClientRect();
        const ev = new MouseEvent('mousemove', { clientX: r.left + r.width * 0.45, clientY: r.top + r.height * 0.5, bubbles: true });
        canvas.dispatchEvent(ev);
      }
    });
    await pDesk1080.waitForTimeout(600);
    if (panels.length >= 1) {
      s = await takeScreenshot(panels[0], path.join(OUTPUT_DIR, 'interacoes', 'mapa-sonda-termica-hover.png'));
      manifest.interacoes.push({ file: 'interacoes/mapa-sonda-termica-hover.png', desc: 'Sonda térmica ativa exibindo temperatura pontual e hotspot sob as torres', bytes: s.size });
    }

    // 4.5 Interação: Slider Comparador — Preset 2021 (Antes)
    await pDesk1080.evaluate(() => {
      if (window.VidaSlider && window.VidaSlider.setPreset) window.VidaSlider.setPreset('antes');
    });
    await pDesk1080.waitForTimeout(600);
    if (compEl) {
      await compEl.scrollIntoViewIfNeeded();
      s = await takeScreenshot(compEl, path.join(OUTPUT_DIR, 'interacoes', 'slider-preset-2021-antes.png'));
      manifest.interacoes.push({ file: 'interacoes/slider-preset-2021-antes.png', desc: 'Slider ajustado 100% para o estado de 2021 (Antigo Terreno Militar)', bytes: s.size });
    }

    // 4.6 Interação: Slider Comparador — Preset 2026 (Depois)
    await pDesk1080.evaluate(() => {
      if (window.VidaSlider && window.VidaSlider.setPreset) window.VidaSlider.setPreset('depois');
    });
    await pDesk1080.waitForTimeout(600);
    if (compEl) {
      s = await takeScreenshot(compEl, path.join(OUTPUT_DIR, 'interacoes', 'slider-preset-2026-depois.png'));
      manifest.interacoes.push({ file: 'interacoes/slider-preset-2026-depois.png', desc: 'Slider ajustado 100% para o estado de 2026 (Parque Ecológico Concluído)', bytes: s.size });
    }
    // Restaurar slider para 50%
    await pDesk1080.evaluate(() => {
      if (window.VidaSlider && window.VidaSlider.setPreset) window.VidaSlider.setPreset('50');
    });

    // 4.7 Interação: Filtro por Categoria no Catálogo ("Clima Urbano")
    await pDesk1080.evaluate(() => {
      const pill = Array.from(document.querySelectorAll('.filter-pill')).find(p => p.textContent.includes('Clima'));
      if (pill) pill.click();
    });
    await pDesk1080.waitForTimeout(600);
    if (catEl) {
      await catEl.scrollIntoViewIfNeeded();
      s = await takeScreenshot(catEl, path.join(OUTPUT_DIR, 'interacoes', 'catalogo-filtro-categoria.png'));
      manifest.interacoes.push({ file: 'interacoes/catalogo-filtro-categoria.png', desc: 'Catálogo com filtro da categoria "Clima Urbano" ativo', bytes: s.size });
    }

    // 4.8 Interação: Busca Instantânea de Indicador por Texto
    await pDesk1080.evaluate(() => {
      const allPill = Array.from(document.querySelectorAll('.filter-pill')).find(p => p.textContent.includes('Todos'));
      if (allPill) allPill.click();
    });
    await pDesk1080.fill('#indicator-search-input', 'temperatura');
    await pDesk1080.waitForTimeout(600);
    if (catEl) {
      s = await takeScreenshot(catEl, path.join(OUTPUT_DIR, 'interacoes', 'catalogo-busca-termo.png'));
      manifest.interacoes.push({ file: 'interacoes/catalogo-busca-termo.png', desc: 'Busca textual dinâmica filtrando indicadores pelo termo "temperatura"', bytes: s.size });
    }
    await pDesk1080.fill('#indicator-search-input', '');

    // 4.9 Interação: Modal de Detalhamento Técnico do Indicador
    await pDesk1080.evaluate(() => {
      const card = document.querySelector('.indicator-card');
      if (card) card.click();
    });
    await pDesk1080.waitForTimeout(700);
    s = await takeScreenshot(pDesk1080, path.join(OUTPUT_DIR, 'interacoes', 'modal-detalhes-indicador.png'), { fullPage: false });
    manifest.interacoes.push({ file: 'interacoes/modal-detalhes-indicador.png', desc: 'Modal interativo com explicação conceitual, relevância para saúde e fontes oficiais auditadas', bytes: s.size });
    await pDesk1080.click('#modal-close-btn');
    await pDesk1080.waitForTimeout(400);

    // 4.10 Interação: Modal de Exportação de Dados
    await pDesk1080.click('#btn-export-report');
    await pDesk1080.waitForTimeout(700);
    s = await takeScreenshot(pDesk1080, path.join(OUTPUT_DIR, 'interacoes', 'modal-exportacao-dados.png'), { fullPage: false });
    manifest.interacoes.push({ file: 'interacoes/modal-exportacao-dados.png', desc: 'Modal de exportação de dados em formatos JSON, CSV e Imprimir/PDF', bytes: s.size });
    await pDesk1080.click('#export-close-btn');
    await pDesk1080.waitForTimeout(400);

    // 4.11 Interação: Outros Estados — Mapa 2D com Drawer de POI Aberto
    const pMapaState = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await pMapaState.goto(URLS.mapa, { waitUntil: 'load' });
    await pMapaState.waitForTimeout(800);
    await pMapaState.evaluate(() => {
      const poi = document.querySelector('.poi-item');
      if (poi) poi.click();
    });
    await pMapaState.waitForTimeout(600);
    s = await takeScreenshot(pMapaState, path.join(OUTPUT_DIR, 'interacoes', 'outros-estados', 'mapa-drawer-poi-aberto.png'), { fullPage: false });
    manifest.interacoes.push({ file: 'interacoes/outros-estados/mapa-drawer-poi-aberto.png', desc: 'Drawer lateral de ponto de interesse (POI) com dados de acessibilidade e status ativo', bytes: s.size });
    await pMapaState.close();

    // 4.12 Interação: Outros Estados — Simulador de Drenagem com Tempestade Extrema
    const pSimState = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await pSimState.goto(URLS.simulador, { waitUntil: 'load' });
    await pSimState.waitForTimeout(800);
    await pSimState.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.btn-preset')).find(b => b.textContent.includes('Extrema') || b.getAttribute('data-val') === '120');
      if (btn) btn.click();
    });
    await pSimState.waitForTimeout(800);
    s = await takeScreenshot(pSimState, path.join(OUTPUT_DIR, 'interacoes', 'outros-estados', 'simulador-tempestade-extrema.png'), { fullPage: false });
    manifest.interacoes.push({ file: 'interacoes/outros-estados/simulador-tempestade-extrema.png', desc: 'Simulador hidrodinâmico com precipitação extrema de 120 mm/h e nível dágua monitorado', bytes: s.size });
    await pSimState.close();

    console.log('\n========================================================================');
    console.log(`✅ AUDITORIA CONCLUÍDA! TOTAL DE CAPTURAS: ${
      manifest.desktop.length +
      manifest.mobile.length +
      manifest.secoes.length +
      manifest.interacoes.length
    }`);
    console.log('========================================================================\n');

    return manifest;

  } finally {
    await browser.close();
  }
}

run().then(m => {
  fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(m, null, 2));
  console.log('Manifest salvo em manifest.json');
}).catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
