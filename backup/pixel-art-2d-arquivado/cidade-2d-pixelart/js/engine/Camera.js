/**
 * CÂMERA DE ROLAGEM PANORÂMICA 2D
 * Suporte a Câmera Livre, Auto-Tour Cinematográfico para Televisão e Arraste por Mouse/Touch
 */

import { CANVAS_WIDTH, WORLD_WIDTH } from './Constants.js';

export class Camera {
  constructor() {
    this.x = 0;
    this.targetX = 0;
    this.maxScroll = WORLD_WIDTH - CANVAS_WIDTH;
    this.isAutoTour = true;
    this.tourDirection = 1;
    this.tourSpeed = 35; // Pixels por segundo no modo exibição
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragCameraStartX = 0;
  }

  update(delta) {
    if (this.isAutoTour && !this.isDragging) {
      this.targetX += this.tourSpeed * this.tourDirection * delta;

      // Inverte suavemente ao atingir as bordas da cidade
      if (this.targetX >= this.maxScroll) {
        this.targetX = this.maxScroll;
        this.tourDirection = -1;
      } else if (this.targetX <= 0) {
        this.targetX = 0;
        this.tourDirection = 1;
      }
    }

    // Suavização por interpolação linear (LERP)
    this.x += (this.targetX - this.x) * 0.12;

    // Clamping seguro
    if (this.x < 0) this.x = 0;
    if (this.x > this.maxScroll) this.x = this.maxScroll;
  }

  panBy(amount) {
    this.isAutoTour = false; // Desativa tour automático se o usuário interagir
    this.targetX = Math.max(0, Math.min(this.maxScroll, this.targetX + amount));
  }

  panTo(worldX) {
    this.isAutoTour = false;
    this.targetX = Math.max(0, Math.min(this.maxScroll, worldX - CANVAS_WIDTH / 2));
  }

  toggleAutoTour() {
    this.isAutoTour = !this.isAutoTour;
    return this.isAutoTour;
  }

  startDrag(clientX) {
    this.isDragging = true;
    this.isAutoTour = false;
    this.dragStartX = clientX;
    this.dragCameraStartX = this.targetX;
  }

  drag(clientX, canvasScale = 1) {
    if (!this.isDragging) return;
    const diff = (this.dragStartX - clientX) / canvasScale;
    this.targetX = Math.max(0, Math.min(this.maxScroll, this.dragCameraStartX + diff));
  }

  endDrag() {
    this.isDragging = false;
  }
}
