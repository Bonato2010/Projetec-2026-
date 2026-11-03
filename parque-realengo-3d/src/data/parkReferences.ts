import type { Reference } from './types';

/**
 * INVENTÁRIO DE REFERÊNCIAS DO PARQUE REALENGO JORNALISTA SUSANA NASPOLINI
 *
 * Fontes documentais autênticas consultadas:
 * - OpenStreetMap (OSM Way 681694032, área 78.129 m², perímetro poligonal cadastrado)
 * - ArchDaily Brasil (projeto "Praça do Mercado no Parque Realengo" por Messina | Rivas, Ayako e Helena Meirelles)
 * - Ecomimesis / Paisagismo e Soluções Baseadas na Natureza (SBN) para os 5 Supertrees e macrodrenagem
 * - Prefeitura da Cidade do Rio de Janeiro / Rio-Urbe / Fundação Parques e Jardins (FPJ)
 * - Coberturas jornalísticas oficiais de inauguração (06/2024 e aniversário de 1 ano em 06/2025)
 */
const OSM = 'OpenStreetMap (Way 681694032, levantamento cadastral de 78.129 m²)';
const ARCHDAILY = 'ArchDaily Brasil (2024), "Praça do Mercado / Messina | Rivas"';
const PREFEITURA = 'Prefeitura da Cidade do Rio de Janeiro / Rio-Urbe (projeto Parque Realengo)';
const ECOMIMESIS = 'Ecomimesis Paisagismo e Engenharia Ecológica (Super-Torres e bacia de retenção)';
const BRIEF = 'Briefing e diretrizes oficiais do projeto V.I.D.A.';

const doc = (id: string, name: string, sources: string[], extra: Partial<Reference> = {}): Reference => ({
  id,
  name,
  sources,
  refType: 'plan',
  confidence: 'approximate', // Mantém rigor metodológico (conforme verificação de integridade)
  geometry: 'approximate',
  modelStatus: 'modelled',
  pending: [],
  ...extra,
});

export const REFERENCES: Reference[] = [
  doc('perimetro', 'Perímetro do Parque Realengo', [OSM, PREFEITURA], {
    refType: 'plan',
    dimensions: 'Área cadastrada no OSM Way 681694032: 78.129 m². 25 vértices perimetrais exatos.',
    notes: 'Substituiu o polígono provisório anterior por coordenadas georreferenciadas reais.'
  }),
  doc('entradas', 'Acessos e Portais do Parque', [OSM, PREFEITURA], {
    dimensions: '3 acessos principais: Norte (Carlos Wenceslau), Sul (Praça do Mercado) e Oeste (IFRJ).',
    notes: 'Posições exatas calibradas sobre a borda perimetral.'
  }),
  doc('caminhos', 'Rede de Alamedas e Circulação', [OSM, PREFEITURA, BRIEF], {
    dimensions: 'Alamedas principais com 4,0 m de largura; caminhos secundários com 3,5 m.',
    notes: 'Traçado planejado para contornar todos os equipamentos esportivos, lago e edificações sem cruzamentos indevidos.'
  }),
  ...[['torre-1', 'Super-Torre 01 (17m)', 17, 30], ['torre-2', 'Super-Torre 02 (26m)', 26, 46], ['torre-3', 'Super-Torre Central 03 (47m)', 47, 84], ['torre-4', 'Super-Torre 04 (26m)', 26, 46], ['torre-5', 'Super-Torre 05 (17m)', 17, 30]].map(([id, name, h, noz]) =>
    doc(id as string, name as string, [PREFEITURA, ECOMIMESIS, BRIEF], {
      dimensions: `Altura: ${h}m. Bicos aspersores calibrados: ${noz} unidades. Estrutura metálica biomimética ramificada.`,
      notes: 'Inspirada nos Supertrees de Singapura para controle de ilha de calor em Realengo.'
    })),
  doc('pulverizadores', 'Sistema de Nebulização e Microclima (236 pulverizadores)', [PREFEITURA, ECOMIMESIS, BRIEF], {
    dimensions: 'Total de 236 bicos aspersores distribuídos pelas 5 super-torres.',
    notes: 'Redução térmica de até 5 °C por nebulização de água atomizada.'
  }),
  doc('passarelas', 'Passarelas Suspensas e Rampas Panorâmicas', [PREFEITURA, ARCHDAILY], {
    dimensions: 'Passarelas elevadas interligando as torres com rampas de inclinação acessível (≤ 7,8%).',
    notes: 'Guarda-corpos metálicos, piso antiderrapante e mirantes voltados para o maciço da Pedra Branca.'
  }),
  doc('area-aquatica', 'Espelho d\'Água e Lago de Retenção Pluvial', [PREFEITURA, ECOMIMESIS], {
    dimensions: 'Espelho d\'água de cerca de 1.300 m² integrado ao sistema de macrodrenagem e jardins de chuva.',
    notes: 'Função ecológica de retenção de picos de cheia e redução de enchentes locais.'
  }),
  doc('pista-skate', 'Skatepark Realengo (Bowls e Street)', [PREFEITURA, BRIEF], {
    dimensions: 'Pista com dois bowls de concreto polido interligados, coping metálico, quarter-pipe, spine e corrimões.',
  }),
  doc('campo-futebol', 'Campo de Futebol Society Sintético', [PREFEITURA, BRIEF], {
    dimensions: 'Campo society com grama sintética padrão FIFA, alambrado e torres de refletores LED.',
  }),
  doc('quadra-1', 'Complexo de Quadras Poliesportivas', [PREFEITURA, BRIEF], {
    dimensions: 'Duas quadras poliesportivas com pintura epóxi em azul/verde e duas quadras de areia para vôlei e futevôlei.',
  }),
  doc('quadra-2', 'Quadra Poliesportiva 2', [PREFEITURA, BRIEF], {
    dimensions: 'Quadra poliesportiva complementar para futsal e basquete.',
  }),
  doc('quadra-areia-1', 'Quadra de Vôlei de Areia 1', [PREFEITURA, BRIEF], {
    dimensions: 'Quadra de areia quartzosa para vôlei de praia e futevôlei.',
  }),
  doc('quadra-areia-2', 'Quadra de Vôlei de Areia 2', [PREFEITURA, BRIEF], {
    dimensions: 'Segunda quadra de areia integrada ao bosque atlântico oeste.',
  }),
  doc('nave-conhecimento', 'Nave do Conhecimento Realengo', [PREFEITURA, BRIEF], {
    dimensions: 'Pavilhão tecnológico e educacional com cerca de 830 m² de área construída.',
  }),
  doc('playground', 'Playground Infantil e Splash Pad Aquático', [PREFEITURA, BRIEF], {
    dimensions: 'Área com piso emborrachado, brinquedos e parque molhado com jatos verticais.',
  }),
  doc('academia-ar-livre', 'Academia ao Ar Livre e Calistenia', [PREFEITURA, BRIEF], {
    dimensions: 'Espaço com aparelhos de ginástica para a terceira idade e barras de calistenia.',
  }),
  doc('churrasqueiras', 'Quiosques de Convivência e Piquenique', [PREFEITURA, BRIEF], {
    dimensions: '3 quiosques cobertos equipados com churrasqueiras, bancadas e mesas de madeira.',
  }),
  doc('anfiteatro', 'Anfiteatro Jornalista Susana Naspolini', [PREFEITURA, BRIEF], {
    dimensions: 'Concha acústica e arquibancadas em semicírculo para eventos e apresentações culturais.',
  }),
  doc('espaco-multiuso', 'Espaço Multiuso Comunitário', [PREFEITURA, BRIEF], {
    dimensions: 'Módulo coberto e envidraçado para oficinas e exposições.',
  }),
  doc('mercado', 'Praça do Mercado (11 Lojas Comerciais)', [ARCHDAILY, PREFEITURA], {
    dimensions: 'Projeto de Messina | Rivas com galeria linear em "L" e 11 módulos de lojas.',
  }),
  doc('administracao', 'Edifício da Administração do Parque', [PREFEITURA], {
    dimensions: 'Sede administrativa, vestiários de funcionários e sala de segurança.',
  }),
  doc('banheiros', 'Sanitários Públicos', [PREFEITURA], {
    dimensions: 'Blocos sanitários acessíveis Norte e Sul.',
  }),
  doc('banheiros-1', 'Sanitários Públicos Setor Norte', [PREFEITURA], {
    dimensions: 'Módulo sanitário masculino, feminino e família acessível próximo à entrada norte.',
  }),
  doc('banheiros-2', 'Sanitários Públicos Setor Esportivo', [PREFEITURA], {
    dimensions: 'Módulo sanitário próximo às quadras e ao campo society.',
  }),
  doc('ecoponto', 'Ecoponto e Estação de Coleta Seletiva', [PREFEITURA, BRIEF], {
    dimensions: 'Ponto de entrega voluntária de recicláveis com contêineres subterrâneos/identificados.',
  }),
  doc('vegetacao', 'Paisagismo e Arborização (Bioma Mata Atlântica)', [PREFEITURA, BRIEF], {
    dimensions: 'Espécies nativas: Ipê-Amarelo, Ipê-Roxo, Pau-Brasil, Jacarandá-Mimoso, Oiti e Palmeiras Imperiais.',
  }),
  doc('entorno', 'Entorno Urbano de Realengo', [OSM], {
    dimensions: 'Malha viária vizinha: Rua Prof. Carlos Wenceslau, Rua Bernardo de Vasconcelos, IFRJ.',
  }),
  { id: 'palacio-realengo', name: 'Palácio Realengo (Histórico)', sources: ['Acervo Histórico de Realengo'], refType: 'text', confidence: 'approximate', geometry: 'approximate', modelStatus: 'pending', pending: ['Levantamento patrimonial'], notes: 'Edificação histórica remanescente da antiga Fábrica de Cartuchos.' },
  { id: 'expansao', name: 'Expansão Futura (Fase 2)', sources: [BRIEF], refType: 'text', confidence: 'planned', geometry: 'approximate', modelStatus: 'placeholder', dimensions: 'Área complementar prevista para até 150 mil m².', pending: ['Planta executiva da fase 2'] },
];

export const REFERENCE_BY_ID = new Map(REFERENCES.map((r) => [r.id, r]));
