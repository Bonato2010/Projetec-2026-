/**
 * PROJETO V.I.D.A. — APLICAÇÃO DA TELEVISÃO DO STAND (1920 × 1080)
 * Controlador Principal da Tela da TV, Vídeo de Introdução, QR Code e Parque Vivo 3D
 * Divisão: 75% Palco do Parque Vivo | 25% Painel Lateral Fixo do QR Code
 */

class TvStandApp {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.sync = null;
    this.parqueVivo = null;
    this.hostIp = "192.168.1.14"; // IP local detectado
    this.port = 3000;
    this.audioCtx = null;
  }

  generateSessionId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `VIDA-${code}`;
  }

  init() {
    this.parqueVivo = new ParqueVivoEngine('parque-vivo-canvas');
    this.initSync();
    this.setupQrCode();
    this.detectHostNetwork();
    this.setupVideoIntro();
    this.setupHudControls();
    this.setupDemoMode();
    this.initAudioContext();
  }

  initAudioContext() {
    const unlockAudio = () => {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
  }

  playAudioCue(type) {
    if (!this.audioCtx) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      } catch (e) {}
    }
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    if (type === 'mist') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.8);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (type === 'chime') {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.07, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.6);
      });
    } else if (type === 'celebration') {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.1, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
    }
  }

  async detectHostNetwork() {
    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch('/api/network-info');
        if (res.ok) {
          const data = await res.json();
          if (data.ip && data.ip !== '127.0.0.1') {
            this.hostIp = data.ip;
            this.port = data.port || 3000;
            this.setupQrCode();
          }
        }
      } catch (e) {
        console.log('Usando IP pré-configurado:', this.hostIp);
      }
    }
  }

  initSync() {
    this.sync = new VidaSyncEngine({
      role: 'tv',
      sessionId: this.sessionId
    });

    // 1. Visitante conectou pelo celular
    this.sync.on('visitor_connected', (visitor) => {
      this.handleVisitorConnected(visitor);
    });

    // 2. Visitante concluiu o vídeo no celular e assumiu o controle imediato
    this.sync.on('visitor_ready', (payload) => {
      this.showToast("🎬 Visitante pronto! Controle remoto touch ativado ao vivo.");
      if (this.parqueVivo) {
        this.parqueVivo.stopAttractMode();
        this.parqueVivo.triggerMistBoost();
      }
      this.playAudioCue('mist');
    });

    this.sync.on('VIDEO_COMPLETED', () => {
      if (this.parqueVivo) {
        this.parqueVivo.stopAttractMode();
        this.parqueVivo.triggerMistBoost();
      }
      this.playAudioCue('chime');
    });

    // 3. Controles de Câmera da TV em Tempo Real via Celular
    this.sync.on('CAMERA_ROTATE', (payload) => {
      if (this.parqueVivo) {
        this.parqueVivo.rotateCamera(payload.dir, payload.amount || 0.25);
      }
    });

    this.sync.on('CAMERA_ZOOM', (payload) => {
      if (this.parqueVivo) {
        this.parqueVivo.zoomCamera(payload.delta);
      }
    });

    this.sync.on('CAMERA_MODE', (payload) => {
      if (this.parqueVivo) {
        this.parqueVivo.setCameraMode(payload.mode);
        this.updateCameraModeChip(payload.mode);
        this.showToast(payload.mode === 'pedestrian' ? '🚶 Modo Pedestre Ativado' : '🌐 Visão Aérea Ativada');
      }
    });

    this.sync.on('CAMERA_FOCUS', (payload) => {
      if (this.parqueVivo) {
        this.parqueVivo.focusCamera(payload.target);
        this.showToast(`📍 Câmera focada em: ${payload.target.toUpperCase()}`);
        this.playAudioCue('chime');
      }
    });

    // 4. Simulações Ambientais e Missões
    this.sync.on('TRIGGER_MIST', (payload) => {
      if (this.parqueVivo) {
        this.parqueVivo.triggerMistBoost();
        this.showToast("💨 Visitante ativou NÉVOA MÁXIMA nas 5 Super-Torres!");
        this.playAudioCue('mist');
      }
    });

    this.sync.on('TRIGGER_RAIN', (payload) => {
      if (this.parqueVivo) {
        this.parqueVivo.setRainSimulation(payload.intensity);
        this.showToast(`💧 Chuva simulada ajustada para ${payload.intensity} mm/h.`);
      }
    });

    this.sync.on('MISSION_ACTION', (payload) => {
      if (this.parqueVivo) {
        this.parqueVivo.stopAttractMode();
      }

      if (payload.mission === 'verde' && payload.action === 'plant_tree') {
        if (this.parqueVivo) {
          this.parqueVivo.plantTree(payload.coords, payload.species);
        }
        this.showToast(`🌱 Nova muda de ${payload.species} plantada no parque!`);
        this.playAudioCue('chime');
      } else if (payload.mission === 'reciclagem') {
        this.showToast(`♻️ Resíduo: ${payload.item} separado corretamente! (+100 pts)`);
        this.playAudioCue('chime');
      } else if (payload.mission === 'explorador') {
        this.showToast(`🏆 Pergunta ${payload.questionIdx + 1} respondida com sucesso! (+120 pts)`);
        this.playAudioCue('chime');
      }
    });

    this.sync.on('MISSION_COMPLETE', (payload) => {
      this.showCelebration(payload);
    });

    // 5. Desconexão ou Reset de Sessão
    this.sync.on('visitor_disconnected', () => {
      this.handleVisitorDisconnected();
    });

    this.sync.on('session_timeout', () => {
      this.handleVisitorDisconnected();
      this.showToast("Sessão reiniciada por inatividade. Retornando ao Modo de Espera.");
    });
  }

  getMobileUrl() {
    if (window.location.protocol === 'file:') {
      const curPath = window.location.pathname;
      const mobilePath = curPath.replace(/index\.html$/, 'controle.html');
      return `file://${mobilePath}?session=${this.sessionId}`;
    } else {
      const host = window.location.hostname === 'localhost' ? this.hostIp : window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';
      return `${window.location.protocol}//${host}${port}/controle.html?session=${this.sessionId}`;
    }
  }

  setupQrCode() {
    const canvas = document.getElementById('qr-canvas');
    const sessionTag = document.getElementById('tv-session-tag');
    const directLink = document.getElementById('qr-direct-link');

    if (sessionTag) sessionTag.innerText = this.sessionId;

    const mobileUrl = this.getMobileUrl();

    if (canvas && typeof QRCodeUtils !== 'undefined') {
      QRCodeUtils.render(canvas, mobileUrl, 6, 2);
    }

    if (directLink) {
      directLink.href = mobileUrl;
      directLink.title = mobileUrl;
    }
  }

  updateCameraModeChip(mode) {
    const chip = document.getElementById('camera-mode-label');
    if (chip) {
      chip.innerText = mode === 'pedestrian' ? '🚶 Nível Pedestre' : '🌐 Perspectiva Aérea';
    }
  }

  handleVisitorConnected(visitor) {
    const statusChip = document.getElementById('visitor-status-chip');
    const statusText = document.getElementById('visitor-status-text');
    const headerDot = document.getElementById('header-pulse-dot');
    const lateralLabel = document.getElementById('lateral-status-label');
    const lateralDot = document.getElementById('lateral-status-dot');

    if (statusChip) statusChip.classList.add('connected');
    if (statusText) statusText.innerText = `${visitor.nome || 'Visitante'} Conectado`;
    if (headerDot) headerDot.classList.add('active');

    if (lateralLabel) lateralLabel.innerText = `Visitante Conectado: ${visitor.nome || 'Celular'}`;
    if (lateralDot) lateralDot.classList.add('active');

    this.showToast(`🎉 ${visitor.nome || 'Novo visitante'} conectou-se ao stand pelo smartphone!`);
    this.playAudioCue('chime');
  }

  handleVisitorDisconnected() {
    const statusChip = document.getElementById('visitor-status-chip');
    const statusText = document.getElementById('visitor-status-text');
    const headerDot = document.getElementById('header-pulse-dot');
    const lateralLabel = document.getElementById('lateral-status-label');
    const lateralDot = document.getElementById('lateral-status-dot');

    if (statusChip) statusChip.classList.remove('connected');
    if (statusText) statusText.innerText = "Aguardando Visitante";
    if (headerDot) headerDot.classList.remove('active');

    if (lateralLabel) lateralLabel.innerText = "Aguardando visitante...";
    if (lateralDot) lateralDot.classList.remove('active');

    // Gera nova sessão para o próximo visitante
    this.sessionId = this.generateSessionId();
    if (this.sync) {
      this.sync.sessionId = this.sessionId;
    }
    this.setupQrCode();

    if (this.parqueVivo) {
      this.parqueVivo.setRainSimulation(0);
      this.parqueVivo.setCameraMode('aerial');
      this.parqueVivo.focusCamera('overview');
      this.parqueVivo.startAttractMode();
    }
  }

  // --- CONTROLE DO VÍDEO OFICIAL DE ABERTURA ---
  setupVideoIntro() {
    const video = document.getElementById('tv-intro-video');
    const overlay = document.getElementById('video-intro-overlay');
    const btnUnmute = document.getElementById('btn-unmute-tv');
    const btnSkip = document.getElementById('btn-skip-video-tv');

    if (video) {
      video.play().catch(e => {
        console.warn("Autoplay bloqueado pelo navegador, aguardando interação:", e);
      });

      video.addEventListener('ended', () => {
        this.hideVideoIntro();
      });
    }

    if (btnUnmute && video) {
      btnUnmute.addEventListener('click', () => {
        this.initAudioContext();
        video.muted = !video.muted;
        btnUnmute.innerText = video.muted ? '🔇 Ativar Som' : '🔊 Som Ativado';
      });
    }

    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        this.hideVideoIntro();
      });
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'park') {
      setTimeout(() => this.hideVideoIntro(), 50);
    }
  }

  hideVideoIntro() {
    const overlay = document.getElementById('video-intro-overlay');
    const video = document.getElementById('tv-intro-video');
    if (video) video.pause();
    if (overlay) {
      overlay.classList.add('fade-out');
      overlay.style.display = 'none';
    }
    if (this.parqueVivo) {
      this.parqueVivo.triggerMistBoost();
      this.parqueVivo.setupCanvas();
    }
  }

  replayVideoIntro() {
    const overlay = document.getElementById('video-intro-overlay');
    const video = document.getElementById('tv-intro-video');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.classList.remove('fade-out');
    }
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  setupHudControls() {
    const btnReplay = document.getElementById('btn-replay-video');
    const btnFullscreen = document.getElementById('btn-fullscreen');

    if (btnReplay) btnReplay.addEventListener('click', () => this.replayVideoIntro());
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }
  }

  setupDemoMode() {
    const btnDemo = document.getElementById('btn-open-mobile-demo');
    if (btnDemo) {
      btnDemo.addEventListener('click', () => {
        const url = this.getMobileUrl();
        window.open(url, 'ControleMobile', 'width=414,height=896,left=100,top=100');
      });
    }
  }

  showToast(message) {
    const feed = document.getElementById('live-action-toast-feed');
    if (!feed) return;

    const toast = document.createElement('div');
    toast.className = 'action-toast';
    toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
    feed.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 7000);
  }

  showCelebration(data) {
    const overlay = document.getElementById('mission-celebration-overlay');
    if (!overlay) return;

    document.getElementById('celebration-title').innerText = data.title || "Missão Cumprida!";
    document.getElementById('celebration-detail').innerText = data.detail || "Parabéns por contribuir com a sustentabilidade de Realengo!";
    document.getElementById('celebration-score').innerText = `+${data.score || 100} PONTOS CONQUISTADOS`;

    overlay.classList.add('visible');
    this.playAudioCue('celebration');

    if (this.parqueVivo) {
      this.parqueVivo.triggerMistBoost();
    }

    setTimeout(() => {
      overlay.classList.remove('visible');
    }, 8500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.TvStandApp = new TvStandApp();
  window.TvStandApp.init();
});
