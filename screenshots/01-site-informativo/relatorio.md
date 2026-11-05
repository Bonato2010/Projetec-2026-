# Relatório de Auditoria e Documentação Visual — Site Informativo
## PROJETEC 2026 — Projeto V.I.D.A. (Parque Realengo)

> **Missão 01:** Auditoria visual completa, registro fotográfico em alta resolução e análise de conformidade do Site Informativo do Projeto V.I.D.A.  
> **Data de Execução:** 04 de Novembro de 2026  
> **Ferramenta de Captura:** Playwright (Chromium Headless Engine nativo)  
> **Diretório da Galeria:** `screenshots/01-site-informativo/`  
> **Total de Screenshots Reais:** 35 capturas (0 erros de renderização, 0 overlays de desenvolvimento)

---

## 1. Identificação da Aplicação e Estrutura Arquitetural

### 1.1 Localização do Site Informativo
Após a auditoria estrutural do repositório, identificou-se que o repositório é composto por diferentes subsistemas com propósitos distintos. Em estrita conformidade com as instruções da Missão 01, o **Site Informativo** foi devidamente diferenciado do totem/quiz e do protótipo 3D:

* **Site Informativo Institucional (Alvo da Missão 01):**  
  Localizado no diretório `prototipos/02-painel-ambiental/` (com arquivo mestre `index.html`). Trata-se do portal de divulgação científica, monitoramento bioclimático, catálogo de indicadores e apresentação do Parque Realengo 2026.
* **Módulos Informativos Complementares:**  
  * `prototipos/01-mapa-parque/` — Sistema Cartográfico 2D e GIS interativo com pontos de interesse (POIs).
  * `prototipos/03-simulador-drenagem/` — Simulador hidrodinâmico pluvial e jardins de chuva.
  * `prototipos/galeria-screenshots/` — Hub integrador de módulos e visualizações.
* **Aplicações Desconsideradas (Preservadas Intactas):**  
  * `site/` — Central Multitela e Totem Interativo com motor do Quiz (`quiz-engine.js`).
  * `parque-realengo-3d/` e `site/parque3d/` — Modelo 3D em Three.js e build web do gêmeo digital.

### 1.2 Tecnologias Encontradas
* **HTML5 Semântico:** Estruturação através de tags semânticas (`<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<dialog>`), com atributos de acessibilidade ARIA (`aria-label`, `role="region"`, `role="switch"`).
* **CSS3 Moderno & Design System:**
  * Uso integral de variáveis nativas CSS (*Custom Properties*) para tipografia, espaçamentos, elevações e paleta cromática (`--bg-primary`, `--accent-emerald`, `--accent-cyan`, `--text-main`, etc.).
  * Layout flexível baseado em CSS Grid bidimensional e Flexbox responsivo.
  * Suporte nativo a alternância de temas Claro (*Light Mode*) e Escuro (*Dark Mode*) controlado via atributo `data-theme` no elemento raiz.
  * Efeitos visuais avançados com `backdrop-filter: blur()`, sombras multicamadas e gradientes lineares.
* **JavaScript Vanilla (ES6+):** Arquitetura orientada a módulos sem dependência de frameworks compilados (sem React, Vue ou Angular), garantindo carregamento instantâneo, baixo consumo de memória e total fidelidade de renderização.
* **HTML5 Canvas 2D API:** Renderização gráfica personalizada de alta taxa de quadros para a curva térmica diária de 24h e balanço volumétrico de água.
* **Gráficos Vetoriais SVG:** Empregado na marca, ícones utilitários e no gráfico do donut botânico de espécies da Mata Atlântica.

### 1.3 Como Executar a Aplicação
A aplicação possui arquitetura desacoplada e estática, permitindo execução por múltiplos métodos:
1. **Servidor HTTP Local:**
   ```bash
   # Opção via Python
   python -m http.server 3000
   # Opção via Node.js
   npx serve .
   ```
2. **Execução Direta em Navegador:**
   Acessível diretamente através do protocolo `file:///` no Chrome/Edge/Firefox, sem necessidade de transpilação ou dependências externas em tempo de execução.
3. **Captura Automatizada via Playwright:**
   Script dedicado `scripts/capturar-site-informativo.js` executado sobre Chromium headless com flag `--allow-file-access-from-files`.

---

## 2. Inventário de Rotas e Páginas Identificadas

| Rota / Arquivo | Nome da Página | Função / Conteúdo |
| :--- | :--- | :--- |
| `prototipos/02-painel-ambiental/index.html` | **Painel Central V.I.D.A.** | Portal informativo principal: apresentação ecológica, microclima, balanço hídrico, comparador 2021-2026 e catálogo de 18 indicadores ambientais. |
| `prototipos/01-mapa-parque/index.html` | **Mapa Interativo 2D & GIS** | Planta técnica 2D com georreferenciamento de torres de névoa, bacias de retenção, bosque e gaveta lateral de POIs. |
| `prototipos/03-simulador-drenagem/index.html` | **Simulador Hidrodinâmico** | Modelagem de eventos pluviométricos (chuva moderada a tempestade extrema de 120 mm/h) e capacidade dos jardins de chuva. |
| `prototipos/galeria-screenshots/index.html` | **Central de Protótipos (Hub)** | Visão unificada de telas, protótipos e painéis do projeto. |

---

## 3. Resumo Quantitativo das Capturas

* **Total de Screenshots:** 35 imagens reais
* **Resoluções Desktop:**
  * `1920 × 1080` (Full HD standard)
  * `1440 × 900` (Widescreen laptop)
  * Modos: Primeira Dobra (*Viewport*) e Página Completa (*Full Page Scroll*)
* **Resoluções Mobile:**
  * `390 × 844` (Apple iPhone 12/13/14)
  * `360 × 800` (Android padrão de mercado)
  * Modos: Primeira Dobra (*Viewport*) e Página Completa (*Full Page Scroll*)
* **Capturas Seccionais:** 9 blocos informativos isolados
* **Capturas de Estados e Interações:** 12 fluxos e comportamentos dinâmicos registrados

---

## 4. Galeria de Screenshots Desktop

### 4.1 Página Inicial e Páginas Informativas Completas

| Imagem | Resolução | Descrição |
| :--- | :---: | :--- |
| [desktop/pagina-inicial.png](desktop/pagina-inicial.png) | 1920×1080 | **Primeira Dobra Full HD:** Cabeçalho com marca Central V.I.D.A., status de operação em tempo real, painel de boas-vindas e introdução ao parque ecológico. |
| [desktop/pagina-completa.png](desktop/pagina-completa.png) | 1920×1080 (Full) | **Rolagem Vertical Completa Full HD:** Todo o percurso informativo do site, da apresentação ao catálogo e rodapé de fontes. |
| [desktop/pagina-inicial-1440x900.png](desktop/pagina-inicial-1440x900.png) | 1440×900 | **Primeira Dobra Widescreen:** Comportamento e adaptação do grid para telas de laptops e monitores intermediários. |
| [desktop/pagina-completa-1440x900.png](desktop/pagina-completa-1440x900.png) | 1440×900 (Full) | **Rolagem Vertical Completa em 1440×900:** Alinhamento contínuo das seções, densidade de texto e cartões informativos. |

### 4.2 Outras Páginas Informativas (Desktop)

| Imagem | Resolução | Descrição |
| :--- | :---: | :--- |
| [desktop/outras-paginas/mapa-interativo-2d.png](desktop/outras-paginas/mapa-interativo-2d.png) | 1920×1080 | **Mapa Cartográfico 2D:** Planta técnica georreferenciada do Parque Realengo com camadas de arborização e infraestrutura verde. |
| [desktop/outras-paginas/simulador-drenagem.png](desktop/outras-paginas/simulador-drenagem.png) | 1920×1080 | **Simulador de Drenagem Pluvial:** Painel de cálculo de escoamento superficial, taxa de infiltração e armazenamento em reservatório. |
| [desktop/outras-paginas/galeria-hub.png](desktop/outras-paginas/galeria-hub.png) | 1920×1080 | **Hub Geral de Protótipos:** Central de visualização dos módulos do projeto e documentação integrada. |

---

## 5. Galeria de Screenshots Mobile

### 5.1 Página Inicial e Páginas Informativas Completas

| Imagem | Dispositivo / Resolução | Descrição |
| :--- | :---: | :--- |
| [mobile/pagina-inicial.png](mobile/pagina-inicial.png) | iPhone (390×844) | **Primeira Dobra Mobile (390×844):** Cabeçalho adaptado, botões de ação tátil e visualização compactada do banner de abertura. |
| [mobile/pagina-completa.png](mobile/pagina-completa.png) | iPhone (390×844 Full) | **Rolagem Vertical Mobile Completa (390×844):** Fluidez de leitura, empilhamento responsivo de colunas e cartões em tela vertical. |
| [mobile/pagina-inicial-360x800.png](mobile/pagina-inicial-360x800.png) | Android (360×800) | **Primeira Dobra Android (360×800):** Conformidade de margens e ausência de transbordamento horizontal (*horizontal overflow*). |
| [mobile/pagina-completa-360x800.png](mobile/pagina-completa-360x800.png) | Android (360×800 Full) | **Rolagem Vertical Mobile Completa (360×800):** Visualização completa do catálogo e tabelas em viewport estreita. |

### 5.2 Outras Páginas Informativas (Mobile)

| Imagem | Dispositivo / Resolução | Descrição |
| :--- | :---: | :--- |
| [mobile/outras-paginas/mapa-interativo-2d-mobile.png](mobile/outras-paginas/mapa-interativo-2d-mobile.png) | 390×844 | **Mapa 2D Mobile:** Interface do mapa adaptada com controles táteis de zoom e seleção de camadas condensada. |
| [mobile/outras-paginas/simulador-drenagem-mobile.png](mobile/outras-paginas/simulador-drenagem-mobile.png) | 390×844 | **Simulador de Drenagem Mobile:** Controles verticais otimizados para toque e visualização simplificada de vazão. |
| [mobile/outras-paginas/galeria-hub-mobile.png](mobile/outras-paginas/galeria-hub-mobile.png) | 390×844 | **Hub de Protótipos Mobile:** Cartões em coluna única com proporção preservada. |

---

## 6. Registro Detalhado das Seções Individuais

Foram capturadas com isolamento de elemento (`locator.screenshot`) todas as 9 seções funcionais do Site Informativo:

| Seção | Arquivo | Descrição e Conteúdo Registrado |
| :--- | :--- | :--- |
| **01. Cabeçalho** | [secoes/cabecalho.png](secoes/cabecalho.png) | Logotipo Central V.I.D.A., status operacional "Monitoramento Ativo", indicador do sistema de névoa e botões utilitários de tema e exportação. |
| **02. Apresentação (Hero)** | [secoes/apresentacao.png](secoes/apresentacao.png) | Contextualização histórica do Parque Realengo (antiga área militar desativada convertida em infraestrutura verde resiliente) e Soluções Baseadas na Natureza (SbN). |
| **03. Sustentabilidade (KPIs)** | [secoes/sustentabilidade.png](secoes/sustentabilidade.png) | Quatro cartões de impacto mensurável: 3.700 árvores nativas plantadas, -5,8°C de alívio térmico máximo, 1.950 m³ de retenção pluvial e 84,2% de área permeável. |
| **04. Microclima** | [secoes/microclima.png](secoes/microclima.png) | Mapa temático do microclima com sonda térmica em tempo real, camadas de calor residual, bacia de lago e cobertura de dossel florestal. |
| **05. Curva Térmica** | [secoes/curva-termica.png](secoes/curva-termica.png) | Gráfico Canvas interativo com série temporal de 24 horas comparando a temperatura do asfalto externo, interior do bosque e área sob efeito das torres de aspersão. |
| **06. Comparador Temporal** | [secoes/comparador-antes-depois.png](secoes/comparador-antes-depois.png) | Módulo interativo com divisor deslizante (*split slider*) comparando o solo exposto e galpões de 2021 com o parque consolidado de 2026. |
| **07. Balanço Hídrico & ODS** | [secoes/balanco-hidrico-botanica-ods.png](secoes/balanco-hidrico-botanica-ods.png) | Painel triplo: gráfico de dissipação e retenção hídrica, donut gráfico de distribuição das espécies arbóreas da Mata Atlântica e cards dos Objetivos de Desenvolvimento Sustentável (ODS 3, 11, 13 e 15). |
| **08. Catálogo de Indicadores** | [secoes/catalogo-indicadores.png](secoes/catalogo-indicadores.png) | Catálogo completo com 18 indicadores ecológicos, caixa de pesquisa textual, filtros de categoria (Clima, Água, Biodiversidade, Social), metas e selos de validação científica. |
| **09. Rodapé Institucional** | [secoes/rodape.png](secoes/rodape.png) | Dados de transparência pública, links para bases abertas (Data.rio, Prefeitura do Rio, IBGE, MMA) e créditos de desenvolvimento. |

---

## 7. Registro de Interações e Estados Dinâmicos

Todas as interações disponíveis na interface foram testadas e registradas através de eventos reais de mouse, teclado e foco:

| Interação / Estado | Arquivo | Comportamento Registrado |
| :--- | :--- | :--- |
| **Alternância de Tema (Modo Claro)** | [interacoes/tema-claro.png](interacoes/tema-claro.png) | Clique no botão `#theme-toggle`. A interface comuta todas as variáveis para fundo claro (`#f8fafc`), mantendo contraste acessível e sombras suaves. |
| **Camada de Drenagem no Mapa** | [interacoes/mapa-camada-drenagem.png](interacoes/mapa-camada-drenagem.png) | Ativação do filtro "Lago & Drenagem", exibindo o espelho d'água e os canais de dissipação hídrica. |
| **Camada de Bosque no Mapa** | [interacoes/mapa-camada-bosque.png](interacoes/mapa-camada-bosque.png) | Ativação do filtro "Bosque Nativo", destacando o dossel arbóreo de alta densidade biológica. |
| **Hover na Sonda Térmica** | [interacoes/mapa-sonda-termica-hover.png](interacoes/mapa-sonda-termica-hover.png) | Posicionamento do cursor sobre as torres de névoa no mapa, acionando o tooltip dinâmico com medição térmica pontual. |
| **Comparador: Preset 2021 (Antes)** | [interacoes/slider-preset-2021-antes.png](interacoes/slider-preset-2021-antes.png) | Clique no atalho "2021", deslocando o divisor para 100% à direita para exibir integralmente o terreno militar anterior à intervenção. |
| **Comparador: Preset 2026 (Depois)** | [interacoes/slider-preset-2026-depois.png](interacoes/slider-preset-2026-depois.png) | Clique no atalho "2026", deslocando o divisor para 100% à esquerda para exibir o parque totalmente implantado. |
| **Filtro de Categoria no Catálogo** | [interacoes/catalogo-filtro-categoria.png](interacoes/catalogo-filtro-categoria.png) | Seleção do botão "Clima Urbano", filtrando a listagem para exibir apenas métricas atmosféricas e de calor. |
| **Pesquisa em Tempo Real** | [interacoes/catalogo-busca-termo.png](interacoes/catalogo-busca-termo.png) | Digitação do termo `"temperatura"` no campo de busca (`#indicator-search`), resultando no isolamento instantâneo do card relevante. |
| **Modal de Detalhes do Indicador** | [interacoes/modal-detalhes-indicador.png](interacoes/modal-detalhes-indicador.png) | Clique em "Ver detalhes e fontes auditadas", abrindo a caixa de diálogo modal com fundamentação técnica, impacto em saúde pública e metodologia. |
| **Modal de Exportação de Dados** | [interacoes/modal-exportacao-dados.png](interacoes/modal-exportacao-dados.png) | Clique em "Exportar Relatório", abrindo o modal com opções para download nos formatos JSON, CSV e acionamento de impressão/PDF. |
| **Gaveta de POI do Mapa 2D** | [interacoes/outros-estados/mapa-drawer-poi-aberto.png](interacoes/outros-estados/mapa-drawer-poi-aberto.png) | Clique em marcador cartográfico, provocando o deslizamento da gaveta lateral informativa com fotos, status e dados de acessibilidade. |
| **Simulador de Tempestade Extrema** | [interacoes/outros-estados/simulador-tempestade-extrema.png](interacoes/outros-estados/simulador-tempestade-extrema.png) | Acionamento do cenário de estresse hídrico com 120 mm/h, ativando animação visual de volume acumulado nos reservatórios. |

---

## 8. Auditoria de Identidade Visual e Logotipos

Em atenção estrita ao item 7 das instruções da missão e considerando os materiais oficiais disponibilizados na pasta compartilhada do Google Drive (`https://drive.google.com/drive/u/0/folders/11T7DiC_q9kGQj_ieMlLu9jWznDOO_yPJ`):

### 8.1 Inventário de Ativos Oficiais no Repositório
No diretório `site/public/assets/`, localizam-se os arquivos oficiais rasterizados em alta resolução (512×512, transparência alfa de 32 bits):
1. `logo-vida-original.png` — Versão composta institucional da marca V.I.D.A.
2. `logo-vida-simbolo.png` — Símbolo do núcleo ecológico em formato quadrado.
3. `logo-vida-simbolo-transparente.png` — Símbolo isolado com canal alfa transparente.

### 8.2 Análise de Conformidade no Site Informativo
* **Elemento de Marca Atual:** No cabeçalho de `prototipos/02-painel-ambiental/index.html`, o logotipo é renderizado por meio de um glifo vetorial inline estilizado:
  ```html
  <div class="brand-logo-icon">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">...</svg>
  </div>
  ```
* **Diagnóstico de Identidade Visual:**
  1. **Discrepância Visual:** O glifo SVG atual utiliza uma representação genérica de folha, enquanto a identidade visual oficial do Projeto V.I.D.A. (conforme os arquivos em `site/public/assets/` e pasta oficial do Drive) possui um símbolo característico com anéis concêntricos e ramificações bioclimáticas.
  2. **Favicon Ausente:** O documento HTML não possui tag `<link rel="icon">`, fazendo com que os navegadores exibam o ícone padrão de documento em branco ou requisitem `/favicon.ico` com retorno 404.
  3. **Paleta de Cores e Tipografia:** A paleta cromática utilizada na folha de estilos (`#10b981`, `#06b6d4`, `#022c22`) apresenta excelente harmonia com a proposta ecológica da marca oficial, mantendo alto contraste em conformidade com as diretrizes WCAG AA.
* **Recomendação para Etapas Futuras (sem alteração de código nesta etapa):**  
  Em etapa posterior autorizada, atualizar o cabeçalho para referenciar `logo-vida-simbolo-transparente.png` ou converter o símbolo oficial para SVG vetorial puro, além de referenciar o favicon oficial no `<head>`.

---

## 9. Análise de Responsividade e Problemas Visuais Detectados

### 9.1 Avaliação Geral
* **Fluidez e Escala:** O layout adapta-se de forma consistente desde telas grandes (1920×1080) até telas estreitas de smartphones (360×800), sem travamento ou estouro horizontal de viewport (*no horizontal scrolling*).
* **Ausência de Overlays de Desenvolvimento:** Não foram detectados banners de hot-reloading, marcas d'água de depuração ou badges invasivos nas capturas.

### 9.2 Pontos de Atenção Observados
1. **Navegação Mobile:**  
   No cabeçalho mobile (360px e 390px), os botões utilitários de tema e exportação são compactados. Não existe um menu do tipo *hambúrguer* clássico para atalho direto às seções inferiores, dependendo do usuário rolar manualmente a página.
2. **Densidade na Seção Tripla (Balanço Hídrico & ODS):**  
   Em telas mobile verticais (360×800), os três blocos empilham-se sequencialmente gerando uma rolagem longa. O gráfico donut de espécies botânicas consome espaço vertical significativo para acomodar as 6 legendas de famílias vegetais.
3. **Área de Toque do Slider Comparador no Mobile:**  
   O divisor central deslizante (*slider handle*) do comparador antes/depois possui área de arraste adequada, mas em telas menores a imagem cortada pode exigir rolagem cuidadosa para evitar conflito com a rolagem vertical da página.

---

## 10. Capturas que Não Puderam Ser Realizadas

* **Cobertura do Site Informativo:** **100% de sucesso**. Todas as páginas, seções, modais, estados interativos e mapas cartográficos do Site Informativo foram capturados na íntegra.
* **Componentes Excluídos por Escopo Restritivo:**  
  Em cumprimento estrito às instruções da Missão 01, **nenhuma captura** do Quiz (`site/index.html` e `site/controle.html`) ou do Protótipo 3D (`parque-realengo-3d/` e `site/parque3d/`) foi incluída nesta pasta, resguardando a total independência das futuras missões.

---

## 11. Estrutura Final dos Arquivos

```text
screenshots/
└── 01-site-informativo/
    ├── relatorio.md (este documento)
    ├── manifest.json
    ├── desktop/
    │   ├── pagina-inicial.png
    │   ├── pagina-completa.png
    │   ├── pagina-inicial-1440x900.png
    │   ├── pagina-completa-1440x900.png
    │   └── outras-paginas/
    │       ├── galeria-hub.png
    │       ├── mapa-interativo-2d.png
    │       └── simulador-drenagem.png
    ├── mobile/
    │   ├── pagina-inicial.png
    │   ├── pagina-completa.png
    │   ├── pagina-inicial-360x800.png
    │   ├── pagina-completa-360x800.png
    │   └── outras-paginas/
    │       ├── galeria-hub-mobile.png
    │       ├── mapa-interativo-2d-mobile.png
    │       └── simulador-drenagem-mobile.png
    ├── secoes/
    │   ├── apresentacao.png
    │   ├── balanco-hidrico-botanica-ods.png
    │   ├── cabecalho.png
    │   ├── catalogo-indicadores.png
    │   ├── comparador-antes-depois.png
    │   ├── curva-termica.png
    │   ├── microclima.png
    │   ├── rodape.png
    │   └── sustentabilidade.png
    └── interacoes/
        ├── catalogo-busca-termo.png
        ├── catalogo-filtro-categoria.png
        ├── mapa-camada-bosque.png
        ├── mapa-camada-drenagem.png
        ├── mapa-sonda-termica-hover.png
        ├── modal-detalhes-indicador.png
        ├── modal-exportacao-dados.png
        ├── slider-preset-2021-antes.png
        ├── slider-preset-2026-depois.png
        ├── tema-claro.png
        └── outros-estados/
            ├── mapa-drawer-poi-aberto.png
            └── simulador-tempestade-extrema.png
```

---
*Relatório concluído e auditado em conformidade com as diretrizes do PROJETEC 2026.*
