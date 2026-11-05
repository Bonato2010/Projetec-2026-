const $ = (selector) => document.querySelector(selector);

const RM = matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const low =
  (navigator.hardwareConcurrency || 4) <= 4 ||
  innerWidth < 800;

const sm = (x, a, b) => {
  x = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

const OBJ = {
  0: [
    ' Lata',
    'Pode ser reciclada diversas vezes sem perder suas principais propriedades.'
  ],
  1: [
    ' Celular',
    'Possui materiais como cobre, alumínio e outros metais que podem ser recuperados.'
  ],
  2: [
    ' Roupa',
    'Pode entrar na economia circular por doação, reutilização, conserto e reciclagem.'
  ],
  3: [
    'resíduo orgânico',
    'Pode ser transformado em composto por meio da compostagem.'
  ]
};

const SRC = [
  [
    'OMS',
    'Health effects of air pollution: evidence and implications',
    'who.int'
  ],
  [
    'OMS',
    'Climate change and health',
    'who.int'
  ],
  [
    'OMS',
    'Healthy environments for healthier populations',
    'who.int'
  ],
  [
    'PNUMA/UNEP',
    'Why does environment, health and pollution matter?',
    'unep.org'
  ],
  [
    'ONU',
    'Objetivos de Desenvolvimento Sustentável · Agenda 2030',
    'un.org'
  ],
  [
    'MMA (Brasil)',
    'Sustentabilidade',
    'gov.br/mma'
  ],
  [
    'UNESCO',
    'Educação para o Desenvolvimento Sustentável',
    'unesco.org'
  ],
  [
    'WCED',
    'Our Common Future (Relatório Brundtland), 1987',
    'un.org'
  ]
];

const TEAM = [
  'Yasmin Vitória',
  'João Pedro Roldão',
  'Lucas Cordeiro',
  'Isaac Alisson',
  'Jean Carlos',
  'Ana Clara Nascimento',
  'Maria Eduarda Leite'
];

const CH = [
  {
    n: 'SOL',
    k: '01 · SOL',
    t: 'SUSTENTABILIDADE',
    d: `
      Quando o ambiente muda, a cidade muda.
      Quando a cidade muda, a nossa saúde muda.
    `
  },

  {
    n: 'PLANETA',
    k: '02 · PLANETA',
    t: 'Os recursos são finitos',
    d: `
      Sustentabilidade é usar os recursos naturais com responsabilidade,
      atendendo às necessidades da sociedade sem causar danos excessivos
      ao meio ambiente. O desenvolvimento sustentável equilibra três dimensões.
    `,
    it: [
      [
        'Ambiental',
        `
          Preservar a natureza, reduzir a poluição, proteger a biodiversidade,
          usar água e energia com consciência. Ex.: energia solar e eólica.
        `
      ],
      [
        ' Social',
        `
          Qualidade de vida. A coleta seletiva pode gerar trabalho
          e renda para catadores.
        `
      ],
      [
        ' Econômica',
        `
          Crescimento econômico sem esgotar recursos nem prejudicar
          as futuras gerações. Ex.: reciclagem e redução de resíduos.
        `
      ]
    ]
  },

  {
    n: 'CIDADE',
    k: '03 · CIDADE',
    t: 'É nas cidades que grande parte da vida acontece',
    d: `
      Estamos entrando em uma cidade estilizada
      (representação conceitual, sem dados geográficos reais).
      Prédios, ruas, indústria, hospital, área verde e reciclagem
      convivem no mesmo espaço.
    `,
    it: [
      [
        ' Indústria',
        `
          Atividades industriais podem gerar emissões e resíduos.
          Tecnologias mais limpas podem reduzir determinados impactos.
        `
      ],
      [
        ' Saúde',
        `
          Condições ambientais influenciam diretamente
          a saúde da população.
        `
      ],
      [
        'Área verde',
        `
          Áreas verdes fazem parte de ambientes urbanos mais saudáveis.
        `
      ],
      [
        ' Reciclagem',
        `
          A coleta seletiva facilita a recuperação de materiais.
        `
      ]
    ]
  },

  {
    n: 'RESÍDUOS',
    k: '04 · RESÍDUOS',
    t: 'O consumo gera resíduos',
    d: `
      Resíduos são materiais descartados após o uso:
      plástico, papel, vidro, metal e resíduos eletrônicos.
      O descarte inadequado pode contribuir para problemas
      ambientais e urbanos. Veja o fluxo linear.
    `,
    it: [
      [
        'Extrair',
        'Os recursos naturais são finitos.'
      ],
      [
        'Produzir',
        'Produtos são fabricados a partir dos materiais extraídos.'
      ],
      [
        'Consumir',
        'O consumo gera resíduos.'
      ],
      [
        'Descartar',
        'O descarte inadequado pode gerar problemas ambientais e urbanos.'
      ]
    ]
  },

  {
    n: 'CICLO',
    k: '05 · ECONOMIA CIRCULAR',
    t: 'Mas o fim pode não ser o descarte',
    d: `
      A linha se fecha em ciclo: manter produtos e materiais
      em uso pelo maior tempo possível. Toque nos objetos 3D
      (lata, celular, roupa, orgânico) ou nos passos.
    `,
    it: [
      [
        'Reduzir',
        'Menos desperdício, menos lixo.'
      ],
      [
        'Reutilizar',
        'Manter produtos em uso pelo maior tempo possível.'
      ],
      [
        'Reparar',
        'Economia circular não é só reciclar: reparar também faz parte.'
      ],
      [
        'Reciclar',
        'Transforma materiais descartados em matéria-prima para novos produtos.'
      ],
      [
        'Reaproveitar',
        'Os materiais continuam circulando em vez de terminarem como lixo.'
      ],
      [
        'Novo ciclo',
        'Produzir novamente com materiais recuperados.'
      ]
    ],
    x: `
      <p class="mu">
        Contexto brasileiro: Política Nacional de Resíduos Sólidos (PNRS),
        Plano Nacional de Resíduos Sólidos e Estratégia Nacional de
        Economia Circular. Detalhes legais: [DADO A CONFIRMAR].
      </p>
    `
  },

  {
    n: 'SAÚDE',
    k: '06 · SAÚDE',
    t: 'O ambiente também influencia nossa saúde',
    d: `
      A neblina sobre a cidade representa a poluição (conceitual).
      Ar, água, alimentos e condições urbanas influenciam o bem-estar.
      Depois, as soluções: a névoa some e as árvores crescem.
    `,
    it: [
      [
        'Ar',
        `
          Poluição do ar → exposição →
          doenças respiratórias e cardiovasculares.
        `
      ],
      [
        ' Água',
        `
          Água potável, saneamento e higiene reduzem
          o risco de contaminação.
        `
      ],
      [
        ' Clima',
        `
          Mudanças climáticas podem contribuir para ondas de calor,
          enchentes, secas, tempestades, incêndios e mudanças
          em algumas doenças infecciosas.
        `
      ],
      [
        ' Contaminantes',
        `
          Químicos, metais pesados, agrotóxicos e resíduos
          afetam ecossistemas e a exposição de pessoas e animais.
        `
      ],
      [
        ' Soluções',
        `
          Áreas verdes, saneamento, energia mais limpa,
          menos poluição e planejamento urbano →
          ambientes mais saudáveis.
        `
      ]
    ]
  },

  {
    n: 'TECNOLOGIA',
    k: '07 · TECNOLOGIA',
    t: 'Medir, compreender e transformar',
    d: `
      A cidade se achata em um mapa conceitual:
      o uso do solo vira cor, as ruas aparecem e sensores pulsam.
      Representação ilustrativa, não dados reais.
    `,
    it: [
      [
        ' Sensores',
        'Medem condições do ambiente urbano.'
      ],
      [
        ' Mapas',
        'Mostram onde estão problemas e soluções.'
      ],
      [
        'Dados',
        'Transformam medições em compreensão.'
      ],
      [
        'Modelagem',
        'Ajuda a testar cenários antes de agir.'
      ],
      [
        ' Energia limpa',
        'A tecnologia viabiliza fontes como a solar.'
      ]
    ]
  },

  {
    n: 'FUTURO',
    k: '08 · FUTURO',
    t: 'O futuro depende das escolhas feitas hoje',
    d: `
      Meio ambiente → cidade → saúde → tecnologia →
      soluções → futuro. A câmera se afasta:
      a cidade ficou pequena, a Terra e o Sol voltam à vista.
      Tudo está conectado.
    `,
    x: `
      <div class="k" style="margin-top:.8rem">
        EQUIPE
      </div>

      <div class="tm">
        <span style="border-color:var(--ac)">
          <b>Daniel de Mel Morato</b> — Autor e Coordenador Geral
        </span>

        ${TEAM
          .map((member) => `<span>${member}</span>`)
          .join('')}
      </div>

      <div class="k">
        FONTES E REFERÊNCIAS
      </div>

      <p class="mu">
        Sem estatísticas numéricas; qualquer número futuro exige
        ano, contexto e fonte. Links apontam ao domínio oficial.
      </p>

      ${SRC
        .map(
          ([institution, title, domain]) => `
            <p class="mu">
              <b>${institution}</b> — ${title} ·
              <a
                href="https://${domain}"
                target="_blank"
                rel="noopener"
              >
                ${domain}
              </a>
            </p>
          `
        )
        .join('')}
    `
  }
];