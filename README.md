# 🌿 PROJETO V.I.D.A. — CENTRAL MULTITELA DE SUSTENTABILIDADE & VIGILÂNCIA AMBIENTAL
### Parque Realengo Jornalista Susana Naspolini • Stand de Exposição Interativa para Feira de Ciências

O **V.I.D.A. (Vigilância e Indicadores Digitais Ambientais)** é uma instalação digital imersiva projetada para transformar a apresentação de sustentabilidade urbana em uma experiência viva, editorial, tecnológica e gamificada. Desenvolvido para estandes de feiras de ciências, o projeto opera de forma coordenada em **dois dispositivos simultâneos sincronizados em tempo real**.

---

## 🌟 1. ARQUITETURA MULTITELA & VISÃO GERAL

```
 ┌────────────────────────────────────────────────────────┐       ┌───────────────────────────┐
 │               TELA 1: TELEVISÃO DO STAND               │       │ TELA 2: CELULAR VISITANTE │
 │                   (1920 × 1080 Full HD)                │       │     (Touch Mobile 2.5D)   │
 │                                                        │       │                           │
 │  1. Vídeo de Abertura Oficial (com áudio institucional)│       │ 1. Vídeo Obrigatório      │
 │  2. Cena Animada do Parque Vivo (Canvas 2.5D 60 FPS)   │ ◄───► │    (Sem botão de pular)   │
 │  3. 5 Super-Torres Bioclimáticas com Névoa Realística  │  WS   │ 2. Controle Remoto Touch  │
 │  4. Lago de 1.300 m² com Ondulações & Biovaletas       │  LAN  │ 3. 4 Missões Interativas  │
 │  5. QR Code Dinâmico com IP de Rede Local (Wi-Fi)      │   +   │ 4. Gatilhos de Clima/Névoa│
 │  6. Modo de Apresentação Contínuo (Attract Mode)       │ B-CH  │ 5. Trava de Visitante     │
 │  7. Overlays de Celebração e Conquista de Pontos       │       │    (Single Active Lock)   │
 └────────────────────────────────────────────────────────┘       └───────────────────────────┘
```

---

## 🎨 2. IDENTIDADE VISUAL OFICIAL — V.I.D.A.

A identidade visual do projeto foi construída com acabamento de exposição tecnológica profissional, aliando direção de arte editorial, visualização científica e contraste cinematográfico.

- **Arquivo Original Preservado:** [`public/assets/logo-vida-original.png`](file:///c:/Users/Daniz/Downloads/Projetec%203/public/assets/logo-vida-original.png) (496 × 496 px, obtido do Google Drive ID `1PEokgiNev-lGZv6_QJwBOpdNODGhPsyP`).
- **Símbolo Gráfico Transparente RGBA 32-bit:** [`public/assets/logo-vida-simbolo-transparente.png`](file:///c:/Users/Daniz/Downloads/Projetec%203/public/assets/logo-vida-simbolo-transparente.png) e [`public/assets/logo-vida-simbolo.png`](file:///c:/Users/Daniz/Downloads/Projetec%203/public/assets/logo-vida-simbolo.png) com canal alfa limpo e recorte circular perfeito, eliminando 100% qualquer texto indesejado e destacando exclusivamente a marca oficial **V.I.D.A.**.
- **Paleta Oficial de Quatro Elementos:**
  - **Verde-Esmeralda (`#10b981`, `#059669`):** Representa a natureza, biodiversidade e a Mata Atlântica regenerada.
  - **Azul Elétrico (`#06b6d4`, `#38bdf8`):** Simboliza a tecnologia, os circuitos e a gestão das águas pluviais.
  - **Dourado Solar (`#f59e0b`, `#fbbf24`):** Energia solar, sol de Realengo e calor humano.
  - **Preto Profundo (`#030712`, `#060b16`):** Sofisticação, profundidade e contraste institucional.

---

## 🖥️ 3. TELA 1 — TELEVISÃO DO STAND (`index.html`)

1. **Abertura Oficial em Tela Cheia:**
   - Reproduz localmente o arquivo oficial de apresentação em alta definição [`public/media/intro-vida.mp4`](file:///c:/Users/Daniz/Downloads/Projetec%203/public/media/intro-vida.mp4) (8.310.413 bytes).
   - Botão de liberação com áudio para conformidade total de navegadores e atalho para a banca avaliadora.
2. **Layout Split 75% / 25% Full HD (1920 × 1080):**
   - **75% Esquerda:** Palco do Parque Vivo em projeção isométrica 2.5D/3D a 60 FPS com ordenação de profundidade (Depth Sorting / Painter's algorithm no eixo Y).
   - **25% Direita:** Coluna lateral vertical em alto contraste (fundo branco puro) contendo a logo V.I.D.A., QR Code gerado dinamicamente com o IP da rede Wi-Fi local, status de conexão em tempo real e badge da sessão.
3. **Cena Contínua do Parque Vivo 2.5D/3D (Canvas 60 FPS):**
   - **5 Super-Torres Bioclimáticas Treliçadas:** Dimensões autênticas (17m, 26m e monumental torre central de 47m inspirada no Gardens by the Bay), com treliças em X, anéis estruturais e 236 bicos aspersores vaporizando névoa fotorrealística suave.
   - **Espelho D'Água (1.300 m² / 1,95 mi L):** Lâmina d'água com gradiente profundo, ondas procedurais contínuas e biovaletas absorventes conectadas aos 12 jardins de chuva.
   - **Bosque da Mata Atlântica:** 3.700 árvores volumétricas renderizadas por espécies (Ipês-Amarelos, Ipês-Roxos, Pau-Brasil, Jacarandás e Oitis) com balanço de vento orgânico e sombras projetadas.
   - **Equipamentos e Arquitetura Real:** Anfiteatro Susana Naspolini com arquibancadas concêntricas, domo 3D da Nave do Conhecimento com anéis em ciano, Skatepark com bowl escavado 3D, campo de grama sintética com traves, quadras poliesportivas e splash pad aquático animado.
   - **Câmera Cinematográfica Navegável Lerp:** Câmera fluida com transição suave que responde ao D-Pad do celular, com zoom contínuo (0.65x a 2.6x) e alternância entre Perspectiva Aérea e Nível Pedestre.
4. **Modo de Apresentação Contínuo (Attract Mode):**
   - Quando nenhum visitante está conectado, a televisão transita automaticamente a cada 9 segundos entre 6 pontos de interesse:
     1. *Vista Geral do Parque Realengo* (76.000 m² de solo vivo)
     2. *Cinco Super-Torres Bioclimáticas* (névoa pulsante e alívio térmico)
     3. *Sistema Pluvial Sustentável* (1.950 m³ de retenção pluvial)
     4. *Nave do Conhecimento & Inovação* (educação digital)
     5. *Bosque com 3.700 Árvores Nativas* (sequestro de carbono)
     6. *Anfiteatro Susana Naspolini* (arena cultural)
   - Exibe banner editorial flutuante com a descrição histórica e técnica de cada área.
5. **HUD & Síntese Sonora Web Audio API:**
   - Toasts flutuantes com o feed de ações do visitante ao vivo.
   - Sons sintetizados em tempo real: som de névoa pressurizada, bips harmônicos e fanfarra triunfal de missão.
   - Tela de celebração com estrelas e pontuação ao concluir cada missão.

---

## 📱 4. TELA 2 — CELULAR DO VISITANTE (`controle.html`)

1. **Trava de Visitante Único (Single Active Visitor Lock):**
   - Caso um visitante tente entrar enquanto outro já está controlando a experiência, o celular exibe uma elegante tela de espera com o emblema V.I.D.A.: *"Sessão em Andamento: Aguarde alguns instantes para participar"*.
   - Assim que o visitante atual conclui ou sai, o próximo na fila assume o controle automaticamente.
2. **Etapa 1: Vídeo Oficial Obrigatório (Sem Pulo):**
   - Trava de segurança: o visitante **precisa assistir ao vídeo até o final** para liberar o controle.
   - A barra de progresso não permite avanço manual para a frente.
   - Botão tátil *"Toque para Iniciar com Áudio"* para conformidade com iOS Safari e Android Chrome.
3. **Etapa 2: Controle Remoto Touch (Liberado pós-vídeo):**
   - **Dock de Navegação de Câmera da TV:**
     - 🕹️ *D-Pad Direcional:* Rotação orbital contínua (esquerda/direita) e inclinação vertical (cima/baixo) da cena na televisão.
     - 🔍 *Controle de Zoom:* Botões tácteis de aproximação e afastamento (0.65x até 2.6x) com interpolação suave Lerp.
     - 🌐 *Alternância de Visão:* Botão de alternância instantânea entre *Visão Aérea Isométrica* e *Nível Pedestre*.
   - **Aba "Explorar Parque":**
     - 💨 *5 Super-Torres Bioclimáticas:* Dispara névoa máxima na TV.
     - 💧 *Espelho D'Água & Drenagem:* Simula temporal e aciona biovaletas na TV.
     - 🛹 *Skatepark & Esportes:* Foca na área de street e quadras.
     - 🚀 *Nave do Conhecimento:* Destaque na inclusão digital e oficinas.
     - 🌳 *Bosque da Mata Atlântica:* Informações sobre as 3.700 árvores nativas.
     - 🎭 *Anfiteatro Susana Naspolini:* Apresentação da arena cultural.
   - **Aba "4 Missões de Sustentabilidade":**
     1. **Caminho da Água:** Controle deslizante de precipitação severa (20 a 110 mm/h) com acionamento de biovaletas e retenção pluvial (+150 pts).
     2. **Proteja o Verde:** Plantio tátil de Pau-Brasil, Ipê-Amarelo, Jacarandá e Sapucaia, calculando o alívio térmico (-5,8°C) que surge brotando na TV (+80 pts/muda).
     3. **Desafio da Reciclagem:** Coleta seletiva ágil com 4 lixeiras (Plástico, Papel, Metal e Compostagem) para nutrir o parque (+100 pts).
     4. **Explorador do Parque:** Quiz de 4 perguntas cronometradas sobre a história (Fábrica de Cartuchos do Exército), as árvores, as torres e Susana Naspolini (+120 pts).
4. **Feedback Sensorial & Resiliência:**
   - Sons sintetizados via Web Audio API e vibração tátil (`navigator.vibrate`).
   - Timeout de inatividade de 90 segundos: reseta a TV para o modo de espera caso o visitante se afaste.

---

## ⚡ 5. SERVIDOR LOCAL & WEBSOCKET EM TEMPO REAL (`server.js`)

- **Streaming HTTP 206 Partial Content:** Suporte integral a Range Requests para carregamento imediato do vídeo no iPhone/iPad (Safari) e Android sem travamentos.
- **Relé WebSocket Nativo:** Encaminhamento instantâneo de eventos filtrados por ID de sessão (`VIDA-XXXX`).
- **Gerenciador de Fila de Visitantes:** Controla a exclusividade do participante ativo no stand.
- **API de Rede Local (`/api/network-info`):** Detecta os IPs da máquina no Wi-Fi para alimentar o QR Code dinâmico.
- **Transporte Híbrido (`js/sync-engine.js`):** WebSocket na rede Wi-Fi com fallback automático para `BroadcastChannel` e `LocalStorage` para testes na mesma máquina.

---

## 🚀 6. COMO EXECUTAR NO DIA DA FEIRA

### Método 1: Inicialização em 1 Clique (Recomendado)
Dê um duplo clique no arquivo:
```cmd
iniciar-stand.bat
```
*(Ou no PowerShell: `.\iniciar-stand.ps1`)*

O iniciador automático:
1. Inicia o servidor HTTP + WebSocket na porta 3000.
2. Detecta a interface de rede ativa (ex: Wi-Fi `192.168.1.14`).
3. Abre automaticamente a **Tela 1 (Televisão)** no navegador em modo de espera.

### Método 2: Via Terminal
```bash
npm start
```

### Links Gerados:
- **Televisão do Stand:** `http://localhost:3000/` *(pressione `F11` para tela cheia)*
- **Celular do Visitante:** `http://192.168.1.14:3000/controle.html` *(ou escaneie o QR Code na TV)*
- **Salto Direto para o Parque Vivo:** `http://localhost:3000/?view=park`
- **Galeria Visual de Screenshots:** `http://localhost:3000/galeria`

---

## 📁 7. ESTRUTURA GERAL DOS ARQUIVOS

```
c:\Users\Daniz\Downloads\Projetec 3\
├── index.html                   # Tela 1: Apresentação da TV do Stand (1920 × 1080)
├── controle.html                # Tela 2: Controle Remoto Touch do Celular (390 × 844)
├── server.js                    # Servidor HTTP estático + Range 206 + WebSocket Relay
├── package.json                 # Dependências e scripts de execução
├── iniciar-stand.bat            # Script de inicialização automática em 1 clique
├── iniciar-stand.ps1            # Script de inicialização em PowerShell
├── capturar-multitela.js        # Utilitário automatizado de screenshots
├── README.md                    # Documentação completa do projeto
│
├── js/
│   ├── qrcode.js                # Gerador vetorial de QR Code em Canvas
│   ├── sync-engine.js           # Motor de sincronização híbrido multitela
│   ├── parque-vivo.js           # Motor Canvas 2.5D do Parque Vivo (60 FPS + Attract Mode)
│   ├── tv-stand.js              # Controlador principal da Tela 1 (áudio + HUD)
│   └── mobile-controller.js     # Controlador da Tela 2 (vídeo obrigatório + missões + fila)
│
├── css/
│   ├── tv-stand.css             # Estilos da TV (1920 × 1080, cores oficiais)
│   └── mobile-controller.css    # Estilos touch responsivos do celular (Dark Theme)
│
├── public/
│   ├── assets/
│   │   ├── logo-vida-original.png   # Cópia original da logo oficial (Google Drive)
│   │   └── logo-vida-simbolo.png    # Símbolo oficial isolado e otimizado
│   └── media/
│       └── intro-vida.mp4           # Cópia local de alta fidelidade do vídeo oficial
│
└── prototipos/
    ├── 01-mapa-parque/          # Projeto 01: Mapa Interativo Vetorial
    ├── 02-painel-ambiental/     # Projeto 02: Central de Monitoramento V.I.D.A.
    ├── 03-simulador-drenagem/   # Projeto 03: Simulador Hidrodinâmico de Alagamentos
    └── galeria-screenshots/     # Galeria central de capturas dos 4 projetos
```

---

## 📊 8. DADOS AMBIENTAIS E FONTES OFICIAIS VERIFICÁVEIS

| Elemento / Indicador | Dado Verificável | Fonte Oficial |
| :--- | :--- | :--- |
| **Área Total do Parque** | 76.000 m² (7,6 hectares) | Prefeitura da Cidade do Rio de Janeiro / Data.Rio |
| **Histórico do Terreno** | Antiga Fábrica de Cartuchos do Exército | Secretaria Municipal de Meio Ambiente e Clima (SMAC) |
| **Volume de Retenção Pluvial** | 1.950 m³ (1,95 milhão de litros) | Fundação Rio-Águas / SMAC |
| **Superfície do Lago** | 1.300 m² de espelho d'água permanente | Projeto Executivo Parque Realengo |
| **Super-Torres Bioclimáticas** | 5 torres treliçadas (17m, 26m e monumental central de 47m) com 236 bicos aspersores | SMAC / Secretaria de Urbanismo |
| **Reflorestamento de Mata Atlântica** | 3.700 árvores nativas plantadas na 1ª fase | Fundação Parques e Jardins (FPJ) |
| **Espécies Nativas Utilizadas** | Pau-Brasil, Ipês, Jacarandás, Sapucaias | Guia de Arborização Urbana SMAC / FPJ |
| **Diferencial de Temperatura** | Até -5,8°C sob copa arbórea e névoa | Dados micrometeorológicos Alerta Rio / SMAC |
| **Capacidade das Bacias Infiltrantes** | 120 mm/h de retenção máxima de enxurradas | Fundação Rio-Águas |
