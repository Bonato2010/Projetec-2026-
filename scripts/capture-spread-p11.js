const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const pdfPath = 'file:///' + path.resolve(__dirname, '../downloads_temp/catalogo-BIA-SP.pdf').replace(/\\/g, '/');
const outDir = path.resolve(__dirname, '../site-informativo/assets/fotos-reais');

async function captureSpread() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-device-scale-factor=2']
  });

  const page = await browser.newPage({ viewport: { width: 2200, height: 1300 } });
  
  // A página 11 do leitor PDF
  await page.goto(pdfPath + '#page=11&zoom=120', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outDir, '00_bia_sp_spread_realengo_p11.png') });

  await browser.close();
  console.log('Spread da página 11 capturado!');
}

captureSpread().catch(console.error);
