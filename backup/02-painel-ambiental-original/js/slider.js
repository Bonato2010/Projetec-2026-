/**
 * CENTRAL DE MONITORAMENTO AMBIENTAL V.I.D.A.
 * Módulo de Comparação Interativa Antes / Depois (Slider Interativo)
 * 2021 (Terreno Militar Árido) vs 2024/2026 (Parque Realengo Susana Naspolini)
 */

class VidaSlider {
  constructor() {
    this.container = null;
    this.sliderHandle = null;
    this.beforeLayer = null;
    this.isDragging = false;
    this.position = 50; // porcentagem inicial
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.sliderHandle = this.container.querySelector('.slider-handle');
    this.beforeLayer = this.container.querySelector('.slider-layer-before');

    this.attachEvents();
    this.updatePosition(50);
  }

  attachEvents() {
    if (!this.sliderHandle || !this.container) return;

    const startDrag = (e) => {
      this.isDragging = true;
      document.body.style.userSelect = 'none';
    };

    const stopDrag = () => {
      this.isDragging = false;
      document.body.style.userSelect = '';
    };

    const onMove = (e) => {
      if (!this.isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const rect = this.container.getBoundingClientRect();
      let pos = ((clientX - rect.left) / rect.width) * 100;
      pos = Math.max(5, Math.min(95, pos));
      this.updatePosition(pos);
    };

    this.sliderHandle.addEventListener('mousedown', startDrag);
    this.sliderHandle.addEventListener('touchstart', startDrag, { passive: true });

    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    // Permite clicar direto na barra para pular para a posição
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('.slider-handle')) return;
      const rect = this.container.getBoundingClientRect();
      let pos = ((e.clientX - rect.left) / rect.width) * 100;
      pos = Math.max(5, Math.min(95, pos));
      this.updatePosition(pos);
    });
  }

  updatePosition(pct) {
    this.position = pct;
    if (this.beforeLayer) {
      this.beforeLayer.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
    }
    if (this.sliderHandle) {
      this.sliderHandle.style.left = `${pct}%`;
    }
  }

  setPreset(preset) {
    if (preset === 'antes') {
      this.animateTo(92);
    } else if (preset === 'depois') {
      this.animateTo(8);
    } else {
      this.animateTo(50);
    }
  }

  animateTo(targetPct) {
    const startPct = this.position;
    const duration = 400;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentPos = startPct + (targetPct - startPct) * ease;
      this.updatePosition(currentPos);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }
}

window.VidaSlider = new VidaSlider();
