const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const filesToCheck = ['index.html', 'controle.html'];
const missingAssets = [];
const foundAssets = [];

filesToCheck.forEach(file => {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${file}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /(?:src|href)=["']([^"']+\.(?:png|jpg|jpeg|svg|mp4|css|js))["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const rawPath = match[1].split('?')[0];
    if (rawPath.startsWith('http') || rawPath.startsWith('//')) continue;
    const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;
    const fullPath = path.join(ROOT, cleanPath);
    if (!fs.existsSync(fullPath)) {
      missingAssets.push({ file, asset: rawPath });
    } else {
      foundAssets.push({ file, asset: rawPath });
    }
  }
});

console.log(`Assets verificados com sucesso: ${foundAssets.length}`);
if (missingAssets.length > 0) {
  console.error(`ERRO: ${missingAssets.length} assets ausentes:`, missingAssets);
  process.exit(1);
} else {
  console.log('TODOS os caminhos de assets estáticos estão 100% íntegros!');
  process.exit(0);
}
