
‎#!/bin/bash
‎# linux_macos_setup.sh
‎
‎echo "Setting up e-commerce project..."
‎
‎# Install backend dependencies
‎echo "Installing backend dependencies..."
‎cd servers && npm install
‎cd ..
‎
‎# Install frontend dependencies
‎echo "Installing frontend dependencies..."
‎cd frontend && npm install
‎cd ..
‎
‎# Environment setup
‎echo "Creating environment files..."
‎if [ ! -f servers/.env ]; then
‎    cp servers/.env.example servers/.env 2>/dev/null || echo "No .env.example found for backend"
‎fi
‎
‎if [ ! -f frontend/.env ]; then
‎    cp frontend/.env.example frontend/.env 2>/dev/null || echo "No .env.example found for frontend"
‎fi
‎
‎echo "Setup complete!"
‎echo "Starting development servers..."
‎
‎# Detect the terminal and open frontend & backend
‎if [[ "$OSTYPE" == "darwin"* ]]; then
‎    # macOS
‎    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/frontend && npm run dev"'
‎    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/servers && npm run dev"'
‎elif [[ -n "$DISPLAY" ]]; then
‎    # Linux with GUI
‎    if command -v gnome-terminal &> /dev/null; then
‎        gnome-terminal -- bash -c "cd $(pwd)/frontend && npm run dev; exec bash"
‎        gnome-terminal -- bash -c "cd $(pwd)/servers && npm run dev; exec bash"
‎    elif command -v xterm &> /dev/null; then
‎        xterm -e "cd $(pwd)/frontend && npm run dev; bash" &
‎        xterm -e "cd $(pwd)/servers && npm run dev; bash" &
‎    else
‎        echo "No supported terminal found"
‎    fi
‎else
‎    echo "No display found, running in current terminal"
‎    cd frontend && npm run dev &
‎    cd ../servers && npm run dev
‎fi
‎
‎echo "Development servers started!"
‎
