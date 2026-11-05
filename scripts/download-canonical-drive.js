const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getFolderItems(folderId, folderName) {
  console.log(`\nScanning folder ${folderName} (${folderId})...`);
  const html = execSync(`curl.exe -Ls "https://drive.google.com/drive/folders/${folderId}"`, { maxBuffer: 15 * 1024 * 1024 }).toString('utf-8');
  
  const items = [];
  const chunks = html.split(/\[\[null,"([a-zA-Z0-9_-]{25,})"\]/);
  for (let i = 1; i < chunks.length; i += 2) {
    const id = chunks[i];
    const chunk = chunks[i + 1] ? chunks[i + 1].slice(0, 1500) : '';
    const nameMatch = chunk.match(/\[\[\["([^"\\]+)",null,1\]\]\]/);
    const mimeMatch = chunk.match(/"(application\/[^"]+|image\/[^"]+|text\/[^"]+|video\/[^"]+)"/);
    if (nameMatch) {
      items.push({
        id,
        name: nameMatch[1],
        mime: mimeMatch ? mimeMatch[1] : 'unknown'
      });
    }
  }

  // Deduplicate by ID
  const uniqueItems = [];
  const seen = new Set();
  items.forEach(it => {
    if (!seen.has(it.id)) {
      seen.add(it.id);
      uniqueItems.push(it);
    }
  });

  console.log(`Found ${uniqueItems.length} items in ${folderName}:`);
  uniqueItems.forEach(it => console.log(`  - ${it.name} (${it.mime}) [${it.id}]`));
  return uniqueItems;
}

const targetBase = path.resolve('canonical-drive-site');
if (!fs.existsSync(targetBase)) fs.mkdirSync(targetBase, { recursive: true });

// Copy already downloaded index.html
fs.copyFileSync('scripts/drive_site_index.html', path.join(targetBase, 'index.html'));

const subfolders = [
  { name: 'css', id: '1yB4RgK0x1xYkj8WEGuzFI_DIsrEJ0YUH' },
  { name: 'js', id: '1OUhEhi0DM3E-hD8mvt19KYaoKOTCvXlE' },
  { name: 'vendor', id: '18BY0LFbqNqDEz8MB1pzjKaspK-qLkjHw' }
];

subfolders.forEach(sub => {
  const dirPath = path.join(targetBase, sub.name);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  const items = getFolderItems(sub.id, sub.name);
  items.forEach(item => {
    const filePath = path.join(dirPath, item.name);
    console.log(`Downloading ${item.name} to ${filePath}...`);
    try {
      execSync(`curl.exe -Ls "https://drive.usercontent.google.com/download?id=${item.id}&export=download" -o "${filePath}"`);
      const stat = fs.statSync(filePath);
      console.log(`  -> Downloaded ${stat.size} bytes`);
    } catch (e) {
      console.error(`  -> Failed to download ${item.name}:`, e.message);
    }
  });
});

console.log('\nAll canonical Drive site files downloaded!');
