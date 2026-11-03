const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT_DIR, 'docs/evidencias/refinamento-visual/depois');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function waitForHttp(url, timeoutMs = 25000) {
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
  console.log('Iniciando servidor local para capturas DEPOIS...');
  const srv = spawn('node', ['server.js'], {
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });

  try {
    await waitForHttp('http://127.0.0.1:3000/api/network-info');
    console.log('Servidor pronto! Iniciando capturas DEPOIS...');

    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=default']
    });

    // 1. Simulador Desktop (Com Parque / SbN)
    console.log('Capturando: 01_simulador_desktop_depois.png');
    const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDesktop.goto('http://127.0.0.1:3000/prototipos/03-simulador-drenagem/', { waitUntil: 'networkidle' });
    await pageDesktop.waitForTimeout(2000);
    await pageDesktop.screenshot({ path: path.join(OUT_DIR, '01_simulador_desktop_depois.png'), fullPage: false });

    // 2. Simulador Desktop (Sem o Parque / Enchente)
    console.log('Capturando: 02_simulador_desktop_sem_parque.png');
    await pageDesktop.click('#btn-scenario-nopark');
    await pageDesktop.waitForTimeout(1500);
    await pageDesktop.screenshot({ path: path.join(OUT_DIR, '02_simulador_desktop_sem_parque.png'), fullPage: false });

    // 3. Simulador Mobile (390x844)
    console.log('Capturando: 03_simulador_mobile_depois.png');
    const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pageMobile.goto('http://127.0.0.1:3000/prototipos/03-simulador-drenagem/', { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(1500);
    await pageMobile.screenshot({ path: path.join(OUT_DIR, '03_simulador_mobile_depois.png'), fullPage: false });

    // 4. Simulador Mobile - Aba de Parâmetros e Balanço
    console.log('Capturando: 04_simulador_mobile_parametros.png');
    await pageMobile.click('#btn-tab-controls');
    await pageMobile.waitForTimeout(800);
    await pageMobile.screenshot({ path: path.join(OUT_DIR, '04_simulador_mobile_parametros.png'), fullPage: false });

    // 5. Parque 3D Desktop (Com o novo visual de iluminação, sem emojis)
    console.log('Capturando: 05_parque3d_desktop_depois.png');
    const page3D = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page3D.goto('http://127.0.0.1:3000/parque3d', { waitUntil: 'networkidle' });
    await page3D.waitForTimeout(4000);
    await page3D.screenshot({ path: path.join(OUT_DIR, '05_parque3d_desktop_depois.png') });

    // 6. Parque 3D - Painel de Missões e Atividade Interativa
    console.log('Capturando: 06_parque3d_missoes_hud.png');
    const btnMissions = await page3D.$('.btn-hud-missions-toggle');
    if (btnMissions) {
      await btnMissions.click();
      await page3D.waitForTimeout(1000);
      await page3D.screenshot({ path: path.join(OUT_DIR, '06_parque3d_missoes_hud.png') });
    }

    // 7. Parque 3D Mobile (com Joystick Virtual e Botões de Ação)
    console.log('Capturando: 07_parque3d_mobile_depois.png');
    const page3DMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await page3DMobile.goto('http://127.0.0.1:3000/parque3d?mode=mobile', { waitUntil: 'networkidle' });
    await page3DMobile.waitForTimeout(4000);
    await page3DMobile.screenshot({ path: path.join(OUT_DIR, '07_parque3d_mobile_depois.png') });

    // 8. Controle Remoto Mobile (controle.html)
    console.log('Capturando: 08_controle_mobile_depois.png');
    const pageControle = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pageControle.goto('http://127.0.0.1:3000/controle.html', { waitUntil: 'networkidle' });
    await pageControle.waitForTimeout(1000);
    // Simular que o vídeo terminou para mostrar o dashboard de controle
    await pageControle.evaluate(() => {
      const vidWrap = document.getElementById('intro-video-wrapper');
      const appLayout = document.getElementById('mobile-app-layout');
      if (vidWrap) vidWrap.style.display = 'none';
      if (appLayout) appLayout.style.display = 'flex';
    });
    await pageControle.waitForTimeout(800);
    await pageControle.screenshot({ path: path.join(OUT_DIR, '08_controle_mobile_depois.png'), fullPage: false });

    // 9. Telão TV / Central V.I.D.A. (index.html)
    console.log('Capturando: 09_tv_stand_hub_depois.png');
    const pageTvHub = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageTvHub.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
    await pageTvHub.waitForTimeout(1500);
    // Fazer login ou entrar no hub para mostrar a interface sem emojis
    await pageTvHub.evaluate(() => {
      if (window.QUIZ_ENGINE) {
        window.QUIZ_ENGINE.userName = 'Visitante Projetec';
        window.QUIZ_ENGINE.showView('hubView');
      }
    });
    await pageTvHub.waitForTimeout(800);
    await pageTvHub.screenshot({ path: path.join(OUT_DIR, '09_tv_stand_hub_depois.png'), fullPage: false });

    await browser.close();
    console.log('Todas as capturas DEPOIS concluídas com sucesso!');
  } finally {
    srv.kill();
  }
}

run().catch(err => {
  console.error('Erro na captura DEPOIS:', err);
  process.exit(1);
});
