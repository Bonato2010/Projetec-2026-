/** Gera docs/inventario-referencias.md a partir de src/data/parkReferences.ts:  npm run inventory */
import { writeFileSync, mkdirSync } from 'node:fs';
import { REFERENCES } from '../src/data/parkReferences';
import { LAYOUT_META } from '../src/data/parkLayout';

const CONF: Record<string, string> = { confirmed: 'confirmado (planta)', photo_inferred: 'inferido de foto', approximate: 'aproximado', planned: 'planejado' };
const esc = (s: string) => s.replace(/\|/g, '\\|');
const rows = REFERENCES.map((r) =>
  `| ${esc(r.name)} | ${esc(r.dimensions ?? '—')} | ${esc(r.sources.join('; '))} | ${r.refType} | ${CONF[r.confidence]} | ${r.geometry === 'confirmed' ? 'confirmada' : 'aproximada'} | ${r.modelStatus} | ${esc(r.pending.join('; '))} |`);
const md = `# Inventário de referências — Parque Realengo

Versão do layout: **${LAYOUT_META.version}** (provisória). Gerado por \`npm run inventory\`; a fonte é \`src/data/parkReferences.ts\`.

**Estado:** nenhuma planta nem fotografia foi lida. As páginas oficiais (Prefeitura, ArchDaily, Rio Film Commission) não abriram para leitura automatizada.
Só foram usados o briefing do projeto e notícias lidas por trechos de busca. Por isso nenhum item está "confirmado" e toda a geometria é aproximada.

| Elemento | Dimensões disponíveis | Fonte | Tipo de referência | Confiança | Geometria | Situação de modelagem | Pendências |
|---|---|---|---|---|---|---|---|
${rows.join('\n')}
`;
mkdirSync('docs', { recursive: true });
writeFileSync('docs/inventario-referencias.md', md);
console.log(`docs/inventario-referencias.md (${REFERENCES.length} itens)`);
