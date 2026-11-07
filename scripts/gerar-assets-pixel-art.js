const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ASSETS_DIR = path.resolve(ROOT_DIR, 'prototipos', 'pixel-art-2d', 'assets');

const subdirs = [
  'images',
  'backgrounds',
  'sprites',
  'characters',
  'environment',
  'interface'
];

subdirs.forEach(sub => {
  const d = path.join(ASSETS_DIR, sub);
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

// Helper to create pixel-art style SVG files that render crisp and clean
function createSvgAsset(filename, svgContent) {
  const filePath = path.join(ASSETS_DIR, filename);
  fs.writeFileSync(filePath, svgContent, 'utf8');
  console.log(`✓ Gerado asset: ${filename}`);
}

// 1. Background Skyline Pixel Art
createSvgAsset('backgrounds/city-skyline.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#070d18"/>
      <stop offset="50%" stop-color="#0d1f35"/>
      <stop offset="100%" stop-color="#1b3a4b"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#sky)"/>
  <!-- Mountain silhouette (Pedra Branca / Tijuca) -->
  <polygon points="0,1080 0,650 250,520 450,580 750,420 1000,500 1350,380 1650,480 1920,400 1920,1080" fill="#0d1627"/>
  <!-- City buildings in pixel grid -->
  <rect x="100" y="450" width="120" height="630" fill="#101828"/>
  <rect x="250" y="380" width="160" height="700" fill="#162238"/>
  <rect x="440" y="320" width="140" height="760" fill="#0f172a"/>
  <rect x="610" y="400" width="180" height="680" fill="#1e293b"/>
  <rect x="820" y="280" width="200" height="800" fill="#0d1627"/>
  <rect x="1050" y="350" width="150" height="730" fill="#162238"/>
  <rect x="1230" y="300" width="190" height="780" fill="#0f172a"/>
  <rect x="1450" y="420" width="160" height="660" fill="#1e293b"/>
  <rect x="1640" y="360" width="220" height="720" fill="#101828"/>
  <!-- Glowing windows -->
  <fill color="#fbbf24"/>
  <g fill="#fbbf24" opacity="0.85">
    <rect x="120" y="480" width="12" height="16" /><rect x="140" y="480" width="12" height="16" /><rect x="160" y="480" width="12" height="16"/>
    <rect x="280" y="420" width="14" height="18" /><rect x="310" y="420" width="14" height="18" /><rect x="340" y="420" width="14" height="18"/>
    <rect x="470" y="360" width="14" height="18" /><rect x="500" y="360" width="14" height="18"/>
    <rect x="650" y="450" width="16" height="20" /><rect x="680" y="450" width="16" height="20"/>
    <rect x="860" y="320" width="16" height="22" /><rect x="900" y="320" width="16" height="22"/><rect x="940" y="320" width="16" height="22"/>
  </g>
</svg>
`);

// 2. Vehicle Sprite - Bus
createSvgAsset('sprites/vehicle-bus.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 60" width="140" height="60">
  <rect x="2" y="10" width="136" height="42" rx="6" fill="#f59e0b" stroke="#b45309" stroke-width="3"/>
  <rect x="12" y="16" width="22" height="18" rx="2" fill="#38bdf8"/>
  <rect x="40" y="16" width="22" height="18" rx="2" fill="#38bdf8"/>
  <rect x="68" y="16" width="22" height="18" rx="2" fill="#38bdf8"/>
  <rect x="96" y="16" width="32" height="18" rx="2" fill="#38bdf8"/>
  <circle cx="28" cy="52" r="10" fill="#1e293b" stroke="#cbd5e1" stroke-width="3"/>
  <circle cx="112" cy="52" r="10" fill="#1e293b" stroke="#cbd5e1" stroke-width="3"/>
</svg>
`);

// 3. Vehicle Sprite - Police Cruiser
createSvgAsset('sprites/vehicle-police.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 40" width="90" height="40">
  <rect x="2" y="8" width="86" height="26" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <path d="M22,8 L32,2 L62,2 L72,8 Z" fill="#1e293b"/>
  <rect x="30" y="4" width="8" height="6" fill="#ef4444"/>
  <rect x="52" y="4" width="8" height="6" fill="#3b82f6"/>
  <circle cx="20" cy="34" r="7" fill="#020617" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="70" cy="34" r="7" fill="#020617" stroke="#94a3b8" stroke-width="2"/>
</svg>
`);

// 4. Character Sprite - Pedestrian
createSvgAsset('characters/pedestrian.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48" width="32" height="48">
  <circle cx="16" cy="8" r="6" fill="#fcd34d"/>
  <rect x="10" y="15" width="12" height="18" rx="3" fill="#3b82f6"/>
  <rect x="12" y="33" width="3" height="12" fill="#1e293b"/>
  <rect x="17" y="33" width="3" height="12" fill="#1e293b"/>
</svg>
`);

// 5. Environment Tree - Atlantic Forest / Palm
createSvgAsset('environment/tree-atlantic.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 90" width="60" height="90">
  <rect x="26" y="50" width="8" height="38" fill="#78350f"/>
  <circle cx="30" cy="35" r="22" fill="#059669"/>
  <circle cx="18" cy="28" r="14" fill="#10b981"/>
  <circle cx="42" cy="28" r="14" fill="#34d399"/>
</svg>
`);

console.log('✅ Todos os assets gráficos do Pixel Art 2D foram gerados com sucesso em prototipos/pixel-art-2d/assets/');
