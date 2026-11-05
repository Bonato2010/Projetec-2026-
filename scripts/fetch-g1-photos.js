const https = require('https');

const url = 'https://g1.globo.com/rj/rio-de-janeiro/noticia/2024/06/15/parque-realengo-susana-naspolini-e-inaugurado-na-zona-oeste-do-rio.ghtml';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const glbMatches = [...data.matchAll(/https:\/\/[^"'\s<>]+glbimg\.com\/[^"'\s<>]+/gi)].map(m => m[0]);
    console.log('Total glbimg matches:', glbMatches.length);
    glbMatches.slice(0, 10).forEach(src => console.log('GLBIMG:', src));
  });
}).on('error', err => console.error(err));
