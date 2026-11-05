const { execSync } = require('child_process');
const fs = require('fs');

function inspectFolder(folderId, folderName) {
  console.log(`\n=== Scanning: ${folderName} (${folderId}) ===`);
  const html = execSync(`curl.exe -Ls "https://drive.google.com/drive/folders/${folderId}"`, { maxBuffer: 15 * 1024 * 1024 }).toString('utf-8');
  
  // Look for items: [[null, "ID"], null, null, null, "TYPE", ... [[["NAME", null, 1]]]
  // Or match ID followed soon by name
  const items = [];
  const itemRegex = /\[\[null,"([a-zA-Z0-9_-]{25,})"\],[^\]]*?"([^"]+)"[^\]]*?\[\[\["([^"\\]+)",null,1\]\]\]/g;
  
  // More general approach: search for folder/file IDs
  // In Google Drive HTML: [null, "ID"] ... [[["Name", null, 1]]]
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

  console.log(`Found ${items.length} items in ${folderName}:`);
  items.forEach(it => console.log(`  - [${it.mime}] ${it.name} (ID: ${it.id})`));
  return items;
}

// 1. Scan Tecnologia (ID: 1-HL_v55NO8OsFA0tnmWI0RjdSA344nq6)
const tecItems = inspectFolder('1-HL_v55NO8OsFA0tnmWI0RjdSA344nq6', 'Tecnologia');

// 2. Scan Logo-Solaris (ID: 1cblbt0GYZ8wEd0sI-1P-7A0d1MC6pxfG)
const logoItems = inspectFolder('1cblbt0GYZ8wEd0sI-1P-7A0d1MC6pxfG', 'Logo-Solaris');

// 3. Scan Pesquisa e produção (ID: 1vEfYpK_HeHWFcme2jmi_kvIwtYnE6nIB)
const pesqItems = inspectFolder('1vEfYpK_HeHWFcme2jmi_kvIwtYnE6nIB', 'Pesquisa e producao');

fs.writeFileSync('scripts/drive-deep-scan.json', JSON.stringify({ tecItems, logoItems, pesqItems }, null, 2));
