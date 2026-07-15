import * as THREE from 'three';
import { nacaProfile } from '../lib/naca';

/* ────────────────────────────────────────────────────────────
   Constructores de geometría paramétrica de turbinas.
   Migrados de src/scene3d.js (versión estática) — misma lógica
   mecánica, materiales actualizados a la paleta pastel clara.
   ──────────────────────────────────────────────────────────── */

export const materials = {
  metal:   new THREE.MeshStandardMaterial({ color: 0xB9C4C0, roughness: 0.4, metalness: 0.55 }),
  metalDk: new THREE.MeshStandardMaterial({ color: 0x8A9490, roughness: 0.45, metalness: 0.5 }),
  blade:   new THREE.MeshStandardMaterial({ color: 0x7FB5A6, roughness: 0.35, metalness: 0.1, side: THREE.DoubleSide }),
  blade2:  new THREE.MeshStandardMaterial({ color: 0xE8935F, roughness: 0.35, metalness: 0.1, side: THREE.DoubleSide }),
  mast:    new THREE.MeshStandardMaterial({ color: 0xCBB994, roughness: 0.5, metalness: 0.35 }),
  bolt:    new THREE.MeshStandardMaterial({ color: 0x6E655A, roughness: 0.5, metalness: 0.5 }),
};

export function addLights(scene) {
  scene.add(new THREE.AmbientLight(0xfff6ea, 0.85));
  const d = new THREE.DirectionalLight(0xfff1da, 1.1);
  d.position.set(8, 16, 10);
  scene.add(d);
  const d2 = new THREE.DirectionalLight(0xcfe3ea, 0.45);
  d2.position.set(-8, -4, -6);
  scene.add(d2);
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function towerRadiusTop(H)  { return clamp(0.028 + Math.sqrt(H) * 0.017, 0.035, 0.42); }
function towerRadiusBase(H) { return towerRadiusTop(H) * 1.65; }
function bladeSpar(D)       { return clamp(0.02 + Math.sqrt(D) * 0.028, 0.03, 0.5); }
function hubRadius(D)       { return clamp(0.08 + Math.sqrt(D) * 0.045, 0.1, 0.7); }
function armRadius(D)       { return clamp(0.015 + Math.sqrt(D) * 0.012, 0.018, 0.16); }

function addBoltRing(parent, radius, count, boltSize, y = 0, axis = 'y') {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(boltSize, boltSize, boltSize * 1.4, 6), materials.bolt);
    if (axis === 'y') bolt.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
    else { bolt.rotation.x = Math.PI / 2; bolt.position.set(Math.cos(a) * radius, Math.sin(a) * radius, y); }
    parent.add(bolt);
  }
}

function addBaseFlange(group, H) {
  const rBase = towerRadiusBase(H);
  const flange = new THREE.Mesh(new THREE.CylinderGeometry(rBase * 1.9, rBase * 2.1, rBase * 0.5, 20), materials.metalDk);
  flange.position.y = rBase * 0.25;
  group.add(flange);
  addBoltRing(group, rBase * 1.75, 8, rBase * 0.18, rBase * 0.5);
}

/* Sección transversal real (perfil NACA de 4 dígitos) lofteada entre la
   raíz y la punta de la pala — sustituye la extrusión rectangular plana
   ("cubo") por una geometría aerodinámica de verdad.
   Convención local: X = cuerda (borde de ataque → borde de fuga),
   Y = envergadura (0 en raíz → length en punta), Z = espesor del perfil. */
function airfoilBladeGeo(length, rootChord, tipChord, thicknessMult = 1, code = '0018') {
  const segs = 16;
  const { upper, lower } = nacaProfile(code, segs);

  // Contorno cerrado del perfil: borde de ataque → fuga por el extradós,
  // y de vuelta por el intradós (sin duplicar los dos puntos compartidos).
  const loop = [...upper, ...lower.slice(1, -1).reverse()];
  const cnt = loop.length;
  const pivot = 0.32; // eje de paso ~1/3 de cuerda, donde se articula la pala

  const positions = [];
  const pushRing = (chord, spanY) => {
    for (let i = 0; i < cnt; i++) {
      const p = loop[i];
      positions.push((p.x - pivot) * chord, spanY, p.y * chord * thicknessMult);
    }
  };
  pushRing(rootChord, 0);
  pushRing(tipChord, length);

  const indices = [];
  for (let i = 0; i < cnt; i++) {
    const a = i, b = (i + 1) % cnt, aTop = a + cnt, bTop = b + cnt;
    indices.push(a, aTop, b, b, aTop, bTop);
  }

  // Tapas de raíz y punta (para que la pala quede cerrada/sólida).
  const rootCenter = positions.length / 3;
  positions.push(-pivot * rootChord * 0.15, 0, 0);
  for (let i = 0; i < cnt; i++) indices.push(rootCenter, i, (i + 1) % cnt);

  const tipCenter = positions.length / 3;
  positions.push(-pivot * tipChord * 0.15, length, 0);
  for (let i = 0; i < cnt; i++) indices.push(tipCenter, (i + 1) % cnt + cnt, i + cnt);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function spinRotor(rotor, speed) {
  if (!rotor) return;
  const axis = rotor.userData?.spinAxis === 'z' ? 'z' : 'y';
  rotor.rotation[axis] += speed;
}

export function buildHRotor(D, H, bladeThickMult = 1) {
  const group = new THREE.Group();
  const R = D / 2;
  const rTop = towerRadiusTop(H), rBase = towerRadiusBase(H);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBase, H, 16), materials.mast);
  mast.position.y = H / 2; group.add(mast);
  addBaseFlange(group, H);

  const rotor = new THREE.Group();
  rotor.position.y = H;
  rotor.userData.spinAxis = 'y';

  const spar = bladeSpar(D);
  const bladeLen = H * 0.62;
  // NACA 0018 simétrico: perfil típico de rotores de eje vertical (H-rotor/Darrieus).
  const bladeGeo = airfoilBladeGeo(bladeLen, spar * 2.2, spar * 1.3, clamp(bladeThickMult, 0.5, 3), '0018');

  const armR = armRadius(D);
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const pivot = new THREE.Group();
    pivot.position.set(Math.cos(angle) * R, -bladeLen / 2, Math.sin(angle) * R);
    pivot.rotation.y = -angle - Math.PI / 2;
    pivot.add(new THREE.Mesh(bladeGeo, materials.blade));
    rotor.add(pivot);

    ['top', 'bot'].forEach((p, j) => {
      const armGeo = new THREE.CylinderGeometry(armR, armR * 0.85, R, 8);
      armGeo.rotateZ(Math.PI / 2); armGeo.translate(R / 2, 0, 0);
      const arm = new THREE.Mesh(armGeo, materials.metal);
      arm.position.y = (j === 0 ? 1 : -1) * H * 0.19; arm.rotation.y = -angle;
      rotor.add(arm);
      const bracket = new THREE.Mesh(new THREE.SphereGeometry(armR * 1.3, 8, 6), materials.metalDk);
      bracket.position.set(Math.cos(angle) * R, (j === 0 ? 1 : -1) * H * 0.19, Math.sin(angle) * R);
      rotor.add(bracket);
    });
  }
  const hR = hubRadius(D) * 0.8;
  rotor.add(new THREE.Mesh(new THREE.CylinderGeometry(hR, hR, hR * 1.1, 16), materials.metalDk));
  addBoltRing(rotor, hR * 0.72, 6, hR * 0.16, hR * 0.58);
  group.add(rotor);
  return { group, rotor };
}

export function buildHAWT(D, H) {
  const group = new THREE.Group();
  const rTop = towerRadiusTop(H), rBase = towerRadiusBase(H);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBase, H, 18), materials.mast);
  mast.position.y = H / 2; group.add(mast);
  addBaseFlange(group, H);

  const R = D / 2;
  const nacelleLen = clamp(R * 0.55, 0.3, 3.2);
  const nacelleW = clamp(R * 0.22, 0.16, 1.1);

  const nacelle = new THREE.Mesh(new THREE.BoxGeometry(nacelleW, nacelleW * 0.95, nacelleLen), materials.metal);
  nacelle.position.set(0, H, -nacelleLen * 0.35);
  group.add(nacelle);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(nacelleW * 0.55, nacelleW * 0.9, 12), materials.metalDk);
  nose.rotation.x = -Math.PI / 2; nose.position.set(0, H, -nacelleLen * 0.35 - nacelleLen / 2);
  group.add(nose);

  const hub = new THREE.Group(); hub.position.set(0, H, -nacelleLen * 0.35 + nacelleLen / 2 + 0.05);
  hub.userData.spinAxis = 'z';
  const hR = hubRadius(D) * 0.55;
  hub.add(new THREE.Mesh(new THREE.SphereGeometry(hR, 14, 10), materials.metalDk));
  addBoltRing(hub, hR * 0.85, 6, hR * 0.14, 0, 'z');

  const spar = bladeSpar(D);
  const bladeLen = R * 0.94;
  // NACA 4412 cambrado: perfil de sustentación típico de palas de eje horizontal.
  const bladeGeo = airfoilBladeGeo(bladeLen, spar * 2.6, spar * 0.7, 1, '4412');
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const pivot = new THREE.Group();
    pivot.rotation.z = angle;
    const blade = new THREE.Mesh(bladeGeo, materials.blade);
    blade.position.y = hR * 0.6;
    blade.rotation.y = 0.16;
    pivot.add(blade);
    hub.add(pivot);
  }
  group.add(hub);
  return { group, rotor: hub };
}

export function buildDarrieus(R, H) {
  const group = new THREE.Group();
  const rTop = towerRadiusTop(H) * 0.75, rBase = towerRadiusBase(H) * 0.75;
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBase, H * 1.08, 16), materials.mast);
  mast.position.y = H * 0.54; group.add(mast);
  addBaseFlange(group, H * 0.85);

  const rotor = new THREE.Group(); rotor.position.y = H * 0.1;
  rotor.userData.spinAxis = 'y';
  const nBlade = 3;
  const tubeR = clamp(0.025 + Math.sqrt(R) * 0.02, 0.03, 0.24);

  for (let b = 0; b < nBlade; b++) {
    const baseAngle = (b / nBlade) * Math.PI * 2;
    const pts = [];
    const segs = 36;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs - 0.5;
      const y = t * H;
      const r = R * Math.cos(Math.PI * t);
      if (r <= 0.001) continue;
      pts.push(new THREE.Vector3(Math.cos(baseAngle) * r, y + H / 2, Math.sin(baseAngle) * r));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.TubeGeometry(curve, 40, tubeR, 8, false);
    rotor.add(new THREE.Mesh(tube, materials.blade));
    const capTop = new THREE.Mesh(new THREE.SphereGeometry(tubeR * 1.4, 8, 6), materials.metalDk);
    capTop.position.copy(pts[0]); rotor.add(capTop);
    const capBot = new THREE.Mesh(new THREE.SphereGeometry(tubeR * 1.4, 8, 6), materials.metalDk);
    capBot.position.copy(pts[pts.length - 1]); rotor.add(capBot);
  }
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(tubeR * 0.9, tubeR * 0.9, H * 1.02, 12), materials.mast);
  shaft.position.y = H * 0.1 + H / 2;
  rotor.add(shaft);
  for (let b = 0; b < nBlade; b++) {
    const angle = (b / nBlade) * Math.PI * 2;
    const armGeo = new THREE.CylinderGeometry(tubeR * 0.6, tubeR * 0.6, R, 8);
    armGeo.rotateZ(Math.PI / 2); armGeo.translate(R / 2, 0, 0);
    const arm = new THREE.Mesh(armGeo, materials.metal);
    arm.position.y = H / 2 + H * 0.1; arm.rotation.y = -angle;
    rotor.add(arm);
  }
  const hR = hubRadius(R * 2) * 0.55;
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(hR, hR, hR * 0.7, 14), materials.metalDk);
  hub.position.y = H / 2 + H * 0.1;
  rotor.add(hub);

  group.add(rotor);
  return { group, rotor };
}

export function buildSavonius(D, H) {
  const group = new THREE.Group();
  const rTop = towerRadiusTop(H) * 0.7, rBase = towerRadiusBase(H) * 0.7;
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBase, H * 1.15, 14), materials.mast);
  mast.position.y = H * 0.575; group.add(mast);
  addBaseFlange(group, H * 0.8);

  const rotor = new THREE.Group(); rotor.position.y = H * 0.15;
  rotor.userData.spinAxis = 'y';

  const r = D / 2 * 0.85;
  const gap = r * 0.32;
  const scoopGeo = new THREE.CylinderGeometry(r, r, H, 28, 1, true, 0, Math.PI);

  const scoopA = new THREE.Mesh(scoopGeo, materials.blade);
  scoopA.position.x = gap;
  scoopA.rotation.y = Math.PI * 0.5;
  rotor.add(scoopA);

  const scoopB = new THREE.Mesh(scoopGeo.clone(), materials.blade2);
  scoopB.position.x = -gap;
  scoopB.rotation.y = -Math.PI * 0.5;
  rotor.add(scoopB);

  const capThick = clamp(H * 0.035, 0.02, 0.25);
  const capGeo = new THREE.CylinderGeometry(r + gap * 1.15, r + gap * 1.15, capThick, 28);
  const capTop = new THREE.Mesh(capGeo, materials.metalDk); capTop.position.y = H / 2; rotor.add(capTop);
  const capBot = new THREE.Mesh(capGeo, materials.metalDk); capBot.position.y = -H / 2; rotor.add(capBot);
  addBoltRing(rotor, r + gap * 0.9, 8, capThick * 0.35, H / 2 + capThick * 0.6);
  addBoltRing(rotor, r + gap * 0.9, 8, capThick * 0.35, -H / 2 - capThick * 0.6);

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(rTop * 0.6, rTop * 0.6, H * 1.06, 12), materials.metal);
  rotor.add(shaft);

  group.add(rotor);
  return { group, rotor };
}

export const BUILDERS = {
  hrotor:   (D, H, thick = 1) => buildHRotor(D, H, thick),
  hawt:     (D, H) => buildHAWT(D, H),
  darrieus: (D, H) => buildDarrieus(D / 2, H),
  savonius: (D, H) => buildSavonius(D, H),
};

/* Cambia el color de las palas globalmente (todas las escenas comparten
   el material). Devuelve también el tono secundario para el Savonius. */
export function applyBladeColor(hex) {
  materials.blade.color.set(hex);
  const c2 = new THREE.Color(hex).multiplyScalar(0.82);
  materials.blade2.color.copy(c2);
}
