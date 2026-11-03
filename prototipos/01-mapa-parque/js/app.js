/**
 * PROJETO 01 — MAPA INTERATIVO DO PARQUE REALENGO
 * Controlador da Aplicação e Interface do Usuário
 */

class ParqueApp {
  constructor() {
    this.mapRenderer = null;
    this.currentCategory = 'todas';
  }

  init() {
    this.mapRenderer = new ParqueMapRenderer('park-map-canvas');
    this.renderCategoryPills();
    this.renderSidebarList();
    this.initControls();
    this.handleUrlParams();
  }

  renderCategoryPills() {
    const container = document.getElementById('map-category-pills');
    if (!container) return;

    let html = '';
    MAPA_PARQUE_DATA.categorias.forEach(cat => {
      const count = cat.id === 'todas'
        ? MAPA_PARQUE_DATA.pontos.length
        : MAPA_PARQUE_DATA.pontos.filter(p => p.categoria === cat.id).length;

      html += `
        <button class="pill-btn ${cat.id === this.currentCategory ? 'active' : ''}" data-cat="${cat.id}">
          <span>${cat.nome}</span>
          <span class="pill-count">${count}</span>
        </button>
      `;
    });
    container.innerHTML = html;

    container.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        this.setCategory(cat);
      });
    });
  }

  setCategory(cat) {
    this.currentCategory = cat;
    document.querySelectorAll('#map-category-pills .pill-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-cat') === cat);
    });
    if (this.mapRenderer) {
      this.mapRenderer.setFilter(cat);
    }
    this.renderSidebarList();
  }

  renderSidebarList() {
    const listContainer = document.getElementById('pois-list');
    if (!listContainer) return;

    let filtered = MAPA_PARQUE_DATA.pontos;
    if (this.currentCategory !== 'todas') {
      filtered = filtered.filter(p => p.categoria === this.currentCategory);
    }

    let html = '';
    filtered.forEach(poi => {
      html += `
        <div class="poi-item" data-id="${poi.id}">
          <div class="poi-item-header">
            <span class="poi-item-title">${poi.nome}</span>
            <span class="poi-cat-badge badge-${poi.categoria}">${poi.categoria}</span>
          </div>
          <p class="poi-item-desc">${poi.descricao.substring(0, 95)}...</p>
          <div class="poi-item-footer">
            <span class="poi-status">● ${poi.status}</span>
            <button class="btn-locate">Ver no Mapa ➔</button>
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;

    listContainer.querySelectorAll('.poi-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const poi = MAPA_PARQUE_DATA.pontos.find(p => p.id === id);
        if (poi && this.mapRenderer) {
          this.mapRenderer.selectPoi(poi);
        }
      });
    });
  }

  showPoiDetail(poi) {
    const drawer = document.getElementById('poi-drawer');
    if (!drawer) return;

    document.getElementById('drawer-title').innerText = poi.nome;
    document.getElementById('drawer-status').innerText = poi.status;
    document.getElementById('drawer-desc').innerText = poi.descricao;
    document.getElementById('drawer-access').innerText = poi.acessibilidade;

    const highlightsList = document.getElementById('drawer-highlights');
    if (highlightsList) {
      let hlHtml = '';
      poi.destaques.forEach(d => {
        hlHtml += `<li>✓ ${d}</li>`;
      });
      highlightsList.innerHTML = hlHtml;
    }

    drawer.classList.add('open');
  }

  closeDrawer() {
    const drawer = document.getElementById('poi-drawer');
    if (drawer) drawer.classList.remove('open');
  }

  initControls() {
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnReset = document.getElementById('btn-reset-map');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');

    if (btnZoomIn) btnZoomIn.addEventListener('click', () => this.mapRenderer && this.mapRenderer.zoomIn());
    if (btnZoomOut) btnZoomOut.addEventListener('click', () => this.mapRenderer && this.mapRenderer.zoomOut());
    if (btnReset) btnReset.addEventListener('click', () => this.mapRenderer && this.mapRenderer.resetView());
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => this.closeDrawer());
  }

  handleUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('poi')) {
        const poi = MAPA_PARQUE_DATA.pontos.find(p => p.id === params.get('poi'));
        if (poi) {
          setTimeout(() => {
            if (this.mapRenderer) this.mapRenderer.selectPoi(poi);
          }, 300);
        }
      }
      if (params.get('category')) {
        this.setCategory(params.get('category'));
      }
    } catch (e) {
      console.warn("URL params error:", e);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ParqueApp = new ParqueApp();
  window.ParqueApp.init();
});
