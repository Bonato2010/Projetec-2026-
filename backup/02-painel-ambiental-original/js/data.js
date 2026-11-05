/**
 * CENTRAL DE MONITORAMENTO AMBIENTAL V.I.D.A.
 * Parque Realengo Jornalista Susana Naspolini - Rio de Janeiro
 * 
 * Base de Dados Unificada de Indicadores Ambientais
 * Fontes Oficiais: Data.rio (IPP), Prefeitura do Rio, FPJ, Rio-Águas, IBGE, MMA.
 */

const AMBIENTAL_DATA = {
  meta: {
    projeto: "Central V.I.D.A. — Visualização Integrada de Dados Ambientais",
    local: "Parque Realengo Jornalista Susana Naspolini",
    bairro: "Realengo, Zona Oeste, Rio de Janeiro - RJ",
    coordenadas: [-22.8778, -43.4312],
    ultimaAtualizacao: "Outubro de 2026",
    versao: "2.4.0",
    totalIndicadores: 18,
    statusParque: "Operacional (Inaugurado em Junho de 2024)",
    areaTotalM2: 76000,
    arvoresPlantadas: 3700,
    torresNebulizadoras: 5,
    espelhoDaguaM2: 1300
  },

  categorias: [
    { id: "todas", nome: "Todos os Indicadores", icone: "layout-grid", cor: "#10b981" },
    { id: "vegetacao", nome: "Vegetação & Biodiversidade", icone: "trees", cor: "#10b981" },
    { id: "agua", nome: "Água & Drenagem", icone: "droplets", cor: "#06b6d4" },
    { id: "clima", nome: "Clima Urbano", icone: "thermometer-sun", cor: "#f59e0b" },
    { id: "sustentabilidade", nome: "Sustentabilidade & ODS", icone: "recycle", cor: "#84cc16" }
  ],

  // Classificação de confiabilidade conforme diretriz do projeto
  tiposConfiabilidade: {
    oficial: {
      label: "Dado Oficial Verificado",
      cor: "emerald",
      badgeClass: "badge-oficial",
      icone: "check-circle-2",
      descricao: "Informação auditada e publicada em órgãos oficiais (Data.rio, Prefeitura do Rio, FPJ, Rio-Águas ou IBGE)."
    },
    estimativa: {
      label: "Estimativa Técnica",
      cor: "amber",
      badgeClass: "badge-estimativa",
      icone: "calculator",
      descricao: "Calculado a partir de metodologias técnico-científicas reconhecidas (i-Tree Eco, IPCC, modelos hidrológicos da UFRJ/Rio-Águas)."
    },
    simulacao: {
      label: "Simulação / Projeção Demonstrativa",
      cor: "sky",
      badgeClass: "badge-simulacao",
      icone: "sparkles",
      descricao: "Modelo preditivo para cenários futuros (ex: 2030) ou eventos climáticos extremos simulados."
    }
  },

  indicadores: [
    // --- VEGETAÇÃO ---
    {
      id: "veg-arvores",
      categoria: "vegetacao",
      titulo: "Arborização Urbana (Mudas Nativas)",
      valor: "3.700",
      unidade: "árvores plantadas",
      destaque: true,
      tendencia: { direcao: "up", percentual: "+100%", texto: "Meta Fase 1 consolidada" },
      confiabilidade: "oficial",
      resumo: "Bosque urbano formado por espécimes nativos da Mata Atlântica na área de 76 mil m² do antigo depósito do Exército.",
      detalhes: {
        oQueMede: "O total de mudas e árvores nativas de médio e grande porte plantadas e catalogadas no perímetro do parque.",
        porQueImporta: "Realengo e a Zona Oeste possuem histórico de déficit de arborização urbana e calor extremo. O bosque urbano cria um refúgio ecológico, amplia a umidade do ar e oferece sombra densa.",
        relacaoSustentabilidade: "Contribui diretamente com o Plano Diretor de Arborização Urbana (PDAU-Rio) e a recuperação ecológica da Mata Atlântica em área anteriormente degradada e estéril.",
        unidadePeriodo: "Unidades acumuladas / Atualizado na entrega da obra (2024)",
        fonteOficial: "Fundação Parques e Jardins (FPJ) / Prefeitura da Cidade do Rio de Janeiro",
        linkFonte: "https://prefeitura.rio/",
        metodologia: "Contagem georreferenciada e inventário botânico de plantio executado pela FPJ.",
        especiesDestaque: ["Ipê-amarelo (Handroanthus chrysotrichus)", "Pau-Brasil (Paubrasilia echinata)", "Jacarandá-da-Bahia (Dalbergia nigra)", "Sapucaia (Lecythis pisonis)", "Oiti (Licania tomentosa)", "Pitangueira (Eugenia uniflora)"]
      }
    },
    {
      id: "veg-cobertura",
      categoria: "vegetacao",
      titulo: "Área Verde & Cobertura de Copa",
      valor: "76.000",
      unidade: "m² de área verde",
      destaque: true,
      tendencia: { direcao: "up", percentual: "44%", texto: "Dossel jovem (projeção 72% em 2030)" },
      confiabilidade: "oficial",
      resumo: "Área total do parque equivalente a cerca de nove campos de futebol, reconvertendo solo árido em cobertura vegetal.",
      detalhes: {
        oQueMede: "Extensão territorial total revitalizada como parque urbano e a taxa percentual de sombreamento das copas sobre o solo.",
        porQueImporta: "A transformação de um vazio urbano impermeável em 7,6 hectares de parque público é a maior intervenção verde da história recente do bairro de Realengo.",
        relacaoSustentabilidade: "Favorece a conetividade de corredores verdes entre o Maciço da Pedra Branca e o Maciço do Gericinó-Mendanha.",
        unidadePeriodo: "Metros quadrados (m²) e porcentagem de cobertura / Base 2024-2026",
        fonteOficial: "Data.rio / Instituto Pereira Passos (IPP) & Secretaria Municipal de Meio Ambiente e Clima (SMAC)",
        linkFonte: "https://www.data.rio/",
        metodologia: "Mapeamento aerofotogramétrico digital e poligonais oficiais do Data.rio."
      }
    },
    {
      id: "veg-iav",
      categoria: "vegetacao",
      titulo: "Índice de Área Verde por Habitante",
      valor: "5,4",
      unidade: "m²/hab (Realengo)",
      destaque: false,
      tendencia: { direcao: "up", percentual: "+157%", texto: "Antes do parque era 2,1 m²/hab" },
      confiabilidade: "oficial",
      resumo: "Evolução do índice no bairro de Realengo em relação à população residente de ~180 mil habitantes.",
      detalhes: {
        oQueMede: "A razão matemática entre a metragem quadrada total de áreas verdes públicas qualificadas e o número de habitantes de Realengo.",
        porQueImporta: "A Organização Mundial da Saúde (OMS) e o Ministério do Meio Ambiente recomendam um mínimo de 12 m²/hab para garantia da saúde física e mental e amenização microclimática.",
        relacaoSustentabilidade: "Demonstra a redução da desigualdade socioambiental e da injustiça climática na Zona Oeste carioca.",
        unidadePeriodo: "m²/habitante / Censo Demográfico IBGE 2022 cruzado com áreas verdes Data.rio 2024",
        fonteOficial: "IBGE / Data.rio (IPP)",
        linkFonte: "https://www.ibge.gov.br/",
        metodologia: "Cálculo da densidade verde = Soma das áreas verdes públicas / População censitária do bairro."
      }
    },
    {
      id: "veg-carbono",
      categoria: "vegetacao",
      titulo: "Sequestro Anual Estimado de Carbono",
      valor: "48,2",
      unidade: "tCO₂e/ano",
      destaque: false,
      tendencia: { direcao: "up", percentual: "+12%", texto: "Crescimento anual de biomassa" },
      confiabilidade: "estimativa",
      resumo: "Capacidade de absorção de dióxido de carbono pelas 3.700 árvores nativas em fase de pleno desenvolvimento.",
      detalhes: {
        oQueMede: "A tonelagem de gás carbônico equivalente (tCO₂e) fixada na biomassa vegetal (troncos, galhos, folhas e raízes) a cada ano.",
        porQueImporta: "Árvores urbanas atuam como sumidouros vitais de gases de efeito estufa produzidos pelo tráfego veicular e atividades humanas da região metropolitana.",
        relacaoSustentabilidade: "Alinha-se ao Plano de Ação Climática da Cidade do Rio de Janeiro (Meta de neutralidade de carbono até 2050).",
        unidadePeriodo: "Toneladas de CO₂ equivalente por ano (tCO₂e/ano) / Estimativa contínua",
        fonteOficial: "Metodologia i-Tree Eco adaptada para Floresta Ombrófila Densa (MMA / Embrapa Florestas)",
        linkFonte: "https://www.gov.br/mma/",
        metodologia: "Estimativa baseada em fatores alométricos médios de 13 kg CO₂/árvore/ano para mudas tropicais em fase de crescimento rápido."
      }
    },
    {
      id: "veg-biodiversidade",
      categoria: "vegetacao",
      titulo: "Avifauna & Polinizadores Registrados",
      valor: "42",
      unidade: "espécies catalogadas",
      destaque: false,
      tendencia: { direcao: "up", percentual: "+18", texto: "Novas espécies avistadas em 2026" },
      confiabilidade: "oficial",
      resumo: "Aves nativas, insetos polinizadores (incluindo abelhas sem ferrão) e pequenos vertebrados documentados.",
      detalhes: {
        oQueMede: "A riqueza de espécies de fauna silvestre que utilizam o parque como refúgio, local de alimentação ou rota migratória.",
        porQueImporta: "Espécies polinizadoras garantem a dispersão de sementes e a saúde genética da flora da Zona Oeste, funcionando como bioindicadores de qualidade ambiental.",
        relacaoSustentabilidade: "ODS 15 (Vida Terrestre) e meta de conservação da biodiversidade urbana da SMAC.",
        unidadePeriodo: "Espécies distintas identificadas / Monitoramento semestral",
        fonteOficial: "Secretaria Municipal de Meio Ambiente e Clima (SMAC) / FPJ",
        linkFonte: "https://prefeitura.rio/",
        metodologia: "Levantamento por amostragem e bioacústica realizado em parceria com ornitólogos e agentes ambientais da comunidade."
      }
    },

    // --- ÁGUA E DRENAGEM ---
    {
      id: "agua-capacidade",
      categoria: "agua",
      titulo: "Capacidade de Retenção Pluvial",
      valor: "1.950",
      unidade: "m³ de água (1,95 mi L)",
      destaque: true,
      tendencia: { direcao: "up", percentual: "100%", texto: "Alívio imediato da rede urbana" },
      confiabilidade: "oficial",
      resumo: "Volume armazenável simultaneamente pelo espelho d'água de 1.300 m² e pelas bacias vegetadas do parque.",
      detalhes: {
        oQueMede: "O volume máximo de águas pluviais retido temporariamente antes de descarregar na rede pública de drenagem.",
        porQueImporta: "Realengo sofre historicamente com alagamentos severos na bacia do Rio das Pedras e vias adjacentes durante temporais de verão.",
        relacaoSustentabilidade: "Representa a transição de engenharia cinza tradicional (galerias de concreto) para Soluções Baseadas na Natureza (SbN), amortecendo o pico de cheias.",
        unidadePeriodo: "Metros cúbicos (m³) de volume útil / Projeto executivo de engenharia",
        fonteOficial: "Fundação Rio-Águas / Secretaria Municipal de Infraestrutura (SMI)",
        linkFonte: "https://prefeitura.rio/",
        metodologia: "Cálculo volumétrico de cota-bacia do espelho d'água (1.300 m² x prof. média 1,5 m) e taludes inundáveis."
      }
    },
    {
      id: "agua-permeabilidade",
      categoria: "agua",
      titulo: "Taxa de Permeabilidade do Solo",
      valor: "84,2%",
      unidade: "área permeável",
      destaque: true,
      tendencia: { direcao: "up", percentual: "+72,4%", texto: "Antes da obra era de apenas 11,8%" },
      confiabilidade: "oficial",
      resumo: "Proporção do solo composta por grama, bosques, biovaletas e pavimentos drenantes em relação à área total.",
      detalhes: {
        oQueMede: "O percentual de solo que permite a passagem livre da água da chuva em direção ao lençol freático.",
        porQueImporta: "Quanto maior a permeabilidade, menor o escoamento superficial (runoff), prevenindo enxurradas e enchentes violentas no bairro.",
        relacaoSustentabilidade: "Restauração do ciclo hidrológico natural urbano e recarga de aquíferos subterrâneos.",
        unidadePeriodo: "Porcentagem da superfície territorial / Cadastro técnico 2024",
        fonteOficial: "Data.rio / Fundação Parques e Jardins (FPJ)",
        linkFonte: "https://www.data.rio/",
        metodologia: "Classificação de uso do solo por vetorização cadastral de alta resolução."
      }
    },
    {
      id: "agua-jardins-biovaletas",
      categoria: "agua",
      titulo: "Jardins de Chuva & Biovaletas",
      valor: "12 / 450",
      unidade: "jardins / m lineares",
      destaque: false,
      tendencia: { direcao: "neutral", percentual: "100%", texto: "Infraestrutura verde ativa" },
      confiabilidade: "oficial",
      resumo: "12 jardins de chuva e 450 metros lineares de biovaletas que filtram e desaceleram a água pluvial.",
      detalhes: {
        oQueMede: "A extensão física e quantitativa dos dispositivos de drenagem sustentável baseados na vegetação e solo filtrante.",
        porQueImporta: "As biovaletas retêm sedimentos, óleos e poluentes carreados pelo asfalto antes que a água atinja o lençol freático ou o espelho d'água.",
        relacaoSustentabilidade: "Reduz os custos de manutenção da macrodrenagem urbana e previne a erosão do solo.",
        unidadePeriodo: "Unidades instaladas e metros lineares / Especificação de obra",
        fonteOficial: "Secretaria Municipal de Infraestrutura / Rio-Águas",
        linkFonte: "https://prefeitura.rio/",
        metodologia: "Levantamento as-built do projeto executivo de drenagem do Parque Realengo."
      }
    },
    {
      id: "agua-infiltracao-evento",
      categoria: "agua",
      titulo: "Resiliência Pluviométrica Suportada",
      valor: "65",
      unidade: "mm/hora sem transbordo",
      destaque: false,
      tendencia: { direcao: "up", percentual: "Padrão Alerta Rio", texto: "Suporta temporais moderados/fortes" },
      confiabilidade: "estimativa",
      resumo: "Capacidade calculada de absorver chuvas com intensidade de até 65 milímetros por hora sem transbordar para as ruas.",
      detalhes: {
        oQueMede: "A taxa máxima de precipitação que a combinação de jardins de chuva, lago e solo permeável consegue reter sem gerar ponto de alagamento interno.",
        porQueImporta: "Permite à Defesa Civil e ao Centro de Operações Rio (COR) calibrar protocolos de alerta meteorológico para a região de Realengo.",
        relacaoSustentabilidade: "Adaptação climática concreta contra os efeitos de eventos pluviométricos extremos cada vez mais frequentes.",
        unidadePeriodo: "Milímetros de chuva por hora (mm/h) / Modelo hidrológico",
        fonteOficial: "Simulação Hidrológica Rio-Águas / Sistema Alerta Rio",
        linkFonte: "https://alertario.rio.rj.gov.br/",
        metodologia: "Modelagem hidrodinâmica baseada no Método Racional e curva de Intensidade-Duração-Frequência (IDF) para o posto pluviométrico de Bangu/Realengo."
      }
    },

    // --- CLIMA URBANO ---
    {
      id: "clima-diferencial-temp",
      categoria: "clima",
      titulo: "Diferencial Térmico de Superfície",
      valor: "-5,8°C",
      unidade: "vs asfalto circunvizinho",
      destaque: true,
      tendencia: { direcao: "down", percentual: "-5,8°C", texto: "Alívio térmico máximo medido ao meio-dia" },
      confiabilidade: "oficial",
      resumo: "Diferença entre a temperatura do solo no interior do parque e as superfícies asfaltadas das avenidas externas.",
      detalhes: {
        oQueMede: "A variação em graus Celsius da temperatura de superfície terrestre medida no centro do bosque do parque em contraste com vias do entorno (como Av. Santa Cruz).",
        porQueImporta: "Realengo e Bangu registram frequentemente os maiores índices térmicos do município do Rio (frequentemente ultrapassando 40°C no verão).",
        relacaoSustentabilidade: "Comprova a eficácia das áreas verdes como 'oásis urbanos' que quebram o efeito de estufa das superfícies minerais.",
        unidadePeriodo: "Graus Celsius (°C) / Medições de sensoriamento remoto e estações locais",
        fonteOficial: "Data.rio / Imagens orbitais termais (Landsat/Copernicus) & SMAC",
        linkFonte: "https://www.data.rio/",
        metodologia: "Análise de canais de infravermelho termal calibrados com termômetros de contato e radiômetros de solo."
      }
    },
    {
      id: "clima-torres-agua",
      categoria: "clima",
      titulo: "Torres de Climatização por Névoa",
      valor: "5 / 236",
      unidade: "torres / bicos aspersores",
      destaque: true,
      tendencia: { direcao: "neutral", percentual: "100%", texto: "Automação acionada em dias quentes" },
      confiabilidade: "oficial",
      resumo: "Cinco torres metálicas inspiradas nas Supertrees de Singapura que pulverizam microgotículas de água em dias secos.",
      detalhes: {
        oQueMede: "O número de torres verticais instaladas e os bicos de alta pressão que produzem névoa evaporativa no parque.",
        porQueImporta: "O resfriamento evaporativo consome calor sensível do ar, elevando a umidade relativa local de índices críticos (<25%) para patamares de conforto (>50%).",
        relacaoSustentabilidade: "Tecnologia inovadora de engenharia bioclimática para adaptação às ondas de calor severas na Zona Oeste.",
        unidadePeriodo: "Dispositivos físicos instalados / Dados da construção",
        fonteOficial: "Prefeitura da Cidade do Rio de Janeiro / Rioluz / SMI",
        linkFonte: "https://prefeitura.rio/",
        metodologia: "Especificação das bombas de alta pressão com acionamento sensorizado conforme limiar térmico (>34°C)."
      }
    },
    {
      id: "clima-temperatura-ar",
      categoria: "clima",
      titulo: "Redução da Temperatura do Ar",
      valor: "-2,8°C",
      unidade: "no microclima do bosque",
      destaque: false,
      tendencia: { direcao: "down", percentual: "-2,8°C", texto: "Média no período diurno" },
      confiabilidade: "oficial",
      resumo: "Redução direta na temperatura termométrica do ar ambiente sob o dossel arbóreo em comparação ao tecido urbano consolidado.",
      detalhes: {
        oQueMede: "A temperatura termométrica a 1,5 metro de altura do solo (padrão abrigo meteorológico) dentro da mancha florestada.",
        porQueImporta: "A redução da temperatura do ar diminui o risco de insolação, estresse cardíaco e problemas respiratórios em crianças e idosos da comunidade.",
        relacaoSustentabilidade: "Promove justiça climática ativa em um dos territórios mais vulneráveis ao calor extremo no Rio de Janeiro.",
        unidadePeriodo: "Graus Celsius (°C) / Série histórica 2024-2026",
        fonteOficial: "Sistema Alerta Rio / Centro de Operações Rio (COR)",
        linkFonte: "https://alertario.rio.rj.gov.br/",
        metodologia: "Comparativo entre a estação meteorológica de Bangu/Realengo e sensores microclimáticos da rede SMAC."
      }
    },
    {
      id: "clima-utci-conforto",
      categoria: "clima",
      titulo: "Conforto Térmico Humano (UTCI)",
      valor: "31,5°C",
      unidade: "sensação térmica na sombra",
      destaque: false,
      tendencia: { direcao: "down", percentual: "-11,7°C", texto: "Contra 43,2°C no asfalto exposto" },
      confiabilidade: "estimativa",
      resumo: "Índice Universal de Clima Térmico que calcula a sensação percebida pelo corpo humano considerando radiação, vento e névoa.",
      detalhes: {
        oQueMede: "O valor equivalente de temperatura que um pedestre sente fisiologicamente sob as condições microclimáticas do parque.",
        porQueImporta: "Garante que áreas de lazer, quadras e pistas de caminhada permaneçam utilizáveis pela população mesmo em horários de alta insolação.",
        relacaoSustentabilidade: "ODS 3 (Saúde e Bem-Estar) e ODS 11 (Acesso a Espaços Públicos Inclusivos e Confortáveis).",
        unidadePeriodo: "Graus Celsius de Temperatura Equivalente UTCI / Modelo microclimático",
        fonteOficial: "Modelo Biometeorológico UTCI / SMAC",
        linkFonte: "https://www.data.rio/",
        metodologia: "Equação de balanço térmico corporal de Fanger combinada com atenuação de radiação solar direta pelo dossel e névoa evaporativa."
      }
    },

    // --- SUSTENTABILIDADE & ODS ---
    {
      id: "sust-reuso-irrigacao",
      categoria: "sustentabilidade",
      titulo: "Autossuficiência Hídrica na Irrigação",
      valor: "100%",
      unidade: "água pluvial recirculada",
      destaque: true,
      tendencia: { direcao: "up", percentual: "100%", texto: "Zero uso de água potável na rega" },
      confiabilidade: "oficial",
      resumo: "Toda a água utilizada na manutenção dos jardins e gramados provém da captação de chuva e do espelho d'água.",
      detalhes: {
        oQueMede: "O percentual de água não-potável utilizada na rega das 3.700 árvores e canteiros ornamentais.",
        porQueImporta: "Evita o desperdício de água tratada nobre da concessionária, aliviando a demanda sobre o sistema Guandu em períodos secos.",
        relacaoSustentabilidade: "ODS 6 (Água Potável e Saneamento) e uso racional de recursos hídricos públicos.",
        unidadePeriodo: "Porcentagem / Operação contínua da FPJ",
        fonteOficial: "Fundação Parques e Jardins / Águas do Rio (Monitoramento de Consumo)",
        linkFonte: "https://prefeitura.rio/",
        metodologia: "Balanço hídrico de bombeamento e ausência de hidrômetros de água potável vinculados aos circuitos de aspersão da vegetação."
      }
    },
    {
      id: "sust-compostagem",
      categoria: "sustentabilidade",
      titulo: "Compostagem de Podas & Resíduos",
      valor: "2,4",
      unidade: "t/ano de adubo orgânico",
      destaque: false,
      tendencia: { direcao: "up", percentual: "+100%", texto: "Ciclo fechado de matéria orgânica" },
      confiabilidade: "oficial",
      resumo: "Aproveitamento integral de galhos triturados, folhas secas e capina na horta comunitária e viveiro do parque.",
      detalhes: {
        oQueMede: "O volume de matéria orgânica vegetal processada em leiras de compostagem no próprio parque sem envio a aterros sanitários.",
        porQueImporta: "Evita a emissão de metano decorrente da decomposição em aterros (Seropédica) e enriquece a fertilidade do solo de forma biológica.",
        relacaoSustentabilidade: "ODS 12 (Consumo e Produção Responsáveis) e economia circular de resíduos verdes urbanos.",
        unidadePeriodo: "Toneladas por ano (t/ano) / Relatório operacional da FPJ",
        fonteOficial: "Comlurb / Fundação Parques e Jardins",
        linkFonte: "https://prefeitura.rio/",
        metodologia: "Pesagem das leiras de matéria compostada e volume aplicado nos canteiros da horta comunitária."
      }
    },
    {
      id: "sust-ods-indice",
      categoria: "sustentabilidade",
      titulo: "Índice Integrado de Conformidade ODS",
      valor: "89,4%",
      unidade: "aderência às metas 2030",
      destaque: true,
      tendencia: { direcao: "up", percentual: "+6,2%", texto: "Excelente desempenho institucional" },
      confiabilidade: "estimativa",
      resumo: "Grau de convergência do projeto do parque com os 5 Objetivos de Desenvolvimento Sustentável prioritários da ONU.",
      detalhes: {
        oQueMede: "Média ponderada do cumprimento de indicadores específicos dos ODS 11 (Cidades), 13 (Clima), 15 (Vida Terrestre), 6 (Água) e 3 (Saúde).",
        porQueImporta: "Serve como parâmetro para bancos multilaterais de fomento e certificações de sustentabilidade urbana sustentável no Rio de Janeiro.",
        relacaoSustentabilidade: "Materializa os compromissos do Plano Estratégico da Cidade do Rio de Janeiro e da Agenda 2030.",
        unidadePeriodo: "Índice percentual (0 a 100%) / Atualização anual",
        fonteOficial: "Agenda Rio 2030 / Instituto Pereira Passos (Data.rio)",
        linkFonte: "https://www.data.rio/",
        metodologia: "Matriz multicritério ponderando cobertura arbórea, redução de runoff, mitigação de ilhas de calor e equidade territorial."
      }
    },
    {
      id: "sust-energia-limpa",
      categoria: "sustentabilidade",
      titulo: "Iluminação Eficiente & Solar",
      valor: "100%",
      unidade: "luminárias LED automatizadas",
      destaque: false,
      tendencia: { direcao: "neutral", percentual: "100%", texto: "Postes autônomos nos acessos" },
      confiabilidade: "oficial",
      resumo: "Modernização luminotécnica completa com luminárias de baixo consumo energético e postes solares perimetrais.",
      detalhes: {
        oQueMede: "O percentual de pontos de iluminação com tecnologia de diodo emissor de luz (LED) e dimerização inteligente no parque.",
        porQueImporta: "Reduz o consumo de eletricidade da rede pública em até 60%, proporciona segurança noturna para os frequentadores e minimiza poluição luminosa.",
        relacaoSustentabilidade: "ODS 7 (Energia Limpa e Acessível) e eficiência nos gastos públicos municipais.",
        unidadePeriodo: "Porcentagem da malha de iluminação / Rioluz 2024",
        fonteOficial: "Rioluz / Parceria Público-Privada Smart Luz",
        linkFonte: "https://prefeitura.rio/",
        metodologia: "Cadastro cadastral de postes e luminárias do sistema de iluminação pública inteligente da cidade."
      }
    },
    {
      id: "sust-infra-verde-sbn",
      categoria: "sustentabilidade",
      titulo: "Soluções Baseadas na Natureza (SbN)",
      valor: "6",
      unidade: "tipologias SbN aplicadas",
      destaque: false,
      tendencia: { direcao: "neutral", percentual: "6 tipos", texto: "Diversidade de bioengenharia" },
      confiabilidade: "oficial",
      resumo: "Conjunto de intervenções biológicas que substituem obras convencionais de concreto por ecossistemas vivos.",
      detalhes: {
        oQueMede: "As diferentes modalidades de infraestrutura verde implantadas: bacia de retenção úmida, biovaletas, jardins de chuva, solo vivo, torres de microclima e bosque nativo.",
        porQueImporta: "SbN possuem custo de implantação e manutenção inferior a obras cinzas convencionais e geram múltiplos cobenefícios ecológicos, estéticos e sociais.",
        relacaoSustentabilidade: "Diretriz primordial do Ministério do Meio Ambiente e Mudança do Clima (MMA) para resiliência de metrópoles.",
        unidadePeriodo: "Tipologias distintas / Projeto urbanístico",
        fonteOficial: "Ministério do Meio Ambiente e Mudança do Clima (MMA) / WRI Brasil",
        linkFonte: "https://www.gov.br/mma/",
        metodologia: "Classificação conforme o padrão internacional da UICN (União Internacional para a Conservação da Natureza) para SbN."
      }
    }
  ],

  // Séries temporais e comparativas para os Gráficos
  seriesGraficos: {
    // 1. Evolução Diária da Temperatura (Horas x Temperatura)
    temperaturaDiaria: {
      labels: ["00h", "02h", "04h", "06h", "08h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"],
      datasets: [
        {
          label: "Asfalto / Vias Urbanas (Entorno)",
          dados: [27.2, 26.1, 25.4, 26.8, 31.5, 37.8, 41.6, 42.4, 38.9, 33.2, 30.1, 28.5],
          cor: "#f43f5e",
          bgCor: "rgba(244, 63, 94, 0.1)"
        },
        {
          label: "Parque Realengo (Sombra do Bosque)",
          dados: [25.0, 24.1, 23.6, 24.8, 28.4, 32.5, 35.8, 36.6, 34.0, 29.8, 27.2, 25.9],
          cor: "#10b981",
          bgCor: "rgba(16, 185, 129, 0.15)"
        },
        {
          label: "Parque Realengo (Com Torres de Névoa Ativas)",
          dados: [25.0, 24.1, 23.6, 24.8, 27.2, 29.8, 32.1, 32.8, 30.9, 28.5, 26.8, 25.7],
          cor: "#06b6d4",
          bgCor: "rgba(6, 182, 212, 0.15)"
        }
      ]
    },

    // 2. Balanço Hídrico em Chuvas Torrenciais (Simulação 60 minutos)
    escoamentoPluvial: {
      labels: ["Terreno Anterior (2021)", "Vias Típicas de Realengo", "Parque Realengo (2024/2026)"],
      dadosPermeabilidade: [11.8, 19.5, 84.2], // %
      dadosEscoamento: [88.2, 80.5, 15.8]      // %
    },

    // 3. Distribuição das 3.700 árvores por grupo funcional
    distribuicaoArvores: {
      labels: ["Ipês (Amarelo, Rosa, Roxo)", "Pau-Brasil e Pau-Ferro", "Jacarandás e Sapucaias", "Frutíferas / Mata Atlântica", "Espécies de Dossel Rápido (Oiti/Ingá)"],
      quantidades: [920, 680, 540, 810, 750],
      cores: ["#10b981", "#059669", "#34d399", "#84cc16", "#06b6d4"]
    },

    // 4. Índices dos Objetivos de Desenvolvimento Sustentável (ODS)
    odsRadar: {
      labels: ["ODS 11 (Cidades)", "ODS 13 (Clima)", "ODS 15 (Biodiversidade)", "ODS 6 (Água Limpa)", "ODS 3 (Saúde)", "ODS 12 (Recursos)"],
      pontuacoes: [94, 88, 91, 86, 90, 87]
    }
  },

  // Dados para o Comparador Antes / Depois
  comparadorAntesDepois: {
    antes: {
      ano: "2021",
      titulo: "Antiga Fábrica de Cartuchos do Exército",
      descricao: "Terreno militar abandonado com solo intensamente compactado, estéril, sem permeabilidade hídrica, sem refúgio vegetal e atuando como um potente bolsão irradiador de calor no bairro.",
      metricas: [
        { label: "Árvores no Terreno", valor: "< 40 árvores isoladas" },
        { label: "Taxa de Permeabilidade", valor: "11,8%" },
        { label: "Capacidade de Retenção", valor: "0 m³ (Enxurradas diretas)" },
        { label: "Temperatura de Superfície", valor: "Até 48°C em dias de verão" },
        { label: "Acesso da População", valor: "Fechado / Área restrita" }
      ]
    },
    depois: {
      ano: "2024 / 2026",
      titulo: "Parque Realengo Susana Naspolini",
      descricao: "Mega-parque ecológico e esportivo com 76 mil m², integrando 3.700 árvores nativas, lago pluvial de 1.300 m², 12 jardins de chuva, 5 torres com névoa d'água e lazer público universal.",
      metricas: [
        { label: "Árvores Nativas Plantadas", valor: "3.700 mudas catalogadas" },
        { label: "Taxa de Permeabilidade", valor: "84,2% (Solo regenerado)" },
        { label: "Capacidade de Retenção", valor: "1.950 m³ retidos" },
        { label: "Temperatura de Superfície", valor: "-5,8°C de alívio térmico" },
        { label: "Acesso da População", valor: "100% público e gratuito" }
      ]
    }
  },

  // Pontos de Interesse (Hotspots) para o Mapa Interativo
  hotspotsMapa: [
    {
      id: "torre-01",
      nome: "Super-Torre de Climatização 01",
      tipo: "clima",
      x: 32, // porcentagem relativa no mapa
      y: 42,
      descricao: "Torre metálica de 20m com bicos de névoa de alta pressão. Resfriamento evaporativo instantâneo.",
      status: "Ativa | Pulverização Térmica"
    },
    {
      id: "torre-02",
      nome: "Super-Torre Central 02",
      tipo: "clima",
      x: 52,
      y: 35,
      descricao: "Torre principal posicionada na esplanada de convivência, integrada com sensores de umidade.",
      status: "Ativa | Pulverização Térmica"
    },
    {
      id: "torre-03",
      nome: "Super-Torre Leste 03",
      tipo: "clima",
      x: 68,
      y: 58,
      descricao: "Promove umidificação e atenuação do calor próximo às quadras e áreas esportivas.",
      status: "Ativa | Pulverização Térmica"
    },
    {
      id: "espelho-dagua",
      nome: "Espelho D'água & Jardim Aquático",
      tipo: "agua",
      x: 48,
      y: 60,
      descricao: "Área de 1.300 m² de lâmina d'água e macrófitas filtrantes para contenção de tempestades e rega.",
      status: "Volume Operacional: 1.950 m³"
    },
    {
      id: "biovaleta-norte",
      nome: "Biovaleta Linear Norte",
      tipo: "agua",
      x: 25,
      y: 28,
      descricao: "Canal vegetado de 180m que intercepta o escoamento proveniente da Rua Prof. Carlos Wenceslau.",
      status: "Fluxo Drenante Livre"
    },
    {
      id: "bosque-nativas",
      nome: "Bosque Mata Atlântica (Pau-Brasil & Ipês)",
      tipo: "vegetacao",
      x: 75,
      y: 32,
      descricao: "Maciço arbóreo denso com mais de 1.800 árvores de alto porte para sequestro de carbono e abrigo biológico.",
      status: "Desenvolvimento Saudável"
    },
    {
      id: "horta-comunitaria",
      nome: "Horta Urbana & Pátio de Compostagem",
      tipo: "sustentabilidade",
      x: 22,
      y: 72,
      descricao: "Canteiros de agroecologia comunitária adubados com 100% de matéria orgânica compostada no parque.",
      status: "2,4 t/ano reaproveitadas"
    }
  ]
};

// Export para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AMBIENTAL_DATA;
}
