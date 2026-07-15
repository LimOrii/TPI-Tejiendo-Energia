import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Envuelve cualquier contenido y lo anima al entrar en el viewport. */
export default function Reveal({ children, y = 28, delay = 0, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1, y: 0, duration: 0.8, delay, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [y, delay]);

  return <div ref={ref} className={className}>{children}</div>;
}
