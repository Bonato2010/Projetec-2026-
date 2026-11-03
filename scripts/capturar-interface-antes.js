const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT_DIR, 'screenshots/interface/antes');
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
  console.log('Iniciando servidor local para capturas ANTES...');
  const srv = spawn('node', ['server.js'], {
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });

  try {
    await waitForHttp('http://127.0.0.1:3000/api/network-info');
    console.log('Servidor pronto! Iniciando navegador Chrome...');

    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // 1. Quiz Welcome Desktop
    console.log('1. Capturando Quiz Welcome Desktop...');
    const pageDesk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDesk.goto('http://127.0.0.1:3000/index.html', { waitUntil: 'networkidle' });
    await pageDesk.waitForTimeout(1000);
    await pageDesk.screenshot({ path: path.join(OUT_DIR, '01_quiz_welcome_desktop_antes.png') });

    // 2. Quiz Welcome Mobile
    console.log('2. Capturando Quiz Welcome Mobile...');
    const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pageMobile.goto('http://127.0.0.1:3000/index.html', { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(1000);
    await pageMobile.screenshot({ path: path.join(OUT_DIR, '02_quiz_welcome_mobile_antes.png') });

    // 3. Logo Close-up (Demonstrando o corte/proporção)
    console.log('3. Capturando Logo Close-up...');
    const logoEl = await pageDesk.$('.welcome-logo');
    if (logoEl) {
      await logoEl.screenshot({ path: path.join(OUT_DIR, '03_quiz_logo_close_antes.png') });
    }

    // 4. Hub de Modos Desktop
    console.log('4. Capturando Hub de Modos Desktop...');
    await pageDesk.fill('#userNameInput', 'Visitante Teste');
    await pageDesk.evaluate(() => document.getElementById('btnStartWelcome').click());
    await pageDesk.waitForTimeout(800);
    await pageDesk.screenshot({ path: path.join(OUT_DIR, '04_quiz_hub_modos_desktop_antes.png') });

    // 5. Hub de Modos Mobile
    console.log('5. Capturando Hub de Modos Mobile...');
    await pageMobile.fill('#userNameInput', 'Visitante Mobile');
    await pageMobile.evaluate(() => document.getElementById('btnStartWelcome').click());
    await pageMobile.waitForTimeout(800);
    await pageMobile.screenshot({ path: path.join(OUT_DIR, '05_quiz_hub_modos_mobile_antes.png') });

    // 6. Gameplay Quiz Desktop
    console.log('6. Capturando Gameplay Quiz Desktop...');
    await pageDesk.evaluate(() => document.getElementById('btnLaunchSustentabilidade').click());
    await pageDesk.waitForTimeout(800);
    await pageDesk.screenshot({ path: path.join(OUT_DIR, '06_quiz_gameplay_desktop_antes.png') });

    // 7. Feedback Resposta
    console.log('7. Capturando Feedback Resposta...');
    await pageDesk.evaluate(() => {
      const opt = document.querySelector('.option-btn');
      if (opt) opt.click();
    });
    await pageDesk.waitForTimeout(600);
    await pageDesk.screenshot({ path: path.join(OUT_DIR, '07_quiz_feedback_desktop_antes.png') });

    // 8. Boletim de Resultados
    console.log('8. Capturando Boletim de Resultados...');
    await pageDesk.evaluate(() => {
      if (window.QUIZ_ENGINE) {
        window.QUIZ_ENGINE.showView('resultsView');
        window.QUIZ_ENGINE.renderBigPerformanceChart('radar');
      }
    });
    await pageDesk.waitForTimeout(1000);
    await pageDesk.screenshot({ path: path.join(OUT_DIR, '08_quiz_boletim_resultados_antes.png') });

    // 9. Ranking Geral Modal
    console.log('9. Capturando Ranking Geral Modal...');
    await pageDesk.evaluate(() => {
      if (window.QUIZ_ENGINE) window.QUIZ_ENGINE.openRankingModal();
    });
    await pageDesk.waitForTimeout(800);
    await pageDesk.screenshot({ path: path.join(OUT_DIR, '09_quiz_ranking_geral_antes.png') });
    await pageDesk.evaluate(() => {
      const closeBtn = document.getElementById('btnCloseRanking');
      if (closeBtn) closeBtn.click();
    });
    await pageDesk.waitForTimeout(400);

    // 10. Telão TV Placar
    console.log('10. Capturando Telão TV Placar...');
    const pageTv = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await pageTv.goto('http://127.0.0.1:3000/ranking-tv', { waitUntil: 'networkidle' });
    await pageTv.waitForTimeout(1200);
    await pageTv.evaluate(() => {
      if (window.QUIZ_ENGINE) window.QUIZ_ENGINE.showView('tvRankingView');
    });
    await pageTv.waitForTimeout(800);
    await pageTv.screenshot({ path: path.join(OUT_DIR, '10_telao_tv_ranking_antes.png') });

    // 11. Vídeo de Entrada Mobile (390x844)
    console.log('11. Capturando Vídeo de Entrada Mobile...');
    const pageVidMob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await pageVidMob.goto('http://127.0.0.1:3000/controle.html', { waitUntil: 'domcontentloaded' });
    await pageVidMob.waitForTimeout(1500);
    await pageVidMob.screenshot({ path: path.join(OUT_DIR, '11_video_entrada_mobile_antes.png') });

    // 12. Vídeo de Entrada Desktop (1440x900)
    console.log('12. Capturando Vídeo de Entrada Desktop...');
    const pageVidDesk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageVidDesk.goto('http://127.0.0.1:3000/controle.html', { waitUntil: 'domcontentloaded' });
    await pageVidDesk.waitForTimeout(1500);
    await pageVidDesk.screenshot({ path: path.join(OUT_DIR, '12_video_entrada_desktop_antes.png') });

    // 13. Mobile Controle Remoto - Aba Explorar
    console.log('13. Capturando Mobile Controle - Explorar...');
    await pageVidMob.goto('http://127.0.0.1:3000/controle.html?unlocked=true&tab=explorar', { waitUntil: 'networkidle' });
    await pageVidMob.waitForTimeout(1500);
    await pageVidMob.screenshot({ path: path.join(OUT_DIR, '13_mobile_controle_explorar_antes.png') });

    // 14. Mobile Controle Remoto - Aba Missões
    console.log('14. Capturando Mobile Controle - Missões...');
    await pageVidMob.goto('http://127.0.0.1:3000/controle.html?unlocked=true&tab=missoes', { waitUntil: 'networkidle' });
    await pageVidMob.waitForTimeout(1500);
    await pageVidMob.screenshot({ path: path.join(OUT_DIR, '14_mobile_controle_missoes_antes.png') });

    // 15. Prototipo Painel Ambiental
    console.log('15. Capturando Painel Ambiental...');
    await pageDesk.goto('http://127.0.0.1:3000/prototipos/02-painel-ambiental/', { waitUntil: 'networkidle' });
    await pageDesk.waitForTimeout(1500);
    await pageDesk.screenshot({ path: path.join(OUT_DIR, '15_painel_ambiental_desktop_antes.png') });

    // 16. Prototipo Simulador Drenagem
    console.log('16. Capturando Simulador Drenagem...');
    await pageDesk.goto('http://127.0.0.1:3000/prototipos/03-simulador-drenagem/', { waitUntil: 'networkidle' });
    await pageDesk.waitForTimeout(1500);
    await pageDesk.screenshot({ path: path.join(OUT_DIR, '16_simulador_drenagem_desktop_antes.png') });

    await browser.close();
    console.log('\nTodas as 16 capturas ANTES foram registradas com sucesso em:', OUT_DIR);
  } catch (err) {
    console.error('Erro na captura ANTES:', err);
  } finally {
    srv.kill();
    process.exit(0);
  }
}

run();
