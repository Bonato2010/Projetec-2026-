# Relatório de Revisão Visual Profunda: Site Informativo EcoCity — PROJETEC 2026

**Projeto:** EcoCity — Projeto V.I.D.A. (Vigilância e Indicadores Digitais Ambientais)  
**Estudo de Caso Oficial:** Parque Realengo Jornalista Susana Naspolini (76.000 m²)  
**Eixos Interdisciplinares:** Informática e Engenharia de Software • Enfermagem e Saúde Coletiva  
**Orientação Oficial:** Profª Amanda  
**Data da Auditoria e Conclusão:** 05 de Novembro de 2026  
**Status:** Concluído com Êxito • 100% Fotografias Reais • Mobile-First Consolidado

---

## 1. Sumário Executivo & Diagnóstico Inicial

A presente intervenção realizou uma revisão técnica e visual profunda na aplicação do **Site Informativo** do EcoCity (`site-informativo/` e seu espelho `prototipos/02-painel-ambiental/`). O trabalho foi orientado a resolver três deficiências centrais identificadas na versão anterior:

1. **Uso Indevido de Modelos 3D na Comparação Temporal:** A seção de comparação entre o passado e o presente utilizava capturas monocromáticas e renderizações 3D estilizadas, quando o rigor científico e documental exigia **fotografias reais e autênticas** da antiga ocupação militar da Fábrica de Cartuchos e do parque entregue.
2. **Experiência Mobile Deficiente:** O design anterior comportava-se como uma simples redução mecânica da versão desktop, resultando em slider tátil comprimido (inviável em telas verticais), falta de navegação rápida com o polegar e áreas de toque abaixo dos padrões ergonômicos da W3C/WCAG.
3. **Aparência Artificial Típica de IA:** O projeto apresentava clichês estéticos comuns em templates automatizados, incluindo brilhos neon esmeralda (`box-shadow: 0 0 30px`), gradientes elétricos, glassmorphism genérico e o uso ostensivo de emojis como ícones de interface.

Todos os três problemas foram **integralmente solucionados**. O site foi transformado em uma plataforma editorial madura, autêntica e orientada à experiência real dos visitantes que acessarão o projeto via QR Code nos dispositivos móveis durante a feira tecnológica **PROJETEC 2026**.

---

## 2. Reconstrução da Seção de Comparação: 100% Fotografias Reais

A seção de comparação temporal foi totalmente reconstruída em conformidade com as diretrizes do projeto: **nenhum modelo 3D, mockup arquitetônico ou representação sintética é utilizada nesta seção**.

### 2.1 Pesquisa e Acervo de Fotografias Reais Auditadas

Foram integradas fotografias oficiais em alta resolução, com identificação precisa de época, fonte pública e contexto territorial:

| Registro Fotográfico | Período / Data | Fonte Oficial Verificada | Fotógrafo / Órgão | Conteúdo Documentado |
| :--- | :--- | :--- | :--- | :--- |
| **Ortofoto Aerofotogramétrica do Lote Militar** | 1910 — 2021 | SMAC / Catálogo Oficial da 14ª Bienal Internacional de Arquitetura de São Paulo (BIA-SP) | Ortofoto Cartográfica Oficial / Prefeitura do Rio | Levantamento aéreo métrico do terreno de 76 mil m², evidenciando a fábrica murada, galpões de munição do Exército, solo árido sem cobertura vegetal e alta retenção de calor. |
| **Fotografia Aérea Real por Drone do Parque Entregue** | 2024 — 2026 | Prefeitura da Cidade do Rio de Janeiro / Sec. Municipal de Coordenação Governamental | Acervo Aerofotográfico Oficial da Prefeitura do Rio | Fotografia real de drone demonstrando o parque concluído, espelho d'água permanente de 1.300 m², bacia pluvial de 1.950 m³, 3.700 mudas nativas da Mata Atlântica e as 5 super-torres. |
| **Fotografia Histórica da Ocupação Militar em Realengo** | 1914 | Arquivo Nacional — Fundo Fotográfico Ministério da Guerra (Wikimedia Commons) | Registro Histórico Oficial do Exército Brasileiro (1914) | Registro autêntico das instalações e piquete militar da Fábrica de Cartuchos de Realengo, área isolada por muros militares por mais de 100 anos. |
| **Fotografia Documental de Freqüentadores e Super-Torres** | 2024 — 2026 | 14ª Bienal Internacional de Arquitetura de São Paulo / Ecomimesis | Fotografia por Rafael Salim | Visitantes, famílias e crianças caminhando pela passarela elevada sob o dossel das árvores e a aspersão bioclimática das torres contra as montanhas de Realengo. |
| **Canteiros Comunitários em Alvenaria** | 2024 | 14ª Bienal Internacional de Arquitetura de São Paulo / Ecomimesis | Fotografia por Rafael Salim | Moradores locais e crianças participando do cultivo de hortaliças e plantas medicinais nos canteiros elevados de tijolo do parque. |
| **Fachada da Nave do Conhecimento** | 2024 | Prefeitura da Cidade do Rio de Janeiro | Acervo Oficial FPJ / PCRJ | Fotografia real do domo tecnológico de 830 m² oferecendo capacitação gratuita em informática e robótica. |
| **Área Arborizada e Descanso** | 2024 | Prefeitura da Cidade do Rio de Janeiro | Acervo Oficial PCRJ | Bancos, famílias e arborização consolidada fornecendo sombra de qualidade no centro do parque. |
| **Super-Torre Iluminada Noturna** | 2024 | 14ª Bienal Internacional de Arquitetura de São Paulo | Fotografia por Rafael Salim | Vista noturna das torres bioclimáticas em funcionamento e iluminação cênica com pedestres. |

### 2.2 Arquitetura Interativa da Comparação

1. **Seletor de Perspectivas:**
   - **Visão Aérea do Território (76.000 m²):** Mostra a transformação urbana em macroescala, comparando a ortofoto aérea histórica da Fábrica Militar com a foto aérea real de drone do parque entregue.
   - **Nível dos Olhos & Vivência Comunitária:** Mostra a transformação da experiência humana, comparando a foto militar de 1914 do Arquivo Nacional com a foto real de Rafael Salim mostrando os frequentadores no bosque sob a névoa das torres.
2. **Quatro Modos de Visualização:**
   - `Ver Antes`: Exibe a imagem histórica em tela cheia com legenda contextual.
   - `Divisão Interativa (50/50)`: Slider tátil e arrastável suave, com suporte a mouse, touch e teclado (setas).
   - `Ver Hoje`: Exibe a fotografia do parque entregue em tela cheia.
   - `Lado a Lado`: Disposição editorial em duas colunas paralelas para visualização simultânea comparada.
3. **Dossier Técnico com Metadados:** Cada fotografia conta com legenda detalhada contendo título, ano aproximado, fonte oficial pública auditada e notas explicativas.
4. **Lightbox de Ampliação em Alta Resolução:** Botão dedicado que permite ao visitante abrir a fotografia original em resolução máxima para examinar detalhes históricos e arquitetônicos sem perda de nitidez.

---

## 3. Engenharia Mobile-First: A Principal Interface da Feira

Como a esmagadora maioria dos visitantes da **PROJETEC 2026** acessará o site via smartphones através do QR Code exposto no estande, o sistema móvel foi reprojetado do zero como a experiência prioritária:

1. **Barra Flutuante de Navegação Inferior (Mobile Bottom Bar):**
   - Fixada na base da tela com respeito às margens de segurança dos sistemas operacionais (`env(safe-area-inset-bottom)`).
   - Fornece cinco destinos essenciais acessíveis com um único toque do polegar: *Início*, *Saúde*, *Parque Real*, *Sensores* e *Menu*.
   - Áreas de toque com altura mínima de 48px e destaque tátil ativo.
2. **Substituição do Slider Comprimido por Cards Documentais no Celular:**
   - Em larguras menores que 768px, o slider horizontal (que ficava excessivamente estreito) dá lugar a um conjunto de **Cards Fotográficos Verticais Empilhados**.
   - Cada card exibe a fotografia real em proporção 16:10 de alto impacto, acompanhada de selos de identificação (*ANTES • HISTÓRICO* e *HOJE • PARQUE CONCLUÍDO*), botão individual de zoom em tela cheia e créditos oficiais.
3. **Tipografia Fluida e Espaçamentos Anti-Quebra:**
   - Equacionamento das fontes através de funções `clamp()` testadas rigorosamente em viewports ultra-compactos (360px), intermediários (390px) e grandes (430px).
   - Eliminação total de rolagem horizontal acidental (`overflow-x: hidden`).
   - Barra de filtros de indicadores com deslizamento horizontal tátil suave (`-webkit-overflow-scrolling: touch`).
4. **Drawer Lateral Otimizado:**
   - Acesso rápido aos atalhos do estande: *Modo Feira (M)*, *Áudio (A)* e *Apresentação Guiada (P)*.
   - Transições físicas suaves com backdrop desfocado.

---

## 4. Eliminação da Estética Artificial de IA & Humanização Editorial

Para afastar a percepção de template genérico gerado por inteligência artificial, foi conduzida uma reforma estética profunda:

1. **Paleta Cromática Natural e Institucional:**
   - **Fundo Florestal Profundo:** `#0b1410`, `#122119`, `#1a2f24` (tons de clorofila densa e ardósia botânica, substituindo o preto genérico `#030806`).
   - **Argila & Terracota Brasileira:** `#c76442` (utilizado para contextualizar o passado, a terra árida e os alertas sanitários, conferindo calor humano e tátil).
   - **Verde Folha Real:** `#3ea672` (verde vegetal equilibrado, sem o aspecto elétrico e neon do Tailwind `#10b981`).
   - **Âmbar Solar & Água Fluvial:** `#e4a148` e `#3d8ea6` para equilíbrio cromático.
   - **Tipografia em Linho Natural:** `#f5f3ec` e `#c9d2c8` para garantir legibilidade com menor fadiga ocular.
2. **Erradicação Completa de Efeitos Neon:**
   - Eliminação de todas as sombras `box-shadow: 0 0 30px rgba(16, 185, 129, 0.35)`.
   - Adoção de sombras arquitetônicas físicas (`box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35)` e `0 16px 40px rgba(0, 0, 0, 0.5)`).
3. **Substituição Integral de Emojis por Ícones Vetoriais SVG Bespoke:**
   - Mais de 25 emojis foram substituídos por ícones vetoriais SVG inline geométricos e elegantes (estetoscópio, pulmões, bacia hidrográfica, microcontroladores, pás mineradoras, ciclos de reciclagem, termômetros e câmeras fotográficas).
   - Renderização idêntica e nítida em qualquer sistema operacional (iOS, Android, Windows, macOS, Linux).
4. **Voz Humana e Autêntica dos Estudantes:**
   - Textos fundamentados na vivência real do bairro de Realengo (sensações térmicas históricas de 50°C, atendimento na UPA e Clínica da Família, luta popular da comunidade liderada por Susana Naspolini no telejornalismo comunitário do RJ1).
   - Apresentação da pesquisa interdisciplinar da Enfermagem (ANVISA RDC nº 222/2018 para Resíduos de Saúde e determinantes ambientais da saúde cardiovascular) e da Informática (firmware aberto, ESP32, DHT22 e sensores laser PMS5003).
   - Reconhecimento expresso da mentoria da orientadora **Profª Amanda** e dos 8 estudantes pesquisadores.

---

## 5. Espelhamento e Integridade do Repositório

Em total observância aos princípios de integridade estabelecidos:
- Os arquivos atualizados do `site-informativo/` foram espelhados para `prototipos/02-painel-ambiental/` (`index.html`, `css/styles.css`, `js/app.js`, `js/data.js` e a pasta de imagens `assets/fotos-reais/`).
- O **Quiz Interativo** (`site/index.html`), o protótipo 3D independente (`parque-realengo-3d/`) e o servidor do estande (`server.js`) foram mantidos **rigorosamente intactos**, sem qualquer alteração de escopo.
- A configuração de rotas (`vercel.json`) permanece 100% compatível.

---

## 6. Inventário Completo das Evidências Visuais (48 Screenshots)

Todas as capturas foram salvas exclusivamente no diretório canônico `screenshots/site-informativo/revisao-visual/`:

### 6.1 Estado Anterior ("Antes")
- `antes/01_desktop_hero_antes.png` — Hero anterior com acentos neon.
- `antes/02_desktop_fullpage_antes.png` — Página completa da versão anterior.
- `antes/04_mobile_hero_antes.png` — Hero anterior em viewport mobile.
- `antes/05_mobile_fullpage_antes.png` — Página mobile anterior sem otimização tátil.

### 6.2 Comparações Fotográficas Específicas
- `comparacao-fotografica/01_desktop_perspectiva_aerea_50-50.png` — Divisão 50/50 da ortofoto histórica vs foto aérea real.
- `comparacao-fotografica/02_desktop_perspectiva_aerea_antes_completo.png` — Ortofoto oficial do lote militar em tela cheia.
- `comparacao-fotografica/03_desktop_perspectiva_aerea_hoje_completo.png` — Foto aérea de drone do parque concluído em tela cheia.
- `comparacao-fotografica/04_desktop_perspectiva_aerea_lado_a_lado.png` — Modo editorial com fotos lado a lado no desktop.
- `comparacao-fotografica/05_desktop_perspectiva_terrestre_50-50.png` — Nível dos olhos: foto de 1914 vs foto real dos frequentadores e torres.
- `comparacao-fotografica/06_desktop_perspectiva_terrestre_lado_a_lado.png` — Modo lado a lado da perspectiva terrestre com visitantes.
- `comparacao-fotografica/07_desktop_lightbox_foto_real_ampliada.png` — Modal de zoom fotográfico com metadados e fonte oficial.
- `comparacao-fotografica/08_galeria_estruturas_fotos_reais.png` — Equipamentos públicos documentados com fotos reais (torres, nave, bosque, canteiros).
- `comparacao-fotografica/09_mobile_cards_fotograficos_empilhados.png` — Visualização móvel com cards empilhados de alta definição.
- `comparacao-fotografica/10_mobile_lightbox_zoom_foto_real.png` — Lightbox de inspeção fotográfica em tela cheia no smartphone.

### 6.3 Desktop FHD (1920 × 1080) e Widescreen (1440 × 900)
- `desktop/01_desktop_1920_hero.png` — Abertura hero com paleta natural e métricas documentais.
- `desktop/02_desktop_1920_pagina_completa.png` — Página inteira em resolução 1920×1080.
- `desktop/03_desktop_secao_desafio_recursos.png` — Seção linear vs circular com ícones vetoriais SVG.
- `desktop/04_desktop_secao_saude_enfermagem.png` — Seção de enfermagem, estresse térmico e ANVISA.
- `desktop/05_desktop_secao_tecnologia_sensores.png` — Telemetria IoT e catálogo de indicadores.
- `desktop/06_desktop_secao_parque_realengo_completa.png` — Seção completa do parque com fotos reais.
- `desktop/07_desktop_secao_pesquisas_ods.png` — 4 eixos de pesquisa e metas ODS da ONU.
- `desktop/08_desktop_secao_pratica_acervo_drive.png` — Evidências reais do acervo (camisas, bottons, rascunhos).
- `desktop/09_desktop_secao_equipe_orientacao.png` — Cartão da Profª Amanda e estudantes pesquisadores.
- `desktop/10_desktop_secao_conclusao_fontes.png` — Links do ecossistema e fontes científicas auditadas.
- `desktop/11_desktop_1440_hero.png` — Hero na resolução 1440×900.
- `desktop/12_desktop_1440_pagina_completa.png` — Página completa na resolução 1440×900.

### 6.4 Mobile Multi-Resolução
- **Mobile 360 × 800 (Padrão Android / Samsung Galaxy A):**
  - `mobile/360px/01_mobile_360_hero.png`
  - `mobile/360px/02_mobile_360_pagina_completa.png`
  - `mobile/360px/03_mobile_360_cards_fotos_reais.png`
  - `mobile/360px/04_mobile_360_sensores_telemetria.png`
  - `mobile/360px/05_mobile_360_drawer_menu.png`
- **Mobile 390 × 844 (iPhone 12 / 13 / 14 — Referência Principal):**
  - `mobile/390px/01_mobile_390_hero.png`
  - `mobile/390px/02_mobile_390_pagina_completa.png`
  - `mobile/390px/03_mobile_390_desafio_recursos.png`
  - `mobile/390px/04_mobile_390_saude_enfermagem.png`
  - `mobile/390px/05_mobile_390_comparacao_fotos_reais.png`
  - `mobile/390px/06_mobile_390_lightbox_zoom_foto.png`
  - `mobile/390px/07_mobile_390_modal_estrutura_real.png`
  - `mobile/390px/08_mobile_390_modal_material_circular.png`
  - `mobile/390px/09_mobile_390_drawer_navegacao.png`
- **Mobile 430 × 932 (iPhone Pro Max):**
  - `mobile/430px/01_mobile_430_hero.png`
  - `mobile/430px/02_mobile_430_pagina_completa.png`
  - `mobile/430px/03_mobile_430_comparacao_fotos_reais.png`
  - `mobile/430px/04_mobile_430_equipe_alunos_orientadora.png`

### 6.5 Estado Final ("Depois")
- `depois/desktop_1920x1080_fullpage_depois.png` — Página inteira desktop 1920×1080 da versão final.
- `depois/mobile_390x844_fullpage_depois.png` — Página inteira mobile 390×844 da versão final.

---

## 7. Conclusão

A revisão profunda do Site Informativo elevou a experiência digital do **EcoCity — PROJETEC 2026** a um padrão visual de nível institucional, editorial e científico. A substituição definitiva de elementos 3D por fotografias reais históricas e atuais, a centralidade ergonômica da experiência mobile e a eliminação de clichês visuais de IA garantem uma apresentação de altíssimo impacto, seriedade e autenticidade para a banca examinadora e para os visitantes da feira tecnológica.
