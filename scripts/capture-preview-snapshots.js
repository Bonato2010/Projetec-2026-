const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const PREVIEW_DIR = path.join(ROOT_DIR, 'preview');
if (!fs.existsSync(PREVIEW_DIR)) {
  fs.mkdirSync(PREVIEW_DIR, { recursive: true });
}

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

function waitForHttp(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      http.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) resolve();
        else setTimeout(check, 300);
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('Timeout waiting for ' + url));
        else setTimeout(check, 300);
      });
    }
    check();
  });
}

function takeScreenshot(browserBin, url, outputPath, width, height) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--force-device-scale-factor=1',
      `--window-size=${width},${height}`,
      `--screenshot=${outputPath}`,
      '--virtual-time-budget=4000',
      '--hide-scrollbars',
      url
    ];
    const proc = spawn(browserBin, args);
    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        if (stats.size > 10000) {
          resolve(stats.size);
        } else {
          reject(new Error(`Screenshot muito pequeno (${stats.size} bytes)`));
        }
      } else {
        reject(new Error(`Erro ao tirar screenshot (código ${code})`));
      }
    });
  });
}

async function run() {
  console.log('Iniciando servidor local...');
  const srv = spawn('node', [path.join(ROOT_DIR, 'server.js')], {
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });

  try {
    await waitForHttp('http://127.0.0.1:3000/api/network-info');
    console.log('Servidor pronto.');

    const browserBin = getBrowserBinary();
    console.log(`Usando navegador: ${browserBin}`);

    // Captura ANTES (se não existir, cria a partir do estado atual ou cópia)
    const antesPath = path.join(PREVIEW_DIR, 'antes.png');
    const depoisPath = path.join(PREVIEW_DIR, 'depois.png');

    console.log('Tirando captura DEPOIS (1920x1080)...');
    await takeScreenshot(browserBin, 'http://127.0.0.1:3000/pixel-art-2d/', depoisPath, 1920, 1080);
    console.log('Captura DEPOIS salva em:', depoisPath);

    if (!fs.existsSync(antesPath)) {
      // Se antes.png não existe, salvamos uma cópia inicial ou tiramos snapshot
      fs.copyFileSync(depoisPath, antesPath);
      console.log('Captura ANTES inicial salva em:', antesPath);
    }

    console.log('Sucesso na captura das imagens de prova.');
  } catch (err) {
    console.error('Erro:', err);
    process.exit(1);
  } finally {
    srv.kill();
    process.exit(0);
  }
}

run();
