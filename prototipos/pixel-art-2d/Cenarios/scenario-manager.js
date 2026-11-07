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

    this.stagesSequence = [
      { step: 1, cenario: 'alagamento', fase: 'crise', title: 'ALAGAMENTO', sub: 'CRISE HÍDRICA' },
      { step: 2, cenario: 'apagao', fase: 'resposta', title: 'APAGÃO', sub: 'RESPOSTA DA REDE' },
      { step: 3, cenario: 'aliens', fase: 'recuperacao', title: 'ANOMALIA', sub: 'RECUPERAÇÃO' },
      { step: 4, cenario: 'ameaca-externa', fase: 'crise', title: 'AMEAÇA EXTERNA', sub: 'CRISE OPERACIONAL' },
      { step: 5, cenario: 'seguranca', fase: 'resposta', title: 'SEGURANÇA', sub: 'RESPOSTA TÁTICA' },
      { step: 6, cenario: 'governanca', fase: 'recuperacao', title: 'GOVERNANÇA', sub: 'RECUPERAÇÃO SOCIAL' },
      { step: 7, cenario: 'alagamento', fase: 'resposta', title: 'ALAGAMENTO', sub: 'RESPOSTA EM ANDAMENTO' },
      { step: 8, cenario: 'apagao', fase: 'recuperacao', title: 'APAGÃO', sub: 'RECUPERAÇÃO DO SISTEMA' },
      { step: 9, cenario: 'aliens', fase: 'crise', title: 'ANOMALIA', sub: 'CRISE ESPACIAL' },
      { step: 10, cenario: 'ameaca-externa', fase: 'resposta', title: 'AMEAÇA EXTERNA', sub: 'RESPOSTA DE DEFESA' },
      { step: 11, cenario: 'seguranca', fase: 'recuperacao', title: 'SEGURANÇA', sub: 'RECUPERAÇÃO DA ORDEM' },
      { step: 12, cenario: 'governanca', fase: 'crise', title: 'GOVERNANÇA', sub: 'CRISE INSTITUCIONAL' },
      { step: 13, cenario: 'alagamento', fase: 'recuperacao', title: 'ALAGAMENTO', sub: 'RECUPERAÇÃO DAS BACIAS' },
      { step: 14, cenario: 'apagao', fase: 'crise', title: 'APAGÃO', sub: 'CRISE ENERGÉTICA' },
      { step: 15, cenario: 'aliens', fase: 'resposta', title: 'ANOMALIA', sub: 'RESPOSTA CIENTÍFICA' },
      { step: 16, cenario: 'ameaca-externa', fase: 'recuperacao', title: 'AMEAÇA EXTERNA', sub: 'RECUPERAÇÃO DE FRONTEIRAS' },
      { step: 17, cenario: 'seguranca', fase: 'crise', title: 'SEGURANÇA', sub: 'CRISE URBANA' },
      { step: 18, cenario: 'governanca', fase: 'resposta', title: 'GOVERNANÇA', sub: 'RESPOSTA DIALOGADA' }
    ];
    this.currentStageIndex = 0;
    this.stageTimeElapsed = 0;
    this.stageDuration = 120; // 120 segundos por etapa
  }

  loadStage(index) {
    this.currentStageIndex = index;
    this.stageTimeElapsed = 0;
    const stage = this.stagesSequence[index];

    this.currentScenario = {
      id: stage.cenario,
      title: stage.title,
      subtitle: stage.sub,
      phase: stage.fase,
      step: stage.step,
      description: `Etapa ${stage.step}/18: Cenário ${stage.title} — Fase ${stage.fase.toUpperCase()}`,
      situation: `Monitoramento ativo da etapa ${stage.step} (${stage.cenario} / ${stage.fase}).`
    };

    if (typeof window !== 'undefined' && window.__ecoPixelGame && typeof window.__ecoPixelGame.setScenarioScene === 'function') {
      window.__ecoPixelGame.setScenarioScene(stage.cenario, stage.fase);
    }

    this.broadcastUpdate();
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
    if (!this.currentScenario) {
      this.loadStage(0);
    }
  }

  pause() {
    this.simulationState = 'paused';
    this.broadcastUpdate();
  }

  resume() {
    this.simulationState = 'active';
    this.broadcastUpdate();
  }

  addTime(seconds) {
    this.stageTimeElapsed = Math.max(0, this.stageTimeElapsed - seconds);
    this.broadcastUpdate();
  }

  update(delta) {
    if (this.simulationState !== 'active') return;

    this.elapsedTime += delta;
    this.stageTimeElapsed += delta;
    this.remainingTime = Math.max(0, this.stageDuration - this.stageTimeElapsed);

    if (this.stageTimeElapsed >= this.stageDuration) {
      this.currentStageIndex = (this.currentStageIndex + 1) % this.stagesSequence.length;
      this.loadStage(this.currentStageIndex);
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
