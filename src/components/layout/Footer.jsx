import { MolaZigzagDivider } from '../mola/Mola';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-soft)', paddingTop: 0 }}>
      <MolaZigzagDivider />
      <div className="wrap" style={{ padding: '28px 24px 40px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
        Casa Cultural Minga Caribe — Diseñador Eólico Comunitario v0.5 — MIT License — Palomino, La Guajira<br />
        Datos: Global Wind Atlas 3.0 (DTU Wind Energy / World Bank) · Metodología: IEC 61400, Betz (1926), Manwell et al. (2009)<br />
        Repositorio abierto para que la comunidad itere el diseño — descarga los modelos STL y los archivos de configuración JSON
        <div style={{ marginTop: 14, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <span>Programado por <strong style={{ color: 'var(--text)' }}>Daniel Felipe Vargas Pulido</strong></span>
          <a href="https://github.com/TU-USUARIO" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary-dark)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.42.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" /></svg>
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
