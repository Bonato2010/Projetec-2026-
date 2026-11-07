const fs = require('fs');

const content = fs.readFileSync('site/js/quiz-questions.js', 'utf8');
const window = {};
eval(content);

const db = window.QUIZ_DATABASE;
let totalQuestions = 0;
const ids = new Set();
const duplicateIds = [];
const missingExplanation = [];
const invalidCorrect = [];
const duplicateOptions = [];
const lengthBias = [];

for (const cat in db) {
  for (const diff in db[cat]) {
    const list = db[cat][diff];
    list.forEach((q, idx) => {
      totalQuestions++;

      // 1. Checar ID duplicado
      if (ids.has(q.id)) {
        duplicateIds.push(q.id);
      } else {
        ids.add(q.id);
      }

      // 2. Checar índice correto
      if (typeof q.correta !== 'number' || q.correta < 0 || q.correta >= q.opcoes.length) {
        invalidCorrect.push({ id: q.id, correta: q.correta, totalOptions: q.opcoes.length });
      }

      // 3. Checar opções duplicadas
      const uniqueOpts = new Set(q.opcoes);
      if (uniqueOpts.size !== q.opcoes.length) {
        duplicateOptions.push(q.id);
      }

      // 4. Checar explicação
      if (!q.explicacao || q.explicacao.trim().length < 15) {
        missingExplanation.push(q.id);
      }

      // 5. Checar viés de tamanho da alternativa correta (> 2x a média das outras)
      const correctLen = q.opcoes[q.correta] ? q.opcoes[q.correta].length : 0;
      const otherLens = q.opcoes.filter((_, i) => i !== q.correta).map(o => o.length);
      const avgOthers = otherLens.reduce((a, b) => a + b, 0) / otherLens.length;
      if (correctLen > avgOthers * 2.2 && correctLen > 70) {
        lengthBias.push({ id: q.id, correctLen, avgOthers: Math.round(avgOthers) });
      }
    });
  }
}

console.log('=== AUDITORIA DO BANCO DE QUESTÕES ===');
console.log('Total de questões avaliadas:', totalQuestions);
console.log('IDs únicos:', ids.size);
console.log('IDs duplicados:', duplicateIds.length, duplicateIds);
console.log('Gabaritos inválidos:', invalidCorrect.length, invalidCorrect);
console.log('Opções duplicadas:', duplicateOptions.length, duplicateOptions);
console.log('Explicações ausentes/curtas:', missingExplanation.length, missingExplanation);
console.log('Questões com viés de tamanho excessivo na correta:', lengthBias.length);
if (lengthBias.length > 0) {
  console.log('Exemplos de viés de tamanho:', lengthBias.slice(0, 5));
}
