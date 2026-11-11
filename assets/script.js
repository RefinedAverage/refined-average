
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const canvas = document.querySelector('#world');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = window.matchMedia('(max-width: 800px)').matches;

const sceneNames = [
  'ORIGIN', 'PHILOSOPHY', 'THE PILLARS', 'THE METHOD',
  'PERSPECTIVE', 'THE LIBRARY', 'PRINCIPLES', 'NEXT'
];

const sceneLabel = document.querySelector('#scene-name');
const progress = document.querySelector('.progress span');

document.querySelector('#year').textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');

function closeMenu() {
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  const open = !menu.classList.contains('open');

  menu.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
});

menu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

let renderer, scene, camera, core, halo;
let shards = [];
let particles;
let webglReady = false;

try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !mobile,
    powerPreference: 'high-performance'
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.8)
  );

  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 0, 9);

  const ambient = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambient);

  const redLight = new THREE.PointLight(0xe21b23, 32, 18);
  redLight.position.set(3, 1, 4);
  scene.add(redLight);

  const whiteLight = new THREE.PointLight(0xbfc4cc, 18, 18);
  whiteLight.position.set(-4, 3, -2);
  scene.add(whiteLight);

  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.8, 5);
  const position = geometry.attributes.position;

  for (let i = 0; i < position.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(position, i);

    const noise =
      Math.sin(v.x * 4.1 + v.y * 2.8) *
      Math.cos(v.z * 3.2 - v.y * 1.7);

    v.multiplyScalar(1 + noise * 0.075);
    position.setXYZ(i, v.x, v.y, v.z);
  }

  geometry.computeVertexNormals();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x26292e,
    metalness: 0.78,
    roughness: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.16,
    wireframe: false
  });

  core = new THREE.Mesh(geometry, material);
  group.add(core);

  const wire = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0x8c171d,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    })
  );

  wire.scale.setScalar(1.008);
  group.add(wire);

  halo = new THREE.Mesh(
    new THREE.TorusGeometry(2.35, 0.009, 8, 180),
    new THREE.MeshBasicMaterial({
      color: 0xe21b23,
      transparent: true,
      opacity: 0.8
    })
  );

  halo.rotation.x = 0.9;
  group.add(halo);

  const shardGeo = new THREE.OctahedronGeometry(0.16, 0);

  for (let i = 0; i < (mobile ? 18 : 34); i++) {
    const m = new THREE.Mesh(
      shardGeo,
      new THREE.MeshStandardMaterial({
        color: i % 4 === 0 ? 0xe21b23 : 0x777d85,
        metalness: 0.7,
        roughness: 0.3,
        emissive: i % 4 === 0 ? 0x390508 : 0x000000
      })
    );

    const a = Math.random() * Math.PI * 2;
    const r = 2.8 + Math.random() * 2.3;

    m.position.set(
      Math.cos(a) * r,
      (Math.random() - 0.5) * 5,
      Math.sin(a) * r
    );

    m.rotation.set(
      Math.random() * 6,
      Math.random() * 6,
      Math.random() * 6
    );

    const s = 0.35 + Math.random() * 1.4;
    m.scale.setScalar(s);

    group.add(m);
    shards.push(m);
  }

  const count = mobile ? 550 : 1100;
  const pts = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = 3 + Math.random() * 8;
    const a = Math.random() * Math.PI * 2;

    pts[i * 3] = Math.cos(a) * r;
    pts[i * 3 + 1] = (Math.random() - 0.5) * 9;
    pts[i * 3 + 2] = Math.sin(a) * r - 2;
  }

  const pgeo = new THREE.BufferGeometry();
  pgeo.setAttribute(
    'position',
    new THREE.BufferAttribute(pts, 3)
  );

  particles = new THREE.Points(
    pgeo,
    new THREE.PointsMaterial({
      color: 0x999da4,
      size: 0.012,
      transparent: true,
      opacity: 0.55
    })
  );

  scene.add(particles);
  webglReady = true;

} catch (err) {
  console.warn('3D scene unavailable; CSS atmosphere remains active.', err);

  document.querySelector('.canvas-wrap').style.display = 'none';
}

let targetX = 0;
let targetY = 0;
let scrollP = 0;
let activeScene = 0;

window.addEventListener('pointermove', e => {
  if (mobile || reduceMotion) return;

  targetX = (e.clientX / window.innerWidth - 0.5) * 0.45;
  targetY = (e.clientY / window.innerHeight - 0.5) * 0.35;

}, { passive: true });

const sections = [
  ...document.querySelectorAll('.scene-section')
];

function updateScroll() {
  const max =
    document.documentElement.scrollHeight - window.innerHeight;

  scrollP = max > 0 ? window.scrollY / max : 0;

  progress.style.width = (scrollP * 100) + '%';

  let index = 0;

  sections.forEach((el, i) => {
    const rect = el.getBoundingClientRect();

    if (
      rect.top < window.innerHeight * 0.56 &&
      rect.bottom > window.innerHeight * 0.28
    ) {
      index = i;
    }
  });

  if (index !== activeScene) {
    activeScene = index;
    sceneLabel.textContent = sceneNames[index] || 'REFINE';
  }

  if (window.gsap && window.ScrollTrigger) {
    window.ScrollTrigger.update();
  }
}

window.addEventListener('scroll', updateScroll, {
  passive: true
});

window.addEventListener('resize', () => {
  if (!renderer || !camera) return;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight,
    false
  );

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.8)
  );

}, { passive: true });

function render() {
  requestAnimationFrame(render);

  if (!webglReady || !renderer) return;

  const t = performance.now() * 0.00025;
  const sectionIndex = scrollP * 7;

  const x =
    Math.sin(sectionIndex * 0.82) * 0.48 +
    targetX * 0.45;

  const y =
    Math.cos(sectionIndex * 0.6) * 0.35 +
    targetY * 0.45;

  const z = 8.7 - Math.sin(sectionIndex * 0.55) * 1.2;

  camera.position.x += (x - camera.position.x) * 0.035;
  camera.position.y += (y - camera.position.y) * 0.035;
  camera.position.z += (z - camera.position.z) * 0.035;

  camera.lookAt(0, 0, 0);

  core.rotation.x +=
    ((0.15 + sectionIndex * 0.16) - core.rotation.x) * 0.025;

  core.rotation.y +=
    ((t * 1.8 + sectionIndex * 0.32) - core.rotation.y) * 0.025;

  core.rotation.z +=
    ((Math.sin(sectionIndex * 0.4) * 0.35) - core.rotation.z) * 0.025;

  const scale = 1 + Math.sin(sectionIndex * 0.9) * 0.13;
  core.scale.setScalar(scale);

  halo.rotation.z = t * 0.7 + sectionIndex * 0.25;
  halo.rotation.x = 0.8 + Math.sin(sectionIndex * 0.6) * 0.2;
  halo.scale.setScalar(1 + Math.sin(sectionIndex * 0.7) * 0.08);

  shards.forEach((m, i) => {
    m.rotation.x += 0.0015 + (i % 4) * 0.0005;
    m.rotation.y += 0.002;
    m.position.y += Math.sin(t * 5 + i) * 0.0008;
  });

  particles.rotation.y = t * 0.12 + sectionIndex * 0.08;

  renderer.render(scene, camera);
}

if (!reduceMotion) {
  render();
} else if (webglReady) {
  renderer.render(scene, camera);
}

function initMotion() {
  if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-copy > *', {
    y: 38,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.2
  });

  gsap.utils.toArray('.scene-section').forEach(section => {
    const elements = section.querySelectorAll(
      '.section-index,.section-heading,.statement-content,' +
      '.method-intro,.method-step,.pillar,.library-layout,' +
      '.principles>div,.contact-inner'
    );

    if (!elements.length) return;

    gsap.from(elements, {
      y: 55,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',

      scrollTrigger: {
        trigger: section,
        start: 'top 72%',
        end: 'center 38%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  gsap.to('.hero-copy', {
    yPercent: -12,
    opacity: 0.35,
    ease: 'none',

    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.statement-content', {
    yPercent: -8,
    ease: 'none',

    scrollTrigger: {
      trigger: '.statement',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.video-orb', {
    rotation: 180,
    ease: 'none',

    scrollTrigger: {
      trigger: '.library',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}

if (document.readyState === 'complete') {
  initMotion();
} else {
  window.addEventListener('load', initMotion, { once: true });
}

updateScroll();
