# MAPA DO PROJETO — ECOCITY / PROJETEC 2026

**Repositório Oficial:** [https://github.com/Bonato2010/Projetec-2026-](https://github.com/Bonato2010/Projetec-2026-)  
**Data da Auditoria e Reorganização:** 03 de Novembro de 2026  
**Branch Ativa:** `develop`  

---

## 1. Visão Geral do Repositório

O projeto **Projetec 2026 — EcoCity (Projeto V.I.D.A.)** é um ecossistema tecnológico completo desenvolvido para a Feira de Ciências, tendo como objeto central o **Parque Urbano de Realengo Jornalista Susana Naspolini** (Rio de Janeiro - RJ). O repositório integra um site informativo institucional, um quiz gamificado de sustentabilidade, uma central multitela conectada via WebSocket (TV Stand + Controle Mobile), e um conjunto robusto de 4 protótipos interativos — com destaque para o gêmeo digital 3D de altíssimo realismo.

---

## 2. Árvore de Diretórios e Estrutura Geral

```text
Projetec-2026-/
│
├── api/                    # Funções Serverless backend (ranking, network-info)
├── docs/                   # Documentação completa de arquitetura, protótipos, site, quiz e relatórios
│   ├── arquitetura/        # MAPA_DO_PROJETO.md
│   ├── evidencias/         # Screenshots e capturas de tela catalogadas (antes/depois)
│   ├── prototipos/         # CATALOGO_DE_PROTOTIPOS.md
│   ├── quiz/               # Documentação do Módulo Quiz
│   ├── relatorios/         # Relatórios finais de execução e auditoria
│   └── site/               # Documentação do Site Principal
│
├── ecocity-agent-pipeline/ # Automações e pipelines de agentes autônomos
├── parque-realengo-3d/     # Protótipo 01: Gêmeo Digital 3D (React Three Fiber + Three.js)
├── prototipos/             # Demais protótipos conceituais e interativos
│   ├── 01-mapa-parque/     # Protótipo 02: Mapa Interativo GIS 2D
│   ├── 02-painel-ambiental/# Protótipo 03: Painel Ambiental e Bioclimático
│   ├── 03-simulador-drenagem/# Protótipo 04: Simulador de Drenagem Urbana
│   └── galeria-screenshots/# Hub de Galeria Visual e Manifestos
│
├── reports/                # Relatórios técnicos do Claude Code
├── screenshots/            # Galeria raiz de screenshots categorizadas
├── scripts/                # Scripts utilitários de build, sincronização e captura
├── site/                   # Plataforma Web Oficial e Central Multitela (HTML/CSS/JS + API)
│   ├── api/                # Endpoints serverless locais
│   ├── css/                # Folhas de estilo (TV Stand, Mobile, Quiz)
│   ├── data/               # Dados estruturados (ranking.json)
│   ├── js/                 # Motores de Quiz, WebSocket Sync, TV Stand, Mobile Controller
│   ├── parque3d/           # Build sincronizado do Protótipo 3D para consumo web
│   └── public/             # Mídia institucional (vídeos, logotipos)
│
├── .automation/            # Marcadores de status de automação
├── .claude/                # Configurações do ambiente Claude Code
├── controle.html           # Gateway de acesso ao Controle Mobile / Stand
├── index.html              # Gateway de redirecionamento para o site oficial
├── iniciar-stand.bat / .ps1# Inicializadores rápidos do ambiente multitela
├── package.json            # Configuração de workspace raiz e dependência WebSocket
├── README.md               # Porta de entrada oficial do repositório
└── vercel.json             # Configuração de rotas, rewrites e build para Vercel
```

---

## 3. Inventário de Aplicações e Módulos

| Módulo / Aplicação | Diretório | Tecnologias | Finalidade Principal | Estado |
|---|---|---|---|---|
| **Site Principal & Central Multitela** | `site/` | HTML5, CSS3, JavaScript (ES6+), Tailwind, WebSocket | Portal institucional, exibição na TV do Stand e interface de controle via smartphone | Ativo / Produção |
| **Módulo Quiz Gamificado** | `site/js/quiz-engine.js` | JavaScript, CSS Animations, LocalStorage | Quiz pedagógico de sustentabilidade com radar de competências, ranking e histórico | Ativo / Integrado |
| **Protótipo 01: EcoCity 3D (Parque Realengo)** | `parque-realengo-3d/` | React 18, React Three Fiber, Three.js, Vite | Gêmeo digital 3D de realismo extremo, 5 super-torres bioclimáticas, PBR e missões | Ativo / Produção |
| **Protótipo 02: Mapa Interativo do Parque** | `prototipos/01-mapa-parque/` | HTML, Leaflet / GIS, JS | Mapeamento interativo de trilhas, flora e pontos de interesse do parque | Ativo / Protótipo |
| **Protótipo 03: Painel Ambiental** | `prototipos/02-painel-ambiental/` | HTML, Chart.js, CSS | Monitoramento de microclima, temperatura combatida e comparativo antes/depois | Ativo / Protótipo |
| **Protótipo 04: Simulador de Drenagem** | `prototipos/03-simulador-drenagem/` | HTML, Canvas 2D, JS | Simulação hidrológica de bacias de retenção e mitigação de alagamentos | Ativo / Protótipo |
| **Hub de Galeria Visual** | `prototipos/galeria-screenshots/` | HTML, CSS, JavaScript | Visualização de evidências e capturas de tela de todo o ecossistema | Ativo |

---

## 4. Integração e Relação entre Módulos

1. **Sincronização 3D (`scripts/sync-site-3d.js`)**: O build do `parque-realengo-3d` (`vite build`) gera a aplicação 3D compilada, que é automaticamente copiada para `site/parque3d/` através do script de sincronização durante o processo de build para a Vercel.
2. **Central Multitela (Stand)**: A TV exibe o modo apresentação (`site/index.html`) enquanto o visitante utiliza o smartphone escaneando o QR Code (`site/controle.html`), comunicando-se em tempo real via WebSocket (`server.js`).
3. **Página de Entrada (Vercel)**: O arquivo `vercel.json` na raiz gerencia todas as rotas e reescritas (*rewrites*), redirecionando `/` para `/site/index.html`, `/parque3d` para o gêmeo digital compilado, `/controle` para o controlador móvel, e `/api/*` para as funções serverless.
