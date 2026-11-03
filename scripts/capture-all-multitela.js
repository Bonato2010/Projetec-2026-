const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

console.log('Browser executable:', CHROME_PATH);

// Start server
const serverProcess = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..')
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function capture(url, width, height, outputFile, waitMs = 2500) {
  console.log(`\nCapturing: ${outputFile} (${width}x${height}) from ${url}...`);
  const outPath = path.resolve(__dirname, '..', outputFile);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const args = [
    '--headless=new',
    '--hide-scrollbars',
    '--disable-gpu',
    `--window-size=${width},${height}`,
    `--virtual-time-budget=${waitMs}`,
    `--screenshot=${outPath}`,
    url
  ];

  return new Promise((resolve, reject) => {
    const cp = spawn(CHROME_PATH, args);
    cp.on('close', (code) => {
      if (fs.existsSync(outPath)) {
        const stats = fs.statSync(outPath);
        console.log(`✓ Saved ${outputFile} (${stats.size} bytes)`);
        resolve(stats);
      } else {
        console.error(`✗ Failed to generate ${outputFile}`);
        resolve(null);
      }
    });
    cp.on('error', (err) => {
      console.error(`Spawn error on ${outputFile}:`, err);
      resolve(null);
    });
  });
}

async function run() {
  await wait(2000);

  // 1. TV Stand - Parque Vivo 75% / Lateral QR Code 25% (1920x1080)
  await capture(
    'http://localhost:3000/index.html?view=park',
    1920, 1080,
    'screenshots/tv-stand-parque-vivo-75-25.png',
    3000
  );

  // 2. Mobile - Vídeo Obrigatório Fullscreen (390x844)
  await capture(
    'http://localhost:3000/controle.html',
    390, 844,
    'screenshots/mobile-video-fullscreen.png',
    1500
  );

  // 3. Mobile - Explorar com D-Pad e Câmera Desbloqueados (390x844)
  await capture(
    'http://localhost:3000/controle.html?unlocked=true&tab=explorar',
    390, 844,
    'screenshots/mobile-controller-explorar.png',
    2000
  );

  // 4. Mobile - 4 Missões Desbloqueadas (390x844)
  await capture(
    'http://localhost:3000/controle.html?unlocked=true&tab=missoes',
    390, 844,
    'screenshots/mobile-controller-missoes.png',
    2000
  );

  // Copy to gallery folder
  const galleryDir = path.resolve(__dirname, '..', 'prototipos/galeria-screenshots/screenshots/multitela-stand');
  if (!fs.existsSync(galleryDir)) {
    fs.mkdirSync(galleryDir, { recursive: true });
  }

  const copies = [
    { src: 'screenshots/tv-stand-parque-vivo-75-25.png', dst: 'prototipos/galeria-screenshots/screenshots/multitela-stand/02-tv-stand-parque-vivo.png' },
    { src: 'screenshots/mobile-video-fullscreen.png', dst: 'prototipos/galeria-screenshots/screenshots/multitela-stand/03-mobile-video-obrigatorio.png' },
    { src: 'screenshots/mobile-controller-explorar.png', dst: 'prototipos/galeria-screenshots/screenshots/multitela-stand/04-mobile-explorador-unlocked.png' },
    { src: 'screenshots/mobile-controller-missoes.png', dst: 'prototipos/galeria-screenshots/screenshots/multitela-stand/05-mobile-missoes-unlocked.png' },
  ];

  for (const c of copies) {
    const srcPath = path.resolve(__dirname, '..', c.src);
    const dstPath = path.resolve(__dirname, '..', c.dst);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, dstPath);
      console.log(`Copied ${c.src} -> ${c.dst} (${fs.statSync(dstPath).size} bytes)`);
    }
  }

  console.log('\nAll captures & gallery updates done!');
  serverProcess.kill('SIGTERM');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  serverProcess.kill('SIGTERM');
  process.exit(1);
});
