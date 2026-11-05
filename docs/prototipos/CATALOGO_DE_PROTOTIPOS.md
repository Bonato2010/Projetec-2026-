# CATÁLOGO DE PROTÓTIPOS — ECOCITY / PROJETEC 2026

Este catálogo detalha todos os protótipos e simulações desenvolvidos para o projeto **EcoCity / Projeto V.I.D.A. (Parque Realengo Susana Naspolini)**.

---

## 1. Protótipo 01 — EcoCity 3D (Gêmeo Digital do Parque Realengo)

| Campo | Informação |
|---|---|
| **Identificador** | `PROTO-01` |
| **Nome Oficial** | Parque Realengo 3D — Gêmeo Digital de Realismo Extremo |
| **Diretório** | [`parque-realengo-3d/`](../../parque-realengo-3d/) |
| **Finalidade** | Simulação tridimensional interativa em tempo real do Parque Urbano de Realengo Susana Naspolini, servindo como a principal experiência imersiva do stand na Feira de Ciências. |
| **Tecnologias** | React 18, React Three Fiber (R3F), Three.js, Vite, TypeScript, Tailwind CSS, Playwright. |
| **Funcionalidades** | - As 5 Super-Torres Bioclimáticas (hiperboloides, diagrid X-bracing, anéis de nebulização);<br>- Bacia de retenção pluvial lobada com lâmina d'água PBR (IOR 1.333) e chapisco em enrocamento (*riprap*);<br>- Complexo esporivo (quadras oficiais em resina acrílica e campo society);<br>- Nave do Conhecimento e Pavilhão Cultural com pátio interno (*atrium*);<br>- Sistema de navegação por grafos (Dijkstra) e personagem em terceira pessoa (modo Halo/Follow);<br>- 5 Missões Interativas pedagógicas com beacons no solo. |
| **Estado** | Ativo / Concluído e Otimizado (60 FPS estáveis) |
| **Comando de Execução** | `cd parque-realengo-3d && npm run dev` |
| **Comando de Build** | `cd parque-realengo-3d && npm run build` |
| **Capturas** | [`screenshots/03-prototipos/01-ecocity-3d/`](../../screenshots/03-prototipos/01-ecocity-3d/) |

---

## 2. Protótipo 02 — Mapa Interativo do Parque (GIS 2D)

| Campo | Informação |
|---|---|
| **Identificador** | `PROTO-02` |
| **Nome Oficial** | Mapa Interativo 2D & Sistema de Trilha Geográfica |
| **Diretório** | [`prototipos/01-mapa-parque/`](../../prototipos/01-mapa-parque/) |
| **Finalidade** | Exibição cartográfica em 2D dos limites oficiais do parque, trilhas ecológicas, estações de monitoramento e pontos de interesse (POIs). |
| **Tecnologias** | HTML5, CSS3, JavaScript puro, Leaflet / Map libraries, CSS Custom Properties. |
| **Funcionalidades** | - Filtros por categoria (vegetação, lazer, infraestrutura, água);<br>- Detalhes dinâmicos de cada POI ao clique;<br>- Visualização otimizada para desktop e mobile. |
| **Estado** | Ativo / Integrado ao ecossistema |
| **Comando de Execução** | Abrir `prototipos/01-mapa-parque/index.html` via Live Server ou navegador |
| **Capturas** | [`screenshots/03-prototipos/02-mapa-parque/`](../../screenshots/03-prototipos/02-mapa-parque/) |

---

## 3. Protótipo 03 — Painel Ambiental & Bioclimático

| Campo | Informação |
|---|---|
| **Identificador** | `PROTO-03` |
| **Nome Oficial** | Painel de Telemetria Ambiental e Conforto Térmico |
| **Diretório** | [`prototipos/02-painel-ambiental/`](../../prototipos/02-painel-ambiental/) |
| **Finalidade** | Apresentar dados científicos em tempo real sobre a redução da temperatura urbana promovida pelas torres bioclimáticas e pela vegetação de Mata Atlântica. |
| **Tecnologias** | HTML5, CSS3, JavaScript, Chart.js, Sliders interativos de comparação Antes/Depois. |
| **Funcionalidades** | - Gráficos de redução térmica (até 4°C a menos no entorno);<br>- Heatmaps de umidade relativa do ar;<br>- Slider interativo comparativo de antes e depois da revitalização do terreno. |
| **Estado** | Ativo / Concluído |
| **Comando de Execução** | Abrir `prototipos/02-painel-ambiental/index.html` |
| **Capturas** | [`screenshots/03-prototipos/03-painel-ambiental/`](../../screenshots/03-prototipos/03-painel-ambiental/) |

---

## 4. Protótipo 04 — Simulador de Drenagem Urbana e Chuvas

| Campo | Informação |
|---|---|
| **Identificador** | `PROTO-04` |
| **Nome Oficial** | Simulador de Drenagem Urbana e Mitigação de Enchentes |
| **Diretório** | [`prototipos/03-simulador-drenagem/`](../../prototipos/03-simulador-drenagem/) |
| **Finalidade** | Demonstrar o impacto hidrológico da bacia de retenção do parque e dos jardins de chuva na prevenção de alagamentos na região de Realengo. |
| **Tecnologias** | HTML5 Canvas 2D, JavaScript, CSS3. |
| **Funcionalidades** | - Simulação de tempestades com diferentes índices pluviométricos;<br>- Comportamento da lâmina d'água com e sem o parque operacional;<br>- Métricas de vazão e absorção do solo drenante. |
| **Estado** | Ativo / Concluído |
| **Comando de Execução** | Abrir `prototipos/03-simulador-drenagem/index.html` |
| **Capturas** | [`screenshots/03-prototipos/04-simulador-drenagem/`](../../screenshots/03-prototipos/04-simulador-drenagem/) |

---

## 5. Hub de Galeria Visual e Screenshots

| Campo | Informação |
|---|---|
| **Identificador** | `GALLERY-01` |
| **Nome Oficial** | Galeria de Evidências Visuais e Manifestos |
| **Diretório** | [`prototipos/galeria-screenshots/`](../../prototipos/galeria-screenshots/) e [`screenshots/](../../screenshots/) |
| **Finalidade** | Centralizar todas as capturas de tela do ecossistema (site, quiz, 3D, mapas, painéis e responsividade). |
| **Tecnologias** | HTML5, CSS Grid responsivo, JavaScript, JSON Manifest. |
| **Estado** | Ativo |
| **Comando de Execução** | Abrir `prototipos/galeria-screenshots/index.html` ou [`screenshots/index.html`](../../screenshots/index.html) |
