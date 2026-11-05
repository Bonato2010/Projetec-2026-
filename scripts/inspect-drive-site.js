const { execSync } = require('child_process');
const fs = require('fs');

function inspectFolder(folderId, folderName) {
  console.log(`\n=== Scanning: ${folderName} (${folderId}) ===`);
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

  console.log(`Found ${uniqueItems.length} unique items in ${folderName}:`);
  uniqueItems.forEach(it => console.log(`  - [${it.mime}] ${it.name} (ID: ${it.id})`));
  return uniqueItems;
}

// 1. Scan Site (ID: 189ppBnJRodSh-UExiPQnkwziaKBzybr6)
const siteItems = inspectFolder('189ppBnJRodSh-UExiPQnkwziaKBzybr6', 'Site');

// 2. Scan Pesquisa (ID: 1-gMfUVazO8qqnV9HmvTqYq3oLMKlXSa2)
const pesqItems = inspectFolder('1-gMfUVazO8qqnV9HmvTqYq3oLMKlXSa2', 'Pesquisa');

// 3. Scan Cartaz (ID: 14Sj6XxwkU3_TLw1ppwvOlGhgEWZhCCk0)
const cartazItems = inspectFolder('14Sj6XxwkU3_TLw1ppwvOlGhgEWZhCCk0', 'Cartaz');

fs.writeFileSync('scripts/drive-site-items.json', JSON.stringify({ siteItems, pesqItems, cartazItems }, null, 2));
