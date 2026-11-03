/**
 * PROJETO V.I.D.A. — SIMULADOR HIDRODINÂMICO E AMORTECIMENTO DE CHEIAS
 * Controlador da Aplicação e Painel de Métricas Hidrológicas
 * Parque Realengo Jornalista Susana Naspolini • Rio de Janeiro
 */

class HidroApp {
  constructor() {
    this.sim = null;
    this.rainIntensity = 50;
    this.hasPark = true;
    this.isPaused = false;
  }

  init() {
    this.sim = new HidroSimulation('sim-canvas');
    this.initControls();
    this.initMobileTabs();
    this.updateMetricsUI();
    this.handleUrlParams();
  }

  initControls() {
    const slider = document.getElementById('rain-slider');
    const btnWithPark = document.getElementById('btn-scenario-park');
    const btnNoPark = document.getElementById('btn-scenario-nopark');
    const btnToggleRain = document.getElementById('btn-toggle-rain');

    if (slider) {
      slider.addEventListener('input', (e) => {
        this.rainIntensity = parseInt(e.target.value, 10);
        this.updatePresetButtons(this.rainIntensity);
        document.getElementById('rain-val-display').innerText = `${this.rainIntensity} mm/h`;
        if (this.sim) this.sim.setIntensity(this.rainIntensity);
        this.updateMetricsUI();
      });
    }

    if (btnWithPark && btnNoPark) {
      btnWithPark.addEventListener('click', () => {
        this.hasPark = true;
        btnWithPark.classList.add('active');
        btnNoPark.classList.remove('active');
        if (this.sim) this.sim.setScenario(true);
        this.updateMetricsUI();
      });

      btnNoPark.addEventListener('click', () => {
        this.hasPark = false;
        btnNoPark.classList.add('active');
        btnWithPark.classList.remove('active');
        if (this.sim) this.sim.setScenario(false);
        this.updateMetricsUI();
      });
    }

    // Presets rápidos calibrados
    document.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-val'), 10);
        if (slider) slider.value = val;
        this.rainIntensity = val;
        this.updatePresetButtons(val);
        document.getElementById('rain-val-display').innerText = `${val} mm/h`;
        if (this.sim) this.sim.setIntensity(val);
        this.updateMetricsUI();
      });
    });

    // Pausar / Retomar Simulação
    if (btnToggleRain) {
      btnToggleRain.addEventListener('click', () => {
        this.isPaused = !this.isPaused;
        if (this.sim) this.sim.setPaused(this.isPaused);
        btnToggleRain.querySelector('span').innerText = this.isPaused ? 'Simulação Pausada' : 'Simulação Ativa';
        btnToggleRain.style.color = this.isPaused ? 'var(--amber-primary)' : 'var(--text-secondary)';
      });
    }
  }

  updatePresetButtons(val) {
    document.querySelectorAll('.btn-preset').forEach(btn => {
      const bVal = parseInt(btn.getAttribute('data-val'), 10);
      if (bVal === val) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  initMobileTabs() {
    const btnViewport = document.getElementById('btn-tab-viewport');
    const btnControls = document.getElementById('btn-tab-controls');
    const panelControls = document.getElementById('controls-panel');
    const panelViewport = document.getElementById('viewport-panel');

    if (!btnViewport || !btnControls || !panelControls || !panelViewport) return;

    btnViewport.addEventListener('click', () => {
      btnViewport.classList.add('active');
      btnControls.classList.remove('active');
      panelViewport.classList.remove('mobile-hidden');
      panelControls.classList.add('mobile-hidden');
      if (this.sim) this.sim.setupResolution();
    });

    btnControls.addEventListener('click', () => {
      btnControls.classList.add('active');
      btnViewport.classList.remove('active');
      panelControls.classList.remove('mobile-hidden');
      panelViewport.classList.add('mobile-hidden');
    });

    // Ajuste no resize de janela
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) {
        panelControls.classList.remove('mobile-hidden');
        panelViewport.classList.remove('mobile-hidden');
      }
    });
  }

  updateMetricsUI() {
    const elRetencao = document.getElementById('metric-retencao-val');
    const elRetencaoPct = document.getElementById('metric-retencao-pct');
    const elRetencaoBar = document.getElementById('retencao-bar-fill');
    const elGaugeFill = document.getElementById('gauge-fill');
    const elGaugePct = document.getElementById('gauge-pct-display');

    const elPerm = document.getElementById('metric-perm-val');
    const elPermDesc = document.getElementById('metric-perm-desc');
    const elInfil = document.getElementById('metric-infil-val');
    const elRisco = document.getElementById('metric-risco-badge');

    if (this.hasPark) {
      // Cenário com Parque Susana Naspolini (SbN): Lago de 1.950 m³ (1,95 mi L)
      const vol = Math.min(1950, Math.round(500 + (this.rainIntensity / 100) * 1450));
      const pct = Math.min(100, Math.round((vol / 1950) * 100));

      if (elRetencao) elRetencao.innerText = vol.toLocaleString('pt-BR');
      if (elRetencaoPct) elRetencaoPct.innerText = `${pct}%`;
      if (elRetencaoBar) elRetencaoBar.style.width = `${pct}%`;
      if (elGaugeFill) elGaugeFill.style.height = `${pct}%`;
      if (elGaugePct) elGaugePct.innerText = `${pct}%`;

      if (elPerm) {
        elPerm.innerText = "84,2%";
        elPerm.className = "kpi-number color-success";
      }
      if (elPermDesc) elPermDesc.innerText = "Solo vivo, biovaletas drenantes e jardins de chuva";

      const infilRate = (this.rainIntensity * 1.8).toFixed(1);
      if (elInfil) elInfil.innerText = infilRate;

      if (this.rainIntensity <= 65) {
        if (elRisco) {
          elRisco.className = "risk-badge-box risk-low";
          elRisco.innerHTML = '<span class="risk-dot"></span><span class="risk-text">Estável &bull; Retenção Total de Enxurrada</span>';
        }
      } else {
        if (elRisco) {
          elRisco.className = "risk-badge-box risk-mid";
          elRisco.innerHTML = '<span class="risk-dot"></span><span class="risk-text">Atenção &bull; Bacia Próxima à Capacidade Máxima</span>';
        }
      }
    } else {
      // Cenário Pré-Parque (2021) — Degradação e impermeabilidade
      if (elRetencao) elRetencao.innerText = "0";
      if (elRetencaoPct) elRetencaoPct.innerText = "0%";
      if (elRetencaoBar) elRetencaoBar.style.width = "0%";
      if (elGaugeFill) elGaugeFill.style.height = "0%";
      if (elGaugePct) elGaugePct.innerText = "0%";

      if (elPerm) {
        elPerm.innerText = "11,8%";
        elPerm.className = "kpi-number color-info";
        elPerm.style.color = "var(--rose-primary)";
      }
      if (elPermDesc) elPermDesc.innerText = "Solo compactado e impermeabilizado (escoamento superficial 88,2%)";

      if (elInfil) elInfil.innerText = "2,4";

      if (elRisco) {
        elRisco.className = "risk-badge-box risk-high";
        elRisco.innerHTML = '<span class="risk-dot"></span><span class="risk-text">Crítico &bull; Risco Severo de Enxurrada e Alagamento</span>';
      }
    }
  }

  handleUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('rain')) {
        const r = parseInt(params.get('rain'), 10);
        const slider = document.getElementById('rain-slider');
        if (slider) slider.value = r;
        this.rainIntensity = r;
        this.updatePresetButtons(r);
        if (this.sim) this.sim.setIntensity(r);
        document.getElementById('rain-val-display').innerText = `${r} mm/h`;
        this.updateMetricsUI();
      }
      if (params.get('park') === 'false') {
        const btnNoPark = document.getElementById('btn-scenario-nopark');
        if (btnNoPark) btnNoPark.click();
      }
    } catch(e) {
      console.warn("URL params error:", e);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.HidroApp = new HidroApp();
  window.HidroApp.init();
});
