import type { V2 } from './types';
import { ENTRANCES } from './parkLayout';

/** Rede de caminhos pedonais (nós + arestas). Traçado calibrado para contornar todos os equipamentos e conectar 100% dos POIs. */
const ent = (id: string): V2 => ENTRANCES.find((e) => e.id === id)!.pos;

export const PATH_NODES: { id: string; pos: V2 }[] = [
  // Entradas oficiais:
  { id: 'E1', pos: ent('E1') },
  { id: 'E2', pos: ent('E2') },
  { id: 'E3', pos: ent('E3') },

  // Setor Norte (Carlos Wenceslau, Anfiteatro Susana Naspolini)
  { id: 'n_e1_hub', pos: [48, -165] },
  { id: 'n_adm_front', pos: [72, -180] },
  { id: 'n_amphi', pos: [32, -160] },
  { id: 'n_norte_hub', pos: [48, -135] },

  // Setor das 5 Super-Torres e Espelho d'Água
  { id: 'n_torres_norte', pos: [48, -112] },
  { id: 'n_torres_central', pos: [48, -78] },
  { id: 'n_torres_oeste', pos: [8, -80] },
  { id: 'n_torres_leste', pos: [88, -78] },
  { id: 'n_torres_sul', pos: [48, -36] },
  { id: 'rs', pos: [48, -36] },      // Pé da Rampa Sul
  { id: 're', pos: [80, -104] },     // Pé da Rampa Leste

  // Splash Pad Infantil
  { id: 'n_splash', pos: [80, -100] },

  // Complexo Poliesportivo Azul (Circulação perimetral externa)
  { id: 'n_quadras_norte', pos: [88, -48] },
  { id: 'n_quadras_oeste', pos: [68, -20] },
  { id: 'n_quadras_leste', pos: [116, -18] },
  { id: 'n_quadras_sul', pos: [88, 14] },
  { id: 'n_quadra_areia', pos: [45, 10] },

  // Pavilhões Orientais (Nave do Conhecimento e Centro Cultural)
  { id: 'n_nave_norte', pos: [98, -175] },
  { id: 'n_nave_centro', pos: [98, -155] },
  { id: 'n_nave_sul', pos: [98, -135] },
  { id: 'n_pavilhao_cultura', pos: [92, -215] },

  // Bosque Central da Mata Atlântica e Alameda Oeste
  { id: 'n_bosque_norte', pos: [-40, -120] },
  { id: 'n_bosque_centro', pos: [-60, -40] },
  { id: 'n_bosque_sul', pos: [-40, 20] },
  { id: 'n_bosque_ifrj', pos: [-180, -60] },

  // Skatepark (Bowls e Street)
  { id: 'n_skate_leste', pos: [12, 55] },
  { id: 'n_skate_centro', pos: [-15, 55] },
  { id: 'n_skate_oeste', pos: [-42, 55] },

  // Campo Society e Playground
  { id: 'n_campo_hub', pos: [20, 42] },
  { id: 'n_play_hub', pos: [38, 115] },
  { id: 'n_gym_hub', pos: [36, 142] },

  // Praça do Mercado e Entrada Sul
  { id: 'n_mercado', pos: [-85, 180] },
  { id: 'n_mercado_hub', pos: [-65, 195] },
  { id: 'n_bbq_hub', pos: [20, 175] },
];

export const DEFAULT_PATH_WIDTH = 3.2;

export const PATH_EDGES: [string, string, number?][] = [
  // E1 (Acesso Norte) para Hub Norte e Anfiteatro
  ['E1', 'n_e1_hub', 4.5],
  ['n_e1_hub', 'n_adm_front', 3.5],
  ['n_e1_hub', 'n_amphi', 4.0],
  ['n_e1_hub', 'n_norte_hub', 4.5],
  ['n_norte_hub', 'n_torres_norte', 4.5],

  // Circulação ao redor das Torres e Espelho d'Água
  ['n_torres_norte', 'n_splash', 4.0],
  ['n_splash', 're', 3.5],
  ['n_torres_norte', 'n_torres_oeste', 4.0],
  ['n_torres_oeste', 'n_torres_sul', 4.0],
  ['n_torres_sul', 'rs', 4.0],
  ['n_splash', 'n_torres_leste', 4.0],
  ['n_torres_leste', 'n_quadras_norte', 4.0],
  ['n_torres_sul', 'n_quadras_oeste', 4.0],

  // Complexo Poliesportivo (percurso perimetral contornando as quadras)
  ['n_quadras_norte', 'n_quadras_oeste', 3.5],
  ['n_quadras_norte', 'n_quadras_leste', 3.5],
  ['n_quadras_oeste', 'n_quadras_sul', 3.5],
  ['n_quadras_leste', 'n_quadras_sul', 3.5],
  ['n_quadras_oeste', 'n_quadra_areia', 3.5],
  ['n_quadra_areia', 'n_campo_hub', 3.5],

  // Nave do Conhecimento e Pavilhões Orientais
  ['n_torres_leste', 'n_nave_sul', 4.0],
  ['n_splash', 'n_nave_centro', 4.0],
  ['n_nave_norte', 'n_nave_centro', 4.0],
  ['n_nave_centro', 'n_nave_sul', 4.0],
  ['n_nave_norte', 'n_pavilhao_cultura', 3.5],
  ['n_pavilhao_cultura', 'n_adm_front', 3.5],

  // Conexão com o Bosque Central da Mata Atlântica
  ['n_norte_hub', 'n_bosque_norte', 4.5],
  ['n_torres_oeste', 'n_bosque_centro', 4.5],
  ['n_bosque_norte', 'n_bosque_centro', 4.0],
  ['n_bosque_centro', 'n_bosque_sul', 4.0],
  ['n_bosque_centro', 'n_bosque_ifrj', 4.0],
  ['n_bosque_ifrj', 'E3', 4.5],

  // Conexão com Skatepark e Campo
  ['n_bosque_sul', 'n_skate_oeste', 4.0],
  ['n_skate_oeste', 'n_skate_centro', 4.0],
  ['n_skate_centro', 'n_skate_leste', 4.0],
  ['n_skate_leste', 'n_campo_hub', 4.0],
  ['n_torres_sul', 'n_campo_hub', 4.0],

  // Setor Sul: Playground, Churrasqueiras e Mercado
  ['n_campo_hub', 'n_play_hub', 3.5],
  ['n_play_hub', 'n_gym_hub', 3.5],
  ['n_gym_hub', 'n_bbq_hub', 3.5],
  ['n_skate_oeste', 'n_mercado', 4.0],
  ['n_mercado', 'n_mercado_hub', 4.5],
  ['n_mercado_hub', 'E2', 4.5],
  ['n_mercado_hub', 'n_bbq_hub', 3.5],
];
