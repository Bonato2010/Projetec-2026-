const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const driveFiles = [
  // Camisas
  { id: '1J4OYRJt85olLJ-eQbLR6xx7WbdO3SxtR', name: 'camisa_enfermagem.jpg', folder: 'camisas' },
  { id: '1ov1H1GrnMAqEaqD5TDbugZWDPst0MnPf', name: 'camisa_informatica.jpg', folder: 'camisas' },
  { id: '1WWiwnPweJBD0o9yWkWRL9xfPuLhn-Fgd', name: 'camisa_prof_amanda.jpg', folder: 'camisas' },
  // Bottons
  { id: '1_rLFMbCYYK9saTx40BVnCHn5dMGYGsYN', name: 'botton_prof_amanda.jpg', folder: 'bottons' },
  { id: '1aL5_NPctbTmsf-MsC0UX_uphfDC_3Mpq', name: 'botton_daniel.png', folder: 'bottons' },
  { id: '17ehMsk2t0JKWy8ZMwHZk3kv-4aYvlABY', name: 'botton_hiasmin.png', folder: 'bottons' },
  // Ideias e Inspirações Eco-City
  { id: '1O6XjhRO5nnJAKi_GQ7LOKVJYu19wmi55', name: 'ecocity_arte_1.png', folder: 'pesquisa' },
  { id: '1RiW8hXY0A3k-t_1YJHJnU2a7UZqhDbyj', name: 'ecocity_arte_2.png', folder: 'pesquisa' },
  { id: '1ClekX1I4esXIafDgDQk2y-nQIsciMcyJ', name: 'ecocity_arte_3.jpg', folder: 'pesquisa' },
  { id: '1v0nvcjU0vQw0T8aDytXBDryhbHg9WEGj', name: 'ecocity_arte_4.jpg', folder: 'pesquisa' },
  // Rascunhos de Cartazes
  { id: '1ZoJgCemkem0JMvXzkOwx_DaNNPJNTKbY', name: 'cartaz_rascunho_1.jpg', folder: 'pesquisa' },
  { id: '1dl2LgsSWg3NDNQAOL1UiIP0r2KMEqVf-', name: 'cartaz_rascunho_2.jpg', folder: 'pesquisa' }
];

driveFiles.forEach(f => {
  const dir = path.join('canonical-drive-site', 'assets', f.folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, f.name);
  console.log(`Downloading ${f.name} (ID: ${f.id})...`);
  try {
    execSync(`curl.exe -Ls "https://drive.usercontent.google.com/download?id=${f.id}&export=download&confirm=t" -o "${target}"`);
    console.log(`  -> ${f.name}: ${fs.statSync(target).size} bytes`);
  } catch (e) {
    console.error(`  -> Failed: ${f.name}:`, e.message);
  }
});
console.log('All real team materials downloaded from Google Drive!');
