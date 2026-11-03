const fs = require('fs');
const { execSync } = require('child_process');

// We have powershell to read entries without crashing
const psScript = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('C:\\Users\\Daniz\\Downloads\\Projetec 3 (2).zip')
$entry = $zip.GetEntry('Projetec 3/index.html')
if ($entry) {
  $stream = $entry.Open()
  $reader = New-Object System.IO.StreamReader($stream)
  $text = $reader.ReadToEnd()
  $reader.Close()
  $stream.Close()
  [System.IO.File]::WriteAllText('C:\\Users\\Daniz\\Downloads\\Projetec 3\\scripts\\zip2_index.html', $text)
  Write-Host 'Wrote zip2_index.html, length: ' $text.Length
} else {
  Write-Host 'No Projetec 3/index.html found'
  foreach ($e in $zip.Entries) {
    if ($e.Name -eq 'index.html') {
      Write-Host 'Found: ' $e.FullName
    }
  }
}
$zip.Dispose()
`;

try {
  const out = execSync(`powershell -NoProfile -Command "${psScript.replace(/\n/g, ' ')}"`, { encoding: 'utf-8' });
  console.log(out);
} catch (e) {
  console.error(e);
}
