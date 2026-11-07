/**
 * CENTRAL AUTOMÁTICA DE SCREENSHOTS
 * Captura automatizada de telas reais via navegador headless (Chrome / Edge)
 * Suporte a desktop (1440x900) e mobile (390x844) com execução de scripts e renderização completa.
 */

const cp = require('child_process');
const fs = require('fs');
const path = require('path');

// Diretórios
const BASE_DIR = path.resolve(__dirname);
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const SHOTS_DIR = path.join(BASE_DIR, 'screenshots');
const HISTORICO_DIR = path.join(SHOTS_DIR, 'historico');

// Detecta binário do Chrome ou Edge
function getBrowserBinary() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Nenhum navegador (Chrome ou Edge) encontrado no sistema.");
}

// Configuração das capturas para os três protótipos
const PROJETOS = [
  {
    id: "mapa-parque",
    nome: "Projeto 01 — Mapa Interativo do Parque Realengo",
    caminhoHtml: path.join(ROOT_DIR, 'prototipos', '01-mapa-parque', 'index.html'),
    capturas: [
      {
        id: "desktop-home",
        nome: "Visão Geral Desktop (1440 × 900)",
        descricao: "Página inicial com malha urbana de Realengo, perímetro do parque, lago e lista lateral de locais.",
        largura: 1440,
        altura: 900,
        queryParams: ""
      },
      {
        id: "desktop-poi-detail",
        nome: "Ponto de Interesse em Destaque",
        descricao: "Super-Torre Central 02 selecionada com halo de identificação e painel de detalhes aberto.",
        largura: 1440,
        altura: 900,
        queryParams: "?poi=super-torre-02"
      },
      {
        id: "desktop-filtro-natureza",
        nome: "Filtro de Bosques e Jardins",
        descricao: "Filtragem ativa por maciços florestais e espécies nativas da Mata Atlântica.",
        largura: 1440,
        altura: 900,
        queryParams: "?category=natureza"
      },
      {
        id: "mobile-home",
        nome: "Apresentação Mobile (390 × 844)",
        descricao: "Interface mobile vertical com visualização do mapa e controles táteis adaptados.",
        largura: 390,
        altura: 844,
        queryParams: ""
      },
      {
        id: "mobile-poi",
        nome: "Mobile com Detalhe do Lago",
        descricao: "Visualização adaptada para smartphone com drawer do Espelho D'água aberto.",
        largura: 390,
        altura: 844,
        queryParams: "?poi=espelho-dagua"
      }
    ]
  },
  {
    id: "painel-ambiental",
    nome: "Projeto 02 — Central de Monitoramento Ambiental V.I.D.A.",
    caminhoHtml: path.join(ROOT_DIR, 'prototipos', '02-painel-ambiental', 'index.html'),
    capturas: [
      {
        id: "desktop-home",
        nome: "Painel Principal Desktop (1440 × 900)",
        descricao: "Header executivo, 4 KPIs em destaque, mapa microclimático com névoa e curva térmica 24h.",
        largura: 1440,
        altura: 900,
        queryParams: ""
      },
      {
        id: "desktop-modal-indicador",
        nome: "Modal Explicativo de Indicador Oficial",
        descricao: "Janela detalhada do indicador de 3.700 árvores, metodologia i-Tree e auditoria Data.rio.",
        largura: 1440,
        altura: 900,
        queryParams: "?modal=veg-arvores"
      },
      {
        id: "desktop-slider-comparador",
        nome: "Comparador Antes/Depois (Segunda Dobra)",
        descricao: "Slider interativo comparando 2021 com 2026, balanço hídrico, donut botânico e metas ODS.",
        largura: 1440,
        altura: 900,
        queryParams: "?view=slider&slider=50"
      },
      {
        id: "desktop-catalogo",
        nome: "Catálogo de Indicadores e Filtros",
        descricao: "Visualização do catálogo filtrado pela categoria Clima Urbano com selos de confiabilidade.",
        largura: 1440,
        altura: 900,
        queryParams: "?view=catalog&category=clima"
      },
      {
        id: "mobile-home",
        nome: "Painel Mobile (390 × 844)",
        descricao: "Layout em coluna única para smartphones, mantendo legibilidade e proporção dos gráficos.",
        largura: 390,
        altura: 844,
        queryParams: ""
      },
      {
        id: "mobile-modal",
        nome: "Mobile com Modal Explicativo",
        descricao: "Visualização do modal responsivo em celular com indicador de diferencial térmico (-5,8°C).",
        largura: 390,
        altura: 844,
        queryParams: "?modal=clima-diferencial-temp"
      }
    ]
  },
  {
    id: "simulador-drenagem",
    nome: "Projeto 03 — Simulador de Drenagem e Enchentes",
    caminhoHtml: path.join(ROOT_DIR, 'prototipos', '03-simulador-drenagem', 'index.html'),
    capturas: [
      {
        id: "desktop-home",
        nome: "Simulação Hidrodinâmica Normal (1440 × 900)",
        descricao: "Chuva moderada (50 mm/h) com SbN do parque operando, lago amortecendo volume e rua protegida.",
        largura: 1440,
        altura: 900,
        queryParams: "?rain=50&park=true"
      },
      {
        id: "desktop-tempestade-max",
        nome: "Tempestade Extrema (110 mm/h)",
        descricao: "Capacidade máxima de retenção pluvial do espelho d'água de 1.950 m³ em evento severo de verão.",
        largura: 1440,
        altura: 900,
        queryParams: "?rain=110&park=true"
      },
      {
        id: "desktop-sem-parque-alagamento",
        nome: "Cenário Crítico Sem o Parque (2021)",
        descricao: "Simulação com o solo impermeável anterior provocando alagamento crítico na via pública.",
        largura: 1440,
        altura: 900,
        queryParams: "?rain=70&park=false"
      },
      {
        id: "mobile-home",
        nome: "Simulação no Celular (390 × 844)",
        descricao: "Apresentação mobile da simulação hidrológica com sliders e métricas ajustados para toque.",
        largura: 390,
        altura: 844,
        queryParams: "?rain=50&park=true"
      }
    ]
  }
];

function executarCaptura(browserBin, url, outputPath, width, height) {
  return new Promise((resolve, reject) => {
    // Arquiva captura anterior se existir
    if (fs.existsSync(outputPath)) {
      const fileName = path.basename(outputPath);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(HISTORICO_DIR, `${timestamp}_${fileName}`);
      try {
        fs.copyFileSync(outputPath, backupPath);
      } catch (e) {}
    }

    const args = [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--force-device-scale-factor=1',
      `--window-size=${width},${height}`,
      `--screenshot=${outputPath}`,
      '--virtual-time-budget=3500',
      '--hide-scrollbars',
      url
    ];

    const proc = cp.spawn(browserBin, args);
    proc.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        if (stats.size > 15000) {
          resolve(stats.size);
        } else {
          reject(new Error(`Screenshot muito pequeno (${stats.size} bytes), possível falha de renderização.`));
        }
      } else {
        reject(new Error(`Navegador finalizou com código ${code} ou arquivo não gerado.`));
      }
    });
  });
}

async function run() {
  console.log("==================================================");
  console.log("🚀 CENTRAL AUTOMÁTICA DE SCREENSHOTS — PROJETEC 2026");
  console.log("==================================================\n");

  const browserBin = getBrowserBinary();
  console.log(`Navegador detectado: ${browserBin}`);

  // Garante diretórios
  fs.mkdirSync(HISTORICO_DIR, { recursive: true });

  const metadata = {
    geradoEm: new Date().toISOString(),
    geradoEmFormatado: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    navegador: path.basename(browserBin),
    projetos: []
  };

  let totalCapturas = 0;

  for (const proj of PROJETOS) {
    console.log(`\n📁 Processando: ${proj.nome}`);
    const projDir = path.join(SHOTS_DIR, proj.id);
    fs.mkdirSync(projDir, { recursive: true });

    if (!fs.existsSync(proj.caminhoHtml)) {
      console.error(`❌ Erro: Arquivo HTML não encontrado em ${proj.caminhoHtml}`);
      continue;
    }

    const projMeta = {
      id: proj.id,
      nome: proj.nome,
      caminhoHtmlRelativo: `../../prototipos/${proj.id === 'mapa-parque' ? '01-mapa-parque' : (proj.id === 'painel-ambiental' ? '02-painel-ambiental' : '03-simulador-drenagem')}/index.html`,
      capturas: []
    };

    for (const cap of proj.capturas) {
      const fileName = `${cap.id}.png`;
      const outputPath = path.join(projDir, fileName);
      const url = `file:///${proj.caminhoHtml.replace(/\\/g, '/')}${cap.queryParams}`;

      process.stdout.write(`  📸 Capturando [${cap.largura}×${cap.altura}] ${cap.nome}... `);

      try {
        const sizeBytes = await executarCaptura(browserBin, url, outputPath, cap.largura, cap.altura);
        const sizeKb = Math.round(sizeBytes / 1024);
        console.log(`OK (${sizeKb} KB)`);

        projMeta.capturas.push({
          id: cap.id,
          nome: cap.nome,
          descricao: cap.descricao,
          arquivo: `screenshots/${proj.id}/${fileName}`,
          largura: cap.largura,
          altura: cap.altura,
          tamanhoBytes: sizeBytes,
          tamanhoKb: sizeKb,
          dataHora: metadata.geradoEmFormatado
        });
        totalCapturas++;
      } catch (err) {
        console.log(`FALHOU: ${err.message}`);
      }
    }

    metadata.projetos.push(projMeta);
  }

  // Grava o arquivo de manifesto metadata.json
  const metaPath = path.join(BASE_DIR, 'screenshots-manifest.json');
  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf8');

  // Grava também como um script JS para funcionar 100% offline via file:// sem restrições de CORS do fetch!
  const jsDataPath = path.join(BASE_DIR, 'js', 'manifest-data.js');
  fs.writeFileSync(jsDataPath, `const SCREENSHOTS_MANIFEST = ${JSON.stringify(metadata, null, 2)};`, 'utf8');

  console.log("\n==================================================");
  console.log(`✨ Concluído com sucesso! Total de screenshots gerados: ${totalCapturas}`);
  console.log(`📄 Manifesto salvo em: ${metaPath}`);
  console.log("==================================================");
}

run().catch(err => {
  console.error("Erro fatal na execução da captura:", err);
  process.exit(1);
});
