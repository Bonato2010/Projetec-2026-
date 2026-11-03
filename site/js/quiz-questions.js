/**
 * BANCO DE QUESTÕES OFICIAL — PLATAFORMA EDUCATIVA V.I.D.A. / PROJETEC 2026
 * Fontes de Referência: ONU (ODS), OMS, PNUMA, MMA, IBGE, ANVISA (RDC 222/18), PNRS (Lei 12.305/10)
 * 
 * Estrutura:
 * - Sustentabilidade: Fácil (25), Médio (25), Difícil (25) = 75 questões
 * - Professor / Profissional (Enfermagem, Informática, Administração, Conhecimentos Gerais, Interdisciplinar):
 *   Fácil (25), Médio (30), Difícil (30) = 85 questões
 * Total: 160 questões exclusivas e contextualizadas com feedback pedagógico detalhado.
 */

window.QUIZ_DATABASE = {
  // ==========================================================================
  // MODALIDADE 1: QUIZ DE SUSTENTABILIDADE
  // ==========================================================================
  sustentabilidade: {
    facil: [
      {
        id: "s_f_01",
        area: "Recursos Hídricos",
        pergunta: "Por que o fechamento da torneira enquanto escovamos os dentes é considerado uma prática essencial de sustentabilidade?",
        opcoes: [
          "Porque reduz o desgaste mecânico dos canos residenciais",
          "Porque economiza até 12 litros de água tratada a cada escovação",
          "Porque impede que a água da pia evapore para a atmosfera",
          "Porque altera o pH da água que chega ao esgoto"
        ],
        correta: 1,
        explicacao: "Escovar os dentes com a torneira aberta gasta em média de 12 a 15 litros de água tratada em casas, enquanto fechar a torneira reduz esse consumo para menos de 1 litro."
      },
      {
        id: "s_f_02",
        area: "Energias Renováveis",
        pergunta: "Qual das seguintes fontes energéticas é considerada 100% renovável e não emite gases de efeito estufa durante sua geração?",
        opcoes: [
          "Termelétrica movida a carvão mineral",
          "Motor gerador a óleo diesel",
          "Painel fotovoltaico de energia solar",
          "Gás natural liquefeito"
        ],
        correta: 2,
        explicacao: "A energia solar fotovoltaica converte diretamente a radiação eletromagnética do sol em eletricidade limpa sem qualquer queima de combustíveis fósseis ou emissão de CO₂ durante a operação."
      },
      {
        id: "s_f_03",
        area: "Florestas e Clima",
        pergunta: "Qual é o principal benefício climático proporcionado pelo plantio de árvores nativas em áreas urbanas como o Parque Realengo?",
        opcoes: [
          "Geração de calor por atrito das folhas com o vento",
          "Sombreamento, transpiração vegetal e redução de ilhas de calor",
          "Aumento da pressão atmosférica no solo",
          "Impermeabilização do terreno contra infiltração de água"
        ],
        correta: 1,
        explicacao: "As árvores promovem o fenômeno da evapotranspiração, liberando vapor de água no ar e fornecendo sombra densa, o que pode reduzir a temperatura de superfície em até 6°C a 10°C."
      },
      {
        id: "s_f_04",
        area: "Resíduos Sólidos",
        pergunta: "No sistema padrão de coleta seletiva brasileiro (Resolução CONAMA 275), qual cor de lixeira é destinada ao descarte de plásticos?",
        opcoes: ["Azul", "Amarela", "Vermelha", "Verde"],
        correta: 2,
        explicacao: "A cor Vermelha é padronizada para plásticos. O Azul é para papel/papelão, Amarelo para metais e Verde para vidros."
      },
      {
        id: "s_f_05",
        area: "Ecologia Urbana",
        pergunta: "O que caracteriza uma 'superfície permeável' em um parque sustentável?",
        opcoes: [
          "Superfície selada com asfalto que expulsa toda a água para as calçadas",
          "Pavimentação que permite a infiltração da água da chuva no lençol freático",
          "Lajes de concreto puro sem juntas de dilatação",
          "Revestimento plástico que impede o crescimento de raízes"
        ],
        correta: 1,
        explicacao: "Solos e pavimentos permeáveis (como biovaletas, gramados e blocos intertravados vazados) permitem que a chuva infiltre naturalmente, recarregando aquíferos e evitando alagamentos."
      },
      {
        id: "s_f_06",
        area: "Biodiversidade",
        pergunta: "Por que a polinização realizada por abelhas nativas e borboletas é crucial para os ecossistemas?",
        opcoes: [
          "Porque impede que as flores cresçam desordenadamente",
          "Porque garante a reprodução de plantas, frutos e a manutenção das cadeias alimentares",
          "Porque elimina os predadores naturais de mamíferos",
          "Porque altera o ciclo hidrológico da chuva"
        ],
        correta: 1,
        explicacao: "Cerca de 75% das culturas alimentares do mundo dependem direta ou indiretamente de polinizadores para sua frutificação e reprodução biológica."
      },
      {
        id: "s_f_07",
        area: "Consumo Consciente",
        pergunta: "Qual é o primeiro e mais prioritário dos princípios da política dos '5 Rs' da sustentabilidade?",
        opcoes: ["Reciclar", "Reutilizar", "Repensar e Reduzir", "Recuperar"],
        correta: 2,
        explicacao: "A hierarquia ecológica prioriza a não-geração do resíduo (Repensar hábitos e Reduzir o consumo). A reciclagem é uma etapa pós-consumo valiosa, mas posterior à redução."
      },
      {
        id: "s_f_08",
        area: "Saneamento Básico",
        pergunta: "Qual é a relação direta entre o saneamento básico adequado e a preservação ambiental?",
        opcoes: [
          "O saneamento impede que esgotos in natura contaminem rios, baías e lençóis freáticos",
          "O saneamento diminui o oxigênio presente na água dos oceanos",
          "O saneamento é responsável por produzir plásticos biodegradáveis",
          "O saneamento elimina a necessidade de tratamento de resíduos hospitalares"
        ],
        correta: 0,
        explicacao: "O tratamento e coleta de esgoto impedem o despejo de coliformes, matéria orgânica e poluentes tóxicos em corpos d'água, prevenindo eutrofização e mortandade de peixes."
      },
      {
        id: "s_f_09",
        area: "Gases de Efeito Estufa",
        pergunta: "Qual é o principal gás de efeito estufa liberado pela queima de combustíveis fósseis nos transportes urbanos?",
        opcoes: ["Oxigênio (O₂)", "Dióxido de Carbono (CO₂)", "Hélio (He)", "Ozônio estratosférico (O₃)"],
        correta: 1,
        explicacao: "A combustão de gasolina, diesel e gás natural emite grandes volumes de dióxido de carbono (CO₂), o principal responsável pelo forçamento radiativo e aquecimento global antrópico."
      },
      {
        id: "s_f_10",
        area: "Mobilidade Sustentável",
        pergunta: "Qual modo de deslocamento urbano apresenta emissão zero de poluentes atmosféricos e promove a saúde do cidadão?",
        opcoes: [
          "Automóveis esportivos de alta cilindrada",
          "Bicicleta e caminhada a pé",
          "Motocicletas com escapamento esportivo",
          "Ônibus antigos a diesel convencional"
        ],
        correta: 1,
        explicacao: "A mobilidade ativa (caminhada e ciclismo) não queima combustíveis fósseis, não emite ruídos sonoros e estimula a atividade cardiovascular dos usuários."
      },
      {
        id: "s_f_11",
        area: "Preservação da Flora",
        pergunta: "O Pau-Brasil (Paubrasilia echinata), árvore símbolo do nosso país presente no Parque Realengo, pertence a qual bioma?",
        opcoes: ["Mata Atlântica", "Tundra Ártica", "Cerrado Rupestre", "Pampa Gaúcho"],
        correta: 0,
        explicacao: "O Pau-Brasil é uma espécie endêmica da Mata Atlântica brasileira, historicamente explorada no período colonial e hoje protegida por lei."
      },
      {
        id: "s_f_12",
        area: "Eficiência Energética",
        pergunta: "Por que as lâmpadas LED são muito mais sustentáveis do que as antigas lâmpadas incandescentes?",
        opcoes: [
          "Porque consomem até 85% menos eletricidade e têm durabilidade até 25 vezes maior",
          "Porque contêm mercúrio em estado gasoso dentro do bulbo",
          "Porque produzem calor intenso em vez de luz visível",
          "Porque só funcionam durante o dia com a luz solar"
        ],
        correta: 0,
        explicacao: "O LED (Diodo Emissor de Luz) converte a eletricidade em fótons com altíssima eficiência ótica, quase sem dissipação térmica inútil, economizando energia nas cidades."
      },
      {
        id: "s_f_13",
        area: "Poluição dos Oceanos",
        pergunta: "Qual é o principal impacto dos plásticos de uso único (canudos, sacolas, copos) no ambiente marinho?",
        opcoes: [
          "Eles se dissolvem instantaneamente fertilizando algas",
          "Fragmentam-se em microplásticos, asfixiam a fauna marinha e entram na cadeia alimentar",
          "Aumentam a salinidade da água do mar",
          "Purificam os recifes de corais da radiação solar"
        ],
        correta: 1,
        explicacao: "Os polímeros sintéticos levam séculos para se decompor, fragmentando-se em microplásticos que são ingeridos por peixes, tartarugas e aves, chegando até o consumo humano."
      },
      {
        id: "s_f_14",
        area: "Agricultura Sustentável",
        pergunta: "Qual prática de manejo do solo dispensa o uso de agrotóxicos sintéticos e adubos químicos solúveis?",
        opcoes: ["Monocultura intensiva", "Agricultura Orgânica e Agroecológica", "Queimada de pastagem", "Desmatamento raso"],
        correta: 1,
        explicacao: "A agroecologia emprega compostagem, adubação verde, controle biológico de pragas e rotação de culturas, respeitando a biologia natural do solo e a saúde pública."
      },
      {
        id: "s_f_15",
        area: "Compostagem",
        pergunta: "O que é o processo biológico de compostagem doméstica ou comunitária?",
        opcoes: [
          "Incineração de plásticos em fornos de alta temperatura",
          "Transformação controlada de restos orgânicos em adubo natural rico em nutrientes",
          "Despejo de pilhas e baterias em caçambas de entulho",
          "Lavagem de garrafas de vidro com solventes químicos"
        ],
        correta: 1,
        explicacao: "A compostagem utiliza microrganismos aeróbios para decompor cascas de frutas, legumes e podas, convertendo-os em húmus orgânico de alta fertilidade."
      },
      {
        id: "s_f_16",
        area: "Drenagem Urbana",
        pergunta: "Qual é a função de um 'jardim de chuva' ou 'biovaleta' em ruas e praças urbanas?",
        opcoes: [
          "Retardar o escoamento superficial da água, filtrá-la e facilitar sua infiltração no solo",
          "Acumular água estagnada sem nenhuma saída para criar pântanos",
          "Acelerar enxurradas em direção às casas dos moradores",
          "Evaporar 100% da chuva no momento exato em que toca o asfalto"
        ],
        correta: 0,
        explicacao: "Os jardins de chuva são estruturas de infraestrutura verde que captam a enxurrada das vias, retêm impurezas e promovem a infiltração gradual, aliviando a drenagem pluvial."
      },
      {
        id: "s_f_17",
        area: "Educação Ambiental",
        pergunta: "De acordo com a Lei Federal 9.795/1999, o que é a Educação Ambiental?",
        opcoes: [
          "Uma matéria facultativa aplicada apenas em faculdades de agronomia",
          "Um processo permanente de formação de valores sociais, conhecimentos e atitudes voltados à conservação do meio ambiente",
          "Uma campanha comercial voltada a vender produtos industriais",
          "Um manual exclusivo para fiscais florestais federais"
        ],
        correta: 1,
        explicacao: "A Política Nacional de Educação Ambiental estabelece que a formação ecológica é um processo participativo contínuo de cidadania em todos os níveis educacionais."
      },
      {
        id: "s_f_18",
        area: "Economia de Recursos",
        pergunta: "Como a prática de carona solidária ou o uso de transporte coletivo contribui com as cidades?",
        opcoes: [
          "Aumenta o número de veículos individuais nas avenidas",
          "Reduz o tráfego, as emissões de poluentes por passageiro e a poluição sonora",
          "Obriga o uso de mais asfalto nas faixas de trânsito",
          "Impede que novos pedestres utilizem as calçadas"
        ],
        correta: 1,
        explicacao: "Um ônibus transporta em média 50 a 80 passageiros ocupando o espaço viário de apenas 3 carros, reduzindo drasticamente as emissões de gases estufa per capita."
      },
      {
        id: "s_f_19",
        area: "Pegada Ecológica",
        pergunta: "O que representa o conceito de 'Pegada Ecológica' de um indivíduo ou nação?",
        opcoes: [
          "O número de sapatos comprados por ano",
          "A quantidade de recursos naturais renováveis necessária para sustentar seu padrão de consumo e absorver seus resíduos",
          "O comprimento em quilômetros das trilhas ecológicas percorridas",
          "A altura máxima que uma árvore atinge em seu ciclo de vida"
        ],
        correta: 1,
        explicacao: "A pegada ecológica calcula a área de terra biologicamente produtiva e mar necessária para gerar os insumos consumidos e absorver a pegada de carbono correspondente."
      },
      {
        id: "s_f_20",
        area: "Construções Verdes",
        pergunta: "Qual das alternativas abaixo é uma técnica de arquitetura bioclimática sustentável?",
        opcoes: [
          "Paredes completamente envidraçadas voltadas para o sol poente sem nenhuma proteção",
          "Iluminação e ventilação naturais cruzadas, telhados verdes e brises de sombreamento",
          "Uso ininterrupto de ar-condicionado em temperatura de 16°C com portas abertas",
          "Pintura externa em preto fosco para absorver calor no verão carioca"
        ],
        correta: 1,
        explicacao: "A arquitetura bioclimática harmoniza o edifício com o clima local, aproveitando ventos predominantes e luz solar para minimizar a necessidade de refrigeração e iluminação artificial."
      },
      {
        id: "s_f_21",
        area: "Áreas Verdes",
        pergunta: "Qual órgão das Nações Unidas recomenda que as cidades possuam no mínimo 9 a 15 m² de área verde por habitante?",
        opcoes: ["OMS (Organização Mundial da Saúde)", "Conselho de Segurança", "Tribunal Penal Internacional", "FMI"],
        correta: 0,
        explicacao: "A OMS recomenda esse índice mínimo para assegurar saúde mental, mitigação do estresse, redução da poluição aérea e promoção de bem-estar nas metrópoles."
      },
      {
        id: "s_f_22",
        area: "Ilhas de Calor",
        pergunta: "O que é uma 'ilha de calor urbana' observada frequentemente na Zona Oeste do Rio de Janeiro?",
        opcoes: [
          "Uma praia deserta no meio da Baía de Sepetiba",
          "Área urbana com temperatura significativamente superior às áreas rurais vizinhas devido ao asfalto, concreto e pouca vegetação",
          "Um vulcão subterrâneo em atividade constante",
          "Um parque público onde as árvores esquentam o ar"
        ],
        correta: 1,
        explicacao: "A concentração de materiais impermeáveis escuros (asfalto, telhados) com alta capacidade térmica e a escassez de árvores acumulam calor diurno e o irradiam à noite, elevando a temperatura em até 8°C."
      },
      {
        id: "s_f_23",
        area: "Reciclagem",
        pergunta: "Qual material reciclável possui uma taxa de reciclagem superior a 98% no Brasil, sendo referência mundial?",
        opcoes: ["Latinhas de alumínio para bebidas", "Copos descartáveis de isopor", "Canudinhos de plástico flexível", "Fitas adesivas de PVC"],
        correta: 0,
        explicacao: "O Brasil recicla praticamente 100% de todas as latas de alumínio consumidas, poupando 95% da energia elétrica que seria gasta na extração da bauxita primária."
      },
      {
        id: "s_f_24",
        area: "Parque Realengo",
        pergunta: "Quantos bicos de microaspersão de névoa climatizadora equipam as 5 Super-Torres do Parque Realengo Susana Naspolini?",
        opcoes: ["12 bicos", "50 bicos", "236 bicos", "1.500 bicos"],
        correta: 2,
        explicacao: "O projeto oficial do Parque Realengo instalou 236 bicos de alta pressão nas 5 torres de até 47 metros para gerar uma bruma flash-evaporativa que alivia o calor extremo."
      },
      {
        id: "s_f_25",
        area: "Objetivos de Desenvolvimento Sustentável",
        pergunta: "Qual é o prazo estabelecido pela ONU para que os países alcancem os 17 Objetivos de Desenvolvimento Sustentável (Agenda Global)?",
        opcoes: ["Ano 2026", "Ano 2030", "Ano 2050", "Ano 2100"],
        correta: 1,
        explicacao: "A Agenda 2030 da ONU, aprovada por 193 Estados-Membros em 2015, estipula 17 metas universais a serem atingidas até o ano de 2030 para erradicação da pobreza e proteção do planeta."
      }
    ],
    medio: [
      {
        id: "s_m_01",
        area: "Mudanças Climáticas",
        pergunta: "O Acordo de Paris de 2015 fixou como meta prioritária manter o aumento da temperatura média global em qual limite?",
        opcoes: [
          "Exatamente em 4,0°C acima dos níveis pré-industriais",
          "Bem abaixo de 2,0°C, buscando esforços para limitar a 1,5°C",
          "Em 0,0°C sem nenhuma variação histórica permitida",
          "Em 5,5°C até o ano de 2040"
        ],
        correta: 1,
        explicacao: "O Artigo 2º do Acordo de Paris compromete os países a manter o aquecimento médio bem abaixo de 2°C e envidar todos os esforços para não ultrapassar 1,5°C, limite de segurança ecológica."
      },
      {
        id: "s_m_02",
        area: "Biodiversidade",
        pergunta: "O que caracteriza o conceito ecológico de 'Corredor Ecológico' em áreas metropolitanas?",
        opcoes: [
          "Uma passarela de pedestres feita com piso plástico",
          "Faixas de vegetação conectando fragmentos florestais isolados para permitir fluxo gênico e deslocamento da fauna",
          "Um canal de concreto para desviar esgoto de um rio para outro",
          "Uma rodovia fechada para tráfego pesado"
        ],
        correta: 1,
        explicacao: "Corredores ecológicos interligam Unidades de Conservação e parques, combatendo o efeito de borda e a endogamia de espécies animais isoladas pela urbanização."
      },
      {
        id: "s_m_03",
        area: "Recursos Hídricos",
        pergunta: "O que é o fenômeno da 'Eutrofização' em corpos hídricos urbanos provocado pelo despejo de esgoto?",
        opcoes: [
          "Purificação natural da água devido à proliferação de esponjas",
          "Proliferação desmedida de algas por excesso de nutrientes (fósforo e nitrogênio), com posterior anóxia e morte aquática",
          "Transformação da água doce em água salgada mineralizada",
          "Aumento do oxigênio dissolvido em profundidade"
        ],
        correta: 1,
        explicacao: "O esgoto sem tratamento enriquece a água com nutrientes. As algas proliferam e morrem; as bactérias decompositoras consomem todo o oxigênio da água, sufocando a vida aquática."
      },
      {
        id: "s_m_04",
        area: "Economia Circular",
        pergunta: "Qual é a diferença fundamental entre a 'Economia Linear' e a 'Economia Circular'?",
        opcoes: [
          "A economia linear recicla tudo e a circular queima tudo",
          "A linear baseia-se em 'extrair, produzir, descartar', enquanto a circular mantém materiais em ciclo contínuo de valor",
          "A economia circular utiliza exclusivamente moedas digitais e criptoativos",
          "Não há diferença, são apenas sinônimos comerciais de propaganda"
        ],
        correta: 1,
        explicacao: "A Economia Circular dissocia o crescimento econômico do consumo de recursos finitos, priorizando o design regenerativo, remanufatura, compartilhamento e ciclagem perpétua."
      },
      {
        id: "s_m_05",
        area: "Camada de Ozônio",
        pergunta: "Qual protocolo internacional obteve sucesso histórico na eliminação dos gases CFCs destruidores da camada de ozônio?",
        opcoes: ["Protocolo de Montreal (1987)", "Protocolo de Quioto (1997)", "Tratado de Tordesilhas (1494)", "Convenção de Genebra (1949)"],
        correta: 0,
        explicacao: "O Protocolo de Montreal é considerado o acordo ambiental multilateral mais bem-sucedido da história, tendo eliminado mais de 99% das substâncias destruidoras da camada de ozônio (ODS)."
      },
      {
        id: "s_m_06",
        area: "Solos e Drenagem",
        pergunta: "Em relação ao ciclo hidrológico urbano, qual é o impacto direto da alta taxa de impermeabilização do solo?",
        opcoes: [
          "Aumento da infiltração para os aquíferos e redução das enchentes",
          "Aumento violento do pico de cheia superficial e redução da recarga dos lençóis subterrâneos",
          "Criação de novos cursos perenes de água potável",
          "Desaparecimento completo de poças d'água no asfalto"
        ],
        correta: 1,
        explicacao: "Com o solo coberto por asfalto e concreto, a água da chuva não infiltra; 80% corre velozmente pelas sarjetas, sobrecarregando galerias fluviais e causando inundações catastróficas."
      },
      {
        id: "s_m_07",
        area: "Biomassa e Energia",
        pergunta: "O biogás produzido a partir do lixo em aterros sanitários ou biodigestores anaeróbios é composto principalmente por qual gás?",
        opcoes: ["Metano (CH₄)", "Nitrogênio puro (N₂)", "Monóxido de carbono (CO)", "Cloro (Cl₂)"],
        correta: 0,
        explicacao: "O biogás resultante da digestão anaeróbia de matéria orgânica é composto por 50% a 70% de metano (CH₄), um biocombustível de alto poder calorífico para geração elétrica e biometano."
      },
      {
        id: "s_m_08",
        area: "Poluição Atmosférica",
        pergunta: "Qual fração de material particulado presente no ar urbano é considerada mais perigosa para a saúde cardiovascular por penetrar nos alvéolos pulmonares?",
        opcoes: ["Partículas PM100", "Partículas PM50", "Partículas finas PM2.5 (≤ 2,5 micrômetros)", "Pólen de gramíneas visível"],
        correta: 2,
        explicacao: "As partículas MP2.5 são tão minúsculas que ultrapassam as barreiras das vias aéreas superiores, atingem os alvéolos pulmonares e entram na corrente sanguínea, elevando infartos e AVCs."
      },
      {
        id: "s_m_09",
        area: "Biotecnologia Ambiental",
        pergunta: "O que é o processo biotecnológico conhecido como 'Biorremediação'?",
        opcoes: [
          "Aplicação de pesticidas clorados para limpar solos agrícolas",
          "Uso de microrganismos vivos ou plantas para degradar ou neutralizar contaminantes tóxicos em solos e efluentes",
          "Remoção mecânica do solo contaminado para jogar no oceano",
          "Queima de vegetação para extrair cinzas minerais"
        ],
        correta: 1,
        explicacao: "A biorremediação emprega bactérias, fungos ou fitorremediação por plantas capazes de metabolizar hidrocarbonetos de petróleo, metais pesados ou pesticidas em compostos atóxicos."
      },
      {
        id: "s_m_10",
        area: "Créditos de Carbono",
        pergunta: "No mercado de compensação climática, a quanto equivale exatamente 1 (um) Crédito de Carbono?",
        opcoes: [
          "A 1 quilograma de carvão mineral queimado",
          "A 1 tonelada de CO₂ equivalente (tCO₂e) que deixou de ser emitida ou foi removida da atmosfera",
          "A 1 hectare de pastagem desmatada legalmente",
          "A 100 barris de petróleo refinado"
        ],
        correta: 1,
        explicacao: "1 Crédito de Carbono representa a certificação auditada de que 1 tonelada métrica de dióxido de carbono equivalente não foi emitida ou foi sequesterada do ar."
      },
      {
        id: "s_m_11",
        area: "Legislação Florestal",
        pergunta: "No Código Florestal Brasileiro (Lei 12.651/2012), qual é a definição de uma Área de Preservação Permanente (APP)?",
        opcoes: [
          "Área desmatada para exploração de minério de ferro",
          "Área protegida com a função de preservar recursos hídricos, paisagem, estabilidade geológica e biodiversidade",
          "Terreno urbano reservado para estacionamentos públicos",
          "Fazenda destinada exclusivamente ao plantio de cana-de-açúcar"
        ],
        correta: 1,
        explicacao: "As APPs abrangem matas ciliares ao longo de rios, topos de morros, manguezais e encostas com declividade > 45°, protegendo o solo contra erosões e assoreamento."
      },
      {
        id: "s_m_12",
        area: "Logística Reversa",
        pergunta: "A Política Nacional de Resíduos Sólidos (Lei 12.305/2010) torna a Logística Reversa obrigatória para quais tipos de produtos?",
        opcoes: [
          "Apenas para jornais e revistas de papel",
          "Agrotóxicos, pilhas/baterias, pneus, óleos lubrificantes, lâmpadas fluorescentes e produtos eletroeletrônicos",
          "Alimentos perecíveis dentro da data de validade",
          "Roupas de tecido de algodão orgânico"
        ],
        correta: 1,
        explicacao: "O Artigo 33 da PNRS estipula a responsabilidade compartilhada pelo ciclo de vida, obrigando fabricantes, importadores, distribuidores e comerciantes a estruturar o retorno desses itens perigosos."
      },
      {
        id: "s_m_13",
        area: "Acidificação dos Oceanos",
        pergunta: "Qual é o mecanismo geoquímico que causa a acidificação das águas oceânicas em escala planetária?",
        opcoes: [
          "O derramamento de vinagre doméstico nos esgotos urbanos",
          "A absorção pelos mares de excesso de CO₂ atmosférico, formando ácido carbônico e consumindo íons carbonato",
          "A diminuição da temperatura da água nos polos",
          "A proliferação de baleias e tubarões no Atlântico"
        ],
        correta: 1,
        explicacao: "Os oceanos absorvem ~25% do CO₂ humano. A reação com a água produz ácido carbônico (H₂CO₃), liberando íons H⁺ que reduzem o pH marinho e impedem a calcificação de corais e moluscos."
      },
      {
        id: "s_m_14",
        area: "Pegada Hídrica",
        pergunta: "O que representa o conceito de 'Água Virtual' contido em um produto industrial ou agropecuário?",
        opcoes: [
          "Água criada por softwares de modelagem 3D",
          "O volume total de água doce utilizado direta e indiretamente em todas as etapas de sua cadeia produtiva",
          "Água mineral engarrafada em vasilhames plásticos",
          "A umidade do ar dentro de depósitos de estoques"
        ],
        correta: 1,
        explicacao: "Para produzir 1 kg de carne bovina, por exemplo, são necessários cerca de 15.000 litros de água virtual ao longo de toda a vida do animal (pastagem, grãos da ração, hidratação e abate)."
      },
      {
        id: "s_m_15",
        area: "Ilhas de Calor e Urbanismo",
        pergunta: "Qual propriedade ótica e térmica de um material deve ser maximizada para reduzir o calor absorvido em coberturas e pisos urbanos?",
        opcoes: ["Permeabilidade magnética", "Albedo e emissividade térmica no infravermelho", "Capacidade de combustão", "Teor de carbono"],
        correta: 1,
        explicacao: "O albedo elevado reflete a radiação solar incidente (tetos claros/frios), enquanto a alta emissividade dissipa rapidamente para o céu o pouco calor absorvido."
      },
      {
        id: "s_m_16",
        area: "Recuperação de Áreas Degradadas",
        pergunta: "No manejo de restauração ecológica, qual é a importância de plantar espécies pioneiras em primeiro lugar?",
        opcoes: [
          "Porque elas impedem que qualquer outra árvore cresça no local",
          "Porque toleram sol pleno, crescem rápido, estabilizam o solo e criam sombra para espécies clímax mais exigentes",
          "Porque possuem raízes que secam os mananciais subterrâneos",
          "Porque fornecem madeira nobre para corte imediato"
        ],
        correta: 1,
        explicacao: "Espécies pioneiras (como embaúbas e aroeiras) iniciam a sucessão ecológica primária/secundária, fixando nitrogênio e facilitando a chegada das espécies secundárias e tardias."
      },
      {
        id: "s_m_17",
        area: "Segurança Hídrica",
        pergunta: "Qual é o principal reservatório natural regulador de vazão de rios que abastecem a Região Metropolitana do Rio de Janeiro?",
        opcoes: [
          "Caixas d'água residenciais de fibra de vidro",
          "Bacia Hidrográfica do Rio Paraíba do Sul e Sistema Guandu",
          "Piscinas olímpicas de clubes desportivos",
          "Fontes artesianas da orla de Copacabana"
        ],
        correta: 1,
        explicacao: "O Sistema Guandu capta águas transpostas do Rio Paraíba do Sul, respondendo pelo abastecimento potável de mais de 80% da população da Região Metropolitana do Rio."
      },
      {
        id: "s_m_18",
        area: "ODS 11",
        pergunta: "O Objetivo de Desenvolvimento Sustentável nº 11 da ONU tem como meta explícita:",
        opcoes: [
          "Tornar as cidades e os assentamentos humanos inclusivos, seguros, resilientes e sustentáveis",
          "Substituir todos os parques naturais por rodovias de pedágio",
          "Proibir o uso de internet em áreas metropolitanas",
          "Construir edifícios com mais de 100 andares em todas as praias"
        ],
        correta: 0,
        explicacao: "O ODS 11 visa garantir acesso à habitação segura, transporte público sustentável, planejamento urbano participativo e preservação do patrimônio cultural e natural."
      },
      {
        id: "s_m_19",
        area: "Energia Solar Fotovoltaica",
        pergunta: "Qual semicondutor purificado é o elemento mais utilizado na fabricação de células solares fotovoltaicas comerciais?",
        opcoes: ["Chumbo", "Silício cristalino", "Mercúrio", "Enxofre"],
        correta: 1,
        explicacao: "O silício (Si) com dopagem de boro e fósforo cria a junção P-N que excita elétrons sob a incidência de fótons de luz, gerando a corrente contínua fotovoltaica."
      },
      {
        id: "s_m_20",
        area: "Controle Biológico",
        pergunta: "O que é o controle biológico de pragas aplicado em parques e lavouras sustentáveis?",
        opcoes: [
          "Eliminação de todos os seres vivos com radiação gama",
          "Uso de inimigos naturais (como joaninhas e vespas parasitoides) para regular a população de insetos-praga sem venenos químicos",
          "Lançamento de venenos sintéticos persistentes por aviões",
          "Inundação artificial do solo com óleo lubrificante"
        ],
        correta: 1,
        explicacao: "O controle biológico explora relações tróficas naturais de predação e parasitismo, mantendo o equilíbrio ecológico sem contaminar polinizadores, solo ou águas."
      },
      {
        id: "s_m_21",
        area: "Gestão de Resíduos",
        pergunta: "Qual é a destinação ambientalmente mais inadequada para resíduos sólidos urbanos de acordo com a legislação brasileira?",
        opcoes: [
          "Aterro sanitário impermeabilizado e com queima de metano",
          "Lixão a céu aberto com contaminação direta de chorume no solo e ar",
          "Central de triagem para cooperativas de catadores",
          "Unidade de compostagem de resíduos de poda"
        ],
        correta: 1,
        explicacao: "Os lixões a céu aberto são proibidos por lei no Brasil; eles poluem lençóis freáticos com chorume tóxico, atraem vetores de doenças e emitem metano descontrolado."
      },
      {
        id: "s_m_22",
        area: "Química Verde",
        pergunta: "Qual princípio da Química Verde preconiza a prevenção da poluição em nível molecular?",
        opcoes: [
          "É melhor prevenir a geração de resíduos do que tratá-los ou limpá-los após serem formados",
          "Deve-se priorizar o uso de reagentes com metais pesados para acelerar reações",
          "Os produtos químicos devem ser projetados para nunca se degradarem na natureza",
          "Os solventes tóxicos devem ser descartados diretamente na rede pluvial"
        ],
        correta: 0,
        explicacao: "O Princípio nº 1 da Química Verde de Anastas e Warner preconiza a economia atômica e a prevenção primária da toxicidade antes que os resíduos venham a existir."
      },
      {
        id: "s_m_23",
        area: "Microclima e Parque Realengo",
        pergunta: "Como o sistema de nebulização das 5 Super-Torres do Parque Realengo consegue resfriar o ambiente sem molhar as pessoas?",
        opcoes: [
          "Utilizando jatos de água congelada em blocos de gelo",
          "Pulverizando microgotículas sob 70 bar de pressão que evaporam instantaneamente no ar (flash evaporation), absorvendo calor latente",
          "Sugando todo o ar quente para dentro de túneis de ventilação subterrâneos",
          "Emitindo ondas ultrassônicas que quebram as moléculas de calor"
        ],
        correta: 1,
        explicacao: "Com bicos atomizadores de alta pressão, as gotas possuem diâmetro de microns, evaporando no percurso de queda. A mudança de estado líquido para vapor consome calor latente do ar."
      },
      {
        id: "s_m_24",
        area: "Biomas Brasileiros",
        pergunta: "Qual é a porcentagem aproximada de cobertura florestal remanescente da Mata Atlântica original no Brasil?",
        opcoes: ["Cerca de 85%", "Cerca de 50%", "Apenas cerca de 12% a 15%", "Mais de 95%"],
        correta: 2,
        explicacao: "A Mata Atlântica é um dos biomas mais devastados do planeta, restando apenas cerca de 12% de sua vegetação original bem conservada, o que a torna um dos maiores Hotspots de biodiversidade."
      },
      {
        id: "s_m_25",
        area: "Serviços Ecossistêmicos",
        pergunta: "O que são 'Serviços Ecossistêmicos de Regulação' fornecidos por um parque urbano como o Parque Realengo?",
        opcoes: [
          "Cobrança de ingressos e taxas municipais de fiscalização",
          "Purificação do ar, amortecimento de enchentes, regulação térmica e controle de erosão",
          "Instalação de postes de alta tensão e fábricas poluentes",
          "Criação de novos estacionamentos para caminhões pesados"
        ],
        correta: 1,
        explicacao: "Serviços ecossistêmicos de regulação são os benefícios obtidos da regulação dos processos ecossistêmicos naturais, fundamentais para a sobrevivência humana nas cidades."
      }
    ],
    dificil: [
      {
        id: "s_d_01",
        area: "Climatologia e IPCC",
        pergunta: "De acordo com o 6º Relatório de Avaliação do IPCC (AR6), qual é a principal evidência da atribuição inequívoca do aquecimento global às atividades humanas?",
        opcoes: [
          "Variações nos ciclos de manchas solares que coincidem com os vulcões",
          "A taxa sem precedentes de acúmulo de GEEs atmosféricos com assinatura isotópica de carbono fóssil (depleção de ¹³C/¹²C e ausência de ¹⁴C)",
          "A rotação da Terra ter acelerado em decorrência dos ventos marítimos",
          "O aumento exclusivo das chuvas nos polos e seca nos trópicos"
        ],
        correta: 1,
        explicacao: "A queima de combustíveis fósseis libera carbono livre de carbono-14 (que decaiu há milhões de anos) e com baixa proporção de carbono-13. Essa 'impressão digital isotópica' comprova matematicamente a origem fóssil do excesso de CO₂."
      },
      {
        id: "s_d_02",
        area: "Limites Planetários",
        pergunta: "No arcabouço científico dos 'Limites Planetários' (Rockström et al., Stockholm Resilience Centre), quais limites já foram ultrapassados perigosamente pela humanidade?",
        opcoes: [
          "Apenas o uso de água subterrânea em áreas rurais",
          "Mudanças climáticas, integridade da biosfera (extinção de espécies), fluxos biogeoquímicos (N e P), entidades novas (poluição química) e uso da terra",
          "Nenhum limite foi atingido até o momento presente",
          "Apenas a camada de ozônio estratosférica"
        ],
        correta: 1,
        explicacao: "A ciência comprova que a humanidade já transgrediu pelo menos 6 dos 9 limites que mantêm a Terra em estado de equilíbrio holocênico estável."
      },
      {
        id: "s_d_03",
        area: "Hidrologia e Macrodrenagem",
        pergunta: "Em projetos de macrodrenagem resiliente urbana, qual é o conceito hidrológico de 'Tempo de Concentração' (Tc) de uma bacia hidrográfica?",
        opcoes: [
          "O tempo necessário para que a água da chuva evapore após o temporal",
          "O tempo decorrido desde o início da precipitação para que toda a bacia hidrográfica contribua simultaneamente na seção de deságue (vazão de pico)",
          "A duração máxima que um bueiro leva para ser limpo pela prefeitura",
          "A velocidade do som do trovão até chegar aos pluviômetros"
        ],
        correta: 1,
        explicacao: "A retenção por bacias de amortecimento (como a do Parque Realengo) visa justamente retardar o tempo de concentração, amortecendo a curva hidrógrafa de pico e evitando que o Rio Realengo transborde."
      },
      {
        id: "s_d_04",
        area: "Avaliação do Ciclo de Vida (ACV)",
        pergunta: "Na norma ABNT NBR ISO 14040, o que delimita a fronteira do sistema do tipo 'Do Berço ao Túmulo' (Cradle-to-Grave)?",
        opcoes: [
          "Apenas a fase de extração da matéria-prima até a saída do portão da fábrica",
          "Desde a extração de matérias-primas virgens, passando por manufatura, distribuição e uso, até a disposição final de resíduos",
          "Exclusivamente o transporte marítimo de mercadorias",
          "O tempo de garantia comercial oferecido ao comprador"
        ],
        correta: 1,
        explicacao: "A abordagem 'Do Berço ao Túmulo' analisa os impactos ambientais cumulativos de um produto ao longo de todo o seu ciclo vitalício completo, incluindo o descarte e tratamento final."
      },
      {
        id: "s_d_05",
        area: "Termodinâmica e Microclima",
        pergunta: "Do ponto de vista psicrométrico e termodinâmico, sob qual condição climática o resfriamento evaporativo por microaspersão atinge sua máxima eficiência?",
        opcoes: [
          "Quando a umidade relativa do ar está em 100% e com chuva torrencial",
          "Quando o bulbo úmido está bem abaixo da temperatura de bulbo seco (temperatura elevada e baixa umidade relativa)",
          "Quando a pressão atmosférica é máxima em dias gélidos de inverno",
          "Quando a velocidade do vento é absolutamente zero e o céu está encoberto"
        ],
        correta: 1,
        explicacao: "A capacidade do ar de absorver vapor de água depende da depressão do bulbo úmido (diferença entre bulbo seco e bulbo úmido). Quanto mais seco e quente o ar, maior o potencial de evaporação e queda térmica."
      },
      {
        id: "s_d_06",
        area: "Mecanismo de Redução de Emissões",
        pergunta: "No âmbito do Artigo 6º do Acordo de Paris, o que são os ITMOs (Internationally Transferred Mitigation Outcomes)?",
        opcoes: [
          "Sanções econômicas aplicadas a países subdesenvolvidos",
          "Resultados de mitigação de carbono transferidos internacionalmente entre países para cumprimento de suas NDCs",
          "Cargas de lixo tóxico enviadas para reciclagem no hemisfério norte",
          "Impostos aduaneiros sobre importação de combustíveis renováveis"
        ],
        correta: 1,
        explicacao: "Os ITMOs estabelecem a base contábil para o mercado global cooperativo de carbono entre países, permitindo que reduções de emissões de um país sejam transferidas para a meta (NDC) de outro sem dupla contagem."
      },
      {
        id: "s_d_07",
        area: "Fisiologia Vegetal e Carbono",
        pergunta: "Qual é a via metabólica fotossintética que apresenta maior eficiência no uso da água sob altas temperaturas e estresse hídrico?",
        opcoes: ["Via fotossintética C3", "Via fotossintética C4 e metabolismo ácido das crassuláceas (CAM)", "Quimiossíntese sulfurosa bacteriana", "Fermentação lática celular"],
        correta: 1,
        explicacao: "Plantas C4 e CAM concentram CO₂ na enzima RuBisCO evitando a fotorrespiração, o que lhes permite manter os estômatos menos abertos e economizar água em climas quentes como o de Realengo."
      },
      {
        id: "s_d_08",
        area: "Biotecnologia e Fitotratamento",
        pergunta: "No projeto de 'Wetlands Construídas' (zonas úmidas artificiais) para tratamento de efluentes, qual é o papel dos microrganismos associados à rizosfera das macrófitas?",
        opcoes: [
          "Eles esterilizam a água adicionando cloro molecular",
          "Fazem a biofiltração aeróbia e anaeróbia da carga orgânica, desnitrificação e imobilização de fósforo na rizosfera",
          "Impedem a entrada de luz solar nas raízes",
          "Evaporam metais pesados para a atmosfera em forma de fumaça"
        ],
        correta: 1,
        explicacao: "A rizosfera (zona ao redor das raízes) abriga biofilmes bacterianos densos que realizam nitrificação/desnitrificação e degradação de DBO com zero adição de químicos sintéticos."
      },
      {
        id: "s_d_09",
        area: "Pegada de Nitrogênio e Fósforo",
        pergunta: "Qual é o principal risco planetário derivado da quebra do limite biogeoquímico dos ciclos do nitrogênio e fósforo no solo e águas?",
        opcoes: [
          "O congelamento das calotas polares",
          "A proliferação global de zonas mortas anóxicas nos oceanos e perda catastrófica da fauna dulcícola",
          "O esgotamento súbito do ar atmosférico",
          "A parada das marés lunares"
        ],
        correta: 1,
        explicacao: "A síntese industrial de amônia (processo Haber-Bosch) e a mineração de fosfatos injetaram mais nitrogênio e fósforo reativos nos ecossistemas do que todos os processos naturais da Terra somados."
      },
      {
        id: "s_d_10",
        area: "Governança e Taxonomia Verde",
        pergunta: "O que estabelece a 'Taxonomia Sustentável' aprovada por blocos como a União Europeia e em implantação pelo Ministério da Fazenda no Brasil?",
        opcoes: [
          "Um catálogo taxonômico de animais em perigo de caça",
          "Um sistema de classificação técnico-científico que define com critérios mensuráveis quais atividades econômicas são genuinamente sustentáveis, combatendo o greenwashing",
          "Uma nova tabela de impostos cobrada exclusivamente de pessoas físicas",
          "Um manual de jardinagem para escolas públicas"
        ],
        correta: 1,
        explicacao: "A Taxonomia Verde estabelece métricas técnicas rigorosas (ex: emissões < 100g CO₂e/kWh) para classificar investimentos ecológicos e direcionar capital financeiro para a transição justa."
      },
      {
        id: "s_d_11",
        area: "Efeito Albedo e Feedback Climático",
        pergunta: "O derretimento do permafrost siberiano e canadense acarreta qual perigoso ciclo de retroalimentação positiva (positive feedback loop)?",
        opcoes: [
          "Aumento da reflexão solar e resfriamento brusco do continente",
          "Liberação em larga escala de metano (CH₄) e CO₂ antes aprisionados no gelo, acelerando ainda mais o aquecimento",
          "Aumento dos níveis de oxigênio em toda a troposfera",
          "Eliminação dos vírus e bactérias do solo ártico"
        ],
        correta: 1,
        explicacao: "O permafrost contém o dobro de carbono atualmente presente na atmosfera. Seu descongelamento acelera a decomposição microbiana anaeróbia, liberando metano e retroalimentando o aquecimento."
      },
      {
        id: "s_d_12",
        area: "Modelagem Hidráulica Urbana",
        pergunta: "Na fórmula racional de drenagem pluvial (Q = C · I · A), o que representa o coeficiente de deflúvio superficial 'C'?",
        opcoes: [
          "A capacidade de armazenamento de uma caixa d'água",
          "A fração adimensional entre o volume de água que escoa superficialmente e o volume total precipitado sobre a bacia",
          "A constante gravitacional da aceleração da chuva",
          "O comprimento do rio receptor em metros"
        ],
        correta: 1,
        explicacao: "Solos impermeabilizados de asfalto têm C ≈ 0,90 (quase toda a chuva vira enxurrada), enquanto áreas verdes florestadas têm C ≈ 0,15 a 0,25 (a maior parte infiltra ou é retida pela vegetação)."
      },
      {
        id: "s_d_13",
        area: "Direito Ambiental",
        pergunta: "Qual princípio do Direito Ambiental internacional determina que a ausência de certeza científica absoluta não deve ser motivo para postergar medidas eficazes de proteção?",
        opcoes: [
          "Princípio do Poluidor-Pagador",
          "Princípio da Precaução",
          "Princípio do Livre Mercado",
          "Princípio da Razoabilidade Econômica"
        ],
        correta: 1,
        explicacao: "O Princípio da Precaução (Princípio 15 da Declaração do Rio/92) estabelece ação antecipatória mesmo diante de incertezas científicas, quando há ameaça de danos graves ou irreversíveis."
      },
      {
        id: "s_d_14",
        area: "Biopolímeros e Química Sustentável",
        pergunta: "Qual é a principal distinção técnica entre um polímero 'Oxidegradável' e um biopolímero 'Efetivamente Compostável' (como o PLA ou PHA)?",
        opcoes: [
          "O oxidegradável é feito de plantas e o compostável de petróleo",
          "O oxidegradável apenas se fragmenta em microplásticos perigosos por aditivos pró-oxidantes, enquanto o compostável é assimilado por bactérias virando biomassa, água e CO₂",
          "Não há diferença, ambos desaparecem em 2 dias na água potável",
          "O plástico compostável não pode entrar em contato com alimentos"
        ],
        correta: 1,
        explicacao: "Plásticos oxidegradáveis adicionam catalisadores que quebram o polietileno fóssil em pó de microplástico invisível. Já os bioplásticos compostáveis certificados (norma EN 13432) biodegradam biologicamente sem resíduos tóxicos."
      },
      {
        id: "s_d_15",
        area: "Economia Ecológica",
        pergunta: "O que postula o 'Paradoxo de Jevons' em estudos de sustentabilidade e eficiência de recursos?",
        opcoes: [
          "O aumento da eficiência no uso de um recurso tende a reduzir o seu custo, resultando em um aumento do seu consumo global em vez de diminuição",
          "A poluição sempre diminui quando a população mundial triplica",
          "O sol emite mais energia do que a humanidade pode computar",
          "Os rios sempre correm na direção dos centros urbanos mais ricos"
        ],
        correta: 0,
        explicacao: "O Paradoxo de Jevons demonstra que ganhos tecnológicos de ecoeficiência devem vir acompanhados de políticas de suficiência e limites de demanda, caso contrário o efeito-rebote amplia o consumo total."
      },
      {
        id: "s_d_16",
        area: "Resiliência Climática e Infraestrutura",
        pergunta: "Como as SbN (Soluções baseadas na Natureza) se diferenciam da 'Infraestrutura Cinza' tradicional de engenharia?",
        opcoes: [
          "SbN utilizam apenas cimento e ferro fundido reforçado",
          "SbN imitam ou utilizam processos ecossistêmicos naturais para gerar múltiplos cobenefícios socioambientais além da função primária de engenharia",
          "SbN são sempre mais caras e nunca conseguem amortecer enchentes",
          "Infraestrutura cinza utiliza árvores geneticamente modificadas"
        ],
        correta: 1,
        explicacao: "Enquanto a infraestrutura cinza (canal de concreto) apenas drena e expulsa a água, as SbN (como parques inundáveis e biovaletas) filtram poluentes, reduzem calor, sequestram carbono e criam espaços de lazer."
      },
      {
        id: "s_d_17",
        area: "Recuperação Florestal de Alta Diversidade",
        pergunta: "No método de restauração florestal por 'Nucleação' (Reis et al.), qual é o procedimento técnico adotado?",
        opcoes: [
          "Despejo de calcário e cimento por caminhões betoneiras",
          "Criação de pequenas ilhas de biodiversidade (ninhos ecológicos, poleiros artificiais, transposição de serapilheira) para que a fauna disperse sementes naturalmente",
          "Corte raso de todas as espécies nativas para plantio de eucalipto",
          "Cercamento de 100% da área com placas de metal"
        ],
        correta: 1,
        explicacao: "A nucleação mimetiza a regeneração natural espontânea com menor custo, instalando pequenos núcleos atrativos que funcionam como 'trampolins' de propagação biológica."
      },
      {
        id: "s_d_18",
        area: "Mercado e ESG",
        pergunta: "O que avalia o pilar da 'Dupla Materialidade' no relatório de sustentabilidade corporativa da diretiva CSRD da União Europeia?",
        opcoes: [
          "A quantidade de papel duplo usada para imprimir balanços contábeis",
          "Tanto a 'Materialidade Financeira' (como a sustentabilidade impacta o negócio) quanto a 'Materialidade de Impacto' (como o negócio afeta as pessoas e o meio ambiente)",
          "A pesagem de matéria-prima duas vezes na balança rodoviária",
          "O pagamento em dobro de impostos de importação"
        ],
        correta: 1,
        explicacao: "A dupla materialidade exige que as organizações reportem não apenas os riscos climáticos que impactam seu lucro, mas também seus impactos externos na sociedade e ecossistemas."
      },
      {
        id: "s_d_19",
        area: "Sensoriamento Remoto",
        pergunta: "Qual índice espectral derivado de bandas do infravermelho próximo (NIR) e vermelho visível (RED) é o mais utilizado por satélites para medir vigor vegetal urbano?",
        opcoes: ["NDVI (Normalized Difference Vegetation Index)", "GPS (Global Positioning System)", "API (Application Programming Interface)", "RGB (Red Green Blue standard)"],
        correta: 0,
        explicacao: "A clorofila saudável absorve fortemente a luz vermelha e reflete intensamente o infravermelho próximo. A razão NDVI = (NIR - RED) / (NIR + RED) varia de -1 a +1 quantificando a biomassa verde."
      },
      {
        id: "s_d_20",
        area: "Transição Energética",
        pergunta: "Qual é a principal barreira técnica da integração em larga escala de fontes renováveis variáveis (solar e eólica) na rede elétrica?",
        opcoes: [
          "O fato de a energia solar estragar os transformadores elétricos",
          "A intermitência temporal na geração, exigindo sistemas de armazenamento em baterias (BESS), hidrelétricas reversíveis e flexibilidade de despacho",
          "A falta total de luz solar no território brasileiro",
          "A proibição do uso de cabos de cobre para corrente alternada"
        ],
        correta: 1,
        explicacao: "O sol não brilha à noite e o vento varia. A estabilidade de frequência da rede (60 Hz) requer tecnologias de armazenamento, resposta da demanda e linhas de transmissão de longa distância."
      },
      {
        id: "s_d_21",
        area: "Balanço Energético Urbano",
        pergunta: "Na equação do balanço de energia na superfície urbana (Rn = H + LE + G), o que representa a fração de calor latente 'LE'?",
        opcoes: [
          "O calor armazenado no subsolo mineral",
          "A energia consumida na evapotranspiração da água e vegetação, que não aquece o ar diretamente",
          "O calor sensível que provoca a queima de folhas",
          "A radiação cósmica emitida por satélites"
        ],
        correta: 1,
        explicacao: "Quando a radiação líquida (Rn) é convertida em calor latente (LE) pela presença de água e árvores, ela consome calor para evaporar água, evitando que esse calor se converta em calor sensível (H), que esquenta o ar."
      },
      {
        id: "s_d_22",
        area: "Cidades Esponja",
        pergunta: "O conceito urbanístico e hidrológico de 'Cidades-Esponja' (Sponge Cities), formulado pelo arquiteto Kongjian Yu, propõe:",
        opcoes: [
          "Construir toda a cidade flutuando sobre barcos de borracha",
          "Integrar bacias de retenção, pavimentos permeáveis e várzeas aluviais para absorver, purificar e reutilizar 70% da chuva no próprio tecido urbano",
          "Drenar toda a água para túneis subterrâneos blindados a 100 metros de profundidade",
          "Cobrir todas as ruas com plástico para acelerar o fluxo"
        ],
        correta: 1,
        explicacao: "As cidades-esponja abandonam a mentalidade de 'lutar contra a água' para 'conviver com a água', utilizando lagoas de detenção como a do Parque Realengo para desacelerar o ciclo hidrológico."
      },
      {
        id: "s_d_23",
        area: "Geociclos e Acidificação",
        pergunta: "Por que a queima de combustíveis com alto teor de enxofre em refinarias e termoelétricas resulta em 'chuva ácida'?",
        opcoes: [
          "O enxofre se converte em dióxido de enxofre (SO₂) que, oxidado na atmosfera, forma gotículas de ácido sulfúrico (H₂SO₄)",
          "O enxofre congela as nuvens impedindo a chuva",
          "O enxofre neutraliza toda a acidez natural tornando a chuva doce",
          "O enxofre decompõe o oxigênio em ozônio"
        ],
        correta: 0,
        explicacao: "Gases de enxofre (SOx) e nitrogênio (NOx) reagem com vapor de água e radicais hidroxila na atmosfera, gerando ácido sulfúrico e nítrico, que precipitam com pH < 5,0, corroendo metais e acidificando solos."
      },
      {
        id: "s_d_24",
        area: "Biofilia no Design",
        pergunta: "O que preconiza o conceito de 'Design Biofílico' (Edward O. Wilson / Stephen Kellert) em espaços públicos contemporâneos?",
        opcoes: [
          "A eliminação de qualquer planta viva em prol de quadros fotográficos",
          "A incorporação intencional de elementos, geometrias naturais, luz dinâmica e água para restaurar a conexão inata entre seres humanos e sistemas biológicos",
          "A pintura obrigatória de todas as paredes de verde brilhante",
          "O uso exclusivo de inteligência artificial sem presença de pessoas"
        ],
        correta: 1,
        explicacao: "A biofilia postula a tendência biológica inata do ser humano de se afiliar à natureza. Sua incorporação arquitetônica reduz cortisol, frequência cardíaca e melhora funções cognitivas."
      },
      {
        id: "s_d_25",
        area: "Sustentabilidade Forte vs Fraca",
        pergunta: "Na teoria da Economia Ecológica de Herman Daly, qual é a tese central da 'Sustentabilidade Forte'?",
        opcoes: [
          "Que o capital natural e o capital construído pelo homem são substitutos perfeitos graças à tecnologia infinita",
          "Que o capital natural presta serviços essenciais não-substituíveis pelo capital manufaturado, exigindo a manutenção física intocada do estoque de recursos ecológicos",
          "Que o crescimento econômico deve ser infinito em um planeta finito",
          "Que os mercados financeiros sempre consertam desastres ecológicos sem intervenção estatal"
        ],
        correta: 1,
        explicacao: "A sustentabilidade forte rejeita a hipótese de que o dinheiro ou máquinas podem substituir a camada de ozônio ou o ciclo hidrológico; o ecossistema é a fronteira limite e a economia é um subsistema dependente."
      }
    ]
  },

  // ==========================================================================
  // MODALIDADE 2: MODO PROFESSOR / PROFISSIONAL (INTERDISCIPLINAR)
  // Áreas: Enfermagem, Informática, Administração e Conhecimentos Gerais
  // ==========================================================================
  profissional: {
    facil: [
      {
        id: "p_f_01",
        area: "Enfermagem",
        pergunta: "Segundo a RDC ANVISA nº 222/2018, em qual recipiente rígido, resistente à punctura e com símbolo de substância infectante devem ser descartadas agulhas e lâminas de bisturi usadas?",
        opcoes: [
          "Saco plástico preto de lixo comum",
          "Caixa de papelão rígida para descarte de materiais perfurocortantes (Descarpack)",
          "Bacia de aço inoxidável sem tampa",
          "Lixeira de pedal com saco azul de reciclagem"
        ],
        correta: 1,
        explicacao: "Materiais perfurocortantes (Grupo E) devem ser descartados no ponto de geração em recipientes rígidos, estanques, resistentes a ruptura e devidamente identificados para prevenir acidentes com profissionais."
      },
      {
        id: "p_f_02",
        area: "Informática",
        pergunta: "Por que pilhas, baterias de lítio e placas-mãe de computadores antigos não devem ser descartados no lixo domiciliar comum?",
        opcoes: [
          "Porque consomem a memória RAM dos caminhões de coleta",
          "Porque contêm metais pesados (chumbo, cádmio, mercúrio) que contaminam o lençol freático e o solo",
          "Porque podem fazer os aterros sanitários funcionarem como antenas de rádio",
          "Porque a carcaça de metal é absorvida espontaneamente pela terra"
        ],
        correta: 1,
        explicacao: "O lixo eletrônico (REEE) abriga elementos químicos altamente tóxicos e bioacumulativos. Seu descarte em lixões libera cádmio e chumbo, atingindo aquíferos e a cadeia alimentar."
      },
      {
        id: "p_f_03",
        area: "Administração",
        pergunta: "O que representa a sigla 'ESG' (ou ASG em português), amplamente adotada na gestão empresarial moderna?",
        opcoes: [
          "Estrutura de Salários e Gratificações financeiras",
          "Environmental, Social and Governance (Ambiental, Social e Governança corporativa)",
          "Equipamentos e Serviços de Garantia técnica",
          "Estoque Sustentável de Gasolina e petróleo"
        ],
        correta: 1,
        explicacao: "O ESG é o padrão global que avalia as práticas de sustentabilidade ambiental, justiça social nas relações de trabalho e transparência ética/governança nas empresas."
      },
      {
        id: "p_f_04",
        area: "Conhecimentos Gerais",
        pergunta: "Quantos são os Objetivos de Desenvolvimento Sustentável (ODS) aprovados na Assembleia Geral das Nações Unidas?",
        opcoes: ["5 objetivos", "10 objetivos", "17 objetivos", "50 objetivos"],
        correta: 2,
        explicacao: "Os 17 ODS da ONU abrangem desde a erradicação da pobreza (ODS 1), saúde de qualidade (ODS 3), cidades sustentáveis (ODS 11) até ação contra a mudança global do clima (ODS 13)."
      },
      {
        id: "p_f_05",
        area: "Enfermagem",
        pergunta: "Qual é a correta higienização das mãos na assistência hospitalar que previne infecções cruzadas e poupa água tratada quando não há sujidade visível?",
        opcoes: [
          "Fricção antisséptica das mãos com preparação alcoólica a 70% por 20 a 30 segundos",
          "Deixar as mãos de molho em água fervente por 10 minutos",
          "Uso contínuo das mesmas luvas plásticas durante todo o plantão",
          "Secagem das mãos em toalhas de tecido comunitárias"
        ],
        correta: 0,
        explicacao: "A OMS e a ANVISA preconizam o uso de álcool em gel 70% como padrão ouro para higienização rápida quando não há matéria orgânica visível, poupando água e sendo altamente eficaz contra patógenos."
      },
      {
        id: "p_f_06",
        area: "Informática",
        pergunta: "O que preconiza o conceito de 'Green IT' (TI Verde) nas empresas de tecnologia?",
        opcoes: [
          "Pintar computadores e servidores de verde para diminuir o brilho",
          "Projetar, operar e descartar recursos computacionais maximizando a eficiência energética e reduzindo a pegada ecológica",
          "Desligar a internet durante os finais de semana",
          "Utilizar apenas disquetes e mídias magnéticas antigas"
        ],
        correta: 1,
        explicacao: "TI Verde engloba virtualização de servidores, eficiência energética em datacenters (PUE), logística reversa de hardware e impressão zero para minimizar a pegada de carbono corporativa."
      },
      {
        id: "p_f_07",
        area: "Administração",
        pergunta: "O que é 'Logística Reversa' no contexto da gestão estratégica de uma fábrica ou distribuidora?",
        opcoes: [
          "Dirigir caminhões de entrega em marcha à ré nas rodovias",
          "Processo de planejamento e controle do fluxo de materiais e embalagens pós-consumo de volta ao ciclo produtivo ou descarte seguro",
          "Comprar matéria-prima exclusivamente de fornecedores estrangeiros",
          "Vender produtos com desconto apenas na data de vencimento"
        ],
        correta: 1,
        explicacao: "A logística reversa operacionaliza o retorno de produtos usados (pneus, eletrônicos, vidros) ao fabricante para reciclagem ou reaproveitamento industrial."
      },
      {
        id: "p_f_08",
        area: "Conhecimentos Gerais",
        pergunta: "Qual evento histórico internacional sediado na cidade do Rio de Janeiro em 1992 consagrou o conceito de Desenvolvimento Sustentável?",
        opcoes: ["Copa do Mundo de 1950", "Eco-92 (Rio-92 ou Cúpula da Terra)", "Jogos Olímpicos Rio 2016", "Tratado de Madri"],
        correta: 1,
        explicacao: "A Rio-92 reuniu chefes de Estado de todo o mundo, gerando a Agenda 21, a Convenção do Clima (UNFCCC), a Convenção da Biodiversidade e a Declaração de Princípios sobre Florestas."
      },
      {
        id: "p_f_09",
        area: "Enfermagem",
        pergunta: "Os resíduos biológicos com presença de sangue ou secreções (Grupo A da RDC 222/18) devem ser acondicionados em sacos plásticos de qual cor e especificação?",
        opcoes: [
          "Saco transparente comum de supermercado",
          "Saco branco leitoso, impermeável, resistente e com o símbolo internacional de infectante",
          "Saco de papel pardo fechado com fita adesiva",
          "Caixa de madeira aberta"
        ],
        correta: 1,
        explicacao: "Resíduos infectantes (Grupo A) requerem saco plástico branco leitoso com solda lateral contínua, símbolo de risco biológico e capacidade de suporte a peso e perfuração."
      },
      {
        id: "p_f_10",
        area: "Informática",
        pergunta: "Nos datacenters que processam servidores de inteligência artificial e nuvem, qual sistema consome grande fração de energia elétrica além do processamento?",
        opcoes: [
          "O sistema de som ambiente",
          "Os sistemas de climatização e refrigeração térmica de precisão dos racks",
          "A pintura externa dos gabinetes",
          "A iluminação das telas dos teclados"
        ],
        correta: 1,
        explicacao: "O resfriamento de servidores consome cerca de 30% a 40% de toda a energia de um datacenter, demandando tecnologias modernas como 'free cooling' e confinamento de corredores térmicos."
      },
      {
        id: "p_f_11",
        area: "Administração",
        pergunta: "O que é 'Ecoeficiência' em uma linha de produção industrial?",
        opcoes: [
          "Produzir mais bens e serviços utilizando progressivamente menos recursos naturais, energia e emitindo menos poluição",
          "Parar de fabricar produtos para evitar qualquer custo operacional",
          "Exportar produtos com defeito para mercados vizinhos",
          "Aumentar o número de horas extras dos operários sem novas tecnologias"
        ],
        correta: 0,
        explicacao: "O Conselho Empresarial Mundial para o Desenvolvimento Sustentável (WBCSD) define ecoeficiência como a entrega de valor com menor impacto ecológico e menor intensidade de materiais."
      },
      {
        id: "p_f_12",
        area: "Conhecimentos Gerais",
        pergunta: "Qual das seguintes ações contribui diretamente para o ODS 3 (Saúde e Bem-Estar) e ODS 13 (Ação contra a Mudança Global do Clima) simultaneamente?",
        opcoes: [
          "Redução das emissões veiculares de queima de diesel nas regiões metropolitanas",
          "Incentivo à compra de veículos utilitários pesados",
          "Aumento da fabricação de descartáveis de poliestireno",
          "Corte de árvores em calçadas para alargar ruas"
        ],
        correta: 0,
        explicacao: "Menos poluição por queima de diesel diminui tanto os gases que provocam o efeito estufa quanto as partículas inaláveis que geram asma, bronquite crônica e infartos."
      },
      {
        id: "p_f_13",
        area: "Enfermagem",
        pergunta: "No ambiente de saúde, o uso racional de antibióticos por prescrição rigorosa combate qual grande ameaça de saúde global?",
        opcoes: [
          "O surgimento e proliferação de superbactérias multirresistentes aos antimicrobianos",
          "O aumento da temperatura corporal em dias de chuva",
          "O desabastecimento de algodão nos leitos hospitalares",
          "A perda de validade das ampolas de soro fisiológico"
        ],
        correta: 0,
        explicacao: "A resistência microbiana aos antimicrobianos (RAM) é uma das maiores ameaças do século segundo a OMS. O descarte incorreto de remédios no esgoto também seleciona bactérias resistentes nos rios."
      },
      {
        id: "p_f_14",
        area: "Informática",
        pergunta: "Qual é o principal benefício ecológico da técnica de 'Virtualização de Servidores' em tecnologia corporativa?",
        opcoes: [
          "Permite rodar múltiplos servidores virtuais em uma única máquina física, reduzindo consumo elétrico e hardware descartado",
          "Impede que vírus de computador ataquem a rede elétrica",
          "Substitui a conexão de internet por cabos de barbante",
          "Obriga os usuários a trabalhar sem telas luminosas"
        ],
        correta: 0,
        explicacao: "Servidores físicos costumavam operar com apenas 10% a 15% de utilização de CPU. A virtualização consolida dezenas de instâncias em uma única máquina, economizando energia e refrigeração."
      },
      {
        id: "p_f_15",
        area: "Administração",
        pergunta: "O que é 'Greenwashing' (Lavagem Verde) praticado por algumas marcas comerciais?",
        opcoes: [
          "Lavar as instalações industriais com sabão vegetal neutro",
          "Criar propaganda com apelo ecológico enganoso ou sem comprovação técnica para mascarar práticas predatórias",
          "Plantar árvores ao redor da portaria da sede corporativa",
          "Publicar o balanço financeiro em papel reciclado"
        ],
        correta: 1,
        explicacao: "Greenwashing é o ato ilícito ou antiético de divulgar alegações enganosas de sustentabilidade sem respaldo de certificações independentes ou auditorias socioambientais reais."
      },
      {
        id: "p_f_16",
        area: "Conhecimentos Gerais",
        pergunta: "A bioeconomia sustentável baseada na floresta em pé promove qual modelo de desenvolvimento?",
        opcoes: [
          "Desmatamento total para plantação de pasto monocultura",
          "Valorização dos produtos da sociobiodiversidade (açaí, castanha, borracha, óleos essenciais) gerando renda comunitária e mantendo a floresta intacta",
          "Exportação de terra preta para países desérticos",
          "Proibição do contato humano com os frutos da floresta"
        ],
        correta: 1,
        explicacao: "A bioeconomia valoriza os ativos biológicos e os conhecimentos tradicionais dos povos da floresta, demonstrando que a floresta viva gera mais riqueza econômica de longo prazo do que o desmatamento."
      },
      {
        id: "p_f_17",
        area: "Enfermagem",
        pergunta: "Qual resíduo de saúde pertence ao Grupo B (substâncias químicas perigosas que exigem tratamento e descarte específico)?",
        opcoes: [
          "Medicamentos vencidos, quimioterápicos, desinfetantes e reagentes de laboratório",
          "Gaze com secreção salivar",
          "Embalagem de papelão limpa de remédios",
          "Restos de maçã consumida pelo paciente"
        ],
        correta: 0,
        explicacao: "O Grupo B engloba fármacos, reagentes analíticos, metais pesados e efluentes radiológicos e citostáticos que apresentam características de inflamabilidade, corrosividade ou toxicidade."
      },
      {
        id: "p_f_18",
        area: "Informática",
        pergunta: "O que é a 'Obsolescência Programada' no ciclo de vida de eletrônicos comerciais?",
        opcoes: [
          "A atualização automática do antivírus para proteger o usuário",
          "A prática de fabricantes projetarem deliberadamente produtos com vida útil artificialmente encurtada para forçar novas compras",
          "A reciclagem obrigatória de peças defeituosas pelas fábricas",
          "O teste de resistência de teclados contra quedas"
        ],
        correta: 1,
        explicacao: "Ao dificultar reparos, negar peças de reposição ou lançar softwares pesados para aparelhos antigos, indústrias aceleram o descarte prematuro de eletrônicos perfeitamente funcionais."
      },
      {
        id: "p_f_19",
        area: "Administração",
        pergunta: "Qual é a vantagem competitiva de uma organização certificar seu Sistema de Gestão Ambiental pela norma internacional ISO 14001?",
        opcoes: [
          "Garante conformidade legal, reduz desperdícios de insumos, previne multas e abre portas para clientes globais exigentes",
          "Elimina a obrigatoriedade de pagar salários aos empregados",
          "Permite descartar efluentes sem fiscalização dos órgãos estaduais",
          "Torna a empresa imune a crises macroeconômicas"
        ],
        correta: 0,
        explicacao: "A ISO 14001 implementa o ciclo PDCA (Plan-Do-Check-Act) contínuo para identificação de aspectos e impactos ambientais, conformidade legal e mitigação de riscos operacionais."
      },
      {
        id: "p_f_20",
        area: "Conhecimentos Gerais",
        pergunta: "Qual é o principal reservatório de água doce líquida acessível do planeta Terra?",
        opcoes: ["Os rios superficiais", "Os aquíferos subterrâneos de água doce", "As nuvens da estratosfera", "A água retida nas piscinas urbanas"],
        correta: 1,
        explicacao: "Mais de 95% de toda a água doce em estado líquido do planeta está armazenada no subsolo, em aquíferos como o Aquífero Guarani e o Aquífero Alter do Chão no Brasil."
      },
      {
        id: "p_f_21",
        area: "Enfermagem",
        pergunta: "Em termos de sustentabilidade hospitalar, como a gestão eficiente de leitos e materiais descartáveis pode reduzir a pegada ecológica de uma unidade de saúde?",
        opcoes: [
          "Evitando o uso de qualquer esterilização térmica",
          "Padronizando kits de procedimentos, evitando desperdício de insumos abertos e utilizando tecnologias de menor geração de resíduos",
          "Reutilizando agulhas descartáveis entre pacientes diferentes",
          "Desligando os monitores cardíacos dos pacientes internados"
        ],
        correta: 1,
        explicacao: "A enfermagem gerencial atua diretamente na racionalização do uso de materiais, prescrições de curativos baseadas em evidências e descarte correto, evitando compras excessivas e perdas de estoque."
      },
      {
        id: "p_f_22",
        area: "Informática",
        pergunta: "O que é a métrica 'PUE' (Power Usage Effectiveness) utilizada na engenharia de datacenters sustentáveis?",
        opcoes: [
          "A relação entre a energia total que entra na instalação e a energia efetivamente entregue aos equipamentos de TI",
          "A quantidade de e-mails enviados por segundo em uma empresa",
          "O preço unitário do quilowatt-hora cobrado na fatura",
          "A espessura dos cabos de fibra óptica submarinos"
        ],
        correta: 0,
        explicacao: "Um PUE ideal é 1.0 (onde 100% da energia vai para a computação). Datacenters antigos tinham PUE de 2.0 (gastando tanta energia em refrigeração e perdas quanto em servidores); modernas instalações operam com PUE de 1.1 a 1.2."
      },
      {
        id: "p_f_23",
        area: "Administração",
        pergunta: "Nas compras públicas e corporativas, o que caracteriza a prática de 'Licitações e Compras Sustentáveis'?",
        opcoes: [
          "Selecionar sempre o produto mais barato sem qualquer critério de qualidade ou origem legal",
          "Considerar critérios ambientais e sociais ao longo de todo o ciclo de vida do item (eficiência energética, selos verdes, toxicidade) além do preço de aquisição",
          "Adquirir mercadorias de empresas autuadas por trabalho análogo à escravidão",
          "Comprar apenas produtos descartáveis importados de plástico não-reciclável"
        ],
        correta: 1,
        explicacao: "A Instrução Normativa federal de compras sustentáveis estabelece que o melhor preço público deve considerar o Custo Total de Posse (TCO), economia de energia e baixo impacto ambiental."
      },
      {
        id: "p_f_24",
        area: "Conhecimentos Gerais",
        pergunta: "Qual das seguintes metas pertence ao ODS 7 da Agenda 2030 da ONU?",
        opcoes: [
          "Assegurar o acesso confiável, sustentável, moderno e a preço acessível à energia para todas e todos",
          "Subsidiar combustíveis fósseis pesados para aviação comercial",
          "Impedir a instalação de energia solar em comunidades rurais",
          "Aumentar o consumo de carvão mineral nas cidades costeiras"
        ],
        correta: 0,
        explicacao: "O ODS 7 preconiza duplicar a taxa global de melhoria da eficiência energética e aumentar substancialmente a participação de fontes renováveis na matriz energética mundial."
      },
      {
        id: "p_f_25",
        area: "Interdisciplinar",
        pergunta: "Como a integração interdisciplinar entre Enfermagem, Informática, Administração e Gestão Pública viabiliza um parque sustentável como o Parque Realengo?",
        opcoes: [
          "Cada área trabalha em segredo sem nunca conversar com as outras",
          "A Administração capta recursos e garante compliance legal; a Informática provê sensores, gêmeos digitais e automação; a Saúde/Enfermagem atua na promoção do bem-estar biopsicossocial comunitário",
          "Todas as profissões são substituídas por placas decorativas de metal",
          "A integração obriga todos os profissionais a realizarem tarefas idênticas sem especialização"
        ],
        correta: 1,
        explicacao: "Os desafios socioambientais urbanos contemporâneos são multifatoriais e complexos; sua resolução exige sinergia entre governança, tecnologia de dados, saúde coletiva e sustentabilidade biológica."
      }
    ],
    medio: [
      {
        id: "p_m_01",
        area: "Enfermagem",
        pergunta: "Em auditorias de biossegurança de um pronto-socorro, qual procedimento atende simultaneamente à prevenção da infecção hospitalar e à minimização de resíduos perigosos?",
        opcoes: [
          "O descarte de embalagens limpas secundárias de medicamentos na lixeira de resíduo infectante",
          "A segregação rigorosa na fonte, impedindo que resíduos comuns (papel, plástico) sejam descartados indevidamente em sacos brancos de resíduos biológicos",
          "Lavar gazes com secreção na pia comum de higienização das mãos",
          "Queimar agulhas usadas com maçarico nas enfermarias"
        ],
        correta: 1,
        explicacao: "O tratamento térmico (autoclavagem/incineração) de resíduo infectante é extremamente custoso e poluente. Descartar lixo comum no saco branco eleva custos hospitalares em até 5 vezes e gera emissões desnecessárias."
      },
      {
        id: "p_m_02",
        area: "Informática",
        pergunta: "No contexto da criptografia e redes de computadores, por que a transição de consenso de 'Proof-of-Work' (PoW) para 'Proof-of-Stake' (PoS) na rede Ethereum foi celebrada como um marco de sustentabilidade?",
        opcoes: [
          "Porque aumentou em 500% o uso de placas gráficas aceleradoras",
          "Porque reduziu em mais de 99,95% o consumo global de energia elétrica da rede blockchain ao dispensar mineradores computacionais contínuos",
          "Porque impediu que novos usuários criassem contas na rede",
          "Porque substituiu os servidores de internet por transistores mecânicos"
        ],
        correta: 1,
        explicacao: "O mecanismo Proof-of-Work consumia eletricidade equivalente a países inteiros. A migração para validação por Proof-of-Stake descarbonizou instantaneamente a rede eliminando hardware ocioso."
      },
      {
        id: "p_m_03",
        area: "Administração",
        pergunta: "Na análise de risco corporativo, o que são os chamados 'Ativos Encalhados' (Stranded Assets) provocados pela transição climática?",
        opcoes: [
          "Cargas de produtos retidas na alfândega por falta de nota fiscal",
          "Ativos operacionais (como reservas de petróleo não-extraídas, usinas a carvão ou frotas a diesel) que sofrem desvalorização prematura ou inviabilização por regulações climáticas",
          "Caminhões de entrega atolados em estradas de terra",
          "Móveis de escritório antigos guardados em almoxarifados"
        ],
        correta: 1,
        explicacao: "Com a precificação de carbono e metas líquidas zero, reservas de combustíveis fósseis e usinas ineficientes tornam-se passivos financeiros obsoletos antes do final de sua vida útil contábil projetada."
      },
      {
        id: "p_m_04",
        area: "Conhecimentos Gerais",
        pergunta: "Qual das metas do ODS 6 (Água Potável e Saneamento) estabelece a redução pela metade da proporção de esgoto não-tratado até 2030?",
        opcoes: [
          "Meta 6.3 de melhoria da qualidade da água e reciclagem segura",
          "Meta 6.9 de privatização de todos os rios internacionais",
          "Meta 6.0 de suspensão do consumo de água para a agricultura",
          "Meta 6.8 de proibição do tratamento de águas pluviais"
        ],
        correta: 0,
        explicacao: "A Meta 6.3 da ONU visa melhorar a qualidade da água globalmente eliminando despejos, minimizando a liberação de produtos químicos e aumentando a reciclagem e reutilização segura."
      },
      {
        id: "p_m_05",
        area: "Enfermagem",
        pergunta: "Qual é o impacto ambiental da contaminação de efluentes sanitários por hormônios residuais e medicamentos excretados por pacientes e descartados na pia?",
        opcoes: [
          "Acelera o crescimento de árvores frutíferas nas margens dos rios",
          "Causa desregulação endócrina na fauna aquática (feminização de peixes) e fomenta resistência antimicrobiana nos mananciais",
          "Purifica a água de compostos químicos pesados",
          "Evapora todo o nitrogênio presente na bacia hidrográfica"
        ],
        correta: 1,
        explicacao: "Micropoluentes emergentes (como antibióticos e estrógenos) não são totalmente removidos por estações convencionais de esgoto, alterando o sistema reprodutivo de animais aquáticos e ameaçando a biota."
      },
      {
        id: "p_m_06",
        area: "Informática",
        pergunta: "Em arquitetura de software moderno e computação em nuvem, o que caracteriza a prática de 'Carbon-Aware Computing'?",
        opcoes: [
          "Exibir o logo de uma árvore no cabeçalho das páginas web",
          "Agendar o processamento de cargas pesadas de dados (treinamento de IA, backups) para horários e regiões onde a matriz elétrica está mais limpa e solar/eólica",
          "Apagar o banco de dados dos clientes a cada 24 horas",
          "Obrigar servidores a operar exclusivamente em tensão de 12 volts"
        ],
        correta: 1,
        explicacao: "Sistemas 'carbon-aware' sincronizam a execução de jobs computacionais com a curva horária de intensidade de carbono da rede elétrica (gCO₂e/kWh), minimizando emissões reais."
      },
      {
        id: "p_m_07",
        area: "Administração",
        pergunta: "Na norma ISO 26000 (Diretrizes sobre Responsabilidade Social), qual é a diferença entre Filantropia Empresarial e Responsabilidade Social Corporativa (RSC) estratégica?",
        opcoes: [
          "A filantropia é obrigatória por lei e a RSC é proibida",
          "A filantropia resume-se a doações pontuais e externas, enquanto a RSC integra a ética socioambiental aos processos decisórios e à estratégia central de negócios",
          "A RSC refere-se apenas a investimentos na Bolsa de Valores",
          "Ambas são idênticas e focam apenas no lucro contábil a curto prazo"
        ],
        correta: 1,
        explicacao: "A responsabilidade social autêntica permeia a cadeia de valor, relações sindicais, respeito aos direitos humanos, governança corporativa e sustentabilidade operacional contínua."
      },
      {
        id: "p_m_08",
        area: "Conhecimentos Gerais",
        pergunta: "Qual é a relação ecológica entre o desmatamento na Amazônia e o regime de chuvas que abastece os reservatórios hidrelétricos do Sudeste brasileiro?",
        opcoes: [
          "O desmatamento na Amazônia aumenta as chuvas em São Paulo e Rio de Janeiro",
          "A floresta amazônica bombeia vapor de água através dos 'Rios Voadores'; o desmatamento compromete o transporte de umidade para o Centro-Sul do país",
          "Não existe qualquer conexão climática entre as regiões do país",
          "Os ventos equatoriais só sopram no sentido oposto para a Europa"
        ],
        correta: 1,
        explicacao: "Cada grande árvore amazônica evapotranspira até 1.000 litros de água por dia. Essas massas aéreas de vapor (Rios Voadores) são carreadas pelos ventos alísios e abastecem as bacias do Sudeste e Sul."
      },
      {
        id: "p_m_09",
        area: "Enfermagem",
        pergunta: "A Norma Regulamentadora NR-32 do Ministério do Trabalho e Emprego estabelece diretrizes fundamentais para a proteção dos profissionais de saúde em relação a:",
        opcoes: [
          "Horário comercial de abertura de farmácias",
          "Identificação de riscos biológicos, químicos e radiológicos, vacinação obrigatória e vedação ao reencape manual de agulhas",
          "Uso obrigatório de jaleco de pano nas ruas e refeitórios",
          "Compra exclusiva de materiais plásticos não-esterilizados"
        ],
        correta: 1,
        explicacao: "A NR-32 é o marco regulatório de segurança do trabalhador da saúde, proibindo expressamente o reencapamento de agulhas e exigindo dispositivos de segurança em perfurocortantes."
      },
      {
        id: "p_m_10",
        area: "Informática",
        pergunta: "Qual é a principal vantagem da computação Serverless e de Microsserviços para a sustentabilidade de infraestrutura digital?",
        opcoes: [
          "Desligamento dinâmico de recursos computacionais ociosos (scale-to-zero), consumindo energia apenas durante o tempo exato de execução da função",
          "Eliminação dos protocolos de segurança de rede",
          "Impossibilidade de armazenar dados em bancos relacionais",
          "Uso de servidores sem placa-mãe ou processador físico"
        ],
        correta: 0,
        explicacao: "A arquitetura serverless aloca milissegundos de computação sob demanda. Ao não manter instâncias dedicadas operando sem requisições, economiza energia e capacidade ociosa de datacenters."
      },
      {
        id: "p_m_11",
        area: "Administração",
        pergunta: "No GHG Protocol (protocolo global para contabilização de emissões corporativas de carbono), o que constituem as emissões de 'Escopo 3'?",
        opcoes: [
          "As emissões diretas da queima de combustível nas caldeiras da fábrica (Escopo 1)",
          "As emissões indiretas da eletricidade comprada da concessionária (Escopo 2)",
          "Todas as emissões indiretas ocorridas ao longo da cadeia de valor (fornecedores, transporte terceirizado, uso e descarte final do produto vendido)",
          "As emissões que ocorrem exclusivamente dentro do escritório da presidência"
        ],
        correta: 2,
        explicacao: "As emissões de Escopo 3 representam frequentemente mais de 80% do impacto climático total de uma corporação, demandando engajamento profundo de fornecedores e logística sustentável."
      },
      {
        id: "p_m_12",
        area: "Conhecimentos Gerais",
        pergunta: "O 'Relatório Brundtland' (Nosso Futuro Comum, 1987) definiu o Desenvolvimento Sustentável clássico como:",
        opcoes: [
          "Aquele que explora ao máximo os recursos atuais para que a próxima geração invente substitutos",
          "Aquele que atende às necessidades do presente sem comprometer a capacidade das gerações futuras de atenderem às suas próprias necessidades",
          "A paralisação imediata de qualquer atividade industrial no planeta",
          "O enriquecimento financeiro individual acima do interesse coletivo"
        ],
        correta: 1,
        explicacao: "Essa definição consagrada estabeleceu o princípio da equidade intergeracional, vinculando intrinsecamente desenvolvimento econômico, justiça social e equilíbrio ecológico."
      },
      {
        id: "p_m_13",
        area: "Enfermagem",
        pergunta: "Em uma Central de Material e Esterilização (CME), qual tecnologia de esterilização a baixa temperatura é considerada ambientalmente mais segura em substituição ao gás óxido de etileno?",
        opcoes: [
          "Imersão em solvente de querosene purificado",
          "Plasma de peróxido de hidrogênio (H₂O₂), cujos subprodutos finais são apenas água e oxigênio atóxicos",
          "Lavagem com detergente comum de cozinha",
          "Secagem ao sol sem embalagem estéril"
        ],
        correta: 1,
        explicacao: "O óxido de etileno é tóxico, mutagênico e deixa resíduos químicos perigosos. O plasma de peróxido de hidrogênio esteriliza materiais sensíveis ao calor e decompõe-se espontaneamente em H₂O e O₂ limpos."
      },
      {
        id: "p_m_14",
        area: "Informática",
        pergunta: "Qual é o impacto ecológico dos modelos de Inteligência Artificial Generativa de grande porte (LLMs) durante sua fase de treinamento?",
        opcoes: [
          "Zero consumo de energia ou recursos físicos",
          "Consumo massivo de gigawatts-hora de eletricidade e milhões de litros de água doce evaporada para resfriamento dos superclusters de GPUs",
          "Emissão direta de radiação atômica na sala de computadores",
          "Eliminação instantânea de dióxido de carbono do ar"
        ],
        correta: 1,
        explicacao: "Treinar modelos fundacionais com milhares de placas aceleradoras consome megawatts ininterruptos por meses e requer torres de resfriamento hídrico intensivo, exigindo técnicas de quantização e eficiência energética."
      },
      {
        id: "p_m_15",
        area: "Administração",
        pergunta: "No gerenciamento ambiental de uma empresa de logística, o que é o 'Efeito Chicote' e como ele afeta a pegada de sustentabilidade?",
        opcoes: [
          "O som das buzinas de caminhões no trânsito urbano",
          "A amplificação de oscilações na demanda ao longo da cadeia de suprimentos, resultando em estoques fantasmas, transporte desnecessário e desperdício de produtos",
          "A aceleração dos prazos de entrega por drones elétricos",
          "A contratação de motoristas especializados em rotas ecológicas"
        ],
        correta: 1,
        explicacao: "A falta de visibilidade e dados compartilhados faz com que pequenas variações no varejo gerem pedidos desproporcionais na indústria, acumulando resíduos, estoque vencido e emissões de transporte ocioso."
      },
      {
        id: "p_m_16",
        area: "Conhecimentos Gerais",
        pergunta: "Qual instrumento econômico e tributário é desenhado para aplicar na prática o 'Princípio do Poluidor-Pagador'?",
        opcoes: [
          "Precificação de carbono (imposto sobre carbono ou sistema de comércio de emissões - Cap and Trade)",
          "Isenção total de impostos para indústrias poluentes",
          "Empréstimos a juros subsidiados para empresas que desmatam",
          "Aumento de impostos sobre painéis de energia solar"
        ],
        correta: 0,
        explicacao: "A precificação de carbono internaliza o custo social e ambiental das emissões de GEEs nas planilhas de custo das empresas, incentivando financeiramente a inovação limpa."
      },
      {
        id: "p_m_17",
        area: "Enfermagem",
        pergunta: "Na saúde pública e vigilância sanitária, o que são as Doenças Tropicais Negligenciadas e como sua incidência está conectada ao saneamento ambiental precário?",
        opcoes: [
          "Doenças causadas pelo frio intenso dos polos",
          "Infecções (dengue, esquistossomose, leishmaniose) cuja transmissão é favorecida por acúmulo de lixo, água estagnada e ausência de redes de esgoto",
          "Doenças que só atacam animais de estimação vacinados",
          "Doenças transmitidas exclusivamente pela luz solar"
        ],
        correta: 1,
        explicacao: "A ausência de drenagem pluvial, acúmulo de recipientes plásticos e esgoto a céu aberto criam criadouros perfeitos para vetores biológicos como o Aedes aegypti e caramujos transmissores."
      },
      {
        id: "p_m_18",
        area: "Informática",
        pergunta: "O que preconiza o movimento 'Right to Repair' (Direito ao Reparo) voltado a computadores e smartphones?",
        opcoes: [
          "A proibição de abrir gabinetes de equipamentos eletrônicos",
          "A exigência legal de que fabricantes forneçam manuais de conserto, peças de reposição acessíveis e softwares sem travas proprietárias, combatendo o lixo eletrônico",
          "A obrigação de comprar um celular novo todo ano",
          "A proibição do uso de chaves de fenda por técnicos locais"
        ],
        correta: 1,
        explicacao: "Garantir o direito ao reparo estende a vida útil dos aparelhos, fomenta pequenas empresas de assistência técnica comunitária e evita a extração predatória de terras raras para novos circuitos."
      },
      {
        id: "p_m_19",
        area: "Administração",
        pergunta: "O que é a 'Matriz de Materialidade' em um relatório de sustentabilidade elaborado segundo o padrão global GRI (Global Reporting Initiative)?",
        opcoes: [
          "Uma lista de preços de materiais de escritório para compra mensal",
          "Uma matriz gráfica 2D que cruza a importância dos temas socioambientais para os stakeholders externos com o impacto significativo desses temas no negócio",
          "A planta arquitetônica das paredes de alvenaria da fábrica",
          "O cálculo da depreciação contábil de veículos pesados"
        ],
        correta: 1,
        explicacao: "A Matriz de Materialidade GRI orienta quais tópicos (mudanças climáticas, segurança do trabalho, ética, água) devem ser monitorados e reportados com máxima transparência prioritária."
      },
      {
        id: "p_m_20",
        area: "Conhecimentos Gerais",
        pergunta: "Qual é o papel ecológico das áreas úmidas (Wetlands e Manguezais) no sequestro de carbono comparado às florestas terrestres?",
        opcoes: [
          "Elas não sequestram carbono porque estão cobertas de água",
          "Sequestram o chamado 'Carbono Azul' em seus solos anaeróbios a taxas por hectare até 10 vezes superiores às florestas terrestres temperadas",
          "Emitem 100% de todo o oxigênio consumido pelas cidades",
          "Secam os oceanos através de raízes subterrâneas profundas"
        ],
        correta: 1,
        explicacao: "Os solos alagados de manguezais e brejos contêm pouquíssimo oxigênio, desacelerando a decomposição da matéria vegetal e estocando carbono orgânico por milênios nos sedimentos."
      },
      {
        id: "p_m_21",
        area: "Enfermagem",
        pergunta: "Na gestão de farmácias hospitalares, qual método de controle de estoque minimiza o descarte de medicamentos por perda de validade?",
        opcoes: [
          "Método PEPS / PVPS (Primeiro que Vence, Primeiro que Sai)",
          "Deixar os medicamentos mais velhos acumulados no fundo das gavetas",
          "Comprar 10 anos de estoque de uma só vez para conseguir desconto",
          "Não etiquetar a data de vencimento nas caixas"
        ],
        correta: 0,
        explicacao: "O PVPS (Primeiro que Vence, Primeiro que Sai) assegura a rotação correta dos lotes, garantindo que insumos com prazo mais próximo sejam utilizados antes, evitando descarte de fármacos perigosos."
      },
      {
        id: "p_m_22",
        area: "Informática",
        pergunta: "O que é 'Dark Data' (dados escuros) e qual é seu impacto ecológico invisível no consumo de energia dos datacenters?",
        opcoes: [
          "Dados armazenados com a tela do computador desligada",
          "Volumes maciços de dados digitais coletados e arquivados por empresas que nunca são analisados ou reutilizados, consumindo energia e discos de armazenamento ociosamente",
          "Arquivos secretos protegidos por senhas militares",
          "Programas que só funcionam no período noturno"
        ],
        correta: 1,
        explicacao: "Estima-se que mais de 50% dos dados armazenados por corporações sejam 'dados escuros' (logs antigos, backups duplicados), gerando emissões de carbono para alimentar servidores sem utilidade."
      },
      {
        id: "p_m_23",
        area: "Administração",
        pergunta: "O que define um modelo de negócio baseado na 'Servitização' ou 'Economia da Funcionalidade' (Product-as-a-Service)?",
        opcoes: [
          "A empresa não vende a propriedade do produto, mas sim o seu serviço e desempenho (ex: aluguel de iluminação ou pneus por km rodado), mantendo a posse para reciclagem",
          "Obrigar os clientes a limpar os escritórios da empresa",
          "Vender apenas para funcionários públicos",
          "Demissões coletivas para terceirizar a gestão"
        ],
        correta: 0,
        explicacao: "Ao reter a propriedade do produto físico, o fabricante tem o interesse financeiro direto de torná-lo ultradurável, modular, fácil de consertar e 100% reciclável ao final da vida útil."
      },
      {
        id: "p_m_24",
        area: "Conhecimentos Gerais",
        pergunta: "O que representa o fenômeno geográfico do 'Racismo Ambiental' em cidades metropolitanas?",
        opcoes: [
          "A pintura de calçadas de pedestres com cores variadas",
          "A imposição desproporcional de passivos ambientais (lixões, indústrias poluentes, encostas de risco e falta de saneamento) sobre populações periféricas e minorias étnico-raciais",
          "A proibição de entrada de animais silvestres em bairros nobres",
          "O cultivo de árvores de espécies exóticas em jardins botânicos"
        ],
        correta: 1,
        explicacao: "Cunhado pelo Dr. Robert Bullard, o racismo ambiental evidencia como a desigualdade socioespacial concentra a poluição e falta de infraestrutura verde nas comunidades vulnerabilizadas."
      },
      {
        id: "p_m_25",
        area: "Enfermagem",
        pergunta: "No contexto da sustentabilidade hospitalar, qual é a importância da ergonomia no trabalho de enfermagem (NR-17)?",
        opcoes: [
          "Evita lesões osteomusculares em profissionais, absenteísmo e garante sustentabilidade das equipes de saúde humana",
          "Obriga os enfermeiros a correrem nos corredores hospitalares",
          "Determina a cor das paredes dos centros cirúrgicos",
          "Exige o uso exclusivo de escadas em vez de elevadores"
        ],
        correta: 0,
        explicacao: "A sustentabilidade social no trabalho valoriza a ergonomia na movimentação de pacientes e pausas posturais, prevenindo LER/DORT e assegurando a integridade física da força de trabalho em saúde."
      },
      {
        id: "p_m_26",
        area: "Informática",
        pergunta: "Em design de interface e desenvolvimento web sustentável, como a otimização de imagens, uso de fontes do sistema e código limpo contribuem para a ecologia digital?",
        opcoes: [
          "Reduzem os megabytes transferidos pela rede mundial, diminuindo a eletricidade gasta em roteadores, antenas 5G e baterias de smartphones",
          "Fazem com que o monitor do computador emita menos calor sensível",
          "Impedem que robôs de busca indexem o site",
          "Eliminam a necessidade de cabos submarinos de telecomunicações"
        ],
        correta: 0,
        explicacao: "A internet consome cerca de 10% da eletricidade global. Páginas leves e eficientes diminuem o tráfego de dados na rede e reduzem a demanda energética de milhões de dispositivos móveis."
      },
      {
        id: "p_m_27",
        area: "Administração",
        pergunta: "Qual é a relação entre governança ética de sustentabilidade e a conformidade com a Lei Anticorrupção (Lei 12.846/2013) no Brasil?",
        opcoes: [
          "A lei anticorrupção incentiva pagamentos informais em licitações públicas",
          "Programas robustos de integridade (compliance) e governança transparente são o pilar 'G' do ESG, assegurando contratos éticos em projetos sustentáveis",
          "A conformidade impede qualquer empresa de obter lucro operacional",
          "A lei se aplica apenas a comerciantes de pequenos feirantes"
        ],
        correta: 1,
        explicacao: "A governança transparente (o pilar G do ESG) combate a corrupção, fraudes contratuais e superfaturamento, assegurando que investimentos públicos em infraestrutura verde sejam executados com integridade."
      },
      {
        id: "p_m_28",
        area: "Conhecimentos Gerais",
        pergunta: "O Parque Realengo Jornalista Susana Naspolini recuperou uma área urbana de 78 mil m² que no século XX abrigou qual instalação histórica?",
        opcoes: [
          "O antigo aeroporto internacional do Galeão",
          "A Fábrica de Cartuchos e Artefatos do Exército em Realengo",
          "O Palácio Imperial de Petrópolis",
          "Um porto marítimo de carga de contêineres"
        ],
        correta: 1,
        explicacao: "A área abrigou a histórica Fábrica de Cartuchos do Exército. Sua transformação em parque público sustentável devolveu à comunidade um espaço de lazer, natureza e dignidade social após décadas de abandono."
      },
      {
        id: "p_m_29",
        area: "Enfermagem",
        pergunta: "O que é o Programa de Gerenciamento de Resíduos de Serviços de Saúde (PGRSS) obrigatório em hospitais e clínicas?",
        opcoes: [
          "Um folheto ilustrado colado na porta dos quartos",
          "Documento técnico que planeja e descreve todas as etapas de manejo dos resíduos: geração, segregação, acondicionamento, transporte, tratamento e destinação final ambientalmente segura",
          "Uma lista de preços de desinfetantes químicos",
          "Um formulário de ponto eletrônico para funcionários"
        ],
        correta: 1,
        explicacao: "O PGRSS atende à RDC ANVISA 222/18 e à Resolução CONAMA 358/05, sendo a espinha dorsal técnica que impede que resíduos biológicos e químicos contaminem a sociedade e o meio ambiente."
      },
      {
        id: "p_m_30",
        area: "Interdisciplinar",
        pergunta: "Em um evento público de grande porte como a feira científica Projetec 2026, qual prática interdisciplinar demonstra responsabilidade socioambiental plena?",
        opcoes: [
          "Geração maciça de folhetos em papel plastificado que acabam jogados no chão",
          "Gestão lixo zero com segregação de recicláveis, medição de pegada de carbono, acessibilidade física plena e divulgação de dados em tempo real",
          "Distribuição indiscriminada de brindes plásticos descartáveis de uso único",
          "Uso ininterrupto de geradores a diesel ruidosos e poluentes"
        ],
        correta: 1,
        explicacao: "Um evento sustentável exemplar combina engenharia de processos com mínimo resíduo, comunicação acessível, inclusão social e prestação transparente de contas ecológicas."
      }
    ],
    dificil: [
      {
        id: "p_d_01",
        area: "Enfermagem",
        pergunta: "Em um hospital terciário que implementa metas de Descarbonização e Sustentabilidade Clínica (Global Green and Healthy Hospitals), qual estratégia de redução de gases anestésicos tem maior impacto imediato no GWP (Global Warming Potential)?",
        opcoes: [
          "Substituição do gás anestésico Desflurano (GWP de 2.540 e longa vida atmosférica) por Sevoflurano ou anestesia venosa total (TIVA)",
          "Aumento do fluxo de óxido nitroso em salas cirúrgicas com janelas abertas",
          "Uso de ventiladores mecânicos operados exclusivamente a vapor de álcool",
          "Eliminação de oxigênio medicinal puro na UTI"
        ],
        correta: 0,
        explicacao: "O Desflurano tem um potencial de aquecimento global (GWP) colossal de 2.540 vezes o do CO₂. Substituí-lo por Sevoflurano ou TIVA (anestesia intravenosa) reduz drasticamente a pegada de carbono hospitalar sem prejuízo clínico."
      },
      {
        id: "p_d_02",
        area: "Informática",
        pergunta: "Em computação forense e sustentabilidade de dados (Data Governance), como a técnica de 'Deduplicação de Blocos em Nível de Sistema de Arquivos' (ZFS / Btrfs) mitiga o consumo de energia em storages corporativos?",
        opcoes: [
          "Identifica blocos de dados idênticos criptograficamente por hashing SHA-256 e armazena apenas uma cópia física com ponteiros lógicos, reduzindo em até 70% o uso de discos mecânicos e SSDs",
          "Apaga metade dos dados salvos a cada reinicialização do sistema",
          "Comprime imagens reduzindo sua resolução para preto e branco",
          "Obriga o uso de mídias ópticas regraváveis em vez de discos rígidos"
        ],
        correta: 0,
        explicacao: "A deduplicação elimina redundâncias em escala de petabytes (como anexos idênticos de e-mail e imagens de máquinas virtuais), reduzindo a quantidade de drives girando e a energia de refrigeração."
      },
      {
        id: "p_d_03",
        area: "Administração",
        pergunta: "No contexto da Teoria dos Stakeholders de R. Edward Freeman e governança corporativa avançada, qual é a crítica fundamental ao dogma da 'Primazia do Acionista' (Shareholder Primacy de Milton Friedman)?",
        opcoes: [
          "A primazia do acionista é criticada por externalizar custos sociais e ecológicos para a sociedade em busca de lucro financeiro de curto prazo, negligenciando a perenidade sistêmica da empresa",
          "A teoria defende que os acionistas não devem receber nenhum dividendo financeiro",
          "Friedman defendia que todas as empresas deveriam se transformar em cooperativas sem dono",
          "Não há críticas, a primazia do acionista é a única regra aceita pelas Nações Unidas"
        ],
        correta: 0,
        explicacao: "A governança stakeholder-capitalism reconhece que colaboradores, clientes, comunidade e ecossistemas são partes integrantes e vulneráveis do negócio, exigindo valor compartilhado de longo prazo."
      },
      {
        id: "p_d_04",
        area: "Conhecimentos Gerais",
        pergunta: "O 'Relatório Stern sobre a Economia da Mudança do Clima' (Nicholas Stern, 2006) chegou a qual conclusão pioneira sobre a relação custo-benefício da ação climática antecipada?",
        opcoes: [
          "Que investir 1% a 2% do PIB global anual em mitigação imediata é infinitamente mais barato do que arcar com as perdas de 5% a 20% do PIB global decorrentes da inação climática futura",
          "Que as mudanças climáticas trariam lucros extraordinários imediatos para todas as nações do mundo",
          "Que nenhum país deve investir em energia limpa antes do ano de 2080",
          "Que o clima da Terra não responde a estímulos econômicos ou humanos"
        ],
        correta: 0,
        explicacao: "Lord Stern comprovou economicamente que a inação é economicamente irracional: o custo de prevenir catástrofes climáticas agora é uma fração minúscula dos prejuízos de inundações, secas e colapso de safras futuras."
      },
      {
        id: "p_d_05",
        area: "Enfermagem",
        pergunta: "Em um ensaio clínico epidemiológico que avalia a exposição crônica a desreguladores endócrinos (ftalatos e bisfenol A) presentes em dispositivos médicos hospitalares (como bolsas de PVC e equipos intravenosos), qual biomarcador é comumente quantificado?",
        opcoes: [
          "Metabólitos urinários conjugados de monoésteres de ftalato e BPA livre por cromatografia líquida acoplada à espectrometria de massas (LC-MS/MS)",
          "A contagem manual de plaquetas em lâmina de vidro comum",
          "O teor de açúcar dissolvido no soro glicosado",
          "A temperatura da ponta dos dedos das mãos"
        ],
        correta: 0,
        explicacao: "Dispositivos médicos de PVC utilizam plastificantes como DEHP que lixiviam para soluções lipídicas e sangue. A enfermagem moderna incentiva o uso de produtos médicos 'DEHP-free' e 'BPA-free' especialmente em neonatologia."
      },
      {
        id: "p_d_06",
        area: "Informática",
        pergunta: "No design de compiladores e linguagens de programação sustentáveis (Green Coding / Energy-Efficient Software), estudos de Pereira et al. (2017) revelaram qual hierarquia de eficiência energética entre linguagens computacionais?",
        opcoes: [
          "Linguagens compiladas de baixo nível nativo (como C, Rust e C++) consomem de 10 a 70 vezes menos joules de energia por operação do que linguagens interpretadas dinâmicas (como Python e Ruby)",
          "Linguagens interpretadas dinâmicas são as que menos consomem bateria em qualquer dispositivo",
          "Todas as linguagens de computador gastam exatamente a mesma quantidade de energia elétrica por instrução",
          "O consumo de energia depende unicamente da cor do código no editor de texto"
        ],
        correta: 0,
        explicacao: "Linguagens que compilam diretamente para código de máquina sem camadas de interpretação ou garbage collection intensivo executam tarefas em menos ciclos de clock, consumindo significativamente menos joules no processador."
      },
      {
        id: "p_d_07",
        area: "Administração",
        pergunta: "Na análise de ciclo de vida e precificação da pegada ambiental corporativa, o que é o 'Custo Social do Carbono' (Social Cost of Carbon - SCC)?",
        opcoes: [
          "O valor de mercado de um saco de carvão vegetal no comércio varejista",
          "A estimativa econômica monetizada dos danos cumulativos globais causados à sociedade pela emissão de 1 tonelada adicional de CO₂ em um determinado ano",
          "O custo do frete de caminhões que transportam filtros de escapamento",
          "O salário médio de um engenheiro ambiental recém-formado"
        ],
        correta: 1,
        explicacao: "O SCC calcula em dólares ou reais os custos futuros em perdas agrícolas, estragos de inundações em infraestruturas e mortalidade humana por calor causados por cada tonelada emitida, balizando políticas públicas."
      },
      {
        id: "p_d_08",
        area: "Conhecimentos Gerais",
        pergunta: "Qual é o mecanismo físico-químico que explica por que a perda da cobertura vegetal florestal em topos de morros intensifica o fenômeno das corridas de massa (deslizamentos de encostas) em temporais tropicais?",
        opcoes: [
          "As árvores atraem raios que quebram as pedras do morro",
          "O dossel florestal amortece a energia cinética das gotas da chuva, a evapotranspiração mantém o solo menos saturado e as raízes profundas ancoram as camadas do solo por coesão mecânica",
          "As raízes das árvores empurram a terra para baixo por gravidade",
          "A terra nua absorve toda a água sem sofrer nenhuma alteração de peso"
        ],
        correta: 1,
        explicacao: "Sem árvores, o impacto direto da chuva compacta os poros superficiais, a água satura rapidamente o horizonte de solo aumentando a pressão neutra da água nos poros e o peso da massa, provocando escorregamentos catastróficos."
      },
      {
        id: "p_d_09",
        area: "Enfermagem",
        pergunta: "Na gestão de biossegurança de Resíduos do Grupo C (Rejeitos Radioativos de Serviços de Saúde, como Iodo-131 e Tecnécio-99m em Medicina Nuclear), qual é o procedimento mandatório antes de qualquer liberação?",
        opcoes: [
          "Incineração em fogueira comum ao ar livre",
          "Decaimento radioativo monitorado em sala blindada de rejeitos até que a atividade atinja os níveis de dispensa estipulados pela CNEN (Comissão Nacional de Energia Nuclear)",
          "Despejo imediato na pia do banheiro dos quartos",
          "Diluição em água sanitária doméstica"
        ],
        correta: 1,
        explicacao: "Rejeitos com radionuclídeos de meia-vida curta devem ser segregados em recipientes blindados com chumbo e guardados no depósito de decaimento até que sua taxa de dose caia aos níveis de fundo natural seguros."
      },
      {
        id: "p_d_10",
        area: "Informática",
        pergunta: "Em algoritmos de consenso distribuído e sistemas tolerantes a falhas bizantinas (BFT), qual é o princípio que permite conciliar alta taxa de transações por segundo com baixo consumo energético?",
        opcoes: [
          "O uso de algoritmos de votação determinística por quórum ponderado (como Raft ou PBFT) sem quebra-cabeças criptográficos de força bruta computacional",
          "Acelerar o clock dos servidores até que ocorra superaquecimento",
          "Armazenar todas as senhas em texto puro desprotegido",
          "Desligar os firewalls da rede corporativa"
        ],
        correta: 0,
        explicacao: "Algoritmos baseados em quórum e mensagens de estado trocadas entre nós conhecidos operam com ordens de magnitude menos energia do que proof-of-work, viabilizando redes distribuídas altamente sustentáveis."
      },
      {
        id: "p_d_11",
        area: "Administração",
        pergunta: "No âmbito das metas climáticas corporativas fundamentadas na ciência (SBTi - Science Based Targets initiative), qual é a diferença entre uma meta de 'Neutralidade de Carbono' e uma meta de 'Net Zero'?",
        opcoes: [
          "Não há diferença, são meros termos de relações públicas",
          "A neutralidade foca apenas em compensar emissões com créditos sem necessariamente reduzi-las; o Net Zero exige corte real de pelo menos 90% a 95% das emissões absolutas da cadeia antes de neutralizar resíduos residuais com remoção permanente",
          "Net Zero permite emitir quanto carbono a empresa desejar desde que plante árvores em outro país",
          "A neutralidade de carbono só é válida para empresas do setor agrícola"
        ],
        correta: 1,
        explicacao: "A norma Net Zero do SBTi estabelece que nenhuma empresa pode alegar 'zero líquido' apenas comprando créditos de compensação baratos; a prioridade absoluta é a descarbonização profunda da operação e fornecedores."
      },
      {
        id: "p_d_12",
        area: "Conhecimentos Gerais",
        pergunta: "Em economia ambiental e valoração de recursos naturais, o que é o 'Método de Preços Hedônicos'?",
        opcoes: [
          "Um método que analisa como variações em atributos ambientais (como proximidade de um parque urbano verde ou níveis de ruído) se refletem diretamente nos preços de mercado de imóveis residenciais",
          "Um cálculo da quantidade de prazer químico gerado por doces industriais",
          "A tabela de preços cobrada por ingressos de shows musicais",
          "A cotação de moedas estrangeiras no mercado paralelo"
        ],
        correta: 0,
        explicacao: "O método estatístico de preços hedônicos quantifica o valor econômico do meio ambiente (ex: a valorização imobiliária em Realengo proporcionada pela proximidade do Parque Susana Naspolini) isolando variáveis urbanas."
      },
      {
        id: "p_d_13",
        area: "Enfermagem",
        pergunta: "Qual é a relação fisiopatológica comprovada entre episódios agudos de calor extremo urbano (ondas de calor em ilhas de calor urbanas) e a descompensação de pacientes nefrológicos e cardiológicos?",
        opcoes: [
          "O calor extremo causa hemoconcentração, desidratação osmótica, sobrecarga glomerular renal e aumento da viscosidade sanguínea com risco trombótico e infarto agudo",
          "O calor extremo impede que as pessoas sintam sede",
          "O calor extremo transforma o sangue venoso em água pura",
          "O calor acalma os batimentos cardíacos dispensando medicamentos"
        ],
        correta: 0,
        explicacao: "Em temperaturas acima de 38°C, a sudorese profusa e a vasodilatação periférica extrema forçam o débito cardíaco e reduzem o fluxo renal, precipitando insuficiência renal aguda e arritmias fatais em idosos."
      },
      {
        id: "p_d_14",
        area: "Informática",
        pergunta: "Em redes de telecomunicações móveis, qual avanço técnico do padrão 5G e Open-RAN contribui com a eficiência energética por bit transmitido comparado às gerações anteriores (3G/4G)?",
        opcoes: [
          "A tecnologia de Beamforming dinâmico e modo 'sleep' profundo das estações rádio-base (MIMO massivo que direciona o sinal apenas onde há usuários ativos)",
          "A emissão ininterrupta de ondas de rádio em 360 graus com potência máxima dia e noite",
          "A eliminação das baterias dos aparelhos smartphones",
          "O uso de sinais de rádio analógicos de baixa frequência"
        ],
        correta: 0,
        explicacao: "O 5G emprega antenas ativas e conformação de feixes inteligentes que concentram a energia na direção exata do terminal do usuário e colocam subsistemas em hibernação em milissegundos sem tráfego."
      },
      {
        id: "p_d_15",
        area: "Administração",
        pergunta: "O que preconiza o conceito de 'Economia Donut' (Doughnut Economics), formulado pela economista Kate Raworth da Universidade de Oxford?",
        opcoes: [
          "Uma estratégia de franchising para lojas de rosquinhas açucaradas",
          "Uma bússola para o desenvolvimento humano que busca atender a uma 'base social mínima' (educação, saúde, equidade) sem ultrapassar o 'teto ecológico planetário' (fronteiras da biosfera)",
          "Um modelo contábil que permite sonegação fiscal em paraísos fiscais",
          "A exigência de que todos os produtos tenham formato circular"
        ],
        correta: 1,
        explicacao: "O modelo do Donut substitui a obsessão míope pelo crescimento cego do PIB por um espaço seguro e justo para a humanidade, delimitado pelo piso social de dignidade e pelo teto dos limites biofísicos da Terra."
      },
      {
        id: "p_d_16",
        area: "Conhecimentos Gerais",
        pergunta: "Qual é a função geobiológica fundamental das micorrizas (associações simbióticas entre fungos do solo e raízes de árvores nativas) nos ecossistemas da Mata Atlântica?",
        opcoes: [
          "Eles envenenam as sementes de árvores para impedir o reflorestamento",
          "Expandem a rede superficial de absorção hídrica e fósforo em centenas de vezes e formam a 'Wood Wide Web', permitindo transferência de nutrientes e sinais de alerta bioquímico entre árvores",
          "Consomem todo o oxigênio do solo tornando a terra infértil",
          "Produzem substâncias plásticas que impermeabilizam as raízes"
        ],
        correta: 1,
        explicacao: "As redes hifais micorrízicas integram o microbioma do solo, trocando fósforo e minerais por açúcares da fotossíntese da planta, sendo indispensáveis para a resiliência ecológica de parques florestados."
      },
      {
        id: "p_d_17",
        area: "Enfermagem",
        pergunta: "No contexto da gestão em saúde da família e vigilância em saúde ambiental, o que caracteriza os 'Sistemas de Alerta Precoce de Ondas de Calor' (Heat Health Warning Systems - HHWS)?",
        opcoes: [
          "Sistemas meteorológicos e de enfermagem comunitária integrados que antecipam picos térmicos em bairros com ilhas de calor e acionam busca ativa e hidratação de populações vulneráveis",
          "Campanhas de distribuição de aquecedores elétricos no verão",
          "Avisos sonoros colocados nos carros de combate a incêndio",
          "Envio de faturas de luz com cobrança dobrada em dias de calor"
        ],
        correta: 0,
        explicacao: "A OMS recomenda os HHWS como intervenção de saúde pública preventiva crucial: a meteorologia emite o alerta e a enfermagem na atenção primária monitora idosos e doentes crônicos para prevenir óbitos evitáveis por choque térmico."
      },
      {
        id: "p_d_18",
        area: "Informática",
        pergunta: "Em bancos de dados relacionais e distribuídos de alta volumetria (Big Data ambiental), qual técnica de particionamento reduz drasticamente o I/O de disco e a queima de energia em consultas analíticas?",
        opcoes: [
          "Particionamento por faixa de tempo ou região geográfica e uso de formatos colunares com compressão vetorial (ex: Parquet ou ORC)",
          "Salvar todas as linhas em arquivos de texto plano não-indexados de 100 gigabytes",
          "Imprimir o banco de dados em papel a cada hora",
          "Desligar os índices B-Tree e realizar varreduras completas de tabela sempre"
        ],
        correta: 0,
        explicacao: "Formatos colunares comprimidos lêem apenas as colunas relevantes da consulta e ignoram partições inteiras não-requisitadas, diminuindo em até 90% a leitura em disco e a pegada energética do processamento."
      },
      {
        id: "p_d_19",
        area: "Administração",
        pergunta: "No Direito Societário e ESG, o que são as 'Empresas B' (B Corps ou Empresas de Benefício Mútuo)?",
        opcoes: [
          "Empresas de segunda categoria que não conseguiram registro na junta comercial",
          "Sociedades empresárias cujos estatutos sociais vinculam os deveres fiduciários dos administradores à geração de impacto socioambiental positivo mensurável, além do retorno financeiro",
          "Empresas que só podem comercializar produtos derivados de petróleo",
          "Empresas estatais deficitárias em processo de falência"
        ],
        correta: 1,
        explicacao: "A certificação internacional Sistema B audita rigorosamente padrões de transparência, governança, impacto ambiental, remuneração justa e relacionamento comunitário com valor jurídico formal."
      },
      {
        id: "p_d_20",
        area: "Conhecimentos Gerais",
        pergunta: "Qual é a relação entre a 'Curva de Keeling' e o Observatório de Mauna Loa no Havaí?",
        opcoes: [
          "É o gráfico contínuo da concentração de CO₂ atmosférico em partes por milhão (ppm) iniciado em 1958, comprovando o salto exponencial de 315 ppm para mais de 425 ppm na era industrial",
          "É a curva que mede a temperatura da lava vulcânica no oceano Pacífico",
          "É uma rota aérea comercial de aviões de passageiros",
          "É o cálculo da quantidade de salmão pescado no arquipélago havaiano"
        ],
        correta: 0,
        explicacao: "A Curva de Charles David Keeling é o registro geoclimático mais icônico da ciência moderna, demonstrando a curva exponencial contínua de dióxido de carbono na atmosfera terrestre impulsionada por queima fóssil."
      },
      {
        id: "p_d_21",
        area: "Enfermagem",
        pergunta: "Na análise de risco toxicológico ocupacional em centrais de quimioterapia oncológica, qual equipamento de proteção coletiva (EPC) com fluxo laminar e filtro HEPA absoluto é mandatório pela NR-32 para manipulação de antineoplásicos?",
        opcoes: [
          "Cabine de Segurança Biológica (CSB) Classe II Tipo B2 com exaustão de 100% do ar para o exterior sem recirculação",
          "Um ventilador comum de teto ligado em velocidade média",
          "Uma máscara de tecido cirúrgico descartável simples",
          "Uma cortina de plástico transparente na porta da sala"
        ],
        correta: 0,
        explicacao: "Medicamentos antineoplásicos são citotóxicos e mutagênicos. A CSB Classe II B2 protege o operador, o produto estéril e o ambiente, filtrando o ar e expelindo-o sem risco de retorno aos trabalhadores."
      },
      {
        id: "p_d_22",
        area: "Informática",
        pergunta: "Na criptografia assimétrica pós-quântica (PQC), por que algoritmos baseados em 'Reticulados' (Lattice-based cryptography, como Kyber e Dilithium) foram escolhidos pelo NIST também com foco em sustentabilidade operacional?",
        opcoes: [
          "Porque apresentam chaves relativamente compactas e tempos de execução em CPU extremamente rápidos com baixo consumo de ciclos e bateria em dispositivos IoT",
          "Porque utilizam transistores de madeira biodegradável",
          "Porque só funcionam se o usuário pagar uma taxa em moedas sustentáveis",
          "Porque eliminam a necessidade de certificados digitais HTTPS"
        ],
        correta: 0,
        explicacao: "A criptografia pós-quântica selecionada pelo NIST teve o consumo de energia e o tamanho de chaves como critérios fundamentais para que microcontroladores e celulares possam rodar segurança quântica sem drenar baterias."
      },
      {
        id: "p_d_23",
        area: "Administração",
        pergunta: "O que postula a 'Teoria da Criação de Valor Compartilhado' (Creating Shared Value - CSV), proposta por Michael Porter e Mark Kramer da Harvard Business School?",
        opcoes: [
          "Que as empresas devem gerar valor econômico de maneira a também criar valor para a sociedade, reconectando o sucesso dos negócios ao progresso social e ambiental",
          "Que o governo deve expropriar todas as fábricas privadas",
          "Que a sustentabilidade é apenas um centro de custo que deve ser minimizado ao máximo",
          "Que os lucros das empresas devem ser divididos exclusivamente com bancos credores"
        ],
        correta: 0,
        explicacao: "Porter e Kramer demonstraram que problemas sociais e ecológicos (como escassez de água ou poluição) geram custos econômicos internos; solucioná-los por meio de inovação central amplia a competitividade sustentável."
      },
      {
        id: "p_d_24",
        area: "Conhecimentos Gerais",
        pergunta: "O que estabelece o 'Princípio das Responsabilidades Comuns, Porém Diferenciadas' (CBDR) consagrado na Convenção-Quadro da ONU sobre Mudança do Clima (UNFCCC)?",
        opcoes: [
          "Que todos os países do mundo devem pagar exatamente o mesmo valor em dólares para combater o clima",
          "Que todos os países têm o dever comum de proteger o sistema climático, mas os países desenvolvidos devem liderar e fornecer financiamento/tecnologia devido à sua responsabilidade histórica pelo acúmulo de GEEs",
          "Que apenas os países pobres devem parar de queimar combustíveis fósseis",
          "Que os países ricos não têm nenhuma responsabilidade ecológica perante o planeta"
        ],
        correta: 1,
        explicacao: "O princípio CBDR reconhece a justiça climática: os países industrializados emitiram a grande maioria do CO₂ atmosférico nos últimos 150 anos e possuem maior capacidade financeira e tecnológica para liderar a mitigação."
      },
      {
        id: "p_d_25",
        area: "Interdisciplinar",
        pergunta: "Em um projeto de Gêmeo Digital Urbano (Digital Twin) de cidades inteligentes como o desenvolvido para o Parque Realengo, como a interoperabilidade de dados entre sensores físicos (IoT), modelos tridimensionais (BIM/GIS) e inteligência artificial maximiza a sustentabilidade urbana?",
        opcoes: [
          "Permite simular cenários hidrológicos de chuvas extremas, monitorar microclima em tempo real, antecipar manutenção preditiva de equipamentos e orientar a tomada de decisão com evidências científicas",
          "Serve apenas como adorno estético sem qualquer utilidade para a gestão pública",
          "Exige a instalação de servidores de carvão vegetal no parque",
          "Impede que os cidadãos acessem o espaço público presencialmente"
        ],
        correta: 0,
        explicacao: "Gêmeos digitais conectados à internet das coisas transformam cidades em sistemas vivos adaptativos: previnem alagamentos ajustando comportas preventivamente, monitoram conforto térmico e otimizam recursos públicos com base em dados reais."
      },
      {
        id: "p_d_26",
        area: "Enfermagem",
        pergunta: "Qual é o conceito de 'Saúde Planetária' (Planetary Health, The Lancet / Rockefeller Foundation) e por que ele transforma a prática contemporânea dos profissionais de saúde?",
        opcoes: [
          "O estudo exclusivo de doenças em astronautas no espaço",
          "O reconhecimento de que a saúde da civilização humana é indissociável da saúde dos sistemas naturais da Terra dos quais dependemos, exigindo que os cuidados clínicos considerem a sustentabilidade ambiental",
          "A proibição do atendimento médico a pessoas que moram em cidades poluídas",
          "A obrigatoriedade de construir hospitais dentro de cavernas subterrâneas"
        ],
        correta: 1,
        explicacao: "A Saúde Planetária conecta a medicina e a enfermagem às mudanças globais do antropoceno: destruição de ecossistemas degrada a nutrição, eleva pandemias zoonóticas e amplia enfermidades cardiorrespiratórias."
      },
      {
        id: "p_d_27",
        area: "Informática",
        pergunta: "Em bancos de dados NoSQL orientados a grafos (como Neo4j) aplicados à infraestrutura de caminhos e rotas de um parque, por que o algoritmo de Dijkstra implementado sobre matriz de adjacência esparsa é energeticamente mais eficiente do que consultas recursivas relacionais SQL?",
        opcoes: [
          "Porque os grafos armazenam ponteiros de relação físicos em memória (index-free adjacency), executando travessias de caminho mínimo em tempo O(E + V log V) sem junções cartesianas custosas",
          "Porque os bancos em grafos não precisam de processador para funcionar",
          "Porque o algoritmo de Dijkstra foi inventado por monges medievais",
          "Porque os bancos relacionais SQL não conseguem fazer contas matemáticas"
        ],
        correta: 0,
        explicacao: "A adjacência livre de índices em bancos de grafos evita o custo quadrático de JOINs em tabelas relacionais, permitindo calcular rotas de acessibilidade instantaneamente com consumo mínimo de ciclos de processador."
      },
      {
        id: "p_d_28",
        area: "Administração",
        pergunta: "No contexto da gestão estratégica de suprimentos (Supply Chain Management), o que caracteriza o modelo de compras circulares conhecido como 'Closed-Loop Supply Chain'?",
        opcoes: [
          "O fechamento dos depósitos com cadeados de aço reforçado",
          "A integração intencional das operações logísticas tradicionais diretas com as operações reversas, onde os produtos retornados são desmontados e reincorporados como matéria-prima na mesma cadeia de produção",
          "A contratação de caminhões que circulam apenas em trajetos circulares sem sair da cidade",
          "A proibição da venda de produtos para consumidores finais"
        ],
        correta: 1,
        explicacao: "Cadeias de suprimento de ciclo fechado projetam o produto desde a prancheta para desmontagem modular (Design for Disassembly), maximizando a retenção de valor econômico e minimizando extração virgem."
      },
      {
        id: "p_d_29",
        area: "Conhecimentos Gerais",
        pergunta: "A jornalista Susana Naspolini (1972–2022), homenageada no nome oficial do Parque Realengo, notabilizou-se na imprensa brasileira por qual bandeira do jornalismo público?",
        opcoes: [
          "A cobertura de celebridades e festivais de cinema internacionais",
          "A cobrança bem-humorada e incansável por saneamento básico, asfalto, iluminação, postos de saúde e dignidade urbana nas comunidades esquecidas das periferias do Rio de Janeiro",
          "A crítica esportiva exclusiva a partidas de futebol europeu",
          "A apresentação de cotações da bolsa de valores internacional"
        ],
        correta: 1,
        explicacao: "Susana Naspolini deu voz à população da Zona Oeste e subúrbios no quadro RJ Móvel, cobrando o poder público com irreverência, empatia e compromisso inarredável com o saneamento e a cidadania."
      },
      {
        id: "p_d_30",
        area: "Interdisciplinar",
        pergunta: "Qual é o principal legado técnico e educacional que o projeto V.I.D.A. e o Parque Realengo Susana Naspolini deixam para a feira de ciências Projetec 2026?",
        opcoes: [
          "Apenas um protótipo estético de computação gráfica sem aplicação real",
          "A demonstração viva de que a integração entre Gêmeo Digital 3D, gamificação de missões ecológicas e plataforma avaliativa interdisciplinar empodera a juventude a transformar suas comunidades com ciência, dados e sustentabilidade",
          "A exigência de que todos os alunos abandonem os estudos teóricos",
          "A distribuição de notas máximas sem nenhuma avaliação real"
        ],
        correta: 1,
        explicacao: "O V.I.D.A. prova que a tecnologia de ponta (3D, WebGL, IA, sustentabilidade, saúde e gestão) ganha seu verdadeiro sentido quando aplicada na vida real das pessoas, inspirando uma nova geração de cientistas e cidadãos conscientes."
      }
    ]
  }
};
