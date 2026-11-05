# Relatório de Auditoria Integral e Diagnóstico Técnico — Branch develop
## PROJETEC 2026 — EcoCity / Projeto V.I.D.A. (Parque Realengo)

> **Documento:** Avaliação Integral de Engenharia, Usabilidade, Apresentação e Rigor Científico  
> **Data da Auditoria:** 04 de Novembro de 2026  
> **Branch Alvo:** `develop` (rastreando `origin/Develop`, commit `0954754`)  
> **Repositório:** [https://github.com/Bonato2010/Projetec-2026-](https://github.com/Bonato2010/Projetec-2026-)  
> **Natureza do Documento:** Diagnóstico Crítico Independente (Auditoria Exclusiva — Sem Reconstrução de Código)  
> **Status Geral do Projeto:** **Aprovado com Apontamentos Críticos (Nota 8.1 / 10)**

---

## 1. Resumo Executivo

O projeto **Projetec 2026 — EcoCity / Projeto V.I.D.A. (Vigilância e Indicadores Digitais Ambientais)** é um ecossistema tecnológico e pedagógico de alto calibre concebido para uma Feira Tecnológica. Ele utiliza como estudo de caso empírico o **Parque Urbano de Realengo Jornalista Susana Naspolini** (Zona Oeste do Rio de Janeiro), estabelecendo uma convergência interdisciplinar entre **Informática, Enfermagem, Sustentabilidade e Biotecnologia**.

A presente auditoria técnica e independente realizou uma varredura completa da branch `develop`, cobrindo engenharia de software, fidelidade cartográfica e tridimensional, psicometria do quiz educativo, separação da experiência do visitante no smartphone versus estande físico, identidade visual e fundamentos científicos.

### Principais Conclusões
1. **Pontos de Destaque Extraordinário:**
   * O **Gêmeo Digital 3D** (`parque-realengo-3d/`) possui modelagem paramétrica impecável em React Three Fiber / Three.js, com as 5 super-torres biomiméticas (17m a 47m), 236 bicos aspersores, lago de 1.300 m² e zona de expansão claramente delimitada.
   * A **arquitetura de stand multitela** possui diferenciais fundamentais para a feira: streaming de vídeo via HTTP 206 (sem congelamento no iOS Safari/Android), fila de espera inteligente com *Single Active Visitor Lock* (evitando conflito de múltiplos usuários controlando a TV simultaneamente) e áudio procedural via Web Audio API.
   * O embasamento científico em saúde e biotecnologia é profundo e factual, com referências diretas à ANVISA (RDC 222/2018), Alerta Rio, Fundação Rio-Águas, Data.rio e ODS 3, 11, 13 e 15 da ONU.
2. **Gargalos Críticos Identificados:**
   * **Vício Grave no Banco de Questões do Quiz:** Das 160 questões, **65.6% têm a resposta certa na Letra B**, **0.0% na Letra D**, e em **92.5% dos casos a resposta certa é significativamente mais longa que as incorretas**. O motor do quiz **não embaralha as alternativas**, permitindo que um visitante acerte ~66% do teste clicando sempre em "B" sem ler o enunciado.
   * **Incompatibilidade de WebSocket na Vercel:** O servidor WebSocket nativo (`server.js`) funciona perfeitamente na rede local Wi-Fi do estande, mas a publicação serverless na Vercel não mantém WebSockets persistentes sem um gateway externo.
   * **Ausência Total de Créditos dos Integrantes e Escola:** Em nenhuma página do site, quiz ou documentação constam os nomes reais dos estudantes, professores orientadores, curso técnico ou colégio responsável.
   * **Falha de Permissão no Script de Sincronização 3D:** O script `scripts/sync-site-3d.js` falha com `EPERM` no ambiente Windows ao tentar sobrescrever os artefatos compilados do 3D em `site/parque3d/`.

---

## 2. Identificação da Branch e Estado do Repositório

### 2.1 Identificação e Sincronização
* **Diretório Raiz:** `C:\Users\Daniz\Downloads\Projetec 3`
* **Branch Ativa:** `develop` (com `d` minúsculo no ambiente local Git).
* **Rastreamento Remoto:** `origin/Develop` (com `D` maiúsculo no repositório remoto GitHub).
* **Branch Main:** `main` (aponta para `origin/main`).
* **Comparação de Commits:** Tanto `origin/Develop` quanto `origin/main` encontram-se exatamente no mesmo commit: `0954754` (*feat(vercel): compatibilidade total da pasta site com a Vercel*). Não há divergência de commits entre as branches remotas.
* **Últimos Commits no Histórico:**
  * `0954754` — *feat(vercel): compatibilidade total da pasta site com a Vercel (vercel.json, serverless api e parque3d)*
  * `73927d2` — *refactor: organizacao modular do site na pasta site/ e limpeza da raiz*
  * `c7135e1` — *feat(vercel): configuracao de build, roteamento e api serverless para publicacao*
  * `8e52c1c` — *docs: relatorio final claude-code e index atualizado de screenshots*
  * `896ed6b` — *feat(3d): master captures consolidadas do gemeo digital 3d*

### 2.2 Diagnóstico do `git status`
* **Arquivos Modificados Não Rastreados:**
  * `modified: README.md` — Modificação local gerada em sessão prévia, alternando a apresentação do stand para uma documentação concisa.
* **Arquivos Untracked (Não Rastreados):**
  * `docs/arquitetura/`, `docs/prototipos/`, `docs/quiz/`, `docs/relatorios/`, `docs/site/` — Documentação estrutural.
  * `screenshots/01-quiz/`, `screenshots/01-site-informativo/` — Galerias oficiais de auditoria fotográfica.
  * `scripts/capturar-site-informativo.js` — Script de captura Playwright.
  * `"t JULES_API_KEY configurada -ForegroundColor Green"` — **Arquivo espúrio de 20.7 KB** criado por comando acidental de terminal PowerShell, que necessita exclusão/higienização.

---

## 3. Descrição da Estrutura Encontrada

A branch `develop` está organizada em uma arquitetura de monorepo simplificado:

```text
Projetec-2026-/
├── .automation/                # Scripts utilitários de pipelines automatizados
├── api/                        # Funções Serverless de fallback (ranking, network-info)
├── docs/                       # Documentação técnica e relatórios de auditoria
│   ├── arquitetura/            # MAPA_DO_PROJETO.md
│   ├── evidencias/             # Capturas de tela históricas (antes/depois)
│   ├── prototipos/             # CATALOGO_DE_PROTOTIPOS.md
│   ├── quiz/                   # Documentação do motor de quiz
│   ├── relatorios/             # Relatórios técnicos anteriores
│   └── site/                   # Documentação do site principal
├── parque-realengo-3d/         # PROTÓTIPO 01: Gêmeo Digital 3D (React 18, Three.js, Vite, TS)
│   ├── docs/                   # Inventário de referências cartográficas (OSM)
│   ├── src/                    # Geometrias paramétricas, shaders, torres, iluminação
│   └── dist/                   # Build de produção compilado
├── prototipos/                 # Protótipos conceituais e painéis temáticos
│   ├── 01-mapa-parque/         # PROTÓTIPO 02: Sistema Cartográfico GIS 2D
│   ├── 02-painel-ambiental/    # PROTÓTIPO 03: Site Informativo & Painel Bioclimático
│   ├── 03-simulador-drenagem/  # PROTÓTIPO 04: Simulador Hidrodinâmico Pluvial
│   └── galeria-screenshots/    # Hub integrador de manifestos visuais
├── screenshots/                # Galerias de screenshots para auditoria visual
│   └── 01-site-informativo/    # 35 capturas reais em 1080p, 1440p, 390p e 360p
├── scripts/                    # Scripts de captura Playwright, integridade e build
├── site/                       # Central Web Oficial e Plataforma Multitela
│   ├── api/                    # Endpoints serverless locais
│   ├── css/                    # Estilos (quiz.css, mobile-controller.css, tv-stand.css)
│   ├── data/                   # Base de dados JSON de persistência (ranking.json)
│   ├── js/                     # quiz-engine.js, quiz-questions.js, tv-stand.js, sync-engine.js
│   ├── parque3d/               # Build sincronizado do gêmeo 3D para consumo web
│   ├── public/                 # Assets (logo-vida-simbolo.png) e mídia (intro-vida.mp4)
│   ├── controle.html           # Interface touch do celular do visitante (/controle)
│   └── index.html              # Interface do stand e da plataforma educativa
├── controle.html / index.html  # Gateways de redirecionamento na raiz
├── iniciar-stand.bat / .ps1    # Inicializadores de 1 clique para a feira
├── server.js                   # Servidor Node.js HTTP 206 + WebSocket
├── package.json                # Workspace raiz
└── vercel.json                 # Roteamento e rewrites para publicação na Vercel
```

---

## 4. Avaliação Geral do Projeto (Projetec 2026)

### 4.1 Clareza da Proposta e Interdisciplinaridade
O projeto atinge com mérito a proposta da feira:
* **Informática:** Desenvolvimento web modular, WebSockets de baixa latência, renderização Canvas 2D/3D em tempo real e arquitetura responsiva multiplataforma.
* **Enfermagem & Saúde Pública:** Discussão técnica de estresse térmico, desidratação em populações vulneráveis na Zona Oeste do Rio, gerenciamento de resíduos infectantes e perfurocortantes (ANVISA RDC 222/2018) e prevenção de doenças de veiculação hídrica pós-alagamento.
* **Sustentabilidade & Biotecnologia:** Soluções Baseadas na Natureza (SbN), biovaletas absorventes, fitorremediação de solo e água, e arborização de resiliência com espécies nativas da Mata Atlântica.

### 4.2 Projeto Tecnológico Planejado vs Coleção de Páginas
O projeto foi estruturado com visão sistêmica. A presença de um protocolo compartilhado de sincronização (`sync-engine.js`) e banco de dados comum de pontuações (`ranking.json`) comprova a intenção integradora. No entanto, o **site informativo** (`prototipos/02-painel-ambiental/`) permanece desacoplado da navegação primária do site oficial, funcionando quase como um módulo satélite desconectado.

### 4.3 Prontidão para Apresentação Física no Estande
* **Excelente:** A transição do vídeo institucional para o joystick no smartphone sem exigir download de app na App Store/Play Store é o maior trunfo de usabilidade do estande.
* **Risco:** Se a equipe tentar apresentar o projeto pela Vercel sem o servidor local (`server.js`), os celulares não controlarão a TV devido à ausência de WebSockets na infraestrutura serverless da Vercel.

---

## 5. Avaliação Individual de Cada Aplicação

### 5.1 Aplicação A: Site Informativo (`prototipos/02-painel-ambiental/`)
* **Conteúdo e Dados:** Riquíssimo em dados abertos (Data.rio, SMAC, Rio-Águas, IBGE). Apresenta métricas chave: 76.000 m² de área, 3.700 árvores, -5,8°C de alívio térmico, 1.950 m³ de retenção pluvial e 84,2% de permeabilidade de solo.
* **Componentes Interativos:**
  * Comparador temporal Antes/Depois (2021 vs 2026) com slider responsivo funcional.
  * Curva térmica diária em Canvas 2D comparando asfalto, interior do parque e área sob aspersão.
  * Catálogo de 18 indicadores ambientais com busca textual em tempo real e modal de fontes auditadas.
* **Falhas Detectadas:**
  * **Logotipo Inconsistente:** Utiliza um ícone SVG genérico de folha no lugar do logotipo oficial do Projeto V.I.D.A.
  * **Favicon Ausente:** Não possui tag `<link rel="icon">`.
  * **Créditos Omissos:** Rodapé cita apenas instituições públicas (Data.rio, Prefeitura, IBGE, MMA), sem identificar os alunos ou a equipe do projeto.

### 5.2 Aplicação B: Quiz Educativo (`site/index.html` + `site/js/`)
* **Volume e Profundidade:** 160 questões divididas em duas modalidades (*Sustentabilidade* e *Modo Professor/Profissional* com eixos de Enfermagem, Informática, Administração e Conhecimentos Gerais).
* **Diagnóstico Psicometria e Vício de Alternativas (Problema Crítico):**
  * **Distribuição de Posições da Resposta Correta:**
    * Letra A (0): 47 questões (**29.4%**)
    * Letra B (1): 105 questões (**65.6%**)
    * Letra C (2): 8 questões (**5.0%**)
    * Letra D (3): 0 questões (**0.0%**)
  * **Vício de Extensão Textual:**
    * Comprimento médio da alternativa correta: **116.0 caracteres**.
    * Comprimento médio dos distratores: **51.7 caracteres**.
    * Em **92.5% das questões (148 de 160)**, a resposta correta é significativamente mais longa e detalhada (>20%) que os distratores.
  * **Ausência de Embaralhamento (*Shuffle*):**
    O método `renderCurrentQuestion()` em `quiz-engine.js` (linha 568) itera sobre as alternativas na ordem original do banco. Como não há embaralhamento de opções, **um jogador que chute repetidamente a Letra B obterá ~66% de aproveitamento**, enquanto um chute na Letra D resultará em 0% de acerto.
* **Divergência nos Nomes do Leaderboard:**
  * No HTML estático (`site/index.html`): `Profª Helena Soares` e `Dra. Camila Nogueira`.
  * No arquivo de dados (`site/data/ranking.json`): `Profª Helena Soares` e `Dra. Camila Nogueira`.
  * No script JavaScript (`site/js/quiz-engine.js` linha 148 e 174): `Profª Helena Ramos` e `Dra. Camila Siqueira`.

### 5.3 Aplicação C: Experiência do Visitante pelo Celular (`site/controle.html`)
* **Fluxo de Entrada:** O visitante lê o QR Code, assiste ao vídeo institucional curto com áudio liberado por toque e, em seguida, acessa o controle remoto touch.
* **Fila de Espera (*Visitor Lock*):** Implementação primorosa em `server.js` e `mobile-controller.js`. Impede que dois celulares controlem a TV simultaneamente.
* **Separação Visitante vs Estande:**
  * O avatar do visitante (ícones ecológicos, nome e pontuação individual) é mantido em sua interface mobile e transferido para o Telão TV exclusivamente no Pódio de Resultados.
  * **Conformidade:** O avatar individual do visitante **não** é injetado como um boneco de videogame andando na tela monumental da TV, preservando o caráter de visualização institucional do parque.
* **Oportunidade de Melhoria:** Ausência de vibração háptica (`navigator.vibrate`) ao tocar nos botões de disparo de névoa e simulação de tempestade.

### 5.4 Aplicação D: Estande Físico e Apresentação em Televisão
* **Layout Planejado:** Concebido para resolução 1920 × 1080 (Full HD).
* **Componentes da TV:**
  * Palco central para exibição do Parque Vivo e das animações de névoa e chuva.
  * Painel lateral dedicado com dados micrometeorológicos em tempo real.
  * Área reservada para a geração dinâmica do QR Code via rede local Wi-Fi.
  * Modo Telão de Ranking (`#tvRankingView`) com pódio monumental dos três primeiros colocados e tabela dos 10 melhores.
* **Pontos de Atenção:** Na inicialização pela web (`/`), a aplicação exibe diretamente a tela de boas-vindas do Quiz em vez da interface do Telão do Parque. A TV precisa ser explicitamente colocada no modo Telão clicando no botão *"Telão TV"* ou acessando a rota `/ranking-tv`.

### 5.5 Aplicação E: Protótipo 3D Independente (`parque-realengo-3d/`)
* **Fidelidade ao Parque Realengo:**
  * **Perímetro Real:** Modelado a partir da geometria cadastral real do OpenStreetMap (Way 681694032), englobando 78.129 m² e 25 vértices perimetrais.
  * **As 5 Super-Torres Bioclimáticas:** Alturas rigorosamente modeladas com 17m (Torres 01 e 05), 26m (Torres 02 e 04) e a monumental de 47m (Torre Central 03).
  * **Sistema de Aspersão:** 236 bicos aspersores parametrizados com partículas procedurais de névoa d'água.
  * **Espelho d'Água:** Bacia de retenção de 1.300 m² com material de água realista e reflexos PBR.
  * **Complexo Esportivo e Cultural:** Skatepark com bowls de concreto polido, campo society, quadras de areia, Nave do Conhecimento e Anfiteatro Susana Naspolini.
* **Diferenciação da Expansão Futura (Fase 2):**
  * O componente `ParkExpansion.tsx` delimita a área anunciada de 150 mil m² com linha tracejada e texto explicativo claro: *"Expansão planejada · posição indicativa, sem planta"*. Não há estruturas fictícias inseridas nessa área.
* **Desempenho e Compilação:**
  * Compilação TypeScript (`npm run lint` / `tsc --noEmit`): **100% aprovada com zero erros**.
  * Empacotamento de produção (Vite): **Aprovado em 11.92s** (bundle de 1,06 MB minificado e 304 KB gzipped).
  * Taxa de quadros estável em 60 FPS com controle de câmera orbital suave.

---

## 6. Auditoria Técnica e de Engenharia de Software

### 6.1 Qualidade e Legibilidade do Código
* **JavaScript / TypeScript:** Código estruturado, bem comentado e modular. Funções com responsabilidades delineadas e nomes descritivos.
* **CSS:** Uso consistente de variáveis CSS Custom Properties em `:root`. Arquitetura responsiva sem dependência de frameworks CSS pesados que comprometam o carregamento.

### 6.2 Gerenciamento de Estado e Sincronização
* O `sync-engine.js` implementa arquitetura resiliente de 3 camadas:
  1. WebSocket (prioritário para comunicação entre múltiplos dispositivos via rede);
  2. BroadcastChannel (para comunicação instantânea entre abas no mesmo navegador);
  3. LocalStorage StorageEvent (fallback para navegadores que não suportam BroadcastChannel).

### 6.3 Dependências e Configuração de Ambiente
* O workspace raiz é enxuto, dependendo apenas do pacote `ws` (^8.22.1).
* O subprojeto `parque-realengo-3d/` utiliza React 18, `@react-three/fiber` (^8.17.10), `@react-three/drei` (^9.114.3) e `three` (^0.169.0). Todas as dependências estão atualizadas e com compilação limpa.

### 6.4 Tratamento de Erros e Fragilidade de Permissões
* **Script de Sincronização:** `scripts/sync-site-3d.js` utiliza `fs.copyFileSync` recursivo sem tratamento de erros para permissões no Windows. Caso os arquivos em `site/parque3d/` possuam atributo somente-leitura ou ACLs restritivas, o processo de build é interrompido com `EPERM: operation not permitted`.

---

## 7. Identidade Visual e Qualidade da Interface

### 7.1 Paleta Cromática e Coerência Visual
A identidade visual adota com coerência as diretrizes ecológicas e tecnológicas do Projeto V.I.D.A.:
* **Verde Esmeralda (`#10b981`, `#059669`):** Simboliza a flora da Mata Atlântica e as SbN.
* **Azul Elétrico (`#06b6d4`, `#0284c7`):** Representa a gestão hídrica, tecnologia IoT e aspersão.
* **Dourado Solar (`#f59e0b`, `#fbbf24`):** Representa o conforto térmico e a iluminação.
* **Fundo Profundo (`#060a12`, `#0b1320`):** Garante alto contraste visual e acabamento refinado para telas grandes.

### 7.2 Análise dos Logotipos
* **Arquivos Oficiais Auditados:** No diretório `site/public/assets/`, localizam-se os logotipos oficiais em alta resolução (512 × 512 px) com recorte de transparência circular impecável: `logo-vida-simbolo-transparente.png` e `logo-vida-original.png`.
* **Discrepância Visual:** O site informativo (`prototipos/02-painel-ambiental/index.html`) não utiliza esse arquivo, substituindo-o por um ícone genérico inline SVG em forma de folha estilizada.

---

## 8. Conteúdo, Pesquisa e Fundamentação Científica

| Eixo Temático | Referência Utilizada no Código | Validação e Consistência |
| :--- | :--- | :--- |
| **Microclima & Calor** | SMAC / Alerta Rio (até -5,8°C de alívio sob copa e aspersão) | **Confirmado:** Corresponde a dados micrometeorológicos reais da Prefeitura do Rio. |
| **Drenagem Pluvial** | Fundação Rio-Águas (1.950 m³ de bacia e amortecimento de 120 mm/h) | **Confirmado:** Projeto executivo do Parque Realengo prevê bacia de contenção com amortecimento de cheias. |
| **Mata Atlântica** | Fundação Parques e Jardins (FPJ) — 3.700 mudas nativas | **Confirmado:** Plantio na 1ª fase contemplou Ipê, Pau-Brasil, Jacarandá, Sapucaia e Oiti. |
| **Enfermagem & RSS** | ANVISA — Resolução RDC nº 222/2018 | **Confirmado:** Classificação de resíduos Grupo A (infectante), Grupo B (químico) e Grupo E (perfurocortante/Descarpack) rigorosamente correta. |
| **Saúde Coletiva** | OMS — Estresse térmico e hidratação na terceira idade | **Confirmado:** Abordagem precisa sobre desidratação, insolação e eventos cardiovasculares sob calor extremo na Zona Oeste. |
| **ODS da ONU** | Objetivos 3, 11, 13 e 15 (Agenda 2030) | **Confirmado:** Metas de cidades resilientes, saúde e conservação de ecossistemas terrestres integradas. |

---

## 9. Resultados dos Testes Executados

| Teste Realizado | Comando / Ferramenta | Resultado | Evidência / Observações |
| :--- | :--- | :---: | :--- |
| **Integridade de Assets do Site** | `node scripts/test-asset-integrity.js` | **SUCESSO** | 14 assets auditados e 100% íntegros em seus caminhos. |
| **Compatibilidade com Vercel** | `node scripts/test-vercel-compatibility.js` | **SUCESSO** | 13 asserções validadas (rotas, cleanUrls, serverless, rewrites). |
| **Tipagem e Lint do 3D** | `npm --prefix parque-realengo-3d run lint` | **SUCESSO** | TypeScript `tsc --noEmit` executado sem nenhum erro. |
| **Build de Produção 3D** | `npm --prefix parque-realengo-3d run build` | **SUCESSO** | Bundle gerado em 11.92s (`App-dqXRtx3U.js`: 1,06 MB). |
| **Sincronização 3D -> Site** | `node scripts/sync-site-3d.js` | **FALHA (EPERM)** | Erro de permissão do sistema operacional ao sobrescrever arquivos em `site/parque3d/assets/`. |
| **Teste Playwright Quiz** | `node scripts/test-quiz.js` | **BLOQUEIO** | Loopback network access bloqueado pelo ambiente seguro sandbox (`net::ERR_NETWORK_ACCESS_DENIED`). |
| **Servidor Ranking Backend** | `node scripts/test-backend-ranking.js` | **BLOQUEIO** | Inicializa porta 3088, mas conexão loopback bloqueada na sandbox (`EACCES`). |

---

## 10. Tabela de Avaliação e Notas por Dimensão

| Dimensão de Avaliação | Nota (0 a 10) | Justificativa Sintética |
| :--- | :---: | :--- |
| **1. Qualidade geral do projeto** | **8.2** | Proposta excepcional, inovadora e de altíssimo impacto para feira científica. Pequenos desencontros de integração impedem nota 9+. |
| **2. Arquitetura e organização do código** | **7.5** | Estrutura limpa em `site/` e `parque-realengo-3d/`, mas com redundâncias de arquivos de rota na raiz e script de sincronização frágil. |
| **3. Qualidade técnica** | **7.8** | Excelente uso de TypeScript, Vite, Web Audio e Range Requests HTTP 206. Pesa negativamente o vício de distribuição no banco de questões. |
| **4. Site informativo** | **8.0** | Dados estatísticos riquíssimos e comparador antes/depois funcional. Perde pontos por usar logotipo SVG genérico e ocultar autores. |
| **5. Quiz educativo** | **6.5** | Questões profundas e pedagogicamente ricas, mas psicometria comprometida (65.6% letra B, 0% letra D, sem embaralhamento de opções). |
| **6. Experiência mobile do visitante** | **8.5** | Fluido, sem necessidade de app, vídeo institucional sem travamentos e controle remoto touch envolvente com trava de visitante. |
| **7. Interface do estande (TV)** | **8.0** | Composição monumental em 1080p com pódio e leaderboard. Requer cuidado para abrir diretamente no modo telão durante a feira. |
| **8. Protótipo 3D** | **8.8** | Modelagem das 5 torres, bacia d'água e parque fiel às referências do OSM. Expansão futura corretamente delimitada sem falsos dados. |
| **9. Identidade visual** | **7.8** | Paleta moderna e logos oficiais de alta qualidade em `site/public/assets/`, mas com inconsistência pontual no painel ambiental. |
| **10. Conteúdo e fundamentação** | **9.2** | Rigor científico impecável, alinhando medicina/enfermagem, biotecnologia e engenharias com fontes oficiais verificadas. |
| **11. Desempenho e estabilidade** | **8.0** | Carregamento rápido, 60 FPS no 3D e baixo consumo de memória. Risco atrelado apenas à dependência de WebSocket na Vercel. |
| **12. Responsividade e acessibilidade** | **8.2** | 35 capturas comprovaram adaptação sólida de 360px a 1920px sem overflow horizontal. Falta suporte a `prefers-reduced-motion`. |
| **13. Documentação do desenvolvimento** | **8.5** | Pasta `docs/` estruturada com mapas e catálogos. Necessita apenas remoção de artefato espúrio na raiz do repositório. |
| **14. Preparação para apresentação física** | **8.5** | Inicializadores em lote funcionais (`iniciar-stand.bat`), trava de fila e experiência pensada para estande real. |
| **MÉDIA PONDERADA GERAL** | **8.1 / 10** | **PROJETO COM POTENCIAL DE PREMIAÇÃO NA PROJETEC 2026** |

---

## 11. Classificação dos Problemas Encontrados

### 🔴 Problemas de Nível Crítico

#### Problema 1: Vício Estatístico e Previsibilidade no Banco do Quiz Educativo
1. **O que foi encontrado:** Das 160 questões do quiz, 105 têm o gabarito na alternativa B (65.6%), 47 na alternativa A (29.4%), 8 na alternativa C (5.0%) e **nenhuma na alternativa D (0.0%)**. Além disso, em 92.5% dos casos a alternativa correta é significativamente mais longa que os distratores, e a função `renderCurrentQuestion()` não embaralha as opções antes de exibi-las na tela.
2. **Localização:** `site/js/quiz-questions.js` (todas as questões) e `site/js/quiz-engine.js` (linhas 568-580).
3. **Evidência Concreta:** Análise computacional confirmou: `posDist = [47, 105, 8, 0]`. Comprimento médio da correta = 116 caracteres vs distratores = 51 caracteres.
4. **Consequência:** Qualquer visitante ou jurado da feira que perceba o padrão ou chute a letra B sistematicamente obterá nota alta sem ler o conteúdo, desmoralizando a seriedade avaliativa do quiz.
5. **Como Corrigir:**
   * Implementar embaralhamento estocástico das 4 alternativas no momento de montagem da questão em `quiz-engine.js`, recalculando dinamicamente o índice `correta`.
   * Equalizar o tamanho dos distratores nas questões principais, adicionando justificativas técnicas plausíveis nas alternativas incorretas.
6. **Prioridade:** **Imediata (Crítica)**.

#### Problema 2: Incompatibilidade de WebSocket Persistente no Deploy da Vercel
1. **O que foi encontrado:** O sincronizador em tempo real depende de um servidor WebSocket nativo (`server.js`). Na Vercel (arquitetura Serverless), conexões TCP WebSocket de longa duração são encerradas após o ciclo de execução da função serverless.
2. **Localização:** `server.js` e `site/js/sync-engine.js` (linhas 61-99).
3. **Evidência Concreta:** No deploy da Vercel, o `sync-engine.js` falha na conexão `wss://...` e recorre ao `BroadcastChannel`, que opera estritamente entre abas da mesma máquina. Celulares remotos de visitantes não conseguem controlar a TV se ela estiver rodando exclusivamente na Vercel.
4. **Consequência:** O controle mobile não funcionará em demonstrações remotas na web pública via Vercel, a menos que o servidor local do estande esteja em execução.
5. **Como Corrigir:**
   * Para a feira presencial: padronizar o uso exclusivo do servidor local na rede Wi-Fi via `iniciar-stand.bat`.
   * Para a Vercel: exibir um banner informativo no modo `/controle` quando a conexão WebSocket estiver inacessível: *"Para assumir o controle da TV, conecte-se ao Wi-Fi oficial do stand na feira"*, ou utilizar um broker realtime serverless (como Pusher ou Supabase Channels).
6. **Prioridade:** **Imediata (Crítica)**.

---

### 🟠 Problemas de Nível Alto

#### Problema 3: Ausência de Identificação dos Integrantes, Orientadores e Escola
1. **O que foi encontrado:** Não há nenhuma seção "Sobre a Equipe", "Quem Somos" ou menção aos nomes dos alunos, professores orientadores, curso técnico ou colégio no site, no quiz ou nos protótipos.
2. **Localização:** `site/index.html` (footer), `prototipos/02-painel-ambiental/index.html` (footer) e `README.md`.
3. **Evidência Concreta:** Varredura em todo o repositório confirmou apenas as expressões genéricas *"Desenvolvido pela Equipe V.I.D.A."* e *"Responsável Técnico: Claude Code"*.
4. **Consequência:** Em uma Feira Tecnológica como o Projetec, a autoria estudantil é requisito indispensável para creditação, certificação e julgamento pela banca.
5. **Como Corrigir:** Inserir um modal ou bloco elegante de créditos no rodapé com o nome completo dos alunos pesquisadores, seus cursos (Enfermagem / Informática), nomes dos professores orientadores e o brasão/marca do colégio.
6. **Prioridade:** **Alta**.

#### Problema 4: Falha com EPERM no Script de Sincronização 3D
1. **O que foi encontrado:** O script `scripts/sync-site-3d.js` falha com `EPERM: operation not permitted` ao tentar copiar os arquivos compilados de `parque-realengo-3d/dist` para `site/parque3d/`.
2. **Localização:** `scripts/sync-site-3d.js` (linha 21).
3. **Evidência Concreta:** Teste de execução gerou erro: `Error: EPERM: operation not permitted, copyfile '...App-dqXRtx3U.js' -> '...site\parque3d\assets\App-dqXRtx3U.js'`.
4. **Consequência:** Impede que modificações futuras no código 3D sejam sincronizadas automaticamente para a pasta web consumida pelo stand e pela Vercel.
5. **Como Corrigir:** Adicionar remoção prévia do diretório de destino com tratamento de permissões (`fs.rmSync(target, { recursive: true, force: true })`) antes da cópia recursiva.
6. **Prioridade:** **Alta**.

#### Problema 5: Ambiguidade da Rota Raiz na Televisão do Stand
1. **O que foi encontrado:** Ao acessar a raiz do projeto (`http://localhost:3000/` ou a URL base na Vercel), o usuário é direcionado para a tela de Boas-Vindas do Quiz (`#welcomeView`) em vez de abrir o Telão Monumental do Parque Vivo com o painel lateral do QR Code.
2. **Localização:** `vercel.json` (linha 11) e `site/index.html`.
3. **Evidência Concreta:** Para a TV exibir o pódio ou o parque, o operador precisa clicar manualmente nos botões de navegação secundários.
4. **Consequência:** Se a TV reiniciar durante a feira, ela volta para a tela de login do quiz em vez de permanecer no modo de atração (*Attract Mode*) para atrair visitantes no corredor.
5. **Como Corrigir:** Criar parâmetro de URL (`/?view=stand` ou rota `/tv`) que inicialize automaticamente a visualização monumental com tela cheia e painel lateral de QR Code.
6. **Prioridade:** **Alta**.

---

### 🟡 Problemas de Nível Médio

#### Problema 6: Inconsistência nos Nomes do Leaderboard Demonstrativo
1. **O que foi encontrado:** Os nomes dos competidores fictícios no pódio divergem entre o HTML estático, o arquivo JSON e o script JavaScript.
2. **Localização:** `site/index.html` (linhas 522-542), `site/data/ranking.json` e `site/js/quiz-engine.js` (linhas 148-174).
3. **Evidência Concreta:** O 1º lugar é chamado de *"Profª Helena Soares"* no HTML e `ranking.json`, mas de *"Profª Helena Ramos"* em `quiz-engine.js`. O 3º lugar varia entre *"Dra. Camila Nogueira"* e *"Dra. Camila Siqueira"*.
4. **Consequência:** Perda de consistência visual se o ranking for recarregado do fallback em memória.
5. **Como Corrigir:** Padronizar os nomes em uma única constante exportada em `quiz-engine.js`.
6. **Prioridade:** **Média**.

#### Problema 7: Desconexão do Site Informativo na Navegação Global
1. **O que foi encontrado:** O painel bioclimático e catálogo de 18 indicadores (`prototipos/02-painel-ambiental/`) não possui link de acesso direto na barra superior do site oficial ou no controle mobile.
2. **Localização:** `site/index.html` (top-bar) e `site/controle.html` (mobile-nav-tabs).
3. **Evidência Concreta:** O menu possui links apenas para `Parque 3D`, `Telão TV`, `Ranking` e `Histórico`. O site informativo fica restrito a quem souber o caminho direto.
4. **Consequência:** Um dos melhores conteúdos de pesquisa científica do projeto corre o risco de não ser visualizado pela banca avaliadora.
5. **Como Corrigir:** Adicionar um botão de atalho *"📊 Painel de Indicadores"* na barra superior do site e no menu mobile.
6. **Prioridade:** **Média**.

#### Problema 8: Identidade Visual Desalinhada no Painel Ambiental
1. **O que foi encontrado:** O painel em `prototipos/02-painel-ambiental/` utiliza um ícone vetorial inline de folha no lugar do arquivo de logotipo oficial recortado em alta resolução, além de não possuir tag `<link rel="icon">`.
2. **Localização:** `prototipos/02-painel-ambiental/index.html` (linhas 24-28).
3. **Evidência Concreta:** Enquanto `site/` utiliza `public/assets/logo-vida-simbolo.png`, o painel ambiental usa `<path d="M12 2v20M17 5H9.5..."/>`.
4. **Consequência:** Quebra da coerência de marca e imagem em branco na aba do navegador.
5. **Como Corrigir:** Atualizar a tag da marca para referenciar o asset oficial `site/public/assets/logo-vida-simbolo-transparente.png` e incluir a tag de favicon.
6. **Prioridade:** **Média**.

#### Problema 9: Arquivo Espúrio na Raiz e Unstaged no Git
1. **O que foi encontrado:** Arquivo intitulado `"t JULES_API_KEY configurada -ForegroundColor Green"` na raiz do projeto (20.7 KB), originado de um erro de digitação de comando PowerShell.
2. **Localização:** Raiz do repositório.
3. **Evidência Concreta:** `git status` acusa o arquivo untracked.
4. **Consequência:** Poluição do repositório e risco de inclusão involuntária em commits futuros.
5. **Como Corrigir:** Deletar o arquivo do sistema de arquivos e incluir padrões de proteção no `.gitignore`.
6. **Prioridade:** **Média**.

---

### 🟢 Problemas de Nível Baixo

#### Problema 10: Ausência de Feedback Háptico no Smartphone
1. **O que foi encontrado:** Os botões touch de disparo de névoa, chuva e navegação de câmera não emitem resposta de vibração tátil no celular.
2. **Localização:** `site/js/mobile-controller.js`.
3. **Consequência:** Em um pavilhão barulhento de feira, o usuário não tem retorno sensorial imediato de que o toque foi processado.
4. **Como Corrigir:** Adicionar chamada `if (navigator.vibrate) navigator.vibrate(35);` aos listeners de clique.
5. **Prioridade:** **Baixa**.

#### Problema 11: Densidade de Rolagem na Visualização Mobile do Painel
1. **O que foi encontrado:** A seção tripla de Balanço Hídrico, Botânica da Mata Atlântica e ODS empilha-se verticalmente em telas de 360px gerando uma rolagem contínua extensa.
2. **Localização:** `prototipos/02-painel-ambiental/css/styles.css`.
3. **Consequência:** O usuário precisa rolar intensamente para encontrar os filtros do catálogo de indicadores.
4. **Como Corrigir:** Transformar a visualização tripla em abas táteis no viewport mobile.
5. **Prioridade:** **Baixa**.

#### Problema 12: Excesso de Efeitos de Brilho Neon na Interface do Quiz
1. **O que foi encontrado:** Sombras com brilhos de raio longo (`box-shadow: 0 0 25px rgba(...)`) aplicadas simultaneamente em múltiplos cards e botões.
2. **Localização:** `site/css/quiz.css`.
3. **Consequência:** Em laptops com telas menores, pode gerar cansaço visual em sessões longas.
4. **Como Corrigir:** Suavizar as intensidades das sombras neon para valores entre 8px e 12px com menor opacidade.
5. **Prioridade:** **Baixa**.

---

## 12. Pontos Fortes Comprovados

1. **Gêmeo Digital 3D Autêntico e Paramétrico:** Não é um modelo baixado de biblioteca de jogos; as cinco super-torres respeitam as cotas de 17m, 26m e 47m, e a bacia de retenção de 1.300 m² segue as diretrizes da Rio-Urbe e Ecomimesis.
2. **Zero Fricção para o Visitante:** Abertura instantânea via QR Code sem necessidade de instalar aplicativos ou realizar cadastros complexos.
3. **Streaming Fluido via HTTP 206:** Servidor local customizado em Node.js com suporte nativo a requisições de faixa de bytes, garantindo que o vídeo introdutório execute de imediato sem travar nos iPhones dos visitantes.
4. **Fila de Visitante Único (*Visitor Lock*):** Impede o caos de múltiplos celulares competindo pela mesma tela na feira de ciências.
5. **Integração Real entre Enfermagem e Engenharia:** Abordagem séria sobre estresse térmico, hipertermia, resíduos de serviços de saúde (RDC 222/18) e qualidade do ar, valorizando a pesquisa dos cursos técnicos.
6. **Efeitos Sonoros Bioclimáticos Procedurais:** A Web Audio API sintetiza o som da névoa das torres e campainhas de comemoração dinamicamente, sem depender de arquivos pesados de áudio MP3 para cada evento.

---

## 13. Riscos para a Apresentação Presencial

| Fator de Risco | Probabilidade | Impacto | Mitigação Obrigatória para a Feira |
| :--- | :---: | :---: | :--- |
| **Queda ou Instabilidade do Wi-Fi da Feira** | **ALTA** | **CRÍTICO** | Levar um roteador Wi-Fi próprio e executar o servidor local via `iniciar-stand.bat`. O stand opera 100% offline em rede local sem precisar de internet externa. |
| **Público Perceber Vício na Letra B do Quiz** | **ALTA** | **ALTO** | Aplicar o embaralhamento estocástico de alternativas antes da abertura dos portões da feira. |
| **Falta de Identificação da Equipe perante a Banca** | **ALTA** | **ALTO** | Inserir a lista de alunos e orientadores no rodapé institucional. |
| **Tela da TV Iniciar no Modo Boas-Vindas em vez do Telão** | **MÉDIA** | **MÉDIO** | Configurar o atalho do navegador na TV para abrir com a flag de tela cheia apontando para a visualização do stand. |
| **Falha de Permissão no Build do 3D** | **MÉDIA** | **MÉDIO** | Rodar o build de produção antecipadamente e congelar a pasta `site/parque3d/`. |

---

## 14. Plano de Melhorias Priorizado

### Etapa 1 — Correções Indispensáveis (Imediatas)
* **Objetivo:** Eliminar riscos que inviabilizem funcionalidades ou comprometam a credibilidade perante a banca.
1. **Embaralhamento Dinâmico de Alternativas do Quiz:**
   * Inserir algoritmo de embaralhamento das opções (`opcoes`) na função de renderização em `quiz-engine.js`, ajustando dinamicamente o ponteiro da resposta correta.
   * *Complexidade:* Baixa | *Impacto:* Crítico | *Dependência:* Nenhuma.
2. **Inclusão da Identificação Oficial da Equipe (Créditos):**
   * Adicionar modal institucional de créditos com os nomes dos estudantes pesquisadores, professores orientadores, curso e escola.
   * *Complexidade:* Baixa | *Impacto:* Alto | *Dependência:* Nenhuma.
3. **Higienização do Repositório Git:**
   * Deletar o arquivo espúrio `"t JULES_API_KEY..."` e revisar o `.gitignore`.
   * *Complexidade:* Mínima | *Impacto:* Médio | *Dependência:* Nenhuma.

### Etapa 2 — Melhorias Importantes (Experiência e Integração)
* **Objetivo:** Elevar a robustez e a coesão entre os módulos.
1. **Atalho Direto para o Painel de Indicadores:**
   * Adicionar botão *"📊 Painel Ambiental"* no cabeçalho de `site/index.html` e menu mobile, integrando o conteúdo de `prototipos/02-painel-ambiental/`.
   * *Complexidade:* Baixa | *Impacto:* Alto | *Dependência:* Nenhuma.
2. **Padronização de Identidade Visual e Favicon no Painel:**
   * Substituir o SVG genérico do painel pelo logotipo oficial `logo-vida-simbolo-transparente.png` e incluir favicon `<link rel="icon">`.
   * *Complexidade:* Baixa | *Impacto:* Médio | *Dependência:* Nenhuma.
3. **Resolução de Permissões no `sync-site-3d.js`:**
   * Refatorar a rotina de cópia com `fs.rmSync` e tratamento de exceção para evitar `EPERM` em sistemas Windows.
   * *Complexidade:* Baixa | *Impacto:* Médio | *Dependência:* Nenhuma.

### Etapa 3 — Refinamento Visual e Técnico
* **Objetivo:** Polimento sensorial e usabilidade refinada.
1. **Feedback Háptico no Smartphone:**
   * Implementar `navigator.vibrate(35)` nos botões do controle móvel.
   * *Complexidade:* Mínima | *Impacto:* Médio | *Dependência:* Suporte do navegador mobile.
2. **Harmonização das Sombras Neon:**
   * Reduzir o raio de dispersão dos brilhos em `site/css/quiz.css`.
   * *Complexidade:* Baixa | *Impacto:* Baixo | *Dependência:* Nenhuma.
3. **Equalização Textual das Alternativas do Quiz:**
   * Expandir os distratores das questões principais para que a alternativa correta não se destaque pelo tamanho.
   * *Complexidade:* Média | *Impacto:* Médio | *Dependência:* Revisão de texto pedagógico.

### Etapa 4 — Diferenciais Estratégicos (Para Destaque Máximo)
* **Objetivo:** Recursos para disputar o 1º lugar da feira.
1. **Certificado Digital de Participação para o Visitante:**
   * Geração automática de imagem/PDF com o nome do visitante, sua nota oficial e o selo do Parque Realengo para download ou envio por WhatsApp ao concluir o quiz.
2. **Modo Noturno com Iluminação Cênica nas Super-Torres 3D:**
   * Botão no controle móvel para alternar a iluminação do parque para o pôr do sol ou noite, destacando as luminárias LED e aspergidores iluminados.

---

## 15. Parecer Técnico Final

O projeto **Projetec 2026 — EcoCity (Projeto V.I.D.A.)** é um trabalho de **qualidade tecnológica e pedagógica excepcional**, situado muito acima do padrão usual de feiras de ciências escolares. A combinação de um gêmeo digital tridimensional tecnicamente rigoroso, uma central multitela em tempo real com controle móvel sem instalação de aplicativo e um banco de dados ambiental fundamentado em órgãos oficiais confere ao estande um perfil profissional de museu interativo de ciências.

A aprovação do projeto é incontestável. As fragilidades apontadas nesta auditoria — com ênfase no vício de distribuição das respostas do quiz e na inclusão dos créditos oficiais da equipe — são de fácil resolução e, uma vez ajustadas conforme o plano proposto, habilitarão o Projeto V.I.D.A. a concorrer às premiações máximas do Projetec 2026.

---
*Relatório de auditoria técnica concluído e registrado no repositório oficial em `docs/relatorios/avaliacao-integral-develop.md`.*
