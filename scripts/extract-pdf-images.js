const fs = require('fs');
const path = require('path');

const pdfPath = path.resolve(__dirname, '../downloads_temp/catalogo-BIA-SP.pdf');
const outDir = path.resolve(__dirname, '../site-informativo/assets/fotos-reais/pdf-extractions');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

console.log('Lendo PDF:', pdfPath);
const buffer = fs.readFileSync(pdfPath);
console.log('Tamanho do buffer:', buffer.length);

// Procura por assinaturas JPEG no PDF: \xFF\xD8\xFF ... \xFF\xD9
let count = 0;
let pos = 0;

while (pos < buffer.length - 4) {
  if (buffer[pos] === 0xFF && buffer[pos + 1] === 0xD8 && buffer[pos + 2] === 0xFF) {
    // Início de JPEG encontrado
    const start = pos;
    let end = pos + 2;
    while (end < buffer.length - 1) {
      if (buffer[end] === 0xFF && buffer[end + 1] === 0xD9) {
        end += 2;
        break;
      }
      end++;
    }
    const jpegLen = end - start;
    if (jpegLen > 10000) { // Ignora ícones minúsculos menores que 10KB
      count++;
      const imgBuffer = buffer.subarray(start, end);
      const outPath = path.join(outDir, `pdf_img_${count.toString().padStart(2, '0')}.jpg`);
      fs.writeFileSync(outPath, imgBuffer);
      console.log(`Imagem extraída: ${path.basename(outPath)} (${imgBuffer.length} bytes)`);
    }
    pos = end;
  } else {
    pos++;
  }
}

console.log(`Total de imagens JPEG extraídas do PDF: ${count}`);
