@echo off
title BK Pipocas Gourmet - Servidor Local
color 0A

echo ========================================================
echo        BK PIPOCAS GOURMET - SERVIDOR LOCAL
echo ========================================================
echo.
echo Iniciando o servidor web local...
echo O cardapio sera aberto automaticamente no seu navegador.
echo.
echo Para fechar o servidor, basta fechar esta janela.
echo ========================================================
echo.

:: Abre o navegador no endereço local após 2 segundos em segundo plano
start "" cmd /c "timeout /t 2 >nul & start http://localhost:3000"

:: Executa o npx serve na porta 3000
npx -y serve -l 3000

pause
