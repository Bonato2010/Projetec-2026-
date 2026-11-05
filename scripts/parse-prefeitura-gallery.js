const https = require('https');

const url = 'https://prefeitura.rio/parques-e-jardins/galeria-de-fotos-veja-imagens-do-parque-realengo-susana-naspolini/';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    // Find all image tags or links inside entry-content
    const matches = [...data.matchAll(/https:\/\/prefeitura\.rio\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\/[^"'\s<>]+\.(jpg|jpeg|png)/gi)].map(m => m[0]);
    const unique = [...new Set(matches)];
    console.log('Unique images in post:');
    unique.forEach(u => console.log(u));
  });
}).on('error', err => console.error(err));
