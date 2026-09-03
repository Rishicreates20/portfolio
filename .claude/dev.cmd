@echo off
set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0..\app"
node node_modules\vite\bin\vite.js --port 5173 --strictPort
