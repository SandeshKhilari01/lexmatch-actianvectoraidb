#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "Shutting down servers..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT SIGTERM

echo "Starting LexMatch Backend..."
uvicorn backend.main:app --reload --port 8000 &

echo "Starting LexMatch Frontend..."
cd frontend && npm run dev &

# Keep script running
wait
