const path = require('path');
const fs = require('fs');
const http = require('http');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 3568;

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/scripts/pdf-viewer.html';
  const filePath = path.join(ROOT_DIR, reqPath);
  if (fs.existsSync(filePath)) {
    if (filePath.endsWith('.html')) res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    else if (filePath.endsWith('.pdf')) res.writeHead(200, { 'Content-Type': 'application/pdf' });
    else res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '127.0.0.1', async () => {
  console.log('Servidor ativo para corte na porta ' + PORT);

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 3000, height: 2000 } });
  await page.goto(`http://127.0.0.1:${PORT}/scripts/pdf-viewer.html`);
  await page.waitForTimeout(1000);

  const outDir = path.resolve(ROOT_DIR, 'site-informativo/assets/fotos-reais');

  // 1. Renderiza Página 11 a escala 3.0 para corte nítido
  console.log('Renderizando página 11 para corte de fotografias...');
  await page.evaluate(() => window.renderPage(11, 3.0));
  await page.waitForTimeout(2500);

  // Executa os cortes via canvas no navegador
  const cropsP11 = [
    {
      name: '09_real_ortofoto_aerea_terreno.png',
      // Ortofoto aérea do terreno (quadrante inferior esquerdo)
      clip: { x: 70, y: 720, width: 1350, height: 1200 }
    },
    {
      name: '10_real_parque_bosque_torres_visitantes.png',
      // Fotografia panorâmica do bosque e torres com público (quadrante superior direito)
      clip: { x: 1510, y: 0, width: 1530, height: 1040 }
    },
    {
      name: '11_real_canteiros_comunitarios_familias.png',
      // Canteiros e famílias sentadas (quadrante superior esquerdo)
      clip: { x: 380, y: 100, width: 730, height: 580 }
    },
    {
      name: '12_real_planta_arquitetonica_masterplan.png',
      // Planta do masterplan (quadrante inferior direito)
      clip: { x: 2080, y: 1080, width: 900, height: 880 }
    }
  ];

  for (const crop of cropsP11) {
    console.log(`Cortando ${crop.name}...`);
    const canvas = page.locator('#pdf-canvas');
    await canvas.screenshot({
      path: path.join(outDir, crop.name),
      clip: crop.clip
    });
  }

  // 2. Renderiza Página 10 para cortar a foto noturna da super-torre
  console.log('Renderizando página 10 para corte da super-torre noturna...');
  await page.evaluate(() => window.renderPage(10, 3.0));
  await page.waitForTimeout(2500);

  console.log('Cortando 13_real_super_torre_noturna_iluminada.png...');
  const canvas = page.locator('#pdf-canvas');
  await canvas.screenshot({
    path: path.join(outDir, '13_real_super_torre_noturna_iluminada.png'),
    // Foto noturna (lado direito da página 10)
    clip: { x: 1470, y: 0, width: 1570, height: 1300 }
  });

  console.log('Todos os cortes fotográficos foram salvos com sucesso!');
  await browser.close();
  server.close();
  process.exit(0);
});
