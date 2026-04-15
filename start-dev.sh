#!/bin/sh
set -e

echo "Starting services in development mode..."

# Start API with tsx watch (hot-reload)
echo "Starting API with hot-reload on port 3000..."
pnpm --filter @whatsapp-crm/api dev &
API_PID=$!

# Start Web with Vite dev server (hot-reload) - bind to 0.0.0.0
echo "Starting Web dev server on port 5173..."
pnpm --filter @whatsapp-crm/web dev -- --host 0.0.0.0 &
WEB_PID=$!

echo "Both services started in development mode"
echo "API: http://localhost:3000 (hot-reload enabled)"
echo "Web: http://localhost:5173 (hot-reload enabled)"
echo "API PID: $API_PID, Web PID: $WEB_PID"

# Wait for both processes
wait $API_PID $WEB_PID
