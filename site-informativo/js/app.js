/**
 * CONTROLADOR PRINCIPAL DE INTERAÇÕES — ECOCITY / PROJETEC 2026
 * Projeto V.I.D.A. — Parque Realengo Jornalista Susana Naspolini
 * 
 * Funcionalidades:
 * - Scroll Spy & Barra de Progresso de Leitura
 * - Painel de Comparação Fotográfica Real (Aérea & Nível dos Olhos)
 * - Modos de Visualização (Antes, Divisão 50/50, Hoje, Lado a Lado)
 * - Lightbox de Ampliação de Fotografias Reais em Alta Resolução
 * - Barra de Navegação Flutuante Inferior para Dispositivos Móveis
 * - Menu Drawer Tátil e Acessível para Celulares
 * - Modo Feira (M) com ampliação para telões do estande
 * - Modo Apresentação Guiada (P) com rolagem contínua automática
 * - Áudio de Ambiência Bioclimática Procedural via Web Audio API (A)
 * - Filtros e Pesquisa Dinâmica do Catálogo de Indicadores
 * - Modais Interativos para Materiais e Estruturas do Parque
 */

(function () {
  'use strict';

  // Atalhos e Seletores
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Estados Globais da Aplicação
  const state = {
    isFeiraMode: false,
    isAutoPresentation: false,
    presentationTimer: null,
    audioContext: null,
    audioGain: null,
    isAudioPlaying: false,
    activePerspective: 'aerea',
    activeMode: 'slider',
    sliderPercent: 50,
    activeCategory: 'todas'
  };

  // ==========================================================================
  // 1. INICIALIZAÇÃO
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();
    initProgressBar();
    initMobileMenu();
    initMobileBottomBar();
    initComparisonShowcase();
    initPhotoLightbox();
    initCircularEconomyCards();
    initStructuresModal();
    initIndicatorsFilter();
    initShortcuts();
    initAudioAmbience();
    initFeiraMode();
    initPresentationMode();
  });

  // ==========================================================================
  // 2. SCROLL SPY & BARRA DE PROGRESSO
  // ==========================================================================
  function initScrollSpy() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-pill, .mobile-nav-link');
    const bottomBarItems = $$('.mobile-bar-item');

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;

      sections.forEach(sec => {
        const top = sec.offsetTop - 140;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          bottomBarItems.forEach(item => {
            if (item.getAttribute('href') === `#${id}`) {
              item.classList.add('active');
            } else if (item.getAttribute('href')) {
              item.classList.remove('active');
            }
          });
        }
      });
    }, { passive: true });
  }

  function initProgressBar() {
    const bar = $('#reading-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      bar.style.width = `${progress}%`;
    }, { passive: true });
  }

  // ==========================================================================
  // 3. MENU MOBILE, DRAWER & BARRA INFERIOR
  // ==========================================================================
  function initMobileMenu() {
    const btnToggle = $('#mobile-menu-toggle');
    const drawer = $('#mobile-drawer');
    const backdrop = $('#mobile-backdrop');
    const closeBtn = $('#mobile-drawer-close');

    if (!drawer) return;

    function openMenu() {
      drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('visible');
      document.body.style.overflow = 'hidden';
      if (btnToggle) btnToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('visible');
      document.body.style.overflow = '';
      if (btnToggle) btnToggle.setAttribute('aria-expanded', 'false');
    }

    if (btnToggle) btnToggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    $$('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Atalhos dentro do Drawer
    const drawerFeira = $('#btn-drawer-feira');
    if (drawerFeira) drawerFeira.addEventListener('click', () => {
      const btn = $('#btn-toggle-feira');
      if (btn) btn.click();
    });

    const drawerAudio = $('#btn-drawer-audio');
    if (drawerAudio) drawerAudio.addEventListener('click', () => {
      const btn = $('#btn-toggle-audio');
      if (btn) btn.click();
    });

    const drawerPres = $('#btn-drawer-pres');
    if (drawerPres) drawerPres.addEventListener('click', () => {
      const btn = $('#btn-toggle-presentation');
      if (btn) btn.click();
    });

    window.openMobileDrawer = openMenu;
    window.closeMobileDrawer = closeMenu;
  }

  function initMobileBottomBar() {
    const menuTrigger = $('#mobile-bar-menu-trigger');
    if (menuTrigger) {
      menuTrigger.addEventListener('click', () => {
        if (window.openMobileDrawer) window.openMobileDrawer();
      });
    }
  }

  // ==========================================================================
  // 4. PAINEL DE COMPARAÇÃO FOTOGRÁFICA REAL (AÉREA & NÍVEL DOS OLHOS)
  // ==========================================================================
  function initComparisonShowcase() {
    const stage = $('#interactive-comparison-stage');
    const handle = $('#stage-slider-handle');
    const beforeLayer = $('#stage-before');
    if (!stage || !handle || !beforeLayer) return;

    let isDragging = false;

    // Atualiza posição visual do divisor
    function setSliderPosition(percentage) {
      state.sliderPercent = Math.max(0, Math.min(100, percentage));
      handle.style.left = `${state.sliderPercent}%`;
      beforeLayer.style.clipPath = `polygon(0 0, ${state.sliderPercent}% 0, ${state.sliderPercent}% 100%, 0 100%)`;
      handle.setAttribute('aria-valuenow', Math.round(state.sliderPercent));
    }

    function calculatePos(e) {
      const rect = stage.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setSliderPosition(pct);
    }

    handle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    stage.addEventListener('mousemove', (e) => {
      if (isDragging && state.activeMode === 'slider') calculatePos(e);
    });

    handle.addEventListener('touchstart', () => isDragging = true, { passive: true });
    window.addEventListener('touchend', () => isDragging = false);
    stage.addEventListener('touchmove', (e) => {
      if (isDragging && state.activeMode === 'slider') calculatePos(e);
    }, { passive: true });

    stage.addEventListener('click', (e) => {
      if (state.activeMode === 'slider' && !e.target.closest('#stage-slider-handle')) {
        calculatePos(e);
      }
    });

    // Teclado (Setas Esquerda e Direita)
    handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') setSliderPosition(state.sliderPercent - 5);
      if (e.key === 'ArrowRight') setSliderPosition(state.sliderPercent + 5);
    });

    // Alternar Perspectiva (Aérea vs Nível dos Olhos)
    $$('.perspective-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.perspective-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const persp = btn.getAttribute('data-persp');
        applyPerspective(persp);
      });
    });

    function applyPerspective(perspId) {
      state.activePerspective = perspId;
      const compData = window.ECOCITY_DATA && window.ECOCITY_DATA.comparisons;
      if (!compData) return;

      const current = compData.find(c => c.id === perspId) || compData[0];

      // Atualiza Imagens do Palco Principal
      const imgBefore = $('#img-before');
      const imgAfter = $('#img-after');
      const badgeBefore = $('#badge-before-text');
      const badgeAfter = $('#badge-after-text');

      if (imgBefore) {
        imgBefore.src = current.before.image;
        imgBefore.alt = current.before.caption;
      }
      if (imgAfter) {
        imgAfter.src = current.after.image;
        imgAfter.alt = current.after.caption;
      }
      if (badgeBefore) badgeBefore.textContent = current.before.badge;
      if (badgeAfter) badgeAfter.textContent = current.after.badge;

      // Atualiza Dossier Contextual
      const dBeforeTitle = $('#dossier-before-title');
      const dBeforeDesc = $('#dossier-before-desc');
      const dBeforeCredit = $('#dossier-before-credit');
      const dAfterTitle = $('#dossier-after-title');
      const dAfterDesc = $('#dossier-after-desc');
      const dAfterCredit = $('#dossier-after-credit');

      if (dBeforeTitle) dBeforeTitle.textContent = current.before.label;
      if (dBeforeDesc) dBeforeDesc.textContent = current.before.caption;
      if (dBeforeCredit) dBeforeCredit.innerHTML = `<strong>Fonte Verificada:</strong> ${current.before.source} • ${current.before.author}`;

      if (dAfterTitle) dAfterTitle.textContent = current.after.label;
      if (dAfterDesc) dAfterDesc.textContent = current.after.caption;
      if (dAfterCredit) dAfterCredit.innerHTML = `<strong>Fonte Verificada:</strong> ${current.after.source} • ${current.after.author}`;

      // Atualiza Cards Mobile
      const mImgBefore = $('#mobile-card-img-before');
      const mImgAfter = $('#mobile-card-img-after');
      const mCapBTitle = $('#mobile-caption-before-title');
      const mCapBText = $('#mobile-caption-before-text');
      const mCapBSrc = $('#mobile-caption-before-source');
      const mCapATitle = $('#mobile-caption-after-title');
      const mCapAText = $('#mobile-caption-after-text');
      const mCapASrc = $('#mobile-caption-after-source');

      if (mImgBefore) mImgBefore.src = current.before.image;
      if (mImgAfter) mImgAfter.src = current.after.image;
      if (mCapBTitle) mCapBTitle.textContent = current.before.label;
      if (mCapBText) mCapBText.textContent = current.before.caption;
      if (mCapBSrc) mCapBSrc.innerHTML = `<strong>Fonte:</strong> ${current.before.source}`;

      if (mCapATitle) mCapATitle.textContent = current.after.label;
      if (mCapAText) mCapAText.textContent = current.after.caption;
      if (mCapASrc) mCapASrc.innerHTML = `<strong>Fonte:</strong> ${current.after.source}`;
    }

    // Alternar Modos de Exibição (Antes, Divisão, Hoje, Lado a Lado)
    $$('.view-mode-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.view-mode-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.getAttribute('data-mode');
        state.activeMode = mode;

        if (mode === 'antes') {
          stage.classList.remove('mode-side-by-side');
          setSliderPosition(100);
        } else if (mode === 'depois') {
          stage.classList.remove('mode-side-by-side');
          setSliderPosition(0);
        } else if (mode === 'side-by-side') {
          stage.classList.add('mode-side-by-side');
          beforeLayer.style.clipPath = '';
        } else {
          stage.classList.remove('mode-side-by-side');
          setSliderPosition(50);
        }
      });
    });

    setSliderPosition(50);
  }

  // ==========================================================================
  // 5. LIGHTBOX DE AMPLIAÇÃO FOTOGRÁFICA EM ALTA RESOLUÇÃO
  // ==========================================================================
  function initPhotoLightbox() {
    const modal = $('#photo-lightbox-modal');
    const closeBtn = $('#lightbox-close-btn');
    const btnZoom = $('#btn-zoom-photo');
    if (!modal) return;

    function openLightbox(photoData) {
      $('#lightbox-full-img').src = photoData.image;
      $('#lightbox-full-img').alt = photoData.caption || photoData.title;
      $('#lightbox-title').textContent = photoData.title;
      $('#lightbox-desc').textContent = photoData.caption;
      $('#lightbox-source').textContent = `Fonte: ${photoData.source}`;
      
      const badge = $('#lightbox-period-badge');
      if (badge) {
        badge.textContent = photoData.isBefore ? 'ANTES • HISTÓRICO' : 'HOJE • PARQUE CONCLUÍDO';
        badge.className = `photo-period-tag ${photoData.isBefore ? 'before' : 'after'}`;
      }

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (btnZoom) {
      btnZoom.addEventListener('click', () => {
        const compData = window.ECOCITY_DATA && window.ECOCITY_DATA.comparisons;
        if (!compData) return;
        const current = compData.find(c => c.id === state.activePerspective) || compData[0];
        // Abre o "depois" se o slider estiver mostrando mais dele, senão abre o "antes"
        const showBefore = state.sliderPercent > 50;
        const target = showBefore ? current.before : current.after;
        openLightbox({
          image: target.image,
          title: target.label,
          caption: target.caption,
          source: target.source,
          isBefore: showBefore
        });
      });
    }

    // Zoom nos cards mobile
    $$('.mobile-zoom-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isBefore = btn.getAttribute('data-target') === 'before';
        const compData = window.ECOCITY_DATA && window.ECOCITY_DATA.comparisons;
        if (!compData) return;
        const current = compData.find(c => c.id === state.activePerspective) || compData[0];
        const target = isBefore ? current.before : current.after;
        openLightbox({
          image: target.image,
          title: target.label,
          caption: target.caption,
          source: target.source,
          isBefore: isBefore
        });
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });
  }

  // ==========================================================================
  // 6. ECONOMIA CIRCULAR & MODAL DE MATERIAIS
  // ==========================================================================
  function initCircularEconomyCards() {
    const modal = $('#material-modal');
    const modalClose = $('#material-modal-close');
    if (!modal) return;

    $$('[data-material-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-material-id');
        openMaterialModal(id);
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  function openMaterialModal(id) {
    const data = window.ECOCITY_DATA && window.ECOCITY_DATA.materials;
    if (!data) return;

    const item = data.find(m => m.id === id);
    if (!item) return;

    const modal = $('#material-modal');
    $('#modal-mat-title').textContent = item.name;
    $('#modal-mat-type').textContent = item.type;
    $('#modal-mat-impact').textContent = item.impact;
    $('#modal-mat-cycle').textContent = item.cycle;
    $('#modal-mat-stats').textContent = item.stats;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // ==========================================================================
  // 7. ESTRUTURAS DO PARQUE REALENGO & FICHA FOTOGRÁFICA
  // ==========================================================================
  function initStructuresModal() {
    const modal = $('#structure-modal');
    const modalClose = $('#structure-modal-close');
    if (!modal) return;

    $$('[data-structure-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-structure-id');
        openStructureModal(id);
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  function openStructureModal(id) {
    const data = window.ECOCITY_DATA && window.ECOCITY_DATA.structures;
    if (!data) return;

    const item = data.find(s => s.id === id);
    if (!item) return;

    const modal = $('#structure-modal');
    $('#modal-struct-title').textContent = item.name;
    $('#modal-struct-tag').textContent = item.tag;
    $('#modal-struct-desc').textContent = item.desc;
    $('#modal-struct-img').src = item.image;
    $('#modal-struct-img').alt = item.name;
    $('#modal-struct-credit').textContent = item.credit;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // ==========================================================================
  // 8. PESQUISA E FILTROS DE INDICADORES
  // ==========================================================================
  function initIndicatorsFilter() {
    const filterBtns = $$('.filter-pill');
    const searchInput = $('#indicator-search');
    const cards = $$('.indicator-card');

    function applyFilter() {
      const term = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const cat = state.activeCategory;

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        const cardText = card.textContent.toLowerCase();

        const matchCat = cat === 'todas' || cardCat === cat;
        const matchSearch = !term || cardText.includes(term);

        if (matchCat && matchSearch) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        state.activeCategory = btn.getAttribute('data-filter');
        applyFilter();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }
  }

  // ==========================================================================
  // 9. MODO FEIRA (M) & MODO APRESENTAÇÃO (P)
  // ==========================================================================
  function initFeiraMode() {
    const btn = $('#btn-toggle-feira');
    if (!btn) return;

    function toggleFeira() {
      state.isFeiraMode = !state.isFeiraMode;
      document.documentElement.classList.toggle('modo-feira', state.isFeiraMode);
      btn.classList.toggle('active', state.isFeiraMode);
      btn.setAttribute('aria-pressed', state.isFeiraMode ? 'true' : 'false');
      const label = btn.querySelector('.btn-label');
      if (label) label.textContent = state.isFeiraMode ? 'Normal (M)' : 'Modo Feira (M)';
    }

    btn.addEventListener('click', toggleFeira);
  }

  function initPresentationMode() {
    const btn = $('#btn-toggle-presentation');
    if (!btn) return;

    function togglePresentation() {
      state.isAutoPresentation = !state.isAutoPresentation;
      btn.classList.toggle('active', state.isAutoPresentation);
      btn.setAttribute('aria-pressed', state.isAutoPresentation ? 'true' : 'false');
      const label = btn.querySelector('.btn-label');
      if (label) label.textContent = state.isAutoPresentation ? 'Pausar (P)' : 'Apresentação (P)';

      if (state.isAutoPresentation) {
        startPresentation();
      } else {
        stopPresentation();
      }
    }

    function startPresentation() {
      stopPresentation();
      state.presentationTimer = setInterval(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const current = window.scrollY;
        if (current >= maxScroll - 50) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollBy({ top: 2, behavior: 'auto' });
        }
      }, 35);
    }

    function stopPresentation() {
      if (state.presentationTimer) {
        clearInterval(state.presentationTimer);
        state.presentationTimer = null;
      }
    }

    btn.addEventListener('click', togglePresentation);
    window.addEventListener('wheel', () => {
      if (state.isAutoPresentation) togglePresentation();
    }, { passive: true });
    window.addEventListener('touchmove', () => {
      if (state.isAutoPresentation) togglePresentation();
    }, { passive: true });
  }

  // ==========================================================================
  // 10. ÁUDIO DE AMBIÊNCIA BIOCLIMÁTICA PROCEDURAL (WEB AUDIO API)
  // ==========================================================================
  function initAudioAmbience() {
    const btn = $('#btn-toggle-audio');
    if (!btn) return;

    function startAudio() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        state.audioContext = new AudioCtx();
        state.audioGain = state.audioContext.createGain();
        state.audioGain.gain.setValueAtTime(0.04, state.audioContext.currentTime);
        state.audioGain.connect(state.audioContext.destination);

        // Sintetizador de Vento & Brisa Orgânica
        const bufferSize = state.audioContext.sampleRate * 2;
        const noiseBuffer = state.audioContext.createBuffer(1, bufferSize, state.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = state.audioContext.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = state.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(360, state.audioContext.currentTime);

        whiteNoise.connect(filter);
        filter.connect(state.audioGain);
        whiteNoise.start();

        state.isAudioPlaying = true;
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const label = btn.querySelector('.btn-label');
        if (label) label.textContent = 'Áudio Ativo (A)';

      } catch (err) {
        console.warn('Web Audio indisponível:', err);
      }
    }

    function stopAudio() {
      if (state.audioContext) {
        state.audioContext.close();
        state.audioContext = null;
      }
      state.isAudioPlaying = false;
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      const label = btn.querySelector('.btn-label');
      if (label) label.textContent = 'Áudio (A)';
    }

    btn.addEventListener('click', () => {
      if (state.isAudioPlaying) stopAudio();
      else startAudio();
    });
  }

  // ==========================================================================
  // 11. ATALHOS DE TECLADO (ACESSIBILIDADE DA FEIRA)
  // ==========================================================================
  function initShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if (key === 'm') {
        const btnFeira = $('#btn-toggle-feira');
        if (btnFeira) btnFeira.click();
      } else if (key === 'p') {
        const btnPres = $('#btn-toggle-presentation');
        if (btnPres) btnPres.click();
      } else if (key === 'a') {
        const btnAudio = $('#btn-toggle-audio');
        if (btnAudio) btnAudio.click();
      } else if (key === 'escape') {
        $$('.modal-overlay').forEach(m => m.classList.remove('open'));
        const drawer = $('#mobile-drawer');
        if (drawer) drawer.classList.remove('open');
        const backdrop = $('#mobile-backdrop');
        if (backdrop) backdrop.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  }

})();
