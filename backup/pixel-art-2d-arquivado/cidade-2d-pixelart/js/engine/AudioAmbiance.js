/**
 * SÍNTESE DE ÁUDIO AMBIENTAL PROCEDURAL VIA WEB AUDIO API
 * Pássaros matinais, ruído urbano, chuva, trovões, sirenes de emergência e estalo elétrico
 */

export class AudioAmbiance {
  constructor() {
    this.ctx = null;
    this.isEnabled = false;
    this.noiseNode = null;
    this.noiseGain = null;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.sirenTimer = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API não suportada neste navegador.');
    }
  }

  toggle() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isEnabled = !this.isEnabled;
    if (this.isEnabled) {
      this.startCityHum();
    } else {
      this.stopAll();
    }
    return this.isEnabled;
  }

  startCityHum() {
    if (!this.ctx || !this.isEnabled) return;
    // Cria ruído branco filtrado suave para representar o fluxo urbano
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filtro passa-baixa suave
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    whiteNoise.start();

    this.noiseNode = whiteNoise;
    this.noiseGain = gain;
  }

  // Efeito sonoro de trovão distante
  playThunder() {
    if (!this.ctx || !this.isEnabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 1.8);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.0);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 2.0);
  }

  // Sirene de emergência para o cenário de bloqueio/emergência
  startSiren() {
    if (!this.ctx || !this.isEnabled || this.sirenOsc) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();

    let high = true;
    this.sirenTimer = setInterval(() => {
      if (!this.ctx) return;
      const targetFreq = high ? 780 : 540;
      osc.frequency.linearRampToValueAtTime(targetFreq, this.ctx.currentTime + 0.35);
      high = !high;
    }, 400);

    this.sirenOsc = osc;
    this.sirenGain = gain;
  }

  stopSiren() {
    if (this.sirenTimer) {
      clearInterval(this.sirenTimer);
      this.sirenTimer = null;
    }
    if (this.sirenOsc) {
      this.sirenOsc.stop();
      this.sirenOsc.disconnect();
      this.sirenOsc = null;
    }
  }

  // Estalo de curto elétrico no transformador
  playElectricSpark() {
    if (!this.ctx || !this.isEnabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(2400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  stopAll() {
    if (this.noiseNode) {
      this.noiseNode.stop();
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    this.stopSiren();
  }
}
