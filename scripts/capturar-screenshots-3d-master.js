const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(ROOT_DIR, 'screenshots/3d');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Resolução Playwright via parque-realengo-3d/node_modules
const playwrightPath = path.resolve(ROOT_DIR, 'parque-realengo-3d/node_modules/playwright');
const { chromium } = require(playwrightPath);

function waitForHttp(url, timeoutMs = 25000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      http.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) resolve();
        else setTimeout(check, 300);
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('Timeout aguardando ' + url));
        else setTimeout(check, 300);
      });
    }
    check();
  });
}

const VIEWS_TO_CAPTURE = [
  { file: '01_vista_aerea_geral.png', viewId: 'aerea-completa', title: 'Vista Aérea Geral do Parque' },
  { file: '02_perspectiva_obliqua_panoramica.png', viewId: 'obliqua-geral', title: 'Perspectiva Oblíqua Panorâmica' },
  { file: '03_super_torres_bioclimaticas_nevoa.png', viewId: 'torres', title: 'Super-Torres Bioclimáticas com Névoa e Jardins Verticais' },
  { file: '04_passarelas_elevadas_mirante.png', viewId: 'passarelas', title: 'Passarelas Acessíveis e Mirantes' },
  { file: '05_lago_bacia_retencao_riprap.png', viewId: 'agua', title: 'Espelho d\'Água, Enrocamento Riprap e Ponte Arqueada' },
  { file: '06_nave_do_conhecimento_usina_solar.png', viewId: 'nave', title: 'Nave do Conhecimento com Usina Solar e Rampa' },
  { file: '07_anfiteatro_cultural_susana_naspolini.png', viewId: 'anfiteatro', title: 'Anfiteatro Cultural Susana Naspolini' },
  { file: '08_praca_do_mercado_messina_rivas.png', viewId: 'mercado', title: 'Praça do Mercado (11 Lojas) e Esplanada' },
  { file: '09_skatepark_street_bowls.png', viewId: 'skate', title: 'Skatepark com Bowls e Obstáculos de Street' },
  { file: '10_campo_sintetico_quadras_esportivas.png', viewId: 'esportes', title: 'Campo Sintético Society e Quadras Poliesportivas' },
  { file: '11_bosque_mata_atlantica_ipes_palmeiras.png', viewId: 'paisagismo', title: 'Bosque da Mata Atlântica com Ipês e Palmeiras Imperiais' },
  { file: '12_acesso_norte_carlos_wenceslau.png', viewId: 'entrada', title: 'Acesso Norte (Rua Prof. Carlos Wenceslau)' },
  { file: '13_mobiliario_urbano_postes_solares_bancos.png', viewId: 'detalhe-quiosques', title: 'Mobiliário Urbano: Postes Solares LED, Bancos e Quiosques' },
  { file: '14_splash_pad_playground_infantil.png', viewId: 'detalhe-splash-pad', title: 'Playground Infantil e Splash Pad' },
  { file: '15_quadras_volei_areia_ifrj.png', viewId: 'detalhe-volei-areia', title: 'Quadras de Vôlei de Areia e Bosque Oeste' },
  { file: '16_detalhe_aspersores_torre_central.png', viewId: 'detalhe-torre-aspersores', title: 'Microclima: Aspersores e Treliça da Super-Torre Central' },
  { file: '17_horizonte_montanhoso_pedra_branca.png', viewId: 'expansao', title: 'Maciço da Pedra Branca e Relevo de Realengo' },
];

async function main() {
  console.log('Iniciando servidor HTTP local (porta 3000)...');
  const srv = spawn('node', ['server.js'], {
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });

  try {
    await waitForHttp('http://127.0.0.1:3000/api/network-info');
    console.log('Servidor ativo! Abrindo Chrome Headless com suporte a WebGL...');

    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--use-gl=angle',
        '--use-angle=default',
        '--enable-webgl',
        '--ignore-gpu-blocklist'
      ]
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1
    });

    const page = await context.newPage();
    console.log('Navegando para o Parque Realengo 3D...');
    await page.goto('http://127.0.0.1:3000/parque3d/?capture=1', { waitUntil: 'networkidle' });

    // Aguardar o Three.js compilar shaders e carregar materiais PBR
    await page.waitForTimeout(4000);

    for (let i = 0; i < VIEWS_TO_CAPTURE.length; i++) {
      const item = VIEWS_TO_CAPTURE[i];
      console.log(`[${i + 1}/${VIEWS_TO_CAPTURE.length}] Capturando ${item.title} -> ${item.file}...`);

      await page.evaluate((viewId) => {
        if (window.__parkApi && window.__parkApi.goTo) {
          window.__parkApi.goTo(viewId, { instant: true });
        }
      }, item.viewId);

      // Tempo para estabilizar texturas, sombras e instâncias
      await page.waitForTimeout(1400);

      const filePath = path.join(OUT_DIR, item.file);
      await page.screenshot({ path: filePath });
      console.log(`✓ Salvo em: ${filePath}`);
    }

    // Captura com personagem em terceira pessoa
    console.log('Capturando perspectiva em terceira pessoa com o visitante 3D...');
    await page.evaluate(() => {
      if (window.__parkPlayer && window.__parkPlayer.teleportTo) {
        window.__parkPlayer.teleportTo(25, -45);
      }
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, '18_visitante_terceira_pessoa_lago.png') });
    console.log('✓ Salvo: 18_visitante_terceira_pessoa_lago.png');

    await browser.close();
    console.log('\nTodas as capturas de tela do 3D foram concluídas com sucesso!');
  } catch (err) {
    console.error('Erro durante a captura:', err);
  } finally {
    srv.kill('SIGINT');
  }
}

main();
