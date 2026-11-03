/**
 * CAPTURADOR AUTOMÁTICO DE SCREENSHOTS — PROJETO V.I.D.A.
 * Parque Realengo Jornalista Susana Naspolini
 * 
 * Executa uma captura real em alta fidelidade de todos os ambientes:
 * - 3D: Vistas gerais, torres, passarelas, lago, nave, mercado, anfiteatro, skatepark, esportes, mata atlântica.
 * - Interfaces: Central V.I.D.A., Controle Mobile, Gêmeo Digital 3D, Mapa 2D, Simulador Hidrológico, Galeria.
 * - Apresentação: Vídeo oficial em tela cheia, Quiz Ambiental Solaris, fila de espera/lock.
 * - Detalhes: Close-ups de Splash Pad, quadras de areia, tabelas de basquete, quiosques, bicos de névoa.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const pw = require('./parque-realengo-3d/node_modules/playwright');

const ROOT_DIR = path.resolve(__dirname);
const DIST_3D = path.resolve(ROOT_DIR, 'parque-realengo-3d', 'dist');
const PORT = 3097;

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

function startStaticServer() {
  const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);

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

function saveBase64Image(filePath, base64Data) {
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buf = Buffer.from(cleanBase64, 'base64');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buf);
  const kb = (buf.length / 1024).toFixed(1);
  console.log(`  ✓ Salvo: ${path.relative(ROOT_DIR, filePath)} (${kb} KB)`);
  return buf.length;
}

async function safeScreenshot(page, filePath, options = {}) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const buffer = await page.screenshot(options);
    fs.writeFileSync(filePath, buffer);
    return buffer.length;
  } catch (err) {
    console.warn(`  ⚠️ Tentando salvar novamente ${path.basename(filePath)}...`);
    await new Promise(r => setTimeout(r, 600));
    const buffer = await page.screenshot(options);
    fs.writeFileSync(filePath, buffer);
    return buffer.length;
  }
}

async function captureAll(forceRecreate = false) {
  const startTime = Date.now();
  console.log('================================================================');
  console.log('  CENTRAL AUTOMÁTICA DE CAPTURA DE SCREENSHOTS — PROJETO V.I.D.A.');
  console.log('================================================================\n');

  const server = await startStaticServer();
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const summary = {
    '3d': [],
    'interfaces': [],
    'apresentacao': [],
    'detalhes': []
  };

  try {
    // ------------------------------------------------------------------------
    // PARTE 1 & 2: 3D PURO E DETALHES (CANVAS 1440x900)
    // ------------------------------------------------------------------------
    const views3d = [
      { id: 'aerea-completa', file: '01-vista-aerea-geral.png', desc: 'Vista aérea completa (78.129 m², 25 vértices cadastrais OSM)' },
      { id: 'obliqua-geral', file: '02-perspectiva-obliqua.png', desc: 'Perspectiva panorâmica com super-torres e equipamentos' },
      { id: 'torres', file: '03-super-torres-nebulizacao.png', desc: 'As 5 Super-Torres (17m a 47m) e bicos de microclima' },
      { id: 'passarelas', file: '04-passarelas-e-mirantes.png', desc: 'Passarelas elevadas acessíveis e mirantes (rampas ≤ 8%)' },
      { id: 'agua', file: '05-lago-espelho-dagua.png', desc: 'Espelho d\'água de 1.300 m² e bacia de contenção pluvial' },
      { id: 'nave', file: '06-nave-do-conhecimento.png', desc: 'Nave do Conhecimento (pavilhão tecnológico comunitário de 830 m²)' },
      { id: 'mercado', file: '07-praca-do-mercado.png', desc: 'Praça do Mercado com 11 lojas (Messina | Rivas)' },
      { id: 'anfiteatro', file: '08-anfiteatro-susana-naspolini.png', desc: 'Anfiteatro Susana Naspolini e arquibancadas ao ar livre' },
      { id: 'skate', file: '09-skatepark-bowls.png', desc: 'Pista de skate com dois bowls de concreto e street' },
      { id: 'esportes', file: '10-campo-e-quadras.png', desc: 'Campo de futebol society sintético e quadras poliesportivas' },
      { id: 'paisagismo', file: '11-bosque-mata-atlantica.png', desc: 'Bosque nativo da Mata Atlântica e quadras de areia' },
      { id: 'entrada', file: '12-acesso-norte-portal.png', desc: 'Portal de acesso norte pela Rua Carlos Wenceslau' },
      { id: 'planta-geral', file: '13-planta-geral-sem-vegetacao.png', desc: 'Planta técnica zenital da implantação sem vegetação' },
      { id: 'expansao', file: '14-zona-expansao-fase2.png', desc: 'Zona de expansão futura (Fase 2, até 150 mil m²)' }
    ];

    const closeups = [
      { id: 'detalhe-splash-pad', file: '01-detalhe-splash-pad.png', desc: 'Splash Pad infantil com jatos d\'água dinâmicos e piso azul' },
      { id: 'detalhe-volei-areia', file: '02-detalhe-volei-areia-redes.png', desc: 'Quadras de vôlei de areia, textura de praia, postes e rede' },
      { id: 'detalhe-basquete', file: '03-detalhe-tabelas-basquete.png', desc: 'Tabelas de basquete com aro, rede e garrafão das quadras' },
      { id: 'detalhe-quiosques', file: '04-detalhe-quiosques-churrasqueira.png', desc: 'Quiosques de madeira com churrasqueiras e mesas comunitárias' },
      { id: 'detalhe-torre-aspersores', file: '05-detalhe-bicos-aspersores-torre.png', desc: 'Anel de climatização e bicos de microaspersão da Super-Torre 03' }
    ];

    // Verifica se os arquivos já foram gerados com sucesso
    const missing3d = views3d.filter(v => forceRecreate || !fs.existsSync(path.join(ROOT_DIR, 'screenshots', '3d', v.file)));
    const missingDetails = closeups.filter(c => forceRecreate || !fs.existsSync(path.join(ROOT_DIR, 'screenshots', 'detalhes', c.file)));

    if (missing3d.length > 0 || missingDetails.length > 0) {
      console.log('\n[1/3] Capturando Ambiente 3D e Detalhes do Parque Suzana Naspolini (1440 × 900)...');
      const browser3d = await pw.chromium.launch({
        executablePath: chromePath,
        headless: true,
        args: [
          '--enable-webgl',
          '--ignore-gpu-blocklist',
          '--use-gl=angle',
          '--use-angle=swiftshader',
          '--enable-unsafe-swiftshader',
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });

      const page3d = await browser3d.newPage({ viewport: { width: 1440, height: 900 } });
      await page3d.goto(`http://127.0.0.1:${PORT}/parque3d/?capture=1`, { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 3500));

      for (const v of missing3d) {
        await page3d.evaluate((viewId) => {
          if (window.__parkApi && window.__parkApi.goTo) {
            window.__parkApi.goTo(viewId, { instant: true });
          }
        }, v.id);
        await new Promise(r => setTimeout(r, 600));
        const dataUrl = await page3d.evaluate(() => {
          const c = document.querySelector('canvas');
          return c ? c.toDataURL('image/png') : null;
        });
        if (dataUrl) {
          const targetPath = path.join(ROOT_DIR, 'screenshots', '3d', v.file);
          saveBase64Image(targetPath, dataUrl);
        }
      }

      for (const c of missingDetails) {
        await page3d.evaluate((viewId) => {
          if (window.__parkApi && window.__parkApi.goTo) {
            window.__parkApi.goTo(viewId, { instant: true });
          }
        }, c.id);
        await new Promise(r => setTimeout(r, 600));
        const dataUrl = await page3d.evaluate(() => {
          const el = document.querySelector('canvas');
          return el ? el.toDataURL('image/png') : null;
        });
        if (dataUrl) {
          const targetPath = path.join(ROOT_DIR, 'screenshots', 'detalhes', c.file);
          saveBase64Image(targetPath, dataUrl);
        }
      }

      await browser3d.close();
    } else {
      console.log('\n[1/3] Imagens 3D e Detalhes já consolidados em screenshots/3d e screenshots/detalhes.');
    }

    // Registra no sumário
    views3d.forEach(v => {
      const p = path.join(ROOT_DIR, 'screenshots', '3d', v.file);
      if (fs.existsSync(p)) summary['3d'].push({ file: v.file, desc: v.desc, bytes: fs.statSync(p).size, res: '1440×900' });
    });
    closeups.forEach(c => {
      const p = path.join(ROOT_DIR, 'screenshots', 'detalhes', c.file);
      if (fs.existsSync(p)) summary['detalhes'].push({ file: c.file, desc: c.desc, bytes: fs.statSync(p).size, res: '1440×900' });
    });

    // ------------------------------------------------------------------------
    // PARTE 2: INTERFACES WEB E TELAS DE APRESENTAÇÃO
    // ------------------------------------------------------------------------
    console.log('\n[2/3] Capturando Interfaces Web e Telas de Apresentação...');
    const browserUI = await pw.chromium.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // 1. Central de Monitoramento Ambiental V.I.D.A. (1920x1080)
    const pagePainel = await browserUI.newPage({ viewport: { width: 1920, height: 1080 } });
    await pagePainel.goto(`http://127.0.0.1:${PORT}/prototipos/02-painel-ambiental/index.html`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1200));
    const painelPath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '01-central-monitoramento-vida.png');
    await safeScreenshot(pagePainel, painelPath);
    summary['interfaces'].push({
      file: '01-central-monitoramento-vida.png',
      desc: 'Central V.I.D.A. — Dashboard de Indicadores Ambientais em 1920×1080',
      bytes: fs.statSync(painelPath).size,
      res: '1920×1080'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/01-central-monitoramento-vida.png`);
    await pagePainel.close();

    // 2. Controle Mobile do Visitante (390x844)
    const pageMobile = await browserUI.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    await pageMobile.goto(`http://127.0.0.1:${PORT}/controle.html`, { waitUntil: 'domcontentloaded' });
    await pageMobile.evaluate(() => {
      const vid = document.getElementById('mobile-video-screen');
      const app = document.getElementById('mobile-app-layout');
      if (vid) vid.style.display = 'none';
      if (app) app.style.display = 'flex';
    });
    await new Promise(r => setTimeout(r, 1000));
    const mobilePath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '02-controle-mobile-390x844.png');
    await safeScreenshot(pageMobile, mobilePath);
    summary['interfaces'].push({
      file: '02-controle-mobile-390x844.png',
      desc: 'Controle Remoto Touch do Visitante (Layout Mobile 390×844)',
      bytes: fs.statSync(mobilePath).size,
      res: '390×844'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/02-controle-mobile-390x844.png`);

    // 2.1 Gêmeo Digital 3D no Celular com Virtual Joystick Analógico e Dock de Ações
    const pageMobile3d = await browserUI.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pageMobile3d.goto(`http://127.0.0.1:${PORT}/parque3d/?mode=mobile`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));
    const mobile3dPath = path.join(ROOT_DIR, 'docs', 'evidencias', '3d', 'depois', '14-mobile-3d-joystick-touch.png');
    await safeScreenshot(pageMobile3d, mobile3dPath);
    console.log(`  ✓ Salvo: docs/evidencias/3d/depois/14-mobile-3d-joystick-touch.png`);
    await pageMobile3d.close();

    // 3. Vídeo de Apresentação no Mobile
    await pageMobile.evaluate(() => {
      const vid = document.getElementById('mobile-video-screen');
      const app = document.getElementById('mobile-app-layout');
      if (vid) vid.style.display = 'block';
      if (app) app.style.display = 'none';
    });
    await new Promise(r => setTimeout(r, 600));
    const videoMobilePath = path.join(ROOT_DIR, 'screenshots', 'apresentacao', '01-video-oficial-intro-mobile.png');
    await safeScreenshot(pageMobile, videoMobilePath);
    summary['apresentacao'].push({
      file: '01-video-oficial-intro-mobile.png',
      desc: 'Vídeo oficial obrigatório em tela cheia no celular do visitante',
      bytes: fs.statSync(videoMobilePath).size,
      res: '390×844'
    });
    console.log(`  ✓ Salvo: screenshots/apresentacao/01-video-oficial-intro-mobile.png`);

    // 4. Fila de Espera / Visitor Lock
    await pageMobile.evaluate(() => {
      const q = document.getElementById('mobile-queue-screen');
      const vid = document.getElementById('mobile-video-screen');
      const app = document.getElementById('mobile-app-layout');
      if (q) q.style.display = 'flex';
      if (vid) vid.style.display = 'none';
      if (app) app.style.display = 'none';
    });
    await new Promise(r => setTimeout(r, 600));
    const queuePath = path.join(ROOT_DIR, 'screenshots', 'apresentacao', '03-fila-espera-visitante.png');
    await safeScreenshot(pageMobile, queuePath);
    summary['apresentacao'].push({
      file: '03-fila-espera-visitante.png',
      desc: 'Tela de fila de espera com bloqueio de visitante ativo',
      bytes: fs.statSync(queuePath).size,
      res: '390×844'
    });
    console.log(`  ✓ Salvo: screenshots/apresentacao/03-fila-espera-visitante.png`);
    await pageMobile.close();

    // 5. Mapa Interativo 2D (1920x1080)
    const pageMapa = await browserUI.newPage({ viewport: { width: 1920, height: 1080 } });
    await pageMapa.goto(`http://127.0.0.1:${PORT}/prototipos/01-mapa-parque/index.html`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    const mapaPath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '04-mapa-interativo-2d.png');
    await safeScreenshot(pageMapa, mapaPath);
    summary['interfaces'].push({
      file: '04-mapa-interativo-2d.png',
      desc: 'Mapa Interativo 2D do Parque com POIs e categorias',
      bytes: fs.statSync(mapaPath).size,
      res: '1920×1080'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/04-mapa-interativo-2d.png`);
    await pageMapa.close();

    // 6. Simulador de Drenagem e Enchentes (1920x1080)
    const pageSim = await browserUI.newPage({ viewport: { width: 1920, height: 1080 } });
    await pageSim.goto(`http://127.0.0.1:${PORT}/prototipos/03-simulador-drenagem/index.html`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    const simPath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '05-simulador-drenagem-interativo.png');
    await safeScreenshot(pageSim, simPath);
    summary['interfaces'].push({
      file: '05-simulador-drenagem-interativo.png',
      desc: 'Simulador de Drenagem e Enchentes com controles de chuva',
      bytes: fs.statSync(simPath).size,
      res: '1920×1080'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/05-simulador-drenagem-interativo.png`);
    await pageSim.close();

    // 7. Galeria de Screenshots Hub (1920x1080)
    const pageGaleria = await browserUI.newPage({ viewport: { width: 1920, height: 1080 } });
    await pageGaleria.goto(`http://127.0.0.1:${PORT}/prototipos/galeria-screenshots/index.html`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    const galeriaPath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '06-galeria-screenshots-hub.png');
    await safeScreenshot(pageGaleria, galeriaPath);
    summary['interfaces'].push({
      file: '06-galeria-screenshots-hub.png',
      desc: 'Central e galeria visual dos protótipos',
      bytes: fs.statSync(galeriaPath).size,
      res: '1920×1080'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/06-galeria-screenshots-hub.png`);
    await pageGaleria.close();

    // 8. Plataforma Educativa V.I.D.A. — Boas-vindas e Cadastro Simplificado (1920x1080)
    const pageQuiz = await browserUI.newPage({ viewport: { width: 1920, height: 1080 } });
    await pageQuiz.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));

    // A. Boas-vindas
    const quizWelcomePath = path.join(ROOT_DIR, 'screenshots', 'apresentacao', '02-stand-tv-quiz-boas-vindas.png');
    await safeScreenshot(pageQuiz, quizWelcomePath);
    summary['apresentacao'].push({
      file: '02-stand-tv-quiz-boas-vindas.png',
      desc: 'Plataforma V.I.D.A. — Boas-vindas e Cadastro Simplificado com Avatar',
      bytes: fs.statSync(quizWelcomePath).size,
      res: '1920×1080'
    });
    console.log(`  ✓ Salvo: screenshots/apresentacao/02-stand-tv-quiz-boas-vindas.png`);

    // B. Preencher nome e ir para o Hub
    await pageQuiz.fill('#userNameInput', 'Profª Mariana');
    await pageQuiz.click('#btnStartWelcome');
    await new Promise(r => setTimeout(r, 600));

    const quizHubPath = path.join(ROOT_DIR, 'screenshots', 'apresentacao', '04-quiz-hub-selecao.png');
    await safeScreenshot(pageQuiz, quizHubPath);
    summary['apresentacao'].push({
      file: '04-quiz-hub-selecao.png',
      desc: 'Hub de Seleção de Modalidade (Sustentabilidade vs Modo Professor/Profissional)',
      bytes: fs.statSync(quizHubPath).size,
      res: '1920×1080'
    });
    console.log(`  ✓ Salvo: screenshots/apresentacao/04-quiz-hub-selecao.png`);

    // C. Iniciar Quiz e Capturar Pergunta com HUD
    await pageQuiz.click('#btnLaunchSustentabilidade');
    await new Promise(r => setTimeout(r, 600));

    const quizQuestionPath = path.join(ROOT_DIR, 'screenshots', 'apresentacao', '05-quiz-gameplay-pergunta.png');
    await safeScreenshot(pageQuiz, quizQuestionPath);
    summary['apresentacao'].push({
      file: '05-quiz-gameplay-pergunta.png',
      desc: 'HUD do Quiz — Temporizador, barra fluida, pergunta e alternativas',
      bytes: fs.statSync(quizQuestionPath).size,
      res: '1920×1080'
    });
    console.log(`  ✓ Salvo: screenshots/apresentacao/05-quiz-gameplay-pergunta.png`);

    // D. Responder questão e capturar Feedback Pedagógico
    await pageQuiz.click('#optionsContainer .option-btn:nth-child(1)');
    await new Promise(r => setTimeout(r, 600));

    const quizFeedbackPath = path.join(ROOT_DIR, 'screenshots', 'apresentacao', '06-quiz-feedback-pedagogico.png');
    await safeScreenshot(pageQuiz, quizFeedbackPath);
    summary['apresentacao'].push({
      file: '06-quiz-feedback-pedagogico.png',
      desc: 'Feedback Pedagógico Imediato com Fundamentação Científica',
      bytes: fs.statSync(quizFeedbackPath).size,
      res: '1920×1080'
    });
    console.log(`  ✓ Salvo: screenshots/apresentacao/06-quiz-feedback-pedagogico.png`);

    // E. Simular término e capturar Boletim com Nota de 0 a 10
    await pageQuiz.evaluate(() => {
      const g = window.QUIZ_ENGINE.getCurrentGame();
      g.score = 19;
      g.totalQuestions = 20;
      g.currentIndex = 19;
      document.getElementById('btnNextQuestion').click();
    });
    await new Promise(r => setTimeout(r, 800));

    const quizResultPath = path.join(ROOT_DIR, 'screenshots', 'apresentacao', '07-quiz-boletim-resultados.png');
    await safeScreenshot(pageQuiz, quizResultPath);
    summary['apresentacao'].push({
      file: '07-quiz-boletim-resultados.png',
      desc: 'Boletim de Desempenho com Nota Oficial (0 a 10), Selo de Mestre e Breakdown',
      bytes: fs.statSync(quizResultPath).size,
      res: '1920×1080'
    });
    console.log(`  ✓ Salvo: screenshots/apresentacao/07-quiz-boletim-resultados.png`);

    // E.1 Grande Gráfico de Desempenho (Radar Pentagonal, Curva de Evolução e Benchmark)
    const DIR_QUIZ_DEP = path.join(ROOT_DIR, 'docs', 'evidencias', 'quiz', 'depois');
    fs.mkdirSync(DIR_QUIZ_DEP, { recursive: true });

    const btnTabRadar = await pageQuiz.$('[data-chart="radar"]');
    if (btnTabRadar) {
      await btnTabRadar.click();
      await new Promise(r => setTimeout(r, 400));
      await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEP, '06-grande-grafico-radar-competencias.png'));
    }

    const btnTabEvol = await pageQuiz.$('[data-chart="evolution"]');
    if (btnTabEvol) {
      await btnTabEvol.click();
      await new Promise(r => setTimeout(r, 400));
      await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEP, '07-grande-grafico-curva-evolucao.png'));
    }

    const btnTabBench = await pageQuiz.$('[data-chart="benchmark"]');
    if (btnTabBench) {
      await btnTabBench.click();
      await new Promise(r => setTimeout(r, 400));
      await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEP, '08-grande-grafico-comparativo-feira.png'));
    }

    // F. Modal de Ranking Geral com Pódio
    await pageQuiz.click('#btnResultsRanking');
    await new Promise(r => setTimeout(r, 600));

    const quizRankingPath = path.join(ROOT_DIR, 'screenshots', 'apresentacao', '08-quiz-ranking-geral.png');
    await safeScreenshot(pageQuiz, quizRankingPath);
    summary['apresentacao'].push({
      file: '08-quiz-ranking-geral.png',
      desc: 'Ranking Oficial da Feira com Pódio Triplo (1º, 2º e 3º) e Classificação',
      bytes: fs.statSync(quizRankingPath).size,
      res: '1920×1080'
    });
    console.log(`  ✓ Salvo: screenshots/apresentacao/08-quiz-ranking-geral.png`);
    await pageQuiz.click('#btnCloseRanking');
    await new Promise(r => setTimeout(r, 300));

    // F.1 Modo Telão TV do Ranking Oficial Monumental
    await pageQuiz.evaluate(() => {
      if (window.QUIZ_ENGINE) window.QUIZ_ENGINE.showTvRankingView();
    });
    await new Promise(r => setTimeout(r, 800));
    await safeScreenshot(pageQuiz, path.join(DIR_QUIZ_DEP, '10-telao-tv-ranking-oficial-monumental.png'));
    console.log(`  ✓ Salvo: docs/evidencias/quiz/depois/10-telao-tv-ranking-oficial-monumental.png`);

    // G. Modal de Histórico de Partidas
    await pageQuiz.evaluate(() => {
      if (window.QUIZ_ENGINE) {
        window.QUIZ_ENGINE.showView('hubView');
        window.QUIZ_ENGINE.openHistoryModal();
      }
    });
    await new Promise(r => setTimeout(r, 600));

    const quizHistoryPath = path.join(ROOT_DIR, 'screenshots', 'apresentacao', '09-quiz-historico-partidas.png');
    await safeScreenshot(pageQuiz, quizHistoryPath);
    summary['apresentacao'].push({
      file: '09-quiz-historico-partidas.png',
      desc: 'Histórico Completo de Partidas do Aluno/Visitante',
      bytes: fs.statSync(quizHistoryPath).size,
      res: '1920×1080'
    });
    console.log(`  ✓ Salvo: screenshots/apresentacao/09-quiz-historico-partidas.png`);
    await pageQuiz.click('#btnCloseHistory');

    // Copiar evidências do Quiz para docs/evidencias/quiz/depois/
    fs.copyFileSync(quizWelcomePath, path.join(DIR_QUIZ_DEP, '01-quiz-cadastro-boas-vindas.png'));
    fs.copyFileSync(quizHubPath, path.join(DIR_QUIZ_DEP, '02-quiz-hub-selecao-modos.png'));
    fs.copyFileSync(quizQuestionPath, path.join(DIR_QUIZ_DEP, '03-quiz-gameplay-interface.png'));
    fs.copyFileSync(quizFeedbackPath, path.join(DIR_QUIZ_DEP, '04-quiz-feedback-pedagogico.png'));
    fs.copyFileSync(quizResultPath, path.join(DIR_QUIZ_DEP, '05-quiz-boletim-nota-final.png'));
    fs.copyFileSync(quizRankingPath, path.join(DIR_QUIZ_DEP, '09-ranking-global-podio-filtros.png'));
    fs.copyFileSync(quizHistoryPath, path.join(DIR_QUIZ_DEP, '11-quiz-historico-partidas.png'));

    await pageQuiz.close();

    // ------------------------------------------------------------------------
    // PARTE 3: INTERFACE DO GÊMEO DIGITAL 3D (PAINEL, CARDS POI E ROTA)
    // ------------------------------------------------------------------------
    console.log('\n[3/3] Capturando Interface do Gêmeo Digital 3D (Painel Lateral, Cards de POI e Rota)...');
    const pageTwin = await browserUI.newPage({ viewport: { width: 1440, height: 900 } });
    await pageTwin.goto(`http://127.0.0.1:${PORT}/parque3d/`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2500));

    // A. Painel geral do Gêmeo 3D
    const twinUiPath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '03-painel-gemeo-digital-3d.png');
    await safeScreenshot(pageTwin, twinUiPath);
    summary['interfaces'].push({
      file: '03-painel-gemeo-digital-3d.png',
      desc: 'Interface do Gêmeo Digital 3D com painel de camadas e estatísticas',
      bytes: fs.statSync(twinUiPath).size,
      res: '1440×900'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/03-painel-gemeo-digital-3d.png`);

    // B. Card POI Super-Torres
    await pageTwin.evaluate(() => {
      if (window.__parkApi && window.__parkApi.selectPoi) {
        window.__parkApi.selectPoi('super-torres');
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    const cardTorresPath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '07-card-poi-torres.png');
    await safeScreenshot(pageTwin, cardTorresPath);
    summary['interfaces'].push({
      file: '07-card-poi-torres.png',
      desc: 'Interface 3D com Card Técnico das Super-Torres de Microclima',
      bytes: fs.statSync(cardTorresPath).size,
      res: '1440×900'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/07-card-poi-torres.png`);

    // C. Card POI Praça do Mercado
    await pageTwin.evaluate(() => {
      if (window.__parkApi && window.__parkApi.selectPoi) {
        window.__parkApi.selectPoi('mercado');
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    const cardMercadoPath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '08-card-poi-mercado.png');
    await safeScreenshot(pageTwin, cardMercadoPath);
    summary['interfaces'].push({
      file: '08-card-poi-mercado.png',
      desc: 'Interface 3D com Card da Praça do Mercado (Messina | Rivas)',
      bytes: fs.statSync(cardMercadoPath).size,
      res: '1440×900'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/08-card-poi-mercado.png`);

    // D. Card POI Nave do Conhecimento
    await pageTwin.evaluate(() => {
      if (window.__parkApi && window.__parkApi.selectPoi) {
        window.__parkApi.selectPoi('nave');
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    const cardNavePath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '09-card-poi-nave.png');
    await safeScreenshot(pageTwin, cardNavePath);
    summary['interfaces'].push({
      file: '09-card-poi-nave.png',
      desc: 'Interface 3D com Card da Nave do Conhecimento',
      bytes: fs.statSync(cardNavePath).size,
      res: '1440×900'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/09-card-poi-nave.png`);

    // E. Rota Dijkstra Overlay
    await pageTwin.evaluate(() => {
      if (window.__parkApi) {
        if (window.__parkApi.selectPoi) window.__parkApi.selectPoi(null);
        if (window.__parkApi.goTo) window.__parkApi.goTo('obliqua-geral', { instant: true });
        if (window.__parkApi.setRoute) window.__parkApi.setRoute('E1', 'torre-3:plat0');
      }
    });
    await new Promise(r => setTimeout(r, 1200));
    const rotaPath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '10-rota-dijkstra-overlay.png');
    await safeScreenshot(pageTwin, rotaPath);
    summary['interfaces'].push({
      file: '10-rota-dijkstra-overlay.png',
      desc: 'Cálculo de Rota Acessível Dijkstra (Entrada E1 ➔ Plataforma Torre 3)',
      bytes: fs.statSync(rotaPath).size,
      res: '1440×900'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/10-rota-dijkstra-overlay.png`);
    // F. HUD de Missões do Parque Realengo (5 Missões Oficiais)
    await pageTwin.evaluate(() => {
      // Abre o drawer de missões
      const btn = document.querySelector('button[title*="Missões"], button[title*="missões"]') ||
                  Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Missões'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    const missoesPath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '11-gemeo-3d-hud-missoes.png');
    await safeScreenshot(pageTwin, missoesPath);
    summary['interfaces'].push({
      file: '11-gemeo-3d-hud-missoes.png',
      desc: 'HUD Interativo das 5 Missões Oficiais do Parque Realengo',
      bytes: fs.statSync(missoesPath).size,
      res: '1440×900'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/11-gemeo-3d-hud-missoes.png`);

    // G. Personagem Humano com Halo Holográfico e Câmera de 3ª Pessoa
    await pageTwin.evaluate(() => {
      if (window.__parkApi && window.__parkApi.goTo) {
        window.__parkApi.goTo('torre-central', { instant: true });
      }
    });
    await new Promise(r => setTimeout(r, 800));
    const playerPath = path.join(ROOT_DIR, 'screenshots', 'interfaces', '12-gemeo-3d-personagem-halo.png');
    await safeScreenshot(pageTwin, playerPath);
    summary['interfaces'].push({
      file: '12-gemeo-3d-personagem-halo.png',
      desc: 'Personagem Humano Visível com Halo Neon e Câmera de 3ª Pessoa',
      bytes: fs.statSync(playerPath).size,
      res: '1440×900'
    });
    console.log(`  ✓ Salvo: screenshots/interfaces/12-gemeo-3d-personagem-halo.png`);

    await pageTwin.close();

    await browserUI.close();

  } finally {
    server.close();
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalShots = summary['3d'].length + summary['interfaces'].length + summary['apresentacao'].length + summary['detalhes'].length;

  console.log('\n================================================================');
  console.log(`  CAPTURA CONCLUÍDA COM SUCESSO EM ${elapsed}s!`);
  console.log(`  Total de imagens consolidadas: ${totalShots}`);
  console.log(`  - 3D (Parque Suzana Naspolini): ${summary['3d'].length}`);
  console.log(`  - Interfaces & Painéis:        ${summary['interfaces'].length}`);
  console.log(`  - Apresentação & Modais:       ${summary['apresentacao'].length}`);
  console.log(`  - Detalhes & Microestruturas:  ${summary['detalhes'].length}`);
  console.log('================================================================\n');

  return summary;
}

captureAll().catch((err) => {
  console.error('[ERRO FATAL NA CAPTURA]:', err);
  process.exit(1);
});
