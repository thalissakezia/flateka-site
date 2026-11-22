import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const box = document.querySelector(".hero3d");
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (box) {
  const small = innerWidth < 760;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  box.append(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  const navy = new THREE.MeshPhysicalMaterial({ color: 0x102b4e, metalness: 0.2, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15 });
  const teal = new THREE.MeshPhysicalMaterial({ color: 0x078f86, metalness: 0.1, roughness: 0.2, clearcoat: 1 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: 1.2, roughness: 0.05, ior: 1.4 });
  const mint = new THREE.MeshPhysicalMaterial({ color: 0x5cc8be, roughness: 0.35, clearcoat: 0.6 });

  // símbolo </> em 3D: dois chevrons e uma barra
  const logo = new THREE.Group();
  const bar = (len, mat) => new THREE.Mesh(new RoundedBoxGeometry(len, 0.42, 0.42, 4, 0.2), mat);
  const chevron = (dir, mat) => {
    const g = new THREE.Group();
    const a = bar(1.9, mat), b = bar(1.9, mat);
    a.position.set(0, 0.62, 0); a.rotation.z = dir * Math.PI / 4;
    b.position.set(0, -0.62, 0); b.rotation.z = -dir * Math.PI / 4;
    g.add(a, b); return g;
  };
  const l = chevron(1, teal); l.position.x = -1.9;
  const r = chevron(-1, teal); r.position.x = 1.9;
  const s = bar(2.6, navy); s.rotation.z = Math.PI / 2.6;
  logo.add(l, r, s);
  logo.scale.setScalar(small ? 0.8 : 1);
  scene.add(logo);

  // formas flutuando em volta
  const shapes = [];
  const geos = [
    new THREE.IcosahedronGeometry(0.7, 0), new THREE.TorusGeometry(0.6, 0.22, 24, 64),
    new RoundedBoxGeometry(1, 1, 1, 4, 0.18), new THREE.SphereGeometry(0.55, 48, 48),
    new THREE.CapsuleGeometry(0.3, 0.8, 8, 24), new THREE.OctahedronGeometry(0.6),
  ];
  const mats = [navy, teal, glass, mint];
  const count = small ? 7 : 12;
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(geos[i % geos.length], mats[i % mats.length]);
    const a = (i / count) * Math.PI * 2;
    const rad = (small ? 3.4 : 4.6) + (i % 3) * 0.9;
    m.userData = { a, rad, y: Math.sin(i * 1.7) * 2.6, sp: 0.15 + (i % 4) * 0.05, rot: new THREE.Vector3(Math.random(), Math.random(), Math.random()) };
    m.scale.setScalar(0.6 + (i % 3) * 0.25);
    scene.add(m); shapes.push(m);
  }

  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 6, 8); scene.add(key);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const size = () => { const w = box.clientWidth, h = box.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  size(); new ResizeObserver(size).observe(box);

  let mx = 0, my = 0, tx = 0, ty = 0, drag = false, spin = 0, lastX = 0;
  addEventListener("pointermove", (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; if (drag) { spin += (e.clientX - lastX) * 0.01; lastX = e.clientX; } });
  box.addEventListener("pointerdown", (e) => { drag = true; lastX = e.clientX; box.classList.add("grab"); });
  addEventListener("pointerup", () => { drag = false; box.classList.remove("grab"); });

  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) requestAnimationFrame(loop); }).observe(box);
  const clock = new THREE.Clock();
  function loop() {
    if (!visible) return;
    const t = calm ? 0 : clock.getElapsedTime();
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    const sc = Math.min(1, scrollY / innerHeight);
    logo.rotation.y = mx * 0.9 + spin + Math.sin(t * 0.6) * 0.25 + sc * 1.5;
    logo.rotation.x = my * 0.6 + Math.sin(t * 0.4) * 0.1;
    logo.position.y = Math.sin(t * 0.8) * 0.15 - sc * 1.5;
    shapes.forEach((m) => {
      const u = m.userData, a = u.a + t * u.sp;
      m.position.set(Math.cos(a) * u.rad + mx * 1.2, u.y + Math.sin(t + u.a) * 0.4 - sc * 3, Math.sin(a) * u.rad * 0.6 - 2);
      m.rotation.x += u.rot.x * 0.01; m.rotation.y += u.rot.y * 0.01;
    });
    camera.position.x = mx * 1.5; camera.position.y = -my * 1.2;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    if (!calm) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  box.classList.add("on");
}
