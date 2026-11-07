# 🌐 Pasta do Site Oficial — Projeto V.I.D.A.
### Sustentabilidade, Biotecnologia & Ciências Ambientais • Projetec 2026

Esta pasta reúne a aplicação web completa da plataforma educativa de quiz, o sistema de gamificação em tempo real e o controle mobile dos participantes para a feira de ciências.

A pasta é **100% autossuficiente e compatível nativamente com a Vercel**!

---

## 📁 Estrutura da Pasta `site/`

```
site/
├── vercel.json           # Configuração nativa para implantação direta na Vercel (cleanUrls, rewrites, CORS)
├── package.json          # Manifesto NPM do site para reconhecimento automático na Vercel
├── index.html            # Página principal: apresentação, quiz interativo, ranking e boletim de notas
├── controle.html         # Controle do visitante: missões ambientais e vídeo responsivo em tela cheia
├── README.md             # Esta documentação
├── api/                  # Serverless Functions Vercel (Node.js)
│   ├── ranking.js        # API RESTful de Ranking (/api/ranking - GET e POST com persistência)
│   └── network-info.js   # API de endpoints de rede (/api/network-info)
├── css/                  # Folhas de estilo da plataforma
│   ├── quiz.css          # Estilos da plataforma de quiz, modais, gráficos e gamificação
│   ├── mobile-controller.css # Estilos da interface touch para celulares
│   └── tv-stand.css      # Estilos do modo telão do stand (TV)
├── js/                   # Lógica e motores interativos
│   ├── quiz-engine.js    # Motor do quiz (XP, 5 níveis, 8 conquistas e revisão de gabarito)
│   ├── quiz-questions.js # Banco oficial de perguntas pedagógicas
│   ├── mobile-controller.js  # Lógica de controle do celular do visitante
│   ├── qrcode.js         # Gerador de QR Code do stand
│   ├── sync-engine.js    # Sincronização em tempo real via WebSocket
│   └── tv-stand.js       # Gerenciamento do telão da feira
├── data/                 # Dados locais persistentes
│   └── ranking.json      # Placar oficial dos participantes da feira
└── public/               # Ativos visuais e mídias
    ├── assets/           # Logos oficiais vetoriais e rasterizadas (1:1 antialiased)
    └── media/            # Vídeo original de entrada (intro-vida.mp4)
```

---

## 🚀 Compatibilidade Total com a Vercel

A pasta `site/` foi projetada para funcionar com perfeição em **ambos** os métodos de implantação da Vercel:

### Cenário 1: "Root Directory" configurado como `site` no Painel da Vercel
Se você selecionar a pasta `site` como raiz no projeto da Vercel (ou executar `vercel` dentro de `site/`):
- O arquivo [`site/vercel.json`](./vercel.json) assume o controle imediatamente.
- As Serverless Functions em [`site/api/`](./api/) respondem por `/api/ranking` e `/api/network-info`.
- URLs limpas funcionam perfeitamente (`/controle`, `/ranking-tv`, `/mobile`, etc.).

### Cenário 2: "Root Directory" configurado como `./` (Raiz do Repositório)
Se você deixar a raiz do repositório como padrão:
- O arquivo [`vercel.json`](../vercel.json) da raiz realiza o build e reescreve as rotas e assets diretamente para `site/`.
- Todos os links, QR Codes e APIs continuam funcionando identicamente.

---

## 💻 Como Executar Localmente

### Servidor Local do Stand (Multitela + WebSocket)
Na raiz do projeto:
```bash
npm start
```
* **Televisão do Stand / Desktop:** `http://localhost:3000/`
* **Celular do Visitante:** `http://[IP-DA-REDE]:3000/controle.html`
* **Portal Biotecnologia & Sustentabilidade:** `http://localhost:3000/biotecnologia`
