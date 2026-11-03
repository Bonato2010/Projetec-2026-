# Parque Realengo — Digital Twin 3D (implantação provisória)

Reconstrução 3D do **Parque Realengo Jornalista Susana Naspolini** (Realengo, Rio de Janeiro) feita **direto em código**:
React + TypeScript + Vite + Three.js + React Three Fiber + Drei. Sem Blender e sem arquivos externos de modelagem.

> ## ⚠️ Estado honesto desta versão (0.1.0-provisional)
> **Nenhuma planta nem fotografia do parque foi lida.** As páginas oficiais (Prefeitura, ArchDaily, Rio Film Commission) não abriram para leitura
> automatizada. As posições, o contorno e as dimensões são **hipóteses editáveis**, não a reconstrução fiel do parque real.
> O que veio de texto (briefing e notícias lidas por trechos de busca): área ≈ 76 mil m²; cinco torres de 17, 17, 26, 26 e 47 m (correspondência
> torre ↔ altura **não verificada**; divulgações anteriores citavam 17, 25 e 40 m); 236 pulverizadores; Nave do Conhecimento ≈ 830 m²; expansão ≈ 150 mil m² no total.
> Tudo o mais foi assumido e está marcado `approximate` em `src/data/parkReferences.ts` e na interface.

## Rodar

```bash
npm install
npx playwright install chromium   # só para npm run capture
npm run dev                       # http://localhost:5173
```

| Comando | O que faz |
|---|---|
| `npm run dev` / `build` / `preview` | servidor, build de produção, preview |
| `npm run lint` | `tsc --noEmit` |
| `npm run verify` | 286 verificações em Node (implantação, torres, passarelas, skate, rotas, vegetação, entorno) |
| `npm run capture` | abre a cena no Chromium, posiciona 13 vistas e salva PNGs reais em `public/preview-mapa/` + `index.json` |
| `npm run inventory` | gera `docs/inventario-referencias.md` a partir de `parkReferences.ts` |
| `npm run plan` | gera `docs/planta-provisoria.svg` (planta 2D dos dados; **não** é captura 3D) |

Rotas da aplicação: `/` (cena) e `/preview-mapa` (galeria independente, não carrega o Three.js).

## Estrutura

```
src/data/       parkLayout · parkStructures · parkPaths · parkVegetation · parkReferences · parkPhases · parkViews · geo
src/geometry/   núcleo geométrico em TS puro (testável em Node): tower, walkway, skate, trees, sweep, curves, poly, mesh…
src/systems/    parkModel (torres+passarelas acopladas) · navigationGraph (Dijkstra) · vegetationPlacement · surroundings
src/scene/      componentes React Three Fiber: ParkScene, ParkTerrain, ParkTowers, ParkWalkways, ParkWater, ParkSkatepark,
                ParkSports, ParkKnowledgeBuilding, ParkPlayground, ParkSocial, ParkVegetation, ParkSurroundings,
                ParkExpansion, ParkLighting, ParkCamera, ParkPOIs, RouteOverlay
src/pages/      ParkPreview (/preview-mapa)
scripts/        verify · capture-park · export-inventory · export-plan
```

Coordenadas: metros, **x = leste, z = sul, y = acima**, origem ≈ centro do parque. A geometria é decidida em `src/geometry` e
`src/data`; `src/scene` só converte em `BufferGeometry`/instâncias. Cada área é um componente memoizado: calcular uma rota
(só `RouteOverlay` muda) ou selecionar um elemento não reconstrói a geometria estática.

## O que está modelado

- **Cinco torres** (`geometry/tower.ts`): pilares inclinados com torção → nó superior → ramos secundários em arco → ramos terciários,
  mastro central com a altura exata, escoras em X e anéis, plataformas com guarda-corpo aberto nas ligações das passarelas. Todo ramo nasce
  de um vértice do ramo-pai (verificado). 236 pulverizadores divididos por altura (30/30/46/46/84, hipótese) e névoa leve localizada.
- **Passarelas** (`geometry/walkway.ts`): tabuleiro com espessura, corrimão/travessa/montantes e colunas; 4 trechos entre torres e 2 rampas
  de acesso com inclinação ≤ 8,5 % (verificado). O traçado é hipótese.
- **Pista de skate** (`geometry/skate.ts`): campo de alturas contínuo (2 bowls com transição circular, quarter-pipe, banco, funbox, ledge),
  coping em tubo e corrimão. Sem caixas empilhadas.
- Campo (marcações 11×11 como hipótese), 2 quadras genéricas, área aquática com jatos, Nave do Conhecimento (volumetria externa provisória),
  playground e academia genéricos, churrasqueiras, anfiteatro, multiuso, mercado (11 vitrines, pelo texto), administração, banheiros, ecoponto.
- Vegetação procedural instanciada (5 formas de árvore + 3 de arbusto, semente fixa), entorno genérico de baixo gabarito (≤ 15 m).
- Expansão: só uma **zona indicativa** ao leste (desligada por padrão). Nenhuma estrutura futura é posicionada.

## Como refinar com plantas e fotos

1. Substitua `PARK_PERIMETER` e `ENTRANCES` (`parkLayout.ts`) pelo contorno levantado; defina `LAYOUT_META.geoOrigin` para importar GeoJSON do OSM/Data.Rio (`data/geo.ts`).
2. Ajuste posições/dimensões em `parkStructures.ts` e os caminhos em `parkPaths.ts`; rode `npm run verify` (acusa sobreposição, caminho que atravessa obstáculo, torre mal formada…).
3. Atualize `parkReferences.ts` (`confidence`: `confirmed` | `photo_inferred` | `approximate` | `planned`) e rode `npm run inventory`.
4. Refine a forma de cada torre em `TOWERS` (legs, twist, waist…) ou em `geometry/tower.ts`; o mesmo vale para a pista (`geometry/skate.ts`).
5. `npm run capture` e compare na galeria (`public/preview-mapa/referencias/`, com licença adequada).

## Pendências conhecidas (nenhuma é inventada)

- **Palácio Realengo** e a **chaminé/edificação fabril preservada**: citados em notícias como parte do parque; **não modelados** (sem referência).
- Quantidade e modalidade das quadras; quadras de areia; posições reais de tudo; espécies da vegetação; terreno (sem altimetria, plano).
- Sem pós-processamento (AO em tela) e sem colisão da câmera com estruturas (só altura mínima do terreno).

## Verificação — o que foi e o que NÃO foi testado

Executado no ambiente de desenvolvimento (Node, sem Three.js nem navegador): `npm run verify` — 286/286 verificações passam: área do
perímetro (±5 % de 76 mil m²), pegadas dentro do parque e sem sobreposição, alturas das torres {17,17,26,26,47} e 236 pulverizadores,
conectividade dos ramos, inclinação das rampas, continuidade da pista, grafo de rotas (todos os nós alcançáveis, nenhum caminho
atravessa obstáculo), árvores fora de áreas excluídas e espaçamento mínimo. A planta `docs/planta-provisoria.png` foi inspecionada
visualmente (é um desenho dos dados, não da cena 3D).

**Não executado:** `npm install`, `npm run build`, a cena React Three Fiber no navegador, `npm run capture`. Os tipos do código próprio foram
conferidos com declarações mínimas no lugar de `three`/R3F/`@types/react` (nada de erro real), mas a camada `src/scene` **nunca foi renderizada**:
espere ajustes visuais (escala de textura, sombras, enquadramentos) no primeiro `npm run dev`. As versões em `package.json` não foram instaladas.

## Fontes e atribuição

Briefing do projeto; Correio da Manhã (06/2025 e 06/2026), Super Rádio Tupi, Folha do Leste e artigos sobre o Palácio Realengo/conjunto fabril,
lidos apenas por trechos de busca. Dados do OpenStreetMap (quando importados) exigem a atribuição «© colaboradores do OpenStreetMap (ODbL)».
