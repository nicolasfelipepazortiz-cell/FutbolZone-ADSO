@echo off
title FutbolZone Stopper
color 0C
echo =========================================================
echo    🛑 DETENIENDO SERVIDORES DE FUTBOLZONE...
echo =========================================================
echo.

taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul

echo.
echo ✅ Todos los servidores (Backend y Frontend) han sido apagados.
echo.
pause
