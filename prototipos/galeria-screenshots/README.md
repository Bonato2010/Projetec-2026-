# CENTRAL AUTOMÁTICA DE SCREENSHOTS & PRÉ-VISUALIZAÇÃO
### PROJETEC 2026 — Parque Realengo Jornalista Susana Naspolini

Esta pasta contém a **galeria independente de acompanhamento visual** dos três protótipos desenvolvidos para o Parque Realengo Susana Naspolini, com **capturas de tela reais** geradas diretamente pela execução do navegador em modo headless, sem exigir que cada aplicação seja aberta e executada manualmente a cada verificação.

---

## 📸 1. Projetos Monitorados

A galeria monitora e documenta em alta definição as três aplicações reais desenvolvidas:

1. **Projeto 01 — Mapa Interativo do Parque Realengo** (`prototipos/01-mapa-parque/`):
   - Cartografia digital e interativa dos 76 mil m² do parque;
   - Localização das 5 Super-Torres, espelho d'água de 1.300 m², biovaletas, anfiteatro e bosque;
   - Visualizações capturadas: Desktop Geral (1440×900), Ponto de Interesse em Destaque, Filtro de Bosques e Jardins, Apresentação Mobile (390×844) e Detalhe no Celular.

2. **Projeto 02 — Central de Monitoramento Ambiental V.I.D.A.** (`prototipos/02-painel-ambiental/`):
   - Dashboard profissional de inteligência climática e sustentabilidade urbana com 18 indicadores auditados;
   - Mapa microclimático com névoa, curva térmica diária de 24h, balanço hídrico e comparador antes/depois (2021 vs 2026);
   - Visualizações capturadas: Painel Principal Desktop (1440×900), Janela Modal de Indicador Oficial (3.700 árvores), Slider Comparativo Antes/Depois, Catálogo Filtrado por Clima Urbano, Versão Mobile e Modal no Celular.

3. **Projeto 03 — Simulador de Drenagem e Enchentes** (`prototipos/03-simulador-drenagem/`):
   - Simulação hidrodinâmica em tempo real de retenção pluvial do lago (1.950 m³) e infiltração no aquífero;
   - Contraste visual entre a proteção proporcionada pelo parque e o alagamento crítico na Rua Prof. Carlos Wenceslau no cenário sem parque (2021);
   - Visualizações capturadas: Simulação Normal (1440×900), Tempestade Extrema (110 mm/h), Cenário Crítico Sem o Parque (Alagamento) e Apresentação Mobile Touch (390×844).

---

## 🚀 2. Como Visualizar a Galeria

Basta abrir o arquivo diretamente no navegador:
```
prototipos/galeria-screenshots/index.html
```

* **Funciona 100% offline e sem necessidade de servidor local:** O manifesto de capturas é carregado via `js/manifest-data.js`, garantindo que não ocorram bloqueios de CORS por protocolo `file:///`.
* **Visualização Ampliada (Lightbox):** Clique em qualquer miniatura para abrir a imagem em tamanho real, com metadados de resolução, peso em KB, data/hora da captura e navegação por teclado (setas e ESC).
* **Filtros por Projeto:** Alterne rapidamente entre a visualização de todos os projetos ou concentre-se em um protótipo específico.
* **Links Diretos:** Cada projeto possui um botão "Abrir Aplicação Real" para executar a aplicação interativa original.

---

## ⚡ 3. Como Atualizar Todas as Capturas

Sempre que realizar uma alteração visual importante nos protótipos, execute o comando de captura automatizada a partir da raiz do projeto:

```bash
node prototipos/galeria-screenshots/capturar.js
```

Ou no Windows PowerShell, execute o script direto:
```powershell
cd prototipos/galeria-screenshots
.\capturar.ps1
```

### O que o script de captura faz:
1. Detecta automaticamente o executável do **Google Chrome** ou **Microsoft Edge** presente no sistema;
2. Arquiva as capturas anteriores na pasta `screenshots/historico/` com carimbo de data e hora (timestamp);
3. Inicia cada protótipo em resolução de computador (**1440 × 900**) e celular (**390 × 844**);
4. Aguarda a renderização completa dos componentes visuais, gráficos SVG e Canvas (`--virtual-time-budget`);
5. Salva os arquivos PNG em suas respectivas pastas e atualiza o manifesto `screenshots-manifest.json` e `js/manifest-data.js`.

---

## 📁 4. Estrutura de Diretórios

```
prototipos/galeria-screenshots/
├── index.html                   # Interface da galeria com lightbox interativo
├── capturar.js                  # Motor automatizado de captura headless
├── capturar.ps1                 # Script simplificado para Windows PowerShell
├── README.md                    # Esta documentação
├── screenshots-manifest.json    # Metadados JSON das capturas
├── css/
│   └── styles.css               # Estilos da galeria e do lightbox
├── js/
│   ├── gallery.js               # Controlador da galeria, filtros e modal
│   └── manifest-data.js         # Dados das capturas para funcionamento offline
└── screenshots/
    ├── mapa-parque/             # Capturas do Projeto 01 (Desktop e Mobile)
    ├── painel-ambiental/        # Capturas do Projeto 02 (Desktop e Mobile)
    ├── simulador-drenagem/      # Capturas do Projeto 03 (Desktop e Mobile)
    └── historico/               # Backups com timestamp das capturas anteriores
```
