const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const pdfPath = 'file:///' + path.resolve(__dirname, '../downloads_temp/catalogo-BIA-SP.pdf').replace(/\\/g, '/');
const outDir = path.resolve(__dirname, '../site-informativo/assets/fotos-reais');

async function jumpPage11() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(pdfPath);
  await page.waitForTimeout(2500);

  // Clica no input de página no topo (x=405, y=26)
  await page.mouse.click(405, 26);
  await page.waitForTimeout(300);
  await page.keyboard.press('Control+A');
  await page.keyboard.type('11');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2500);

  await page.screenshot({ path: path.join(outDir, '00_bia_sp_page11_full.png') });

  await browser.close();
  console.log('Página 11 carregada com sucesso!');
}

jumpPage11().catch(console.error);
