const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Inspecting downloads...');
const downloadsDir = 'C:\\Users\\Daniz\\Downloads';
const files = fs.readdirSync(downloadsDir).filter(f => f.toLowerCase().includes('parque') || f.toLowerCase().includes('projetec'));
console.log('Matching files:', files);

// Check if adm-zip or similar is available or use tar / powershell
try {
  const psCmd = `powershell -NoProfile -Command "Expand-Archive -Path 'C:\\Users\\Daniz\\Downloads\\parque-realengo-3d.zip' -DestinationPath 'C:\\Users\\Daniz\\Downloads\\Projetec 3\\parque-realengo-3d-source' -Force"`;
  console.log('Extracting parque-realengo-3d.zip...');
  execSync(psCmd, { stdio: 'inherit' });
  console.log('Extracted successfully!');
} catch (e) {
  console.error('Error extracting:', e);
}
