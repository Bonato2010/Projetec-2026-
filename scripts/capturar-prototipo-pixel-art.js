const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT_DIR, 'screenshots', '02-prototipo-pixel-art');
const PORT = 3105;

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
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function startServer() {
  const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    let safePath = path.normalize(path.join(ROOT_DIR, pathname === '/' ? 'prototipo-pixel-art/index.html' : pathname));

    if (!safePath.startsWith(ROOT_DIR)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(safePath, (err, stats) => {
      if (err || !stats.isFile()) {
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
    console.log(`[Servidor Pixel Art] Ativo em http://127.0.0.1:${PORT}`);
    resolve(server);
  }));
}

async function run() {
  console.log('================================================================');
  console.log('  CAPTURADOR DE SCREENSHOTS — PROTÓTIPO PIXEL ART (TAREFA 02)');
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

    console.log(`Carregando http://127.0.0.1:${PORT}/prototipo-pixel-art/index.html ...`);
    await page.goto(`http://127.0.0.1:${PORT}/prototipo-pixel-art/index.html`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // 1. 01-cidade-normal.png: Cidade em funcionamento normal
    console.log('[1/8] Capturando 01-cidade-normal.png (Cidade Normal)...');
    await page.evaluate(() => {
      const g = window.__ecoPixelGame;
      if (g) {
        g.scenarioManager.simulationState = 'normal';
        g.scenarioManager.currentScenario = null;
        document.getElementById('emergency-modal').style.display = 'none';
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUT_DIR, '01-cidade-normal.png') });
    console.log('  ✓ Salvo: 01-cidade-normal.png');

    // 2. 02-cidade-animada.png: Cidade animada em pleno funcionamento
    console.log('[2/8] Capturando 02-cidade-animada.png (Cidade Animada)...');
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUT_DIR, '02-cidade-animada.png') });
    console.log('  ✓ Salvo: 02-cidade-animada.png');

    // 3. 03-alerta-guerra.png: Notificação Central de Alerta — Guerra de Facções
    console.log('[3/8] Capturando 03-alerta-guerra.png (Alerta Guerra de Facções)...');
    await page.evaluate(() => {
      const g = window.__ecoPixelGame;
      if (g) {
        g.scenarioManager.loadScenario('guerra_faccoes');
        window.updateScenarioDecisions('guerra_faccoes');
      }
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(OUT_DIR, '03-alerta-guerra.png') });
    console.log('  ✓ Salvo: 03-alerta-guerra.png');

    // 4. 04-guerra-em-andamento.png: Guerra em andamento (cidade reage, barricada, fumaça, sirenes, decisões)
    console.log('[4/8] Capturando 04-guerra-em-andamento.png (Guerra em Andamento)...');
    await page.evaluate(() => {
      const g = window.__ecoPixelGame;
      if (g) {
        document.getElementById('emergency-modal').style.display = 'none';
        g.scenarioManager.startSimulation();
        g.scenarioManager.applyDecision('reforcar_seguranca');
      }
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUT_DIR, '04-guerra-em-andamento.png') });
    console.log('  ✓ Salvo: 04-guerra-em-andamento.png');

    // 5. 05-alerta-inundacao.png: Notificação Central de Alerta — Inundação Severa
    console.log('[5/8] Capturando 05-alerta-inundacao.png (Alerta Inundação)...');
    await page.evaluate(() => {
      const g = window.__ecoPixelGame;
      if (g) {
        g.scenarioManager.loadScenario('inundacao');
        window.updateScenarioDecisions('inundacao');
      }
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(OUT_DIR, '05-alerta-inundacao.png') });
    console.log('  ✓ Salvo: 05-alerta-inundacao.png');

    // 6. 06-inundacao-em-andamento.png: Inundação severa em andamento (chuva, água subindo, reflexos, alerta)
    console.log('[6/8] Capturando 06-inundacao-em-andamento.png (Inundação em Andamento)...');
    await page.evaluate(() => {
      const g = window.__ecoPixelGame;
      if (g) {
        document.getElementById('emergency-modal').style.display = 'none';
        g.scenarioManager.startSimulation();
        g.scenarioManager.floodLevel = 3; // Nível máximo de alagamento
        g.scenarioManager.applyDecision('flood_comportas');
      }
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUT_DIR, '06-inundacao-em-andamento.png') });
    console.log('  ✓ Salvo: 06-inundacao-em-andamento.png');

    // 7. 07-controle-mobile.png: Smartphone - Modo Individual
    console.log('[7/8] Capturando 07-controle-mobile.png (Controle Mobile Individual)...');
    const mobilePage = await browser.newPage({ viewport: { width: 412, height: 915 } }); // Dimensão padrão moderna mobile
    await mobilePage.goto(`http://127.0.0.1:${PORT}/prototipo-pixel-art/controle.html?session=VIDA-ECOCITY`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));

    // Preenche nome e seleciona modo individual
    await mobilePage.fill('#input-name', 'Lucas Silva (Visitante)');
    await mobilePage.click('.role-choice-card[data-role="individual"]');
    await mobilePage.click('#btn-join');
    await new Promise(r => setTimeout(r, 800));
    await mobilePage.screenshot({ path: path.join(OUT_DIR, '07-controle-mobile.png') });
    console.log('  ✓ Salvo: 07-controle-mobile.png');

    // 8. 08-modo-cooperativo.png: Smartphone - Modo Cooperativo (Operador 1 & 2)
    console.log('[8/8] Capturando 08-modo-cooperativo.png (Modo Cooperativo Mobile)...');
    await mobilePage.goto(`http://127.0.0.1:${PORT}/prototipo-pixel-art/controle.html?session=VIDA-ECOCITY`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));
    await mobilePage.fill('#input-name', 'Camila Santos (Enfermagem)');
    await mobilePage.click('.role-choice-card[data-role="coop_p2"]');
    await mobilePage.click('#btn-join');
    await new Promise(r => setTimeout(r, 800));
    await mobilePage.screenshot({ path: path.join(OUT_DIR, '08-modo-cooperativo.png') });
    console.log('  ✓ Salvo: 08-modo-cooperativo.png');

    await browser.close();
    console.log('\n🎉 TODOS OS 8 SCREENSHOTS DA TAREFA 02 FORAM GERADOS COM SUCESSO EM:');
    console.log(`   ${OUT_DIR}\n`);

  } catch (err) {
    console.error('❌ Erro durante execução:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

run();
