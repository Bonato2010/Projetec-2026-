const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rankingFile = fs.existsSync(path.join(process.cwd(), 'site', 'data', 'ranking.json'))
    ? path.join(process.cwd(), 'site', 'data', 'ranking.json')
    : path.join(process.cwd(), 'data', 'ranking.json');
  let ranking = [];
  if (fs.existsSync(rankingFile)) {
    try {
      ranking = JSON.parse(fs.readFileSync(rankingFile, 'utf8'));
    } catch (e) {
      ranking = [];
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json(ranking);
  }

  if (req.method === 'POST') {
    const newRecord = req.body || {};
    if (!newRecord.nome) {
      return res.status(400).json({ error: 'Nome obrigatório' });
    }
    const record = {
      id: newRecord.id || `rank_${Date.now()}`,
      nome: String(newRecord.nome).slice(0, 32),
      avatar: newRecord.avatar || '🌱',
      modo: newRecord.modo || 'Sustentabilidade',
      categoria: newRecord.categoria || 'Sustentabilidade',
      dificuldade: newRecord.dificuldade || 'Médio',
      acertos: Number(newRecord.acertos) || 0,
      totalQuestoes: Number(newRecord.totalQuestoes) || 20,
      notaFinal: String(newRecord.notaFinal || '0.0'),
      tempoSegundos: Number(newRecord.tempoSegundos) || 0,
      tempoFormatado: newRecord.tempoFormatado || '00m 00s',
      data: new Date().toLocaleDateString('pt-BR'),
      timestamp: Date.now()
    };
    ranking.push(record);
    ranking.sort((a, b) => {
      const diff = parseFloat(b.notaFinal) - parseFloat(a.notaFinal);
      if (Math.abs(diff) > 0.01) return diff;
      return a.tempoSegundos - b.tempoSegundos;
    });
    return res.status(200).json({ success: true, ranking: ranking.slice(0, 150), added: record });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
