# Central de Capturas Visuais — Projeto V.I.D.A.
### Parque Realengo Jornalista Susana Naspolini

Esta pasta reúne o acervo completo e automatizado de capturas de tela em alta fidelidade de todos os ambientes, interfaces, protótipos e microestruturas do projeto, com ênfase especial no **Gêmeo Digital 3D do Parque Suzana Naspolini**.

---

## 🚀 Como Atualizar as Capturas Automaticamente

O projeto inclui o script automatizado `capturar-screenshots.js` na raiz, capaz de iniciar o servidor estático local, abrir o motor do Google Chrome em modo headless com aceleração gráfica e registrar todas as telas sem intervenção manual.

Para regenerar ou atualizar as capturas a qualquer momento:

```powershell
node capturar-screenshots.js
```

> **Tempo médio de execução:** ~45 segundos para compilação, navegação e consolidação de todas as imagens.

---

## 📁 Estrutura de Diretórios e Índice de Capturas

O acervo conta com **33 capturas de tela reais** organizadas nas seguintes categorias:

```
screenshots/
├── 3d/           (14 capturas — Vistas gerais, arquitetura, esportes e vegetação 3D)
├── detalhes/     (5 capturas — Macrofotografias e close-ups de microdetalhes 3D)
├── interfaces/   (10 capturas — Dashboards, controle móvel, painéis e rotas)
└── apresentacao/ (4 capturas — Vídeo obrigatório, quiz ambiental e modais)
```

---

### 1. `screenshots/3d/` — Ambiente 3D do Parque Realengo (1440 × 900)

Capturas diretas do motor gráfico WebGL/Three.js baseado no levantamento cadastral real do OpenStreetMap (Way 681694032, 78.129 m², 25 vértices perimetrais):

| Arquivo | Resolução | Descrição da Área Registrada |
| :--- | :---: | :--- |
| `01-vista-aerea-geral.png` | 1440 × 900 | Vista aérea completa de todo o perímetro de 78.129 m² com os 25 vértices cadastrais OSM, super-torres, espelho d'água e bosque. |
| `02-perspectiva-obliqua.png` | 1440 × 900 | Perspectiva panorâmica dinâmica em 3/4 exibindo desníveis, mirantes e volumetria de todos os setores. |
| `03-super-torres-nebulizacao.png` | 1440 × 900 | Conjunto das 5 super-torres (17m a 47m) com o sistema de microclima e 236 pulverizadores de água. |
| `04-passarelas-e-mirantes.png` | 1440 × 900 | Circulação aérea acessível interligando as plataformas intermediárias das torres (rampas com declividade ≤ 8%). |
| `05-lago-espelho-dagua.png` | 1440 × 900 | Espelho d'água de 1.300 m² integrado ao sistema de macrodrenagem e bacia de contenção pluvial. |
| `06-nave-do-conhecimento.png` | 1440 × 900 | Pavilhão tecnológico e educacional comunitário de 830 m² com esplanada cimentada. |
| `07-praca-do-mercado.png` | 1440 × 900 | Edificação linear com 11 lojas e serviços projetada pelo escritório de arquitetura Messina \| Rivas. |
| `08-anfiteatro-susana-naspolini.png` | 1440 × 900 | Concha acústica e arquibancadas para cinema ao ar livre e eventos culturais da Zona Oeste. |
| `09-skatepark-bowls.png` | 1440 × 900 | Pista de skate com dois bowls de concreto interligados, coping metálico e setor de street. |
| `10-campo-e-quadras.png` | 1440 × 900 | Campo de futebol society em grama sintética e 2 quadras poliesportivas com alambrado e iluminação. |
| `11-bosque-mata-atlantica.png` | 1440 × 900 | Maciço vegetal nativo com Ipês-Amarelos, Ipês-Roxos, Pau-Brasil, Jacarandás e Palmeiras Imperiais. |
| `12-acesso-norte-portal.png` | 1440 × 900 | Entrada principal pela Rua Carlos Wenceslau com alameda e recepção de pedestres. |
| `13-planta-geral-sem-vegetacao.png` | 1440 × 900 | Planta técnica zenital ortogonal da malha viária, drenagem e implantação sem copas de árvores. |
| `14-zona-expansao-fase2.png` | 1440 × 900 | Projeção do masterplan de ampliação futura do parque para até 150.000 m². |

---

### 2. `screenshots/detalhes/` — Close-ups e Microestruturas 3D (1440 × 900)

Registros fotográficos focados nas microestruturas, texturas materiais e equipamentos específicos do parque:

| Arquivo | Resolução | Detalhe Técnico em Destaque |
| :--- | :---: | :--- |
| `01-detalhe-splash-pad.png` | 1440 × 900 | Splash Pad aquático com jatos interativos e piso emborrachado azul no playground infantil. |
| `02-detalhe-volei-areia-redes.png` | 1440 × 900 | Quadras de vôlei de praia com textura de areia fina, postes perimetrais e redes tensionadas. |
| `03-detalhe-tabelas-basquete.png` | 1440 × 900 | Tabelas de basquete com aro, rede, suporte estrutural e pintura oficial do garrafão. |
| `04-detalhe-quiosques-churrasqueira.png` | 1440 × 900 | Quiosques de madeira com churrasqueiras integradas e mesas de piquenique comunitárias. |
| `05-detalhe-bicos-aspersores-torre.png` | 1440 × 900 | Anel de climatização e bicos de microaspersão de névoa d'água na Super-Torre Central 03 (47m). |

---

### 3. `screenshots/interfaces/` — Interfaces de Usuário e Dashboards

Interfaces funcionais executadas em resolução Full HD e viewport mobile responsivo:

| Arquivo | Resolução | Interface |
| :--- | :---: | :--- |
| `01-central-monitoramento-vida.png` | 1920 × 1080 | Dashboard oficial da **Central V.I.D.A.** com indicadores ambientais, microclima e status operacional. |
| `02-controle-mobile-390x844.png` | 390 × 844 | Interface do visitante no celular com controle remoto das missões e seletor touch. |
| `03-painel-gemeo-digital-3d.png` | 1440 × 900 | Interface do Gêmeo Digital 3D completa com painel lateral de camadas, estatísticas OSM e vistas guiadas. |
| `04-mapa-interativo-2d.png` | 1920 × 1080 | Mapa interativo 2D com georreferenciamento de pontos de interesse (POIs) e filtros por categoria. |
| `05-simulador-drenagem-interativo.png` | 1920 × 1080 | Simulador hidrológico com slider de intensidade de chuva (mm/h) e cálculo de bacia pluvial. |
| `06-galeria-screenshots-hub.png` | 1920 × 1080 | Hub visual para acompanhamento e inspeção de telas do projeto. |
| `07-card-poi-torres.png` | 1440 × 900 | Interface 3D com card técnico detalhado das 5 Super-Torres e sistema de climatização evaporativa. |
| `08-card-poi-mercado.png` | 1440 × 900 | Interface 3D com card arquitetônico da Praça do Mercado (Messina \| Rivas). |
| `09-card-poi-nave.png` | 1440 × 900 | Interface 3D com card informativo da Nave do Conhecimento. |
| `10-rota-dijkstra-overlay.png` | 1440 × 900 | Grafo de navegação Dijkstra ativo com traçado e cálculo da rota acessível (Entrada Norte ➔ Torre 3). |

---

### 4. `screenshots/apresentacao/` — Telas de Apresentação e Modais

Momentos da jornada do usuário e apresentação interativa da feira de ciências:

| Arquivo | Resolução | Momento da Experiência |
| :--- | :---: | :--- |
| `01-video-oficial-intro-mobile.png` | 390 × 844 | Vídeo oficial institucional em tela cheia obrigatório no celular do visitante antes da liberação dos controles. |
| `02-stand-tv-quiz-ambiental.png` | 1920 × 1080 | Tela principal do Quiz Ambiental Solaris na TV do stand para engajamento dos visitantes. |
| `03-fila-espera-visitante.png` | 390 × 844 | Tela de fila de espera com bloqueio de visitante ativo (*Single Active Visitor Lock* via WebSocket). |
| `04-quiz-resultado-resposta.png` | 1920 × 1080 | Tela de feedback visual interativo do quiz com pontuação em tempo real e explicação ecológica. |

---

*Gerado automaticamente via Playwright e motor Chromium em ambiente local.*
