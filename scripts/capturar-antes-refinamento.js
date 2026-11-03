const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT_DIR, 'docs/evidencias/refinamento-visual/antes');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
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

async function run() {
  console.log('Iniciando servidor local...');
  const srv = spawn('node', ['server.js'], {
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });

  try {
    await waitForHttp('http://127.0.0.1:3000/api/network-info');
    console.log('Servidor pronto! Iniciando capturas ANTES...');

    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=default']
    });

    // 1. Simulador Desktop
    console.log('Capturando: 01_simulador_desktop_antes.png');
    const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDesktop.goto('http://127.0.0.1:3000/prototipos/03-simulador-drenagem/', { waitUntil: 'networkidle' });
    await pageDesktop.waitForTimeout(2000);
    await pageDesktop.screenshot({ path: path.join(OUT_DIR, '01_simulador_desktop_antes.png'), fullPage: false });

    // 2. Simulador Mobile
    console.log('Capturando: 02_simulador_mobile_antes.png');
    const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pageMobile.goto('http://127.0.0.1:3000/prototipos/03-simulador-drenagem/', { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(1500);
    await pageMobile.screenshot({ path: path.join(OUT_DIR, '02_simulador_mobile_antes.png'), fullPage: false });

    // 3. Parque 3D Desktop
    console.log('Capturando: 03_parque3d_desktop_antes.png');
    const page3D = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page3D.goto('http://127.0.0.1:3000/parque3d', { waitUntil: 'networkidle' });
    await page3D.waitForTimeout(4000);
    await page3D.screenshot({ path: path.join(OUT_DIR, '03_parque3d_desktop_antes.png') });

    // 4. Parque 3D Mobile
    console.log('Capturando: 04_parque3d_mobile_antes.png');
    const page3DMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await page3DMobile.goto('http://127.0.0.1:3000/parque3d?mode=mobile', { waitUntil: 'networkidle' });
    await page3DMobile.waitForTimeout(4000);
    await page3DMobile.screenshot({ path: path.join(OUT_DIR, '04_parque3d_mobile_antes.png') });

    await browser.close();
    console.log('Capturas ANTES concluídas com sucesso!');
  } finally {
    srv.kill();
  }
}

run().catch(err => {
  console.error('Erro na captura ANTES:', err);
  process.exit(1);
});
