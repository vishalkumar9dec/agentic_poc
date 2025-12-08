#!/bin/bash

# Start AG-UI Backend Server for Ticket Management System
# This script starts the PydanticAI agent server on port 8001

echo "=========================================="
echo "  Starting AG-UI Backend Server"
echo "=========================================="
echo ""

# Navigate to project root
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Error: Virtual environment not found!"
    echo "Please run: python -m venv venv"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env with OPENAI_API_KEY"
    exit 1
fi

# Activate virtual environment
echo "✓ Activating virtual environment..."
source venv/bin/activate

# Check if OpenAI API key is set
if ! grep -q "OPENAI_API_KEY" .env; then
    echo "❌ Error: OPENAI_API_KEY not found in .env"
    exit 1
fi

echo "✓ Environment configured"
echo ""

# Navigate to app directory
cd app

# Set PYTHONPATH
export PYTHONPATH="$(pwd)"

echo "🚀 Starting AG-UI server on port 8001..."
echo "   Press Ctrl+C to stop"
echo ""

# Start the server
python agents/tickets/ag_ui_server.py
