# 🌐 Pasta do Site Oficial — Projeto V.I.D.A.
### Parque Realengo Jornalista Susana Naspolini • Projetec 2026

Esta pasta reúne a aplicação web completa do site, incluindo a plataforma educativa de quiz, o sistema de gamificação em tempo real e o controle mobile dos visitantes para a feira de ciências.

---

## 📁 Estrutura do Site

```
site/
├── index.html        # Página principal: apresentação, quiz interativo, ranking e boletim de notas
├── controle.html     # Controle do visitante: missões ambientais e vídeo responsivo em tela cheia
├── css/              # Folhas de estilo da plataforma
│   ├── quiz.css              # Estilos da plataforma de quiz, modais, gráficos e gamificação
│   ├── mobile-controller.css # Estilos da interface touch para celulares
│   └── tv-stand.css          # Estilos do modo telão do stand (TV)
├── js/               # Lógica e motores interativos
│   ├── quiz-engine.js        # Motor do quiz (XP, 5 níveis, 8 conquistas e revisão de gabarito)
│   ├── quiz-questions.js     # Banco oficial de perguntas pedagógicas
│   ├── mobile-controller.js  # Lógica de controle do celular do visitante
│   ├── parque-vivo.js        # Modo vitrine automatizado (Attract Mode)
│   └── tv-stand.js           # Gerenciamento do telão da feira
├── data/             # Dados locais persistentes
│   └── ranking.json          # Placar oficial dos participantes da feira
└── public/           # Ativos visuais e mídias
    ├── assets/               # Logos oficiais vetoriais e rasterizadas (1:1 antialiased)
    └── media/                # Vídeo original de entrada do parque (intro-vida.mp4)
```

---

## 🚀 Como Executar

### 1. Via Servidor Multitela Local (Stand da Feira)
Na raiz do repositório, execute:
```bash
npm start
```
* **Televisão do Stand / Desktop:** `http://localhost:3000/`
* **Celular do Visitante:** `http://[IP-DA-REDE]:3000/controle.html`
* **Gêmeo Digital 3D:** `http://localhost:3000/parque3d/`

### 2. Publicação na Vercel
O projeto conta com o [`vercel.json`](../vercel.json) configurado na raiz com suporte a compilação automática e rewrites para a pasta `site/`.
Se configurado manualmente no painel da Vercel:
* **Root Directory:** `./` (raiz) ou `site`
* **Build Command:** `npm run build`
