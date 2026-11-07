/**
 * CONTROLADOR DE INTERFACE (HUD) PARA TV E APRESENTAÇÃO
 * Botões táteis, seletores de ocorrência, controle de horário e atalhos de teclado
 */

import { SCENARIOS } from '../engine/Constants.js';

export class HUDController {
  constructor({ scenarioManager, camera, audio, onTimeChange, onToggleHud }) {
    this.scenarioManager = scenarioManager;
    this.camera = camera;
    this.audio = audio;
    this.onTimeChange = onTimeChange;
    this.onToggleHud = onToggleHud;

    this.hudElement = document.getElementById('city-hud');
    this.toastElement = document.getElementById('scenario-toast');

    this.initEventListeners();
  }

  initEventListeners() {
    // 1. Botões de Cenário / Ocorrência
    const scenarioBtns = document.querySelectorAll('[data-scenario]');
    scenarioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-scenario');
        this.scenarioManager.setScenario(key);
        this.updateActiveScenarioUI(key);
      });
    });

    // 2. Botões de Horário do Dia
    const timeBtns = document.querySelectorAll('[data-time]');
    timeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const timeKey = btn.getAttribute('data-time');
        if (this.onTimeChange) this.onTimeChange(timeKey);
        this.updateActiveTimeUI(timeKey);
      });
    });

    // 3. Botão de Câmera Auto-Tour
    const tourBtn = document.getElementById('btn-auto-tour');
    if (tourBtn) {
      tourBtn.addEventListener('click', () => {
        const active = this.camera.toggleAutoTour();
        tourBtn.classList.toggle('active', active);
        tourBtn.textContent = active ? '⏸️ Pausar Tour' : '▶️ Auto-Tour TV';
      });
    }

    // 4. Botão de Áudio
    const audioBtn = document.getElementById('btn-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isPlaying = this.audio.toggle();
        audioBtn.classList.toggle('active', isPlaying);
        audioBtn.textContent = isPlaying ? '🔊 Áudio: Ativo' : '🔇 Áudio: Mudo';
      });
    }

    // 5. Botão de Ocultar/Exibir HUD
    const hideBtn = document.getElementById('btn-toggle-hud');
    if (hideBtn) {
      hideBtn.addEventListener('click', () => {
        if (this.onToggleHud) this.onToggleHud();
      });
    }

    // 6. Atalhos de Teclado Rápidos
    window.addEventListener('keydown', (e) => {
      // Evita disparar se estiver digitando em input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toUpperCase();
      if (key === '1') this.triggerScenario(SCENARIOS.NORMAL);
      else if (key === '2') this.triggerScenario(SCENARIOS.INUNDACAO);
      else if (key === '3') this.triggerScenario(SCENARIOS.EMERGENCIA);
      else if (key === '4') this.triggerScenario(SCENARIOS.BLECAUTE);
      else if (key === '5') this.triggerScenario(SCENARIOS.ONDA_CALOR);
      else if (key === 'C') {
        const active = this.camera.toggleAutoTour();
        if (tourBtn) {
          tourBtn.classList.toggle('active', active);
          tourBtn.textContent = active ? '⏸️ Pausar Tour' : '▶️ Auto-Tour TV';
        }
      }
      else if (key === 'M') {
        const isPlaying = this.audio.toggle();
        if (audioBtn) {
          audioBtn.classList.toggle('active', isPlaying);
          audioBtn.textContent = isPlaying ? '🔊 Áudio: Ativo' : '🔇 Áudio: Mudo';
        }
      }
      else if (key === 'H') {
        if (this.onToggleHud) this.onToggleHud();
      }
      else if (key === 'ARROWLEFT' || key === 'A') {
        this.camera.panBy(-80);
      }
      else if (key === 'ARROWRIGHT' || key === 'D') {
        this.camera.panBy(80);
      }
    });

    // Registra callback do ScenarioManager para atualizar Toast
    this.scenarioManager.onScenarioChange = (key, info) => {
      this.showToast(info.title, info.desc, info.icon);
    };
  }

  triggerScenario(key) {
    this.scenarioManager.setScenario(key);
    this.updateActiveScenarioUI(key);
  }

  updateActiveScenarioUI(activeKey) {
    document.querySelectorAll('[data-scenario]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-scenario') === activeKey);
    });
  }

  updateActiveTimeUI(activeTime) {
    document.querySelectorAll('[data-time]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-time') === activeTime);
    });
  }

  showToast(title, desc, icon = 'ℹ️') {
    if (!this.toastElement) return;
    this.toastElement.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-body">
        <strong>${title}</strong>
        <p>${desc}</p>
      </div>
    `;
    this.toastElement.classList.add('visible');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastElement.classList.remove('visible');
    }, 4500);
  }
}
