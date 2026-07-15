/* Generación de perfiles NACA de 4 dígitos, portado de js/calculations.js */

export function nacaProfile(code, n = 120) {
  const m = parseInt(code[0], 10) / 100;
  const p = parseInt(code[1], 10) / 10;
  const t = parseInt(code.slice(2), 10) / 100;
  const upper = [], lower = [];
  for (let i = 0; i <= n; i++) {
    const x = i / n;
    const yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1015 * x ** 4);
    let yc = 0, dyc = 0;
    if (m > 0) {
      if (x < p) { yc = (m / p / p) * (2 * p * x - x * x); dyc = (2 * m / p / p) * (p - x); }
      else { yc = (m / (1 - p) / (1 - p)) * ((1 - 2 * p) + 2 * p * x - x * x); dyc = (2 * m / (1 - p) / (1 - p)) * (p - x); }
    }
    const th = Math.atan(dyc);
    upper.push({ x: x - yt * Math.sin(th), y: yc + yt * Math.cos(th) });
    lower.push({ x: x + yt * Math.sin(th), y: yc - yt * Math.cos(th) });
  }
  return { upper, lower };
}

export function exportNacaDXF(code, chord_mm = 200) {
  const { upper, lower } = nacaProfile(code, 100);
  const pts = [...upper, ...lower.slice().reverse()];
  let dxf = '0\nSECTION\n2\nENTITIES\n0\nLWPOLYLINE\n8\nNACA_PROFILE\n90\n' + pts.length + '\n70\n1\n';
  for (const p of pts) {
    dxf += `10\n${(p.x * chord_mm).toFixed(4)}\n20\n${(p.y * chord_mm).toFixed(4)}\n`;
  }
  dxf += '0\nENDSEC\n0\nEOF\n';
  const blob = new Blob([dxf], { type: 'application/dxf' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `naca_${code}.dxf` });
  a.click();
  URL.revokeObjectURL(a.href);
}

export function drawNACA(ctx, W, H, code, { bg = '#FBF7F0', labels = true } = {}) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const { upper, lower } = nacaProfile(code);
  const pad = W * 0.1, cw = W - pad * 2, cy = H * 0.5;
  const tx = (x) => pad + x * cw;
  const ty = (y) => cy - y * cw;

  const m = parseInt(code[0], 10) / 100, p = parseInt(code[1], 10) / 10;
  if (m > 0) {
    ctx.beginPath(); ctx.strokeStyle = 'rgba(232,147,95,.6)'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      let yc = 0;
      if (x < p) yc = (m / p / p) * (2 * p * x - x * x); else yc = (m / (1 - p) / (1 - p)) * ((1 - 2 * p) + 2 * p * x - x * x);
      i === 0 ? ctx.moveTo(tx(x), ty(yc)) : ctx.lineTo(tx(x), ty(yc));
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  ctx.beginPath(); ctx.strokeStyle = 'rgba(74,68,56,.18)'; ctx.lineWidth = 1;
  ctx.moveTo(tx(0), ty(0)); ctx.lineTo(tx(1), ty(0)); ctx.stroke();

  ctx.beginPath();
  upper.forEach((pt, i) => (i === 0 ? ctx.moveTo(tx(pt.x), ty(pt.y)) : ctx.lineTo(tx(pt.x), ty(pt.y))));
  [...lower].reverse().forEach((pt) => ctx.lineTo(tx(pt.x), ty(pt.y)));
  ctx.closePath();
  ctx.fillStyle = 'rgba(127,181,166,.55)'; ctx.fill();
  ctx.strokeStyle = '#5D9385'; ctx.lineWidth = 1.5; ctx.stroke();

  if (labels) {
    ctx.fillStyle = '#8C8370'; ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillText('NACA ' + code, pad, 18);
    ctx.fillText('← cuerda →', tx(0.4), cy + 26);
  }
}
