export default function Header() {
  return (
    <header className="site-header" style={{
      background: 'var(--card)',
      borderBottom: '2px solid var(--secondary)',
      padding: '14px 24px',
      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
    }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="18" cy="18" r="3" fill="var(--accent)" />
        <path d="M18 15 C17 6,14 1,17 -1 C20 -3,22 5,21 13Z" fill="var(--primary)" opacity=".9" />
        <path d="M18 21 C18 21,9 25,5 30 C2 34,7 40,12 36 C17 32,18 21,18 21Z" fill="var(--secondary)" opacity=".9" />
        <path d="M18 21 C18 21,27 15,34 9 C38 4,32 -2,26 4 C21 10,18 21,18 21Z" fill="var(--quaternary)" opacity=".8" />
        <rect x="16.5" y="21" width="3" height="13" fill="rgba(74,68,56,.35)" />
      </svg>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ color: 'var(--text)', fontWeight: 700, fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', margin: 0 }}>
          Diseñador Eólico Comunitario
        </h1>
        <p className="mono site-header-sub" style={{ color: 'var(--muted)', fontSize: 12, margin: '2px 0 0' }}>
          Casa Cultural Minga Caribe — Palomino, La Guajira — Herramienta de código abierto
        </p>
      </div>
      <div className="site-header-meta" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="badge badge-green">MIT</span>
        <span className="mono" style={{ color: 'var(--muted)', fontSize: 11 }}>GWA 3.0 + IEC 61400</span>
      </div>
    </header>
  );
}
