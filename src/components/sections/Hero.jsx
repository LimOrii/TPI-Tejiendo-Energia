import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MolaSun } from '../mola/Mola';

export default function Hero() {
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current.children,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' }
      );
    }, textRef);
    return () => ctx.revert();
  }, []);

  return (
    <section style={{
      background: 'linear-gradient(160deg, #F7EFE0 0%, #EAF1EC 55%, #F3E9EE 100%)',
      padding: '56px 24px', position: 'relative', overflow: 'hidden',
    }}>
      <MolaSun size={220} className="hero-sun-decor" />
      <div className="wrap hero-grid" style={{
        display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'center', position: 'relative', zIndex: 1,
      }}>
        <div ref={textRef}>
          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14,
          }}>
            Casa Cultural Minga Caribe · Palomino, La Guajira
          </span>
          <h1 style={{ fontSize: 42, lineHeight: 1.15, color: 'var(--text)', margin: '0 0 18px' }}>
            Diseño e ingeniería<br />
            <span style={{ color: 'var(--primary-dark)' }}>al servicio del viento.</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 520, margin: '0 0 26px' }}>
            Herramienta comunitaria de código abierto para dimensionar, visualizar y fabricar
            turbinas eólicas adaptadas al recurso real de Palomino — desarrollada dentro del
            Trabajo de Grado de <strong>Daniel Felipe Vargas Pulido</strong>, Diseño Industrial
            e Ingeniería Electrónica, Universidad Nacional de Colombia.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#disenador" className="btn-primary" style={{ textDecoration: 'none' }}>Abrir el diseñador</a>
            <a href="#galeria" className="btn-sm" style={{ textDecoration: 'none' }}>Ver el proyecto</a>
          </div>
        </div>

        <div style={{
          aspectRatio: '4/3', background: 'rgba(255,255,255,.5)', border: '1px solid var(--card-border)',
          borderRadius: 18, overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-card)',
        }}>
          {/* model-viewer se registra globalmente en main.jsx */}
          <model-viewer
            src="/models/escenario-hrotor.glb"
            alt="Casa con turbina H-Rotor — Casa Cultural Minga Caribe"
            camera-controls
            auto-rotate
            auto-rotate-delay="1200"
            rotation-per-second="8deg"
            shadow-intensity="1"
            exposure="1.1"
            environment-image="neutral"
            style={{ width: '100%', height: '100%', '--poster-color': 'transparent' }}
          >
            <div slot="poster" style={{
              width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', gap: 6,
            }}>
              <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>Escenario 3D</span>
              <small>Coloca aquí models/escenario-hrotor.glb</small>
            </div>
          </model-viewer>
        </div>
      </div>

      <style>{`
        .hero-sun-decor { position: absolute; top: -40px; right: -40px; opacity: .5; }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .hero-grid > div:last-child { aspect-ratio: 16/10 !important; order: -1; }
        }
        @media (max-width: 640px) {
          .hero-sun-decor { width: 140px !important; height: 140px !important; top: -20px; right: -20px; }
        }
      `}</style>
    </section>
  );
}
