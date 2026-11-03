/**
 * CAPTURADOR DE EVIDÊNCIAS "DEPOIS" — PROJETO V.I.D.A. / ECOCITY 2026
 * Conclusão das capturas mobile 3D e interfaces de Quiz, Gráficos e Telão TV
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const pw = require('../parque-realengo-3d/node_modules/playwright');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_3D = path.resolve(ROOT_DIR, 'parque-realengo-3d', 'dist');
const PORT = 3099;

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
      if (fs.existsSync(RANKING_FILE)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(fs.readFileSync(RANKING_FILE, 'utf8'));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('[]');
      return;
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
    console.log(`[Servidor] Ativo em http://127.0.0.1:${PORT}`);
    resolve(server);
  }));
}

function saveBuffer(filePath, buffer) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  const kb = (buffer.length / 1024).toFixed(1);
  console.log(`  ✓ Salvo: ${path.relative(ROOT_DIR, filePath)} (${kb} KB)`);
}

async function safeScreenshot(page, filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const buffer = await page.screenshot({ animations: 'disabled' });
  fs.writeFileSync(filePath, buffer);
  const kb = (buffer.length / 1024).toFixed(1);
  console.log(`  ✓ Salvo: ${path.relative(ROOT_DIR, filePath)} (${kb} KB)`);
}

async function main() {
  const server = await startServer();
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const DIR_3D_DEPOIS = path.join(ROOT_DIR, 'docs', 'evidencias', '3d', 'depois');
  const DIR_QUIZ_DEPOIS = path.join(ROOT_DIR, 'docs', 'evidencias', 'quiz', 'depois');

  console.log('\n============================================================');
  console.log('📱 CAPTURANDO 3D MOBILE & PLATAFORMA DE QUIZ (DEPOIS)');
  console.log('============================================================\n');

  // 1. Mobile 3D com Joystick
  console.log('📱 [1/2] Capturando Gêmeo 3D Mobile (390x844)...');
  const browserMobile = await pw.chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader'
    ]
  });

  const pageMobile = await browserMobile.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true
  });

  await pageMobile.goto(`http://127.0.0.1:${PORT}/parque3d/?mode=mobile`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));
  await safeScreenshot(pageMobile, path.join(DIR_3D_DEPOIS, '14-mobile-3d-joystick-touch.png'));
  await browserMobile.close();

  // 2. Plataforma de Quiz e Grande Gráfico de Desempenho
  console.log('\n🎓 [2/2] Capturando Plataforma de Quiz e Grande Gráfico de Desempenho (1920x1080)...');
  const browserUI = await pw.chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const pageQuiz = await browserUI.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  // A. Tela de Boas-vindas e Cadastro (Nome e Avatar)
  await pageQuiz.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await pageQuiz.evaluate(() => {
    localStorage.removeItem('vida_quiz_user');
  });
  await pageQuiz.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEPOIS, '01-quiz-cadastro-boas-vindas.png'));

  // B. Preencher cadastro e abrir Hub
  await pageQuiz.fill('#userNameInput', 'Profª Helena');
  const avatarEl = await pageQuiz.$('.avatar-card');
  if (avatarEl) await avatarEl.click();
  await pageQuiz.click('#btnStartWelcome');
  await new Promise(r => setTimeout(r, 800));

  await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEPOIS, '02-quiz-hub-selecao-modos.png'));

  // C. Iniciar Gameplay
  await pageQuiz.click('#btnLaunchSustentabilidade');
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEPOIS, '03-quiz-gameplay-interface.png'));

  // D. Feedback Pedagógico Imediato
  await pageQuiz.click('#optionsContainer .option-btn:nth-child(1)');
  await new Promise(r => setTimeout(r, 600));
  await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEPOIS, '04-quiz-feedback-pedagogico.png'));

  // E. Boletim de Desempenho
  await pageQuiz.evaluate(() => {
    if (window.QUIZ_ENGINE) {
      window.QUIZ_ENGINE.showView('resultsView');
      const scoreNum = document.getElementById('resultsScoreNumber');
      if (scoreNum) scoreNum.textContent = '10.0';
      if (window.QUIZ_ENGINE.renderBigPerformanceChart) {
        window.QUIZ_ENGINE.renderBigPerformanceChart('radar');
      }
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEPOIS, '05-quiz-boletim-nota-final.png'));

  // F. O Grande Gráfico de Desempenho — Radar Pentagonal
  const tabRadar = await pageQuiz.$('[data-chart="radar"]');
  if (tabRadar) await tabRadar.click();
  await new Promise(r => setTimeout(r, 600));
  await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEPOIS, '06-grande-grafico-radar-competencias.png'));

  // G. O Grande Gráfico de Desempenho — Curva de Evolução
  const tabEvol = await pageQuiz.$('[data-chart="evolution"]');
  if (tabEvol) await tabEvol.click();
  await new Promise(r => setTimeout(r, 600));
  await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEPOIS, '07-grande-grafico-curva-evolucao.png'));

  // H. O Grande Gráfico de Desempenho — Comparativo da Feira
  const tabBench = await pageQuiz.$('[data-chart="benchmark"]');
  if (tabBench) await tabBench.click();
  await new Promise(r => setTimeout(r, 600));
  await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEPOIS, '08-grande-grafico-comparativo-feira.png'));

  // I. Modal de Ranking Geral com Pódio Triplo
  await pageQuiz.evaluate(() => {
    if (window.QUIZ_ENGINE) window.QUIZ_ENGINE.openRankingModal();
  });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEPOIS, '09-ranking-global-podio-filtros.png'));

  // J. Modo Telão TV do Ranking Oficial Monumental (1920x1080)
  await pageQuiz.evaluate(() => {
    const modal = document.getElementById('rankingModal');
    if (modal) modal.classList.remove('active');
    if (window.QUIZ_ENGINE) window.QUIZ_ENGINE.showTvRankingView();
  });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEPOIS, '10-telao-tv-ranking-oficial-monumental.png'));

  // K. Histórico de Partidas
  await pageQuiz.evaluate(() => {
    if (window.QUIZ_ENGINE) {
      window.QUIZ_ENGINE.showView('hubView');
      window.QUIZ_ENGINE.openHistoryModal();
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEPOIS, '11-quiz-historico-partidas.png'));

  await browserUI.close();
  server.close();
  console.log('\n✨ Todas as evidências "DEPOIS" concluídas e salvas com sucesso!');
}

main().catch(err => {
  console.error('Erro na captura:', err);
  process.exit(1);
});
