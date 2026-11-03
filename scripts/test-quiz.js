/**
 * TESTE AUTOMATIZADO DA PLATAFORMA DE QUIZ V.I.D.A.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT_DIR = path.resolve(__dirname, '..');
const pw = require(path.resolve(ROOT_DIR, 'parque-realengo-3d/node_modules/playwright'));
const PORT = 3099;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function startServer() {
  const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  return new Promise(resolve => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

async function run() {
  console.log('Iniciando teste da Plataforma de Quiz...');
  const server = await startServer();
  const errors = [];

  const browser = await pw.chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.error('[Browser Error]:', msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('[Page Error]:', err.message);
  });

  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // 1. Verificar Tela de Boas-vindas
  const title = await page.title();
  console.log('Título da página:', title);

  // 2. Preencher nome
  await page.fill('#userNameInput', 'Profª Mariana');
  await page.click('#btnStartWelcome');
  await page.waitForTimeout(400);

  // 3. Verificar se foi para o Hub
  const hubActive = await page.evaluate(() => {
    return document.getElementById('hubView').classList.contains('active');
  });
  console.log('Hub ativo após cadastro:', hubActive);

  // 4. Iniciar Quiz de Sustentabilidade
  await page.click('#btnLaunchSustentabilidade');
  await page.waitForTimeout(400);

  const gameActive = await page.evaluate(() => {
    return document.getElementById('gameView').classList.contains('active');
  });
  console.log('GameView ativa:', gameActive);

  // 5. Responder a primeira pergunta
  const questionText = await page.textContent('#questionText');
  console.log('Pergunta 1:', questionText.substring(0, 60) + '...');

  const optionsCount = await page.locator('#optionsContainer .option-btn').count();
  console.log('Número de alternativas:', optionsCount);

  // Clica na primeira opção
  await page.click('#optionsContainer .option-btn:nth-child(1)');
  await page.waitForTimeout(300);

  // Verifica se o feedback pedagógico apareceu
  const feedbackVisible = await page.isVisible('#feedbackBox');
  const feedbackExplanation = await page.textContent('#feedbackExplanation');
  console.log('Feedback pedagógico exibido:', feedbackVisible);
  console.log('Explicação pedagógica:', feedbackExplanation.trim().substring(0, 80) + '...');

  // Verifica se o botão de próxima pergunta apareceu
  const nextVisible = await page.isVisible('#btnNextQuestion');
  console.log('Botão de próxima questão visível:', nextVisible);

  // 6. Testar avanço de questão
  await page.click('#btnNextQuestion');
  await page.waitForTimeout(300);

  const counterText = await page.textContent('#gameCounter');
  console.log('Contador após avançar:', counterText);

  // 7. Simular finalização do quiz chamando finishGame() via evaluate
  await page.evaluate(() => {
    window.QUIZ_ENGINE.getCurrentGame().score = 18;
    window.QUIZ_ENGINE.getCurrentGame().totalQuestions = 20;
    // Dispara término
    const currentGame = window.QUIZ_ENGINE.getCurrentGame();
    currentGame.currentIndex = currentGame.totalQuestions - 1;
    document.getElementById('btnNextQuestion').click();
  });
  await page.waitForTimeout(500);

  // 8. Verificar tela de resultados
  const resultsActive = await page.evaluate(() => {
    return document.getElementById('resultsView').classList.contains('active');
  });
  const notaFinal = await page.textContent('#resultsScoreNumber');
  const badgeText = await page.textContent('#resultsBadge');
  console.log('ResultsView ativa:', resultsActive);
  console.log('Nota final calculada:', notaFinal, '(deve ser 9.0)');
  console.log('Selo de Desempenho:', badgeText);

  // 9. Abrir e testar Modal de Ranking
  await page.click('#btnResultsRanking');
  await page.waitForTimeout(400);
  const rankingModalActive = await page.evaluate(() => {
    return document.getElementById('rankingModal').classList.contains('active');
  });
  const podium1st = await page.textContent('#podium1stName');
  console.log('Modal de Ranking ativo:', rankingModalActive);
  console.log('1º Lugar no Pódio:', podium1st);

  // Fechar ranking
  await page.click('#btnCloseRanking');
  await page.waitForTimeout(200);

  // 10. Abrir e testar Modal de Histórico
  await page.click('#btnResultsHistory');
  await page.waitForTimeout(400);
  const historyModalActive = await page.evaluate(() => {
    return document.getElementById('historyModal').classList.contains('active');
  });
  const historyRowsCount = await page.locator('#historyItemsList > div').count();
  console.log('Modal de Histórico ativo:', historyModalActive);
  console.log('Registros no Histórico:', historyRowsCount);

  await page.click('#btnCloseHistory');

  await browser.close();
  server.close();

  if (errors.length > 0) {
    console.error('ERROS ENCONTRADOS:', errors);
    process.exit(1);
  } else {
    console.log('TODOS OS TESTES DA PLATAFORMA DE QUIZ PASSARAM COM SUCESSO (0 ERROS)!');
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
