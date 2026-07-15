/* Datos GWA verificados, ley de Betz y distribución de Weibull.
   Lógica portada de js/calculations.js, sin acceso al DOM. */

export const CITIES = {
  palomino: {
    name: 'Palomino — La Guajira', lat: 11.2347, lon: -74.0347, zoom: 12,
    context: 'Costa del Mar Caribe. Vientos alisios NE persistentes. Excelente recurso para VAWT.',
    base: { h: 10, ws: 5.8, rho: 1.212, pd: 118, A: 6.52, K: 2.10 },
  },
  bogota: {
    name: 'Bogotá D.C. — Sabana', lat: 4.7110, lon: -74.0721, zoom: 11,
    context: 'Altitud 2600 m. Aire 26% menos denso. Cordillera bloquea el viento. Solo viable para Savonius en aplicaciones de muy baja potencia.',
    base: { h: 10, ws: 1.78, rho: 0.9017, pd: 5.4, A: 2.08, K: 1.82 },
  },
};

export const TURBINES = {
  hawt:     { cp: 0.40, cut: 3.5, name: 'HAWT 3 palas' },
  hrotor:   { cp: 0.30, cut: 3.0, name: 'H-Rotor' },
  darrieus: { cp: 0.35, cut: 3.5, name: 'Darrieus' },
  savonius: { cp: 0.16, cut: 2.0, name: 'Savonius' },
};

const ALPHA = 0.143;

export function windAtH(cityKey, h) {
  const b = CITIES[cityKey].base;
  const extrap = Math.abs(h - b.h) > 0.05;
  const factor = extrap ? Math.pow(h / b.h, ALPHA) : 1;
  return {
    ws: b.ws * factor, ws0: b.ws, h0: b.h, rho: b.rho,
    pd: b.pd * Math.pow(factor, 3), A: b.A * factor, K: b.K,
    extrap, factor,
  };
}

export function weibullPDF(v, A, K) {
  if (v <= 0) return 0;
  return (K / A) * Math.pow(v / A, K - 1) * Math.exp(-Math.pow(v / A, K));
}

export function calcDiameter(P_W, v, rho, cp) {
  if (v < 0.5) return null;
  return 2 * Math.sqrt(P_W / (0.5 * rho * v ** 3 * cp * Math.PI));
}

export function calcPowerFromD(D, v, rho, cp, cut) {
  if (v < cut) return 0;
  const area = Math.PI * (D / 2) ** 2;
  return 0.5 * rho * area * v ** 3 * cp;
}

export function calcAEP(A_w, K_w, D, rho, cp, cut) {
  const area = Math.PI * (D / 2) ** 2;
  let Pavg = 0;
  const steps = 2000, vmax = 25;
  for (let i = 0; i < steps; i++) {
    const v = (i + 0.5) * vmax / steps, dv = vmax / steps;
    const P = v >= cut ? 0.5 * rho * area * v ** 3 * cp : 0;
    Pavg += P * weibullPDF(v, A_w, K_w) * dv;
  }
  return Pavg * 8760 / 1000;
}

export function windClass(ws) {
  if (ws < 3.5) return { label: 'Insuficiente (<3.5 m/s)', cls: 'badge-red', viable: false };
  if (ws < 5.0) return { label: 'Bajo (3.5-5 m/s)', cls: 'badge-amber', viable: true };
  if (ws < 7.0) return { label: 'Moderado (5-7 m/s)', cls: 'badge-blue', viable: true };
  return { label: 'Excelente (>7 m/s)', cls: 'badge-green', viable: true };
}

export function fmtW(w) {
  if (w === null || Number.isNaN(w)) return '—';
  if (w >= 1000) return (w / 1000).toFixed(2) + ' kW';
  return w.toFixed(1) + ' W';
}

export function fmtAEP(kwh) {
  if (kwh === null || Number.isNaN(kwh)) return '—';
  if (kwh >= 1000) return (kwh / 1000).toFixed(2) + ' MWh';
  return kwh.toFixed(0) + ' kWh';
}
