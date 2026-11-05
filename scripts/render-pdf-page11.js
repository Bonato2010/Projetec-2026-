const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const pdfPath = 'file:///' + path.resolve(__dirname, '../downloads_temp/catalogo-BIA-SP.pdf').replace(/\\/g, '/');
const outDir = path.resolve(__dirname, '../site-informativo/assets/fotos-reais');

async function render() {
  console.log('Abrindo PDF via Chrome:', pdfPath);
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1400, height: 1800 } });
  await page.goto(pdfPath + '#page=11', { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  const shotPath = path.join(outDir, '00_catalogo_bia_sp_pagina11.png');
  await page.screenshot({ path: shotPath });
  console.log('Screenshot salva em:', shotPath);

  // Vamos também capturar as páginas vizinhas para garantir (página 10 e 12)
  await page.goto(pdfPath + '#page=10', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, '00_catalogo_bia_sp_pagina10.png') });

  await page.goto(pdfPath + '#page=12', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, '00_catalogo_bia_sp_pagina12.png') });

  await browser.close();
  console.log('Renderização do PDF concluída!');
}

render().catch(err => console.error(err));
