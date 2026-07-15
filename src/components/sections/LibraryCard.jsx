import { useEffect, useRef, useState } from 'react';
import { useThreeScene } from '../../three/useThreeScene';
import { BUILDERS } from '../../three/turbineBuilders';
import { windAtH, calcPowerFromD, calcAEP, fmtW, fmtAEP, windClass } from '../../lib/calculations';

export default function LibraryCard({ typeKey, label, cp, cut, camPos, defaultD, defaultH, city }) {
  const containerRef = useRef(null);
  const [D, setD] = useState(defaultD);
  const [H, setH] = useState(defaultH);

  const sceneApi = useThreeScene(
    containerRef,
    (p) => BUILDERS[typeKey](p.D, p.H),
    { D: defaultD, H: defaultH },
    camPos,
    true
  );

  useEffect(() => {
    sceneApi.current?.setParams({ D, H });
  }, [D, H, sceneApi]);

  const wd = windAtH(city, H);
  const wc = windClass(wd.ws);
  const P = calcPowerFromD(D, wd.ws, wd.rho, cp, cut);
  const aep = calcAEP(wd.A, wd.K, D, wd.rho, cp, cut);
  const started = wd.ws >= cut;

  return (
    <div className="card-sm">
      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary-dark)', marginBottom: 8 }}>{label}</div>
      <div ref={containerRef} className="canvas3d" style={{ height: 190, marginBottom: 10 }} />
      <button
        onClick={() => sceneApi.current?.exportSTL(`${typeKey}-D${D.toFixed(1)}-H${H.toFixed(1)}.stl`)}
        className="btn-sm"
        style={{ display: 'block', width: '100%', padding: '6px 10px', fontSize: 11.5, marginBottom: 10 }}
      >
        Descargar STL
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
        <div>
          <label style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>D: {D.toFixed(1)} m</label>
          <input type="range" min="0.3" max="4" step="0.1" value={D} onChange={(e) => setD(Number(e.target.value))} className="slider" />
        </div>
        <div>
          <label style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>H: {H.toFixed(1)} m</label>
          <input type="range" min="1" max="15" step="0.5" value={H} onChange={(e) => setH(Number(e.target.value))} className="slider" />
        </div>
      </div>

      {started ? (
        <>
          <div className="result-row"><span className="r-label">Potencia</span><span className="r-val">{fmtW(P)}</span></div>
          <div className="result-row"><span className="r-label">AEP</span><span className="r-val">{fmtAEP(aep)}</span></div>
        </>
      ) : (
        <div className="badge badge-red" style={{ marginTop: 6 }}>Sin arranque</div>
      )}
      {started && <span className={`badge ${wc.cls}`} style={{ marginTop: 4, display: 'inline-block' }}>{wc.label}</span>}
    </div>
  );
}
