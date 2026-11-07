/**
 * GERENCIADOR DE OCORRÊNCIAS E SIMULAÇÕES URBANAS
 * Coordena os 5 modos de cenário: Normal, Inundação, Emergência/Bloqueio, Blecaute e Calor Extremo
 */

import { SCENARIOS, SCENARIO_LABELS } from '../engine/Constants.js';

export class ScenarioManager {
  constructor(audio) {
    this.audio = audio;
    this.currentScenario = SCENARIOS.NORMAL;
    this.onScenarioChange = null;
    this.scenarioTimer = 0;
  }

  setScenario(scenarioKey) {
    if (!Object.values(SCENARIOS).includes(scenarioKey)) return;
    this.currentScenario = scenarioKey;
    this.scenarioTimer = 0;

    // Dispara ações de áudio
    if (scenarioKey === SCENARIOS.EMERGENCIA) {
      this.audio.startSiren();
    } else {
      this.audio.stopSiren();
    }

    if (scenarioKey === SCENARIOS.INUNDACAO) {
      this.audio.playThunder();
    }

    if (scenarioKey === SCENARIOS.BLECAUTE) {
      this.audio.playElectricSpark();
    }

    if (this.onScenarioChange) {
      this.onScenarioChange(scenarioKey, SCENARIO_LABELS[scenarioKey]);
    }
  }

  getDetails() {
    return SCENARIO_LABELS[this.currentScenario];
  }
}
