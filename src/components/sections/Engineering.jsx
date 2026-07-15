import Reveal from '../Reveal';

const TSR_RANGES = [
  { type: 'Savonius', tsr: '0.5 – 1.0', cpMax: '0.15 – 0.20', note: 'Arrastre puro, autoarranque, baja eficiencia' },
  { type: 'Darrieus / H-Rotor', tsr: '2 – 4.5', cpMax: '0.30 – 0.40', note: 'Sustentación, eje vertical, necesita arranque' },
  { type: 'HAWT 3 palas', tsr: '5 – 8', cpMax: '0.40 – 0.48', note: 'Sustentación, eje horizontal, el más eficiente' },
];

/* Curvas Cp–TSR ilustrativas (forma típica de la literatura, no datos de
   un ensayo real) para comparar visualmente el comportamiento de cada
   arquitectura de rotor a lo largo de su rango operativo. */
const CURVES = [
  { label: 'HAWT', color: 'var(--primary-dark)', pts: '10,150 40,120 75,70 110,40 140,32 165,45 185,80 200,120' },
  { label: 'Darrieus/H-Rotor', color: 'var(--accent)', pts: '10,150 45,140 85,105 115,75 140,68 165,85 190,120 205,145' },
  { label: 'Savonius', color: 'var(--quaternary)', pts: '10,150 35,142 60,132 85,128 110,132 140,145 170,155 205,163' },
];

export default function Engineering() {
  return (
    <div id="ingenieria" className="wrap">
      <div className="section-label">Ingeniería detrás de la herramienta</div>
      <Reveal>
        <div className="card">
          <div style={{ marginBottom: 22 }}>
            <h2 className="font-display" style={{ fontSize: 22, color: 'var(--primary-dark)', margin: '0 0 8px' }}>
              De la física del viento a la geometría del rotor
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 720 }}>
              Todo lo que ves en el diseñador y la biblioteca 3D sale de tres ideas de la
              aerodinámica de turbinas eólicas: cuánta energía puede extraerse del viento
              en teoría, qué tan rápido debe girar el rotor respecto al viento, y cómo esa
              relación define la forma de la pala.
            </p>
          </div>

          <div className="grid-2">
            <div>
              <div className="card-sm" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  1 · Límite de Betz
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.65, margin: '0 0 10px' }}>
                  Ningún rotor puede frenar el viento por completo —si lo hiciera, el aire
                  ya no podría salir por detrás y el flujo se detendría. Betz (1926) demostró
                  que la fracción máxima de energía cinética que un rotor ideal puede convertir
                  en energía mecánica es:
                </p>
                <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-dark)', textAlign: 'center', padding: '6px 0' }}>
                  Cp_max = 16/27 ≈ 0.593
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.65, margin: '10px 0 0' }}>
                  Las turbinas reales quedan por debajo de ese límite por pérdidas viscosas,
                  de punta de pala y de estela. Por eso el diseñador usa un Cp realista
                  (0.16 a 0.40 según el tipo) en vez del valor teórico.
                </p>
              </div>

              <div className="card-sm">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  2 · Relación de velocidad de punta (TSR / λ)
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.65, margin: '0 0 10px' }}>
                  Define qué tan rápido se mueve la punta de la pala en comparación con el
                  viento entrante. Un TSR bajo favorece el arranque; uno alto favorece la
                  eficiencia aerodinámica y exige perfiles con menos arrastre:
                </p>
                <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-dark)', textAlign: 'center', padding: '6px 0' }}>
                  λ = (ω · R) / v
                </div>
                <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: '8px 0 0' }}>
                  ω = velocidad angular (rad/s) · R = radio del rotor (m) · v = velocidad del viento (m/s)
                </p>
              </div>
            </div>

            <div>
              <div className="card-sm" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                  Curva Cp vs. TSR por arquitectura
                </div>
                <svg viewBox="0 0 220 170" style={{ width: '100%', height: 160 }}>
                  <line x1="10" y1="150" x2="210" y2="150" stroke="var(--card-border)" strokeWidth="1" />
                  <line x1="10" y1="10" x2="10" y2="150" stroke="var(--card-border)" strokeWidth="1" />
                  {CURVES.map((c) => (
                    <polyline key={c.label} points={c.pts} fill="none" stroke={c.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  ))}
                  <text x="12" y="10" fontSize="8" fill="var(--muted)">Cp</text>
                  <text x="192" y="163" fontSize="8" fill="var(--muted)">λ (TSR)</text>
                </svg>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 6 }}>
                  {CURVES.map((c) => (
                    <span key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
                      {c.label}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 8 }}>
                  Curvas ilustrativas basadas en la forma típica reportada en la literatura
                  (Manwell et al., 2009) — no son datos de un ensayo de túnel de viento.
                </p>
              </div>

              <div className="card-sm">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                  3 · De la curva a la pala
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
                    <thead>
                      <tr style={{ textAlign: 'left', color: 'var(--muted)' }}>
                        <th style={{ padding: '4px 6px' }}>Tipo</th>
                        <th style={{ padding: '4px 6px' }}>TSR óptimo</th>
                        <th style={{ padding: '4px 6px' }}>Cp máx.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TSR_RANGES.map((r) => (
                        <tr key={r.type} style={{ borderTop: '1px dashed var(--card-border)' }}>
                          <td style={{ padding: '6px 6px', fontWeight: 700 }}>{r.type}</td>
                          <td className="mono" style={{ padding: '6px 6px' }}>{r.tsr}</td>
                          <td className="mono" style={{ padding: '6px 6px' }}>{r.cpMax}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.6, marginTop: 10 }}>
                  Un TSR alto exige palas delgadas y esbeltas (perfiles NACA cambrados en
                  HAWT); un TSR bajo tolera perfiles más simétricos y gruesos (NACA 0018 en
                  H-rotor/Darrieus). Por eso el <strong>Diseñador</strong> y la <strong>Biblioteca 3D</strong> generan
                  cada geometría con el perfil correspondiente en vez de una forma genérica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
