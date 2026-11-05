/**
 * EXPERIÊNCIA 3D WEBGL DO COSMOS & ECOSSISTEMA URBANO — ECOCITY 2026
 * Inspirado na base canônica do Google Drive ("Tudo está conectado")
 * 
 * Renderiza o Sol, a Terra, poeira estelar e malha paramétrica conectada.
 * Otimizado para alto desempenho (60 FPS), baixo consumo de GPU e suporte a prefers-reduced-motion.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('cosmos-canvas');
  if (!canvas) return;

  // Verificação de acessibilidade
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowPower = (navigator.hardwareConcurrency || 4) <= 4 || window.innerWidth < 768;

  let renderer, scene, camera;
  let sunGroup, earthMesh, atmosphereMesh, starsPoints, cityMeshGroup;
  let animationFrameId = null;
  let isVisible = true;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  // Inicialização Segura com Fallback
  function init() {
    try {
      if (typeof THREE === 'undefined') {
        console.warn('Three.js não carregado. Ativando fallback estático.');
        activateFallback();
        return;
      }

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: !isLowPower,
        powerPreference: 'high-performance'
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLowPower ? 1 : 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 32);

      buildStars();
      buildSun();
      buildEarth();
      buildEcoParticles();

      window.addEventListener('resize', onResize);
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });

      // Intersection Observer para pausar render quando fora de foco
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId && !prefersReducedMotion) {
            animate();
          }
        });
      }, { threshold: 0.05 });

      observer.observe(document.getElementById('hero-section') || canvas);

      if (!prefersReducedMotion) {
        animate();
      } else {
        renderer.render(scene, camera);
      }

    } catch (err) {
      console.warn('Falha na inicialização do WebGL:', err);
      activateFallback();
    }
  }

  function activateFallback() {
    if (canvas) canvas.style.display = 'none';
    const fallback = document.getElementById('cosmos-fallback');
    if (fallback) fallback.style.display = 'block';
  }

  // Criação da Poeira Estelar Paramétrica
  function buildStars() {
    const starCount = isLowPower ? 800 : 2200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const color1 = new THREE.Color('#10b981'); // Esmeralda
    const color2 = new THREE.Color('#06b6d4'); // Ciano
    const color3 = new THREE.Color('#fbbf24'); // Ouro solar
    const color4 = new THREE.Color('#ffffff'); // Branco

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      const radius = 40 + Math.random() * 160;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[idx + 2] = radius * Math.cos(phi);

      const dice = Math.random();
      const col = dice < 0.25 ? color1 : dice < 0.5 ? color2 : dice < 0.75 ? color3 : color4;
      colors[idx] = col.r;
      colors[idx + 1] = col.g;
      colors[idx + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isLowPower ? 1.2 : 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    starsPoints = new THREE.Points(geometry, material);
    scene.add(starsPoints);
  }

  // Construção do Sol com Núcleo e Coroa Radiante
  function buildSun() {
    sunGroup = new THREE.Group();
    sunGroup.position.set(-18, 12, -15);

    // Núcleo Solar
    const coreGeo = new THREE.SphereGeometry(4.2, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffb938,
      wireframe: false
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    sunGroup.add(core);

    // Coroa Solar Suave
    const coronaGeo = new THREE.SphereGeometry(5.2, 24, 24);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff7a1a,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    sunGroup.add(corona);

    scene.add(sunGroup);
  }

  // Construção da Terra e Atmosfera Resiliente
  function buildEarth() {
    const earthGroup = new THREE.Group();
    earthGroup.position.set(12, -4, -6);

    // Globo da Terra com Shader ou Wireframe Tecnológico
    const earthGeo = new THREE.SphereGeometry(6.5, 36, 36);
    const earthMat = new THREE.MeshBasicMaterial({
      color: 0x07221b,
      wireframe: true
    });
    earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Atmosfera com Brilho Esmeralda/Ciano
    const atmosGeo = new THREE.SphereGeometry(6.9, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      wireframe: false
    });
    atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmosphereMesh);

    // Anel de Satélites e Sensores Ambientais
    const ringGeo = new THREE.RingGeometry(8.2, 8.4, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    ring.rotation.y = Math.PI / 6;
    earthGroup.add(ring);

    cityMeshGroup = earthGroup;
    scene.add(earthGroup);
  }

  // Partículas Vivas do Ecossistema (Fluxo Bioclimático)
  function buildEcoParticles() {
    const pCount = isLowPower ? 200 : 500;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const idx = i * 3;
      pPos[idx] = (Math.random() - 0.5) * 50;
      pPos[idx + 1] = (Math.random() - 0.5) * 30;
      pPos[idx + 2] = (Math.random() - 0.5) * 40;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 1.5,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
  }

  function onResize() {
    if (!renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLowPower ? 1 : 1.5));
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onScroll() {
    if (!camera) return;
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

    // Deslocamento sutil de câmera acompanhando a jornada
    camera.position.y = -scrollProgress * 15;
    camera.position.z = 32 - scrollProgress * 12;
  }

  // Loop de Animação a 60 FPS
  function animate() {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    animationFrameId = requestAnimationFrame(animate);

    // Interpolação suave do mouse (Parallax)
    targetX += (mouseX * 1.5 - targetX) * 0.05;
    targetY += (mouseY * 1.5 - targetY) * 0.05;

    if (camera) {
      camera.position.x = targetX;
      camera.lookAt(0, camera.position.y * 0.5, 0);
    }

    // Rotação dos Astros e Partículas
    if (starsPoints) {
      starsPoints.rotation.y += 0.0003;
    }

    if (sunGroup) {
      sunGroup.rotation.y += 0.001;
    }

    if (earthMesh) {
      earthMesh.rotation.y += 0.0025;
      earthMesh.rotation.x += 0.0008;
    }

    if (atmosphereMesh) {
      atmosphereMesh.rotation.y -= 0.0015;
    }

    if (cityMeshGroup) {
      cityMeshGroup.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
