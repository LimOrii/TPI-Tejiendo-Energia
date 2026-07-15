import Header from './components/layout/Header';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import ParallaxBand from './components/sections/ParallaxBand';
import Architecture from './components/sections/Architecture';
import Engineering from './components/sections/Engineering';
import WindResource from './components/sections/WindResource';
import Designer from './components/sections/Designer';
import Library from './components/sections/Library';
import Naca from './components/sections/Naca';
import Importer from './components/sections/Importer';
import References from './components/sections/References';
import Gallery from './components/sections/Gallery';

export default function App() {
  return (
    <main id="main-scroll">
      <div style={{ position: 'sticky', top: 0, zIndex: 40 }}>
        <Header />
        <Nav />
      </div>

      <Hero />

      <ParallaxBand eyebrow="Cómo funciona" title="Una mochila tejida de herramientas abiertas" tone="mint">
        Cada módulo de esta plataforma —recurso eólico, diseñador paramétrico, perfiles NACA,
        biblioteca 3D— es un hilo independiente que cualquier persona de la comunidad puede
        tomar, modificar y volver a tejer. No dependemos de una sola pieza de software cerrada:
        la fuerza está en la unión de partes simples, igual que en el tejido wayuu.
      </ParallaxBand>

      <div style={{ paddingBottom: 40 }}>
        <Architecture />
        <Engineering />
        <WindResource />

        <ParallaxBand eyebrow="Recurso real" title="El viento de Palomino, medido" tone="coral">
          Los datos de velocidad de viento, densidad del aire y distribución de Weibull provienen
          del Global Wind Atlas y se extrapolan a la altura de tu torre con la ley de Hellmann,
          la misma metodología usada en estudios de factibilidad reales bajo IEC 61400.
        </ParallaxBand>

        <Designer city="palomino" />
        <Library city="palomino" />
        <Naca />
        <Importer city="palomino" />
        <References />
        <Gallery />
      </div>

      <Footer />
    </main>
  );
}
