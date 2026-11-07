const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const reportsDir = path.resolve(__dirname, '..', 'docs', 'relatorios', 'tarefas-drive');
const targetDir = path.resolve(__dirname, '..', 'reports', 'resultados-drive');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copia relatórios
fs.readdirSync(reportsDir).forEach(f => {
  fs.copyFileSync(path.join(reportsDir, f), path.join(targetDir, f));
});

console.log('✓ Relatórios copiados para reports/resultados-drive/');

// Cria zip de evidências
try {
  const zipCmd = `powershell -Command "Compress-Archive -Path '${targetDir}\\*', 'screenshots\\02-prototipo-pixel-art', 'screenshots\\03-quiz' -DestinationPath '${targetDir}\\RELATORIOS_E_EVIDENCIAS_DRIVE.zip' -Force"`;
  execSync(zipCmd);
  console.log('✓ ZIP consolidado gerado: RELATORIOS_E_EVIDENCIAS_DRIVE.zip');
} catch (e) {
  console.error('Aviso ao gerar ZIP:', e.message);
}
