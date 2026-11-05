# DOCUMENTAÇÃO DO MÓDULO QUIZ — ECOCITY / PROJETEC 2026

**Localização:** [`site/js/quiz-engine.js`](../../site/js/quiz-engine.js), [`site/js/quiz-questions.js`](../../site/js/quiz-questions.js), [`site/css/quiz.css`](../../site/css/quiz.css)  

---

## 1. Visão Geral

O **Quiz Pedagógico e Gamificado V.I.D.A.** é o módulo interativo responsável por testar e expandir o conhecimento dos visitantes sobre sustentabilidade urbana, ecologia da Mata Atlântica, eficiência bioclimática das torres de Realengo e gestão de bacias de retenção pluvial.

---

## 2. Componentes e Lógica

- **Banco de Questões (`quiz-questions.js`):** Contém perguntas estruturadas em múltiplos eixos temáticos (Sustentabilidade, Clima Urbano, Biodiversidade e Hidrologia).
- **Motor do Quiz (`quiz-engine.js`):** Gerencia o fluxo de perguntas, cálculo de pontuação, cronômetro, feedback pedagógico imediato e transições animadas.
- **Gamificação e Resultados:**
  - Gráfico de Radar de Competências (avalia o desempenho em diferentes áreas ecológicas).
  - Curva de Evolução e Boletim de Notas.
  - Podio e Ranking Global de pontuações.
  - Histórico de partidas armazenado via `LocalStorage`.

---

## 3. Como Executar e Testar

O quiz está integrado diretamente na interface principal do site (`site/index.html`). Para testá-lo:
1. Inicie o servidor: `npm start` (raiz) ou abra `site/index.html` no navegador.
2. Navegue até a seção do Quiz na interface web.
