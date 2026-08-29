@echo off
title FutbolZone Launcher
color 0A
echo =========================================================
echo    ⚽ INICIANDO FUTBOLZONE FULLSTACK (SENA ADSO III) ⚽
echo =========================================================
echo.

echo [1/2] Iniciando Servidor Backend (FastAPI en Puerto 5000)...
start "FutbolZone - Backend API" cmd /k "cd /d %~dp0backend && python main.py"

timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Servidor Frontend (Vite React en Puerto 5173)...
start "FutbolZone - Frontend Web" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo =========================================================
echo  🚀 ¡Servidores iniciados! Abriendo navegador...
echo =========================================================
start http://localhost:5173

echo.
echo No cierres las ventanas de Backend y Frontend mientras uses la app.
echo Para detener todo, simplemente cierra las ventanas o ejecuta detener_proyecto.bat.
pause
