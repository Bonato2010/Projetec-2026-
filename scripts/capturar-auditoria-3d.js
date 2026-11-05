const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_3D = path.resolve(ROOT_DIR, 'parque-realengo-3d', 'dist');
const OUT_DIR = path.resolve(ROOT_DIR, 'parque-realengo-3d', 'auditoria_3d');
const PORT = 3098;

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Playwright via parque-realengo-3d/node_modules
const pw = require(path.resolve(ROOT_DIR, 'parque-realengo-3d/node_modules/playwright'));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function startStaticServer() {
  const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);

    let filePath;
    if (pathname.startsWith('/parque3d/assets/')) {
      filePath = path.join(DIST_3D, 'assets', pathname.replace('/parque3d/assets/', ''));
    } else if (pathname === '/parque3d' || pathname === '/parque3d/') {
      filePath = path.join(DIST_3D, 'index.html');
    } else if (pathname.startsWith('/parque3d/')) {
      filePath = path.join(DIST_3D, pathname.replace('/parque3d/', ''));
    } else if (pathname.startsWith('/assets/') && !fs.existsSync(path.join(ROOT_DIR, pathname))) {
      filePath = path.join(DIST_3D, pathname);
    } else {
      filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
    }

    const safePath = path.normalize(filePath);
    if (!safePath.startsWith(ROOT_DIR)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(safePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Not found: ${pathname}`);
        return;
      }
      const ext = path.extname(safePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(safePath).pipe(res);
    });
  });

  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => {
    console.log(`[Servidor Auditoria 3D] Ativo em http://127.0.0.1:${PORT}`);
    resolve(server);
  }));
}

function saveBase64Image(filePath, base64Data) {
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buf = Buffer.from(cleanBase64, 'base64');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buf);
  const kb = (buf.length / 1024).toFixed(1);
  console.log(`  ✓ Salvo: ${path.basename(filePath)} (${kb} KB)`);
  return buf.length;
}

const AUDIT_SHOTS = [
  {
    file: '01_visao_aerea_geral_malha.png',
    title: 'Visão Aérea Geral - Alinhamento com Ortofoto e Limites Perimetrais',
    viewId: 'aerea-completa'
  },
  {
    file: '02_torres_detalhe_trelica.png',
    title: 'Super-Torres - Detalhe Estrutural da Treliça Diagrid e Coroamento',
    viewId: 'detalhe-torre-aspersores'
  },
  {
    file: '03_espelho_dagua_sapatas.png',
    title: 'Espelho d\'Água Lobado - Sapatas Estruturais, Reflexos e Borda Riprap',
    viewId: 'agua'
  },
  {
    file: '04_passarelas_rampas_acesso.png',
    title: 'Passarelas Elevadas - Rampas de Acessibilidade e Gradientes',
    viewId: 'passarelas'
  },
  {
    file: '05_complexo_esportivo_quadras.png',
    title: 'Complexo Esportivo - Quadras Diagonais, Demarcações e Desnível',
    viewId: 'esportes'
  },
  {
    file: '06_nave_conhecimento_patio.png',
    title: 'Nave do Conhecimento - Pavilhão Quadrado com Átrio Interno Aberto',
    viewId: 'nave'
  },
  {
    file: '07_skatepark_bowls_acabamento.png',
    title: 'Skatepark - Geometria dos Bowls, Transições e Obstáculos de Street',
    viewId: 'skate'
  },
  {
    file: '08_bosque_densidade_vegetal.png',
    title: 'Bosque Preservado - Densidade Arbórea e Distribuição de Espécies',
    viewId: 'paisagismo'
  },
  {
    file: '09_entorno_urbano_repeticao.png',
    title: 'Entorno Urbano - Avaliação Crítica da Malha Periférica e Repetição',
    viewId: 'obliqua-geral'
  },
  {
    file: '10_mobiliario_postes_bancos.png',
    title: 'Mobiliário Urbano e Microclima - Postes Solares, Bancos e Acabamento',
    viewId: 'detalhe-quiosques'
  }
];

async function main() {
  console.log('================================================================');
  console.log('  AUDITORIA TÉCNICA 3D — CAPTURA DE EVIDÊNCIAS FOTOGRÁFICAS');
  console.log('================================================================\n');

  const server = await startStaticServer();
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  try {
    const browser = await pw.chromium.launch({
      executablePath: chromePath,
      headless: true,
      args: [
        '--enable-webgl',
        '--ignore-gpu-blocklist',
        '--use-gl=angle',
        '--use-angle=swiftshader',
        '--enable-unsafe-swiftshader',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    console.log(`Carregando http://127.0.0.1:${PORT}/parque3d/?capture=1 ...`);
    await page.goto(`http://127.0.0.1:${PORT}/parque3d/?capture=1`, { waitUntil: 'domcontentloaded' });

    // Aguardar compilação de shaders e montagem dos buffers Three.js
    await new Promise(r => setTimeout(r, 4000));

    for (let i = 0; i < AUDIT_SHOTS.length; i++) {
      const shot = AUDIT_SHOTS[i];
      console.log(`[${i + 1}/${AUDIT_SHOTS.length}] ${shot.title}...`);

      await page.evaluate((viewId) => {
        if (window.__parkApi && window.__parkApi.goTo) {
          window.__parkApi.goTo(viewId, { instant: true });
        }
      }, shot.viewId);

      await new Promise(r => setTimeout(r, 1200));

      const dataUrl = await page.evaluate(() => {
        const c = document.querySelector('canvas');
        return c ? c.toDataURL('image/png') : null;
      });

      if (dataUrl) {
        const targetPath = path.join(OUT_DIR, shot.file);
        saveBase64Image(targetPath, dataUrl);
      } else {
        console.warn(`  ⚠️ Canvas não retornou dados para ${shot.file}, usando fallback screenshot`);
        const targetPath = path.join(OUT_DIR, shot.file);
        await page.screenshot({ path: targetPath });
        console.log(`  ✓ Salvo via page.screenshot: ${shot.file}`);
      }
    }

    await browser.close();
    console.log('\n✅ Todas as 10 capturas de auditoria salvas com sucesso em:');
    console.log(`   ${OUT_DIR}\n`);
  } catch (err) {
    console.error('❌ Erro durante a captura da auditoria 3D:', err);
  } finally {
    server.close();
  }
}

main();