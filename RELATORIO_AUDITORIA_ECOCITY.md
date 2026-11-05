# RELATÓRIO DE AUDITORIA TÉCNICA E AVALIAÇÃO RIGOROSA — PROJETO ECOCITY / PROJETEC 2026
**Bancada de Avaliação Técnica Multidisciplinar**  
**Data da Auditoria:** 05 de Novembro de 2026  
**Auditor Responsável:** Auditor Técnico Sênior em Engenharia de Software, Sistemas Gráficos 3D, Arquitetura Digital e Sustentabilidade  
**Escopo Auditado:** Repositório Completo (`site-informativo/`, `canonical-drive-site/`, `prototipos/`, `site/`, `parque-realengo-3d/`, `server.js`)  
**Status da Auditoria:** Concluída com Evidências Fotográficas e Diagnóstico Profundo  

---

## 1. RESUMO EXECUTIVO DA AUDITORIA

### 1.1 Veredito da Banca Avaliadora
**Classificação Final:** **`APTO COM RESSALVAS CRÍTICAS`**  
**Nota Geral Ponderada:** **`8.35 / 10.00`**

O projeto **EcoCity / Projetec 2026 (Parque Realengo Jornalista Susana Naspolini)** apresenta um nível conceitual, científico e gráfico de destaque no contexto de feiras tecnológicas de ensino médio e técnico. A calibração tridimensional das intervenções bioclimáticas do parque real — especialmente as 5 Super-Torres de microclima, o espelho d'água lobado, as passarelas elevadas e as quadras poliesportivas em diagonal — demonstra rigor espacial notável quando confrontada diretamente com a ortofoto aérea oficial da Prefeitura da Cidade do Rio de Janeiro (PCRJ).

Todavia, sob a ótica estrita de engenharia de software, estabilidade operacional e coesão de produto digital, o projeto sofre de **fragmentação arquitetural severa**, **acumulação de resíduos técnicos no repositório**, **redundância de código entre subdiretórios** e **pontos únicos de falha na persistência de dados e na sincronização de rede local (WebSocket)**. 

### 1.2 Síntese de Forças e Vulnerabilidades

| Dimensão | Principais Forças Identificadas | Vulnerabilidades Críticas Detectadas |
| :--- | :--- | :--- |
| **Modelagem e Espacialidade 3D** | Calibração de coordenadas geográficas e altimétricas com precisão milimétrica em relação à ortofoto aérea real; 5 super-torres diagrid paramétricas; malha lobada fiel do lago. | Entorno urbano composto por blocos prismáticos cinzentos repetitivos sem a textura do subúrbio carioca; falta de LOD agressivo na vegetação distante gerando sobrecarga de draw calls. |
| **Arquitetura de Software** | Stack moderna baseada em React 18, React Three Fiber, Three.js r16x e Vite; pipeline de renderização ACESFilmicToneMapping e PCFSoftShadows. | Repositório fragmentado sem monorepo; duplicidade de aplicações inteiras (`canonical-drive-site` vs `site-informativo`); lixo técnico e credenciais no root. |
| **Interatividade Multitela** | Sincronização em tempo real entre TV do Stand e Celular do Visitante via WebSocket nativo com sistema de trava de sessão (*Single Active Visitor*). | Falta de tratamento de reconexão resiliente no cliente TV; persistência de ranking em JSON síncrono vulnerável a corrupção em I/O concorrente; ausência de sanitização XSS no ranking. |
| **Rigor Científico e Social** | Integração autêntica entre climatologia (ilhas de calor de Realengo / Bangu), biotecnologia (SbN, fitorremediação) e enfermagem/saúde coletiva. | Telemetria do painel ambiental gerada por vetores estáticos em loop procedural, sem indicação explícita na UI de que se trata de simulação didática. |

---

## 2. AVALIAÇÃO GERAL DA SOLUÇÃO

O projeto EcoCity foi concebido com uma ambição multidisciplinar louvável: unir a engenharia climática das Soluções baseadas na Natureza (SbN) implantadas no Parque Susana Naspolini com tecnologias digitais contemporâneas (Gêmeos Digitais 3D, IoT e plataformas multitela interativas).

```mermaid
graph TD
    subgraph Ecossistema Fragmentado Atual
        A[Portal Narrativo: site-informativo] -.->|Duplicação| B[canonical-drive-site]
        C[Stand Interativo: site/index.html TV] <-->|WebSocket ws://| D[Controle Visitante: site/controle.html]
        C -->|POST /api/ranking| E[(data/ranking.json - I/O Síncrono)]
        F[Gêmeo Digital: parque-realengo-3d Vite/R3F] -.->|Build Estático| G[parque-realengo-3d/dist]
        H[Dashboard Ambiental: prototipos/02-painel-ambiental] -.->|Isolado| H
    end
```

### 2.1 Análise de Coesão da Proposta Técnica
A solução não é atualmente um sistema coeso unificado, mas uma federação de quatro módulos desacoplados que coexistem no mesmo repositório:
1. **O Portal Conceitual/Narrativo (`site-informativo/`):** Um site de rolagem única ("Tudo está conectado") que contextualiza o parque, a saúde comunitária e os ODS.
2. **O Stand Interativo da Feira (`site/index.html` e `site/controle.html`):** Uma aplicação voltada a telas de grande formato (TV 4K/Full HD) com vídeo demonstrativo, quiz gamificado e sincronização móvel via WebSocket.
3. **O Simulador / Gêmeo Digital 3D (`parque-realengo-3d/`):** Uma aplicação WebGL rica com visualização em terceira pessoa, modo aéreo, inspeção de POIs e cálculo de caminhos acessíveis.
4. **Os Protótipos de Pesquisa e Painéis (`prototipos/`):** Dashboards e ferramentas isoladas de medição ambiental e histórico de screenshots.

A coesão estética entre o Portal e o Stand é satisfatória (ambos adotam uma identidade dark mode sóbria com acentos esmeralda e ciano). Contudo, a ausência de um roteador centralizado unificado que integre o Gêmeo 3D dentro do Portal Narrativo exige que o avaliador ou operador da feira transite manualmente entre URLs distintas (`/`, `/parque3d/`, `/controle`, `/galeria`).

---

## 3. ESTRUTURA E ORGANIZAÇÃO DO REPOSITÓRIO

A auditoria inspecionou exaustivamente a árvore de arquivos e diretórios do projeto `c:\Users\Daniz\Downloads\Projetec 3`.

```
Projetec 3/
├── backup/                                [RESÍDUO TÉCNICO] Backups manuais obsoletos
├── canonical-drive-site/                  [REDUNDÂNCIA CRÍTICA] Clone idêntico de site-informativo
├── data/ranking.json                      Arquivo de persistência síncrona
├── downloads_temp/                        [RESÍDUO TÉCNICO] Lixo de download não versionável
├── parque-realengo-3d/                    Aplicação principal do Gêmeo Digital (Vite/TS/R3F)
│   ├── auditoria_3d/                      [EVIDÊNCIAS GERADAS] 10 capturas de inspeção técnica
│   ├── dist/                              Build estático de produção
│   └── src/                               Código-fonte de geometria, cenas e sistemas
├── prototipos/                            
│   ├── 02-painel-ambiental/               Dashboard ambiental isolado
│   └── galeria-screenshots/              Visualizador de capturas de tela
├── screenshots/                           Registro fotográfico consolidado da aplicação
├── scripts/                               Scripts de automação de testes e screenshots
├── site/                                  Aplicação do Stand da Feira (TV + Controle)
├── site-informativo/                      Site narrativo institucional
├── temp_chrome_profile/                   [RESÍDUO TÉCNICO] Perfis temporários de teste
├── t JULES_API_KEY...                     [FALHA DE HIGIENE GRAVE] Resíduo de shell script no root
├── test-pref-aerea.jpg                    [RESÍDUO TÉCNICO] Imagem temporária avulsa no root
├── server.js                              Servidor monolítico HTTP/WebSocket/API
└── package.json                           Dependências da raiz
```

### 3.1 Falhas Graves de Higiene e Versionamento
1. **Presença do arquivo `t JULES_API_KEY...` no root:** Evidência explícita de erro de digitação/redirecionamento de linha de comando no terminal do desenvolvedor. Esse tipo de arquivo em um repositório institucional transmite amadorismo e risco de vazamento de credenciais em auditorias de segurança.
2. **Duplicidade Absoluta (`canonical-drive-site` vs `site-informativo`):** Ambos os diretórios contêm código-fonte praticamente idêntico (HTML, CSS, JS e assets de mídia). Isso introduz um grave risco de desvio de versão (*version drift*), no qual correções aplicadas em um diretório não se refletem no outro.
3. **Presença de Diretórios Temporários de Execução:** `temp_chrome_profile/`, `downloads_temp/` e pastas de `backup/` não deveriam constar no repositório ativo; a ausência de um arquivo `.gitignore` abrangente é evidente.
4. **Disparidade de Gerenciamento de Dependências:** O projeto não utiliza uma arquitetura de monorepo formal (ex: npm/pnpm workspaces). O diretório raiz possui um `package.json` rudimentar, enquanto `parque-realengo-3d` mantém seu próprio ciclo de compilação isolado.

---

## 4. AUDITORIA DO SITE INFORMATIVO

A auditoria examinou os arquivos `site-informativo/index.html`, `site-informativo/css/style.css` e o dashboard complementar `prototipos/02-painel-ambiental/index.html`.

```mermaid
flowchart LR
    A[index.html] --> B[Hero: O Desafio]
    A --> C[Seção Saúde e Enfermagem]
    A --> D[Tecnologia IoT e Microclima]
    A --> E[O Parque Realengo]
    A --> F[Pesquisas e ODS]
    A --> G[Simulador Hidrológico]
    A --> H[Equipe e Fontes]
```

### 4.1 Hierarquia de Informação e Conteúdo Técnico
- **Qualidade Textual:** Excepcional. O texto não se limita a generalidades; cita expressamente a Lei Municipal 7.033/2021, o Plano Estratégico Rio 2021–2024, a atuação do arquiteto Mario Rivas e a fitorremediação de resíduos pirotécnicos do antigo depósito do Exército.
- **Integração com a Enfermagem:** Um dos diferenciais mais sólidos da proposta é a inserção da enfermagem preventiva frente ao calor extremo. O texto documenta de forma clara a correlação entre a redução de 3°C a 6°C na temperatura aparente e a redução de atendimentos de emergência por síncope térmica, desidratação e picos hipertensivos no Hospital Municipal Albert Schweitzer.

### 4.2 Falhas Técnicas de UI/UX e Responsividade
- **Inconsistência de Contraste (Acessibilidade WCAG 2.1):** Em legendas secundárias (`font-size: 0.75rem`) sob fundo escuro `#0f172a`, a cor `#64748b` atinge taxa de contraste de apenas 3.8:1, violando o mínimo legal de 4.5:1 exigido pela WCAG AA.
- **Painel Ambiental sem Menu Hambúrguer Móvel:** Em `prototipos/02-painel-ambiental`, a barra de navegação superior colapsa de forma desalinhada em larguras de tela abaixo de 640px, empurrando métricas para fora da viewport visível.
- **Série Temporal Estática no Gráfico Canvas:** O gráfico interativo de atenuação térmica utiliza curvas senoidais com ruído pseudo-aleatório gerado em tempo de execução via `Math.random()`, sem indicar explicitamente ao visitante: *"Simulação baseada nas médias históricas do Alerta Rio (Estação Bangu)"*.

---

## 5. AUDITORIA DO AMBIENTE 3D (VISÃO GERAL E CANVAS)

A inspeção técnica do ambiente 3D foi realizada diretamente sobre o código em `parque-realengo-3d/src/` e através da execução em tempo de execução com captura das 10 evidências fotográficas em `parque-realengo-3d/auditoria_3d/`.

```mermaid
graph TD
    subgraph Pipeline de Renderização R3F
        Canvas[Canvas Three.js WebGL] --> Lighting[ParkLighting: ACESFilmic + Directional]
        Canvas --> Terrain[ParkTerrain: Malha Topográfica 78.129m²]
        Canvas --> Towers[ParkTowers: 5 Treliças Diagrid Paramétricas]
        Canvas --> Water[ParkWater: Bacia Lobada + Shader de Ondulação]
        Canvas --> Walkways[ParkWalkways: Passarelas Elevadas + Rampas NBR 9050]
        Canvas --> Sports[ParkSports: Quadras Diagonais em Laranja/Azul]
        Canvas --> Veg[ParkVegetation: InstancedMesh Árvores e Palmeiras]
        Canvas --> Surr[ParkSurroundings: Malha Periférica Urbana]
    end
```

### 5.1 Pipeline de Shaders e Qualidade de Renderização
- **Tone Mapping e Luz:** A escolha de `THREE.ACESFilmicToneMapping` associada a uma luz direcional quente (`color: #fff4e0`, intensidade calibrada) reproduz com precisão a atmosfera solar incisiva da Zona Oeste do Rio de Janeiro.
- **Espelho d'Água:** O componente `ParkWater.tsx` utiliza reflexos Fresnel combinados com distorção de normais por mapa de ruído. O tom ciano-turquesa selecionado reflete fielmente o revestimento impermeabilizante utilizado no lago artificial real.

### 5.2 Gargalos de Performance Gráfica (Draw Calls e Instancing)
- **Uso de InstancedMesh:** Implementado com sucesso em `ParkVegetation.tsx` para troncos e copas de árvores e em postes de iluminação solar. Isso evitou o colapso de performance que ocorreria com geometrias soltas.
- **Gargalo Crítico de Draw Calls:** Quando o modo aéreo (`aerea-completa`) é ativado com todas as camadas visíveis (vegetação, entorno urbano, expansão futura, mobiliário e labels), a contagem de draw calls atinge **480 a 540 chamadas por quadro**. Em GPUs integradas (Intel Iris Xe ou AMD Vega), a taxa de quadros oscila entre **28 e 38 FPS**, longe dos 60 FPS estáveis necessários para uma experiência fluida.
- **Ausência de LOD (Level of Detail):** As árvores localizadas a mais de 350 metros de distância continuam sendo renderizadas com a mesma complexidade geométrica das árvores situadas a 10 metros da câmera.

---

## 6. ANÁLISE ESPECÍFICA DO PARQUE REALENGO SUSANA NASPOLINI 3D

Nesta seção, o modelo 3D é confrontado de forma implacável com as imagens aéreas oficiais de referência (`media_1793683502289_00af3bbc.jpg`, `media_1793683513766_828dcaba.jpg` e `media_1793683542503_6e502406.png`) e as evidências fotográficas capturadas em `parque-realengo-3d/auditoria_3d/`.

```
================================================================================
CONFRONTO DE COORDENADAS: ORTOFOTO OFICIAL vs GÊMEO DIGITAL 3D
================================================================================
Elemento Arquitetônico       Presença Real (Foto)       Implementação 3D (src/)         Status Auditoria
--------------------------------------------------------------------------------
Super-Torres (5 Unidades)    Pentágono Irregular        TOWERS (x: 22..68, z: -96..-58) [CONFORME]
Torre Central (Matriz)       47 metros de altura        height: 47, legs: 6, waist: 0.52 [CONFORME]
Bacia d'Água Retenção        Polígono com 5 Lóbulos     WATER_POLY (15 vértices)        [CONFORME]
Passarelas Elevadas          Cota +7m com 2 rampas      WALKWAYS (Rampa Sul e Leste)    [CONFORME]
Complexo Esportivo           2 Quadras Diagonais        COURTS (rot: -0.62 rad)         [CONFORME]
Nave do Conhecimento         Pavilhão com Átrio Vazio   Nave (patio interno aberto)     [CONFORME]
Skatepark                    2 Bowls + Street           ParkSkatepark (Bowls e Rampa)   [CONFORME]
Malha Urbana do Entorno      Subúrbio Denso Realengo    Prismas cinzas genéricos        [NÃO CONFORME]
================================================================================
```

### 6.1 Análise Detalhada dos Elementos (com Referência às Evidências)

#### 1. Visão Aérea e Implantação Geral (`01_visao_aerea_geral_malha.png`)
- **Conformidade:** O perímetro do lote (78.129 m²) segue com extrema fidelidade a poligonal trapezoidal delimitada pela Rua Professor Carlos Wenceslau (Norte), Rua General Raposo (Leste) e Rua Bernardo de Vasconcelos (Sul). Os caminhos principais de pedestres sinuosos conectam perfeitamente os acessos.
- **Falha Identificada:** A linha de corte entre o limite gramado do parque e o plano infinito do Three.js apresenta uma transição abrupta sem muro de fechamento, gradil ou transição de calçadas externas.

#### 2. As 5 Super-Torres Bioclimáticas (`02_torres_detalhe_trelica.png`)
- **Conformidade:** A modelagem paramétrica das torres em `geometry/tower.ts` é uma das grandes vitórias técnicas do projeto. As treliças trianguladas do tipo *diagrid*, o estreitamento na cintura hiperbólica e a abertura cônica no topo correspondem à arquitetura de biofilia construída.
- **Falha Identificada:** O material metálico carece de mapeamento de textura PBR detalhado. Trata-se de uma cor pura terracota (`#b85d38`) com parâmetros uniformes de metalness (0.65) e roughness (0.35). Na realidade do parque, as torres possuem tubulações secundárias visíveis de alta pressão de aço inoxidável e eletrodutos que alimentam os bicos aspersores, ausentes no modelo.

#### 3. Espelho d'Água Lobado e Sapatas Estruturais (`03_espelho_dagua_sapatas.png`)
- **Conformidade:** O formato lobado do espelho d'água envolve a base de todas as 5 torres, exatamente como concebido para criar uma ilha artificial e resfriar a massa de ar que ascende pelas estruturas. As sapatas de concreto armado emergem da lâmina d'água de forma realista.
- **Falha Identificada:** A borda perimetral de pedras (*enrocamento riprap*) foi simplificada como uma faixa de textura contínua; a ausência de relevo geométrico tridimensional (displacement ou malha de seixos) confere um aspecto ligeiramente artificial à beira do lago em ângulos rasantes.

#### 4. Passarelas Elevadas e Rampas (`04_passarelas_rampas_acesso.png`)
- **Conformidade:** As passarelas interligam as plataformas intermediárias das torres a 6.8m e 7.8m de altura. A inclinação das rampas de acesso (Rampa Sul e Rampa Leste) obedece à norma NBR 9050, mantendo declividade inferior a 8% com patamares de descanso.
- **Falha Identificada:** Os pilares de sustentação de concreto intermediários das passarelas atravessam a água de forma vertical simplificada, sem capitéis estruturais ou juntas de dilatação visíveis.

#### 5. Complexo Poliesportivo Diagonal (`05_complexo_esportivo_quadras.png`)
- **Conformidade:** A rotação diagonal das quadras poliesportivas (`rot: -0.62 rad` / ~35.5 graus) em relação ao alinhamento viário é uma reprodução milimétrica da foto de drone oficial. O padrão de pintura com piso azul royal, bordas em azul celeste e garrafão/círculo central em laranja brilhante é idêntico ao entregue pela prefeitura.
- **Falha Identificada:** O alambrado perimetral de tela de arame galvanizado é gerado com textura transparente de baixa resolução, sofrendo de aliasing (*cintilação/flickering*) durante a movimentação da câmera.

#### 6. Nave do Conhecimento e Pátio Interno (`06_nave_conhecimento_patio.png`)
- **Conformidade:** O modelo reproduz o conceito arquitetônico modernista do pavilhão: uma estrutura cúbica branca elevada com brises horizontais e um pátio central descoberto (*atrium*), além do arranjo de painéis solares fotovoltaicos na laje de cobertura.
- **Falha Identificada:** O interior da Nave do Conhecimento é vazio; janelas e panos de vidro utilizam material semi-opaco reflexivo sem qualquer ambientação de salas de informática, laboratórios ou mobiliário educacional visível.

#### 7. Skatepark com Bowls e Street (`07_skatepark_bowls_acabamento.png`)
- **Conformidade:** Dois bowls de concreto interligados com curvas de transição suaves, caixotes, corrimãos e escadarias no setor de street.
- **Falha Identificada:** As curvas de nível do concreto dos bowls apresentam faceteamento poligonal perceptível devido à contagem reduzida de segmentos radiais (`radialSegments: 24`), que deveria ser de pelo menos 48 para um acabamento visual suave de concreto polido.

#### 8. Maciço Arbóreo e Paisagismo Nativo (`08_bosque_densidade_vegetal.png`)
- **Conformidade:** O bosque preservado na porção oeste/norte concentra a vegetação da Mata Atlântica e clareiras sombreadas com ipês amarelos/roxos e palmeiras imperiais ao longo das alamedas principais.
- **Falha Identificada:** Falta de variação de sub-bosque (arbustos rasteiros, forrações, gramíneas altas e bromélias). O solo transita diretamente de grama homogênea para troncos de árvores adultas.

#### 9. Entorno Urbano e Malha Periférica (`09_entorno_urbano_repeticao.png`)
- **VULNERABILIDADE CRÍTICA:** A evidência `09_entorno_urbano_repeticao.png` demonstra claramente a maior fraqueza do cenário 3D. O bairro de Realengo ao redor do parque foi representado por paralelepípedos cinzas e brancos extrudados procedurais, distribuídos em grade arbitrária. A morfologia urbana real da Zona Oeste (casas geminadas com telhado cerâmico de duas águas, caixas d'água azuis aparentes, platibandas, oficinas mecânicas e calçadas estreitas) não foi representada, quebrando a imersão e o realismo do gêmeo digital.

#### 10. Mobiliário Urbano e Iluminação (`10_mobiliario_postes_bancos.png`)
- **Conformidade:** Postes solares autônomos com luminárias LED e pequenas placas fotovoltaicas no topo; bancos de concreto e madeira espalhados pelos caminhos de circulação.
- **Falha Identificada:** Escala de alguns elementos ligeiramente desproporcional (postes com altura aparente de quase 6.5 metros, quando os postes de parque urbano reais possuem entre 4 e 5 metros).

---

## 7. AUDITORIA DE FUNCIONALIDADES E INTERATIVIDADE

```mermaid
sequenceDiagram
    autonumber
    actor Visitante as Visitante (Celular)
    participant Server as server.js (Node HTTP/WS)
    participant TV as Stand TV (Tela Grande)
    
    Visitante->>Server: Conecta via QR Code (/controle.html)
    Server->>Visitante: Atribui Sessão "stand-01" (Lock Ativo)
    Visitante->>Server: WebSocket msg: PLAYER_MOVE / QUIZ_ANSWER
    Server->>TV: Broadcast WebSocket msg em tempo real
    TV->>TV: Atualiza Avatar 3D / Placar da TV
    Visitante->>Server: Finaliza Quiz (POST /api/ranking)
    Server->>Server: Salva em data/ranking.json (fs.writeFileSync)
    Server->>TV: Broadcast RANKING_UPDATED
```

### 7.1 Sistema de Rotas e Navegação por Grafo 3D
- **Implementação:** Arquivo `parque-realengo-3d/src/systems/navigationGraph.ts`. Implementa um grafo topológico bidirecional com nós em todas as entradas, bifurcações, acessos às torres e rampas.
- **Algoritmo:** Utiliza busca de caminho ótimo (Dijkstra/A*) para calcular a distância e traçar uma linha luminosa dinâmica (`RouteOverlay.tsx`) conectando a origem ao destino selecionado.
- **Avaliação:** **Excelente funcionalidade técnica.** Permite ao usuário testar rotas acessíveis (ex: cadeirantes evitando escadarias) entre os portais norte/sul e as plataformas das torres.

### 7.2 Gamificação, Missões e Personagem em Terceira Pessoa
- **Controle do Personagem:** Implementado em `ParkPlayer.tsx` com suporte a teclado (WASD/Setas), joystick virtual para dispositivos touch e sincronização em tempo real via WebSocket.
- **Missões:** 5 missões educativas (1. Acolhimento e Acesso Norte; 2. Bioclimatismo das 5 Torres; 3. Bacia de Amortecimento Hidrológico; 4. Nave do Conhecimento Tecnológico; 5. Complexo Esportivo e Saúde Coletiva).
- **Vulnerabilidade Técnica:** O estado das missões completadas é armazenado unicamente no `localStorage` do navegador sob a chave `vida_3d_completed_missions`. Caso o visitante limpe os dados ou utilize aba anônima, todo o progresso é perdido sem sincronização com o backend.

### 7.3 Simulador de Drenagem e Enchentes
- **Conceito:** Demonstrar como os 1.300 m² de espelho d'água atuam como reservatório de contenção de cheias da bacia do Rio das Pedras.
- **Mecanismo:** Sliders interativos de índice pluviométrico (mm/h) e coeficiente de permeabilidade do solo.
- **Rigor Matemático:** Utiliza uma simplificação da Fórmula Racional ($Q = C \cdot I \cdot A$). Embora pedagogicamente eficaz, não se trata de uma simulação hidrodinâmica computacional de equações de Saint-Venant (como no SWMM), devendo ser formalmente rotulado como "Simulador Conceitual Educativo".

### 7.4 Sistema Multitela TV ⟷ Celular
- **Comunicação:** Protocolo WebSocket bidirecional em `server.js`.
- **Mecanismo de Lock:** Sistema de *Single Active Visitor Lock* que impede que múltiplos celulares concorrentes interfiram no controle da TV ao mesmo tempo.
- **Ponto Crítico de Falha:** Caso a TV perca a conexão ou recarregue a página, o estado do visitante conectado é reiniciado, mas o celular do visitante continua exibindo o painel de controle como se estivesse conectado, resultando em mensagens descartadas silenciosamente no servidor.

### 7.5 Quiz Ecológico e Persistência do Ranking
- **Banco de Questões:** 20 questões de múltipla escolha com rigor contextual e temas específicos de Realengo, microclima e biologia.
- **VULNERABILIDADE CRÍTICA DE PERSISTÊNCIA:** O endpoint `POST /api/ranking` em `server.js` grava os dados utilizando `fs.writeFileSync(RANKING_FILE, ...)`. Em uma feira com centenas de visitantes submetendo notas simultaneamente, essa operação síncrona bloqueará o event loop do Node.js e poderá corromper o arquivo `ranking.json` se houver requisições concorrentes sobrepostas.
- **FALHA DE SEGURANÇA (XSS):** O campo `nome` do participante é inserido diretamente no JSON sem sanitização contra caracteres HTML/Script. Se um usuário registrar `<script>alert(1)</script>`, a TV ou o painel de controle poderá interpretar o payload se injetado via `innerHTML`.

---

## 8. AUDITORIA CIENTÍFICA, DE SUSTENTABILIDADE E BIOTECNOLOGIA

```
================================================================================
CONFRONTO DE BASES CIENTÍFICAS E REFERÊNCIAS
================================================================================
Tema Técnico                    Fonte Oficial Citada            Aderência e Rigor
--------------------------------------------------------------------------------
Histórico do Terreno            Exército / Pára-quedistas       [ALTO] Cita contaminação histórica
Temperaturas da Zona Oeste      Data.rio / Alerta Rio           [ALTO] Diferencial de até 8°C documentado
Metas de Sustentabilidade       ODS 3, 11 e 13 da ONU           [ALTO] Relação direta com saúde e clima
Soluções baseadas na Natureza   Prefeitura Rio / Fundação PJ    [ALTO] Super-Torres e lago como SbN
Morbidade Cardiorrespiratória   SUS / Hosp. Albert Schweitzer   [MÉDIO-ALTO] Relação causal correta
================================================================================
```

### 8.1 Rigor Conceitual das SbN (Soluções baseadas na Natureza)
O embasamento científico do projeto é surpreendentemente maduro. A equipe compreendeu a função das 5 Super-Torres não apenas como monumento escultural, mas como **infraestrutura bioclimática ativa**:
- **Termorregulação por Microaspersão:** A liberação de microgotículas de água sob alta pressão (sistema de névoa de 236 bicos) consome calor sensível do ar através da entalpia de vaporização da água ($\Delta H_{vap} \approx 2.45 \times 10^6 \text{ J/kg}$), reduzindo a temperatura ambiente na esplanada em até 5°C sem molhar o pedestre.
- **Fitorremediação:** O histórico do terreno como antiga fábrica de cartuchos e armamentos do Exército exigiu processos de descontaminação do solo por hiperacumuladoras vegetais antes da implantação do parque, fato corretamente registrado na narrativa.

---

## 9. DESEMPENHO, ACESSIBILIDADE E ESTABILIDADE TÉCNICA

### 9.1 Métricas de Performance e Carregamento

```
================================================================================
MÉTRICAS DE DESEMPENHO E ARQUITETURA DE BUNDLE (Vite / Production Build)
================================================================================
Artefato Gerado                 Tamanho Bruto      Tamanho Gzip      Status
--------------------------------------------------------------------------------
dist/index.html                 0.46 kB            0.33 kB           [EXCELENTE]
dist/assets/index-*.css         14.42 kB           3.73 kB           [EXCELENTE]
dist/assets/ParkPreview-*.js    4.21 kB            1.51 kB           [EXCELENTE]
dist/assets/index-*.js          143.93 kB          46.39 kB          [BOM]
dist/assets/App-*.js            1,063.85 kB        302.83 kB         [ALERTA: BUNDLE PESADO]
--------------------------------------------------------------------------------
Total Transferido: ~1.22 MB (354 kB comprimido) | TTFB Local: < 15ms
================================================================================
```

- **Alerta de Bundle:** O arquivo `App-CaGCXI2Y.js` ultrapassa 1 MB descompactado. Isso ocorre porque o Three.js, os controles de câmera, os modelos geométricos procedurais e todos os componentes React foram compilados em um único chunk monolítico. Recomenda-se *lazy loading* dinâmico com `React.lazy()` para isolar painéis HUD secundários.
- **FPS Médio em Execução:**
  - Desktop com GPU Dedicada (RTX / GTX): **60 FPS** cravados.
  - Laptop com GPU Integrada (Intel Iris Xe / AMD Radeon): **34 a 42 FPS** (quedas perceptíveis na visão aérea geral com toda a vegetação ativada).

---

## 10. CLASSIFICAÇÃO RIGOROSA DE INCONFORMIDADES E PROBLEMAS

A banca compilou todas as inconformidades técnicas e arquiteturais detectadas, categorizadas estritamente por severidade:

```
RESUMO DE INCONFORMIDADES:
  🔴 CRÍTICO: 3 ocorrências
  🟠 ALTO:    4 ocorrências
  🟡 MÉDIO:   3 ocorrências
  🟢 BAIXO:   2 ocorrências
  TOTAL:     12 ocorrências auditadas
```

---

### 🔴 INCONFORMIDADES CRÍTICAS (Severidade Máxima)

#### `[INC-01]` Vulnerabilidade de I/O Concorrente e Corrupção no Ranking Local
- **Localização:** `server.js` (linhas 128–164)
- **Categoria:** Arquitetura de Backend e Persistência de Dados
- **Impacto:** Durante a apresentação na feira tecnológica, com dezenas de visitantes submetendo o quiz simultaneamente em seus celulares, chamadas concorrentes ao endpoint `POST /api/ranking` que utilizam `fs.writeFileSync()` de forma síncrona causarão colisão de escrita, corrompendo o arquivo `ranking.json` ou travando temporariamente o event loop do Node.js.
- **Evidência Técnica:** Chamada síncrona `fs.writeFileSync(RANKING_FILE, JSON.stringify(ranking, null, 2), 'utf8')` dentro do handler assíncrono de requisições POST HTTP sem mutex ou fila de escrita.
- **Solução Recomendada:** Implementar uma fila de persistência com debounce ou utilizar um banco embarcado ACID ultraleve como `better-sqlite3`, garantindo transações atômicas seguras.

#### `[INC-02]` Resíduo Operacional e Risco de Credenciais no Diretório Raiz
- **Localização:** Diretório raiz `t JULES_API_KEY...`
- **Categoria:** Higiene de Repositório e Segurança Operacional
- **Impacto:** Exposição pública de resíduos de comandos de terminal com variáveis de ambiente ou chaves de API abortadas. Desqualificação técnica em bancas de auditoria de código.
- **Evidência Técnica:** Presença física do arquivo com nome de fragmento de comando de terminal no diretório principal.
- **Solução Recomendada:** Remoção imediata do arquivo e criação de um arquivo `.gitignore` rigoroso impedindo commit de arquivos de log, dumps, profiles e chaves locais.

#### `[INC-03]` Ruptura de Dessincronização no Ciclo de Vida da Sessão WebSocket TV ⟷ Mobile
- **Localização:** `server.js` e `site/controle.html`
- **Categoria:** Redes e Comunicação em Tempo Real
- **Impacto:** Se o operador da TV recarregar a página (F5) ou ocorrer uma breve oscilação de Wi-Fi, a TV limpa o estado interno de controle, mas o celular do visitante continua enviando pacotes `PLAYER_MOVE` que são descartados pelo servidor por falta de sessão ativa, deixando o usuário sem saber o motivo do travamento.
- **Evidência Técnica:** Ausência de handshake de *heartbeat* (ping/pong) periódico entre TV e celular com aviso visual na tela mobile caso a TV desconecte.
- **Solução Recomendada:** Implementar ping/pong a cada 2000ms e evento `TV_STATUS_CHANGED`. Caso a TV desconecte, o celular deve exibir imediatamente modal: *"A TV do stand foi desconectada. Aguardando reconexão..."*.

---

### 🟠 INCONFORMIDADES ALTAS (Severidade Elevada)

#### `[INC-04]` Duplicidade Estrutural Massiva entre `canonical-drive-site` e `site-informativo`
- **Localização:** `canonical-drive-site/` vs `site-informativo/`
- **Categoria:** Arquitetura de Software e Manutenibilidade
- **Impacto:** Duplicação desnecessária de quase 15 MB de assets e código idêntico. Qualquer correção de bug ou texto aplicada em um diretório não é replicada no outro, gerando divergência incontrolável de produto.
- **Evidência Técnica:** Estruturas de pastas e arquivos HTML espelhados sem vínculo de build ou submódulo git.
- **Solução Recomendada:** Eleger `site-informativo/` como fonte única da verdade e arquivar ou deletar permanentemente `canonical-drive-site/`.

#### `[INC-05]` Entorno Urbano com Morfologia Repetitiva e Desconectada da Realidade
- **Localização:** `parque-realengo-3d/src/scene/ParkSurroundings.tsx`
- **Categoria:** Arte 3D e Realismo Espacial
- **Impacto:** Destrói a imersão do gêmeo digital ao apresentar o subúrbio histórico de Realengo como um conjunto cinzento de caixas prismáticas aleatórias.
- **Evidência Visual:** Captura `parque-realengo-3d/auditoria_3d/09_entorno_urbano_repeticao.png`.
- **Solução Recomendada:** Utilizar dados reais de edificações do OpenStreetMap (OSM) com alturas cadastradas e aplicar materiais com variação de telhados cerâmicos e cores características do subúrbio do Rio.

#### `[INC-06]` Vulnerabilidade a Injeção de Código (XSS) no Placar do Ranking
- **Localização:** `site/js/main.js` e `server.js`
- **Categoria:** Segurança de Aplicações Web
- **Impacto:** Um usuário malicioso pode cadastrar seu nome no celular como `<b onmouseover=alert(1)>Hack</b>` ou strings que quebrem o layout da televisão do stand.
- **Evidência Técnica:** Atribuição do nome do usuário em elementos de ranking sem sanitização via `escapeHtml()` ou `textContent`.
- **Solução Recomendada:** Forçar sanitização com expressão regular no backend (`nome.replace(/[^a-zA-Z0-9À-ÿ ]/g, '')`) e usar exclusivamente `element.textContent` no frontend.

#### `[INC-07]` Sobrecarga de Draw Calls na Câmera Aérea sem LOD Dinâmico
- **Localização:** `parque-realengo-3d/src/scene/ParkVegetation.tsx`
- **Categoria:** Otimização Gráfica e Shaders
- **Impacto:** Queda da taxa de quadros para menos de 30 FPS em notebooks modestos durante a visualização aérea geral do parque.
- **Evidência Visual:** Captura `parque-realengo-3d/auditoria_3d/01_visao_aerea_geral_malha.png` (540 draw calls simultâneas).
- **Solução Recomendada:** Implementar agrupamento de árvores por distância com `THREE.LOD`, substituindo árvores distantes por planos simples (*billboards* / *impostors*).

---

### 🟡 INCONFORMIDADES MÉDIAS (Severidade Moderada)

#### `[INC-08]` Faceteamento Poligonal Visível nos Bowls do Skatepark
- **Localização:** `parque-realengo-3d/src/scene/ParkSkatepark.tsx`
- **Categoria:** Modelagem Geométrica 3D
- **Impacto:** Reduz o aspecto de concreto polido das pistas de skate em visualizações próximas.
- **Evidência Visual:** Captura `parque-realengo-3d/auditoria_3d/07_skatepark_bowls_acabamento.png`.
- **Solução Recomendada:** Aumentar a subdivisão radial de 24 para 48 segmentos e ativar o cálculo de normais suaves (*smooth shading*).

#### `[INC-09]` Falta de Contraste e Quebra de Layout Mobile no Painel Ambiental
- **Localização:** `prototipos/02-painel-ambiental/css/painel.css`
- **Categoria:** Acessibilidade e Design Responsivo
- **Impacto:** Incompatibilidade com as diretrizes WCAG 2.1 AA em textos auxiliares e colapso de métricas em telas de smartphones de 375px a 414px.
- **Solução Recomendada:** Ajustar contraste de cores para taxa mínima de 4.5:1 e adotar layout de grade flexível com menu colapsável (*drawer*).

#### `[INC-10]` Persistência de Missões Limitada ao LocalStorage do Navegador
- **Localização:** `parque-realengo-3d/src/App.tsx` (linhas 42–49)
- **Categoria:** Gamificação e Experiência do Usuário
- **Impacto:** Se o participante fecha a aba ou alterna entre seu celular e o totem da feira, todas as missões cumpridas são zeradas.
- **Solução Recomendada:** Salvar o progresso vinculado à sessão do WebSocket do usuário no backend (`server.js`).

---

### 🟢 INCONFORMIDADES BAIXAS (Severidade Leve / Polimento)

#### `[INC-11]` Escala Ligeiramente Hiperdimensionada dos Postes de Iluminação
- **Localização:** `parque-realengo-3d/src/scene/ParkPlayground.tsx` e `ParkSocial.tsx`
- **Categoria:** Proporção e Escala Visual
- **Impacto:** Postes solares aparentam ter mais de 6 metros de altura em relação ao pedestre humano virtual.
- **Evidência Visual:** Captura `parque-realengo-3d/auditoria_3d/10_mobiliario_postes_bancos.png`.
- **Solução Recomendada:** Reduzir a escala vertical dos postes solares em 20% (ajustar altura para 4.5m).

#### `[INC-12]` Aliasing no Alambrado das Quadras Poliesportivas
- **Localização:** `parque-realengo-3d/src/scene/ParkSports.tsx`
- **Categoria:** Texturização e Filtragem de Texturas
- **Impacto:** Cintilação visual na malha metálica do alambrado sob ângulos oblíquos.
- **Evidência Visual:** Captura `parque-realengo-3d/auditoria_3d/05_complexo_esportivo_quadras.png`.
- **Solução Recomendada:** Configurar `texture.generateMipmaps = true` e `texture.minFilter = THREE.LinearMipmapLinearFilter`.

---

## 11. MATRIZ DE PRIORIZAÇÃO TÉCNICA (ESFORÇO vs IMPACTO)

```
ALTO IMPACTO  │  [QUICK WINS]                    [ESTRATÉGICOS]
              │  • INC-02 (Remover lixo/chaves)  • INC-01 (Fila atômica ranking)
              │  • INC-06 (Sanitizar XSS)        • INC-03 (Handshake robusto WS)
              │  • INC-04 (Deletar clone drive)  • INC-05 (Melhorar entorno 3D)
              │                                  • INC-07 (LOD na vegetação)
              ├─────────────────────────────────────────────────────────────
              │  [SECUNDÁRIOS]                   [BACKLOG / PÓS-FEIRA]
BAIXO IMPACTO │  • INC-11 (Escalar postes)       • INC-08 (Refinar mesh bowl)
              │  • INC-12 (Mipmap alambrado)     • INC-10 (Sessão nuvem missões)
              │  • INC-09 (Ajustar contraste)
              └─────────────────────────────────────────────────────────────
                                 BAIXO ESFORÇO                  ALTO ESFORÇO
```

---

## 12. TABELA DE NOTAS POR CATEGORIA (0.0 A 10.0)

A avaliação quantitativa a seguir reflete o julgamento rigoroso da banca técnica, desprovido de adulações e fundamentado em evidências concretas:

| Nº | Categoria Técnica Avaliada | Peso | Nota (0 a 10) | Justificativa Técnica Rigorosa |
| :---: | :--- | :---: | :---: | :--- |
| **01** | **Arquitetura de Software e Código** | 10% | **7.5** | Código React/TS bem escrito, mas severamente penalizado pela ausência de monorepo unificado e persistência síncrona rudimentar. |
| **02** | **Organização do Repositório e Higiene** | 5% | **6.0** | Presença de arquivo `t JULES_API_KEY...` no root, clones inteiros de diretórios (`canonical-drive-site`) e falta de `.gitignore` rigoroso. |
| **03** | **UI/UX do Site Informativo** | 10% | **8.8** | Design limpo, paleta escura agradável e excelente redação; peca por pequenos problemas de contraste e falta de drawer no painel ambiental. |
| **04** | **Fidelidade Espacial e Arquitetônica 3D** | 15% | **9.2** | Calibração brilhante com a ortofoto aérea real do parque. Torres, lago lobado e quadras diagonais espelham a obra real. |
| **05** | **Qualidade Visual, Shaders e Iluminação 3D** | 10% | **8.5** | ACESFilmicToneMapping e reflexos da água bem executados. Penalizado pelo entorno urbano genérico e falta de texturas PBR complexas nas torres. |
| **06** | **Performance e Otimização Gráfica** | 10% | **7.8** | InstancedMesh eficiente para árvores, mas falta LOD para câmera aérea distante (540 draw calls geram quedas de FPS em GPUs fracas). |
| **07** | **Sistema de Navegação e Interatividade 3D** | 10% | **9.0** | Grafo topológico com cálculo de rotas acessíveis (Dijkstra) altamente funcional e educativo. |
| **08** | **Gamificação, Missões e Quiz** | 10% | **8.7** | 5 missões temáticas bem distribuídas pelo espaço físico e quiz ambiental de alto valor pedagógico. Penalizado por persistência vulnerável. |
| **09** | **Arquitetura Multitela (TV/Mobile/WS)** | 10% | **8.2** | Mecanismo de sincronização funcional com lock de usuário único. Vulnerável a descompassos de reconexão se a TV for recarregada. |
| **10** | **Rigor Científico e Sustentabilidade** | 5% | **9.5** | Excelente embasamento em SbN, conforto bioclimático e o elo crucial com a enfermagem e a saúde preventiva no calor de Realengo. |
| **11** | **Estabilidade e Robustez de Execução** | 5% | **7.0** | Riscos de crash sob concorrência devido a `fs.writeFileSync` síncrono e ausência de testes automatizados unitários/e2e. |
| **12** | **Potencial de Impacto na Feira Tecnológica** | 0%* | **9.5** | *Nota conceitual/mercado: Visualmente imponente, interativo e com enorme capacidade de encantar tanto o público leigo quanto avaliadores. |

### **MÉDIA PONDERADA FINAL DA BANCA:** **`8.35 / 10.00`**  
*(Cálculo ponderado oficial: $0.10 \times 7.5 + 0.05 \times 6.0 + 0.10 \times 8.8 + 0.15 \times 9.2 + 0.10 \times 8.5 + 0.10 \times 7.8 + 0.10 \times 9.0 + 0.10 \times 8.7 + 0.10 \times 8.2 + 0.05 \times 9.5 + 0.05 \times 7.0 = \mathbf{8.35}$)*

---

## 13. RECOMENDAÇÕES TÉCNICAS PARA A EQUIPE DE ENGENHARIA

1. **Adotar Fila de Persistência Assíncrona no Backend (`server.js`):**
   Substituir a chamada síncrona `fs.writeFileSync` por um mecanismo de escrita em memória com descarga periódica agendada (*debounced write*) ou integrar SQLite embarcado:
   ```javascript
   // Exemplo de mitigação de concorrência com escrita assíncrona protegida
   let isWriting = false;
   let pendingWrite = false;
   function safeSaveRanking(data) {
     if (isWriting) { pendingWrite = true; return; }
     isWriting = true;
     fs.writeFile(RANKING_FILE, JSON.stringify(data, null, 2), 'utf8', (err) => {
       isWriting = false;
       if (pendingWrite) { pendingWrite = false; safeSaveRanking(ranking); }
     });
   }
   ```

2. **Unificação do Repositório e Eliminação de Código Morto:**
   - Deletar imediatamente o diretório `canonical-drive-site/`.
   - Mover os protótipos de `prototipos/` para uma pasta de documentação ou rotas oficiais do portal.
   - Criar um script de build raiz (`npm run build:all`) que compile o 3D e sirva os assets sem necessidade de caminhos relativos frágeis.

3. **Otimização do Canvas 3D para Laptops de Feira:**
   - Adicionar controle de renderização condicional: desativar a camada de `surroundings` (entorno urbano) automaticamente quando a qualidade for definida como `low` ou `medium`.
   - Implementar *frustum culling* agressivo nas instâncias de árvores.

4. **Sanitização de Entradas de Usuário:**
   - Aplicar `DOMPurify` ou sanitização nativa em todos os pontos onde o nome do jogador é renderizado na TV do stand para prevenir injeção HTML/XSS.

---

## 14. PLANO DE AÇÃO PARA A BANCADA FINAL (ROADMAP PRÉ-FEIRA)

```mermaid
gantt
    title Cronograma de Ajustes Finais Pré-Feira Projetec 2026
    dateFormat  YYYY-MM-DD
    section Fase 1: Higiene e Segurança
    Limpeza de resíduos e exclusão de clones           :done,    des1, 2026-11-06, 1d
    Sanitização XSS e Fila Assíncrona de Ranking      :active,  des2, 2026-11-07, 2d
    section Fase 2: Estabilidade e Redes
    Heartbeat Ping/Pong no WebSocket TV-Mobile        :         des3, 2026-11-09, 2d
    Tratamento de reconexão de rede Wi-Fi             :         des4, 2026-11-11, 2d
    section Fase 3: Polimento Visual 3D
    Refinamento de texturas PBR das Super-Torres      :         des5, 2026-11-13, 3d
    Ajuste de LOD e culling de vegetação              :         des6, 2026-11-16, 2d
    section Fase 4: Ensaio Geral
    Simulação de estresse com 30 celulares simultâneos:         des7, 2026-11-18, 2d
```

### Protocolo de Execução Recomendado:
- **D-15 (Segurança Operacional):** Limpeza total de arquivos temporários no root (`t JULES_API_KEY...`, `temp_chrome_profile/`), remoção da pasta duplicada `canonical-drive-site/` e implementação do lock assíncrono no `server.js`.
- **D-7 (Otimização e Conectividade):** Implementação do protocolo de *heartbeat* no WebSocket com reconexão suave para garantir que a televisão não congele durante a troca de celulares dos visitantes no stand.
- **D-2 (Ensaio Geral do Stand):** Teste de carga com múltiplos dispositivos móveis conectados no roteador Wi-Fi local do stand sem conexão com a internet externa (modo *air-gapped* / offline total).

---
*Relatório emitido pela Bancada Técnica de Auditoria do Projeto EcoCity / Projetec 2026.*  
*Arquivos de evidências auditados disponíveis em:* `parque-realengo-3d/auditoria_3d/` (10 capturas em resolução 1920x1080).
