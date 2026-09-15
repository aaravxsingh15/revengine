// Real 3D rendering for a car once a .glb/.gltf model exists at the car's
// media.model3dUrl. Falls back to the existing 2D artwork (photo-or-SVG,
// same as every other car visual on the site) whenever no model is set, or
// if the model fails to load — a missing/broken .glb never breaks the page.
import * as THREE from "/vendor/three/three.module.js";
import { OrbitControls } from "/vendor/three/examples/controls/OrbitControls.js";
import { GLTFLoader } from "/vendor/three/examples/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  const media = document.getElementById("car-hero-media");
  if (!media) return;

  const modelUrl = media.dataset.modelUrl;
  if (!modelUrl) return; // no 3D model set — the server-rendered <img>/SVG fallback already covers this car

  const wrap = document.createElement("div");
  wrap.className = "car-3d-canvas-wrap";
  media.innerHTML = "";
  media.appendChild(wrap);

  const loaderEl = document.createElement("div");
  loaderEl.className = "car-3d-loader";
  loaderEl.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9"/></svg>`;
  wrap.appendChild(loaderEl);

  function showFallback() {
    media.innerHTML = "";
    const src = media.dataset.heroSrc;
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.className = "car-photo";
      img.style.position = "absolute";
      img.style.inset = "0";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.onerror = () => {
        media.innerHTML = window.renderCarSilhouette(media.dataset.bodyStyle);
      };
      media.appendChild(img);
    } else {
      media.innerHTML = window.renderCarSilhouette(media.dataset.bodyStyle);
    }
  }

  let renderer, scene, camera, controls, animId;

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(32, media.clientWidth / media.clientHeight, 0.1, 100);
    camera.position.set(4.5, 1.6, 4.5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(media.clientWidth, media.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    wrap.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(5, 8, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x88aaff, 0.6);
    rim.position.set(-5, 3, -5);
    scene.add(rim);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.1;
    controls.minDistance = 2.5;
    controls.maxDistance = 9;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 1.8;

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        loaderEl.remove();
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length() || 1;
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const scale = 3 / size;
        model.scale.setScalar(scale);
        scene.add(model);
      },
      undefined,
      (err) => {
        console.error("3D model failed to load, falling back to 2D artwork:", err);
        cleanup();
        showFallback();
      }
    );

    function animate() {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      if (!renderer) return;
      camera.aspect = media.clientWidth / media.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(media.clientWidth, media.clientHeight);
    }
    window.addEventListener("resize", onResize);

    function cleanup() {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (renderer) renderer.dispose();
    }
  } catch (err) {
    console.error("3D viewer failed to initialize, falling back to 2D artwork:", err);
    showFallback();
  }
});
