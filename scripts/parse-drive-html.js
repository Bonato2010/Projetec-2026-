const fs = require('fs');
const html = fs.readFileSync('scripts/drive_folder_raw.html', 'utf-8');

const title = html.match(/<title>([^<]+)<\/title>/);
console.log('Title:', title ? title[1] : 'none');

// Look for patterns like .txt, .md, .png, .jpg, .jfif or folder names
const matches = html.match(/[^"'\n\r\t\\]{1,80}\.(md|txt|png|jpg|jfif|jpeg|pdf|zip|docx|xlsx)/gi);
console.log('File-like patterns:', [...new Set(matches)]);

// Search for any occurrence of CONEXAO, PIXEL, QUIZ, ECOCITY, VERCEL, RESULTADOS
const terms = ['CONEXAO', 'PIXEL', 'QUIZ', 'ECOCITY', 'VERCEL', 'RESULTADOS', 'Resultados', 'Relatorios', 'Relatórios', 'Realengo'];
terms.forEach(t => {
  const count = (html.match(new RegExp(t, 'gi')) || []).length;
  console.log(`Term "${t}": ${count} matches`);
});

// Let's find any text chunks containing these terms
const lines = html.split('\n');
console.log('Total lines:', lines.length);
