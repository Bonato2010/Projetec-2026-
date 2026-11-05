const fs = require('fs');
const path = require('path');

const pdfPath = path.resolve(__dirname, '../downloads_temp/catalogo-BIA-SP.pdf');
const buffer = fs.readFileSync(pdfPath);
const text = buffer.toString('latin1');

const idx = text.indexOf('Realengo');
console.log('Indice Realengo no PDF:', idx);

if (idx !== -1) {
  const snippet = text.substring(Math.max(0, idx - 400), Math.min(text.length, idx + 1200));
  // Clean up printable text
  const cleanSnippet = snippet.replace(/[^\x20-\x7E\xC0-\xFF\n\r]/g, ' ');
  console.log('Snippet sobre Realengo:');
  console.log(cleanSnippet);
} else {
  console.log('Texto Realengo não encontrado em texto puro (pode estar em streams comprimidos).');
}
