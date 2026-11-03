/**
 * PROJETO 01 — MAPA INTERATIVO DO PARQUE REALENGO
 * Base de Dados dos Pontos de Interesse (POIs) e Infraestrutura
 * Parque Realengo Jornalista Susana Naspolini — Rio de Janeiro
 */

const MAPA_PARQUE_DATA = {
  meta: {
    nome: "Parque Realengo Jornalista Susana Naspolini",
    areaM2: 76000,
    arvores: 3700,
    horario: "Terça a Domingo: 06h00 às 22h00 (Segunda: Manutenção)",
    localizacao: "Rua Professor Carlos Wenceslau, Realengo, Rio de Janeiro - RJ"
  },

  categorias: [
    { id: "todas", nome: "Todos os Locais", icone: "map-pin", cor: "#10b981" },
    { id: "torres", nome: "Torres de Climatização", icone: "cloud-drizzle", cor: "#06b6d4" },
    { id: "agua", nome: "Lagos & Drenagem", icone: "droplets", cor: "#3b82f6" },
    { id: "natureza", nome: "Bosques & Jardins", icone: "trees", cor: "#10b981" },
    { id: "lazer", nome: "Esportes & Lazer", icone: "activity", cor: "#f59e0b" },
    { id: "servicos", nome: "Serviços & Acesso", icone: "info", cor: "#8b5cf6" }
  ],

  pontos: [
    {
      id: "super-torre-01",
      nome: "Super-Torre de Climatização 01 (Norte)",
      categoria: "torres",
      x: 35, // % no mapa
      y: 32,
      icone: "tower",
      status: "Em Operação (Aspersão Ativa)",
      descricao: "Torre bioclimática de 20m inspirada nas Supertrees de Singapura, com esguichos de alta pressão que vaporizam névoa d'água para alívio térmico imediato na praça de entrada.",
      destaques: ["Resfriamento evaporativo", "25m de raio de alcance", "Iluminação LED noturna"],
      acessibilidade: "100% acessível por rampas suaves"
    },
    {
      id: "super-torre-02",
      nome: "Super-Torre Central 02",
      categoria: "torres",
      x: 52,
      y: 38,
      icone: "tower",
      status: "Em Operação (Aspersão Ativa)",
      descricao: "A maior torre do complexo, localizada na esplanada cívica do parque, cercada por espelhos de descanso e pergolados com trepadeiras nativas.",
      destaques: ["Sensor térmico automatizado", "Névoa ultrafina", "Ponto de encontro"],
      acessibilidade: "Totalmente plana com piso podotátil"
    },
    {
      id: "super-torre-03",
      nome: "Super-Torre Leste 03 (Esportes)",
      categoria: "torres",
      x: 70,
      y: 45,
      icone: "tower",
      status: "Em Operação (Aspersão Ativa)",
      descricao: "Posicionada estrategicamente ao lado do complexo poliesportivo para refrescar atletas e frequentadores das quadras de areia e skate.",
      destaques: ["Umidificação do microclima esportivo", "Redução de até 4°C no ar"],
      acessibilidade: "Acesso direto pela alameda principal"
    },
    {
      id: "espelho-dagua",
      nome: "Espelho D'água & Bacia de Retenção",
      categoria: "agua",
      x: 48,
      y: 62,
      icone: "lake",
      status: "Operação Normal (Nível 85%)",
      descricao: "Lago ornamental de 1.300 m² integrado ao sistema de drenagem sustentável. Funciona como bacia de amortecimento para até 1.950 m³ de água de tempestades.",
      destaques: ["Capacidade 1,95 milhão de litros", "Jardim aquático filtrante", "Deck de observação contemplativa"],
      acessibilidade: "Guarda-corpos acessíveis e deck com piso antiderrapante"
    },
    {
      id: "biovaletas-norte",
      nome: "Biovaletas & Jardins de Chuva Norte",
      categoria: "agua",
      x: 25,
      y: 22,
      icone: "filter",
      status: "Fluxo Natural",
      descricao: "Canal vegetado de 450 metros lineares com gramíneas e pedras filtrantes que interceptam o escoamento da Rua Prof. Carlos Wenceslau, evitando alagamentos.",
      destaques: ["Filtragem natural de sedimentos", "Recarga do lençol freático", "Solução Baseada na Natureza"],
      acessibilidade: "Visível a partir das passarelas elevadas"
    },
    {
      id: "bosque-mata-atlantica",
      nome: "Bosque Nativo da Mata Atlântica",
      categoria: "natureza",
      x: 78,
      y: 28,
      icone: "trees",
      status: "Crescimento Pleno",
      descricao: "Maciço florestal com mais de 1.800 árvores adultas e mudas nativas, incluindo Pau-Brasil, Ipês (amarelo, roxo e rosa), Jacarandás e Oitis.",
      destaques: ["Sombra densa (-3°C na temperatura do ar)", "Habitat para 42 espécies de aves", "Pista de caminhada rústica"],
      acessibilidade: "Caminho de saibro estabilizado compatível com cadeiras de rodas"
    },
    {
      id: "anfiteatro-susana",
      nome: "Anfiteatro Jornalista Susana Naspolini",
      categoria: "lazer",
      x: 38,
      y: 52,
      icone: "theater",
      status: "Programação Cultural Ativa",
      descricao: "Espaço cultural a céu aberto com arquibancadas integradas à topografia gramada para shows comunitários, peças teatrais, saraus e eventos educativos.",
      destaques: ["Capacidade para 600 pessoas", "Concha acústica integrada", "Homenagem à Susana Naspolini"],
      acessibilidade: "Rampa lateral e áreas reservadas para PCD"
    },
    {
      id: "complexo-esportivo",
      nome: "Quadras Poliesportivas & Pista de Skate",
      categoria: "lazer",
      x: 75,
      y: 65,
      icone: "court",
      status: "Uso Livre",
      descricao: "Duas quadras poliesportivas com piso especial, quadra de vôlei de areia, pista de skate (bowl e street) e academia para a terceira idade.",
      destaques: ["Iluminação LED noturna", "Piso de absorção de impacto", "Bebedouros refrigerados"],
      acessibilidade: "Acesso em nível com calçadas táteis"
    },
    {
      id: "horta-agroecologica",
      nome: "Horta Urbana & Pátio de Compostagem",
      categoria: "natureza",
      x: 20,
      y: 68,
      icone: "sprout",
      status: "Colheita Comunitária Aberta",
      descricao: "Canteiros educativos agroecológicos onde a comunidade cultiva hortaliças, ervas medicinais e temperos adubados com as 2,4 t/ano de podas compostadas no parque.",
      destaques: ["Compostagem in-loco de 100% das podas", "Oficinas de educação ambiental"],
      acessibilidade: "Canteiros elevados para cultivo ergonômico"
    },
    {
      id: "portal-principal",
      nome: "Portal de Acesso & Centro de Informações",
      categoria: "servicos",
      x: 15,
      y: 42,
      icone: "building",
      status: "Recepção e Apoio",
      descricao: "Entrada principal pela Rua Professor Carlos Wenceslau, com base de segurança da Guarda Municipal, sanitários públicos acessíveis, fraldário e guarda-bicicletas.",
      destaques: ["Posto de atendimento ao visitante", "Aluguel de bicicletas comunitárias", "Sanitários climatizados"],
      acessibilidade: "Piso podotátil e mapas táteis com legenda em Braille"
    }
  ]
};
