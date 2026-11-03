import type { V2 } from './types';
import { ENTRANCES } from './parkLayout';

/** Rede de caminhos pedonais (nós + arestas). Traçado calibrado para contornar todos os equipamentos e conectar 100% dos POIs. */
const ent = (id: string): V2 => ENTRANCES.find((e) => e.id === id)!.pos;

export const PATH_NODES: { id: string; pos: V2 }[] = [
  // Entradas oficiais:
  { id: 'E1', pos: ent('E1') },
  { id: 'E2', pos: ent('E2') },
  { id: 'E3', pos: ent('E3') },

  // Setor Norte (Administração, Sanitários 1, Anfiteatro Susana Naspolini)
  { id: 'n_e1_hub', pos: [52, -155] },
  { id: 'n_adm_front', pos: [62, -155] },
  { id: 'n_toilets1', pos: [82, -150] },
  { id: 'n_amphi_leste', pos: [56, -135] },
  { id: 'n_amphi_front', pos: [35, -125] },
  { id: 'n_norte_hub', pos: [48, -112] },

  // Setor das 5 Super-Torres e Acesso às Rampas
  { id: 'n_torres_norte', pos: [48, -100] },
  { id: 'n_torres_ne', pos: [85, -96] },
  { id: 'n_torres_leste', pos: [85, -42] },
  { id: 'n_torres_oeste', pos: [5, -55] },
  { id: 'n_torres_sw', pos: [5, -42] },
  { id: 'n_torres_sul', pos: [48, -42] },
  { id: 'rw', pos: [-75, -95] },   // Pé da Rampa Oeste
  { id: 'rv', pos: [135, -32] },   // Pé da Rampa Leste

  // Margens do Lago e Deck Contemplativo
  { id: 'n_lago_norte', pos: [15, -36] },
  { id: 'n_lago_nordeste', pos: [45, -36] },
  { id: 'n_lago_leste', pos: [71, -26] },
  { id: 'n_quadras_hub', pos: [71, -2] },
  { id: 'n_lago_sudeste', pos: [71, 22] },
  { id: 'n_lago_sul', pos: [40, 24] },
  { id: 'n_lago_sudoeste', pos: [15, 22] },
  { id: 'n_lago_deck_sul', pos: [8, 12] },
  { id: 'n_lago_deck_norte', pos: [8, -25] },

  // Nave do Conhecimento (Circulação perimetral)
  { id: 'n_nave_norte', pos: [-8, -24] },
  { id: 'n_nave_nw', pos: [-24, -24] },
  { id: 'n_nave_oeste', pos: [-24, -8] },
  { id: 'n_nave_sw', pos: [-24, 8] },
  { id: 'n_nave_sul', pos: [-8, 8] },

  // Alameda Oeste, Bosque Atlântico e Vôlei de Areia
  { id: 'n_oeste_1', pos: [-55, -20] },
  { id: 'n_bosque_1', pos: [-100, -35] },
  { id: 'n_bosque_areia', pos: [-150, -46] },
  { id: 'n_areia_sul', pos: [-192, -46] },
  { id: 'n_areia_oeste', pos: [-222, -46] },
  { id: 'n_areia_nw', pos: [-222, -75] },

  // Polo Esportivo Leste (Quadras Poliesportivas e Campo Society)
  { id: 'n_campo_noroeste', pos: [36, 32] },
  { id: 'n_campo_oeste', pos: [36, 55] },
  { id: 'n_campo_sudoeste', pos: [36, 78] },
  { id: 'n_campo_sul', pos: [66, 78] },

  // Polo Skatepark
  { id: 'n_skate_noroeste', pos: [34, 90] },
  { id: 'n_skate_oeste', pos: [34, 105] },
  { id: 'n_skate_sudoeste', pos: [34, 122] },
  { id: 'n_skate_sul', pos: [58, 122] },

  // Setor Infantil e Fitness (Playground, Splash Pad, Academia, Sanitários 2)
  { id: 'n_play_corner', pos: [20, 122] },
  { id: 'n_play_hub', pos: [20, 145] },
  { id: 'n_fitness_walkway', pos: [20, 160] },
  { id: 'n_gym_hub', pos: [20, 172] },
  { id: 'n_east_fitness', pos: [50, 160] },
  { id: 'n_toilets2', pos: [58, 165] },

  // Setor Convivência e Praça do Mercado (Quiosques, Lojas, Ecoponto)
  { id: 'n_bbq_hub', pos: [10, 188] },
  { id: 'n_bbq_sul', pos: [10, 210] },
  { id: 'n_mercado_hub', pos: [38, 210] },
  { id: 'k1', pos: [38, 235] },
  { id: 'n_mercado_se', pos: [38, 260] },
];

export const PATH_EDGES: [string, string, number?][] = [
  // E1 -> Polo Norte
  ['E1', 'n_e1_hub', 4],
  ['n_e1_hub', 'n_adm_front', 3],
  ['n_adm_front', 'n_toilets1', 3],
  ['n_e1_hub', 'n_amphi_leste', 4],
  ['n_amphi_leste', 'n_amphi_front', 4],
  ['n_amphi_front', 'n_norte_hub', 4],
  ['n_norte_hub', 'n_torres_norte', 4],

  // Rampa Oeste e Leste a partir do hub norte e praça
  ['n_torres_norte', 'rw', 3.5],
  ['n_torres_norte', 'n_torres_oeste', 4],
  ['n_torres_norte', 'n_torres_ne', 4],
  ['n_torres_ne', 'n_torres_leste', 4],
  ['n_torres_oeste', 'n_torres_sw', 4],
  ['n_torres_sw', 'n_torres_sul', 4],
  ['n_torres_leste', 'n_torres_sul', 4],
  ['n_torres_leste', 'rv', 3.5],

  // Praça das Torres para Margens do Lago
  ['n_torres_sul', 'n_lago_nordeste', 4],
  ['n_torres_oeste', 'n_lago_norte', 4],

  // Circuito do Lago (Promenade)
  ['n_lago_norte', 'n_lago_nordeste', 3.5],
  ['n_lago_nordeste', 'n_lago_leste', 3.5],
  ['n_lago_leste', 'n_quadras_hub', 3.5],
  ['n_quadras_hub', 'n_lago_sudeste', 3.5],
  ['n_lago_sudeste', 'n_lago_sul', 3.5],
  ['n_lago_sul', 'n_lago_sudoeste', 3.5],
  ['n_lago_sudoeste', 'n_lago_deck_sul', 3.5],
  ['n_lago_deck_sul', 'n_lago_deck_norte', 3.5],
  ['n_lago_deck_norte', 'n_lago_norte', 3.5],

  // Lago para Nave do Conhecimento
  ['n_lago_deck_norte', 'n_nave_norte', 3.5],
  ['n_nave_norte', 'n_nave_nw', 3.5],
  ['n_nave_nw', 'n_nave_oeste', 3.5],
  ['n_nave_oeste', 'n_nave_sw', 3.5],
  ['n_nave_sw', 'n_nave_sul', 3.5],
  ['n_nave_sul', 'n_lago_deck_sul', 3.5],

  // Nave para Alameda Oeste / Bosque Atlântico / Vôlei de Areia / E3
  ['n_nave_oeste', 'n_oeste_1', 4],
  ['n_oeste_1', 'n_bosque_1', 4],
  ['n_bosque_1', 'n_bosque_areia', 4],
  ['n_bosque_areia', 'n_areia_sul', 4],
  ['n_areia_sul', 'n_areia_oeste', 4],
  ['n_areia_oeste', 'n_areia_nw', 4],
  ['n_areia_nw', 'E3', 4],

  // Quadras Poliesportivas e Campo Society
  ['n_lago_sudeste', 'n_campo_noroeste', 4],
  ['n_campo_noroeste', 'n_campo_oeste', 4],
  ['n_campo_oeste', 'n_campo_sudoeste', 4],
  ['n_campo_sudoeste', 'n_campo_sul', 4],

  // Campo Society para Skatepark
  ['n_campo_sudoeste', 'n_skate_noroeste', 4],
  ['n_skate_noroeste', 'n_skate_oeste', 4],
  ['n_skate_oeste', 'n_skate_sudoeste', 4],
  ['n_skate_sudoeste', 'n_skate_sul', 4],

  // Skate para Playground Infantil e Fitness
  ['n_skate_sudoeste', 'n_play_corner', 4],
  ['n_play_corner', 'n_play_hub', 4],
  ['n_play_hub', 'n_fitness_walkway', 4],
  ['n_fitness_walkway', 'n_gym_hub', 4],
  ['n_fitness_walkway', 'n_east_fitness', 4],
  ['n_east_fitness', 'n_toilets2', 3],

  // Fitness para Churrasqueiras e Praça do Mercado
  ['n_gym_hub', 'n_bbq_hub', 4],
  ['n_bbq_hub', 'n_bbq_sul', 4],
  ['n_bbq_sul', 'n_mercado_hub', 4],
  ['n_mercado_hub', 'k1', 4],
  ['k1', 'n_mercado_se', 4],
  ['n_mercado_se', 'E2', 4],
];

export const DEFAULT_PATH_WIDTH = 3.5;
