const https = require('https');
const fs = require('fs');
const path = require('path');

const query = `
[out:json][timeout:30];
(
  way(-22.886,-43.437,-22.879,-43.429);
  node(-22.886,-43.437,-22.879,-43.429);
  relation(-22.886,-43.437,-22.879,-43.429);
);
out body;
>;
out skel qt;
`;

const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
https.get(url, { headers: { 'User-Agent': 'Antigravity/1.0 (Research)' } }, (res) => {
  let d = '';
  res.on('data', chunk => d += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(d);
      console.log('Total elements in bounding box:', json.elements.length);
      fs.writeFileSync('scripts/osm-bbox.json', JSON.stringify(json, null, 2));
      
      const waysWithTags = json.elements.filter(e => e.tags);
      console.log('Tagged elements count:', waysWithTags.length);
      
      const categories = {};
      waysWithTags.forEach(e => {
        Object.keys(e.tags).forEach(k => {
          categories[k] = (categories[k] || 0) + 1;
        });
      });
      console.log('Top tag keys:', categories);
      
      const interesting = waysWithTags.filter(e => 
        e.tags.leisure || e.tags.amenity || e.tags.building || e.tags.highway || e.tags.sport || e.tags.water || e.tags.man_made || e.tags.tourism
      );
      console.log('Interesting elements:', interesting.length);
      interesting.slice(0, 30).forEach(e => {
        console.log(`- [${e.type} ${e.id}] ${e.tags.name || ''} : ${JSON.stringify(e.tags)}`);
      });
    } catch (e) {
      console.error(e, d.substring(0, 200));
    }
  });
}).on('error', console.error);
