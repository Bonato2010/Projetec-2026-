const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const siteFiles = [
  { dir: path.join(ROOT, 'site'), file: 'index.html' },
  { dir: path.join(ROOT, 'site'), file: 'controle.html' }
];

const missingAssets = [];
const foundAssets = [];

siteFiles.forEach(({ dir, file }) => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    missingAssets.push({ file, asset: filePath, reason: 'Arquivo HTML não encontrado' });
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /(?:src|href)=["']([^"']+\.(?:png|jpg|jpeg|svg|mp4|css|js))["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const rawPath = match[1].split('?')[0];
    if (rawPath.startsWith('http') || rawPath.startsWith('//')) continue;
    const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;
    const fullPath = path.join(dir, cleanPath);
    if (!fs.existsSync(fullPath)) {
      missingAssets.push({ file, asset: rawPath, fullPath });
    } else {
      foundAssets.push({ file, asset: rawPath });
    }
  }
});

console.log(`Assets verificados com sucesso dentro de site/: ${foundAssets.length}`);
if (missingAssets.length > 0) {
  console.error(`ERRO: ${missingAssets.length} assets ausentes:`, missingAssets);
  process.exit(1);
} else {
  console.log('TODOS os caminhos de assets em site/ estão 100% íntegros!');
  process.exit(0);
}
