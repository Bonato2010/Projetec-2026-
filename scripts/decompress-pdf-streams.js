const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const pdfPath = path.resolve(__dirname, '../downloads_temp/catalogo-BIA-SP.pdf');
const buffer = fs.readFileSync(pdfPath);
console.log('Tamanho PDF:', buffer.length);

const outImgDir = path.resolve(__dirname, '../site-informativo/assets/fotos-reais');
if (!fs.existsSync(outImgDir)) fs.mkdirSync(outImgDir, { recursive: true });

let searchPos = 0;
let streamCount = 0;
let realengoMentions = 0;

while (searchPos < buffer.length) {
  const streamIdx = buffer.indexOf('stream\r\n', searchPos);
  const streamIdx2 = buffer.indexOf('stream\n', searchPos);
  let start = -1;
  let offset = 7;
  if (streamIdx !== -1 && (streamIdx2 === -1 || streamIdx <= streamIdx2)) {
    start = streamIdx;
    offset = 8;
  } else if (streamIdx2 !== -1) {
    start = streamIdx2;
    offset = 7;
  }

  if (start === -1) break;

  const end = buffer.indexOf('endstream', start + offset);
  if (end === -1) break;

  const rawStream = buffer.subarray(start + offset, end);
  streamCount++;

  // Tenta descompactar como zlib
  try {
    const uncompressed = zlib.inflateSync(rawStream);
    const text = uncompressed.toString('utf8');
    if (text.includes('Realengo')) {
      realengoMentions++;
      console.log(`\n--- Mention ${realengoMentions} in stream ${streamCount} ---`);
      const clean = text.replace(/[^\x20-\x7E\xC0-\xFF\n\r]/g, ' ').slice(0, 1000);
      console.log(clean);
    }
  } catch (e) {
    // Pode ser imagem direta (JPEG ou raw)
    if (rawStream.length > 50000 && rawStream[0] === 0xFF && rawStream[1] === 0xD8) {
      const imgPath = path.join(outImgDir, `pdf_stream_${streamCount}.jpg`);
      fs.writeFileSync(imgPath, rawStream);
      console.log(`Extraído JPEG direto do stream ${streamCount}: ${rawStream.length} bytes`);
    }
  }

  searchPos = end + 9;
}

console.log(`Concluído! ${streamCount} streams analisados. Menções a Realengo: ${realengoMentions}`);
