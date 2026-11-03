@echo off
chcp 65001 > nul
title V.I.D.A. — Stand Feira de Ciências (Parque Realengo)

echo ================================================================
echo    🌿 PROJETO V.I.D.A. — EXPERIÊNCIA INTERATIVA MULTITELA
echo       Parque Realengo Jornalista Susana Naspolini • Stand
echo ================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js não foi encontrado no sistema!
    echo Por favor, instale o Node.js para executar a sincronização em tempo real.
    echo.
    echo Pressione qualquer tecla para sair...
    pause > nul
    exit /b 1
)

echo [1/2] Abrindo a TELA 1 (Televisão do Stand) no navegador...
start http://localhost:3000/

echo [2/2] Iniciando Servidor Local e WebSocket na porta 3000...
echo.
echo ================================================================
echo  ✅ STAND V.I.D.A. EM EXECUÇÃO!
echo.
echo  🖥️  TELA 1 (Televisão): http://localhost:3000/
echo  📱 TELA 2 (Celular):    Aponte a câmera para o QR Code da TV
echo                         ou acesse o link exibido no terminal.
echo.
echo  Para encerrar o servidor, feche esta janela do prompt de comando.
echo ================================================================
echo.

node server.js
