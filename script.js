const perguntas = [
    {
        pergunta: "Como a poluição do ar pode afetar a saúde?",
        alternativas: [
            "Melhorando a respiração",
            "Causando doenças respiratórias e cardiovasculares",
            "Eliminando todas as doenças",
            "Não afeta a saúde"
        ],
        correta: 1
    },
    {
        pergunta: "Qual é a importância do saneamento básico?",
        alternativas: [
            "Aumentar a poluição dos rios",
            "Produzir mais lixo",
            "Prevenir doenças e reduzir a contaminação",
            "Diminuir a disponibilidade de água potável"
        ],
        correta: 2
    },
    {
        pergunta: "Qual destes é um possível impacto das mudanças climáticas na saúde?",
        alternativas: [
            "Ondas de calor e maior risco de algumas doenças",
            "Fim de todas as enchentes",
            "Eliminação da poluição",
            "Aumento garantido da água potável"
        ],
        correta: 0
    },
    {
        pergunta: "Como produtos químicos podem prejudicar a saúde?",
        alternativas: [
            "Sempre purificam os alimentos",
            "Podem contaminar a água, o solo e a cadeia alimentar",
            "Não entram nos ecossistemas",
            "Impedem qualquer doença"
        ],
        correta: 1
    },
    {
        pergunta: "Qual atitude contribui para a sustentabilidade?",
        alternativas: [
            "Desperdiçar água",
            "Jogar esgoto nos rios",
            "Destruir áreas verdes",
            "Utilizar fontes de energia solar e eólica"
        ],
        correta: 3
    },
    {
        pergunta: "Por que a água precisa ser preservada?",
        alternativas: [
            "Porque toda a água do planeta é potável",
            "Porque desperdício e poluição podem comprometer sua disponibilidade",
            "Porque ela não é importante para a agricultura",
            "Porque a tecnologia elimina toda a escassez"
        ],
        correta: 1
    },
    {
        pergunta: "O que é reúso da água?",
        alternativas: [
            "Tratar água já utilizada para aproveitá-la novamente em certas atividades",
            "Beber qualquer água sem tratamento",
            "Despejar esgoto nos rios",
            "Evitar todo tipo de tratamento"
        ],
        correta: 0
    },
    {
        pergunta: "Como sensores e sistemas inteligentes ajudam na gestão da água?",
        alternativas: [
            "Aumentam os vazamentos",
            "Impedem o tratamento",
            "Monitoram o consumo e podem detectar vazamentos",
            "Tornam toda água potável automaticamente"
        ],
        correta: 2
    },
    {
        pergunta: "Quais tecnologias podem ser usadas no tratamento da água para reúso?",
        alternativas: [
            "Somente computadores",
            "Filtros, membranas e sistemas de desinfecção",
            "Apenas satélites",
            "Somente energia eólica"
        ],
        correta: 1
    },
    {
        pergunta: "Qual é o objetivo do ODS 6 da ONU?",
        alternativas: [
            "Aumentar a produção industrial",
            "Construir mais estradas",
            "Eliminar todas as áreas verdes",
            "Garantir água e saneamento sustentáveis para todos"
        ],
        correta: 3
    },
    {
        pergunta: "Qual é uma consequência do descarte incorreto de lixo eletrônico?",
        alternativas: [
            "Aumento da fertilidade de todos os solos",
            "Liberação de substâncias que podem contaminar o ambiente",
            "Purificação automática dos rios",
            "Redução de todos os resíduos"
        ],
        correta: 1
    },
    {
        pergunta: "Como os satélites ajudam a proteger o meio ambiente?",
        alternativas: [
            "Monitorando desmatamentos e mudanças na vegetação",
            "Impedindo qualquer desastre natural",
            "Substituindo todas as árvores",
            "Eliminando a poluição sozinhos"
        ],
        correta: 0
    },
    {
        pergunta: "Qual tecnologia pode ajudar a economizar energia em edifícios?",
        alternativas: [
            "Lâmpadas sempre ligadas",
            "Janelas permanentemente fechadas",
            "Sensores de presença e iluminação eficiente",
            "Equipamentos ligados sem necessidade"
        ],
        correta: 2
    },
    {
        pergunta: "O que é energia renovável?",
        alternativas: [
            "Energia produzida somente pelo carvão",
            "Energia obtida de fontes que se renovam naturalmente",
            "Energia que nunca causa impacto ambiental",
            "Energia produzida apenas por combustíveis fósseis"
        ],
        correta: 1
    },
    {
        pergunta: "Como o desmatamento pode afetar a saúde humana?",
        alternativas: [
            "Eliminando todos os riscos de doenças",
            "Garantindo ar mais limpo em qualquer situação",
            "Impedindo a erosão",
            "Alterando ecossistemas e aumentando alguns riscos ambientais"
        ],
        correta: 3
    },
    {
        pergunta: "Qual é uma função das estações de tratamento de esgoto?",
        alternativas: [
            "Reduzir contaminantes antes do lançamento ou reúso da água",
            "Adicionar lixo aos rios",
            "Tornar desnecessária a preservação dos mananciais",
            "Aumentar a contaminação da água"
        ],
        correta: 0
    },
    {
        pergunta: "Como a inteligência artificial pode contribuir para a sustentabilidade?",
        alternativas: [
            "Eliminando a necessidade de fiscalização",
            "Garantindo que não exista poluição",
            "Analisando dados para identificar desperdícios e padrões ambientais",
            "Substituindo todos os recursos naturais"
        ],
        correta: 2
    },
    {
        pergunta: "O que pode acontecer quando resíduos plásticos chegam aos oceanos?",
        alternativas: [
            "Toda a vida marinha aumenta",
            "Animais podem ingerir plástico ou ficar presos nele",
            "A água se torna potável",
            "A poluição desaparece"
        ],
        correta: 1
    },
    {
        pergunta: "Qual atitude reduz o desperdício de água em casa?",
        alternativas: [
            "Lavar calçadas diariamente com mangueira",
            "Deixar torneiras abertas",
            "Ignorar vazamentos",
            "Consertar vazamentos e fechar a torneira quando possível"
        ],
        correta: 3
    },
    {
        pergunta: "O que significa coleta seletiva?",
        alternativas: [
            "Separar resíduos conforme seu tipo para facilitar a destinação",
            "Misturar todo o lixo",
            "Jogar resíduos em terrenos baldios",
            "Queimar todos os materiais recicláveis"
        ],
        correta: 0
    },
    {
        pergunta: "Qual é uma possível vantagem da agricultura de precisão?",
        alternativas: [
            "Usar sempre mais água",
            "Dispensar qualquer análise do solo",
            "Aplicar água e insumos de maneira mais adequada às necessidades da plantação",
            "Eliminar todos os impactos agrícolas"
        ],
        correta: 2
    },
    {
        pergunta: "Por que áreas verdes são importantes nas cidades?",
        alternativas: [
            "Porque aumentam obrigatoriamente a temperatura",
            "Porque podem oferecer sombra e ajudar a reduzir o calor urbano",
            "Porque impedem toda chuva",
            "Porque substituem o saneamento básico"
        ],
        correta: 1
    },
    {
        pergunta: "Qual é a função de um filtro de água?",
        alternativas: [
            "Eliminar necessariamente todos os microrganismos em qualquer condição",
            "Adicionar contaminantes",
            "Transformar água salgada em doce em todos os casos",
            "Reter determinados materiais, conforme o tipo de filtro"
        ],
        correta: 3
    },
    {
        pergunta: "Como a poluição sonora pode afetar as pessoas?",
        alternativas: [
            "Pode causar estresse e prejudicar o sono",
            "Melhora sempre a concentração",
            "Elimina problemas auditivos",
            "Não produz nenhum efeito"
        ],
        correta: 0
    },
    {
        pergunta: "Qual alternativa apresenta um exemplo de economia circular?",
        alternativas: [
            "Descartar produtos assim que apresentam um defeito simples",
            "Aumentar o desperdício de materiais",
            "Reparar, reutilizar e reciclar produtos e materiais",
            "Misturar resíduos perigosos aos comuns"
        ],
        correta: 2
    },
    {
        pergunta: "O que os sensores de qualidade do ar podem medir?",
        alternativas: [
            "A quantidade exata de todas as doenças",
            "A concentração de determinados poluentes no ar",
            "A idade de todas as pessoas",
            "A quantidade de água potável do planeta inteiro"
        ],
        correta: 1
    },
    {
        pergunta: "Por que o tratamento da água é importante?",
        alternativas: [
            "Porque torna qualquer fonte de água segura sem análise",
            "Porque elimina a necessidade de saneamento",
            "Porque permite desperdiçar mais água",
            "Porque ajuda a remover contaminantes e reduzir riscos à saúde"
        ],
        correta: 3
    },
    {
        pergunta: "Qual é uma fonte de energia que utiliza o movimento do vento?",
        alternativas: [
            "Energia eólica",
            "Energia nuclear",
            "Energia geotérmica",
            "Energia obtida do carvão"
        ],
        correta: 0
    },
    {
        pergunta: "Como aplicativos podem ajudar a reduzir o desperdício de alimentos?",
        alternativas: [
            "Incentivando o descarte de alimentos próprios para consumo",
            "Aumentando o tempo de transporte sem necessidade",
            "Conectando doadores a instituições que podem receber alimentos",
            "Impedindo a doação de alimentos"
        ],
        correta: 2
    },
    {
        pergunta: "Qual é um risco da queima de lixo a céu aberto?",
        alternativas: [
            "Purificação garantida do ar",
            "Liberação de fumaça e substâncias prejudiciais",
            "Desaparecimento de todos os poluentes",
            "Produção de água potável"
        ],
        correta: 1
    },
    {
        pergunta: "Como a tecnologia pode ajudar a prevenir enchentes?",
        alternativas: [
            "Bloqueando todos os cursos de água",
            "Aumentando o lixo nas ruas",
            "Eliminando a necessidade de drenagem",
            "Usando sensores e previsões para monitorar chuvas e níveis de rios"
        ],
        correta: 3
    },
    {
        pergunta: "Qual atitude ajuda a preservar a biodiversidade?",
        alternativas: [
            "Proteger habitats naturais e espécies",
            "Destruir áreas de reprodução dos animais",
            "Introduzir espécies invasoras sem avaliação",
            "Poluir ambientes naturais"
        ],
        correta: 0
    },
    {
        pergunta: "O que é compostagem?",
        alternativas: [
            "Transformação de plástico em metal",
            "Queima de resíduos eletrônicos",
            "Decomposição controlada de resíduos orgânicos para produzir composto",
            "Descarte de pilhas no solo"
        ],
        correta: 2
    },
    {
        pergunta: "Qual é uma vantagem possível dos veículos elétricos?",
        alternativas: [
            "Não precisam de energia para funcionar",
            "Não emitem gases pelo escapamento durante a condução",
            "Nunca causam impactos ambientais",
            "Eliminam automaticamente o trânsito"
        ],
        correta: 1
    },
    {
        pergunta: "Por que pilhas e baterias exigem descarte adequado?",
        alternativas: [
            "Porque podem ser jogadas em qualquer rio",
            "Porque se transformam sempre em adubo",
            "Porque não contêm materiais que mereçam atenção",
            "Porque alguns componentes podem contaminar o ambiente"
        ],
        correta: 3
    },
    {
        pergunta: "Como a iluminação pública inteligente pode economizar energia?",
        alternativas: [
            "Ajustando a iluminação conforme a necessidade e as condições",
            "Mantendo todas as lâmpadas no máximo durante o dia",
            "Impedindo o uso de lâmpadas eficientes",
            "Aumentando o consumo sem controle"
        ],
        correta: 0
    },
    {
        pergunta: "Qual é um efeito possível da falta de saneamento básico?",
        alternativas: [
            "Eliminação de microrganismos nocivos",
            "Redução garantida de doenças infecciosas",
            "Maior exposição a agentes causadores de doenças",
            "Purificação de rios contaminados"
        ],
        correta: 2
    },
    {
        pergunta: "O que a reciclagem pode ajudar a reduzir?",
        alternativas: [
            "A necessidade de separar resíduos",
            "O envio de materiais recicláveis para aterros e a extração de algumas matérias-primas",
            "A importância do consumo consciente",
            "A necessidade de destinação correta"
        ],
        correta: 1
    },
    {
        pergunta: "Como drones podem ser utilizados em pesquisas ambientais?",
        alternativas: [
            "Substituindo todas as equipes de pesquisa",
            "Impedindo a ocorrência de secas",
            "Eliminando toda a poluição do ar",
            "Registrando imagens de áreas de difícil acesso"
        ],
        correta: 3
    },
    {
        pergunta: "Qual prática ajuda a proteger os rios?",
        alternativas: [
            "Evitar despejar esgoto e resíduos sem tratamento",
            "Jogar óleo de cozinha no ralo",
            "Descartar produtos químicos na água",
            "Retirar toda a vegetação das margens"
        ],
        correta: 0
    },
    {
        pergunta: "O que é pegada de carbono?",
        alternativas: [
            "A quantidade de água em um rio",
            "A medida do tamanho de uma floresta",
            "A estimativa das emissões de gases de efeito estufa associadas a uma atividade ou produto",
            "A quantidade de lixo reciclado por uma cidade"
        ],
        correta: 2
    },
    {
        pergunta: "Como o uso de energia solar pode contribuir para a sustentabilidade?",
        alternativas: [
            "Aumentando necessariamente o uso de carvão",
            "Gerando eletricidade a partir da luz do Sol",
            "Produzindo energia sem qualquer equipamento",
            "Eliminando todos os impactos da geração elétrica"
        ],
        correta: 1
    },
    {
        pergunta: "Qual é a importância de monitorar a qualidade da água?",
        alternativas: [
            "Para dispensar o tratamento em todas as situações",
            "Para incentivar o despejo de resíduos",
            "Para tornar desnecessária a proteção dos rios",
            "Para identificar possíveis contaminantes e avaliar sua segurança"
        ],
        correta: 3
    },
    {
        pergunta: "O que pode ajudar a diminuir o consumo de papel?",
        alternativas: [
            "Utilizar documentos digitais quando apropriado",
            "Imprimir todos os arquivos várias vezes",
            "Descartar folhas ainda utilizáveis",
            "Evitar o reaproveitamento"
        ],
        correta: 0
    },
    {
        pergunta: "Como as mudanças climáticas podem afetar a disponibilidade de água?",
        alternativas: [
            "Garantindo chuva regular em todas as regiões",
            "Eliminando secas permanentemente",
            "Alterando padrões de chuva e aumentando o risco de secas em algumas regiões",
            "Tornando toda água doce imediatamente potável"
        ],
        correta: 2
    },
    {
        pergunta: "Qual é uma função das abelhas em muitos ecossistemas?",
        alternativas: [
            "Produzir combustíveis fósseis",
            "Realizar a polinização de diversas plantas",
            "Impedir o crescimento de todas as flores",
            "Eliminar a necessidade de biodiversidade"
        ],
        correta: 1
    },
    {
        pergunta: "O que é uma cidade inteligente?",
        alternativas: [
            "Uma cidade sem moradores",
            "Uma cidade que não precisa de planejamento",
            "Uma cidade que utiliza somente energia de combustíveis fósseis",
            "Uma cidade que utiliza dados e tecnologias para melhorar serviços e qualidade de vida"
        ],
        correta: 3
    },
    {
        pergunta: "Por que o óleo de cozinha não deve ser despejado no ralo?",
        alternativas: [
            "Porque pode obstruir tubulações e prejudicar o tratamento do esgoto",
            "Porque transforma esgoto em água potável",
            "Porque limpa os rios automaticamente",
            "Porque é sempre biodegradável em poucos minutos"
        ],
        correta: 0
    },
    {
        pergunta: "Como a telemedicina pode contribuir para a saúde?",
        alternativas: [
            "Substituindo todo atendimento presencial em qualquer situação",
            "Garantindo diagnóstico perfeito em todos os casos",
            "Facilitando consultas e orientações a distância quando apropriado",
            "Eliminando a necessidade de profissionais de saúde"
        ],
        correta: 2
    },
    {
        pergunta: "Qual é um benefício de preservar nascentes?",
        alternativas: [
            "Aumentar o despejo de esgoto",
            "Contribuir para a proteção das fontes de água",
            "Eliminar a vegetação ao redor",
            "Aumentar a erosão do solo"
        ],
        correta: 1
    },
    {
        pergunta: "O que caracteriza a obsolescência planejada?",
        alternativas: [
            "A recuperação de áreas degradadas",
            "A proteção de fontes de água",
            "A criação de produtos sempre reparáveis",
            "O planejamento da vida útil limitada de produtos em determinadas estratégias comerciais"
        ],
        correta: 3
    },
    {
        pergunta: "Como o transporte público pode contribuir para o meio ambiente?",
        alternativas: [
            "Pode transportar muitas pessoas usando menos veículos individuais",
            "Sempre aumenta o número de carros nas ruas",
            "Elimina a necessidade de planejamento urbano",
            "Não pode reduzir emissões em nenhuma situação"
        ],
        correta: 0
    },
    {
        pergunta: "Qual tecnologia pode ajudar a detectar vazamentos em tubulações?",
        alternativas: [
            "Impressoras domésticas",
            "Reprodutores de música",
            "Sensores de pressão e sistemas de monitoramento",
            "Câmeras sem qualquer sistema de análise, em todos os casos"
        ],
        correta: 2
    },
    {
        pergunta: "O que é biodiversidade?",
        alternativas: [
            "Apenas a quantidade de árvores de uma região",
            "A variedade de seres vivos, genes e ecossistemas",
            "Somente os animais domésticos",
            "A quantidade de prédios de uma cidade"
        ],
        correta: 1
    },
    {
        pergunta: "Qual atitude ajuda a economizar eletricidade?",
        alternativas: [
            "Deixar aparelhos ligados sem necessidade",
            "Utilizar equipamentos com defeitos elétricos",
            "Manter todas as luzes acesas durante o dia",
            "Desligar equipamentos quando não estão sendo usados"
        ],
        correta: 3
    },
    {
        pergunta: "Qual é uma finalidade dos aterros sanitários adequados?",
        alternativas: [
            "Destinar rejeitos com medidas de controle ambiental",
            "Despejar lixo diretamente em nascentes",
            "Misturar resíduos perigosos sem controle",
            "Substituir toda a reciclagem"
        ],
        correta: 0
    },
    {
        pergunta: "Como a análise de dados pode ajudar na agricultura?",
        alternativas: [
            "Eliminando a necessidade de observar as plantações",
            "Garantindo colheitas perfeitas em qualquer clima",
            "Identificando necessidades de irrigação e condições da lavoura",
            "Impedindo todas as pragas sem nenhuma medida"
        ],
        correta: 2
    },
    {
        pergunta: "Por que a água parada pode representar um problema de saúde pública?",
        alternativas: [
            "Porque elimina todos os insetos",
            "Porque pode favorecer a reprodução de mosquitos transmissores de doenças",
            "Porque torna qualquer água potável",
            "Porque impede a proliferação de microrganismos em todos os casos"
        ],
        correta: 1
    },
    {
        pergunta: "Qual é uma medida para reduzir o consumo de plástico descartável?",
        alternativas: [
            "Usar mais sacolas descartáveis",
            "Descartar garrafas em rios",
            "Queimar embalagens em casa",
            "Utilizar itens reutilizáveis quando forem adequados"
        ],
        correta: 3
    },
    {
        pergunta: "O que a energia geotérmica aproveita?",
        alternativas: [
            "O calor interno da Terra",
            "Apenas a luz das estrelas",
            "A força dos automóveis",
            "O movimento de plásticos nos rios"
        ],
        correta: 0
    },
    {
        pergunta: "Qual é um possível benefício de telhados verdes?",
        alternativas: [
            "Aumentar obrigatoriamente a poluição",
            "Eliminar toda a necessidade de drenagem",
            "Ajudar no isolamento térmico e na retenção de parte da água da chuva",
            "Impedir o crescimento de plantas"
        ],
        correta: 2
    },
    {
        pergunta: "Por que a vacinação é importante para a saúde coletiva?",
        alternativas: [
            "Porque substitui todos os cuidados de higiene",
            "Porque ajuda a prevenir doenças e pode reduzir sua transmissão",
            "Porque impede todas as doenças existentes",
            "Porque torna desnecessária a vigilância em saúde"
        ],
        correta: 1
    },
    {
        pergunta: "Como o reflorestamento pode beneficiar o ambiente?",
        alternativas: [
            "Eliminando todos os ecossistemas naturais",
            "Aumentando a erosão em qualquer situação",
            "Impedindo a absorção de água pelo solo",
            "Recuperando vegetação e habitats quando feito adequadamente"
        ],
        correta: 3
    },
    {
        pergunta: "Qual é uma função dos sistemas de alerta de desastres?",
        alternativas: [
            "Avisar a população sobre riscos para permitir medidas preventivas",
            "Garantir que nenhum desastre aconteça",
            "Substituir todas as equipes de emergência",
            "Impedir a ocorrência de chuvas fortes"
        ],
        correta: 0
    },
    {
        pergunta: "O que significa consumo consciente?",
        alternativas: [
            "Comprar tudo o que aparece em anúncios",
            "Escolher produtos apenas pela embalagem",
            "Avaliar necessidades, durabilidade e impactos das escolhas",
            "Descartar produtos novos sem utilizá-los"
        ],
        correta: 2
    },
    {
        pergunta: "Como o esgoto sem tratamento pode afetar os rios?",
        alternativas: [
            "Tornando-os sempre mais limpos",
            "Levando microrganismos e nutrientes em excesso para a água",
            "Eliminando todos os riscos sanitários",
            "Transformando água contaminada em água potável"
        ],
        correta: 1
    },
    {
        pergunta: "Qual é uma vantagem possível da energia eólica?",
        alternativas: [
            "Depender exclusivamente do carvão",
            "Produzir energia sem turbinas ou equipamentos",
            "Garantir eletricidade constante sem considerar o vento",
            "Gerar eletricidade sem queimar combustíveis durante a operação"
        ],
        correta: 3
    },
    {
        pergunta: "Por que é importante proteger os manguezais?",
        alternativas: [
            "Porque oferecem habitats e ajudam a proteger áreas costeiras",
            "Porque não possuem seres vivos",
            "Porque devem receber todo o lixo urbano",
            "Porque impedem a existência de peixes"
        ],
        correta: 0
    },
    {
        pergunta: "Como a impressão 3D pode contribuir para reduzir desperdícios em alguns processos?",
        alternativas: [
            "Produzindo sempre objetos sem utilizar materiais",
            "Eliminando a necessidade de planejamento",
            "Fabricando peças sob demanda, com potencial de reduzir sobras em certos casos",
            "Garantindo que todo material usado seja reciclável"
        ],
        correta: 2
    },
    {
        pergunta: "Qual é um exemplo de tecnologia assistiva na área da saúde?",
        alternativas: [
            "Um sistema que aumenta a poluição dos rios",
            "Um leitor de tela que auxilia pessoas com deficiência visual",
            "Um equipamento que impede a acessibilidade",
            "Um aplicativo que bloqueia toda comunicação"
        ],
        correta: 1
    },
    {
        pergunta: "Qual é a principal finalidade do ODS 3 da ONU?",
        alternativas: [
            "Aumentar o desperdício de água",
            "Eliminar a pesquisa científica",
            "Expandir somente a produção industrial",
            "Promover saúde e bem-estar para todos"
        ],
        correta: 3
    },
    {
        pergunta: "O que pode ajudar a reduzir ilhas de calor nas cidades?",
        alternativas: [
            "Ampliar áreas verdes e utilizar superfícies adequadas",
            "Retirar todas as árvores",
            "Cobrir todas as áreas com materiais que absorvem muito calor",
            "Bloquear a circulação de ar"
        ],
        correta: 0
    },
    {
        pergunta: "Como a tecnologia pode ajudar a acompanhar espécies ameaçadas?",
        alternativas: [
            "Eliminando seus habitats",
            "Impedindo qualquer mudança ambiental",
            "Utilizando câmeras, sensores e análise de dados para monitoramento",
            "Substituindo a conservação dos habitats"
        ],
        correta: 2
    },
    {
        pergunta: "Qual é uma consequência possível do excesso de fertilizantes nos rios?",
        alternativas: [
            "Purificação completa da água",
            "Proliferação excessiva de algas e redução do oxigênio na água",
            "Eliminação de todos os microrganismos",
            "Desaparecimento garantido de todas as plantas aquáticas"
        ],
        correta: 1
    },
    {
        pergunta: "O que é eficiência energética?",
        alternativas: [
            "Utilizar mais energia para realizar a mesma tarefa",
            "Deixar aparelhos funcionando sem necessidade",
            "Evitar qualquer tecnologia",
            "Realizar uma tarefa usando menos energia, mantendo o resultado desejado"
        ],
        correta: 3
    },
    {
        pergunta: "Qual prática pode reduzir a contaminação do solo?",
        alternativas: [
            "Destinar corretamente resíduos e produtos químicos",
            "Enterrar pilhas em qualquer terreno",
            "Despejar óleo no chão",
            "Jogar lixo em áreas de preservação"
        ],
        correta: 0
    },
    {
        pergunta: "Como a previsão meteorológica pode ajudar a agricultura?",
        alternativas: [
            "Garantindo que nunca ocorram perdas",
            "Substituindo todas as práticas agrícolas",
            "Ajudando a planejar plantio, irrigação e colheita",
            "Impedindo todas as mudanças no clima"
        ],
        correta: 2
    },
    {
        pergunta: "Qual é um risco do uso excessivo de agrotóxicos?",
        alternativas: [
            "Garantia de água limpa",
            "Contaminação ambiental e exposição prejudicial de organismos",
            "Eliminação de todos os problemas agrícolas",
            "Aumento obrigatório da biodiversidade"
        ],
        correta: 1
    },
    {
        pergunta: "Por que a manutenção dos equipamentos é importante?",
        alternativas: [
            "Porque sempre aumenta o consumo de energia",
            "Porque elimina a necessidade de segurança",
            "Porque impede qualquer falha futura",
            "Porque pode melhorar o funcionamento e evitar desperdícios"
        ],
        correta: 3
    },
    {
        pergunta: "Qual é uma finalidade do saneamento básico?",
        alternativas: [
            "Proteger a saúde e contribuir para a preservação ambiental",
            "Aumentar o lançamento de esgoto nos rios",
            "Reduzir o acesso à água tratada",
            "Estimular o descarte irregular de resíduos"
        ],
        correta: 0
    },
    {
        pergunta: "Como a tecnologia pode apoiar a reciclagem?",
        alternativas: [
            "Misturando todos os resíduos sem identificação",
            "Impedindo a separação dos materiais",
            "Utilizando equipamentos para identificar e separar materiais recicláveis",
            "Tornando todos os resíduos perigosos"
        ],
        correta: 2
    },
    {
        pergunta: "O que pode ser feito com água da chuva coletada de forma adequada?",
        alternativas: [
            "Bebê-la sem tratamento em qualquer situação",
            "Utilizá-la em atividades compatíveis, como irrigação, conforme as condições sanitárias",
            "Misturá-la diretamente a qualquer sistema de água potável",
            "Descartá-la obrigatoriamente"
        ],
        correta: 1
    },
    {
        pergunta: "Qual é um efeito da destruição de habitats?",
        alternativas: [
            "Aumento garantido de todas as espécies",
            "Eliminação de todos os riscos ambientais",
            "Melhora obrigatória da qualidade do ar",
            "Redução das condições de sobrevivência de espécies que dependem desses locais"
        ],
        correta: 3
    },
    {
        pergunta: "Como uma rede elétrica inteligente pode ajudar na sustentabilidade?",
        alternativas: [
            "Monitorando a distribuição de energia e ajudando a equilibrar a demanda",
            "Impedindo o uso de fontes renováveis",
            "Garantindo energia infinita",
            "Aumentando o desperdício como objetivo principal"
        ],
        correta: 0
    },
    {
        pergunta: "Qual é a relação entre qualidade do ar e saúde?",
        alternativas: [
            "A poluição do ar afeta somente as plantas",
            "O ar poluído não chega ao sistema respiratório",
            "A exposição a poluentes pode agravar problemas respiratórios e cardiovasculares",
            "A qualidade do ar não tem relação com a saúde"
        ],
        correta: 2
    },
    {
        pergunta: "O que é desenvolvimento sustentável?",
        alternativas: [
            "Utilizar todos os recursos naturais o mais rápido possível",
            "Atender às necessidades atuais sem comprometer as possibilidades das futuras gerações",
            "Impedir toda atividade econômica",
            "Priorizar somente o consumo imediato"
        ],
        correta: 1
    },
    {
        pergunta: "Como sensores podem ajudar na irrigação?",
        alternativas: [
            "Mantendo o solo sempre encharcado",
            "Substituindo todas as plantas",
            "Eliminando a necessidade de observar as condições da lavoura",
            "Medindo a umidade do solo para orientar a quantidade de água"
        ],
        correta: 3
    },
    {
        pergunta: "Por que a proteção dos mananciais é importante?",
        alternativas: [
            "Porque ajuda a preservar fontes de abastecimento de água",
            "Porque aumenta o lançamento de resíduos",
            "Porque elimina a necessidade de tratamento",
            "Porque permite destruir as margens dos rios"
        ],
        correta: 0
    },
    {
        pergunta: "Qual é um benefício da mobilidade ativa, como caminhar e pedalar?",
        alternativas: [
            "Aumentar sempre a poluição do ar",
            "Eliminar a necessidade de vias seguras",
            "Pode reduzir deslocamentos motorizados e favorecer a atividade física",
            "Garantir que não ocorram acidentes"
        ],
        correta: 2
    },
    {
        pergunta: "O que significa monitoramento ambiental?",
        alternativas: [
            "Destruir áreas naturais para observá-las",
            "Coletar dados ao longo do tempo sobre as condições do ambiente",
            "Evitar qualquer medição",
            "Substituir todas as leis ambientais"
        ],
        correta: 1
    },
    {
        pergunta: "Qual é uma forma correta de lidar com medicamentos vencidos?",
        alternativas: [
            "Jogá-los em rios",
            "Despejá-los no vaso sanitário sem orientação",
            "Misturá-los com alimentos",
            "Entregá-los a pontos de coleta apropriados, quando disponíveis"
        ],
        correta: 3
    },
    {
        pergunta: "Por que a educação ambiental é importante?",
        alternativas: [
            "Porque ajuda as pessoas a compreender problemas ambientais e agir de forma responsável",
            "Porque substitui todas as políticas públicas",
            "Porque elimina automaticamente a poluição",
            "Porque impede a realização de pesquisas"
        ],
        correta: 0
    },
    {
        pergunta: "Como a tecnologia de dessalinização funciona?",
        alternativas: [
            "Adicionando mais sal à água",
            "Transformando água em combustível",
            "Removendo sais da água salgada por processos específicos",
            "Tornando desnecessário o controle de resíduos"
        ],
        correta: 2
    },
    {
        pergunta: "Qual é um possível impacto do descarte irregular de resíduos em bueiros?",
        alternativas: [
            "Melhoria garantida da drenagem",
            "Obstrução da drenagem e aumento do risco de alagamentos",
            "Purificação da água da chuva",
            "Redução de todos os resíduos urbanos"
        ],
        correta: 1
    },
    {
        pergunta: "O que caracteriza a energia hidrelétrica?",
        alternativas: [
            "Utilização exclusiva da luz solar",
            "Queima obrigatória de carvão",
            "Uso direto do calor interno da Terra",
            "Geração de eletricidade a partir da energia do movimento ou da queda da água"
        ],
        correta: 3
    },
    {
        pergunta: "Como a pesquisa científica contribui para a saúde ambiental?",
        alternativas: [
            "Produzindo evidências para compreender riscos e avaliar soluções",
            "Impedindo a coleta de dados",
            "Eliminando a necessidade de testes",
            "Garantindo que toda tecnologia seja isenta de impactos"
        ],
        correta: 0
    },
    {
        pergunta: "Qual é uma vantagem possível de reparar um aparelho em vez de descartá-lo?",
        alternativas: [
            "Aumentar necessariamente o lixo eletrônico",
            "Tornar o aparelho impossível de usar",
            "Prolongar sua vida útil e reduzir a geração de resíduos",
            "Eliminar toda a necessidade de manutenção"
        ],
        correta: 2
    },
    {
        pergunta: "Por que é importante avaliar os impactos ambientais de uma tecnologia?",
        alternativas: [
            "Porque toda tecnologia é sempre prejudicial",
            "Porque permite identificar benefícios, riscos e formas de reduzir danos",
            "Porque impede qualquer inovação",
            "Porque torna desnecessário o uso responsável"
        ],
        correta: 1
    },
    {
        pergunta: "Qual é o objetivo principal do ODS 6?",
        alternativas: [
            "Promover exclusivamente o transporte individual",
            "Aumentar o uso de combustíveis fósseis",
            "Reduzir o acesso ao saneamento",
            "Garantir disponibilidade e gestão sustentável da água e do saneamento"
        ],
        correta: 3
    },
    {
        pergunta: "Qual combinação representa melhor a relação entre tecnologia e sustentabilidade?",
        alternativas: [
            "Usar inovação para resolver problemas, avaliando seus impactos ambientais e sociais",
            "Adotar qualquer tecnologia sem avaliar consequências",
            "Aumentar o desperdício para acelerar a produção",
            "Ignorar os dados sobre poluição"
        ],
        correta: 0
    }

];

let atual = 0;
let pontos = 0;
let respondeu = false;

// Mistura a ordem das perguntas e das alternativas a cada partida.
function embaralharPerguntas() {
    // Algoritmo Fisher-Yates para embaralhar as perguntas.
    for (let i = perguntas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [perguntas[i], perguntas[j]] = [perguntas[j], perguntas[i]];
    }

    // Embaralha as alternativas sem perder a resposta correta.
    perguntas.forEach((q) => {
        const respostaCorreta = q.alternativas[q.correta];
        for (let i = q.alternativas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [q.alternativas[i], q.alternativas[j]] = [q.alternativas[j], q.alternativas[i]];
        }
        q.correta = q.alternativas.indexOf(respostaCorreta);
    });
}

embaralharPerguntas();

const perguntaEl = document.getElementById("pergunta");
const alternativasEl = document.getElementById("alternativas");
const mensagemEl = document.getElementById("mensagem");
const progressoEl = document.getElementById("progresso");
const pontuacaoEl = document.getElementById("pontuacao");
const proximoBtn = document.getElementById("proximo");
const reiniciarBtn = document.getElementById("reiniciar");

function mostrarPergunta() {
    respondeu = false;
    const q = perguntas[atual];

    progressoEl.textContent = `Pergunta ${atual + 1} de ${perguntas.length}`;
    perguntaEl.textContent = q.pergunta;
    alternativasEl.replaceChildren();
    mensagemEl.textContent = "";
    mensagemEl.style.color = "";
    proximoBtn.hidden = true;
    reiniciarBtn.hidden = true;
    proximoBtn.textContent = atual === perguntas.length - 1
        ? "Ver resultado"
        : "Próxima pergunta";

    q.alternativas.forEach((texto, indice) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.textContent = texto;
        botao.addEventListener("click", () => verificarResposta(indice, botao));
        alternativasEl.appendChild(botao);
    });

    pontuacaoEl.textContent = `Pontos: ${pontos}`;
}

function verificarResposta(indice, botaoClicado) {
    if (respondeu) return;
    respondeu = true;

    const q = perguntas[atual];
    const botoes = alternativasEl.querySelectorAll("button");

    if (indice === q.correta) {
        botaoClicado.style.backgroundColor = "#237a3b";
        botaoClicado.style.borderColor = "#5be477";
        mensagemEl.textContent = "Correto! Muito bem!";
        mensagemEl.style.color = "#70ed8c";
        pontos++;
    } else {
        botaoClicado.style.backgroundColor = "#8e2525";
        botaoClicado.style.borderColor = "#ff6b6b";
        botoes[q.correta].style.backgroundColor = "#237a3b";
        botoes[q.correta].style.borderColor = "#5be477";
        mensagemEl.textContent = "Não foi dessa vez! A alternativa verde é a correta.";
        mensagemEl.style.color = "#ff8585";
    }

    botoes.forEach(botao => botao.disabled = true);
    pontuacaoEl.textContent = `Pontos: ${pontos}`;
    proximoBtn.hidden = false;
}

function mostrarResultado() {
    progressoEl.textContent = "Quiz finalizado!";
    perguntaEl.textContent = `Você acertou ${pontos} de ${perguntas.length}!`;
    alternativasEl.replaceChildren();
    proximoBtn.hidden = true;
    reiniciarBtn.hidden = false;

    const porcentagem = Math.round((pontos / perguntas.length) * 100);
    pontuacaoEl.textContent = `Aproveitamento: ${porcentagem}%`;

    if (pontos === perguntas.length) {
        mensagemEl.textContent = "Parabéns! Você gabaritou!";
        mensagemEl.style.color = "#70ed8c";
    } else if (pontos >= 7) {
        mensagemEl.textContent = "Muito bem! Você conhece o assunto.";
        mensagemEl.style.color = "#70ed8c";
    } else if (pontos >= 5) {
        mensagemEl.textContent = "Bom esforço! Revise alguns conteúdos e tente novamente.";
        mensagemEl.style.color = "#f5ce69";
    } else {
        mensagemEl.textContent = "Continue estudando. Você pode tentar novamente!";
        mensagemEl.style.color = "#f5ce69";
    }
}

proximoBtn.addEventListener("click", () => {
    if (atual < perguntas.length - 1) {
        atual++;
        mostrarPergunta();
    } else {
        mostrarResultado();
    }
});

reiniciarBtn.addEventListener("click", () => {
    atual = 0;
    pontos = 0;
    embaralharPerguntas();
    mostrarPergunta();
});

mostrarPergunta();
