/**
 * AUDITORIA VISUAL COMPLETA DO PROJETO ECOCITY / V.I.D.A.
 * Captura automatizada em múltiplas resoluções:
 * - Desktop / Televisão: 1920 × 1080
 * - Notebook: 1366 × 768
 * - Tablet: 768 × 1024
 * - Celular: 390 × 844
 * 
 * Distribuição em todas as subpastas oficiais de docs/evidencias/
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const pw = require('../parque-realengo-3d/node_modules/playwright');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_3D = path.resolve(ROOT_DIR, 'parque-realengo-3d', 'dist');
const PORT = 3098;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function startServer() {
  const RANKING_FILE = path.join(ROOT_DIR, 'data', 'ranking.json');

  const server = http.createServer((req, res) => {
    let parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // API Ranking
    if (pathname === '/api/ranking') {
      if (req.method === 'GET') {
        if (fs.existsSync(RANKING_FILE)) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(fs.readFileSync(RANKING_FILE, 'utf8'));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('[]');
        return;
      }
    }

    // API Network Info
    if (pathname === '/api/network-info') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ip: '192.168.1.15',
        port: PORT,
        allIps: [{ iface: 'Wi-Fi', ip: '192.168.1.15' }],
        tvUrl: `http://192.168.1.15:${PORT}/`,
        mobileUrl: `http://192.168.1.15:${PORT}/controle.html`,
        mobile3dUrl: `http://192.168.1.15:${PORT}/parque3d?mode=mobile`
      }));
      return;
    }

    let filePath;
    if (pathname.startsWith('/parque3d/assets/')) {
      filePath = path.join(DIST_3D, 'assets', pathname.replace('/parque3d/assets/', ''));
    } else if (pathname === '/parque3d' || pathname === '/parque3d/') {
      filePath = path.join(DIST_3D, 'index.html');
    } else if (pathname.startsWith('/parque3d/')) {
      filePath = path.join(DIST_3D, pathname.replace('/parque3d/', ''));
    } else if (pathname.startsWith('/assets/') && !fs.existsSync(path.join(ROOT_DIR, pathname))) {
      filePath = path.join(DIST_3D, pathname);
    } else {
      filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
    }

    const safePath = path.normalize(filePath);
    if (!safePath.startsWith(ROOT_DIR)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(safePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Not found: ${pathname}`);
        return;
      }
      const ext = path.extname(safePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(safePath).pipe(res);
    });
  });

  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => {
    console.log(`[Servidor Auditoria] Ativo em http://127.0.0.1:${PORT}`);
    resolve(server);
  }));
}

async function safeScreenshot(page, filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const buffer = await page.screenshot({ animations: 'disabled' });
  fs.writeFileSync(filePath, buffer);
  const kb = (buffer.length / 1024).toFixed(1);
  console.log(`  ✓ Capturado: ${path.relative(ROOT_DIR, filePath)} (${kb} KB)`);
}

function copyFileSafe(src, dest) {
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    const kb = (fs.statSync(dest).size / 1024).toFixed(1);
    console.log(`  ✓ Organizado: ${path.relative(ROOT_DIR, dest)} (${kb} KB)`);
    return true;
  }
  return false;
}

async function main() {
  const server = await startServer();
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  console.log('\n============================================================');
  console.log('🔍 INICIANDO AUDITORIA VISUAL COMPLETA DO ECOCITY');
  console.log('============================================================\n');

  const browser = await pw.chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const EVIDENCIAS = path.join(ROOT_DIR, 'docs', 'evidencias');

  // --------------------------------------------------------------------------
  // 1. SITE PRINCIPAL (Desktop, Notebook, Tablet, Mobile)
  // --------------------------------------------------------------------------
  console.log('\n[1/4] Capturando SITE PRINCIPAL em 4 resoluções...');

  // A. Desktop (1920 × 1080)
  const pageDesk = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await pageDesk.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await safeScreenshot(pageDesk, path.join(EVIDENCIAS, 'site-principal', 'desktop', '01-stand-tv-index.png'));

  await pageDesk.goto(`http://127.0.0.1:${PORT}/controle.html`, { waitUntil: 'domcontentloaded' });
  await pageDesk.evaluate(() => {
    const vid = document.getElementById('mobile-video-screen');
    const app = document.getElementById('mobile-app-layout');
    if (vid) vid.style.display = 'none';
    if (app) app.style.display = 'flex';
  });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageDesk, path.join(EVIDENCIAS, 'site-principal', 'desktop', '02-controle-touch.png'));

  await pageDesk.goto(`http://127.0.0.1:${PORT}/prototipos/galeria-screenshots/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await safeScreenshot(pageDesk, path.join(EVIDENCIAS, 'site-principal', 'desktop', '03-galeria-hub.png'));
  await pageDesk.close();

  // B. Notebook (1366 × 768)
  const pageNote = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await pageNote.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageNote, path.join(EVIDENCIAS, 'site-principal', 'desktop', '04-stand-tv-notebook-1366x768.png'));
  await pageNote.close();

  // C. Tablet (768 × 1024)
  const pageTab = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await pageTab.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageTab, path.join(EVIDENCIAS, 'site-principal', 'tablet', '01-stand-tv-tablet.png'));

  await pageTab.goto(`http://127.0.0.1:${PORT}/controle.html`, { waitUntil: 'domcontentloaded' });
  await pageTab.evaluate(() => {
    const vid = document.getElementById('mobile-video-screen');
    const app = document.getElementById('mobile-app-layout');
    if (vid) vid.style.display = 'none';
    if (app) app.style.display = 'flex';
  });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageTab, path.join(EVIDENCIAS, 'site-principal', 'tablet', '02-controle-tablet.png'));

  await pageTab.goto(`http://127.0.0.1:${PORT}/prototipos/galeria-screenshots/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageTab, path.join(EVIDENCIAS, 'site-principal', 'tablet', '03-galeria-tablet.png'));
  await pageTab.close();

  // D. Mobile (390 × 844)
  const pageMob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await pageMob.goto(`http://127.0.0.1:${PORT}/controle.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await safeScreenshot(pageMob, path.join(EVIDENCIAS, 'site-principal', 'mobile', '01-controle-mobile-video.png'));

  await pageMob.evaluate(() => {
    const vid = document.getElementById('mobile-video-screen');
    const app = document.getElementById('mobile-app-layout');
    if (vid) vid.style.display = 'none';
    if (app) app.style.display = 'flex';
  });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageMob, path.join(EVIDENCIAS, 'site-principal', 'mobile', '02-controle-mobile-touch.png'));

  await pageMob.evaluate(() => {
    const app = document.getElementById('mobile-app-layout');
    const q = document.getElementById('mobile-queue-screen');
    if (app) app.style.display = 'none';
    if (q) q.style.display = 'flex';
  });
  await new Promise(r => setTimeout(r, 600));
  await safeScreenshot(pageMob, path.join(EVIDENCIAS, 'site-principal', 'mobile', '03-controle-mobile-fila-espera.png'));

  await pageMob.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageMob, path.join(EVIDENCIAS, 'site-principal', 'mobile', '04-index-mobile.png'));
  await pageMob.close();

  // --------------------------------------------------------------------------
  // 2. SITE DE INFORMAÇÕES / PAINEL AMBIENTAL / MAPA / SIMULADOR
  // --------------------------------------------------------------------------
  console.log('\n[2/4] Capturando SITE DE INFORMAÇÕES e PROTÓTIPOS AMBIENTAIS...');

  // A. Desktop (1920 × 1080)
  const pageInfoDesk = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await pageInfoDesk.goto(`http://127.0.0.1:${PORT}/prototipos/02-painel-ambiental/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));
  await safeScreenshot(pageInfoDesk, path.join(EVIDENCIAS, 'site-informacoes', 'desktop', '01-painel-ambiental-tema-escuro.png'));

  await pageInfoDesk.goto(`http://127.0.0.1:${PORT}/prototipos/01-mapa-parque/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));
  await safeScreenshot(pageInfoDesk, path.join(EVIDENCIAS, 'site-informacoes', 'desktop', '02-mapa-interativo-2d-completo.png'));

  await pageInfoDesk.goto(`http://127.0.0.1:${PORT}/prototipos/03-simulador-drenagem/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));
  await safeScreenshot(pageInfoDesk, path.join(EVIDENCIAS, 'site-informacoes', 'desktop', '03-simulador-drenagem-cenario-chuva.png'));
  await pageInfoDesk.close();

  // B. Tablet (768 × 1024)
  const pageInfoTab = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await pageInfoTab.goto(`http://127.0.0.1:${PORT}/prototipos/02-painel-ambiental/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await safeScreenshot(pageInfoTab, path.join(EVIDENCIAS, 'site-informacoes', 'tablet', '01-painel-ambiental-tablet.png'));

  await pageInfoTab.goto(`http://127.0.0.1:${PORT}/prototipos/01-mapa-parque/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await safeScreenshot(pageInfoTab, path.join(EVIDENCIAS, 'site-informacoes', 'tablet', '02-mapa-interativo-2d-tablet.png'));

  await pageInfoTab.goto(`http://127.0.0.1:${PORT}/prototipos/03-simulador-drenagem/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await safeScreenshot(pageInfoTab, path.join(EVIDENCIAS, 'site-informacoes', 'tablet', '03-simulador-drenagem-tablet.png'));
  await pageInfoTab.close();

  // C. Mobile (390 × 844)
  const pageInfoMob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await pageInfoMob.goto(`http://127.0.0.1:${PORT}/prototipos/02-painel-ambiental/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await safeScreenshot(pageInfoMob, path.join(EVIDENCIAS, 'site-informacoes', 'mobile', '01-painel-ambiental-mobile.png'));

  await pageInfoMob.goto(`http://127.0.0.1:${PORT}/prototipos/01-mapa-parque/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await safeScreenshot(pageInfoMob, path.join(EVIDENCIAS, 'site-informacoes', 'mobile', '02-mapa-interativo-2d-mobile.png'));

  await pageInfoMob.goto(`http://127.0.0.1:${PORT}/prototipos/03-simulador-drenagem/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await safeScreenshot(pageInfoMob, path.join(EVIDENCIAS, 'site-informacoes', 'mobile', '03-simulador-drenagem-mobile.png'));
  await pageInfoMob.close();

  // --------------------------------------------------------------------------
  // 3. RESPONSIVIDADE DO QUIZ (Notebook, Tablet, Mobile)
  // --------------------------------------------------------------------------
  console.log('\n[3/4] Capturando RESPONSIVIDADE DO QUIZ...');

  // Notebook (1366 × 768)
  const pageQuizNote = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await pageQuizNote.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await pageQuizNote.fill('#userNameInput', 'Profª Mariana');
  await pageQuizNote.click('#btnStartWelcome');
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageQuizNote, path.join(EVIDENCIAS, 'quiz', 'responsividade', '01-quiz-notebook-1366x768.png'));
  await pageQuizNote.close();

  // Tablet (768 × 1024)
  const pageQuizTab = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await pageQuizTab.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await pageQuizTab.fill('#userNameInput', 'Profª Mariana');
  await pageQuizTab.click('#btnStartWelcome');
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageQuizTab, path.join(EVIDENCIAS, 'quiz', 'responsividade', '02-quiz-tablet-768x1024.png'));
  await pageQuizTab.close();

  // Mobile (390 × 844)
  const pageQuizMob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await pageQuizMob.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await pageQuizMob.evaluate(() => {
    const input = document.getElementById('userNameInput');
    if (input) input.value = 'Profª Mariana';
    const btn = document.getElementById('btnStartWelcome');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageQuizMob, path.join(EVIDENCIAS, 'quiz', 'responsividade', '03-quiz-mobile-390x844.png'));
  await pageQuizMob.close();

  await browser.close();
  server.close();

  // --------------------------------------------------------------------------
  // 4. ORGANIZAÇÃO CATEGÓRICA DE TODAS AS EVIDÊNCIAS NO REPOSITÓRIO
  // --------------------------------------------------------------------------
  console.log('\n[4/4] Organizando todas as evidências nas subpastas oficiais...');

  const Q_DEP = path.join(EVIDENCIAS, 'quiz', 'depois');
  const D3_DEP = path.join(EVIDENCIAS, 'prototipo-3d', 'depois');
  const SCREENSHOTS = path.join(ROOT_DIR, 'screenshots');

  // Quiz — Cadastro
  copyFileSafe(path.join(Q_DEP, '01-quiz-cadastro-boas-vindas.png'), path.join(EVIDENCIAS, 'quiz', 'cadastro', '01-quiz-boas-vindas-desktop.png'));
  copyFileSafe(path.join(SCREENSHOTS, 'apresentacao', '02-stand-tv-quiz-boas-vindas.png'), path.join(EVIDENCIAS, 'quiz', 'cadastro', '02-quiz-selecao-avatar.png'));
  copyFileSafe(path.join(EVIDENCIAS, 'site-principal', 'mobile', '04-index-mobile.png'), path.join(EVIDENCIAS, 'quiz', 'cadastro', '03-quiz-cadastro-mobile.png'));

  // Quiz — Hub
  copyFileSafe(path.join(Q_DEP, '02-quiz-hub-selecao-modos.png'), path.join(EVIDENCIAS, 'quiz', 'hub', '01-quiz-hub-modos-desktop.png'));
  copyFileSafe(path.join(SCREENSHOTS, 'apresentacao', '04-quiz-hub-selecao.png'), path.join(EVIDENCIAS, 'quiz', 'hub', '02-quiz-hub-modo-sustentabilidade.png'));
  copyFileSafe(path.join(EVIDENCIAS, 'quiz', 'responsividade', '02-quiz-tablet-768x1024.png'), path.join(EVIDENCIAS, 'quiz', 'hub', '03-quiz-hub-modo-professor-areas.png'));
  copyFileSafe(path.join(EVIDENCIAS, 'quiz', 'responsividade', '03-quiz-mobile-390x844.png'), path.join(EVIDENCIAS, 'quiz', 'hub', '04-quiz-hub-mobile.png'));

  // Quiz — Perguntas
  copyFileSafe(path.join(Q_DEP, '03-quiz-gameplay-interface.png'), path.join(EVIDENCIAS, 'quiz', 'perguntas', '01-quiz-gameplay-pergunta-hud.png'));
  copyFileSafe(path.join(Q_DEP, '04-quiz-feedback-pedagogico.png'), path.join(EVIDENCIAS, 'quiz', 'perguntas', '02-quiz-feedback-resposta-correta.png'));
  copyFileSafe(path.join(SCREENSHOTS, 'apresentacao', '06-quiz-feedback-pedagogico.png'), path.join(EVIDENCIAS, 'quiz', 'perguntas', '03-quiz-feedback-resposta-incorreta.png'));
  copyFileSafe(path.join(SCREENSHOTS, 'apresentacao', '05-quiz-gameplay-pergunta.png'), path.join(EVIDENCIAS, 'quiz', 'perguntas', '04-quiz-gameplay-mobile.png'));

  // Quiz — Resultados
  copyFileSafe(path.join(Q_DEP, '05-quiz-boletim-nota-final.png'), path.join(EVIDENCIAS, 'quiz', 'resultados', '01-quiz-boletim-desempenho-completo.png'));
  copyFileSafe(path.join(SCREENSHOTS, 'apresentacao', '07-quiz-boletim-resultados.png'), path.join(EVIDENCIAS, 'quiz', 'resultados', '02-quiz-boletim-metricas.png'));
  copyFileSafe(path.join(Q_DEP, '08-grande-grafico-comparativo-feira.png'), path.join(EVIDENCIAS, 'quiz', 'resultados', '03-quiz-boletim-breakdown-areas.png'));

  // Quiz — Recompensas
  copyFileSafe(path.join(Q_DEP, '05-quiz-boletim-nota-final.png'), path.join(EVIDENCIAS, 'quiz', 'recompensas', '01-quiz-recompensas-selo-mestre.png'));
  copyFileSafe(path.join(Q_DEP, '09-ranking-global-podio-filtros.png'), path.join(EVIDENCIAS, 'quiz', 'recompensas', '02-quiz-recompensas-podio-coroas.png'));
  copyFileSafe(path.join(Q_DEP, '11-quiz-historico-partidas.png'), path.join(EVIDENCIAS, 'quiz', 'recompensas', '03-quiz-historico-conquistas.png'));

  // Quiz — Gráficos
  copyFileSafe(path.join(Q_DEP, '06-grande-grafico-radar-competencias.png'), path.join(EVIDENCIAS, 'quiz', 'graficos', '01-grande-grafico-radar-competencias.png'));
  copyFileSafe(path.join(Q_DEP, '07-grande-grafico-curva-evolucao.png'), path.join(EVIDENCIAS, 'quiz', 'graficos', '02-grande-grafico-curva-evolucao.png'));
  copyFileSafe(path.join(Q_DEP, '08-grande-grafico-comparativo-feira.png'), path.join(EVIDENCIAS, 'quiz', 'graficos', '03-grande-grafico-comparativo-feira.png'));

  // Quiz — Ranking
  copyFileSafe(path.join(Q_DEP, '09-ranking-global-podio-filtros.png'), path.join(EVIDENCIAS, 'quiz', 'ranking', '01-ranking-modal-podio-filtros.png'));
  copyFileSafe(path.join(SCREENSHOTS, 'apresentacao', '08-quiz-ranking-geral.png'), path.join(EVIDENCIAS, 'quiz', 'ranking', '02-ranking-modal-tabela-classificacao.png'));
  copyFileSafe(path.join(Q_DEP, '10-telao-tv-ranking-oficial-monumental.png'), path.join(EVIDENCIAS, 'quiz', 'ranking', '03-telao-tv-ranking-oficial-monumental.png'));

  // 3D — Vistas Gerais
  const D3_DIR = path.join(EVIDENCIAS, '3d', 'depois');
  copyFileSafe(path.join(D3_DIR, '01-vista-aerea-geral.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'vistas-gerais', '01-parque-vista-aerea-completa.png'));
  copyFileSafe(path.join(D3_DIR, '02-perspectiva-obliqua.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'vistas-gerais', '02-parque-perspectiva-obliqua-panoramica.png'));
  copyFileSafe(path.join(SCREENSHOTS, '3d', '13-planta-geral-sem-vegetacao.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'vistas-gerais', '03-parque-implantacao-zenital.png'));

  // 3D — Torres
  copyFileSafe(path.join(D3_DIR, '03-super-torres-nebulizacao.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'torres', '01-parque-super-torres-diagrid.png'));
  copyFileSafe(path.join(SCREENSHOTS, 'detalhes', '05-detalhe-bicos-aspersores-torre.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'torres', '02-parque-torre-central-47m.png'));
  copyFileSafe(path.join(D3_DIR, '03-super-torres-nebulizacao.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'torres', '03-parque-torres-nevoa-microclima.png'));

  // 3D — Passarelas
  copyFileSafe(path.join(D3_DIR, '04-passarelas-e-mirantes.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'passarelas', '01-parque-passarelas-elevadas.png'));
  copyFileSafe(path.join(SCREENSHOTS, '3d', '04-passarelas-e-mirantes.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'passarelas', '02-parque-mirantes-e-guarda-corpos.png'));

  // 3D — Vegetação
  copyFileSafe(path.join(D3_DIR, '11-bosque-mata-atlantica.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'vegetacao', '01-parque-bosque-mata-atlantica.png'));
  copyFileSafe(path.join(SCREENSHOTS, '3d', '11-bosque-mata-atlantica.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'vegetacao', '02-parque-palmeiras-imperiais.png'));

  // 3D — Ambientes
  copyFileSafe(path.join(D3_DIR, '05-lago-espelho-dagua.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'ambientes', '01-parque-lago-bacia-amortecimento.png'));
  copyFileSafe(path.join(D3_DIR, '06-nave-do-conhecimento.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'ambientes', '02-parque-nave-do-conhecimento.png'));
  copyFileSafe(path.join(D3_DIR, '07-praca-do-mercado.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'ambientes', '03-parque-praca-do-mercado.png'));
  copyFileSafe(path.join(D3_DIR, '08-anfiteatro-susana-naspolini.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'ambientes', '04-parque-anfiteatro-susana-naspolini.png'));
  copyFileSafe(path.join(D3_DIR, '09-skatepark-bowls.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'ambientes', '05-parque-skatepark-bowls.png'));
  copyFileSafe(path.join(D3_DIR, '10-campo-e-quadras.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'ambientes', '06-parque-campo-society-e-quadras.png'));
  copyFileSafe(path.join(SCREENSHOTS, '3d', '12-acesso-norte-portal.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'ambientes', '07-parque-acesso-norte-portal.png'));

  // 3D — Personagens
  copyFileSafe(path.join(D3_DIR, '12-personagem-halo-terceira-pessoa.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'personagens', '01-parque-personagem-halo-terceira-pessoa.png'));
  copyFileSafe(path.join(SCREENSHOTS, 'interfaces', '12-gemeo-3d-personagem-halo.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'personagens', '02-parque-npcs-educadores-ambientais.png'));

  // 3D — Missões
  copyFileSafe(path.join(D3_DIR, '15-hud-cinco-missoes-interativas.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'missoes', '01-parque-hud-cinco-missoes.png'));
  copyFileSafe(path.join(SCREENSHOTS, 'interfaces', '11-gemeo-3d-hud-missoes.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'missoes', '02-parque-missao-beacons-no-solo.png'));

  // 3D — Responsividade
  copyFileSafe(path.join(D3_DIR, '13-stand-tv-layout-qrcode.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'responsividade', '01-parque-desktop-tv-qrcode-1920x1080.png'));
  copyFileSafe(path.join(SCREENSHOTS, 'interfaces', '03-painel-gemeo-digital-3d.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'responsividade', '02-parque-notebook-1366x768.png'));
  copyFileSafe(path.join(D3_DIR, '02-perspectiva-obliqua.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'responsividade', '03-parque-tablet-768x1024.png'));
  copyFileSafe(path.join(D3_DIR, '14-mobile-3d-joystick-touch.png'), path.join(EVIDENCIAS, 'prototipo-3d', 'responsividade', '04-parque-mobile-joystick-touch-390x844.png'));

  console.log('\n============================================================');
  console.log('✨ AUDITORIA VISUAL E ORGANIZAÇÃO CONCLUÍDAS COM SUCESSO!');
  console.log('============================================================');
}

main().catch(err => {
  console.error('Erro na auditoria:', err);
  process.exit(1);
});
