const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_DIR = path.join(ROOT, 'site');

let errors = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    errors++;
  } else {
    console.log(`✓ OK: ${message}`);
  }
}

console.log('--- TESTE DE COMPATIBILIDADE COM A VERCEL ---');

// 1. Validar site/vercel.json
const siteVercelJsonPath = path.join(SITE_DIR, 'vercel.json');
assert(fs.existsSync(siteVercelJsonPath), 'site/vercel.json existe');
if (fs.existsSync(siteVercelJsonPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(siteVercelJsonPath, 'utf8'));
    assert(config.cleanUrls === true, 'site/vercel.json cleanUrls ativado');
    assert(Array.isArray(config.rewrites), 'site/vercel.json possui array de rewrites');
    assert(Array.isArray(config.headers), 'site/vercel.json possui array de headers');
  } catch (e) {
    assert(false, `site/vercel.json inválido: ${e.message}`);
  }
}

// 2. Validar site/package.json
const sitePackageJsonPath = path.join(SITE_DIR, 'package.json');
assert(fs.existsSync(sitePackageJsonPath), 'site/package.json existe');
if (fs.existsSync(sitePackageJsonPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(sitePackageJsonPath, 'utf8'));
    assert(pkg.name === 'projetec-site-vida', 'site/package.json tem nome válido');
  } catch (e) {
    assert(false, `site/package.json inválido: ${e.message}`);
  }
}

// 3. Validar Serverless Functions em site/api
const siteRankingApiPath = path.join(SITE_DIR, 'api', 'ranking.js');
const siteNetInfoApiPath = path.join(SITE_DIR, 'api', 'network-info.js');
assert(fs.existsSync(siteRankingApiPath), 'site/api/ranking.js existe');
assert(fs.existsSync(siteNetInfoApiPath), 'site/api/network-info.js existe');

// 4. Testar handler da API ranking (simulação de mock Vercel req/res)
if (fs.existsSync(siteRankingApiPath)) {
  const rankingHandler = require(siteRankingApiPath);
  assert(typeof rankingHandler === 'function', 'site/api/ranking.js exporta função');
  
  // Simular GET
  let statusCode = 0;
  let responseData = null;
  const mockRes = {
    setHeader: () => {},
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => { responseData = data; return data; },
        end: () => {}
      };
    }
  };
  rankingHandler({ method: 'GET' }, mockRes);
  assert(statusCode === 200 && Array.isArray(responseData), 'site/api/ranking GET responde com 200 e array');
}

// 5. Validar site-informativo (Biotecnologia & Sustentabilidade)
const siteInfoIndex = path.join(ROOT, 'site-informativo', 'index.html');
const siteInfoCss = path.join(ROOT, 'site-informativo', 'css', 'styles.css');
const siteInfoJs = path.join(ROOT, 'site-informativo', 'js', 'app.js');
assert(fs.existsSync(siteInfoIndex), 'site-informativo/index.html existe');
assert(fs.existsSync(siteInfoCss), 'site-informativo/css/styles.css existe');
assert(fs.existsSync(siteInfoJs), 'site-informativo/js/app.js existe');

// 6. Validar que projetos 3D e Parque Suzana foram definitivamente encerrados
const siteParque3dIndex = path.join(SITE_DIR, 'parque3d');
assert(!fs.existsSync(siteParque3dIndex), 'site/parque3d foi definitivamente excluído');

// 7. Validar root vercel.json
const rootVercelJsonPath = path.join(ROOT, 'vercel.json');
assert(fs.existsSync(rootVercelJsonPath), 'vercel.json da raiz existe');
if (fs.existsSync(rootVercelJsonPath)) {
  try {
    const rootConfig = JSON.parse(fs.readFileSync(rootVercelJsonPath, 'utf8'));
    const rewrites = rootConfig.rewrites || [];
    const hasBioRewrite = rewrites.some(r => r.source === '/biotecnologia' && r.destination === '/site-informativo/index.html');
    const hasSustRewrite = rewrites.some(r => r.source === '/sustentabilidade' && r.destination === '/site-informativo/index.html');
    assert(hasBioRewrite, 'vercel.json possui rota /biotecnologia para o site informativo');
    assert(hasSustRewrite, 'vercel.json possui rota /sustentabilidade para o site informativo');
  } catch (e) {
    assert(false, `vercel.json da raiz inválido: ${e.message}`);
  }
}

console.log('--------------------------------------------');
if (errors === 0) {
  console.log('🎉 TODOS OS TESTES DE COMPATIBILIDADE PASSARAM!');
  process.exit(0);
} else {
  console.error(`🚨 ${errors} falhas encontradas.`);
  process.exit(1);
}
