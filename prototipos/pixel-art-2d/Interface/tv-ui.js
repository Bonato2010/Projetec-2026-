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

  // Função auxiliar para definir cor e barra de impacto
  function updateBar(barEl, valEl, val) {
    if (!barEl || !valEl) return;
    const rounded = Math.round(val);
    barEl.style.width = `${rounded}%`;
    valEl.innerText = `${rounded}%`;
    let color = '#10b981'; // verde >= 70
    if (rounded < 40) {
      color = '#ef4444'; // vermelho < 40
    } else if (rounded < 70) {
      color = '#f59e0b'; // âmbar 40-69
    }
    barEl.style.background = color;
    valEl.style.color = color;
  }

  // Atualizador das Barras de Impacto e Indicadores
  engine.scenarioManager.onUpdateCallback = (data) => {
    const m = data.metrics;
    // População Protegida (maior = melhor)
    updateBar(barPopRisk, valPopRisk, m.populationAtRisk);
    // Serviços de Saúde
    updateBar(barHealth, valHealth, m.healthServices);
    // Infraestrutura
    updateBar(barInfra, valInfra, m.infrastructure);
    // Meio Ambiente / Sustentabilidade
    updateBar(barEnv, valEnv, m.environment);
    if (topValEnv && topMeterEnv) {
      topValEnv.innerText = `${Math.round(m.environment)}%`;
      topMeterEnv.style.width = `${m.environment}%`;
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

  let connectedOperatorsCount = 0;

  // Sincronização com o Celular (Visitantes do Stand)
  sync.on('VISITOR_JOIN_REQUEST', (payload) => {
    const v = payload.visitor;
    connectedOperatorsCount = Math.min(2, connectedOperatorsCount + 1);
    if (v.modo === 'coop_p1') {
      if (op1Label) op1Label.innerText = `Operador 1: ${v.nome}`;
      if (hudModeTitle) hudModeTitle.innerText = 'MODO: COOPERATIVO';
    } else if (v.modo === 'coop_p2') {
      if (op2Label) op2Label.innerText = `Operador 2: ${v.nome}`;
      if (hudModeTitle) hudModeTitle.innerText = 'MODO: COOPERATIVO';
    } else {
      if (hudModeTitle) hudModeTitle.innerText = `MODO: INDIVIDUAL (${v.nome})`;
    }

    // Se 2 operadores conectados, esconde QR e mostra PARTIDA CHEIA
    if (connectedOperatorsCount >= 2) {
      const qrBox = document.getElementById('tv-qr-box');
      const qrLabel = document.getElementById('qr-label-text');
      const qrCorner = document.getElementById('eco-qr-corner');
      if (qrBox) qrBox.style.display = 'none';
      if (qrLabel) qrLabel.innerText = 'PARTIDA CHEIA';
      if (qrCorner) qrCorner.style.borderColor = 'var(--border-neon-green)';
    } else {
      const qrBox = document.getElementById('tv-qr-box');
      const qrLabel = document.getElementById('qr-label-text');
      if (qrBox) qrBox.style.display = 'block';
      if (qrLabel) qrLabel.innerText = 'CONECTAR CELULAR';
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
