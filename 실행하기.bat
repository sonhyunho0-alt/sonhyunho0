@echo off
title Jieun Timer Engine

echo ===================================================
echo   Starting Jieun Timer...
echo ===================================================

set "PROJECT_DIR=%~dp0"
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

subst V: /d >nul 2>&1
subst W: /d >nul 2>&1
subst Y: /d >nul 2>&1

subst V: "%PROJECT_DIR%"
if not errorlevel 1 (
    set DRIVE=V:
    goto start_server
)

subst W: "%PROJECT_DIR%"
if not errorlevel 1 (
    set DRIVE=W:
    goto start_server
)

subst Y: "%PROJECT_DIR%"
if not errorlevel 1 (
    set DRIVE=Y:
    goto start_server
)

echo [ERROR] Failed to map drive.
pause
exit /b

:start_server
%DRIVE%
cd \

start /b "" "C:\Users\AMD5600\.node_portable22\node-v22.12.0-win-x64\node.exe" node_modules\vite\bin\vite.js

echo.
echo [INFO] Waiting for server...
ping 127.0.0.1 -n 3 >nul

echo [INFO] Launching Jieun Timer app window...
start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:5173/

echo.
echo ===================================================
echo   * Jieun Timer is running! *
echo.
echo   Press any key in this window to close the timer.
echo ===================================================
echo.
pause

echo Cleaning up...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr 5173 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
subst %DRIVE% /d >nul 2>&1
exit
