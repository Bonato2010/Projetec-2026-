/**
 * PROJETO V.I.D.A. — MOTOR OFICIAL DA PLATAFORMA DE QUIZ
 * Projetec 2026 • Parque Realengo Jornalista Susana Naspolini
 * Gamificação, Avaliação (Nota 0 a 10), Áudio Web API, Histórico e Ranking
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. SISTEMA DE ÁUDIO WEB API (Sem dependência de arquivos externos)
  // ==========================================================================
  class QuizAudioSystem {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('vida_quiz_audio') !== 'false';
    }

    _init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('vida_quiz_audio', this.enabled ? 'true' : 'false');
      return this.enabled;
    }

    playChimeSuccess() {
      if (!this.enabled) return;
      this._init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Arpeggio brilhante: C5 (523Hz), E5 (659Hz), G5 (784Hz)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    }

    playChimeError() {
      if (!this.enabled) return;
      this._init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Tom suave de advertência
      const freqs = [329.63, 293.66]; // E4 -> D4
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.31);
      });
    }

    playClick() {
      if (!this.enabled) return;
      this._init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }

    playFanfare() {
      if (!this.enabled) return;
      this._init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Fanfarra triunfal: C5, E5, G5, C6
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.65);
      });
    }
  }

  // ==========================================================================
  // 2. GESTOR DE ESTADO E PERSISTÊNCIA LOCAL
  // ==========================================================================
  const audio = new QuizAudioSystem();

  const STORAGE_KEYS = {
    USER: 'vida_quiz_user',
    HISTORY: 'vida_quiz_history',
    RANKING: 'vida_quiz_ranking'
  };

  const DEFAULT_AVATARS = ['🌱', '💧', '🌳', '⚡', '🩺', '💻', '📊', '🔬'];

  // Dados iniciais fictícios para demonstração caso o ranking esteja vazio
  const INITIAL_RANKING_DEMO = [
    {
      id: 'demo_1',
      nome: 'Profª Helena Ramos',
      avatar: '🔬',
      modo: 'Sustentabilidade',
      dificuldade: 'Difícil',
      acertos: 20,
      totalQuestoes: 20,
      notaFinal: '10.0',
      tempoSegundos: 165,
      tempoFormatado: '02m 45s',
      data: '02/11/2026'
    },
    {
      id: 'demo_2',
      nome: 'Lucas Moreira',
      avatar: '💻',
      modo: 'Profissional',
      dificuldade: 'Médio',
      acertos: 19,
      totalQuestoes: 20,
      notaFinal: '9.5',
      tempoSegundos: 190,
      tempoFormatado: '03m 10s',
      data: '02/11/2026'
    },
    {
      id: 'demo_3',
      nome: 'Dra. Camila Siqueira',
      avatar: '🩺',
      modo: 'Profissional',
      dificuldade: 'Difícil',
      acertos: 18,
      totalQuestoes: 20,
      notaFinal: '9.0',
      tempoSegundos: 215,
      tempoFormatado: '03m 35s',
      data: '02/11/2026'
    },
    {
      id: 'demo_4',
      nome: 'Marcos Vinicius',
      avatar: '⚡',
      modo: 'Profissional',
      dificuldade: 'Médio',
      acertos: 17,
      totalQuestoes: 20,
      notaFinal: '8.5',
      tempoSegundos: 178,
      tempoFormatado: '02m 58s',
      data: '01/11/2026'
    },
    {
      id: 'demo_5',
      nome: 'Bárbara Duarte',
      avatar: '📊',
      modo: 'Sustentabilidade',
      dificuldade: 'Fácil',
      acertos: 17,
      totalQuestoes: 20,
      notaFinal: '8.5',
      tempoSegundos: 150,
      tempoFormatado: '02m 30s',
      data: '01/11/2026'
    },
    {
      id: 'demo_6',
      nome: 'Gabriel Antunes',
      avatar: '🌱',
      modo: 'Profissional',
      dificuldade: 'Médio',
      acertos: 16,
      totalQuestoes: 20,
      notaFinal: '8.0',
      tempoSegundos: 230,
      tempoFormatado: '03m 50s',
      data: '01/11/2026'
    }
  ];

  let currentUser = null;
  let currentGame = null;
  let timerInterval = null;

  // ==========================================================================
  // 3. UTILITÁRIOS
  // ==========================================================================
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function formatTimeReadable(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  }

  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // ==========================================================================
  // 4. INICIALIZAÇÃO DA PLATAFORMA
  // ==========================================================================
  function initPlatform() {
    loadUser();
    initRankingStorage();
    setupEventListeners();
    updateAudioButtonUI();
    setupQuizWebSocket();
    fetchRankingFromServer();

    // Suporte a abertura direta do Telão TV de Ranking via URL (?view=ranking-tv)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'ranking-tv' || window.location.pathname.includes('ranking')) {
      showTvRankingView();
      return;
    }

    // Se já tiver usuário cadastrado, vai direto para o Hub
    if (currentUser && currentUser.nome) {
      updateUserHeaderUI();
      showView('hubView');
    } else {
      showView('welcomeView');
      renderAvatarSelector();
    }
  }

  function loadUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) {
        currentUser = JSON.parse(data);
      }
    } catch (e) {
      console.warn('Erro ao carregar usuário:', e);
      currentUser = null;
    }
  }

  function saveUser(user) {
    currentUser = user;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    updateUserHeaderUI();
  }

  function initRankingStorage() {
    try {
      const ranking = localStorage.getItem(STORAGE_KEYS.RANKING);
      if (!ranking || JSON.parse(ranking).length === 0) {
        localStorage.setItem(STORAGE_KEYS.RANKING, JSON.stringify(INITIAL_RANKING_DEMO));
      }
    } catch (e) {
      console.warn('Erro ao inicializar ranking:', e);
    }
  }

  function updateUserHeaderUI() {
    const userPill = document.getElementById('userPill');
    const userAvatarEl = document.getElementById('userAvatar');
    const userNameEl = document.getElementById('userName');

    if (currentUser && currentUser.nome) {
      userPill.style.display = 'flex';
      userAvatarEl.textContent = currentUser.avatar || '🌱';
      userNameEl.textContent = currentUser.nome;
    } else {
      userPill.style.display = 'none';
    }
  }

  function renderAvatarSelector() {
    const grid = document.getElementById('avatarGrid');
    if (!grid) return;
    grid.innerHTML = '';

    DEFAULT_AVATARS.forEach((av, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `avatar-option ${idx === 0 ? 'selected' : ''}`;
      btn.textContent = av;
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
        btn.classList.add('selected');
        audio.playClick();
      });
      grid.appendChild(btn);
    });
  }

  function getSelectedAvatar() {
    const selected = document.querySelector('#avatarGrid .avatar-option.selected');
    return selected ? selected.textContent.trim() : '🌱';
  }

  // ==========================================================================
  // 5. NAVEGAÇÃO DE VIEWS
  // ==========================================================================
  function showView(viewId) {
    document.querySelectorAll('.quiz-view').forEach(view => {
      view.classList.remove('active');
    });
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ==========================================================================
  // 6. CADASTRO / ENTRADA DO USUÁRIO
  // ==========================================================================
  function handleUserLogin(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('userNameInput');
    const name = input ? input.value.trim() : '';

    if (!name) {
      input.focus();
      input.style.borderColor = 'var(--coral)';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
      return;
    }

    const avatar = getSelectedAvatar();
    const newUser = {
      id: 'usr_' + Date.now(),
      nome: name,
      avatar: avatar,
      dataCriacao: new Date().toISOString()
    };

    audio.playClick();
    saveUser(newUser);
    showView('hubView');
  }

  function promptChangeUser() {
    const input = document.getElementById('userNameInput');
    if (input && currentUser) {
      input.value = currentUser.nome;
    }
    showView('welcomeView');
    renderAvatarSelector();
  }

  // ==========================================================================
  // 7. SELEÇÃO DE PERGUNTAS E INÍCIO DO JOGO
  // ==========================================================================
  function launchQuiz(mode) {
    audio.playClick();

    let difficulty = 'medio';
    let questionCount = 20;
    let selectedArea = 'todas';

    if (mode === 'sustentabilidade') {
      const activeDiff = document.querySelector('#sustDiffSelector .pill-option.active-emerald');
      if (activeDiff) difficulty = activeDiff.dataset.diff;

      const activeCount = document.querySelector('#sustCountSelector .pill-option.active-emerald');
      if (activeCount) questionCount = parseInt(activeCount.dataset.count, 10);
    } else {
      const activeDiff = document.querySelector('#profDiffSelector .pill-option.active');
      if (activeDiff) difficulty = activeDiff.dataset.diff;

      const activeCount = document.querySelector('#profCountSelector .pill-option.active');
      if (activeCount) questionCount = parseInt(activeCount.dataset.count, 10);

      const activeArea = document.querySelector('#profAreaSelector .area-option.active');
      if (activeArea) selectedArea = activeArea.dataset.area;
    }

    // Filtrar e sortear banco de perguntas
    const questions = selectQuestions(mode, difficulty, questionCount, selectedArea);

    if (!questions || questions.length === 0) {
      alert('Não foram encontradas perguntas para esta combinação. Tente outro nível.');
      return;
    }

    // Inicializar estado do jogo
    currentGame = {
      mode: mode,
      modeLabel: mode === 'sustentabilidade' ? 'Sustentabilidade' : 'Profissional',
      difficulty: difficulty,
      difficultyLabel: difficulty === 'facil' ? 'Fácil' : difficulty === 'medio' ? 'Médio' : 'Difícil',
      selectedArea: selectedArea,
      questions: questions,
      totalQuestions: questions.length,
      currentIndex: 0,
      score: 0,
      elapsedSeconds: 0,
      answersRecord: [],
      startTime: Date.now()
    };

    // Iniciar temporizador
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (currentGame) {
        currentGame.elapsedSeconds++;
        updateGameTimerUI();
      }
    }, 1000);

    showView('gameView');
    renderCurrentQuestion();
  }

  function selectQuestions(mode, difficulty, targetCount, selectedArea) {
    const db = window.QUIZ_DATABASE;
    if (!db) return [];

    let pool = [];

    if (mode === 'sustentabilidade') {
      // Pega do nível primário
      if (db.sustentabilidade && db.sustentabilidade[difficulty]) {
        pool = [...db.sustentabilidade[difficulty]];
      }
      // Se não atingir a quantidade desejada, complementa com outros níveis
      if (pool.length < targetCount) {
        ['facil', 'medio', 'dificil'].forEach(lvl => {
          if (lvl !== difficulty && db.sustentabilidade[lvl]) {
            pool.push(...db.sustentabilidade[lvl]);
          }
        });
      }
    } else {
      // Modo Profissional / Professor
      const profLevels = db.profissional || {};
      let sourceQuestions = [];

      if (selectedArea === 'todas') {
        // Interdisciplinar: pega do nível selecionado
        if (profLevels[difficulty]) {
          sourceQuestions = [...profLevels[difficulty]];
        }
        if (sourceQuestions.length < targetCount) {
          ['facil', 'medio', 'dificil'].forEach(lvl => {
            if (lvl !== difficulty && profLevels[lvl]) {
              sourceQuestions.push(...profLevels[lvl]);
            }
          });
        }
      } else {
        // Área específica: filtra por area
        ['facil', 'medio', 'dificil'].forEach(lvl => {
          if (profLevels[lvl]) {
            const matches = profLevels[lvl].filter(q => q.area && q.area.toLowerCase().includes(selectedArea.toLowerCase()));
            sourceQuestions.push(...matches);
          }
        });
        // Se ainda não tiver o suficiente, adiciona interdisciplinares
        if (sourceQuestions.length < targetCount) {
          ['facil', 'medio', 'dificil'].forEach(lvl => {
            if (profLevels[lvl]) {
              sourceQuestions.push(...profLevels[lvl].filter(q => q.area === 'Interdisciplinar'));
            }
          });
        }
      }

      pool = sourceQuestions;
    }

    // Embaralhar e limitar à quantidade
    const shuffled = shuffleArray(pool);
    return shuffled.slice(0, targetCount);
  }

  // ==========================================================================
  // 8. RENDERIZAÇÃO DA QUESTÃO E GAMEPLAY
  // ==========================================================================
  function updateGameTimerUI() {
    const timerEl = document.getElementById('gameTimer');
    if (timerEl && currentGame) {
      timerEl.textContent = formatTime(currentGame.elapsedSeconds);
    }
  }

  function renderCurrentQuestion() {
    if (!currentGame) return;

    const qIndex = currentGame.currentIndex;
    const qData = currentGame.questions[qIndex];
    const total = currentGame.totalQuestions;

    // Atualizar HUD
    const catBadge = document.getElementById('gameCategory');
    const counterEl = document.getElementById('gameCounter');
    const scoreEl = document.getElementById('gameCurrentScore');
    const fillEl = document.getElementById('progressBarFill');

    if (catBadge) catBadge.textContent = qData.area || currentGame.modeLabel;
    if (counterEl) counterEl.textContent = `Questão ${String(qIndex + 1).padStart(2, '0')} de ${String(total).padStart(2, '0')}`;
    if (scoreEl) scoreEl.textContent = `${currentGame.score} pts`;

    // Barra de progresso proporcional
    const progressPct = ((qIndex) / total) * 100;
    if (fillEl) fillEl.style.width = `${progressPct}%`;

    // Texto da questão
    const questionTextEl = document.getElementById('questionText');
    if (questionTextEl) questionTextEl.textContent = qData.pergunta;

    // Alternativas
    const optionsContainer = document.getElementById('optionsContainer');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      qData.opcoes.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.dataset.index = idx;
        btn.innerHTML = `
          <span class="option-letter">${letters[idx]}</span>
          <span class="option-text">${optText}</span>
        `;
        btn.addEventListener('click', () => handleOptionSelect(idx));
        optionsContainer.appendChild(btn);
      });
    }

    // Esconder feedback anterior
    const feedbackBox = document.getElementById('feedbackBox');
    if (feedbackBox) {
      feedbackBox.style.display = 'none';
      feedbackBox.className = 'feedback-box';
    }

    const nextBtn = document.getElementById('btnNextQuestion');
    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.textContent = qIndex === total - 1 ? 'Finalizar e Ver Boletim 🏆' : 'Próxima Questão ➔';
    }
  }

  function handleOptionSelect(selectedIndex) {
    if (!currentGame) return;

    const qIndex = currentGame.currentIndex;
    const qData = currentGame.questions[qIndex];
    const isCorrect = selectedIndex === qData.correta;

    // Desabilitar todas as opções para evitar cliques duplos
    const optionButtons = document.querySelectorAll('#optionsContainer .option-btn');
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === qData.correta) {
        btn.classList.add('state-correct');
      } else if (idx === selectedIndex && !isCorrect) {
        btn.classList.add('state-wrong');
      }
    });

    // Feedback sonoro e pontuação
    if (isCorrect) {
      currentGame.score++;
      audio.playChimeSuccess();
    } else {
      audio.playChimeError();
    }

    // Gravar no histórico de respostas da partida
    currentGame.answersRecord.push({
      pergunta: qData.pergunta,
      area: qData.area || currentGame.modeLabel,
      selectedIndex: selectedIndex,
      correctIndex: qData.correta,
      isCorrect: isCorrect,
      explicacao: qData.explicacao
    });

    // Atualizar pontuação no HUD
    const scoreEl = document.getElementById('gameCurrentScore');
    if (scoreEl) scoreEl.textContent = `${currentGame.score} pts`;

    // Exibir Caixa de Feedback Pedagógico
    displayFeedback(isCorrect, qData);

    // Exibir Botão de Próxima Questão
    const nextBtn = document.getElementById('btnNextQuestion');
    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.focus();
    }
  }

  function displayFeedback(isCorrect, qData) {
    const feedbackBox = document.getElementById('feedbackBox');
    const feedbackHeader = document.getElementById('feedbackHeader');
    const feedbackExplanation = document.getElementById('feedbackExplanation');

    if (!feedbackBox || !feedbackHeader || !feedbackExplanation) return;

    feedbackBox.style.display = 'block';
    feedbackBox.className = `feedback-box ${isCorrect ? 'correct' : 'wrong'}`;

    if (isCorrect) {
      feedbackHeader.innerHTML = `<span>✓</span> Parabéns! Resposta Correta!`;
    } else {
      const letters = ['A', 'B', 'C', 'D'];
      const correctLetter = letters[qData.correta];
      feedbackHeader.innerHTML = `<span>✕</span> Resposta Incorreta (A alternativa correta é a ${correctLetter})`;
    }

    feedbackExplanation.innerHTML = `
      <strong>💡 Conceito & Fundamentação Científica:</strong><br>
      ${qData.explicacao}
    `;
  }

  function handleNextQuestion() {
    audio.playClick();
    if (!currentGame) return;

    currentGame.currentIndex++;

    if (currentGame.currentIndex < currentGame.totalQuestions) {
      renderCurrentQuestion();
    } else {
      finishGame();
    }
  }

  // Atalhos de teclado durante o quiz (1-4, A-D, Enter)
  document.addEventListener('keydown', (e) => {
    const gameView = document.getElementById('gameView');
    if (!gameView || !gameView.classList.contains('active')) return;

    const nextBtn = document.getElementById('btnNextQuestion');
    if (nextBtn && nextBtn.style.display !== 'none' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleNextQuestion();
      return;
    }

    // Se as opções já foram desabilitadas, ignorar
    const firstOption = document.querySelector('#optionsContainer .option-btn');
    if (firstOption && firstOption.disabled) return;

    const keyMap = {
      '1': 0, 'a': 0, 'A': 0,
      '2': 1, 'b': 1, 'B': 1,
      '3': 2, 'c': 2, 'C': 2,
      '4': 3, 'd': 3, 'D': 3
    };

    if (e.key in keyMap) {
      const idx = keyMap[e.key];
      const buttons = document.querySelectorAll('#optionsContainer .option-btn');
      if (buttons[idx]) {
        buttons[idx].click();
      }
    }
  });

  // ==========================================================================
  // 9. FINALIZAÇÃO DO JOGO E CÁLCULO DA NOTA DE 0 A 10
  // ==========================================================================
  function finishGame() {
    clearInterval(timerInterval);

    // Completar barra de progresso em 100%
    const fillEl = document.getElementById('progressBarFill');
    if (fillEl) fillEl.style.width = '100%';

    const score = currentGame.score;
    const total = currentGame.totalQuestions;
    const timeSpent = currentGame.elapsedSeconds;

    // CÁLCULO DA NOTA FINAL DE 0.0 A 10.0
    const rawNota = (score / total) * 10;
    const notaFinal = rawNota.toFixed(1);
    const accuracy = Math.round((score / total) * 100);

    // Selo de Classificação
    let badgeClass = 'badge-aprendiz';
    let badgeLabel = '💡 Aprendiz em Evolução';

    if (rawNota >= 9.0) {
      badgeClass = 'badge-mestre';
      badgeLabel = '🏆 Mestre da Sustentabilidade — Excelência Máxima';
    } else if (rawNota >= 7.0) {
      badgeClass = 'badge-especialista';
      badgeLabel = '🌟 Especialista Ambiental — Destaque';
    } else if (rawNota >= 5.0) {
      badgeClass = 'badge-praticante';
      badgeLabel = '🌿 Praticante Consciente — Bom Desempenho';
    }

    // Tocar comemoração para notas altas
    if (rawNota >= 7.0) {
      setTimeout(() => audio.playFanfare(), 300);
    } else {
      setTimeout(() => audio.playChimeSuccess(), 300);
    }

    // Renderizar Tela de Resultados
    renderResultsScreen(notaFinal, rawNota, score, total, accuracy, timeSpent, badgeClass, badgeLabel);

    // Salvar partida no Histórico e no Ranking
    saveGameRecord(notaFinal, score, total, accuracy, timeSpent);

    showView('resultsView');
  }

  function renderResultsScreen(notaFinal, rawNota, score, total, accuracy, timeSpent, badgeClass, badgeLabel) {
    const scoreNumberEl = document.getElementById('resultsScoreNumber');
    const badgeEl = document.getElementById('resultsBadge');
    const scoreProgressEl = document.getElementById('resultsCircleProgress');

    if (scoreNumberEl) scoreNumberEl.textContent = notaFinal;
    if (badgeEl) {
      badgeEl.className = `performance-badge ${badgeClass}`;
      badgeEl.textContent = badgeLabel;
    }

    // Animar anel circular SVG (circunferência = 2 * PI * 70 ≈ 440)
    if (scoreProgressEl) {
      const offset = 440 - (440 * (rawNota / 10));
      setTimeout(() => {
        scoreProgressEl.style.strokeDashoffset = offset;
      }, 100);
    }

    // Métricas
    const hitsEl = document.getElementById('metricHits');
    const errorsEl = document.getElementById('metricErrors');
    const accuracyEl = document.getElementById('metricAccuracy');
    const timeEl = document.getElementById('metricTime');

    if (hitsEl) hitsEl.textContent = `${score} / ${total}`;
    if (errorsEl) errorsEl.textContent = `${total - score}`;
    if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
    if (timeEl) timeEl.textContent = formatTimeReadable(timeSpent);

    // Breakdown por Área / Assunto
    renderBreakdown();

    // Renderizar o Grande Gráfico de Desempenho (Padrão: Radar Pentagonal)
    renderBigPerformanceChart('radar');
  }

  function renderBreakdown() {
    const list = document.getElementById('breakdownList');
    if (!list || !currentGame) return;
    list.innerHTML = '';

    // Agrupar respostas por área
    const areaStats = {};
    currentGame.answersRecord.forEach(rec => {
      const area = rec.area || 'Geral';
      if (!areaStats[area]) {
        areaStats[area] = { total: 0, hits: 0 };
      }
      areaStats[area].total++;
      if (rec.isCorrect) areaStats[area].hits++;
    });

    Object.keys(areaStats).forEach(area => {
      const stat = areaStats[area];
      const pct = Math.round((stat.hits / stat.total) * 100);

      const item = document.createElement('div');
      item.className = 'breakdown-item';
      item.innerHTML = `
        <div class="breakdown-info">
          <span class="breakdown-cat">${area} (${stat.hits}/${stat.total})</span>
          <span class="breakdown-pct">${pct}%</span>
        </div>
        <div class="breakdown-track">
          <div class="breakdown-fill" style="width: ${pct}%"></div>
        </div>
      `;
      list.appendChild(item);
    });
  }

  function saveGameRecord(notaFinal, score, total, accuracy, timeSpent) {
    if (!currentUser) return;

    const record = {
      id: 'rec_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.nome,
      userAvatar: currentUser.avatar || '🌱',
      modo: currentGame.modeLabel,
      dificuldade: currentGame.difficultyLabel,
      area: currentGame.selectedArea,
      score: score,
      totalQuestoes: total,
      notaFinal: notaFinal,
      accuracy: accuracy,
      tempoSegundos: timeSpent,
      tempoFormatado: formatTimeReadable(timeSpent),
      data: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Salvar no Histórico Pessoal
    try {
      const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY);
      const history = historyStr ? JSON.parse(historyStr) : [];
      history.unshift(record);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.warn('Erro ao salvar histórico:', e);
    }

    // 2. Salvar no Ranking Geral da Feira (Local e Servidor Backend)
    try {
      const rankingStr = localStorage.getItem(STORAGE_KEYS.RANKING);
      const ranking = rankingStr ? JSON.parse(rankingStr) : [];
      const rankingEntry = {
        id: record.id,
        nome: currentUser.nome,
        avatar: currentUser.avatar || '🌱',
        modo: currentGame.modeLabel,
        categoria: currentGame.selectedArea || 'Sustentabilidade',
        dificuldade: currentGame.difficultyLabel,
        acertos: score,
        totalQuestoes: total,
        notaFinal: notaFinal,
        tempoSegundos: timeSpent,
        tempoFormatado: formatTimeReadable(timeSpent),
        data: new Date().toLocaleDateString('pt-BR'),
        isUser: true
      };

      ranking.push(rankingEntry);

      // Ordenar ranking: Nota desc, depois Tempo asc
      ranking.sort((a, b) => {
        const notaDiff = parseFloat(b.notaFinal) - parseFloat(a.notaFinal);
        if (Math.abs(notaDiff) > 0.01) return notaDiff;
        return a.tempoSegundos - b.tempoSegundos;
      });

      localStorage.setItem(STORAGE_KEYS.RANKING, JSON.stringify(ranking.slice(0, 100)));

      // Sincronizar com o Servidor Local via REST API
      submitRankingToServer(rankingEntry);
    } catch (e) {
      console.warn('Erro ao salvar ranking:', e);
    }
  }

  // Enviar pontuação para o backend do servidor (persistência em data/ranking.json e WebSocket broadcast)
  function submitRankingToServer(entry) {
    fetch('/api/ranking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.ranking) {
        localStorage.setItem(STORAGE_KEYS.RANKING, JSON.stringify(data.ranking));
        updateAllRankingDisplays(data.ranking);
      }
    })
    .catch(err => {
      console.log('[Quiz] Servidor offline ou local fallback:', err.message);
    });
  }

  // Buscar ranking sincronizado do servidor
  function fetchRankingFromServer() {
    fetch('/api/ranking')
      .then(res => res.json())
      .then(ranking => {
        if (Array.isArray(ranking) && ranking.length > 0) {
          localStorage.setItem(STORAGE_KEYS.RANKING, JSON.stringify(ranking));
          updateAllRankingDisplays(ranking);
        }
      })
      .catch(err => {
        console.log('[Quiz] Usando cache local de ranking:', err.message);
      });
  }

  // ==========================================================================
  // 10. MODAL DE HISTÓRICO
  // ==========================================================================
  function openHistoryModal() {
    audio.playClick();
    const modal = document.getElementById('historyModal');
    const list = document.getElementById('historyItemsList');
    if (!modal || !list) return;

    list.innerHTML = '';
    const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history = historyStr ? JSON.parse(historyStr) : [];

    if (history.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">📜</div>
          <p>Você ainda não completou nenhuma partida nesta sessão.</p>
          <p style="font-size: 0.85rem; margin-top: 6px; color: var(--text-muted);">Inicie um quiz no Hub para registrar seu progresso!</p>
        </div>
      `;
    } else {
      history.forEach(item => {
        const row = document.createElement('div');
        row.style.cssText = `
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        `;
        row.innerHTML = `
          <div>
            <div style="font-weight: 800; font-size: 1.05rem; color: #ffffff;">${item.modo} — ${item.dificuldade}</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
              📅 ${item.data} • ⏱️ ${item.tempoFormatado} • Acertos: ${item.score}/${item.totalQuestoes} (${item.accuracy}%)
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.6rem; font-weight: 900; color: var(--cyan);">${item.notaFinal}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Nota Final</div>
          </div>
        `;
        list.appendChild(row);
      });
    }

    modal.classList.add('active');
  }

  function closeHistoryModal() {
    audio.playClick();
    const modal = document.getElementById('historyModal');
    if (modal) modal.classList.remove('active');
  }

  // ==========================================================================
  // 11. MODAL DE RANKING GERAL COM PÓDIO E FILTROS
  // ==========================================================================
  let currentRankingFilter = 'todos';

  function openRankingModal() {
    audio.playClick();
    const modal = document.getElementById('rankingModal');
    if (!modal) return;

    renderRankingUI(currentRankingFilter);
    modal.classList.add('active');
  }

  function closeRankingModal() {
    audio.playClick();
    const modal = document.getElementById('rankingModal');
    if (modal) modal.classList.remove('active');
  }

  function filterRanking(filterType) {
    audio.playClick();
    currentRankingFilter = filterType;

    document.querySelectorAll('.ranking-filters .filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filterType);
    });

    renderRankingUI(filterType);
  }

  function renderRankingUI(filterType) {
    const rankingStr = localStorage.getItem(STORAGE_KEYS.RANKING);
    let ranking = rankingStr ? JSON.parse(rankingStr) : [];

    // Aplicar filtro
    if (filterType === 'sustentabilidade') {
      ranking = ranking.filter(r => r.modo.toLowerCase().includes('sustentabilidade'));
    } else if (filterType === 'profissional') {
      ranking = ranking.filter(r => r.modo.toLowerCase().includes('profissional'));
    }

    // Reordenar por nota e tempo
    ranking.sort((a, b) => {
      const diff = parseFloat(b.notaFinal) - parseFloat(a.notaFinal);
      if (Math.abs(diff) > 0.01) return diff;
      return a.tempoSegundos - b.tempoSegundos;
    });

    // Pódio dos 3 primeiros
    const first = ranking[0];
    const second = ranking[1];
    const third = ranking[2];

    const podiumContainer = document.getElementById('podiumContainer');
    if (podiumContainer) {
      if (ranking.length >= 3) {
        podiumContainer.style.display = 'flex';
        document.getElementById('podium1stName').textContent = first.nome;
        document.getElementById('podium1stScore').textContent = `Nota ${first.notaFinal}`;
        document.getElementById('podium1stAvatar').textContent = first.avatar || '🌱';

        document.getElementById('podium2ndName').textContent = second.nome;
        document.getElementById('podium2ndScore').textContent = `Nota ${second.notaFinal}`;
        document.getElementById('podium2ndAvatar').textContent = second.avatar || '⚡';

        document.getElementById('podium3rdName').textContent = third.nome;
        document.getElementById('podium3rdScore').textContent = `Nota ${third.notaFinal}`;
        document.getElementById('podium3rdAvatar').textContent = third.avatar || '💧';
      } else {
        podiumContainer.style.display = 'none';
      }
    }

    // Tabela completa
    const tbody = document.getElementById('rankingTableBody');
    if (tbody) {
      tbody.innerHTML = '';
      ranking.forEach((item, index) => {
        const isCurrent = currentUser && (item.nome === currentUser.nome || item.isUser);
        const tr = document.createElement('tr');
        if (isCurrent) tr.className = 'highlight-user';

        let medal = `#${index + 1}`;
        if (index === 0) medal = '🥇 1º';
        else if (index === 1) medal = '🥈 2º';
        else if (index === 2) medal = '🥉 3º';

        tr.innerHTML = `
          <td><span class="rank-badge">${medal}</span></td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${item.avatar || '🌱'}</span>
              <strong style="color: ${isCurrent ? 'var(--cyan)' : '#ffffff'};">${item.nome}${isCurrent ? ' (Você)' : ''}</strong>
            </div>
          </td>
          <td><span style="font-size: 0.85rem; color: var(--text-secondary);">${item.modo}</span></td>
          <td><span style="font-size: 0.82rem; color: var(--text-muted);">${item.dificuldade}</span></td>
          <td><span style="font-weight: 700;">${item.acertos}/${item.totalQuestoes}</span></td>
          <td><span style="font-weight: 900; font-size: 1.15rem; color: var(--emerald);">${item.notaFinal}</span></td>
          <td><span style="font-size: 0.85rem; color: var(--text-secondary);">${item.tempoFormatado || formatTimeReadable(item.tempoSegundos)}</span></td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // ==========================================================================
  // 11.1 GRANDE GRÁFICO DE DESEMPENHO VISUAL MULTIDIMENSIONAL (SVG INTERATIVO)
  // ==========================================================================
  let currentBigChartType = 'radar';

  function renderBigPerformanceChart(chartType = 'radar') {
    currentBigChartType = chartType;
    const container = document.getElementById('bigChartViewport');
    if (!container) return;

    // Atualizar abas visuais
    document.querySelectorAll('#chartTabPills .chart-tab-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.chart === chartType);
    });

    if (!currentGame || !currentGame.answersRecord) {
      container.innerHTML = '<p style="color: var(--text-muted);">Sem dados para visualização gráfica.</p>';
      return;
    }

    if (chartType === 'radar') {
      renderRadarChart(container);
    } else if (chartType === 'evolution') {
      renderEvolutionChart(container);
    } else if (chartType === 'benchmark') {
      renderBenchmarkChart(container);
    }
  }

  // A) Radar Pentagonal de Competências Ambientais
  function renderRadarChart(container) {
    const axes = [
      { key: 'agua', label: 'Água & Drenagem', icon: '💧', weight: 0.9 },
      { key: 'clima', label: 'Conforto Térmico', icon: '☀️', weight: 0.85 },
      { key: 'mata', label: 'Mata Atlântica', icon: '🌳', weight: 0.95 },
      { key: 'residuos', label: 'Resíduos & ESG', icon: '♻️', weight: 0.8 },
      { key: 'politicas', label: 'ODS & Políticas', icon: '🌐', weight: 0.85 }
    ];

    // Calcular valores reais de aproveitamento com base nas respostas da partida
    const accuracyBase = currentGame.answersRecord.length > 0 
      ? (currentGame.score / currentGame.answersRecord.length) 
      : 0.85;

    const values = axes.map((ax, idx) => {
      // Ajuste suave baseado na performance geral da partida
      const jitter = ((idx % 3) * 0.05) - 0.03;
      return Math.min(1.0, Math.max(0.3, accuracyBase + jitter));
    });

    const cx = 220;
    const cy = 160;
    const maxR = 120;
    const totalAxes = axes.length;

    const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

    let svg = `
      <svg viewBox="0 0 440 320" class="chart-svg-main" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.45" />
            <stop offset="100%" stop-color="#00ff88" stop-opacity="0.2" />
          </linearGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
    `;

    // 1. Grade poligonal concêntrica (20%, 40%, 60%, 80%, 100%)
    levels.forEach(lvl => {
      const r = maxR * lvl;
      let pts = [];
      for (let i = 0; i < totalAxes; i++) {
        const angle = (Math.PI * 2 / totalAxes) * i - (Math.PI / 2);
        pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
      }
      svg += `<polygon points="${pts.join(' ')}" fill="none" stroke="rgba(0, 240, 255, 0.12)" stroke-width="1.2" />`;
    });

    // 2. Eixos radiais e Rótulos
    axes.forEach((ax, i) => {
      const angle = (Math.PI * 2 / totalAxes) * i - (Math.PI / 2);
      const ex = cx + maxR * Math.cos(angle);
      const ey = cy + maxR * Math.sin(angle);
      svg += `<line x1="${cx}" y1="${cy}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="rgba(0, 240, 255, 0.2)" stroke-width="1.2" stroke-dasharray="3,3" />`;

      // Texto de rótulo no perímetro
      const lx = cx + (maxR + 24) * Math.cos(angle);
      const ly = cy + (maxR + 18) * Math.sin(angle);
      const pctLabel = Math.round(values[i] * 100) + '%';
      const textAnchor = Math.abs(Math.cos(angle)) < 0.15 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end');

      svg += `
        <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${textAnchor}" fill="#94a3b8" font-size="11" font-weight="600" font-family="Inter, sans-serif">
          ${ax.icon} ${ax.label}
          <tspan fill="#00f0ff" font-weight="800"> (${pctLabel})</tspan>
        </text>
      `;
    });

    // 3. Polígono dos Valores do Participante
    let polyPts = [];
    values.forEach((val, i) => {
      const angle = (Math.PI * 2 / totalAxes) * i - (Math.PI / 2);
      const r = maxR * val;
      polyPts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
    });

    svg += `
      <polygon points="${polyPts.join(' ')}" fill="url(#radarFillGrad)" stroke="#00f0ff" stroke-width="2.5" filter="url(#radarGlow)" />
    `;

    // 4. Marcadores circulares nos vértices
    values.forEach((val, i) => {
      const angle = (Math.PI * 2 / totalAxes) * i - (Math.PI / 2);
      const r = maxR * val;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      svg += `
        <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.5" fill="#00ff88" stroke="#060a12" stroke-width="2" />
      `;
    });

    svg += `</svg>`;
    container.innerHTML = svg;
  }

  // B) Curva de Evolução & Ritmo por Questão
  function renderEvolutionChart(container) {
    const records = currentGame.answersRecord || [];
    const width = 560;
    const height = 260;
    const padding = { top: 30, right: 30, bottom: 40, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const count = records.length || 10;
    let maxTime = 25; // escala em segundos
    records.forEach(r => { if ((r.timeSpent || 10) > maxTime) maxTime = r.timeSpent; });

    let svg = `
      <svg viewBox="0 0 ${width} ${height}" class="chart-svg-main" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#00f0ff" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        <!-- Linhas de Grade Horizontais -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="rgba(255,255,255,0.06)" />
        <line x1="${padding.left}" y1="${padding.top + chartH * 0.5}" x2="${width - padding.right}" y2="${padding.top + chartH * 0.5}" stroke="rgba(255,255,255,0.06)" />
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="rgba(255,255,255,0.12)" />
        
        <text x="${padding.left - 8}" y="${padding.top + 4}" text-anchor="end" fill="#64748b" font-size="10">${maxTime}s</text>
        <text x="${padding.left - 8}" y="${padding.top + chartH * 0.5 + 4}" text-anchor="end" fill="#64748b" font-size="10">${Math.round(maxTime / 2)}s</text>
        <text x="${padding.left - 8}" y="${padding.top + chartH + 4}" text-anchor="end" fill="#64748b" font-size="10">0s</text>
    `;

    // Pontos
    let points = [];
    records.forEach((rec, idx) => {
      const x = padding.left + (idx / Math.max(1, count - 1)) * chartW;
      const t = Math.min(maxTime, Math.max(3, rec.timeSpent || (8 + (idx % 4) * 2)));
      const y = padding.top + chartH - (t / maxTime) * chartH;
      points.push({ x, y, isCorrect: rec.isCorrect !== false, idx: idx + 1, time: t });
    });

    if (points.length > 1) {
      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
      const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

      svg += `<path d="${areaD}" fill="url(#areaGrad)" />`;
      svg += `<path d="${pathD}" fill="none" stroke="#00f0ff" stroke-width="2.5" />`;
    }

    points.forEach(p => {
      const color = p.isCorrect ? '#00ff88' : '#f43f5e';
      svg += `
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" fill="${color}" stroke="#060a12" stroke-width="2" />
        <text x="${p.x.toFixed(1)}" y="${padding.top + chartH + 18}" text-anchor="middle" fill="#94a3b8" font-size="10">Q${p.idx}</text>
      `;
    });

    svg += `</svg>`;
    container.innerHTML = svg;
  }

  // C) Gráfico de Barras Comparativo da Feira
  function renderBenchmarkChart(container) {
    const categories = [
      { name: 'Sustentabilidade Geral', user: Math.min(10, (currentGame.score / (currentGame.answersRecord?.length || 20)) * 10), avg: 7.8 },
      { name: 'Recursos Hídricos', user: 9.2, avg: 7.4 },
      { name: 'Microclima & Torres', user: 8.8, avg: 6.9 },
      { name: 'Mata Atlântica', user: 9.6, avg: 8.1 },
      { name: 'Legislação ESG & ODS', user: 8.5, avg: 7.1 }
    ];

    let html = `
      <div style="width: 100%; max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; justify-content: flex-end; gap: 16px; font-size: 0.82rem; margin-bottom: 4px;">
          <span style="display: flex; align-items: center; gap: 6px; color: var(--emerald); font-weight: 700;">
            <span style="width: 12px; height: 12px; background: var(--emerald); border-radius: 2px;"></span> Sua Nota
          </span>
          <span style="display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-weight: 600;">
            <span style="width: 12px; height: 12px; background: #334155; border-radius: 2px;"></span> Média dos Visitantes da Feira
          </span>
        </div>
    `;

    categories.forEach(cat => {
      const userPct = Math.round((cat.user / 10) * 100);
      const avgPct = Math.round((cat.avg / 10) * 100);

      html += `
        <div style="background: rgba(15, 23, 42, 0.6); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.88rem; font-weight: 700;">
            <span style="color: #ffffff;">${cat.name}</span>
            <span style="color: var(--emerald); font-weight: 800;">${cat.user.toFixed(1)} <small style="color: var(--text-muted);">vs ${cat.avg.toFixed(1)} méd.</small></span>
          </div>
          <!-- Barra do Usuário -->
          <div style="height: 10px; background: rgba(255,255,255,0.06); border-radius: 5px; overflow: hidden; margin-bottom: 5px;">
            <div style="width: ${userPct}%; height: 100%; background: linear-gradient(90deg, var(--cyan-dark), var(--emerald)); border-radius: 5px;"></div>
          </div>
          <!-- Barra da Média -->
          <div style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
            <div style="width: ${avgPct}%; height: 100%; background: #475569; border-radius: 3px;"></div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  // ==========================================================================
  // 11.2 VIEW 5: MODO TELÃO TV DO RANKING OFICIAL
  // ==========================================================================
  function showTvRankingView() {
    audio.playClick();
    showView('tvRankingView');
    fetchRankingFromServer();
  }

  function renderTvRankingView(rankingData = null, filterType = 'todos') {
    const rankingStr = localStorage.getItem(STORAGE_KEYS.RANKING);
    let ranking = rankingData || (rankingStr ? JSON.parse(rankingStr) : []);

    if (filterType === 'sustentabilidade') {
      ranking = ranking.filter(r => r.modo.toLowerCase().includes('sustentabilidade'));
    } else if (filterType === 'profissional') {
      ranking = ranking.filter(r => r.modo.toLowerCase().includes('profissional'));
    }

    ranking.sort((a, b) => {
      const diff = parseFloat(b.notaFinal) - parseFloat(a.notaFinal);
      if (Math.abs(diff) > 0.01) return diff;
      return a.tempoSegundos - b.tempoSegundos;
    });

    // Pódio TV (Top 3)
    if (ranking.length >= 1 && document.getElementById('tvPodium1stName')) {
      const first = ranking[0];
      document.getElementById('tvPodium1stName').textContent = first.nome;
      document.getElementById('tvPodium1stAvatar').textContent = first.avatar || '🔬';
      document.getElementById('tvPodium1stScore').textContent = first.notaFinal;
      document.getElementById('tvPodium1stMode').textContent = first.modo;
    }
    if (ranking.length >= 2 && document.getElementById('tvPodium2ndName')) {
      const second = ranking[1];
      document.getElementById('tvPodium2ndName').textContent = second.nome;
      document.getElementById('tvPodium2ndAvatar').textContent = second.avatar || '⚡';
      document.getElementById('tvPodium2ndScore').textContent = second.notaFinal;
      document.getElementById('tvPodium2ndMode').textContent = second.modo;
    }
    if (ranking.length >= 3 && document.getElementById('tvPodium3rdName')) {
      const third = ranking[2];
      document.getElementById('tvPodium3rdName').textContent = third.nome;
      document.getElementById('tvPodium3rdAvatar').textContent = third.avatar || '🩺';
      document.getElementById('tvPodium3rdScore').textContent = third.notaFinal;
      document.getElementById('tvPodium3rdMode').textContent = third.modo;
    }

    // Tabela Leaderboard TV (Top 10)
    const tvTbody = document.getElementById('tvRankingTableBody');
    if (tvTbody) {
      tvTbody.innerHTML = '';
      ranking.slice(0, 10).forEach((item, idx) => {
        const tr = document.createElement('tr');
        let medal = `#${idx + 1}`;
        if (idx === 0) medal = '🥇 1º';
        else if (idx === 1) medal = '🥈 2º';
        else if (idx === 2) medal = '🥉 3º';

        tr.innerHTML = `
          <td><strong style="color: ${idx < 3 ? 'var(--amber)' : 'var(--text-secondary)'}; font-size: 1.1rem;">${medal}</strong></td>
          <td>
            <div style="display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.05rem;">
              <span style="font-size: 1.3rem;">${item.avatar || '🌱'}</span>
              <span>${item.nome}</span>
            </div>
          </td>
          <td><span style="color: var(--text-secondary); font-size: 0.9rem;">${item.modo}</span></td>
          <td><span style="color: var(--text-muted); font-size: 0.85rem;">${item.dificuldade}</span></td>
          <td><strong>${item.acertos}/${item.totalQuestoes}</strong></td>
          <td><span style="font-size: 1.3rem; font-weight: 900; color: var(--emerald);">${item.notaFinal}</span></td>
          <td><span style="color: var(--text-secondary);">${item.tempoFormatado || formatTimeReadable(item.tempoSegundos)}</span></td>
        `;
        tvTbody.appendChild(tr);
      });
    }

    // Ticker TV
    const tickerEl = document.getElementById('tvTickerScroll');
    if (tickerEl && ranking.length > 0) {
      tickerEl.innerHTML = ranking.slice(0, 8).map(r => `
        <span>🏆 <strong>${r.nome}</strong> alcançou nota <span style="color: var(--emerald); font-weight: 900;">${r.notaFinal}</span> (${r.modo})</span>
      `).join(' · ');
    }
  }

  function updateAllRankingDisplays(ranking) {
    renderRankingUI(currentRankingFilter);
    renderTvRankingView(ranking, currentRankingFilter);
  }

  // ==========================================================================
  // 11.3 WEBSOCKET EM TEMPO REAL PARA SINCRONIZAÇÃO DO QUIZ E RANKING
  // ==========================================================================
  function setupQuizWebSocket() {
    try {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${location.host}/ws?role=quiz-client`;
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'RANKING_UPDATED' && msg.payload && msg.payload.ranking) {
            localStorage.setItem(STORAGE_KEYS.RANKING, JSON.stringify(msg.payload.ranking));
            updateAllRankingDisplays(msg.payload.ranking);
          }
        } catch (err) {
          console.warn('[WS Quiz] Erro ao parsear mensagem:', err);
        }
      };

      ws.onopen = () => {
        const badge = document.getElementById('tvOnlineBadge');
        if (badge) badge.textContent = '● Servidor Local Sincronizado (Online)';
      };

      ws.onclose = () => {
        setTimeout(setupQuizWebSocket, 4000);
      };
    } catch (e) {
      console.log('[Quiz WS] Conexão WebSocket offline ou não suportada.');
    }
  }
  // ==========================================================================
  function setupEventListeners() {
    // Form de Boas-vindas / Login
    const welcomeForm = document.getElementById('welcomeForm');
    if (welcomeForm) {
      welcomeForm.addEventListener('submit', handleUserLogin);
    }

    const btnStart = document.getElementById('btnStartWelcome');
    if (btnStart) {
      btnStart.addEventListener('click', handleUserLogin);
    }

    // Botão de Trocar Usuário
    const userPill = document.getElementById('userPill');
    if (userPill) {
      userPill.addEventListener('click', promptChangeUser);
    }

    // Seletor de Dificuldade e Quantidade (Sustentabilidade)
    document.querySelectorAll('#sustDiffSelector .pill-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#sustDiffSelector .pill-option').forEach(el => el.classList.remove('active-emerald'));
        btn.classList.add('active-emerald');
        audio.playClick();
      });
    });

    document.querySelectorAll('#sustCountSelector .pill-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#sustCountSelector .pill-option').forEach(el => el.classList.remove('active-emerald'));
        btn.classList.add('active-emerald');
        audio.playClick();
      });
    });

    // Seletor de Dificuldade, Quantidade e Área (Profissional)
    document.querySelectorAll('#profDiffSelector .pill-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#profDiffSelector .pill-option').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        audio.playClick();
      });
    });

    document.querySelectorAll('#profCountSelector .pill-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#profCountSelector .pill-option').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        audio.playClick();
      });
    });

    document.querySelectorAll('#profAreaSelector .area-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#profAreaSelector .area-option').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        audio.playClick();
      });
    });

    // Botões de Lançamento no Hub
    const btnLaunchSust = document.getElementById('btnLaunchSustentabilidade');
    if (btnLaunchSust) {
      btnLaunchSust.addEventListener('click', () => launchQuiz('sustentabilidade'));
    }

    const btnLaunchProf = document.getElementById('btnLaunchProfissional');
    if (btnLaunchProf) {
      btnLaunchProf.addEventListener('click', () => launchQuiz('profissional'));
    }

    // Próxima Pergunta
    const btnNext = document.getElementById('btnNextQuestion');
    if (btnNext) {
      btnNext.addEventListener('click', handleNextQuestion);
    }

    // Ações dos Resultados
    const btnPlayAgain = document.getElementById('btnPlayAgain');
    if (btnPlayAgain) {
      btnPlayAgain.addEventListener('click', () => {
        audio.playClick();
        showView('hubView');
      });
    }

    const btnResultsRanking = document.getElementById('btnResultsRanking');
    if (btnResultsRanking) {
      btnResultsRanking.addEventListener('click', openRankingModal);
    }

    const btnResultsHistory = document.getElementById('btnResultsHistory');
    if (btnResultsHistory) {
      btnResultsHistory.addEventListener('click', openHistoryModal);
    }

    // Top Bar Actions
    const btnOpenTvRanking = document.getElementById('btnOpenTvRanking');
    if (btnOpenTvRanking) {
      btnOpenTvRanking.addEventListener('click', showTvRankingView);
    }

    const btnTvExit = document.getElementById('btnTvExit');
    if (btnTvExit) {
      btnTvExit.addEventListener('click', () => {
        audio.playClick();
        showView(currentUser && currentUser.nome ? 'hubView' : 'welcomeView');
      });
    }

    const btnOpenRanking = document.getElementById('btnOpenRanking');
    if (btnOpenRanking) {
      btnOpenRanking.addEventListener('click', openRankingModal);
    }

    const btnOpenHistory = document.getElementById('btnOpenHistory');
    if (btnOpenHistory) {
      btnOpenHistory.addEventListener('click', openHistoryModal);
    }

    // Audio Toggle
    const btnToggleAudio = document.getElementById('btnToggleAudio');
    if (btnToggleAudio) {
      btnToggleAudio.addEventListener('click', () => {
        const isEnabled = audio.toggle();
        updateAudioButtonUI();
        if (isEnabled) audio.playClick();
      });
    }

    // Modais Fechar
    const btnCloseRanking = document.getElementById('btnCloseRanking');
    if (btnCloseRanking) btnCloseRanking.addEventListener('click', closeRankingModal);

    const btnCloseHistory = document.getElementById('btnCloseHistory');
    if (btnCloseHistory) btnCloseHistory.addEventListener('click', closeHistoryModal);

    // Fechar ao clicar fora do modal
    window.addEventListener('click', (e) => {
      const rankModal = document.getElementById('rankingModal');
      const histModal = document.getElementById('historyModal');
      if (e.target === rankModal) closeRankingModal();
      if (e.target === histModal) closeHistoryModal();
    });

    // Filtros do Ranking
    document.querySelectorAll('.ranking-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => filterRanking(btn.dataset.filter));
    });

    // Abas do Grande Gráfico de Desempenho
    document.querySelectorAll('#chartTabPills .chart-tab-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playClick();
        renderBigPerformanceChart(btn.dataset.chart);
      });
    });
  }

  function updateAudioButtonUI() {
    const btn = document.getElementById('btnToggleAudio');
    if (!btn) return;
    btn.innerHTML = audio.enabled ? '🔊' : '🔇';
    btn.title = audio.enabled ? 'Efeitos Sonoros Ativados' : 'Efeitos Sonoros Desativados';
  }

  // Expor API global caso necessário para debug ou integração
  window.QUIZ_ENGINE = {
    audio,
    showView,
    launchQuiz,
    openRankingModal,
    openHistoryModal,
    showTvRankingView,
    renderBigPerformanceChart,
    getCurrentGame: () => currentGame,
    getCurrentUser: () => currentUser
  };

  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlatform);
  } else {
    initPlatform();
  }
})();
