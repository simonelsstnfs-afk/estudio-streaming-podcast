/* 
 * Studio Radar Canvas & Audio Console Engine
 * Cache-Buster: overhaul_1788449150
 */

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

  // Concentric polygon grids
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
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

  // Data fill polygon (Glowing studio cyan)
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
  fillGrad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
  fillGrad.addColorStop(1, 'rgba(6, 182, 212, 0.08)');
  ctx.fillStyle = fillGrad;
  ctx.fill();

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.4;
  ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Vertex points & mono labels
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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-radar]').forEach(el => {
    try {
      const metrics = JSON.parse(el.getAttribute('data-radar'));
      drawOscilloscopeRadar(el.id, metrics);
    } catch(e) {
      console.error(e);
    }
  });
});
