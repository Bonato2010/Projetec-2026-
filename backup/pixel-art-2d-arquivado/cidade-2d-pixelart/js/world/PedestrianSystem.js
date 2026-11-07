/**
 * SISTEMA DE PEDESTRES E VIDA URBANA — RIO DE JANEIRO EM PIXEL ART
 * Garis da Comlurb, Moradores de Chinelo, Estudantes da PCRJ e Enfermagem
 */

import {
  WORLD_WIDTH,
  SIDEWALK_TOP_Y,
  FOREGROUND_WALK_Y
} from '../engine/Constants.js';

import { CharacterSprites } from '../sprites/CharacterSprites.js';

export class PedestrianSystem {
  constructor() {
    this.pedestrians = [];
    this.carameloDog = null;

    // Cache de frames de animação
    this.animSets = {
      gariRight: CharacterSprites.createGariFrames(1),
      gariLeft: CharacterSprites.createGariFrames(-1),
      moradorRight: CharacterSprites.createMoradorFrames(1, false),
      moradorLeft: CharacterSprites.createMoradorFrames(-1, false),
      moradorUmbrellaRight: CharacterSprites.createMoradorFrames(1, true),
      moradorUmbrellaLeft: CharacterSprites.createMoradorFrames(-1, true),
      estudanteRight: CharacterSprites.createEstudanteFrames(1),
      estudanteLeft: CharacterSprites.createEstudanteFrames(-1),
      enfermeiraRight: CharacterSprites.createEnfermeiraFrames(1),
      enfermeiraLeft: CharacterSprites.createEnfermeiraFrames(-1),
      carameloRight: CharacterSprites.createCarameloFrames(1),
      carameloLeft: CharacterSprites.createCarameloFrames(-1)
    };

    this.initPopulation();
  }

  initPopulation() {
    this.pedestrians = [
      // 1. Gari da Comlurb varrendo a calçada próxima ao boteco
      { type: 'gari', x: 380, y: SIDEWALK_TOP_Y + 12, speed: 12, dir: 1, animTimer: 0, frame: 0 },
      // 2. Morador carioca passeando na calçada do primeiro plano
      { type: 'morador', x: 520, y: FOREGROUND_WALK_Y + 6, speed: 28, dir: 1, animTimer: 0, frame: 0 },
      // 3. Estudante da prefeitura voltando da escola
      { type: 'estudante', x: 860, y: SIDEWALK_TOP_Y + 14, speed: 32, dir: -1, animTimer: 0, frame: 0 },
      // 4. Enfermeira saindo da Clínica da Família
      { type: 'enfermeira', x: 790, y: SIDEWALK_TOP_Y + 12, speed: 30, dir: 1, animTimer: 0, frame: 0 },
      // 5. Mais moradores e transeuntes
      { type: 'morador', x: 1350, y: SIDEWALK_TOP_Y + 12, speed: 25, dir: -1, animTimer: 0, frame: 0 },
      { type: 'estudante', x: 1720, y: FOREGROUND_WALK_Y + 6, speed: 30, dir: 1, animTimer: 0, frame: 0 },
      { type: 'gari', x: 2200, y: SIDEWALK_TOP_Y + 12, speed: 14, dir: 1, animTimer: 0, frame: 0 },
      { type: 'morador', x: 2650, y: SIDEWALK_TOP_Y + 14, speed: 24, dir: -1, animTimer: 0, frame: 0 }
    ];

    // O clássico Cachorro Vira-lata Caramelo acompanhando o morador
    this.carameloDog = {
      x: 485,
      y: FOREGROUND_WALK_Y + 18,
      speed: 30,
      dir: 1,
      animTimer: 0,
      frame: 0
    };
  }

  update(delta, scenario, isStorm) {
    const isEmergency = scenario === 'emergencia';

    // 1. Atualiza pedestres
    this.pedestrians.forEach(p => {
      let speed = p.speed;
      if (isEmergency) speed *= 1.6; // Pessoas correm para se proteger
      if (isStorm) speed *= 1.2;

      p.x += speed * p.dir * delta;

      // Animação de caminhada (walk cycle)
      p.animTimer += delta * (speed / 12);
      if (p.animTimer > 0.16) {
        p.frame = (p.frame + 1) % 4;
        p.animTimer = 0;
      }

      // Loop do mundo
      if (p.dir === 1 && p.x > WORLD_WIDTH + 60) {
        p.x = -40;
      } else if (p.dir === -1 && p.x < -60) {
        p.x = WORLD_WIDTH + 40;
      }
    });

    // 2. Atualiza Vira-lata Caramelo
    if (this.carameloDog) {
      const dog = this.carameloDog;
      dog.x += dog.speed * dog.dir * delta;
      dog.animTimer += delta * 12;
      if (dog.animTimer > 0.12) {
        dog.frame = (dog.frame + 1) % 4;
        dog.animTimer = 0;
      }
      if (dog.dir === 1 && dog.x > WORLD_WIDTH + 80) dog.x = -50;
      else if (dog.dir === -1 && dog.x < -80) dog.x = WORLD_WIDTH + 50;
    }
  }

  render(ctx, cameraX, isStorm = false) {
    // 1. Renderiza pedestres
    this.pedestrians.forEach(p => {
      if (p.x > cameraX - 40 && p.x < cameraX + 1000) {
        const frames = this.getFramesFor(p, isStorm);
        if (frames && frames[p.frame]) {
          ctx.drawImage(frames[p.frame], Math.floor(p.x), Math.floor(p.y));
        }
      }
    });

    // 2. Renderiza Vira-lata Caramelo
    if (this.carameloDog) {
      const dog = this.carameloDog;
      if (dog.x > cameraX - 40 && dog.x < cameraX + 1000) {
        const dogFrames = dog.dir === 1 ? this.animSets.carameloRight : this.animSets.carameloLeft;
        if (dogFrames && dogFrames[dog.frame]) {
          ctx.drawImage(dogFrames[dog.frame], Math.floor(dog.x), Math.floor(dog.y));
        }
      }
    }
  }

  getFramesFor(p, isStorm) {
    if (p.type === 'gari') {
      return p.dir === 1 ? this.animSets.gariRight : this.animSets.gariLeft;
    }
    if (p.type === 'morador') {
      if (isStorm) {
        return p.dir === 1 ? this.animSets.moradorUmbrellaRight : this.animSets.moradorUmbrellaLeft;
      }
      return p.dir === 1 ? this.animSets.moradorRight : this.animSets.moradorLeft;
    }
    if (p.type === 'estudante') {
      return p.dir === 1 ? this.animSets.estudanteRight : this.animSets.estudanteLeft;
    }
    if (p.type === 'enfermeira') {
      return p.dir === 1 ? this.animSets.enfermeiraRight : this.animSets.enfermeiraLeft;
    }
    return this.animSets.moradorRight;
  }
}
