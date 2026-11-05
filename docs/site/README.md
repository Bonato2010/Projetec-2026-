# DOCUMENTAÇÃO DO SITE E CENTRAL MULTITELA — ECOCITY / PROJETEC 2026

**Diretório:** [`site/`](../../site/)  

---

## 1. Visão Geral

O diretório `site/` abriga a plataforma web oficial e a central multitela interativa do projeto **EcoCity / Projeto V.I.D.A.** (Parque Realengo Susana Naspolini). Ele foi concebido para rodar tanto online (hospedado na Vercel) quanto localmente no stand da Feira de Ciências, integrando uma TV principal e smartphones dos visitantes.

---

## 2. Estrutura de Arquivos

```text
site/
├── api/
│   ├── network-info.js      # Endpoint serverless para diagnóstico de rede
│   └── ranking.js           # Endpoint serverless para gerenciar o ranking global
├── css/
│   ├── mobile-controller.css# Estilos do controle remoto mobile (joystick/touch)
│   ├── quiz.css             # Estilos do quiz pedagógico e radar de competências
│   └── tv-stand.css         # Estilos da interface monumental para TV do stand
├── data/
│   └── ranking.json         # Base de dados local para persistência do ranking
├── js/
│   ├── mobile-controller.js # Lógica do controle remoto mobile via WebSocket
│   ├── parque-vivo.js       # Comportamentos interativos do site principal
│   ├── qrcode.js            # Gerador dinâmico de QR Code para conexão com a TV
│   ├── quiz-engine.js       # Motor do Quiz (perguntas, pontuação, radar, histórico)
│   ├── quiz-questions.js    # Banco de dados de perguntas e alternativas pedagógicas
│   ├── sync-engine.js       # Motor de sincronização WebSocket (TV <-> Mobile)
│   └── tv-stand.js          # Lógica de exibição e controle na TV do stand
├── public/
│   ├── assets/              # Logotipos oficiais (transparente, símbolo, original)
│   └── media/               # Vídeos institucionais (intro-vida.mp4)
├── parque3d/                # Build sincronizado do gêmeo digital 3D
├── controle.html            # Página do controlador mobile (/controle)
├── index.html               # Página principal do site e TV do stand (/tv)
├── package.json             # Metadados do site
├── README.md                # Documentação local do site
└── vercel.json              # Configurações de rotas e headers para Vercel
```

---

## 3. Modos de Operação (Multitela)

1. **Modo TV Stand (`/`)**: Exibição em tela grande na Feira de Ciências, mostrando o vídeo de introdução, acesso rápido ao Gêmeo Digital 3D (`/parque3d`), galeria de screenshots (`/galeria`) e o ranking em tempo real.
2. **Modo Mobile Controller (`/controle`)**: Acessado via QR Code pela câmera do smartphone do visitante. Permite navegar pelos modos do quiz e controlar interações remotamente na TV.
