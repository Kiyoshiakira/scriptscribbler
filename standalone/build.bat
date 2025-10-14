@echo off
REM Script Scribbler Standalone - Build Script for Windows

echo ================================================
echo Script Scribbler - Standalone Build Script
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if we're in the standalone directory
if not exist "package.json" (
    echo ERROR: This script must be run from the standalone directory!
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

echo What would you like to do?
echo 1) Run the application (development mode)
echo 2) Build for Windows
echo 3) Build for all platforms
echo 4) Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo Starting Script Scribbler...
    call npm start
) else if "%choice%"=="2" (
    echo Building for Windows...
    call npm run build:win
    echo Build complete! Check the dist\ folder.
    pause
) else if "%choice%"=="3" (
    echo Building for all platforms...
    call npm run build:all
    echo Build complete! Check the dist\ folder.
    pause
) else if "%choice%"=="4" (
    echo Exiting...
    exit /b 0
) else (
    echo Invalid choice!
    pause
    exit /b 1
)
