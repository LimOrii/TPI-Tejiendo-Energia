import Reveal from '../Reveal';
import { MolaFrame } from '../mola/Mola';

const MODULES = [
  { code: 'GWA', label: 'Recurso eólico', color: 'var(--primary)' },
  { code: 'CALC', label: 'Motor de cálculo', color: 'var(--accent)' },
  { code: '3D', label: 'Visualizador', color: 'var(--quaternary)' },
  { code: 'NACA', label: 'Perfiles alares', color: 'var(--secondary)' },
  { code: 'IO', label: 'Import / Export', color: 'var(--tertiary)' },
];

export default function Architecture() {
  return (
    <div id="open-tool" className="wrap">
      <div className="section-label">Arquitectura de la herramienta</div>
      <Reveal>
        <div className="card">
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 320px' }}>
              <h2 className="font-display" style={{ fontSize: 22, color: 'var(--primary-dark)', margin: '0 0 8px' }}>
                Herramienta comunitaria de diseño eólico — Casa Cultural Minga Caribe
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 640 }}>
                Esta herramienta es software libre bajo licencia MIT. Cualquier comunidad puede usarla,
                modificarla y redistribuirla. Los cálculos se basan en datos reales del Global Wind Atlas
                y metodología IEC 61400. Cada módulo es independiente: puedes mejorar solo el que necesitas.
              </p>
            </div>
            <MolaFrame size={92} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {MODULES.map((m) => (
              <div key={m.code} className="card-sm" style={{ textAlign: 'center' }}>
                <div className="mono" style={{ fontWeight: 700, color: m.color, fontSize: 13, marginBottom: 6 }}>{m.code}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
