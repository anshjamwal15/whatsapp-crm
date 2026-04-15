#!/bin/sh
set -e

echo "Starting API on port 3000..."
node apps/api/dist/index.js &
API_PID=$!

echo "Starting Web server on port 8080..."
cd apps/web && npx http-server dist -p 8080 -a 0.0.0.0 &
WEB_PID=$!

echo "Both services started. API PID: $API_PID, Web PID: $WEB_PID"

# Wait for both processes
wait $API_PID $WEB_PID
