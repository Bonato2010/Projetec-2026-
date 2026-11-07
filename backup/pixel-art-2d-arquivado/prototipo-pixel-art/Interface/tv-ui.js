/**
 * ECOCITY PIXEL ART — CONTROLADOR DA INTERFACE DA TELEVISÃO (TV UI)
 * Sincroniza em tempo real o estado da cidade com os controles dos visitantes via celular.
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvasId = 'pixel-canvas';
  const engine = new GameEngine(canvasId);
  engine.start();

  // Expor no window para testes automatizados e Playwright
  window.__ecoPixelGame = engine;

  // Sincronização em tempo real via WebSocket
  const sync = new VidaSyncEngine({ role: 'tv' });
  window.__ecoSync = sync;

  // Elementos do Topo
  const op1Label = document.getElementById('op1-label');
  const op2Label = document.getElementById('op2-label');
  const hudModeTitle = document.getElementById('hud-mode-title');
  const topValEnv = document.getElementById('top-val-env');
  const topMeterEnv = document.getElementById('top-meter-env');
  const topValSafety = document.getElementById('top-val-safety');
  const topMeterSafety = document.getElementById('top-meter-safety');
  const missionTimer = document.getElementById('mission-timer');

  // Elementos do Modal de Emergência
  const modal = document.getElementById('emergency-modal');
  const alertStartBtn = document.getElementById('alert-start-btn');
  const alertScenarioTitle = document.getElementById('alert-scenario-title');
  const alertScenarioDesc = document.getElementById('alert-scenario-desc');

  // Elementos da Base
  const situationText = document.getElementById('situation-text');
  const situationThumbIcon = document.getElementById('situation-thumb-icon');
  const bottomDecisionsGrid = document.getElementById('bottom-decisions-grid');

  const barPopRisk = document.getElementById('bar-pop-risk');
  const valPopRisk = document.getElementById('val-pop-risk');
  const barHealth = document.getElementById('bar-health');
  const valHealth = document.getElementById('val-health');
  const barInfra = document.getElementById('bar-infra');
  const valInfra = document.getElementById('val-infra');
  const barEnv = document.getElementById('bar-env');
  const valEnv = document.getElementById('val-env');

  // QR Code
  const qrCanvas = document.getElementById('qr-canvas');
  const sessionTag = document.getElementById('session-tag');
  if (sessionTag) sessionTag.innerText = sync.sessionId;

  if (qrCanvas && typeof QRCodeUtils !== 'undefined') {
    const mobileUrl = `${window.location.origin}/prototipo-pixel-art/controle.html?session=${sync.sessionId}`;
    QRCodeUtils.render(qrCanvas, mobileUrl, 3, 1);
  }

  // Atualizador das Barras de Impacto e Indicadores
  engine.scenarioManager.onUpdateCallback = (data) => {
    const m = data.metrics;
    if (barPopRisk) {
      barPopRisk.style.width = `${m.populationAtRisk}%`;
      valPopRisk.innerText = `${Math.round(m.populationAtRisk)}%`;
    }
    if (barHealth) {
      barHealth.style.width = `${m.healthServices}%`;
      valHealth.innerText = `${Math.round(m.healthServices)}%`;
    }
    if (barInfra) {
      barInfra.style.width = `${m.infrastructure}%`;
      valInfra.innerText = `${Math.round(m.infrastructure)}%`;
    }
    if (barEnv) {
      barEnv.style.width = `${m.environment}%`;
      valEnv.innerText = `${Math.round(m.environment)}%`;
      if (topValEnv) topValEnv.innerText = `${Math.round(m.environment)}%`;
      if (topMeterEnv) topMeterEnv.style.width = `${m.environment}%`;
    }
    if (topValSafety && topMeterSafety) {
      topValSafety.innerText = `${Math.round(m.safety)}%`;
      topMeterSafety.style.width = `${m.safety}%`;
    }
    if (missionTimer) {
      missionTimer.innerText = engine.scenarioManager.getFormattedTime();
    }

    // Transmite atualização aos celulares conectados
    if (sync && typeof sync.send === 'function') {
      sync.send('CITY_STATE_UPDATE', {
        metrics: m,
        scenario: data.scenario,
        remainingTime: engine.scenarioManager.getFormattedTime()
      });
    }
  };

  // Botão de Iniciar Protocolo no Modal
  if (alertStartBtn) {
    alertStartBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      engine.scenarioManager.startSimulation();
      if (window.soundManager) window.soundManager.playSuccess();
    });
  }

  // Cliques manuais nas decisões da base
  if (bottomDecisionsGrid) {
    bottomDecisionsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.decision-btn');
      if (btn) {
        const action = btn.dataset.action;
        engine.scenarioManager.applyDecision(action);
        btn.classList.add('active');
        if (window.soundManager) window.soundManager.playClick();
        setTimeout(() => btn.classList.remove('active'), 1200);
      }
    });
  }

  // Sincronização com o Celular (Visitantes do Stand)
  sync.on('VISITOR_JOIN_REQUEST', (payload) => {
    const v = payload.visitor;
    if (v.modo === 'coop_p1') {
      if (op1Label) op1Label.innerText = `Operador 1: ${v.nome}`;
      if (hudModeTitle) hudModeTitle.innerText = 'MODO: COOPERATIVO';
    } else if (v.modo === 'coop_p2') {
      if (op2Label) op2Label.innerText = `Operador 2: ${v.nome}`;
      if (hudModeTitle) hudModeTitle.innerText = 'MODO: COOPERATIVO';
    } else {
      if (hudModeTitle) hudModeTitle.innerText = `MODO: INDIVIDUAL (${v.nome})`;
    }
    if (window.soundManager) window.soundManager.playSuccess();
  });

  sync.on('player_action', (payload) => {
    if (payload && payload.actionId) {
      engine.scenarioManager.applyDecision(payload.actionId);
      if (window.soundManager) window.soundManager.playSuccess();
    }
  });

  // Troca dinâmica de botões de decisão conforme o cenário
  window.updateScenarioDecisions = (scenarioId) => {
    if (scenarioId === 'inundacao') {
      if (situationThumbIcon) situationThumbIcon.innerText = '🌧️';
      if (situationText) situationText.innerText = 'Alagamento em vias expressas, sobrecarga nas galerias pluviais e retenção de tráfego.';
      if (bottomDecisionsGrid) {
        bottomDecisionsGrid.innerHTML = `
          <button class="decision-btn" data-action="flood_comportas">
            <span class="decision-icon">🌊</span>
            <span>Acionar comportas e bacias de drenagem</span>
          </button>
          <button class="decision-btn" data-action="flood_resgate">
            <span class="decision-icon">🚤</span>
            <span>Mobilizar Defesa Civil e resgate</span>
          </button>
          <button class="decision-btn" data-action="flood_bloqueio">
            <span class="decision-icon">🚧</span>
            <span>Bloquear vias submersas</span>
          </button>
          <button class="decision-btn" data-action="flood_hospital">
            <span class="decision-icon">🏥</span>
            <span>Rotas emergenciais para o Hospital</span>
          </button>
        `;
      }
    } else {
      if (situationThumbIcon) situationThumbIcon.innerText = '🏙️';
      if (situationText) situationText.innerText = 'Confrontos em áreas centrais causam medo na população e interrupção do transporte.';
      if (bottomDecisionsGrid) {
        bottomDecisionsGrid.innerHTML = `
          <button class="decision-btn" data-action="reforcar_seguranca">
            <span class="decision-icon">🛡️</span>
            <span>Reforçar a segurança</span>
          </button>
          <button class="decision-btn" data-action="abrir_abrigos">
            <span class="decision-icon">➕</span>
            <span>Abrir abrigos temporários</span>
          </button>
          <button class="decision-btn" data-action="manter_transporte">
            <span class="decision-icon">🚌</span>
            <span>Manter o transporte</span>
          </button>
          <button class="decision-btn" data-action="proteger_verdes">
            <span class="decision-icon">🌳</span>
            <span>Proteger áreas verdes</span>
          </button>
        `;
      }
    }
  };
});
