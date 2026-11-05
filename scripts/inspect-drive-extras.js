const { execSync } = require('child_process');
const fs = require('fs');

const extraFolders = [
  { name: 'Bottons', id: '163arVPVf6uQdF_oVtfbBzVWX4vVzGbgs' },
  { name: 'Camisas', id: '1hre7Jg3htlT_3FShluuvSQ8-ByiuqcrM' },
  { name: 'Ideias_inspiracoes', id: '1TiIe85lMyesg5Ye4lG1QkrcfuYlMxFL7' },
  { name: 'Rascunhos', id: '1aGDTFxKngrGVtvbPD5IqbRBnl_-CJfJt' }
];

extraFolders.forEach(f => {
  console.log(`\nScanning ${f.name} (${f.id})...`);
  try {
    const html = execSync(`curl.exe -Ls "https://drive.google.com/drive/folders/${f.id}"`, { maxBuffer: 15 * 1024 * 1024 }).toString('utf-8');
    const chunks = html.split(/\[\[null,"([a-zA-Z0-9_-]{25,})"\]/);
    const items = [];
    for (let i = 1; i < chunks.length; i += 2) {
      const id = chunks[i];
      const chunk = chunks[i + 1] ? chunks[i + 1].slice(0, 1500) : '';
      const nameMatch = chunk.match(/\[\[\["([^"\\]+)",null,1\]\]\]/);
      const mimeMatch = chunk.match(/"(application\/[^"]+|image\/[^"]+|text\/[^"]+|video\/[^"]+)"/);
      if (nameMatch) {
        items.push({ id, name: nameMatch[1], mime: mimeMatch ? mimeMatch[1] : 'unknown' });
      }
    }
    const seen = new Set();
    const unique = items.filter(it => !seen.has(it.id) && seen.add(it.id));
    console.log(`Found ${unique.length} items in ${f.name}:`);
    unique.forEach(it => console.log(`  - [${it.mime}] ${it.name} (${it.id})`));
  } catch (e) {
    console.error(`Error in ${f.name}:`, e.message);
  }
});

// Download 'Organização dentro do Vs Code'
try {
  console.log('Downloading Organização dentro do Vs Code.png...');
  execSync(`curl.exe -Ls "https://drive.usercontent.google.com/download?id=1ldPI-1hb9lsJnjvyHOW6FHZsNXRbr2il&export=download&confirm=t" -o "canonical-drive-site/assets/organizacao_vscode.png"`);
  const sz = fs.statSync("canonical-drive-site/assets/organizacao_vscode.png").size;
  console.log(`Downloaded organizacao_vscode.png: ${sz} bytes`);
} catch (e) {
  console.error('Failed to download organizacao_vscode.png:', e.message);
}
