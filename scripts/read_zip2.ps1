Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('C:\Users\Daniz\Downloads\Projetec 3 (2).zip')
foreach ($entry in $zip.Entries) {
    if ($entry.Name -eq 'index.html' -or $entry.Name -eq 'script.js') {
        Write-Host "$($entry.FullName) ($($entry.Length) bytes) [$($entry.LastWriteTime)]"
        if ($entry.FullName -eq 'Projetec 3/index.html') {
            $stream = $entry.Open()
            $reader = New-Object System.IO.StreamReader($stream)
            $text = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
            [System.IO.File]::WriteAllText('C:\Users\Daniz\Downloads\Projetec 3\scripts\zip2_index.html', $text)
            Write-Host "Extracted to scripts\zip2_index.html"
        }
    }
}
$zip.Dispose()
