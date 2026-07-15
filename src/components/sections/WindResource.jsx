import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Chart from 'chart.js/auto';
import Reveal from '../Reveal';
import { CITIES, windAtH, windClass, weibullPDF } from '../../lib/calculations';

export default function WindResource() {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const chartCanvasRef = useRef(null);
  const chartRef = useRef(null);

  const [city, setCity] = useState('palomino');
  const [height, setHeight] = useState(10);

  // Init map once
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;
    const c = CITIES.palomino;
    const map = L.map(mapDivRef.current).setView([c.lat, c.lon], c.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 18,
    }).addTo(map);
    const icon = L.divIcon({
      className: '', iconAnchor: [8, 8],
      html: '<div style="width:16px;height:16px;background:#E8935F;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.25)"></div>',
    });
    const marker = L.marker([c.lat, c.lon], { icon }).addTo(map);
    marker.bindPopup(`<strong>${c.name}</strong>`).openPopup();
    mapRef.current = map;
    markerRef.current = marker;

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Update map + chart on city/height change
  useEffect(() => {
    const c = CITIES[city];
    if (mapRef.current) {
      mapRef.current.setView([c.lat, c.lon], c.zoom, { animate: true });
      markerRef.current.setLatLng([c.lat, c.lon]);
      markerRef.current.setPopupContent(`<strong>${c.name}</strong><br><span style="font-family:monospace;font-size:11px">${c.lat} N · ${Math.abs(c.lon)} O</span>`);
    }

    const wd = windAtH(city, height);
    const step = 0.25, vmax = Math.max(18, wd.ws * 2.8);
    const labels = [], vals = [], colors = [];
    for (let v = 0; v <= vmax; v += step) {
      labels.push(v.toFixed(1));
      vals.push(weibullPDF(v, wd.A, wd.K));
      colors.push(v >= 3.5 && v <= 25 ? 'rgba(127,181,166,.75)' : 'rgba(227,134,134,.4)');
    }

    if (chartRef.current) chartRef.current.destroy();
    if (chartCanvasRef.current) {
      chartRef.current = new Chart(chartCanvasRef.current, {
        type: 'bar',
        data: { labels, datasets: [{ data: vals, backgroundColor: colors, borderWidth: 0, barPercentage: 1, categoryPercentage: 1 }] },
        options: {
          responsive: true, maintainAspectRatio: false, animation: { duration: 200 },
          plugins: { legend: { display: false }, tooltip: { callbacks: { title: (i) => `v = ${i[0].label} m/s`, label: (i) => `f(v) = ${i.raw.toFixed(5)}` } } },
          scales: {
            x: { ticks: { maxTicksLimit: 8, font: { size: 9 }, callback: (v, i) => { const n = parseFloat(labels[i]); return Number.isInteger(n) ? n : ''; } }, grid: { color: 'rgba(74,68,56,.05)' } },
            y: { ticks: { font: { size: 9 } }, grid: { color: 'rgba(74,68,56,.05)' } },
          },
        },
      });
    }
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, height]);

  const wd = windAtH(city, height);
  const wc = windClass(wd.ws);

  return (
    <div id="recurso" className="wrap">
      <div className="section-label">Recurso eólico</div>
      <Reveal>
        <div className="card">
          <div className="grid-2">
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {Object.entries(CITIES).map(([key, c]) => (
                  <button
                    key={key}
                    onClick={() => setCity(key)}
                    className="btn-sm"
                    style={{
                      flex: 1, textAlign: 'left', borderColor: city === key ? 'var(--primary-dark)' : 'var(--card-border)',
                      background: city === key ? 'var(--primary)' : 'var(--card)',
                      color: city === key ? '#fff' : 'var(--text)',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{c.name}</div>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>
                {CITIES[city].context}
              </p>
              <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Altura de análisis: {height} m
              </label>
              <input
                type="range" min="2" max="40" step="1" value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="slider"
                style={{ marginBottom: 14 }}
              />
              <div className="card-sm">
                <div className="result-row"><span className="r-label">Velocidad de viento</span><span className="r-val">{wd.ws.toFixed(2)} m/s</span></div>
                <div className="result-row"><span className="r-label">Densidad del aire</span><span className="r-val">{wd.rho.toFixed(4)} kg/m³</span></div>
                <div className="result-row"><span className="r-label">Weibull A / K</span><span className="r-val">{wd.A.toFixed(2)} / {wd.K.toFixed(2)}</span></div>
                <div className="result-row">
                  <span className="r-label">Clasificación</span>
                  <span className={`badge ${wc.cls}`}>{wc.label}</span>
                </div>
              </div>
              <p className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 8 }}>
                {wd.extrap ? `Extrapolado desde ${wd.h0}m (GWA) con factor ${wd.factor.toFixed(3)} (Hellmann α=0.143)` : 'Datos directos GWA 3.0'}
              </p>
              <div className="wind-chart" style={{ marginTop: 14 }}>
                <canvas ref={chartCanvasRef} />
              </div>
            </div>
            <div ref={mapDivRef} className="wind-map" style={{ borderRadius: 12, overflow: 'hidden' }} />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
