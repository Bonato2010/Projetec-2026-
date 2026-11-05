const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const pdfPath = 'file:///' + path.resolve(__dirname, '../downloads_temp/catalogo-BIA-SP.pdf').replace(/\\/g, '/');
const outDir = path.resolve(__dirname, '../site-informativo/assets/fotos-reais');

async function getPage11() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(pdfPath);
  await page.waitForTimeout(2000);

  // Pressiona PageDown várias vezes para ir até a página 11
  for (let i = 0; i < 11; i++) {
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '00_bia_sp_page_target.png') });

  await browser.close();
  console.log('Target screenshot salva!');
}

getPage11().catch(console.error);
