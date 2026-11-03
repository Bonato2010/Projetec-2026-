const http = require('http');

async function testEndpoint() {
  // Start server on port 3088
  process.env.PORT = '3088';
  require('../server.js');

  await new Promise(r => setTimeout(r, 1200));

  function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: '127.0.0.1',
        port: 3088,
        path,
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {}
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, json: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });
      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  console.log('Testing /api/network-info...');
  const netInfo = await request('GET', '/api/network-info');
  console.log('NetInfo:', netInfo.status, netInfo.json.ip, netInfo.json.mobile3dUrl);

  console.log('Testing GET /api/ranking...');
  const getRank = await request('GET', '/api/ranking');
  console.log('Ranking Count:', getRank.json.length, 'Top participant:', getRank.json[0]?.nome);

  console.log('Testing POST /api/ranking...');
  const postRank = await request('POST', '/api/ranking', {
    nome: 'Aluno Teste Projetec',
    avatar: '⚡',
    modo: 'Quiz de Sustentabilidade',
    categoria: 'Sustentabilidade',
    dificuldade: 'Médio',
    acertos: 20,
    totalQuestoes: 20,
    notaFinal: '10.0',
    tempoSegundos: 110,
    tempoFormatado: '01m 50s'
  });
  console.log('POST Ranking:', postRank.status, 'Success:', postRank.json.success, 'New Count:', postRank.json.ranking.length);

  // Check that new participant is in top rank
  const top1 = postRank.json.ranking[0];
  console.log('New #1 Leader:', top1.nome, 'Nota:', top1.notaFinal, 'Tempo:', top1.tempoFormatado);

  process.exit(0);
}

testEndpoint().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
