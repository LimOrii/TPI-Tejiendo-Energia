import Reveal from '../Reveal';
import { MolaBird } from '../mola/Mola';

const SLOTS = [
  { src: '/images/palomino-sitio.jpg', caption: 'Sitio de instalación — Palomino' },
  { src: '/images/taller-comunitario.jpg', caption: 'Taller comunitario' },
  { src: '/images/prototipo-impreso.jpg', caption: 'Prototipo impreso' },
];

export default function Gallery() {
  return (
    <div id="galeria" className="wrap">
      <div className="section-label">Galería del proyecto</div>
      <Reveal>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 22, color: 'var(--primary-dark)', margin: '0 0 8px' }}>Palomino, La Guajira</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 560 }}>
                Espacio para fotos reales del proyecto: el sitio de instalación, el proceso de
                construcción comunitaria y los prototipos impresos.  <span className="mono">public/images/</span>.
              </p>
            </div>
            <MolaBird size={70} color="var(--secondary)" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {SLOTS.map((s) => (
              <div key={s.caption} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3', background: 'var(--bg-soft)', border: '1px dashed var(--card-border)' }}>
                <img
                  src={s.src} alt={s.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 10px',
                  background: 'rgba(251,247,240,.9)', fontSize: 11.5, color: 'var(--text)', fontWeight: 600,
                }}>
                  {s.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
