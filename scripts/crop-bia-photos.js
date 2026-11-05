const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const pdfPath = 'file:///' + path.resolve(__dirname, '../downloads_temp/catalogo-BIA-SP.pdf').replace(/\\/g, '/');
const outDir = path.resolve(__dirname, '../site-informativo/assets/fotos-reais');

async function captureBia() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=2']
  });

  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  // Página 10 do PDF (Abertura do Parque Realengo)
  await page.goto(pdfPath + '#page=10&zoom=100', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outDir, '00_bia_sp_parque_realengo_abertura_p10.png') });

  // Página 11 do PDF (Fotos e Planta do Parque Realengo)
  await page.goto(pdfPath + '#page=11&zoom=100', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outDir, '00_bia_sp_parque_realengo_fotos_p11.png') });

  await browser.close();
  console.log('Capturas de alta resolução da BIA-SP concluídas!');
}

captureBia().catch(console.error);
