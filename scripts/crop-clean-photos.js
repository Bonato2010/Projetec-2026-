const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../parque-realengo-3d/node_modules/playwright'));

const outDir = path.resolve(__dirname, '../site-informativo/assets/fotos-reais');
const p11Path = 'file:///' + path.join(outDir, '00_bia_sp_parque_realengo_p11_render.png').replace(/\\/g, '/');
const p10Path = 'file:///' + path.join(outDir, '00_bia_sp_parque_realengo_p10_render.png').replace(/\\/g, '/');

async function extract() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 3600, height: 2000 } });

  // 1. Processa Página 11
  await page.goto(p11Path);
  await page.waitForTimeout(1000);

  const crops = [
    {
      name: '09_real_ortofoto_aerea_terreno.jpg',
      sx: 85, sy: 630, sWidth: 1565, sHeight: 1060
    },
    {
      name: '10_real_parque_bosque_torres_visitantes.jpg',
      sx: 1740, sy: 0, sWidth: 1775, sHeight: 900
    },
    {
      name: '11_real_canteiros_comunitarios_familias.jpg',
      sx: 440, sy: 95, sWidth: 850, sHeight: 510
    },
    {
      name: '12_real_planta_arquitetonica_masterplan.jpg',
      sx: 2400, sy: 920, sWidth: 1050, sHeight: 780
    }
  ];

  for (const c of crops) {
    const dataUrl = await page.evaluate((crop) => {
      const img = document.querySelector('img');
      const canvas = document.createElement('canvas');
      canvas.width = crop.sWidth;
      canvas.height = crop.sHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, crop.sx, crop.sy, crop.sWidth, crop.sHeight, 0, 0, crop.sWidth, crop.sHeight);
      return canvas.toDataURL('image/jpeg', 0.95);
    }, c);

    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync(path.join(outDir, c.name), Buffer.from(base64Data, 'base64'));
    console.log(`Salvo: ${c.name}`);
  }

  // 2. Processa Página 10 (Foto noturna das super-torres)
  await page.goto(p10Path);
  await page.waitForTimeout(1000);

  const nightDataUrl = await page.evaluate(() => {
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');
    // Coordenadas da foto noturna à direita
    const sx = 1700, sy = 0, sWidth = 1840, sHeight = 1130;
    canvas.width = sWidth;
    canvas.height = sHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
    return canvas.toDataURL('image/jpeg', 0.95);
  });

  const nightBase64 = nightDataUrl.replace(/^data:image\/jpeg;base64,/, '');
  fs.writeFileSync(path.join(outDir, '13_real_super_torre_noturna_iluminada.jpg'), Buffer.from(nightBase64, 'base64'));
  console.log('Salvo: 13_real_super_torre_noturna_iluminada.jpg');

  await browser.close();
  console.log('Todas as fotografias reais foram extraídas com qualidade cirúrgica!');
}

extract().catch(console.error);
