#!/bin/bash

# Start Next.js Frontend for Ticket Management System
# This script starts the CopilotKit frontend on port 3001

echo "=========================================="
echo "  Starting Next.js Frontend"
echo "=========================================="
echo ""

# Navigate to project root
cd "$(dirname "$0")"

# Check if frontend directory exists
if [ ! -d "ticket-frontend" ]; then
    echo "❌ Error: ticket-frontend directory not found!"
    echo "Please run the setup first"
    exit 1
fi

# Navigate to frontend directory
cd ticket-frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✓ Dependencies ready"
echo ""
echo "🚀 Starting Next.js dev server..."
echo "   Frontend will be available at: http://localhost:3001"
echo "   Press Ctrl+C to stop"
echo ""

# Start the dev server
npm run dev
