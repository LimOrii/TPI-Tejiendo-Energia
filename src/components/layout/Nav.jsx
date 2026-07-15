const LINKS = [
  ['open-tool', 'Arquitectura'],
  ['ingenieria', 'Ingeniería'],
  ['recurso', 'Recurso eólico'],
  ['disenador', 'Diseñador'],
  ['biblioteca', 'Biblioteca 3D'],
  ['naca', 'Perfiles NACA'],
  ['importador', 'Sube tu modelo'],
  ['referencias', 'Referencias'],
  ['galeria', 'Galería'],
];

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Nav() {
  return (
    <nav className="site-nav" style={{ background: 'var(--bg-soft)', borderBottom: '1px solid var(--card-border)', overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: 2, padding: '0 16px', minWidth: 'max-content', alignItems: 'center' }}>
        {LINKS.map(([id, label]) => (
          <a key={id} className="nav-link" onClick={() => scrollToId(id)}>
            {label}
          </a>
        ))}
        <span className="mono nav-version" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)', padding: '0 8px' }}>
          v0.5 · MIT · React + GSAP
        </span>
      </div>
    </nav>
  );
}
