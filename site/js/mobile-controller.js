/**
 * PROJETO V.I.D.A. — CONTROLADOR MOBILE TOUCH
 * Celular do Visitante (Controle Remoto em Tempo Real da TV do Stand)
 * Parque Realengo Jornalista Susana Naspolini
 */

class MobileController {
  constructor() {
    this.urlParams = new URLSearchParams(window.location.search);
    this.sessionId = this.urlParams.get('session') || 'VIDA-DEMO';
    this.sync = null;
    this.videoWatched = false;
    this.maxWatchedTime = 0;
    this.currentScore = 0;
    this.plantedTrees = 0;
    this.cameraMode = 'aerial';
    this.isQueued = false;

    // Estado da Missão de Reciclagem
    this.recycleItems = [
      { nome: "Garrafa PET de Refrigerante", tipo: "plastico", icon: "🍾" },
      { nome: "Cascas de Frutas e Lanches", tipo: "compost", icon: "🍌" },
      { nome: "Lata de Alumínio", tipo: "metal", icon: "🥫" },
      { nome: "Caixa de Papelão e Embalagens", tipo: "papel", icon: "📦" },
      { nome: "Restos de Poda e Folhagens", tipo: "compost", icon: "🌿" },
      { nome: "Frasco Plástico Descartável", tipo: "plastico", icon: "🧴" }
    ];
    this.currentRecycleIdx = 0;

    // Estado do Quiz Explorador (Dados Verificados Data.rio / Prefeitura)
    this.triviaQuestions = [
      {
        pergunta: "Qual era a ocupação histórica do terreno de 76 mil m² antes da criação do parque?",
        opcoes: [
          "Fábrica de Cartuchos do Exército",
          "Antigo Shopping Center da Zona Oeste",
          "Terminal Rodoviário de Bangu",
          "Garagem Central de Ônibus"
        ],
        correta: 0,
        cameraTarget: "nave"
      },
      {
        pergunta: "Quantas árvores nativas da Mata Atlântica foram plantadas na implantação do parque?",
        opcoes: ["400 árvores", "1.200 árvores", "3.700 árvores", "10.000 árvores"],
        correta: 2,
        cameraTarget: "vegetacao"
      },
      {
        pergunta: "Qual a função inovadora das 5 Super-Torres bioclimáticas (com até 47m de altura)?",
        opcoes: [
          "Antenas de telefonia celular comunitárias",
          "Vaporizar névoa d'água com 236 bicos para resfriamento urbano",
          "Iluminação exclusiva por refletores esportivos",
          "Caixas d'água elevadas convencionais"
        ],
        correta: 1,
        cameraTarget: "torres"
      },
      {
        pergunta: "Quem foi a carismática jornalista homenageada que dá nome oficial ao parque?",
        opcoes: ["Glória Maria", "Susana Naspolini", "Sandra Moreyra", "Fátima Bernardes"],
        correta: 1,
        cameraTarget: "anfiteatro"
      }
    ];
    this.currentTriviaIdx = 0;
  }

  init() {
    this.initSync();
    this.setupVideoStage();
    this.setupCameraControls();
    this.setupTabs();
    this.setupExploreActions();
    this.setupMissions();
    this.setupSessionControls();
  }

  initSync() {
    this.sync = new VidaSyncEngine({
      role: 'mobile',
      sessionId: this.sessionId
    });

    const sessionTag = document.getElementById('session-code-display');
    if (sessionTag) sessionTag.innerText = this.sessionId;

    // Trata fila de espera quando a sessão está ocupada
    this.sync.on('SESSION_BUSY', (payload) => {
      this.isQueued = true;
      const qScreen = document.getElementById('mobile-queue-screen');
      const qMsg = document.getElementById('queue-status-msg');
      if (qScreen) qScreen.style.display = 'flex';
      if (qMsg && payload && payload.message) qMsg.innerText = payload.message;
    });

    // Quando o stand é liberado
    this.sync.on('SESSION_FREE', () => {
      this.isQueued = false;
      const qScreen = document.getElementById('mobile-queue-screen');
      if (qScreen) qScreen.style.display = 'none';
      this.requestJoinTv();
    });

    this.sync.on('SESSION_ACCEPTED', () => {
      this.isQueued = false;
      const qScreen = document.getElementById('mobile-queue-screen');
      if (qScreen) qScreen.style.display = 'none';
    });

    this.sync.on('SESSION_TIMEOUT_FORCE', () => {
      alert("Sessão encerrada por inatividade. Obrigado por participar do Projeto V.I.D.A.!");
      window.location.reload();
    });

    this.requestJoinTv();
  }

  requestJoinTv() {
    this.sync.send('VISITOR_JOIN_REQUEST', {
      visitor: {
        nome: "Visitante " + Math.floor(Math.random() * 900 + 100),
        conectadoEm: Date.now()
      }
    });
  }

  // --- ETAPA 1: VÍDEO OFICIAL EM TELA CHEIA IMEDIATO (SEM HUB) ---
  setupVideoStage() {
    const video = document.getElementById('mobile-video');
    const backdrop = document.getElementById('mobile-video-backdrop');
    const btnUnmute = document.getElementById('btn-unmute-floating');
    const progressBar = document.getElementById('video-progress-bar');

    if (!video) return;

    // Autoplay imediato (mudo garante liberação instantânea)
    video.play().catch(err => {
      console.log("Autoplay bloqueado pelo navegador mobile:", err);
    });

    // Sincronização do fundo ambiente contínuo
    if (backdrop) {
      backdrop.play().catch(() => {});
      video.addEventListener('play', () => backdrop.play().catch(() => {}));
      video.addEventListener('pause', () => backdrop.pause());
      video.addEventListener('timeupdate', () => {
        if (Math.abs(backdrop.currentTime - video.currentTime) > 0.4) {
          backdrop.currentTime = video.currentTime;
        }
      });
    }

    // Botão flutuante para desmutar
    if (btnUnmute) {
      btnUnmute.addEventListener('click', () => {
        video.muted = false;
        btnUnmute.classList.add('hidden');
      });
    }

    // Barra de progresso contínua na base
    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        if (progressBar) progressBar.style.width = `${pct}%`;
      }
    });

    // Transição 100% automática onended
    video.addEventListener('ended', () => {
      this.videoWatched = true;
      this.unlockController();
    });

    // Suporte a parâmetro para testes e capturas automatizadas
    if (this.urlParams.get('unlocked') === 'true') {
      this.videoWatched = true;
      setTimeout(() => {
        this.unlockController();
        const tab = this.urlParams.get('tab');
        if (tab) {
          const tabBtn = document.querySelector(`.tab-control-btn[data-tab="${tab}"]`);
          if (tabBtn) tabBtn.click();
        }
      }, 80);
    }
  }

  unlockController() {
    const videoScreen = document.getElementById('mobile-video-screen');
    const appLayout = document.getElementById('mobile-app-layout');

    if (videoScreen) videoScreen.style.display = 'none';
    if (appLayout) appLayout.style.display = 'flex';

    // Notifica a TV que o visitante está pronto
    this.sync.send('visitor_ready', {
      status: 'ready',
      timestamp: Date.now()
    });

    this.sync.send('VIDEO_COMPLETED', {
      status: 'unlocked',
      time: Date.now()
    });
  }

  // --- CONTROLES DE CÂMERA EM TEMPO REAL (D-PAD & ZOOM) ---
  setupCameraControls() {
    // D-Pad Direcional
    const dpadBtns = document.querySelectorAll('.dpad-btn');
    dpadBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = btn.getAttribute('data-dir');
        this.sync.send('CAMERA_ROTATE', { dir, amount: 0.25 });
        this.flashButton(btn);
      });
    });

    // Zoom Controls
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        this.sync.send('CAMERA_ZOOM', { delta: 0.25 });
        this.flashButton(btnZoomIn);
      });
    }

    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        this.sync.send('CAMERA_ZOOM', { delta: -0.25 });
        this.flashButton(btnZoomOut);
      });
    }

    // Alternar Perspectiva Aérea / Pedestre
    const btnToggleMode = document.getElementById('btn-toggle-cam-mode');
    if (btnToggleMode) {
      btnToggleMode.addEventListener('click', () => {
        this.cameraMode = this.cameraMode === 'aerial' ? 'pedestrian' : 'aerial';
        btnToggleMode.innerText = this.cameraMode === 'aerial' ? '🌐 Visão Aérea' : '🚶 Nível Pedestre';
        this.sync.send('CAMERA_MODE', { mode: this.cameraMode });
      });
    }
  }

  flashButton(el) {
    el.style.transform = 'scale(0.9)';
    setTimeout(() => { el.style.transform = 'scale(1)'; }, 100);
  }

  // --- NAVEGAÇÃO DE ABAS ---
  setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-control-btn');
    const panes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePane = document.getElementById(`pane-${target}`);
        if (activePane) activePane.classList.add('active');
      });
    });
  }

  // --- ABA 1: EXPLORAR O PARQUE AO VIVO ---
  setupExploreActions() {
    // 1. Cinco Super-Torres
    const btnMist = document.getElementById('btn-explore-torres');
    if (btnMist) {
      btnMist.addEventListener('click', () => {
        this.sync.send('CAMERA_FOCUS', { target: 'torres' });
        this.sync.send('TRIGGER_MIST', { intensity: 3.8 });
        this.flashButtonSuccess(btnMist, "💨 Névoa Máxima Disparada na TV!");
      });
    }

    // 2. Espelho D'água & Drenagem
    const btnAgua = document.getElementById('btn-explore-agua');
    if (btnAgua) {
      btnAgua.addEventListener('click', () => {
        this.sync.send('CAMERA_FOCUS', { target: 'agua' });
        this.sync.send('TRIGGER_RAIN', { intensity: 65 });
        this.flashButtonSuccess(btnAgua, "💧 Chuva e Lago em Foco na TV!");
      });
    }

    // 3. Skatepark & Esportes
    const btnSkate = document.getElementById('btn-explore-skate');
    if (btnSkate) {
      btnSkate.addEventListener('click', () => {
        this.sync.send('CAMERA_FOCUS', { target: 'skatepark' });
        this.flashButtonSuccess(btnSkate, "🛹 Foco no Skatepark & Quadras!");
      });
    }

    // 4. Nave do Conhecimento
    const btnNave = document.getElementById('btn-explore-nave');
    if (btnNave) {
      btnNave.addEventListener('click', () => {
        this.sync.send('CAMERA_FOCUS', { target: 'nave' });
        this.flashButtonSuccess(btnNave, "🚀 Foco na Nave Digital!");
      });
    }

    // 5. Bosque da Mata Atlântica
    const btnVeg = document.getElementById('btn-explore-vegetacao');
    if (btnVeg) {
      btnVeg.addEventListener('click', () => {
        this.sync.send('CAMERA_FOCUS', { target: 'vegetacao' });
        this.flashButtonSuccess(btnVeg, "🌳 Foco no Bosque (3.700 Árvores)!");
      });
    }

    // 6. Anfiteatro Susana Naspolini
    const btnAnfi = document.getElementById('btn-explore-anfiteatro');
    if (btnAnfi) {
      btnAnfi.addEventListener('click', () => {
        this.sync.send('CAMERA_FOCUS', { target: 'anfiteatro' });
        this.flashButtonSuccess(btnAnfi, "🎭 Foco no Anfiteatro Cultural!");
      });
    }
  }

  // --- ABA 2: AS 4 MISSÕES DE SUSTENTABILIDADE ---
  setupMissions() {
    this.setupMissaoAgua();
    this.setupMissaoVerde();
    this.setupMissaoReciclagem();
    this.setupMissaoExplorador();
  }

  // MISSÃO 1 — Caminho da Água
  setupMissaoAgua() {
    const slider = document.getElementById('mission-rain-slider');
    const valDisplay = document.getElementById('mission-rain-display');
    const btnAction = document.getElementById('btn-action-biovale');

    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        let label = "Moderada";
        if (val <= 30) label = "Garoa Leve";
        else if (val <= 65) label = "Severa (65 mm/h)";
        else label = "Tempestade Extrema";

        if (valDisplay) valDisplay.innerText = `${val} mm/h (${label})`;
        this.sync.send('TRIGGER_RAIN', { intensity: val });
      });
    }

    if (btnAction) {
      btnAction.addEventListener('click', () => {
        this.addScore(150);
        this.flashButtonSuccess(btnAction, "✓ Biovaletas Otimizadas! (+150 pts)");
        this.sync.send('MISSION_ACTION', {
          mission: 'agua',
          action: 'optimize',
          rain: slider ? parseInt(slider.value) : 65
        });

        this.sync.send('MISSION_COMPLETE', {
          mission: 'agua',
          title: "Missão 01 Concluída: Caminho da Água!",
          detail: "Você conteve o escoamento pluvial e protegeu o bairro de Realengo com 1.950 m³ de retenção!",
          score: 150
        });
      });
    }
  }

  // MISSÃO 2 — Proteja o Verde
  setupMissaoVerde() {
    const treeBtns = document.querySelectorAll('.btn-tree-choice');
    const countDisplay = document.getElementById('planted-count-display');
    const coolingDisplay = document.getElementById('cooling-metric-display');

    treeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const species = btn.getAttribute('data-species');
        this.plantedTrees++;

        if (countDisplay) {
          countDisplay.innerText = `${this.plantedTrees} de 8 mudas plantadas`;
        }

        const delta = Math.min(5.8, (this.plantedTrees * 0.72)).toFixed(1);
        if (coolingDisplay) {
          coolingDisplay.innerText = `Alívio: -${delta}°C`;
        }

        const thermalHeader = document.getElementById('thermal-relief-display');
        if (thermalHeader) {
          const temp = (37.3 - parseFloat(delta)).toFixed(1);
          thermalHeader.innerText = `🌿 ${temp}°C (-${delta}°C)`;
        }

        this.addScore(100);
        this.flashButtonSuccess(btn, `✓ ${species} Plantado!`);

        this.sync.send('MISSION_ACTION', {
          mission: 'verde',
          action: 'plant_tree',
          species,
          coolingDelta: delta,
          coords: {
            x: 700 + (Math.random() - 0.5) * 360,
            y: 420 + (Math.random() - 0.5) * 200
          }
        });

        if (this.plantedTrees === 4 || this.plantedTrees === 8) {
          this.sync.send('MISSION_COMPLETE', {
            mission: 'verde',
            title: "Missão 02: Reflorestamento Ativo!",
            detail: `Parabéns! Suas mudas nativas reduziram a temperatura de superfície em -${delta}°C!`,
            score: 200
          });
        }
      });
    });
  }

  // MISSÃO 3 — Desafio da Reciclagem
  setupMissaoReciclagem() {
    const binBtns = document.querySelectorAll('.btn-bin');
    const iconEl = document.getElementById('recycle-item-icon');
    const nameEl = document.getElementById('recycle-item-name');

    binBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const binChosen = btn.getAttribute('data-bin');
        const currentItem = this.recycleItems[this.currentRecycleIdx];

        if (binChosen === currentItem.tipo) {
          this.addScore(100);
          btn.style.backgroundColor = 'rgba(16, 185, 129, 0.4)';
          setTimeout(() => { btn.style.backgroundColor = ''; }, 350);

          this.sync.send('MISSION_ACTION', {
            mission: 'reciclagem',
            action: 'correct_bin',
            item: currentItem.nome
          });

          this.currentRecycleIdx = (this.currentRecycleIdx + 1) % this.recycleItems.length;
          const nextItem = this.recycleItems[this.currentRecycleIdx];
          if (iconEl) iconEl.innerText = nextItem.icon;
          if (nameEl) nameEl.innerText = nextItem.nome;

          if (this.currentRecycleIdx === 0) {
            this.sync.send('MISSION_COMPLETE', {
              mission: 'reciclagem',
              title: "Missão 03: Mestre da Reciclagem!",
              detail: "Você destinou todos os resíduos do parque para a economia circular sustentável!",
              score: 250
            });
          }
        } else {
          btn.style.backgroundColor = 'rgba(244, 63, 94, 0.4)';
          setTimeout(() => { btn.style.backgroundColor = ''; }, 350);
        }
      });
    });
  }

  // MISSÃO 4 — Explorador do Parque (Quiz Oficial)
  setupMissaoExplorador() {
    this.renderTriviaQuestion();
  }

  renderTriviaQuestion() {
    const qData = this.triviaQuestions[this.currentTriviaIdx];
    const qNum = document.getElementById('trivia-q-num');
    const qText = document.getElementById('trivia-q-text');
    const container = document.getElementById('trivia-options-container');

    if (!qData || !container) return;

    if (qNum) qNum.innerText = `Pergunta ${this.currentTriviaIdx + 1} de ${this.triviaQuestions.length}`;
    if (qText) qText.innerText = qData.pergunta;

    container.innerHTML = '';
    qData.opcoes.forEach((opcao, idx) => {
      const btn = document.createElement('button');
      btn.className = 'trivia-opt-btn';
      btn.innerText = opcao;

      btn.addEventListener('click', () => {
        if (idx === qData.correta) {
          btn.classList.add('correct');
          this.addScore(120);

          // Voa com a câmera da TV até o local da pergunta
          this.sync.send('CAMERA_FOCUS', { target: qData.cameraTarget });
          this.sync.send('MISSION_ACTION', {
            mission: 'explorador',
            action: 'correct_answer',
            questionIdx: this.currentTriviaIdx
          });

          setTimeout(() => {
            this.currentTriviaIdx = (this.currentTriviaIdx + 1) % this.triviaQuestions.length;
            this.renderTriviaQuestion();

            if (this.currentTriviaIdx === 0) {
              this.sync.send('MISSION_COMPLETE', {
                mission: 'explorador',
                title: "Missão 04: Guardião do Parque Realengo!",
                detail: "Você gabaritou o quiz oficial com dados da Prefeitura do Rio e Rio-Águas!",
                score: 300
              });
            }
          }, 900);
        } else {
          btn.classList.add('wrong');
        }
      });

      container.appendChild(btn);
    });
  }

  addScore(points) {
    this.currentScore += points;
    const scoreEl = document.getElementById('visitor-score-display');
    if (scoreEl) scoreEl.innerText = `${this.currentScore} pts`;
  }

  flashButtonSuccess(btn, text) {
    const orig = btn.innerHTML;
    btn.innerHTML = `<span>${text}</span>`;
    setTimeout(() => { btn.innerHTML = orig; }, 3200);
  }

  // --- CONTROLE DE SESSÃO (ENCERRAR / SAIR) ---
  setupSessionControls() {
    const btnEnd = document.getElementById('btn-end-session');
    if (btnEnd) {
      btnEnd.addEventListener('click', () => {
        if (confirm("Deseja encerrar a sessão e liberar o stand da feira para o próximo visitante?")) {
          if (this.sync) {
            this.sync.disconnect();
          }
          window.location.reload();
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.MobileController = new MobileController();
  window.MobileController.init();
});
