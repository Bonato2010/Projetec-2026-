# CENTRAL DE CAPTURA AUTOMÁTICA DE SCREENSHOTS — PROJETEC 2026
# Executa a suíte de captura via Node.js e Chrome Headless
Write-Host "Iniciando captura automatica de screenshots dos 3 prototipos..." -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot
node ./capturar.js
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nCapturas concluidas com sucesso! Abra index.html para visualizar a galeria." -ForegroundColor Green
} else {
    Write-Host "`nErro durante a captura de screenshots." -ForegroundColor Red
}
