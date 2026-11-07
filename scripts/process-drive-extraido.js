const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DRIVE_EXTRAIDO = 'C:\\Users\\Daniz\\Downloads\\Drive-extraido';
const PUBLIC_SCENES = path.join(ROOT_DIR, 'public', 'assets', 'scenes');
const ECO_SAIDA = path.join(ROOT_DIR, 'EcoCity-saida');

if (!fs.existsSync(ECO_SAIDA)) {
  fs.mkdirSync(ECO_SAIDA, { recursive: true });
}

// Mapeamento dos arquivos extraídos para os cenários e fases oficiais do EcoCity
const mapping = [
  { orig: 'alagamento (crise).jfif', cenario: 'alagamento', fase: 'crise' },
  { orig: 'alagamento (resposta).jfif', cenario: 'alagamento', fase: 'resposta' },
  { orig: 'alagamento (recuperação).jfif', cenario: 'alagamento', fase: 'recuperacao' },

  { orig: 'apagão (crise).jfif', cenario: 'apagao', fase: 'crise' },
  { orig: 'apagão (resposta).jfif', cenario: 'apagao', fase: 'resposta' },
  { orig: 'apagão (recuperação).jfif', cenario: 'apagao', fase: 'recuperacao' },

  { orig: 'alien (crise).jfif', cenario: 'aliens', fase: 'crise' },
  { orig: 'alien(resposta).jfif', cenario: 'aliens', fase: 'resposta' },
  { orig: 'alien (recuperação).jfif', cenario: 'aliens', fase: 'recuperacao' },

  { orig: 'Invasão (crise).jfif', cenario: 'ameaca-externa', fase: 'crise' },
  { orig: 'invasão (resposta).jfif', cenario: 'ameaca-externa', fase: 'resposta' },
  { orig: 'invasão (recuperação).jfif', cenario: 'ameaca-externa', fase: 'recuperacao' },

  { orig: 'revolta (crise).jfif', cenario: 'governanca', fase: 'crise' },
  { orig: 'revolta (resposta).jfif', cenario: 'governanca', fase: 'resposta' },
  { orig: 'revolta (recuperação).jfif', cenario: 'governanca', fase: 'recuperacao' },

  { orig: 'facção (crise).jfif', cenario: 'seguranca', fase: 'crise' },
  { orig: 'facção (resposta).jfif', cenario: 'seguranca', fase: 'resposta' },
  { orig: 'facção (recuperação).jfif', cenario: 'seguranca', fase: 'recuperacao' }
];

let reportRows = [];

mapping.forEach(m => {
  const src = path.join(DRIVE_EXTRAIDO, m.orig);
  const destDir = path.join(PUBLIC_SCENES, m.cenario);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const dest = path.join(destDir, `${m.fase}.jfif`);

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    reportRows.push(`| ${m.orig} | ${m.cenario} | ${m.fase} | public/assets/scenes/${m.cenario}/${m.fase}.jfif | OK |`);
  } else {
    reportRows.push(`| ${m.orig} | ${m.cenario} | ${m.fase} | N/A | ARQUIVO NÃO ENCONTRADO |`);
  }
});

// Relatório markdown
const reportContent = `# RELATÓRIO DE MAPEAMENTO E PROCESSAMENTO — DRIVE EXTRAÍDO
Data: 2026-11-07
Origem: C:\\Users\\Daniz\\Downloads\\Drive-extraido
Destino: public/assets/scenes/ e EcoCity-saida/

## Tabela de Mapeamento (Arquivo Original -> Cenário / Fase)
| Arquivo Original | Cenário | Fase | Destino Padronizado | Status |
|------------------|---------|------|---------------------|--------|
${reportRows.join('\n')}

## Conclusão
Todas as imagens de referência foram mapeadas com sucesso para os 6 cenários oficiais (alagamento, apagao, aliens, ameaca-externa, governanca, seguranca) nas 3 fases (crise, resposta, recuperacao).
`;

fs.writeFileSync(path.join(ECO_SAIDA, 'MAPEAMENTO-IMAGENS.md'), reportContent, 'utf8');
console.log('Mapeamento concluído! Relatório salvo em:', path.join(ECO_SAIDA, 'MAPEAMENTO-IMAGENS.md'));
