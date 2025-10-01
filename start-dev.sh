#!/bin/bash

# Start the backend server
echo "🚀 Starting backend server..."
cd backend
npm install
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start the frontend
echo "🎨 Starting frontend..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are running!"
echo "📊 Backend API: http://localhost:3001"
echo "🎨 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
