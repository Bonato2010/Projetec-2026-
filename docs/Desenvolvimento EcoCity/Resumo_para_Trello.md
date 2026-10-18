# Atualização: Introdução do EcoCity e Otimização de Performance

**O que foi resolvido:**
- **Vídeo Autêntico Implementado:** O site agora abre estritamente com o arquivo `fundo.mp4` original (8MB, hospedado no nosso repositório). Removemos de vez placeholders gerados por IA.
- **Engasgo da 1ª Execução Corrigido:** Descobrimos que o engasgo no meio do vídeo sem cache acontecia porque (1) o vídeo começava sem *buffer* de rede suficiente e (2) a CPU estava sendo roubada nos bastidores pela renderização pesada da cidade 3D. Resolvemos isso! Agora a cidade 3D só começa a compilar os dados *depois* que o vídeo acaba, e adicionamos uma trava (`onCanPlayThrough`) pro vídeo só tocar quando a internet tiver baixado o suficiente.
- **Bloqueio Total:** Quem abre o site fica literalmente "preso" num modo cinema (tela cheia, sem barra de rolagem, cliques e mouse desativados). O botão "ENTRAR NO PROTÓTIPO" só aparece no último milissegundo do vídeo.
- **Aceleração 120Hz:** Injetamos propriedades de aceleração por hardware (GPU Compositing). Retiramos os limites de FPS impostos pelo navegador em transições pra que TVs modernas da feira consigam puxar o máximo de fluidez possível.

**Estado Atual:**
O código principal está estável, roda o gêmeo digital perfeitamente localmente apenas digitando `npm run dev` na raiz do projeto (pois criamos um *wrapper* sem bagunçar a pasta `eco-city/`).

**Próximos Passos (Testes Locais que Faltam):**
1. Testar o site ao vivo ligado na TV de 120Hz no pavilhão da feira pra atestar as métricas reais de FPS.
2. Anexar o link desta pasta do Google Drive (`Projectec-2026/Tecnologia/Desenvolvimento EcoCity`) na descrição oficial do Trello, onde estão salvos o Histórico Completo e os Registros de Validação.