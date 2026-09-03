/* 
 * ==============================================================================
 * ESTUDIO STREAMING & PODCAST PRO - ENGINE INTERACTIVO DE ESTUDIO (OVERHAUL TIER)
 * Características:
 *  1. Osciloscopio de Espectro Sonoro en Tiempo Real (Retina Canvas 60 FPS)
 *  2. Selector Dinámico de Presets de Emisión (Twitch, Podcast, Minimal)
 *  3. Radar de Laboratorio Poligonal 0-10
 *  4. Navegación Móvil Tipo Isla con Trampa Accesible (WCAG 2.1)
 *  5. Acordeón Interactivo de Dudas Frecuentes
 * ==============================================================================
 */

// 1. Osciloscopio de Espectro Sonoro en Tiempo Real
function initAudioSpectrum(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  let animationFrameId = null;
  let isVisible = true;
  let step = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize();

  // Desactivar animación cuando el usuario no la ve (Optimización de CPU/GPU)
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !animationFrameId) {
      render();
    }
  }, { threshold: 0.1 });
  observer.observe(canvas);

  function render() {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;
    ctx.clearRect(0, 0, w, h);

    const bars = Math.floor(w / 7);
    const barWidth = 3.5;
    const centerY = h / 2;

    step += 0.04;

    // Renderizado de barras ecualizadoras de alta precisión
    for (let i = 0; i < bars; i++) {
      const x = i * 7;
      const freq = (i / bars) * Math.PI * 4;
      const wave1 = Math.sin(freq + step) * 0.45;
      const wave2 = Math.cos(freq * 1.8 - step * 1.4) * 0.35;
      const noise = (Math.sin(i * 13.5 + step * 2) + 1) * 0.2;
      const amplitude = Math.max(0.08, Math.min(0.95, (wave1 + wave2 + noise) * 0.7 + 0.3));

      const barHeight = amplitude * (h * 0.78);
      const topY = centerY - barHeight / 2;

      // Degradado vertical de estudio broadcast
      const grad = ctx.createLinearGradient(0, topY, 0, topY + barHeight);
      grad.addColorStop(0, '#ff7a1a');
      grad.addColorStop(0.6, '#ff5500');
      grad.addColorStop(1, 'rgba(255, 85, 0, 0.2)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, topY, barWidth, barHeight, 2);
      } else {
        ctx.rect(x, topY, barWidth, barHeight);
      }
      ctx.fill();

      // Peak highlight dot
      if (amplitude > 0.65) {
        ctx.fillStyle = '#00e599';
        ctx.fillRect(x, topY - 2, barWidth, 1.5);
      }
    }

    // Actualización dinámica de telemetría si existe el contenedor
    const telemEl = document.getElementById('spectrum-live-db');
    if (telemEl && Math.random() < 0.08) {
      const db = (-12 + Math.sin(step) * 4.5).toFixed(1);
      telemEl.textContent = `${db} dBFS`;
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

// 2. Radar Canvas Renderer (Alta Fidelidad Retina)
function drawOscilloscopeRadar(canvasId, metrics) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.clientWidth || 320;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) - 44;

  const labels = Object.keys(metrics).map(k => k.replace(/_/g, ' ').toUpperCase());
  const values = Object.values(metrics);
  const count = values.length;
  const angleStep = (Math.PI * 2) / count;

  // Anillos concéntricos
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let level = 1; level <= 5; level++) {
    ctx.beginPath();
    const r = (radius / 5) * level;
    for (let i = 0; i < count; i++) {
      const angle = (i * angleStep) - (Math.PI / 2);
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Ejes radiales
  for (let i = 0; i < count; i++) {
    const angle = (i * angleStep) - (Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    ctx.stroke();
  }

  // Polígono de datos con resplandor cian de laboratorio
  ctx.beginPath();
  for (let i = 0; i < count; i++) {
    const val = values[i];
    const r = (radius * (val / 10));
    const angle = (i * angleStep) - (Math.PI / 2);
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  
  const fillGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
  fillGrad.addColorStop(0, 'rgba(255, 85, 0, 0.42)');
  fillGrad.addColorStop(1, 'rgba(255, 85, 0, 0.08)');
  ctx.fillStyle = fillGrad;
  ctx.fill();

  ctx.strokeStyle = '#ff5500';
  ctx.lineWidth = 2.4;
  ctx.shadowColor = 'rgba(255, 85, 0, 0.65)';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Vértices y etiquetas numéricas
  ctx.font = '600 10px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < count; i++) {
    const val = values[i];
    const r = (radius * (val / 10));
    const angle = (i * angleStep) - (Math.PI / 2);
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ff5500';
    ctx.fill();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const labelAngle = (i * angleStep) - (Math.PI / 2);
    const lx = centerX + (radius + 24) * Math.cos(labelAngle);
    const ly = centerY + (radius + 24) * Math.sin(labelAngle);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`${labels[i]} (${val})`, lx, ly);
  }
}

// Inicialización global
document.addEventListener('DOMContentLoaded', () => {
  // A. Espectro sonoro en cabecera
  initAudioSpectrum('studio-spectrum-canvas');

  // B. Selector interactivo de Presets de Estudio
  const presetPills = document.querySelectorAll('.preset-pill');
  const bentoCards = document.querySelectorAll('.bento-card-wrapper');

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const preset = pill.getAttribute('data-preset');
      const isAlreadyActive = pill.classList.contains('active');

      presetPills.forEach(p => p.classList.remove('active'));

      if (isAlreadyActive || preset === 'all') {
        bentoCards.forEach(card => card.classList.remove('highlight-preset'));
        if (!isAlreadyActive && preset === 'all') {
          pill.classList.add('active');
        }
        return;
      }

      pill.classList.add('active');

      bentoCards.forEach(card => {
        const cardPresets = card.getAttribute('data-presets') || '';
        if (cardPresets.includes(preset)) {
          card.classList.add('highlight-preset');
        } else {
          card.classList.remove('highlight-preset');
        }
      });
    });
  });

  // C. Render de Gráficos Radar
  document.querySelectorAll('[data-radar]').forEach(el => {
    try {
      const metrics = JSON.parse(el.getAttribute('data-radar'));
      drawOscilloscopeRadar(el.id, metrics);
    } catch(e) {
      console.error('Error parseando datos de radar:', e);
    }
  });

  // D. Navegación Móvil Accesible (Drawer Flotante)
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (navToggleBtn && mobileNav) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileNav.classList.contains('active');
      mobileNav.classList.toggle('active', isOpen);
      navToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggleBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    };

    navToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && !navToggleBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggleMenu(false);
        navToggleBtn.focus();
      }
    });
  }

  // E. Acordeón Interactivo de Dudas Frecuentes (FAQ)
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const targetId = trigger.getAttribute('aria-controls');
      const content = document.getElementById(targetId);

      faqTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherTargetId = otherTrigger.getAttribute('aria-controls');
          const otherContent = document.getElementById(otherTargetId);
          if (otherContent) otherContent.classList.remove('open');
        }
      });

      trigger.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      if (content) {
        content.classList.toggle('open', !isExpanded);
      }
    });
  });
});

// Portada editorial: menú, filtros de setup y acordeón de preguntas.
// Se mantiene separado de los componentes de fichas para no romper los radares existentes.
document.addEventListener('DOMContentLoaded', () => {
  const menuTrigger = document.getElementById('premium-menu-trigger');
  const mobileMenu = document.getElementById('premium-mobile-menu');

  if (menuTrigger && mobileMenu) {
    const setMenuOpen = (open) => {
      mobileMenu.hidden = !open;
      menuTrigger.setAttribute('aria-expanded', String(open));
      menuTrigger.querySelector('.sr-only').textContent = open ? 'Cerrar menú' : 'Abrir menú';
    };

    menuTrigger.addEventListener('click', () => {
      setMenuOpen(menuTrigger.getAttribute('aria-expanded') !== 'true');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileMenu.hidden) {
        setMenuOpen(false);
        menuTrigger.focus();
      }
    });
  }

  const setupFilters = document.querySelectorAll('[data-setup-filter]');
  const productCards = document.querySelectorAll('[data-setups]');

  setupFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const setup = filter.dataset.setupFilter;

      setupFilters.forEach((item) => {
        const isActive = item === filter;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      productCards.forEach((card) => {
        const matches = setup === 'all' || card.dataset.setups.split(' ').includes(setup);
        card.hidden = !matches;
      });
    });
  });

  const faqButtons = document.querySelectorAll('[data-faq-button]');
  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';

      faqButtons.forEach((item) => {
        const answer = document.getElementById(item.getAttribute('aria-controls'));
        const isCurrent = item === button;
        item.setAttribute('aria-expanded', String(isCurrent && !expanded));
        if (answer) answer.hidden = !isCurrent || expanded;
      });
    });
  });
});
