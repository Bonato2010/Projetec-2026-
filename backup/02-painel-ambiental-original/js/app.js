/**
 * CENTRAL DE MONITORAMENTO AMBIENTAL V.I.D.A.
 * Aplicação Principal e Controlador de Interações (UX/UI)
 * Parque Realengo Jornalista Susana Naspolini - Rio de Janeiro
 */

class VidaApp {
  constructor() {
    this.currentCategory = 'todas';
    this.searchTerm = '';
    this.theme = localStorage.getItem('vida-theme') || 'dark';
    this.currentTimeRange = '24h';
    this.mistingActive = true;
    this.selectedIndicator = null;
  }

  init() {
    this.applyTheme(this.theme);
    this.renderHeaderStats();
    this.renderCategoryFilters();
    this.renderIndicatorCards();
    this.initSearch();
    this.initModals();
    this.initThemeToggle();
    this.initTimeRangeSelector();
    this.initMistingSimulation();
    this.initExportModal();

    // Inicializa Módulos Filhos
    if (window.VidaCharts) {
      window.VidaCharts.setTheme(this.theme);
      window.VidaCharts.renderAllCharts();
    }
    if (window.VidaHeatmap) {
      window.VidaHeatmap.init('heatmap-canvas');
      window.VidaHeatmap.setTheme(this.theme);
    }
    if (window.VidaSlider) {
      window.VidaSlider.init('comparison-slider');
    }

    // Suporte a parâmetros de URL (para automação e screenshots)
    this.handleUrlParams();

    console.log("Central V.I.D.A. inicializada com sucesso.");
  }

  handleUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('theme')) {
        this.applyTheme(params.get('theme'));
      }
      if (params.get('category')) {
        this.setCategory(params.get('category'));
      }
      if (params.get('modal')) {
        setTimeout(() => this.openIndicatorModal(params.get('modal')), 300);
      }
      if (params.get('view') === 'slider') {
        const toHide = document.querySelectorAll('.hero-banner, .top-kpis-grid, .visuals-split-row');
        toHide.forEach(el => el.style.display = 'none');
        if (window.VidaSlider) window.VidaSlider.updatePosition(50);
      } else if (params.get('view') === 'catalog') {
        const toHide = document.querySelectorAll('.hero-banner, .top-kpis-grid, .visuals-split-row, .comparison-section, .secondary-charts-row');
        toHide.forEach(el => el.style.display = 'none');
      }

      if (params.get('slider') && window.VidaSlider) {
        window.VidaSlider.updatePosition(parseInt(params.get('slider')));
      }
    } catch (e) {
      console.warn("Erro ao processar parâmetros de URL:", e);
    }
  }

  // --- CONTROLE DE TEMA (DARK / LIGHT) ---
  initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const newTheme = this.theme === 'dark' ? 'light' : 'dark';
      this.applyTheme(newTheme);
    });
  }

  applyTheme(theme) {
    this.theme = theme;
    localStorage.setItem('vida-theme', theme);
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg><span>Modo Claro</span>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span>Modo Escuro</span>`;
    }

    if (window.VidaCharts) window.VidaCharts.setTheme(theme);
    if (window.VidaHeatmap) window.VidaHeatmap.setTheme(theme);
  }

  // --- ESTATÍSTICAS DO TOPO (HEADER KPIS) ---
  renderHeaderStats() {
    const kpiArvores = document.getElementById('kpi-arvores-val');
    const kpiTemp = document.getElementById('kpi-temp-val');
    const kpiAgua = document.getElementById('kpi-agua-val');
    const kpiPerm = document.getElementById('kpi-perm-val');

    if (kpiArvores) kpiArvores.innerText = "3.700";
    if (kpiTemp) kpiTemp.innerText = "-5,8°C";
    if (kpiAgua) kpiAgua.innerText = "1.950 m³";
    if (kpiPerm) kpiPerm.innerText = "84,2%";
  }

  // --- FILTROS DE CATEGORIA ---
  renderCategoryFilters() {
    const container = document.getElementById('category-filter-pills');
    if (!container) return;

    let html = '';
    AMBIENTAL_DATA.categorias.forEach(cat => {
      const count = cat.id === 'todas' 
        ? AMBIENTAL_DATA.indicadores.length 
        : AMBIENTAL_DATA.indicadores.filter(i => i.categoria === cat.id).length;

      const isActive = cat.id === this.currentCategory;
      html += `
        <button class="pill-btn ${isActive ? 'active' : ''}" data-category="${cat.id}">
          <span class="pill-icon">${this.getCategoryIcon(cat.id)}</span>
          <span class="pill-name">${cat.nome}</span>
          <span class="pill-badge">${count}</span>
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = btn.getAttribute('data-category');
        this.setCategory(catId);
      });
    });
  }

  setCategory(catId) {
    this.currentCategory = catId;
    document.querySelectorAll('#category-filter-pills .pill-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-category') === catId);
    });
    this.renderIndicatorCards();
    this.updateActiveSectionView(catId);
  }

  updateActiveSectionView(catId) {
    // Sincroniza abas do mapa ou rola suavemente para foco
    if (catId === 'clima') {
      window.VidaHeatmap.setLayer('temperatura');
    } else if (catId === 'agua') {
      window.VidaHeatmap.setLayer('drenagem');
    } else if (catId === 'vegetacao') {
      window.VidaHeatmap.setLayer('vegetacao');
    }
  }

  // --- BUSCA INSTANTÂNEA ---
  initSearch() {
    const searchInput = document.getElementById('indicator-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase().trim();
      this.renderIndicatorCards();
    });
  }

  // --- RENDERIZAÇÃO DOS CARTÕES DE INDICADORES ---
  renderIndicatorCards() {
    const container = document.getElementById('indicators-grid');
    if (!container) return;

    let filtered = AMBIENTAL_DATA.indicadores;

    // Filtro por Categoria
    if (this.currentCategory !== 'todas') {
      filtered = filtered.filter(item => item.categoria === this.currentCategory);
    }

    // Filtro por Busca
    if (this.searchTerm) {
      filtered = filtered.filter(item => {
        return item.titulo.toLowerCase().includes(this.searchTerm) ||
               item.resumo.toLowerCase().includes(this.searchTerm) ||
               item.unidade.toLowerCase().includes(this.searchTerm) ||
               item.detalhes.fonteOficial.toLowerCase().includes(this.searchTerm);
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <p>Nenhum indicador encontrado para "<strong>${this.searchTerm}</strong>".</p>
          <button class="btn-reset-search" onclick="document.getElementById('indicator-search-input').value=''; window.VidaApp.searchTerm=''; window.VidaApp.renderIndicatorCards();">Limpar Busca</button>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(ind => {
      const confMeta = AMBIENTAL_DATA.tiposConfiabilidade[ind.confiabilidade];
      const trendIcon = ind.tendencia.direcao === 'up' 
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
        : (ind.tendencia.direcao === 'down'
          ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`
          : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>`);

      const trendColorClass = ind.tendencia.direcao === 'up' ? 'trend-up' : (ind.tendencia.direcao === 'down' ? 'trend-down' : 'trend-neutral');

      html += `
        <article class="indicator-card" data-id="${ind.id}" tabindex="0" role="button" aria-label="Abrir detalhes de ${ind.titulo}">
          <div class="card-header">
            <span class="card-category-tag cat-${ind.categoria}">
              ${this.getCategoryIcon(ind.categoria)}
              <span>${this.getCategoryName(ind.categoria)}</span>
            </span>
            <span class="badge-trust ${confMeta.badgeClass}" title="${confMeta.descricao}">
              <span class="trust-dot"></span>
              ${confMeta.label}
            </span>
          </div>

          <h3 class="card-title">${ind.titulo}</h3>

          <div class="card-metric">
            <span class="metric-value">${ind.valor}</span>
            <span class="metric-unit">${ind.unidade}</span>
          </div>

          <div class="card-trend ${trendColorClass}">
            ${trendIcon}
            <span class="trend-pct">${ind.tendencia.percentual}</span>
            <span class="trend-txt">${ind.tendencia.texto}</span>
          </div>

          <p class="card-summary">${ind.resumo}</p>

          <div class="card-footer">
            <div class="card-source-brief">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>${ind.detalhes.fonteOficial.split('/')[0]}</span>
            </div>
            <button class="btn-card-inspect" aria-hidden="true">
              <span>Detalhar</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;

    // Vincula clique para abrir modal explicativo
    container.querySelectorAll('.indicator-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        this.openIndicatorModal(id);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = card.getAttribute('data-id');
          this.openIndicatorModal(id);
        }
      });
    });
  }

  // --- MODAL DE DETALHAMENTO & CONFIABILIDADE DO INDICADOR ---
  initModals() {
    const modalBackdrop = document.getElementById('indicator-modal-backdrop');
    const closeBtn = document.getElementById('modal-close-btn');

    if (closeBtn && modalBackdrop) {
      closeBtn.addEventListener('click', () => this.closeIndicatorModal());
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) this.closeIndicatorModal();
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeIndicatorModal();
      });
    }
  }

  openIndicatorModal(indicatorId) {
    const indicator = AMBIENTAL_DATA.indicadores.find(i => i.id === indicatorId);
    if (!indicator) return;

    this.selectedIndicator = indicator;
    const backdrop = document.getElementById('indicator-modal-backdrop');
    const modal = document.getElementById('indicator-modal');
    if (!backdrop || !modal) return;

    const confMeta = AMBIENTAL_DATA.tiposConfiabilidade[indicator.confiabilidade];

    // Preenche conteúdo
    document.getElementById('modal-title').innerText = indicator.titulo;
    document.getElementById('modal-cat-tag').innerHTML = `
      ${this.getCategoryIcon(indicator.categoria)}
      <span>${this.getCategoryName(indicator.categoria)}</span>
    `;

    const trustBadgeEl = document.getElementById('modal-trust-badge');
    trustBadgeEl.className = `badge-trust ${confMeta.badgeClass}`;
    trustBadgeEl.innerHTML = `<span class="trust-dot"></span> ${confMeta.label}`;

    document.getElementById('modal-val').innerText = indicator.valor;
    document.getElementById('modal-unit').innerText = indicator.unidade;

    document.getElementById('modal-o-que-mede').innerText = indicator.detalhes.oQueMede;
    document.getElementById('modal-por-que-importa').innerText = indicator.detalhes.porQueImporta;
    document.getElementById('modal-relacao-sustentabilidade').innerText = indicator.detalhes.relacaoSustentabilidade;
    document.getElementById('modal-unidade-periodo').innerText = indicator.detalhes.unidadePeriodo;
    document.getElementById('modal-metodologia').innerText = indicator.detalhes.metodologia;

    const fonteEl = document.getElementById('modal-fonte-oficial');
    fonteEl.innerHTML = `
      <a href="${indicator.detalhes.linkFonte}" target="_blank" rel="noopener noreferrer" class="external-link">
        ${indicator.detalhes.fonteOficial}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    `;

    // Exibe espécies em destaque se for arborização
    const extraBox = document.getElementById('modal-extra-box');
    if (indicator.detalhes.especiesDestaque) {
      extraBox.style.display = 'block';
      let especiesHtml = '<h4>Espécies Arbóreas Nativas em Destaque:</h4><ul class="especies-list">';
      indicator.detalhes.especiesDestaque.forEach(esp => {
        especiesHtml += `<li><span class="bullet">🌱</span> ${esp}</li>`;
      });
      especiesHtml += '</ul>';
      extraBox.innerHTML = especiesHtml;
    } else {
      extraBox.style.display = 'none';
      extraBox.innerHTML = '';
    }

    backdrop.classList.add('open');
    modal.focus();
  }

  closeIndicatorModal() {
    const backdrop = document.getElementById('indicator-modal-backdrop');
    if (backdrop) backdrop.classList.remove('open');
  }

  // --- DETALHES DE HOTSPOT DO MAPA ---
  openHotspotDetail(hotspot) {
    const cardEl = document.getElementById('hotspot-quick-card');
    if (!cardEl) return;

    cardEl.innerHTML = `
      <div class="hotspot-detail-inner">
        <div class="hotspot-header">
          <span class="hotspot-badge ${hotspot.tipo}">● ${hotspot.status}</span>
          <button class="btn-close-mini" onclick="document.getElementById('hotspot-quick-card').style.display='none'">&times;</button>
        </div>
        <h4>${hotspot.nome}</h4>
        <p>${hotspot.descricao}</p>
      </div>
    `;
    cardEl.style.display = 'block';
  }

  // --- SELETOR DE INTERVALO TEMPORAL ---
  initTimeRangeSelector() {
    const select = document.getElementById('time-range-select');
    if (!select) return;

    select.addEventListener('change', (e) => {
      this.currentTimeRange = e.target.value;
      this.showToast(`Visualização atualizada para: ${select.options[select.selectedIndex].text}`);
      if (window.VidaCharts) window.VidaCharts.renderAllCharts();
    });
  }

  // --- SIMULAÇÃO DE NÉVOA DAS TORRES ---
  initMistingSimulation() {
    const toggle = document.getElementById('btn-toggle-misting');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      this.mistingActive = !this.mistingActive;
      toggle.classList.toggle('active', this.mistingActive);
      toggle.innerHTML = this.mistingActive 
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg><span>Névoa: 5 Torres Ativas</span>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/></svg><span>Névoa: Desativada</span>`;

      this.showToast(this.mistingActive ? "Torres de nebulização ligadas. Umidade em elevação." : "Torres de nebulização em modo de espera.");
    });
  }

  // --- MODAL DE EXPORTAÇÃO DE RELATÓRIO ---
  initExportModal() {
    const exportBtn = document.getElementById('btn-export-report');
    const modalBackdrop = document.getElementById('export-modal-backdrop');
    const closeBtn = document.getElementById('export-close-btn');

    if (exportBtn && modalBackdrop) {
      exportBtn.addEventListener('click', () => {
        modalBackdrop.classList.add('open');
      });
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modalBackdrop.classList.remove('open');
        });
      }
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
      });
    }

    const btnJson = document.getElementById('btn-download-json');
    const btnCsv = document.getElementById('btn-download-csv');
    const btnPrint = document.getElementById('btn-print-report');

    if (btnJson) {
      btnJson.addEventListener('click', () => this.downloadJsonData());
    }
    if (btnCsv) {
      btnCsv.addEventListener('click', () => this.downloadCsvData());
    }
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }
  }

  downloadJsonData() {
    const exportObject = {
      sistema: AMBIENTAL_DATA.meta,
      exportadoEm: new Date().toISOString(),
      indicadores: AMBIENTAL_DATA.indicadores
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vida-relatorio-ambiental-realengo-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast("Arquivo JSON gerado e pronto para download.");
  }

  downloadCsvData() {
    let csv = "ID;Categoria;Titulo;Valor;Unidade;Confiabilidade;FonteOficial;LinkFonte\n";
    AMBIENTAL_DATA.indicadores.forEach(i => {
      csv += `"${i.id}";"${i.categoria}";"${i.titulo}";"${i.valor}";"${i.unidade}";"${i.confiabilidade}";"${i.detalhes.fonteOficial}";"${i.detalhes.linkFonte}"\n`;
    });
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vida-indicadores-parque-realengo.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast("Arquivo CSV gerado com sucesso.");
  }

  // --- NOTIFICAÇÃO TOAST ---
  showToast(message) {
    let toast = document.getElementById('vida-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'vida-toast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-dot"></span><span>${message}</span>`;
    toast.classList.add('visible');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }

  // --- HELPERS VISUAIS E ÍCONES SVG ---
  getCategoryIcon(catId) {
    switch (catId) {
      case 'vegetacao':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-4 4.3a1 1 0 0 0 .8 1.7H10l-3 3.3a1 1 0 0 0 .7 1.7H8l-3 3.3a1 1 0 0 0 .7 1.7H12Z"/></svg>`;
      case 'agua':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`;
      case 'clima':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>`;
      case 'sustentabilidade':
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 5.2 8.27A1.79 1.79 0 0 1 5.2 6.5l3.9-6.73a1.83 1.83 0 0 1 1.556-.89H17"/><path d="m18 10 3-3-3-3"/></svg>`;
      default:
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`;
    }
  }

  getCategoryName(catId) {
    const c = AMBIENTAL_DATA.categorias.find(item => item.id === catId);
    return c ? c.nome : 'Geral';
  }
}

// Inicializa no DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.VidaApp = new VidaApp();
  window.VidaApp.init();
});
