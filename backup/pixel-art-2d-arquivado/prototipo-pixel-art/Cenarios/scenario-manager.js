/**
 * ECOCITY PIXEL ART — GERENCIADOR DE CENÁRIOS, OCORRÊNCIAS E IMPACTOS
 * Controla os eventos dinâmicos (Guerra de Facções e Inundação), métricas em tempo real e regras de decisão.
 */

class ScenarioManager {
  constructor(options = {}) {
    this.currentScenario = null;
    this.simulationState = 'normal'; // 'normal', 'alert', 'active', 'ended'
    this.elapsedTime = 0;
    this.missionDuration = 270; // 04:30 minutos em segundos
    this.remainingTime = this.missionDuration;
    this.floodLevel = 0; // 0 a 3

    // Métricas Principais (0 a 100%)
    this.metrics = {
      populationAtRisk: 15, // Menor é melhor (15% em rotina normal)
      healthServices: 90,   // Maior é melhor
      infrastructure: 88,   // Maior é melhor
      environment: 85,      // Maior é melhor
      safety: 85,           // Maior é melhor
      resources: 95         // Maior é melhor
    };

    this.appliedDecisions = new Set();
    this.onUpdateCallback = options.onUpdate || (() => {});
    this.onAlertCallback = options.onAlert || (() => {});
  }

  loadScenario(scenarioId) {
    this.elapsedTime = 0;
    this.remainingTime = this.missionDuration;
    this.appliedDecisions.clear();

    if (scenarioId === 'inundacao') {
      this.currentScenario = {
        id: 'inundacao',
        title: 'INUNDAÇÃO SEVERA',
        subtitle: 'TRANSBORDAMENTO E RISCO HIDROLÓGICO',
        description: 'Frente fria estacionária provocou precipitação extrema sobre as bacias urbanas. Vias expressas alagadas e risco de deslizamento em encostas.',
        situation: 'Ruas centrais alagadas e vias interditadas geram retenção de trânsito e ilhamento de pedestres.',
        type: 'flood'
      };
      this.floodLevel = 1;
      this.metrics.populationAtRisk = 65;
      this.metrics.infrastructure = 58;
      this.metrics.environment = 70;
      this.metrics.safety = 60;
    } else {
      this.currentScenario = {
        id: 'guerra_faccoes',
        title: 'GUERRA DE FACÇÕES',
        subtitle: 'CONFLITO EM ÁREAS URBANAS & CRISE HUMANITÁRIA',
        description: 'Uma região da cidade entrou em estado de conflito armado entre facções. Proteja a população civil, mantenha corredores de emergência e assegure os serviços essenciais.',
        situation: 'Confrontos em áreas adjacentes causam medo na população e interrupção do transporte nas vias centrais.',
        type: 'security'
      };
      this.floodLevel = 0;
      this.metrics.populationAtRisk = 72;
      this.metrics.healthServices = 80;
      this.metrics.infrastructure = 68;
      this.metrics.environment = 85;
      this.metrics.safety = 55;
    }

    this.simulationState = 'alert';
    this.onAlertCallback(this.currentScenario);
  }

  startSimulation() {
    this.simulationState = 'active';
  }

  update(delta) {
    if (this.simulationState !== 'active') return;

    this.elapsedTime += delta;
    this.remainingTime = Math.max(0, this.remainingTime - delta);

    // Evolução temporal para Inundação
    if (this.currentScenario && this.currentScenario.type === 'flood') {
      if (this.elapsedTime > 15 && this.elapsedTime <= 45) {
        this.floodLevel = 2; // Chuva intensa e início de alagamento
      } else if (this.elapsedTime > 45) {
        this.floodLevel = 3; // Alagamento severo
      }
    }

    // Se o tempo esgotar, encerra a simulação
    if (this.remainingTime <= 0) {
      this.simulationState = 'ended';
    }

    this.broadcastUpdate();
  }

  applyDecision(decisionId) {
    this.appliedDecisions.add(decisionId);

    // Efeitos das Decisões de Guerra de Facções
    if (decisionId === 'sec_security' || decisionId === 'reforcar_seguranca') {
      this.metrics.safety = Math.min(100, this.metrics.safety + 18);
      this.metrics.populationAtRisk = Math.max(10, this.metrics.populationAtRisk - 14);
      this.metrics.infrastructure = Math.min(100, this.metrics.infrastructure + 8);
    } else if (decisionId === 'sec_shelter' || decisionId === 'abrir_abrigos') {
      this.metrics.populationAtRisk = Math.max(10, this.metrics.populationAtRisk - 22);
      this.metrics.healthServices = Math.min(100, this.metrics.healthServices + 12);
      this.metrics.resources = Math.max(10, this.metrics.resources - 12);
    } else if (decisionId === 'sec_transit' || decisionId === 'manter_transporte') {
      this.metrics.infrastructure = Math.min(100, this.metrics.infrastructure + 16);
      this.metrics.safety = Math.min(100, this.metrics.safety + 8);
    } else if (decisionId === 'sec_nature' || decisionId === 'proteger_verdes') {
      this.metrics.environment = Math.min(100, this.metrics.environment + 15);
      this.metrics.resources = Math.min(100, this.metrics.resources + 8);
    }

    // Efeitos das Decisões de Inundação
    else if (decisionId === 'flood_comportas' || decisionId === 'acionar_bacias') {
      this.floodLevel = Math.max(1, this.floodLevel - 1);
      this.metrics.infrastructure = Math.min(100, this.metrics.infrastructure + 22);
      this.metrics.environment = Math.min(100, this.metrics.environment + 18);
      this.metrics.populationAtRisk = Math.max(10, this.metrics.populationAtRisk - 18);
    } else if (decisionId === 'flood_resgate' || decisionId === 'mobilizar_defesa_civil') {
      this.metrics.populationAtRisk = Math.max(10, this.metrics.populationAtRisk - 26);
      this.metrics.healthServices = Math.min(100, this.metrics.healthServices + 15);
      this.metrics.safety = Math.min(100, this.metrics.safety + 12);
    } else if (decisionId === 'flood_bloqueio' || decisionId === 'bloquear_vias') {
      this.metrics.safety = Math.min(100, this.metrics.safety + 18);
      this.metrics.infrastructure = Math.min(100, this.metrics.infrastructure + 10);
    } else if (decisionId === 'flood_hospital' || decisionId === 'rotas_hospital') {
      this.metrics.healthServices = Math.min(100, this.metrics.healthServices + 25);
      this.metrics.populationAtRisk = Math.max(10, this.metrics.populationAtRisk - 12);
    }

    this.broadcastUpdate();
  }

  broadcastUpdate() {
    this.onUpdateCallback({
      state: this.simulationState,
      scenario: this.currentScenario,
      metrics: this.metrics,
      floodLevel: this.floodLevel,
      remainingTime: this.remainingTime,
      appliedDecisions: Array.from(this.appliedDecisions)
    });
  }

  getFormattedTime() {
    const mins = Math.floor(this.remainingTime / 60);
    const secs = Math.floor(this.remainingTime % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

window.ScenarioManager = ScenarioManager;
