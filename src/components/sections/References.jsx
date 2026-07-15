import Reveal from '../Reveal';

const REFS = [
  { n: 1, title: 'Global Wind Atlas 3.0', body: 'DTU Wind Energy / World Bank Group. globalwindatlas.info — Wind-speed, air-density, power-density, Weibull A/K para Colombia a 10 m.' },
  { n: 2, title: 'Betz, A. (1926)', body: 'Windenergie und ihre Ausnutzung. Vandenhoeck & Ruprecht. Límite teórico Cp_max = 16/27 ≈ 0.593' },
  { n: 3, title: 'Manwell et al. (2009)', body: 'Wind Energy Explained (2ª ed.). Wiley. ISBN 978-0-470-01500-1. Capítulos 2 (recurso), 3 (aerodinámica), 5 (diseño del rotor).' },
  { n: 4, title: 'IEC 61400-1:2019', body: 'Wind energy generation systems — Design requirements. Perfil de viento: exponente de Hellmann α = 0.143 terreno abierto.' },
  { n: 5, title: 'IDEAM & UPME (2006)', body: 'Atlas de Viento y Energía Eólica de Colombia. Bogotá: IDEAM.' },
];

export default function References() {
  return (
    <div id="referencias" className="wrap">
      <div className="section-label">Referencias y APIs</div>
      <Reveal>
        <div className="card">
          <div className="grid-2">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 14 }}>
                Fuentes de datos y metodología
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {REFS.map((r) => (
                  <div key={r.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 12, background: 'var(--bg-soft)', borderRadius: 10 }}>
                    <span style={{
                      background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 22, height: 22,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0,
                    }}>{r.n}</span>
                    <div style={{ fontSize: 12.5, lineHeight: 1.6 }}>
                      <strong>{r.title}</strong> — {r.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 14 }}>
                Fórmulas
              </div>
              <div className="mono card-sm" style={{ fontSize: 12, lineHeight: 1.9, background: 'var(--bg-soft)', overflowWrap: 'break-word' }}>
                <span style={{ color: 'var(--muted)' }}>// 1. Extrapolación vertical (Hellmann / IEC 61400)</span><br />
                v(h) = v_ref · (h/h_ref)^α &nbsp; α=0.143 costa<br /><br />
                <span style={{ color: 'var(--muted)' }}>// 2. Extracción de potencia (Ley de Betz)</span><br />
                P = ½·ρ·A·v³·Cp &nbsp; Cp_max=0.593<br />
                <span style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>D = 2·√(P / (½·ρ·v³·Cp·π))</span><br /><br />
                <span style={{ color: 'var(--muted)' }}>// 3. Distribución Weibull</span><br />
                f(v) = (K/A)·(v/A)^(K-1)·exp(-(v/A)^K)<br /><br />
                <span style={{ color: 'var(--muted)' }}>// 4. Energía anual (AEP)</span><br />
                <span style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>AEP = 8760 · ∫₀²⁵ P(v)·f(v) dv</span> [kWh/a]
              </div>
              <div className="card-sm" style={{ marginTop: 12, background: '#EAF1F7', fontSize: 12, lineHeight: 1.6 }}>
                Los datos de viento para Palomino y Bogotá provienen de la API del Global Wind Atlas a 10 m
                de altura. Para otras alturas, la herramienta extrapola usando la ley de potencia de Hellmann.
                El código fuente completo está disponible bajo licencia MIT.
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
