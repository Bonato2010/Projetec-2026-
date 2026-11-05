const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const downloads = [
  { path: 'canonical-drive-site/css/styles.css', id: '1vST5JrolcNzMLWnQEu5hmvpBnQ_1fGZX' },
  { path: 'canonical-drive-site/js/scene.js', id: '1MfRhXpuAaqxhmE2xq7JpTZdbjf2GVzAA' },
  { path: 'canonical-drive-site/js/ui.js', id: '1L3ybFXWOLavVoqx1bGRHakSpPOvQ6AP6' },
  { path: 'canonical-drive-site/vendor/three.min.js', id: '19BspCVv43QdDAXlgBFKURrRd49ofW5C3' },
  { path: 'canonical-drive-site/assets/Logo-Solaris.jpg', id: '1S0Jv7ELU69hwHvDck0sHqLYnQTGsd0yk' }
];

downloads.forEach(d => {
  const dir = path.dirname(d.path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  console.log(`Downloading ${d.path} (ID: ${d.id})...`);
  try {
    execSync(`curl.exe -Ls "https://drive.usercontent.google.com/download?id=${d.id}&export=download&confirm=t" -o "${d.path}"`);
    const stat = fs.statSync(d.path);
    console.log(`  -> OK: ${stat.size} bytes`);
  } catch (e) {
    console.error(`  -> Error:`, e.message);
  }
});

console.log('Finished downloading core drive files.');
