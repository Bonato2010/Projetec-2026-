const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const pdfPath = 'file:///' + path.resolve(__dirname, '../downloads_temp/catalogo-BIA-SP.pdf').replace(/\\/g, '/');
const outDir = path.resolve(__dirname, '../site-informativo/assets/fotos-reais');

async function clickThumb() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(pdfPath);
  await page.waitForTimeout(2500);

  // Clica no thumbnail 11 (coordenadas x=80, y=430)
  await page.mouse.click(80, 430);
  await page.waitForTimeout(2000);

  // Também tenta dar zoom para 100% ou clicar no botão fit
  await page.screenshot({ path: path.join(outDir, '00_bia_sp_page11_direct.png') });

  await browser.close();
  console.log('Clique no thumbnail 11 salvo!');
}

clickThumb().catch(console.error);
