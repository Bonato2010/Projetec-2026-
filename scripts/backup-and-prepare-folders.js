const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Backup prototipos/02-painel-ambiental to backup/02-painel-ambiental-original
const backupDir = path.resolve('backup', '02-painel-ambiental-original');
const srcDir = path.resolve('prototipos', '02-painel-ambiental');
console.log(`Backing up ${srcDir} to ${backupDir}...`);
copyRecursiveSync(srcDir, backupDir);
console.log('Backup created successfully!');

// 2. Prepare screenshots/site-informativo/ directories
const screenshotDirs = [
  'screenshots/site-informativo/00-versao-base',
  'screenshots/site-informativo/01-desktop',
  'screenshots/site-informativo/02-mobile',
  'screenshots/site-informativo/03-tablet',
  'screenshots/site-informativo/04-interacoes',
  'screenshots/site-informativo/05-comparacoes'
];

screenshotDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
console.log('Screenshot directories created successfully!');

// 3. Copy base screenshots from screenshots/01-site-informativo into screenshots/site-informativo/00-versao-base
const oldScreenshotsDir = path.resolve('screenshots', '01-site-informativo');
if (fs.existsSync(oldScreenshotsDir)) {
  const baseTarget = path.resolve('screenshots', 'site-informativo', '00-versao-base');
  copyRecursiveSync(oldScreenshotsDir, baseTarget);
  console.log('Base version screenshots copied to 00-versao-base!');
}
