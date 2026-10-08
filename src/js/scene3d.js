/**
 * Shiv Restaurant — Immersive 3D WebGL Experience
 * Three.js Luxury Culinary Scene with Scroll Choreography & Atmospheric Particles
 * Vanilla JavaScript (ES Module)
 */

import * as THREE_LOCAL from 'three';
import { MENU_ITEMS } from './menu-data.js';

// Support both CDN window.THREE and bundled three module
const THREE = (typeof window !== 'undefined' && window.THREE) ? window.THREE : THREE_LOCAL;

export class Scene3D {
  constructor(containerId) {
    const el = document.getElementById(containerId);
    if (!el) {
      throw new Error(`Container #${containerId} not found`);
    }
    this.container = el;
    this.clock = new THREE.Clock();
    this.textureLoader = new THREE.TextureLoader();

    // Scene variables
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.emberParticles = null;
    this.emberGeo = null;
    this.steamParticles = null;
    this.steamGeo = null;
    this.centerpieceGroup = null;
    this.mainPlatter = null;
    this.dishDisplayDisc = null;
    this.filigreeRing1 = null;
    this.filigreeRing2 = null;
    this.filigreeRing3 = null;
    this.spiceOrbs = [];

    // Lighting
    this.keySpotlight = null;
    this.fillLight = null;
    this.rimLight = null;
    this.ambientLight = null;
    this.dishAuraLight = null;

    // Textures cache
    this.dishTextures = new Map();

    // Interaction & Choreography
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.dragPrevX = 0;
    this.dragVelocity = 0;
    this.userRotationY = 0;
    this.isReducedMotion = false;
    this.isVisible = true;
    this.isInitialized = false;
    this.currentActiveDishId = 'kadai-paneer';

    // Check reduced motion
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
    });

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070709);
    this.scene.fog = new THREE.FogExp2(0x070709, 0.032);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(0, 1.2, 6.8);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Build 3D objects & atmosphere
    this.setupLights();
    this.buildCenterpiece();
    this.buildEmberParticles();
    this.buildSteamParticles();

    // 5. Preload dish textures for seamless switching
    this.preloadDishTextures();

    // 6. Bind events
    this.bindEvents();

    this.isInitialized = true;
    this.animate();
  }

  setupLights() {
    // Soft deep ambient foundation
    this.ambientLight = new THREE.AmbientLight(0x23180d, 1.2);
    this.scene.add(this.ambientLight);

    // Main Warm Amber Spotlight (Key Light)
    this.keySpotlight = new THREE.SpotLight(0xffb84d, 5.5);
    this.keySpotlight.position.set(2.5, 6.0, 4.0);
    this.keySpotlight.angle = Math.PI / 4.5;
    this.keySpotlight.penumbra = 0.8;
    this.keySpotlight.decay = 1.6;
    this.keySpotlight.distance = 25;
    this.keySpotlight.castShadow = true;
    this.keySpotlight.shadow.mapSize.width = 1024;
    this.keySpotlight.shadow.mapSize.height = 1024;
    this.keySpotlight.shadow.camera.near = 1;
    this.keySpotlight.shadow.camera.far = 15;
    this.scene.add(this.keySpotlight);

    // Warm Orange Fill Light
    this.fillLight = new THREE.PointLight(0xd97706, 2.8, 18);
    this.fillLight.position.set(-3.5, 1.8, 3.0);
    this.scene.add(this.fillLight);

    // Champagne Gold Rim Highlight Light
    this.rimLight = new THREE.PointLight(0xffe6a3, 3.2, 15);
    this.rimLight.position.set(0, 4.0, -4.5);
    this.scene.add(this.rimLight);

    // Dish Internal Aura Light (changes color with active dish)
    this.dishAuraLight = new THREE.PointLight(0xe58e26, 2.2, 5.0);
    this.dishAuraLight.position.set(0, 0.4, 0);
    this.scene.add(this.dishAuraLight);
  }

  buildCenterpiece() {
    this.centerpieceGroup = new THREE.Group();
    this.centerpieceGroup.position.set(0, -0.2, 0);

    // Brushed Brass Indian Thali Foundation
    const platterGeo = new THREE.CylinderGeometry(2.2, 2.05, 0.14, 64);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.26
    });
    this.mainPlatter = new THREE.Mesh(platterGeo, goldMaterial);
    this.mainPlatter.receiveShadow = true;
    this.mainPlatter.castShadow = true;
    this.centerpieceGroup.add(this.mainPlatter);

    // Raised Outer Rim of Thali
    const rimGeo = new THREE.TorusGeometry(2.18, 0.08, 24, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xf3e5ab,
      metalness: 0.92,
      roughness: 0.22
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.07;
    this.centerpieceGroup.add(rimMesh);

    // Concentric Filigree Ring 1 (Inner Rotating)
    const ring1Geo = new THREE.TorusGeometry(2.6, 0.02, 16, 72);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xdfaa35,
      metalness: 0.95,
      roughness: 0.2
    });
    this.filigreeRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.filigreeRing1.rotation.x = Math.PI / 2.2;
    this.centerpieceGroup.add(this.filigreeRing1);

    // Concentric Filigree Ring 2 (Middle Orbiting)
    const ring2Geo = new THREE.TorusGeometry(3.1, 0.025, 16, 80);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xc59f3c,
      metalness: 0.9,
      roughness: 0.3
    });
    this.filigreeRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.filigreeRing2.rotation.x = Math.PI / 1.85;
    this.filigreeRing2.rotation.y = Math.PI / 6;
    this.centerpieceGroup.add(this.filigreeRing2);

    // Concentric Filigree Ring 3 (Outer Regal Aura)
    const ring3Geo = new THREE.TorusGeometry(3.6, 0.015, 16, 96);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xaa8230,
      metalness: 0.85,
      roughness: 0.35,
      transparent: true,
      opacity: 0.75
    });
    this.filigreeRing3 = new THREE.Mesh(ring3Geo, ring3Mat);
    this.filigreeRing3.rotation.x = Math.PI / 2.05;
    this.centerpieceGroup.add(this.filigreeRing3);

    // Central Culinary Presentation Disc
    const discGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.06, 64);
    const initialCanvas = this.createDishCanvas('Kadai Paneer', 0xe58e26);
    const initialTexture = new THREE.CanvasTexture(initialCanvas);
    if (THREE.sRGBEncoding) initialTexture.encoding = THREE.sRGBEncoding;

    const discMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x221810, metalness: 0.8, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ 
        map: initialTexture, 
        metalness: 0.1, 
        roughness: 0.6,
        bumpScale: 0.02
      }),
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.5 })
    ];

    this.dishDisplayDisc = new THREE.Mesh(discGeo, discMaterials);
    this.dishDisplayDisc.position.y = 0.1;
    this.dishDisplayDisc.receiveShadow = true;
    this.dishDisplayDisc.castShadow = true;
    this.centerpieceGroup.add(this.dishDisplayDisc);

    // Floating Spice Orbs
    const orbColors = [0xf59e0b, 0xd97706, 0xfbbf24, 0xef4444, 0x10b981];
    for (let i = 0; i < 5; i++) {
      const orbGeo = new THREE.SphereGeometry(0.08 + (i % 3) * 0.02, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({
        color: orbColors[i],
        emissive: orbColors[i],
        emissiveIntensity: 0.45,
        metalness: 0.5,
        roughness: 0.3
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.userData = {
        radius: 2.4 + (i * 0.25),
        angle: (i / 5) * Math.PI * 2,
        speed: 0.35 + (i * 0.08),
        yOffset: 0.2 + (i % 2) * 0.3
      };
      this.centerpieceGroup.add(orb);
      this.spiceOrbs.push(orb);
    }

    this.scene.add(this.centerpieceGroup);
  }

  createDishCanvas(name, accentColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rich dark charcoal / slate stoneware base
    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 250);
    grad.addColorStop(0, '#2d1f14');
    grad.addColorStop(0.5, '#19130f');
    grad.addColorStop(0.9, '#0d0a08');
    grad.addColorStop(1, '#050403');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(256, 256, 256, 0, Math.PI * 2);
    ctx.fill();

    // Golden spice ring ornament
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 256, 235, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 256, 220, 0, Math.PI * 2);
    ctx.stroke();

    // Central saffron / golden gravy pool
    const curryGrad = ctx.createRadialGradient(256, 256, 20, 256, 256, 170);
    const hex = '#' + accentColor.toString(16).padStart(6, '0');
    curryGrad.addColorStop(0, '#fff2c2');
    curryGrad.addColorStop(0.3, hex);
    curryGrad.addColorStop(0.75, '#5c2c06');
    curryGrad.addColorStop(1, 'rgba(30, 15, 5, 0)');
    ctx.fillStyle = curryGrad;
    ctx.beginPath();
    ctx.arc(256, 256, 170, 0, Math.PI * 2);
    ctx.fill();

    // Handcrafted artisanal spice speckles
    ctx.fillStyle = '#fef08a';
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * 120;
      ctx.fillRect(256 + Math.cos(a) * r, 256 + Math.sin(a) * r, 2.5, 2.5);
    }

    return canvas;
  }

  preloadDishTextures() {
    MENU_ITEMS.forEach((item) => {
      this.textureLoader.load(
        item.image,
        (tex) => {
          if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.center.set(0.5, 0.5);
          this.dishTextures.set(item.id, tex);
          if (item.id === this.currentActiveDishId && this.dishDisplayDisc) {
            this.updateDiscTexture(tex);
          }
        },
        undefined,
        () => {
          const fallbackTex = new THREE.CanvasTexture(
            this.createDishCanvas(item.name, item.modelAccentColor)
          );
          if (THREE.sRGBEncoding) fallbackTex.encoding = THREE.sRGBEncoding;
          this.dishTextures.set(item.id, fallbackTex);
        }
      );
    });
  }

  buildEmberParticles() {
    const particleCount = 420;
    this.emberGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 7.5;
      const y = -3.5 + Math.random() * 9.0;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius - 1.0;

      scales[i] = 0.04 + Math.random() * 0.12;
      speeds[i] = 0.25 + Math.random() * 0.65;
      phases[i] = Math.random() * Math.PI * 2;
    }

    this.emberGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.emberGeo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    this.emberGeo.userData = { speeds, phases };

    const emberCanvas = document.createElement('canvas');
    emberCanvas.width = 64;
    emberCanvas.height = 64;
    const ctx = emberCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 235, 170, 1)');
    grad.addColorStop(0.3, 'rgba(245, 166, 35, 0.85)');
    grad.addColorStop(0.7, 'rgba(217, 119, 6, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const emberTexture = new THREE.CanvasTexture(emberCanvas);

    const emberMat = new THREE.PointsMaterial({
      size: 0.28,
      map: emberTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffd166,
      opacity: 0.85
    });

    this.emberParticles = new THREE.Points(this.emberGeo, emberMat);
    this.scene.add(this.emberParticles);
  }

  buildSteamParticles() {
    const steamCount = 60;
    this.steamGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(steamCount * 3);
    const steamSpeeds = new Float32Array(steamCount);
    const steamAlphas = new Float32Array(steamCount);

    for (let i = 0; i < steamCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.4;
      positions[i * 3 + 1] = 0.1 + Math.random() * 2.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.4;

      steamSpeeds[i] = 0.35 + Math.random() * 0.45;
      steamAlphas[i] = Math.random();
    }

    this.steamGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.steamGeo.userData = { steamSpeeds, steamAlphas };

    const steamCanvas = document.createElement('canvas');
    steamCanvas.width = 64;
    steamCanvas.height = 64;
    const ctx = steamCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 245, 220, 0.45)');
    grad.addColorStop(0.5, 'rgba(230, 200, 160, 0.18)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const steamTexture = new THREE.CanvasTexture(steamCanvas);

    const steamMat = new THREE.PointsMaterial({
      size: 0.65,
      map: steamTexture,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      color: 0xffedd5,
      opacity: 0.28
    });

    this.steamParticles = new THREE.Points(this.steamGeo, steamMat);
    this.steamParticles.position.set(0, 0, 0);
    this.scene.add(this.steamParticles);
  }

  focusDish(dishId) {
    this.currentActiveDishId = dishId;
    const dish = MENU_ITEMS.find((d) => d.id === dishId);
    if (!dish) return;

    if (this.dishAuraLight) {
      this.dishAuraLight.color.setHex(dish.modelAccentColor);
      this.dishAuraLight.intensity = 3.2;
    }
    if (this.keySpotlight) {
      this.keySpotlight.color.setHex(0xffdf88);
    }

    const cachedTex = this.dishTextures.get(dishId);
    if (cachedTex) {
      this.updateDiscTexture(cachedTex);
    } else {
      const fallbackTex = new THREE.CanvasTexture(
        this.createDishCanvas(dish.name, dish.modelAccentColor)
      );
      this.updateDiscTexture(fallbackTex);
    }

    this.dragVelocity = 0.08;
  }

  updateDiscTexture(tex) {
    if (!this.dishDisplayDisc || !this.dishDisplayDisc.material) return;
    const topMat = this.dishDisplayDisc.material[1];
    if (topMat) {
      topMat.map = tex;
      topMat.needsUpdate = true;
    }
  }

  setAtmosphereMood(mood) {
    if (!this.keySpotlight || !this.fillLight || !this.ambientLight) return;

    if (mood === 'saffron') {
      this.keySpotlight.color.setHex(0xff7700);
      this.fillLight.color.setHex(0xe11d48);
      this.ambientLight.color.setHex(0x351005);
      if (this.dishAuraLight) this.dishAuraLight.color.setHex(0xf97316);
    } else if (mood === 'candlelight') {
      this.keySpotlight.color.setHex(0xff9933);
      this.fillLight.color.setHex(0x78350f);
      this.ambientLight.color.setHex(0x180d05);
      if (this.dishAuraLight) this.dishAuraLight.color.setHex(0xd97706);
    } else {
      this.keySpotlight.color.setHex(0xffb84d);
      this.fillLight.color.setHex(0xd97706);
      this.ambientLight.color.setHex(0x23180d);
      if (this.dishAuraLight) this.dishAuraLight.color.setHex(0xe58e26);
    }
  }

  bindEvents() {
    window.addEventListener('resize', this.onResize.bind(this), { passive: true });
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });

    const dom = this.renderer.domElement;
    dom.addEventListener('mousedown', this.onPointerDown.bind(this));
    window.addEventListener('mousemove', this.onPointerMove.bind(this));
    window.addEventListener('mouseup', this.onPointerUp.bind(this));

    dom.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
    window.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });

    dom.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.isVisible = false;
    });
    dom.addEventListener('webglcontextrestored', () => {
      this.init();
      this.isVisible = true;
    });

    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) {
        this.clock.start();
      }
    });

    this.onScroll();
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  }

  onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const current = window.scrollY;
    this.targetScrollProgress = Math.min(Math.max(current / docHeight, 0), 1);
  }

  onMouseMove(e) {
    this.pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onPointerDown(e) {
    this.isDragging = true;
    this.dragPrevX = e.clientX;
    this.dragVelocity = 0;
  }

  onPointerMove(e) {
    if (!this.isDragging) return;
    const delta = e.clientX - this.dragPrevX;
    this.dragVelocity = delta * 0.003;
    this.userRotationY += this.dragVelocity;
    this.dragPrevX = e.clientX;
  }

  onPointerUp() {
    this.isDragging = false;
  }

  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.dragPrevX = e.touches[0].clientX;
      this.dragVelocity = 0;
    }
  }

  onTouchMove(e) {
    if (!this.isDragging || e.touches.length !== 1) return;
    const delta = e.touches[0].clientX - this.dragPrevX;
    this.dragVelocity = delta * 0.004;
    this.userRotationY += this.dragVelocity;
    this.dragPrevX = e.touches[0].clientX;
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    if (!this.isVisible || !this.isInitialized) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth scroll interpolation (Lerp)
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.06;

    // Smooth pointer parallax interpolation
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.05;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.05;

    // Damped user rotation inertia
    if (!this.isDragging) {
      this.dragVelocity *= 0.94;
      this.userRotationY += this.dragVelocity;
    }

    const motionFactor = this.isReducedMotion ? 0.15 : 1.0;

    // Camera choreography
    const p = this.scrollProgress;
    let targetCamX = 0;
    let targetCamY = 1.2;
    let targetCamZ = 6.8;
    let targetLookX = 0;
    let targetLookY = 0;
    let targetLookZ = 0;
    let targetCenterpieceY = -0.2;
    let targetCenterpieceRotX = 0.35;

    if (p < 0.22) {
      const t = p / 0.22;
      targetCamX = THREE.MathUtils.lerp(0, 1.4, t);
      targetCamY = THREE.MathUtils.lerp(1.2, 0.9, t);
      targetCamZ = THREE.MathUtils.lerp(6.8, 5.6, t);
      targetLookX = THREE.MathUtils.lerp(0, -0.2, t);
      targetLookY = THREE.MathUtils.lerp(0, 0.1, t);
      targetCenterpieceRotX = THREE.MathUtils.lerp(0.35, 0.48, t);
    } else if (p < 0.48) {
      const t = (p - 0.22) / 0.26;
      targetCamX = THREE.MathUtils.lerp(1.4, -1.8, t);
      targetCamY = THREE.MathUtils.lerp(0.9, 1.4, t);
      targetCamZ = THREE.MathUtils.lerp(5.6, 5.8, t);
      targetLookX = THREE.MathUtils.lerp(-0.2, 0.3, t);
      targetLookY = THREE.MathUtils.lerp(0.1, 0.2, t);
      targetCenterpieceRotX = THREE.MathUtils.lerp(0.48, 0.42, t);
    } else if (p < 0.72) {
      const t = (p - 0.48) / 0.24;
      targetCamX = THREE.MathUtils.lerp(-1.8, 0, t);
      targetCamY = THREE.MathUtils.lerp(1.4, 2.0, t);
      targetCamZ = THREE.MathUtils.lerp(5.8, 6.4, t);
      targetLookX = THREE.MathUtils.lerp(0.3, 0, t);
      targetLookY = THREE.MathUtils.lerp(0.2, -0.2, t);
      targetCenterpieceRotX = THREE.MathUtils.lerp(0.42, 0.65, t);
    } else if (p < 0.88) {
      const t = (p - 0.72) / 0.16;
      targetCamX = THREE.MathUtils.lerp(0, 1.5, t);
      targetCamY = THREE.MathUtils.lerp(2.0, 0.8, t);
      targetCamZ = THREE.MathUtils.lerp(6.4, 5.4, t);
      targetLookX = THREE.MathUtils.lerp(0, -0.3, t);
      targetLookY = THREE.MathUtils.lerp(-0.2, 0.1, t);
      targetCenterpieceRotX = THREE.MathUtils.lerp(0.65, 0.38, t);
    } else {
      const t = (p - 0.88) / 0.12;
      targetCamX = THREE.MathUtils.lerp(1.5, 0, t);
      targetCamY = THREE.MathUtils.lerp(0.8, 1.1, t);
      targetCamZ = THREE.MathUtils.lerp(5.4, 6.2, t);
      targetLookX = THREE.MathUtils.lerp(-0.3, 0, t);
      targetLookY = THREE.MathUtils.lerp(0.1, 0, t);
      targetCenterpieceRotX = THREE.MathUtils.lerp(0.38, 0.45, t);
    }

    const parallaxX = this.pointer.x * 0.45 * motionFactor;
    const parallaxY = this.pointer.y * 0.35 * motionFactor;

    this.camera.position.x += (targetCamX + parallaxX - this.camera.position.x) * 0.05;
    this.camera.position.y += (targetCamY + parallaxY - this.camera.position.y) * 0.05;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.05;

    const currentLook = new THREE.Vector3(targetLookX, targetLookY, targetLookZ);
    this.camera.lookAt(currentLook);

    // Animate Centerpiece
    if (this.centerpieceGroup) {
      this.centerpieceGroup.position.y += (targetCenterpieceY - this.centerpieceGroup.position.y) * 0.05;
      this.centerpieceGroup.rotation.x += (targetCenterpieceRotX - this.centerpieceGroup.rotation.x) * 0.05;

      const autoSpin = elapsedTime * 0.22 * motionFactor;
      this.centerpieceGroup.rotation.y = autoSpin + this.userRotationY;
    }

    if (this.filigreeRing1) {
      this.filigreeRing1.rotation.z = -elapsedTime * 0.35 * motionFactor;
    }
    if (this.filigreeRing2) {
      this.filigreeRing2.rotation.z = elapsedTime * 0.28 * motionFactor;
    }
    if (this.filigreeRing3) {
      this.filigreeRing3.rotation.z = -elapsedTime * 0.18 * motionFactor;
    }

    // Orbiting Spice Orbs
    this.spiceOrbs.forEach((orb) => {
      const u = orb.userData;
      u.angle += u.speed * delta * motionFactor;
      orb.position.x = Math.cos(u.angle) * u.radius;
      orb.position.z = Math.sin(u.angle) * u.radius;
      orb.position.y = u.yOffset + Math.sin(elapsedTime * 2 + u.angle) * 0.12 * motionFactor;
    });

    // Embers
    if (this.emberParticles && this.emberGeo) {
      const positions = this.emberGeo.attributes.position.array;
      const speeds = this.emberGeo.userData.speeds;
      const phases = this.emberGeo.userData.phases;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += speeds[i] * delta * 1.2 * motionFactor;
        positions[i * 3] += Math.sin(elapsedTime * 0.8 + phases[i]) * 0.005 * motionFactor;
        positions[i * 3 + 2] += Math.cos(elapsedTime * 0.7 + phases[i]) * 0.005 * motionFactor;

        if (positions[i * 3 + 1] > 6.0) {
          positions[i * 3 + 1] = -3.5;
        }
      }
      this.emberGeo.attributes.position.needsUpdate = true;
    }

    // Steam
    if (this.steamParticles && this.steamGeo) {
      const positions = this.steamGeo.attributes.position.array;
      const steamSpeeds = this.steamGeo.userData.steamSpeeds;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += steamSpeeds[i] * delta * 0.9 * motionFactor;
        positions[i * 3] += (Math.random() - 0.5) * 0.004 * motionFactor;
        positions[i * 3 + 2] += (Math.random() - 0.5) * 0.004 * motionFactor;

        if (positions[i * 3 + 1] > 3.0) {
          positions[i * 3 + 1] = 0.15;
          positions[i * 3] = (Math.random() - 0.5) * 1.1;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 1.1;
        }
      }
      this.steamGeo.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  };
}
