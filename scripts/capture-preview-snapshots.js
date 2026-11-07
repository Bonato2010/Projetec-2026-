const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PREVIEW_DIR = path.resolve(ROOT_DIR, 'preview');

if (!fs.existsSync(PREVIEW_DIR)) {
  fs.mkdirSync(PREVIEW_DIR, { recursive: true });
}

const pw = require(path.resolve(ROOT_DIR, 'parque-realengo-3d/node_modules/playwright'));

async function run() {
  console.log('Capturando preview/depois.png com Playwright...');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await pw.chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  // Vamos navegar para o servidor local rodando em 3000
  try {
    await page.goto('http://localhost:3000/pixel-art-2d/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // Iniciar simulação para mostrar o HUD ativo
    await page.evaluate(() => {
      const modal = document.getElementById('emergency-modal');
      if (modal) modal.style.display = 'none';
      if (window.__ecoPixelGame && window.__ecoPixelGame.scenarioManager) {
        window.__ecoPixelGame.scenarioManager.startSimulation();
      }
    });
    await new Promise(r => setTimeout(r, 1500));

    await page.screenshot({ path: path.join(PREVIEW_DIR, 'depois.png') });
    console.log('✓ preview/depois.png capturado com sucesso!');
  } catch (err) {
    console.error('Erro ao capturar:', err.message);
  } finally {
    await browser.close();
  }
}

run();
