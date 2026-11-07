const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_DIR = 'C:\\Users\\Daniz\\Downloads\\Drive-extraido';
const OUT_DIR = path.resolve(ROOT_DIR, 'EcoCity-saida');
const PUBLIC_SCENES_DIR = path.resolve(ROOT_DIR, 'public', 'assets', 'scenes');
const PROTOTIPO_SCENES_DIR = path.resolve(ROOT_DIR, 'prototipos', 'pixel-art-2d', 'Recursos visuais', 'scenes');
const DOCS_REF_DIR = path.resolve(ROOT_DIR, 'docs', 'referencia');

[OUT_DIR, PUBLIC_SCENES_DIR, PROTOTIPO_SCENES_DIR, DOCS_REF_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const mapping = [
  { cenario: 'alagamento', fase: 'crise', file: 'alagamento (crise).jfif' },
  { cenario: 'alagamento', fase: 'resposta', file: 'alagamento (resposta).jfif' },
  { cenario: 'alagamento', fase: 'recuperacao', file: 'alagamento (recuperação).jfif' },
  { cenario: 'apagao', fase: 'crise', file: 'apagão (crise).jfif' },
  { cenario: 'apagao', fase: 'resposta', file: 'apagão (resposta).jfif' },
  { cenario: 'apagao', fase: 'recuperacao', file: 'apagão (recuperação).jfif' },
  { cenario: 'aliens', fase: 'crise', file: 'alien (crise).jfif' },
  { cenario: 'aliens', fase: 'resposta', file: 'alien(resposta).jfif' },
  { cenario: 'aliens', fase: 'recuperacao', file: 'alien (recuperação).jfif' },
  { cenario: 'ameaca-externa', fase: 'crise', file: 'Invasão (crise).jfif' },
  { cenario: 'ameaca-externa', fase: 'resposta', file: 'invasão (resposta).jfif' },
  { cenario: 'ameaca-externa', fase: 'recuperacao', file: 'invasão (recuperação).jfif' },
  { cenario: 'governanca', fase: 'crise', file: 'revolta (crise).jfif' },
  { cenario: 'governanca', fase: 'resposta', file: 'revolta (resposta).jfif' },
  { cenario: 'governanca', fase: 'recuperacao', file: 'revolta (recuperação).jfif' },
  { cenario: 'seguranca', fase: 'crise', file: 'facção (crise).jfif' },
  { cenario: 'seguranca', fase: 'resposta', file: 'facção (resposta).jfif' },
  { cenario: 'seguranca', fase: 'recuperacao', file: 'facção (recuperação).jfif' }
];

console.log('=== MAPEAMENTO E PROCESSAMENTO DE IMAGENS DO DRIVE.ZIP ===');

let fileList = [];
if (fs.existsSync(SOURCE_DIR)) {
  fileList = fs.readdirSync(SOURCE_DIR);
}

let missingCount = 0;
let processedItems = [];

mapping.forEach(item => {
  const srcPath = path.join(SOURCE_DIR, item.file);
  const ext = path.extname(item.file);
  const publicScenarioDir = path.join(PUBLIC_SCENES_DIR, item.cenario);
  const outScenarioDir = path.join(OUT_DIR, 'scenes', item.cenario);
  const protoScenarioDir = path.join(PROTOTIPO_SCENES_DIR, item.cenario);

  [publicScenarioDir, outScenarioDir, protoScenarioDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  if (fs.existsSync(srcPath)) {
    const destPublic = path.join(publicScenarioDir, `${item.fase}${ext}`);
    const destOut = path.join(outScenarioDir, `${item.fase}${ext}`);
    const destProto = path.join(protoScenarioDir, `${item.fase}${ext}`);

    fs.copyFileSync(srcPath, destPublic);
    fs.copyFileSync(srcPath, destOut);
    fs.copyFileSync(srcPath, destProto);

    processedItems.push({ ...item, status: 'Copiado com sucesso', src: item.file });
    console.log(`[OK] Cenario: ${item.cenario} | Fase: ${item.fase} <- Arquivo: ${item.file}`);
  } else {
    missingCount++;
    processedItems.push({ ...item, status: 'PENDENTE / FALTANDO', src: item.file });
    console.warn(`[FALTANDO] ${item.file} para ${item.cenario} / ${item.fase}`);
  }
});

// Layout Alvo
const layoutAlvoSrc = path.join(SOURCE_DIR, 'facção (crise).jfif');
const layoutAlvoDestDocs = path.join(DOCS_REF_DIR, 'layout-alvo.png');
const layoutAlvoDestOut = path.join(OUT_DIR, 'layout-alvo.png');

if (fs.existsSync(layoutAlvoSrc)) {
  fs.copyFileSync(layoutAlvoSrc, layoutAlvoDestDocs);
  fs.copyFileSync(layoutAlvoSrc, layoutAlvoDestOut);
  console.log('[OK] Layout alvo copiado para docs/referencia/ e EcoCity-saida/');
}

const readmeContent = `# EcoCity - Relatorio de Mapeamento de Imagens (Drive.zip)
Gerado em: ${new Date().toISOString()}

## 1. Conteudo do Drive.zip
${fileList.map(f => `- ${f}`).join('\n')}

## 2. Tabela de Mapeamento (Arquivo Original -> Papel / Cenario / Fase)
| Cenario | Fase | Arquivo Original | Status |
|---|---|---|---|
${processedItems.map(i => `| ${i.cenario} | ${i.fase} | ${i.src} | ${i.status} |`).join('\n')}

## 3. Imagens Faltantes
- Total de itens ausentes: ${missingCount}
${missingCount === 0 ? 'Nenhuma imagem faltando. Cobertura completa de todos os 6 cenarios x 3 fases.' : 'Existem itens pendentes.'}
`;

fs.writeFileSync(path.join(OUT_DIR, 'README.md'), readmeContent, 'utf8');
fs.writeFileSync(path.join(OUT_DIR, 'relatorio-pendencias.md'), readmeContent, 'utf8');

console.log('Saidas gravadas em:', OUT_DIR);
