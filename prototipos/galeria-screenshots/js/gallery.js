/**
 * CENTRAL VISUAL DE SCREENSHOTS — PROJETEC 2026
 * Controlador da Galeria de Pré-Visualização e Lightbox
 */

class ScreenshotsGallery {
  constructor() {
    this.manifest = typeof SCREENSHOTS_MANIFEST !== 'undefined' ? SCREENSHOTS_MANIFEST : null;
    this.currentFilter = 'todas';
    this.currentLightboxIndex = 0;
    this.allShotsList = [];
  }

  init() {
    if (!this.manifest) {
      console.warn("Manifesto não encontrado em manifest-data.js.");
      return;
    }

    this.renderHeaderMetadata();
    this.renderGallerySections();
    this.initFilterTabs();
    this.initLightbox();
    this.initHelpModal();
    this.flattenShotsList();

    console.log("Galeria de screenshots inicializada.");
  }

  renderHeaderMetadata() {
    const elTime = document.getElementById('manifest-date-display');
    const elTotal = document.getElementById('manifest-total-display');

    if (elTime) elTime.innerText = `Atualizado: ${this.manifest.geradoEmFormatado}`;

    let total = 0;
    this.manifest.projetos.forEach(p => total += p.capturas.length);
    if (elTotal) elTotal.innerText = `${total} Screenshots Reais`;
  }

  flattenShotsList() {
    this.allShotsList = [];
    this.manifest.projetos.forEach(proj => {
      proj.capturas.forEach(cap => {
        this.allShotsList.push({
          ...cap,
          projetoNome: proj.nome,
          projetoId: proj.id
        });
      });
    });
  }

  renderGallerySections() {
    const container = document.getElementById('gallery-sections-container');
    if (!container) return;

    let html = '';

    this.manifest.projetos.forEach((proj, projIndex) => {
      const isVisible = this.currentFilter === 'todas' || this.currentFilter === proj.id;
      const principal = proj.capturas[0];
      const secundarias = proj.capturas.slice(1);

      html += `
        <section id="section-${proj.id}" class="project-section" style="display: ${isVisible ? 'flex' : 'none'};">
          
          <div class="project-section-header">
            <div class="project-titles">
              <span class="project-num-badge">Protótipo 0${projIndex + 1}</span>
              <h2>${proj.nome}</h2>
              <p>${this.getProjectDescription(proj.id)}</p>
            </div>
            
            <div class="project-actions">
              <a href="${proj.caminhoHtmlRelativo}" target="_blank" class="btn-open-app">
                <span>Abrir Aplicação Real</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>

          <!-- Screenshot Principal em Destaque -->
          <div class="featured-shot-wrapper" data-shot-file="${principal.arquivo}" data-title="${principal.nome}" data-desc="${principal.descricao}" data-dim="${principal.largura}×${principal.altura}" data-size="${principal.tamanhoKb} KB">
            <img src="${principal.arquivo}" alt="${principal.nome}" class="featured-shot-img" loading="lazy">
            
            <div class="featured-overlay-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <span>Screenshot Principal • ${principal.largura} × ${principal.altura}</span>
            </div>

            <div class="featured-meta-bottom">
              <div>
                <strong>${principal.nome}</strong>
                <p style="color: var(--text-muted); font-size: 0.73rem;">${principal.descricao}</p>
              </div>
              <span>${principal.tamanhoKb} KB • Clique para ampliar 🔍</span>
            </div>
          </div>

          <!-- Grade de Capturas Secundárias e Mobile -->
          <div class="thumbnails-grid">
      `;

      secundarias.forEach(cap => {
        const isMobile = cap.largura < 500;
        html += `
          <div class="thumb-card" data-shot-file="${cap.arquivo}" data-title="${cap.nome}" data-desc="${cap.descricao}" data-dim="${cap.largura}×${cap.altura}" data-size="${cap.tamanhoKb} KB">
            <div class="thumb-img-box">
              <img src="${cap.arquivo}" alt="${cap.nome}" class="thumb-img" loading="lazy">
              <span class="thumb-type-pill ${isMobile ? 'pill-mobile' : 'pill-desktop'}">
                ${isMobile ? '📱 Mobile 390×844' : '💻 Desktop'}
              </span>
            </div>

            <div class="thumb-card-body">
              <h4 class="thumb-title">${cap.nome}</h4>
              <p class="thumb-desc">${cap.descricao}</p>
              <div class="thumb-footer">
                <span>${cap.largura} × ${cap.altura}</span>
                <span>${cap.tamanhoKb} KB</span>
              </div>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </section>
      `;
    });

    container.innerHTML = html;

    // Vincula cliques aos cards para abrir o lightbox
    container.querySelectorAll('.featured-shot-wrapper, .thumb-card').forEach(card => {
      card.addEventListener('click', () => {
        const file = card.getAttribute('data-shot-file');
        this.openLightboxByFile(file);
      });
    });
  }

  getProjectDescription(projId) {
    switch (projId) {
      case 'mapa-parque':
        return "Cartografia digital interativa dos 76 mil m² do Parque Realengo Susana Naspolini, com geolocalização das 5 Super-Torres, espelho d'água de 1.300 m², biovaletas, anfiteatro e complexo esportivo.";
      case 'painel-ambiental':
        return "Dashboard executivo de sustentabilidade urbana e inteligência climática, monitorando 18 indicadores auditados com rigor oficial (Data.rio, FPJ, Rio-Águas, IBGE), mapa microclimático com névoa, curva térmica diária e comparador antes/depois.";
      case 'simulador-drenagem':
        return "Simulação hidrodinâmica em tempo real que demonstra o amortecimento de tempestades severas na bacia de Realengo através das Soluções Baseadas na Natureza (espelho d'água de 1.950 m³, biovaletas e solo 84,2% permeável) em contraste com o cenário anterior de alagamento crítico.";
      default:
        return "Protótipo interativo desenvolvido para o ecossistema ambiental do Parque Realengo.";
    }
  }

  initFilterTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.currentFilter = filter;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.manifest.projetos.forEach(p => {
          const sec = document.getElementById(`section-${p.id}`);
          if (sec) {
            sec.style.display = (filter === 'todas' || filter === p.id) ? 'flex' : 'none';
          }
        });
      });
    });
  }

  // --- LIGHTBOX INTERATIVO ---
  initLightbox() {
    const backdrop = document.getElementById('lightbox-backdrop');
    const closeBtn = document.getElementById('btn-close-lightbox');
    const prevBtn = document.getElementById('btn-lightbox-prev');
    const nextBtn = document.getElementById('btn-lightbox-next');

    if (closeBtn && backdrop) {
      closeBtn.addEventListener('click', () => this.closeLightbox());
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeLightbox();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateLightbox(1));
    }

    window.addEventListener('keydown', (e) => {
      if (!backdrop || !backdrop.classList.contains('open')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
      if (e.key === 'ArrowRight') this.navigateLightbox(1);
    });
  }

  openLightboxByFile(file) {
    const idx = this.allShotsList.findIndex(s => s.arquivo === file);
    if (idx !== -1) {
      this.currentLightboxIndex = idx;
      this.displayLightboxItem(this.allShotsList[idx]);
    }
  }

  displayLightboxItem(item) {
    const backdrop = document.getElementById('lightbox-backdrop');
    if (!backdrop) return;

    document.getElementById('lightbox-title').innerText = item.nome;
    document.getElementById('lightbox-project-name').innerText = `${item.projetoNome} • Resolução: ${item.largura} × ${item.altura}`;
    document.getElementById('lightbox-desc').innerText = item.descricao;
    document.getElementById('lightbox-meta-dim').innerText = `${item.largura} × ${item.altura} px`;
    document.getElementById('lightbox-meta-size').innerText = `${item.tamanhoKb} KB`;
    document.getElementById('lightbox-meta-date').innerText = item.dataHora || this.manifest.geradoEmFormatado;

    const img = document.getElementById('lightbox-img');
    img.src = item.arquivo;
    img.alt = item.nome;

    backdrop.classList.add('open');
  }

  navigateLightbox(direction) {
    const total = this.allShotsList.length;
    this.currentLightboxIndex = (this.currentLightboxIndex + direction + total) % total;
    this.displayLightboxItem(this.allShotsList[this.currentLightboxIndex]);
  }

  closeLightbox() {
    const backdrop = document.getElementById('lightbox-backdrop');
    if (backdrop) backdrop.classList.remove('open');
  }

  // --- MODAL DE AJUDA & COMANDO ---
  initHelpModal() {
    const btnHelp = document.getElementById('btn-help-modal');
    const modalBackdrop = document.getElementById('help-modal-backdrop');
    const closeBtn = document.getElementById('btn-close-help');
    const btnCopy = document.getElementById('btn-copy-command');

    if (btnHelp && modalBackdrop) {
      btnHelp.addEventListener('click', () => modalBackdrop.classList.add('open'));
      if (closeBtn) closeBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
      });
    }

    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText("node prototipos/galeria-screenshots/capturar.js");
        btnCopy.innerText = "Copiado! ✓";
        setTimeout(() => btnCopy.innerText = "Copiar", 2000);
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ScreenshotsGallery = new ScreenshotsGallery();
  window.ScreenshotsGallery.init();
});
