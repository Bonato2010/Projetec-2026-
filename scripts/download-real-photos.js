const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../site-informativo/assets/fotos-reais');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const photos = [
  {
    url: 'https://prefeitura.rio/wp-content/uploads/2024/06/Vista-aerea-do-parque.jpg',
    filename: '01_real_vista_aerea_parque_prefeitura.jpg',
    title: 'Vista aérea do Parque Realengo Susana Naspolini',
    source: 'Prefeitura da Cidade do Rio de Janeiro / Foto: Prefeitura'
  },
  {
    url: 'https://prefeitura.rio/wp-content/uploads/2024/06/Torres-de-agua.jpg',
    filename: '02_real_torres_de_agua_nevoa.jpg',
    title: 'Super-Torres de névoa e climatização em funcionamento',
    source: 'Prefeitura da Cidade do Rio de Janeiro / Foto: Prefeitura'
  },
  {
    url: 'https://prefeitura.rio/wp-content/uploads/2024/06/Area-aquatica-para-as-criancas.jpg',
    filename: '03_real_area_aquatica_criancas.jpg',
    title: 'Área aquática infantil e splash pad no Parque Realengo',
    source: 'Prefeitura da Cidade do Rio de Janeiro / Foto: Prefeitura'
  },
  {
    url: 'https://prefeitura.rio/wp-content/uploads/2024/06/Pista-de-skate.jpg',
    filename: '04_real_pista_skatepark.jpg',
    title: 'Pista de skate e bowls públicos em uso',
    source: 'Prefeitura da Cidade do Rio de Janeiro / Foto: Prefeitura'
  },
  {
    url: 'https://prefeitura.rio/wp-content/uploads/2024/06/Area-de-descanso.jpg',
    filename: '05_real_area_descanso_arborizacao.jpg',
    title: 'Área de convivência e arborização da Mata Atlântica',
    source: 'Prefeitura da Cidade do Rio de Janeiro / Foto: Prefeitura'
  },
  {
    url: 'https://prefeitura.rio/wp-content/uploads/2024/06/Nave-do-Conhecimento.jpg',
    filename: '06_real_nave_do_conhecimento_fachada.jpg',
    title: 'Fachada da Nave do Conhecimento Realengo',
    source: 'Prefeitura da Cidade do Rio de Janeiro / Foto: Prefeitura'
  },
  {
    url: 'https://prefeitura.rio/wp-content/uploads/2024/06/Computadores-na-Nave-do-Conhecimento.jpg',
    filename: '07_real_nave_conhecimento_interior.jpg',
    title: 'Interior e inclusão digital na Nave do Conhecimento',
    source: 'Prefeitura da Cidade do Rio de Janeiro / Foto: Prefeitura'
  },
  {
    url: 'https://prefeitura.rio/wp-content/uploads/2024/06/Mural-com-o-nome-da-jornalista.jpg',
    filename: '08_real_mural_susana_naspolini.jpg',
    title: 'Mural e homenagem à jornalista Susana Naspolini',
    source: 'Prefeitura da Cidade do Rio de Janeiro / Foto: Prefeitura'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Escola_Militar_do_Realengo_equita%C3%A7%C3%A3o.jpg',
    filename: '00_historico_realengo_militar_1914.jpg',
    title: 'Complexo Militar de Realengo (Arquivo Nacional, 1914)',
    source: 'Arquivo Nacional do Brasil / Fundo Correio da Manhã'
  }
];

async function downloadAll() {
  for (const item of photos) {
    const dest = path.join(targetDir, item.filename);
    console.log(`Baixando: ${item.filename} de ${item.url}...`);
    try {
      await downloadFile(item.url, dest);
      const stat = fs.statSync(dest);
      console.log(`-> Salvo com sucesso (${stat.size} bytes)`);
    } catch (e) {
      console.error(`Erro ao baixar ${item.filename}:`, e.message);
    }
  }
  console.log('Download de fotos reais concluído!');
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });
    req.on('error', reject);
  });
}

downloadAll();
