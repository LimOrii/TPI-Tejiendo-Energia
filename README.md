# Minga Caribe Wind — versión React + GSAP

Migración de la app estática (`index.html` + `scene3d.js` + `calculations.js`)
a un proyecto **React (Vite) + GSAP + Three.js**, seccionado por componentes.

## Qué cambió respecto a la versión estática

- **`src/main.jsx`** — punto de entrada, registra `<model-viewer>` y monta `<App/>`.
- **`src/App.jsx`** — arma la página componiendo cada sección.
- **`src/components/sections/*`** — cada bloque del sitio original (Hero,
  Arquitectura, Recurso eólico, Diseñador, Biblioteca 3D, NACA, Importador,
  Referencias, Galería) es ahora su propio archivo `.jsx`.
- **`src/components/layout/*`** — Header, Nav y Footer.
- **`src/components/mola/Mola.jsx`** — motivos decorativos originales
  inspirados en la técnica textil mola (marcos concéntricos, pájaro
  estilizado, zigzag, rosetón solar), en la nueva paleta pastel.
- **`src/components/Reveal.jsx`** — envoltura reutilizable que anima
  cualquier bloque al entrar en pantalla con GSAP + ScrollTrigger.
- **`src/three/turbineBuilders.js`** — la geometría paramétrica de las 4
  turbinas (HAWT, H-Rotor, Darrieus, Savonius), portada de `scene3d.js`.
- **`src/three/useThreeScene.js`** — hook de React que monta/limpia la
  escena Three.js correctamente.
- **`src/lib/calculations.js`** y **`src/lib/naca.js`** — la física
  (Betz, Weibull, Hellmann, perfiles NACA) como funciones puras sin DOM.

## El bug del visualizador que no se movía

En la versión estática, el `renderer` y la `cámara` se dimensionaban una
sola vez con `offsetWidth/offsetHeight`, leídos antes de que el layout
terminara de asentarse — con frecuencia el contenedor medía 0×0 en ese
instante. Solo se volvían a calcular en el evento `resize` de `window`,
que nunca se dispara si el contenedor cambia de tamaño por CSS/flex en
vez de por el usuario redimensionando la ventana. El resultado: el
canvas quedaba mal dimensionado y el mapeo de coordenadas del arrastre
de `OrbitControls` no coincidía con lo que se veía en pantalla, así que
"no se movía" al arrastrar.

`useThreeScene.js` lo resuelve con:
- Un `ResizeObserver` sobre el contenedor real (no `window`), que
  reajusta cámara y renderer cada vez que cambia el tamaño visible.
- Un primer ajuste en `requestAnimationFrame`, después de que el layout
  ya se asentó.
- `OrbitControls` con `enableRotate/zoom/pan` explícitos, damping, y
  `touch-action: none` en el CSS del contenedor para que el arrastre
  funcione también en móvil.
- Limpieza completa (`cancelAnimationFrame`, `dispose()`, remoción del
  `<canvas>`) al desmontar, para que React StrictMode no deje canvases
  duplicados compitiendo por los eventos del mouse.

## Identidad visual

Paleta clara / pastel en `src/styles/theme.css` — menta, coral, mostaza
y lavanda pastel sobre fondo crema, en vez del navy oscuro original.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

Coloca tu `.glb` de escenario en `public/models/escenario-hrotor.glb`
y tus fotos en `public/images/` (mismos nombres que usaba la versión
estática).

## Alcance de esta migración

Todas las secciones del sitio original están portadas y funcionando:
arquitectura, mapa + Weibull (Leaflet + Chart.js), diseñador paramétrico
3D, biblioteca de 4 turbinas con mini-visualizadores, generador de
perfiles NACA con exportación DXF, importador STL/GLB con estadísticas,
referencias y galería. El export a STL de las turbinas del diseñador
(que en la versión estática usaba `STLExporter`) no se portó todavía —
es la única pieza pendiente si la necesitas, se conecta fácil desde
`useThreeScene.js` reutilizando `STLExporter` de `three/examples/jsm`.
