import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxBand({ eyebrow, title, children, image, tone = 'mint' }) {
  const ref = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        backgroundPosition: '50% 30%',
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const tones = {
    mint: 'linear-gradient(160deg, rgba(127,181,166,.85), rgba(166,166,224,.75))',
    coral: 'linear-gradient(160deg, rgba(242,166,161,.85), rgba(243,201,105,.7))',
  };

  return (
    <section ref={ref} style={{ position: 'relative', overflow: 'hidden', minHeight: 220 }}>
      <div
        ref={bgRef}
        style={{
          position: 'absolute', inset: '-10% 0', backgroundImage: image ? `url('${image}')` : undefined,
          backgroundSize: 'cover', backgroundPosition: '50% 60%',
          background: image ? undefined : tones[tone],
        }}
      />
      <div style={{ position: 'relative', background: 'rgba(251,247,240,.62)', padding: '54px 24px' }}>
        <div className="wrap" style={{ maxWidth: 640 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            {eyebrow}
          </span>
          <h2 style={{ fontSize: 26, margin: '10px 0 12px', color: 'var(--text)' }}>{title}</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: 14 }}>{children}</p>
        </div>
      </div>
    </section>
  );
}
