const { execSync } = require('child_process');
const fs = require('fs');

const folders = [
  { name: 'Logo-Solaris', id: '1cblbt0GYZ8wEd0sI-1P-7A0d1MC6pxfG' },
  { name: 'Pesquisa e produção', id: '1vEfYpK_HeHWFcme2jmi_kvIwtYnE6nIB' },
  { name: 'Tecnologia', id: '1-HL_v55NO8OsFA0tnmWI0RjdSA344nq6' }
];

const results = {};

folders.forEach(f => {
  console.log(`=== Fetching Folder: ${f.name} (${f.id}) ===`);
  try {
    const html = execSync(`curl.exe -Ls "https://drive.google.com/drive/folders/${f.id}"`, { maxBuffer: 15 * 1024 * 1024 }).toString('utf-8');
    
    // Extract file names and IDs embedded in the initial data payload
    const nameMatches = [...html.matchAll(/\[\[\["([^"\\]+)",null,1\]\]\]/g)].map(m => m[1]);
    const fileEntries = [];
    
    // Match patterns like [[null, "FILE_ID"], null, null, null, "MIME_TYPE" ... "FILE_NAME"
    const regex = /\[\[null,"([a-zA-Z0-9_-]{20,})"\],[^,]+,[^,]+,[^,]+,"([^"]+)",(?:[^,]+,){1,30}?\[\[\["([^"]+)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      fileEntries.push({ id: match[1], mime: match[2], name: match[3] });
    }

    results[f.name] = {
      names: [...new Set(nameMatches)],
      entries: fileEntries
    };
    console.log(`Found ${nameMatches.length} raw names, unique:`, [...new Set(nameMatches)]);
  } catch (e) {
    console.error(`Error fetching folder ${f.name}:`, e.message);
  }
});

fs.writeFileSync('scripts/drive-contents.json', JSON.stringify(results, null, 2));
console.log('Saved to scripts/drive-contents.json');
