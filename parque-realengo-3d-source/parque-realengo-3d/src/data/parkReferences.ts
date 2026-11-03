import type { Reference } from './types';

/**
 * INVENTÁRIO DE REFERÊNCIAS.
 * Estado nesta versão: NENHUMA planta ou fotografia foi lida. Páginas oficiais (Prefeitura, ArchDaily,
 * Rio Film Commission) não puderam ser abertas por acesso automatizado. As únicas informações usadas são
 * o briefing do projeto e textos de notícia lidos apenas por trechos de busca. Por isso nenhum item é
 * `confirmed` e toda geometria é `approximate`.
 */
const BRIEF = 'Briefing do projeto (descrição fornecida pelo usuário)';
const NEWS_2025 = 'Correio da Manhã, 06/2025, "Parque Realengo completa um ano de funcionamento" (trecho de busca)';
const NEWS_PRE = 'Super Rádio Tupi, notícia sobre a inauguração de lojas no parque (trecho de busca)';
const NEWS_2026 = 'Correio da Manhã, 06/2026, "Prefeitura começa obras no Parque Realengo" (trecho de busca)';
const NO_PLAN = 'Planta de implantação (não recebida)';
const NO_PHOTO = 'Fotografias aéreas e de detalhe (não recebidas)';

const approx = (id: string, name: string, extra: Partial<Reference> = {}): Reference => ({
  id, name, sources: [BRIEF], refType: 'briefing', confidence: 'approximate', geometry: 'approximate',
  modelStatus: 'modelled', pending: [NO_PLAN, NO_PHOTO], ...extra,
});

export const REFERENCES: Reference[] = [
  approx('perimetro', 'Perímetro do parque', { refType: 'text', sources: [BRIEF, NEWS_2025], dimensions: 'Área divulgada ≈ 76 mil m². O contorno do modelo é fictício e tem ≈ 77 mil m².', pending: ['Contorno real (planta ou ortofoto)'] }),
  approx('entradas', 'Entradas', { modelStatus: 'placeholder', pending: ['Posição e número reais das entradas'] }),
  approx('caminhos', 'Caminhos e pavimentação', { pending: ['Traçado real dos caminhos', 'Larguras e materiais'] }),
  ...[['torre-1', 'Torre 1'], ['torre-2', 'Torre 2'], ['torre-3', 'Torre 3'], ['torre-4', 'Torre 4'], ['torre-5', 'Torre 5']].map(([id, name]) =>
    approx(id, name, {
      refType: 'text', sources: [BRIEF, NEWS_2025, NEWS_PRE],
      dimensions: 'Alturas divulgadas: duas de 17 m, duas de 26 m, uma de 47 m. Divulgações anteriores citavam 17, 25 e 40 m. Correspondência torre ↔ altura não verificada.',
      pending: ['Posição real', 'Qual altura é de qual torre', 'Forma real dos ramos, treliças e conexões', NO_PHOTO],
    })),
  approx('pulverizadores', 'Sistema de nebulização (236 pulverizadores)', { refType: 'text', sources: [BRIEF, NEWS_2025], dimensions: '236 pulverizadores divulgados; distribuição entre torres proporcional à altura (hipótese).', pending: ['Distribuição real dos pontos de nebulização'] }),
  approx('passarelas', 'Passarelas elevadas', { pending: ['Traçado, cotas, largura, escadas/rampas de acesso reais'] }),
  approx('area-aquatica', 'Área aquática', { pending: ['Limites, profundidades, jatos'] }),
  approx('pista-skate', 'Pista de skate', { pending: ['Planta da pista (bowls, rampas, obstáculos)'] }),
  approx('campo-futebol', 'Campo de futebol', { pending: ['Dimensões, piso, iluminação reais'] }),
  approx('quadra-1', 'Quadras esportivas', { modelStatus: 'placeholder', pending: ['Quantidade, modalidade, piso e cercamento reais (quadras de areia não documentadas)'] }),
  approx('quadra-2', 'Quadra 2', { modelStatus: 'placeholder', pending: ['Existência e modalidade'] }),
  approx('nave-conhecimento', 'Nave do Conhecimento', { refType: 'text', dimensions: 'Área divulgada ≈ 830 m². Planta 36 × 23 m assumida.', pending: ['Formato real da planta, cobertura e fachadas'] }),
  approx('playground', 'Playground', { pending: ['Brinquedos existentes'] }),
  approx('academia-ar-livre', 'Academia ao ar livre', { modelStatus: 'placeholder', pending: ['Existência, posição e aparelhos'] }),
  approx('churrasqueiras', 'Churrasqueiras cobertas', { pending: ['Quantidade e posição'] }),
  approx('anfiteatro', 'Anfiteatro', { pending: ['Posição e forma'] }),
  approx('espaco-multiuso', 'Espaço multiuso', { pending: ['Posição e forma'] }),
  approx('mercado', 'Mercado (lojas)', { refType: 'text', sources: [BRIEF, 'Folha do Leste, inauguração do mercado com 11 lojas (trecho de busca)'], dimensions: 'Notícia cita 11 lojas; dimensões do edifício não documentadas.', pending: ['Posição e forma reais'] }),
  approx('administracao', 'Administração', { pending: ['Posição e forma'] }),
  approx('banheiros', 'Banheiros', { pending: ['Quantidade e posição'] }),
  approx('ecoponto', 'Ecoponto', { pending: ['Posição'] }),
  approx('vegetacao', 'Vegetação', { modelStatus: 'placeholder', pending: ['Distribuição aérea das árvores', 'Espécies (não inventar)'] }),
  approx('entorno', 'Entorno urbano', { modelStatus: 'placeholder', pending: ['Ruas e edifícios reais (OSM / Data.Rio)'], notes: 'Contexto genérico de baixo gabarito; não representa edifícios reais.' }),
  { id: 'palacio-realengo', name: 'Palácio Realengo', sources: ['Notícias sobre a reinauguração (trechos de busca)'], refType: 'text', confidence: 'approximate', geometry: 'approximate', modelStatus: 'pending', pending: ['Posição, volumetria e aparência'], notes: 'Citado como localizado dentro do parque. Ainda NÃO modelado e não consta no briefing: precisa de referência.' },
  { id: 'chamine', name: 'Chaminé / edificação fabril preservada', sources: ['Artigo acadêmico sobre o conjunto (trecho de busca)'], refType: 'text', confidence: 'approximate', geometry: 'approximate', modelStatus: 'pending', pending: ['Confirmar se existe no parque e onde'], notes: 'Não modelada.' },
  { id: 'expansao', name: 'Expansão (segunda fase)', sources: [BRIEF, NEWS_2026], refType: 'text', confidence: 'planned', geometry: 'approximate', modelStatus: 'placeholder', dimensions: 'Área total anunciada ≈ 150 mil m².', pending: ['Planta da expansão', 'Posição de cada estrutura'], notes: 'Só uma zona indicativa; nenhuma estrutura posicionada.' },
];
export const REFERENCE_BY_ID = new Map(REFERENCES.map((r) => [r.id, r]));
