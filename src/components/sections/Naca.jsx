import { useEffect, useRef, useState } from 'react';
import Reveal from '../Reveal';
import { drawNACA, exportNacaDXF } from '../../lib/naca';

const PRESETS = ['0012', '0018', '4412', '6312'];

export default function Naca() {
  const canvasRef = useRef(null);
  const [camber, setCamber] = useState(0);
  const [pos, setPos] = useState(0);
  const [thickness, setThickness] = useState(12);

  const code = `${camber}${pos}${thickness.toString().padStart(2, '0')}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    function redraw() {
      const H = window.innerWidth < 640 ? 160 : 220;
      const W = canvas.clientWidth || 480;
      canvas.width = W; canvas.height = H;
      drawNACA(canvas.getContext('2d'), W, H, code);
    }
    redraw();
    window.addEventListener('resize', redraw);
    return () => window.removeEventListener('resize', redraw);
  }, [code]);

  function applyPreset(val) {
    setCamber(parseInt(val[0], 10));
    setPos(parseInt(val[1], 10));
    setThickness(parseInt(val.slice(2), 10));
  }

  return (
    <div id="naca" className="wrap">
      <div className="section-label">Perfiles NACA</div>
      <Reveal>
        <div className="card">
          <div className="grid-2">
            <div>
              <canvas ref={canvasRef} className="naca-canvas" style={{ width: '100%', borderRadius: 12, background: 'var(--bg-soft)' }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {PRESETS.map((p) => (
                  <button key={p} onClick={() => applyPreset(p)} className="btn-sm" style={{ padding: '8px 14px', fontSize: 12 }}>
                    NACA {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary-dark)', marginBottom: 14 }}>
                NACA {code}
              </div>

              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Camber máximo: {camber}%</label>
              <input type="range" min="0" max="9" value={camber} onChange={(e) => setCamber(Number(e.target.value))} className="slider" style={{ marginBottom: 12 }} />

              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Posición del camber: {pos * 10}%</label>
              <input type="range" min="0" max="9" value={pos} onChange={(e) => setPos(Number(e.target.value))} className="slider" style={{ marginBottom: 12 }} />

              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Espesor máximo: {thickness}%</label>
              <input type="range" min="6" max="24" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="slider" style={{ marginBottom: 16 }} />

              <div className="card-sm" style={{ marginBottom: 14 }}>
                <div className="result-row"><span className="r-label">Cl estimado</span><span className="r-val">~{(camber * 0.11 + 0.09 * thickness + 0.9).toFixed(2)}</span></div>
              </div>

              <button onClick={() => exportNacaDXF(code)} className="btn-primary" style={{ fontSize: 13 }}>
                Exportar DXF
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
