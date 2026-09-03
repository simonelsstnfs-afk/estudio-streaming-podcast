/* 
 * Radar Chart Canvas Engine & Interactive Logic
 * Cache-Buster: 20260903
 */

function drawRadarChart(canvasId, metrics) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.clientWidth || 300;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) - 40;
  
  const labels = Object.keys(metrics).map(k => k.replace(/_/g, ' ').toUpperCase());
  const values = Object.values(metrics);
  const count = values.length;
  const angleStep = (Math.PI * 2) / count;
  
  // Background concentric circles/webs
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
  
  // Radial spokes
  for (let i = 0; i < count; i++) {
    const angle = (i * angleStep) - (Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    ctx.stroke();
  }
  
  // Data Polygon
  ctx.beginPath();
  for (let i = 0; i < count; i++) {
    const val = values[i]; // 0 to 10
    const r = (radius * (val / 10));
    const angle = (i * angleStep) - (Math.PI / 2);
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(6, 182, 212, 0.28)';
  ctx.fill();
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  
  // Points & Labels
  ctx.fillStyle = '#f8fafc';
  ctx.font = '10px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  for (let i = 0; i < count; i++) {
    const val = values[i];
    const r = (radius * (val / 10));
    const angle = (i * angleStep) - (Math.PI / 2);
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    
    // Circle point
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Label
    const labelAngle = (i * angleStep) - (Math.PI / 2);
    const lx = centerX + (radius + 22) * Math.cos(labelAngle);
    const ly = centerY + (radius + 22) * Math.sin(labelAngle);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`${labels[i]} (${val})`, lx, ly);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-radar]').forEach(el => {
    try {
      const metrics = JSON.parse(el.getAttribute('data-radar'));
      drawRadarChart(el.id, metrics);
    } catch(e) {
      console.error('Radar parse error:', e);
    }
  });
});
