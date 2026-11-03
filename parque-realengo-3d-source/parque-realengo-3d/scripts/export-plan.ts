/** Planta 2D da implantação PROVISÓRIA, gerada a partir dos dados (parkLayout/parkStructures/parkPaths). NÃO é captura da cena 3D. npm run plan */
import { PARK_PERIMETER, ENTRANCES } from '../src/data/parkLayout';
import { FOOTPRINTS, PAVED, WATER_POLY, GARDEN_BEDS } from '../src/data/parkStructures';
import { PATH_NODES, PATH_EDGES } from '../src/data/parkPaths';
import { getParkModel } from '../src/systems/parkModel';
import { placeVegetation } from '../src/systems/vegetationPlacement';
import { buildSurroundings } from '../src/systems/surroundings';
import { PLANNED_EXPANSION } from '../src/data/parkPhases';
import { writeFileSync, mkdirSync } from 'node:fs';
const m = getParkModel(), veg = placeVegetation(m,'high'), sur = buildSurroundings();
const P = (poly:number[][]) => poly.map(p=>p.join(',')).join(' ');
let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-360 -190 720 400" width="1800" height="1000"><rect x="-360" y="-190" width="720" height="400" fill="#e9e6dd"/>`;
s += `<polygon points="${P(sur.streetOuter)}" fill="#555"/><polygon points="${P(sur.sidewalkOuter)}" fill="#bbb"/>`;
for (const b of sur.blocks) s += `<rect x="${-b.w/2}" y="${-b.d/2}" width="${b.w}" height="${b.d}" fill="#c9b9a6" stroke="#8a7a68" stroke-width=".3" transform="translate(${b.cx} ${b.cz}) rotate(${b.rot*180/Math.PI})"/>`;
s += `<polygon points="${P(PARK_PERIMETER)}" fill="#8aa56b" stroke="#2d4a1f" stroke-width="1"/>`;
for (const p of PAVED) s += `<polygon points="${P(p.poly)}" fill="#cfcac0"/>`;
for (const b of GARDEN_BEDS) s += `<polygon points="${P(b.poly)}" fill="#7a5a3a"/>`;
s += `<polygon points="${P(WATER_POLY)}" fill="#6fa7bd"/>`;
for (const [a,b,w] of PATH_EDGES) { const A=PATH_NODES.find(n=>n.id===a)!.pos,B=PATH_NODES.find(n=>n.id===b)!.pos; s+=`<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="#d8d2c4" stroke-width="${w??3.5}"/>`; }
for (const f of FOOTPRINTS) if (f.kind!=='water') s += `<polygon points="${P(f.poly)}" fill="${f.kind==='sport'?'#4d7ea8':f.kind==='tower'?'#444':f.kind==='building'?'#b88':'#c9a66b'}" fill-opacity=".85" stroke="#222" stroke-width=".4"/><text x="${f.poly[0][0]}" y="${f.poly[0][1]-1}" font-size="4">${f.id}</text>`;
for (const w of m.walkways) s += `<polyline points="${P(w.mesh.centerline.map(c=>[c[0],c[2]]))}" fill="none" stroke="#e0a030" stroke-width="2.2"/>`;
for (const t of veg.trees) s += `<circle cx="${t.x}" cy="${t.z}" r="${2.2*t.scale}" fill="#2f6b2a" fill-opacity=".75"/>`;
for (const t of veg.shrubs) s += `<circle cx="${t.x}" cy="${t.z}" r="0.9" fill="#5a8f3a"/>`;
for (const e of ENTRANCES) s += `<circle cx="${e.pos[0]}" cy="${e.pos[1]}" r="3" fill="red"/>`;
s += `<polygon points="${P(PLANNED_EXPANSION.indicativeZone)}" fill="none" stroke="#c33" stroke-dasharray="4 3" stroke-width="1"/>`;
s += `</svg>`;
mkdirSync('docs', { recursive: true });
writeFileSync('docs/planta-provisoria.svg', s);
console.log('docs/planta-provisoria.svg');
