const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const psCmd = `powershell -NoProfile -Command "
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead('C:\\Users\\Daniz\\Downloads\\Projetec 3 (2).zip')
    foreach ($entry in $zip.Entries) {
      if ($entry.FullName.EndsWith('index.html') -or $entry.FullName.EndsWith('script.js') -or $entry.FullName.Contains('parque')) {
        Write-Host ($entry.FullName + ' - ' + $entry.Length + ' bytes - ' + $entry.LastWriteTime)
      }
    }
  "`;
  console.log(execSync(psCmd, { encoding: 'utf-8' }));
} catch (e) {
  console.error(e);
}
