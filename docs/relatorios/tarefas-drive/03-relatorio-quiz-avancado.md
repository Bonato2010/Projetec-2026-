# RELATÓRIO DE REFORMULAÇÃO E APERFEIÇOAMENTO DO QUIZ — ECOCITY
**Tarefa 03 — Dificuldade Elevada, Questões Técnicas Rigorosas, Alternativas Balanceadas e Experiência Profissional**  
**Data:** 06/11/2026  
**Status da Tarefa:** ✅ **CONCLUÍDA COM SUCESSO E VALIDADA POR TESTES AUTOMATIZADOS**

---

## 1. RESUMO EXECUTIVO

A plataforma de quiz do EcoCity passou por uma **revisão profunda de conteúdo e engenharia pedagógica**, atendendo rigorosamente a todos os critérios da **Tarefa 03**:
1. **Banco Oficial de Alto Desafio:** Criadas e revisadas **122 questões técnicas exclusivas**, contextualizadas no universo do Parque Realengo, no EcoCity e na realidade socioambiental e epidemiológica brasileira.
2. **Eliminação de Vieses:** Todas as 122 questões foram auditadas por script algorítmico, eliminando 100% dos vieses de tamanho na alternativa correta (que na versão antiga ocorriam em 79 perguntas). As alternativas e distratores foram rigorosamente balanceados em extensão e estrutura gramatical.
3. **Distratores Plausíveis:** Eliminadas alternativas absurdas ou óbvias. Todos os distratores representam falhas de raciocínio reais em engenharia sanitária, hidrologia, enfermagem em desastres ou biotecnologia.
4. **Fundamentação Científica em 100% das Questões:** Cada gabarito inclui justificativa detalhada com referências a normas e diretrizes oficiais (ANVISA RDC 222/2018, Alerta Rio, Fundação Rio-Águas, OMS, ODS ONU 3, 6, 11 e 13).
5. **Embaralhamento Dinâmico:** A posição das alternativas é sorteada a cada partida sem alterar o gabarito e a explicação correspondente.
6. **Mecânica Completa & Gamificação:** Pontuação dinâmica, bônus de sequência, progressão de XP, tempo de resposta calibrado, boletim final avaliativo com nota de 0 a 10 e ranking persistente com pódio ao vivo.
7. **Evidências Visuais Reais:** 7 screenshots capturados com Playwright em `screenshots/03-quiz/`.

---

## 2. ESTRUTURA DO BANCO DE QUESTÕES OFICIAL

| Modalidade | Fácil | Médio | Difícil (Desafio EcoCity) | Total |
| :--- | :---: | :---: | :---: | :---: |
| **Sustentabilidade & Meio Ambiente** | 20 | 20 | 21 | **61** |
| **Modo Profissional (Enfermagem, TI & Gestão)** | 20 | 20 | 21 | **61** |
| **Total Geral Auditado** | **40** | **40** | **42** | **122 Questões** |

### Áreas Técnicas Cobertas
- **Drenagem Urbana & Bacias de Amortecimento:** Método Racional, Equação de Manning, tempo de concentração, coeficiente de escoamento superficial (runoff), remanso de maré e bacias de retenção do Parque Realengo.
- **Saúde Pública & Vigilância Epidemiológica:** Dinâmica de transmissão da Leptospirose pós-enchente, período de incubação, arboviroses (Dengue, Chikungunya, Zika), contaminação hídrica por coliformes e epidemiologia baseada em esgoto (EBE).
- **Enfermagem em Crises Climáticas:** Choque térmico por calor extremo (Heat Stroke), resfriamento evaporativo, desidratação em idosos e crianças, triagem pelo Protocolo de Manchester e assistência humanizada em abrigos provisórios.
- **Resíduos de Serviços de Saúde (RSS):** Classificação da ANVISA RDC 222/2018 (Grupos A, B, C, D e E), descarte de perfurocortantes em caixas rígidas estanques e autoclavação de resíduos infectantes.
- **Informática Biomédica, Telemetria & IoT:** Redes de sensores pluviométricos e ultrassônicos em LoRaWAN, geoprocessamento em SIG/GIS para controle vetorial e redes mesh móveis para sincronização de prontuários em desastres.
- **Biotecnologia Ambiental:** Fitorremediação (fitoestabilização vs fitoextração) de metais pesados, biorremediação de hidrocarbonetos por consórcios bacterianos, biofiltros, micorrizas e digestão anaeróbia em reatores UASB.
- **Defesa Civil & Gestão de Riscos:** Sistema Alerta Rio, sinais precursores de deslizamento em encostas, cotas de alerta e transbordamento e Marco de Sendai para a Redução do Risco de Desastres.

---

## 3. RESULTADO DA AUDITORIA AUTOMATIZADA (`scripts/auditar-quiz-questions.js`)

```text
=== AUDITORIA DO BANCO DE QUESTÕES ===
Total de questões avaliadas: 122
IDs únicos: 122
IDs duplicados: 0 []
Gabaritos inválidos: 0 []
Opções duplicadas: 0 []
Explicações ausentes/curtas: 0 []
Questões com viés de tamanho excessivo na correta: 0
```

---

## 4. EVIDÊNCIAS DE EXECUÇÃO: SCREENSHOTS REAIS

Todas as capturas foram realizadas via Playwright e arquivadas em `screenshots/03-quiz/`:

1. **`01-quiz-hub-configuracao.png`**: Hub de modalidades com seleção de nível Difícil (Desafio EcoCity) e configuração de rodada.
2. **`02-pergunta-ativa-desafio.png`**: Interface da questão ativa com cálculo hidrológico avançado, 4 alternativas rigorosamente balanceadas e temporizador em execução.
3. **`03-feedback-resposta-correta.png`**: Painel pedagógico de acerto detalhando o conceito de amortecimento hidráulico e fundamentação técnica.
4. **`04-feedback-resposta-incorreta.png`**: Painel pedagógico indicando a resposta correta e desmistificando o erro do distrator.
5. **`05-resultado-boletim-desempenho.png`**: Boletim oficial de desempenho com nota (0 a 10), estatísticas de acertos/erros, tempo total e progressão de XP.
6. **`06-ranking-placar-geral.png`**: Placar geral ao vivo com pódio dos participantes, notas e tempos na feira.
7. **`07-quiz-responsivo-mobile.png`**: Demonstração de responsividade mobile impecável em resolução de smartphone vertical (390 × 844 px).

---

## 5. REGRAS DE PONTUAÇÃO E RANKING PRESERVADAS

- **Pontuação por Acerto:** +100 XP base por resposta correta.
- **Bônus de Streak:** Multiplicador progressivo a cada sequência consecutiva de acertos.
- **Bônus por Nível:** Questões difíceis conferem pontuação ponderada superior para valorizar o conhecimento aprofundado.
- **Persistência do Ranking:** Salvo automaticamente em `localStorage` e sincronizado via API RESTful serverless `/api/ranking`.
