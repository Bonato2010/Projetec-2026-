# Histórico de Desenvolvimento do EcoCity

## O Projeto e as Ideias Iniciais
O EcoCity começou como uma ideia pra mostrar que uma cidade inteligente não é só um monte de tecnologia separada, mas sim um sistema gigante onde tudo tá conectado. A sustentabilidade e a saúde andam juntas com a mobilidade, energia, água e tratamento de resíduos. O objetivo aqui foi criar um gêmeo digital (um "Digital Twin") da Zona Oeste do Rio de Janeiro (pegando Realengo, Bangu e Campo Grande) pra simular como decisões afetam a qualidade de vida.

O Daniel Gibelo teve uma participação imensa em boa parte das mudanças desse protótipo, ajudando muito a dar cara ao que temos hoje. Logo no começo do projeto, dá pra ver nos registros do Git que foi criada a base da cidade ("Bangu base.blend") lá em setembro de 2026. Esse modelo 3D inicial foi o primeiro grande passo pra tirar a ideia do papel antes de irmos pro código pesado.

## Evolução e Tecnologias
O projeto rodava inicialmente com arquivos mais básicos, mas evoluiu pra uma stack moderna bem forte. Hoje usamos:
- **Next.js (React)** pra criar toda a interface e páginas do site.
- **Three.js com React Three Fiber** pra renderizar a cidade 3D direto no navegador, o que é o coração da simulação.
- **Zustand** pra guardar os dados da simulação (como os indicadores de poluição, ocupação de hospitais, energia, etc.) e garantir que se você mexe na cidade 3D, a interface reage na mesma hora.
- **Tailwind CSS e Framer Motion** pra deixar a interface bonita, com aquela pegada futurista, minimalista e meio "holográfica" inspirada na marca "Solaris" (com muito preto, verde sustentável, azul tech e dourado).

Em outubro, a gente migrou essa estrutura toda pra ficar rodando redondinho dentro da pasta `eco-city`. Pra facilitar a vida de quem vai mexer no código, configuramos a raiz do projeto pra que um simples `npm run dev` e `npm install` repassem o comando direto pra pasta certa.

## A Cidade 3D e a Inteligência Urbana
Em vez de desenhar predinhos aleatórios, a gente conectou a simulação pra puxar dados geográficos reais do OpenStreetMap (arquivos `.osm`). Tem estradas, prédios, hospitais (como o Albert Schweitzer e o Rocha Faria) e o trânsito com carrinhos andando. Se você clicar num hospital, aparece um painel com a ocupação de leitos e ambulâncias disponíveis.

A gente também criou eventos. Tipo uma "Onda de Calor". Você ativa isso no painel e a cidade toda sofre um impacto visual, e aí você precisa tomar decisões (como investir em áreas verdes) pra ver os números da saúde e da energia melhorarem.

## O Desafio do Vídeo de Introdução (`fundo.mp4`)
Uma das maiores dores de cabeça recentes foi fazer a entrada do site ficar cinematográfica pra apresentação na feira. A ideia era: a pessoa abre o site e é obrigada a assistir um vídeo de introdução sem controles, em tela cheia. Só depois de o vídeo acabar, aparece o botão "ENTRAR NO PROTÓTIPO".

**Os problemas que rolaram:**
1. Primeiro o vídeo tava sendo bloqueado pelo navegador de tocar sozinho. Resolvemos usando a tag `<video>` com `muted`, `playsInline` e forçando com CSS pra ninguém conseguir clicar com botão direito nem arrastar a tela.
2. Usamos o vídeo errado gerado por IA no início, mas depois baixamos e colocamos o arquivo `fundo.mp4` real (com quase 8MB e qualidade alta) direto no Google Drive do projeto e salvamos na pasta `public/`.
3. Depois, vimos que o vídeo dava umas "engasgadas" bem feias no meio, especialmente na primeira vez que o site abria.

A gente resolveu a engasgada com duas tacadas certeiras:
- Ao invés de usar `autoPlay` e rezar pro vídeo não travar, a gente usou um evento chamado `onCanPlayThrough`. Basicamente, o site mostra o primeiro frame do vídeo com um loading super discreto e só aperta o play quando o navegador tiver certeza que já baixou vídeo suficiente pra tocar até o fim sem pausar pra carregar a internet.
- A gente descobriu que o processador sofria muito porque tentava montar os gráficos 3D da cidade ao mesmo tempo que lia o vídeo. Então, atrasamos o carregamento da cidade 3D para acontecer **somente depois** que o vídeo acaba.

## O Que Está Funcionando Agora?
- O vídeo original entra lisinho, sem engasgos, e prende a pessoa na introdução até aparecer o botão de entrar.
- A cidade 3D carrega e roda bem, com o sistema de tráfego, asfalto iluminado e shaders de *bloom*.
- Os indicadores de saúde, energia e água estão lá, junto com os alertas de simulação.
- A gente forçou o uso da placa de vídeo (Hardware Acceleration com `translateZ(0)`) pra permitir que TVs de 120Hz e telas rápidas não fiquem presas num limite artificial de 60fps feito em JavaScript.

## O Que Falta / Próximos Passos
- Apesar da gente ter configurado tudo pra voar a 120Hz, a gente precisa testar na TV física da feira pra garantir que a placa da TV aguenta renderizar a cidade 3D inteira nesses quadros todos.
- Continuar refinando a lógica da simulação climática pra que os eventos gerem impactos mais longos e contínuos.
- No futuro, ligar os eventos virtuais com peças físicas usando um ESP32 (sensores e botões de verdade interagindo com a cidade na tela por Websockets), que era um dos planos iniciais do EcoCity.