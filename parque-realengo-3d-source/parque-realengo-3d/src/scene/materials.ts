import * as THREE from 'three';
import { mulberry32 } from '../geometry/rng';

type Paint = (g: CanvasRenderingContext2D, s: number, r: () => number) => void;
const rgb = (c: [number, number, number], v = 0) => `rgb(${Math.max(0, Math.min(255, c[0] + v)) | 0},${Math.max(0, Math.min(255, c[1] + v)) | 0},${Math.max(0, Math.min(255, c[2] + v)) | 0})`;

/** Textura procedural em canvas. `tile` = metros cobertos por uma repetição (a escala real importa). */
function tex(size: number, tile: number, paint: Paint, seed = 1, srgb = true): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  paint(c.getContext('2d')!, size, mulberry32(seed));
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1 / tile, 1 / tile);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
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
const withBump = (t: THREE.Texture) => t; // o próprio mapa de cor serve de bump (relevo sutil)

let cache: ReturnType<typeof build> | null = null;
export const getMaterials = () => (cache ??= build());

function build() {
  const grassT = tex(512, 6, (g, s, r) => { speckle(g, s, r, [88, 118, 62], 34, 60000); blotches(g, s, r, [70, 100, 50], 40, 40); blotches(g, s, r, [120, 135, 70], 20, 30); }, 11);
  const fieldT = tex(512, 10, (g, s, r) => { speckle(g, s, r, [74, 128, 62], 22, 40000); g.fillStyle = 'rgba(255,255,255,0.07)'; g.fillRect(0, 0, s, s / 2); }, 12);
  const concreteT = tex(512, 4, (g, s, r) => { speckle(g, s, r, [176, 174, 168], 18, 50000); blotches(g, s, r, [150, 148, 142], 30, 30); joints(g, s, 2, 'rgba(60,60,60,0.45)', 2); }, 13);
  const stoneT = tex(512, 3, (g, s, r) => { speckle(g, s, r, [168, 156, 142], 14, 30000); joints(g, s, 5, 'rgba(70,60,50,0.5)', 2); for (let i = 0; i < 25; i++) { g.fillStyle = `rgba(${90 + r() * 60},${80 + r() * 50},${70 + r() * 40},0.18)`; g.fillRect(((r() * 5) | 0) * (s / 5), ((r() * 5) | 0) * (s / 5), s / 5, s / 5); } }, 14);
  const pathT = tex(512, 4, (g, s, r) => { speckle(g, s, r, [206, 200, 190], 14, 40000); joints(g, s, 4, 'rgba(90,85,75,0.35)', 1.5); }, 15);
  const asphaltT = tex(512, 6, (g, s, r) => { speckle(g, s, r, [64, 65, 68], 30, 70000); blotches(g, s, r, [50, 50, 54], 30, 30); }, 16);
  const skateT = tex(512, 3, (g, s, r) => { speckle(g, s, r, [168, 166, 160], 12, 50000); blotches(g, s, r, [140, 138, 132], 20, 24); }, 17);
  const courtBlueT = tex(256, 4, (g, s, r) => speckle(g, s, r, [44, 86, 128], 10, 20000), 18);
  const courtGreenT = tex(256, 4, (g, s, r) => speckle(g, s, r, [52, 110, 84], 10, 20000), 19);
  const rubberT = tex(256, 3, (g, s, r) => speckle(g, s, r, [150, 78, 58], 22, 25000, 3), 20);
  const soilT = tex(256, 3, (g, s, r) => { speckle(g, s, r, [96, 72, 50], 30, 25000); blotches(g, s, r, [70, 100, 50], 16, 30); }, 21);
  const woodT = tex(256, 2, (g, s, r) => { g.fillStyle = rgb([128, 92, 58]); g.fillRect(0, 0, s, s); for (let i = 0; i < 12; i++) { g.fillStyle = rgb([128, 92, 58], (r() - 0.5) * 40); g.fillRect(0, (i * s) / 12, s, s / 12 - 2); } }, 22);
  const sandT = tex(256, 3, (g, s, r) => speckle(g, s, r, [214, 196, 150], 18, 25000), 23);

  return {
    grass: std({ map: grassT, bumpMap: withBump(grassT), bumpScale: 0.4, roughness: 1 }),
    field: std({ map: fieldT, roughness: 1 }, 1),
    concrete: std({ map: concreteT, bumpMap: withBump(concreteT), bumpScale: 0.3, roughness: 0.92 }, 1),
    stone: std({ map: stoneT, bumpMap: withBump(stoneT), bumpScale: 0.5, roughness: 0.88 }, 1),
    path: std({ map: pathT, bumpMap: withBump(pathT), bumpScale: 0.3, roughness: 0.9 }, 2),
    asphalt: std({ map: asphaltT, bumpMap: withBump(asphaltT), bumpScale: 0.5, roughness: 0.95 }, 1),
    skate: std({ map: skateT, bumpMap: withBump(skateT), bumpScale: 0.2, roughness: 0.8 }),
    courtBlue: std({ map: courtBlueT, roughness: 0.75 }, 1),
    courtGreen: std({ map: courtGreenT, roughness: 0.75 }, 1),
    rubber: std({ map: rubberT, roughness: 0.95 }, 1),
    soil: std({ map: soilT, roughness: 1 }, 2),
    sand: std({ map: sandT, roughness: 1 }, 1),
    wood: std({ map: woodT, roughness: 0.8 }),
    deck: std({ map: skateT, bumpMap: withBump(skateT), bumpScale: 0.2, roughness: 0.85, color: '#d8d6d0' }),
    structure: std({ color: '#c7c3ba', roughness: 0.9 }),
    support: std({ color: '#b9b5ac', roughness: 0.9 }),
    metal: std({ color: '#a4a9ae', metalness: 0.85, roughness: 0.36, vertexColors: true, envMapIntensity: 1.1 }),
    metalDark: std({ color: '#4a4f55', metalness: 0.8, roughness: 0.45 }),
    paint: std({ color: '#e9e6df', roughness: 0.7 }),
    roof: std({ color: '#7d7f82', metalness: 0.4, roughness: 0.55 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#2d4656', metalness: 0.2, roughness: 0.08, transparent: true, opacity: 0.82, clearcoat: 1, envMapIntensity: 1.4 }),
    water: new THREE.MeshPhysicalMaterial({ color: '#4f8ea3', roughness: 0.04, metalness: 0, transparent: true, opacity: 0.72, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.6, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }),
    basin: std({ color: '#8c959a', roughness: 0.7 }, 2),
    jet: new THREE.MeshStandardMaterial({ color: '#e8f4f8', transparent: true, opacity: 0.55, roughness: 0.2 }),
    fencePanel: new THREE.MeshStandardMaterial({ color: '#6c747a', transparent: true, opacity: 0.28, roughness: 0.6, side: THREE.DoubleSide }),
    line: std({ color: '#f2f2ee', roughness: 0.8 }, 3),
    bark: std({ color: '#52402f', roughness: 1 }),
    foliage: std({ vertexColors: true, roughness: 0.9 }),
    lampHead: new THREE.MeshStandardMaterial({ color: '#f3efe0', emissive: '#fff2c4', emissiveIntensity: 0.5 }),
    wallA: std({ color: '#d9ccb8', roughness: 0.95 }),
    wallWhite: std({ color: '#ffffff', roughness: 0.95 }),
    wallB: std({ color: '#c9b9a6', roughness: 0.95 }),
    wallC: std({ color: '#cfd2cf', roughness: 0.95 }),
    windowDark: std({ color: '#33414b', roughness: 0.2, metalness: 0.3 }),
    mist: new THREE.PointsMaterial({ color: '#eef6fa', size: 0.7, sizeAttenuation: true, transparent: true, opacity: 0.2, depthWrite: false }),
    expansion: new THREE.MeshBasicMaterial({ color: '#e0803a', transparent: true, opacity: 0.18, depthWrite: false }),
    ring: new THREE.MeshBasicMaterial({ color: '#ffb347', transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide }),
    groundFar: std({ color: '#9a9a92', roughness: 1 }),
    invisible: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  };
}
