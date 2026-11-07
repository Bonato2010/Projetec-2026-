/**
 * BIOINOVA — BIOTECNOLOGIA & SUSTENTABILIDADE
 * Script Oficial de Interatividade • Projetec 2026
 * Otimizado para Desempenho Máximo e Zero Dependências Externas
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Menu Mobile (Hambúrguer)
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fechar menu mobile ao clicar em qualquer link de navegação
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // 2. Header Fixo com Transição no Scroll
  const header = document.getElementById('header');
  const btnBackToTop = document.getElementById('btnBackToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Efeito vidro no header
    if (header) {
      if (scrollPos > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Visibilidade do botão Voltar ao Topo
    if (btnBackToTop) {
      if (scrollPos > 400) {
        btnBackToTop.classList.add('show');
      } else {
        btnBackToTop.classList.remove('show');
      }
    }
  }, { passive: true });

  // Ação do Botão Voltar ao Topo
  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Destaque Automático de Seção Ativa na Barra de Navegação (IntersectionObserver)
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // 4. Animação Suave dos Indicadores Numéricos (Stat Counters)
  const statCards = document.querySelectorAll('.stat-card');
  if ('IntersectionObserver' in window && statCards.length > 0) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numberEl = entry.target.querySelector('.stat-number');
          if (numberEl && !numberEl.classList.contains('counted')) {
            numberEl.classList.add('counted');
            animateCounter(numberEl);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statCards.forEach(card => statObserver.observe(card));
  }

  function animateCounter(el) {
    const rawTarget = el.getAttribute('data-target');
    if (!rawTarget) return;

    const target = parseInt(rawTarget, 10);
    const hasMinus = el.textContent.includes('-');
    const hasPercent = el.textContent.includes('%');
    const hasPlus = el.textContent.includes('+');

    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * target);

      let prefix = '';
      if (hasMinus) prefix = '-';
      else if (hasPlus) prefix = '+';

      let suffix = '';
      if (hasPercent) suffix = '%';

      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  console.log('🌱 BioInova carregado com sucesso — Biotecnologia & Sustentabilidade • Projetec 2026');
});
