const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT_DIR, 'screenshots', 'cidade-2d');
const PORT = 3099;

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

function startStaticServer() {
  const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    let safePath = path.normalize(path.join(ROOT_DIR, pathname === '/' ? 'cidade-2d-pixelart/index.html' : pathname));

    if (!safePath.startsWith(ROOT_DIR)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(safePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(safePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(safePath).pipe(res);
    });
  });

  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => {
    console.log(`[Servidor Cidade 2D] Ativo em http://127.0.0.1:${PORT}`);
    resolve(server);
  }));
}

async function main() {
  console.log('================================================================');
  console.log('  CAPTURADOR DE SCREENSHOTS — CIDADE 2D EM PIXEL ART');
  console.log('================================================================\n');

  const server = await startStaticServer();
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  try {
    const browser = await pw.chromium.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    console.log(`Carregando http://127.0.0.1:${PORT}/cidade-2d-pixelart/index.html ...`);
    await page.goto(`http://127.0.0.1:${PORT}/cidade-2d-pixelart/index.html`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    const SHOTS = [
      {
        file: '01_cidade_2d_dia_rotina.png',
        title: '01. Cidade Viva - Dia Ensolarado, Boteco, Fachadas e Trânsito Carioca',
        action: async () => {
          await page.evaluate(() => {
            window.__pixelCity.setTimeOfDay('day');
            window.__pixelCity.scenarioManager.setScenario('normal');
            window.__pixelCity.camera.targetX = 250;
            window.__pixelCity.camera.x = 250;
          });
        }
      },
      {
        file: '02_cidade_2d_inundacao_temporal.png',
        title: '02. Inundação e Temporal - Alagamento de Vias, Chuva e Reflexos',
        action: async () => {
          await page.evaluate(() => {
            window.__pixelCity.scenarioManager.setScenario('inundacao');
            window.__pixelCity.world.waterLevel = 22; // Força água acumulada
            window.__pixelCity.camera.targetX = 500;
            window.__pixelCity.camera.x = 500;
          });
        }
      },
      {
        file: '03_cidade_2d_emergencia_bloqueio.png',
        title: '03. Emergência Urbana - Viaturas Policiais, Giroflex e Via Interditada',
        action: async () => {
          await page.evaluate(() => {
            window.__pixelCity.scenarioManager.setScenario('emergencia');
            window.__pixelCity.camera.targetX = 750;
            window.__pixelCity.camera.x = 750;
          });
        }
      },
      {
        file: '04_cidade_2d_blecaute_apagao.png',
        title: '04. Blecaute no Transformador - Faíscas Elétricas e Apagão Geral',
        action: async () => {
          await page.evaluate(() => {
            window.__pixelCity.setTimeOfDay('night');
            window.__pixelCity.scenarioManager.setScenario('blecaute');
            window.__pixelCity.camera.targetX = 200;
            window.__pixelCity.camera.x = 200;
          });
        }
      },
      {
        file: '05_cidade_2d_noite_carioca.png',
        title: '05. Noite Carioca - Cones de Luz dos Postes, Neons e Casario no Morro',
        action: async () => {
          await page.evaluate(() => {
            window.__pixelCity.setTimeOfDay('night');
            window.__pixelCity.scenarioManager.setScenario('normal');
            window.__pixelCity.camera.targetX = 400;
            window.__pixelCity.camera.x = 400;
          });
        }
      },
      {
        file: '06_cidade_2d_entardecer_golden_hour.png',
        title: '06. Entardecer Dourado - Golden Hour Carioca e Clínica da Família',
        action: async () => {
          await page.evaluate(() => {
            window.__pixelCity.setTimeOfDay('sunset');
            window.__pixelCity.scenarioManager.setScenario('normal');
            window.__pixelCity.camera.targetX = 700;
            window.__pixelCity.camera.x = 700;
          });
        }
      }
    ];

    for (let i = 0; i < SHOTS.length; i++) {
      const shot = SHOTS[i];
      console.log(`[${i + 1}/${SHOTS.length}] ${shot.title}...`);
      await shot.action();
      await new Promise(r => setTimeout(r, 1200));

      const targetPath = path.join(OUT_DIR, shot.file);
      await page.screenshot({ path: targetPath });
      console.log(`  ✓ Salvo: ${shot.file}`);
    }

    await browser.close();
    console.log('\n✅ Todas as capturas da Cidade 2D Pixel Art foram salvas com sucesso em:');
    console.log(`   ${OUT_DIR}\n`);
  } catch (err) {
    console.error('❌ Erro durante captura:', err);
  } finally {
    server.close();
  }
}

main();
