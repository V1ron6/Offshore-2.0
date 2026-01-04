#!/bin/bash
# linux_macos_setup.sh - Offshore E-Commerce Project Setup

echo "============================================"
echo "   Offshore E-Commerce Project Setup"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Install backend dependencies
echo "[1/4] Installing backend dependencies..."
cd "$PROJECT_ROOT/servers" && npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "[2/4] Installing frontend dependencies..."
cd "$PROJECT_ROOT/client" && npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi

# Environment setup
echo "[3/4] Creating environment files..."
cd "$PROJECT_ROOT"

if [ ! -f servers/.env ]; then
    if [ -f servers/.env.example ]; then
        cp servers/.env.example servers/.env
        echo "Created servers/.env from example"
    else
        echo "PORT=4000" > servers/.env
        echo "JWT_SECRET=your-secret-key" >> servers/.env
        echo "Created default servers/.env"
    fi
fi

if [ ! -f client/.env ]; then
    if [ -f client/.env.example ]; then
        cp client/.env.example client/.env
        echo "Created client/.env from example"
    else
        echo "VITE_API_URL=http://localhost:4000/api" > client/.env
        echo "Created default client/.env"
    fi
fi

echo ""
echo "[4/4] Setup complete!"
echo "============================================"
echo "Starting development servers..."
echo "   Backend:  http://localhost:4000"
echo "   Frontend: http://localhost:5173"
echo "============================================"
echo ""

# Detect the terminal and open frontend & backend
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd '"$PROJECT_ROOT"'/servers && npm run dev"' &
    sleep 2
    osascript -e 'tell app "Terminal" to do script "cd '"$PROJECT_ROOT"'/client && npm run dev"' &
elif [[ -n "$DISPLAY" ]]; then
    # Linux with GUI
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd $PROJECT_ROOT/servers && npm run dev; exec bash" &
        sleep 2
        gnome-terminal -- bash -c "cd $PROJECT_ROOT/client && npm run dev; exec bash" &
    elif command -v konsole &> /dev/null; then
        konsole -e bash -c "cd $PROJECT_ROOT/servers && npm run dev; exec bash" &
        sleep 2
        konsole -e bash -c "cd $PROJECT_ROOT/client && npm run dev; exec bash" &
    elif command -v xterm &> /dev/null; then
        xterm -e "cd $PROJECT_ROOT/servers && npm run dev; bash" &
        sleep 2
        xterm -e "cd $PROJECT_ROOT/client && npm run dev; bash" &
    else
        echo "No supported terminal found. Starting servers in background..."
        cd "$PROJECT_ROOT/servers" && npm run dev &
        sleep 2
        cd "$PROJECT_ROOT/client" && npm run dev &
    fi
else
    echo "No display found, running servers in current terminal..."
    echo "Starting backend server..."
    cd "$PROJECT_ROOT/servers" && npm run dev &
    BACKEND_PID=$!
    sleep 2
    echo "Starting frontend server..."
    cd "$PROJECT_ROOT/client" && npm run dev &
    FRONTEND_PID=$!
    
    echo ""
    echo "Servers running in background."
    echo "Press Ctrl+C to stop all servers."
    
    # Wait for both processes
    wait $BACKEND_PID $FRONTEND_PID
fi

echo "Development servers started!"
