import * as THREE from 'three';
import { mulberry32 } from '../geometry/rng';

type Paint = (g: CanvasRenderingContext2D, s: number, r: () => number) => void;
const rgb = (c: [number, number, number], v = 0) => `rgb(${Math.max(0, Math.min(255, c[0] + v)) | 0},${Math.max(0, Math.min(255, c[1] + v)) | 0},${Math.max(0, Math.min(255, c[2] + v)) | 0})`;

/** Textura procedural em canvas. `tile` = metros cobertos por uma repetição (escala real). */
function tex(size: number, tile: number, paint: Paint, seed = 1, srgb = true): { map: THREE.CanvasTexture; normal?: THREE.CanvasTexture } {
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

  // Gerador procedural de Normal Map (Sobel filter sobre o relevo do canvas)
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

    const strength = 1.8;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (getLum(x + 1, y) - getLum(x - 1, y)) * strength;
        const dy = (getLum(x, y + 1) - getLum(x, y - 1)) * strength;
        const dz = 1.0;
        const len = Math.hypot(dx, dy, dz) || 1;
        const nx = dx / len;
        const ny = dy / len;
        const nz = dz / len;

        const p = (y * size + x) * 4;
        dst[p] = Math.round((nx * 0.5 + 0.5) * 255);
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

const speckle = (g: CanvasRenderingContext2D, s: number, r: () => number, base: [number, number, number], amp: number, n = 30000, px = 2) => {
  g.fillStyle = rgb(base); g.fillRect(0, 0, s, s);
  for (let i = 0; i < n; i++) { g.fillStyle = rgb(base, (r() - 0.5) * amp); g.fillRect(r() * s, r() * s, px, px); }
};

const blotches = (g: CanvasRenderingContext2D, s: number, r: () => number, base: [number, number, number], n: number, amp: number) => {
  for (let i = 0; i < n; i++) {
    const x = r() * s, y = r() * s, rad = 10 + r() * 50;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    const v = (r() - 0.5) * amp;
    gr.addColorStop(0, `rgba(${(base[0] + v) | 0},${(base[1] + v) | 0},${(base[2] + v) | 0},0.35)`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
};

const joints = (g: CanvasRenderingContext2D, s: number, cells: number, color: string, w = 2) => {
  g.strokeStyle = color; g.lineWidth = w;
  for (let i = 0; i <= cells; i++) { const p = (i * s) / cells; g.beginPath(); g.moveTo(p, 0); g.lineTo(p, s); g.moveTo(0, p); g.lineTo(s, p); g.stroke(); }
};

const std = (o: THREE.MeshStandardMaterialParameters, layer = 0) => {
  const m = new THREE.MeshStandardMaterial(o);
  if (layer) { m.polygonOffset = true; m.polygonOffsetFactor = -layer; m.polygonOffsetUnits = -layer; }
  return m;
};

let cache: ReturnType<typeof build> | null = null;
export const getMaterials = () => (cache ??= build());

function build() {
  // 1. Gramado natural denso e vibrante
  const grass = tex(512, 6, (g, s, r) => {
    speckle(g, s, r, [76, 114, 52], 30, 70000);
    blotches(g, s, r, [60, 94, 42], 45, 35);
    blotches(g, s, r, [105, 138, 65], 25, 25);
  }, 11);

  // 2. Campo de futebol sintético society
  const field = tex(512, 10, (g, s, r) => {
    speckle(g, s, r, [58, 122, 54], 20, 50000);
    g.fillStyle = 'rgba(255,255,255,0.06)';
    g.fillRect(0, 0, s, s / 2);
  }, 12);

  // 3. Concreto arquitetônico usinado
  const concrete = tex(512, 4, (g, s, r) => {
    speckle(g, s, r, [178, 176, 170], 16, 50000);
    blotches(g, s, r, [155, 153, 147], 30, 25);
    joints(g, s, 2, 'rgba(60,60,60,0.4)', 2);
  }, 13);

  // 4. Pedra portuguesa / Calçamento sextavado
  const stone = tex(512, 3, (g, s, r) => {
    speckle(g, s, r, [172, 160, 146], 18, 40000);
    joints(g, s, 6, 'rgba(70,60,50,0.55)', 2);
    for (let i = 0; i < 36; i++) {
      g.fillStyle = `rgba(${80 + r() * 70},${70 + r() * 60},${60 + r() * 50},0.22)`;
      g.fillRect(((r() * 6) | 0) * (s / 6), ((r() * 6) | 0) * (s / 6), s / 6, s / 6);
    }
  }, 14);

  // 5. Pavimentação dos caminhos principais
  const path = tex(512, 4, (g, s, r) => {
    speckle(g, s, r, [210, 204, 194], 14, 50000);
    joints(g, s, 4, 'rgba(90,85,75,0.3)', 1.5);
  }, 15);

  // 6. Asfalto e pavimentação viária
  const asphalt = tex(512, 6, (g, s, r) => {
    speckle(g, s, r, [60, 62, 65], 28, 80000);
    blotches(g, s, r, [48, 48, 52], 30, 28);
  }, 16);

  // 7. Concreto liso polido da pista de skate
  const skate = tex(512, 3, (g, s, r) => {
    speckle(g, s, r, [172, 170, 164], 10, 45000);
    blotches(g, s, r, [145, 143, 137], 20, 20);
  }, 17);

  // 8. Pisos das quadras poliesportivas
  const courtBlue = tex(256, 4, (g, s, r) => speckle(g, s, r, [36, 88, 142], 12, 25000), 18);
  const courtGreen = tex(256, 4, (g, s, r) => speckle(g, s, r, [42, 118, 88], 12, 25000), 19);

  // 9. Piso emborrachado do playground
  const rubber = tex(256, 3, (g, s, r) => speckle(g, s, r, [168, 76, 52], 22, 30000, 3), 20);

  // 10. Terra vegetal e canteiros
  const soil = tex(256, 3, (g, s, r) => {
    speckle(g, s, r, [92, 68, 48], 30, 30000);
    blotches(g, s, r, [65, 95, 45], 16, 25);
  }, 21);

  // 11. Madeira ripada nobre para decks e mobiliário
  const wood = tex(256, 2, (g, s, r) => {
    g.fillStyle = rgb([132, 94, 58]); g.fillRect(0, 0, s, s);
    for (let i = 0; i < 14; i++) {
      g.fillStyle = rgb([132, 94, 58], (r() - 0.5) * 45);
      g.fillRect(0, (i * s) / 14, s, s / 14 - 2);
    }
  }, 22);

  // 12. Areia das quadras de vôlei e futevôlei
  const sand = tex(256, 3, (g, s, r) => speckle(g, s, r, [222, 204, 156], 18, 35000), 23);

  return {
    grass: std({ map: grass.map, normalMap: grass.normal, roughness: 0.95 }),
    field: std({ map: field.map, normalMap: field.normal, roughness: 0.92 }, 1),
    concrete: std({ map: concrete.map, normalMap: concrete.normal, roughness: 0.88 }, 1),
    stone: std({ map: stone.map, normalMap: stone.normal, roughness: 0.85 }, 1),
    path: std({ map: path.map, normalMap: path.normal, roughness: 0.88 }, 2),
    asphalt: std({ map: asphalt.map, normalMap: asphalt.normal, roughness: 0.92 }, 1),
    skate: std({ map: skate.map, normalMap: skate.normal, roughness: 0.72 }),
    courtBlue: std({ map: courtBlue.map, roughness: 0.65 }, 1),
    courtGreen: std({ map: courtGreen.map, roughness: 0.65 }, 1),
    rubber: std({ map: rubber.map, roughness: 0.92 }, 1),
    soil: std({ map: soil.map, roughness: 1.0 }, 2),
    sand: std({ map: sand.map, normalMap: sand.normal, roughness: 0.98 }, 1),
    wood: std({ map: wood.map, normalMap: wood.normal, roughness: 0.75 }),
    deck: std({ map: wood.map, normalMap: wood.normal, roughness: 0.78, color: '#e0c8a8' }),
    structure: std({ color: '#c7c3ba', roughness: 0.85 }),
    support: std({ color: '#b9b5ac', roughness: 0.85 }),
    metal: std({ color: '#bcc1c6', metalness: 0.88, roughness: 0.28, vertexColors: true, envMapIntensity: 1.4 }),
    metalDark: std({ color: '#383d42', metalness: 0.82, roughness: 0.38 }),
    paint: std({ color: '#f0ede6', roughness: 0.65 }),
    roof: std({ color: '#72767a', metalness: 0.45, roughness: 0.5 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#2b4454', metalness: 0.15, roughness: 0.05, transparent: true, opacity: 0.82, clearcoat: 1, envMapIntensity: 1.6 }),
    water: new THREE.MeshPhysicalMaterial({ color: '#3d869e', roughness: 0.03, metalness: 0.05, transparent: true, opacity: 0.78, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.8, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }),
    basin: std({ color: '#7a858b', roughness: 0.75 }, 2),
    jet: new THREE.MeshStandardMaterial({ color: '#f0f8ff', transparent: true, opacity: 0.65, roughness: 0.15 }),
    fencePanel: new THREE.MeshStandardMaterial({ color: '#687076', transparent: true, opacity: 0.28, roughness: 0.6, side: THREE.DoubleSide }),
    line: std({ color: '#fafaf6', roughness: 0.7 }, 3),
    bark: std({ color: '#4d3b2b', roughness: 0.95 }),
    foliage: std({ vertexColors: true, roughness: 0.85 }),
    lampHead: new THREE.MeshStandardMaterial({ color: '#fff5db', emissive: '#ffd670', emissiveIntensity: 0.6 }),
    wallA: std({ color: '#d9ccb8', roughness: 0.92 }),
    wallWhite: std({ color: '#ffffff', roughness: 0.92 }),
    wallB: std({ color: '#c9b9a6', roughness: 0.92 }),
    wallC: std({ color: '#cfd2cf', roughness: 0.92 }),
    windowDark: std({ color: '#26343e', roughness: 0.18, metalness: 0.35 }),
    mist: new THREE.PointsMaterial({ color: '#f0f8fc', size: 0.85, sizeAttenuation: true, transparent: true, opacity: 0.28, depthWrite: false }),
    expansion: new THREE.MeshBasicMaterial({ color: '#e0803a', transparent: true, opacity: 0.18, depthWrite: false }),
    ring: new THREE.MeshBasicMaterial({ color: '#ffb347', transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide }),
    groundFar: std({ color: '#8e8e86', roughness: 1.0 }),
    invisible: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  };
}
