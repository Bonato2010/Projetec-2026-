/**
 * SISTEMA DE TRÂNSITO URBANO — VEÍCULOS DINÂMICOS DO RIO DE JANEIRO
 * Ônibus, Táxis, Unos da Firma, Motoboys, Viaturas e Ambulâncias
 */

import {
  WORLD_WIDTH,
  STREET_LANE_UP_Y,
  STREET_LANE_DOWN_Y
} from '../engine/Constants.js';

import { VehicleSprites } from '../sprites/VehicleSprites.js';

export class TrafficSystem {
  constructor() {
    this.vehicles = [];
    this.sprites = {
      busRight: VehicleSprites.createBus(1),
      busLeft: VehicleSprites.createBus(-1),
      taxiRight: VehicleSprites.createTaxi(1),
      taxiLeft: VehicleSprites.createTaxi(-1),
      unoRight: VehicleSprites.createUnoFirma(1),
      unoLeft: VehicleSprites.createUnoFirma(-1),
      viaturaRight: VehicleSprites.createViaturaPolicial(1),
      viaturaLeft: VehicleSprites.createViaturaPolicial(-1),
      motoboyRight: VehicleSprites.createMotoboy(1),
      motoboyLeft: VehicleSprites.createMotoboy(-1)
    };

    this.initFleet();
  }

  initFleet() {
    this.vehicles = [
      // Faixa Superior (Direção: Esquerda para Direita ->)
      { type: 'bus', x: 200, y: STREET_LANE_UP_Y - 35, speed: 45, dir: 1, w: 155, h: 50 },
      { type: 'taxi', x: 750, y: STREET_LANE_UP_Y - 20, speed: 70, dir: 1, w: 75, h: 32 },
      { type: 'uno', x: 1300, y: STREET_LANE_UP_Y - 22, speed: 65, dir: 1, w: 70, h: 34 },
      { type: 'motoboy', x: 1650, y: STREET_LANE_UP_Y - 18, speed: 90, dir: 1, w: 42, h: 32 },
      { type: 'taxi', x: 2100, y: STREET_LANE_UP_Y - 20, speed: 68, dir: 1, w: 75, h: 32 },
      { type: 'bus', x: 2700, y: STREET_LANE_UP_Y - 35, speed: 48, dir: 1, w: 155, h: 50 },

      // Faixa Inferior (Direção: Direita para Esquerda <-)
      { type: 'viatura', x: 500, y: STREET_LANE_DOWN_Y - 22, speed: 85, dir: -1, w: 78, h: 33 },
      { type: 'motoboy', x: 1050, y: STREET_LANE_DOWN_Y - 18, speed: 95, dir: -1, w: 42, h: 32 },
      { type: 'uno', x: 1500, y: STREET_LANE_DOWN_Y - 22, speed: 60, dir: -1, w: 70, h: 34 },
      { type: 'taxi', x: 1950, y: STREET_LANE_DOWN_Y - 20, speed: 72, dir: -1, w: 75, h: 32 },
      { type: 'bus', x: 2450, y: STREET_LANE_DOWN_Y - 35, speed: 50, dir: -1, w: 155, h: 50 },
      { type: 'uno', x: 3200, y: STREET_LANE_DOWN_Y - 22, speed: 65, dir: -1, w: 70, h: 34 }
    ];
  }

  update(delta, scenario, waterLevel) {
    const isFlood = scenario === 'inundacao' && waterLevel > 10;
    const isEmergency = scenario === 'emergencia';

    this.vehicles.forEach(v => {
      let currentSpeed = v.speed;

      // 1. Reação à Inundação / Alagamento
      if (isFlood) {
        // Reduz drasticamente a velocidade na água
        currentSpeed = Math.max(8, v.speed * 0.2);
        // Se a água for profunda (>20px), carros menores param
        if (waterLevel > 22 && (v.type === 'taxi' || v.type === 'uno')) {
          currentSpeed = 0; // Ilhado na enchente
        }
      }

      // 2. Reação à Emergência Urbana / Interdição
      if (isEmergency) {
        if (v.type === 'viatura') {
          currentSpeed = 130; // Viatura acelera com urgência
        } else {
          // Bloqueio próximo ao km 1.8 do mapa
          if (v.x > 1700 && v.x < 1900) {
            currentSpeed = 0; // Fila parada na blitz/bloqueio
          }
        }
      }

      // Atualiza posição X
      v.x += currentSpeed * v.dir * delta;

      // Respawn em loop infinito no mundo panorâmico
      if (v.dir === 1 && v.x > WORLD_WIDTH + 100) {
        v.x = -v.w - 50;
      } else if (v.dir === -1 && v.x < -v.w - 100) {
        v.x = WORLD_WIDTH + 50;
      }
    });
  }

  render(ctx, cameraX, scenario, isNight, waterLevel) {
    const time = Date.now();
    const hazardFlash = Math.floor(time / 450) % 2 === 0;
    const sirenFlash = Math.floor(time / 140) % 2 === 0;

    this.vehicles.forEach(v => {
      // Frustum culling para renderizar apenas veículos visíveis
      if (v.x + v.w > cameraX - 50 && v.x < cameraX + 1020) {
        const sprite = this.getSpriteFor(v);
        if (sprite) {
          ctx.drawImage(sprite, Math.floor(v.x), Math.floor(v.y));

          // 1. Faróis iluminando o asfalto à noite ou no blecaute
          if (isNight || scenario === 'blecaute' || scenario === 'inundacao') {
            const beamX = v.dir === 1 ? v.x + v.w : v.x;
            const beamGrad = ctx.createRadialGradient(
              beamX, v.y + v.h - 10, 2,
              beamX + (v.dir * 80), v.y + v.h - 5, 70
            );
            beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
            beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
            ctx.fillStyle = beamGrad;
            ctx.beginPath();
            ctx.moveTo(beamX, v.y + v.h - 14);
            ctx.lineTo(beamX + (v.dir * 85), v.y + v.h - 22);
            ctx.lineTo(beamX + (v.dir * 85), v.y + v.h + 8);
            ctx.closePath();
            ctx.fill();
          }

          // 2. Pisca-alerta piscando em caso de inundação
          if (scenario === 'inundacao' && hazardFlash) {
            ctx.fillStyle = '#f97316';
            ctx.fillRect(v.x - 2, v.y + v.h - 14, 4, 4);
            ctx.fillRect(v.x + v.w - 2, v.y + v.h - 14, 4, 4);
          }

          // 3. Giroflex estroboscópico na viatura policial
          if (v.type === 'viatura') {
            const lightX = v.dir === 1 ? v.x + 36 : v.x + 30;
            const lightColor = sirenFlash ? 'rgba(239, 68, 68, 0.65)' : 'rgba(59, 130, 246, 0.65)';
            ctx.fillStyle = lightColor;
            ctx.beginPath();
            ctx.arc(lightX, v.y + 5, 14, 0, Math.PI * 2);
            ctx.fill();
          }

          // 4. Spray de água saindo das rodas em poças d'água
          if (waterLevel > 4 && v.speed > 10) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            const rX1 = v.x + 18, rX2 = v.x + v.w - 22;
            ctx.fillRect(rX1 + (Math.random() * 8 - 4), v.y + v.h - 4, 3, 3);
            ctx.fillRect(rX2 + (Math.random() * 8 - 4), v.y + v.h - 4, 3, 3);
          }
        }
      }
    });
  }

  getSpriteFor(v) {
    if (v.type === 'bus') return v.dir === 1 ? this.sprites.busRight : this.sprites.busLeft;
    if (v.type === 'taxi') return v.dir === 1 ? this.sprites.taxiRight : this.sprites.taxiLeft;
    if (v.type === 'uno') return v.dir === 1 ? this.sprites.unoRight : this.sprites.unoLeft;
    if (v.type === 'viatura') return v.dir === 1 ? this.sprites.viaturaRight : this.sprites.viaturaLeft;
    if (v.type === 'motoboy') return v.dir === 1 ? this.sprites.motoboyRight : this.sprites.motoboyLeft;
    return null;
  }
}
