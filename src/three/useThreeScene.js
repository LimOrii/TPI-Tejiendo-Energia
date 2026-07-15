import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { addLights, spinRotor } from './turbineBuilders';

/**
 * Monta una escena Three.js dentro de containerRef y la mantiene viva
 * mientras el componente esté montado.
 *
 * El visualizador original no respondía al arrastre porque el renderer
 * se dimensionaba una sola vez con offsetWidth/offsetHeight leídos antes
 * de que el layout terminara de asentarse (con frecuencia 0×0 dentro de
 * un grid), y solo se recalculaba en el evento `resize` de window — que
 * nunca ocurre si el contenedor cambia de tamaño por CSS/flex en vez de
 * por el usuario redimensionando la ventana. Aquí se usa un
 * ResizeObserver que reajusta cámara y renderer cada vez que el
 * contenedor cambia de tamaño real, y OrbitControls queda con
 * enableRotate/zoom/pan explícitos y damping para un arrastre fluido.
 *
 * @param {React.RefObject<HTMLElement>} containerRef
 * @param {(params:object)=>{group:THREE.Object3D, rotor:THREE.Object3D}} buildFn
 * @param {object} initParams
 * @param {[number,number,number]} camPos
 * @param {boolean} spinning si el rotor debe animarse solo
 */
export function useThreeScene(containerRef, buildFn, initParams, camPos, spinning = true) {
  const apiRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let disposed = false;
    let frameId = null;
    let currentMesh = null;

    const scene = new THREE.Scene();
    addLights(scene);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 2000);
    camera.position.set(...camPos);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 0.5;
    controls.maxDistance = 500;
    controls.target.set(0, initParams.H || initParams.h || 2, 0);

    function sizeToContainer() {
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 280;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, true);
    }

    function rebuildMesh(params) {
      if (currentMesh) scene.remove(currentMesh.group);
      currentMesh = buildFn(params);
      scene.add(currentMesh.group);
      controls.target.set(0, (params.H || params.h || 2) * 0.5, 0);
      controls.update();
    }

    rebuildMesh(initParams);
    // El tamaño real del contenedor solo se conoce después del primer
    // paint del layout — se calcula en el próximo frame, no de inmediato.
    requestAnimationFrame(sizeToContainer);

    const resizeObserver = new ResizeObserver(() => sizeToContainer());
    resizeObserver.observe(container);

    function animate() {
      if (disposed) return;
      frameId = requestAnimationFrame(animate);
      controls.update();
      if (apiRef.current?.spinning && currentMesh?.rotor) {
        spinRotor(currentMesh.rotor, 0.014);
      }
      renderer.render(scene, camera);
    }
    animate();

    function exportSTL(filename = 'modelo-turbina.stl') {
      if (!currentMesh?.group) return;
      const exporter = new STLExporter();
      const stlString = exporter.parse(currentMesh.group, { binary: false });
      const blob = new Blob([stlString], { type: 'model/stl' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    const api = {
      spinning,
      setParams(params) { rebuildMesh(params); },
      setSpinning(v) { api.spinning = v; },
      exportSTLReady: true,
      exportSTL,
    };
    apiRef.current = api;

    return () => {
      disposed = true;
      if (frameId) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  return apiRef;
}
