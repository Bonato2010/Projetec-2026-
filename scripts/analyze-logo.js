const fs = require('fs');
const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setContent('<html><body><canvas id="c"></canvas></body></html>');
  
  const base64 = fs.readFileSync('public/assets/logo-vida-original.png').toString('base64');
  
  const result = await page.evaluate(async (b64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const c = document.getElementById('c');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, c.width, c.height).data;
        let minX = c.width, maxX = 0, minY = c.height, maxY = 0;
        for (let y = 0; y < 350; y++) {
          for (let x = 0; x < c.width; x++) {
            const idx = (y * c.width + x) * 4;
            const lum = 0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2];
            if (lum > 25) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        resolve({
          width: img.width,
          height: img.height,
          minX, maxX, minY, maxY,
          symWidth: maxX - minX + 1,
          symHeight: maxY - minY + 1,
          centerX: (minX + maxX)/2,
          centerY: (minY + maxY)/2
        });
      };
      img.src = 'data:image/png;base64,' + b64;
    });
  }, base64);
  
  console.log('Original symbol analysis:', JSON.stringify(result, null, 2));
  await browser.close();
})();
