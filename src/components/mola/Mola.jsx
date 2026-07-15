/* Motivos decorativos originales inspirados en la técnica textil mola
   (aplicación inversa) de la costa Caribe — capas concéntricas, zigzags
   y siluetas simétricas, reinterpretados en paleta pastel para acompañar
   la identidad visual del sitio. No reproduce ninguna mola real. */

const PASTELS = ['#F2A6A1', '#F3C969', '#A6A6E0', '#7FB5A6', '#E8935F'];

/** Marco cuadrado de capas concéntricas, como el borde de una mola. */
export function MolaFrame({ size = 120, className = '' }) {
  const layers = [0, 1, 2, 3];
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} aria-hidden="true">
      {layers.map((i) => {
        const inset = i * 12;
        const s = 120 - inset * 2;
        return (
          <rect
            key={i}
            x={inset} y={inset} width={s} height={s}
            fill="none"
            stroke={PASTELS[i % PASTELS.length]}
            strokeWidth="3"
            strokeDasharray={i % 2 === 0 ? '0' : '6 4'}
            rx="6"
          />
        );
      })}
      <circle cx="60" cy="60" r="14" fill={PASTELS[4]} opacity="0.85" />
    </svg>
  );
}

/** Pájaro estilizado simétrico, motivo clásico de las molas guna,
    reinterpretado en trazo simple y colores pastel. */
export function MolaBird({ size = 90, color = '#F2A6A1', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 18 C42 30 30 34 18 34 C28 40 38 40 44 36 C40 48 30 54 16 58
           C30 60 42 56 48 48 C48 62 44 74 34 84 C48 80 56 68 58 52
           C64 68 74 78 88 82 C78 70 74 58 74 46 C82 50 90 48 96 42
           C84 40 76 34 72 26 C64 32 54 30 50 18 Z"
        fill={color}
        opacity="0.9"
      />
      <circle cx="50" cy="50" r="6" fill="#FBF7F0" />
    </svg>
  );
}

/** Franja divisoria en zigzag, típica de los bordes de mola. */
export function MolaZigzagDivider({ height = 28, className = '' }) {
  return (
    <svg width="100%" height={height} viewBox="0 0 400 28" preserveAspectRatio="none" className={className} aria-hidden="true">
      <polyline
        points="0,4 20,24 40,4 60,24 80,4 100,24 120,4 140,24 160,4 180,24 200,4 220,24 240,4 260,24 280,4 300,24 320,4 340,24 360,4 380,24 400,4"
        fill="none" stroke="#F3C969" strokeWidth="3"
      />
      <polyline
        points="0,24 20,4 40,24 60,4 80,24 100,4 120,24 140,4 160,24 180,4 200,24 220,4 240,24 260,4 280,24 300,4 320,24 340,4 360,24 380,4 400,24"
        fill="none" stroke="#7FB5A6" strokeWidth="3" opacity="0.75"
      />
    </svg>
  );
}

/** Rosetón central: anillos concéntricos + rayos, como el motivo solar
    de muchas molas. Usado como pieza decorativa grande de sección. */
export function MolaSun({ size = 160, className = '' }) {
  const rays = Array.from({ length: 16 });
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" className={className} aria-hidden="true">
      <circle cx="80" cy="80" r="70" fill="none" stroke="#A6A6E0" strokeWidth="2" opacity="0.5" />
      <circle cx="80" cy="80" r="56" fill="none" stroke="#F2A6A1" strokeWidth="3" strokeDasharray="5 5" />
      {rays.map((_, i) => {
        const a = (i / rays.length) * Math.PI * 2;
        const x1 = 80 + Math.cos(a) * 44, y1 = 80 + Math.sin(a) * 44;
        const x2 = 80 + Math.cos(a) * 62, y2 = 80 + Math.sin(a) * 62;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={PASTELS[i % PASTELS.length]} strokeWidth="4" strokeLinecap="round" />;
      })}
      <circle cx="80" cy="80" r="30" fill="#F3C969" opacity="0.9" />
      <circle cx="80" cy="80" r="14" fill="#FBF7F0" />
    </svg>
  );
}

export default MolaFrame;
