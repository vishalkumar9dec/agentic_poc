#!/bin/bash

# Start All Services for Ticket Management System
# This script starts both backend and frontend in separate terminal windows (macOS)

echo "=========================================="
echo "  Ticket Management System Launcher"
echo "=========================================="
echo ""

# Navigate to project root
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Project directory: $PROJECT_DIR"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check virtual environment
if [ ! -d "$PROJECT_DIR/venv" ]; then
    echo "❌ Error: Virtual environment not found!"
    echo "Please run: python -m venv venv"
    exit 1
fi

# Check .env file
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env with OPENAI_API_KEY"
    exit 1
fi

# Check frontend directory
if [ ! -d "$PROJECT_DIR/ticket-frontend" ]; then
    echo "❌ Error: ticket-frontend directory not found!"
    exit 1
fi

echo "✓ All prerequisites met"
echo ""

# Detect OS and terminal
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🚀 Starting services in new Terminal windows..."
    echo ""

    # Start backend in new Terminal window
    osascript <<EOF
tell application "Terminal"
    do script "cd '$PROJECT_DIR' && ./start_backend.sh"
    activate
end tell
EOF

    sleep 2

    # Start frontend in new Terminal window
    osascript <<EOF
tell application "Terminal"
    do script "cd '$PROJECT_DIR' && ./start_frontend.sh"
end tell
EOF

    echo "✅ Services started!"
    echo ""
    echo "📋 What's Running:"
    echo "   • AG-UI Backend:  http://localhost:8001 (Terminal 1)"
    echo "   • Next.js Frontend: http://localhost:3001 (Terminal 2)"
    echo ""
    echo "🌐 Open your browser to: http://localhost:3001"
    echo ""
    echo "To stop services: Press Ctrl+C in each Terminal window"

elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "🚀 Starting services in new terminal tabs..."

    # Try gnome-terminal first
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="Backend" -- bash -c "cd '$PROJECT_DIR' && ./start_backend.sh; exec bash"
        gnome-terminal --tab --title="Frontend" -- bash -c "cd '$PROJECT_DIR' && ./start_frontend.sh; exec bash"
    # Try xterm
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$PROJECT_DIR' && ./start_backend.sh" &
        xterm -e "cd '$PROJECT_DIR' && ./start_frontend.sh" &
    else
        echo "⚠️  Could not detect terminal emulator"
        echo "Please run these commands manually in separate terminals:"
        echo ""
        echo "Terminal 1: ./start_backend.sh"
        echo "Terminal 2: ./start_frontend.sh"
        exit 1
    fi

    echo "✅ Services started!"
    echo ""
    echo "🌐 Open your browser to: http://localhost:3001"

else
    # Other OS (Windows/WSL)
    echo "⚠️  Automatic terminal launching not supported on this OS"
    echo "Please run these commands manually in separate terminals:"
    echo ""
    echo "Terminal 1: ./start_backend.sh"
    echo "Terminal 2: ./start_frontend.sh"
    exit 1
fi
