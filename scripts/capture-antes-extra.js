const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT_DIR, 'screenshots/interface/antes');

const { spawn } = require('child_process');

async function run() {
  const srv = spawn('node', ['server.js'], { cwd: ROOT_DIR });
  await new Promise(r => setTimeout(r, 2000));
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Capturando 15_painel_ambiental_desktop_antes.png...');
  await page.goto('http://127.0.0.1:3000/prototipos/02-painel-ambiental/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '15_painel_ambiental_desktop_antes.png'), timeout: 10000 });

  console.log('Capturando 16_simulador_drenagem_desktop_antes.png...');
  await page.goto('http://127.0.0.1:3000/prototipos/03-simulador-drenagem/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '16_simulador_drenagem_desktop_antes.png'), timeout: 10000 });

  await browser.close();
  srv.kill();
  console.log('Concluído!');
}

run();
