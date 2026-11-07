/**
 * PONTO DE ENTRADA PRINCIPAL — CIDADE DO RIO DE JANEIRO 2D EM PIXEL ART
 * Engine Game Loop, Canvas Renderer, Integração de Sistemas e Responsividade
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, TIME_PALETTES, SCENARIOS } from './engine/Constants.js';
import { Camera } from './engine/Camera.js';
import { AudioAmbiance } from './engine/AudioAmbiance.js';
import { WeatherSystem } from './engine/WeatherSystem.js';
import { ParallaxBackdrop } from './world/ParallaxBackdrop.js';
import { CityWorld } from './world/CityWorld.js';
import { TrafficSystem } from './world/TrafficSystem.js';
import { PedestrianSystem } from './world/PedestrianSystem.js';
import { ScenarioManager } from './scenarios/ScenarioManager.js';
import { HUDController } from './ui/HUDController.js';

class PixelCityApp {
  constructor() {
    this.canvas = document.getElementById('city-canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.ctx.imageSmoothingEnabled = false;

    // Resolução lógica fixa (960 x 540) para Pixel Art nítido
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    // Subsistemas do Engine
    this.camera = new Camera();
    this.audio = new AudioAmbiance();
    this.weather = new WeatherSystem();
    this.backdrop = new ParallaxBackdrop();
    this.world = new CityWorld();
    this.traffic = new TrafficSystem();
    this.pedestrians = new PedestrianSystem();
    this.scenarioManager = new ScenarioManager(this.audio);

    // Estado de Tempo e Clima
    this.currentTimeKey = 'day';
    this.timePalette = TIME_PALETTES.day;
    this.timeRatio = 0.5; // Posição do sol
    this.lastTime = performance.now();
    this.isHudVisible = true;

    // Inicializa Interface HUD
    this.hud = new HUDController({
      scenarioManager: this.scenarioManager,
      camera: this.camera,
      audio: this.audio,
      onTimeChange: (timeKey) => this.setTimeOfDay(timeKey),
      onToggleHud: () => this.toggleHud()
    });

    this.initInput();
    this.startLoop();
  }

  setTimeOfDay(timeKey) {
    if (TIME_PALETTES[timeKey]) {
      this.currentTimeKey = timeKey;
      this.timePalette = TIME_PALETTES[timeKey];
      if (timeKey === 'dawn') this.timeRatio = 0.2;
      else if (timeKey === 'day') this.timeRatio = 0.5;
      else if (timeKey === 'sunset') this.timeRatio = 0.8;
      else if (timeKey === 'night') this.timeRatio = 0.95;
    }
  }

  toggleHud() {
    this.isHudVisible = !this.isHudVisible;
    const hudContainer = document.getElementById('city-hud');
    if (hudContainer) {
      hudContainer.classList.toggle('hidden', !this.isHudVisible);
    }
    const indicator = document.getElementById('hud-hint');
    if (indicator) {
      indicator.style.display = this.isHudVisible ? 'none' : 'block';
    }
  }

  initInput() {
    // Arraste com o Mouse para navegar pela cidade
    let isMouseDown = false;
    this.canvas.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      this.camera.startDrag(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isMouseDown) {
        const rect = this.canvas.getBoundingClientRect();
        const scale = rect.width / CANVAS_WIDTH;
        this.camera.drag(e.clientX, scale);
      }
    });

    window.addEventListener('mouseup', () => {
      if (isMouseDown) {
        isMouseDown = false;
        this.camera.endDrag();
      }
    });

    // Suporte a Touch para Celulares e Telas Interativas
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.camera.startDrag(e.touches[0].clientX);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        const scale = rect.width / CANVAS_WIDTH;
        this.camera.drag(e.touches[0].clientX, scale);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.camera.endDrag();
    });
  }

  startLoop() {
    const loop = (now) => {
      const delta = Math.min((now - this.lastTime) / 1000, 0.1); // Trava delta máximo
      this.lastTime = now;

      this.update(delta);
      this.render();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(delta) {
    const scenario = this.scenarioManager.currentScenario;
    const isStorm = scenario === SCENARIOS.INUNDACAO;

    this.camera.update(delta);
    this.world.update(delta, scenario, isStorm);
    this.traffic.update(delta, scenario, this.world.waterLevel);
    this.pedestrians.update(delta, scenario, isStorm);
    this.weather.update(delta, scenario, isStorm);
  }

  render() {
    const ctx = this.ctx;
    const cameraX = this.camera.x;
    const scenario = this.scenarioManager.currentScenario;
    const isStorm = scenario === SCENARIOS.INUNDACAO;
    const isBlackout = scenario === SCENARIOS.BLECAUTE;
    const isNight = this.currentTimeKey === 'night';

    // Limpa quadro
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Planos de Fundo com Parallax (Céu, Sol/Lua, Montanhas e Morro com Casario)
    this.backdrop.render(ctx, cameraX, this.timePalette, this.timeRatio, isStorm);

    // 2. Cidade Ativa (Fachadas, Calçadas de Pedras Portuguesas, Postes, Água da Chuva)
    this.world.render(ctx, cameraX, isBlackout, isNight, isStorm);

    // 3. Trânsito Veicular (Ônibus, Táxis, Viaturas, Motoboys)
    ctx.save();
    ctx.translate(-Math.floor(cameraX), 0);
    this.traffic.render(ctx, cameraX, scenario, isNight, this.world.waterLevel);

    // 4. Pedestres e Vida Urbana (Garis, Moradores, Estudantes, Enfermagem)
    this.pedestrians.render(ctx, cameraX, isStorm);
    ctx.restore();

    // 5. Efeitos Climáticos e Filtros de Iluminação (Chuva, Trovões, Calor, Noite)
    this.weather.render(ctx, scenario, isStorm, this.timePalette, isBlackout);
  }
}

// Inicializa a aplicação ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  window.__pixelCity = new PixelCityApp();
});
