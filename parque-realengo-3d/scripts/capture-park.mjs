/**
 * Captura automática de imagens REAIS da cena (Playwright + Chromium) para a galeria /preview-mapa.
 *   npm run capture                      # sobe o Vite sozinho
 *   npm run capture -- --url=http://localhost:5173   # usa um servidor já rodando
 *   npm run capture -- --gpu             # usa a GPU (padrão: renderização por software, mais robusta)
 * Pré-requisito: npm install && npx playwright install chromium
 * A rodada anterior é arquivada em public/preview-mapa/history/<data>/ e aparece na aba "Evolução".
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'preview-mapa');
const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split('=')[1];
const width = Number(arg('width') ?? 1600), height = Number(arg('height') ?? 900);
const useGpu = process.argv.includes('--gpu');

const pw = await import('playwright').catch(() => null);
if (!pw) {
  console.error('Playwright não está instalado. Rode: npm install && npx playwright install chromium');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(u, ms = 90000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try { if ((await fetch(u)).ok) return; } catch { /* ainda subindo */ }
    await sleep(500);
  }
  throw new Error(`O servidor não respondeu em ${u}`);
}

let url = arg('url');
let server = null;
if (!url) {
  const port = 5199;
  url = `http://localhost:${port}`;
  server = spawn('npx', ['vite', '--port', String(port), '--strictPort'], { cwd: root, stdio: 'ignore', shell: process.platform === 'win32' });
  await waitFor(url);
}

const exists = async (p) => fs.access(p).then(() => true, () => false);
const slug = (d) => d.toISOString().replace(/[:.]/g, '-');
let browser;
try {
  await fs.mkdir(outDir, { recursive: true });
  const args = useGpu ? [] : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
  browser = await pw.chromium.launch({ headless: true, args });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('[página]', e.message));
  await page.goto(`${url}/?capture=1`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__PARK_READY__ === true && !!window.__parkApi, null, { timeout: 180000 });
  const { views, layoutVersion } = await page.evaluate(() => ({ views: window.__parkApi.views, layoutVersion: window.__parkApi.layoutVersion }));

  // arquiva a rodada anterior
  const indexPath = path.join(outDir, 'index.json');
  let history = [];
  if (await exists(indexPath)) {
    const prev = JSON.parse(await fs.readFile(indexPath, 'utf8'));
    const folder = `history/${slug(new Date(prev.generatedAt))}`;
    await fs.mkdir(path.join(outDir, folder), { recursive: true });
    const moved = [];
    for (const s of prev.shots) {
      if (await exists(path.join(outDir, s.file))) {
        await fs.rename(path.join(outDir, s.file), path.join(outDir, folder, path.basename(s.file)));
        moved.push({ ...s, file: `${folder}/${path.basename(s.file)}` });
      }
    }
    history = [{ runAt: prev.generatedAt, layoutVersion: prev.layoutVersion, shots: moved }, ...(prev.history ?? [])].slice(0, 10);
  }

  const shots = [];
  for (const v of views) {
    process.stdout.write(`• ${v.id} … `);
    await page.evaluate((id) => window.__parkApi.goTo(id, { instant: true }), v.id);
    await page.waitForFunction(() => window.__PARK_SETTLED__ === true, null, { timeout: 30000 });
    await sleep(1500); // camadas (vegetação/entorno) montam e as sombras estabilizam
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
    const file = `${v.id}.png`;
    await page.screenshot({ path: path.join(outDir, file), type: 'png' });
    shots.push({ id: v.id, category: v.category, title: v.label, caption: v.caption, file, capturedAt: new Date().toISOString(), layoutVersion, status: 'provisório — posições aproximadas' });
    console.log('ok');
  }
  await fs.writeFile(indexPath, JSON.stringify({ generatedAt: new Date().toISOString(), layoutVersion, shots, history }, null, 2));
  console.log(`\n${shots.length} capturas salvas em public/preview-mapa/. Abra /preview-mapa.`);
} finally {
  await browser?.close();
  server?.kill();
}
