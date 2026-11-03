const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

console.log('Using browser:', CHROME_PATH);

// Start server
const serverProcess = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..')
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(url, width, height, outputFile, extraWait = 2500) {
  console.log(`\nCapturing ${outputFile} from ${url} (${width}x${height})...`);
  const outPath = path.resolve(__dirname, '..', outputFile);
  
  // Use Chrome/Edge headless
  const args = [
    '--headless=new',
    '--hide-scrollbars',
    '--disable-gpu',
    `--window-size=${width},${height}`,
    `--virtual-time-budget=${extraWait}`,
    `--screenshot=${outPath}`,
    url
  ];

  try {
    const cp = spawn(CHROME_PATH, args);
    await new Promise((res, rej) => {
      cp.on('close', res);
      cp.on('error', rej);
    });
    console.log(`Saved: ${outPath} (${fs.statSync(outPath).size} bytes)`);
  } catch (err) {
    console.error('Error capturing screenshot:', err);
  }
}

async function run() {
  await wait(2000); // Wait for server to start

  // 1. TV Stand - Vídeo de Apresentação Oficial
  await takeScreenshot(
    'http://localhost:3000/index.html',
    1920, 1080,
    'screenshots/tv-intro-video.png',
    1500
  );

  // 2. TV Stand - Layout Principal 1920x1080 (Parque Vivo 74% / QR Code Lateral 26%)
  await takeScreenshot(
    'http://localhost:3000/index.html?view=park',
    1920, 1080,
    'screenshots/tv-stand-layout-74-26.png',
    3000
  );

  // 3. Mobile Controller - Vídeo Inicial Obrigatório
  await takeScreenshot(
    'http://localhost:3000/controle.html',
    390, 844,
    'screenshots/mobile-video-screen.png',
    1500
  );

  // 4. Mobile Controller - Aba Explorar Desbloqueada
  await takeScreenshot(
    'http://localhost:3000/controle.html?unlocked=true&tab=explorar',
    390, 844,
    'screenshots/mobile-controller-explorar.png',
    2000
  );

  // 5. Mobile Controller - Aba Missões Desbloqueada
  await takeScreenshot(
    'http://localhost:3000/controle.html?unlocked=true&tab=missoes',
    390, 844,
    'screenshots/mobile-controller-missoes.png',
    2000
  );

  console.log('\nAll screenshots captured successfully!');
  serverProcess.kill('SIGTERM');
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  serverProcess.kill('SIGTERM');
  process.exit(1);
});
