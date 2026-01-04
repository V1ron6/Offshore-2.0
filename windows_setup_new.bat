@echo off
REM windows_setup.bat - Offshore E-Commerce Project Setup

echo ============================================
echo    Offshore E-Commerce Project Setup
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Install backend dependencies
echo [1/4] Installing backend dependencies...
cd servers
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Install frontend dependencies
echo [2/4] Installing frontend dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

REM Environment setup
echo [3/4] Creating environment files...
if not exist servers\.env (
    if exist servers\.env.example (
        copy servers\.env.example servers\.env
        echo Created servers\.env from example
    ) else (
        echo PORT=4000> servers\.env
        echo JWT_SECRET=your-secret-key>> servers\.env
        echo Created default servers\.env
    )
)

if not exist client\.env (
    if exist client\.env.example (
        copy client\.env.example client\.env
        echo Created client\.env from example
    ) else (
        echo VITE_API_URL=http://localhost:4000/api> client\.env
        echo Created default client\.env
    )
)

echo.
echo [4/4] Setup complete!
echo ============================================
echo Starting development servers...
echo    Backend:  http://localhost:4000
echo    Frontend: http://localhost:5173
echo ============================================
echo.

REM Start backend in new window
start "Backend Server - Port 4000" cmd /k "cd servers && npm run dev"

REM Wait a moment for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend in new window
start "Frontend Server - Port 5173" cmd /k "cd client && npm run dev"

echo Development servers started in separate windows!
echo.
echo Press any key to close this setup window...
pause >nul
