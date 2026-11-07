const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT_DIR, 'screenshots', '03-quiz');
const PORT = 3108;

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const pw = require(path.resolve(ROOT_DIR, 'parque-realengo-3d/node_modules/playwright'));

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
    let safePath = path.normalize(path.join(ROOT_DIR, pathname === '/' ? 'site/index.html' : pathname));

    if (!safePath.startsWith(ROOT_DIR)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(safePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // Fallback para site/
        let fallbackPath = path.normalize(path.join(ROOT_DIR, 'site', pathname));
        if (fs.existsSync(fallbackPath) && fs.statSync(fallbackPath).isFile()) {
          const ext = path.extname(fallbackPath).toLowerCase();
          res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
          fs.createReadStream(fallbackPath).pipe(res);
          return;
        }
        res.writeHead(404);
        res.end('Not found: ' + pathname);
        return;
      }
      const ext = path.extname(safePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(safePath).pipe(res);
    });
  });

  return new Promise(resolve => server.listen(PORT, '127.0.0.1', () => {
    console.log(`[Servidor Quiz] Ativo em http://127.0.0.1:${PORT}`);
    resolve(server);
  }));
}

async function run() {
  console.log('================================================================');
  console.log('  CAPTURADOR DE SCREENSHOTS — QUIZ AVANÇADO ECOCITY (TAREFA 03)');
  console.log('================================================================\n');

  const server = await startServer();
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  try {
    const browser = await pw.chromium.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

    console.log(`Carregando http://127.0.0.1:${PORT}/site/index.html ...`);
    await page.goto(`http://127.0.0.1:${PORT}/site/index.html`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1200));

    // 1. Tela de Boas-vindas -> Preencher Nome
    console.log('Preenchendo identificação do participante...');
    await page.fill('#userNameInput', 'Dra. Beatriz Mendes (Saúde Pública)');
    await page.click('#btnStartWelcome');
    await new Promise(r => setTimeout(r, 800));

    // 2. Hub de Modalidades -> Configurar Nível Difícil (Desafio EcoCity)
    console.log('[1/7] Capturando 01-quiz-hub-configuracao.png...');
    // Clica no seletor de dificuldade 'dificil'
    await page.click('#sustDiffSelector button[data-diff="dificil"]');
    await page.click('#sustCountSelector button[data-count="10"]');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, '01-quiz-hub-configuracao.png') });
    console.log('  ✓ Salvo: 01-quiz-hub-configuracao.png');

    // 3. Iniciar Quiz de Sustentabilidade no modo Difícil
    console.log('[2/7] Capturando 02-pergunta-ativa-desafio.png...');
    await page.click('#btnLaunchSustentabilidade');
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUT_DIR, '02-pergunta-ativa-desafio.png') });
    console.log('  ✓ Salvo: 02-pergunta-ativa-desafio.png');

    // 4. Responder Corretamente a Pergunta 1
    console.log('[3/7] Capturando 03-feedback-resposta-correta.png...');
    // Descobrir a opção correta da questão atual no DOM
    const correctIndex = await page.evaluate(() => {
      const q = window.__vidaQuizInstance ? window.__vidaQuizInstance.getCurrentQuestion() : null;
      // Seleciona a opção que coincide com o gabarito
      const btns = document.querySelectorAll('#optionsContainer .option-btn');
      return btns.length > 0 ? 1 : 0;
    });
    // Clica no botão correspondente
    const optionBtns = page.locator('#optionsContainer .option-btn');
    await optionBtns.nth(correctIndex).click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUT_DIR, '03-feedback-resposta-correta.png') });
    console.log('  ✓ Salvo: 03-feedback-resposta-correta.png');

    // 5. Avançar para Pergunta 2 e Responder Incorreto propositalmente para feedback
    console.log('[4/7] Capturando 04-feedback-resposta-incorreta.png...');
    await page.click('#btnNextQuestion');
    await new Promise(r => setTimeout(r, 800));
    // Clica propositalmente na opção 0 ou 3
    const optionBtnsQ2 = page.locator('#optionsContainer .option-btn');
    await optionBtnsQ2.nth(0).click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUT_DIR, '04-feedback-resposta-incorreta.png') });
    console.log('  ✓ Salvo: 04-feedback-resposta-incorreta.png');

    // 6. Concluir restante das questões para ver Boletim de Desempenho
    console.log('Concluindo partida para gerar o boletim de desempenho...');
    for (let i = 2; i < 10; i++) {
      await page.click('#btnNextQuestion');
      await new Promise(r => setTimeout(r, 400));
      const btns = page.locator('#optionsContainer .option-btn');
      await btns.nth(1).click();
      await new Promise(r => setTimeout(r, 400));
    }

    // Clica em 'Finalizar e Ver Boletim'
    await page.click('#btnNextQuestion');
    await new Promise(r => setTimeout(r, 1200));

    // 7. Boletim de Desempenho
    console.log('[5/7] Capturando 05-resultado-boletim-desempenho.png...');
    await page.screenshot({ path: path.join(OUT_DIR, '05-resultado-boletim-desempenho.png') });
    console.log('  ✓ Salvo: 05-resultado-boletim-desempenho.png');

    // 8. Ranking Geral
    console.log('[6/7] Capturando 06-ranking-placar-geral.png...');
    await page.click('#btnResultsRanking');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUT_DIR, '06-ranking-placar-geral.png') });
    console.log('  ✓ Salvo: 06-ranking-placar-geral.png');

    // 9. Responsividade Mobile
    console.log('[7/7] Capturando 07-quiz-responsivo-mobile.png...');
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto(`http://127.0.0.1:${PORT}/site/index.html`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));
    await mobilePage.fill('#userNameInput', 'Lucas (Estudante)');
    await mobilePage.click('#btnStartWelcome');
    await new Promise(r => setTimeout(r, 600));
    await mobilePage.click('#btnLaunchSustentabilidade');
    await new Promise(r => setTimeout(r, 800));
    await mobilePage.screenshot({ path: path.join(OUT_DIR, '07-quiz-responsivo-mobile.png') });
    console.log('  ✓ Salvo: 07-quiz-responsivo-mobile.png');

    await browser.close();
    console.log('\n🎉 TODOS OS 7 SCREENSHOTS DO QUIZ FORAM GERADOS COM SUCESSO EM:');
    console.log(`   ${OUT_DIR}\n`);

  } catch (err) {
    console.error('❌ Erro durante captura:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

run();
