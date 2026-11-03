/**
 * Verificações executáveis em Node (sem navegador e sem Three.js):
 *   npm run verify
 * Cobrem a implantação provisória, a geometria paramétrica e o grafo de rotas.
 * NÃO substituem a inspeção visual no navegador.
 */
import { PARK_PERIMETER, ENTRANCES, LAYOUT_META } from '../src/data/parkLayout';
import { FOOTPRINTS, PAVED_FOOTPRINTS, TOWERS, TOTAL_NOZZLES_ANNOUNCED, POIS, SKATE, WALKWAYS } from '../src/data/parkStructures';
import { REFERENCE_BY_ID } from '../src/data/parkReferences';
import { TREE_ARCHETYPES, SHRUB_ARCHETYPES } from '../src/data/parkVegetation';
import { area, pointInPoly, offsetPolygon, selfIntersects, distPointPolyBoundary, polyIntersects } from '../src/geometry/poly';
import { meshHasNaN, meshBounds, signedVolume } from '../src/geometry/mesh';
import { buildSkatepark } from '../src/geometry/skate';
import { buildTree } from '../src/geometry/trees';
import { getParkModel } from '../src/systems/parkModel';
import { buildNavGraph } from '../src/systems/navigationGraph';
import { placeVegetation, makeExclusion } from '../src/systems/vegetationPlacement';
import { buildSurroundings } from '../src/systems/surroundings';
import { dist3 } from '../src/geometry/vec';

let fails = 0, checks = 0;
const ok = (cond: boolean, msg: string) => { checks++; if (!cond) { fails++; console.error('  ✗', msg); } };
const section = (s: string) => console.log(`\n▸ ${s}`);
const tri = (m: { indices: number[] }) => m.indices.length / 3;

section('Perímetro e entradas');
const A = area(PARK_PERIMETER);
console.log(`  área do perímetro provisório: ${A.toFixed(0)} m² (referência divulgada ≈ ${LAYOUT_META.referenceAreaM2})`);
ok(Math.abs(A - LAYOUT_META.referenceAreaM2) / LAYOUT_META.referenceAreaM2 < 0.05, 'área fora de ±5% da referência');
ok(!selfIntersects(PARK_PERIMETER), 'perímetro se auto-intersecta');
for (const e of ENTRANCES) ok(distPointPolyBoundary(e.pos, PARK_PERIMETER) < 0.01, `entrada ${e.id} fora do contorno`);

section('Implantação: pegadas dentro do parque e sem sobreposição');
const inner = offsetPolygon(PARK_PERIMETER, -2);
for (const f of FOOTPRINTS) ok(f.poly.every((p) => pointInPoly(p, inner)), `${f.id} fora do perímetro (ou a < 2 m da borda)`);
for (let i = 0; i < FOOTPRINTS.length; i++) for (let j = i + 1; j < FOOTPRINTS.length; j++) {
  const a = FOOTPRINTS[i], b = FOOTPRINTS[j];
  if (polyIntersects(a.poly, b.poly) || polyIntersects(b.poly, a.poly)) ok(false, `sobreposição: ${a.id} × ${b.id}`);
}
for (const f of FOOTPRINTS.filter((x) => ['pista-skate', 'campo-futebol', 'quadra-1', 'quadra-2'].includes(x.id)))
  for (const p of PAVED_FOOTPRINTS) ok(!polyIntersects(f.poly, p.poly) && !polyIntersects(p.poly, f.poly), `${f.id} sobre pavimentação ${p.id} (o furo do terreno exige separação)`);
console.log(`  ${FOOTPRINTS.length} pegadas verificadas`);

section('Referências');
const refKey = (id: string) => (id.startsWith('churrasqueira') ? 'churrasqueiras' : id);
for (const f of FOOTPRINTS) ok(REFERENCE_BY_ID.has(refKey(f.id)), `sem referência para ${f.id}`);
for (const k of ['perimetro', 'entradas', 'caminhos', 'passarelas', 'vegetacao', 'entorno', 'expansao', 'pulverizadores', 'palacio-realengo']) ok(REFERENCE_BY_ID.has(k), `sem referência para ${k}`);
for (const p of POIS) ok(REFERENCE_BY_ID.has(p.refId), `POI ${p.id} aponta para referência inexistente`);
ok([...REFERENCE_BY_ID.values()].every((r) => r.confidence !== 'confirmed'), 'item marcado como confirmed sem planta');

section('Torres');
const model = getParkModel();
const heights = TOWERS.map((t) => t.height).sort((a, b) => a - b);
ok(JSON.stringify(heights) === JSON.stringify([17, 17, 26, 26, 47]), 'alturas ≠ {17,17,26,26,47}');
ok(TOWERS.reduce((s, t) => s + t.nozzles, 0) === TOTAL_NOZZLES_ANNOUNCED, 'soma de pulverizadores ≠ 236');
for (const t of model.towers) {
  const m = t.model, H = t.spec.height;
  const b = meshBounds(m.mesh);
  ok(!meshHasNaN(m.mesh), `${t.spec.id}: NaN na malha`);
  ok(Math.abs(b.max[1] - H) < 0.35, `${t.spec.id}: topo da malha ${b.max[1].toFixed(2)} ≠ altura ${H}`);
  ok(b.min[1] > -0.01, `${t.spec.id}: malha abaixo do chão`);
  ok(m.nozzles.length === t.spec.nozzles, `${t.spec.id}: ${m.nozzles.length} pulverizadores ≠ ${t.spec.nozzles}`);
  const byId = new Map(m.branches.map((x) => [x.id, x]));
  let orphan = 0;
  for (const br of m.branches) if (br.parent) {
    const par = byId.get(br.parent)!;
    if (!par.pts.some((q) => dist3(q, br.pts[0]) < 1e-9)) orphan++;
  }
  ok(orphan === 0, `${t.spec.id}: ${orphan} ramos não nascem de um vértice do ramo-pai`);
  const mast = m.branches.find((x) => x.id.endsWith('/mast'))!;
  const spokes = m.branches.filter((x) => x.id.endsWith('/spoke'));
  ok(spokes.length > 0 && spokes.every((s) => mast.pts.some((q) => dist3(q, s.pts[s.pts.length - 1]) < 1e-9)), `${t.spec.id}: espigão não chega ao mastro`);
  const legs = m.branches.filter((x) => x.level === 0);
  const onLeg = (q: [number, number, number]) => legs.some((l) => l.pts.some((p) => dist3(p, q) < 1e-9));
  ok(m.braces.every((x) => onLeg(x.a) && onLeg(x.b)), `${t.spec.id}: escora com ponta fora dos pilares`);
  for (const pl of m.platforms) ok(pl.y <= 0.6 * H, `${t.spec.id}: plataforma a ${pl.y} m acima do trecho dos pilares`);
  console.log(`  ${t.spec.id}: H=${H} m, ${m.branches.length} ramos, ${m.braces.length} escoras, ${tri(m.mesh)} triângulos, plataforma r=${m.platforms[0].radius.toFixed(1)} m`);
}

section('Passarelas');
for (const w of model.walkways) {
  const mesh = w.mesh;
  ok(!meshHasNaN(mesh.deck) && !meshHasNaN(mesh.rails), `${w.spec.id}: NaN`);
  ok(mesh.maxGrade <= 0.085, `${w.spec.id}: inclinação ${(mesh.maxGrade * 100).toFixed(1)}% > 8,5%`);
  ok(signedVolume(mesh.deck) > 0, `${w.spec.id}: tabuleiro com volume invertido ou nulo`);
  ok(mesh.centerline.every((c) => c[1] >= 0.2), `${w.spec.id}: piso abaixo de 0,2 m`);
  const blockers = FOOTPRINTS.filter((f) => f.blocksPath && f.kind !== 'tower' && f.kind !== 'water');
  for (const f of blockers) ok(!mesh.centerline.some((c) => pointInPoly([c[0], c[2]], f.poly)), `${w.spec.id}: cruza ${f.id}`);
  console.log(`  ${w.spec.id}: ${mesh.length.toFixed(0)} m, inclinação máx. ${(mesh.maxGrade * 100).toFixed(1)}%, ${tri(mesh.deck) + tri(mesh.rails) + tri(mesh.supports)} triângulos`);
}

section('Pista de skate');
const sk = buildSkatepark({ w: SKATE.w, d: SKATE.d, cell: SKATE.cell });
console.log(`  altura ${sk.minH.toFixed(2)} … ${sk.maxH.toFixed(2)} m, inclinação máx. ${sk.maxSlope.toFixed(2)}, ${tri(sk.surface)} triângulos`);
ok(!meshHasNaN(sk.surface) && !meshHasNaN(sk.coping) && !meshHasNaN(sk.rails), 'NaN na pista');
ok(sk.minH > -1.8 && sk.minH < -1.0, 'profundidade do bowl fora do esperado');
ok(sk.maxH < 2.0, 'altura máxima inesperada');
ok(sk.maxSlope < 3.6, 'superfície com salto (descontinuidade)');
ok(sk.surface.positions.length / 3 === (Math.round(SKATE.w / SKATE.cell) + 1) * (Math.round(SKATE.d / SKATE.cell) + 1), 'grade incompleta');

section('Navegação (Dijkstra)');
const { graph, violations } = buildNavGraph(model);
for (const v of violations) ok(false, v);
console.log(`  ${graph.nodes.size} nós, ${graph.edges.length} arestas`);
for (const p of POIS) ok(graph.nodes.has(p.accessNode), `POI ${p.id}: nó ${p.accessNode} inexistente`);
const unreachable = [...graph.nodes.keys()].filter((id) => !graph.route('E1', id));
ok(unreachable.length === 0, `nós inalcançáveis a partir de E1: ${unreachable.join(', ')}`);
const r1 = graph.route('E1', 'k1'); ok(!!r1 && r1.length > 100, 'rota E1 → k1');
const r2 = graph.route('torre-1:plat0', 'torre-5:plat0');
ok(!!r2 && r2.usesWalkway && r2.points.every((p) => p[1] > 0.2), 'rota entre plataformas deve usar só passarelas');
const r3 = graph.route('E1', 'torre-3:plat0');
ok(!!r3 && r3.usesWalkway, 'rota do solo até a plataforma da torre 3 deve subir por uma rampa');
if (r1) console.log(`  E1 → k1: ${r1.length.toFixed(0)} m (${r1.nodeIds.length} nós)`);
if (r3) console.log(`  E1 → plataforma da torre 3: ${r3.length.toFixed(0)} m, via ${r3.nodeIds.filter((n) => n.includes(':') && !n.includes('plat')).slice(0, 1)}…`);

section('Vegetação');
for (const spec of [...TREE_ARCHETYPES, ...SHRUB_ARCHETYPES]) {
  const t = buildTree(spec);
  ok(!meshHasNaN(t.canopy) && !meshHasNaN(t.trunk), `${spec.id}: NaN`);
  ok(t.height > spec.height * 0.6 && t.height < spec.height * 1.9, `${spec.id}: altura ${t.height.toFixed(1)} m longe de ${spec.height}`);
  console.log(`  ${spec.id.padEnd(16)} copa ${tri(t.canopy)} tri, tronco ${tri(t.trunk)} tri, altura ${t.height.toFixed(1)} m`);
}
for (const q of ['low', 'medium', 'high'] as const) {
  const v = placeVegetation(model, q);
  console.log(`  ${q}: ${v.trees.length} árvores, ${v.shrubs.length} arbustos`);
  ok(v.trees.length > 100, `${q}: poucas árvores`);
}
const veg = placeVegetation(model, 'high');
const excl = makeExclusion(model);
ok(veg.trees.every((t) => excl([t.x, t.z], 'tree') === null), 'árvore em área excluída');
const grid = veg.trees.some((t, i) => veg.trees.some((u, j) => i < j && Math.hypot(t.x - u.x, t.z - u.z) < 5.95));
ok(!grid, 'árvores mais próximas que o espaçamento mínimo');

section('Entorno');
const sur = buildSurroundings();
ok(!selfIntersects(sur.sidewalkOuter) && !selfIntersects(sur.streetOuter), 'anel de rua se auto-intersecta');
ok(sur.blocks.every((b) => b.h <= 15.01), 'edifício acima do gabarito genérico');
const perim = PARK_PERIMETER;
ok(sur.blocks.every((b) => !pointInPoly([b.cx, b.cz], perim)), 'edifício do entorno dentro do parque');
console.log(`  ${sur.blocks.length} volumes genéricos, ${sur.trees.length} árvores de rua`);
void WALKWAYS;

console.log(`\n${fails === 0 ? '✔' : '✘'} ${checks - fails}/${checks} verificações passaram`);
process.exit(fails ? 1 : 0);
