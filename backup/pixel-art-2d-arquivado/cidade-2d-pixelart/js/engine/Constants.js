/**
 * CIDADE 2D EM PIXEL ART — RIO DE JANEIRO / ZONA OESTE (PROJETEC 2026)
 * Módulo Exclusivo Antigravity
 * 
 * Constantes Globais, Resolução Lógica, Paletas e Estados
 */

export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 540;
export const WORLD_WIDTH = 3840; // Panorama 4x maior que a tela para rolagem ampla

// Alturas do Cenário (coordenadas Y)
export const HORIZON_Y = 270;
export const SKYLINE_Y = 320;
export const SIDEWALK_TOP_Y = 380;
export const CURB_Y = 415;
export const STREET_TOP_Y = 418;
export const STREET_LANE_UP_Y = 435;
export const STREET_LANE_DOWN_Y = 475;
export const FOREGROUND_WALK_Y = 510;
export const STREET_BOTTOM_Y = 540;

// Paletas de Iluminação por Horário do Dia
export const TIME_PALETTES = {
  dawn: {
    name: 'Amanhecer',
    skyTop: '#2b2353',
    skyMid: '#7a3e65',
    skyBottom: '#d97d54',
    sunColor: '#fce295',
    sunY: 210,
    ambientColor: 'rgba(235, 140, 100, 0.15)',
    streetLightAlpha: 0.35,
    mountainTint: '#4a3250'
  },
  day: {
    name: 'Dia Ensolarado',
    skyTop: '#3a88c8',
    skyMid: '#6bb6e4',
    skyBottom: '#b3dff5',
    sunColor: '#fff5b8',
    sunY: 90,
    ambientColor: 'rgba(255, 255, 255, 0)',
    streetLightAlpha: 0.0,
    mountainTint: '#4b657e'
  },
  sunset: {
    name: 'Entardecer Dourado',
    skyTop: '#261b40',
    skyMid: '#822c4f',
    skyBottom: '#e6683b',
    sunColor: '#ff9233',
    sunY: 230,
    ambientColor: 'rgba(230, 95, 45, 0.22)',
    streetLightAlpha: 0.7,
    mountainTint: '#46243d'
  },
  night: {
    name: 'Noite Carioca',
    skyTop: '#080a18',
    skyMid: '#10142d',
    skyBottom: '#191f3e',
    sunColor: '#d6e5ff', // Lua
    sunY: 100,
    ambientColor: 'rgba(10, 15, 35, 0.55)',
    streetLightAlpha: 0.95,
    mountainTint: '#141728'
  }
};

// Modos de Ocorrência Urbana (Exigência 4 do Prompt)
export const SCENARIOS = {
  NORMAL: 'normal',
  INUNDACAO: 'inundacao',
  EMERGENCIA: 'emergencia',
  BLECAUTE: 'blecaute',
  ONDA_CALOR: 'onda_calor'
};

export const SCENARIO_LABELS = {
  [SCENARIOS.NORMAL]: { title: 'Cidade Viva (Rotina)', desc: 'Comércio ativo, trânsito fluido e moradores nas calçadas.', icon: '☀️' },
  [SCENARIOS.INUNDACAO]: { title: 'Temporal & Inundação', desc: 'Chuva torrencial, bueiros transbordando, ruas alagadas e trânsito lento.', icon: '🌧️' },
  [SCENARIOS.EMERGENCIA]: { title: 'Emergência Urbana & Bloqueio', desc: 'Sirenes, viaturas com giroflex, comércio fechando portas e via interditada.', icon: '🚨' },
  [SCENARIOS.BLECAUTE]: { title: 'Blecaute no Transformador', desc: 'Faíscas na rede elétrica, apagão geral de postes e semáforos em alerta.', icon: '⚡' },
  [SCENARIOS.ONDA_CALOR]: { title: 'Onda de Calor Extrema (42°C)', desc: 'Sensação térmica severa, distorção de calor, aspersão de água e sombras.', icon: '🔥' }
};
