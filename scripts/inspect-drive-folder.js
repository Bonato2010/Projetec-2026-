const { execSync } = require('child_process');
const fs = require('fs');

const folderId = '1nshq3aJ9pQn_FvRGcPoIHGn6h_zUz2mK';
console.log(`Fetching Drive Folder: ${folderId}`);

try {
  const html = execSync(`curl.exe -Ls "https://drive.google.com/drive/folders/${folderId}"`, { maxBuffer: 30 * 1024 * 1024 }).toString('utf-8');
  fs.writeFileSync('scripts/drive_folder_raw.html', html);
  console.log(`Saved HTML, length: ${html.length}`);

  // Regex extract
  const regex = /\[\[null,"([a-zA-Z0-9_-]{20,})"\],[^,]+,[^,]+,[^,]+,"([^"]+)",(?:[^,]+,){1,30}?\[\[\["([^"]+)"/g;
  let match;
  const entries = [];
  while ((match = regex.exec(html)) !== null) {
    entries.push({ id: match[1], mime: match[2], name: match[3] });
  }

  // Also general names
  const nameMatches = [...html.matchAll(/\[\[\["([^"\\]+)",null,1\]\]\]/g)].map(m => m[1]);
  console.log('Unique names:', [...new Set(nameMatches)]);
  console.log('Entries found:', entries);

  fs.writeFileSync('scripts/drive_folder_items.json', JSON.stringify({ names: [...new Set(nameMatches)], entries }, null, 2));
} catch (e) {
  console.error('Error:', e.message);
}
