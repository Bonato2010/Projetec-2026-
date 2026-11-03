const https = require('https');
const fs = require('fs');
const path = require('path');

// Query Overpass for full way 681694032 and all features inside its bounding box
const query = `
[out:json][timeout:30];
(
  way(681694032);
  >;
);
out body;
>;
out skel qt;
`;

console.log('Querying Overpass for way 681694032 nodes...');
const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

https.get(url, { headers: { 'User-Agent': 'Antigravity/1.0 (Research)' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Way elements count:', json.elements.length);
      fs.writeFileSync(path.resolve(__dirname, 'osm-way-681694032.json'), JSON.stringify(json, null, 2));

      // Extract node coordinates
      const nodes = {};
      json.elements.filter(e => e.type === 'node').forEach(n => {
        nodes[n.id] = { lat: n.lat, lon: n.lon };
      });
      const way = json.elements.find(e => e.type === 'way' && e.id === 681694032);
      if (way && way.nodes) {
        const coords = way.nodes.map(nid => nodes[nid]).filter(Boolean);
        console.log(`Perimeter nodes: ${coords.length}`);
        console.log('First 5 coords:', coords.slice(0, 5));
        
        // Calculate center
        const centerLat = coords.reduce((acc, c) => acc + c.lat, 0) / coords.length;
        const centerLon = coords.reduce((acc, c) => acc + c.lon, 0) / coords.length;
        console.log(`Center: lat=${centerLat}, lon=${centerLon}`);
        
        // Convert to local meters (x = east, z = south)
        // 1 deg lat ≈ 111132 m, 1 deg lon ≈ 111132 * cos(lat) m
        const latM = 111132;
        const lonM = 111132 * Math.cos(centerLat * Math.PI / 180);
        
        const localPerimeter = coords.map(c => {
          const x = (c.lon - centerLon) * lonM;
          const z = -(c.lat - centerLat) * latM; // south is +z
          return [Math.round(x * 10) / 10, Math.round(z * 10) / 10];
        });
        
        console.log('Local perimeter in meters:');
        console.log(JSON.stringify(localPerimeter));
        
        // Calculate polygon area
        let area = 0;
        for (let i = 0; i < localPerimeter.length - 1; i++) {
          area += localPerimeter[i][0] * localPerimeter[i+1][1] - localPerimeter[i+1][0] * localPerimeter[i][1];
        }
        area = Math.abs(area) / 2;
        console.log(`Real Area: ${Math.round(area)} m² (~${(area/10000).toFixed(2)} hectares)`);
        
        fs.writeFileSync(path.resolve(__dirname, 'real-perimeter.json'), JSON.stringify({
          center: { lat: centerLat, lon: centerLon },
          areaM2: Math.round(area),
          coords,
          localPerimeter
        }, null, 2));
      }
    } catch (e) {
      console.error('Error:', e);
    }
  });
}).on('error', e => console.error(e));
