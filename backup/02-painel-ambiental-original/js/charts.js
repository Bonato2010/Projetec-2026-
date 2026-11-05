/**
 * CENTRAL DE MONITORAMENTO AMBIENTAL V.I.D.A.
 * Módulo de Visualizações e Gráficos Interativos (SVG & Canvas)
 * Suporte nativo autônomo e de alta performance com temas claro/escuro.
 */

class VidaCharts {
  constructor() {
    this.theme = 'dark';
    this.chartInstances = {};
    this.initResizeListener();
  }

  setTheme(theme) {
    this.theme = theme;
    this.renderAllCharts();
  }

  initResizeListener() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.renderAllCharts();
      }, 250);
    });
  }

  renderAllCharts() {
    this.renderTemperaturaChart();
    this.renderPermeabilidadeChart();
    this.renderEspeciesDonut();
    this.renderOdsProgress();
  }

  /**
   * 1. Gráfico de Linhas: Curva Térmica Diária (Asfalto vs Parque vs Com Torres)
   */
  renderTemperaturaChart() {
    const container = document.getElementById('chart-temperatura');
    if (!container) return;

    const data = AMBIENTAL_DATA.seriesGraficos.temperaturaDiaria;
    const width = container.clientWidth || 600;
    const height = 280;
    const padding = { top: 30, right: 30, bottom: 40, left: 45 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minTemp = 22;
    const maxTemp = 45;

    const isDark = this.theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Coordenadas dos pontos
    const getX = (index) => padding.left + (index / (data.labels.length - 1)) * chartW;
    const getY = (temp) => padding.top + chartH - ((temp - minTemp) / (maxTemp - minTemp)) * chartH;

    // Constrói SVG
    let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" class="chart-svg" xmlns="http://www.w3.org/2000/svg">`;

    // Definição de Gradientes
    svg += `
      <defs>
        <linearGradient id="grad-asfalto" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="grad-parque" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="grad-nevoa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0"/>
        </linearGradient>
        <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#10b981" flood-opacity="0.5"/>
        </filter>
      </defs>
    `;

    // Linhas de Grade Horizontais
    const tempSteps = [25, 30, 35, 40, 45];
    tempSteps.forEach(temp => {
      const y = getY(temp);
      svg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${gridColor}" stroke-dasharray="3 3" />
        <text x="${padding.left - 8}" y="${y + 4}" fill="${textColor}" font-size="11" text-anchor="end" font-family="system-ui">${temp}°C</text>
      `;
    });

    // Rótulos do Eixo X (Horas)
    data.labels.forEach((label, i) => {
      const x = getX(i);
      svg += `
        <line x1="${x}" y1="${height - padding.bottom}" x2="${x}" y2="${height - padding.bottom + 4}" stroke="${gridColor}" />
        <text x="${x}" y="${height - padding.bottom + 18}" fill="${textColor}" font-size="11" text-anchor="middle" font-family="system-ui">${label}</text>
      `;
    });

    // Renderiza cada Dataset (Área + Linha + Pontos Interativos)
    const datasets = data.datasets;

    datasets.forEach((ds, dsIndex) => {
      const gradId = dsIndex === 0 ? 'grad-asfalto' : (dsIndex === 1 ? 'grad-parque' : 'grad-nevoa');
      let pathD = '';
      let areaD = '';

      ds.dados.forEach((val, i) => {
        const x = getX(i);
        const y = getY(val);
        if (i === 0) {
          pathD += `M ${x} ${y}`;
          areaD += `M ${x} ${height - padding.bottom} L ${x} ${y}`;
        } else {
          // Curva Bezier suave
          const prevX = getX(i - 1);
          const prevY = getY(ds.dados[i - 1]);
          const cpX1 = prevX + (x - prevX) / 2;
          const cpY1 = prevY;
          const cpX2 = prevX + (x - prevX) / 2;
          const cpY2 = y;
          pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
          areaD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
        }

        if (i === ds.dados.length - 1) {
          areaD += ` L ${x} ${height - padding.bottom} Z`;
        }
      });

      // Área preenchida com gradiente
      svg += `<path d="${areaD}" fill="url(#${gradId})" />`;

      // Linha do traçado
      svg += `<path d="${pathD}" fill="none" stroke="${ds.cor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`;

      // Pontos nos vértices
      ds.dados.forEach((val, i) => {
        const x = getX(i);
        const y = getY(val);
        svg += `
          <circle cx="${x}" cy="${y}" r="3.5" fill="${ds.cor}" stroke="${isDark ? '#0f172a' : '#ffffff'}" stroke-width="2" class="chart-point" data-label="${ds.label}" data-hora="${data.labels[i]}" data-val="${val}°C">
            <title>${ds.label}: ${val}°C às ${data.labels[i]}</title>
          </circle>
        `;
      });
    });

    // Marcador de destaque às 14h (Pico de Calor / Diferencial de 9.6°C)
    const peakIndex = 7; // 14h
    const peakX = getX(peakIndex);
    svg += `
      <line x1="${peakX}" y1="${padding.top}" x2="${peakX}" y2="${height - padding.bottom}" stroke="rgba(255, 255, 255, 0.25)" stroke-dasharray="2 2" />
      <rect x="${peakX - 45}" y="${padding.top - 20}" width="90" height="20" rx="4" fill="${isDark ? '#1e293b' : '#ffffff'}" stroke="#10b981" stroke-width="1"/>
      <text x="${peakX}" y="${padding.top - 6}" fill="#10b981" font-size="10.5" font-weight="bold" text-anchor="middle" font-family="system-ui">Δ -9,6°C às 14h</text>
    `;

    svg += `</svg>`;
    container.innerHTML = svg;
    this.attachSvgTooltips(container);
  }

  /**
   * 2. Gráfico de Barras: Comparativo de Permeabilidade e Escoamento Superficial
   */
  renderPermeabilidadeChart() {
    const container = document.getElementById('chart-permeabilidade');
    if (!container) return;

    const data = AMBIENTAL_DATA.seriesGraficos.escoamentoPluvial;
    const width = container.clientWidth || 500;
    const height = 260;
    const padding = { top: 35, right: 25, bottom: 45, left: 45 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const isDark = this.theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" class="chart-svg" xmlns="http://www.w3.org/2000/svg">`;

    // Linhas de Grade
    [0, 25, 50, 75, 100].forEach(val => {
      const y = padding.top + chartH - (val / 100) * chartH;
      svg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${gridColor}" stroke-dasharray="2 2" />
        <text x="${padding.left - 8}" y="${y + 4}" fill="${textColor}" font-size="10.5" text-anchor="end" font-family="system-ui">${val}%</text>
      `;
    });

    const numGroups = data.labels.length;
    const groupW = chartW / numGroups;
    const barW = Math.min(32, groupW * 0.35);

    data.labels.forEach((label, i) => {
      const groupCenterX = padding.left + i * groupW + groupW / 2;

      // Barra 1: Permeabilidade (Verde Esmeralda)
      const permVal = data.dadosPermeabilidade[i];
      const permH = (permVal / 100) * chartH;
      const permX = groupCenterX - barW - 4;
      const permY = padding.top + chartH - permH;

      // Barra 2: Escoamento / Enxurrada (Coral / Rose)
      const escoVal = data.dadosEscoamento[i];
      const escoH = (escoVal / 100) * chartH;
      const escoX = groupCenterX + 4;
      const escoY = padding.top + chartH - escoH;

      svg += `
        <!-- Barra Permeabilidade -->
        <rect x="${permX}" y="${permY}" width="${barW}" height="${permH}" rx="4" fill="#10b981" opacity="0.9" class="chart-bar">
          <title>${label} - Solo Permeável: ${permVal}%</title>
        </rect>
        <text x="${permX + barW / 2}" y="${permY - 6}" fill="#10b981" font-size="10.5" font-weight="bold" text-anchor="middle" font-family="system-ui">${permVal}%</text>

        <!-- Barra Escoamento -->
        <rect x="${escoX}" y="${escoY}" width="${barW}" height="${escoH}" rx="4" fill="#f43f5e" opacity="0.8" class="chart-bar">
          <title>${label} - Escoamento Superficial (Enxurrada): ${escoVal}%</title>
        </rect>
        <text x="${escoX + barW / 2}" y="${escoY - 6}" fill="#f43f5e" font-size="10.5" font-weight="bold" text-anchor="middle" font-family="system-ui">${escoVal}%</text>

        <!-- Rótulo do Eixo X -->
        <text x="${groupCenterX}" y="${height - padding.bottom + 18}" fill="${textColor}" font-size="11" font-weight="500" text-anchor="middle" font-family="system-ui">${label}</text>
      `;
    });

    svg += `</svg>`;
    container.innerHTML = svg;
    this.attachSvgTooltips(container);
  }

  /**
   * 3. Gráfico Circular (Donut): Distribuição das 3.700 Árvores por Espécie
   */
  renderEspeciesDonut() {
    const container = document.getElementById('chart-especies-donut');
    if (!container) return;

    const data = AMBIENTAL_DATA.seriesGraficos.distribuicaoArvores;
    const width = container.clientWidth || 320;
    const height = 240;
    const cx = width / 2;
    const cy = height / 2 - 5;
    const radius = Math.min(width, height) * 0.38;
    const innerRadius = radius * 0.65;

    const total = data.quantidades.reduce((a, b) => a + b, 0);
    let startAngle = -Math.PI / 2;

    let svg = `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" class="chart-svg" xmlns="http://www.w3.org/2000/svg">`;

    data.quantidades.forEach((qtd, i) => {
      const sliceAngle = (qtd / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);

      const ix1 = cx + innerRadius * Math.cos(startAngle);
      const iy1 = cy + innerRadius * Math.sin(startAngle);
      const ix2 = cx + innerRadius * Math.cos(endAngle);
      const iy2 = cy + innerRadius * Math.sin(endAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      const pathData = `
        M ${ix1} ${iy1}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        L ${ix2} ${iy2}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}
        Z
      `;

      svg += `
        <path d="${pathData}" fill="${data.cores[i]}" stroke="${this.theme === 'dark' ? '#0f172a' : '#ffffff'}" stroke-width="2" class="chart-donut-slice">
          <title>${data.labels[i]}: ${qtd} árvores (${Math.round((qtd / total) * 100)}%)</title>
        </path>
      `;

      startAngle = endAngle;
    });

    // Centro do Donut com total
    const isDark = this.theme === 'dark';
    svg += `
      <circle cx="${cx}" cy="${cy}" r="${innerRadius - 4}" fill="${isDark ? '#0f172a' : '#ffffff'}" />
      <text x="${cx}" y="${cy - 4}" fill="${isDark ? '#f8fafc' : '#0f172a'}" font-size="20" font-weight="800" text-anchor="middle" font-family="system-ui">3.700</text>
      <text x="${cx}" y="${cy + 14}" fill="${isDark ? '#94a3b8' : '#64748b'}" font-size="10.5" text-anchor="middle" font-family="system-ui">Mudas Nativas</text>
    `;

    svg += `</svg>`;
    container.innerHTML = svg;
    this.renderDonutLegend(data);
  }

  renderDonutLegend(data) {
    const legendContainer = document.getElementById('donut-legend');
    if (!legendContainer) return;

    const total = data.quantidades.reduce((a, b) => a + b, 0);
    let html = '<div class="legend-grid">';
    data.labels.forEach((label, i) => {
      const qtd = data.quantidades[i];
      const pct = Math.round((qtd / total) * 100);
      html += `
        <div class="legend-item">
          <span class="legend-color-dot" style="background-color: ${data.cores[i]}"></span>
          <span class="legend-label">${label}</span>
          <span class="legend-val"><strong>${qtd}</strong> (${pct}%)</span>
        </div>
      `;
    });
    html += '</div>';
    legendContainer.innerHTML = html;
  }

  /**
   * 4. Indicador de Metas ODS: Barras de Progresso Circular & Horizontal
   */
  renderOdsProgress() {
    const container = document.getElementById('chart-ods-progress');
    if (!container) return;

    const data = AMBIENTAL_DATA.seriesGraficos.odsRadar;
    const isDark = this.theme === 'dark';

    let html = `<div class="ods-progress-container">`;
    data.labels.forEach((label, i) => {
      const score = data.pontuacoes[i];
      const barColor = score >= 90 ? '#10b981' : (score >= 85 ? '#84cc16' : '#06b6d4');
      html += `
        <div class="ods-bar-item">
          <div class="ods-bar-header">
            <span class="ods-bar-title">${label}</span>
            <span class="ods-bar-score" style="color: ${barColor}">${score}%</span>
          </div>
          <div class="ods-progress-track">
            <div class="ods-progress-fill" style="width: ${score}%; background: linear-gradient(90deg, #10b981, ${barColor});"></div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
  }

  attachSvgTooltips(container) {
    // Adiciona feedback interativo sutil ao passar o mouse
    const points = container.querySelectorAll('.chart-point, .chart-bar, .chart-donut-slice');
    points.forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        el.style.opacity = '1';
        el.style.cursor = 'pointer';
      });
      el.addEventListener('mouseleave', () => {
        el.style.opacity = '';
      });
    });
  }
}

// Export global instance
window.VidaCharts = new VidaCharts();
