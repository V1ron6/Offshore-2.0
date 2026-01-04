
‎@echo off
‎REM windows_setup.bat
‎
‎echo Setting up e-commerce project...
‎
‎REM Install backend dependencies
‎echo Installing backend dependencies...
‎cd servers
‎call npm install
‎cd ..
‎
‎REM Install frontend dependencies
‎echo Installing frontend dependencies...
‎cd frontend
‎call npm install
‎cd ..
‎
‎REM Environment setup
‎echo Creating environment files...
‎if not exist servers\.env (
‎    if exist servers\.env.example (
‎        copy servers\.env.example servers\.env
‎    ) else (
‎        echo No .env.example found for backend
‎    )
‎)
‎
‎if not exist frontend\.env (
‎    if exist frontend\.env.example (
‎        copy frontend\.env.example frontend\.env
‎    ) else (
‎        echo No .env.example found for frontend
‎    )
‎)
‎
‎echo Setup complete!
‎echo Starting development servers...
‎
‎REM Start backend in new window
‎start "Backend Server" cmd /k "cd servers && npm run dev"
‎
‎REM Start frontend in new window
‎start "Frontend Server" cmd /k "cd frontend && npm run dev"
‎
‎echo Development servers started!
‎pause
‎
