#!/bin/bash

# Start servers for e2e testing
set -e

echo "🚀 Starting servers for e2e testing..."

# Kill any existing servers
pkill -f "start:dev backend" || true
pkill -f "serve frontend" || true

# Wait a moment for processes to clean up
sleep 2

# Start backend on port 3001
echo "📡 Starting backend on port 3001..."
cd ..
PORT=3001 pnpm nx start:dev backend &
BACKEND_PID=$!

# Start frontend on port 4201 with e2e config
echo "🌐 Starting frontend on port 4201..."
BACKEND_PORT=3001 pnpm nx serve frontend --configuration=e2e &
FRONTEND_PID=$!

# Wait for servers to be ready
echo "⏳ Waiting for servers to start..."

# Function to check if a server is ready
check_server() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo "✅ $name is ready"
            return 0
        fi
        echo "⏳ Waiting for $name... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ $name failed to start"
    return 1
}

# Check backend
if ! check_server "http://localhost:3001/health" "Backend"; then
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

# Check frontend
if ! check_server "http://localhost:4201" "Frontend"; then
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

echo "🎉 Both servers are ready!"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:4201"

# Keep script running
wait 
