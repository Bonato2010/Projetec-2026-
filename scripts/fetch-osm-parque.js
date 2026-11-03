const https = require('https');
const fs = require('fs');
const path = require('path');

// Query Overpass API for Parque Realengo
const query = `
[out:json][timeout:25];
(
  nwr["name"~"Parque Realengo|Susana Naspolini|Fábrica de Cartuchos",i](-22.89,-43.45,-22.87,-43.41);
  nwr["leisure"="park"](-22.883,-43.438,-22.875,-43.425);
);
out body;
>;
out skel qt;
`;

console.log('Querying Overpass API...');
const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

const req = https.get(url, { headers: { 'User-Agent': 'Antigravity/1.0 (Research)' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Overpass results:', json.elements ? json.elements.length : 0);
      const outPath = path.resolve(__dirname, 'osm-parque.json');
      fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
      console.log('Saved to:', outPath);
      
      // Filter elements
      if (json.elements) {
        const named = json.elements.filter(e => e.tags && (e.tags.name || e.tags.leisure));
        console.log('Named/Leisure elements found:');
        named.forEach(e => console.log(`- [${e.type} ${e.id}] ${e.tags.name || 'unnamed'} (tags: ${JSON.stringify(e.tags)})`));
      }
    } catch (e) {
      console.error('Failed to parse Overpass response:', e, data.substring(0, 300));
    }
  });
});

req.on('error', err => console.error('HTTP error:', err));
