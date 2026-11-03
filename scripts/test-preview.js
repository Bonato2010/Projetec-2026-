const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

function waitForHttp(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      http.get(url, (res) => {
        if (res.statusCode === 200) resolve();
        else setTimeout(check, 400);
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('Timeout waiting for ' + url));
        else setTimeout(check, 400);
      });
    }
    check();
  });
}

async function main() {
  console.log('Starting Vite in parque-realengo-3d...');
  const vite = spawn('cmd.exe', ['/c', 'npm run dev -- --port 5173 --strictPort'], {
    cwd: path.resolve(__dirname, '../parque-realengo-3d'),
    stdio: 'pipe'
  });

  vite.stdout.on('data', d => console.log('[Vite]', d.toString().trim()));
  vite.stderr.on('data', d => console.error('[Vite err]', d.toString().trim()));

  await waitForHttp('http://localhost:5173/');
  console.log('Vite is ready on http://localhost:5173/');

  const outPath = path.resolve(__dirname, '../screenshots/parque-3d-initial.png');
  console.log('Capturing screenshot to', outPath);
  
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--window-size=1600,900',
    '--virtual-time-budget=6000',
    `--screenshot=${outPath}`,
    'http://localhost:5173/'
  ];

  const chrome = spawn(CHROME, args);
  await new Promise(r => chrome.on('close', r));

  if (fs.existsSync(outPath)) {
    console.log('✓ Screenshot saved, file size:', fs.statSync(outPath).size, 'bytes');
  } else {
    console.error('✗ Screenshot not found');
  }

  vite.kill('SIGTERM');
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

