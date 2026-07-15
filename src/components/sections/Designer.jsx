import { useEffect, useRef, useState } from 'react';
import Reveal from '../Reveal';
import { useThreeScene } from '../../three/useThreeScene';
import { BUILDERS, applyBladeColor } from '../../three/turbineBuilders';
import { CITIES, windAtH, calcPowerFromD, calcAEP, fmtW, fmtAEP, windClass } from '../../lib/calculations';

const TYPES = [
  { key: 'hrotor', label: 'H-Rotor', cp: 0.30, cut: 3.0 },
  { key: 'hawt', label: 'HAWT', cp: 0.40, cut: 3.5 },
  { key: 'darrieus', label: 'Darrieus', cp: 0.35, cut: 3.5 },
  { key: 'savonius', label: 'Savonius', cp: 0.16, cut: 2.0 },
];

export default function Designer({ city = 'palomino' }) {
  const containerRef = useRef(null);
  const [type, setType] = useState('hrotor');
  const [D, setD] = useState(1.5);
  const [H, setH] = useState(12);
  const [thick, setThick] = useState(1);
  const [spinning, setSpinning] = useState(true);
  const [bladeColor, setBladeColor] = useState('#7FB5A6');

  const sceneApi = useThreeScene(
    containerRef,
    (p) => BUILDERS[p.type](p.D, p.H, p.thick),
    { D, H, thick, type },
    [8, 10, 12],
    true
  );

  // Re-render geometry whenever any parameter changes
  useEffect(() => {
    sceneApi.current?.setParams({ D, H, thick, type });
  }, [D, H, thick, type, sceneApi]);

  useEffect(() => {
    if (sceneApi.current) sceneApi.current.setSpinning(spinning);
  }, [spinning, sceneApi]);

  useEffect(() => {
    applyBladeColor(bladeColor);
  }, [bladeColor]);

  const t = TYPES.find((x) => x.key === type);
  const wd = windAtH(city, H);
  const wc = windClass(wd.ws);
  const P = calcPowerFromD(D, wd.ws, wd.rho, t.cp, t.cut);
  const aep = calcAEP(wd.A, wd.K, D, wd.rho, t.cp, t.cut);

  return (
    <div id="disenador" className="wrap">
      <div className="section-label">Diseñador paramétrico</div>
      <Reveal>
        <div className="card">
          <div className="grid-2">
            <div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {TYPES.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setType(opt.key)}
                    className="btn-sm"
                    style={{
                      padding: '8px 14px', fontSize: 12.5,
                      background: type === opt.key ? 'var(--primary)' : 'var(--card)',
                      color: type === opt.key ? '#fff' : 'var(--text)',
                      borderColor: type === opt.key ? 'var(--primary-dark)' : 'var(--card-border)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Diámetro del rotor: {D.toFixed(1)} m
              </label>
              <input type="range" min="0.4" max="6" step="0.1" value={D} onChange={(e) => setD(Number(e.target.value))} className="slider" style={{ marginBottom: 12 }} />

              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Altura de torre: {H.toFixed(1)} m
              </label>
              <input type="range" min="2" max="30" step="0.5" value={H} onChange={(e) => setH(Number(e.target.value))} className="slider" style={{ marginBottom: 12 }} />

              {type === 'hrotor' && (
                <>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    Grosor de pala: {thick.toFixed(1)}×
                  </label>
                  <input type="range" min="0.5" max="3" step="0.1" value={thick} onChange={(e) => setThick(Number(e.target.value))} className="slider" style={{ marginBottom: 12 }} />
                </>
              )}

              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Color de las palas
              </label>
              <div style={{ display: 'flex', gap: 8, margin: '6px 0 14px' }}>
                {['#7FB5A6', '#F2A6A1', '#F3C969', '#A6A6E0', '#E8935F'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBladeColor(c)}
                    aria-label={`color ${c}`}
                    style={{
                      width: 26, height: 26, borderRadius: '50%', background: c, cursor: 'pointer',
                      border: bladeColor === c ? '2px solid var(--text)' : '2px solid transparent',
                    }}
                  />
                ))}
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--muted)', marginBottom: 16 }}>
                <input type="checkbox" checked={spinning} onChange={(e) => setSpinning(e.target.checked)} />
                Rotor girando
              </label>

              <div className="card-sm">
                <div className="result-row"><span className="r-label">Recurso ({CITIES[city].name.split('—')[0].trim()})</span><span className={`badge ${wc.cls}`}>{wc.label}</span></div>
                <div className="result-row"><span className="r-label">Potencia estimada</span><span className="r-val">{fmtW(P)}</span></div>
                <div className="result-row"><span className="r-label">Energía anual (AEP)</span><span className="r-val">{fmtAEP(aep)}</span></div>
                <div className="result-row"><span className="r-label">Coeficiente de potencia (Cp)</span><span className="r-val">{t.cp.toFixed(2)}</span></div>
              </div>
            </div>

            <div>
              <div ref={containerRef} className="canvas3d" style={{ height: 420 }} />
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, textAlign: 'center' }}>
                Arrastra para orbitar · rueda del mouse para zoom
              </p>
              <button
                onClick={() => sceneApi.current?.exportSTL(`${type}-D${D.toFixed(1)}-H${H.toFixed(1)}.stl`)}
                className="btn-sm"
                style={{ display: 'block', margin: '10px auto 0', padding: '8px 16px' }}
              >
                Descargar STL
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
