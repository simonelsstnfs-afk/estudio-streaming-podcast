/* 
 * ==============================================================================
 * ESTUDIO STREAMING & PODCAST PRO — ENGINE INTERACTIVO DE ESTUDIO
 * Versión: High-End Agency Tier (2026)
 * Características: Radar Osciloscopio Canvas, Drawer Móvil Accesible, FAQ Accordion
 * ==============================================================================
 */

// Radar Canvas Renderer (Alta Fidelidad Retina)
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

  // Concentric polygon rings
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

  // Radial axes
  for (let i = 0; i < count; i++) {
    const angle = (i * angleStep) - (Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    ctx.stroke();
  }

  // Glowing telemetry polygon
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
  fillGrad.addColorStop(0, 'rgba(6, 182, 212, 0.38)');
  fillGrad.addColorStop(1, 'rgba(6, 182, 212, 0.06)');
  ctx.fillStyle = fillGrad;
  ctx.fill();

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.4;
  ctx.shadowColor = 'rgba(6, 182, 212, 0.65)';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Vertices and telemetry values
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
    ctx.fillStyle = '#06b6d4';
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
  // 1. Render de Gráficos Radar
  document.querySelectorAll('[data-radar]').forEach(el => {
    try {
      const metrics = JSON.parse(el.getAttribute('data-radar'));
      drawOscilloscopeRadar(el.id, metrics);
    } catch(e) {
      console.error('Error parseando datos de radar:', e);
    }
  });

  // 2. Navegación Móvil Accesible (Drawer Flotante)
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

    // Cerrar al hacer clic en cualquier enlace del menú móvil
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Cerrar al hacer clic fuera del drawer
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && !navToggleBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Cerrar con tecla Escape (WCAG A11y)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggleMenu(false);
        navToggleBtn.focus();
      }
    });
  }

  // 3. Acordeón Interactivo de Dudas Frecuentes (FAQ)
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const targetId = trigger.getAttribute('aria-controls');
      const content = document.getElementById(targetId);

      // Cerrar otros acordeones si se desea comportamiento exclusivo
      faqTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherTargetId = otherTrigger.getAttribute('aria-controls');
          const otherContent = document.getElementById(otherTargetId);
          if (otherContent) otherContent.classList.remove('open');
        }
      });

      // Alternar estado actual
      trigger.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      if (content) {
        content.classList.toggle('open', !isExpanded);
      }
    });
  });
});
