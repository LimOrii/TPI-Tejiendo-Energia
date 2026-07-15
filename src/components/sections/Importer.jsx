import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import Reveal from '../Reveal';
import { addLights } from '../../three/turbineBuilders';
import { windAtH, calcPowerFromD, fmtW } from '../../lib/calculations';

export default function Importer({ city = 'palomino' }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // One-time scene setup, mirrors useThreeScene but needs a dynamic loader step
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    let disposed = false, frameId = null, importedModel = null;

    const scene = new THREE.Scene();
    addLights(scene);
    scene.add(new THREE.GridHelper(6, 12, 0xcbb994, 0xe4ddc9).translateY(-0.01));

    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 2000);
    camera.position.set(3, 3, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    function sizeToContainer() {
      const w = container.clientWidth || 400, h = container.clientHeight || 360;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h, true);
    }
    requestAnimationFrame(sizeToContainer);
    const ro = new ResizeObserver(sizeToContainer);
    ro.observe(container);

    function animate() {
      if (disposed) return;
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    function loadFile(file) {
      const url = URL.createObjectURL(file);
      const ext = file.name.split('.').pop().toLowerCase();
      if (importedModel) scene.remove(importedModel);

      const onDone = (obj) => {
        importedModel = obj; scene.add(obj);
        const box = new THREE.Box3().setFromObject(obj);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxD = Math.max(size.x, size.y, size.z) || 1;
        camera.position.copy(center.clone().add(new THREE.Vector3(maxD * 1.5, maxD, maxD * 1.5)));
        controls.target.copy(center); controls.update();

        const D = Math.max(size.x, size.z);
        const wd = windAtH(city, 10);
        const P = calcPowerFromD(D, wd.ws, wd.rho, 0.30, 3.0);
        setStats({ x: size.x, y: size.y, z: size.z, area: (Math.PI * (D / 2) ** 2), power: fmtW(P) });
      };

      if (ext === 'stl') {
        new STLLoader().load(url, (geo) => {
          const mat = new THREE.MeshStandardMaterial({ color: 0xe8935f, roughness: 0.4 });
          const m = new THREE.Mesh(geo, mat);
          m.rotation.x = -Math.PI / 2;
          onDone(m);
        });
      } else {
        new GLTFLoader().load(url, (gltf) => onDone(gltf.scene));
      }
    }
    sceneRef.current = { loadFile };

    return () => {
      disposed = true;
      if (frameId) cancelAnimationFrame(frameId);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, [city]);

  function handleFiles(files) {
    if (files && files.length) sceneRef.current?.loadFile(files[0]);
  }

  return (
    <div id="importador" className="wrap">
      <div className="section-label">Sube tu modelo</div>
      <Reveal>
        <div className="card">
          <div className="grid-2">
            <div>
              <div
                onClick={() => document.getElementById('file-inp')?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--card-border)'}`,
                  borderRadius: 14, padding: '40px 20px', textAlign: 'center', cursor: 'pointer',
                  background: dragOver ? 'var(--bg-soft)' : 'transparent',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8, color: 'var(--muted)' }}>↑</div>
                <div style={{ fontWeight: 700, color: 'var(--primary-dark)', marginBottom: 4 }}>Arrastra o haz clic</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>.STL · .GLB · .GLTF</div>
                <input id="file-inp" type="file" accept=".stl,.glb,.gltf" hidden onChange={(e) => handleFiles(e.target.files)} />
              </div>

              {stats && (
                <div className="card-sm" style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Modelo importado</div>
                  <div className="result-row"><span className="r-label">Dimensión X</span><span className="r-val">{stats.x.toFixed(2)} m</span></div>
                  <div className="result-row"><span className="r-label">Dimensión Y</span><span className="r-val">{stats.y.toFixed(2)} m</span></div>
                  <div className="result-row"><span className="r-label">Dimensión Z</span><span className="r-val">{stats.z.toFixed(2)} m</span></div>
                  <div className="result-row"><span className="r-label">Área estimada</span><span className="r-val">{stats.area.toFixed(3)} m²</span></div>
                  <div className="result-row"><span className="r-label">Potencia estimada</span><span className="r-val">{stats.power}</span></div>
                </div>
              )}
            </div>
            <div ref={containerRef} className="canvas3d" style={{ height: 360 }} />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
