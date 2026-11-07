const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ECO_SAIDA = path.join(ROOT_DIR, 'EcoCity-saida');
const PREVIEW_DIR = path.join(ROOT_DIR, 'preview');

if (!fs.existsSync(ECO_SAIDA)) {
  fs.mkdirSync(ECO_SAIDA, { recursive: true });
}

// Copiar capturas para EcoCity-saida
if (fs.existsSync(path.join(PREVIEW_DIR, 'depois.png'))) {
  fs.copyFileSync(path.join(PREVIEW_DIR, 'depois.png'), path.join(ECO_SAIDA, 'depois.png'));
}
if (fs.existsSync(path.join(PREVIEW_DIR, 'antes.png'))) {
  fs.copyFileSync(path.join(PREVIEW_DIR, 'antes.png'), path.join(ECO_SAIDA, 'antes.png'));
}

// Criar README em EcoCity-saida
const readmeContent = `# ECO-CITY — RELATÓRIO FINAL E SAÍDAS DO STAND (PROJETEC 2026)

Este diretório contém todas as evidências, relatórios, mapeamentos de imagens e capturas de tela do projeto EcoCity (Gêmeo Digital Carioca & Central Multitela).

## Conteúdo da Pasta
1. **MAPEAMENTO-IMAGENS.md**: Tabela completa de mapeamento de todas as imagens extraídas da pasta Drive-extraido para os 6 cenários oficiais e 3 fases (crise, resposta, recuperação).
2. **depois.png / antes.png**: Capturas de tela da interface da TV (1920x1080) validando a nova faixa inferior compacta (~13%), logo do grupo, eliminação de nuvens translúcidas, grade de impactos 2x2 e controle de estado de lotação (Partida Cheia / QR Code).

## Como Executar o Sistema Localmente
1. Instale as dependências:
   \`\`\`powershell
   npm install
   \`\`\`
2. Inicie o servidor local:
   \`\`\`powershell
   npm start
   \`\`\`
3. Acesse no navegador:
   - **Central da TV:** http://localhost:3000/
   - **Tela 2 (Protótipo Pixel Art 2D):** http://localhost:3000/pixel-art-2d/
   - **Portal Bio Nova:** http://localhost:3000/site-informativo/

PROJETEC 2026 • PARQUE REALENGO
`;

fs.writeFileSync(path.join(ECO_SAIDA, 'README.md'), readmeContent, 'utf8');
console.log('EcoCity-saida finalizada com sucesso em:', ECO_SAIDA);
