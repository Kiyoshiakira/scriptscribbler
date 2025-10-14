@echo off
REM Script Scribbler Standalone - Verification Script
REM This script checks if your installation is ready

echo ================================================
echo Script Scribbler - Installation Verification
echo ================================================
echo.

set SUCCESS=0
set WARNINGS=0
set ERRORS=0

REM Check Node.js
echo Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% equ 0 (
    for /f "delims=" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js is installed: %NODE_VERSION%
    set /a SUCCESS+=1
) else (
    echo [ERROR] Node.js is not installed!
    echo    Please install from https://nodejs.org/
    set /a ERRORS+=1
)
echo.

REM Check npm
echo Checking npm installation...
where npm >nul 2>nul
if %errorlevel% equ 0 (
    for /f "delims=" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [OK] npm is installed: %NPM_VERSION%
    set /a SUCCESS+=1
) else (
    echo [ERROR] npm is not installed!
    echo    npm should come with Node.js
    set /a ERRORS+=1
)
echo.

REM Check if we're in the standalone directory
echo Checking directory...
if exist "package.json" if exist "main.js" (
    echo [OK] You are in the standalone directory
    set /a SUCCESS+=1
) else (
    echo [ERROR] You are NOT in the standalone directory!
    echo    Please navigate to the standalone directory
    set /a ERRORS+=1
)
echo.

REM Check if node_modules exists
echo Checking dependencies...
if exist "node_modules" (
    echo [OK] Dependencies are installed
    set /a SUCCESS+=1
    
    if exist "node_modules\electron" (
        echo [OK] Electron is installed
        set /a SUCCESS+=1
    ) else (
        echo [WARNING] Electron is not installed
        echo    Run: npm install
        set /a WARNINGS+=1
    )
) else (
    echo [WARNING] Dependencies not installed
    echo    Run: npm install
    set /a WARNINGS+=1
)
echo.

REM Check required files
echo Checking required files...
set FILES=main.js preload.js index.html index.js styles.css package.json
for %%f in (%FILES%) do (
    if exist "%%f" (
        echo [OK] %%f exists
        set /a SUCCESS+=1
    ) else (
        echo [ERROR] %%f is missing!
        set /a ERRORS+=1
    )
)
echo.

REM Summary
echo ================================================
echo Verification Summary
echo ================================================
echo Successes: %SUCCESS%
if %WARNINGS% gtr 0 echo Warnings: %WARNINGS%
if %ERRORS% gtr 0 echo Errors: %ERRORS%
echo.

REM Final recommendation
if %ERRORS% equ 0 (
    if %WARNINGS% equ 0 (
        echo [OK] Everything looks good!
        echo.
        echo You can run the application with:
        echo   npm start
        echo.
        echo Or use the build script:
        echo   build.bat
    ) else (
        echo [WARNING] Some warnings found
        echo.
        echo You may need to run:
        echo   npm install
        echo.
        echo Then try: npm start
    )
) else (
    echo [ERROR] Some errors need to be fixed
    echo.
    echo Please fix the errors above and try again.
    echo.
    echo For help, see:
    echo   - BEGINNERS_GUIDE.md
    echo   - INSTALLATION.md
)
echo.
pause
