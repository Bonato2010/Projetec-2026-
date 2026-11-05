const https = require('https');

const url = 'https://mapadeconflitos.ensp.fiocruz.br/conflito/rj-em-defesa-da-vida-e-da-memoria-moradores-de-realengo-lutam-pela-criacao-do-parque-100-verde-em-area-da-antiga-fabrica-de-cartuchos/';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const imgMatches = [...data.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log('Total img tags:', imgMatches.length);
    imgMatches.forEach(src => console.log('IMG:', src));
  });
}).on('error', err => console.error(err));
