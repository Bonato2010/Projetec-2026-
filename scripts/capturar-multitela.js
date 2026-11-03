/**
 * CAPTURA AUTOMÁTICA DE SCREENSHOTS — PROJETO V.I.D.A. MULTITELA
 * Gera capturas da TV do Stand (1920x1080) e Celular do Visitante (390x844)
 */

const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname);
const OUTPUT_DIR = path.join(ROOT_DIR, 'prototipos', 'galeria-screenshots', 'screenshots', 'multitela-stand');

function getBrowserBinary() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Nenhum navegador encontrado.");
}

function takeScreenshot(browserBin, url, outputPath, width, height, budget = 3500) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--force-device-scale-factor=1',
      `--window-size=${width},${height}`,
      `--screenshot=${outputPath}`,
      `--virtual-time-budget=${budget}`,
      '--hide-scrollbars',
      url
    ];

    const proc = cp.spawn(browserBin, args);
    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        console.log(`  ✓ Gerado: ${path.basename(outputPath)} (${Math.round(stats.size / 1024)} KB)`);
        resolve(stats.size);
      } else {
        reject(new Error(`Falha ao gerar ${outputPath} (código ${code})`));
      }
    });
  });
}

async function run() {
  console.log('Iniciando captura dos screenshots do Stand Multitela...');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browserBin = getBrowserBinary();
  console.log('Navegador:', browserBin);

  // Inicia servidor local para servir as páginas
  const server = cp.spawn('node', ['server.js'], { cwd: ROOT_DIR });
  
  await new Promise((resolve) => {
    server.stdout.on('data', (d) => {
      if (d.toString().includes('Servidor ativo')) resolve();
    });
  });

  const targets = [
    {
      file: '01-tv-stand-abertura.png',
      url: 'http://localhost:3000/',
      width: 1920,
      height: 1080,
      budget: 2500
    },
    {
      file: '02-tv-stand-parque-vivo.png',
      url: 'http://localhost:3000/?view=park',
      width: 1920,
      height: 1080,
      budget: 4000
    },
    {
      file: '03-mobile-video-obrigatorio.png',
      url: 'http://localhost:3000/controle.html?session=VIDA-FEIRA',
      width: 390,
      height: 844,
      budget: 2500
    },
    {
      file: '04-mobile-explorador-unlocked.png',
      url: 'http://localhost:3000/controle.html?session=VIDA-FEIRA&unlocked=true&tab=explorar',
      width: 390,
      height: 844,
      budget: 3500
    },
    {
      file: '05-mobile-missoes-unlocked.png',
      url: 'http://localhost:3000/controle.html?session=VIDA-FEIRA&unlocked=true&tab=missoes',
      width: 390,
      height: 844,
      budget: 3500
    }
  ];

  for (const t of targets) {
    const out = path.join(OUTPUT_DIR, t.file);
    await takeScreenshot(browserBin, t.url, out, t.width, t.height, t.budget);
  }

  server.kill();
  console.log('\nTodas as 5 capturas do Stand Multitela foram concluídas com sucesso!');
}

run().catch((err) => {
  console.error('Erro na captura:', err);
  process.exit(1);
});
