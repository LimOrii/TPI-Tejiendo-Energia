import Reveal from '../Reveal';
import LibraryCard from './LibraryCard';

const CARDS = [
  { typeKey: 'hawt', label: 'HAWT', cp: 0.40, cut: 3.5, camPos: [5, 6, 8], defaultD: 2, defaultH: 10 },
  { typeKey: 'hrotor', label: 'H-Rotor', cp: 0.30, cut: 3.0, camPos: [4, 4, 6], defaultD: 1.5, defaultH: 2.5 },
  { typeKey: 'darrieus', label: 'Darrieus', cp: 0.35, cut: 3.5, camPos: [5, 3, 6], defaultD: 1.5, defaultH: 4 },
  { typeKey: 'savonius', label: 'Savonius', cp: 0.16, cut: 2.0, camPos: [3, 2, 3], defaultD: 0.8, defaultH: 1 },
];

export default function Library({ city = 'palomino' }) {
  return (
    <div id="biblioteca" className="wrap">
      <div className="section-label">Biblioteca 3D de turbinas</div>
      <Reveal>
        <div className="card">
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, maxWidth: 680 }}>
            Compara los cuatro tipos de turbina soportados. Cada tarjeta tiene su propio visualizador:
            ajusta diámetro y altura para ver cómo cambia la geometría y la potencia estimada con el
            recurso eólico actual.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
            {CARDS.map((c) => <LibraryCard key={c.typeKey} {...c} city={city} />)}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
