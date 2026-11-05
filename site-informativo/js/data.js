/**
 * BANCO DE DADOS E CONTEÚDO NARRATIVO OFICIAL — ECOCITY / PROJETEC 2026
 * Projeto V.I.D.A. — Parque Realengo Jornalista Susana Naspolini
 * 
 * Integração Canônica:
 * - Acervo oficial de pesquisa PROJETEC 2026 (Google Drive)
 * - Fotografias reais históricas e atuais auditadas (Prefeitura do Rio, 14ª BIA-SP, Arquivo Nacional)
 * - Indicadores Ambientais e Metas ODS auditadas (Data.rio, SMAC, Rio-Águas, OMS, ANVISA RDC 222/18)
 */

window.ECOCITY_DATA = {
  
  // Informações Institucionais do Projeto
  project: {
    name: "EcoCity — Projetec 2026",
    acronym: "Projeto V.I.D.A.",
    subtitle: "Vigilância e Indicadores Digitais Ambientais",
    tagline: "Tudo está conectado.",
    edition: "Projetec 2026 • Feira Tecnológica",
    studyCase: "Parque Urbano de Realengo Jornalista Susana Naspolini",
    location: "Realengo, Zona Oeste do Rio de Janeiro - RJ"
  },

  // Equipe Oficial de Pesquisa (conforme acervo oficial do Drive)
  team: [
    {
      name: "Daniel D. Mello Bonato",
      role: "Autor e Coordenador Geral",
      area: "Informática & Engenharia de Software",
      avatar: "botton_daniel.png",
      lead: true
    },
    {
      name: "Ana Clara Nascimento",
      role: "Pesquisadora & Conteúdo",
      area: "Biotecnologia & Meio Ambiente",
      avatar: null,
      lead: false
    },
    {
      name: "Maria Eduarda Leite",
      role: "Pesquisadora & Conteúdo",
      area: "Sustentabilidade Urbana & Sociedade",
      avatar: null,
      lead: false
    },
    {
      name: "Lucas Cordeiro",
      role: "Pesquisador & Desenvolvimento",
      area: "Informática & Modelagem Digital",
      avatar: null,
      lead: false
    },
    {
      name: "João Pedro Roldão",
      role: "Pesquisador & Desenvolvimento",
      area: "Informática & Sistemas Interativos",
      avatar: null,
      lead: false
    },
    {
      name: "Isaac Alisson",
      role: "Pesquisador & Desenvolvimento",
      area: "Informática & Análise de Dados",
      avatar: null,
      lead: false
    },
    {
      name: "Yasmin Vitória",
      role: "Pesquisadora & Saúde Coletiva",
      area: "Enfermagem & Saúde Pública",
      avatar: "botton_hiasmin.png",
      lead: false
    },
    {
      name: "Gianna Nogueira Vargas",
      role: "Pesquisadora & Saúde Coletiva",
      area: "Enfermagem & Resíduos de Serviços de Saúde",
      avatar: null,
      lead: false
    }
  ],

  // Professora Orientadora Oficial (confirmada no Drive: Botton e Camisa)
  advisor: {
    name: "Profª Amanda",
    title: "Professora Orientadora e Representante Oficial",
    department: "Núcleo de Ciências Tecnológicas & Saúde Coletiva",
    avatar: "botton_prof_amanda.jpg",
    bio: "Orientação metodológica contínua, articulação pedagógica interdisciplinar integrando os estudantes de Enfermagem e Informática e condução dos trabalhos para a apresentação na PROJETEC 2026."
  },

  // Métricas Fundamentais do Parque Realengo (Dados Consolidados da Prefeitura / FPJ / Rio-Águas)
  metrics: [
    {
      id: "area",
      label: "Área Urbana Recuperada",
      value: "76.000",
      unit: "m²",
      detail: "Antigo lote militar da Fábrica de Cartuchos transformado em área verde e polo comunitário 100% público."
    },
    {
      id: "cooling",
      label: "Alívio Térmico Máximo",
      value: "-5,8",
      unit: "°C",
      detail: "Redução comprovada da temperatura sob o dossel arbóreo e efeito da névoa das 5 super-torres."
    },
    {
      id: "drainage",
      label: "Bacia de Retenção Pluvial",
      value: "1.950",
      unit: "m³",
      detail: "Capacidade de amortecimento pluvial protegendo as ruas do entorno de Realengo contra enchentes."
    },
    {
      id: "trees",
      label: "Arborização Nativa",
      value: "3.700",
      unit: "árvores",
      detail: "Mudas de espécies nativas da Mata Atlântica (Pau-Brasil, Ipês, Jacarandás e Sapucaias)."
    },
    {
      id: "permeability",
      label: "Solo Permeável",
      value: "84,2",
      unit: "%",
      detail: "Superfície permeável com jardins de chuva filtrantes contra escoamento superficial acelerado."
    },
    {
      id: "towers",
      label: "Super-Torres Bioclimáticas",
      value: "5",
      unit: "torres",
      detail: "Torres treliçadas de 17m, 26m e 47m com bicos aspersores de névoa flash-evaporativa."
    }
  ],

  // Linha do Tempo Histórica do Parque Realengo
  timeline: [
    {
      year: "1910 — 1990",
      title: "Fábrica Militar de Cartuchos",
      desc: "O terreno de 7,6 hectares abrigava instalações do Ministério da Guerra. Área murada, estéril e inacessível à população, atuando como irradiador de calor no bairro."
    },
    {
      year: "2013 — 2020",
      title: "Mobilização Comunitária e Susana Naspolini",
      desc: "Ameaçado por projetos imobiliários privados, moradores de Realengo e a jornalista Susana Naspolini (RJ1) lideraram a histórica campanha pela criação de um parque 100% público e verde."
    },
    {
      year: "2021 — 2023",
      title: "Projeto Bioclimático & Obras (SbN)",
      desc: "Desenvolvimento do projeto executivo pela Prefeitura do Rio (FPJ, Rio-Urbe e Ecomimesis) com super-torres de névoa, macrodrenagem e plantio de mudas nativas da Mata Atlântica."
    },
    {
      year: "2024",
      title: "Inauguração do Parque Susana Naspolini",
      desc: "Abertura oficial à população com 76 mil m², espelho d'água de 1.300 m², Nave do Conhecimento, skatepark olímpico e anfiteatro em homenagem à jornalista."
    },
    {
      year: "2026",
      title: "EcoCity & PROJETEC 2026",
      desc: "Pesquisa interdisciplinar unindo informática e enfermagem: telemetria IoT aberta, análise clínica de estresse térmico e documentação interativa para a feira tecnológica."
    }
  ],

  // PARES DE COMPARAÇÃO FOTOGRÁFICA REAL (100% FOTOGRAFIAS REAIS VERIFICADAS)
  comparisons: [
    {
      id: "aerea",
      title: "Visão Aérea do Território (76.000 m²)",
      subtitle: "Da antiga Fábrica Militar de Cartuchos ao maior polo verde e bioclimático de Realengo",
      before: {
        year: "1910 — 2021",
        badge: "Antes: Terreno Militar Árido",
        image: "assets/fotos-reais/09_real_ortofoto_aerea_terreno.jpg",
        source: "SMAC / Catálogo Oficial da 14ª Bienal Internacional de Arquitetura de São Paulo",
        author: "Ortofoto Cartográfica Oficial / Prefeitura do Rio de Janeiro",
        date: "Levantamento aerofotogramétrico do terreno militar antes das obras",
        caption: "Ortofoto aérea oficial do lote militar de 76 mil m². Área murada e isolada por mais de um século, com galpões de armamentos, solo árido sem vegetação e alta irradiação de calor para o entorno."
      },
      after: {
        year: "2024 — 2026",
        badge: "Hoje: Parque Susana Naspolini Concluído",
        image: "assets/fotos-reais/01_real_vista_aerea_parque_prefeitura.jpg",
        source: "Prefeitura da Cidade do Rio de Janeiro",
        author: "Acervo Aerofotográfico Oficial da Prefeitura do Rio",
        date: "Fotografia aérea real de drone após a conclusão e entrega do parque",
        caption: "Fotografia aérea real de drone do parque concluído. Destaca-se o espelho d'água permanente de 1.300 m², bacia pluvial de 1.950 m³, bosque com 3.700 mudas nativas, quadras e as cinco super-torres."
      }
    },
    {
      id: "terrestre",
      title: "Ao Nível dos Olhos & Convivência Comunitária",
      subtitle: "De instalações militares muradas ao refúgio com famílias, passarela elevada e alívio térmico",
      before: {
        year: "1914",
        badge: "Antes: Fábrica de Armamentos (1914)",
        image: "assets/fotos-reais/00_historico_realengo_militar_1914.jpg",
        source: "Arquivo Nacional — Fundo Fotográfico Ministério da Guerra / Wikimedia Commons",
        author: "Registro Histórico Oficial do Exército Brasileiro (1914)",
        date: "Fotografia de época das instalações militares em Realengo",
        caption: "Fotografia histórica autêntica de 1914 registrando as instalações e piquete militar da Fábrica de Cartuchos de Realengo. A área permaneceu murada e vedada à sociedade civil por mais de um século."
      },
      after: {
        year: "2024 — 2026",
        badge: "Hoje: Bosque, Torres & Moradores",
        image: "assets/fotos-reais/10_real_parque_bosque_torres_visitantes.jpg",
        source: "14ª Bienal Internacional de Arquitetura de São Paulo / Ecomimesis",
        author: "Fotografia por Rafael Salim",
        date: "Registro documental com frequentadores no parque entregue",
        caption: "Fotografia real em alta resolução capturada no parque inaugurado. Visitantes caminham pela passarela suspensa entre o dossel arbóreo e a névoa das super-torres, sob alívio térmico de até -5,8°C."
      }
    }
  ],

  // 4 Materiais da Economia Circular
  materials: [
    {
      id: "aluminio",
      name: "Lata de Alumínio",
      type: "Metal Infinitamente Reciclável",
      impact: "Economiza 95% da energia elétrica necessária para produzir alumínio primário a partir da bauxita.",
      cycle: "Em 60 dias, uma lata descartada corretamente é coletada, fundida, reenvasada e volta às prateleiras.",
      stats: "Brasil lidera com 98,7% de reciclagem das latas de alumínio (PNRS)."
    },
    {
      id: "eletronico",
      name: "Smartphone & Lixo Eletrônico",
      type: "Metais Nobres e Minerais Críticos",
      impact: "Contém ouro, prata, cobre, lítio e terras raras. O descarte incorreto libera chumbo e cádmio no solo.",
      cycle: "Desmontagem especializada, separação de placas de circuito e recuperação hidrometalúrgica de metais.",
      stats: "1 tonelada de celulares velhos rende até 100x mais ouro que 1 tonelada de minério bruto de mina."
    },
    {
      id: "textil",
      name: "Vestuário & Tecidos",
      type: "Fibras Naturais e Sintéticas",
      impact: "A produção de uma única camiseta consome até 2.700 litros de água e gera microplásticos no ciclo de lavagem.",
      cycle: "Economia circular por doação, reforma, desfibragem mecânica para estofamentos e fiação reciclada.",
      stats: "Prolongar o uso de uma peça de roupa por 9 meses reduz sua pegada ambiental em 30%."
    },
    {
      id: "organico",
      name: "Resíduo Orgânico & Biomassa",
      type: "Biomassa & Nutrientes do Solo",
      impact: "Em aterros sem tratamento, a decomposição anaeróbica de comida gera gás metano (CH₄), 28x mais potente que o CO₂.",
      cycle: "Compostagem termofílica e vermicompostagem, transformando cascas e sobras em adubo orgânico fértil.",
      stats: "Mais de 50% do lixo residencial é matéria orgânica que poderia nutrir praças e hortas comunitárias."
    }
  ],

  // Os 4 Eixos de Pesquisa do Projetec 2026
  researchAxes: [
    {
      id: "eixo-clima",
      number: "01",
      title: "Clima Urbano & Soluções Baseadas na Natureza",
      area: "Biotecnologia & Meio Ambiente",
      summary: "Estudo dos mecanismos de resfriamento passivo e ativo para combate às ilhas de calor extremo na Zona Oeste do Rio.",
      topics: [
        "Efeito albedo em superfícies urbanas (asfalto escuro vs gramíneas e copas arbóreas)",
        "Resfriamento adiabático das 5 super-torres com bicos aspersores (gotículas microscópicas)",
        "Diferencial microclimático medido: até -5,8°C de alívio térmico comparado ao asfalto",
        "Sensoriamento contínuo da umidade relativa do ar e dispersão de névoa"
      ],
      sdg: ["ODS 11 — Cidades Sustentáveis", "ODS 13 — Ação Climática"]
    },
    {
      id: "eixo-agua",
      number: "02",
      title: "Macrodrenagem Resiliente & Biofiltração",
      area: "Biotecnologia & Engenharia Ambiental",
      summary: "Modelagem de drenagem biológica para amortecimento de tempestades severas e combate a alagamentos crônicos.",
      topics: [
        "Bacia de retenção de 1.950 m³ suportando precipitações torrenciais intensas",
        "Espelho d'água permanente de 1.300 m² integrado ao paisagismo e controle hidrológico",
        "Jardins de chuva e biovaletas que realizam a biofiltração de poluentes antes da infiltração",
        "84,2% de área permeável preservada contra escoamento superficial acelerado"
      ],
      sdg: ["ODS 6 — Água e Saneamento", "ODS 15 — Vida Terrestre"]
    },
    {
      id: "eixo-saude",
      number: "03",
      title: "Saúde Coletiva & Enfermagem Ambiental",
      area: "Enfermagem & Saúde Pública",
      summary: "Investigação dos impactos do estresse térmico, poluição atmosférica e gestão de resíduos na saúde humana.",
      topics: [
        "Prevenção de estresse térmico, síncope e desidratação em idosos e crianças sob sensações de 50°C",
        "Monitoramento do material particulado (PM2.5 e PM10) e agravamento de asma e bronquite",
        "Manejo de Resíduos de Serviços de Saúde (ANVISA RDC 222/2018): segregação e biossegurança",
        "Prevenção de arboviroses (Dengue, Chikungunya) pela drenagem correta de águas pluviais"
      ],
      sdg: ["ODS 3 — Saúde e Bem-Estar", "ODS 12 — Produção e Consumo Responsáveis"]
    },
    {
      id: "eixo-tecnologia",
      number: "04",
      title: "Telemetria IoT em Aberto & Interfaces Interativas",
      area: "Informática & Engenharia de Software",
      summary: "Desenvolvimento de firmware em microcontroladores de baixo custo, telemetria em nuvem e simulações educativas.",
      topics: [
        "Sensores de baixo custo (DHT22, PMS5003, MQ-135, HC-SR04) para monitoramento ambiental",
        "Transmissão e visualização em tempo real de parâmetros de qualidade do ar e microclima",
        "Nave do Conhecimento Realengo: polo de inclusão digital e capacitação em robótica",
        "Disponibilização de dados abertos sob as diretrizes de transparência do portal Data.rio"
      ],
      sdg: ["ODS 4 — Educação de Qualidade", "ODS 9 — Indústria, Inovação e Infraestrutura"]
    }
  ],

  // Equipamentos e Estruturas do Parque (FOTOGRAFIAS REAIS IDENTIFICADAS)
  structures: [
    {
      id: "torres",
      name: "Cinco Super-Torres de Climatização",
      tag: "Bioclimatismo",
      image: "assets/fotos-reais/10_real_parque_bosque_torres_visitantes.jpg",
      nightImage: "assets/fotos-reais/13_real_super_torre_noturna_iluminada.jpg",
      credit: "Fotografia por Rafael Salim / Ecomimesis (14ª Bienal de Arquitetura de SP)",
      desc: "Torres metálicas treliçadas (17m, 26m e torre central de 47m) equipadas com 236 bicos aspersores que vaporizam névoa d'água resfriando o microclima urbano por evaporação flash sem molhar os pedestres."
    },
    {
      id: "nave",
      name: "Nave do Conhecimento Realengo",
      tag: "Inclusão Digital",
      image: "assets/fotos-reais/06_real_nave_do_conhecimento.jpg",
      interiorImage: "assets/fotos-reais/07_real_nave_conhecimento_interior.jpg",
      credit: "Fotografia Oficial da Prefeitura da Cidade do Rio de Janeiro",
      desc: "Pavilhão tecnológico com domo futurista de 830 m² de área construída, laboratórios de robótica, informática e cursos gratuitos de capacitação profissional e tecnológica para a juventude da Zona Oeste."
    },
    {
      id: "lago",
      name: "Espelho d'Água & Bacia de Retenção Pluvial",
      tag: "Drenagem Sustentável",
      image: "assets/fotos-reais/01_real_vista_aerea_parque_prefeitura.jpg",
      credit: "Acervo Aerofotográfico Oficial da Prefeitura do Rio",
      desc: "Lâmina d'água de 1.300 m² conectada a um sistema de bacias de amortecimento pluvial com capacidade de 1.950 m³, mitigando enchentes críticas nas ruas do entorno de Realengo."
    },
    {
      id: "bosque",
      name: "Bosque da Mata Atlântica & Área de Convivência",
      tag: "Biodiversidade",
      image: "assets/fotos-reais/05_real_area_descanso_arborizacao.jpg",
      credit: "Fotografia Oficial da Prefeitura da Cidade do Rio de Janeiro",
      desc: "Maciço florestal com 3.700 árvores nativas catalogadas (Pau-Brasil, Ipês, Jacarandás e Sapucaias), atuando como corredor ecológico, abrigo para aves e barreira contra poluição sonora."
    },
    {
      id: "canteiros",
      name: "Canteiros Comunitários & Hortas Urbanas",
      tag: "Comunidade & Cidadania",
      image: "assets/fotos-reais/11_real_canteiros_comunitarios_familias.jpg",
      credit: "Fotografia por Rafael Salim / Ecomimesis (14ª Bienal de Arquitetura de SP)",
      desc: "Estruturas de alvenaria e canteiros elevados onde famílias e crianças do bairro cultivam espécies medicinais e hortaliças, integrando educação ambiental prática ao cotidiano do parque."
    },
    {
      id: "memorial",
      name: "Memorial & Mural Susana Naspolini",
      tag: "Memória & Cultura",
      image: "assets/fotos-reais/08_real_mural_susana_naspolini.jpg",
      credit: "Fotografia Oficial da Prefeitura da Cidade do Rio de Janeiro",
      desc: "Mural artístico e anfiteatro em homenagem à jornalista Susana Naspolini, que abraçou a causa da comunidade de Realengo na televisão e lutou pela criação deste parque público."
    }
  ],

  // Fontes Oficiais Auditadas
  sources: [
    {
      institution: "Data.rio / Instituto Pereira Passos (IPP)",
      title: "Mapeamento Cartográfico e Levantamento Territorial do Parque Realengo",
      domain: "data.rio",
      url: "https://www.data.rio/"
    },
    {
      institution: "Prefeitura da Cidade do Rio de Janeiro / FPJ",
      title: "Projeto Executivo e Plano de Arborização do Parque Realengo Susana Naspolini",
      domain: "prefeitura.rio",
      url: "https://prefeitura.rio/"
    },
    {
      institution: "Fundação Rio-Águas",
      title: "Dimensionamento Hidrológico da Bacia de Retenção Pluvial e Macrodrenagem",
      domain: "rio.rj.gov.br",
      url: "https://rio.rj.gov.br/"
    },
    {
      institution: "Alerta Rio / SMAC",
      title: "Série Histórica de Ondas de Calor e Boletins Micrometeorológicos da Zona Oeste",
      domain: "alertario.rio.rj.gov.br",
      url: "https://alertario.rio.rj.gov.br/"
    },
    {
      institution: "ANVISA (Brasil)",
      title: "Resolução RDC nº 222/2018 — Boas Práticas de Gerenciamento dos Resíduos de Serviços de Saúde",
      domain: "gov.br/anvisa",
      url: "https://www.gov.br/anvisa/pt-br"
    },
    {
      institution: "OMS (Organização Mundial da Saúde)",
      title: "Health Effects of Air Pollution and Extreme Heat in Urban Populations",
      domain: "who.int",
      url: "https://www.who.int/"
    },
    {
      institution: "14ª Bienal Internacional de Arquitetura de São Paulo (BIA-SP)",
      title: "Catálogo Oficial: Parque Realengo Jornalista Susana Naspolini (SMAC / Embyá / Ecomimesis)",
      domain: "bienal.org.br",
      url: "https://ambienteclima.prefeitura.rio/"
    },
    {
      institution: "Arquivo Nacional (Brasil)",
      title: "Fundo Fotográfico Histórico das Instalações Militares de Realengo (1910-1920)",
      domain: "arquivonacional.gov.br",
      url: "https://www.gov.br/arquivonacional/"
    }
  ]

};
