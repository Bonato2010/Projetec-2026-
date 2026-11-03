const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'parque-realengo-3d', 'dist');
const DEST_DIR = path.join(ROOT_DIR, 'site', 'parque3d');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(SRC_DIR)) {
  console.log(`Copiando build 3D de ${SRC_DIR} para ${DEST_DIR}...`);
  copyRecursiveSync(SRC_DIR, DEST_DIR);
  console.log('✓ Build 3D sincronizado em site/parque3d com sucesso!');
} else {
  console.warn(`Aviso: ${SRC_DIR} não existe. Execute 'npm --prefix parque-realengo-3d run build' primeiro.`);
}
