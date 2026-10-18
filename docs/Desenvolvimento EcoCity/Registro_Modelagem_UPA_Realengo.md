# Modelagem da UPA Realengo

Aqui é o Daniel D. Mello Bonato registrando a modelagem da UPA Realengo pro EcoCity. A nossa meta foi colocar essa UPA específica lá na simulação com a maior fidelidade que a gente conseguia neste estágio.

## O Que Fizemos e Como Foi
Pra começar, eu fui direto nas fontes geográficas (usando coordenadas e os nós do OpenStreetMap: Lat -22.8744, Lon -43.4306) pra achar a localização cravada da unidade que fica ali na Rua Marechal Joaquim Inácio, sem confundir com a de Magalhães Bastos.

Como a API não me dava a malha poligonal exata 100% desenhada do loteamento, usei o padrão arquitetônico real das UPAs estaduais do Rio pra bater com as proporções do quarteirão que mapeamos. O Jean Carlos e o Isaac Alisson deram aquela força pontual confirmando alguns detalhes que ajudaram na hora de bater a lógica das ruas laterais da nossa planta.

No código (dentro do `UpaRealengo.tsx` criado hoje):
- **O que foi reproduzido fielmente:** O layout padrão e a distribuição. Fizemos o bloco principal da UPA com o visual branco/gelo e a clássica fita azul nas marquises. Tem a separação clara: a cobertura independente pra onde chegam as ambulâncias (entrada de emergência) com iluminação e a entrada de pedestres/recepção. Colocamos o cercamento (as grades da área externa) e o calçamento isolando o lote.
- **O que foi aproximado:** Como o EcoCity roda em *Low-Poly* no navegador, eu tive que simplificar as geometrias pra não "fritar" os celulares do pessoal. As grades da rua foram feitas com wireframes e blocos semitransparentes ao invés de barrinhas individuais, e o telhado teve as caixas d'água e condensadoras modeladas de forma primária (cilindros e cubos simples) só pra dar o volume real. As árvores da calçada também seguiram o estilo *low-poly* do resto da cidade.

## Integração no EcoCity
Deixei a UPA modular e independente. Ela tá instanciada no arquivo `City.tsx` com as coordenadas mapeadas perto da área de Realengo, e as ruas da simulação podem ser desenhadas ao redor sem a gente ter que recriar o hospital. Melhor ainda: liguei ela direto no sistema de simulação. Se a ocupação geral dos hospitais passa dos 90%, os ícones dela pulsam em vermelho e a iluminação muda, alertando o risco!

Tá bem bonito. Nos testes, a UPA casou direitinho na escala dos outros prédios ao redor e não afetou a performance do vídeo nem do cenário.

*Registro de: Daniel D. Mello Bonato*
