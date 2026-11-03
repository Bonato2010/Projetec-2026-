# PROJETO V.I.D.A. — INICIADOR STAND MULTITELA (PowerShell)
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "================================================================" -ForegroundColor Green
Write-Host "   🌿 PROJETO V.I.D.A. — EXPERIÊNCIA INTERATIVA MULTITELA       " -ForegroundColor White
Write-Host "      Parque Realengo Jornalista Susana Naspolini • Stand       " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] Node.js não foi encontrado no PATH do sistema!" -ForegroundColor Red
    Write-Host "Instale o Node.js v18+ para executar o servidor do stand." -ForegroundColor Yellow
    Exit 1
}

Write-Host "[1/2] Iniciando Servidor Local V.I.D.A. na porta 3000..." -ForegroundColor Cyan

Start-Process -FilePath "http://localhost:3000/"

Write-Host "[2/2] Servidor pronto e conectado!" -ForegroundColor Green
Write-Host ""
Write-Host "Para visitantes:" -ForegroundColor White
Write-Host "Aponte a câmera do celular para o QR Code na TV do Stand." -ForegroundColor Gray
Write-Host "Pressione Ctrl+C para encerrar o servidor quando a feira terminar." -ForegroundColor Yellow
Write-Host ""

node server.js
