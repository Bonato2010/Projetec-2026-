const fs = require('fs');
const path = require('path');

function copyFileSafe(src, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${path.basename(src)} -> ${dest}`);
  } else {
    console.warn(`Source not found: ${src}`);
  }
}

const siteInfDir = path.resolve('site-informativo');
const assetsDir = path.join(siteInfDir, 'assets');

// 1. Logos
copyFileSafe('site/public/assets/logo-vida-simbolo-transparente.png', path.join(assetsDir, 'logos', 'logo-vida-simbolo-transparente.png'));
copyFileSafe('site/public/assets/logo-vida-original.png', path.join(assetsDir, 'logos', 'logo-vida-original.png'));
copyFileSafe('site/public/assets/logo-vida-simbolo.png', path.join(assetsDir, 'logos', 'logo-vida-simbolo.png'));
copyFileSafe('canonical-drive-site/assets/Logo-Solaris.jpg', path.join(assetsDir, 'logos', 'logo-solaris.jpg'));

// 2. Real Team Materials from Drive (Camisas, Bottons, Pesquisa)
copyFileSafe('canonical-drive-site/assets/camisas/camisa_enfermagem.jpg', path.join(assetsDir, 'equipe', 'camisa_enfermagem.jpg'));
copyFileSafe('canonical-drive-site/assets/camisas/camisa_informatica.jpg', path.join(assetsDir, 'equipe', 'camisa_informatica.jpg'));
copyFileSafe('canonical-drive-site/assets/camisas/camisa_prof_amanda.jpg', path.join(assetsDir, 'equipe', 'camisa_prof_amanda.jpg'));
copyFileSafe('canonical-drive-site/assets/bottons/botton_prof_amanda.jpg', path.join(assetsDir, 'equipe', 'botton_prof_amanda.jpg'));
copyFileSafe('canonical-drive-site/assets/bottons/botton_daniel.png', path.join(assetsDir, 'equipe', 'botton_daniel.png'));
copyFileSafe('canonical-drive-site/assets/bottons/botton_hiasmin.png', path.join(assetsDir, 'equipe', 'botton_hiasmin.png'));

// 3. Research & Concept Art from Drive
copyFileSafe('canonical-drive-site/assets/pesquisa/ecocity_arte_1.png', path.join(assetsDir, 'pesquisa', 'ecocity_arte_1.png'));
copyFileSafe('canonical-drive-site/assets/pesquisa/ecocity_arte_2.png', path.join(assetsDir, 'pesquisa', 'ecocity_arte_2.png'));
copyFileSafe('canonical-drive-site/assets/pesquisa/ecocity_arte_3.jpg', path.join(assetsDir, 'pesquisa', 'ecocity_arte_3.jpg'));
copyFileSafe('canonical-drive-site/assets/pesquisa/ecocity_arte_4.jpg', path.join(assetsDir, 'pesquisa', 'ecocity_arte_4.jpg'));
copyFileSafe('canonical-drive-site/assets/pesquisa/cartaz_rascunho_1.jpg', path.join(assetsDir, 'pesquisa', 'cartaz_rascunho_1.jpg'));
copyFileSafe('canonical-drive-site/assets/pesquisa/cartaz_rascunho_2.jpg', path.join(assetsDir, 'pesquisa', 'cartaz_rascunho_2.jpg'));

// 4. High-Res 3D Master Renders of Parque Realengo
const renders = [
  '01-vista-aerea-geral.png',
  '02-perspectiva-obliqua.png',
  '03-super-torres-nebulizacao.png',
  '04-passarelas-e-mirantes.png',
  '05-lago-espelho-dagua.png',
  '06-nave-do-conhecimento.png',
  '07-praca-do-mercado.png',
  '08-anfiteatro-susana-naspolini.png',
  '09-skatepark-bowls.png',
  '10-campo-e-quadras.png',
  '11-bosque-mata-atlantica.png'
];

renders.forEach(r => {
  copyFileSafe(path.join('docs/evidencias/3d/depois', r), path.join(assetsDir, 'parque', r));
});

// 5. Vendor Three.js
copyFileSafe('canonical-drive-site/vendor/three.min.js', path.join(siteInfDir, 'vendor', 'three.min.js'));

console.log('Site assets assembled successfully!');
