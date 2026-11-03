import * as THREE from 'three';
import { mulberry32 } from '../geometry/rng';

type Paint = (g: CanvasRenderingContext2D, s: number, r: () => number) => void;
const rgb = (c: [number, number, number], v = 0) =>
  `rgb(${Math.max(0, Math.min(255, c[0] + v)) | 0},${Math.max(0, Math.min(255, c[1] + v)) | 0},${Math.max(0, Math.min(255, c[2] + v)) | 0})`;

/**
 * Textura procedural PBR em canvas de alta resolução com geração de Normal Map via filtro Sobel.
 * `tile` = metros cobertos por uma repetição (escala arquitetônica no mundo 3D).
 */
function tex(
  size: number,
  tile: number,
  paint: Paint,
  seed = 1,
  normalStrength = 1.8,
  srgb = true
): { map: THREE.CanvasTexture; normal?: THREE.CanvasTexture } {
  if (typeof document === 'undefined') {
    return { map: new THREE.CanvasTexture(new Image()) };
  }
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  paint(ctx, size, mulberry32(seed));

  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1 / tile, 1 / tile);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;

  // Gerador avançado de Normal Map através de gradientes Sobel
  try {
    const imgData = ctx.getImageData(0, 0, size, size);
    const src = imgData.data;
    const nc = document.createElement('canvas');
    nc.width = nc.height = size;
    const nctx = nc.getContext('2d')!;
    const nData = nctx.createImageData(size, size);
    const dst = nData.data;

    const getLum = (x: number, y: number) => {
      const px = ((y + size) % size) * size + ((x + size) % size);
      const idx = px * 4;
      return (src[idx] * 0.299 + src[idx + 1] * 0.587 + src[idx + 2] * 0.114) / 255;
    };

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Operadores de Sobel horizontal e vertical
        const tl = getLum(x - 1, y - 1);
        const l  = getLum(x - 1, y);
        const bl = getLum(x - 1, y + 1);
        const tr = getLum(x + 1, y - 1);
        const r  = getLum(x + 1, y);
        const br = getLum(x + 1, y + 1);
        const t0 = getLum(x, y - 1);
        const b0 = getLum(x, y + 1);

        const dX = ((tr + 2 * r + br) - (tl + 2 * l + bl)) * normalStrength;
        const dY = ((bl + 2 * b0 + br) - (tl + 2 * t0 + tr)) * normalStrength;
        const dZ = 1.0;

        const len = Math.hypot(dX, dY, dZ) || 1;
        const nx = dX / len;
        const ny = dY / len;
        const nz = dZ / len;

        const p = (y * size + x) * 4;
        dst[p]     = Math.round((nx * 0.5 + 0.5) * 255);
        dst[p + 1] = Math.round((ny * 0.5 + 0.5) * 255);
        dst[p + 2] = Math.round((nz * 0.5 + 0.5) * 255);
        dst[p + 3] = 255;
      }
    }
    nctx.putImageData(nData, 0, 0);
    const nt = new THREE.CanvasTexture(nc);
    nt.wrapS = nt.wrapT = THREE.RepeatWrapping;
    nt.repeat.set(1 / tile, 1 / tile);
    nt.anisotropy = 8;
    return { map: t, normal: nt };
  } catch {
    return { map: t };
  }
}

// Pintura procedural de ruído com granulação realista
const speckle = (
  g: CanvasRenderingContext2D,
  s: number,
  r: () => number,
  base: [number, number, number],
  amp: number,
  n = 50000,
  px = 2
) => {
  g.fillStyle = rgb(base);
  g.fillRect(0, 0, s, s);
  for (let i = 0; i < n; i++) {
    g.fillStyle = rgb(base, (r() - 0.5) * amp);
    g.fillRect(r() * s, r() * s, px, px);
  }
};

// Manchas orgânicas de umidade e desgaste natural
const blotches = (
  g: CanvasRenderingContext2D,
  s: number,
  r: () => number,
  base: [number, number, number],
  n: number,
  amp: number
) => {
  for (let i = 0; i < n; i++) {
    const x = r() * s, y = r() * s, rad = 8 + r() * 45;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    const v = (r() - 0.5) * amp;
    gr.addColorStop(0, `rgba(${(base[0] + v) | 0},${(base[1] + v) | 0},${(base[2] + v) | 0},0.32)`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
};

// Juntas de assentamento e bisotagem de peças
const joints = (g: CanvasRenderingContext2D, s: number, cells: number, color: string, w = 2) => {
  g.strokeStyle = color;
  g.lineWidth = w;
  for (let i = 0; i <= cells; i++) {
    const p = (i * s) / cells;
    g.beginPath();
    g.moveTo(p, 0); g.lineTo(p, s);
    g.moveTo(0, p); g.lineTo(s, p);
    g.stroke();
  }
};

const std = (o: THREE.MeshStandardMaterialParameters, layer = 0) => {
  const m = new THREE.MeshStandardMaterial(o);
  if (layer) {
    m.polygonOffset = true;
    m.polygonOffsetFactor = -layer;
    m.polygonOffsetUnits = -layer;
  }
  return m;
};

let cache: ReturnType<typeof build> | null = null;
export const getMaterials = () => (cache ??= build());

function build() {
  // 1. Gramado natural denso e vibrante com micro-textura de folhas e terra fértil
  const grass = tex(1024, 6.0, (g, s, r) => {
    // Base de grama tropical com variação de clorofila
    speckle(g, s, r, [74, 118, 48], 28, 90000, 2);
    blotches(g, s, r, [56, 96, 38], 50, 35);
    blotches(g, s, r, [108, 148, 64], 35, 25);
    blotches(g, s, r, [92, 134, 52], 40, 20);

    // Micro-lâminas de grama em direções aleatórias
    g.strokeStyle = 'rgba(128, 172, 70, 0.45)';
    g.lineWidth = 1.2;
    for (let i = 0; i < 4000; i++) {
      const x = r() * s, y = r() * s, len = 3 + r() * 5, ang = r() * Math.PI * 2;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
      g.stroke();
    }
  }, 11, 2.2);

  // 2. Campo de futebol society sintético com listras alternadas
  const field = tex(512, 12, (g, s, r) => {
    speckle(g, s, r, [46, 126, 44], 18, 60000);
    g.fillStyle = 'rgba(255,255,255,0.08)';
    g.fillRect(0, 0, s, s / 2);
  }, 12, 1.2);

  // 3. Concreto arquitetônico usinado com agregados miúdos
  const concrete = tex(1024, 4.0, (g, s, r) => {
    speckle(g, s, r, [186, 184, 178], 18, 80000);
    blotches(g, s, r, [158, 156, 150], 35, 25);
    joints(g, s, 2, 'rgba(50,50,50,0.35)', 2);
  }, 13, 1.5);

  // 4. Pedra portuguesa / Calçamento histórico
  const stone = tex(1024, 3.0, (g, s, r) => {
    speckle(g, s, r, [178, 168, 154], 22, 70000);
    joints(g, s, 8, 'rgba(60,50,42,0.6)', 2.5);
    for (let i = 0; i < 64; i++) {
      const cx = (i % 8) * (s / 8);
      const cy = Math.floor(i / 8) * (s / 8);
      g.fillStyle = `rgba(${85 + r() * 70},${75 + r() * 60},${65 + r() * 50},0.28)`;
      g.fillRect(cx + 2, cy + 2, s / 8 - 4, s / 8 - 4);
    }
  }, 14, 2.4);

  // 5. Pavimentação dos caminhos principais (Piso Intertravado de Alta Resistência)
  const path = tex(1024, 3.5, (g, s, r) => {
    speckle(g, s, r, [215, 208, 196], 16, 75000);
    blotches(g, s, r, [192, 185, 174], 25, 18);
    // Padrão de blocos intertravados retangulares (espinha de peixe suave)
    g.strokeStyle = 'rgba(75,70,62,0.45)';
    g.lineWidth = 1.8;
    const cols = 6;
    for (let i = 0; i <= cols; i++) {
      const x = (i * s) / cols;
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x, s); g.stroke();
    }
    const rows = 12;
    for (let j = 0; j <= rows; j++) {
      const y = (j * s) / rows;
      g.beginPath(); g.moveTo(0, y); g.lineTo(s, y); g.stroke();
    }
  }, 15, 2.0);

  // 6. Asfalto viário com agregados britados e desgaste por tráfego
  const asphalt = tex(1024, 5.0, (g, s, r) => {
    speckle(g, s, r, [52, 54, 58], 30, 95000);
    blotches(g, s, r, [38, 40, 44], 35, 25);
  }, 16, 1.8);

  // 7. Concreto polido acetinado da pista de skate
  const skate = tex(1024, 3.0, (g, s, r) => {
    speckle(g, s, r, [180, 178, 172], 12, 60000);
    blotches(g, s, r, [156, 154, 148], 22, 16);
    // Linhas de junta de dilatação
    joints(g, s, 3, 'rgba(80,80,80,0.3)', 1.5);
  }, 17, 1.1);

  // 8. Pisos das quadras poliesportivas em resina acrílica
  const courtBlue = tex(256, 4, (g, s, r) => speckle(g, s, r, [32, 92, 148], 14, 30000), 18, 0.8);
  const courtGreen = tex(256, 4, (g, s, r) => speckle(g, s, r, [38, 124, 86], 14, 30000), 19, 0.8);

  // 9. Piso emborrachado anti-impacto do playground
  const rubber = tex(256, 3, (g, s, r) => speckle(g, s, r, [172, 72, 48], 24, 35000, 3), 20, 1.5);

  // 10. Terra vegetal rica / canteiros de chuva
  const soil = tex(512, 3.0, (g, s, r) => {
    speckle(g, s, r, [82, 60, 42], 35, 60000);
    blotches(g, s, r, [55, 40, 28], 30, 25);
    blotches(g, s, r, [68, 88, 46], 18, 20); // musgo sutil
  }, 21, 2.5);

  // 11. Madeira nobre de lei tratada para decks e pontes
  const wood = tex(1024, 2.0, (g, s, r) => {
    g.fillStyle = rgb([142, 98, 58]);
    g.fillRect(0, 0, s, s);
    const planks = 16;
    for (let i = 0; i < planks; i++) {
      const y0 = (i * s) / planks;
      const h = s / planks;
      const v = (r() - 0.5) * 40;
      g.fillStyle = rgb([142, 98, 58], v);
      g.fillRect(0, y0, s, h - 2.5);

      // Veios da madeira longitudinais
      g.strokeStyle = 'rgba(60, 36, 16, 0.35)';
      g.lineWidth = 1;
      for (let k = 0; k < 3; k++) {
        g.beginPath();
        g.moveTo(0, y0 + 3 + r() * (h - 8));
        g.lineTo(s, y0 + 3 + r() * (h - 8));
        g.stroke();
      }

      // Pregos / Parafusos nas extremidades das tábuas
      g.fillStyle = 'rgba(30, 20, 12, 0.7)';
      g.beginPath(); g.arc(12, y0 + h / 2, 2.5, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(s - 12, y0 + h / 2, 2.5, 0, Math.PI * 2); g.fill();
    }
  }, 22, 2.2);

  // 12. Areia lavada das quadras de vôlei
  const sand = tex(256, 3, (g, s, r) => speckle(g, s, r, [226, 208, 162], 20, 45000), 23, 1.4);

  // 13. Pedras naturais de enrocamento (Riprap para contenção do lago)
  const riprap = tex(512, 2.5, (g, s, r) => {
    speckle(g, s, r, [124, 128, 132], 30, 50000);
    blotches(g, s, r, [92, 96, 100], 40, 30);
    joints(g, s, 6, 'rgba(35, 38, 42, 0.7)', 3);
  }, 24, 2.8);

  // 14. Placas fotovoltaicas solares dos postes e coberturas
  const solar = tex(256, 1.2, (g, s) => {
    g.fillStyle = '#0a2540';
    g.fillRect(0, 0, s, s);
    g.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    g.lineWidth = 1.2;
    joints(g, s, 6, 'rgba(255, 255, 255, 0.4)', 1.2);
  }, 25, 0.5);

  return {
    grass: std({ map: grass.map, normalMap: grass.normal, roughness: 0.92, metalness: 0.02 }),
    field: std({ map: field.map, normalMap: field.normal, roughness: 0.90 }, 1),
    concrete: std({ map: concrete.map, normalMap: concrete.normal, roughness: 0.85, metalness: 0.05 }, 1),
    stone: std({ map: stone.map, normalMap: stone.normal, roughness: 0.82, metalness: 0.04 }, 1),
    path: std({ map: path.map, normalMap: path.normal, roughness: 0.86, metalness: 0.03 }, 2),
    asphalt: std({ map: asphalt.map, normalMap: asphalt.normal, roughness: 0.90, metalness: 0.05 }, 1),
    skate: std({ map: skate.map, normalMap: skate.normal, roughness: 0.58, metalness: 0.08 }),
    courtBlue: std({ map: courtBlue.map, roughness: 0.62 }, 1),
    courtGreen: std({ map: courtGreen.map, roughness: 0.62 }, 1),
    rubber: std({ map: rubber.map, roughness: 0.90 }, 1),
    soil: std({ map: soil.map, normalMap: soil.normal, roughness: 0.98 }, 2),
    sand: std({ map: sand.map, normalMap: sand.normal, roughness: 0.95 }, 1),
    wood: std({ map: wood.map, normalMap: wood.normal, roughness: 0.72, metalness: 0.05 }),
    deck: std({ map: wood.map, normalMap: wood.normal, roughness: 0.74, color: '#f0d8b8' }),
    riprap: std({ map: riprap.map, normalMap: riprap.normal, roughness: 0.85, metalness: 0.08 }),
    solar: std({ map: solar.map, roughness: 0.15, metalness: 0.85 }),
    structure: std({ color: '#c7c3ba', roughness: 0.82 }),
    support: std({ color: '#b9b5ac', roughness: 0.82 }),
    metal: std({ color: '#c4cad0', metalness: 0.86, roughness: 0.26, vertexColors: true, envMapIntensity: 1.6 }),
    towerCopper: std({ color: '#c9784e', metalness: 0.62, roughness: 0.35, envMapIntensity: 1.8 }),
    metalDark: std({ color: '#2c333a', metalness: 0.82, roughness: 0.35 }),
    poolFloor: std({ color: '#00a8e8', roughness: 0.40, metalness: 0.05 }),
    courtRoyalBlue: std({ color: '#1d4ed8', roughness: 0.55, metalness: 0.02 }),
    courtSkyBlue: std({ color: '#38bdf8', roughness: 0.55, metalness: 0.02 }),
    courtOrange: std({ color: '#ea580c', roughness: 0.55, metalness: 0.02 }),
    splashPadBlue: std({ color: '#1e3a8a', roughness: 0.85 }),
    splashPadYellow: std({ color: '#eab308', roughness: 0.85 }),
    paint: std({ color: '#f4f1ea', roughness: 0.60 }),
    roof: std({ color: '#686e74', metalness: 0.50, roughness: 0.45 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#2b4858',
      metalness: 0.12,
      roughness: 0.04,
      transparent: true,
      opacity: 0.82,
      clearcoat: 1.0,
      envMapIntensity: 1.8
    }),
    water: new THREE.MeshPhysicalMaterial({
      color: '#00b4d8',
      roughness: 0.04,
      metalness: 0.05,
      transparent: true,
      opacity: 0.70,
      transmission: 0.65,
      ior: 1.333,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 2.2,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3
    }),
    basin: std({ color: '#6e7a82', roughness: 0.75 }, 2),
    jet: new THREE.MeshStandardMaterial({ color: '#f0f8ff', transparent: true, opacity: 0.75, roughness: 0.12 }),
    fencePanel: new THREE.MeshStandardMaterial({ color: '#687076', transparent: true, opacity: 0.32, roughness: 0.55, side: THREE.DoubleSide }),
    line: std({ color: '#fafaf6', roughness: 0.68 }, 3),
    bark: std({ color: '#443224', roughness: 0.94 }),
    foliage: std({ vertexColors: true, roughness: 0.80 }),
    lampHead: new THREE.MeshStandardMaterial({ color: '#fff5db', emissive: '#ffd670', emissiveIntensity: 0.85 }),
    wallA: std({ color: '#d9ccb8', roughness: 0.90 }),
    wallWhite: std({ color: '#ffffff', roughness: 0.90 }),
    wallB: std({ color: '#c9b9a6', roughness: 0.90 }),
    wallC: std({ color: '#cfd2cf', roughness: 0.90 }),
    windowDark: std({ color: '#1e2c36', roughness: 0.15, metalness: 0.45 }),
    mist: new THREE.PointsMaterial({ color: '#eef6fc', size: 1.1, sizeAttenuation: true, transparent: true, opacity: 0.32, depthWrite: false }),
    expansion: new THREE.MeshBasicMaterial({ color: '#e0803a', transparent: true, opacity: 0.18, depthWrite: false }),
    ring: new THREE.MeshBasicMaterial({ color: '#ffb347', transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide }),
    groundFar: std({ color: '#ffffff', roughness: 0.96, vertexColors: true }),
    invisible: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  };
}
