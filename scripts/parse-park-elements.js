const fs = require('fs');
const path = require('path');

const bbox = JSON.parse(fs.readFileSync('scripts/osm-bbox.json'));
const perimeterInfo = JSON.parse(fs.readFileSync('scripts/real_perimeter.json'));
const { centerLat, centerLon } = perimeterInfo;

const latM = 111132;
const lonM = 111132 * Math.cos(centerLat * Math.PI / 180);

function toLocal(lat, lon) {
  const x = (lon - centerLon) * lonM;
  const z = -(lat - centerLat) * latM;
  return [Math.round(x * 10) / 10, Math.round(z * 10) / 10];
}

const nodes = {};
bbox.elements.filter(e => e.type === 'node').forEach(n => {
  nodes[n.id] = { lat: n.lat, lon: n.lon, tags: n.tags || {} };
});

console.log('--- TOWERS ---');
bbox.elements.filter(e => e.tags && (e.tags.man_made === 'tower' || (e.tags.tourism === 'artwork' && e.tags.artwork_type === 'installation'))).forEach(t => {
  const [x, z] = toLocal(t.lat, t.lon);
  console.log(`Tower node ${t.id} at [x=${x}, z=${z}]:`, t.tags);
});

console.log('\n--- AMENITIES & LEISURE ---');
bbox.elements.filter(e => e.tags && (e.tags.amenity || e.tags.leisure || e.tags.sport || e.tags.building || e.tags.theatre)).forEach(item => {
  let pos = null;
  if (item.type === 'node') {
    pos = toLocal(item.lat, item.lon);
  } else if (item.type === 'way' && item.nodes) {
    const coords = item.nodes.map(id => nodes[id]).filter(Boolean);
    if (coords.length > 0) {
      const avgLat = coords.reduce((a, c) => a + c.lat, 0) / coords.length;
      const avgLon = coords.reduce((a, c) => a + c.lon, 0) / coords.length;
      pos = toLocal(avgLat, avgLon);
    }
  }
  if (pos && Math.abs(pos[0]) < 250 && Math.abs(pos[1]) < 300) {
    console.log(`[${item.type} ${item.id}] ${item.tags.name || 'unnamed'} at [x=${pos[0]}, z=${pos[1]}]:`, JSON.stringify(item.tags));
  }
});

console.log('\n--- HIGHWAYS / PATHS INSIDE PARK ---');
bbox.elements.filter(e => e.type === 'way' && e.tags && e.tags.highway).forEach(w => {
  const coords = w.nodes.map(id => nodes[id]).filter(Boolean);
  if (coords.length > 0) {
    const avgLat = coords.reduce((a, c) => a + c.lat, 0) / coords.length;
    const avgLon = coords.reduce((a, c) => a + c.lon, 0) / coords.length;
    const [x, z] = toLocal(avgLat, avgLon);
    if (Math.abs(x) < 220 && Math.abs(z) < 280) {
      console.log(`Way ${w.id} (${w.tags.highway}, name: ${w.tags.name || 'unnamed'}) avg [x=${x}, z=${z}], nodes: ${coords.length}`);
    }
  }
});
